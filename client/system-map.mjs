import {
  validateGraph,
  indexGraph,
  rootNodeIds,
  visibleNodeIds,
  findPath,
  sourceUrl,
  nodeTypeLabel
} from './system-map-graph.mjs';
import {
  SystemMapRenderer,
  initialExpandedIds
} from './system-map-renderer.mjs';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[character]));

const root = document.querySelector('[data-system-map]');

const lensConfigs = {
  'work-coordination': {
    label: 'Work & coordination',
    graphUrl: root?.dataset.graphWorkCoordinationUrl,
    sourceUrl: root?.dataset.sourceWorkCoordinationUrl
  },
  'repository-ownership': {
    label: 'Repository ownership',
    graphUrl: root?.dataset.graphRepositoryOwnershipUrl,
    sourceUrl: root?.dataset.sourceRepositoryOwnershipUrl
  },
  'persona-skill': {
    label: 'Persona / Skill',
    graphUrl: root?.dataset.graphPersonaSkillUrl,
    sourceUrl: root?.dataset.sourcePersonaSkillUrl
  },
  'source-generated': {
    label: 'Source / generated',
    graphUrl: root?.dataset.graphSourceGeneratedUrl,
    sourceUrl: root?.dataset.sourceSourceGeneratedUrl,
    coverageNote: 'Complete for explicit current build mappings; not exhaustive repository dependency analysis.'
  },
  'agent-runtime': {
    label: 'Agent / runtime',
    graphUrl: root?.dataset.graphAgentRuntimeUrl,
    sourceUrl: root?.dataset.sourceAgentRuntimeUrl,
    coverageNote: 'Complete for declared static routing contracts; it does not report live Tool, connector, permission, deployment, or model availability.'
  }
};

const graphCache = new Map();

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
  canvas: document.getElementById('map-canvas'),
  graphFallback: document.getElementById('map-node-fallback'),
  details: document.getElementById('map-details'),
  pathFrom: document.getElementById('path-from'),
  pathTo: document.getElementById('path-to'),
  pathResult: document.getElementById('path-result'),
  reset: document.getElementById('map-reset'),
  fit: document.getElementById('map-fit'),
  lens: document.getElementById('map-lens'),
  liveRegion: document.getElementById('map-live-region'),
  sourceLink: document.getElementById('map-graph-source-link'),
  error: document.getElementById('map-error'),
  errorMessage: document.getElementById('map-error-message'),
  sourceFallback: document.getElementById('map-source-fallback')
};

let renderer = null;
let rendererUnavailable = false;

function announce(message) {
  elements.liveRegion.textContent = message;
}

function currentLensConfig() {
  return lensConfigs[state.lens] || null;
}

function selectedNode() {
  return state.graph?.nodes.find(node => node.id === state.selectedId) || null;
}

function relationshipLabel(value) {
  return String(value || '').replaceAll('-', ' ');
}

function coverageDescription() {
  if (!state.graph) return '';
  if (state.graph.coverage === 'complete-for-scope') {
    return currentLensConfig()?.coverageNote || 'Complete for this lens scope; it does not imply exhaustive downstream impact.';
  }
  return 'Known-explicit coverage, not exhaustive impact analysis.';
}

function ensureRenderer() {
  if (renderer || rendererUnavailable) return renderer;
  if (typeof globalThis.cytoscape !== 'function') {
    rendererUnavailable = true;
    return null;
  }
  try {
    renderer = new SystemMapRenderer({
      container: elements.canvas,
      cytoscapeFactory: globalThis.cytoscape,
      onSelect: selectNode
    });
  } catch {
    rendererUnavailable = true;
  }
  return renderer;
}

function currentVisibleIds() {
  const visible = visibleNodeIds(state.graph, state.expanded);
  if (state.path) state.path.nodes.forEach(id => visible.add(id));
  return visible;
}

