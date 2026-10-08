import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadValidationContext } from './context.mjs';
import { loadLibraryData, buildPersonaSkillMatrix } from '../../eval/isolated-persona-skill.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fields = ['status', 'definition', 'triggers', 'workflows', 'actions', 'evidence'];

function assertSourceApplicationsMatchCatalog(data, model) {
  const byName = new Map();
  for (const [sourceKey, records] of Object.entries(data.skillLibrary)) {
    const neutral = sourceKey.startsWith('skill-');
    for (const record of records) {
      const personaId = neutral ? record.legacySourceKey : sourceKey;
      if (!personaId) continue; // A new native method does not create a Persona profile.
      const skillId = neutral ? sourceKey : model.slugify(record.name);
      const expected = {
        personaId, status: record.status, definition: record.definition,
        triggers: neutral ? record.when : record.triggers,
        workflows: neutral ? record.workflowRefs.map(ref => ref.title).join(' · ') : record.workflows,
        actions: record.actions, evidence: record.evidence
      };
      const catalog = data.skillCatalog.find(skill => skill.id === skillId);
      assert.ok(catalog, `missing canonical Skill identity for ${record.name}`);
      assert.equal(catalog.name, record.name);
      const matches = catalog.profiles.filter(profile => profile.personaId === personaId);
      assert.equal(matches.length, 1, `missing or duplicate derived application: ${skillId}/${personaId}`);
      for (const field of fields) assert.equal(matches[0][field], expected[field], `${record.name}/${personaId} changed ${field}`);
      if (!byName.has(record.name)) byName.set(record.name, []);
      byName.get(record.name).push({ personaId, profile: expected });
    }
  }
  for (const [name, applications] of byName) {
    const catalog = data.skillCatalog.find(skill => skill.id === model.slugify(name));
    assert.equal(catalog.profiles.length, applications.length, `${name} gained or lost an authored legacy application`);
  }
  return byName;
}

test('shared Skill identities preserve distinct legacy applications under either authored source shape', async () => {
  const { data, model } = await loadValidationContext(root);
  const byName = assertSourceApplicationsMatchCatalog(data, model);
  const repeated = [...byName.entries()].filter(([, applications]) => applications.length > 1);
  assert.ok(repeated.length >= 14, 'expected the known repeated Skill-identity families');
  const decision = byName.get('Decision communication and rationale documentation');
  assert.ok(decision?.length >= 8);
  assert.ok(new Set(decision.map(item => item.profile.definition)).size > 1, 'different applications must retain their distinct definitions');
  assert.ok(new Set(decision.map(item => item.profile.triggers)).size > 1, 'different applications must retain their distinct triggers');
  const architecture = byName.get('Architecture decision-making');
  assert.equal(new Set(architecture.map(item => item.profile.definition)).size, 1);
  assert.ok(new Set(architecture.map(item => item.profile.triggers)).size > 1);
  const damaged = structuredClone(data);
  damaged.skillCatalog.find(skill => skill.id === model.slugify('Interaction states and behavior design'))
    .profiles.find(profile => profile.personaId === 'ui-expert').actions = 'lost evidence';
  assert.throws(() => assertSourceApplicationsMatchCatalog(damaged, model), /changed actions/);
});

test('CW-92 shared identity checks a losslessly moved method without counting its neutral key as a Persona', async () => {
  const { data: original, model } = await loadValidationContext(root);
  const data = structuredClone(original);
  const name = 'Interaction states and behavior design', origin = 'ui-expert';
  const skillId = model.slugify(name);
  const record = data.skillLibrary[origin]?.find(item => item.name === name);
  if (!record) {
    const migrated = data.skillLibrary[skillId]?.find(item => item.legacySourceKey === origin);
    assert.ok(migrated, 'Either the legacy or neutral authored source must exist');
    assert.equal(migrated.id, `method-${skillId.slice(6)}`);
    const apps = assertSourceApplicationsMatchCatalog(data, model);
    assert.equal(apps.get(name).filter(item => item.personaId === origin).length, 1);
    return;
  }
  const refs = record.workflows.split(' · ').map(title => {
    const flow = data.flowLibrary[origin].find(item => item.title === title);
    assert.ok(flow?.id, `Require accepted workflow ID for ${title}`);
    return { id: flow.id, title };
  });
  const method = {
    id: `method-${skillId.slice(6)}`, name, status: record.status, definition: record.definition,
    when: record.triggers, actions: record.actions, evidence: record.evidence,
    workflowRefs: refs, legacySourceKey: origin,
    provenance: {
      original: { repository: 'rickvang/Persona-Library', revision: 'd61f850e06d266bc6d608b92b730c97e451ea745', path: 'content/library-data/skills-core.js', selector: `skillLibrary[${origin}]/${name}` },
      current: { repository: 'rickvang/Persona-Library', path: 'content/library-data/skills-core.js', selector: skillId }
    }
  };
  data.skillLibrary[origin] = data.skillLibrary[origin].filter(item => item.name !== name);
  data.skillLibrary[skillId] = [method];
  data.skillCatalog = model.buildSkillCatalog(data);
  const applications = assertSourceApplicationsMatchCatalog(data, model);
  assert.equal(applications.get(name).filter(item => item.personaId === origin).length, 1);
  assert.equal(data.skillCatalog.length, original.skillCatalog.length);
});

