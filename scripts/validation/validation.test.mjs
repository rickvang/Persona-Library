import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildValidationIndexes } from './context.mjs';
import { playbookCatalogCard, validateJobApplicationTrackerContract, validateJobSearchRoutingCase, validateJobSearchRoutingContract } from './generated.mjs';
import { validatePersonas } from './personas.mjs';
import { validateRelationships } from './relationships.mjs';
import { validateSkills } from './skills.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

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
  const html = '<article class="catalog-card" data-playbook-card data-playbook-id="playbook-other"><div class="catalog-meta"><span>6 stages</span><span>3 roles</span></div></article><article class="catalog-card" data-playbook-card data-playbook-id="playbook-bounded-parallel-implementation"><div class="catalog-meta"><span>8 stages</span><span>4 roles</span></div></article>';
  const boundedCard = playbookCatalogCard(html, 'playbook-bounded-parallel-implementation');
  assert.equal(boundedCard.includes('<span>4 roles</span>'), true);
  assert.equal(boundedCard.includes('<span>8 stages</span>'), true);
  assert.equal(playbookCatalogCard(html, 'playbook-other').includes('<span>3 roles</span>'), true);
  assert.equal(playbookCatalogCard(html, 'playbook-missing'), '');
});

test('Routing case: unqualified narrow request routes Riley to a specialist or Skill', () => {
  const route = { next_handoff: 'For an unqualified request, begin with Riley Morgan; Riley selects the smallest narrow specialist or Skill route.' };
  assert.doesNotThrow(() => validateJobSearchRoutingCase(route, 'unqualifiedNarrow'));
  assert.throws(() => validateJobSearchRoutingCase({ next_handoff: route.next_handoff.replace('narrow', 'broad') }, 'unqualifiedNarrow'), /unqualified narrow/i);
});

test('Routing case: unqualified full-outcome request routes Riley to the Playbook', () => {
  const route = { next_handoff: 'For an unqualified request, begin with Riley Morgan; Riley selects the Evidence-led Job Search Playbook for full-outcome work.' };
  assert.doesNotThrow(() => validateJobSearchRoutingCase(route, 'unqualifiedFullOutcome'));
  assert.throws(() => validateJobSearchRoutingCase({ next_handoff: route.next_handoff.replace('full-outcome', 'narrow') }, 'unqualifiedFullOutcome'), /full-outcome/);
});

test('Routing case: explicit specialist request supports direct invocation', () => {
  const route = { next_handoff: 'Explicit requests for a named specialist may route directly.' };
  assert.doesNotThrow(() => validateJobSearchRoutingCase(route, 'explicitSpecialist'));
  assert.throws(() => validateJobSearchRoutingCase({ next_handoff: route.next_handoff.replace('directly', 'through Riley') }, 'explicitSpecialist'), /direct invocation/);
});

test('Routing case: explicit Playbook request supports direct invocation', () => {
  const route = { next_handoff: 'Explicit requests for a named Playbook may route directly.' };
  assert.doesNotThrow(() => validateJobSearchRoutingCase(route, 'explicitPlaybook'));
  assert.throws(() => validateJobSearchRoutingCase({ next_handoff: route.next_handoff.replace('directly', 'through Riley') }, 'explicitPlaybook'), /direct invocation/);
});

test('Job-search routing preserves Riley identity, Playbook procedure, and specialist boundaries', () => {
  const route = {
    next_handoff: 'For an unqualified request, begin with Riley Morgan as the default entry and routing point; Riley selects the smallest specialist or Skill for narrow work and the Evidence-led Job Search Playbook for full-outcome work. Explicit requests for a named specialist, Skill, or Playbook may route directly. The Playbook owns stages, shared state, quality gates, recovery, and the learning loop. Resolve standing decisions and any Candidate Baseline before composition, preserve the career spine, and do not substitute a secondary profile store.'
  };
  const implementation = 'Riley Morgan is the default system entry and routing point for unqualified requests. Riley routes full-outcome work to Priya Desai, who operates the Evidence-led Job Search Playbook as the process surface. The Playbook supplies shared state, quality gates, recovery, and the learning loop. Explicit requests may route directly. The Candidate Baseline Resume passes a Private-source resolution gate before role tailoring; preserve the career spine, block secondary profile stores from substitution, and run baseline-to-output integrity.';
  const riley = { roleLabel: 'AI orchestrator' };
  const rileyFlows = [{ title: 'Frame the system goal and boundary', summary: 'Turn an unqualified opportunity into a bounded outcome.' }];
  const playbook = { id: 'playbook-evidence-led-job-search' };
  const specialistIds = new Set(['career-strategist', 'role-calibrator', 'application-editor', 'outreach-interview-coach', 'ui-expert', 'document-designer']);
  assert.doesNotThrow(() => validateJobSearchRoutingContract({ route, implementation, riley, rileyFlows, playbook, specialistIds }));
  assert.throws(() => validateJobSearchRoutingContract({ route: { ...route, next_handoff: route.next_handoff.replace('Explicit requests', 'Requests') }, implementation, riley, rileyFlows, playbook, specialistIds }), /direct invocation/);
  assert.throws(() => validateJobSearchRoutingContract({ route, implementation, riley: { roleLabel: 'Job-search orchestrator' }, rileyFlows, playbook, specialistIds }), /canonical AI orchestrator/);
  assert.throws(() => validateJobSearchRoutingContract({ route: { ...route, next_handoff: route.next_handoff.replace('Candidate Baseline', 'resume source') }, implementation, riley, rileyFlows, playbook, specialistIds }), /Candidate Baseline resolution/);
  assert.throws(() => validateJobSearchRoutingContract({ route, implementation: implementation.replace('baseline-to-output', 'final review'), riley, rileyFlows, playbook, specialistIds }), /baseline-integrity gate/);
});

