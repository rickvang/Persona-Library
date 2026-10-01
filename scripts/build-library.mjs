import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDecisionsPage } from './build-decisions.mjs';
import { buildPersonaSkillSystemMap } from './build-persona-skill-system-map.mjs';
import { buildTechnicalSystemMaps } from './build-technical-system-maps.mjs';
import { buildAgentContextBundles } from './build-agent-context-bundles.mjs';
import { buildToolsPage } from './build-tools-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const orientation = JSON.parse(await readFile(path.join(root, 'content/site-orientation.json'), 'utf8'));
const routeFiles = Object.values(orientation.spaces)
  .map((space) => space.route_file)
  .filter(Boolean);

const operationalScenarioIndexPath = 'content/library-data/operational-scenarios/index.json';
const operationalScenarioIndex = JSON.parse(await readFile(path.join(root, operationalScenarioIndexPath), 'utf8'));
if (!Array.isArray(operationalScenarioIndex.scenarios)) throw new Error('Operational Scenario index must expose a scenarios array');
const operationalScenarioSources = operationalScenarioIndex.scenarios.map(entry => {
  if (!entry?.id || !/^content\/library-data\/operational-scenarios\/[a-z0-9-]+\.js$/.test(entry.path || '')) {
    throw new Error(`Operational Scenario index has an invalid entry: ${entry?.id || '(missing)'}`);
  }
  return entry.path;
});
if (new Set(operationalScenarioSources).size !== operationalScenarioSources.length) throw new Error('Operational Scenario index paths must be unique');

const libraryDataSources = [
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
  ...operationalScenarioSources,
  'content/library-data.js'
];

await rm(path.join(root, 'dist'), { recursive: true, force: true });
console.log('Cleared dist/ before rebuilding generated Site output');

const libraryDataOutput = path.join(root, 'dist/data/library-data.js');
await mkdir(path.dirname(libraryDataOutput), { recursive: true });
const libraryDataBundle = (
  await Promise.all(libraryDataSources.map(async sourcePath => {
    const source = await readFile(path.join(root, sourcePath), 'utf8');
    return source.replace(/\r\n?/g, '\n');
  }))
).join('\n\n');
await writeFile(libraryDataOutput, `${libraryDataBundle.replace(/\n+$/, '')}\n`, 'utf8');
console.log(`Built ${libraryDataSources.length} authored library data sources -> dist/data/library-data.js`);

const authoredSitePages = [
  "activity-views.html",
  "guide.html",
  "index.html",
  "job-search.html",
  "operating-packs.html",
  "playbooks.html",
  "portfolio-layout-lab.html",
  "prototyping.html",
  "skill-views.html",
  "skills.html",
  "system-map.html",
  "system-map-advanced.html",
  "template.html",
  "templates.html",
  "tool-views.html",
  "tool.html",
  "tools.html",
  "workflow-canvas.html"
];

const publishedSiteDocs = [
  ['docs/job-search/application-context-and-review.md', 'dist/docs/application-context-and-review.md'],
  ['docs/job-search/application-tracker-contract.md', 'dist/docs/application-tracker-contract.md'],
  ['docs/job-search/job-ledger-contract.md', 'dist/docs/job-ledger-contract.md']
];

const files = [
  ['content/library-model.js', 'dist/data/library-model.js'],
  ['content/site-orientation.json', 'dist/data/site-orientation.json'],
  ['client/library-ui.js', 'dist/js/library-ui.js'],
  ['client/library-state.js', 'dist/js/library-state.js'],
  ['client/tool-catalog.mjs', 'dist/js/tool-catalog.mjs'],
  ['client/tool-page.mjs', 'dist/js/tool-page.mjs'],
  ['client/tool-pages.css', 'dist/css/tool-pages.css'],
  ['client/job-tracker-config.js', 'dist/js/job-tracker-config.js'],
  ['client/job-tracker-import.js', 'dist/js/job-tracker-import.js'],
  ['client/job-tracker-store.js', 'dist/js/job-tracker-store.js'],
  ['client/seen-job-store.js', 'dist/js/seen-job-store.js'],
  ['client/job-tracker.js', 'dist/js/job-tracker.js'],
  ['client/template-preview.js', 'dist/js/template-preview.js'],
  ['client/canvas-graph.js', 'dist/js/canvas-graph.js'],
  ['client/canvas-intent.js', 'dist/js/canvas-intent.js'],
  ['client/system-map-graph.mjs', 'dist/js/system-map-graph.mjs'],
  ['client/system-map-renderer.mjs', 'dist/js/system-map-renderer.mjs'],
  ['client/system-map.mjs', 'dist/js/system-map.mjs'],
  ['client/system-map-journey.mjs', 'dist/js/system-map-journey.mjs'],
  ['client/system-map-workflows.mjs', 'dist/js/system-map-workflows.mjs'],
  ['client/system-map-simple.mjs', 'dist/js/system-map-simple.mjs'],
  ['content/prototypes/workflow-canvas.js', 'dist/data/prototypes/workflow-canvas.js'],
  ['content/job-tracker-page.html', 'dist/job-tracker.html'],
  ...authoredSitePages.map((name) => [`content/site-pages/${name}`, `dist/${name}`]),
  ...publishedSiteDocs,
  ...routeFiles.map((routeFile) => [`content/${routeFile}`, `dist/data/${routeFile}`])
];

