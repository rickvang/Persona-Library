import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  buildSkillPackageMaintenanceBehaviorReport,
  expectedSkillPackageMaintenanceBehaviorOutputs
} from '../../eval/skill-package-maintenance-behavior.mjs';
import {
  buildSkillPackageMaintenanceMigrationReport,
  expectedSkillPackageMaintenanceMigrationOutputs
} from '../../eval/skill-package-maintenance-migration.mjs';

const REQUIRED_FIXTURES = [
  'authorized-update-existing-package',
  'approved-plan-readonly',
  'new-package-placement-ambiguous',
  'one-off-document-non-trigger',
  'persona-application-non-trigger',
  'missing-mutation-authorization',
  'runtime-availability-unverified',
  'generated-output-direct-edit-blocked',
  'documented-package-not-availability'
];

test('Skill package migration clears the fourth-route context/read/artifact exit gate', async () => {
  const report = await buildSkillPackageMaintenanceMigrationReport();
  assert.equal(report.canonical_route_records_changed, true);
  assert.equal(report.bundle.route_id, 'skill-package-maintenance');
  assert.equal(report.bundle.primary_space, 'skills');
  assert.equal(report.bundle.space_entries, 1);
  assert.equal(report.bundle.graph_nodes, 13);
  assert.equal(report.bundle.graph_edges, 12);
  assert.equal(report.bundle.live_state_embedded, false);
  assert.equal(report.bundle.mutation_boundary, 'authorized_update');
  assert.equal(report.bundle.change_mode, 'artifact_generation');
  assert.equal(report.bundle.reconciliation, 'change-impact-reconciliation');
  assert.equal(report.exit_gate.context_gate_pass, true);
  assert.ok(report.deltas.preferred_vs_current_fallback.percent <= -10);
  assert.deepEqual(report.exit_gate.route_selection_file_reads, { control: 2, preferred: 1 });
  assert.deepEqual(report.exit_gate.completion_file_reads, { control: 3, preferred: 2 });
  assert.deepEqual(report.exit_gate.static_artifacts_loaded, { control: 4, preferred: 3 });
  assert.equal(report.exit_gate.artifact_count_increase, false);
});

test('Skill package preferred and fallback paths preserve authority, placement, and live-state behavior', async () => {
  const report = await buildSkillPackageMaintenanceBehaviorReport();
  assert.equal(report.canonical_routing_changed, false);
  assert.deepEqual(report.fixtures.map(item => item.id), REQUIRED_FIXTURES);
  assert.equal(report.aggregate.fixture_count, 9);
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

test('Skill package fixtures retain non-trigger, mutation, placement, generated-output, and live-state boundaries', async () => {
  const report = await buildSkillPackageMaintenanceBehaviorReport();
  const byId = Object.fromEntries(report.fixtures.map(item => [item.id, item.preferred]));

  assert.equal(byId['authorized-update-existing-package'].mutation_allowed, true);
  assert.equal(byId['approved-plan-readonly'].mutation_allowed, false);
  assert.equal(byId['new-package-placement-ambiguous'].selected_route, 'placement-review');
  assert.equal(byId['new-package-placement-ambiguous'].placement_posture, 'escalate-mara');
  assert.equal(byId['one-off-document-non-trigger'].activate_package_maintenance, false);
  assert.equal(byId['persona-application-non-trigger'].selected_route, 'persona-capability-maintenance');
  assert.equal(byId['missing-mutation-authorization'].mutation_allowed, false);
  assert.equal(byId['runtime-availability-unverified'].runtime_posture, 'current-evidence-required');
  assert.equal(byId['runtime-availability-unverified'].authorization_posture, 'repository-only');
  assert.equal(byId['generated-output-direct-edit-blocked'].generated_output_posture, 'build-from-source');
  assert.equal(byId['documented-package-not-availability'].package_posture, 'referenced-unverified');

  for (const item of report.fixtures) assert.equal(item.preferred.bundle_grants_write, false);
});

test('direct Skill package fixtures keep preferred context smaller than fallback', async () => {
  const report = await buildSkillPackageMaintenanceBehaviorReport();
  const activated = report.fixtures.filter(item => item.preferred.activate_package_maintenance);
  for (const item of activated) {
    assert.ok(item.preferred.context.utf8_bytes < item.control.context.utf8_bytes, item.id + ' preferred context is not smaller');
  }
  assert.ok(report.aggregate.preferred_context_utf8_bytes < report.aggregate.control_context_utf8_bytes);
  assert.ok(report.aggregate.preferred_delta_percent <= -10);
});

test('Skill package migration and behavior reports are committed and fresh', async () => {
  const outputMaps = await Promise.all([
    expectedSkillPackageMaintenanceMigrationOutputs(),
    expectedSkillPackageMaintenanceBehaviorOutputs()
  ]);
  const expectedPaths = [
    'eval/results/skill-package-maintenance-migration.json',
    'eval/skill-package-maintenance-migration.md',
    'eval/results/skill-package-maintenance-behavior.json',
    'eval/skill-package-maintenance-behavior.md'
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
