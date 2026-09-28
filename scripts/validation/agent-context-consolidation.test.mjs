import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  buildAgentContextConsolidation,
  expectedAgentContextConsolidationOutputs
} from '../../eval/agent-context-consolidation.mjs';

test('Phase E consolidation chooses selective rollout from current four-route evidence', async () => {
  const report = await buildAgentContextConsolidation();

  assert.equal(report.decision, 'selective-rollout');
  assert.equal(report.architecture.contract, 'persona-library.agent-context/v0.1');
  assert.equal(report.architecture.status, 'supported-selective-routing-primitive');
  assert.equal(report.architecture.v0_2_required_now, false);
  assert.equal(report.architecture.bulk_migration_authorized, false);

  assert.equal(report.summary.migrated_routes, 4);
  assert.equal(report.summary.behavioral_fixtures, 39);
  assert.equal(report.summary.behavioral_passed, 39);
  assert.equal(report.summary.behavioral_failed, 0);
  assert.equal(report.routes.length, 4);

  assert.ok(report.summary.base_context.delta_percent < 0);
  assert.ok(report.summary.activated_behavior_context.delta_percent < 0);
  assert.equal(report.summary.deterministic_work.control_completion_file_reads_per_route, 3);
  assert.equal(report.summary.deterministic_work.preferred_completion_file_reads_per_route, 2);
  assert.equal(report.summary.deterministic_work.control_static_artifacts_per_route, 4);
  assert.equal(report.summary.deterministic_work.preferred_static_artifacts_per_route, 3);
});

test('all observed preferred paths reduce repository-side activation work', async () => {
  const report = await buildAgentContextConsolidation();

  for (const route of report.routes) {
    assert.equal(route.behavior.failed, 0);
    assert.equal(route.behavior.passed, route.behavior.fixtures);
    assert.ok(route.context.delta_percent < 0);

    assert.equal(route.timing.control.completion_file_reads, 3);
    assert.equal(route.timing.preferred.completion_file_reads, 2);
    assert.equal(route.timing.control.static_artifacts_loaded, 4);
    assert.equal(route.timing.preferred.static_artifacts_loaded, 3);

    assert.ok(route.timing.deltas.route_selection_p50_percent < 0);
    assert.ok(route.timing.deltas.first_useful_action_p50_percent < 0);
    assert.ok(route.timing.deltas.deterministic_completion_p50_percent < 0);

    assert.ok(
      route.timing.preferred.route_selection.p95_ms < route.timing.control.route_selection.p95_ms,
      route.route_id + ' route-selection p95 did not improve in observed run'
    );
    assert.ok(
      route.timing.preferred.deterministic_completion.p95_ms < route.timing.control.deterministic_completion.p95_ms,
      route.route_id + ' completion p95 did not improve in observed run'
    );
  }
});

test('future-route criteria prevent automatic or low-value bulk migration', async () => {
  const report = await buildAgentContextConsolidation();
  const criteria = report.eligibility_for_future_routes.join(' ');

  assert.ok(criteria.includes('one callable Skill'));
  assert.ok(criteria.includes('at least one route-side file read'));
  assert.ok(criteria.includes('at least 10% smaller'));
  assert.ok(criteria.includes('5–10%'));
  assert.ok(criteria.includes('100% preferred/fallback parity'));
  assert.ok(criteria.includes('Live availability'));
  assert.ok(criteria.includes('duplicated human-authored policy'));

  assert.ok(report.rollout_guidance.recommendation.includes('selectively'));
  assert.ok(report.rollout_guidance.next_route_policy.includes('separately approved issue'));
  assert.ok(report.rollout_guidance.schema_policy.includes('Keep persona-library.agent-context/v0.1'));
});

test('maintenance evidence distinguishes generic substrate from route-specific safety work', async () => {
  const report = await buildAgentContextConsolidation();

  assert.equal(report.maintenance.generic_infrastructure_count, 4);
  assert.equal(report.maintenance.route_specific_surface_total, 35);
  assert.deepEqual(report.maintenance.route_specific_surface_counts, {
    'system-orientation': 8,
    'template-composition': 9,
    'tool-resolution': 9,
    'skill-package-maintenance': 9
  });
  assert.ok(report.maintenance.scaling_observation.includes('scale generically'));
  assert.ok(report.maintenance.scaling_observation.includes('per-route work'));
});

test('timing evidence is scoped to deterministic repository activation, not end-user latency', async () => {
  const report = await buildAgentContextConsolidation();
  const limitations = report.limitations.join(' ').toLowerCase();
  const interpretation = report.timing_evidence.interpretation.join(' ').toLowerCase();

  assert.ok(Number.isInteger(report.timing_evidence.source.workflow_run_id));
  assert.ok(report.timing_evidence.source.workflow_run_id > 0);
  assert.equal(report.timing_evidence.measured_scope, 'repository-side activation only');
  assert.equal(report.timing_evidence.measured_iterations_per_path, 250);
  assert.ok(interpretation.includes('do not measure model generation'));
  assert.ok(limitations.includes('not end-user chatgpt response time'));
  assert.ok(limitations.includes('connector/network/service latency'));
});

test('Phase E consolidation outputs are committed and fresh', async () => {
  const outputs = await expectedAgentContextConsolidationOutputs();
  assert.deepEqual([...outputs.keys()], [
    'eval/results/agent-context-consolidation.json',
    'eval/agent-context-consolidation.md'
  ]);

  for (const [relativePath, expected] of outputs) {
    assert.equal(
      await fs.readFile(new URL('../../' + relativePath, import.meta.url), 'utf8'),
      expected,
      relativePath + ' is stale'
    );
  }
});
