import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentPath = path.join(root, 'content', 'library-data.js');
const outputPath = path.join(root, 'dist', 'data', 'library-data.js');
const orientationPath = path.join(root, 'content', 'site-orientation.json');
const orientationOutputPath = path.join(root, 'dist', 'data', 'site-orientation.json');
const modelPath = path.join(root, 'content', 'library-model.js');
const modelOutputPath = path.join(root, 'dist', 'data', 'library-model.js');
const uiPath = path.join(root, 'client', 'library-ui.js');
const uiOutputPath = path.join(root, 'dist', 'js', 'library-ui.js');
const statePath = path.join(root, 'client', 'library-state.js');
const stateOutputPath = path.join(root, 'dist', 'js', 'library-state.js');
const canvasModules = [
  ['client/canvas-graph.js', 'dist/js/canvas-graph.js'],
  ['client/canvas-intent.js', 'dist/js/canvas-intent.js'],
  ['content/prototypes/workflow-canvas.js', 'dist/data/prototypes/workflow-canvas.js']
];
const canvasPagePath = path.join(root, 'dist', 'workflow-canvas.html');
const pagePath = path.join(root, 'dist', 'index.html');
const skillsPagePath = path.join(root, 'dist', 'skills.html');
const guidePagePath = path.join(root, 'dist', 'guide.html');
const jobSearchPagePath = path.join(root, 'dist', 'job-search.html');
const playbooksPagePath = path.join(root, 'dist', 'playbooks.html');
const prototypingPagePath = path.join(root, 'dist', 'prototyping.html');
const operatingPacksPagePath = path.join(root, 'dist', 'operating-packs.html');
const templatesPagePath = path.join(root, 'dist', 'templates.html');
const skillsRoot = path.join(root, '.agents', 'skills');
const source = await readFile(contentPath, 'utf8');
const output = await readFile(outputPath, 'utf8');
const orientationSource = await readFile(orientationPath, 'utf8');
const orientationOutput = await readFile(orientationOutputPath, 'utf8');
const modelSource = await readFile(modelPath, 'utf8');
const modelOutput = await readFile(modelOutputPath, 'utf8');
const uiSource = await readFile(uiPath, 'utf8');
const uiOutput = await readFile(uiOutputPath, 'utf8');
const stateSource = await readFile(statePath, 'utf8');
const stateOutput = await readFile(stateOutputPath, 'utf8');
const page = await readFile(pagePath, 'utf8');
const skillsPage = await readFile(skillsPagePath, 'utf8');
const guidePage = await readFile(guidePagePath, 'utf8');
const jobSearchPage = await readFile(jobSearchPagePath, 'utf8');
const playbooksPage = await readFile(playbooksPagePath, 'utf8');
const prototypingPage = await readFile(prototypingPagePath, 'utf8');
const operatingPacksPage = await readFile(operatingPacksPagePath, 'utf8');
const templatesPage = await readFile(templatesPagePath, 'utf8');
const canvasPage = await readFile(canvasPagePath, 'utf8');
const orientation = JSON.parse(orientationSource);
const generatedOrientation = JSON.parse(orientationOutput);
const sandbox = { window: {} };

