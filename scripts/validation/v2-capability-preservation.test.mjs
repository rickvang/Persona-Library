import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { loadValidationContext } from './context.mjs';
import { validateSkills } from './skills.mjs';
import { assertPreserved, capturePilot, fixture, loadPinnedBaseline, plain, profilePayloads, readerBaseline, uiWorkflowBackfill, orchestrationWorkflowBackfill, workflowDiagnostics } from './v2-capability-preservation.fixture.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
let current, baseline, expected, historical;
before(async () => {
  baseline = await loadPinnedBaseline(root);
  current = await loadValidationContext(root);
  historical = capturePilot(baseline.context);
  expected = readerBaseline(baseline.context);
});
after(async () => { await baseline?.cleanup(); });

function initialize(context, change = () => {}) {
  const sandbox = { window: {} };
  vm.runInNewContext(context.files.librarySource, sandbox, { filename: 'complete-library-source.js' });
  change(sandbox.window.PersonaLibraryData);
  vm.runInNewContext(context.files.templatePreviewSource, sandbox, { filename: 'template-preview.js' });
  vm.runInNewContext(context.files.modelSource, sandbox, { filename: 'library-model.js' });
  return sandbox.window.PersonaLibraryData;
}
const omitPilot = data => { data.personas = data.personas.filter(persona => !fixture.pilotSourceKeys.includes(persona.id)); };
const semanticView = catalog => plain(catalog.map(({ id, name, methods, guidance, guidanceCoverage, buildingBlocks, supportingConnections, relatedSkills }) => ({ id, name, methods, guidance, guidanceCoverage, buildingBlocks, supportingConnections, relatedSkills })));

function neutralInput() {
  const key = 'skill-interaction-states-and-behavior-design';
  const record = baseline.context.data.skillLibrary['ui-expert'].find(record => baseline.context.model.slugify(record.name) === key);
  const original = { repository: 'rickvang/Persona-Library', revision: fixture.baselineCommit, path: 'content/library-data/skills-core.js', selector: 'skillLibrary[ui-expert]/' + record.name };
  return {
    skillLibrary: { [key]: [{ id: 'method-interaction-states-and-behavior-design', name: record.name, status: record.status, definition: record.definition, when: record.triggers, actions: record.actions, evidence: record.evidence, legacySourceKey: 'ui-expert', provenance: { original, current: { repository: original.repository, path: original.path, selector: key } }, workflowRefs: [{ id: 'workflow-test-states', title: 'Test states' }] }] },
    flowLibrary: { 'ui-expert': [{ id: 'workflow-test-states', title: 'Test states', activities: [['Exercise failure and recovery']] }] },
    personas: [], skillUnits: []
  };
}

test('CW-92: preserve full-source material fields under the explicit reader transformation', () => {
  assert.equal(Object.values(historical.records).flat().length, fixture.expectedProfileCount);
  assert.equal(historical.skillIds.length, fixture.expectedProfileCount);
  assert.equal(baseline.context.libraryDataSources.length, 21);
  assertPreserved(capturePilot(current), expected);
});

test('CW-92 WP04-F1: seven UI workflow IDs preserve every authored body and scoped lookup', () => {
  const ui = current.data.flowLibrary['ui-expert'];
  const original = baseline.context.data.flowLibrary['ui-expert'];
  assert.equal(ui.length, 7);
  assert.deepStrictEqual(plain(ui.map(({ id, title }) => [title, id])), uiWorkflowBackfill);
  assert.deepStrictEqual(plain(ui.map(({ id, ...body }) => body)), plain(original), 'Only ID was added; keep all original activities, evidence, cadence and summaries');
  const allIds = Object.values(current.data.flowLibrary).flat().map(flow => flow.id).filter(Boolean);
  assert.equal(new Set(allIds).size, allIds.length, 'Explicit workflow IDs must not collide anywhere in the source');
  for (const [title, id] of uiWorkflowBackfill) {
    const entry = current.model.resolveWorkflowReference({ id, legacySourceKey: 'ui-expert', title }, current.data.flowLibrary);
    assert.equal(entry.flow.id, id);
    assert.equal(entry.flow.title, title);
    assert.equal(entry.sourceKey, 'ui-expert');
    assert.throws(() => current.model.resolveWorkflowReference({ id, legacySourceKey: 'ai-orchestrator', title }, current.data.flowLibrary), /[Ww]orkflow ID source mismatch/);
    assert.throws(() => current.model.resolveWorkflowReference({ id, legacySourceKey: 'ui-expert', title: 'Renamed in reference only' }, current.data.flowLibrary), /[Ww]orkflow ID title mismatch/);
  }
  const arbitrary = plain(current.data.flowLibrary);
  arbitrary['ui-expert'][0].title = 'Renamed display title';
  assert.equal(arbitrary['ui-expert'][0].id, uiWorkflowBackfill[0][1], 'Accepted workflow IDs do not derive dynamically from display titles');
});

