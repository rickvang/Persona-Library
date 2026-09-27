import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { assertGeneratedOutputClean } from '../check-generated-output.mjs';

const execFileAsync = promisify(execFile);

async function git(root, args) {
  return execFileAsync('git', args, { cwd: root, encoding: 'utf8' });
}

async function withRepo(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'generated-output-cleanliness-'));
  try {
    await git(root, ['init']);
    await git(root, ['config', 'user.name', 'Repository Validation']);
    await git(root, ['config', 'user.email', 'validation@example.invalid']);
    await mkdir(path.join(root, 'dist'), { recursive: true });
    await writeFile(path.join(root, 'dist', 'tracked.txt'), 'committed\n');
    await git(root, ['add', 'dist/tracked.txt']);
    await git(root, ['commit', '-m', 'fixture']);
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('generated-output cleanliness accepts a clean dist tree', async () => {
  await withRepo(async (root) => {
    await assertGeneratedOutputClean(root);
  });
});

test('generated-output cleanliness rejects tracked modifications', async () => {
  await withRepo(async (root) => {
    await writeFile(path.join(root, 'dist', 'tracked.txt'), 'changed\n');
    await assert.rejects(() => assertGeneratedOutputClean(root), /tracked\.txt/);
  });
});

test('generated-output cleanliness rejects untracked output', async () => {
  await withRepo(async (root) => {
    await writeFile(path.join(root, 'dist', 'untracked.txt'), 'new\n');
    await assert.rejects(() => assertGeneratedOutputClean(root), /untracked\.txt/);
  });
});
