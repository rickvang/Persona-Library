(() => {
  const LOCAL_STORAGE_KEY = 'persona-library.job-applications.v1';

  function assertTools({ normalizeRecord, canonicalizeSourceUrl, createId }) {
    if (typeof normalizeRecord !== 'function' || typeof canonicalizeSourceUrl !== 'function' || typeof createId !== 'function') {
      throw new Error('Opportunity store requires tracker normalization and identity helpers');
    }
  }

  function toRow(record, userId, canonicalizeSourceUrl) {
    return {
      user_id: userId,
      id: String(record.id),
      company: String(record.company || '').trim(),
      role: String(record.role || '').trim(),
      status: String(record.status || 'Found'),
      location: String(record.location || '').trim(),
      compensation: String(record.compensation || '').trim(),
      source_url: String(record.sourceUrl || '').trim() || null,
      normalized_source_url: canonicalizeSourceUrl(record.sourceUrl) || null,
      packet_url: String(record.packetUrl || '').trim() || null,
      posted_at: String(record.postingDate || '') || null,
      found_at: String(record.foundDate || '') || null,
      applied_at: String(record.appliedDate || '') || null,
      next_action: String(record.nextAction || '').trim(),
      notes: String(record.notes || '').trim(),
      updated_at: String(record.updatedAt || new Date().toISOString())
    };
  }

  function fromRow(row, normalizeRecord, createId) {
    return normalizeRecord({
      id: row.id,
      company: row.company,
      role: row.role,
      status: row.status,
      location: row.location,
      compensation: row.compensation,
      sourceUrl: row.source_url,
      packetUrl: row.packet_url,
      postingDate: row.posted_at,
      foundDate: row.found_at,
      appliedDate: row.applied_at,
      nextAction: row.next_action,
      notes: row.notes,
      updatedAt: row.updated_at
    }, createId);
  }

  function createLocalStorageOpportunityStore({ normalizeRecord, canonicalizeSourceUrl, createId, storageKey = LOCAL_STORAGE_KEY }) {
    assertTools({ normalizeRecord, canonicalizeSourceUrl, createId });

    function loadSync() {
      try {
        const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
        return Array.isArray(parsed) ? parsed.map(record => normalizeRecord(record, createId)) : [];
      } catch {
        return [];
      }
    }

    function write(records) {
      localStorage.setItem(storageKey, JSON.stringify(records.map(record => normalizeRecord(record, createId))));
    }

    return {
      kind: 'local',
      isRemote: false,
      async load() {
        return loadSync();
      },
      async upsert(record) {
        const next = normalizeRecord(record, createId);
        const records = loadSync();
        const index = records.findIndex(candidate => candidate.id === next.id);
        if (index >= 0) records[index] = { ...records[index], ...next };
        else records.push(next);
        write(records);
        return next;
      },
      async remove(id) {
        write(loadSync().filter(record => record.id !== id));
      },
      async saveAll(records) {
        write(records);
        return loadSync();
      },
      async replaceAll(records) {
        write(records);
        return loadSync();
      },
      async getSession() {
        return null;
      },
      onAuthStateChange() {
        return { unsubscribe() {} };
      },
      async signInWithPassword() {
        throw new Error('Password sign-in is unavailable in local storage mode');
      },
      async signOut() {}
    };
  }

  function createSupabaseOpportunityStore({ client, normalizeRecord, canonicalizeSourceUrl, createId, schema = 'app' }) {
    assertTools({ normalizeRecord, canonicalizeSourceUrl, createId });
    if (!client) throw new Error('Supabase client is required for remote opportunity storage');

    const table = () => client.schema(schema).from('opportunities');

    async function currentUser() {
      const { data, error } = await client.auth.getUser();
      if (error) throw error;
      if (!data?.user) throw new Error('Sign in before accessing private opportunity data');
      return data.user;
    }

    async function load() {
      const user = await currentUser();
      const { data, error } = await table()
        .select('id,company,role,status,location,compensation,source_url,packet_url,posted_at,found_at,applied_at,next_action,notes,updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(row => fromRow(row, normalizeRecord, createId));
    }

    async function upsertRows(records) {
      const user = await currentUser();
      const rows = records.map(record => toRow(normalizeRecord(record, createId), user.id, canonicalizeSourceUrl));
      if (!rows.length) return [];
      const { data, error } = await table()
        .upsert(rows, { onConflict: 'user_id,id' })
        .select('id,company,role,status,location,compensation,source_url,packet_url,posted_at,found_at,applied_at,next_action,notes,updated_at');
      if (error) throw error;
      return (data || []).map(row => fromRow(row, normalizeRecord, createId));
    }

    return {
      kind: 'supabase',
      isRemote: true,
      async load() {
        return load();
      },
      async upsert(record) {
        const saved = await upsertRows([record]);
        return saved[0] || normalizeRecord(record, createId);
      },
      async remove(id) {
        const user = await currentUser();
        const { error } = await table().delete().eq('user_id', user.id).eq('id', id);
        if (error) throw error;
      },
      async saveAll(records) {
        await upsertRows(records);
        return load();
      },
      async replaceAll(records) {
        const user = await currentUser();
        const normalized = records.map(record => normalizeRecord(record, createId));
        await upsertRows(normalized);
        const incomingIds = new Set(normalized.map(record => record.id));
        const { data: currentRows, error: selectError } = await table().select('id').eq('user_id', user.id);
        if (selectError) throw selectError;
        const staleIds = (currentRows || []).map(row => row.id).filter(id => !incomingIds.has(id));
        if (staleIds.length) {
          const { error: deleteError } = await table().delete().eq('user_id', user.id).in('id', staleIds);
          if (deleteError) throw deleteError;
        }
        if (!normalized.length) {
          const { error: deleteAllError } = await table().delete().eq('user_id', user.id);
          if (deleteAllError) throw deleteAllError;
        }
        return load();
      },
      async getSession() {
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        return data?.session || null;
      },
      onAuthStateChange(callback) {
        const { data } = client.auth.onAuthStateChange((_event, session) => callback(session));
        return data?.subscription || { unsubscribe() {} };
      },
      async signInWithPassword(email, password) {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      async signOut() {
        const { error } = await client.auth.signOut();
        if (error) throw error;
      }
    };
  }

  function createOpportunityStore({ config = {}, normalizeRecord, canonicalizeSourceUrl, createId }) {
    assertTools({ normalizeRecord, canonicalizeSourceUrl, createId });
    if (config.mode !== 'supabase') {
      return createLocalStorageOpportunityStore({ normalizeRecord, canonicalizeSourceUrl, createId });
    }
    if (!config.supabaseUrl || !config.publishableKey) {
      throw new Error('Supabase mode is configured without a project URL and publishable key');
    }
    if (!globalThis.supabase?.createClient) {
      throw new Error('Supabase browser client is unavailable');
    }
    const client = globalThis.supabase.createClient(config.supabaseUrl, config.publishableKey, {
      db: { schema: config.schema || 'app' },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    return createSupabaseOpportunityStore({
      client,
      normalizeRecord,
      canonicalizeSourceUrl,
      createId,
      schema: config.schema || 'app'
    });
  }

  globalThis.PersonaLibraryJobTrackerStore = Object.freeze({
    LOCAL_STORAGE_KEY,
    createLocalStorageOpportunityStore,
    createSupabaseOpportunityStore,
    createOpportunityStore
  });
})();