function renderStatus() {
  if (!state.graph) return;
  const config = currentLensConfig();
  const visible = currentVisibleIds();
  elements.status.innerHTML = `
    <span class="status-dot" aria-hidden="true"></span>
    <strong>${escapeHtml(config?.label || 'Derived view')}</strong>
    <span>${escapeHtml(visible.size)} visible · ${escapeHtml(state.graph.nodes.length)} total nodes · ${escapeHtml(state.graph.edges.length)} relationships</span>
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
      <p class="coverage-note">${escapeHtml(coverageDescription())}</p>
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

function renderFallbackNodes(visible) {
  const roots = new Set(rootNodeIds(state.graph));
  const pathNodes = new Set(state.path?.nodes || []);
  const index = indexGraph(state.graph);

  elements.graphFallback.innerHTML = state.graph.nodes
    .filter(node => visible.has(node.id))
    .sort((a, b) => {
      const aRoot = roots.has(a.id) ? 0 : 1;
      const bRoot = roots.has(b.id) ? 0 : 1;
      return aRoot - bRoot || a.label.localeCompare(b.label);
    })
    .map(node => {
      const selected = state.selectedId === node.id;
      const expanded = state.expanded.has(node.id);
      return `
        <article class="map-node ${selected ? 'selected' : ''} ${pathNodes.has(node.id) ? 'in-path' : ''}">
          <button type="button" class="node-select" data-select-node="${escapeHtml(node.id)}" aria-pressed="${selected}">
            <span class="node-kicker">${escapeHtml(nodeTypeLabel(node.type))}</span>
            <strong>${escapeHtml(node.label)}</strong>
            <span class="node-meta">${index.incoming.get(node.id).length} in · ${index.outgoing.get(node.id).length} out</span>
          </button>
          <button type="button" class="branch-toggle" data-toggle-expand="${escapeHtml(node.id)}" aria-expanded="${expanded}">
            ${expanded ? 'Collapse' : 'Expand'}
          </button>
        </article>
      `;
    }).join('');
}

function renderGraph() {
  const visible = currentVisibleIds();
  const activeRenderer = ensureRenderer();

  if (activeRenderer) {
    elements.canvas.hidden = false;
    elements.graphFallback.hidden = true;
    activeRenderer.render({
      graph: state.graph,
      visibleIds: visible,
      selectedId: state.selectedId,
      path: state.path
    });
    return;
  }

  elements.canvas.hidden = true;
  elements.graphFallback.hidden = false;
  renderFallbackNodes(visible);
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
  renderGraph();
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
  state.expanded = initialExpandedIds(state.graph);
  state.path = null;
  elements.pathFrom.value = '';
  elements.pathTo.value = '';
  render();
  announce('System Map reset to the bounded overview.');
}

function fitGraph() {
  const activeRenderer = ensureRenderer();
  if (activeRenderer) {
    activeRenderer.fit();
    announce('Visible graph fitted to the viewport.');
  } else {
    announce('Graph renderer unavailable; textual fallback remains active.');
  }
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
  if (state.path) {
    requestAnimationFrame(() => ensureRenderer()?.fit());
  }
  announce(state.path ? 'Explicit path shown.' : 'No explicit path found in this lens.');
}

function showLoadError(error, config) {
  elements.status.innerHTML = '<strong>System Map unavailable</strong>';
  elements.explorer.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = error.message;
  if (config?.sourceUrl) elements.sourceFallback.href = config.sourceUrl;
}

async function loadLens(lens) {
  const config = lensConfigs[lens];
  if (!config?.graphUrl) {
    elements.lens.value = state.lens;
    announce('That lens is not mapped yet.');
    return;
  }

  elements.status.innerHTML = `<strong>Loading ${escapeHtml(config.label)}…</strong>`;
  elements.error.hidden = true;

  try {
    let graph = graphCache.get(lens);
    if (!graph) {
      const response = await fetch(config.graphUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Could not load the System Map (${response.status}).`);
      graph = validateGraph(await response.json());
      graphCache.set(lens, graph);
    }

    state.lens = lens;
    state.graph = graph;
    state.selectedId = null;
    state.expanded = initialExpandedIds(graph);
    state.path = null;
    elements.lens.value = lens;
    elements.sourceLink.href = config.sourceUrl;
    elements.sourceFallback.href = config.sourceUrl;
    renderPathControls();
    elements.explorer.hidden = false;
    render();
    announce(`${config.label} lens loaded.`);
  } catch (error) {
    showLoadError(error, config);
  }
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
  elements.fit.addEventListener('click', fitGraph);
  document.getElementById('find-path').addEventListener('click', findSelectedPath);
  elements.lens.addEventListener('change', () => {
    loadLens(elements.lens.value);
  });
}

bindEvents();
loadLens('work-coordination');
