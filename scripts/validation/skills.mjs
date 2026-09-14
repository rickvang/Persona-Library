export function validateSkills({ data }, indexes) {
  const catalogIds = new Set();
  for (const skill of data.skillCatalog) {
    if (!skill.id || catalogIds.has(skill.id)) throw new Error(`Duplicate or missing catalog skill id: ${skill.id || '(missing)'}`);
    catalogIds.add(skill.id);
    if (!skill.name || !Array.isArray(skill.personas) || !skill.personas.length || !Array.isArray(skill.profiles) || !skill.profiles.length) throw new Error(`Incomplete skill catalog entry: ${skill.id}`);
    for (const persona of skill.personas) if (!indexes.personaIds.has(persona.id)) throw new Error(`${skill.id} references an unknown persona: ${persona.id}`);
    for (const profile of skill.profiles) if (!indexes.personaIds.has(profile.personaId) || !profile.definition || !profile.triggers || !profile.workflows || !profile.actions || !profile.evidence) throw new Error(`Incomplete skill profile in catalog entry: ${skill.id}`);
    if (!Array.isArray(skill.buildingBlocks) || !Array.isArray(skill.supportingConnections) || !Array.isArray(skill.relatedSkills)) throw new Error(`Incomplete skill relationship model: ${skill.id}`);
    const operation = skill.guidance?.operation;
    const quality = skill.guidance?.quality;
    if (!operation?.startsWith || !Array.isArray(operation.loop) || !Array.isArray(operation.inputs) || !Array.isArray(operation.decisions) || !Array.isArray(operation.outputs) || !Array.isArray(operation.feedback) || !operation.boundaries || !operation.leavesBehind || !Array.isArray(operation.moves) || !Array.isArray(quality?.signals) || !Array.isArray(quality.checks) || !Array.isArray(quality.watchFor)) throw new Error(`Incomplete skill practice guidance: ${skill.id}`);
    if (!Array.isArray(skill.toolUseRecipes)) throw new Error(`Incomplete tool-use recipe relationship model: ${skill.id}`);
  }

  const skillUnitIds = new Set();
  for (const unit of data.skillUnits) {
    if (!unit.id || skillUnitIds.has(unit.id) || !unit.name || !unit.kind || !unit.summary) throw new Error(`Invalid or duplicate skill unit: ${unit.id || '(missing)'}`);
    skillUnitIds.add(unit.id);
  }
  indexes.catalogIds = catalogIds;
  indexes.skillUnitIds = skillUnitIds;
  indexes.entityIds = new Set([...catalogIds, ...skillUnitIds]);
}

export function validateSkillPilot({ data }) {
  const hierarchyPilot = data.skillCatalog.find(skill => skill.id === 'skill-interface-hierarchy-and-visual-communication');
  if (!hierarchyPilot || hierarchyPilot.buildingBlocks.length < 3) throw new Error('The modular skill pilot must have at least three building blocks');
}
