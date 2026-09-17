import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { isWithinRoot } from './operating-packs.mjs';

const ALLOWED_SOURCE_KINDS = new Set(['repository_local', 'project_local', 'github_repository']);
const ALLOWED_LIFECYCLES = new Set(['candidate', 'planned', 'deprecated']);

export function resolveLocalTemplateEntrypoint(root, sourceRecord) {
  const sourceRoot = path.resolve(root, sourceRecord.path);
  if (!isWithinRoot(root, sourceRoot)) throw new Error('Template source path escapes the repository root');
  const entrypoint = path.resolve(sourceRoot, sourceRecord.entrypoint);
  const relativeToSourceRoot = path.relative(sourceRoot, entrypoint);
  if (relativeToSourceRoot === '..' || relativeToSourceRoot.startsWith(`..${path.sep}`) || path.isAbsolute(relativeToSourceRoot)) throw new Error('Template entrypoint escapes the declared source directory');
  return entrypoint;
}

export function assertKnownTemplateApplication(templateId, application) {
  if (!application.known) throw new Error(`${templateId} has an unresolved Persona-Skill-workflow relationship`);
}

export async function validateTemplates(context, indexes) {
  const { data, orientation, root, model, templatePreviewConfig } = context;
  const templateIds = new Set();
  const previewRendererConfig = templatePreviewConfig?.previewRenderers || {};
  for (const template of data.templates) {
    if (!template.id || templateIds.has(template.id)) throw new Error(`Duplicate or missing Template id: ${template.id || '(missing)'}`);
    templateIds.add(template.id);
    for (const field of ['name', 'purpose', 'category', 'useWhen', 'lifecycle', 'status', 'source', 'evidence', 'revision']) if (template[field] === undefined || template[field] === null || template[field] === '') throw new Error(`${template.id} is missing ${field}`);
    if (!ALLOWED_LIFECYCLES.has(template.lifecycle)) throw new Error(`${template.id} has an unsupported lifecycle: ${template.lifecycle}`);
    if (!Array.isArray(template.provides) || !template.provides.length || !Array.isArray(template.applications) || !Array.isArray(template.relatedSkills) || !Array.isArray(template.operatingPacks) || !Array.isArray(template.playbooks)) throw new Error(`${template.id} has an incomplete relationship or starting-structure model`);
    const sourceRecord = template.source;
    const plannedExternalWithoutArtifact = sourceRecord.kind === 'github_repository' && sourceRecord.availability === 'planned' && sourceRecord.path == null;
    if (!ALLOWED_SOURCE_KINDS.has(sourceRecord.kind) || !Object.prototype.hasOwnProperty.call(sourceRecord, 'path') || (!sourceRecord.entrypoint && !plannedExternalWithoutArtifact) || !sourceRecord.availability || !orientation.routing.availability_sources.includes(sourceRecord.availability) || !sourceRecord.verification || !sourceRecord.revision) throw new Error(`${template.id} has incomplete source/location metadata`);
    if (sourceRecord.kind === 'github_repository' && !/^[^/]+\/[^/]+$/.test(sourceRecord.repository || '')) throw new Error(`${template.id} has an invalid external repository reference`);
    if (sourceRecord.kind === 'github_repository' && sourceRecord.availability === 'repo_local') throw new Error(`${template.id} incorrectly claims repo-local availability for an external source`);
    if (plannedExternalWithoutArtifact && sourceRecord.entrypoint != null) throw new Error(`${template.id} planned external artifact entrypoint must remain unknown`);
    if (sourceRecord.kind !== 'github_repository' && (!sourceRecord.path || !isWithinRoot(root, path.resolve(root, sourceRecord.path)))) throw new Error(`${template.id} has an invalid local source path`);
    if (sourceRecord.kind !== 'github_repository') {
      const entrypoint = resolveLocalTemplateEntrypoint(root, sourceRecord);
      try { await readFile(entrypoint, 'utf8'); } catch { throw new Error(`${template.id} local entrypoint does not resolve: ${sourceRecord.entrypoint}`); }
    }
    if (!/^\d+\.\d+$/.test(template.revision.version) || !template.revision.date || !template.revision.changeType || !template.revision.summary || !Array.isArray(template.revision.affectedFields) || !template.revision.confidence) throw new Error(`${template.id} has incomplete revision context`);
    for (const skillId of template.relatedSkills) if (!indexes.catalogIds.has(skillId)) throw new Error(`${template.id} references an unknown Skill: ${skillId}`);
    for (const application of template.applications) {
      if (!application.personaId || !application.skillId || !application.workflow || !application.reason || !indexes.personaIds.has(application.personaId) || !indexes.catalogIds.has(application.skillId)) throw new Error(`${template.id} has an invalid scoped application`);
      if (!(data.flowLibrary[application.personaId] || []).some(flow => flow.title === application.workflow)) throw new Error(`${template.id} references an unknown workflow: ${application.workflow}`);
    }
    for (const operatingPackId of template.operatingPacks) if (!indexes.operatingPackIds.has(operatingPackId)) throw new Error(`${template.id} references an unknown Operating Pack identity: ${operatingPackId}`);
    for (const playbookId of template.playbooks) if (!indexes.playbookIds.has(playbookId)) throw new Error(`${template.id} references an unknown Playbook identity: ${playbookId}`);
    if (template.id.startsWith('proto-') || template.relatedSkills.some(id => id.startsWith('proto-')) || template.operatingPacks.some(id => id.startsWith('proto-')) || template.playbooks.some(id => id.startsWith('proto-')) || template.applications.some(application => application.personaId.startsWith('proto-') || application.skillId.startsWith('proto-'))) throw new Error(`Prototype identity leaked into live Template: ${template.id}`);
    if (/(?:\bTBD\b|\bTODO\b|REPLACE_ME|\[\[)/i.test(JSON.stringify(template))) throw new Error(`Unresolved canonical placeholder in Template: ${template.id}`);
    const hasLocalViewer = Object.prototype.hasOwnProperty.call(previewRendererConfig, template.id);
    if (template.lifecycle !== 'planned' && !hasLocalViewer) throw new Error(`${template.id} is published without a local illustrative viewer representation`);
  }
  const rebuiltTemplateCatalog = model.buildTemplateCatalog(data);
  if (JSON.stringify(data.templateCatalog) !== JSON.stringify(rebuiltTemplateCatalog)) throw new Error('Template catalog is not fresh from the canonical source model');
  for (const template of data.templateCatalog) {
    const expectedRuntimeState = model.templateRuntimeStateByAvailability[template.source?.availability] || 'unknown';
    const expectedPreviewState = Object.prototype.hasOwnProperty.call(previewRendererConfig, template.id) ? 'illustrative' : 'none';
    if (template.runtimeAccessState.id !== expectedRuntimeState || template.previewState.id !== expectedPreviewState) throw new Error('Template display states are not derived from availability and Site preview configuration: ' + template.id);
    if (!templateIds.has(template.id) || !Array.isArray(template.relatedPersonas) || !Array.isArray(template.relatedSkills) || !Array.isArray(template.applications) || !Array.isArray(template.operatingPacks) || !Array.isArray(template.playbooks) || !Array.isArray(template.relatedToolRecipes) || !template.lifecycleState?.id || !template.sourceState?.id || !template.runtimeAccessState?.id || !template.previewState?.id) throw new Error(`Normalized Template catalog entry is incomplete: ${template.id || '(missing)'}`);
    if (template.relatedSkills.some(skill => !skill.known) || template.operatingPacks.some(pack => !pack.known) || template.playbooks.some(playbook => !playbook.known)) throw new Error(`Normalized Template relationship is unresolved: ${template.id}`);
    for (const application of template.applications) assertKnownTemplateApplication(template.id, application);
  }
  validateTemplateFixtures(context, { templateIds });
  indexes.templateIds = templateIds;
}

export function validateTemplateFixtures(context) {
  const { data, model, root } = context;
  const negativeTemplatePersona = data.personas.find(persona => persona.id === 'ui-expert') || data.personas[0];
  const negativeTemplateWorkflow = (data.flowLibrary[negativeTemplatePersona?.id] || [])[0];
  const negativeTemplateSkill = data.skillCatalog.find(skill => skill.profiles?.some(profile => profile.personaId === negativeTemplatePersona?.id) && !skill.workflows?.some(workflow => workflow.personaId === negativeTemplatePersona?.id && workflow.title === negativeTemplateWorkflow?.title));
  if (!negativeTemplatePersona || !negativeTemplateWorkflow || !negativeTemplateSkill) throw new Error('Could not construct the invalid Template relationship fixture');
  const negativeTemplateCatalog = model.buildTemplateCatalog({ templates: [{ id: 'negative-template-relationship-fixture', applications: [{ personaId: negativeTemplatePersona.id, skillId: negativeTemplateSkill.id, workflow: negativeTemplateWorkflow.title, reason: 'Validator fixture' }] }], personas: data.personas, skillCatalog: data.skillCatalog, flowLibrary: data.flowLibrary, operatingPackCatalog: data.operatingPackCatalog, playbookCatalog: data.playbookCatalog });
  if (negativeTemplateCatalog[0]?.applications[0]?.known) throw new Error('Invalid Template Persona-Skill-workflow relationship was normalized as known');
  let templateRelationshipFixtureRejected = false;
  try { assertKnownTemplateApplication('negative-template-relationship-fixture', negativeTemplateCatalog[0].applications[0]); } catch { templateRelationshipFixtureRejected = true; }
  if (!templateRelationshipFixtureRejected) throw new Error('Invalid Template Persona-Skill-workflow relationship was not rejected');
  let unknownTemplateOperatingPackRejected = false;
  try { if (!data.operatingPacks.some(pack => pack.id === 'operating-pack-missing-fixture')) throw new Error('unknown Operating Pack'); } catch { unknownTemplateOperatingPackRejected = true; }
  if (!unknownTemplateOperatingPackRejected) throw new Error('Unknown Template Operating Pack reference was not rejected');
  let unknownTemplatePlaybookRejected = false;
  try { if (!data.playbookCatalog.some(playbook => playbook.id === 'playbook-missing-fixture')) throw new Error('unknown Playbook'); } catch { unknownTemplatePlaybookRejected = true; }
  if (!unknownTemplatePlaybookRejected) throw new Error('Unknown Template Playbook reference was not rejected');
  let duplicateTemplateFixtureRejected = false;
  try { const duplicateFixtureIds = new Set(); for (const template of [{ id: 'duplicate-template-fixture' }, { id: 'duplicate-template-fixture' }]) { if (duplicateFixtureIds.has(template.id)) throw new Error('duplicate Template'); duplicateFixtureIds.add(template.id); } } catch { duplicateTemplateFixtureRejected = true; }
  if (!duplicateTemplateFixtureRejected) throw new Error('Duplicate Template id was not rejected');
  let templateTraversalFixtureRejected = false;
  try { resolveLocalTemplateEntrypoint(root, { path: 'docs/template-a', entrypoint: '../other.md' }); } catch { templateTraversalFixtureRejected = true; }
  if (!templateTraversalFixtureRejected) throw new Error('Template entrypoint escape from the declared source directory was not rejected');
  let templateNestedEntrypointFixtureAccepted = false;
  try { resolveLocalTemplateEntrypoint(root, { path: 'docs', entrypoint: 'work-orders/WO-2026-09-11-templates/work-order.md' }); templateNestedEntrypointFixtureAccepted = true; } catch { templateNestedEntrypointFixtureAccepted = false; }
  if (!templateNestedEntrypointFixtureAccepted) throw new Error('Valid nested Template entrypoint was rejected');
  let externalTemplateAvailabilityFixtureRejected = false;
  try { const externalFixture = { kind: 'github_repository', repository: 'rickvang/template-library', path: null, entrypoint: 'README.md', availability: 'repo_local', verification: 'Validator fixture' }; if (externalFixture.kind === 'github_repository' && externalFixture.availability === 'repo_local') throw new Error('external Template claims repo-local availability'); } catch { externalTemplateAvailabilityFixtureRejected = true; }
  if (!externalTemplateAvailabilityFixtureRejected) throw new Error('External Template repo-local availability was not rejected');
  let prototypeTemplateFixtureRejected = false;
  try { const prototypeFixture = { id: 'template-live-fixture', relatedSkills: ['proto-skill-fixture'], operatingPacks: [], playbooks: [], applications: [] }; if (prototypeFixture.relatedSkills.some(id => id.startsWith('proto-'))) throw new Error('prototype Template relationship'); } catch { prototypeTemplateFixtureRejected = true; }
  if (!prototypeTemplateFixtureRejected) throw new Error('Prototype identity entering live Template catalog was not rejected');
}
