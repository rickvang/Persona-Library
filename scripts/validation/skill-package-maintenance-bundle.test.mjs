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
const bundlePath = 'dist/data/agent-context/skill-package-maintenance.json';
const expected = {
  route_id: 'skill-package-maintenance',
  primary_space: 'skills',
  package_path: '.agents/skills/pl-skill-creator'
};
const read = relativePath => readFile(path.join(root, relativePath), 'utf8');

function frontmatterValue(source, key) {
  const match = source.match(new RegExp('^\\s*' + key + ':\\s*([^\\n#]+)', 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

test('skill-package-maintenance bundle is a fresh bounded projection of canonical Skills routing', async () => {
  const [bundle, committed, orientation, skills, skill, reconciliation] = await Promise.all([
    deriveAgentContextBundle(root, 'skill-package-maintenance'),
    read(bundlePath).then(JSON.parse),
    read('content/site-orientation.json').then(JSON.parse),
    read('content/orientation/skills.json').then(JSON.parse),
    read('.agents/skills/pl-skill-creator/SKILL.md'),
    read('.agents/skills/change-impact-reconciliation/SKILL.md')
  ]);
  const route = skills.routes.find(item => item.id === 'skill-package-maintenance');
  assert.ok(route);

  assert.deepEqual(committed, bundle);
  assert.deepEqual(validateAgentContextBundle(bundle, expected), []);
  assert.deepEqual(bundle.space_index, [{
    id: 'skills',
    label: orientation.spaces.skills.label,
    answers: orientation.spaces.skills.answers,
    route_file: orientation.spaces.skills.route_file
  }]);

  assert.equal(bundle.graph_fragment.nodes.length, 13);
  assert.equal(bundle.graph_fragment.edges.length, 12);
  assert.equal(bundle.graph_fragment.nodes.filter(node => node.type === 'routing-route').length, 1);
  assert.ok(bundle.graph_fragment.nodes.some(node => node.id === 'route:skill-package-maintenance'));
  assert.ok(bundle.graph_fragment.nodes.some(node => node.id === 'routing:orientation-bootstrap'));
  assert.ok(bundle.graph_fragment.nodes.some(node => node.id === 'route-group:skills'));
  assert.ok(bundle.graph_fragment.nodes.some(node => node.id === 'space:skills'));
  assert.ok(bundle.graph_fragment.edges.some(edge =>
    edge.from === 'route:skill-package-maintenance' &&
    edge.to === 'skill-package:.agents/skills/pl-skill-creator' &&
    edge.relationship === 'routes-to'
  ));
  assert.ok(bundle.graph_fragment.edges.some(edge =>
    edge.from === 'view:agent-runtime' &&
    edge.to === 'boundary:live-runtime-state' &&
    edge.relationship === 'excludes-live-state'
  ));

  assert.deepEqual(bundle.exceptions, {
    availability_source: route.availability_source,
    first_reads: route.first_reads,
    mutation_boundary: route.mutation_boundary,
    non_triggers: route.non_triggers,
    next_handoff: route.next_handoff,
    space_do_not: skills.space.do_not
  });

  assert.equal(bundle.contract.skill_layer, frontmatterValue(skill, 'skill_layer'));
  assert.equal(bundle.contract.change_mode, frontmatterValue(skill, 'change_mode'));
  assert.equal(bundle.contract.change_domain, frontmatterValue(skill, 'change_domain'));
  assert.equal(bundle.contract.reconciliation, frontmatterValue(skill, 'reconciliation'));
  assert.equal(bundle.contract.reconciliation, route.reconciliation);
  assert.equal(bundle.contract.change_mode, 'artifact_generation');
  assert.equal(bundle.contract.reconciliation, 'change-impact-reconciliation');
  assert.equal(frontmatterValue(reconciliation, 'change_mode'), 'reconciliation_adapter');
  assert.equal(bundle.exceptions.mutation_boundary, 'authorized_update');

  assert.ok(bundle.canonical_sources.some(source =>
    source.locator === 'rickvang/Persona-Library:.agents/skills/change-impact-reconciliation/SKILL.md'
  ));

  const serialized = JSON.stringify(bundle);
  for (const key of ['credentials', 'permissions', 'approval', 'runtime_availability', 'issue_body', 'package_content']) {
    assert.ok(!serialized.includes('"' + key + '"'), 'bundle serialized forbidden field ' + key);
  }

  for (const fact of [...bundle.graph_fragment.nodes, ...bundle.graph_fragment.edges]) {
    assert.ok(bundle.graph_fragment.provenance[fact.id], 'missing Skill-package bundle provenance for ' + fact.id);
  }
});

test('skill-package-maintenance bundle falls back on missing, malformed, mismatched, or corrupted context', async () => {
  const bundle = await deriveAgentContextBundle(root, 'skill-package-maintenance');
  assert.equal(resolveAgentContextBundle(bundle, expected).mode, 'graph-backed');
  assert.equal(resolveAgentContextBundle(null, expected).mode, 'canonical-fallback');
  assert.equal(resolveAgentContextBundle('{bad json', expected).reason, 'bundle-malformed');

  for (const [field, value] of [
    ['route_id', 'skill-formation'],
    ['primary_space', 'docs'],
    ['package_path', '.agents/skills/persona-skills']
  ]) {
    const bad = structuredClone(bundle);
    bad[field] = value;
    assert.equal(resolveAgentContextBundle(bad, expected).mode, 'canonical-fallback');
  }

  const corrupt = structuredClone(bundle);
  corrupt.exceptions.next_handoff += ' corrupted';
  assert.equal(resolveAgentContextBundle(corrupt, expected).mode, 'canonical-fallback');
});

test('PL Skill Creator prefers bounded routing context without weakening package authority or freshness', async () => {
  const skill = await read('.agents/skills/pl-skill-creator/SKILL.md');
  assert.ok(skill.includes('dist/data/agent-context/skill-package-maintenance.json'));
  assert.ok(skill.includes('content/site-orientation.json'));
  assert.ok(skill.includes('content/orientation/skills.json'));
  assert.ok(skill.includes('never supplies approved scope'));
  assert.ok(skill.includes('Refresh those from their canonical/current sources'));
  assert.ok(skill.includes('does not grant permission'));
  assert.ok(skill.includes('change-impact-reconciliation'));
  assert.ok(skill.includes('derived routing context, not Skill/package truth'));
});
