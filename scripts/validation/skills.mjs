export function validateSkills({ data }, indexes) {
  const catalogIds = new Set(), methodIds = new Set();
  for (const skill of data.skillCatalog) {
    if (!skill.id || catalogIds.has(skill.id)) throw new Error(`Duplicate or missing catalog skill id: ${skill.id || '(missing)'}`);
    catalogIds.add(skill.id);
    if (!skill.name || !Array.isArray(skill.methods) || !skill.methods.length || !Array.isArray(skill.personas) || !Array.isArray(skill.profiles)) throw new Error(`Incomplete skill catalog entry: ${skill.id}`);
    for (const method of skill.methods) {
      if (!/^method-[a-z0-9][a-z0-9-]*$/.test(method.id || '') || methodIds.has(method.id)) throw new Error(`Invalid or duplicate method: ${method.id}`);
      methodIds.add(method.id);
      for (const field of ['name', 'status', 'definition', 'when', 'actions', 'evidence']) if (typeof method[field] !== 'string' || !method[field].trim()) throw new Error(`Incomplete method ${method.id}: ${field}`);
      if (!Array.isArray(method.workflowRefs) || !method.workflowRefs.length || !method.provenance || typeof method.provenance !== 'object') throw new Error(`Incomplete method references: ${method.id}`);
    }
    for (const persona of skill.personas) if (!indexes.personaIds.has(persona.id)) throw new Error(`${skill.id} references an unknown persona: ${persona.id}`);
    for (const profile of skill.profiles) {
      const method = skill.methods.find(candidate => candidate.legacySourceKey === profile.personaId);
      if (!method || !profile.definition || !profile.triggers || !profile.workflows || !profile.actions || !profile.evidence) throw new Error(`Incomplete skill profile in catalog entry: ${skill.id}`);
      for (const [oldField, field] of [['status','status'],['definition','definition'],['triggers','when'],['actions','actions'],['evidence','evidence']]) if (profile[oldField] !== method[field]) throw new Error(`Legacy profile diverges from method ${method.id}: ${oldField}`);
    }
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
