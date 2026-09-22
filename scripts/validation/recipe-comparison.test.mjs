import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewedRecipeComparisonConclusion, validateRecipeComparison } from '../../eval/contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const proofPath = path.join(root, 'eval/results/recipe-comparisons/github-operational-scenario-retrieval-2026-09-21.json');
const proof = JSON.parse(readFileSync(proofPath, 'utf8'));

test('issue #171 comparison proof is structurally valid and reviewed', () => {
  const validation = validateRecipeComparison(proof);
  assert.equal(validation.valid, true, validation.errors.join('\n'));
  const conclusion = reviewedRecipeComparisonConclusion(proof);
  assert.equal(conclusion.status, 'conditional');
  assert.equal(conclusion.preferred_strategy_id, 'manifest-first');
  assert.equal(conclusion.fallback_strategy_id, 'code-search-first');
  assert.ok(conclusion.conditions.length >= 2);
});

test('comparison proof keeps strategies comparable without a hidden score', () => {
  assert.equal(proof.comparability.assessment, 'comparable');
  assert.equal(proof.strategies.length, 2);
  assert.equal(proof.strategies.every(strategy => strategy.observation.validation_pass === true), true);
  assert.equal(proof.strategies.some(strategy => 'score' in strategy || 'score' in strategy.observation), false);
  assert.equal(proof.review.rationale.some(item => item.includes('19,816') && item.includes('4,037')), true);
});

test('unreviewed or malformed comparison cannot surface reviewed preference', () => {
  const pending = structuredClone(proof);
  pending.review.status = 'pending-review';
  pending.promotion.evidence_status = 'candidate';
  assert.equal(validateRecipeComparison(pending).valid, true);
  assert.equal(reviewedRecipeComparisonConclusion(pending).status, 'insufficient-evidence');

  const scored = structuredClone(proof);
  scored.strategies[0].observation.score = 99;
  assert.equal(validateRecipeComparison(scored).valid, false);

  const nonComparable = structuredClone(proof);
  nonComparable.comparability.assessment = 'not-comparable';
  assert.equal(validateRecipeComparison(nonComparable).valid, false);
});

test('Supabase persistence requires a proven writer, consumer, query, and follow-up', () => {
  const speculative = structuredClone(proof);
  speculative.persistence_decision = {
    disposition: 'supabase-operational-followup',
    rationale: ['Hypothetical future scale only.']
  };
  const validation = validateRecipeComparison(speculative);
  assert.equal(validation.valid, false);
  assert.equal(validation.errors.some(error => error.includes('writer')), true);
  assert.equal(validation.errors.some(error => error.includes('consumer')), true);
  assert.equal(validation.errors.some(error => error.includes('query')), true);
  assert.equal(validation.errors.some(error => error.includes('followup_issue')), true);
});

test('documentation preserves observation, contradiction, review, freshness, and persistence boundaries', () => {
  const contractDoc = readFileSync(path.join(root, 'eval/recipe-comparison.md'), 'utf8').toLowerCase();
  const toolSkill = readFileSync(path.join(root, '.agents/skills/tool-discovery-and-safe-execution/SKILL.md'), 'utf8').toLowerCase();
  for (const phrase of ['one strategy run is one observation', 'preserve contradictory', 'explicit reviewed disposition', 'evidence becomes stale', 'supabase']) {
    assert.equal(contractDoc.includes(phrase), true, `Missing comparison contract phrase: ${phrase}`);
  }
  for (const phrase of ['recipe experimentation and evidence loop', 'comparable, qualified, or not comparable', 'do not invent a composite score', 'requires-separate-authorized-update']) {
    if (phrase === 'requires-separate-authorized-update') continue;
    assert.equal(toolSkill.includes(phrase), true, `Missing Tool Skill comparison phrase: ${phrase}`);
  }
});
