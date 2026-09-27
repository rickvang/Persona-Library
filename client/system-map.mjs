import {
  validateGraph,
  indexGraph,
  rootNodeIds,
  directNeighbors,
  visibleNodeIds,
  findPath,
  sourceUrl,
  nodeTypeLabel
} from './system-map-graph.mjs';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[character]));

const root = document.querySelector('[data-system-map]');
const graphUrl = root?.dataset.graphUrl;
const sourcePageUrl = root?.dataset.sourcePage;

const state = {
  graph: null,
  selectedId: null,
  expanded: new Set(),
  path: null,
  lens: 'work-coordination'
};

const elements = {
  status: document.getElementById('map-status'),
  explorer: document.getElementById('map-explorer'),
  nodeList: document.getElementById('map-nodes'),
  details: document.getElementById('map-details'),
  pathFrom: document.getElementById('path-from'),
  pathTo: document.getElementById('path-to'),
  pathResult: document.getElementById('path-result'),
  reset: document.getElementById('map-reset'),
  lens: document.getElementById('map-lens'),
  liveRegion: document.getElementById('map-live-region')
};

function announce(message) {
  elements.liveRegion.textContent = message;
}

function selectedNode() {
  return state.graph?.nodes.find(node => node.id === state.selectedId) || null;
}

function relationshipLabel(value) {
  return String(value || '').replaceAll('-', ' ');
}

function renderStatus() {
  if (!state.graph) return;
  elements.status.innerHTML = `
    <span class="status-dot" aria-hidden="true"></span>
    <strong>Live derived view</strong>
    <span>${escapeHtml(state.graph.nodes.length)} nodes · ${escapeHtml(state.graph.edges.length)} explicit relationships</span>
    <span class="coverage">Coverage: ${escapeHtml(state.graph.coverage)}</span>
  `;
}

function renderPathControls() {
  const options = state.graph.nodes
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(node => `<option value="${escapeHtml(node.id)}">${escapeHtml(node.label)}</option>`)
    .join('');
  elements.pathFrom.innerHTML = '<option value="">Start node</option>' + options;
  elements.pathTo.innerHTML = '<option value="">End node</option>' + options;
}

function edgeSummary(edge, direction) {
  const index = indexGraph(state.graph);
  const otherId = direction === 'outgoing' ? edge.to : edge.from;
  const other = index.nodes.get(otherId);
  const source = sourceUrl(edge.source);
  return `
    <li>
      <button class="relationship-link" type="button" data-select-node="${escapeHtml(other.id)}">
        <span>${escapeHtml(relationshipLabel(edge.relationship))}</span>
        <strong>${escapeHtml(other.label)}</strong>
      </button>
      <div class="provenance-line">
        <span>${escapeHtml(edge.source?.selector || 'Source')}</span>
        ${source ? `<a href="${escapeHtml(source)}" target="_blank" rel="noreferrer">Open source ↗</a>` : ''}
      </div>
    </li>
  `;
}

function renderDetails() {
  const node = selectedNode();
  if (!node) {
    elements.details.innerHTML = `
      <div class="empty-detail">
        <p class="eyebrow">Inspect a node</p>
        <h2>Select any visible concept</h2>
        <p>Details show explicit incoming and outgoing relationships plus their canonical provenance.</p>
      </div>
    `;
    return;
  }

  const index = indexGraph(state.graph);
  const incoming = index.incoming.get(node.id);
  const outgoing = index.outgoing.get(node.id);
  const ownership = outgoing.filter(edge => edge.relationship === 'owns' || edge.relationship.startsWith('owns-'));
  const nodeSource = sourceUrl(node.source);
  const expanded = state.expanded.has(node.id);

  elements.details.innerHTML = `
    <div class="detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(nodeTypeLabel(node.type))}</p>
        <h2>${escapeHtml(node.label)}</h2>
        <p class="node-id">${escapeHtml(node.id)}</p>
      </div>
      <button class="expand-button" type="button" data-toggle-expand="${escapeHtml(node.id)}" aria-expanded="${expanded}">
        ${expanded ? 'Collapse branch' : 'Expand one level'}
      </button>
    </div>

    <section class="detail-section">
      <h3>What this owns</h3>
      ${ownership.length
        ? `<ul class="relationship-list">${ownership.map(edge => edgeSummary(edge, 'outgoing')).join('')}</ul>`
        : '<p class="quiet">No explicit ownership relationship is represented in this lens.</p>'}
    </section>

    <section class="detail-section">
      <h3>Outgoing relationships</h3>
      ${outgoing.length
        ? `<ul class="relationship-list">${outgoing.map(edge => edgeSummary(edge, 'outgoing')).join('')}</ul>`
        : '<p class="quiet">No explicit outgoing relationships.</p>'}
    </section>

    <section class="detail-section">
      <h3>What explicitly depends on this</h3>
      ${incoming.length
        ? `<ul class="relationship-list">${incoming.map(edge => edgeSummary(edge, 'incoming')).join('')}</ul>`
        : '<p class="quiet">No explicit incoming relationships in this lens.</p>'}
      <p class="coverage-note">This is known-explicit coverage, not exhaustive impact analysis.</p>
    </section>

    <section class="detail-section source-detail">
      <h3>Provenance</h3>
      <dl>
        <dt>Derivation</dt><dd>${escapeHtml(node.derivation)}</dd>
        <dt>Source</dt><dd>${escapeHtml(node.source?.locator || 'Unavailable')}</dd>
        <dt>Selector</dt><dd>${escapeHtml(node.source?.selector || 'Unavailable')}</dd>
      </dl>
      ${nodeSource ? `<a class="source-link" href="${escapeHtml(nodeSource)}" target="_blank" rel="noreferrer">Open canonical source ↗</a>` : ''}
    </section>
  `;
}

