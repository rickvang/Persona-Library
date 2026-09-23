import test from 'node:test';
import assert from 'node:assert/strict';

import { buildAllowanceReport, computeAllowanceMeasurement, validateAllowanceObservation } from '../../eval/allowance-usage.mjs';
import { normalizeCodexStatusSnapshot } from '../../eval/adapters/codex-status.mjs';
import { normalizeSettingsUsageSnapshot } from '../../eval/adapters/settings-usage.mjs';

const task = (overrides = {}) => ({
  task_id: 'task-1',
  task_class: 'implementation',
  surface: 'codex',
  model: 'test-model',
  reasoning_level: 'medium',
  orchestration: 'riley',
  route_id: 'skill-package-maintenance',
  started_at: '2026-09-23T10:00:00Z',
  completed_at: '2026-09-23T10:05:00Z',
  ...overrides
});

const snapshot = (observedAt, windows, source = 'test') => ({ source, observed_at: observedAt, windows });
const used = (value, overrides = {}) => ({ window_id: 'five_hour', unit: 'percent', mode: 'used', value, reset_at: '2026-09-23T14:00:00Z', ...overrides });
const remaining = (value, overrides = {}) => ({ window_id: 'five_hour', unit: 'percent', mode: 'remaining', value, reset_at: '2026-09-23T14:00:00Z', ...overrides });

function observation(beforeWindow, afterWindow, overrides = {}) {
  return {
    schema_version: '1.0',
    record_type: 'allowance-task-observation',
    task: task(overrides.task),
    before: snapshot('2026-09-23T09:59:00Z', Array.isArray(beforeWindow) ? beforeWindow : [beforeWindow]),
    after: snapshot('2026-09-23T10:06:00Z', Array.isArray(afterWindow) ? afterWindow : [afterWindow]),
    flags: overrides.flags || {}
  };
}

test('used meters compute positive consumption', () => {
  const result = computeAllowanceMeasurement(observation(used(20), used(27)));
  assert.equal(result.valid, true);
  assert.equal(result.windows[0].outcome, 'measured');
  assert.equal(result.windows[0].delta, 7);
});

test('remaining meters compute positive consumption without sign reversal', () => {
  const result = computeAllowanceMeasurement(observation(remaining(80), remaining(73)));
  assert.equal(result.windows[0].outcome, 'measured');
  assert.equal(result.windows[0].delta, 7);
});

test('incomparable units do not produce a fake delta', () => {
  const result = computeAllowanceMeasurement(observation(used(20), { ...used(27), unit: 'credits' }));
  assert.equal(result.windows.every(window => window.outcome === 'unavailable'), true);
  assert.equal(result.windows.every(window => window.delta === null), true);
});

test('reset crossing is classified instead of subtracted normally', () => {
  const before = used(90, { reset_at: '2026-09-23T10:03:00Z' });
  const after = used(4, { reset_at: '2026-09-23T15:03:00Z' });
  const result = computeAllowanceMeasurement(observation(before, after));
  assert.equal(result.windows[0].outcome, 'reset_crossed');
  assert.equal(result.windows[0].delta, null);
});

test('concurrent usage and update lag produce caveated measurements', () => {
  const concurrent = computeAllowanceMeasurement(observation(used(20), used(25), { flags: { concurrent_usage_possible: true } }));
  assert.equal(concurrent.windows[0].outcome, 'measured_with_caveat');
  assert.deepEqual(concurrent.windows[0].caveats, ['concurrent_usage_possible']);

  const lag = computeAllowanceMeasurement(observation(used(20), used(25), { flags: { update_lag_possible: true } }));
  assert.equal(lag.windows[0].outcome, 'measured_with_caveat');
});

test('unchanged coarse meter can be classified below resolution', () => {
  const result = computeAllowanceMeasurement(observation(used(20, { resolution: 1 }), used(20, { resolution: 1 })));
  assert.equal(result.windows[0].outcome, 'below_resolution');
  assert.equal(result.windows[0].delta, null);
});

test('multiple windows stay separate', () => {
  const before = [used(20), { window_id: 'weekly', unit: 'percent', mode: 'remaining', value: 60, reset_at: '2026-09-28T00:00:00Z' }];
  const after = [used(23), { window_id: 'weekly', unit: 'percent', mode: 'remaining', value: 58, reset_at: '2026-09-28T00:00:00Z' }];
  const result = computeAllowanceMeasurement(observation(before, after));
  assert.deepEqual(result.windows.map(window => [window.window_id, window.delta]), [['five_hour', 3], ['weekly', 2]]);
});

test('report computes statistics only from clean comparable measured samples', () => {
  const report = buildAllowanceReport([
    observation(used(10), used(12), { task: { task_id: 'a' } }),
    observation(used(20), used(26), { task: { task_id: 'b', reasoning_level: 'high' } }),
    observation(used(30), used(34), { task: { task_id: 'c' }, flags: { concurrent_usage_possible: true } }),
    observation(used(40, { resolution: 1 }), used(40, { resolution: 1 }), { task: { task_id: 'd' } })
  ]);
  const window = report.windows['five_hour::percent'];
  assert.deepEqual(window.measured_delta, { count: 2, mean: 4, median: 4, p90: 6 });
  assert.deepEqual(window.caveated_delta, { count: 1, mean: 4, median: 4, p90: 4 });
  assert.equal(window.outcome_counts.below_resolution, 1);
  assert.equal(window.by_reasoning.medium.measured_delta.count, 1);
  assert.equal(window.by_reasoning.high.measured_delta.count, 1);
});

test('Codex status adapter preserves observable units and provenance', () => {
  const normalized = normalizeCodexStatusSnapshot({
    observed_at: '2026-09-23T10:00:00Z',
    windows: [
      { window_id: 'five_hour', remaining_percent: 72, reset_at: '2026-09-23T14:00:00Z', resolution: 1 },
      { window_id: 'weekly', remaining_percent: 41, reset_at: '2026-09-28T00:00:00Z', resolution: 1 }
    ]
  });
  assert.equal(normalized.source, 'Codex /status');
  assert.deepEqual(normalized.windows.map(window => [window.window_id, window.unit, window.mode, window.value]), [
    ['five_hour', 'percent', 'remaining', 72],
    ['weekly', 'percent', 'remaining', 41]
  ]);
});

test('Settings usage adapter preserves credits instead of relabeling them as tokens or percentages', () => {
  const normalized = normalizeSettingsUsageSnapshot({
    observed_at: '2026-09-23T10:00:00Z',
    windows: [{ window_id: 'monthly', remaining_credits: 120, reset_at: '2026-10-01T00:00:00Z', resolution: 0.1 }]
  });
  assert.equal(normalized.source, 'ChatGPT Settings → Usage');
  assert.equal(normalized.windows[0].unit, 'credits');
  assert.equal(normalized.windows[0].mode, 'remaining');
  assert.equal(normalized.windows[0].value, 120);
});

test('raw prompt or account identifiers are not required by the allowance contract', () => {
  const record = observation(used(20), used(21));
  assert.deepEqual(validateAllowanceObservation(record), { valid: true, errors: [] });
  assert.equal('prompt' in record, false);
  assert.equal('account_id' in record, false);
});
