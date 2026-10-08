import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import path from 'node:path';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { loadValidationContext } from './context.mjs';
import { assertPreserved, capturePilot, fixture, loadPinnedBaseline, plain, profilePayloads, workflowDiagnostics } from './v2-capability-preservation.fixture.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
let current, baseline, expected;
before(async () => {
  baseline = await loadPinnedBaseline(root);
  current = await loadValidationContext(root);
  expected = capturePilot(baseline.context);
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

function withoutPilot(data) {
  const copy = plain(data);
  copy.personas = copy.personas.filter(persona => !fixture.pilotSourceKeys.includes(persona.id));
  return copy;
}

test('CW-92: preserve actual loaded pilot fields, peer variants, evidence and relationships', () => {
  assert.equal(Object.values(expected.records).flat().length, fixture.expectedProfileCount);
  assert.equal(expected.skillIds.length, fixture.expectedProfileCount);
  assert.ok(baseline.context.libraryDataSources.length >= 21, 'Load the complete ordered modules, scenarios and assembler');
  assertPreserved(capturePilot(current), expected);
});

test('CW-92: authored source and committed data bundle produce the same effective baseline', () => {
  const sandbox = { window: {} };
  vm.runInNewContext(current.files.libraryOutput, sandbox, { filename: 'generated-library-source.js' });
  vm.runInNewContext(current.files.templatePreviewSource, sandbox);
  vm.runInNewContext(current.files.modelSource, sandbox);
  const generated = { ...current, data: sandbox.window.PersonaLibraryData };
  assertPreserved(capturePilot(generated), capturePilot(current));
});

test('CW-92: preservation rejects dropped evidence, unexpected fields and collapsed variants', () => {
  const missingEvidence = plain(expected);
  delete missingEvidence.records[fixture.pilotSourceKeys[0]][0].evidence;
  assert.throws(() => assertPreserved(missingEvidence, expected));
  const unknownField = plain(expected);
  unknownField.records[fixture.pilotSourceKeys[0]][0].unclassifiedField = 'must be classified';
  assert.throws(() => assertPreserved(unknownField, expected));
  const shared = expected.catalog.find(skill => skill.profiles.length > 1);
  assert.ok(shared, 'The actual pilot must exercise a shared identity with peer applications');
  const collapsed = plain(expected);
  collapsed.catalog.find(skill => skill.id === shared.id).profiles.pop();
  assert.throws(() => assertPreserved(collapsed, expected));
  const lostActivity = plain(expected);
  lostActivity.flows[fixture.pilotSourceKeys[0]][0].activities.pop();
  assert.throws(() => assertPreserved(lostActivity, expected));
  const unrelatedId = current.data.skillCatalog.find(skill => !expected.catalog.some(item => item.id === skill.id))?.id;
  assert.ok(unrelatedId, 'Require an actual nonpilot skill for the scope check');
  const unrelatedUpdate = { ...current, data: plain(current.data) };
  unrelatedUpdate.data.maintenance.skills[unrelatedId].version = 'unrelated-test-change';
  assertPreserved(capturePilot(unrelatedUpdate), capturePilot(current));
  const relevantUpdate = { ...current, data: plain(current.data) };
  relevantUpdate.data.maintenance.skills[expected.skillIds[0]].version = 'must-be-detected';
  assert.throws(() => assertPreserved(capturePilot(relevantUpdate), capturePilot(current)));
});

test('CW-92 characterization: actual catalog loses pilot applications without identities', () => {
  const full = current.model.buildSkillCatalog(current.data);
  const absent = current.model.buildSkillCatalog(withoutPilot(current.data));
  const pilotProfiles = catalog => catalog.flatMap(skill => skill.profiles).filter(profile => fixture.pilotSourceKeys.includes(profile.personaId));
  assert.equal(pilotProfiles(full).length, fixture.expectedProfileCount);
  assert.equal(pilotProfiles(absent).length, 0, 'Known identity gate changed: convert this characterization to a positive independence assertion');
  const surviving = full.map(skill => ({
    ...skill,
    profiles: skill.profiles.filter(profile => !fixture.pilotSourceKeys.includes(profile.personaId))
  })).filter(skill => skill.profiles.length > 0);
  assert.deepStrictEqual(plain(absent.map(skill => skill.id)), plain(surviving.map(skill => skill.id)), 'Removing pilot identities must retain every nonpilot semantic ID');
  assert.deepStrictEqual(profilePayloads(absent), profilePayloads(surviving), 'Removing pilot identities must retain every nonpilot application field');
  const baselineFull = baseline.context.model.buildSkillCatalog(baseline.context.data);
  const baselineAbsent = baseline.context.model.buildSkillCatalog(withoutPilot(baseline.context.data));
  assert.equal(baselineFull.length, 79, 'The pinned full-source fixture has 79 semantic IDs');
  assert.equal(baselineAbsent.length, 72, 'The pinned known-failure fixture has 72 surviving IDs');
  assert.ok(absent.length > 0, 'This is the full library, not the earlier two-cohort reproduction');
  assert.equal(current.model.buildSkillCatalog({ ...current.data, personas: [] }).length, 0);
  for (const sourceKey of fixture.pilotSourceKeys) {
    const oneMissing = plain(current.data);
    oneMissing.personas = oneMissing.personas.filter(persona => persona.id !== sourceKey);
    assert.ok(current.model.buildSkillCatalog(oneMissing).every(skill => skill.profiles.every(profile => profile.personaId !== sourceKey)));
  }
  console.log('CW92_DISCOVERY ' + JSON.stringify({ status: 'known_failure_reproduced', beforeIds: full.length, afterPilotRemovalIds: absent.length, beforePilotApplications: pilotProfiles(full).length, afterPilotApplications: pilotProfiles(absent).length }));
});

test('CW-92 characterization: reordered and renamed metadata retain fields but order affects profiles', () => {
  const original = current.model.buildSkillCatalog(current.data);
  const reversedData = plain(current.data);
  reversedData.personas.reverse();
  const reversed = current.model.buildSkillCatalog(reversedData);
  assert.deepStrictEqual(plain(original.map(skill => skill.id)), plain(reversed.map(skill => skill.id)));
  assert.deepStrictEqual(profilePayloads(original), profilePayloads(reversed));
  const orderSensitive = original.filter(skill => {
    const next = reversed.find(item => item.id === skill.id);
    return skill.profiles.length > 1 && skill.profiles[0].personaId !== next.profiles[0].personaId;
  });
  assert.ok(orderSensitive.length > 0, 'Known first-profile ordering changed: assess and convert the characterization');
  const renamedData = plain(current.data);
  for (const persona of renamedData.personas) { persona.name = `renamed ${persona.id}`; persona.roleLabel = 'metadata only'; }
  const renamed = current.model.buildSkillCatalog(renamedData);
  assert.deepStrictEqual(profilePayloads(original), profilePayloads(renamed));
  const guidanceChanged = original.filter(skill => JSON.stringify(skill.guidance) !== JSON.stringify(reversed.find(item => item.id === skill.id).guidance)).map(skill => skill.id);
  const pinnedOriginal = baseline.context.model.buildSkillCatalog(baseline.context.data);
  const pinnedReversedData = plain(baseline.context.data);
  pinnedReversedData.personas.reverse();
  const pinnedReversed = baseline.context.model.buildSkillCatalog(pinnedReversedData);
  const pinnedProfileIds = pinnedOriginal.filter(skill => skill.profiles.length > 1 && skill.profiles[0].personaId !== pinnedReversed.find(item => item.id === skill.id).profiles[0].personaId).map(skill => skill.id);
  const pinnedGuidanceIds = pinnedOriginal.filter(skill => JSON.stringify(skill.guidance) !== JSON.stringify(pinnedReversed.find(item => item.id === skill.id).guidance)).map(skill => skill.id);
  assert.equal(pinnedProfileIds.length, 14);
  assert.equal(pinnedGuidanceIds.length, 13);
  const currentIds = new Set(original.map(skill => skill.id));
  // Freeze the known characterization for retained baseline identities, not the
  // existence of unrelated new skills. Accepted fixes convert these assertions.
  const retainedBaselineIds = new Set(pinnedOriginal.map(skill => skill.id).filter(id => currentIds.has(id)));
  assert.deepStrictEqual(plain(orderSensitive.map(skill => skill.id).filter(id => retainedBaselineIds.has(id))), plain(pinnedProfileIds.filter(id => currentIds.has(id))), 'Known ordering-sensitive profile set changed');
  assert.deepStrictEqual(plain(guidanceChanged.filter(id => retainedBaselineIds.has(id))), plain(pinnedGuidanceIds.filter(id => currentIds.has(id))), 'Known ordering-sensitive fallback set changed');
  console.log('CW92_ORDERING ' + JSON.stringify({ orderSensitiveProfiles: orderSensitive.map(skill => skill.id), orderSensitiveGuidance: guidanceChanged }));
});

test('CW-92 characterization: full model initialization fails without the UI pilot identity', () => {
  assert.doesNotThrow(() => initialize(current));
  assert.throws(() => initialize(current, data => { data.personas = data.personas.filter(persona => persona.id !== 'ui-expert'); }), error => {
    assert.match(error.message, /revisions/);
    assert.match(error.stack, /buildMaintenance/);
    return true;
  });
});

test('CW-92 characterization: full source override requires the orchestration identity', () => {
  const source = current.files.librarySource;
  const marker = 'const rileyPersonaRecord = window.PersonaLibraryDataFragments.personas.find';
  assert.equal(source.split(marker).length - 1, 1, 'Require the actual single source override; do not reproduce an excerpt');
  const injected = source.replace(marker, "window.PersonaLibraryDataFragments.personas = window.PersonaLibraryDataFragments.personas.filter(p => p.id !== 'ai-orchestrator');\n" + marker);
  assert.doesNotThrow(() => vm.runInNewContext(source, { window: {} }, { filename: 'complete-library-source.js' }));
  assert.throws(() => vm.runInNewContext(injected, { window: {} }, { filename: 'complete-library-source.js' }), error => {
    assert.equal(error.name, 'TypeError');
    assert.match(error.message, /overview|undefined/);
    return true;
  });
});

test('CW-92: track actual full-loaded workflow gaps separately from preservation', () => {
  const reference = workflowDiagnostics(baseline.context.data);
  assert.deepStrictEqual(workflowDiagnostics(current.data), reference, 'A relationship change requires an explicit scoped disposition');
  console.log('CW92_WORKFLOW_DIAGNOSTICS ' + JSON.stringify(reference));
});

test('CW-92: preserve authored-versus-fallback coverage and source provenance', () => {
  for (const skill of expected.catalog) {
    assert.ok(skill.guidanceCoverage?.operation);
    assert.ok(skill.guidanceCoverage?.quality);
  }
  const summary = {
    baselineCommit: fixture.baselineCommit,
    profileCount: Object.values(expected.records).flat().length,
    workflowCount: Object.values(expected.flows).flat().reduce((sum, flow) => sum + 1, 0),
    activityCount: Object.values(expected.flows).flat().reduce((sum, flow) => sum + (flow.activities || []).length, 0),
    orderedSourceCount: expected.sourceOrder.length,
    snapshotSha256: createHash('sha256').update(JSON.stringify(expected)).digest('hex'),
    sourceBlobs: baseline.sourceBlobs,
    boundary: 'Full-source preservation and existing-failure characterization, not a fixed implementation or independent review'
  };
  console.log('CW92_SOURCE_BASELINE ' + JSON.stringify(summary));
});