test('Application tracker stays local, portable, and free of candidate seed data', () => {
  const page = '<h1>Keep every opportunity in one place.</h1><strong>Local-only data</strong><code>persona-library.job-applications.v1</code><script src="js/job-tracker.js"></script>';
  const runtime = "const STATUSES = ['Found','Reviewing','Packet Ready','Applied','Interviewing','Offer','Closed']; localStorage.getItem(STORAGE_KEY); localStorage.setItem(STORAGE_KEY, '[]'); const payload={format:'persona-library-job-applications'}; importFile.addEventListener('change',()=>{}); throw new Error('Unsupported tracker format'); throw new Error('Tracker export is from a newer unsupported version'); new URL(value); ['http:','https:']; const handoff='persona-library-job-application-handoff'; if (payload?.operation !== 'upsert') throw new Error(); function recordIdentity(record){} confirm(`Apply`); history.replaceState(null,'','');";
  const contract = 'Real records use browser-local private state. Export uses versioned JSON for a future standalone application. This remains separate from the seen-job deduplication contract.';
  assert.doesNotThrow(() => validateJobApplicationTrackerContract({ page, runtime, contract }));
  assert.throws(() => validateJobApplicationTrackerContract({ page, runtime: runtime + ' fetch("/sync")', contract }), /remote persistence or network calls/);
  assert.throws(() => validateJobApplicationTrackerContract({ page: page + 'Rick Vang', runtime, contract }), /candidate-specific private values/);
  assert.throws(() => validateJobApplicationTrackerContract({ page, runtime: runtime.replace('Packet Ready','Ready'), contract }), /Packet Ready/);
});

test('Bounded parallel orientation, grounding, and callback gates remain separate', () => {
  const playbook = readFileSync(path.join(root, 'docs/playbooks/bounded-parallel-implementation.md'), 'utf8');
  const route = JSON.parse(readFileSync(path.join(root, 'content/orientation/playbooks.json'), 'utf8')).routes.find((candidate) => candidate.id === 'bounded-parallel-implementation');
  const rootInstructions = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  const orientationIndex = playbook.indexOf('### 0. Orientation preflight');
  const groundingIndex = playbook.indexOf('### 1. Ground candidate workstreams in target-repository source');
  const dispatchIndex = playbook.indexOf('### 2. Bound and dispatch');
  assert.ok(orientationIndex >= 0 && orientationIndex < groundingIndex && groundingIndex < dispatchIndex);
  for (const state of ['fresh', 'previously_oriented', 'unknown']) assert.match(playbook, new RegExp(`\\b${state}\\b`));
  for (const state of ['confirmed', 'qualified', 'contradicted']) assert.match(playbook, new RegExp(`\\b${state}\\b`));
  assert.match(playbook, /Orientation gate/);
  assert.match(playbook, /Source-grounding gate/);
  assert.ok(playbook.indexOf('agent context: fresh | previously_oriented | unknown') < playbook.indexOf('source-grounding result: confirmed | qualified'));
  for (const state of ['review_ready', 'blocked', 'deferred']) assert.match(playbook, new RegExp(`\\b${state}\\b`));
  assert.match(playbook, /notification and routing only/);
  assert.match(playbook, /originating Chat must refresh GitHub independently/);
  assert.match(playbook, /callback transport is unsupported/);
  assert.match(playbook, /compact packet in the coordinator context/);
  assert.match(playbook, /one terminal status for each workstream/);
  assert.match(playbook, /aggregate is `review_ready` only when every workstream is `review_ready`/);
  assert.match(playbook, /`review_ready \+ blocked` is `blocked`/);
  assert.match(playbook, /Implementer transitions to `deferred` when an explicit, scoped dependency/);
  assert.match(playbook, /dependency, owner\/reference, reason, and re-entry condition/);
  assert.match(playbook, /deferred.*dependency.*re-entry condition/s);
  assert.ok(playbook.indexOf('### 5. Independent review') < playbook.indexOf('### 6. Scoped correction'));
  assert.ok(playbook.indexOf('### 6. Scoped correction') < playbook.indexOf('### 7. Authorized merge and stop'));
  assert.match(playbook, /Pass only with explicit authorization/);
  assert.match(route.next_handoff, /fresh, previously_oriented, or unknown/);
  assert.match(route.next_handoff, /review_ready, blocked, or deferred/);
  assert.equal(rootInstructions.includes('bounded-parallel'), false);
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
