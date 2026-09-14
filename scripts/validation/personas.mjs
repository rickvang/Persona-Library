const ALLOWED_ROLES = new Set(['operator', 'leader', 'specialist']);
const ALLOWED_FLOW_TYPES = new Set(['foundational', 'supporting', 'edge']);

export function validatePersonas({ data }, indexes) {
  const personaIds = new Set();
  for (const persona of data.personas) {
    if (!persona.id || personaIds.has(persona.id)) throw new Error(`Duplicate or missing persona id: ${persona.id || '(missing)'}`);
    personaIds.add(persona.id);
    for (const field of ['name', 'role', 'roleLabel', 'lifecycle', 'operatingContext', 'operatingState', 'confidence']) if (persona[field] === undefined || persona[field] === null || persona[field] === '') throw new Error(`${persona.id} is missing ${field}`);
    if (!ALLOWED_ROLES.has(persona.role)) throw new Error(`${persona.id} has an unsupported role: ${persona.role}`);
    const skillNames = new Set((persona.skills || []).map(skill => skill.split(' — ')[0]));
    const profiles = data.skillLibrary[persona.id] || [];
    for (const profile of profiles) if (!skillNames.has(profile.name)) throw new Error(`${persona.id} has an unregistered skill profile: ${profile.name}`);
    for (const resource of persona.resources || []) if (!/^https?:\/\//.test(resource.url || '')) throw new Error(`${persona.id} has an invalid resource URL`);
  }

  for (const [personaId, profiles] of Object.entries(data.skillLibrary)) {
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
    const titles = new Set();
    for (const flow of flows) {
      if (!ALLOWED_FLOW_TYPES.has(flow.type)) throw new Error(`${persona.id} has an unsupported flow type: ${flow.type}`);
      if (!flow.title || titles.has(flow.title)) throw new Error(`Duplicate or missing flow title for ${persona.id}`);
      titles.add(flow.title);
      if (!Array.isArray(flow.activities) || !flow.activities.length) throw new Error(`${persona.id}/${flow.title} has no activities`);
      for (const activity of flow.activities) if (!Array.isArray(activity) || activity.length < 4) throw new Error(`${persona.id}/${flow.title} has an incomplete activity row`);
    }
  }
  for (const personaId of Object.keys(data.flowLibrary)) if (!personaIds.has(personaId)) throw new Error(`Flow library has no matching persona: ${personaId}`);
  indexes.personaIds = personaIds;
}
