import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const workOrdersRoot = path.join(root, 'docs', 'work-orders');
const valid = new Set(['draft', 'active', 'blocked', 'ready-for-review', 'complete', 'no-go', 'cancelled']);
const terminal = new Set(['complete', 'no-go', 'cancelled']);
const activeStates = new Set(['draft', 'active', 'blocked', 'ready-for-review']);

function statusOf(file) {
  const source = readFileSync(file, 'utf8');
  const match = source.match(/^\s*-\s*(?:\*\*)?Status(?:\*\*)?:\s*`?([^`\n]+?)`?\s*$/im);
  return match?.[1]?.trim().toLowerCase() || null;
}

test('Work Order lifecycle stays valid across active and archived namespaces', () => {
  const entries = readdirSync(workOrdersRoot, { withFileTypes: true });
  const activePackages = entries.filter(entry => entry.isDirectory() && entry.name !== 'archive');

  for (const entry of activePackages) {
    const file = path.join(workOrdersRoot, entry.name, 'work-order.md');
    const status = statusOf(file);
    assert.ok(status, `${entry.name} is missing Status`);
    assert.ok(valid.has(status), `${entry.name} has invalid Status: ${status}`);
    assert.ok(!terminal.has(status), `${entry.name} is terminal but remains in the active namespace`);
  }

  const archiveRoot = path.join(workOrdersRoot, 'archive');
  for (const month of readdirSync(archiveRoot, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    const monthRoot = path.join(archiveRoot, month.name);
    for (const entry of readdirSync(monthRoot, { withFileTypes: true }).filter(item => item.isDirectory())) {
      const file = path.join(monthRoot, entry.name, 'work-order.md');
      const status = statusOf(file);
      assert.ok(status, `${month.name}/${entry.name} is missing Status`);
      assert.ok(valid.has(status), `${month.name}/${entry.name} has invalid Status: ${status}`);
      assert.ok(!activeStates.has(status), `${month.name}/${entry.name} is archived but claims active lifecycle state: ${status}`);
    }
  }
});
