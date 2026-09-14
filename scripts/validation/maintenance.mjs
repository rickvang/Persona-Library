export function validateMaintenance({ data }) {
  for (const persona of data.personas) {
    const maintenance = data.maintenance.personas?.[persona.id];
    if (!maintenance || !/^\d+\.\d+$/.test(maintenance.version) || !Array.isArray(maintenance.revisions)) throw new Error(`${persona.id} has incomplete maintenance metadata`);
    for (const revision of maintenance.revisions) if (!revision.version || !revision.date || !revision.changeType || !revision.summary || !Array.isArray(revision.affectedFields) || !revision.evidence || !revision.confidenceChange) throw new Error(`${persona.id} has an incomplete revision record`);
  }
  for (const skill of data.skillCatalog) {
    const maintenance = data.maintenance.skills?.[skill.id];
    if (!maintenance || !/^\d+\.\d+$/.test(maintenance.version) || !Array.isArray(maintenance.revisions)) throw new Error(`${skill.id} has incomplete maintenance metadata`);
    for (const revision of maintenance.revisions) if (!revision.version || !revision.date || !revision.changeType || !revision.summary || !Array.isArray(revision.affectedFields) || !revision.evidence || !revision.confidenceChange) throw new Error(`${skill.id} has an incomplete revision record`);
  }
}
