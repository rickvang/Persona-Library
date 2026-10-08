import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { loadValidationContext } from './context.mjs';
import {
  derivePersonaSkillGraph,
  expectedPersonaSkillOutputs
} from '../build-persona-skill-system-map.mjs';

test('Persona Skill System Map preserves canonical identity and Persona applications', async () => {
  const context = await loadValidationContext();
  const graph = await derivePersonaSkillGraph(context);
  const personaNodes = graph.nodes.filter(node => node.type === 'persona');
  const skillNodes = graph.nodes.filter(node => node.type === 'skill');
  const applicationNodes = graph.nodes.filter(node => node.type === 'persona-skill-application');
  const expectedApplications = context.data.skillCatalog.reduce((count, skill) => count + skill.profiles.length, 0);

  assert.equal(graph.scope, 'domain:persona-skill');
  assert.equal(graph.coverage, 'complete-for-scope');
  assert.equal(personaNodes.length, context.data.personas.length);
  assert.equal(skillNodes.length, context.data.skillCatalog.length);
  assert.equal(applicationNodes.length, expectedApplications);

  const architectureSkillId = 'skill:skill-architecture-decision-making';
  assert.equal(skillNodes.filter(node => node.id === architectureSkillId).length, 1, 'shared Skill identity must remain singular');
  const architectureApplications = graph.edges
    .filter(edge => edge.relationship === 'application-of' && edge.to === architectureSkillId)
    .map(edge => edge.from);
  assert.ok(architectureApplications.length >= 2, 'shared Skill must retain multiple distinct Persona applications');
  assert.equal(new Set(architectureApplications).size, architectureApplications.length);

  for (const applicationId of architectureApplications) {
    const application = graph.nodes.find(node => node.id === applicationId);
    assert.match(application.source.locator, /content\/library-data\/skills-(core|specialists)\.js$/);
    assert.match(application.source.selector, /^skillLibrary\[/);
  }

  assert.equal(
    graph.edges.filter(edge => ['built-from', 'supports', 'related-to', 'used-in', 'applied-by'].includes(edge.relationship)).length,
    context.data.skillRelations.length,
    'all canonical typed Skill relations must be preserved'
  );

  for (const fact of [...graph.nodes, ...graph.edges]) {
    assert.ok(fact.source?.locator && fact.source?.selector, 'every Persona/Skill graph fact must have provenance');
    assert.doesNotMatch(fact.source.locator, /:dist\//, 'provenance must point to authored authority, not generated dist');
  }
});

test('CW-92 graph provenance follows a migrated method current owner and rejects false locators', async () => {
  const context = await loadValidationContext();
  const migrated = { ...context, data: structuredClone(context.data) };
  const skillId = 'skill-interaction-states-and-behavior-design';
  const skill = migrated.data.skillCatalog.find(item => item.id === skillId);
  const method = skill.methods.find(item => item.legacySourceKey === 'ui-expert');
  const methodId = 'method-interaction-states-and-behavior-design';
  assert.ok(method, 'Start from the actual loaded UI application');
  method.id = methodId;
  method.provenance = {
    original: { repository: 'rickvang/Persona-Library', path: 'content/library-data/skills-core.js', selector: `skillLibrary[ui-expert]/${method.name}` },
    current: { repository: 'rickvang/Persona-Library', path: 'content/library-data/skills-core.js', selector: skillId }
  };
  migrated.data.skillLibrary['ui-expert'] = migrated.data.skillLibrary['ui-expert'].filter(item => item.name !== method.name);
  migrated.data.skillLibrary[skillId] = [{ ...method }];
  const read = context.readFile;
  const neutralSource = `
Object.assign(window.PersonaLibraryDataFragments.skillLibrary, { '${skillId}':[{id:'${methodId}'}] });
`;
  migrated.readFile = file => file === 'content/library-data/skills-core.js'
    ? read(file).then(source => source + neutralSource)
    : read(file);
  const graph = await derivePersonaSkillGraph(migrated);
  const application = graph.nodes.find(node => node.id === `skill-application:ui-expert/${skillId}`);
  assert.equal(application.source.locator, 'rickvang/Persona-Library:content/library-data/skills-core.js');
  assert.equal(application.source.selector, `skillLibrary[${skillId}][id=${methodId}]`);
  const originalGraph = await derivePersonaSkillGraph(context);
  assert.equal(graph.nodes.length, originalGraph.nodes.length, 'No new application or profile graph class');
  assert.equal(graph.edges.length, originalGraph.edges.length, 'Preserve the existing application relationships');
  await assert.rejects(() => derivePersonaSkillGraph({ ...migrated, readFile: read }), /Missing current authored method locator/);
  const missingOwner = { ...migrated, data: structuredClone(migrated.data) };
  delete missingOwner.data.skillLibrary[skillId];
  await assert.rejects(() => derivePersonaSkillGraph(missingOwner), /Missing neutral authored method record/);
  for (const current of [
    { ...method.provenance.current, selector: 'skill-not-the-owner' },
    { ...method.provenance.current, path: 'dist/data/library-data.js' },
    { ...method.provenance.current, repository: 'other/repo' }
  ]) {
    const corrupted = { ...migrated, data: structuredClone(migrated.data) };
    corrupted.data.skillCatalog.find(item => item.id === skillId).methods.find(item => item.id === methodId).provenance.current = current;
    await assert.rejects(() => derivePersonaSkillGraph(corrupted), /Invalid current authored method source/);
  }
});

test('Persona Skill generated artifacts match a fresh derivation', async () => {
  const { graph, files } = await expectedPersonaSkillOutputs();
  assert.ok(graph.nodes.length > 0 && graph.edges.length > 0);
  for (const [relativePath, expected] of files) {
    assert.equal(await fs.readFile(new URL('../../' + relativePath, import.meta.url), 'utf8'), expected, relativePath + ' is stale');
  }
});

test('Persona Skill graph responds to canonical model changes', async () => {
  const context = await loadValidationContext();
  const baseline = await derivePersonaSkillGraph(context);
  const changedContext = {
    ...context,
    data: structuredClone(context.data)
  };
  changedContext.data.personas[0].name += ' Phase 7 mutation';
  const changed = await derivePersonaSkillGraph(changedContext);
  assert.notDeepEqual(changed, baseline);
  assert.match(changed.nodes.find(node => node.id === 'persona:' + changedContext.data.personas[0].id).label, /Phase 7 mutation$/);
});
