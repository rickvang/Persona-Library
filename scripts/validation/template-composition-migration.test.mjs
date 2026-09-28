import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  buildTemplateCompositionBehaviorReport,
  expectedTemplateCompositionBehaviorOutputs
} from '../../eval/template-composition-behavior.mjs';
import {
  buildTemplateCompositionMigrationReport,
  expectedTemplateCompositionMigrationOutputs
} from '../../eval/template-composition-migration.mjs';

const REQUIRED_FIXTURES = [
  'authorized-create-from-accepted-research',
  'authorized-adapt-existing-starter',
  'plan-without-write',
  'missing-accepted-research',
  'ambiguous-source-provenance',
  'ambiguous-target-ownership',
  'project-starter-no-promotion',
  'canonical-publication-chain',
  'external-source-availability-unknown',
  'template-catalog-lookup-non-trigger'
];

test('Template composition migration remains smaller and preserves canonical routing authority', async () => {
  const report = await buildTemplateCompositionMigrationReport();
  assert.equal(report.canonical_route_records_changed, false);
  assert.equal(report.bundle.route_id, 'template-composition');
  assert.equal(report.bundle.primary_space, 'templates');
  assert.equal(report.bundle.space_entries, 1);
  assert.equal(report.bundle.mutation_boundary, 'authorized_update');
  assert.equal(report.bundle.change_mode, 'artifact_generation');
  assert.equal(report.bundle.reconciliation, 'template-reconciliation');
  assert.ok(report.preferred_path.utf8_bytes < report.canonical_fallback.utf8_bytes);
  assert.ok(report.deltas.preferred_vs_current_fallback.percent < 0);
});

test('Template composition preferred and fallback paths preserve required behavioral outcomes', async () => {
  const report = await buildTemplateCompositionBehaviorReport();
  assert.equal(report.canonical_routing_changed, false);
  assert.deepEqual(report.fixtures.map(item => item.id), REQUIRED_FIXTURES);
  assert.equal(report.aggregate.fixture_count, 10);
  assert.equal(report.aggregate.activated_fixture_count, 5);
  assert.equal(report.aggregate.failed, 0);
  assert.equal(report.aggregate.all_pass, true);

  for (const item of report.fixtures) {
    assert.equal(item.control.pass, true, item.id + ' canonical fallback failed');
    assert.equal(item.preferred.pass, true, item.id + ' preferred path failed');
    assert.equal(item.parity.pass, true, item.id + ' preferred/fallback parity failed');
    assert.equal(item.pass, true, item.id + ' fixture failed');
  }
});

test('Template composition fixtures preserve research, authority, provenance, promotion, and reconciliation gates', async () => {
  const report = await buildTemplateCompositionBehaviorReport();
  const byId = Object.fromEntries(report.fixtures.map(item => [item.id, item.preferred]));

  assert.equal(byId['authorized-create-from-accepted-research'].execution_allowed, true);
  assert.equal(byId['authorized-create-from-accepted-research'].bundle_grants_write, false);
  assert.equal(byId['authorized-create-from-accepted-research'].reconciliation_handoff, 'template-reconciliation');
  assert.equal(byId['authorized-create-from-accepted-research'].universal_reconciliation_passes, 1);

  assert.equal(byId['authorized-adapt-existing-starter'].reuse_posture, 'adapt-existing');
  assert.equal(byId['plan-without-write'].execution_allowed, false);

  assert.equal(byId['missing-accepted-research'].selected_route, 'template-research');
  assert.equal(byId['missing-accepted-research'].activate_composition, false);

  assert.equal(byId['ambiguous-source-provenance'].source_posture, 'unverified');
  assert.equal(byId['ambiguous-source-provenance'].execution_allowed, false);
  assert.equal(byId['ambiguous-source-provenance'].runtime_posture, 'current-evidence-required');

  assert.equal(byId['ambiguous-target-ownership'].placement, 'escalate-mara');
  assert.equal(byId['ambiguous-target-ownership'].execution_allowed, false);

  assert.equal(byId['project-starter-no-promotion'].promotion_posture, 'project-local-explicit');
  assert.equal(byId['canonical-publication-chain'].publication_chain_required, true);
  assert.equal(byId['canonical-publication-chain'].promotion_posture, 'canonical-approved');

  assert.equal(byId['external-source-availability-unknown'].selected_route, 'template-research');
  assert.equal(byId['external-source-availability-unknown'].runtime_posture, 'current-evidence-required');

  assert.equal(byId['template-catalog-lookup-non-trigger'].selected_route, 'template-catalog');
  assert.equal(byId['template-catalog-lookup-non-trigger'].activate_composition, false);
});

test('direct Template composition fixtures keep preferred context smaller than fallback', async () => {
  const report = await buildTemplateCompositionBehaviorReport();
  const activated = report.fixtures.filter(item => item.preferred.activate_composition);
  for (const item of activated) {
    assert.ok(item.preferred.context.utf8_bytes < item.control.context.utf8_bytes, item.id + ' preferred context is not smaller');
  }
  assert.ok(report.aggregate.preferred_context_utf8_bytes < report.aggregate.control_context_utf8_bytes);
  assert.ok(report.aggregate.preferred_delta_percent < 0);
});

test('Template composition migration and behavior reports are committed and fresh', async () => {
  const outputMaps = await Promise.all([
    expectedTemplateCompositionMigrationOutputs(),
    expectedTemplateCompositionBehaviorOutputs()
  ]);
  const expectedPaths = [
    'eval/results/template-composition-migration.json',
    'eval/template-composition-migration.md',
    'eval/results/template-composition-behavior.json',
    'eval/template-composition-behavior.md'
  ];
  const actualPaths = outputMaps.flatMap(map => [...map.keys()]);
  assert.deepEqual(actualPaths, expectedPaths);

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
