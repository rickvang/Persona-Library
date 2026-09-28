import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  buildToolResolutionBehaviorReport,
  expectedToolResolutionBehaviorOutputs
} from '../../eval/tool-resolution-behavior.mjs';
import {
  buildToolResolutionMigrationReport,
  expectedToolResolutionMigrationOutputs
} from '../../eval/tool-resolution-migration.mjs';

const REQUIRED_FIXTURES = [
  'figma-live-unverified',
  'figma-live-available-readonly',
  'side-effect-approval-missing',
  'scope-insufficient-verified-alternate',
  'no-tool-needed-fallback',
  'unavailable-primary-alternate-tool',
  'workspace-target-ambiguous',
  'operational-scenario-readonly',
  'authorized-side-effect-success',
  'tool-catalog-edit-non-trigger',
  'durable-shared-guidance-change',
  'permission-unverified-blocked'
];

test('Tool resolution migration remains smaller and keeps live state external', async () => {
  const report = await buildToolResolutionMigrationReport();
  assert.equal(report.canonical_route_records_changed, false);
  assert.equal(report.bundle.route_id, 'tool-resolution');
  assert.equal(report.bundle.primary_space, 'tools');
  assert.equal(report.bundle.space_entries, 1);
  assert.equal(report.bundle.graph_nodes, 10);
  assert.equal(report.bundle.graph_edges, 8);
  assert.equal(report.bundle.live_state_embedded, false);
  assert.equal(report.bundle.mutation_boundary, 'external_execution');
  assert.equal(report.bundle.change_mode, 'external_execution');
  assert.equal(report.bundle.reconciliation, 'change-impact-reconciliation');
  assert.ok(report.preferred_path.utf8_bytes < report.canonical_fallback.utf8_bytes);
  assert.ok(report.deltas.preferred_vs_current_fallback.percent < 0);
});

test('Tool resolution preferred and fallback paths preserve required live-state behavior', async () => {
  const report = await buildToolResolutionBehaviorReport();
  assert.equal(report.canonical_routing_changed, false);
  assert.deepEqual(report.fixtures.map(item => item.id), REQUIRED_FIXTURES);
  assert.equal(report.aggregate.fixture_count, 12);
  assert.equal(report.aggregate.activated_fixture_count, 11);
  assert.equal(report.aggregate.failed, 0);
  assert.equal(report.aggregate.all_pass, true);
  assert.equal(report.live_state_externality.proven, true);

  for (const item of report.fixtures) {
    assert.equal(item.control.pass, true, item.id + ' canonical fallback failed');
    assert.equal(item.preferred.pass, true, item.id + ' preferred path failed');
    assert.equal(item.parity.pass, true, item.id + ' preferred/fallback parity failed');
    assert.equal(item.pass, true, item.id + ' fixture failed');
  }
});

test('Tool fixtures preserve permission, target, fallback, scenario, and reconciliation boundaries', async () => {
  const report = await buildToolResolutionBehaviorReport();
  const byId = Object.fromEntries(report.fixtures.map(item => [item.id, item.preferred]));

  assert.equal(byId['figma-live-unverified'].availability_state, 'Referenced but unavailable');
  assert.equal(byId['figma-live-unverified'].execution_allowed, false);
  assert.equal(byId['figma-live-available-readonly'].availability_state, 'Available');
  assert.equal(byId['figma-live-available-readonly'].execution_allowed, true);

  assert.equal(byId['side-effect-approval-missing'].availability_state, 'Blocked or insufficiently verified');
  assert.equal(byId['side-effect-approval-missing'].execution_allowed, false);

  assert.equal(byId['scope-insufficient-verified-alternate'].fallback_selection, 'verified-alternate');
  assert.equal(byId['scope-insufficient-verified-alternate'].selected_candidate, 'verified-alternate');

  assert.equal(byId['no-tool-needed-fallback'].availability_state, 'No Tool needed');
  assert.equal(byId['no-tool-needed-fallback'].fallback_selection, 'no-tool-safe');

  assert.equal(byId['workspace-target-ambiguous'].target_posture, 'ambiguous');
  assert.equal(byId['workspace-target-ambiguous'].execution_allowed, false);

  assert.equal(byId['operational-scenario-readonly'].scenario_loaded, true);
  assert.equal(byId['operational-scenario-readonly'].probe_mode, 'smallest-read-only-probe');

  assert.equal(byId['authorized-side-effect-success'].probe_mode, 'authorized-side-effect');
  assert.equal(byId['authorized-side-effect-success'].result_posture, 'verified');

  assert.equal(byId['tool-catalog-edit-non-trigger'].activate_resolution, false);
  assert.equal(byId['tool-catalog-edit-non-trigger'].selected_route, 'tool-record-maintenance');

  assert.equal(byId['durable-shared-guidance-change'].reconciliation_handoff, 'change-impact-reconciliation');
  assert.equal(byId['permission-unverified-blocked'].permission_posture, 'unverified');
  assert.equal(byId['permission-unverified-blocked'].execution_allowed, false);
});

test('same Tool prompt can change availability without changing static migrated context', async () => {
  const report = await buildToolResolutionBehaviorReport();
  const pair = report.fixtures.filter(item => item.pair === 'figma-live-flip');
  assert.equal(pair.length, 2);
  assert.equal(pair[0].prompt, pair[1].prompt);
  assert.equal(pair[0].preferred.context.utf8_bytes, pair[1].preferred.context.utf8_bytes);
  assert.notEqual(pair[0].preferred.availability_state, pair[1].preferred.availability_state);
  assert.equal(report.live_state_externality.same_prompt, true);
  assert.equal(report.live_state_externality.same_static_context, true);
  assert.equal(report.live_state_externality.different_availability_outcome, true);
});

test('direct Tool-resolution fixtures keep preferred context smaller than fallback', async () => {
  const report = await buildToolResolutionBehaviorReport();
  const activated = report.fixtures.filter(item => item.preferred.activate_resolution);
  for (const item of activated) {
    assert.ok(item.preferred.context.utf8_bytes < item.control.context.utf8_bytes, item.id + ' preferred context is not smaller');
  }
  assert.ok(report.aggregate.preferred_context_utf8_bytes < report.aggregate.control_context_utf8_bytes);
  assert.ok(report.aggregate.preferred_delta_percent < 0);
});

test('Tool resolution migration and behavior reports are committed and fresh', async () => {
  const outputMaps = await Promise.all([
    expectedToolResolutionMigrationOutputs(),
    expectedToolResolutionBehaviorOutputs()
  ]);
  const expectedPaths = [
    'eval/results/tool-resolution-migration.json',
    'eval/tool-resolution-migration.md',
    'eval/results/tool-resolution-behavior.json',
    'eval/tool-resolution-behavior.md'
  ];
  assert.deepEqual(outputMaps.flatMap(map => [...map.keys()]), expectedPaths);

  for (const outputs of outputMaps) {
    for (const [relativePath, expected] of outputs) {
      assert.equal(
        await fs.readFile(new URL('../../' + relativePath, import.meta.url), 'utf8'),
        expected,
        relativePath + ' is stale'
      );
    }
  }
});
