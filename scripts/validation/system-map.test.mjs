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
  initialExpandedIds,
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
  assert.match(page, /Repository ownership<\/strong>[\s\S]*Available/);
  assert.match(page, /Persona \/ Skill<\/strong>[\s\S]*Available/);
  assert.match(page, /Source \/ generated<\/strong>[\s\S]*Available · advanced/);
  assert.match(page, /Agent \/ runtime<\/strong>[\s\S]*Available · advanced/);
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
  assert.match(page, /id="map-type-filter"/);
  assert.match(page, /id="map-relationship-filter"/);
  assert.match(page, /System Map/);
  assert.doesNotMatch(page, /concept:current-work|repository:rickvang\/portfolio|persona:ui-expert|skill:skill-architecture-decision-making|edge:concept:/);
  assert.doesNotMatch(client, /concept:current-work|repository:rickvang\/portfolio|persona:ui-expert|skill:skill-architecture-decision-making|edge:concept:/);
  assert.match(client, /lensConfigs/);
  assert.match(client, /SystemMapRenderer/);
  assert.match(client, /initialExpandedIds/);
  assert.match(client, /nearestRootPath/);
  assert.match(client, /updateUrlState/);
  assert.match(client, /URLSearchParams/);
  assert.match(client, /relationshipFilter/);
  assert.match(client, /typeFilter/);
  assert.match(client, /layoutDirection: 'horizontal'/);
  assert.match(client, /layoutDirection: 'vertical'/);
  assert.match(renderer, /layoutDirection = 'vertical'/);
  assert.match(renderer, /transform: layoutDirection === 'horizontal'/);
  assert.match(client, /renderFallbackNodes\(visible\)/);
  assert.match(client, /keyboardNav\.open = true/);
  assert.doesNotMatch(client, /graphFallback\.hidden = true/);
  assert.match(renderer, /cytoscapeFactory/);
  assert.match(renderer, /breadthfirst/);
  assert.match(renderer, /rendererElements/);
  assert.match(renderer, /filtered-out/);
  assert.match(renderer, /filters = \{\}/);
  assert.match(client, /repository-ownership/);
  assert.match(client, /persona-skill/);
  assert.match(client, /source-generated/);
  assert.match(client, /agent-runtime/);
  assert.match(client, /does not report live Tool, connector, permission, deployment, or model availability/);
  assert.match(client, /fetch\(config\.graphUrl/);
  assert.match(client, /complete-for-scope/);
  assert.match(client, /Expand one level/);
  assert.match(client, /Collapse branch/);
  assert.match(client, /What explicitly depends on this/);
  assert.match(build, /"system-map\.html"/);
  assert.match(build, /client\/system-map-graph\.mjs/);
  assert.match(build, /client\/system-map-renderer\.mjs/);
  assert.match(build, /client\/system-map\.mjs/);
  assert.match(build, /buildPersonaSkillSystemMap/);
  assert.match(build, /buildTechnicalSystemMaps/);
  assert.match(client, /initialLens/);
  assert.match(client, /loadLens\(initialLens, \{ restoreUrl: true \}\)/);
  assert.doesNotMatch(page + client + renderer, /file:content\/library-data\.js|route:tool-resolution|skill-package:\.agents\/skills\/tool-discovery-and-safe-execution/);
});


test('System Map provenance also resolves the Repository Ownership registry source', () => {
  assert.equal(
    sourceUrl({ kind: 'repo-file', locator: 'rickvang/persona-workspace:repositories.json', selector: 'repositories' }),
    'https://github.com/rickvang/persona-workspace/blob/main/repositories.json'
  );
});