test('CW-92 WP04-F2: seven orchestration workflow IDs preserve all source bodies and the recovery collision', () => {
  const flows = current.data.flowLibrary['ai-orchestrator'];
  const historicalFlows = baseline.context.data.flowLibrary['ai-orchestrator'];
  assert.equal(flows.length, 7);
  assert.deepStrictEqual(plain(flows.map(({ title, id }) => [title, id])), orchestrationWorkflowBackfill);
  assert.deepStrictEqual(plain(flows.map(({ id, ...body }) => body)), plain(historicalFlows), 'All 24 original activities and workflow conditions remain untouched');
  const allIds = Object.values(current.data.flowLibrary).flat().map(flow => flow.id).filter(Boolean);
  assert.equal(new Set(allIds).size, 14, 'All 14 pilot workflow IDs must be unique');
  for (const [title, id] of orchestrationWorkflowBackfill) {
    const resolved = current.model.resolveWorkflowReference({ id, title, legacySourceKey: 'ai-orchestrator' }, current.data.flowLibrary);
    assert.equal(resolved.flow.id, id);
    assert.equal(resolved.sourceKey, 'ai-orchestrator');
    assert.throws(() => current.model.resolveWorkflowReference({ id, title, legacySourceKey: 'ui-expert' }, current.data.flowLibrary), /[Ww]orkflow ID source mismatch/);
  }
  const recoveryTitle = 'Recover a failed or unsafe run';
  const orchestration = current.model.resolveWorkflowReference({ id: 'workflow-run-recovery-containment-and-control', title: recoveryTitle, legacySourceKey: 'ai-orchestrator' }, current.data.flowLibrary);
  const observer = current.model.resolveWorkflowReference({ title: recoveryTitle, legacySourceKey: 'conformance-observer' }, current.data.flowLibrary);
  assert.equal(observer.flow.id, undefined, 'Do not backfill the nonpilot observer workflow');
  assert.notDeepStrictEqual(plain(orchestration.flow.activities), plain(observer.flow.activities));
  assert.throws(() => current.model.resolveWorkflowReference({ title: recoveryTitle }, current.data.flowLibrary), /Ambiguous workflow title/);
  assert.throws(() => current.model.resolveWorkflowReference({ id: orchestration.flow.id, legacySourceKey: 'conformance-observer', title: recoveryTitle }, current.data.flowLibrary), /[Ww]orkflow ID source mismatch/);
});

test('CW-92: generated source and model match actual authored source', () => {
  const sandbox = { window: {} };
  vm.runInNewContext(current.files.libraryOutput, sandbox);
  vm.runInNewContext(current.files.templatePreviewSource, sandbox);
  vm.runInNewContext(current.files.modelOutput, sandbox);
  assertPreserved(capturePilot({ ...current, data: sandbox.window.PersonaLibraryData }), capturePilot(current));
});

test('CW-92: preservation rejects lost evidence, activities, variants and unknown source fields', () => {
  for (const mutate of [
    value => { delete value.records['ui-expert'][0].evidence; },
    value => { value.records['ui-expert'][0].unclassified = 'must not disappear'; },
    value => { value.flows['ui-expert'][0].activities.pop(); },
    value => { value.catalog.find(skill => skill.profiles.length > 1).profiles.pop(); },
    value => { value.catalog[0].methods[0].evidence = 'fabricated'; }
  ]) {
    const changed = plain(expected); mutate(changed);
    assert.throws(() => assertPreserved(changed, expected));
  }
  const unrelated = current.data.skillCatalog.find(skill => !expected.catalog.some(item => item.id === skill.id)).id;
  const data = plain(current.data); data.maintenance.skills[unrelated].version = 'unrelated';
  assertPreserved(capturePilot({ ...current, data }), capturePilot(current));
  data.maintenance.skills[expected.skillIds[0]].version = 'must-be-detected';
  assert.throws(() => assertPreserved(capturePilot({ ...current, data }), capturePilot(current)));
  const bad = plain(current.data); bad.skillLibrary['ui-expert'][0].unclassified = 'not silently omitted';
  assert.throws(() => current.model.buildSkillCatalog(bad), /Unclassified method field/);
});

