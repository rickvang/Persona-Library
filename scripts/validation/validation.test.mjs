import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { buildValidationIndexes } from './context.mjs';
import { playbookCatalogCard, validateApplicationWorkflowTrackerGuidance, validateGitHubGovernanceContract, validateJobApplicationTrackerContract, validateJobSearchRoutingCase, validateJobSearchRoutingContract, validateRepositoryWorkingCopyContract, validateRileyContinuityContract, validateRileyWorkGraphContract, validateVercelToolCatalogSurface } from './generated.mjs';
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
  const context = { data: { toolCatalog: [], toolUseRecipes: [recipe], skillCatalog: [{ id: 'skill-test', toolUseRecipes: [recipe] }], personaToolRequirements: [], personaHandoffs: [], skillRelations: [] } };
  const indexes = { personaIds: new Set([persona.id]), catalogIds: new Set(['skill-test']), entityIds: new Set(['skill-test']) };
  validateRelationships(context, indexes);
  assert.deepEqual([...indexes.recipeIds], ['recipe-test']);
  assert.throws(() => validateRelationships({ data: { ...context.data, skillRelations: [{ from: 'skill-test', to: 'missing', type: 'supports' }] } }, indexes), /Invalid skill relationship/);
  assert.throws(() => validateRelationships({ data: { ...context.data, toolUseRecipes: [{ ...recipe, steps: [] }] } }, indexes), /Tool-use recipe has no steps: recipe-test/);
  const recipeWithoutSteps = { ...recipe };
  delete recipeWithoutSteps.steps;
  assert.throws(() => validateRelationships({ data: { ...context.data, toolUseRecipes: [recipeWithoutSteps] } }, indexes), /Tool-use recipe has no steps: recipe-test/);
  assert.throws(() => validateRelationships({ data: { ...context.data, toolCatalog: [{ id: 'tool-test', name: 'Test Tool', category: 'test', capability: 'Test', scope: 'Named fixture', risk: 'Low', permission: 'Read', approval: 'None', verification: 'Inspect', fallback: 'Manual', availability: 'unknown', evidenceStatus: 'proposed', status: 'active', version: '1.0', updated: '2026-09-21', aliases: [], evidence: ['fixture'], toolUseRecipeIds: ['recipe-test'], personaIds: [persona.id], skillIds: ['skill-test'], revisions: [{ version: '1.0' }] }] } }, indexes), /invalid recipe relationship/i);
});


test('Vercel canonical Tool record stays linked to its recipe and Tools surface', () => {
  const toolCatalog = [{
    id:'tool-vercel', name:'Vercel', aliases:['Vercel platform'], category:'deployment-platform',
    capability:'Deployed-state verification', scope:'Named Vercel project', risk:'High for mutation',
    permission:'Runtime-specific', approval:'Explicit authorization for deployment mutation',
    verification:'Fresh deployed-state preflight', fallback:'Use GitHub repository validation',
    availability:'runtime-dependent', evidenceStatus:'validated', evidence:['Issue #159'],
    toolUseRecipeIds:['recipe-riley-vercel-review-checkpoint'], personaIds:['ai-orchestrator'],
    skillIds:['skill-tool-and-context-design'], status:'active', version:'1.0', updated:'2026-09-21',
    revisions:[{version:'1.0'}]
  }];
  const toolUseRecipes = [{ id:'recipe-riley-vercel-review-checkpoint', toolId:'tool-vercel', tool:'Vercel' }];
  const personaToolRequirements = [{ id:'requirement-riley-vercel-review-checkpoint', preferredToolId:'tool-vercel', preferredTool:'Vercel', recipeId:'recipe-riley-vercel-review-checkpoint' }];
  const toolsPage = '<article id="tool-vercel" data-tool-id="tool-vercel"><h3>Vercel</h3>Runtime availability and account permission remain separate.<a href="#recipe-vercel-review-checkpoint">Open Vercel review-checkpoint recipe</a></article>';
  assert.doesNotThrow(() => validateVercelToolCatalogSurface({ toolCatalog, toolUseRecipes, personaToolRequirements, toolsPage }));
  assert.throws(() => validateVercelToolCatalogSurface({ toolCatalog, toolUseRecipes: [{ ...toolUseRecipes[0], toolId:'missing' }], personaToolRequirements, toolsPage }), /recipe/i);
  assert.throws(() => validateVercelToolCatalogSurface({ toolCatalog, toolUseRecipes, personaToolRequirements, toolsPage: toolsPage.replace('data-tool-id="tool-vercel"', '') }), /Tools page/i);
});

