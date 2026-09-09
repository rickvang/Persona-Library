#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateResult, loadCases, normalizeRunBundleResult, summarize, validateResult, validateRunBundle } from './contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cases = await loadCases();
const command = process.argv[2] || 'validate';

if (command === 'validate') {
  console.log(`Validated ${cases.cases.length} conformance cases.`);
  process.exit(0);
}

if (command === 'evaluate') {
  const resultPath = process.argv[3];
  if (!resultPath) throw new Error('Usage: node eval/run.mjs evaluate <result.json>');
  const result = JSON.parse(await readFile(path.resolve(resultPath), 'utf8'));
  const evaluation = evaluateResult(result, cases);
  console.log(JSON.stringify(evaluation, null, 2));
  process.exit(evaluation.verdict === 'PASS' ? 0 : 1);
}

if (command === 'scan-results') {
  const resultsDir = path.resolve(process.argv[3] || path.join(root, 'eval', 'results'));
  const entries = await readdir(resultsDir, { withFileTypes: true });
  const evaluations = [];
  for (const entry of entries.filter(item => item.isFile() && item.name.endsWith('.json'))) {
    const payload = JSON.parse(await readFile(path.join(resultsDir, entry.name), 'utf8'));
    if (Array.isArray(payload.results)) {
      const bundleCheck = validateRunBundle(payload);
      if (!bundleCheck.valid) {
        evaluations.push({ file: entry.name, bundle: true, verdict: 'UNKNOWN', errors: bundleCheck.errors });
        continue;
      }
      for (const bundleEntry of payload.results) {
        const result = normalizeRunBundleResult(payload, bundleEntry);
        evaluations.push({ file: entry.name, fixture_id: result.fixture_id, run_id: payload.run_id, observation: result.observation, ...evaluateResult(result, cases) });
      }
      continue;
    }
    evaluations.push({ file: entry.name, fixture_id: payload.fixture_id, ...evaluateResult(payload, cases) });
  }
  console.log(JSON.stringify({ summary: summarize(evaluations), evaluations }, null, 2));
  process.exit(evaluations.some(item => item.verdict === 'REVIEW') ? 1 : 0);
}

if (command === 'check-result-shape') {
  const resultPath = process.argv[3];
  if (!resultPath) throw new Error('Usage: node eval/run.mjs check-result-shape <result.json>');
  const result = JSON.parse(await readFile(path.resolve(resultPath), 'utf8'));
  const check = validateResult(result, cases);
  console.log(JSON.stringify(check, null, 2));
  process.exit(check.valid ? 0 : 1);
}

throw new Error(`Unknown command: ${command}`);
