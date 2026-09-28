import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { buildExperiment, expectedOutputs, FIXTURES } from '../../eval/system-map-context-experiment.mjs';

const REQUIRED_DIMENSIONS = [
  'routing_target',
  'change_contract',
  'reconciliation',
  'mutation_execution_boundary',
  'source_tool_selection',
  'missed_exceptions',
  'validation_completion',
  'recovery_live_state_boundary'
];

const REQUIRED_EXCEPTION_FIELDS = [
  'availability_source',
  'first_reads',
  'mutation_boundary',
  'non_triggers',
  'next_handoff',
  'space_do_not'
];

test('Phase 9 compares three representative current routes without changing routing', async () => {
  const report = await buildExperiment();
  assert.equal(report.canonical_routing_changed, false);
  assert.equal(report.fixtures.length, 3);
  assert.deepEqual(report.fixtures.map(item => item.route_id), FIXTURES.map(item => item.route));
  assert.equal(report.graph_source, 'dist/data/system-map/agent-runtime.agent.json');

  for (const item of report.fixtures) {
    assert.equal(item.control.correct, true, item.route_id + ' control oracle failed');
    assert.equal(item.experimental.correct, true, item.route_id + ' experimental oracle failed');
    assert.deepEqual(Object.keys(item.experimental.dimensions), REQUIRED_DIMENSIONS);
    assert.ok(Object.values(item.experimental.dimensions).every(Boolean));
    assert.deepEqual(item.experimental.retained_exception_fields, REQUIRED_EXCEPTION_FIELDS);
    assert.ok(item.experimental.graph_fragment.nodes >= 10);
    assert.ok(item.experimental.graph_fragment.edges >= 8);
    assert.ok(item.experimental.graph_fragment.provenance_entries >= item.experimental.graph_fragment.nodes + item.experimental.graph_fragment.edges);
    assert.equal(item.adoption_candidate, item.experimental.correct && item.experimental.utf8_bytes < item.control.utf8_bytes);
  }
});

test('Phase 9 context arithmetic is deterministic and uses the existing UTF-8/4 convention', async () => {
  const first = await buildExperiment();
  const second = await buildExperiment();
  assert.deepEqual(second, first);

  for (const item of first.fixtures) {
    assert.equal(item.control.rough_tokens, Math.ceil(item.control.utf8_bytes / 4));
    assert.equal(item.experimental.rough_tokens, Math.ceil(item.experimental.utf8_bytes / 4));
    assert.equal(item.delta.utf8_bytes, item.experimental.utf8_bytes - item.control.utf8_bytes);
    assert.equal(item.delta.rough_tokens, item.experimental.rough_tokens - item.control.rough_tokens);
  }
});

test('Phase 9 output scope is eval-only and committed reports match fresh canonical derivation', async () => {
  const outputs = await expectedOutputs();
  assert.deepEqual([...outputs.keys()], [
    'eval/results/system-map-context-experiment.json',
    'eval/system-map-context-experiment.md'
  ]);

  for (const [relativePath, expected] of outputs) {
    assert.equal(
      await fs.readFile(new URL('../../' + relativePath, import.meta.url), 'utf8'),
      expected,
      relativePath + ' is stale'
    );
  }
});

test('Phase 9 experiment preserves the current four-artifact control baseline shape', async () => {
  const report = await buildExperiment();
  for (const item of report.fixtures) {
    assert.equal(item.control.artifacts.length, 4);
    assert.equal(item.control.artifacts[0], 'AGENTS.md');
    assert.equal(item.control.artifacts[1], 'content/site-orientation.json');
    assert.match(item.control.artifacts[2], /^content\/orientation\/.+\.json$/);
    assert.match(item.control.artifacts[3], /^\.agents\/skills\/.+\/SKILL\.md$/);
    assert.equal(item.experimental.artifacts.length, 4);
    assert.match(item.experimental.artifacts[1], /agent-runtime\.agent\.json#bounded:/);
    assert.match(item.experimental.artifacts[2], /#canonical-exceptions:/);
  }
});
