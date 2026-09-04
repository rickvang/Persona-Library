import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'content', 'library-data.js');
const outputDir = path.join(root, 'dist', 'data');
const output = path.join(outputDir, 'library-data.js');

await mkdir(outputDir, { recursive: true });
await copyFile(source, output);
console.log(`Copied ${path.relative(root, source)} -> ${path.relative(root, output)}`);