for (const [sourcePath, outputPath] of files) {
  const source = path.join(root, sourcePath);
  const output = path.join(root, outputPath);
  await mkdir(path.dirname(output), { recursive: true });
  await copyFile(source, output);
  console.log(`Copied ${sourcePath} -> ${outputPath}`);
}

const trackerSupabaseUrl = String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const trackerSupabasePublishableKey = String(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim();
if (Boolean(trackerSupabaseUrl) !== Boolean(trackerSupabasePublishableKey)) {
  throw new Error('Applications Supabase config requires a matching URL + publishable-key pair (SUPABASE_* or NEXT_PUBLIC_SUPABASE_*)');
}
const trackerRuntimeConfig = {
  mode: trackerSupabaseUrl && trackerSupabasePublishableKey ? 'supabase' : 'local',
  supabaseUrl: trackerSupabaseUrl,
  publishableKey: trackerSupabasePublishableKey,
  schema: String(process.env.SUPABASE_SCHEMA || 'app').trim() || 'app'
};
await writeFile(
  path.join(root, 'dist/js/job-tracker-config.js'),
  `globalThis.PersonaLibraryJobTrackerConfig = Object.freeze(${JSON.stringify(trackerRuntimeConfig)});\n`,
  'utf8'
);
console.log(`Built Applications storage config -> ${trackerRuntimeConfig.mode} mode`);

await buildDecisionsPage(root);
await buildToolsPage(root);

const primarySitePages = [
  'dist/index.html',
  'dist/skills.html',
  'dist/operating-packs.html',
  'dist/templates.html',
  'dist/tools.html',
  'dist/playbooks.html',
  'dist/job-search.html',
  'dist/job-tracker.html',
  'dist/guide.html',
  'dist/system-map.html',
  'dist/decisions.html',
  'dist/prototyping.html'
];

for (const relativePath of primarySitePages) {
  const filePath = path.join(root, relativePath);
  let html = await readFile(filePath, 'utf8');
  const nav = html.match(/(<nav\b[^>]*aria-label="Primary"[^>]*>)([\s\S]*?)(<\/nav>)/);
  if (!nav) throw new Error('Could not find primary navigation in ' + relativePath);

  let links = nav[2];

  let systemMapLink = links.match(/<a href="system-map\.html"[^>]*>System Map<\/a>/)?.[0];
  if (!systemMapLink) {
    const withSystemMap = links.replace(
      /(<a href="guide\.html"[^>]*>Docs<\/a>)/,
      '$1<a href="system-map.html">System Map</a>'
    );
    if (withSystemMap === links) throw new Error('Could not add System Map navigation to ' + relativePath);
    links = withSystemMap;
    systemMapLink = links.match(/<a href="system-map\.html"[^>]*>System Map<\/a>/)?.[0];
  }

  links = links.replace(systemMapLink, '');
  const divider = /<span aria-hidden="true"[^>]*><\/span>/;
  if (!divider.test(links)) throw new Error('Could not find navigation divider in ' + relativePath);
  links = links.replace(divider, systemMapLink + '$&');

  let applicationLink = links.match(/<a href="job-tracker\.html"[^>]*>Applications<\/a>/)?.[0];
  if (!applicationLink) {
    const withApplication = links.replace(
      /(<a href="playbooks\.html"[^>]*>Playbooks<\/a>)/,
      '$1<a href="job-tracker.html">Applications</a>'
    );
    if (withApplication === links) throw new Error('Could not add Applications navigation to ' + relativePath);
    links = withApplication;
    applicationLink = links.match(/<a href="job-tracker\.html"[^>]*>Applications<\/a>/)?.[0];
  }

  links = links.replace(applicationLink, '');
  links = links.replace(divider, '$&' + applicationLink);

  const updated = html.replace(nav[0], nav[1] + links + nav[3]);
  if (updated === html) {
    console.log('Primary navigation already normalized -> ' + relativePath);
    continue;
  }
  await writeFile(filePath, updated, 'utf8');
  console.log('Normalized primary navigation -> ' + relativePath);
}

const personaSkillGraph = await buildPersonaSkillSystemMap(root);
console.log('Built Persona / Skill System Map -> ' + personaSkillGraph.nodes.length + ' nodes / ' + personaSkillGraph.edges.length + ' edges');

const technicalMaps = await buildTechnicalSystemMaps(root);
console.log('Built Source/generated System Map -> ' + technicalMaps.sourceGraph.nodes.length + ' nodes / ' + technicalMaps.sourceGraph.edges.length + ' edges');
console.log('Built Agent/runtime System Map -> ' + technicalMaps.runtimeGraph.nodes.length + ' nodes / ' + technicalMaps.runtimeGraph.edges.length + ' edges');

const agentContextBundles = await buildAgentContextBundles(root);
console.log('Built graph-backed agent context bundles -> ' + agentContextBundles.size + ' route(s)');