function renderNodes() {
  const visible = visibleNodeIds(state.graph, state.expanded);
  if (state.path) state.path.nodes.forEach(id => visible.add(id));
  const roots = new Set(rootNodeIds(state.graph));
  const pathNodes = new Set(state.path?.nodes || []);
  const pathEdges = new Set(state.path?.edges || []);
  const index = indexGraph(state.graph);

  elements.nodeList.innerHTML = state.graph.nodes
    .filter(node => visible.has(node.id))
    .sort((a, b) => {
      const aRoot = roots.has(a.id) ? 0 : 1;
      const bRoot = roots.has(b.id) ? 0 : 1;
      return aRoot - bRoot || a.label.localeCompare(b.label);
    })
    .map(node => {
      const outgoing = index.outgoing.get(node.id);
      const incoming = index.incoming.get(node.id);
      const connectedPathEdges = [...outgoing, ...incoming].filter(edge => pathEdges.has(edge.id));
      const selected = state.selectedId === node.id;
      const expanded = state.expanded.has(node.id);
      return `
        <article class="map-node ${selected ? 'selected' : ''} ${pathNodes.has(node.id) ? 'in-path' : ''}" data-node-card="${escapeHtml(node.id)}">
          <button type="button" class="node-select" data-select-node="${escapeHtml(node.id)}" aria-pressed="${selected}">
            <span class="node-kicker">${escapeHtml(nodeTypeLabel(node.type))}</span>
            <strong>${escapeHtml(node.label)}</strong>
            <span class="node-meta">${incoming.length} in · ${outgoing.length} out</span>
          </button>
          <button type="button" class="branch-toggle" data-toggle-expand="${escapeHtml(node.id)}" aria-expanded="${expanded}">
            ${expanded ? 'Collapse' : 'Expand'}
          </button>
          ${connectedPathEdges.length ? '<span class="path-marker">On selected path</span>' : ''}
        </article>
      `;
    }).join('');
}

function renderPath() {
  if (!state.path) {
    elements.pathResult.innerHTML = '<p class="quiet">Choose two nodes to show the shortest explicit path between them.</p>';
    return;
  }
  const index = indexGraph(state.graph);
  const labels = state.path.nodes.map(id => index.nodes.get(id)?.label || id);
  elements.pathResult.innerHTML = `
    <p class="path-caption">Explicit path · ${state.path.edges.length} relationship${state.path.edges.length === 1 ? '' : 's'}</p>
    <ol class="path-list">${labels.map(label => `<li>${escapeHtml(label)}</li>`).join('')}</ol>
  `;
}

function render() {
  renderStatus();
  renderNodes();
  renderDetails();
  renderPath();
}

function selectNode(id) {
  state.selectedId = id;
  render();
  announce(`Selected ${selectedNode()?.label || id}.`);
}

function toggleExpanded(id) {
  if (state.expanded.has(id)) state.expanded.delete(id);
  else state.expanded.add(id);
  state.selectedId = id;
  render();
  announce(`${state.expanded.has(id) ? 'Expanded' : 'Collapsed'} ${selectedNode()?.label || id}.`);
}

function reset() {
  state.selectedId = null;
  state.expanded.clear();
  state.path = null;
  elements.pathFrom.value = '';
  elements.pathTo.value = '';
  render();
  announce('System Map reset to the simple overview.');
}

function findSelectedPath() {
  const from = elements.pathFrom.value;
  const to = elements.pathTo.value;
  if (!from || !to) {
    state.path = null;
    renderPath();
    announce('Choose both a start and end node.');
    return;
  }
  state.path = findPath(state.graph, from, to);
  render();
  announce(state.path ? 'Explicit path shown.' : 'No explicit path found in this lens.');
}

function bindEvents() {
  root.addEventListener('click', event => {
    const select = event.target.closest('[data-select-node]');
    if (select) {
      selectNode(select.dataset.selectNode);
      return;
    }
    const expand = event.target.closest('[data-toggle-expand]');
    if (expand) toggleExpanded(expand.dataset.toggleExpand);
  });
  elements.reset.addEventListener('click', reset);
  document.getElementById('find-path').addEventListener('click', findSelectedPath);
  elements.lens.addEventListener('change', () => {
    if (elements.lens.value !== 'work-coordination') {
      elements.lens.value = 'work-coordination';
      announce('That lens is not mapped yet.');
    }
  });
}

async function load() {
  if (!graphUrl) throw new Error('System Map source URL is not configured.');
  const response = await fetch(graphUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load the System Map (${response.status}).`);
  state.graph = validateGraph(await response.json());
  renderPathControls();
  bindEvents();
  elements.explorer.hidden = false;
  render();
}

load().catch(error => {
  elements.status.innerHTML = '<strong>System Map unavailable</strong>';
  elements.explorer.hidden = true;
  document.getElementById('map-error').hidden = false;
  document.getElementById('map-error-message').textContent = error.message;
  const link = document.getElementById('map-source-fallback');
  if (sourcePageUrl) link.href = sourcePageUrl;
});
