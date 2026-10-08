#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = JSON.parse(await readFile(path.join(root, 'eval/fixtures/persona-context-loading-pilot.json'), 'utf8'));
const sourceFile = path.join(root, 'dist/data/library-data.js');
const modelFile = path.join(root, 'dist/data/library-model.js');
const encode = value => JSON.stringify(value, null, 2) + '\n';
const hash = text => createHash('sha256').update(text).digest('hex');

async function current() {
  const [source, model] = await Promise.all([readFile(sourceFile, 'utf8'), readFile(modelFile, 'utf8')]);
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: sourceFile, timeout: 1000 });
  vm.runInNewContext(model, context, { filename: modelFile, timeout: 1000 });
  const snapshot = source + '\n' + model;
  return { data: context.window.PersonaLibraryData, sha: hash(snapshot), bytes: Buffer.byteLength(source) + Buffer.byteLength(model), fileReads: 2 };
}

function index(loaded) {
  return {
    source_bundle_sha256: loaded.sha,
    personas: loaded.data.personas.map(p => ({ id: p.id, name: p.name, expertise: p.roleLabel, useWhen: p.useWhen, workModes: p.workModes }))
  };
}

function profile(loaded, id) {
  const persona = loaded.data.personas.find(p => p.id === id);
  if (!persona) throw new Error('Unknown Persona: ' + id);
  // Historical direct source remains for unmigrated peers. Migrated pilot
  // applications are derived from the existing model's read-only projection.
  const legacy = loaded.data.skillLibrary[id] || [];
  const projected = (loaded.data.skillCatalog || []).flatMap(skill => (skill.profiles || [])
    .filter(application => application.personaId === id)
    .map(application => ({
      name: skill.name, status: application.status, definition: application.definition,
      triggers: application.triggers, workflows: application.workflows,
      actions: application.actions, evidence: application.evidence
    })));
  return {
    source_bundle_sha256: loaded.sha,
    persona,
    workflows: loaded.data.flowLibrary[id] || [],
    skill_applications: legacy.length ? legacy : projected,
    tool_requirements: (loaded.data.personaToolRequirements || []).filter(item => item.personaId === id),
    handoffs: (loaded.data.personaHandoffs || []).filter(item => item.fromPersonaId === id || item.toPersonaId === id)
  };
}

async function prepare() {
  const started = performance.now();
  const loaded = await current();
  const directory = await mkdtemp(path.join(os.tmpdir(), 'persona-context-loading-'));
  await writeFile(path.join(directory, 'index.json'), encode(index(loaded)));
  for (const persona of loaded.data.personas) {
    assert.match(persona.id, /^[a-z0-9-]+$/);
    await writeFile(path.join(directory, persona.id + '.json'), encode(profile(loaded, persona.id)));
  }
  return { directory, source_bundle_sha256: loaded.sha, prepare_ms: Number((performance.now() - started).toFixed(3)) };
}

async function currentRead() {
  const started = performance.now();
  const first = await current();
  const indexText = encode(index(first));
  const second = await current();
  assert.equal(second.sha, first.sha, 'Source changed between selection and profile loading');
  const profileText = encode(profile(second, fixture.expected_persona_id));
  return { elapsed_ms: performance.now() - started, indexText, profileText, filesystem_bytes_read: first.bytes + second.bytes, file_reads: first.fileReads + second.fileReads };
}

async function focusedRead(directory) {
  const started = performance.now();
  const indexText = await readFile(path.join(directory, 'index.json'), 'utf8');
  const profileText = await readFile(path.join(directory, fixture.expected_persona_id + '.json'), 'utf8');
  assert.equal(JSON.parse(indexText).source_bundle_sha256, JSON.parse(profileText).source_bundle_sha256);
  return { elapsed_ms: performance.now() - started, indexText, profileText, filesystem_bytes_read: Buffer.byteLength(indexText) + Buffer.byteLength(profileText) };
}

function statistics(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const quantile = q => Number(sorted[Math.ceil(sorted.length * q) - 1].toFixed(3));
  return { p50_ms: quantile(0.5), p95_ms: quantile(0.95) };
}

async function benchmark() {
  const prepared = await prepare();
  const samples = { current: [], focused: [] };
  let exemplar;
  for (let iteration = -5; iteration < 30; iteration++) {
    const a = iteration % 2 === 0 ? await currentRead() : await focusedRead(prepared.directory);
    const b = iteration % 2 === 0 ? await focusedRead(prepared.directory) : await currentRead();
    const control = iteration % 2 === 0 ? a : b;
    const candidate = iteration % 2 === 0 ? b : a;
    assert.equal(candidate.indexText, control.indexText, 'Index content differs');
    assert.equal(candidate.profileText, control.profileText, 'Persona facts differ');
    if (iteration >= 0) {
      samples.current.push(control.elapsed_ms);
      samples.focused.push(candidate.elapsed_ms);
    }
    exemplar = { control, candidate };
  }
  return {
    fixture: fixture.id,
    preparation: prepared,
    conditions: {
      node: process.version, os: os.platform(), warmup_pairs: 5, measured_pairs: 30,
      cache: 'Filesystem cache not flushed; alternating order',
      selection: 'Expected Persona ID fixed for filesystem measurement; agents select independently in the live trial',
      excluded: ['Snapshot preparation from repeated timings', 'Model reasoning', 'Tool roundtrip latency', 'Answer quality']
    },
    content_parity: 'Exact serialized index and full selected profile match, including all existing confidence metadata',
    current: { ...statistics(samples.current), file_reads: exemplar.control.file_reads, filesystem_bytes_read: exemplar.control.filesystem_bytes_read, model_visible_context_bytes: Buffer.byteLength(exemplar.control.indexText + exemplar.control.profileText) },
    focused: { ...statistics(samples.focused), file_reads: 2, filesystem_bytes_read: exemplar.candidate.filesystem_bytes_read, model_visible_context_bytes: Buffer.byteLength(exemplar.candidate.indexText + exemplar.candidate.profileText) },
    limitation: 'This measures local retrieval only. Fewer filesystem bytes do not imply fewer model-visible tokens, better reasoning, or faster end-to-end completion.'
  };
}

const command = process.argv[2] || 'benchmark';
let result;
if (command === 'prepare') result = await prepare();
else if (command === 'current-index') result = index(await current());
else if (command === 'current-persona') result = profile(await current(), process.argv[3]);
else if (command === 'benchmark') result = await benchmark();
else throw new Error('Expected prepare, current-index, current-persona <id>, or benchmark');
process.stdout.write(encode(result));
