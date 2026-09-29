import {
  validateGraph,
  directNeighbors,
  indexGraph,
  rootNodeIds,
  findPath,
  sourceUrl,
  nodeTypeLabel
} from './system-map-graph.mjs';
import {
  DEFAULT_BRANCH_CHUNK,
  SystemMapRenderer,
  boundedVisibleNodeIds,
  initialExpandedIds,
  localRevealBatchSize,
  neighborhoodWindow
} from './system-map-renderer.mjs';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[character]));

const root = document.querySelector('[data-system-map]');

const lensConfigs = {
  'work-coordination': {
    label: 'Work & coordination',
    humanTitle: 'Work & verification',
    description: 'See work surfaces, orchestration, verification, truth classes, and the boundaries around live operational authority.',
    graphUrl: root?.dataset.graphWorkCoordinationUrl,
    sourceUrl: root?.dataset.sourceWorkCoordinationUrl,
    layoutDirection: 'horizontal'
  },
  'repository-ownership': {
    label: 'Repository ownership',
    humanTitle: 'Repositories & ownership',
    description: 'See which repositories belong to the workspace, what each owns, and where local instruction and mutation boundaries live.',
    graphUrl: root?.dataset.graphRepositoryOwnershipUrl,
    sourceUrl: root?.dataset.sourceRepositoryOwnershipUrl,
    layoutDirection: 'vertical'
  },
  'persona-skill': {
    label: 'Persona / Skill',
    humanTitle: 'Personas & capabilities',
    description: 'See stable Skill identities, persona-specific applications, guidance, and explicit capability relationships.',
    graphUrl: root?.dataset.graphPersonaSkillUrl,
    sourceUrl: root?.dataset.sourcePersonaSkillUrl,
    layoutDirection: 'vertical'
  },
  'source-generated': {
    label: 'Source / generated',
    humanTitle: 'Sources & generated outputs',
    description: 'Trace authored inputs and build steps into generated outputs while keeping generated artifacts separate from authored truth.',
    graphUrl: root?.dataset.graphSourceGeneratedUrl,
    sourceUrl: root?.dataset.sourceSourceGeneratedUrl,
    layoutDirection: 'horizontal',
    coverageNote: 'Complete for explicit current build mappings; not exhaustive repository dependency analysis.'
  },
  'agent-runtime': {
    label: 'Agent / runtime',
    humanTitle: 'How agents get oriented',
    description: 'Follow the declared path from repository instructions through semantic spaces and routes to callable Skills. Live runtime state remains external.',
    graphUrl: root?.dataset.graphAgentRuntimeUrl,
    sourceUrl: root?.dataset.sourceAgentRuntimeUrl,
    layoutDirection: 'horizontal',
    coverageNote: 'Complete for declared static routing contracts; it does not report live Tool, connector, permission, deployment, or model availability.'
  }
};

const graphCache = new Map();
const lensViewStates = new Map();
const navigationStack = [];
const MAX_NAVIGATION_HISTORY = 24;

const state = {
  graph: null,
  selectedId: null,
  expanded: new Set(),
  expansionLimits: new Map(),
  connections: new Set(),
  connectionLimits: new Map(),
  contentOffsets: new Map(),
  connectionOffsets: new Map(),
  explorationTrail: [],
  path: null,
  focusPath: null,
  focusId: null,
  highlightedEdgeId: null,
  typeFilter: '',
  relationshipFilter: '',
  lens: 'overview',
  mode: 'overview'
};

