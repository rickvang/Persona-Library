(() => {
  const TRACKING_PARAMS = new Set([
    'fbclid', 'gclid', 'mc_cid', 'mc_eid',
    'source', 'src', 'ref', 'referrer', 'referral',
    'lever-source', 'jobsite', 'job_site', 'gh_src', 'trk', 'tracking'
  ]);

  function normalizeText(value) {
    return String(value || '').normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function canonicalizeSourceUrl(value) {
    if (!value) return '';
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol)) return '';
      parsed.hash = '';
      parsed.hostname = parsed.hostname.toLowerCase();
      parsed.protocol = parsed.protocol.toLowerCase();
      if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
      parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/';
      const kept = [...parsed.searchParams]
        .filter(([key]) => !/^utm_/i.test(key) && !TRACKING_PARAMS.has(key.toLowerCase()))
        .sort(([leftKey, leftValue], [rightKey, rightValue]) =>
          leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue));
      parsed.search = '';
      for (const [key, part] of kept) parsed.searchParams.append(key, part);
      return parsed.href;
    } catch {
      return '';
    }
  }

  function deriveIdentity(job = {}) {
    const provider = normalizeText(job.provider || job.source);
    const providerJobId = String(job.providerJobId || job.jobId || '').trim();
    const normalizedSourceUrl = canonicalizeSourceUrl(job.sourceUrl || job.url);

    if (provider && providerJobId) {
      return {
        stableKey: `provider:${provider}:${providerJobId}`,
        providerJobId,
        normalizedSourceUrl
      };
    }

    if (normalizedSourceUrl) {
      return {
        stableKey: `url:${normalizedSourceUrl}`,
        providerJobId: providerJobId || null,
        normalizedSourceUrl
      };
    }

    const company = normalizeText(job.company);
    const title = normalizeText(job.title || job.role);
    const location = normalizeText(job.location);
    if (!company || !title || !location) {
      throw new Error('Seen-job fallback identity requires company, title, and location when no stable provider ID or source URL is available');
    }

    return {
      stableKey: `fingerprint:${company}|${title}|${location}`,
      providerJobId: providerJobId || null,
      normalizedSourceUrl: null
    };
  }

  function createSupabaseSeenJobStore({ client, schema = 'app', getNow = () => new Date().toISOString() }) {
    if (!client) throw new Error('Supabase client is required for seen-job storage');
    const table = () => client.schema(schema).from('seen_jobs');

    async function currentUser() {
      const { data, error } = await client.auth.getUser();
      if (error) throw error;
      if (!data?.user) throw new Error('Sign in before accessing private seen-job data');
      return data.user;
    }

    async function filterUnseen(jobs = []) {
      const user = await currentUser();
      const candidates = jobs.map(job => ({ job, identity: deriveIdentity(job) }));
      const stableKeys = [...new Set(candidates.map(candidate => candidate.identity.stableKey))];
      if (!stableKeys.length) return { newJobs: [], seenJobs: [] };

      const { data, error } = await table()
        .select('stable_key')
        .eq('user_id', user.id)
        .in('stable_key', stableKeys);
      if (error) throw error;

      const seenKeys = new Set((data || []).map(row => row.stable_key));
      return {
        newJobs: candidates.filter(candidate => !seenKeys.has(candidate.identity.stableKey)).map(candidate => candidate.job),
        seenJobs: candidates.filter(candidate => seenKeys.has(candidate.identity.stableKey)).map(candidate => candidate.job)
      };
    }

    async function recordPresented(jobs = []) {
      const user = await currentUser();
      const firstShownAt = getNow();
      const rows = jobs.map(job => {
        const identity = deriveIdentity(job);
        return {
          user_id: user.id,
          stable_key: identity.stableKey,
          provider_job_id: identity.providerJobId,
          source_url: String(job.sourceUrl || job.url || '').trim() || null,
          normalized_source_url: identity.normalizedSourceUrl,
          company: String(job.company || '').trim(),
          title: String(job.title || job.role || '').trim(),
          location: String(job.location || '').trim() || null,
          first_shown_at: firstShownAt
        };
      });
      if (!rows.length) return [];

      const { data, error } = await table()
        .upsert(rows, { onConflict: 'user_id,stable_key', ignoreDuplicates: true })
        .select('stable_key,first_shown_at');
      if (error) throw error;
      return data || [];
    }

    return Object.freeze({
      kind: 'supabase',
      isRemote: true,
      filterUnseen,
      recordPresented
    });
  }

  function createSeenJobStore({ config = {} } = {}) {
    if (config.mode !== 'supabase') {
      throw new Error('Seen-job deduplication requires the authenticated Supabase private store');
    }
    if (!config.supabaseUrl || !config.publishableKey) {
      throw new Error('Supabase seen-job storage requires a project URL and publishable key');
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
    return createSupabaseSeenJobStore({ client, schema: config.schema || 'app' });
  }

  globalThis.PersonaLibrarySeenJobStore = Object.freeze({
    canonicalizeSourceUrl,
    deriveIdentity,
    createSupabaseSeenJobStore,
    createSeenJobStore
  });
})();