test('CW-92: actual methods and shared guidance are independent of all Persona metadata', () => {
  const original = current.model.buildSkillCatalog(current.data);
  for (const mutate of [
    data => { data.personas.reverse(); },
    data => { data.personas.forEach(persona => { persona.name = 'metadata only'; persona.roleLabel = 'not a selection key'; }); },
    data => { data.personas = data.personas.filter(persona => persona.id !== 'ui-expert'); },
    data => { data.personas = data.personas.filter(persona => persona.id !== 'ai-orchestrator'); },
    omitPilot,
    data => { data.personas = []; },
    data => { delete data.personas; }
  ]) {
    const data = plain(current.data); mutate(data);
    const actual = current.model.buildSkillCatalog(data);
    assert.deepStrictEqual(semanticView(actual), semanticView(original));
    assert.deepStrictEqual(profilePayloads(actual), profilePayloads(original));
  }
  const observed = original.map(skill => skill.id);
  for (const skill of baseline.context.data.skillCatalog) assert.ok(observed.includes(skill.id), `Lost baseline ID ${skill.id}`);
  const pinned = profilePayloads(baseline.context.data.skillCatalog);
  const keys = new Set(pinned.map(profile => `${profile.skillId}/${profile.personaId}`));
  const assertBaseline = catalog => assert.deepStrictEqual(profilePayloads(catalog).filter(profile => keys.has(`${profile.skillId}/${profile.personaId}`)), pinned);
  assertBaseline(original);
  const lost = plain(current.data); delete lost.skillLibrary['ux-senior'];
  assert.throws(() => assertBaseline(current.model.buildSkillCatalog(lost)));
  console.log('CW92_INDEPENDENCE ' + JSON.stringify({ skillIds: original.length, methodCount: original.reduce((sum, skill) => sum + skill.methods.length, 0), metadataCases: 7 }));
});

test('CW-92: historical failures remain demonstrated only on the immutable baseline', () => {
  const prior = baseline.context;
  const data = plain(prior.data); omitPilot(data);
  assert.equal(prior.model.buildSkillCatalog(prior.data).length, 79);
  assert.equal(prior.model.buildSkillCatalog(data).length, 72);
  assert.equal(prior.model.buildSkillCatalog({ ...prior.data, personas: [] }).length, 0);
  const reversed = plain(prior.data); reversed.personas.reverse();
  const changed = prior.model.buildSkillCatalog(reversed);
  assert.equal(prior.data.skillCatalog.filter(skill => JSON.stringify(skill.guidance) !== JSON.stringify(changed.find(item => item.id === skill.id).guidance)).length, 13);
  assert.throws(() => initialize(prior, data => { data.personas = data.personas.filter(persona => persona.id !== 'ui-expert'); }), /revisions/);
});

test('CW-92: full source and maintenance initialize without pilot or any Persona records', () => {
  for (const mutate of [omitPilot, data => { data.personas = []; }, data => { delete data.personas; }]) {
    const data = initialize(current, mutate);
    assert.deepStrictEqual(semanticView(data.skillCatalog), semanticView(current.data.skillCatalog));
    if (!data.personas.length) assert.equal(Object.keys(data.maintenance.personas).length, 0, 'Do not fabricate Persona histories');
    validateSkills({ data }, { personaIds: new Set(data.personas.map(persona => persona.id)) });
  }
  const marker = 'const rileyPersonaRecord = window.PersonaLibraryDataFragments.personas.find';
  const inject = source => source.replace(marker, "window.PersonaLibraryDataFragments.personas = window.PersonaLibraryDataFragments.personas.filter(p => p.id !== 'ai-orchestrator');\n" + marker);
  assert.equal(current.files.librarySource.split(marker).length - 1, 1);
  assert.throws(() => vm.runInNewContext(inject(baseline.context.files.librarySource), { window: {} }), /overview|undefined/);
  const sandbox = { window: {} };
  vm.runInNewContext(inject(current.files.librarySource), sandbox);
  vm.runInNewContext(current.files.templatePreviewSource, sandbox);
  vm.runInNewContext(current.files.modelSource, sandbox);
  assert.deepStrictEqual(semanticView(sandbox.window.PersonaLibraryData.skillCatalog), semanticView(current.data.skillCatalog));
});