vm.runInNewContext(source, sandbox, { filename: contentPath });
vm.runInNewContext(modelSource, sandbox, { filename: modelPath });
const data = sandbox.window.PersonaLibraryData;
if (!data || !Array.isArray(data.personas) || !data.skillLibrary || !data.flowLibrary || !data.skillGuidance || !data.skillPractice || !Array.isArray(data.skillUnits) || !Array.isArray(data.skillRelations) || !Array.isArray(data.toolUseRecipes) || !Array.isArray(data.personaToolRequirements) || !Array.isArray(data.personaHandoffs) || !Array.isArray(data.skillCatalog) || !Array.isArray(data.playbookCatalog) || !Array.isArray(data.operatingPacks) || !Array.isArray(data.operatingPackCatalog) || !Array.isArray(data.templates) || !Array.isArray(data.templateCatalog) || !data.maintenance || !sandbox.window.PersonaLibraryModel) {
  throw new Error('Content modules must expose personas, skillLibrary, flowLibrary, skillGuidance, skillPractice, skillUnits, skillRelations, toolUseRecipes, personaToolRequirements, personaHandoffs, skillCatalog, playbookCatalog, operatingPacks, operatingPackCatalog, templates, templateCatalog, maintenance, and PersonaLibraryModel');
}
if (source !== output) throw new Error('Generated dist/data/library-data.js is stale; run build-library.mjs');
if (orientationSource !== orientationOutput) throw new Error('Generated dist/data/site-orientation.json is stale; run build-library.mjs');
if (modelSource !== modelOutput) throw new Error('Generated dist/data/library-model.js is stale; run build-library.mjs');
if (uiSource !== uiOutput) throw new Error('Generated dist/js/library-ui.js is stale; run build-library.mjs');
if (stateSource !== stateOutput) throw new Error('Generated dist/js/library-state.js is stale; run build-library.mjs');
for (const [sourcePath, outputPath] of canvasModules) {
  const moduleSource = await readFile(path.join(root, sourcePath), 'utf8');
  const moduleOutput = await readFile(path.join(root, outputPath), 'utf8');
  if (moduleSource !== moduleOutput) throw new Error(`Generated ${outputPath} is stale; run build-library.mjs`);
}
for (const [name, html] of [['library', page], ['skills', skillsPage]]) {
  for (const script of ['data/library-data.js', 'data/library-model.js', 'js/library-ui.js', 'js/library-state.js']) {
    if (!html.includes(`<script src="${script}"></script>`)) throw new Error(`${name} page is missing ${script}`);
  }
}
if (!jobSearchPage.includes('An evidence-led job search system.') || !jobSearchPage.includes('Define target') || !jobSearchPage.includes('ATS quality') || !jobSearchPage.includes('Integrity quality') || !jobSearchPage.includes('Preflight before the council') || !jobSearchPage.includes('reverse chronological') || !jobSearchPage.includes('date consistency')) {
  throw new Error('Job search page is missing its system summary or quality gates');
}
if (!playbooksPage.includes('Playbooks compose the system.') || !playbooksPage.includes('Evidence-led job search') || !playbooksPage.includes('Shared state keeps the playbook coherent') || !playbooksPage.includes('Change control') || !playbooksPage.includes('conditional reconciliation gate')) {
  throw new Error('Playbooks page is missing its mental model or current playbook');
}
if (!operatingPacksPage.includes('Operating Packs keep the domain in view.') || !operatingPacksPage.includes('operatingPackCatalog') || !operatingPacksPage.includes('planned') || !operatingPacksPage.includes('AGENTS.md') || !operatingPacksPage.includes("grid.addEventListener('toggle'") || !operatingPacksPage.includes('}, true);') || !operatingPacksPage.includes("state.set({ selected: '' })")) {
  throw new Error('Operating Packs page is missing its catalog, source boundary, or planned example');
}
if (!templatesPage.includes('Templates give the work a useful first shape.') || !templatesPage.includes('templateCatalog') || !templatesPage.includes('category-filter') || !templatesPage.includes('status-filter') || !templatesPage.includes('source-filter') || !templatesPage.includes('availability-filter') || !templatesPage.includes('template-research') || !templatesPage.includes('relatedToolRecipes') || !templatesPage.includes("grid.addEventListener('toggle'")) {
  throw new Error('Templates page is missing its normalized catalog, filters, relationships, or lifecycle boundary');
}
if (!templatesPage.includes('id="${escapeHtml(template.id)}"') || !templatesPage.includes('window.location.hash.slice(1)') || !templatesPage.includes("scrollIntoView({ block: 'start' })") || templatesPage.includes('<span id="template-design-system-web-app" aria-hidden="true"></span>') || !templatesPage.includes('Entrypoint unknown')) {
  throw new Error('Templates page is missing rendered fragment selection or planned entrypoint handling');
}
if (guidePage.includes('rickvang/TemplateRepo') || playbooksPage.includes('rickvang/TemplateRepo')) throw new Error('Current Site docs still present TemplateRepo as the Design System Operating Pack source');
if (!prototypingPage.includes('Persona prototypes') || !prototypingPage.includes('proto-persona-surface-aware-partner') || !prototypingPage.includes('proto-persona-library-guide') || !prototypingPage.includes('Persona Library Guide') || !prototypingPage.includes('Selected output with missing prerequisites') || !prototypingPage.includes('Nothing is added to Personas by testing this') || !prototypingPage.includes('Promotion gate') || !prototypingPage.includes('change-reconciliation-prototype') || !prototypingPage.includes('proto-skill-change-impact-reconciliation') || !prototypingPage.includes('Generated artifact update') || !prototypingPage.includes('reconciliation report') || !prototypingPage.includes('skill-contract-prototype') || !prototypingPage.includes('proto-skill-contract-routing') || !prototypingPage.includes('Missing metadata')) {
  throw new Error('Prototyping page is missing the isolated persona prototype workspace');
}
for (const script of ['js/canvas-graph.js', 'js/canvas-intent.js', 'data/prototypes/workflow-canvas.js']) {
  if (!canvasPage.includes(`<script src="${script}"></script>`)) throw new Error(`Workflow canvas page is missing ${script}`);
}
if (!canvasPage.includes('proto-workflow-canvas-reasoning') || !canvasPage.includes('isolated prototype') || !canvasPage.includes('What this change reads as') || !canvasPage.includes('Change log') || !canvasPage.includes('Intent packet') || !canvasPage.includes('The canvas cannot answer')) {
  throw new Error('Workflow canvas page is missing its prototype boundary or reasoning panels');
}
if (!canvasPage.includes('drop-line') || !canvasPage.includes('showDropLine') || !canvasPage.includes('renderChains') || !canvasPage.includes('chain-label')) {
  throw new Error('Workflow canvas page is missing the drop indicator or the sequence grouping');
}
if (!canvasPage.includes('tabindex="0"') || !canvasPage.includes('grabCard') || !canvasPage.includes('cancelGrab') || !canvasPage.includes('id="move-status"') || !canvasPage.includes('aria-live="polite"')) {
  throw new Error('Workflow canvas page is missing keyboard operation of the drag gesture');
}
if (!canvasPage.includes('isInSequence') || !canvasPage.includes('node-links in-sequence') || !canvasPage.includes('focus-within .node-links.in-sequence') || !canvasPage.includes('Connect to')) {
  throw new Error('Workflow canvas page is missing the connection-chip rules or the connect affordance');
}
if (!canvasPage.includes('node-desc') || !canvasPage.includes('-webkit-line-clamp:2') || !canvasPage.includes('node.failureMode')) {
  throw new Error('Workflow canvas card is missing its clamped description line');
}
if (!prototypingPage.includes('workflow-canvas-prototype') || !prototypingPage.includes('proto-workflow-canvas-reasoning') || !prototypingPage.includes('workflow-canvas.html') || !prototypingPage.includes('Layout-only move') || !prototypingPage.includes('Displacement')) {
  throw new Error('Prototyping page is missing the workflow canvas prototype');
}
if (!guidePage.includes('persona-library-guide') || !guidePage.includes('Consult the Persona Library Guide') || !guidePage.includes('Prerequisite gate') || !guidePage.includes('change-reconciliation') || !guidePage.includes('$change-impact-reconciliation') || !guidePage.includes('skill-contract') || !guidePage.includes('Conditional skill contract') || !guidePage.includes('Copy prompt')) {
  throw new Error('Docs page is missing the Persona Library Guide handoff');
}
if (!guidePage.includes('agent-orientation') || !orientation.default_entry.includes('guide.html#agent-orientation')) {
  throw new Error('Agent orientation must be linked from the Docs page and manifest');
}
if (!guidePage.includes('routing-map') || !guidePage.includes('Persona-applied') || !guidePage.includes('$persona-panel-orchestration') || !guidePage.includes('skillLibrary') || !guidePage.includes('skill-authoring') || !guidePage.includes('$pl-skill-creator') || !guidePage.includes('PL Skill Creator')) {
  throw new Error('Docs page is missing the unified system routing map');
}
const requiredSpaces = ['personas', 'skills', 'operating-packs', 'templates', 'tools', 'playbooks', 'docs', 'decisions', 'prototyping'];
if (orientation.schema_version !== '1.1' || orientation.site !== 'Personas' || !orientation.bootstrap_rule || !orientation.spaces || !orientation.request_modes || !orientation.skill_contract || !Array.isArray(orientation.skill_contract.required_metadata) || orientation.skill_contract.required_metadata.length !== 4 || !orientation.skill_contract.routing?.source_update?.includes('$change-impact-reconciliation') || !Array.isArray(orientation.default_process) || orientation.default_process.length < 5 || orientation.mutation_policy?.default?.toLowerCase() !== 'read-only' || !Array.isArray(orientation.response_contract) || orientation.response_contract.length < 4 || !orientation.activation?.explicit_prompt?.includes('$persona-library-orientation') || !orientation.routing || !orientation.routing.skill_layers || !Array.isArray(orientation.routing.artifact_kinds) || !Array.isArray(orientation.routing.availability_sources) || !Array.isArray(orientation.routing.routes) || orientation.routing.routes.length < 10) {
  throw new Error('Orientation manifest is missing required bootstrap, process, mutation, or response fields');
}
for (const space of requiredSpaces) {
  const record = orientation.spaces[space];
  if (!record || !record.label || !record.answers || !record.read || !record.write || !record.do_not) throw new Error(`Orientation manifest has an incomplete space: ${space}`);
}
if (JSON.stringify(orientation) !== JSON.stringify(generatedOrientation)) throw new Error('Generated orientation manifest does not match its source');
const allowedSkillLayers = new Set(Object.keys(orientation.routing.skill_layers));
const allowedArtifactKinds = new Set(orientation.routing.artifact_kinds);
const allowedAvailabilitySources = new Set(orientation.routing.availability_sources);
const routeIds = new Set();
const routedPackagePaths = new Set();
for (const route of orientation.routing.routes) {
  if (!route.id || routeIds.has(route.id) || !route.request || !Array.isArray(route.modes) || !route.modes.length || !requiredSpaces.includes(route.primary_space) || !Array.isArray(route.secondary_spaces) || !route.target || !allowedArtifactKinds.has(route.artifact_kind) || !allowedAvailabilitySources.has(route.availability_source) || !Array.isArray(route.first_reads) || !route.first_reads.length || !route.mutation_boundary || !route.reconciliation || !Array.isArray(route.non_triggers) || !route.non_triggers.length || !route.next_handoff) {
    throw new Error(`Invalid or incomplete orientation route: ${route.id || '(missing)'}`);
  }
  routeIds.add(route.id);
  if (route.artifact_kind === 'callable_skill' && route.availability_source === 'repo_local') {
    if (!route.package_path || !route.package_path.startsWith('.agents/skills/')) throw new Error(`Repository Skill route has no package path: ${route.id}`);
    routedPackagePaths.add(route.package_path);
    try {
      await readFile(path.join(root, route.package_path, 'SKILL.md'), 'utf8');
    } catch {
      throw new Error(`Repository Skill route package is missing: ${route.id}`);
    }
  }
}
const routeById = new Map(orientation.routing.routes.map(route => [route.id, route]));
const operatingPackDependentRoutes = ['persona-reconciliation', 'skill-formation', 'skill-package-maintenance', 'operating-pack-reconciliation', 'playbook-composition', 'multi-persona-collaboration', 'tool-resolution', 'tool-record-maintenance', 'cross-space-reconciliation'];
for (const routeId of operatingPackDependentRoutes) {
  if (!routeById.get(routeId)?.secondary_spaces.includes('operating-packs')) throw new Error(`Operating Pack dependency is missing from route: ${routeId}`);
}
if (!routeById.get('cross-space-reconciliation')?.first_reads.some(read => /Operating Pack/i.test(read))) throw new Error('Universal reconciliation route does not declare Operating Pack inspection');
const templateDependentRoutes = ['persona-reconciliation', 'skill-formation', 'skill-package-maintenance', 'operating-pack-reconciliation', 'playbook-composition', 'docs-and-onboarding', 'cross-space-reconciliation'];
for (const routeId of templateDependentRoutes) {
  if (!routeById.get(routeId)?.secondary_spaces.includes('templates')) throw new Error(`Template dependency is missing from route: ${routeId}`);
}
if (!routeById.get('cross-space-reconciliation')?.first_reads.some(read => /Template/i.test(read))) throw new Error('Universal reconciliation route does not declare Template inspection');
const skillEntries = await readdir(skillsRoot, { withFileTypes: true });
for (const entry of skillEntries.filter(item => item.isDirectory())) {
  const skillPath = path.join(skillsRoot, entry.name, 'SKILL.md');
  let skillSource;
  try {
    skillSource = await readFile(skillPath, 'utf8');
  } catch {
    throw new Error(`Repository Skill package is missing SKILL.md: ${entry.name}`);
  }
  const frontmatter = skillSource.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const layer = frontmatter?.[1].match(/^\s*skill_layer:\s*([^\r\n]+)\s*$/m)?.[1].trim();
  if (!frontmatter || !layer || !allowedSkillLayers.has(layer)) throw new Error(`Skill package has missing or unsupported skill_layer metadata: ${entry.name}`);
  for (const field of orientation.skill_contract.required_metadata) {
    if (!frontmatter[1].match(new RegExp(`^\\s*${field}:\\s*[^\\r\\n]+$`, 'm'))) throw new Error(`Skill package has missing required metadata ${field}: ${entry.name}`);
  }
  if (!routedPackagePaths.has(`.agents/skills/${entry.name}`)) throw new Error(`Skill package is missing from the onboarding routing map: ${entry.name}`);
}
for (const html of [page, skillsPage, jobSearchPage, playbooksPage, operatingPacksPage, templatesPage]) if (!html.includes('playbooks.html')) throw new Error('Primary pages must link to the Playbooks space');
for (const html of [page, skillsPage, jobSearchPage, playbooksPage, operatingPacksPage, templatesPage]) if (!html.includes('operating-packs.html')) throw new Error('Primary pages must link to the Operating Packs space');
for (const html of [page, skillsPage, jobSearchPage, playbooksPage, operatingPacksPage, templatesPage]) if (!html.includes('templates.html')) throw new Error('Primary pages must link to the Templates space');

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
  const operation = skill.guidance?.operation;
  const quality = skill.guidance?.quality;
  if (!operation?.startsWith || !Array.isArray(operation.loop) || !Array.isArray(operation.inputs) || !Array.isArray(operation.decisions) || !Array.isArray(operation.outputs) || !Array.isArray(operation.feedback) || !operation.boundaries || !operation.leavesBehind || !Array.isArray(operation.moves) || !Array.isArray(quality?.signals) || !Array.isArray(quality.checks) || !Array.isArray(quality.watchFor)) throw new Error(`Incomplete skill practice guidance: ${skill.id}`);
  if (!Array.isArray(skill.toolUseRecipes)) throw new Error(`Incomplete tool-use recipe relationship model: ${skill.id}`);
}

