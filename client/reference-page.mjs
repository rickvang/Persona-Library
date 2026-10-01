const toc = document.querySelector('[data-reader-toc]');
if (toc) toc.open = !matchMedia('(max-width:820px)').matches;

for (const root of document.querySelectorAll('[data-reference-catalog]')) {
  const search = root.querySelector('[data-reference-search]');
  const filters = [...root.querySelectorAll('[data-reference-filter]')];
  const items = [...root.querySelectorAll('[data-reference-item]')];
  const count = root.querySelector('[data-reference-count]');
  const empty = root.querySelector('[data-reference-empty]');
  const readState = () => {
    const params = new URLSearchParams(location.search);
    return {query:params.get('q') || '',category:filters.some(button => button.dataset.referenceFilter === params.get('category')) ? params.get('category') : 'all'};
  };
  let state = readState();
  function render(persist = false, clearFragment = false) {
    search.value = state.query;
    const query = state.query.trim().toLowerCase();
    for (const item of items) item.hidden = (state.category !== 'all' && item.dataset.category !== state.category) || !item.dataset.search.includes(query);
    for (const button of filters) button.setAttribute('aria-pressed',String(button.dataset.referenceFilter === state.category));
    const visible = items.filter(item => !item.hidden).length;
    count.textContent = visible + ' of ' + items.length + (root.closest('#reference-docs') ? ' reference documents' : ' Playbooks');
    empty.hidden = visible !== 0;
    if (persist) {
      const url = new URL(location.href);
      if (clearFragment && !root.closest('#reference-docs')) url.hash = '';
      state.query ? url.searchParams.set('q',state.query) : url.searchParams.delete('q');
      state.category === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category',state.category);
      history.replaceState(null,'',url);
    }
  }
  function openFragment() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const item = items.find(item => item.id === id || item.dataset.playbookId === id);
    if (!item) return;
    state = {query:'',category:'all'};
    render(true);
    const outline = item.querySelector('details');
    if (outline) outline.open = true;
    item.scrollIntoView({block:'start'});
  }
  search.addEventListener('input',() => { state.query = search.value; render(true,true); });
  for (const button of filters) button.addEventListener('click',() => { state.category = button.dataset.referenceFilter; render(true,true); });
  addEventListener('popstate',() => { state = readState(); render(); openFragment(); });
  addEventListener('hashchange',openFragment);
  render();
  openFragment();
}
