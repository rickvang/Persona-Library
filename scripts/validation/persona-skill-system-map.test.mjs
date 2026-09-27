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
