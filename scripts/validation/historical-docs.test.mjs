import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('completed rebuild planning stays off the current documentation path', () => {
  const history = path.join(root, 'docs/internal/skill-rebuild/HISTORY.md');
  const plans = path.join(root, 'docs/internal/skill-rebuild/plans');
  const testsDir = path.join(root, 'docs/internal/skill-rebuild/tests');
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');

  assert.equal(existsSync(history), true);
  assert.equal(existsSync(plans), false);
  assert.equal(existsSync(testsDir), true);
  assert.ok(readdirSync(testsDir).some(name => name.endsWith('.golden.md')));
  assert.match(readme, /concise reconstruction history plus preserved golden\/comparison evidence/);
  assert.equal(existsSync(path.join(root, 'docs/cold-start-footprint.md')), false);
  assert.equal(existsSync(path.join(root, 'docs/work-orders/lifecycle-cleanup-2026-09-27.md')), false);
});
