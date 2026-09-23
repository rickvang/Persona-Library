import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

import { loadUsageTaxonomy, validateCalibrationPair, validateRunBundle, validateUsage } from '../../eval/contract.mjs';
import { normalizeOpenAIResponseUsage } from '../../eval/adapters/openai-responses.mjs';
import { buildReport, buildRoutingBaseline, calibrationSummary } from '../../eval/context-usage.mjs';

const revision = 'a'.repeat(40);
const taxonomy = {
  spaces: ['docs'],
  routesBySpace: { docs: ['system-orientation'] }
};

function estimatedUsage(inputTokens = 100) {
  return {
    measurement: 'estimated',
    scope: 'context',
    input_tokens: inputTokens,
    cached_input_tokens: null,
    output_tokens: null,
    reasoning_tokens: null,
    total_tokens: null,
    estimator: 'test-estimator',
    source: 'test context estimate',
    repository_ref: revision,
    artifacts: ['AGENTS.md'],
    context_attribution: {
      primary_space: 'docs',
      route_id: 'system-orientation',
      skill_id: 'persona-library-orientation'
    }
  };
}

function measuredUsage(inputTokens = 100, outputTokens = 20, turnId = 'turn-1') {
  return {
    measurement: 'measured',
    scope: 'turn',
    turn_id: turnId,
    input_tokens: inputTokens,
    cached_input_tokens: null,
    output_tokens: outputTokens,
    reasoning_tokens: null,
    total_tokens: inputTokens + outputTokens,
    source: 'provider response usage',
    repository_ref: revision
  };
}

function unavailableUsage() {
  return {
    measurement: 'unavailable',
    scope: 'turn',
    input_tokens: null,
    cached_input_tokens: null,
    output_tokens: null,
    reasoning_tokens: null,
    total_tokens: null,
    source: 'Codex task runtime',
    reason: 'Exact per-turn counts are not exposed to this workflow.'
  };
}

function runBundle(usage) {
  return {
    schema_version: '1.0',
    run_id: 'run-1',
    model: 'test/model',
    model_version: '1',
    surface: 'codex',
    repository_ref: revision,
    context: { artifacts: ['AGENTS.md'] },
    tools: {},
    permissions: {},
    results: [{
      fixture_id: 'fixture-1',
      mode: 'assisted',
      outcome: 'completed',
      next_action: 'none',
      result_class: 'success'
    }],
    ...(usage ? { usage } : {})
  };
}

function reportSample(usage, { surface = 'test-surface', model = 'test-model' } = {}) {
  return {
    usage,
    surface,
    model,
    request_mode: 'assisted',
    context_attribution: usage.context_attribution || {}
  };
}

test('routing baseline reads only committed file blobs at its pinned revision', async () => {
  const repositoryRef = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const baseline = await buildRoutingBaseline(repositoryRef, await loadUsageTaxonomy());

  assert.equal(baseline.repository_ref, repositoryRef);
  assert.equal(baseline.records.length, 7);
  for (const record of baseline.records) {
    assert.equal(record.usage.repository_ref, repositoryRef);
    assert.equal(record.usage.input_tokens, Math.ceil(record.included_utf8_bytes / 4));
    assert.ok(record.usage.artifacts.length >= 4);
  }
});

test('legacy run bundles without usage evidence remain valid', () => {
  assert.deepEqual(validateRunBundle(runBundle(), { taxonomy }), { valid: true, errors: [] });
});

test('measured usage requires provenance and reconciles totals when all parts are present', () => {
  const missingSource = measuredUsage();
  delete missingSource.source;
  assert.equal(validateUsage(missingSource).valid, false);

  const badTotal = measuredUsage();
  badTotal.total_tokens += 1;
  assert.ok(validateUsage(badTotal).errors.some(error => error.includes('total_tokens')));

  const invalidCachedTokens = measuredUsage();
  invalidCachedTokens.cached_input_tokens = invalidCachedTokens.input_tokens + 1;
  assert.ok(validateUsage(invalidCachedTokens).errors.some(error => error.includes('cached_input_tokens')));

  const invalidReasoningTokens = measuredUsage();
  invalidReasoningTokens.reasoning_tokens = invalidReasoningTokens.output_tokens + 1;
  assert.ok(validateUsage(invalidReasoningTokens).errors.some(error => error.includes('reasoning_tokens')));
});

test('estimated usage requires an estimator, pinned revision, and artifact list', () => {
  assert.equal(validateUsage(estimatedUsage(), { taxonomy }).valid, true);

  const incomplete = estimatedUsage();
  incomplete.repository_ref = 'main';
  incomplete.artifacts = [];
  incomplete.estimator = '';
  const errors = validateUsage(incomplete, { taxonomy }).errors.join(' ');
  assert.match(errors, /estimator/);
  assert.match(errors, /repository_ref/);
  assert.match(errors, /artifact/);
});

