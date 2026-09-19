import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const REQUIRED_SPACES = ['personas', 'skills', 'operating-packs', 'templates', 'tools', 'playbooks', 'docs', 'decisions', 'prototyping'];

const LIBRARY_DATA_SOURCES = [
  'content/library-data/personas-core.js',
  'content/library-data/personas-career.js',
  'content/library-data/personas-systems.js',
  'content/library-data/skills-core.js',
  'content/library-data/skills-specialists.js',
  'content/library-data/workflows-core.js',
  'content/library-data/workflows-operations.js',
  'content/library-data/workflows-career.js',
  'content/library-data/workflows-systems.js',
  'content/library-data/catalogs.js',
  'content/library-data/tool-integration.js',
  'content/library-data/skill-guidance.js',
  'content/library-data/skill-practice.js',
  'content/library-data/skill-anatomy.js',
  'content/library-data.js'
];

const FILES = {
  librarySource: 'content/library-data.js',
  libraryOutput: 'dist/data/library-data.js',
  orientationSource: 'content/site-orientation.json',
  orientationOutput: 'dist/data/site-orientation.json',
  modelSource: 'content/library-model.js',
  modelOutput: 'dist/data/library-model.js',
  templatePreviewSource: 'client/template-preview.js',
  templatePreviewOutput: 'dist/js/template-preview.js',
  page: 'dist/index.html',
  skillsPage: 'dist/skills.html',
  guidePage: 'dist/guide.html',
  jobSearchPage: 'dist/job-search.html',
  jobTrackerSource: 'content/job-tracker-page.html',
  jobTrackerPage: 'dist/job-tracker.html',
  jobTrackerImportSource: 'client/job-tracker-import.js',
  jobTrackerImportOutput: 'dist/js/job-tracker-import.js',
  jobTrackerRuntimeSource: 'client/job-tracker.js',
  jobTrackerRuntimeOutput: 'dist/js/job-tracker.js',
  playbooksPage: 'dist/playbooks.html',
  prototypingPage: 'dist/prototyping.html',
  operatingPacksPage: 'dist/operating-packs.html',
  templatesPage: 'dist/templates.html',
  toolsPage: 'dist/tools.html',
  templateViewerPage: 'dist/template.html',
  decisionTemplateSource: 'content/decisions-page.html',
  decisionOutput: 'dist/decisions.html',
  canvasPage: 'dist/workflow-canvas.html',
  uiSource: 'client/library-ui.js',
  uiOutput: 'dist/js/library-ui.js',
  stateSource: 'client/library-state.js',
  stateOutput: 'dist/js/library-state.js'
};

const CANVAS_MODULES = [
  ['client/canvas-graph.js', 'dist/js/canvas-graph.js'],
  ['client/canvas-intent.js', 'dist/js/canvas-intent.js'],
  ['content/prototypes/workflow-canvas.js', 'dist/data/prototypes/workflow-canvas.js']
];

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const normalizeLineEndings = source => source.replace(/\r\n?/g, '\n');

export async function loadValidationContext(root = defaultRoot) {
  const read = relativePath => readFile(path.join(root, relativePath), 'utf8');
  const entries = Object.entries(FILES);
  const contents = Object.fromEntries(await Promise.all(entries.map(async ([key, relativePath]) => [key, await read(relativePath)])));
  contents.librarySource = `${(
    await Promise.all(LIBRARY_DATA_SOURCES.map(async sourcePath => normalizeLineEndings(await read(sourcePath))))
  ).join('\n\n').replace(/\n+$/, '')}\n`;

  const orientation = JSON.parse(contents.orientationSource);
  const generatedOrientation = JSON.parse(contents.orientationOutput);
  const routeGroups = new Map();
  const routeSources = new Map();

  for (const space of REQUIRED_SPACES) {
    const record = orientation.spaces?.[space];
    if (!record || record.route_file !== `orientation/${space}.json` || !Number.isInteger(record.route_count)) {
      throw new Error(`Orientation bootstrap has an invalid route group declaration: ${space}`);
    }
    const sourcePath = `content/${record.route_file}`;
    const outputPath = `dist/data/${record.route_file}`;
    const [groupSource, groupOutput] = await Promise.all([read(sourcePath), read(outputPath)]);
    routeGroups.set(space, JSON.parse(groupSource));
    routeSources.set(space, { sourcePath, outputPath, source: groupSource, output: groupOutput });
  }

  const sandbox = { window: {} };
  vm.runInNewContext(contents.librarySource, sandbox, { filename: path.join(root, FILES.librarySource) });
  vm.runInNewContext(contents.templatePreviewSource, sandbox, { filename: path.join(root, FILES.templatePreviewSource) });
  vm.runInNewContext(contents.modelSource, sandbox, { filename: path.join(root, FILES.modelSource) });
  const data = sandbox.window.PersonaLibraryData;
  if (!data || !Array.isArray(data.personas) || !data.skillLibrary || !data.flowLibrary || !data.skillGuidance || !data.skillPractice || !Array.isArray(data.skillUnits) || !Array.isArray(data.skillRelations) || !Array.isArray(data.toolUseRecipes) || !Array.isArray(data.personaToolRequirements) || !Array.isArray(data.personaHandoffs) || !Array.isArray(data.skillCatalog) || !Array.isArray(data.playbookCatalog) || !Array.isArray(data.operatingPacks) || !Array.isArray(data.operatingPackCatalog) || !Array.isArray(data.templates) || !Array.isArray(data.templateCatalog) || !data.maintenance || !sandbox.window.PersonaLibraryModel) {
    throw new Error('Content modules must expose personas, skillLibrary, flowLibrary, skillGuidance, skillPractice, skillUnits, skillRelations, toolUseRecipes, personaToolRequirements, personaHandoffs, skillCatalog, playbookCatalog, operatingPacks, operatingPackCatalog, templates, templateCatalog, maintenance, and PersonaLibraryModel');
  }

  return {
    root,
    readFile: relativePath => readFile(path.join(root, relativePath), 'utf8'),
    data,
    model: sandbox.window.PersonaLibraryModel,
    templatePreviewConfig: sandbox.window.PersonaLibraryTemplatePreviewConfig,
    orientation,
    generatedOrientation,
    routeGroups,
    routeSources,
    requiredSpaces: REQUIRED_SPACES,
    canvasModules: CANVAS_MODULES,
    libraryDataSources: LIBRARY_DATA_SOURCES,
    files: contents
  };
}

export function buildValidationIndexes(data) {
  const personaIds = new Set(data.personas.map(persona => persona.id));
  const catalogIds = new Set(data.skillCatalog.map(skill => skill.id));
  const skillUnitIds = new Set(data.skillUnits.map(unit => unit.id));
  const playbookIds = new Set();
  for (const playbook of data.playbookCatalog) {
    if (!playbook.id || playbookIds.has(playbook.id) || !playbook.name || !playbook.status) throw new Error(`Invalid or duplicate Playbook catalog identity: ${playbook.id || '(missing)'}`);
    playbookIds.add(playbook.id);
  }
  return {
    personaIds,
    catalogIds,
    skillUnitIds,
    entityIds: new Set([...catalogIds, ...skillUnitIds]),
    playbookIds,
    operatingPackIds: new Set(data.operatingPacks.map(pack => pack.id)),
    templateIds: new Set(data.templates.map(template => template.id))
  };
}
