const ALLOWED_ROLES = new Set(['operator', 'leader', 'specialist']);
const ALLOWED_WORK_MODES = new Set(['execute', 'review', 'orchestrate']);
const ALLOWED_FLOW_TYPES = new Set(['foundational', 'supporting', 'edge']);

export function validatePersonas({ data }, indexes) {
  const personaIds = new Set();
  for (const persona of data.personas) {
    if (!persona.id || personaIds.has(persona.id)) throw new Error(`Duplicate or missing persona id: ${persona.id || '(missing)'}`);
    personaIds.add(persona.id);
    for (const field of ['name', 'role', 'roleLabel', 'lifecycle', 'operatingContext', 'operatingState', 'confidence']) if (persona[field] === undefined || persona[field] === null || persona[field] === '') throw new Error(`${persona.id} is missing ${field}`);
    if (!ALLOWED_ROLES.has(persona.role)) throw new Error(`${persona.id} has an unsupported role: ${persona.role}`);
    if (Object.hasOwn(persona, 'workModes')) {
      if (!Array.isArray(persona.workModes) || !persona.workModes.length) throw new Error(`${persona.id} workModes must be a nonempty array`);
      for (const mode of persona.workModes) if (!ALLOWED_WORK_MODES.has(mode)) throw new Error(`${persona.id} has an unsupported work mode`);
      if (new Set(persona.workModes).size !== persona.workModes.length) throw new Error(`${persona.id} workModes must be unique`);
    }
    const skillNames = new Set((persona.skills || []).map(skill => skill.split(' — ')[0]));
    const profiles = data.skillLibrary[persona.id] || [];
    for (const profile of profiles) if (!skillNames.has(profile.name)) throw new Error(`${persona.id} has an unregistered skill profile: ${profile.name}`);
    for (const resource of persona.resources || []) if (!/^https?:\/\//.test(resource.url || '')) throw new Error(`${persona.id} has an invalid resource URL`);
  }

  for (const [personaId, profiles] of Object.entries(data.skillLibrary)) {
    // Accepted CW-92 pilot migration: a semantic Skill key is an authored method
    // source, not a Persona bucket. Skill shape, method fields and uniqueness
    // belong to validateSkills / the source model, not a second validator here.
    if (/^skill-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(personaId)) {
      const canonical = (data.skillCatalog || []).find(skill => skill.id === personaId);
      if (!canonical || !Array.isArray(profiles) || !profiles.length ||
          profiles.some(method => !method?.id || !canonical.methods?.some(entry => entry.id === method.id))) {
        throw new Error(`Neutral method source has no matching canonical Skill/method: ${personaId}`);
      }
      continue;
    }
    if (!personaIds.has(personaId)) throw new Error(`Skill library has no matching persona: ${personaId}`);
    const names = new Set();
    for (const profile of profiles) {
      if (!profile.name || names.has(profile.name)) throw new Error(`Duplicate or missing skill name for ${personaId}`);
      names.add(profile.name);
      for (const field of ['definition', 'triggers', 'workflows', 'actions', 'evidence']) if (!profile[field]) throw new Error(`${personaId}/${profile.name} is missing ${field}`);
    }
  }

  for (const persona of data.personas) {
    const flows = data.flowLibrary[persona.id];
    if (!Array.isArray(flows) || !flows.length) throw new Error(`${persona.id} has no workflow map`);
  }
  const methodSourceKeys = new Set(Object.entries(data.skillLibrary).filter(([id]) => id.startsWith('skill-')).flatMap(([, methods]) => methods.map(method => method.legacySourceKey).filter(Boolean)));
  for (const [sourceKey, flows] of Object.entries(data.flowLibrary)) {
    if (!personaIds.has(sourceKey) && !methodSourceKeys.has(sourceKey)) throw new Error(`Flow library has no matching persona or method provenance: ${sourceKey}`);
    if (!Array.isArray(flows) || !flows.length) throw new Error(`${sourceKey} has no workflow map`);
    const titles = new Set();
    for (const flow of flows) {
      if (!ALLOWED_FLOW_TYPES.has(flow.type)) throw new Error(`${sourceKey} has an unsupported flow type: ${flow.type}`);
      if (!flow.title || titles.has(flow.title)) throw new Error(`Duplicate or missing flow title for ${sourceKey}`);
      titles.add(flow.title);
      if (!Array.isArray(flow.activities) || !flow.activities.length) throw new Error(`${sourceKey}/${flow.title} has no activities`);
      for (const activity of flow.activities) if (!Array.isArray(activity) || activity.length < 4) throw new Error(`${sourceKey}/${flow.title} has an incomplete activity row`);
    }
  }
  indexes.personaIds = personaIds;
}
