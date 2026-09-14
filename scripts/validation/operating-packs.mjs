import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_SOURCE_KINDS = new Set(['repository_local', 'project_local', 'github_repository']);

export function isWithinRoot(root, target) {
  const relative = path.relative(root, target);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

export function resolveLocalPackEntrypoint(root, sourceRecord) {
  const sourceRoot = path.resolve(root, sourceRecord.path);
  if (!isWithinRoot(root, sourceRoot)) throw new Error('Operating Pack source path escapes the repository root');
  const entrypoint = path.resolve(sourceRoot, sourceRecord.entrypoint);
  if (!isWithinRoot(root, entrypoint)) throw new Error('Operating Pack entrypoint escapes the repository root');
  return entrypoint;
}

export function assertKnownOperatingPackApplication(packId, application) {
  if (!application.known) throw new Error(`${packId} has an unresolved Persona-Skill-workflow relationship`);
}

export async function validateOperatingPacks(context, indexes) {
  const { data, orientation, root } = context;
  const operatingPackIds = new Set();
  for (const pack of data.operatingPacks) {
    if (!pack.id || operatingPackIds.has(pack.id)) throw new Error(`Duplicate or missing Operating Pack id: ${pack.id || '(missing)'}`);
    operatingPackIds.add(pack.id);
    for (const field of ['name', 'purpose', 'domain', 'useWhen', 'status', 'source', 'evidence', 'revision']) if (pack[field] === undefined || pack[field] === null || pack[field] === '') throw new Error(`${pack.id} is missing ${field}`);
    if (!Array.isArray(pack.provides) || !pack.provides.length || !Array.isArray(pack.relatedSkills) || !Array.isArray(pack.applications) || !Array.isArray(pack.playbooks)) throw new Error(`${pack.id} has an incomplete relationship or context model`);
    const sourceRecord = pack.source;
    if (!ALLOWED_SOURCE_KINDS.has(sourceRecord.kind) || !Object.prototype.hasOwnProperty.call(sourceRecord, 'path') || !sourceRecord.entrypoint || !sourceRecord.availability || !orientation.routing.availability_sources.includes(sourceRecord.availability) || !sourceRecord.verification) throw new Error(`${pack.id} has incomplete source/location metadata`);
    if (pack.id === 'operating-pack-design-system' && (sourceRecord.repository !== 'rickvang/operating-packs' || sourceRecord.path !== 'packs/design-system' || sourceRecord.entrypoint !== 'AGENTS.md' || sourceRecord.availability === 'planned' || pack.status === 'Planned external reference')) throw new Error('Design System Operating Pack source migration is stale');
    if (sourceRecord.kind === 'github_repository' && !/^[^/]+\/[^/]+$/.test(sourceRecord.repository || '')) throw new Error(`${pack.id} has an invalid external repository reference`);
    if (sourceRecord.kind !== 'github_repository' && (!sourceRecord.path || !isWithinRoot(root, path.resolve(root, sourceRecord.path)))) throw new Error(`${pack.id} has an invalid local source path`);
    if (sourceRecord.kind !== 'github_repository') {
      const entrypoint = resolveLocalPackEntrypoint(root, sourceRecord);
      try {
        await readFile(entrypoint, 'utf8');
      } catch {
        throw new Error(`${pack.id} local entrypoint does not resolve: ${sourceRecord.entrypoint}`);
      }
    }
    if (!/^\d+\.\d+$/.test(pack.revision.version) || !pack.revision.date || !pack.revision.changeType || !pack.revision.summary || !Array.isArray(pack.revision.affectedFields) || !pack.revision.confidence) throw new Error(`${pack.id} has incomplete revision context`);
    for (const skillId of pack.relatedSkills) if (!indexes.catalogIds.has(skillId)) throw new Error(`${pack.id} references an unknown Skill: ${skillId}`);
    for (const application of pack.applications) {
      if (!application.personaId || !application.skillId || !application.workflow || !application.reason || !indexes.personaIds.has(application.personaId) || !indexes.catalogIds.has(application.skillId)) throw new Error(`${pack.id} has an invalid scoped application`);
      if (!(data.flowLibrary[application.personaId] || []).some(flow => flow.title === application.workflow)) throw new Error(`${pack.id} references an unknown workflow: ${application.workflow}`);
    }
    for (const playbookId of pack.playbooks) if (!indexes.playbookIds.has(playbookId)) throw new Error(`${pack.id} references an unknown Playbook identity: ${playbookId}`);
    if (pack.id.startsWith('proto-') || pack.relatedSkills.some(id => id.startsWith('proto-')) || pack.playbooks.some(id => id.startsWith('proto-'))) throw new Error(`Prototype identity leaked into live Operating Pack: ${pack.id}`);
  }
  for (const pack of data.operatingPackCatalog) {
    if (!operatingPackIds.has(pack.id) || !Array.isArray(pack.relatedPersonas) || !Array.isArray(pack.relatedToolRecipes)) throw new Error(`Normalized Operating Pack catalog entry is incomplete: ${pack.id || '(missing)'}`);
    if (pack.relatedSkills.some(skill => !skill.known) || pack.playbooks.some(playbook => !playbook.known)) throw new Error(`Normalized Operating Pack relationship is unresolved: ${pack.id}`);
    for (const application of pack.applications) assertKnownOperatingPackApplication(pack.id, application);
  }
  const rebuiltOperatingPackCatalog = context.model.buildOperatingPackCatalog(data);
  if (JSON.stringify(data.operatingPackCatalog) !== JSON.stringify(rebuiltOperatingPackCatalog)) throw new Error('Operating Pack catalog is not fresh from the canonical source model');
  indexes.operatingPackIds = operatingPackIds;
}

export function validateOperatingPackFixtures(context) {
  const { data, model, root } = context;
  const negativeRelationshipPersona = data.personas.find(persona => persona.id === 'ui-expert') || data.personas[0];
  const negativeRelationshipWorkflow = (data.flowLibrary[negativeRelationshipPersona?.id] || [])[0];
  const negativeRelationshipSkill = data.skillCatalog.find(skill => skill.profiles?.some(profile => profile.personaId === negativeRelationshipPersona?.id) && !skill.workflows?.some(workflow => workflow.personaId === negativeRelationshipPersona?.id && workflow.title === negativeRelationshipWorkflow?.title));
  if (!negativeRelationshipPersona || !negativeRelationshipWorkflow || !negativeRelationshipSkill) throw new Error('Could not construct the invalid Operating Pack relationship fixture');
  const negativeRelationshipCatalog = model.buildOperatingPackCatalog({ operatingPacks: [{ id: 'negative-relationship-fixture', name: 'Negative relationship fixture', applications: [{ personaId: negativeRelationshipPersona.id, skillId: negativeRelationshipSkill.id, workflow: negativeRelationshipWorkflow.title, reason: 'Validator fixture' }] }], personas: data.personas, skillCatalog: data.skillCatalog, flowLibrary: data.flowLibrary, playbookCatalog: data.playbookCatalog });
  if (negativeRelationshipCatalog[0]?.applications[0]?.known) throw new Error('Invalid Operating Pack Persona-Skill-workflow relationship was normalized as known');
  let relationshipFixtureRejected = false;
  try { assertKnownOperatingPackApplication('negative-relationship-fixture', negativeRelationshipCatalog[0].applications[0]); } catch { relationshipFixtureRejected = true; }
  if (!relationshipFixtureRejected) throw new Error('Invalid Operating Pack Persona-Skill-workflow relationship was not rejected');
  let traversalFixtureRejected = false;
  try { resolveLocalPackEntrypoint(root, { path: '.', entrypoint: '../outside.md' }); } catch { traversalFixtureRejected = true; }
  if (!traversalFixtureRejected) throw new Error('Operating Pack entrypoint traversal was not rejected');
}