test('GitHub governance semantics stay owned by the pinned Tool contract while Persona-Library supplies standing completion authorization', () => {
  const pin = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const agents = `Follow https://github.com/rickvang/tool-repo/blob/${pin}/tools/github/AGENTS.md for GitHub mutation classes, authorization, and linked-issue completion semantics. Persona-Library standing completion authorization applies when the requester says implement, fix, build, or complete; do not merge, PR only, or leave for review overrides it.`;
  const workOrders = 'For GitHub merge authorization and linked-issue completion semantics, follow the pinned GitHub Tool contract. A Work Order records standing completion authorization without inventing a second confirmation gate; do not merge, PR only, and leave for review are explicit overrides.';
  const boundedPlaybook = 'Use the pinned GitHub Tool contract for merge authorization and linked-issue completion semantics. The Merge gate recognizes standing completion authorization from the current requester instruction or target-repository contract; green review does not create authorization by itself.';
  const boundedRoute = { next_handoff: 'Apply the pinned GitHub Tool contract for merge authorization and linked-issue completion semantics. Standing completion authorization is a valid Authorizer source after fresh preflight; green review does not create authorization.' };
  const toolsPage = `GitHub Verified contract Runtime access varies. Explicit authorization + fresh preflight. https://github.com/rickvang/tool-repo/blob/${pin}/tools/github/AGENTS.md`;
  assert.equal(validateGitHubGovernanceContract({ agents, workOrders, boundedPlaybook, boundedRoute, toolsPage }), pin);
  assert.throws(() => validateGitHubGovernanceContract({ agents: agents.replace(pin, '94acc6082e941439d2ee532f1b1b091cd42eb923'), workOrders, boundedPlaybook, boundedRoute, toolsPage }), /post-split GitHub Tool contract/i);
  assert.throws(() => validateGitHubGovernanceContract({ agents, workOrders, boundedPlaybook: boundedPlaybook + ' Separately authorized merge.', boundedRoute, toolsPage }), /duplicate reusable merge-authorization rule/i);
  assert.throws(() => validateGitHubGovernanceContract({ agents, workOrders, boundedPlaybook: boundedPlaybook + ' Pass only with explicit authorization and fresh preflight.', boundedRoute, toolsPage }), /redundant second confirmation/i);
  assert.throws(() => validateGitHubGovernanceContract({ agents, workOrders, boundedPlaybook, boundedRoute: { next_handoff: 'Treat merge as a separately authorized mutation.' }, toolsPage }), /routing must defer GitHub mutation semantics/i);
  assert.throws(() => validateGitHubGovernanceContract({ agents, workOrders, boundedPlaybook, boundedRoute, toolsPage: toolsPage.replace(pin, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb') }), /Tools page GitHub contract link must match/i);
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
    first_reads: ['docs/job-search/application-tracker-contract.md when opportunity/application tracking is in scope'],
    next_handoff: 'For an unqualified request, begin with Riley Morgan as the default entry and routing point; Riley selects the smallest specialist or Skill for narrow work and the Evidence-led Job Search Playbook for full-outcome work. Explicit requests for a named specialist, Skill, or Playbook may route directly. The Playbook owns stages, shared state, quality gates, recovery, and the learning loop. Resolve standing decisions and any Candidate Baseline before composition, preserve the career spine, and do not substitute a secondary profile store. Resolve an existing tracker record before creating a duplicate, preserve sourceUrl and source-backed postingDate, set packetUrl and Packet Ready after packet completion, set appliedDate only after confirmed submission, and use confirmed events for later states.'
  };
  const implementation = 'Riley Morgan is the default system entry and routing point for unqualified requests. Riley routes full-outcome work to Priya Desai, who operates the Evidence-led Job Search Playbook as the process surface. The Playbook supplies shared state, quality gates, recovery, and the learning loop. Explicit requests may route directly. The Candidate Baseline Resume passes a Private-source resolution gate before role tailoring; preserve the career spine, block secondary profile stores from substitution, and run baseline-to-output integrity. The remote store is the primary persistence layer when configured; browser-local state is explicit fallback, migration, and recovery. Resolve an existing record by sourceUrl; postingDate is source-backed and never infer it. Set packetUrl and Packet Ready after packet completion, appliedDate only after confirmed submission, and later lifecycle states only from confirmed events.';
  const riley = { roleLabel: 'AI orchestrator' };
  const rileyFlows = [{ title: 'Frame the system goal and boundary', summary: 'Turn an unqualified opportunity into a bounded outcome.' }];
  const playbook = { id: 'playbook-evidence-led-job-search' };
  const specialistIds = new Set(['career-strategist', 'role-calibrator', 'application-editor', 'outreach-interview-coach', 'ui-expert', 'document-designer']);
  assert.doesNotThrow(() => validateJobSearchRoutingContract({ route, implementation, riley, rileyFlows, playbook, specialistIds }));
  assert.doesNotThrow(() => validateApplicationWorkflowTrackerGuidance({ route, implementation }));
  assert.throws(() => validateApplicationWorkflowTrackerGuidance({ route: { ...route, first_reads: [] }, implementation }), /tracker contract/i);
  assert.throws(() => validateApplicationWorkflowTrackerGuidance({ route, implementation: implementation.replace('never infer', 'estimate') }), /source-backed updates/i);
  assert.throws(() => validateJobSearchRoutingContract({ route: { ...route, next_handoff: route.next_handoff.replace('Explicit requests', 'Requests') }, implementation, riley, rileyFlows, playbook, specialistIds }), /direct invocation/);
  assert.throws(() => validateJobSearchRoutingContract({ route, implementation, riley: { roleLabel: 'Job-search orchestrator' }, rileyFlows, playbook, specialistIds }), /canonical AI orchestrator/);
  assert.throws(() => validateJobSearchRoutingContract({ route: { ...route, next_handoff: route.next_handoff.replace('Candidate Baseline', 'resume source') }, implementation, riley, rileyFlows, playbook, specialistIds }), /Candidate Baseline resolution/);
  assert.throws(() => validateJobSearchRoutingContract({ route, implementation: implementation.replace('baseline-to-output', 'final review'), riley, rileyFlows, playbook, specialistIds }), /baseline-integrity gate/);
});

test('Application tracker keeps private data behind explicit local or authenticated stores', () => {
  const page = '<h1>Keep every opportunity in one place.</h1><strong id="storage-mode-title">Private data</strong><code>persona-library.job-applications.v1</code><form id="auth-form"><input id="auth-email"><input id="auth-password" autocomplete="current-password"></form><input id="posting-date" type="date"><table><thead><tr><th>Posting date</th></tr></thead></table><button id="migrate-local-button">Migrate local data</button><button id="merge-import-button">Merge safe changes</button><button id="replace-all-button">Replace all</button><script src="js/job-tracker-config.js"></script><script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0"></script><script src="js/job-tracker-import.js"></script><script src="js/job-tracker-store.js"></script><script src="js/job-tracker.js"></script>';
  const runtime = "const STATUSES = ['Found','Reviewing','Packet Ready','Applied','Interviewing','Offer','Closed']; const postingDate = document.createElement('td'); const postingDateValue = fields.postingDate.value; const payload = { format: FORMAT, version: FORMAT_VERSION }; importFile.addEventListener('change',()=>{}); importTools.safeUrl; 'Local writes are not used as a silent fallback';";
  const importRuntime = "const FORMAT = 'persona-library-job-applications'; const STATUSES = ['Found','Reviewing','Packet Ready','Applied','Interviewing','Offer','Closed']; const postingDate = record.postingDate; canonicalizeSourceUrl; previewMerge; replaceAll; throw new Error('Unsupported tracker format'); throw new Error('newer or unsupported version'); ['http:', 'https:'];";
  const storeRuntime = "createLocalStorageOpportunityStore; createSupabaseOpportunityStore; client.schema(schema).from('opportunities'); posted_at; client.auth.signInWithPassword({ email, password }); persistSession: true; localStorage.getItem(storageKey);";
  const configRuntime = "globalThis.PersonaLibraryJobTrackerConfig = {\"mode\":\"local\",\"supabaseUrl\":\"\",\"publishableKey\":\"\",\"schema\":\"app\"};";
  const contract = 'Authenticated private opportunity store. postingDate is optional and sources must never infer or fabricate it. LocalStorageOpportunityStore and SupabaseOpportunityStore use signInWithPassword; password values are never written to local storage. They preserve versioned JSON for a future standalone application. This remains separate from the seen-job deduplication contract. The normal import is a non-destructive merge/upsert and remote failure is never a silent fallback.';
  assert.doesNotThrow(() => validateJobApplicationTrackerContract({ page, runtime, importRuntime, storeRuntime, configRuntime, contract }));
  assert.throws(() => validateJobApplicationTrackerContract({ page: page + 'Rick Vang', runtime, importRuntime, storeRuntime, configRuntime, contract }), /candidate-specific private values/);
  assert.throws(() => validateJobApplicationTrackerContract({ page, runtime, importRuntime, storeRuntime: storeRuntime + ' service_role', configRuntime, contract }), /secret\/service-role key/);
  assert.throws(() => validateJobApplicationTrackerContract({ page, runtime, importRuntime, storeRuntime: '', configRuntime, contract }), /storage adapter/);
  assert.throws(() => validateJobApplicationTrackerContract({ page: page + 'Send sign-in link', runtime, importRuntime, storeRuntime, configRuntime, contract }), /magic-link email auth/);
});

test('Applications tracker import merges safely and remains idempotent', () => {
  const source = readFileSync(path.join(root, 'client/job-tracker-import.js'), 'utf8');
  const sandbox = { URL, Date, Math, console };
  vm.runInNewContext(source, sandbox, { filename: path.join(root, 'client/job-tracker-import.js') });
  const importTools = sandbox.PersonaLibraryJobTrackerImport;
  const incoming = [0, 1, 2, 3].map(index => ({
    company: 'Example employer ' + index,
    role: 'Product designer ' + index,
    status: 'Packet Ready',
    sourceUrl: 'https://jobs.example.com/role/' + index
  }));
  let generatedEmptyId = 0;
  const emptyPreview = importTools.previewMerge([], incoming, { createId: () => 'generated-empty-' + generatedEmptyId++, getNow: () => '2026-09-18T00:00:00.000Z' });
  assert.equal(emptyPreview.added, 4);
  assert.equal(emptyPreview.records.length, 4);

  let generatedUnrelatedId = 0;
  const withUnrelated = importTools.previewMerge([{ id: 'unrelated', company: 'Unrelated', role: 'Designer', status: 'Found' }], incoming, { createId: () => 'generated-unrelated-' + generatedUnrelatedId++, getNow: () => '2026-09-18T00:00:00.000Z' });
  assert.equal(withUnrelated.added, 4);
  assert.equal(withUnrelated.records.length, 5);

  const reimport = importTools.previewMerge(emptyPreview.records, incoming, { createId: () => 'different-generated-id', getNow: () => '2026-09-18T00:00:00.000Z' });
  assert.equal(reimport.added, 0);
  assert.equal(reimport.updated, 0);
  assert.equal(reimport.unchanged, 4);

  const advanced = importTools.previewMerge([{
    id: 'applied-1',
    company: 'Example employer',
    role: 'Senior designer',
    status: 'Applied',
    sourceUrl: 'https://jobs.example.com/advanced',
    nextAction: 'Follow up with recruiter',
    notes: 'User-owned note'
  }], [{
    id: 'applied-1',
    company: 'Example employer',
    role: 'Senior designer',
    status: 'Packet Ready',
    postingDate: '2026-09-10',
    sourceUrl: 'https://jobs.example.com/advanced',
    packetUrl: 'https://drive.example.com/packet'
  }], { getNow: () => '2026-09-18T00:00:00.000Z' });
  assert.equal(advanced.records[0].status, 'Applied');
  assert.equal(advanced.records[0].nextAction, 'Follow up with recruiter');
  assert.equal(advanced.records[0].notes, 'User-owned note');
  assert.equal(advanced.records[0].packetUrl, 'https://drive.example.com/packet');
  assert.equal(advanced.records[0].postingDate, '2026-09-10');

  const canonical = importTools.previewMerge([{
    id: 'canonical-existing',
    company: 'Canonical employer',
    role: 'Designer',
    sourceUrl: 'https://JOBS.example.com/role/7/?utm_source=old'
  }], [{
    id: 'different-id',
    company: 'Canonical employer',
    role: 'Designer',
    sourceUrl: 'https://jobs.example.com/role/7/?utm_source=new',
    compensation: '$100K'
  }], { getNow: () => '2026-09-18T00:00:00.000Z' });
  assert.equal(canonical.records.length, 1);
  assert.equal(canonical.records[0].compensation, '$100K');
  assert.equal(canonical.updated, 1);

  const fuzzyDifferentPosting = importTools.previewMerge([{
    id: 'fuzzy-existing',
    company: 'Same employer',
    role: 'Same role',
    sourceUrl: 'https://jobs.example.com/role/old'
  }], [{
    company: 'Same employer',
    role: 'Same role',
    sourceUrl: 'https://jobs.example.com/role/new'
  }], { createId: () => 'fuzzy-new', getNow: () => '2026-09-18T00:00:00.000Z' });
  assert.equal(fuzzyDifferentPosting.added, 1);

  assert.throws(() => importTools.parseImport({ format: 'unsupported', version: 1, records: [] }), /Unsupported tracker format/);
  assert.throws(() => importTools.parseImport({ format: 'persona-library-job-applications', version: 2, records: [] }), /newer or unsupported/);
  assert.throws(() => importTools.previewMerge([], [{ company: 'Missing role' }]), /company and role are required/);
  assert.equal(importTools.replaceAll([{ company: 'Restored', role: 'Role' }], { createId: () => 'restored' })[0].id, 'restored');
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
  assert.match(playbook, /authorized by the current requester instruction or target-repository contract/);
  assert.match(playbook, /standing completion authorization may already have been established/);
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


test('Riley continuity keeps universal Current Work orchestration, Work Orders, and volatile live state in distinct roles', () => {
  const agents = 'For every substantial workstream, Riley is the default durable orchestration owner. The selected operating route may operate directly without an unnecessary Riley execution hop. Use Notion Current Work with Operating Route and optional Parent Work ID. Do not mirror volatile GitHub state; refresh live systems when freshness requires it.';
  const workOrders = 'For every substantial workstream Riley is the default durable orchestration owner and the selected route may operate directly. Current Work records Operating Route and Parent Work ID, the Work Order owns detailed recovery, and live systems own volatile authority. Resume order: Current Work → linked Work Order → selective refresh. Do not mirror volatile live state.';
  const riley = { id:'ai-orchestrator', behaviors:['Resumes substantial linked work from the Current Work checkpoint before broad rediscovery','Treats every substantial Current Work workstream as Riley-governed while allowing the selected route to execute directly'], needs:['A durable cross-agent workstream index linked to detailed Work Orders'], implication:'For every substantial Current Work workstream, use Operating Route and Parent Work ID when applicable; allow the selected route to execute directly. Use Current Work as the cross-agent index, the Work Order as detailed recovery state, and live systems as freshness-sensitive authority; resume before broad rediscovery.' };
  const rileyFlows = [{title:'Operate and improve the system',activities:[['Resume and checkpoint substantial work','At material transition','Continuity','Reconstruction','Current Work + linked Work Order (representative)'],['Reconcile durable orchestration state','At creation/reroute/handoff/blocker/completion','Continuity','Route drift','Operating Route + Parent Work ID']]}];
  assert.doesNotThrow(() => validateRileyContinuityContract({ agents, workOrders, riley, rileyFlows }));
  assert.throws(() => validateRileyContinuityContract({ agents, workOrders: workOrders.replace('Do not mirror volatile live state', 'Mirror all live state'), riley, rileyFlows }), /Work Order guidance/i);
  assert.throws(() => validateRileyContinuityContract({ agents: agents.replace('may operate directly', 'must route every execution through Riley'), workOrders, riley, rileyFlows }), /Root AGENTS/i);
});


test('Repository working copy and small-change lane replace the local-checkout ban without bypassing Work Graph supervision', () => {
  const agents = 'Make file changes in a clean working copy on a task branch created from freshly fetched origin/main. Local validation does not replace required GitHub checks. Use a Work Order only for durable execution/recovery state not already held by domain-specific artifacts; otherwise use the small-change lane.';
  const workOrders = 'Small-change lane: existing authoritative surfaces already hold the durable state needed to resume the work. Small refers to tracking/recovery footprint, not importance. A Verification Queue can own deferred verification. Push a checkpoint-only commit only when an interruption would otherwise lose resumable state. An active WorkNode keeps its authoritative Dispatch, Gates, evidence, and disposition.';
  const architecture = 'Work Orders are optional repository-wide execution/recovery packets. Active Work Order packages stay in docs/work-orders when a dedicated execution/recovery packet is warranted.';
  const uxPractice = 'For the small-change lane, the pull request is the active work record. An active WorkNode keeps its Dispatch, Gate, evidence, and disposition.';
  const uxContextTemplate = 'Do not create this packet for a qualifying small-change-lane change. Use the pull request and preserve the WorkNode.';
  const uxWorkOrderTemplate = 'Use this template when a UX practice run needs a dedicated Work Order execution/recovery packet. Do not create this template for a qualifying small-change-lane change. Use the pull request and preserve the WorkNode. When this template is warranted for repository work, keep the active Work Order under the artifact home.';
  const uxRouting = 'For the small-change lane, the pull request is the active work record and the WorkNode remains in the active Work Graph.';
  const docsReadme = 'Qualifying small repository change: the pull request may be the active repository record; preserve Current Work, Verification Queue records, and Work Graph membership when they have their own lifecycle.';
  const args = { agents, workOrders, architecture, uxPractice, uxContextTemplate, uxWorkOrderTemplate, uxRouting, docsReadme };
  assert.doesNotThrow(() => validateRepositoryWorkingCopyContract(args));
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, agents: `${agents} Do not use a local checkout for repository work.` }), /local-checkout ban/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, agents: agents.replace('clean working copy', 'checkout') }), /Root AGENTS/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, agents: agents.replace('durable execution/recovery state', 'all non-trivial work') }), /Root AGENTS/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, workOrders: workOrders.replace('tracking/recovery footprint', 'one session') }), /Work Order guidance/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, workOrders: workOrders.replace('Verification Queue', 'work log') }), /Work Order guidance/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, workOrders: workOrders.replace('checkpoint-only commit', 'commit') }), /Work Order guidance/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, workOrders: workOrders.replace('WorkNode', 'task') }), /Work Order guidance/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, architecture: 'Work Orders are the repository-wide active-work packet and progress record for non-trivial work. Active non-trivial work stays in docs/work-orders/<work-order-id>/.' }), /Architecture/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, uxPractice: 'A focused small change requires a short work-order status.' }), /UX practice/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, uxContextTemplate: 'For a trivial change, record a short skip reason in the Work Order.' }), /UX Project Context template/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, workOrders: `${workOrders} A change is small when it fits in one pull request and is expected to finish in one session.` }), /one-session small-change gate/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, uxPractice: `${uxPractice} Focused tier: short work-order status.` }), /UX practice must not restore/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, uxContextTemplate: `${uxContextTemplate} For a trivial change, record a short skip reason in the Work Order instead of creating a full packet.` }), /UX Project Context template must not restore/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, uxWorkOrderTemplate: `${uxWorkOrderTemplate} For a trivial change, a short note may state that a full work order was not warranted and why.` }), /UX Work Order template must not restore/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, uxWorkOrderTemplate: `${uxWorkOrderTemplate} Use this template as the active work packet for a non-trivial UX practice run.` }), /UX Work Order template must not restore automatic/);
  assert.throws(() => validateRepositoryWorkingCopyContract({ ...args, uxWorkOrderTemplate: `${uxWorkOrderTemplate} For non-trivial work in this repository, keep the active Work Order and project-specific design artifacts under the artifact home.` }), /UX Work Order template must not route all non-trivial/);
});