test('CW-92: actual assembler permits omitted metadata but still requires other source fragments', async () => {
  const sources = current.libraryDataSources.filter(source => source !== 'content/library-data.js');
  const source = (await Promise.all(sources.map(source => current.readFile(source)))).join('\n');
  const assembler = await current.readFile('content/library-data.js');
  const sandbox = { window: {} }; vm.runInNewContext(source, sandbox);
  delete sandbox.window.PersonaLibraryDataFragments.personas;
  vm.runInNewContext(assembler, sandbox);
  vm.runInNewContext(current.files.templatePreviewSource, sandbox);
  vm.runInNewContext(current.files.modelSource, sandbox);
  assert.deepStrictEqual(semanticView(sandbox.window.PersonaLibraryData.skillCatalog), semanticView(current.data.skillCatalog));
  const incomplete = { window: {} }; vm.runInNewContext(source, incomplete);
  delete incomplete.window.PersonaLibraryDataFragments.skillLibrary;
  assert.throws(() => vm.runInNewContext(assembler, incomplete), /Missing.*skillLibrary/);
});

test('CW-92: neutral methods keep explicit identity after display rename and validate without a Persona', () => {
  const input = neutralInput(), key = Object.keys(input.skillLibrary)[0];
  const [skill] = current.model.buildSkillCatalog(input);
  assert.equal(skill.id, key); assert.equal(skill.personas.length, 0);
  assert.equal(skill.methods[0].when, input.skillLibrary[key][0].when);
  validateSkills({ data: { ...input, skillCatalog: [skill] } }, { personaIds: new Set() });
  input.skillLibrary[key][0].name = 'Renamed display only';
  assert.equal(current.model.buildSkillCatalog(input)[0].id, key);
  delete input.skillLibrary[key][0].legacySourceKey;
  assert.throws(() => current.model.buildSkillCatalog(input), /requires structured legacy origin/);
  // Synthetic native input has no legacy-record provenance to reconstruct.
  input.skillLibrary[key][0].provenance.original.selector = key + '/method-interaction-states-and-behavior-design';
  const native = current.model.buildSkillCatalog(input)[0];
  assert.equal(native.profiles.length, 0); assert.equal(native.methods.length, 1);
  validateSkills({ data: { ...input, skillCatalog: [native] } }, { personaIds: new Set() });
});

