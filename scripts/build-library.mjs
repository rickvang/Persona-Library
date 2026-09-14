import { copyFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const orientation = JSON.parse(await readFile(path.join(root, 'content/site-orientation.json'), 'utf8'));
const routeFiles = Object.values(orientation.spaces)
  .map((space) => space.route_file)
  .filter(Boolean);

const files = [
  ['content/library-data.js', 'dist/data/library-data.js'],
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
