(() => {
  const importTools = globalThis.PersonaLibraryJobTrackerImport;
  const storeTools = globalThis.PersonaLibraryJobTrackerStore;
  const config = globalThis.PersonaLibraryJobTrackerConfig || { mode: 'local', schema: 'app' };
  if (!importTools) throw new Error('Applications tracker import module is missing');
  if (!storeTools) throw new Error('Applications tracker storage module is missing');

  const { FORMAT, VERSION: FORMAT_VERSION, STATUSES } = importTools;
  const MIGRATION_MARKER_KEY = 'persona-library.job-applications.supabase-migrated.v1';
  const $ = selector => document.querySelector(selector);
  const rows = $('#application-rows');
  const empty = $('#empty-state');
  const summary = $('#summary');
  const search = $('#search');
  const filter = $('#status-filter');
  const dialog = $('#editor');
  const form = $('#application-form');
  const importFile = $('#import-file');
  const importDialog = $('#import-review');
  const importTitle = $('#import-review-title');
  const importSummary = $('#import-summary-text');
  const importConflicts = $('#import-conflicts');
  const mergeImportButton = $('#merge-import-button');
  const replaceAllButton = $('#replace-all-button');
  const storageModeTitle = $('#storage-mode-title');
  const storageModeCopy = $('#storage-mode-copy');
  const storageState = $('#storage-state');
  const authForm = $('#auth-form');
  const authEmail = $('#auth-email');
  const authPassword = $('#auth-password');
  const signOutButton = $('#sign-out-button');
  const migrateLocalButton = $('#migrate-local-button');
  const addButton = $('#add-button');
  const importButton = $('#import-button');
  const exportButton = $('#export-button');
  const fields = {
    id: $('#record-id'), company: $('#company'), role: $('#role'), status: $('#status'),
    location: $('#location'), compensation: $('#compensation'), foundDate: $('#found-date'),
    appliedDate: $('#applied-date'), nextAction: $('#next-action'), sourceUrl: $('#source-url'),
    packetUrl: $('#packet-url'), notes: $('#notes')
  };

  let records = [];
  let pendingImport = null;
  let store = null;
  let localStore = null;
  let canWrite = false;
  let authSubscription = null;

  function uid() {
    return globalThis.crypto?.randomUUID?.() || 'job-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function today() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value + 'T00:00:00');
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }

  function text(tag, value, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value || '';
    return node;
  }

  function link(url, label) {
    const href = importTools.safeUrl(url);
    if (!href) return null;
    const a = document.createElement('a');
    a.href = href; a.target = '_blank'; a.rel = 'noreferrer'; a.textContent = label;
    return a;
  }

  function setStorageMessage(title, copy, state) {
    storageModeTitle.textContent = title;
    storageModeCopy.textContent = copy;
    storageState.textContent = state;
  }

  function setWriteState(enabled) {
    canWrite = enabled;
    addButton.disabled = !enabled;
    importButton.disabled = !enabled;
  }

  function matches(record) {
    const term = search.value.trim().toLowerCase();
    const statusOk = filter.value === 'all' || record.status === filter.value;
    if (!statusOk) return false;
    if (!term) return true;
    return [record.company, record.role, record.location, record.compensation, record.nextAction, record.notes]
      .join(' ').toLowerCase().includes(term);
  }

  function renderSummary() {
    const counts = Object.fromEntries(STATUSES.map(status => [status, records.filter(record => record.status === status).length]));
    summary.replaceChildren();
    const total = text('span', '', 'stat');
    total.append(text('strong', records.length)); total.append(' total'); summary.append(total);
    for (const status of ['Found', 'Packet Ready', 'Applied', 'Interviewing', 'Offer']) {
      if (!counts[status]) continue;
      const stat = text('span', '', 'stat');
      stat.append(text('strong', counts[status])); stat.append(' ' + status.toLowerCase()); summary.append(stat);
    }
  }

  function render() {
    rows.replaceChildren();
    const visible = records.filter(matches).sort((left, right) => String(right.updatedAt || right.foundDate || '').localeCompare(String(left.updatedAt || left.foundDate || '')));
    empty.hidden = visible.length > 0;
    for (const record of visible) {
      const tr = document.createElement('tr');
      const opportunity = document.createElement('td');
      opportunity.append(text('div', record.company, 'company'), text('div', record.role, 'role'), text('div', record.location, 'meta'));
      const statusTd = document.createElement('td');
      const badge = text('span', record.status || 'Found', 'status'); badge.dataset.status = record.status || 'Found'; statusTd.append(badge);
      const dates = document.createElement('td');
      dates.append(text('div', 'Found: ' + formatDate(record.foundDate), 'meta'));
      dates.append(text('div', 'Applied: ' + formatDate(record.appliedDate), 'meta'));
      const comp = document.createElement('td'); comp.append(text('div', record.compensation || '—', 'meta'));
      const next = document.createElement('td'); next.append(text('div', record.nextAction || '—', 'meta'));
      const links = document.createElement('td'); const linkWrap = text('div', '', 'links');
      const posting = link(record.sourceUrl, 'Posting'); const packet = link(record.packetUrl, 'Packet');
      if (posting) linkWrap.append(posting);
      if (packet) linkWrap.append(packet);
      if (!posting && !packet) linkWrap.textContent = '—';
      links.append(linkWrap);
      const actions = document.createElement('td'); const actionWrap = text('div', '', 'row-actions');
      const edit = text('button', 'Edit', 'btn small'); edit.type = 'button'; edit.disabled = !canWrite; edit.addEventListener('click', () => openEditor(record.id));
      actionWrap.append(edit); actions.append(actionWrap);
      tr.append(opportunity, statusTd, dates, comp, next, links, actions); rows.append(tr);
    }
    renderSummary();
    exportButton.disabled = records.length === 0;
  }

  function populateSelects() {
    for (const target of [filter, fields.status]) {
      const first = target === filter ? target.querySelector('option') : null;
      if (target === fields.status) target.replaceChildren();
      STATUSES.forEach(status => {
        const option = document.createElement('option'); option.value = status; option.textContent = status; target.append(option);
      });
      if (first && target.firstElementChild !== first) target.prepend(first);
    }
  }

  function resetForm() {
    form.reset(); fields.id.value = ''; fields.status.value = 'Found'; fields.foundDate.value = today();
    $('#delete-button').hidden = true; $('#editor-title').textContent = 'Add opportunity';
  }

  function openEditor(id) {
    if (!canWrite) return;
    resetForm();
    const record = records.find(candidate => candidate.id === id);
    if (record) {
      $('#editor-title').textContent = 'Edit opportunity'; $('#delete-button').hidden = false;
      for (const [key, input] of Object.entries(fields)) input.value = record[key] || '';
    }
    dialog.showModal();
  }

  function closeEditor() {
    dialog.close();
  }

  function readForm() {
    return {
      id: fields.id.value || uid(),
      company: fields.company.value.trim(), role: fields.role.value.trim(), status: fields.status.value,
      location: fields.location.value.trim(), compensation: fields.compensation.value.trim(),
      foundDate: fields.foundDate.value, appliedDate: fields.appliedDate.value,
      nextAction: fields.nextAction.value.trim(), sourceUrl: fields.sourceUrl.value.trim(),
      packetUrl: fields.packetUrl.value.trim(), notes: fields.notes.value.trim(),
      updatedAt: new Date().toISOString()
    };
  }

  function closeImportReview() {
    pendingImport = null;
    importDialog.close();
  }

  function renderImportReview(preview, source = 'file') {
    importTitle.textContent = source === 'local-migration' ? 'Review local tracker migration' : 'Review tracker import';
    importSummary.textContent = [
      preview.added + ' new opportunities',
      preview.updated + ' existing opportunities updated',
      preview.unchanged + ' unchanged',
      preview.conflicts.length + ' conflicts requiring review'
    ].join('\n');
    importConflicts.replaceChildren();
    importConflicts.hidden = preview.conflicts.length === 0;
    for (const conflict of preview.conflicts) {
      const item = document.createElement('li');
      item.textContent = conflict.reason;
      importConflicts.append(item);
    }
    mergeImportButton.disabled = preview.added === 0 && preview.updated === 0;
    replaceAllButton.hidden = source === 'local-migration';
  }

  async function reloadFromStore() {
    records = await store.load();
    render();
  }

  async function commitMerge() {
    if (!pendingImport) return;
    try {
      const source = pendingImport.source;
      records = await store.saveAll(pendingImport.preview.records);
      if (source === 'local-migration') {
        localStorage.setItem(MIGRATION_MARKER_KEY, new Date().toISOString());
        migrateLocalButton.hidden = true;
      }
      closeImportReview();
      render();
    } catch (error) {
      alert('Could not save tracker changes: ' + error.message);
    }
  }

  async function commitReplaceAll() {
    if (!pendingImport || !confirm('Replace all current tracker records with this import? This is intended for backup restoration and removes records not present in the file.')) return;
    try {
      const replacement = importTools.replaceAll(pendingImport.preview.incoming, { createId: uid });
      records = await store.replaceAll(replacement);
      closeImportReview();
      render();
    } catch (error) {
      alert('Could not replace tracker data: ' + error.message);
    }
  }

  async function refreshMigrationControl() {
    if (!store?.isRemote || !canWrite || localStorage.getItem(MIGRATION_MARKER_KEY)) {
      migrateLocalButton.hidden = true;
      return;
    }
    const localRecords = await localStore.load();
    migrateLocalButton.hidden = localRecords.length === 0;
    if (localRecords.length) migrateLocalButton.textContent = 'Migrate local data (' + localRecords.length + ')';
  }

  async function refreshRemoteSession() {
    try {
      const session = await store.getSession();
      if (!session) {
        records = [];
        setWriteState(false);
        authForm.hidden = false;
        signOutButton.hidden = true;
        migrateLocalButton.hidden = true;
        setStorageMessage(
          'Private Supabase storage',
          'Sign in to access the private opportunity database. Browser-local records are kept untouched until you explicitly migrate them.',
          'Remote mode · signed out'
        );
        render();
        return;
      }
      setWriteState(true);
      authForm.hidden = true;
      signOutButton.hidden = false;
      signOutButton.textContent = 'Sign out ' + (session.user?.email || '');
      records = await store.load();
      setStorageMessage(
        'Private synced data',
        'Opportunity records are stored in authenticated Supabase storage and are not committed to Persona Library. JSON export remains available for portability and recovery.',
        'Remote mode · signed in'
      );
      await refreshMigrationControl();
      render();
    } catch (error) {
      records = [];
      setWriteState(false);
      authForm.hidden = false;
      signOutButton.hidden = true;
      migrateLocalButton.hidden = true;
      setStorageMessage(
        'Remote storage unavailable',
        'Supabase mode is configured, but the private opportunity store could not be loaded. Local writes are not used as a silent fallback.',
        'Remote error · ' + error.message
      );
      render();
    }
  }

  async function initializeStore() {
    localStore = storeTools.createLocalStorageOpportunityStore({
      normalizeRecord: importTools.normalizeRecord,
      canonicalizeSourceUrl: importTools.canonicalizeSourceUrl,
      createId: uid
    });

    try {
      store = storeTools.createOpportunityStore({
        config,
        normalizeRecord: importTools.normalizeRecord,
        canonicalizeSourceUrl: importTools.canonicalizeSourceUrl,
        createId: uid
      });
    } catch (error) {
      setWriteState(false);
      setStorageMessage(
        'Storage configuration error',
        'The configured opportunity store could not be initialized. No fallback write has been performed.',
        error.message
      );
      render();
      return;
    }

    if (store.isRemote) {
      await refreshRemoteSession();
      authSubscription = store.onAuthStateChange(() => {
        refreshRemoteSession();
      });
    } else {
      setWriteState(true);
      authForm.hidden = true;
      signOutButton.hidden = true;
      migrateLocalButton.hidden = true;
      records = await store.load();
      setStorageMessage(
        'Local fallback mode',
        'Opportunity records are stored only in this browser. This mode remains available for migration and offline fallback until authenticated Supabase storage is configured.',
        'Local mode'
      );
      render();
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!canWrite) return;
    const record = importTools.normalizeRecord(readForm(), uid);
    try {
      await store.upsert(record);
      await reloadFromStore();
      closeEditor();
    } catch (error) {
      alert('Could not save opportunity: ' + error.message);
    }
  });

  $('#delete-button').addEventListener('click', async () => {
    const id = fields.id.value;
    if (!canWrite || !id || !confirm('Delete this application record?')) return;
    try {
      await store.remove(id);
      await reloadFromStore();
      closeEditor();
    } catch (error) {
      alert('Could not delete opportunity: ' + error.message);
    }
  });

  addButton.addEventListener('click', () => { if (canWrite) { resetForm(); dialog.showModal(); } });
  $('#close-editor').addEventListener('click', closeEditor);
  $('#cancel-button').addEventListener('click', closeEditor);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeEditor(); });
  $('#cancel-import').addEventListener('click', closeImportReview);
  $('#cancel-import-secondary').addEventListener('click', closeImportReview);
  mergeImportButton.addEventListener('click', commitMerge);
  replaceAllButton.addEventListener('click', commitReplaceAll);
  importDialog.addEventListener('click', event => { if (event.target === importDialog) closeImportReview(); });
  search.addEventListener('input', render);
  filter.addEventListener('change', render);

  exportButton.addEventListener('click', () => {
    const payload = { format: FORMAT, version: FORMAT_VERSION, exportedAt: new Date().toISOString(), records };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'job-applications-' + today() + '.json'; a.click(); URL.revokeObjectURL(url);
  });

  importButton.addEventListener('click', () => { if (canWrite) importFile.click(); });
  importFile.addEventListener('change', async () => {
    const file = importFile.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const incoming = importTools.parseImport(parsed);
      const current = await store.load();
      const preview = importTools.previewMerge(current, incoming, { createId: uid });
      pendingImport = { preview, incoming, source: 'file' };
      renderImportReview(preview, 'file');
      importDialog.showModal();
    } catch (error) {
      alert('Could not import tracker: ' + error.message);
    } finally {
      importFile.value = '';
    }
  });

  authForm.addEventListener('submit', async event => {
    event.preventDefault();
    const email = authEmail.value.trim();
    const password = authPassword.value;
    if (!email || !password || !store?.isRemote) return;
    storageState.textContent = 'Signing in…';
    try {
      await store.signInWithPassword(email, password);
      authPassword.value = '';
      await refreshRemoteSession();
    } catch (error) {
      authPassword.value = '';
      storageState.textContent = 'Could not sign in · ' + error.message;
    }
  });

  signOutButton.addEventListener('click', async () => {
    try {
      await store.signOut();
      await refreshRemoteSession();
    } catch (error) {
      storageState.textContent = 'Could not sign out · ' + error.message;
    }
  });

  migrateLocalButton.addEventListener('click', async () => {
    if (!store?.isRemote || !canWrite) return;
    try {
      const localRecords = await localStore.load();
      const remoteRecords = await store.load();
      const preview = importTools.previewMerge(remoteRecords, localRecords, { createId: uid });
      pendingImport = { preview, incoming: localRecords, source: 'local-migration' };
      renderImportReview(preview, 'local-migration');
      importDialog.showModal();
    } catch (error) {
      alert('Could not prepare local migration: ' + error.message);
    }
  });

  window.addEventListener('beforeunload', () => authSubscription?.unsubscribe?.());

  populateSelects();
  initializeStore();
})();
