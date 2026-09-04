import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentPath = path.join(root, 'content', 'library-data.js');
const outputPath = path.join(root, 'dist', 'data', 'library-data.js');
const modelPath = path.join(root, 'content', 'library-model.js');
const modelOutputPath = path.join(root, 'dist', 'data', 'library-model.js');
const uiPath = path.join(root, 'client', 'library-ui.js');
const uiOutputPath = path.join(root, 'dist', 'js', 'library-ui.js');
const statePath = path.join(root, 'client', 'library-state.js');
const stateOutputPath = path.join(root, 'dist', 'js', 'library-state.js');
const pagePath = path.join(root, 'dist', 'index.html');
const skillsPagePath = path.join(root, 'dist', 'skills.html');
const source = await readFile(contentPath, 'utf8');
const output = await readFile(outputPath, 'utf8');
const modelSource = await readFile(modelPath, 'utf8');
const modelOutput = await readFile(modelOutputPath, 'utf8');
const uiSource = await readFile(uiPath, 'utf8');
const uiOutput = await readFile(uiOutputPath, 'utf8');
const stateSource = await readFile(statePath, 'utf8');
const stateOutput = await readFile(stateOutputPath, 'utf8');
const page = await readFile(pagePath, 'utf8');
const skillsPage = await readFile(skillsPagePath, 'utf8');
const sandbox = { window: {} };

vm.runInNewContext(source, sandbox, { filename: contentPath });
vm.runInNewContext(modelSource, sandbox, { filename: modelPath });
const data = sandbox.window.PersonaLibraryData;
if (!data || !Array.isArray(data.personas) || !data.skillLibrary || !data.flowLibrary || !data.skillGuidance || !Array.isArray(data.skillUnits) || !Array.isArray(data.skillRelations) || !Array.isArray(data.skillCatalog) || !data.maintenance || !sandbox.window.PersonaLibraryModel) {
  throw new Error('Content modules must expose personas, skillLibrary, flowLibrary, skillGuidance, skillUnits, skillRelations, skillCatalog, maintenance, and PersonaLibraryModel');
}
if (source !== output) throw new Error('Generated dist/data/library-data.js is stale; run build-library.mjs');
if (modelSource !== modelOutput) throw new Error('Generated dist/data/library-model.js is stale; run build-library.mjs');
if (uiSource !== uiOutput) throw new Error('Generated dist/js/library-ui.js is stale; run build-library.mjs');
if (stateSource !== stateOutput) throw new Error('Generated dist/js/library-state.js is stale; run build-library.mjs');
for (const [name, html] of [['library', page], ['skills', skillsPage]]) {
  for (const script of ['data/library-data.js', 'data/library-model.js', 'js/library-ui.js', 'js/library-state.js']) {
    if (!html.includes(`<script src="${script}"></script>`)) throw new Error(`${name} page is missing ${script}`);
  }
}

const personaIds = new Set();
const allowedRoles = new Set(['operator', 'leader', 'specialist']);
const allowedFlowTypes = new Set(['foundational', 'supporting', 'edge']);
for (const persona of data.personas) {
  if (!persona.id || personaIds.has(persona.id)) throw new Error(`Duplicate or missing persona id: ${persona.id || '(missing)'}`);
  personaIds.add(persona.id);
  for (const field of ['name', 'role', 'roleLabel', 'lifecycle', 'operatingContext', 'operatingState', 'confidence']) {
    if (persona[field] === undefined || persona[field] === null || persona[field] === '') throw new Error(`${persona.id} is missing ${field}`);
  }
  if (!allowedRoles.has(persona.role)) throw new Error(`${persona.id} has an unsupported role: ${persona.role}`);
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
    if (!allowedFlowTypes.has(flow.type)) throw new Error(`${persona.id} has an unsupported flow type: ${flow.type}`);
    if (!flow.title || titles.has(flow.title)) throw new Error(`Duplicate or missing flow title for ${persona.id}`);
    titles.add(flow.title);
    if (!Array.isArray(flow.activities) || !flow.activities.length) throw new Error(`${persona.id}/${flow.title} has no activities`);
    for (const activity of flow.activities) if (!Array.isArray(activity) || activity.length < 4) throw new Error(`${persona.id}/${flow.title} has an incomplete activity row`);
  }
}
for (const personaId of Object.keys(data.flowLibrary)) if (!personaIds.has(personaId)) throw new Error(`Flow library has no matching persona: ${personaId}`);

const catalogIds = new Set();
for (const skill of data.skillCatalog) {
  if (!skill.id || catalogIds.has(skill.id)) throw new Error(`Duplicate or missing catalog skill id: ${skill.id || '(missing)'}`);
  catalogIds.add(skill.id);
  if (!skill.name || !Array.isArray(skill.personas) || !skill.personas.length || !Array.isArray(skill.profiles) || !skill.profiles.length) throw new Error(`Incomplete skill catalog entry: ${skill.id}`);
  for (const persona of skill.personas) if (!personaIds.has(persona.id)) throw new Error(`${skill.id} references an unknown persona: ${persona.id}`);
  for (const profile of skill.profiles) if (!personaIds.has(profile.personaId) || !profile.definition || !profile.triggers || !profile.workflows || !profile.actions || !profile.evidence) throw new Error(`Incomplete skill profile in catalog entry: ${skill.id}`);
  if (!Array.isArray(skill.buildingBlocks) || !Array.isArray(skill.supportingConnections) || !Array.isArray(skill.relatedSkills)) throw new Error(`Incomplete skill relationship model: ${skill.id}`);
  if (!skill.guidance?.operation?.startsWith || !Array.isArray(skill.guidance.operation.moves) || !skill.guidance.operation.leavesBehind || !Array.isArray(skill.guidance.quality?.signals) || !Array.isArray(skill.guidance.quality.checks) || !Array.isArray(skill.guidance.quality.watchFor)) throw new Error(`Incomplete skill practice guidance: ${skill.id}`);
}

const skillUnitIds = new Set();
for (const unit of data.skillUnits) {
  if (!unit.id || skillUnitIds.has(unit.id) || !unit.name || !unit.kind || !unit.summary) throw new Error(`Invalid or duplicate skill unit: ${unit.id || '(missing)'}`);
  skillUnitIds.add(unit.id);
}
const relationshipTypes = new Set(['built-from', 'supports', 'used-in', 'applied-by', 'related-to']);
const entityIds = new Set([...catalogIds, ...skillUnitIds]);
for (const relation of data.skillRelations) {
  if (!relation.from || !relation.to || !relationshipTypes.has(relation.type) || !entityIds.has(relation.from) || !entityIds.has(relation.to)) {
    throw new Error(`Invalid skill relationship: ${relation.from || '(missing)'} -> ${relation.to || '(missing)'}`);
  }
}
const hierarchyPilot = data.skillCatalog.find(skill => skill.id === 'skill-interface-hierarchy-and-visual-communication');
if (!hierarchyPilot || hierarchyPilot.buildingBlocks.length < 3) throw new Error('The modular skill pilot must have at least three building blocks');

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

const roleCounts = data.personas.reduce((counts, persona) => {
  counts[persona.role] = (counts[persona.role] || 0) + 1;
  return counts;
}, {});
console.log(`Validated ${data.personas.length} personas, ${roleCounts.operator || 0} operators, ${roleCounts.leader || 0} leaders, ${roleCounts.specialist || 0} specialists, ${Object.keys(data.flowLibrary).length} workflow maps.`);