const elements = {
  status: document.getElementById('map-status'),
  overview: document.getElementById('map-overview'),
  explorer: document.getElementById('map-explorer'),
  back: document.getElementById('map-back'),
  trail: document.getElementById('map-trail'),
  selectionActions: document.getElementById('map-selection-actions'),
  explorerHeading: document.getElementById('explorer-heading'),
  explorerDescription: document.getElementById('explorer-description'),
  explorerLensLabel: document.getElementById('explorer-lens-label'),
  graphOnly: [...root.querySelectorAll('[data-graph-only]')],
  canvas: document.getElementById('map-canvas'),
  graphFallback: document.getElementById('map-node-fallback'),
  keyboardNav: document.getElementById('map-keyboard-nav'),
  details: document.getElementById('map-details'),
  pathFrom: document.getElementById('path-from'),
  pathTo: document.getElementById('path-to'),
  pathResult: document.getElementById('path-result'),
  reset: document.getElementById('map-reset'),
  fit: document.getElementById('map-fit'),
  search: document.getElementById('map-search'),
  searchGo: document.getElementById('map-search-go'),
  searchOptions: document.getElementById('map-search-options'),
  typeFilter: document.getElementById('map-type-filter'),
  relationshipFilter: document.getElementById('map-relationship-filter'),
  lens: document.getElementById('map-lens'),
  liveRegion: document.getElementById('map-live-region'),
  sourceLink: document.getElementById('map-graph-source-link'),
  error: document.getElementById('map-error'),
  errorMessage: document.getElementById('map-error-message'),
  sourceFallback: document.getElementById('map-source-fallback'),
  question: document.getElementById('map-question'),
  questionScope: document.getElementById('map-question-scope'),
  questionSummary: document.getElementById('map-question-context-summary'),
  questionPreview: document.getElementById('map-question-preview'),
  questionCopy: document.getElementById('map-copy-question'),
  questionCopyStatus: document.getElementById('map-copy-status'),
  inspectorRail: root.querySelector('.inspector-rail')
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

function clonePath(path) {
  return path ? { nodes: [...path.nodes], edges: [...path.edges] } : null;
}

function captureViewSnapshot() {
  return {
    mode: 'graph',
    lens: state.lens,
    selectedId: state.selectedId,
    expanded: [...state.expanded],
    expansionLimits: [...state.expansionLimits.entries()],
    connections: [...state.connections],
    connectionLimits: [...state.connectionLimits.entries()],
    contentOffsets: [...state.contentOffsets.entries()],
    connectionOffsets: [...state.connectionOffsets.entries()],
    explorationTrail: [...state.explorationTrail],
    path: clonePath(state.path),
    focusPath: clonePath(state.focusPath),
    focusId: state.focusId,
    highlightedEdgeId: state.highlightedEdgeId,
    typeFilter: state.typeFilter,
    relationshipFilter: state.relationshipFilter,
    search: elements.search?.value || '',
    pathFrom: elements.pathFrom?.value || '',
    pathTo: elements.pathTo?.value || '',
    viewport: renderer?.getViewport?.() || null,
    positions: renderer?.getNodePositions?.() || [],
    inspectorScrollTop: elements.inspectorRail?.scrollTop || 0,
    documentScrollY: globalThis.scrollY || 0
  };
}

function validPath(path) {
  if (!path || !state.graph) return null;
  const nodeIds = new Set(state.graph.nodes.map(node => node.id));
  const edgeIds = new Set(state.graph.edges.map(edge => edge.id));
  if (!path.nodes.every(id => nodeIds.has(id)) || !path.edges.every(id => edgeIds.has(id))) return null;
  return clonePath(path);
}

function applyViewSnapshot(snapshot) {
  if (!snapshot || !state.graph) return;
  const nodeIds = new Set(state.graph.nodes.map(node => node.id));
  const edgeIds = new Set(state.graph.edges.map(edge => edge.id));
  state.selectedId = nodeIds.has(snapshot.selectedId) ? snapshot.selectedId : null;
  state.expanded = new Set((snapshot.expanded || []).filter(id => nodeIds.has(id)));
  state.expansionLimits = new Map(
    (snapshot.expansionLimits || []).filter(([id]) => nodeIds.has(id))
  );
  state.connections = new Set((snapshot.connections || []).filter(id => nodeIds.has(id)));
  state.connectionLimits = new Map(
    (snapshot.connectionLimits || []).filter(([id]) => nodeIds.has(id))
  );
  state.contentOffsets = new Map(
    (snapshot.contentOffsets || []).filter(([id]) => nodeIds.has(id))
  );
  state.connectionOffsets = new Map(
    (snapshot.connectionOffsets || []).filter(([id]) => nodeIds.has(id))
  );
  state.explorationTrail = (snapshot.explorationTrail || []).filter(id => nodeIds.has(id));
  state.path = validPath(snapshot.path);
  state.focusPath = validPath(snapshot.focusPath);
  state.focusId = nodeIds.has(snapshot.focusId) ? snapshot.focusId : null;
  state.highlightedEdgeId = edgeIds.has(snapshot.highlightedEdgeId) ? snapshot.highlightedEdgeId : null;
  state.typeFilter = state.graph.nodes.some(node => node.type === snapshot.typeFilter) ? snapshot.typeFilter : '';
  state.relationshipFilter = state.graph.edges.some(edge => edge.relationship === snapshot.relationshipFilter)
    ? snapshot.relationshipFilter
    : '';
  elements.search.value = snapshot.search || '';
  elements.pathFrom.value = nodeIds.has(snapshot.pathFrom) ? snapshot.pathFrom : '';
  elements.pathTo.value = nodeIds.has(snapshot.pathTo) ? snapshot.pathTo : '';
  elements.typeFilter.value = state.typeFilter;
  elements.relationshipFilter.value = state.relationshipFilter;
}

function saveCurrentLensState() {
  if (!state.graph) return;
  lensViewStates.set(state.lens, captureViewSnapshot());
}

function pushNavigationCheckpoint() {
  const snapshot = state.mode === 'overview'
    ? { mode: 'overview', lens: 'overview', documentScrollY: globalThis.scrollY || 0 }
    : state.graph
      ? captureViewSnapshot()
      : null;
  if (!snapshot) return;

  const last = navigationStack.at(-1);
  const key = item => [
    item?.mode,
    item?.lens,
    item?.selectedId,
    item?.focusId,
    item?.highlightedEdgeId,
    [...(item?.expanded || [])].sort().join(','),
    [...(item?.connections || [])].sort().join(','),
    JSON.stringify(item?.expansionLimits || []),
    JSON.stringify(item?.connectionLimits || []),
    JSON.stringify(item?.contentOffsets || []),
    JSON.stringify(item?.connectionOffsets || []),
    item?.path?.nodes?.join('>')
  ].join('|');
  if (key(last) === key(snapshot)) return;
  navigationStack.push(snapshot);
  if (navigationStack.length > MAX_NAVIGATION_HISTORY) navigationStack.shift();
}

function snapshotLabel(snapshot) {
  if (snapshot?.mode === 'overview' || snapshot?.lens === 'overview') return 'System overview';
  const graph = graphCache.get(snapshot?.lens);
  const node = graph?.nodes.find(item => item.id === snapshot?.selectedId);
  return node?.label || lensConfigs[snapshot?.lens]?.humanTitle || lensConfigs[snapshot?.lens]?.label || 'Overview';
}

function recordExplorationLocation(id) {
  if (!id || !state.graph?.nodes.some(node => node.id === id)) return;
  const existingIndex = state.explorationTrail.indexOf(id);
  if (existingIndex >= 0) {
    state.explorationTrail = state.explorationTrail.slice(0, existingIndex + 1);
  } else {
    state.explorationTrail.push(id);
  }
}

function renderTrail() {
  if (!elements.trail || !elements.back) return;
  elements.back.disabled = navigationStack.length === 0;

  if (state.mode === 'overview') {
    elements.trail.innerHTML = '<span class="trail-label">Location</span><span class="current">System overview</span>';
    return;
  }

  const config = currentLensConfig();
  const nodeIndex = state.graph ? indexGraph(state.graph).nodes : new Map();
  const trailNodes = state.explorationTrail
    .map(id => nodeIndex.get(id))
    .filter(Boolean);

  elements.trail.innerHTML = [
    '<span class="trail-label">Exploration path</span>',
    '<button type="button" class="trail-link" data-location-overview>System overview</button>',
    '<span aria-hidden="true">›</span>',
    `<span class="trail-area">${escapeHtml(config?.humanTitle || config?.label || state.lens)}</span>`,
    ...trailNodes.flatMap((node, index) => [
      '<span aria-hidden="true">›</span>',
      index === trailNodes.length - 1
        ? `<span class="current">${escapeHtml(node.label)}</span>`
        : `<button type="button" class="trail-link" data-location-node="${escapeHtml(node.id)}">${escapeHtml(node.label)}</button>`
    ])
  ].join('');
}

function relationshipLabel(value) {
  return String(value || '').replaceAll('-', ' ');
}

function activeVisualPath() {
  return state.path || state.focusPath;
}

function nearestRootPath(targetId) {
  if (!state.graph) return null;
  let best = null;
  for (const rootId of rootNodeIds(state.graph)) {
    const candidate = findPath(state.graph, rootId, targetId);
    if (!candidate) continue;
    if (!best || candidate.edges.length < best.edges.length) best = candidate;
  }
  return best;
}

function searchNode(query) {
  const value = String(query || '').trim().toLowerCase();
  if (!value || !state.graph) return null;
  const nodes = state.graph.nodes.slice().sort((a, b) => a.label.localeCompare(b.label));
  return nodes.find(node => node.id.toLowerCase() === value)
    || nodes.find(node => node.label.toLowerCase() === value)
    || nodes.find(node => node.label.toLowerCase().startsWith(value))
    || nodes.find(node => node.label.toLowerCase().includes(value) || node.id.toLowerCase().includes(value))
    || null;
}

function updateUrlState() {
  if (!globalThis.history?.replaceState) return;
  const url = new URL(globalThis.location.href);

  if (state.mode === 'overview') {
    url.searchParams.set('lens', 'overview');
    for (const key of ['node', 'from', 'to', 'type', 'relationship', 'edge', 'focus']) {
      url.searchParams.delete(key);
    }
    globalThis.history.replaceState(null, '', url);
    return;
  }

  if (!state.graph) return;
  url.searchParams.set('lens', state.lens);
  if (state.selectedId) url.searchParams.set('node', state.selectedId);
  else url.searchParams.delete('node');

  if (state.path && elements.pathFrom.value && elements.pathTo.value) {
    url.searchParams.set('from', elements.pathFrom.value);
    url.searchParams.set('to', elements.pathTo.value);
  } else {
    url.searchParams.delete('from');
    url.searchParams.delete('to');
  }

  if (state.typeFilter) url.searchParams.set('type', state.typeFilter);
  else url.searchParams.delete('type');

  if (state.relationshipFilter) url.searchParams.set('relationship', state.relationshipFilter);
  else url.searchParams.delete('relationship');

  if (state.highlightedEdgeId) url.searchParams.set('edge', state.highlightedEdgeId);
  else url.searchParams.delete('edge');

  if (state.focusId) url.searchParams.set('focus', state.focusId);
  else url.searchParams.delete('focus');

  globalThis.history.replaceState(null, '', url);
}

function populateExploreControls() {
  const nodeTypes = [...new Set(state.graph.nodes.map(node => node.type))].sort();
  const relationships = [...new Set(state.graph.edges.map(edge => edge.relationship))].sort();
  const nodes = state.graph.nodes.slice().sort((a, b) => a.label.localeCompare(b.label));

  elements.searchOptions.innerHTML = nodes
    .map(node => `<option value="${escapeHtml(node.label)}"></option>`)
    .join('');

  elements.typeFilter.innerHTML = '<option value="">All visible types</option>'
    + nodeTypes.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(nodeTypeLabel(type))}</option>`).join('');
  elements.relationshipFilter.innerHTML = '<option value="">All visible relationships</option>'
    + relationships.map(relationship => `<option value="${escapeHtml(relationship)}">${escapeHtml(relationshipLabel(relationship))}</option>`).join('');

  elements.typeFilter.disabled = false;
  elements.relationshipFilter.disabled = false;
  elements.typeFilter.value = state.typeFilter;
  elements.relationshipFilter.value = state.relationshipFilter;
}

function restoreUrlState() {
  const params = new URLSearchParams(globalThis.location.search);
  const nodeId = params.get('node');
  const from = params.get('from');
  const to = params.get('to');
  const type = params.get('type');
  const relationship = params.get('relationship');
  const edgeId = params.get('edge');
  const focusId = params.get('focus');

  if (type && state.graph.nodes.some(node => node.type === type)) state.typeFilter = type;
  if (relationship && state.graph.edges.some(edge => edge.relationship === relationship)) state.relationshipFilter = relationship;
  if (edgeId && state.graph.edges.some(edge => edge.id === edgeId)) state.highlightedEdgeId = edgeId;

  if (nodeId && state.graph.nodes.some(node => node.id === nodeId)) {
    state.selectedId = nodeId;
    state.focusPath = nearestRootPath(nodeId);
    elements.search.value = state.graph.nodes.find(node => node.id === nodeId)?.label || nodeId;
  }

  if (focusId && state.graph.nodes.some(node => node.id === focusId)) {
    state.focusId = focusId;
    if (!state.selectedId) state.selectedId = focusId;
    state.focusPath = nearestRootPath(focusId);
  }

  if (
    from && to &&
    state.graph.nodes.some(node => node.id === from) &&
    state.graph.nodes.some(node => node.id === to)
  ) {
    state.path = findPath(state.graph, from, to);
    state.focusPath = null;
    elements.pathFrom.value = from;
    elements.pathTo.value = to;
  }

  elements.typeFilter.value = state.typeFilter;
  elements.relationshipFilter.value = state.relationshipFilter;
}

function expansionInfo(id) {
  const neighbors = directNeighbors(state.graph, id).nodes;
  const total = neighbors.length;
  const limit = Math.min(total, Number(state.expansionLimits.get(id) ?? DEFAULT_BRANCH_CHUNK));
  const expanded = state.expanded.has(id);
  const revealed = expanded ? limit : 0;
  return {
    expanded,
    total,
    revealed,
    hasMore: expanded && revealed < total,
    nextCount: Math.min(DEFAULT_BRANCH_CHUNK, Math.max(0, total - revealed))
  };
}

function isContainmentEdge(edge, parentId) {
  if (!edge || edge.from !== parentId) return false;
  return edge.relationship === 'contains'
    || edge.relationship === 'owns'
    || edge.relationship.startsWith('owns-');
}

function semanticNeighborGroups(id) {
  const index = indexGraph(state.graph);
  const contents = [];
  const connections = [];
  const seenContents = new Set();
  const seenConnections = new Set();

  for (const edge of index.outgoing.get(id) || []) {
    const node = index.nodes.get(edge.to);
    if (!node) continue;
    if (isContainmentEdge(edge, id)) {
      if (!seenContents.has(node.id)) {
        contents.push({ node, edge, direction: 'outgoing' });
        seenContents.add(node.id);
      }
    } else if (!seenConnections.has(node.id)) {
      connections.push({ node, edge, direction: 'outgoing' });
      seenConnections.add(node.id);
    }
  }

  for (const edge of index.incoming.get(id) || []) {
    const node = index.nodes.get(edge.from);
    if (!node || seenConnections.has(node.id)) continue;
    connections.push({ node, edge, direction: 'incoming' });
    seenConnections.add(node.id);
  }

  return {
    contents: contents.sort((a, b) => a.node.label.localeCompare(b.node.label)),
    connections: connections.sort((a, b) => a.node.label.localeCompare(b.node.label))
  };
}

function semanticRevealInfo(id, kind) {
  const groups = semanticNeighborGroups(id);
  const items = kind === 'contents' ? groups.contents : groups.connections;
  const openSet = kind === 'contents' ? state.expanded : state.connections;
  const limits = kind === 'contents' ? state.expansionLimits : state.connectionLimits;
  const offsets = kind === 'contents' ? state.contentOffsets : state.connectionOffsets;
  const total = items.length;
  const viewportWidth = elements.canvas?.clientWidth || 0;
  const viewportHeight = elements.canvas?.clientHeight || 0;
  const batchSize = localRevealBatchSize({
    total,
    viewportWidth,
    viewportHeight,
    kind
  });
  const requestedSize = Math.min(total, Number(limits.get(id) ?? batchSize));
  const window = neighborhoodWindow({
    total,
    offset: offsets.get(id) ?? 0,
    batchSize: requestedSize,
    direction: 'current'
  });
  const open = openSet.has(id);
  return {
    open,
    total,
    batchSize: requestedSize,
    offset: window.offset,
    start: open ? window.start : 0,
    end: open ? window.end : 0,
    revealed: open ? window.size : 0,
    hasPrevious: open && window.hasPrevious,
    hasNext: open && window.hasNext,
    remaining: open ? Math.max(0, total - window.end) : total,
    items
  };
}

function semanticRangeText(info, noun) {
  if (!info?.total) return `0 ${noun}`;
  if (!info.open) return `${info.total} ${noun}`;
  return `${noun} ${info.start}–${info.end} of ${info.total}`;
}

function semanticPageLabel(info, direction, noun) {
  const window = neighborhoodWindow({
    total: info.total,
    offset: info.offset,
    batchSize: info.batchSize,
    direction
  });
  return direction === 'previous'
    ? `Previous ${noun} ${window.start}–${window.end}`
    : `Next ${noun} ${window.start}–${window.end}`;
}

function sourceBackedExplanation(node) {
  if (!node) return null;
  if (state.lens === 'agent-runtime' && node.id === 'agent:repository-dispatcher') {
    return {
      summary: 'Chooses the shortest applicable activation path for work in Persona-Library. It distinguishes repository plumbing from library-semantic work and requires mixed work to escalate before changing canonical library meaning.',
      example: 'A Persona or Skill relationship change takes the library-semantic path; straightforward CI or build maintenance can remain on the repository-plumbing path.',
      sourceLabel: 'AGENTS.md · Choose the shortest activation path'
    };
  }
  if (state.lens === 'agent-runtime' && node.id === 'view:agent-runtime') {
    return {
      summary: 'A static view of the repository’s declared orientation and routing contracts. It shows what the repository says agents should load or use, not what a particular conversation actually did.',
      sourceLabel: 'AGENTS.md · routing and live-state boundaries'
    };
  }
  if (state.lens === 'agent-runtime' && node.id === 'routing:orientation-bootstrap') {
    return {
      summary: 'The semantic orientation entry point. For ordinary library-semantic work, the repository contract directs the agent to read site-orientation, choose one primary space, then load only that space’s route group and selected records or capability.',
      example: 'Skill-related work can continue into the Skills space and its declared route group instead of loading unrelated spaces.',
      sourceLabel: 'AGENTS.md · library-semantic route; content/site-orientation.json · root'
    };
  }
  if (state.lens === 'agent-runtime' && node.id === 'space:skills') {
    return {
      summary: 'The primary semantic space for reusable capabilities. Its source defines what Skill work should answer, what to read, when changes are appropriate, and which Skills route file to use.',
      example: 'A request to create or update a reusable callable Skill proceeds from this space into the Skills route group.',
      sourceLabel: 'content/site-orientation.json · spaces.skills'
    };
  }
  if (state.lens === 'agent-runtime' && node.id === 'route-group:skills') {
    return {
      summary: 'The declared collection of routes for Skill-related work. Each route describes a bounded request pattern, target capability, first reads, mutation boundary, reconciliation behavior, and handoff.',
      sourceLabel: 'content/orientation/skills.json · root'
    };
  }
  if (state.lens === 'agent-runtime' && node.id === 'route:skill-package-maintenance') {
    return {
      summary: 'The route for creating or updating a reusable callable Skill package. It targets the Skill creator package, starts from the approved scope and existing package/contract, requires authorized mutation, and hands off to validation plus change-impact reconciliation.',
      sourceLabel: 'content/orientation/skills.json · routes[id=skill-package-maintenance]'
    };
  }
  return null;
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
  const seedIds = [];
  const visualPath = activeVisualPath();
  if (visualPath) seedIds.push(...visualPath.nodes);
  if (state.selectedId) seedIds.push(state.selectedId);
  if (state.highlightedEdgeId) {
    const edge = state.graph.edges.find(item => item.id === state.highlightedEdgeId);
    if (edge) seedIds.push(edge.from, edge.to);
  }

  let visible;

  if (state.lens === 'agent-runtime') {
    visible = new Set(rootNodeIds(state.graph));
    for (const id of seedIds) {
      if (state.graph.nodes.some(node => node.id === id)) visible.add(id);
    }

    let changed = true;
    while (changed) {
      changed = false;
      for (const id of [...visible]) {
        if (state.expanded.has(id)) {
          const info = semanticRevealInfo(id, 'contents');
          for (const item of info.items.slice(info.offset, info.offset + info.revealed)) {
            if (!visible.has(item.node.id)) {
              visible.add(item.node.id);
              changed = true;
            }
          }
        }
        if (state.connections.has(id)) {
          const info = semanticRevealInfo(id, 'connections');
          for (const item of info.items.slice(info.offset, info.offset + info.revealed)) {
            if (!visible.has(item.node.id)) {
              visible.add(item.node.id);
              changed = true;
            }
          }
        }
      }
    }
  } else {
    visible = boundedVisibleNodeIds(
      state.graph,
      state.expanded,
      state.expansionLimits,
      { seedIds }
    );
  }

  if (!state.focusId) return visible;

  const focused = new Set([state.focusId]);
  const rootPath = nearestRootPath(state.focusId);
  for (const id of rootPath?.nodes || []) focused.add(id);

  if (state.lens === 'agent-runtime') {
    const contents = semanticRevealInfo(state.focusId, 'contents');
    const connections = semanticRevealInfo(state.focusId, 'connections');
    if (contents.open) {
      for (const item of contents.items.slice(contents.offset, contents.offset + contents.revealed)) focused.add(item.node.id);
    }
    if (connections.open) {
      for (const item of connections.items.slice(connections.offset, connections.offset + connections.revealed)) focused.add(item.node.id);
    }
  } else {
    const focusLimit = state.expanded.has(state.focusId)
      ? Number(state.expansionLimits.get(state.focusId) ?? DEFAULT_BRANCH_CHUNK)
      : DEFAULT_BRANCH_CHUNK;
    for (const node of directNeighbors(state.graph, state.focusId).nodes.slice(0, focusLimit)) {
      focused.add(node.id);
    }
  }

  if (state.highlightedEdgeId) {
    const edge = state.graph.edges.find(item => item.id === state.highlightedEdgeId);
    if (edge) {
      focused.add(edge.from);
      focused.add(edge.to);
    }
  }
  return focused;
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
  const highlighted = state.highlightedEdgeId === edge.id;
  return `
    <li class="${highlighted ? 'relationship-selected' : ''}">
      <button class="relationship-link" type="button" data-select-node="${escapeHtml(other.id)}">
        <strong>${escapeHtml(other.label)}</strong>
        <span>${escapeHtml(nodeTypeLabel(other.type))}</span>
      </button>
      <button
        class="edge-highlight-button"
        type="button"
        data-highlight-edge="${escapeHtml(edge.id)}"
        aria-pressed="${highlighted}"
      >${highlighted ? 'Evidence shown' : 'Inspect relationship'}</button>
    </li>
  `;
}

function groupedRelationships(edges, direction, emptyMessage) {
  if (!edges.length) return `<p class="quiet">${escapeHtml(emptyMessage)}</p>`;
  const groups = new Map();
  for (const edge of edges) {
    if (!groups.has(edge.relationship)) groups.set(edge.relationship, []);
    groups.get(edge.relationship).push(edge);
  }
  return `
    <div class="relationship-groups">
      ${[...groups.entries()]
        .sort(([a], [b]) => relationshipLabel(a).localeCompare(relationshipLabel(b)))
        .map(([relationship, items]) => `
          <details class="relationship-group" ${items.length <= 4 ? 'open' : ''}>
            <summary>
              <span>${escapeHtml(relationshipLabel(relationship))}</span>
              <strong>${items.length}</strong>
            </summary>
            <ul class="relationship-list">${items
              .slice()
              .sort((a, b) => {
                const index = indexGraph(state.graph);
                const aId = direction === 'outgoing' ? a.to : a.from;
                const bId = direction === 'outgoing' ? b.to : b.from;
                return (index.nodes.get(aId)?.label || aId).localeCompare(index.nodes.get(bId)?.label || bId);
              })
              .map(edge => edgeSummary(edge, direction))
              .join('')}</ul>
          </details>
        `).join('')}
    </div>
  `;
}

function highlightedEdgeEvidence() {
  const edge = state.graph?.edges.find(item => item.id === state.highlightedEdgeId);
  if (!edge) return '';
  const index = indexGraph(state.graph);
  const from = index.nodes.get(edge.from);
  const to = index.nodes.get(edge.to);
  const source = sourceUrl(edge.source);
  return `
    <section class="detail-section relationship-evidence">
      <div class="section-heading">
        <h3>Relationship evidence</h3>
        <span class="evidence-state">Selected edge</span>
      </div>
      <p class="relationship-statement">
        <strong>${escapeHtml(from?.label || edge.from)}</strong>
        <span>${escapeHtml(relationshipLabel(edge.relationship))}</span>
        <strong>${escapeHtml(to?.label || edge.to)}</strong>
      </p>
      <dl>
        <dt>Edge ID</dt><dd>${escapeHtml(edge.id)}</dd>
        <dt>Derivation</dt><dd>${escapeHtml(edge.derivation || 'Unavailable')}</dd>
        <dt>Source</dt><dd>${escapeHtml(edge.source?.locator || 'Unavailable')}</dd>
        <dt>Selector</dt><dd>${escapeHtml(edge.source?.selector || 'Unavailable')}</dd>
      </dl>
      ${source ? `<a class="source-link" href="${escapeHtml(source)}" target="_blank" rel="noreferrer">Open relationship source ↗</a>` : ''}
    </section>
  `;
}

function renderAgentRuntimeDetails(node) {
  const index = indexGraph(state.graph);
  const incoming = index.incoming.get(node.id) || [];
  const outgoing = index.outgoing.get(node.id) || [];
  const groups = semanticNeighborGroups(node.id);
  const contents = semanticRevealInfo(node.id, 'contents');
  const connections = semanticRevealInfo(node.id, 'connections');
  const explanation = sourceBackedExplanation(node);
  const nodeSource = sourceUrl(node.source);
  const outgoingConnectionEdges = groups.connections
    .filter(item => item.direction === 'outgoing')
    .map(item => item.edge);
  const incomingConnectionEdges = groups.connections
    .filter(item => item.direction === 'incoming')
    .map(item => item.edge);
  const contentEdges = groups.contents.map(item => item.edge);

  elements.details.innerHTML = `
    <div class="detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(nodeTypeLabel(node.type))}</p>
        <h2 tabindex="-1">${escapeHtml(node.label)}</h2>
      </div>
      <span class="connection-count">${contents.total} contents · ${connections.total} connections</span>
    </div>

    <section class="detail-section">
      <h3>Purpose</h3>
      <p class="detail-copy">${escapeHtml(explanation?.summary || 'No source-backed plain-language explanation is available for this item yet.')}</p>
      ${explanation?.example ? `<p class="detail-example"><strong>Example:</strong> ${escapeHtml(explanation.example)}</p>` : ''}
      ${explanation?.sourceLabel ? `<p class="explanation-source">${escapeHtml(explanation.sourceLabel)}</p>` : ''}
    </section>

    ${contents.total ? `
      <section class="detail-section">
        <div class="section-heading">
          <h3>Contents</h3>
          <span>${contents.total} contained</span>
        </div>
        <p class="detail-copy">These items are connected by explicit containment or ownership relationships from this item.</p>
        ${groupedRelationships(contentEdges, 'outgoing', 'No explicit contents are represented.')}
      </section>
    ` : ''}

    <section class="detail-section">
      <div class="section-heading">
        <h3>Connections</h3>
        <span>${connections.total} related</span>
      </div>
      <p class="detail-copy">Connections relate separate entities. They do not imply containment or prove that a runtime execution followed this path.</p>
      ${outgoingConnectionEdges.length ? `
        <div class="connection-direction">
          <strong>Outgoing</strong>
          ${groupedRelationships(outgoingConnectionEdges, 'outgoing', '')}
        </div>
      ` : ''}
      ${incomingConnectionEdges.length ? `
        <div class="connection-direction">
          <strong>Incoming</strong>
          ${groupedRelationships(incomingConnectionEdges, 'incoming', '')}
        </div>
      ` : ''}
      ${!connections.total ? '<p class="quiet">No non-containment connections are represented for this item.</p>' : ''}
      <p class="coverage-note">${escapeHtml(coverageDescription())}</p>
    </section>

    ${highlightedEdgeEvidence()}

    <section class="detail-section">
      <div class="section-heading">
        <h3>Explore</h3>
        <span>Explicit controls</span>
      </div>
      <div class="branch-actions">
        ${contents.total ? `
          <button class="expand-button" type="button" data-toggle-contents="${escapeHtml(node.id)}" aria-expanded="${contents.open}">
            ${contents.open ? 'Close contents' : `Open contents 1–${Math.min(contents.batchSize, contents.total)} of ${contents.total}`}
          </button>
        ` : ''}
        ${contents.open ? `<span class="branch-progress semantic-range">${escapeHtml(semanticRangeText(contents, 'contents'))}</span>` : ''}
        ${contents.hasPrevious ? `
          <button class="show-more-button" type="button" data-show-previous-contents="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(contents, 'previous', 'contents'))}</button>
        ` : ''}
        ${contents.hasNext ? `
          <button class="show-more-button" type="button" data-show-more-contents="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(contents, 'next', 'contents'))}</button>
        ` : ''}
        ${connections.total ? `
          <button class="show-more-button" type="button" data-toggle-connections="${escapeHtml(node.id)}" aria-expanded="${connections.open}">
            ${connections.open ? 'Hide connections' : `Show connections 1–${Math.min(connections.batchSize, connections.total)} of ${connections.total}`}
          </button>
        ` : ''}
        ${connections.open ? `<span class="branch-progress semantic-range">${escapeHtml(semanticRangeText(connections, 'connections'))}</span>` : ''}
        ${connections.hasPrevious ? `
          <button class="show-more-button" type="button" data-show-previous-connections="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(connections, 'previous', 'connections'))}</button>
        ` : ''}
        ${connections.hasNext ? `
          <button class="show-more-button" type="button" data-show-more-connections="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(connections, 'next', 'connections'))}</button>
        ` : ''}
        <button class="show-more-button" type="button" data-focus-selected="${escapeHtml(node.id)}">Focus on this area</button>
      </div>
    </section>

    <details class="detail-section provenance-detail">
      <summary>Technical details &amp; source</summary>
      <div class="source-detail">
        <dl>
          <dt>Stable ID</dt><dd>${escapeHtml(node.id)}</dd>
          <dt>Type</dt><dd>${escapeHtml(nodeTypeLabel(node.type))}</dd>
          <dt>Owner</dt><dd>${escapeHtml(node.owner || 'Unavailable')}</dd>
          <dt>Derivation</dt><dd>${escapeHtml(node.derivation)}</dd>
          <dt>Source</dt><dd>${escapeHtml(node.source?.locator || 'Unavailable')}</dd>
          <dt>Selector</dt><dd>${escapeHtml(node.source?.selector || 'Unavailable')}</dd>
        </dl>
        ${nodeSource ? `<a class="source-link" href="${escapeHtml(nodeSource)}" target="_blank" rel="noreferrer">Open canonical source ↗</a>` : ''}
      </div>
    </details>
  `;
}

function renderDetails() {
  const node = selectedNode();
  if (!node) {
    elements.details.innerHTML = `
      <div class="empty-detail">
        <p class="eyebrow">Inspector</p>
        <h2>Select a node</h2>
        <p>Selection is separate from expansion and focus. Choose a node first, then decide whether to inspect, expand its direct relationships, or focus the map around it.</p>
      </div>
    `;
    return;
  }

  if (state.lens === 'agent-runtime') {
    renderAgentRuntimeDetails(node);
    return;
  }

  const index = indexGraph(state.graph);
  const incoming = index.incoming.get(node.id);
  const outgoing = index.outgoing.get(node.id);
  const ownership = outgoing.filter(edge => edge.relationship === 'owns' || edge.relationship.startsWith('owns-'));
  const outgoingConnections = outgoing.filter(edge => !ownership.includes(edge));
  const nodeSource = sourceUrl(node.source);
  const expansion = expansionInfo(node.id);
  const expandLabel = expansion.expanded
    ? 'Collapse branch'
    : expansion.total > DEFAULT_BRANCH_CHUNK
      ? `Expand first ${DEFAULT_BRANCH_CHUNK} of ${expansion.total}`
      : `Expand ${expansion.total} direct connection${expansion.total === 1 ? '' : 's'}`;

  elements.details.innerHTML = `
    <div class="detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(nodeTypeLabel(node.type))}</p>
        <h2 tabindex="-1">${escapeHtml(node.label)}</h2>
        <p class="node-id">${escapeHtml(node.id)}</p>
      </div>
      <span class="connection-count">${incoming.length} in · ${outgoing.length} out</span>
    </div>

    <section class="detail-section">
      <h3>What is this?</h3>
      <p class="detail-copy">This lens represents <strong>${escapeHtml(node.label)}</strong> as <strong>${escapeHtml(nodeTypeLabel(node.type))}</strong>. Its recorded owner is <code>${escapeHtml(node.owner || 'Unavailable')}</code>.</p>
    </section>

    <section class="detail-section">
      <div class="section-heading">
        <h3>What belongs here?</h3>
        <span>${ownership.length} explicit</span>
      </div>
      ${groupedRelationships(ownership, 'outgoing', 'No explicit ownership relationship is represented in this lens.')}
    </section>

    <section class="detail-section">
      <div class="section-heading">
        <h3>How does it connect?</h3>
        <span>${incoming.length + outgoingConnections.length} relationships</span>
      </div>
      <div class="connection-direction">
        <strong>Outgoing</strong>
        ${groupedRelationships(outgoingConnections, 'outgoing', 'No other explicit outgoing relationships.')}
      </div>
      <div class="connection-direction">
        <strong>Incoming</strong>
        ${groupedRelationships(incoming, 'incoming', 'No explicit incoming relationships in this lens.')}
      </div>
      <p class="coverage-note">${escapeHtml(coverageDescription())}</p>
    </section>

    ${highlightedEdgeEvidence()}

    <section class="detail-section">
      <div class="section-heading">
        <h3>Explore this area</h3>
        <span>${expansion.total} direct</span>
      </div>
      <div class="branch-actions">
        <button class="expand-button" type="button" data-toggle-expand="${escapeHtml(node.id)}" aria-expanded="${expansion.expanded}">
          ${escapeHtml(expandLabel)}
        </button>
        ${expansion.hasMore
          ? `<button class="show-more-button" type="button" data-show-more="${escapeHtml(node.id)}">Show ${expansion.nextCount} more</button>`
          : ''}
        <button class="show-more-button" type="button" data-focus-selected="${escapeHtml(node.id)}">
          Focus on this area
        </button>
      </div>
      ${expansion.expanded && expansion.total > DEFAULT_BRANCH_CHUNK
        ? `<p class="branch-progress">${expansion.revealed} of ${expansion.total} direct neighbors revealed</p>`
        : ''}
    </section>

    <details class="detail-section provenance-detail">
      <summary>Where is its source?</summary>
      <div class="source-detail">
        <dl>
          <dt>Derivation</dt><dd>${escapeHtml(node.derivation)}</dd>
          <dt>Source</dt><dd>${escapeHtml(node.source?.locator || 'Unavailable')}</dd>
          <dt>Selector</dt><dd>${escapeHtml(node.source?.selector || 'Unavailable')}</dd>
        </dl>
        ${nodeSource ? `<a class="source-link" href="${escapeHtml(nodeSource)}" target="_blank" rel="noreferrer">Open canonical source ↗</a>` : ''}
      </div>
    </details>
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

      if (state.lens === 'agent-runtime') {
        const contents = semanticRevealInfo(node.id, 'contents');
        const connections = semanticRevealInfo(node.id, 'connections');
        return `
          <article class="map-node ${selected ? 'selected' : ''} ${pathNodes.has(node.id) ? 'in-path' : ''}">
            <button type="button" class="node-select" data-select-node="${escapeHtml(node.id)}" aria-pressed="${selected}">
              <span class="node-kicker">${escapeHtml(nodeTypeLabel(node.type))}</span>
              <strong>${escapeHtml(node.label)}</strong>
              <span class="node-meta">${contents.total} contents · ${connections.total} connections</span>
            </button>
            ${contents.total ? `
              <button type="button" class="branch-toggle" data-toggle-contents="${escapeHtml(node.id)}" aria-expanded="${contents.open}">
                ${contents.open ? 'Close contents' : `Open contents 1–${Math.min(contents.batchSize, contents.total)} of ${contents.total}`}
              </button>
            ` : ''}
            ${contents.open ? `<span class="node-meta semantic-progress">${escapeHtml(semanticRangeText(contents, 'contents'))}</span>` : ''}
            ${contents.hasPrevious ? `<button type="button" class="branch-toggle" data-show-previous-contents="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(contents, 'previous', 'contents'))}</button>` : ''}
            ${contents.hasNext ? `<button type="button" class="branch-toggle" data-show-more-contents="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(contents, 'next', 'contents'))}</button>` : ''}
            ${connections.total ? `
              <button type="button" class="branch-toggle" data-toggle-connections="${escapeHtml(node.id)}" aria-expanded="${connections.open}">
                ${connections.open ? 'Hide connections' : `Show connections 1–${Math.min(connections.batchSize, connections.total)} of ${connections.total}`}
              </button>
            ` : ''}
            ${connections.open ? `<span class="node-meta semantic-progress">${escapeHtml(semanticRangeText(connections, 'connections'))}</span>` : ''}
            ${connections.hasPrevious ? `<button type="button" class="branch-toggle" data-show-previous-connections="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(connections, 'previous', 'connections'))}</button>` : ''}
            ${connections.hasNext ? `<button type="button" class="branch-toggle" data-show-more-connections="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(connections, 'next', 'connections'))}</button>` : ''}
          </article>
        `;
      }

      const expansion = expansionInfo(node.id);
      const compactLabel = expansion.expanded
        ? 'Collapse'
        : expansion.total > DEFAULT_BRANCH_CHUNK
          ? `Expand ${DEFAULT_BRANCH_CHUNK}/${expansion.total}`
          : 'Expand';
      return `
        <article class="map-node ${selected ? 'selected' : ''} ${pathNodes.has(node.id) ? 'in-path' : ''}">
          <button type="button" class="node-select" data-select-node="${escapeHtml(node.id)}" aria-pressed="${selected}">
            <span class="node-kicker">${escapeHtml(nodeTypeLabel(node.type))}</span>
            <strong>${escapeHtml(node.label)}</strong>
            <span class="node-meta">${index.incoming.get(node.id).length} in · ${index.outgoing.get(node.id).length} out</span>
          </button>
          <button type="button" class="branch-toggle" data-toggle-expand="${escapeHtml(node.id)}" aria-expanded="${expansion.expanded}">
            ${escapeHtml(compactLabel)}
          </button>
          ${expansion.hasMore
            ? `<button type="button" class="branch-toggle branch-more" data-show-more="${escapeHtml(node.id)}">Show ${expansion.nextCount} more</button>`
            : ''}
        </article>
      `;
    }).join('');
}

function renderGraph({ preserveViewport = false, anchorNodeId = null, fitOnTopologyChange = true } = {}) {
  const visible = currentVisibleIds();
  const activeRenderer = ensureRenderer();

  renderFallbackNodes(visible);

  if (activeRenderer) {
    elements.canvas.hidden = false;
    activeRenderer.render({
      graph: state.graph,
      visibleIds: visible,
      selectedId: state.selectedId,
      path: activeVisualPath(),
      highlightedEdgeId: state.highlightedEdgeId,
      filters: {
        nodeType: state.typeFilter,
        relationship: state.relationshipFilter
      },
      layoutDirection: currentLensConfig()?.layoutDirection || 'vertical',
      preserveViewport,
      anchorNodeId,
      fitOnTopologyChange
    });
    return;
  }

  elements.canvas.hidden = true;
  elements.keyboardNav.open = true;
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

function renderSelectionActions() {
  if (!elements.selectionActions) return;
  const node = selectedNode();
  if (!node) {
    elements.selectionActions.hidden = true;
    elements.selectionActions.innerHTML = '';
    return;
  }

  elements.selectionActions.hidden = false;

  if (state.lens === 'agent-runtime') {
    const contents = semanticRevealInfo(node.id, 'contents');
    const connections = semanticRevealInfo(node.id, 'connections');
    elements.selectionActions.innerHTML = `
      <span class="selection-label"><strong>${escapeHtml(node.label)}</strong><span>${escapeHtml(nodeTypeLabel(node.type))}</span></span>
      <button type="button" data-inspect-selected="${escapeHtml(node.id)}">Inspect</button>
      ${contents.total ? `
        <button type="button" data-toggle-contents="${escapeHtml(node.id)}" aria-expanded="${contents.open}">
          ${contents.open ? 'Close contents' : `Open contents 1–${Math.min(contents.batchSize, contents.total)} of ${contents.total}`}
        </button>
      ` : ''}
      ${contents.open ? `<span class="semantic-progress">${escapeHtml(semanticRangeText(contents, 'contents'))}</span>` : ''}
      ${contents.hasPrevious ? `<button type="button" data-show-previous-contents="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(contents, 'previous', 'contents'))}</button>` : ''}
      ${contents.hasNext ? `<button type="button" data-show-more-contents="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(contents, 'next', 'contents'))}</button>` : ''}
      ${connections.total ? `
        <button type="button" data-toggle-connections="${escapeHtml(node.id)}" aria-expanded="${connections.open}">
          ${connections.open ? 'Hide connections' : `Show connections 1–${Math.min(connections.batchSize, connections.total)} of ${connections.total}`}
        </button>
      ` : ''}
      ${connections.open ? `<span class="semantic-progress">${escapeHtml(semanticRangeText(connections, 'connections'))}</span>` : ''}
      ${connections.hasPrevious ? `<button type="button" data-show-previous-connections="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(connections, 'previous', 'connections'))}</button>` : ''}
      ${connections.hasNext ? `<button type="button" data-show-more-connections="${escapeHtml(node.id)}">${escapeHtml(semanticPageLabel(connections, 'next', 'connections'))}</button>` : ''}
      <button type="button" data-focus-selected="${escapeHtml(node.id)}" aria-pressed="${state.focusId === node.id}">${state.focusId === node.id ? 'Focused' : 'Focus'}</button>
    `;
    return;
  }

  const expansion = expansionInfo(node.id);
  const expandText = expansion.expanded
    ? 'Collapse'
    : expansion.total > DEFAULT_BRANCH_CHUNK
      ? `Expand +${Math.min(DEFAULT_BRANCH_CHUNK, expansion.total)} of ${expansion.total}`
      : `Expand +${expansion.total}`;
  elements.selectionActions.innerHTML = `
    <span class="selection-label"><strong>${escapeHtml(node.label)}</strong><span>${escapeHtml(nodeTypeLabel(node.type))}</span></span>
    <button type="button" data-inspect-selected="${escapeHtml(node.id)}">Inspect</button>
    <button type="button" data-toggle-expand="${escapeHtml(node.id)}" aria-expanded="${expansion.expanded}">${escapeHtml(expandText)}</button>
    <button type="button" data-focus-selected="${escapeHtml(node.id)}" aria-pressed="${state.focusId === node.id}">${state.focusId === node.id ? 'Focused' : 'Focus'}</button>
  `;
}

function contextForQuestion(scope) {
  const visible = currentVisibleIds();
  const index = indexGraph(state.graph);
  const nodeIds = new Set();
  const edgeIds = new Set();

  const addEdge = edge => {
    edgeIds.add(edge.id);
    nodeIds.add(edge.from);
    nodeIds.add(edge.to);
  };

  if (scope === 'visible') {
    for (const id of visible) nodeIds.add(id);
    for (const edge of state.graph.edges) {
      if (visible.has(edge.from) && visible.has(edge.to)) addEdge(edge);
    }
  } else if (scope === 'path') {
    const path = activeVisualPath();
    for (const id of path?.nodes || []) nodeIds.add(id);
    for (const id of path?.edges || []) {
      const edge = state.graph.edges.find(item => item.id === id);
      if (edge) addEdge(edge);
    }
    if (state.selectedId) nodeIds.add(state.selectedId);
  } else if (state.selectedId) {
    nodeIds.add(state.selectedId);
    const direct = [
      ...(index.incoming.get(state.selectedId) || []),
      ...(index.outgoing.get(state.selectedId) || [])
    ];
    for (const edge of direct) {
      const otherId = edge.from === state.selectedId ? edge.to : edge.from;
      if (visible.has(otherId)) addEdge(edge);
    }
  }

  const nodes = [...nodeIds]
    .map(id => index.nodes.get(id))
    .filter(Boolean)
    .sort((a, b) => a.label.localeCompare(b.label));
  const edges = [...edgeIds]
    .map(id => state.graph.edges.find(edge => edge.id === id))
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id));

  return { nodes, edges };
}

function buildQuestionHandoff() {
  if (!state.graph) return '';
  const scope = elements.questionScope?.value || 'selected';
  const context = contextForQuestion(scope);
  const question = elements.question?.value.trim() || '[Add your question here]';
  const nodeLines = context.nodes.map(node => {
    const source = sourceUrl(node.source);
    return `- NODE ${node.id} | ${node.label} | type=${node.type} | owner=${node.owner || 'unknown'} | source=${source || node.source?.locator || 'unavailable'} | selector=${node.source?.selector || 'unavailable'}`;
  });
  const edgeLines = context.edges.map(edge => {
    const source = sourceUrl(edge.source);
    return `- EDGE ${edge.id} | ${edge.from} --${edge.relationship}--> ${edge.to} | source=${source || edge.source?.locator || 'unavailable'} | selector=${edge.source?.selector || 'unavailable'}`;
  });

  return [
    'Question:',
    question,
    '',
    'System Map context:',
    `Area: ${currentLensConfig()?.humanTitle || currentLensConfig()?.label || state.lens}`,
    `Technical lens: ${currentLensConfig()?.label || state.lens}`,
    `Graph scope: ${state.graph.scope}`,
    `Coverage: ${state.graph.coverage}`,
    `Context selection: ${scope}`,
    `Included: ${context.nodes.length} nodes, ${context.edges.length} relationships`,
    '',
    'Included map items:',
    ...(nodeLines.length ? nodeLines : ['- No nodes included.']),
    '',
    'Included relationships:',
    ...(edgeLines.length ? edgeLines : ['- No relationships included.']),
    '',
    'Evidence boundary:',
    '- This is a static, provenance-backed System Map projection, not a live execution trace.',
    '- Missing evidence is unknown, not proof that an action or route was skipped.',
    '- Do not infer reasoning quality, route compliance, or tool use unless supported by retrieved evidence.',
    '',
    'Answer requirements:',
    '- Cite relevant map node/edge IDs and their source records.',
    '- Keep observed/source-backed facts, inferences, hypotheses, and unknowns distinguishable.',
    '- Identify any additional evidence needed to answer reliably.'
  ].join('\n');
}

function renderQuestionContext() {
  if (!elements.questionPreview || !elements.questionSummary) return;
  const scope = elements.questionScope?.value || 'selected';
  const context = contextForQuestion(scope);
  elements.questionSummary.textContent = `${context.nodes.length} nodes · ${context.edges.length} relationships · ${state.graph.coverage}`;
  elements.questionPreview.textContent = buildQuestionHandoff();
}

async function copyQuestionHandoff() {
  const handoff = buildQuestionHandoff();
  if (!handoff) return;
  try {
    await navigator.clipboard.writeText(handoff);
    elements.questionCopyStatus.textContent = 'Copied. Paste this into the assistant you want to use.';
    announce('Question and explicit System Map context copied.');
  } catch {
    elements.questionCopyStatus.textContent = 'Clipboard unavailable. Select and copy the preview below.';
    announce('Clipboard unavailable; question context remains visible in the preview.');
  }
}

function render(options = {}) {
  renderStatus();
  renderGraph(options);
  renderDetails();
  renderPath();
  renderSelectionActions();
  renderTrail();
  renderQuestionContext();
}

function selectNode(id) {
  if (state.selectedId !== id) pushNavigationCheckpoint();
  state.selectedId = id;
  recordExplorationLocation(id);
  state.focusId = null;
  state.highlightedEdgeId = null;
  render({ preserveViewport: true, anchorNodeId: id, fitOnTopologyChange: false });
  updateUrlState();
  announce(state.lens === 'agent-runtime'
    ? `Selected ${selectedNode()?.label || id}. Inspect it, open contents, show connections, or focus the area as available.`
    : `Selected ${selectedNode()?.label || id}. Inspect, expand, or focus this area.`);
}

function highlightEdge(id) {
  const edge = state.graph?.edges.find(item => item.id === id);
  if (!edge) return;
  state.highlightedEdgeId = state.highlightedEdgeId === id ? null : id;
  render({ preserveViewport: true, anchorNodeId: state.selectedId, fitOnTopologyChange: false });
  updateUrlState();
  announce(state.highlightedEdgeId ? `Showing evidence for ${relationshipLabel(edge.relationship)} relationship.` : 'Relationship evidence cleared.');
}

function toggleExpanded(id) {
  pushNavigationCheckpoint();
  if (state.expanded.has(id)) {
    state.expanded.delete(id);
    state.expansionLimits.delete(id);
  } else {
    state.expanded.add(id);
    state.expansionLimits.set(id, DEFAULT_BRANCH_CHUNK);
  }
  state.selectedId = id;
  state.focusId = null;
  render({ preserveViewport: true, anchorNodeId: id, fitOnTopologyChange: false });
  updateUrlState();
  announce(`${state.expanded.has(id) ? 'Expanded' : 'Collapsed'} ${selectedNode()?.label || id} without resetting the viewport.`);
}

function toggleSemanticReveal(id, kind) {
  if (state.lens !== 'agent-runtime') return;
  const openSet = kind === 'contents' ? state.expanded : state.connections;
  const limits = kind === 'contents' ? state.expansionLimits : state.connectionLimits;
  const offsets = kind === 'contents' ? state.contentOffsets : state.connectionOffsets;
  const info = semanticRevealInfo(id, kind);
  if (!info.total) return;

  pushNavigationCheckpoint();

  if (openSet.has(id)) {
    openSet.delete(id);
    limits.delete(id);
    offsets.delete(id);
  } else {
    openSet.add(id);
    limits.set(id, info.batchSize);
    offsets.set(id, 0);
  }

  state.selectedId = id;
  recordExplorationLocation(id);
  state.focusId = null;
  render({ preserveViewport: true, anchorNodeId: id, fitOnTopologyChange: false });
  updateUrlState();
  const updated = semanticRevealInfo(id, kind);
  announce(openSet.has(id)
    ? `Showing ${semanticRangeText(updated, kind)} for ${selectedNode()?.label || id}.`
    : `${kind === 'contents' ? 'Closed contents for' : 'Hidden connections for'} ${selectedNode()?.label || id}.`);
}

function pageSemanticReveal(id, kind, direction = 'next') {
  if (state.lens !== 'agent-runtime') return;
  const openSet = kind === 'contents' ? state.expanded : state.connections;
  const limits = kind === 'contents' ? state.expansionLimits : state.connectionLimits;
  const offsets = kind === 'contents' ? state.contentOffsets : state.connectionOffsets;
  const info = semanticRevealInfo(id, kind);
  if (!info.total || !info.open) return;

  const nextWindow = neighborhoodWindow({
    total: info.total,
    offset: info.offset,
    batchSize: info.batchSize,
    direction
  });
  if (nextWindow.offset === info.offset) return;

  pushNavigationCheckpoint();
  openSet.add(id);
  limits.set(id, info.batchSize);
  offsets.set(id, nextWindow.offset);
  state.selectedId = id;
  recordExplorationLocation(id);
  state.focusId = null;
  render({ preserveViewport: true, anchorNodeId: id, fitOnTopologyChange: false });
  updateUrlState();
  announce(`Showing ${kind} ${nextWindow.start}–${nextWindow.end} of ${nextWindow.total} for ${selectedNode()?.label || id}.`);
}

function showMoreNeighbors(id) {
  const total = directNeighbors(state.graph, id).nodes.length;
  if (!total) return;
  pushNavigationCheckpoint();
  state.expanded.add(id);
  const current = Number(state.expansionLimits.get(id) ?? DEFAULT_BRANCH_CHUNK);
  const next = Math.min(total, current + DEFAULT_BRANCH_CHUNK);
  state.expansionLimits.set(id, next);
  state.selectedId = id;
  render({ preserveViewport: true, anchorNodeId: id, fitOnTopologyChange: false });
  updateUrlState();
  announce(`Showing ${next} of ${total} direct neighbors for ${selectedNode()?.label || id} without resetting the viewport.`);
}

function focusSelectedNode(id = state.selectedId) {
  if (!id || !state.graph.nodes.some(node => node.id === id)) return;
  pushNavigationCheckpoint();
  state.selectedId = id;
  state.focusId = id;
  state.path = null;
  state.focusPath = nearestRootPath(id);
  state.highlightedEdgeId = null;
  render({ fitOnTopologyChange: true });
  updateUrlState();
  requestAnimationFrame(() => ensureRenderer()?.focus(id));
  announce(`Focused the map around ${selectedNode()?.label || id} and its bounded direct context.`);
}

function inspectSelectedNode() {
  const heading = elements.details?.querySelector('h2');
  if (!heading) return;
  const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  heading.focus({ preventScroll: true });
  elements.details.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
  announce(`Inspector focused for ${selectedNode()?.label || 'selected node'}.`);
}

function reset() {
  pushNavigationCheckpoint();
  state.selectedId = null;
  state.expanded = initialExpandedIds(state.graph);
  state.expansionLimits = new Map();
  state.connections = new Set();
  state.connectionLimits = new Map();
  state.path = null;
  state.focusPath = null;
  state.focusId = null;
  state.highlightedEdgeId = null;
  state.typeFilter = '';
  state.relationshipFilter = '';
  elements.pathFrom.value = '';
  elements.pathTo.value = '';
  elements.search.value = '';
  elements.typeFilter.value = '';
  elements.relationshipFilter.value = '';
  render();
  updateUrlState();
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
  pushNavigationCheckpoint();
  state.path = findPath(state.graph, from, to);
  state.focusPath = null;
  state.focusId = null;
  state.highlightedEdgeId = null;
  render();
  updateUrlState();
  if (state.path) {
    requestAnimationFrame(() => ensureRenderer()?.fit());
  }
  announce(state.path ? 'Explicit path shown.' : 'No explicit path found in this lens.');
}

function focusSearchResult() {
  const node = searchNode(elements.search.value);
  if (!node) {
    announce('No matching System Map node found.');
    return;
  }

  pushNavigationCheckpoint();
  state.selectedId = node.id;
  state.path = null;
  state.focusPath = nearestRootPath(node.id);
  state.focusId = node.id;
  state.highlightedEdgeId = null;
  elements.search.value = node.label;
  render();
  updateUrlState();
  requestAnimationFrame(() => ensureRenderer()?.focus(node.id));
  announce(`Focused ${node.label}.`);
}

async function restoreNavigationSnapshot(snapshot) {
  if (!snapshot) return;
  if (snapshot.mode === 'overview' || snapshot.lens === 'overview') {
    showOverview({ rememberCurrent: false });
    return;
  }
  if (snapshot.lens !== state.lens || state.mode !== 'graph') {
    await loadLens(snapshot.lens, { viewSnapshot: snapshot, rememberCurrent: false });
    return;
  }
  applyViewSnapshot(snapshot);
  render({ fitOnTopologyChange: !snapshot.viewport });
  if (snapshot.viewport || snapshot.positions?.length) {
    const activeRenderer = ensureRenderer();
    if (snapshot.positions?.length) activeRenderer?.restoreNodePositions(snapshot.positions);
    if (snapshot.viewport) activeRenderer?.restoreViewport(snapshot.viewport);
  }
  updateUrlState();
}

async function goBack() {
  const snapshot = navigationStack.pop();
  if (!snapshot) {
    announce('No earlier exploration state is available.');
    renderTrail();
    return;
  }
  saveCurrentLensState();
  await restoreNavigationSnapshot(snapshot);
  announce(`Returned to ${snapshotLabel(snapshot)}.`);
}

function applyFilters() {
  state.typeFilter = elements.typeFilter.value;
  state.relationshipFilter = elements.relationshipFilter.value;
  render();
  updateUrlState();
  announce('Graph filters updated.');
}

function setGraphControlsVisible(visible) {
  for (const element of elements.graphOnly) element.hidden = !visible;
}

function showOverview({ rememberCurrent = true } = {}) {
  if (rememberCurrent && state.mode === 'graph' && state.graph) saveCurrentLensState();

  state.mode = 'overview';
  state.lens = 'overview';
  state.graph = null;
  state.selectedId = null;
  state.focusId = null;
  state.path = null;
  state.focusPath = null;
  state.highlightedEdgeId = null;

  elements.error.hidden = true;
  elements.explorer.hidden = true;
  elements.overview.hidden = false;
  elements.lens.value = 'overview';
  elements.sourceLink.hidden = true;
  setGraphControlsVisible(false);
  elements.status.innerHTML = '<span class="status-dot" aria-hidden="true"></span><strong>System overview</strong><span>Choose an area to open its provenance-backed graph.</span>';

  renderTrail();
  updateUrlState();
  announce('System overview shown. Choose one of five areas to explore.');
}

function showLoadError(error, config) {
  elements.status.innerHTML = '<strong>System Map unavailable</strong>';
  elements.explorer.hidden = true;
  elements.error.hidden = false;
  elements.errorMessage.textContent = error.message;
  if (config?.sourceUrl) elements.sourceFallback.href = config.sourceUrl;
}

async function loadLens(lens, { restoreUrl = false, viewSnapshot = null, rememberCurrent = true } = {}) {
  const config = lensConfigs[lens];
  if (!config?.graphUrl) {
    elements.lens.value = state.lens;
    announce('That lens is not mapped yet.');
    return;
  }

  if (rememberCurrent && state.mode === 'graph' && state.graph && state.lens !== lens) saveCurrentLensState();

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

    state.mode = 'graph';
    state.lens = lens;
    state.graph = graph;
    state.selectedId = null;
    state.expanded = initialExpandedIds(graph);
    state.expansionLimits = new Map();
    state.connections = new Set();
    state.connectionLimits = new Map();
    state.path = null;
    state.focusPath = null;
    state.focusId = null;
    state.highlightedEdgeId = null;
    state.typeFilter = '';
    state.relationshipFilter = '';
    elements.search.value = '';
    elements.lens.value = lens;
    elements.overview.hidden = true;
    elements.sourceLink.hidden = false;
    elements.sourceLink.href = config.sourceUrl;
    elements.sourceFallback.href = config.sourceUrl;
    elements.explorerHeading.textContent = config.humanTitle || config.label;
    elements.explorerDescription.textContent = config.description || 'Select a node to inspect its explicit relationships.';
    elements.explorerLensLabel.textContent = `Technical view · ${config.label}`;
    setGraphControlsVisible(true);
    renderPathControls();
    populateExploreControls();
    const savedView = viewSnapshot || (!restoreUrl ? lensViewStates.get(lens) : null);
    if (savedView) applyViewSnapshot(savedView);
    if (restoreUrl) restoreUrlState();
    elements.explorer.hidden = false;
    render({ fitOnTopologyChange: !savedView?.viewport });
    if (savedView?.viewport || savedView?.positions?.length) {
      const activeRenderer = ensureRenderer();
      if (savedView?.positions?.length) activeRenderer?.restoreNodePositions(savedView.positions);
      if (savedView?.viewport) activeRenderer?.restoreViewport(savedView.viewport);
    }
    updateUrlState();
    announce(savedView ? `${config.label} lens restored.` : `${config.label} lens loaded.`);
  } catch (error) {
    showLoadError(error, config);
  }
}

function bindEvents() {
  root.addEventListener('click', event => {
    const openLens = event.target.closest('[data-open-lens]');
    if (openLens) {
      pushNavigationCheckpoint();
      loadLens(openLens.dataset.openLens);
      return;
    }
    const inspect = event.target.closest('[data-inspect-selected]');
    if (inspect) {
      inspectSelectedNode();
      return;
    }
    const focus = event.target.closest('[data-focus-selected]');
    if (focus) {
      focusSelectedNode(focus.dataset.focusSelected);
      return;
    }
    const edgeHighlight = event.target.closest('[data-highlight-edge]');
    if (edgeHighlight) {
      highlightEdge(edgeHighlight.dataset.highlightEdge);
      return;
    }
    const select = event.target.closest('[data-select-node]');
    if (select) {
      selectNode(select.dataset.selectNode);
      return;
    }
    const toggleContents = event.target.closest('[data-toggle-contents]');
    if (toggleContents) {
      toggleSemanticReveal(toggleContents.dataset.toggleContents, 'contents');
      return;
    }
    const toggleConnections = event.target.closest('[data-toggle-connections]');
    if (toggleConnections) {
      toggleSemanticReveal(toggleConnections.dataset.toggleConnections, 'connections');
      return;
    }
    const moreContents = event.target.closest('[data-show-more-contents]');
    if (moreContents) {
      showMoreSemantic(moreContents.dataset.showMoreContents, 'contents');
      return;
    }
    const moreConnections = event.target.closest('[data-show-more-connections]');
    if (moreConnections) {
      showMoreSemantic(moreConnections.dataset.showMoreConnections, 'connections');
      return;
    }
    const showMore = event.target.closest('[data-show-more]');
    if (showMore) {
      showMoreNeighbors(showMore.dataset.showMore);
      return;
    }
    const expand = event.target.closest('[data-toggle-expand]');
    if (expand) toggleExpanded(expand.dataset.toggleExpand);
  });
  elements.back?.addEventListener('click', goBack);
  elements.reset.addEventListener('click', reset);
  elements.fit.addEventListener('click', fitGraph);
  elements.searchGo.addEventListener('click', focusSearchResult);
  elements.search.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      focusSearchResult();
    }
  });
  elements.typeFilter.addEventListener('change', applyFilters);
  elements.relationshipFilter.addEventListener('change', applyFilters);
  document.getElementById('find-path').addEventListener('click', findSelectedPath);
  elements.questionScope?.addEventListener('change', renderQuestionContext);
  elements.question?.addEventListener('input', renderQuestionContext);
  elements.questionCopy?.addEventListener('click', copyQuestionHandoff);
  elements.lens.addEventListener('change', async () => {
    pushNavigationCheckpoint();
    if (elements.lens.value === 'overview') {
      showOverview();
      return;
    }
    await loadLens(elements.lens.value);
  });
}

bindEvents();
const initialParams = new URLSearchParams(globalThis.location.search);
const requestedLens = initialParams.get('lens');
if (requestedLens && lensConfigs[requestedLens]) {
  loadLens(requestedLens, { restoreUrl: true });
} else {
  showOverview({ rememberCurrent: false });
}