test('unavailable usage carries provenance and reason without invented counts', () => {
  assert.equal(validateUsage(unavailableUsage()).valid, true);

  const invented = unavailableUsage();
  invented.input_tokens = 0;
  assert.ok(validateUsage(invented).errors.some(error => error.includes('cannot contain a token count')));
});

test('route and space attribution is checked against the current taxonomy', () => {
  assert.equal(validateUsage(estimatedUsage(), { taxonomy }).valid, true);

  const unknownRoute = estimatedUsage();
  unknownRoute.context_attribution.route_id = 'not-a-route';
  assert.ok(validateUsage(unknownRoute, { taxonomy }).errors.some(error => error.includes('current orientation route group')));
});

test('calibration pairs require measured input tokens for signed error calculations', () => {
  const pair = {
    schema_version: '1.0',
    record_type: 'usage-calibration-pair',
    pair_id: 'pair-missing-input',
    task_class: 'docs',
    repository_ref: revision,
    surface: 'api',
    model: 'model-a',
    estimated: estimatedUsage(80),
    measured: measuredUsage(100, 10, 'turn-missing-input')
  };
  delete pair.measured.input_tokens;
  const validation = validateCalibrationPair(pair, { taxonomy });
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some(error => error.includes('measured calibration usage must include a non-negative input_tokens value')));
});

test('OpenAI Responses adapter normalizes only returned usage fields', () => {
  const usage = normalizeOpenAIResponseUsage({
    id: 'resp_123',
    model: 'gpt-example',
    usage: {
      input_tokens: 100,
      input_tokens_details: { cached_tokens: 12 },
      output_tokens: 20,
      output_tokens_details: { reasoning_tokens: 3 },
      total_tokens: 120
    }
  }, { observedAt: '2026-09-23T00:00:00.000Z' });

  assert.equal(validateUsage(usage).valid, true);
  assert.equal(usage.turn_id, 'resp_123');
  assert.equal(usage.cached_input_tokens, 12);
  assert.equal(usage.reasoning_tokens, 3);
  assert.equal(usage.provider_metadata.model, 'gpt-example');

  const unavailable = normalizeOpenAIResponseUsage({ id: 'resp_empty' });
  assert.equal(unavailable.measurement, 'unavailable');
  assert.equal(validateUsage(unavailable).valid, true);
});

test('report keeps measured and estimated samples separate and computes mean, median, and p90', () => {
  const report = buildReport({
    sourceFiles: ['sample.json'],
    calibrationPairs: [],
    samples: [
      reportSample(measuredUsage(100, 10)),
      reportSample(measuredUsage(300, 10, 'turn-2')),
      reportSample(estimatedUsage(50)),
      reportSample(estimatedUsage(150)),
      reportSample(unavailableUsage())
    ]
  });

  assert.deepEqual(report.counts, { measured: 2, estimated: 2, unavailable: 1 });
  const measured = report.by_measurement.measured.scopes.turn.input_tokens;
  const estimated = report.by_measurement.estimated.scopes.context.input_tokens;
  assert.deepEqual(measured, { count: 2, mean: 200, median: 200, p90: 300 });
  assert.deepEqual(estimated, { count: 2, mean: 100, median: 100, p90: 150 });
  assert.equal(report.by_measurement.estimated.scopes.context.by_skill['persona-library-orientation'].sample_count, 2);
});

test('calibration reports signed and absolute percentage error without claiming follow-up eligibility early', () => {
  const pairs = [
    {
      pair_id: 'pair-1',
      task_class: 'docs',
      repository_ref: revision,
      surface: 'api',
      model: 'model-a',
      estimated: estimatedUsage(80),
      measured: measuredUsage(100, 10, 'turn-a')
    },
    {
      pair_id: 'pair-2',
      task_class: 'skills',
      repository_ref: revision,
      surface: 'api',
      model: 'model-a',
      estimated: estimatedUsage(110),
      measured: measuredUsage(100, 10, 'turn-b')
    }
  ];
  for (const pair of pairs) {
    pair.estimated.repository_ref = revision;
    pair.measured.repository_ref = revision;
    assert.equal(validateCalibrationPair({ schema_version: '1.0', record_type: 'usage-calibration-pair', ...pair }).valid, true);
  }

  const summary = calibrationSummary(pairs);
  assert.equal(summary.overall.median_signed_error_tokens, -5);
  assert.equal(summary.overall.median_absolute_percentage_error, 15);
  assert.equal(summary.overall.p90_absolute_percentage_error, 20);
  assert.equal(summary.operational_follow_up_review.eligible, false);
});
