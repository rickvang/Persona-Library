import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldIgnoreVercelBuild } from '../vercel-ignore-build.mjs';

test('Vercel production branch always builds', () => {
  assert.equal(shouldIgnoreVercelBuild({ commitRef: 'main', commitMessage: 'Merge pull request #1' }), false);
});

test('feature branch builds for an explicit meaningful preview checkpoint', () => {
  assert.equal(shouldIgnoreVercelBuild({ commitRef: 'feat/example', commitMessage: 'Show first usable state [vercel-preview]' }), false);
});

test('ordinary feature branch commit is ignored by Vercel', () => {
  assert.equal(shouldIgnoreVercelBuild({ commitRef: 'feat/example', commitMessage: 'Refactor internal helper' }), true);
});

test('missing Git metadata fails open and allows the build', () => {
  assert.equal(shouldIgnoreVercelBuild({ commitRef: '', commitMessage: '' }), false);
});
