import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  'content/library-data.js'
];

const libraryDataOutput = path.join(root, 'dist/data/library-data.js');
await mkdir(path.dirname(libraryDataOutput), { recursive: true });
const libraryDataBundle = (
  await Promise.all(libraryDataSources.map(sourcePath => readFile(path.join(root, sourcePath), 'utf8')))
).join('\n\n');
await writeFile(libraryDataOutput, `${libraryDataBundle}\n`, 'utf8');
console.log(`Built ${libraryDataSources.length} authored library data sources -> dist/data/library-data.js`);

const files = [
  ['content/library-model.js', 'dist/data/library-model.js'],
  ['content/site-orientation.json', 'dist/data/site-orientation.json'],
  ['client/library-ui.js', 'dist/js/library-ui.js'],
  ['client/library-state.js', 'dist/js/library-state.js'],
  ['client/template-preview.js', 'dist/js/template-preview.js'],
  ['client/canvas-graph.js', 'dist/js/canvas-graph.js'],
  ['client/canvas-intent.js', 'dist/js/canvas-intent.js'],
  ['content/prototypes/workflow-canvas.js', 'dist/data/prototypes/workflow-canvas.js'],
  ...routeFiles.map((routeFile) => [`content/${routeFile}`, `dist/data/${routeFile}`])
];

for (const [sourcePath, outputPath] of files) {
  const source = path.join(root, sourcePath);
  const output = path.join(root, outputPath);
  await mkdir(path.dirname(output), { recursive: true });
  await copyFile(source, output);
  console.log(`Copied ${sourcePath} -> ${outputPath}`);
}