test('CW-92: reject duplicate methods, dual authored origins, bad provenance and invalid workflow IDs', () => {
  const input = neutralInput(), key = Object.keys(input.skillLibrary)[0];
  const duplicate = plain(input); duplicate.skillLibrary[key].push(plain(duplicate.skillLibrary[key][0]));
  assert.throws(() => current.model.buildSkillCatalog(duplicate), /duplicate method ID/);
  const dual = plain(input); dual.skillLibrary['ui-expert'] = [plain(baseline.context.data.skillLibrary['ui-expert'].find(record => baseline.context.model.slugify(record.name) === key))];
  assert.throws(() => current.model.buildSkillCatalog(dual), /Duplicate authored method origin/);
  const renamedIdentity = plain(input);
  renamedIdentity.skillLibrary[key][0].id = 'method-ui-expert';
  assert.throws(() => current.model.buildSkillCatalog(renamedIdentity), /semantic base method ID/);
  const copied = plain(input), wrongKey = 'skill-copied-procedure';
  copied.skillLibrary[wrongKey] = [plain(copied.skillLibrary[key][0])];
  copied.skillLibrary[wrongKey][0].id = 'method-copied-procedure';
  copied.skillLibrary[wrongKey][0].provenance.current.selector = wrongKey;
  assert.throws(() => current.model.buildSkillCatalog(copied), /Conflicting semantic Skill identity/);
  const forgedOrigin = plain(input);
  forgedOrigin.skillLibrary[key][0].legacySourceKey = 'made-up-origin';
  forgedOrigin.skillLibrary[key][0].provenance.original.selector = 'skillLibrary[made-up-origin]/' + forgedOrigin.skillLibrary[key][0].name;
  assert.throws(() => current.model.buildSkillCatalog(forgedOrigin), /Unknown pinned legacy origin/);
  const selectorWhitespace = plain(input);
  selectorWhitespace.skillLibrary[key][0].provenance.original.selector = 'skillLibrary[ui-expert]/ ' + selectorWhitespace.skillLibrary[key][0].name;
  assert.throws(() => current.model.buildSkillCatalog(selectorWhitespace), /Unknown pinned legacy origin/);
  const disguisedHistory = plain(input);
  delete disguisedHistory.skillLibrary[key][0].legacySourceKey;
  disguisedHistory.skillLibrary[key][0].provenance.original.selector = ' skillLibrary[ui-expert]/' + disguisedHistory.skillLibrary[key][0].name;
  assert.throws(() => current.model.buildSkillCatalog(disguisedHistory), /Invalid native method provenance/);
  const disguisedNativePath = plain(input);
  delete disguisedNativePath.skillLibrary[key][0].legacySourceKey;
  disguisedNativePath.skillLibrary[key][0].provenance.original.selector = key + '/method-interaction-states-and-behavior-design';
  disguisedNativePath.skillLibrary[key][0].provenance.original.path = 'unrelated.js';
  assert.throws(() => current.model.buildSkillCatalog(disguisedNativePath), /Invalid native method provenance/);
  const nativeBaseMask = plain(input);
  nativeBaseMask.skillLibrary[key][0].id = 'method-interaction-states-and-behavior-design-task';
  const syntheticNative = plain(nativeBaseMask.skillLibrary[key][0]);
  syntheticNative.id = 'method-interaction-states-and-behavior-design';
  delete syntheticNative.legacySourceKey;
  syntheticNative.provenance.original.selector = key + '/method-interaction-states-and-behavior-design';
  nativeBaseMask.skillLibrary[key].push(syntheticNative);
  assert.throws(() => current.model.buildSkillCatalog(nativeBaseMask), /semantic base method ID/);
  const hiddenDual = plain(dual);
  hiddenDual.skillLibrary[wrongKey] = hiddenDual.skillLibrary[key]; delete hiddenDual.skillLibrary[key];
  hiddenDual.skillLibrary[wrongKey][0].id = 'method-copied-procedure';
  hiddenDual.skillLibrary[wrongKey][0].provenance.current.selector = wrongKey;
  assert.throws(() => current.model.buildSkillCatalog(hiddenDual), /Conflicting semantic Skill identity/);
  for (const mutate of [
    method => { method.provenance.original.revision = '0'.repeat(40); },
    method => { method.provenance.original.repository = 'other/source'; },
    method => { method.provenance.original.path = 'unrelated.js'; },
    method => { method.provenance.original.selector = 'skillLibrary[other]/' + method.name; },
    method => { method.provenance.current.repository = 'other/source'; },
    method => { method.provenance.current.path = 'unrelated.js'; },
    method => { method.provenance.current.selector = wrongKey; }
  ]) {
    const invalid = plain(input); mutate(invalid.skillLibrary[key][0]);
    assert.throws(() => current.model.buildSkillCatalog(invalid), /Invalid migrated method provenance/);
  }
  const unknown = plain(input); unknown.skillLibrary[key][0].workflowRefs[0].id = 'workflow-missing';
  assert.throws(() => current.model.buildSkillCatalog(unknown), /Unknown workflow ID/);
  const provenance = plain(input); delete provenance.skillLibrary[key][0].provenance.original.revision;
  assert.throws(() => current.model.buildSkillCatalog(provenance), /Incomplete method provenance/);
  const duplicateFlow = plain(input); duplicateFlow.flowLibrary.second = [plain(duplicateFlow.flowLibrary['ui-expert'][0])];
  assert.throws(() => current.model.buildSkillCatalog(duplicateFlow), /duplicate workflow ID/);
});

test('CW-92: real recovery-title collision retains both source bodies without global guessing', () => {
  const title = 'Recover a failed or unsafe run';
  const a = current.model.resolveWorkflowReference({ title, legacySourceKey: 'ai-orchestrator' }, current.data.flowLibrary);
  const b = current.model.resolveWorkflowReference({ title, legacySourceKey: 'conformance-observer' }, current.data.flowLibrary);
  assert.notDeepStrictEqual(plain(a.flow), plain(b.flow));
  assert.throws(() => current.model.resolveWorkflowReference({ title }, current.data.flowLibrary), /Ambiguous workflow title/);
  const input = neutralInput(), key = Object.keys(input.skillLibrary)[0];
  input.skillLibrary[key][0].workflowRefs = [{ legacySourceKey: 'ui-expert', title: 'An unresolved source title', unresolved: true }];
  assert.equal(current.model.buildSkillCatalog(input)[0].methods[0].workflowRefs[0].unresolved, true);
  input.skillLibrary[key][0].workflowRefs[0].legacySourceKey = 'ai-orchestrator';
  assert.throws(() => current.model.buildSkillCatalog(input), /Unresolved workflow scope differs from method origin/);
});

