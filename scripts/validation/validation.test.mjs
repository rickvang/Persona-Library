import assert from 'node:assert/strict';
import test from 'node:test';
import { buildValidationIndexes } from './context.mjs';
import { playbookCatalogCard } from './generated.mjs';
import { validatePersonas } from './personas.mjs';
import { validateRelationships } from './relationships.mjs';
import { validateSkills } from './skills.mjs';

const persona = {
  id: 'test-persona',
  name: 'Test Persona',
  role: 'specialist',
  roleLabel: 'Test specialist',
  lifecycle: 'Testing',
  operatingContext: 'Focused fixture',
  operatingState: 'Checking a contract',
  confidence: 'Synthetic fixture',
  skills: ['Test capability']
};

const profile = {
  name: 'Test capability',
  definition: 'A focused test capability.',
  triggers: ['A contract needs checking.'],
  workflows: ['Check a contract'],
  actions: ['Inspect the contract.'],
  evidence: ['A focused fixture.']
};

test('Persona validation is independently runnable without Site or generated files', () => {
  const context = {
    data: {
      personas: [persona],
      skillLibrary: { [persona.id]: [profile] },
      flowLibrary: { [persona.id]: [{ type: 'foundational', title: 'Check a contract', activities: [['Input', 'Action', 'Output', 'Fallback']] }] }
    }
  };
  const indexes = {};
  validatePersonas(context, indexes);
  assert.deepEqual([...indexes.personaIds], [persona.id]);
  assert.throws(() => validatePersonas({ data: { ...context.data, flowLibrary: { [persona.id]: [{ type: 'foundational', title: 'Check a contract', activities: [['incomplete']] }] } } }, {}), /incomplete activity row/);
});

test('Skill validation owns skill shape and does not need presentation context', () => {
  const context = { data: {
    personas: [persona],
    skillCatalog: [{
      id: 'skill-test',
      name: 'Test capability',
      personas: [{ id: persona.id }],
      profiles: [{ personaId: persona.id, ...profile }],
      buildingBlocks: [],
      supportingConnections: [],
      relatedSkills: [],
      guidance: { operation: { startsWith: 'A test.', loop: [], inputs: [], decisions: [], outputs: [], feedback: [], boundaries: 'Fixture.', leavesBehind: 'A result.', moves: [] }, quality: { signals: [], checks: [], watchFor: [] } },
      toolUseRecipes: []
    }],
    skillUnits: []
  } };
  const indexes = { personaIds: new Set([persona.id]) };
  validateSkills(context, indexes);
  assert.deepEqual([...indexes.catalogIds], ['skill-test']);
  assert.throws(() => validateSkills({ data: { ...context.data, skillCatalog: [{ ...context.data.skillCatalog[0], profiles: [{ personaId: 'missing-persona', ...profile }] }] } }, { personaIds: new Set([persona.id]) }), /Incomplete skill profile/);
});

test('Relationship validation keeps cross-domain references explicit', () => {
  const recipe = { id: 'recipe-test', title: 'Test recipe', tool: 'A bounded tool', skillId: 'skill-test', playbook: 'playbook-test', mode: 'review', requires: 'A fixture', output: 'A result', fallback: 'Manual review', status: 'Needs validation', personaIds: [persona.id], steps: ['Inspect'] };
  const context = { data: { toolUseRecipes: [recipe], skillCatalog: [{ id: 'skill-test', toolUseRecipes: [recipe] }], personaToolRequirements: [], personaHandoffs: [], skillRelations: [] } };
  const indexes = { personaIds: new Set([persona.id]), catalogIds: new Set(['skill-test']), entityIds: new Set(['skill-test']) };
  validateRelationships(context, indexes);
  assert.deepEqual([...indexes.recipeIds], ['recipe-test']);
  assert.throws(() => validateRelationships({ data: { ...context.data, skillRelations: [{ from: 'skill-test', to: 'missing', type: 'supports' }] } }, indexes), /Invalid skill relationship/);
  assert.throws(() => validateRelationships({ data: { ...context.data, toolUseRecipes: [{ ...recipe, steps: [] }] } }, indexes), /Tool-use recipe has no steps: recipe-test/);
  const recipeWithoutSteps = { ...recipe };
  delete recipeWithoutSteps.steps;
  assert.throws(() => validateRelationships({ data: { ...context.data, toolUseRecipes: [recipeWithoutSteps] } }, indexes), /Tool-use recipe has no steps: recipe-test/);
});

test('Bounded parallel role count is scoped to its catalog card', () => {
  const html = '<article class="catalog-card" data-playbook-card data-playbook-id="playbook-other"><div class="catalog-meta"><span>3 roles</span></div></article><article class="catalog-card" data-playbook-card data-playbook-id="playbook-bounded-parallel-implementation"><div class="catalog-meta"><span>4 roles</span></div></article>';
  const boundedCard = playbookCatalogCard(html, 'playbook-bounded-parallel-implementation');
  assert.equal(boundedCard.includes('<span>4 roles</span>'), true);
  assert.equal(playbookCatalogCard(html, 'playbook-other').includes('<span>3 roles</span>'), true);
  assert.equal(playbookCatalogCard(html, 'playbook-missing'), '');
});

test('Playbook identity is validated before the shared Playbook ID index is trusted', () => {
  const valid = {
    personas: [],
    skillCatalog: [],
    skillUnits: [],
    playbookCatalog: [{ id: 'playbook-test', name: 'Test playbook', status: 'Working model' }],
    operatingPacks: [],
    templates: []
  };
  assert.deepEqual([...buildValidationIndexes(valid).playbookIds], ['playbook-test']);
  assert.throws(() => buildValidationIndexes({ ...valid, playbookCatalog: [{ id: 'playbook-test', name: 'First', status: 'Working model' }, { id: 'playbook-test', name: 'Second', status: 'Working model' }] }), /Invalid or duplicate Playbook catalog identity: playbook-test/);
  assert.throws(() => buildValidationIndexes({ ...valid, playbookCatalog: [{ name: 'Missing id', status: 'Working model' }] }), /Invalid or duplicate Playbook catalog identity: \(missing\)/);
  assert.throws(() => buildValidationIndexes({ ...valid, playbookCatalog: [{ id: 'playbook-test', status: 'Working model' }] }), /Invalid or duplicate Playbook catalog identity: playbook-test/);
  assert.throws(() => buildValidationIndexes({ ...valid, playbookCatalog: [{ id: 'playbook-test', name: 'Missing status' }] }), /Invalid or duplicate Playbook catalog identity: playbook-test/);
});
