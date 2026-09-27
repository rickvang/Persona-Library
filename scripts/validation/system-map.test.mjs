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

test('System Map provenance resolves repository files without copying source content', () => {
  assert.equal(
    sourceUrl(graph.nodes[0].source),
    'https://github.com/rickvang/persona-workspace/blob/main/docs/HOW-IT-WORKS.md'
  );
});

test('System Map Site consumes persona-workspace authority rather than a copied graph', async () => {
  const [page, client, build] = await Promise.all([
    fs.readFile(new URL('../../content/site-pages/system-map.html', import.meta.url), 'utf8'),
    fs.readFile(new URL('../../client/system-map.mjs', import.meta.url), 'utf8'),
    fs.readFile(new URL('../../scripts/build-library.mjs', import.meta.url), 'utf8')
  ]);

  assert.match(page, /raw\.githubusercontent\.com\/rickvang\/persona-workspace\/main\/system-map\/generated\/work-coordination\.json/);
  assert.match(page, /raw\.githubusercontent\.com\/rickvang\/persona-workspace\/main\/system-map\/generated\/repository-ownership\.json/);
  assert.match(page, /data\/system-map\/persona-skill\.json/);
  assert.match(page, /Repository ownership<\/strong>[\s\S]*Available/);
  assert.match(page, /Persona \/ Skill<\/strong>[\s\S]*Available/);
  assert.match(page, /Not mapped yet/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /System Map/);
  assert.doesNotMatch(page, /concept:current-work|repository:rickvang\/portfolio|persona:ui-expert|skill:skill-architecture-decision-making|edge:concept:/);
  assert.doesNotMatch(client, /concept:current-work|repository:rickvang\/portfolio|persona:ui-expert|skill:skill-architecture-decision-making|edge:concept:/);
  assert.match(client, /lensConfigs/);
  assert.match(client, /repository-ownership/);
  assert.match(client, /persona-skill/);
  assert.match(client, /fetch\(config\.graphUrl/);
  assert.match(client, /complete-for-scope/);
  assert.match(client, /Expand one level/);
  assert.match(client, /Collapse branch/);
  assert.match(client, /What explicitly depends on this/);
  assert.match(build, /"system-map\.html"/);
  assert.match(build, /client\/system-map-graph\.mjs/);
  assert.match(build, /client\/system-map\.mjs/);
  assert.match(build, /buildPersonaSkillSystemMap/);
});


test('System Map provenance also resolves the Repository Ownership registry source', () => {
  assert.equal(
    sourceUrl({ kind: 'repo-file', locator: 'rickvang/persona-workspace:repositories.json', selector: 'repositories' }),
    'https://github.com/rickvang/persona-workspace/blob/main/repositories.json'
  );
});
