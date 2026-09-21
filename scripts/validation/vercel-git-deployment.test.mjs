import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const config = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf8'));

test('Vercel automatic Git deployments are opt-in outside main', () => {
  const deploymentEnabled = config.git?.deploymentEnabled;
  assert.equal(deploymentEnabled?.['**'], false);
  assert.equal(deploymentEnabled?.main, true);
  assert.equal(deploymentEnabled?.['preview-*'], true);
});

test('Vercel no longer relies on an ignored build command for routine branches', () => {
  assert.equal(Object.hasOwn(config, 'ignoreCommand'), false);
});
