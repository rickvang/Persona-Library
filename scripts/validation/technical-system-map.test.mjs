import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { rootNodeIds } from '../../client/system-map-graph.mjs';
import {
  deriveSourceGeneratedGraph,
  deriveAgentRuntimeGraph,
  expectedTechnicalSystemMapOutputs
} from '../build-technical-system-maps.mjs';

test('Source/generated graph stays bounded, provenance-backed, and output-directed', async () => {
  const graph = await deriveSourceGeneratedGraph();
  assert.deepEqual(rootNodeIds(graph), ['view:source-generated']);
  assert.equal(graph.scope, 'domain:source-generated');
  assert.equal(graph.coverage, 'complete-for-scope');

  const incoming = new Map(graph.nodes.map(node => [node.id, []]));
  const outgoing = new Map(graph.nodes.map(node => [node.id, []]));
  for (const edge of graph.edges) {
    incoming.get(edge.to)?.push(edge);
    outgoing.get(edge.from)?.push(edge);
  }

  const generated = graph.nodes.filter(node => node.type === 'generated-artifact');
  assert.ok(generated.length > 20);
  for (const node of generated) {
    assert.ok(
      incoming.get(node.id).some(edge => ['copied-to','contributes-to','generates','generates-runtime-config'].includes(edge.relationship)),
      node.id + ' must have an explicit generation relationship'
    );
    assert.ok(
      outgoing.get(node.id).every(edge => edge.relationship === 'validated-by' ||
        (edge.relationship === 'consumed-by' && graph.nodes.find(item => item.id === edge.to)?.type === 'build-step')),
      node.id + ' must not behave as an authored source'
    );
  }

  assert.ok(graph.nodes.some(node => node.id === 'view:authored-sources'));
  assert.ok(graph.nodes.some(node => node.id === 'source-group:content'));
  assert.ok(graph.nodes.some(node => node.id === 'validation:generated-output-cleanliness'));
  for (const fact of [...graph.nodes, ...graph.edges]) {
    assert.ok(fact.source?.locator && fact.source?.selector);
    assert.doesNotMatch(fact.source.locator, /:dist\//);
  }
});

test('Agent/runtime graph reflects declared static routing without live-runtime claims', async () => {
  const graph = await deriveAgentRuntimeGraph();
  const orientation = JSON.parse(await fs.readFile(new URL('../../content/site-orientation.json', import.meta.url), 'utf8'));
  assert.deepEqual(rootNodeIds(graph), ['view:agent-runtime']);
  assert.equal(graph.scope, 'domain:agent-runtime');
  assert.equal(graph.coverage, 'complete-for-scope');
  assert.equal(graph.nodes.filter(node => node.type === 'primary-space').length, Object.keys(orientation.spaces).length);
  assert.equal(
    graph.nodes.filter(node => node.type === 'routing-route').length,
    Object.values(orientation.spaces).reduce((sum, space) => sum + space.route_count, 0)
  );
  assert.ok(graph.nodes.some(node => node.id === 'boundary:live-runtime-state'));
  assert.ok(graph.edges.some(edge =>
    edge.from === 'route:tool-resolution' &&
    edge.to === 'skill-package:.agents/skills/tool-discovery-and-safe-execution' &&
    edge.relationship === 'routes-to'
  ));
  assert.ok(graph.edges.some(edge =>
    edge.from === 'skill-package:.agents/skills/tool-discovery-and-safe-execution' &&
    edge.to === 'contract:reconciliation:change-impact-reconciliation'
  ));
  assert.equal(graph.nodes.filter(node => node.type === 'live-tool' || node.type === 'live-connector').length, 0);
  for (const fact of [...graph.nodes, ...graph.edges]) {
    assert.ok(fact.source?.locator && fact.source?.selector);
    assert.match(fact.source.locator, /^rickvang\/Persona-Library:/);
  }
});

test('Technical System Map generated artifacts match fresh derivation', async () => {
  const { files } = await expectedTechnicalSystemMapOutputs();
  for (const [relativePath, expected] of files) {
    assert.equal(
      await fs.readFile(new URL('../../' + relativePath, import.meta.url), 'utf8'),
      expected,
      relativePath + ' is stale'
    );
  }
});

test('Technical graph derivation responds to canonical contract mutations', async () => {
  const buildSource = await fs.readFile(new URL('../../scripts/build-library.mjs', import.meta.url), 'utf8');
  const baselineSource = await deriveSourceGeneratedGraph();
  const changedSource = await deriveSourceGeneratedGraph(undefined, {
    buildSourceOverride: buildSource + "\nconst phase8Mutation = [['content/phase8-mutation.txt', 'dist/phase8-mutation.txt']];\n"
  });
  assert.notDeepEqual(changedSource, baselineSource);
  assert.ok(changedSource.nodes.some(node => node.id === 'file:dist/phase8-mutation.txt'));

  const orientation = JSON.parse(await fs.readFile(new URL('../../content/site-orientation.json', import.meta.url), 'utf8'));
  const baselineRuntime = await deriveAgentRuntimeGraph();
  const changedOrientation = structuredClone(orientation);
  changedOrientation.spaces.personas.label += ' Phase 8 mutation';
  const changedRuntime = await deriveAgentRuntimeGraph(undefined, { orientationOverride: changedOrientation });
  assert.notDeepEqual(changedRuntime, baselineRuntime);
  assert.match(changedRuntime.nodes.find(node => node.id === 'space:personas').label, /Phase 8 mutation$/);
});
