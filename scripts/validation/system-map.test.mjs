import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  validateGraph,
  rootNodeIds,
  directNeighbors,
  visibleNodeIds,
  findPath,
  sourceUrl
} from '../../client/system-map-graph.mjs';
import {
  DEFAULT_BRANCH_CHUNK,
  MIN_READABLE_ZOOM,
  SystemMapRenderer,
  boundedVisibleNodeIds,
  initialExpandedIds,
  localRevealBatchSize,
  localRevealCamera,
  panForVisibleBounds,
  planLocalNodePositions,
  rectangleFromCenter,
  rectanglesOverlap,
  rendererElements
} from '../../client/system-map-renderer.mjs';

const graph = {
  version: 'system-map.graph/v0.1',
  scope: 'domain:work-coordination',
  coverage: 'known-explicit',
  nodes: [
    { id: 'a:one', label: 'One', type: 'coordination-surface', owner: 'repo:test', derivation: 'contract-derived', source: { kind: 'repo-file', locator: 'rickvang/persona-workspace:docs/HOW-IT-WORKS.md', selector: 'one' } },
    { id: 'a:two', label: 'Two', type: 'coordination-surface', owner: 'repo:test', derivation: 'contract-derived', source: { kind: 'repo-file', locator: 'rickvang/persona-workspace:docs/HOW-IT-WORKS.md', selector: 'two' } },
    { id: 'a:three', label: 'Three', type: 'truth-kind', owner: 'repo:test', derivation: 'contract-derived', source: { kind: 'repo-file', locator: 'rickvang/persona-workspace:docs/HOW-IT-WORKS.md', selector: 'three' } }
  ],
  edges: [
    { id: 'edge:a:one--connects--a:two', from: 'a:one', to: 'a:two', relationship: 'connects', derivation: 'contract-derived', source: { kind: 'repo-file', locator: 'rickvang/persona-workspace:docs/HOW-IT-WORKS.md', selector: 'one-two' } },
    { id: 'edge:a:two--connects--a:three', from: 'a:two', to: 'a:three', relationship: 'connects', derivation: 'contract-derived', source: { kind: 'repo-file', locator: 'rickvang/persona-workspace:docs/HOW-IT-WORKS.md', selector: 'two-three' } }
  ]
};

test('System Map graph helpers support progressive disclosure and paths', () => {
  validateGraph(graph);
  assert.deepEqual(rootNodeIds(graph), ['a:one']);
  assert.deepEqual(directNeighbors(graph, 'a:one').nodes.map(node => node.id), ['a:two']);
  assert.deepEqual([...visibleNodeIds(graph)], ['a:one']);
  assert.deepEqual([...visibleNodeIds(graph, ['a:one'])].sort(), ['a:one', 'a:two']);
  assert.deepEqual(findPath(graph, 'a:one', 'a:three'), {
    nodes: ['a:one', 'a:two', 'a:three'],
    edges: ['edge:a:one--connects--a:two', 'edge:a:two--connects--a:three']
  });
});

test('System Map renderer derives bounded view state without introducing graph facts', () => {
  assert.deepEqual([...initialExpandedIds(graph)], ['a:one']);
  const visible = visibleNodeIds(graph, initialExpandedIds(graph));
  const elements = rendererElements(graph, visible);
  const nodeIds = elements.filter(item => item.group === 'nodes').map(item => item.data.id).sort();
  const edgeIds = elements.filter(item => item.group === 'edges').map(item => item.data.id).sort();
  assert.deepEqual(nodeIds, ['a:one', 'a:two']);
  assert.deepEqual(edgeIds, ['edge:a:one--connects--a:two']);
  assert.ok(elements.every(item => graph.nodes.some(node => node.id === item.data.id) || graph.edges.some(edge => edge.id === item.data.id)));

  const dense = {
    ...graph,
    nodes: [graph.nodes[0], ...Array.from({ length: 30 }, (_, index) => ({ ...graph.nodes[1], id: 'dense:' + index, label: 'Dense ' + index }))],
    edges: Array.from({ length: 30 }, (_, index) => ({ ...graph.edges[0], id: 'dense-edge:' + index, from: 'a:one', to: 'dense:' + index }))
  };
  assert.equal(initialExpandedIds(dense).size, 0, 'dense roots should stay collapsed by default');

  const firstChunk = boundedVisibleNodeIds(
    dense,
    new Set(['a:one']),
    new Map([['a:one', DEFAULT_BRANCH_CHUNK]])
  );
  assert.equal(firstChunk.size, DEFAULT_BRANCH_CHUNK + 1, 'manual expansion should reveal one bounded neighbor chunk plus the root');

  const allNeighbors = boundedVisibleNodeIds(
    dense,
    new Set(['a:one']),
    new Map([['a:one', 48]])
  );
  assert.equal(allNeighbors.size, 31, 'show-more state may reveal the remaining canonical neighbors');

  const seededTarget = boundedVisibleNodeIds(
    dense,
    new Set(),
    new Map(),
    { seedIds: ['dense:29'] }
  );
  assert.ok(seededTarget.has('dense:29'), 'search/path focus may reveal a canonical target outside the current chunk');
});

