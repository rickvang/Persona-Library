(() => {
  const STORAGE_KEY = 'persona-library.job-applications.v1';
  const FORMAT_VERSION = 1;
  const STATUSES = ['Found','Reviewing','Packet Ready','Applied','Interviewing','Offer','Closed'];
  const $ = selector => document.querySelector(selector);
  const rows = $('#application-rows');
  const empty = $('#empty-state');
  const summary = $('#summary');
  const search = $('#search');
  const filter = $('#status-filter');
  const dialog = $('#editor');
  const form = $('#application-form');
  const importFile = $('#import-file');
  const handoffStatus = $('#handoff-status');
  const fields = {
    id: $('#record-id'), company: $('#company'), role: $('#role'), status: $('#status'),
    location: $('#location'), compensation: $('#compensation'), foundDate: $('#found-date'),
    appliedDate: $('#applied-date'), nextAction: $('#next-action'), sourceUrl: $('#source-url'),
    packetUrl: $('#packet-url'), notes: $('#notes')
  };
  let records = load();

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
  function uid() { return globalThis.crypto?.randomUUID?.() || `job-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  function today() { const now = new Date(); const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000); return local.toISOString().slice(0,10); }
  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(date);
  }
  function text(tag, value, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value || '';
    return node;
  }
  function safeUrl(value) {
    if (!value) return '';
    try {
      const parsed = new URL(value);
      return ['http:','https:'].includes(parsed.protocol) ? parsed.href : '';
    } catch { return ''; }
  }
  function link(url, label) {
    const href = safeUrl(url);
    if (!href) return null;
    const a = document.createElement('a');
    a.href = href; a.target = '_blank'; a.rel = 'noreferrer'; a.textContent = label;
    return a;
  }
  function normalizeRecord(record = {}) {
    return {
      id: String(record.id || uid()),
      company: String(record.company || '').trim(),
      role: String(record.role || '').trim(),
      status: STATUSES.includes(record.status) ? record.status : 'Found',
      location: String(record.location || '').trim(),
      compensation: String(record.compensation || '').trim(),
      foundDate: String(record.foundDate || ''),
      appliedDate: String(record.appliedDate || ''),
      nextAction: String(record.nextAction || '').trim(),
      sourceUrl: safeUrl(record.sourceUrl),
      packetUrl: safeUrl(record.packetUrl),
      notes: String(record.notes || '').trim(),
      updatedAt: String(record.updatedAt || new Date().toISOString())
    };
  }
  function canonicalPostingUrl(value) {
    const href = safeUrl(value);
    if (!href) return '';
    const parsed = new URL(href);
    parsed.hash = '';
    for (const key of [...parsed.searchParams.keys()]) {
      if (/^(utm_|iis$|iisn$|source$|src$|ref$)/i.test(key)) parsed.searchParams.delete(key);
    }
    return parsed.toString().replace(/\/$/, '');
  }
  function recordIdentity(record = {}) {
    const canonicalUrl = canonicalPostingUrl(record.sourceUrl);
    if (canonicalUrl) return `url:${canonicalUrl.toLowerCase()}`;
    const normalize = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return `role:${normalize(record.company)}|${normalize(record.role)}|${normalize(record.location)}`;
  }
  function decodeBase64Url(value) {
    const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    const bytes = Uint8Array.from(atob(padded), character => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  function sanitizeHandoffRecord(record = {}) {
    const cleaned = {};
    const stringFields = ['company','role','location','compensation','foundDate','appliedDate','nextAction','notes'];
    for (const key of stringFields) if (Object.prototype.hasOwnProperty.call(record, key)) cleaned[key] = String(record[key] || '').trim();
    if (Object.prototype.hasOwnProperty.call(record, 'status')) cleaned.status = STATUSES.includes(record.status) ? record.status : 'Found';
    if (Object.prototype.hasOwnProperty.call(record, 'sourceUrl')) cleaned.sourceUrl = safeUrl(record.sourceUrl);
    if (Object.prototype.hasOwnProperty.call(record, 'packetUrl')) cleaned.packetUrl = safeUrl(record.packetUrl);
    return cleaned;
  }
  function showHandoffStatus(message, tone = 'success') {
    if (!handoffStatus) return;
    handoffStatus.textContent = message;
    handoffStatus.dataset.tone = tone;
    handoffStatus.hidden = false;
  }
  function clearHandoffFragment() {
    if (!window.location.hash) return;
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  function consumeHandoff() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const encoded = params.get('handoff');
    if (!encoded) return;
    try {
      const payload = JSON.parse(decodeBase64Url(encoded));
      if (payload?.format !== 'persona-library-job-application-handoff') throw new Error('Unsupported tracker handoff format');
      if (Number(payload?.version) !== 1) throw new Error('Unsupported tracker handoff version');
      if (payload?.operation !== 'upsert') throw new Error('Unsupported tracker handoff operation');
      const incoming = sanitizeHandoffRecord(payload.record);
      if (!incoming.company || !incoming.role) throw new Error('Tracker handoff is missing company or role');
      const identity = recordIdentity(incoming);
      const index = records.findIndex(record => recordIdentity(record) === identity);
      const existing = index >= 0 ? records[index] : null;
      const action = existing ? 'Update' : 'Add';
      if (!confirm(`${action} ${incoming.company} — ${incoming.role} in Applications?`)) {
        showHandoffStatus('Tracker handoff was not applied.', 'neutral');
        clearHandoffFragment();
        return;
      }
      const merged = normalizeRecord({...existing, ...incoming, id: existing?.id || uid(), updatedAt: new Date().toISOString()});
      if (index >= 0) records[index] = merged; else records.push(merged);
      save();
      render();
      showHandoffStatus(`Applications updated: ${merged.company} — ${merged.role} is ${merged.status}.`);
    } catch (error) {
      showHandoffStatus(`Could not apply tracker handoff: ${error.message}`, 'error');
    } finally {
      clearHandoffFragment();
    }
  }
  function matches(record) {
    const term = search.value.trim().toLowerCase();
    const statusOk = filter.value === 'all' || record.status === filter.value;
    if (!statusOk) return false;
    if (!term) return true;
    return [record.company,record.role,record.location,record.compensation,record.nextAction,record.notes]
      .join(' ').toLowerCase().includes(term);
  }
  function renderSummary() {
    const counts = Object.fromEntries(STATUSES.map(status => [status, records.filter(r => r.status === status).length]));
    summary.replaceChildren();
    const total = text('span', '', 'stat'); total.append(text('strong', records.length)); total.append(' total'); summary.append(total);
    for (const status of ['Found','Packet Ready','Applied','Interviewing','Offer']) {
      if (!counts[status]) continue;
      const stat = text('span', '', 'stat'); stat.append(text('strong', counts[status])); stat.append(` ${status.toLowerCase()}`); summary.append(stat);
    }
  }
  function render() {
    rows.replaceChildren();
    const visible = records.filter(matches).sort((a,b) => String(b.updatedAt || b.foundDate || '').localeCompare(String(a.updatedAt || a.foundDate || '')));
    empty.hidden = visible.length > 0;
    for (const record of visible) {
      const tr = document.createElement('tr');
      const opportunity = document.createElement('td');
      opportunity.append(text('div', record.company, 'company'), text('div', record.role, 'role'), text('div', record.location || '', 'meta'));
      const statusTd = document.createElement('td');
      const badge = text('span', record.status || 'Found', 'status'); badge.dataset.status = record.status || 'Found'; statusTd.append(badge);
      const dates = document.createElement('td');
      dates.append(text('div', `Found: ${formatDate(record.foundDate)}`, 'meta'));
      dates.append(text('div', `Applied: ${formatDate(record.appliedDate)}`, 'meta'));
      const comp = document.createElement('td'); comp.append(text('div', record.compensation || '—', 'meta'));
      const next = document.createElement('td'); next.append(text('div', record.nextAction || '—', 'meta'));
      const links = document.createElement('td'); const linkWrap = text('div','', 'links');
      const posting = link(record.sourceUrl,'Posting'); const packet = link(record.packetUrl,'Packet');
      if (posting) linkWrap.append(posting); if (packet) linkWrap.append(packet); if (!posting && !packet) linkWrap.textContent = '—'; links.append(linkWrap);
      const actions = document.createElement('td'); const actionWrap = text('div','', 'row-actions');
      const edit = text('button','Edit','btn small'); edit.type='button'; edit.addEventListener('click',()=>openEditor(record.id)); actionWrap.append(edit); actions.append(actionWrap);
      tr.append(opportunity,statusTd,dates,comp,next,links,actions); rows.append(tr);
    }
    renderSummary();
  }
  function populateSelects() {
    for (const target of [filter, fields.status]) {
      const first = target === filter ? target.querySelector('option') : null;
      if (target === fields.status) target.replaceChildren();
      STATUSES.forEach(status => { const option=document.createElement('option'); option.value=status; option.textContent=status; target.append(option); });
      if (first && target.firstElementChild !== first) target.prepend(first);
    }
  }
  function resetForm() {
    form.reset(); fields.id.value=''; fields.status.value='Found'; fields.foundDate.value=today(); $('#delete-button').hidden=true; $('#editor-title').textContent='Add opportunity';
  }
  function openEditor(id) {
    resetForm();
    const record = records.find(r => r.id === id);
    if (record) {
      $('#editor-title').textContent='Edit opportunity'; $('#delete-button').hidden=false;
      for (const [key,input] of Object.entries(fields)) input.value = record[key] || '';
    }
    dialog.showModal();
  }
  function closeEditor(){ dialog.close(); }
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
  form.addEventListener('submit', event => {
    event.preventDefault();
    const record = readForm();
    const index = records.findIndex(r => r.id === record.id);
    if (index >= 0) records[index] = {...records[index], ...record}; else records.push(record);
    save(); render(); closeEditor();
  });
  $('#delete-button').addEventListener('click', () => {
    const id = fields.id.value; if (!id) return;
    if (!confirm('Delete this application record?')) return;
    records = records.filter(r => r.id !== id); save(); render(); closeEditor();
  });
  $('#add-button').addEventListener('click', () => { resetForm(); dialog.showModal(); });
  $('#close-editor').addEventListener('click', closeEditor);
  $('#cancel-button').addEventListener('click', closeEditor);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeEditor(); });
  search.addEventListener('input', render); filter.addEventListener('change', render);
  $('#export-button').addEventListener('click', () => {
    const payload = {format:'persona-library-job-applications',version:FORMAT_VERSION,exportedAt:new Date().toISOString(),records};
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`job-applications-${today()}.json`; a.click(); URL.revokeObjectURL(url);
  });
  $('#import-button').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', async () => {
    const file = importFile.files?.[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed) && parsed?.format && parsed.format !== 'persona-library-job-applications') throw new Error('Unsupported tracker format');
      if (!Array.isArray(parsed) && Number(parsed?.version || 1) > FORMAT_VERSION) throw new Error('Tracker export is from a newer unsupported version');
      const incoming = Array.isArray(parsed) ? parsed : parsed?.records;
      if (!Array.isArray(incoming)) throw new Error('No records array found');
      if (!confirm(`Import ${incoming.length} records and replace the current local tracker?`)) return;
      records = incoming.map(normalizeRecord).filter(record => record.company && record.role); save(); render();
    } catch (error) { alert(`Could not import tracker: ${error.message}`); }
    finally { importFile.value=''; }
  });
  populateSelects(); render(); consumeHandoff();
})();
