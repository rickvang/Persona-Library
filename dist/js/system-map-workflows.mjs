export const workflowId = (personaId, title) => 'workflow:' + personaId + '/' + encodeURIComponent(title);

const authoredSource = selector => ({
  kind: 'repo-directory',
  locator: 'rickvang/Persona-Library:content/library-data',
  selector
});

// Only declared catalog applications become links; shared names or tools do not imply usage.
export function buildWorkflowConnections(data) {
  const workflows = [];
  const linksById = new Map();
  const knownIds = new Set([
    ...(data.personas || []).map(item => 'persona:' + item.id),
    ...(data.skillCatalog || []).map(item => 'skill:' + item.id),
    ...(data.toolCatalog || []).map(item => 'tool:' + item.id),
    ...(data.playbookCatalog || []).map(item => 'playbook:' + item.id),
    ...(data.operatingPackCatalog || []).map(item => 'operating-pack:' + item.id),
    ...(data.templateCatalog || []).map(item => 'template:' + item.id),
    ...(data.toolUseRecipes || []).map(item => 'recipe:' + item.id)
  ]);
  for (const persona of data.personas || []) {
    for (const record of data.flowLibrary?.[persona.id] || []) {
      const id = workflowId(persona.id, record.title);
      knownIds.add(id);
      workflows.push({
        id, title: record.title, summary: record.summary || '', personaId: persona.id,
        personaName: persona.name, cadence: record.cadence, type: record.type,
        activities: (record.activities || []).map(activity => ({
          title: activity[0], cadence: activity[1], purpose: activity[2],
          watchFor: activity[3], reference: activity[4]
        })),
        source: authoredSource('flowLibrary[' + persona.id + '][title=' + record.title + ']')
      });
    }
  }
  const link = (from, to, label) => {
    if (!knownIds.has(from) || !knownIds.has(to)) return;
    const links = linksById.get(from) || [];
    if (!links.some(item => item.id === to && item.label === label)) links.push({id: to, label});
    linksById.set(from, links);
  };
  for (const workflow of workflows) {
    link(workflow.id, 'persona:' + workflow.personaId, 'Owned by');
    link('persona:' + workflow.personaId, workflow.id, 'Workflow');
  }
  for (const skill of data.skillCatalog || []) {
    const id = 'skill:' + skill.id;
    for (const persona of skill.personas || []) {
      link(id, 'persona:' + persona.id, 'Applied by');
      link('persona:' + persona.id, id, 'Uses skill');
    }
    for (const workflow of skill.workflows || []) {
      const target = workflowId(workflow.personaId, workflow.title);
      link(id, target, 'Used in workflow');
      link(target, id, 'Uses skill');
    }
  }
  for (const recipe of data.toolUseRecipes || []) {
    const id = 'recipe:' + recipe.id;
    link('skill:' + recipe.skillId, id, 'Tool-use guidance');
    link(id, 'skill:' + recipe.skillId, 'Guidance for skill');
    for (const personaId of recipe.personaIds || []) {
      link(id, 'persona:' + personaId, 'Authored for');
      link('persona:' + personaId, id, 'Tool-use guidance');
    }
    const tool = (data.toolCatalog || []).find(tool => recipe.toolId === tool.id || recipe.tool === tool.name);
    if (tool) {
      link(id, 'tool:' + tool.id, 'Uses tool');
      link('tool:' + tool.id, id, 'Used by guidance');
    }
  }
  for (const [prefix, catalog] of [
    ['operating-pack:', data.operatingPackCatalog || []],
    ['template:', data.templateCatalog || []]
  ]) {
    for (const record of catalog) {
      const id = prefix + record.id;
      for (const application of record.applications || []) {
        if (!application.known) continue;
        const target = workflowId(application.personaId, application.workflow);
        link(id, target, 'Used in workflow');
        link(target, id, prefix === 'template:' ? 'Starting artifact' : 'Operating context');
      }
      for (const skill of record.relatedSkills || []) {
        if (skill.known === false) continue;
        link(id, 'skill:' + skill.id, 'Related skill');
        link('skill:' + skill.id, id, prefix === 'template:' ? 'Related template' : 'Related operating pack');
      }
      for (const playbook of record.playbooks || []) {
        if (playbook.known === false) continue;
        link(id, 'playbook:' + playbook.id, 'Related playbook');
        link('playbook:' + playbook.id, id, prefix === 'template:' ? 'Related template' : 'Related operating pack');
      }
      for (const pack of record.operatingPacks || []) {
        if (pack.known === false) continue;
        link(id, 'operating-pack:' + pack.id, 'Operating context');
        link('operating-pack:' + pack.id, id, 'Related template');
      }
    }
  }
  return {workflows, workflowById: new Map(workflows.map(item => [item.id, item])), linksById};
}
