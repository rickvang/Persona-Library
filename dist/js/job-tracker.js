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
  function today() { return new Date().toISOString().slice(0,10); }
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
  function link(url, label) {
    if (!url) return null;
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noreferrer'; a.textContent = label;
    return a;
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
      const incoming = Array.isArray(parsed) ? parsed : parsed?.records;
      if (!Array.isArray(incoming)) throw new Error('No records array found');
      if (!confirm(`Import ${incoming.length} records and replace the current local tracker?`)) return;
      records = incoming.map(record => ({...record,id:record.id || uid()})); save(); render();
    } catch (error) { alert(`Could not import tracker: ${error.message}`); }
    finally { importFile.value=''; }
  });
  populateSelects(); render();
})();
