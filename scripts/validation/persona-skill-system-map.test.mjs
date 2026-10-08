import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
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

test('CW-92 graph locates a migrated method at its sole authored source', async () => {
  const context = await loadValidationContext();
  const sourcePath = 'content/library-data/skills-core.js';
  const originalSource = await context.readFile(sourcePath);
  const legacyKey = 'ui-expert';
  const name = 'Interaction states and behavior design';
  const legacyRecord = context.data.skillLibrary[legacyKey]?.find(record => record.name === name);
  const skillId = context.model.slugify(name);
  const methodId = `method-${skillId.slice(6)}`;
  const alreadyMigrated = context.data.skillLibrary[skillId]?.find(method => method.id === methodId);
  assert.notEqual(Boolean(legacyRecord), Boolean(alreadyMigrated), 'Exactly one authored source must exist');

  // This prerequisite test remains valid after WP05: inspect the actual
  // migrated source once present, rather than only a pre-cutover simulation.
  if (alreadyMigrated) {
    const graph = await derivePersonaSkillGraph(context);
    const application = graph.nodes.find(node => node.id === `skill-application:${legacyKey}/${skillId}`);
    assert.equal(application?.source.selector, `skillLibrary[${skillId}][id=${methodId}]`);
    const maskedSource = originalSource.replace(`'${skillId}':[`, `'hidden-${skillId}':[`);
    assert.notEqual(maskedSource, originalSource, 'Find the exact authored neutral source section');
    const masked = {
      ...context,
      readFile: file => file === sourcePath ? Promise.resolve(maskedSource) : context.readFile(file)
    };
    await assert.rejects(() => derivePersonaSkillGraph(masked), /Expected exactly one authored neutral Skill section/);
    const duplicatedSource = originalSource + `\nObject.assign(window.PersonaLibraryDataFragments.skillLibrary, { '${skillId}':[{id:'${methodId}'}] });\n`;
    const duplicated = {
      ...context,
      readFile: file => file === sourcePath ? Promise.resolve(duplicatedSource) : context.readFile(file)
    };
    await assert.rejects(() => derivePersonaSkillGraph(duplicated), /Expected exactly one authored neutral Skill section/);
    const specialistPath = 'content/library-data/skills-specialists.js';
    const specialists = await context.readFile(specialistPath);
    const crossFile = { ...context, readFile: file => file === specialistPath
      ? Promise.resolve(specialists + `\nObject.assign(window.PersonaLibraryDataFragments.skillLibrary, { '${skillId}':\n[{id:'${methodId}'}] });\n`)
      : context.readFile(file) };
    await assert.rejects(() => derivePersonaSkillGraph(crossFile), /Expected exactly one authored neutral Skill section/,
      'Duplicate Skill declaration in another source file must fail even with newline whitespace');
    return;
  }

  const workflowRefs = legacyRecord.workflows.split(' · ').map(title => {
    const match = context.data.flowLibrary[legacyKey].find(flow => flow.title === title);
    assert.ok(match?.id, `Require the real accepted workflow ID for ${title}`);
    return { id: match.id, title };
  });
  const migrated = {
    id: methodId, name, status: legacyRecord.status, definition: legacyRecord.definition,
    when: legacyRecord.triggers, actions: legacyRecord.actions,
    evidence: legacyRecord.evidence, workflowRefs, legacySourceKey: legacyKey,
    provenance: {
      original: {
        repository: 'rickvang/Persona-Library',
        revision: 'd61f850e06d266bc6d608b92b730c97e451ea745',
        path: sourcePath, selector: `skillLibrary[${legacyKey}]/${name}`
      },
      current: { repository: 'rickvang/Persona-Library', path: sourcePath, selector: skillId }
    }
  };
  const oldLine = originalSource.split('\n').find(line => line.trimStart().startsWith(`{name:'${name}'`));
  assert.ok(oldLine && originalSource.includes(oldLine + '\n'), 'Locate the exact original authored row');
  const replacement = `  '${skillId}':[\n    ${JSON.stringify(migrated)}\n  ],\n  'ai-orchestrator':[`;
  const changedSource = originalSource.replace(oldLine + '\n', '').replace("  'ai-orchestrator':[", replacement);
  assert.equal(changedSource.includes(oldLine), false, 'Remove the prior authored body, not duplicate it');
  const originalProgram = context.files.librarySource;
  assert.equal(originalProgram.split(originalSource).length, 2, 'Replace the precise original source module once');
  const sandbox = { window: {} };
  vm.runInNewContext(originalProgram.replace(originalSource, changedSource), sandbox, { filename: 'migrated-full-library.js' });
  const data = sandbox.window.PersonaLibraryData;
  data.skillCatalog = context.model.buildSkillCatalog(data);
  assert.equal(data.skillCatalog.length, context.data.skillCatalog.length);
  assert.equal(data.skillLibrary[legacyKey].length, context.data.skillLibrary[legacyKey].length - 1);
  const simulated = {
    ...context, data,
    readFile: file => file === sourcePath ? Promise.resolve(changedSource) : context.readFile(file)
  };
  const graph = await derivePersonaSkillGraph(simulated);
  const application = graph.nodes.find(node => node.id === `skill-application:${legacyKey}/${skillId}`);
  assert.ok(application, 'Keep the historical compatibility application during migration');
  assert.match(application.source.locator, /:content\/library-data\/skills-core\.js$/);
  assert.equal(application.source.selector, `skillLibrary[${skillId}][id=${methodId}]`);
  const duplicatedSource = changedSource + `\nObject.assign(window.PersonaLibraryDataFragments.skillLibrary, { '${skillId}':[{id:'${methodId}'}] });\n`;
  const duplicated = {
    ...simulated,
    readFile: file => file === sourcePath ? Promise.resolve(duplicatedSource) : context.readFile(file)
  };
  await assert.rejects(() => derivePersonaSkillGraph(duplicated), /Expected exactly one authored neutral Skill section/,
    'Duplicate neutral Skill declarations in one file have no unique authored locator');
  const specialistPath = 'content/library-data/skills-specialists.js';
  const specialists = await context.readFile(specialistPath);
  const acrossFiles = { ...simulated, readFile: file => file === specialistPath
    ? Promise.resolve(specialists + `\nObject.assign(window.PersonaLibraryDataFragments.skillLibrary, { '${skillId}':\n[{id:'${methodId}'}] });\n`)
    : simulated.readFile(file) };
  await assert.rejects(() => derivePersonaSkillGraph(acrossFiles), /Expected exactly one authored neutral Skill section/,
    'Count Skill sections across files, not only files matching literal whitespace variants');
  // A matching Skill header and a matching method ID elsewhere in the file
  // are not proof that the claimed source locator exists within that Skill.
  const misplacedSource = changedSource.replace(`"id":"${methodId}"`, '"id":"method-displaced"') +
    `\nObject.assign(window.PersonaLibraryDataFragments.skillLibrary, { 'skill-unrelated':[{id:'${methodId}'}] });\n`;
  assert.notEqual(misplacedSource, changedSource);
  const misattributed = {
    ...simulated,
    readFile: file => file === sourcePath ? Promise.resolve(misplacedSource) : context.readFile(file)
  };
  await assert.rejects(() => derivePersonaSkillGraph(misattributed), /Missing authored neutral method/,
    'Do not join a Skill key with a method ID from another authored section');
  const unmodifiedSource = { ...simulated, readFile: context.readFile };
  await assert.rejects(() => derivePersonaSkillGraph(unmodifiedSource), /Expected exactly one authored neutral Skill section/,
    'Missing a real authored method source must fail instead of citing its vacated Persona row');
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
