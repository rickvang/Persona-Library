import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  deriveAgentContextBundle,
  resolveAgentContextBundle,
  validateAgentContextBundle
} from '../build-agent-context-bundles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const bundlePath = 'dist/data/agent-context/tool-resolution.json';
const expected = {
  route_id: 'tool-resolution',
  primary_space: 'tools',
  package_path: '.agents/skills/tool-discovery-and-safe-execution'
};
const read = relativePath => readFile(path.join(root, relativePath), 'utf8');

function frontmatterValue(source, key) {
  const match = source.match(new RegExp('^\\s*' + key + ':\\s*([^\\n#]+)', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

test('tool-resolution bundle is a fresh minimal projection of canonical Tool routing', async () => {
  const [bundle, committed, orientation, tools, skill, reconciliation] = await Promise.all([
    deriveAgentContextBundle(root, 'tool-resolution'),
    read(bundlePath).then(JSON.parse),
    read('content/site-orientation.json').then(JSON.parse),
    read('content/orientation/tools.json').then(JSON.parse),
    read('.agents/skills/tool-discovery-and-safe-execution/SKILL.md'),
    read('.agents/skills/change-impact-reconciliation/SKILL.md')
  ]);
  const route = tools.routes.find(item => item.id === 'tool-resolution');
  assert.ok(route);

  assert.deepEqual(committed, bundle);
  assert.deepEqual(validateAgentContextBundle(bundle, expected), []);
  assert.deepEqual(bundle.space_index, [{
    id: 'tools',
    label: orientation.spaces.tools.label,
    answers: orientation.spaces.tools.answers,
    route_file: orientation.spaces.tools.route_file
  }]);

  assert.equal(bundle.graph_fragment.nodes.length, 10);
  assert.equal(bundle.graph_fragment.edges.length, 8);
  assert.equal(bundle.graph_fragment.nodes.filter(node => node.type === 'routing-route').length, 1);
  assert.ok(bundle.graph_fragment.nodes.some(node => node.id === 'route:tool-resolution'));
  assert.ok(!bundle.graph_fragment.nodes.some(node => node.id === 'routing:orientation-bootstrap'));
  assert.ok(!bundle.graph_fragment.nodes.some(node => node.id === 'route-group:tools'));
  assert.ok(!bundle.graph_fragment.nodes.some(node => node.id === 'space:tools'));

  assert.ok(bundle.graph_fragment.edges.some(edge =>
    edge.from === 'route:tool-resolution' &&
    edge.to === 'skill-package:.agents/skills/tool-discovery-and-safe-execution' &&
    edge.relationship === 'routes-to'
  ));
  assert.ok(bundle.graph_fragment.edges.some(edge =>
    edge.from === 'view:agent-runtime' &&
    edge.to === 'boundary:live-runtime-state' &&
    edge.relationship === 'excludes-live-state'
  ));
  assert.ok(bundle.graph_fragment.edges.some(edge =>
    edge.from === 'agent:repository-dispatcher' &&
    edge.to === 'validation:repository-validation' &&
    edge.relationship === 'uses-validation-contract'
  ));

  assert.deepEqual(bundle.exceptions, {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: tools.space.do_not
  });

  assert.equal(bundle.contract.skill_layer, frontmatterValue(skill, 'skill_layer'));
  assert.equal(bundle.contract.change_mode, frontmatterValue(skill, 'change_mode'));
  assert.equal(bundle.contract.change_domain, frontmatterValue(skill, 'change_domain'));
  assert.equal(bundle.contract.reconciliation, frontmatterValue(skill, 'reconciliation'));
  assert.equal(bundle.contract.reconciliation, route.reconciliation);
  assert.equal(bundle.contract.change_mode, 'external_execution');
  assert.equal(bundle.contract.reconciliation, 'change-impact-reconciliation');
  assert.equal(frontmatterValue(reconciliation, 'change_mode'), 'reconciliation_adapter');
  assert.equal(bundle.exceptions.mutation_boundary, 'external_execution');

  assert.ok(bundle.canonical_sources.some(source =>
    source.locator === 'rickvang/Persona-Library:.agents/skills/change-impact-reconciliation/SKILL.md'
  ));

  const forbiddenKeys = ['available', 'availability_state', 'credentials', 'permissions', 'workspace', 'approval', 'execution_result'];
  const serialized = JSON.stringify(bundle);
  for (const key of forbiddenKeys) {
    assert.equal(Object.hasOwn(bundle, key), false);
  }
  assert.ok(!serialized.includes('"availability_state"'));
  assert.ok(!serialized.includes('"execution_result"'));

  for (const fact of [...bundle.graph_fragment.nodes, ...bundle.graph_fragment.edges]) {
    assert.ok(bundle.graph_fragment.provenance[fact.id], 'missing Tool bundle provenance for ' + fact.id);
  }
});

test('tool-resolution bundle falls back on missing, malformed, mismatched, or corrupted context', async () => {
  const bundle = await deriveAgentContextBundle(root, 'tool-resolution');
  assert.equal(resolveAgentContextBundle(bundle, expected).mode, 'graph-backed');
  assert.equal(resolveAgentContextBundle(null, expected).mode, 'canonical-fallback');
  assert.equal(resolveAgentContextBundle('{bad json', expected).reason, 'bundle-malformed');

  for (const [field, value] of [
    ['route_id', 'tool-record-maintenance'],
    ['primary_space', 'docs'],
    ['package_path', '.agents/skills/tool-record-maintenance']
  ]) {
    const bad = structuredClone(bundle);
    bad[field] = value;
    assert.equal(resolveAgentContextBundle(bad, expected).mode, 'canonical-fallback');
  }

  const corrupt = structuredClone(bundle);
  corrupt.exceptions.next_handoff += ' corrupted';
  assert.equal(resolveAgentContextBundle(corrupt, expected).mode, 'canonical-fallback');
});

test('Tool Discovery prefers migrated routing context but keeps all live-state authority external', async () => {
  const [skill, agents] = await Promise.all([
    read('.agents/skills/tool-discovery-and-safe-execution/SKILL.md'),
    read('AGENTS.md')
  ]);

  assert.ok(skill.includes('dist/data/agent-context/tool-resolution.json'));
  assert.ok(skill.includes('content/site-orientation.json'));
  assert.ok(skill.includes('content/orientation/tools.json'));
  assert.ok(skill.includes('never establishes availability, credentials, permission, workspace, target, approval, or execution success'));
  assert.ok(skill.includes('actually exposed by the current requester runtime'));
  assert.ok(skill.includes('smallest matching scenario'));
  assert.ok(skill.includes('change-impact-reconciliation'));
  assert.ok(skill.includes('derived routing context, not live Tool truth'));

  assert.ok(agents.includes('explicit Tool/capability resolution, availability check, or bounded external-execution planning request'));
  assert.ok(agents.includes('$tool-discovery-and-safe-execution'));
  assert.ok(agents.includes('must refresh current runtime exposure, permission, workspace, approval, target, and verification evidence'));
});
