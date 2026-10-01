import {buildToolEntries, filterToolEntries, renderToolDetail} from './tool-catalog.mjs';

function revealLinkedRecipe() {
  let id;
  try {id = decodeURIComponent(location.hash.slice(1));} catch {return;}
  const target = id ? document.getElementById(id) : null;
  const recipe = target?.matches('details.recipe') ? target : target?.nextElementSibling;
  if (recipe?.matches('details.recipe')) {recipe.open = true;recipe.scrollIntoView();}
}

const catalog = document.querySelector('[data-tool-catalog]');
if (catalog) {
  const search = document.getElementById('tool-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-entry-kind]')];
  const entries = cards.map(card => ({id:card.id, kind:card.dataset.entryKind,
    name:card.querySelector('h3').textContent, summary:card.dataset.search, recipes:[]}));
  const params = new URLSearchParams(location.search);
  let kind = filters.some(button => button.dataset.filter === params.get('kind')) ? params.get('kind') : 'all';
  search.value = params.get('q') || '';
  const update = (writeUrl = true) => {
    const visible = new Set(filterToolEntries(entries, {kind,query:search.value}).map(entry => entry.id));
    for (const card of cards) card.hidden = !visible.has(card.id);
    for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === kind));
    document.getElementById('result-count').textContent = visible.size + (visible.size === 1 ? ' entry' : ' entries');
    document.getElementById('catalog-empty').hidden = visible.size !== 0;
    if (writeUrl) {
      const url = new URL(location.href);
      if (kind === 'all') url.searchParams.delete('kind'); else url.searchParams.set('kind',kind);
      if (search.value) url.searchParams.set('q',search.value); else url.searchParams.delete('q');
      history.replaceState(null,'',url);
    }
  };
  filters.forEach(button => button.addEventListener('click', () => {kind=button.dataset.filter;update();}));
  search.addEventListener('input', () => update());
  search.addEventListener('keydown', event => {if (event.key === 'Escape') {search.value='';update();}});
  update(false);
}

const detail = document.querySelector('[data-tool-detail]');
if (detail) {
  try {
    if (!globalThis.PersonaLibraryData) throw new Error('Tool data did not load');
    const entries = buildToolEntries(globalThis.PersonaLibraryData);
    const id = new URLSearchParams(location.search).get('id') ?? 'reference-figma';
    const entry = entries.find(item => item.id === id);
    if (!entry) {
      document.title = 'Tool not found - Personas';
      detail.innerHTML = '<h1>Tool not found</h1><p>This entry is not in the published catalog.</p><p><a href="tools.html">Back to Tools</a></p>';
    } else {
      detail.innerHTML = renderToolDetail(entry,globalThis.PersonaLibraryData);
      document.title = entry.name + ' - Tools - Personas';
    }
  } catch (error) {
    detail.innerHTML = '<h1>Tool data unavailable</h1><p>The published data could not be loaded.</p><p><a href="tools.html">Back to Tools</a></p>';
    console.error(error);
  }
}

if (catalog || detail) {
  revealLinkedRecipe();
  window.addEventListener('hashchange',revealLinkedRecipe);
}
