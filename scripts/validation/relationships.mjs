const RELATIONSHIP_TYPES = new Set(['built-from', 'supports', 'used-in', 'applied-by', 'related-to']);

export function validateRelationships({ data }, indexes) {
  const recipeIds = new Set();
  for (const recipe of data.toolUseRecipes) {
    if (!recipe.id || recipeIds.has(recipe.id) || !recipe.title || !recipe.tool || !recipe.skillId || !recipe.playbook || !recipe.mode || !recipe.requires || !recipe.output || !recipe.fallback || !recipe.status) throw new Error(`Invalid or duplicate tool-use recipe: ${recipe.id || '(missing)'}`);
    recipeIds.add(recipe.id);
    if (!indexes.catalogIds.has(recipe.skillId)) throw new Error(`Tool-use recipe references an unknown skill: ${recipe.skillId}`);
    if (!Array.isArray(recipe.personaIds) || !recipe.personaIds.length || recipe.personaIds.some(id => !indexes.personaIds.has(id))) throw new Error(`Tool-use recipe references an unknown persona: ${recipe.id}`);
    if (!Array.isArray(recipe.steps) || !recipe.steps.length) throw new Error(`Tool-use recipe has no steps: ${recipe.id}`);
    if (!data.skillCatalog.find(skill => skill.id === recipe.skillId)?.toolUseRecipes.some(item => item.id === recipe.id)) throw new Error(`Tool-use recipe was not attached to its skill: ${recipe.id}`);
  }

  const requirementIds = new Set();
  for (const requirement of data.personaToolRequirements) {
    if (!requirement.id || requirementIds.has(requirement.id) || !requirement.personaId || !requirement.activity || !requirement.workflow || !requirement.capability || !requirement.preferredTool || !requirement.recipeId || !requirement.recipeTitle || !requirement.mode || !requirement.scope || !requirement.fallback || !requirement.status || !requirement.why) throw new Error(`Invalid or duplicate persona tool requirement: ${requirement.id || '(missing)'}`);
    requirementIds.add(requirement.id);
    if (!indexes.personaIds.has(requirement.personaId)) throw new Error(`Persona tool requirement references an unknown persona: ${requirement.id}`);
    const recipe = data.toolUseRecipes.find(item => item.id === requirement.recipeId);
    if (!recipe || !recipe.personaIds.includes(requirement.personaId) || recipe.title !== requirement.recipeTitle) throw new Error(`Persona tool requirement has an invalid recipe relationship: ${requirement.id}`);
  }

  const handoffIds = new Set();
  for (const handoff of data.personaHandoffs) {
    if (!handoff.id || handoffIds.has(handoff.id) || !handoff.fromPersonaId || !handoff.toPersonaId || !handoff.trigger || !handoff.responsibility || !handoff.input || !handoff.output || handoff.required !== true || !handoff.onUnavailable || !handoff.status) throw new Error(`Invalid or duplicate Persona handoff: ${handoff.id || '(missing)'}`);
    handoffIds.add(handoff.id);
    if (!indexes.personaIds.has(handoff.fromPersonaId) || !indexes.personaIds.has(handoff.toPersonaId)) throw new Error(`Persona handoff references an unknown Persona: ${handoff.id}`);
  }

  for (const relation of data.skillRelations) if (!relation.from || !relation.to || !RELATIONSHIP_TYPES.has(relation.type) || !indexes.entityIds.has(relation.from) || !indexes.entityIds.has(relation.to)) throw new Error(`Invalid skill relationship: ${relation.from || '(missing)'} -> ${relation.to || '(missing)'}`);
  indexes.recipeIds = recipeIds;
}
