import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDecisionsPage } from './build-decisions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const orientation = JSON.parse(await readFile(path.join(root, 'content/site-orientation.json'), 'utf8'));
const routeFiles = Object.values(orientation.spaces)
  .map((space) => space.route_file)
  .filter(Boolean);

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
  'content/library-data/operational-knowledge.js',
  'content/library-data.js'
];

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

const files = [
  ['content/library-model.js', 'dist/data/library-model.js'],
  ['content/site-orientation.json', 'dist/data/site-orientation.json'],
  ['client/library-ui.js', 'dist/js/library-ui.js'],
  ['client/library-state.js', 'dist/js/library-state.js'],
  ['client/job-tracker-config.js', 'dist/js/job-tracker-config.js'],
  ['client/job-tracker-import.js', 'dist/js/job-tracker-import.js'],
  ['client/job-tracker-store.js', 'dist/js/job-tracker-store.js'],
  ['client/seen-job-store.js', 'dist/js/seen-job-store.js'],
  ['client/job-tracker.js', 'dist/js/job-tracker.js'],
  ['client/template-preview.js', 'dist/js/template-preview.js'],
  ['client/canvas-graph.js', 'dist/js/canvas-graph.js'],
  ['client/canvas-intent.js', 'dist/js/canvas-intent.js'],
  ['content/prototypes/workflow-canvas.js', 'dist/data/prototypes/workflow-canvas.js'],
  ['content/job-tracker-page.html', 'dist/job-tracker.html'],
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
  'dist/decisions.html',
  'dist/prototyping.html'
];

for (const relativePath of primarySitePages) {
  const filePath = path.join(root, relativePath);
  let html = await readFile(filePath, 'utf8');
  if (html.includes('href="job-tracker.html"')) continue;
  const updated = html.replace(
    /(<a href="playbooks\.html"[^>]*>Playbooks<\/a>)/,
    '$1<a href="job-tracker.html">Applications</a>'
  );
  if (updated === html) throw new Error(`Could not add Applications navigation to ${relativePath}`);
  await writeFile(filePath, updated, 'utf8');
  console.log(`Added Applications navigation -> ${relativePath}`);
}