test('CW-92: explicit workflow IDs cannot silently change a migrated method’s original workflow reach', () => {
  const data = neutralInput();
  const key = Object.keys(data.skillLibrary)[0];
  const original = data.skillLibrary[key][0];
  // Use actual authored workflow bodies; these IDs exist only in this test input.
  const uiFlow = plain(current.data.flowLibrary['ui-expert'][0]);
  const otherFlow = plain(current.data.flowLibrary['ai-orchestrator'][0]);
  uiFlow.id = 'workflow-wp04-test-ui';
  otherFlow.id = 'workflow-wp04-test-orchestration';
  data.flowLibrary = { 'ui-expert': [uiFlow], 'ai-orchestrator': [otherFlow] };
  original.workflowRefs = [{ id: uiFlow.id, title: uiFlow.title, legacySourceKey: 'ui-expert' }];
  const valid = current.model.buildSkillCatalog(data)[0];
  assert.equal(valid.workflows[0].title, uiFlow.title);
  assert.equal(valid.profiles[0].workflows, uiFlow.title);
  assert.equal(current.model.resolveWorkflowReference({ id: uiFlow.id }, data.flowLibrary).sourceKey, 'ui-expert', 'Native ID-only references remain supported');

  for (const mutate of [
    ref => { ref.id = otherFlow.id; }, // valid ID, old title and source key; must fail
    ref => { ref.title = otherFlow.title; }, // valid ID and source, wrong original title
    ref => { ref.legacySourceKey = 'ai-orchestrator'; }, // ID and title match UI, wrong scoped origin
    ref => { delete ref.legacySourceKey; ref.id = otherFlow.id; }, // cannot omit the source hint to bypass method origin
    ref => { delete ref.title; }, // cannot discard original title on a mechanical migration
  ]) {
    const corrupted = plain(data);
    mutate(corrupted.skillLibrary[key][0].workflowRefs[0]);
    assert.throws(() => current.model.buildSkillCatalog(corrupted), /[Ww]orkflow.*(source|title|origin|scoped)/);
  }
  assert.throws(() => current.model.resolveWorkflowReference({ id: uiFlow.id, legacySourceKey: 'ai-orchestrator', title: uiFlow.title }, data.flowLibrary), /[Ww]orkflow.*source/);
  assert.throws(() => current.model.resolveWorkflowReference({ id: uiFlow.id, legacySourceKey: 'ui-expert', title: otherFlow.title }, data.flowLibrary), /[Ww]orkflow.*title/);

  // The real same-title collision must remain distinct even when both receive IDs.
  const title = 'Recover a failed or unsafe run';
  const recovery = plain(current.data.flowLibrary['ai-orchestrator'].find(flow => flow.title === title));
  const observation = plain(current.data.flowLibrary['conformance-observer'].find(flow => flow.title === title));
  recovery.id = 'workflow-run-recovery-containment-and-control';
  observation.id = 'workflow-wp04-test-observation-recovery';
  const flows = { 'ai-orchestrator': [recovery], 'conformance-observer': [observation] };
  assert.notDeepStrictEqual(plain(recovery), plain(observation));
  assert.equal(current.model.resolveWorkflowReference({ id: recovery.id, legacySourceKey: 'ai-orchestrator', title }, flows).sourceKey, 'ai-orchestrator');
  assert.throws(() => current.model.resolveWorkflowReference({ id: observation.id, legacySourceKey: 'ai-orchestrator', title }, flows), /[Ww]orkflow.*source/);
});

test('CW-92: preserve existing workflow defects, evidence maturity and authored coverage', () => {
  assert.deepStrictEqual(workflowDiagnostics(current.data), workflowDiagnostics(baseline.context.data));
  for (const skill of expected.catalog) {
    const actual = current.data.skillCatalog.find(item => item.id === skill.id);
    assert.deepStrictEqual(plain(actual.guidanceCoverage), plain(skill.guidanceCoverage));
    assert.ok(actual.methods.every(method => method.evidence && method.status));
  }
  console.log('CW92_READER_EVIDENCE ' + JSON.stringify({ baseline: fixture.baselineCommit, sourceCount: expected.sourceOrder.length, preservedSnapshot: createHash('sha256').update(JSON.stringify(expected)).digest('hex'), boundary: 'Reader independence and full-source preservation; no method-body migration, consumer retirement or effectiveness claim' }));
});