test('System Map local reveal placement preserves retained geometry and avoids occupied slots across repeated batches', () => {
  const anchor = { id: 'anchor', x: 0, y: 0, width: 144, height: 54 };
  const occupied = [
    anchor,
    { id: 'existing-right', x: 230, y: 0, width: 144, height: 54 },
    { id: 'existing-down', x: 0, y: 100, width: 144, height: 54 }
  ];
  const occupiedBefore = structuredClone(occupied);
  const firstNodes = Array.from({ length: 4 }, (_, index) => ({
    id: 'first:' + index,
    width: 144,
    height: 54,
    direction: 'outgoing'
  }));

  const first = planLocalNodePositions({
    anchor,
    nodes: firstNodes,
    occupied,
    layoutDirection: 'horizontal'
  });

  assert.deepEqual(occupied, occupiedBefore, 'planning a reveal must not mutate retained node geometry');
  assert.equal(first.size, firstNodes.length);

  const firstRects = [...first].map(([id, position]) => rectangleFromCenter({
    id,
    ...position,
    width: 144,
    height: 54
  }));

  for (const rect of firstRects) {
    assert.ok(
      occupied.every(existing => !rectanglesOverlap(rect, rectangleFromCenter(existing), 10)),
      'newly revealed nodes must not overlap retained nodes'
    );
  }
  for (let i = 0; i < firstRects.length; i += 1) {
    for (let j = i + 1; j < firstRects.length; j += 1) {
      assert.equal(rectanglesOverlap(firstRects[i], firstRects[j], 10), false, 'nodes in one reveal batch must not overlap');
    }
  }

  const secondOccupied = [...occupied, ...firstRects];
  const secondNodes = Array.from({ length: 3 }, (_, index) => ({
    id: 'second:' + index,
    width: 144,
    height: 54,
    direction: 'outgoing'
  }));
  const second = planLocalNodePositions({
    anchor,
    nodes: secondNodes,
    occupied: secondOccupied,
    layoutDirection: 'horizontal'
  });
  const secondRects = [...second].map(([id, position]) => rectangleFromCenter({
    id,
    ...position,
    width: 144,
    height: 54
  }));

  for (const rect of secondRects) {
    assert.ok(
      secondOccupied.every(existing => !rectanglesOverlap(rect, rectangleFromCenter(existing), 10)),
      'show-more batches must avoid every slot already occupied by prior reveals'
    );
  }
});

test('System Map local reveal camera keeps readable zoom and can recover a clipped selected node', () => {
  const camera = localRevealCamera({
    bounds: { x1: -80, x2: 820, y1: -40, y2: 560, width: 900, height: 600 },
    canvasWidth: 800,
    canvasHeight: 500,
    currentZoom: 2.3,
    padding: 32
  });

  assert.ok(camera.zoom < 2.3, 'camera should zoom out when panning alone cannot fit the revealed neighborhood');
  assert.ok(camera.zoom >= MIN_READABLE_ZOOM, 'camera must preserve a readable minimum zoom');
  assert.equal(camera.fits, true, 'a moderate local neighborhood should fit after the bounded zoom adjustment');

  const oversized = localRevealCamera({
    bounds: { x1: -500, x2: 2500, y1: -500, y2: 1500, width: 3000, height: 2000 },
    canvasWidth: 800,
    canvasHeight: 500,
    currentZoom: 2.3,
    padding: 32
  });
  assert.equal(oversized.zoom, MIN_READABLE_ZOOM);
  assert.equal(oversized.fits, false, 'an oversized neighborhood should remain explicitly too large instead of shrinking below readable zoom');

  const selectedBounds = { x1: -24, x2: 120, y1: 110, y2: 164, width: 144, height: 54 };
  const pan = panForVisibleBounds({
    bounds: selectedBounds,
    canvasWidth: 800,
    canvasHeight: 500,
    padding: 32
  });
  assert.ok(selectedBounds.x1 + pan.x >= 32, 'selected node should be moved back inside the readable safe area');

  assert.equal(localRevealBatchSize({ total: 10, viewportWidth: 1000, viewportHeight: 600, kind: 'connections' }), 4);
  assert.equal(localRevealBatchSize({ total: 10, viewportWidth: 520, viewportHeight: 600, kind: 'connections' }), 2);
});