test('CW-92 WP06: orchestration source is singular while peer Skill applications remain distinct', async () => {
  const { data, model } = await loadValidationContext(root);
  assert.equal(data.skillLibrary['ai-orchestrator'], undefined);
  const applications = assertSourceApplicationsMatchCatalog(data, model);
  const names = [
    'Agent workflow architecture', 'Work graph orchestration', 'Task decomposition and routing',
    'Tool and context design', 'Risk, guardrails, and human oversight',
    'Failure recovery and operational judgment', 'Cross-functional systems communication',
    'Multi-perspective skill synthesis'
  ];
  for (const name of names) {
    const skillId = model.slugify(name);
    const method = data.skillLibrary[skillId]?.find(method => method.legacySourceKey === 'ai-orchestrator');
    assert.ok(method, `Missing task-conditioned method ${skillId}`);
    assert.equal(applications.get(name).filter(item => item.personaId === 'ai-orchestrator').length, 1);
  }
  const duplicated = structuredClone(data);
  const method = duplicated.skillLibrary['skill-agent-workflow-architecture'][0];
  duplicated.skillLibrary['ai-orchestrator'] = [{
    name: method.name, status: method.status, definition: method.definition,
    triggers: method.when, actions: method.actions, evidence: method.evidence,
    workflows: method.workflowRefs.map(ref => ref.title).join(' · ')
  }];
  assert.throws(() => model.buildSkillCatalog(duplicated), /Duplicate authored method origin/);
});

test('CW-92 compatibility drawers retain all sixteen methods and retired Persona packets reject activation', async () => {
  const { data, model } = await loadValidationContext(root);
  const [pageSource, packetSource] = await Promise.all([
    readFile(path.join(root, 'content/site-pages/index.html'), 'utf8'),
    readFile(path.join(root, 'eval/persona-context-loading-pilot.mjs'), 'utf8')
  ]);
  const extract = (text, start, end, globals = {}) => {
    const first = text.indexOf(start);
    const last = text.indexOf(end, first + start.length);
    assert.ok(first >= 0 && last > first, `Find the real consumer: ${start}`);
    return vm.runInNewContext('(' + text.slice(first, last).trim() + ')', globals);
  };
  const pageGetter = extract(pageSource, 'function getSkillProfiles(p) {', 'function showSkillProfile(index)', {
    skillLibrary: data.skillLibrary, skillCatalog: data.skillCatalog
  });
  const packetGetter = extract(packetSource, 'function profile(loaded, id) {', 'async function prepare()');
  const plain = value => JSON.parse(JSON.stringify(value));
  const ordered = records => plain(records).sort((a, b) => a.name.localeCompare(b.name));
  let materialCount = 0;
  for (const id of ['ui-expert', 'ai-orchestrator']) {
    assert.equal(data.personas.find(persona => persona.id === id), undefined, `The retired wrapper must not be active: ${id}`);
    const persona = { id }; // Compatibility selector only, not a live Persona.
    assert.equal(data.skillLibrary[id], undefined, 'No second authored Persona bucket remains');
    const expected = data.skillCatalog.flatMap(skill => skill.profiles
      .filter(application => application.personaId === id)
      .map(application => ({
        name: skill.name, status: application.status, definition: application.definition,
        triggers: application.triggers, workflows: application.workflows,
        actions: application.actions, evidence: application.evidence
      })));
    assert.equal(expected.length, 8);
    const drawn = pageGetter(persona);
    assert.throws(() => packetGetter({ data, sha: 'source-evidence' }, id), /Unknown Persona/);
    assert.deepStrictEqual(ordered(drawn), ordered(expected), `UI drawer must display actual ${id} material`);
    assert.deepStrictEqual(ordered(pageGetter({ ...persona, skills: [] })), ordered(expected),
      'Decorative Persona skill labels cannot gate the existing projection');
    for (const record of drawn) {
      assert.ok(record.definition && record.triggers && record.workflows && record.actions && record.evidence);
      assert.notEqual(record.definition, 'This skill is listed but has not been expanded into a profile yet.');
      materialCount++;
    }
  }
  assert.equal(materialCount, 16);
  const other = 'ux-senior';
  const peer = data.personas.find(persona => persona.id === other);
  assert.deepStrictEqual(plain(pageGetter(peer)), plain(data.skillLibrary[other]),
    'Unmigrated Persona reader must retain legacy direct source order and fields');
  assert.deepStrictEqual(plain(packetGetter({ data, sha: 'source-evidence' }, other).skill_applications),
    plain(data.skillLibrary[other]));

  const withoutMetadata = { ...data, personas: [] };
  const independentCatalog = model.buildSkillCatalog(withoutMetadata);
  const withoutMetadataGetter = extract(pageSource, 'function getSkillProfiles(p) {', 'function showSkillProfile(index)', {
    skillLibrary: data.skillLibrary, skillCatalog: independentCatalog
  });
  const pilot = { id: 'ui-expert' };
  assert.deepStrictEqual(ordered(withoutMetadataGetter(pilot)), ordered(pageGetter(pilot)),
    'Method discovery must remain independent of Persona metadata');

  const loaded = await loadLibraryData();
  assert.throws(() => buildPersonaSkillMatrix(loaded, {
    default_test: { request_mode: 'answer', scenario: 'Source-loaded source preservation', prompt_template: 'Test {skill_name}' }
  }, { personas: ['ui-expert', 'ai-orchestrator'] }), /Unknown Persona/, 'Persona-only evaluation must not reactivate archived wrappers; all sixteen methods remain checked above');
});

// Keep CW-92 preservation checks in the existing required CI test entrypoint.
import './v2-capability-preservation.test.mjs';
