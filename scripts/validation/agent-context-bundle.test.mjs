import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  deriveAgentContextBundle,
  expectedAgentContextBundleOutputs,
  resolveAgentContextBundle,
  validateAgentContextBundle
} from '../build-agent-context-bundles.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const bundlePath = 'dist/data/agent-context/system-orientation.json';
const expected = {
  route_id: 'system-orientation',
  primary_space: 'docs',
  package_path: '.agents/skills/persona-library-orientation'
};

const read = relativePath => readFile(path.join(root, relativePath), 'utf8');

function frontmatterValue(source, key) {
  const match = source.match(new RegExp('^\\s*' + key + ':\\s*([^\\n#]+)', 'm'));
  return match ? match[1].trim().replace(/^['\"]|['\"]$/g, '') : null;
}

test('system-orientation bundle is a fresh deterministic projection of canonical routing', async () => {
  const fresh = await deriveAgentContextBundle(root, 'system-orientation');
  const committed = JSON.parse(await read(bundlePath));
  assert.deepEqual(committed, fresh);
  assert.deepEqual(validateAgentContextBundle(committed, expected), []);

  const outputs = await expectedAgentContextBundleOutputs(root);
  assert.deepEqual([...outputs.keys()], [bundlePath]);
  assert.equal(outputs.get(bundlePath), JSON.stringify(fresh, null, 2) + '\n');
});

test('system-orientation bundle preserves route exceptions and Skill contract', async () => {
  const [bundle, docs, skill] = await Promise.all([
    deriveAgentContextBundle(root, 'system-orientation'),
    read('content/orientation/docs.json').then(JSON.parse),
    read('.agents/skills/persona-library-orientation/SKILL.md')
  ]);
  const route = docs.routes.find(item => item.id === 'system-orientation');
  assert.ok(route);

  assert.deepEqual(bundle.exceptions, {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: docs.space.do_not
  });

  assert.equal(bundle.contract.skill_layer, frontmatterValue(skill, 'skill_layer'));
  assert.equal(bundle.contract.change_mode, frontmatterValue(skill, 'change_mode'));
  assert.equal(bundle.contract.change_domain, frontmatterValue(skill, 'change_domain'));
  assert.equal(bundle.contract.reconciliation, frontmatterValue(skill, 'reconciliation'));
  assert.equal(bundle.contract.reconciliation, route.reconciliation);
  assert.equal(bundle.exceptions.mutation_boundary, 'read_only');
  assert.equal(bundle.contract.change_mode, 'read_only');
});

test('system-orientation graph fragment is bounded, provenance-complete, and retains live-state boundary', async () => {
  const bundle = await deriveAgentContextBundle(root, 'system-orientation');
  const fragment = bundle.graph_fragment;
  const routeNodes = fragment.nodes.filter(node => node.type === 'routing-route');
  assert.deepEqual(routeNodes.map(node => node.id), ['route:system-orientation']);

  assert.ok(fragment.edges.some(edge =>
    edge.from === 'route:system-orientation' &&
    edge.to === 'skill-package:.agents/skills/persona-library-orientation' &&
    edge.relationship === 'routes-to'
  ));
  assert.ok(fragment.edges.some(edge =>
    edge.from === 'view:agent-runtime' &&
    edge.to === 'boundary:live-runtime-state' &&
    edge.relationship === 'excludes-live-state'
  ));
  assert.ok(fragment.edges.some(edge =>
    edge.from === 'agent:repository-dispatcher' &&
    edge.to === 'validation:repository-validation' &&
    edge.relationship === 'uses-validation-contract'
  ));

  for (const fact of [...fragment.nodes, ...fragment.edges]) {
    assert.ok(fragment.provenance[fact.id], 'missing provenance for ' + fact.id);
    assert.match(fragment.provenance[fact.id].locator, /^rickvang\/Persona-Library:/);
  }
});

test('valid bundle selects graph-backed mode; missing, malformed, or mismatched bundles fall back', async () => {
  const bundle = await deriveAgentContextBundle(root, 'system-orientation');
  assert.equal(resolveAgentContextBundle(bundle, expected).mode, 'graph-backed');
  assert.deepEqual(resolveAgentContextBundle(null, expected), {
    mode: 'canonical-fallback',
    reason: 'bundle-unavailable',
    bundle: null
  });
  assert.equal(resolveAgentContextBundle('{bad json', expected).reason, 'bundle-malformed');

  const wrongRoute = structuredClone(bundle);
  wrongRoute.route_id = 'docs-and-onboarding';
  assert.equal(resolveAgentContextBundle(wrongRoute, expected).mode, 'canonical-fallback');

  const wrongPackage = structuredClone(bundle);
  wrongPackage.package_path = '.agents/skills/not-the-orientation-skill';
  assert.equal(resolveAgentContextBundle(wrongPackage, expected).mode, 'canonical-fallback');

  const corrupt = structuredClone(bundle);
  corrupt.exceptions.next_handoff += ' corrupted';
  assert.equal(resolveAgentContextBundle(corrupt, expected).mode, 'canonical-fallback');
});

test('orientation Skill explicitly prefers bundle and preserves canonical read-only fallback', async () => {
  const [skill, agents] = await Promise.all([
    read('.agents/skills/persona-library-orientation/SKILL.md'),
    read('AGENTS.md')
  ]);

  assert.match(skill, /dist\\/data\\/agent-context\\/system-orientation\\.json/);
  assert.match(skill, /fall back to the canonical current path/);
  assert.match(skill, /content\\/site-orientation\\.json/);
  assert.match(skill, /content\\/orientation\\/docs\\.json/);
  assert.match(skill, /stay read-only/i);
  assert.match(skill, /generated bundle is a derived context projection, not a source of truth/i);
  assert.ok(skill.includes('Goal:\nMode: answer | research | plan | prototype | update | consult\nPrimary space:'));

  assert.ok(agents.includes('explicit Persona-Library system-orientation/navigation request'));
  assert.ok(agents.includes('invoke `$persona-library-orientation` directly'));
  assert.ok(agents.includes('Other semantic work reads `content/site-orientation.json`'));
});

test('system-orientation migration does not alter unrelated canonical route groups', async () => {
  const orientation = JSON.parse(await read('content/site-orientation.json'));
  assert.equal(orientation.spaces.docs.route_file, 'orientation/docs.json');
  assert.equal(orientation.spaces.templates.route_file, 'orientation/templates.json');
  assert.equal(orientation.spaces.tools.route_file, 'orientation/tools.json');

  const bundle = await deriveAgentContextBundle(root, 'system-orientation');
  assert.equal(bundle.route_id, 'system-orientation');
  assert.ok(!bundle.graph_fragment.nodes.some(node => node.id === 'route:template-composition'));
  assert.ok(!bundle.graph_fragment.nodes.some(node => node.id === 'route:tool-resolution'));
});