test('System Map position and viewport snapshots restore a recognizable prior view', () => {
  const makeNode = (id, initial) => {
    let point = { ...initial };
    return {
      id: () => id,
      position(next) {
        if (next) point = { ...next };
        return { ...point };
      }
    };
  };
  const nodes = [
    makeNode('a', { x: 100, y: 120 }),
    makeNode('b', { x: 340, y: 120 })
  ];
  let zoom = 1.1;
  let pan = { x: 28, y: 36 };
  const fakeCy = {
    nodes: () => nodes,
    zoom(next) {
      if (typeof next === 'number') zoom = next;
      return zoom;
    },
    pan(next) {
      if (next) pan = { ...next };
      return { ...pan };
    }
  };

  const renderer = new SystemMapRenderer({
    container: {},
    cytoscapeFactory: () => ({})
  });
  renderer.cy = fakeCy;

  const positions = renderer.getNodePositions();
  const viewport = renderer.getViewport();
  nodes[0].position({ x: -400, y: -400 });
  nodes[1].position({ x: 900, y: 700 });
  fakeCy.zoom(0.5);
  fakeCy.pan({ x: -200, y: 90 });

  renderer.restoreNodePositions(positions);
  renderer.restoreViewport(viewport);

  assert.deepEqual(renderer.getNodePositions(), positions, 'Back/collapse restoration should recover prior node positions');
  assert.deepEqual(renderer.getViewport(), viewport, 'Back/collapse restoration should recover prior viewport');
});

test('System Map provenance resolves repository files without copying source content', () => {
  assert.equal(
    sourceUrl(graph.nodes[0].source),
    'https://github.com/rickvang/persona-workspace/blob/main/docs/HOW-IT-WORKS.md'
  );
});