const recipeIds = new Set();
for (const recipe of data.toolUseRecipes) {
  if (!recipe.id || recipeIds.has(recipe.id) || !recipe.title || !recipe.tool || !recipe.skillId || !recipe.playbook || !recipe.mode || !recipe.requires || !recipe.output || !recipe.fallback || !recipe.status) throw new Error(`Invalid or duplicate tool-use recipe: ${recipe.id || '(missing)'}`);
  recipeIds.add(recipe.id);
  if (!catalogIds.has(recipe.skillId)) throw new Error(`Tool-use recipe references an unknown skill: ${recipe.skillId}`);
  if (!Array.isArray(recipe.personaIds) || !recipe.personaIds.length || recipe.personaIds.some(id => !personaIds.has(id))) throw new Error(`Tool-use recipe references an unknown persona: ${recipe.id}`);
  if (!Array.isArray(recipe.steps) || !recipe.steps.length) throw new Error(`Tool-use recipe has no steps: ${recipe.id}`);
  if (!data.skillCatalog.find(skill => skill.id === recipe.skillId)?.toolUseRecipes.some(item => item.id === recipe.id)) throw new Error(`Tool-use recipe was not attached to its skill: ${recipe.id}`);
}

const requirementIds = new Set();
for (const requirement of data.personaToolRequirements) {
  if (!requirement.id || requirementIds.has(requirement.id) || !requirement.personaId || !requirement.activity || !requirement.workflow || !requirement.capability || !requirement.preferredTool || !requirement.recipeId || !requirement.recipeTitle || !requirement.mode || !requirement.scope || !requirement.fallback || !requirement.status || !requirement.why) {
    throw new Error(`Invalid or duplicate persona tool requirement: ${requirement.id || '(missing)'}`);
  }
  requirementIds.add(requirement.id);
  if (!personaIds.has(requirement.personaId)) throw new Error(`Persona tool requirement references an unknown persona: ${requirement.id}`);
  const recipe = data.toolUseRecipes.find(item => item.id === requirement.recipeId);
  if (!recipe || !recipe.personaIds.includes(requirement.personaId) || recipe.title !== requirement.recipeTitle) throw new Error(`Persona tool requirement has an invalid recipe relationship: ${requirement.id}`);
}

