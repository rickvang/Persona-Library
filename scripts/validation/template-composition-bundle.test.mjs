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
const bundlePath = 'dist/data/agent-context/template-composition.json';
const expected = {
  route_id: 'template-composition',
  primary_space: 'templates',
  package_path: '.agents/skills/template-composer'
};
const read = relativePath => readFile(path.join(root, relativePath), 'utf8');

function frontmatterValue(source, key) {
  const match = source.match(new RegExp('^\\s*' + key + ':\\s*([^\\n#]+)', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

test('template-composition bundle is a fresh bounded projection of canonical Template routing', async () => {
  const [bundle, committed, orientation, templates, skill, reconciliation] = await Promise.all([
    deriveAgentContextBundle(root, 'template-composition'),
    read(bundlePath).then(JSON.parse),
    read('content/site-orientation.json').then(JSON.parse),
    read('content/orientation/templates.json').then(JSON.parse),
    read('.agents/skills/template-composer/SKILL.md'),
    read('.agents/skills/template-reconciliation/SKILL.md')
  ]);
  const route = templates.routes.find(item => item.id === 'template-composition');
  assert.ok(route);

  assert.deepEqual(committed, bundle);
  assert.deepEqual(validateAgentContextBundle(bundle, expected), []);
  assert.deepEqual(bundle.space_index, [{
    id: 'templates',
    label: orientation.spaces.templates.label,
    answers: orientation.spaces.templates.answers,
    route_file: orientation.spaces.templates.route_file
  }]);
  assert.equal(bundle.graph_fragment.nodes.filter(node => node.type === 'routing-route').length, 1);
  assert.ok(bundle.graph_fragment.nodes.some(node => node.id === 'route:template-composition'));
  assert.ok(bundle.graph_fragment.edges.some(edge =>
    edge.from === 'route:template-composition' &&
    edge.to === 'skill-package:.agents/skills/template-composer' &&
    edge.relationship === 'routes-to'
  ));
  assert.ok(!bundle.graph_fragment.nodes.some(node => node.id === 'route:tool-resolution'));
  assert.ok(!bundle.graph_fragment.nodes.some(node => node.id === 'route:system-orientation'));

  assert.deepEqual(bundle.exceptions, {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: templates.space.do_not
  });
  assert.equal(bundle.contract.skill_layer, frontmatterValue(skill, 'skill_layer'));
  assert.equal(bundle.contract.change_mode, frontmatterValue(skill, 'change_mode'));
  assert.equal(bundle.contract.change_domain, frontmatterValue(skill, 'change_domain'));
  assert.equal(bundle.contract.reconciliation, frontmatterValue(skill, 'reconciliation'));
  assert.equal(bundle.contract.reconciliation, route.reconciliation);
  assert.equal(bundle.contract.reconciliation, 'template-reconciliation');
  assert.equal(frontmatterValue(reconciliation, 'change_mode'), 'reconciliation_adapter');
  assert.equal(bundle.exceptions.mutation_boundary, 'authorized_update');
  assert.equal(bundle.contract.change_mode, 'artifact_generation');
  assert.ok(bundle.canonical_sources.some(source =>
    source.locator === 'rickvang/Persona-Library:.agents/skills/template-reconciliation/SKILL.md'
  ));

  for (const fact of [...bundle.graph_fragment.nodes, ...bundle.graph_fragment.edges]) {
    assert.ok(bundle.graph_fragment.provenance[fact.id], 'missing Template bundle provenance for ' + fact.id);
  }
});

test('template-composition bundle falls back on missing, malformed, mismatched, or corrupted context', async () => {
  const bundle = await deriveAgentContextBundle(root, 'template-composition');
  assert.equal(resolveAgentContextBundle(bundle, expected).mode, 'graph-backed');
  assert.equal(resolveAgentContextBundle(null, expected).mode, 'canonical-fallback');
  assert.equal(resolveAgentContextBundle('{bad json', expected).reason, 'bundle-malformed');

  const wrongRoute = structuredClone(bundle);
  wrongRoute.route_id = 'template-research';
  assert.equal(resolveAgentContextBundle(wrongRoute, expected).mode, 'canonical-fallback');

  const wrongSpace = structuredClone(bundle);
  wrongSpace.primary_space = 'docs';
  assert.equal(resolveAgentContextBundle(wrongSpace, expected).mode, 'canonical-fallback');

  const wrongPackage = structuredClone(bundle);
  wrongPackage.package_path = '.agents/skills/template-research';
  assert.equal(resolveAgentContextBundle(wrongPackage, expected).mode, 'canonical-fallback');

  const corrupt = structuredClone(bundle);
  corrupt.exceptions.next_handoff += ' corrupted';
  assert.equal(resolveAgentContextBundle(corrupt, expected).mode, 'canonical-fallback');
});

test('Template Composer prefers migrated context without weakening source, authority, publication, or reconciliation boundaries', async () => {
  const [skill, agents] = await Promise.all([
    read('.agents/skills/template-composer/SKILL.md'),
    read('AGENTS.md')
  ]);

  assert.ok(skill.includes('dist/data/agent-context/template-composition.json'));
  assert.ok(skill.includes('content/site-orientation.json'));
  assert.ok(skill.includes('content/orientation/templates.json'));
  assert.ok(skill.includes('accepted research result'));
  assert.ok(skill.includes('source evidence'));
  assert.ok(skill.includes('target authorization'));
  assert.ok(skill.includes('change_mode: artifact_generation'));
  assert.ok(skill.includes('does not grant permission'));
  assert.ok(skill.includes('template-reconciliation'));
  assert.ok(skill.includes('$change-impact-reconciliation'));
  assert.ok(skill.includes('derived routing context, not Template truth'));

  assert.ok(agents.includes('explicit Template composition/adaptation request'));
  assert.ok(agents.includes('$template-composer'));
  assert.ok(agents.includes('Missing or ambiguous Template research, source/provenance, target placement, or authorization'));
});