test('Riley work graph contract keeps one authoritative dispatch, evidence gates, and read-before-retry recovery', () => {
  const riley = {
    id:'ai-orchestrator',
    behaviors:['Builds a minimal work graph and keeps one authoritative dispatch per node while distinguishing handoff from supervised delegation.'],
    needs:['Stable WorkNode, Dispatch, Gate, evidence, and disposition identity.'],
    skills:['Work graph orchestration — synthesized'],
    implication:'Use read-before-retry recovery before replacement work.'
  };
  const rileyFlows = [{title:'Operate and improve the system',activities:[['Supervise the active work graph','During multi-lane execution','Coherent progress','Dispatch drift','WorkGraph packet + live runtime/GitHub references']]}];
  const skillCatalog = [{
    id:'skill-work-graph-orchestration',
    name:'Work graph orchestration',
    profiles:[{definition:'Keep one authoritative WorkNode Dispatch with Gate and evidence.'}],
    guidance:{operation:{moves:['Run collision review and read-before-retry recovery.']}}
  }];
  const operationalScenarioCatalog = [{
    id:'scenario-riley-work-graph-supervision',
    ownerId:'skill-work-graph-orchestration',
    status:'active',
    sequence:['Keep one authoritative Dispatch.','Read current state before retrying.'],
    dont:['Do not infer completion from idle or self-report.','Do not create a second authoritative task database.']
  }];
  const skillsRoute = {routes:[{id:'work-graph-orchestration',target:'work-graph-orchestration',package_path:'.agents/skills/work-graph-orchestration'}]};
  const skillPackage = 'Keep one authoritative active Dispatch per WorkNode. Distinguish handoff from supervised delegation. Parallelize only collision-safe work. Recovery is read-before-retry. Use the Execution-adapter contract. This Skill does not persist a second canonical task database. A bounded correction stays in the same attempt: CI runs and review events are not new Dispatches. Create a new Dispatch identity only when the attempt is abandoned, superseded, or reassigned. The small-change lane changes tracking artifacts, not orchestration membership, when existing records already hold enough recovery state.';
  assert.doesNotThrow(() => validateRileyWorkGraphContract({ riley, rileyFlows, skillCatalog, operationalScenarioCatalog, skillsRoute, skillPackage }));
  assert.throws(() => validateRileyWorkGraphContract({ riley, rileyFlows, skillCatalog, operationalScenarioCatalog, skillsRoute, skillPackage: skillPackage.replace('one authoritative active Dispatch per WorkNode', 'several active attempts per WorkNode') }), /Callable work-graph Skill/i);
  assert.throws(() => validateRileyWorkGraphContract({ riley, rileyFlows, skillCatalog, operationalScenarioCatalog, skillsRoute, skillPackage: skillPackage.replace('CI runs and review events are not new Dispatches', 'Every CI run creates a new Dispatch') }), /Callable work-graph Skill/i);
  assert.throws(() => validateRileyWorkGraphContract({ riley, rileyFlows, skillCatalog, operationalScenarioCatalog, skillsRoute, skillPackage: skillPackage.replace('small-change lane changes tracking artifacts, not orchestration membership, when existing records already hold enough recovery state', 'small changes are not tracked') }), /Callable work-graph Skill/i);
});