test('System Map Site consumes domain-owned graphs without copying graph facts into presentation', async () => {
  const [page, client, renderer, build] = await Promise.all([
    fs.readFile(new URL('../../content/site-pages/system-map.html', import.meta.url), 'utf8'),
    fs.readFile(new URL('../../client/system-map.mjs', import.meta.url), 'utf8'),
    fs.readFile(new URL('../../client/system-map-renderer.mjs', import.meta.url), 'utf8'),
    fs.readFile(new URL('../../scripts/build-library.mjs', import.meta.url), 'utf8')
  ]);

  assert.match(page, /raw\.githubusercontent\.com\/rickvang\/persona-workspace\/main\/system-map\/generated\/work-coordination\.json/);
  assert.match(page, /raw\.githubusercontent\.com\/rickvang\/persona-workspace\/main\/system-map\/generated\/repository-ownership\.json/);
  assert.match(page, /data\/system-map\/persona-skill\.json/);
  assert.match(page, /data\/system-map\/source-generated\.json/);
  assert.match(page, /data\/system-map\/agent-runtime\.json/);
  assert.match(page, /id="map-overview"/);
  assert.match(page, /<option value="overview">System overview<\/option>/);
  assert.match(page, /How the Persona Workspace fits together/);
  assert.match(page, /these five areas are navigation only/);
  assert.match(page, /How agents get oriented/);
  assert.match(page, /Personas &amp; capabilities/);
  assert.match(page, /Work &amp; verification/);
  assert.match(page, /Repositories &amp; ownership/);
  assert.match(page, /Sources &amp; generated outputs/);
  assert.match(page, /data-open-lens="agent-runtime"/);
  assert.match(page, /data-open-lens="persona-skill"/);
  assert.match(page, /data-open-lens="work-coordination"/);
  assert.match(page, /data-open-lens="repository-ownership"/);
  assert.match(page, /data-open-lens="source-generated"/);
  assert.match(page, /aria-label="Open how agents get oriented"/);
  assert.match(page, />Open<\/span><span aria-hidden="true">→<\/span>/);
  assert.doesNotMatch(page, /id="map-fit-inline"/);
  assert.match(page, /Open contents/);
  assert.match(page, /Show connections/);
  assert.match(page, /<option value="repository-ownership">Repository ownership<\/option>/);
  assert.match(page, /<option value="persona-skill">Persona \/ Skill<\/option>/);
  assert.match(page, /<option value="source-generated">Source \/ generated · advanced<\/option>/);
  assert.match(page, /<option value="agent-runtime">Agent \/ runtime · advanced<\/option>/);
  assert.doesNotMatch(page, /<section class="hero">/);
  assert.doesNotMatch(page, /<section class="lens-grid"/);
  assert.doesNotMatch(page, /Not mapped yet/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /cdn\.jsdelivr\.net\/npm\/cytoscape@3\.34\.3\/dist\/cytoscape\.min\.js/);
  assert.match(page, /id="map-canvas"/);
  assert.match(page, /id="map-fit"/);
  assert.match(page, /id="map-node-fallback"/);
  assert.match(page, /id="map-keyboard-nav"/);
  assert.match(page, /Keyboard node navigator/);
  assert.match(page, /equivalent textual way to inspect and expand/);
  assert.match(page, /id="map-search"/);
  assert.match(page, /id="map-back"/);
  assert.match(page, /id="map-trail"/);
  assert.match(page, /id="map-selection-actions"/);
  assert.match(page, /id="explorer-lens-label"/);
  assert.match(page, /id="explorer-description"/);
  assert.match(page, /class="inspector-rail"/);
  assert.match(page, /id="map-question"/);
  assert.match(page, /id="map-question-scope"/);
  assert.match(page, /id="map-copy-question"/);
  assert.match(page, /class="graph-legend"/);
  assert.match(page, /Exact relationship/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /branch-progress/);
  assert.match(page, /show-more-button/);
  assert.match(page, /id="map-type-filter"/);
  assert.match(page, /id="map-relationship-filter"/);
  assert.match(page, /System Map/);
  assert.doesNotMatch(page, /concept:current-work|repository:rickvang\/portfolio|persona:ui-expert|skill:skill-architecture-decision-making|edge:concept:/);
  assert.doesNotMatch(client, /concept:current-work|repository:rickvang\/portfolio|persona:ui-expert|skill:skill-architecture-decision-making|edge:concept:/);
  assert.match(client, /lensConfigs/);
  assert.match(client, /humanTitle: 'How agents get oriented'/);
  assert.match(client, /humanTitle: 'Personas & capabilities'/);
  assert.match(client, /humanTitle: 'Work & verification'/);
  assert.match(client, /humanTitle: 'Repositories & ownership'/);
  assert.match(client, /humanTitle: 'Sources & generated outputs'/);
  assert.match(client, /mode: 'overview'/);
  assert.match(client, /showOverview/);
  assert.match(client, /setGraphControlsVisible/);
  assert.match(client, /data-open-lens/);
  assert.match(client, /SystemMapRenderer/);
  assert.match(client, /initialExpandedIds/);
  assert.match(client, /nearestRootPath/);
  assert.match(client, /lensViewStates/);
  assert.match(client, /navigationStack/);
  assert.match(client, /captureViewSnapshot/);
  assert.match(client, /applyViewSnapshot/);
  assert.match(client, /updateUrlState/);
  assert.match(client, /URLSearchParams/);
  assert.match(client, /relationshipFilter/);
  assert.match(client, /typeFilter/);
  assert.match(client, /highlightedEdgeId/);
  assert.match(client, /data-highlight-edge/);
  assert.match(client, /DEFAULT_BRANCH_CHUNK/);
  assert.match(client, /boundedVisibleNodeIds/);
  assert.match(client, /data-show-more/);
  assert.match(client, /showMoreNeighbors/);
  assert.match(client, /url\.searchParams\.set\('edge'/);
  assert.match(client, /url\.searchParams\.set\('focus'/);
  assert.match(client, /buildQuestionHandoff/);
  assert.match(client, /Area:/);
  assert.match(client, /Technical lens:/);
  assert.match(client, /Missing evidence is unknown/);
  assert.match(client, /data-focus-selected/);
  assert.match(client, /semanticNeighborGroups/);
  assert.match(client, /semanticRevealInfo/);
  assert.match(client, /data-toggle-contents/);
  assert.match(client, /data-toggle-connections/);
  assert.match(client, /Show connections/);
  assert.match(client, /Open contents/);
  assert.match(client, /agent:repository-dispatcher/);
  assert.match(client, /Chooses the shortest applicable activation path/);
  assert.match(client, /Connections relate separate entities/);
  assert.doesNotMatch(client, /fitInline/);
  assert.match(client, /groupedRelationships/);
  assert.match(client, /layoutDirection: 'horizontal'/);
  assert.match(client, /layoutDirection: 'vertical'/);
  assert.match(renderer, /layoutDirection = 'vertical'/);
  assert.match(renderer, /preserveViewport = false/);
  assert.match(renderer, /anchorNodeId = null/);
  assert.match(renderer, /getViewport\(\)/);
  assert.match(renderer, /restoreViewport\(viewport\)/);
  assert.match(renderer, /positionLocalTopology/);
  assert.match(renderer, /revealLocalTopology/);
  assert.match(renderer, /previousPositions/);
  assert.match(renderer, /addedNodeIds/);
  assert.match(renderer, /renderedBoundingBox/);
  assert.match(renderer, /panBy/);
  assert.match(renderer, /transform: layoutDirection === 'horizontal'/);
  assert.match(client, /renderFallbackNodes\(visible\)/);
  assert.match(client, /keyboardNav\.open = true/);
  assert.doesNotMatch(client, /graphFallback\.hidden = true/);
  assert.match(renderer, /cytoscapeFactory/);
  assert.match(renderer, /breadthfirst/);
  assert.match(renderer, /rendererElements/);
  assert.match(renderer, /boundedVisibleNodeIds/);
  assert.match(renderer, /DEFAULT_BRANCH_CHUNK = 24/);
  assert.match(renderer, /filtered-out/);
  assert.match(renderer, /filters = \{\}/);
  assert.match(renderer, /highlightedEdgeId = null/);
  assert.match(renderer, /exact-edge/);
  assert.match(client, /repository-ownership/);
  assert.match(client, /persona-skill/);
  assert.match(client, /source-generated/);
  assert.match(client, /agent-runtime/);
  assert.match(client, /does not report live Tool, connector, permission, deployment, or model availability/);
  assert.match(client, /fetch\(config\.graphUrl/);
  assert.match(client, /complete-for-scope/);
  assert.match(client, /Expand first/);
  assert.match(client, /Collapse branch/);
  assert.match(client, /What is this\?/);
  assert.match(client, /What belongs here\?/);
  assert.match(client, /How does it connect\?/);
  assert.match(build, /"system-map\.html"/);
  assert.match(build, /client\/system-map-graph\.mjs/);
  assert.match(build, /client\/system-map-renderer\.mjs/);
  assert.match(build, /client\/system-map\.mjs/);
  assert.match(build, /buildPersonaSkillSystemMap/);
  assert.match(build, /buildTechnicalSystemMaps/);
  assert.match(client, /requestedLens/);
  assert.match(client, /if \(requestedLens && lensConfigs\[requestedLens\]\)/);
  assert.match(client, /showOverview\(\{ rememberCurrent: false \}\)/);
  assert.match(client, /url\.searchParams\.set\('lens', 'overview'\)/);
  assert.doesNotMatch(page + client + renderer, /file:content\/library-data\.js|route:tool-resolution|skill-package:\.agents\/skills\/tool-discovery-and-safe-execution/);
  assert.doesNotMatch(page + client + renderer, /overview-node:|overview-edge:|relationship:overview/);
});


test('System Map provenance also resolves the Repository Ownership registry source', () => {
  assert.equal(
    sourceUrl({ kind: 'repo-file', locator: 'rickvang/persona-workspace:repositories.json', selector: 'repositories' }),
    'https://github.com/rickvang/persona-workspace/blob/main/repositories.json'
  );
});
