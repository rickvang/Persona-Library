import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  ['content/library-data.js', 'dist/data/library-data.js'],
  ['content/library-model.js', 'dist/data/library-model.js'],
  ['content/site-orientation.json', 'dist/data/site-orientation.json'],
  ['client/library-ui.js', 'dist/js/library-ui.js'],
  ['client/library-state.js', 'dist/js/library-state.js']
];

for (const [sourcePath, outputPath] of files) {
  const source = path.join(root, sourcePath);
  const output = path.join(root, outputPath);
  await mkdir(path.dirname(output), { recursive: true });
  await copyFile(source, output);
  console.log(`Copied ${sourcePath} -> ${outputPath}`);
}