const handoffIds = new Set();
for (const handoff of data.personaHandoffs) {
  if (!handoff.id || handoffIds.has(handoff.id) || !handoff.fromPersonaId || !handoff.toPersonaId || !handoff.trigger || !handoff.responsibility || !handoff.input || !handoff.output || handoff.required !== true || !handoff.onUnavailable || !handoff.status) {
    throw new Error(`Invalid or duplicate Persona handoff: ${handoff.id || '(missing)'}`);
  }
  handoffIds.add(handoff.id);
  if (!personaIds.has(handoff.fromPersonaId) || !personaIds.has(handoff.toPersonaId)) throw new Error(`Persona handoff references an unknown Persona: ${handoff.id}`);
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

const rebuiltOperatingPackCatalog = sandbox.window.PersonaLibraryModel.buildOperatingPackCatalog(data);
if (JSON.stringify(data.operatingPackCatalog) !== JSON.stringify(rebuiltOperatingPackCatalog)) throw new Error('Operating Pack catalog is not fresh from the canonical source model');
const playbookIds = new Set();
for (const playbook of data.playbookCatalog) {
  if (!playbook.id || playbookIds.has(playbook.id) || !playbook.name || !playbook.status) throw new Error(`Invalid or duplicate Playbook catalog identity: ${playbook.id || '(missing)'}`);
  playbookIds.add(playbook.id);
}
const operatingPackIds = new Set();
const allowedPackSourceKinds = new Set(['repository_local', 'project_local', 'github_repository']);
const isWithinRoot = target => {
  const relative = path.relative(root, target);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};
const resolveLocalPackEntrypoint = sourceRecord => {
  const sourceRoot = path.resolve(root, sourceRecord.path);
  if (!isWithinRoot(sourceRoot)) throw new Error('Operating Pack source path escapes the repository root');
  const entrypoint = path.resolve(sourceRoot, sourceRecord.entrypoint);
  if (!isWithinRoot(entrypoint)) throw new Error('Operating Pack entrypoint escapes the repository root');
  return entrypoint;
};
const assertKnownOperatingPackApplication = (packId, application) => {
  if (!application.known) throw new Error(`${packId} has an unresolved Persona-Skill-workflow relationship`);
};
for (const pack of data.operatingPacks) {
  if (!pack.id || operatingPackIds.has(pack.id)) throw new Error(`Duplicate or missing Operating Pack id: ${pack.id || '(missing)'}`);
  operatingPackIds.add(pack.id);
  for (const field of ['name', 'purpose', 'domain', 'useWhen', 'status', 'source', 'evidence', 'revision']) {
    if (pack[field] === undefined || pack[field] === null || pack[field] === '') throw new Error(`${pack.id} is missing ${field}`);
  }
  if (!Array.isArray(pack.provides) || !pack.provides.length || !Array.isArray(pack.relatedSkills) || !Array.isArray(pack.applications) || !Array.isArray(pack.playbooks)) throw new Error(`${pack.id} has an incomplete relationship or context model`);
  const sourceRecord = pack.source;
  if (!allowedPackSourceKinds.has(sourceRecord.kind) || !Object.prototype.hasOwnProperty.call(sourceRecord, 'path') || !sourceRecord.entrypoint || !sourceRecord.availability || !allowedAvailabilitySources.has(sourceRecord.availability) || !sourceRecord.verification) throw new Error(`${pack.id} has incomplete source/location metadata`);
  if (pack.id === 'operating-pack-design-system' && (sourceRecord.repository !== 'rickvang/operating-packs' || sourceRecord.path !== 'packs/design-system' || sourceRecord.entrypoint !== 'AGENTS.md' || sourceRecord.availability === 'planned' || pack.status === 'Planned external reference')) throw new Error('Design System Operating Pack source migration is stale');
  if (sourceRecord.kind === 'github_repository' && !/^[^/]+\/[^/]+$/.test(sourceRecord.repository || '')) throw new Error(`${pack.id} has an invalid external repository reference`);
  if (sourceRecord.kind !== 'github_repository' && (!sourceRecord.path || !isWithinRoot(path.resolve(root, sourceRecord.path)))) throw new Error(`${pack.id} has an invalid local source path`);
  if (sourceRecord.kind !== 'github_repository') {
    const entrypoint = resolveLocalPackEntrypoint(sourceRecord);
    try {
      await readFile(entrypoint, 'utf8');
    } catch {
      throw new Error(`${pack.id} local entrypoint does not resolve: ${sourceRecord.entrypoint}`);
    }
  }
  if (!/^\d+\.\d+$/.test(pack.revision.version) || !pack.revision.date || !pack.revision.changeType || !pack.revision.summary || !Array.isArray(pack.revision.affectedFields) || !pack.revision.confidence) throw new Error(`${pack.id} has incomplete revision context`);
  for (const skillId of pack.relatedSkills) if (!catalogIds.has(skillId)) throw new Error(`${pack.id} references an unknown Skill: ${skillId}`);
  for (const application of pack.applications) {
    if (!application.personaId || !application.skillId || !application.workflow || !application.reason || !personaIds.has(application.personaId) || !catalogIds.has(application.skillId)) throw new Error(`${pack.id} has an invalid scoped application`);
    if (!(data.flowLibrary[application.personaId] || []).some(flow => flow.title === application.workflow)) throw new Error(`${pack.id} references an unknown workflow: ${application.workflow}`);
  }
  for (const playbookId of pack.playbooks) if (!playbookIds.has(playbookId)) throw new Error(`${pack.id} references an unknown Playbook identity: ${playbookId}`);
  if (pack.id.startsWith('proto-') || pack.relatedSkills.some(id => id.startsWith('proto-')) || pack.playbooks.some(id => id.startsWith('proto-'))) throw new Error(`Prototype identity leaked into live Operating Pack: ${pack.id}`);
}
for (const pack of data.operatingPackCatalog) {
  if (!operatingPackIds.has(pack.id) || !Array.isArray(pack.relatedPersonas) || !Array.isArray(pack.relatedToolRecipes)) throw new Error(`Normalized Operating Pack catalog entry is incomplete: ${pack.id || '(missing)'}`);
  if (pack.relatedSkills.some(skill => !skill.known) || pack.playbooks.some(playbook => !playbook.known)) throw new Error(`Normalized Operating Pack relationship is unresolved: ${pack.id}`);
  for (const application of pack.applications) assertKnownOperatingPackApplication(pack.id, application);
}
const templateIds = new Set();
const allowedTemplateSourceKinds = new Set(['repository_local', 'project_local', 'github_repository']);
const resolveLocalTemplateEntrypoint = sourceRecord => {
  const sourceRoot = path.resolve(root, sourceRecord.path);
  if (!isWithinRoot(sourceRoot)) throw new Error('Template source path escapes the repository root');
  const entrypoint = path.resolve(sourceRoot, sourceRecord.entrypoint);
  const relativeToSourceRoot = path.relative(sourceRoot, entrypoint);
  if (relativeToSourceRoot === '..' || relativeToSourceRoot.startsWith(`..${path.sep}`) || path.isAbsolute(relativeToSourceRoot)) throw new Error('Template entrypoint escapes the declared source directory');
  return entrypoint;
};
const assertKnownTemplateApplication = (templateId, application) => {
  if (!application.known) throw new Error(`${templateId} has an unresolved Persona-Skill-workflow relationship`);
};
for (const template of data.templates) {
  if (!template.id || templateIds.has(template.id)) throw new Error(`Duplicate or missing Template id: ${template.id || '(missing)'}`);
  templateIds.add(template.id);
  for (const field of ['name', 'purpose', 'category', 'useWhen', 'status', 'source', 'evidence', 'revision']) {
    if (template[field] === undefined || template[field] === null || template[field] === '') throw new Error(`${template.id} is missing ${field}`);
  }
  if (!Array.isArray(template.provides) || !template.provides.length || !Array.isArray(template.applications) || !Array.isArray(template.relatedSkills) || !Array.isArray(template.operatingPacks) || !Array.isArray(template.playbooks)) throw new Error(`${template.id} has an incomplete relationship or starting-structure model`);
  const sourceRecord = template.source;
  const plannedExternalWithoutArtifact = sourceRecord.kind === 'github_repository' && sourceRecord.availability === 'planned' && sourceRecord.path == null;
  if (!allowedTemplateSourceKinds.has(sourceRecord.kind) || !Object.prototype.hasOwnProperty.call(sourceRecord, 'path') || (!sourceRecord.entrypoint && !plannedExternalWithoutArtifact) || !sourceRecord.availability || !allowedAvailabilitySources.has(sourceRecord.availability) || !sourceRecord.verification) throw new Error(`${template.id} has incomplete source/location metadata`);
  if (sourceRecord.kind === 'github_repository' && !/^[^/]+\/[^/]+$/.test(sourceRecord.repository || '')) throw new Error(`${template.id} has an invalid external repository reference`);
  if (sourceRecord.kind === 'github_repository' && sourceRecord.availability === 'repo_local') throw new Error(`${template.id} incorrectly claims repo-local availability for an external source`);
  if (plannedExternalWithoutArtifact && sourceRecord.entrypoint != null) throw new Error(`${template.id} planned external artifact entrypoint must remain unknown`);
  if (sourceRecord.kind !== 'github_repository' && (!sourceRecord.path || !isWithinRoot(path.resolve(root, sourceRecord.path)))) throw new Error(`${template.id} has an invalid local source path`);
  if (sourceRecord.kind !== 'github_repository') {
    const entrypoint = resolveLocalTemplateEntrypoint(sourceRecord);
    try {
      await readFile(entrypoint, 'utf8');
    } catch {
      throw new Error(`${template.id} local entrypoint does not resolve: ${sourceRecord.entrypoint}`);
    }
  }
  if (!/^\d+\.\d+$/.test(template.revision.version) || !template.revision.date || !template.revision.changeType || !template.revision.summary || !Array.isArray(template.revision.affectedFields) || !template.revision.confidence) throw new Error(`${template.id} has incomplete revision context`);
  for (const skillId of template.relatedSkills) if (!catalogIds.has(skillId)) throw new Error(`${template.id} references an unknown Skill: ${skillId}`);
  for (const application of template.applications) {
    if (!application.personaId || !application.skillId || !application.workflow || !application.reason || !personaIds.has(application.personaId) || !catalogIds.has(application.skillId)) throw new Error(`${template.id} has an invalid scoped application`);
    if (!(data.flowLibrary[application.personaId] || []).some(flow => flow.title === application.workflow)) throw new Error(`${template.id} references an unknown workflow: ${application.workflow}`);
  }
  for (const operatingPackId of template.operatingPacks) if (!operatingPackIds.has(operatingPackId)) throw new Error(`${template.id} references an unknown Operating Pack identity: ${operatingPackId}`);
  for (const playbookId of template.playbooks) if (!playbookIds.has(playbookId)) throw new Error(`${template.id} references an unknown Playbook identity: ${playbookId}`);
  if (template.id.startsWith('proto-') || template.relatedSkills.some(id => id.startsWith('proto-')) || template.operatingPacks.some(id => id.startsWith('proto-')) || template.playbooks.some(id => id.startsWith('proto-')) || template.applications.some(application => application.personaId.startsWith('proto-') || application.skillId.startsWith('proto-'))) throw new Error(`Prototype identity leaked into live Template: ${template.id}`);
  if (/(?:\bTBD\b|\bTODO\b|REPLACE_ME|\[\[)/i.test(JSON.stringify(template))) throw new Error(`Unresolved canonical placeholder in Template: ${template.id}`);
}
const rebuiltTemplateCatalog = sandbox.window.PersonaLibraryModel.buildTemplateCatalog(data);
if (JSON.stringify(data.templateCatalog) !== JSON.stringify(rebuiltTemplateCatalog)) throw new Error('Template catalog is not fresh from the canonical source model');
for (const template of data.templateCatalog) {
  if (!templateIds.has(template.id) || !Array.isArray(template.relatedPersonas) || !Array.isArray(template.relatedSkills) || !Array.isArray(template.applications) || !Array.isArray(template.operatingPacks) || !Array.isArray(template.playbooks) || !Array.isArray(template.relatedToolRecipes)) throw new Error(`Normalized Template catalog entry is incomplete: ${template.id || '(missing)'}`);
  if (template.relatedSkills.some(skill => !skill.known) || template.operatingPacks.some(pack => !pack.known) || template.playbooks.some(playbook => !playbook.known)) throw new Error(`Normalized Template relationship is unresolved: ${template.id}`);
  for (const application of template.applications) assertKnownTemplateApplication(template.id, application);
}
const negativeTemplatePersona = data.personas.find(persona => persona.id === 'ui-expert') || data.personas[0];
const negativeTemplateWorkflow = (data.flowLibrary[negativeTemplatePersona?.id] || [])[0];
const negativeTemplateSkill = data.skillCatalog.find(skill => skill.profiles?.some(profile => profile.personaId === negativeTemplatePersona?.id) && !skill.workflows?.some(workflow => workflow.personaId === negativeTemplatePersona?.id && workflow.title === negativeTemplateWorkflow?.title));
if (!negativeTemplatePersona || !negativeTemplateWorkflow || !negativeTemplateSkill) throw new Error('Could not construct the invalid Template relationship fixture');
const negativeTemplateCatalog = sandbox.window.PersonaLibraryModel.buildTemplateCatalog({
  templates: [{ id:'negative-template-relationship-fixture', applications:[{ personaId:negativeTemplatePersona.id, skillId:negativeTemplateSkill.id, workflow:negativeTemplateWorkflow.title, reason:'Validator fixture' }] }],
  personas: data.personas,
  skillCatalog: data.skillCatalog,
  flowLibrary: data.flowLibrary,
  operatingPackCatalog: data.operatingPackCatalog,
  playbookCatalog: data.playbookCatalog
});
if (negativeTemplateCatalog[0]?.applications[0]?.known) throw new Error('Invalid Template Persona-Skill-workflow relationship was normalized as known');
let templateRelationshipFixtureRejected = false;
try {
  assertKnownTemplateApplication('negative-template-relationship-fixture', negativeTemplateCatalog[0].applications[0]);
} catch {
  templateRelationshipFixtureRejected = true;
}
if (!templateRelationshipFixtureRejected) throw new Error('Invalid Template Persona-Skill-workflow relationship was not rejected');
let unknownTemplateOperatingPackRejected = false;
try {
  if (!operatingPackIds.has('operating-pack-missing-fixture')) throw new Error('unknown Operating Pack');
} catch {
  unknownTemplateOperatingPackRejected = true;
}
if (!unknownTemplateOperatingPackRejected) throw new Error('Unknown Template Operating Pack reference was not rejected');
let unknownTemplatePlaybookRejected = false;
try {
  if (!playbookIds.has('playbook-missing-fixture')) throw new Error('unknown Playbook');
} catch {
  unknownTemplatePlaybookRejected = true;
}
if (!unknownTemplatePlaybookRejected) throw new Error('Unknown Template Playbook reference was not rejected');
let duplicateTemplateFixtureRejected = false;
try {
  const duplicateFixtureIds = new Set();
  for (const template of [{ id:'duplicate-template-fixture' }, { id:'duplicate-template-fixture' }]) {
    if (duplicateFixtureIds.has(template.id)) throw new Error('duplicate Template');
    duplicateFixtureIds.add(template.id);
  }
} catch {
  duplicateTemplateFixtureRejected = true;
}
if (!duplicateTemplateFixtureRejected) throw new Error('Duplicate Template id was not rejected');
let templateTraversalFixtureRejected = false;
try {
  resolveLocalTemplateEntrypoint({ path: 'docs/template-a', entrypoint: '../other.md' });
} catch {
  templateTraversalFixtureRejected = true;
}
if (!templateTraversalFixtureRejected) throw new Error('Template entrypoint escape from the declared source directory was not rejected');
let templateNestedEntrypointFixtureAccepted = false;
try {
  resolveLocalTemplateEntrypoint({ path: 'docs', entrypoint: 'work-orders/WO-2026-09-11-templates/work-order.md' });
  templateNestedEntrypointFixtureAccepted = true;
} catch {
  templateNestedEntrypointFixtureAccepted = false;
}
if (!templateNestedEntrypointFixtureAccepted) throw new Error('Valid nested Template entrypoint was rejected');
let externalTemplateAvailabilityFixtureRejected = false;
try {
  const externalFixture = { kind:'github_repository', repository:'rickvang/template-library', path:null, entrypoint:'README.md', availability:'repo_local', verification:'Validator fixture' };
  if (externalFixture.kind === 'github_repository' && externalFixture.availability === 'repo_local') throw new Error('external Template claims repo-local availability');
} catch {
  externalTemplateAvailabilityFixtureRejected = true;
}
if (!externalTemplateAvailabilityFixtureRejected) throw new Error('External Template repo-local availability was not rejected');
let prototypeTemplateFixtureRejected = false;
try {
  const prototypeFixture = { id:'template-live-fixture', relatedSkills:['proto-skill-fixture'], operatingPacks:[], playbooks:[], applications:[] };
  if (prototypeFixture.relatedSkills.some(id => id.startsWith('proto-'))) throw new Error('prototype Template relationship');
} catch {
  prototypeTemplateFixtureRejected = true;
}
if (!prototypeTemplateFixtureRejected) throw new Error('Prototype identity entering live Template catalog was not rejected');
const negativeRelationshipPersona = data.personas.find(persona => persona.id === 'ui-expert') || data.personas[0];
const negativeRelationshipWorkflow = (data.flowLibrary[negativeRelationshipPersona?.id] || [])[0];
const negativeRelationshipSkill = data.skillCatalog.find(skill => skill.profiles?.some(profile => profile.personaId === negativeRelationshipPersona?.id) && !skill.workflows?.some(workflow => workflow.personaId === negativeRelationshipPersona?.id && workflow.title === negativeRelationshipWorkflow?.title));
if (!negativeRelationshipPersona || !negativeRelationshipWorkflow || !negativeRelationshipSkill) throw new Error('Could not construct the invalid Operating Pack relationship fixture');
const negativeRelationshipCatalog = sandbox.window.PersonaLibraryModel.buildOperatingPackCatalog({
  operatingPacks: [{
    id: 'negative-relationship-fixture',
    name: 'Negative relationship fixture',
    applications: [{ personaId: negativeRelationshipPersona.id, skillId: negativeRelationshipSkill.id, workflow: negativeRelationshipWorkflow.title, reason: 'Validator fixture' }]
  }],
  personas: data.personas,
  skillCatalog: data.skillCatalog,
  flowLibrary: data.flowLibrary,
  playbookCatalog: data.playbookCatalog
});
if (negativeRelationshipCatalog[0]?.applications[0]?.known) throw new Error('Invalid Operating Pack Persona-Skill-workflow relationship was normalized as known');
let relationshipFixtureRejected = false;
try {
  assertKnownOperatingPackApplication('negative-relationship-fixture', negativeRelationshipCatalog[0].applications[0]);
} catch {
  relationshipFixtureRejected = true;
}
if (!relationshipFixtureRejected) throw new Error('Invalid Operating Pack Persona-Skill-workflow relationship was not rejected');
let traversalFixtureRejected = false;
try {
  resolveLocalPackEntrypoint({ path: '.', entrypoint: '../outside.md' });
} catch {
  traversalFixtureRejected = true;
}
if (!traversalFixtureRejected) throw new Error('Operating Pack entrypoint traversal was not rejected');
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
