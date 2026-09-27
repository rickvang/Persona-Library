#!/usr/bin/env node
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

export async function assertGeneratedOutputClean(root) {
  const { stdout } = await execFileAsync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all', '--', 'dist'],
    { cwd: root, encoding: 'utf8' }
  );
  const dirty = stdout.trim();
  if (dirty) {
    throw new Error(
      `Generated output is not fully committed. Run the build and reconcile every dist/ change, including untracked files:\n${dirty}`
    );
  }
}

const isEntrypoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  await assertGeneratedOutputClean(process.cwd());
  console.log('Generated output is fully committed.');
}
