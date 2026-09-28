import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { buildSystemOrientationBehaviorReport, expectedSystemOrientationBehaviorOutputs } from '../../eval/system-orientation-behavior.mjs';

const REQUIRED_FIXTURES = [
  'basic-system-explanation',
  'clear-template-placement',
  'ambiguous-template-playbook-placement',
  'unrelated-repository-plumbing',
  'unrelated-general-writing',
  'unavailable-downstream-capability',
  'update-persona-intent',
  'live-tool-availability'
];

test('system-orientation preferred and fallback paths preserve required behavioral outcomes', async () => {
  const report = await buildSystemOrientationBehaviorReport();
  assert.equal(report.canonical_routing_changed, false);
  assert.deepEqual(report.fixtures.map(item => item.id), REQUIRED_FIXTURES);
  assert.equal(report.aggregate.fixture_count, 8);
  assert.equal(report.aggregate.activated_fixture_count, 6);
  assert.equal(report.aggregate.failed, 0);
  assert.equal(report.aggregate.all_pass, true);

  for (const item of report.fixtures) {
    assert.equal(item.control.pass, true, item.id + ' canonical fallback failed');
    assert.equal(item.preferred.pass, true, item.id + ' preferred path failed');
    assert.equal(item.parity.pass, true, item.id + ' preferred/fallback parity failed');
    assert.equal(item.pass, true, item.id + ' fixture failed');
  }
});

test('behavioral fixtures enforce routing, placement, mutation, unavailable-capability, and live-runtime boundaries', async () => {
  const report = await buildSystemOrientationBehaviorReport();
  const byId = Object.fromEntries(report.fixtures.map(item => [item.id, item.preferred]));

  assert.equal(byId['basic-system-explanation'].primary_space, 'docs');
  assert.equal(byId['clear-template-placement'].primary_space, 'templates');
  assert.equal(byId['clear-template-placement'].placement, 'direct');

  assert.equal(byId['ambiguous-template-playbook-placement'].placement, 'escalate-mara');
  assert.equal(byId['ambiguous-template-playbook-placement'].handoff_target, 'mara-placement-review');

  assert.equal(byId['unrelated-repository-plumbing'].activate, false);
  assert.equal(byId['unrelated-repository-plumbing'].handoff_target, 'repository-plumbing');
  assert.equal(byId['unrelated-general-writing'].activate, false);

  assert.equal(byId['unavailable-downstream-capability'].limitation_required, true);
  assert.equal(byId['unavailable-downstream-capability'].downstream_execution_claim, false);
  assert.equal(byId['unavailable-downstream-capability'].live_evidence_required, true);

  assert.equal(byId['update-persona-intent'].mode, 'update');
  assert.equal(byId['update-persona-intent'].orientation_write_authorized, false);
  assert.equal(byId['update-persona-intent'].downstream_authorization_required, true);

  assert.equal(byId['live-tool-availability'].primary_space, 'tools');
  assert.equal(byId['live-tool-availability'].live_evidence_required, true);
  assert.equal(byId['live-tool-availability'].static_runtime_availability_claim, false);
});

test('activated fixtures keep graph-backed context smaller than canonical fallback', async () => {
  const report = await buildSystemOrientationBehaviorReport();
  const activated = report.fixtures.filter(item => item.preferred.activate);

  for (const item of activated) {
    assert.ok(
      item.preferred.context.utf8_bytes < item.control.context.utf8_bytes,
      item.id + ' preferred context is not smaller'
    );
  }

  assert.ok(report.aggregate.preferred_context_utf8_bytes < report.aggregate.control_context_utf8_bytes);
  assert.ok(report.aggregate.preferred_delta_percent < 0);
});

test('behavioral report is committed and fresh', async () => {
  const outputs = await expectedSystemOrientationBehaviorOutputs();
  assert.deepEqual([...outputs.keys()], [
    'eval/results/system-orientation-behavior.json',
    'eval/system-orientation-behavior.md'
  ]);

  for (const [relativePath, expected] of outputs) {
    assert.equal(
      await fs.readFile(new URL('../../' + relativePath, import.meta.url), 'utf8'),
      expected,
      relativePath + ' is stale'
    );
  }
});
