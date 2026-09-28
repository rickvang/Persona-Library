import test from 'node:test';
import assert from 'node:assert/strict';
import { runTimingBenchmark } from '../../eval/agent-context-timing-benchmark.mjs';

test('activation benchmark covers all migrated routes and preserves deterministic activation parity', async () => {
  const report = await runTimingBenchmark({ warmup: 1, iterations: 3 });

  assert.equal(report.benchmark, 'agent-context-deterministic-activation-timing');
  assert.equal(report.measured_scope, 'repository-side activation only');
  assert.equal(report.routes.length, 3);
  assert.deepEqual(
    report.routes.map(item => item.route_id),
    ['system-orientation', 'template-composition', 'tool-resolution']
  );

  for (const route of report.routes) {
    assert.equal(route.control.route_selection_file_reads, 2);
    assert.equal(route.preferred.route_selection_file_reads, 1);
    assert.equal(route.control.first_useful_action_file_reads, 3);
    assert.equal(route.preferred.first_useful_action_file_reads, 2);
    assert.equal(route.control.completion_file_reads, 3);
    assert.equal(route.preferred.completion_file_reads, 2);
    assert.equal(route.control.static_artifacts_loaded, 4);
    assert.equal(route.preferred.static_artifacts_loaded, 3);
    assert.ok(route.preferred.context_bytes < route.control.context_bytes);
    assert.equal(route.deltas.completion_file_reads, -1);
    assert.equal(route.deltas.static_artifacts_loaded, -1);
    assert.ok(route.deltas.context_bytes < 0);

    for (const stage of ['route_selection', 'first_useful_action', 'deterministic_completion']) {
      assert.ok(route.control[stage].p50_ms >= 0);
      assert.ok(route.control[stage].p95_ms >= route.control[stage].p50_ms);
      assert.ok(route.preferred[stage].p50_ms >= 0);
      assert.ok(route.preferred[stage].p95_ms >= route.preferred[stage].p50_ms);
    }
  }
});

test('activation timing benchmark keeps external/model latency explicitly out of scope', async () => {
  const report = await runTimingBenchmark({ warmup: 0, iterations: 1 });
  const limitations = report.limitations.join(' ').toLowerCase();

  assert.ok(limitations.includes('not end-user chatgpt response latency'));
  assert.ok(limitations.includes('model inference'));
  assert.ok(limitations.includes('external connector'));
  assert.ok(limitations.includes('human approval'));
  assert.ok(limitations.includes('not a hard ci performance threshold'));
});
