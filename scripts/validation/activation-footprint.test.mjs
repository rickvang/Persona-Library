import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('activation stack delegates policy and avoids root/bootstrap rereads', () => {
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  const orientation = JSON.parse(readFileSync(path.join(root, 'content/site-orientation.json'), 'utf8'));
  const routeFiles = Object.values(orientation.spaces).map(space => space.route_file);
  assert.match(agents, /docs\/policy-ownership\.md/);
  assert.match(agents, /default mode as read-only/);
  assert.equal(Object.hasOwn(orientation, 'default_process'), false);
  assert.equal(Object.hasOwn(orientation, 'mutation_policy'), false);
  assert.equal(Object.hasOwn(orientation, 'response_contract'), false);
  assert.equal(Object.hasOwn(orientation, 'activation'), false);
  assert.equal(orientation.contract_refs.policy_owners, 'docs/policy-ownership.md');
  assert.equal(orientation.contract_refs.work_recovery, 'docs/work-orders.md');
  assert.equal(orientation.contract_refs.validation, '.github/workflows/repository-validation.yml');

  for (const routeFile of routeFiles) {
    const group = JSON.parse(readFileSync(path.join(root, 'content', routeFile), 'utf8'));
    for (const route of group.routes) {
      assert.equal(route.first_reads.includes('AGENTS.md'), false, `${route.id} rereads AGENTS.md`);
      assert.equal(route.first_reads.includes('content/site-orientation.json'), false, `${route.id} rereads the bootstrap`);
    }
  }
});
