import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('placement gate allows obvious extensions and escalates real ownership ambiguity', () => {
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  const docs = readFileSync(path.join(root, 'docs/README.md'), 'utf8');
  const orientation = JSON.parse(readFileSync(path.join(root, 'content/site-orientation.json'), 'utf8'));
  const gate = orientation.creation_gate;

  assert.ok(gate.direct_when.includes('canonical owner is known'));
  assert.ok(gate.direct_when.includes('existing destination pattern is established'));
  assert.ok(gate.escalate_when.includes('canonical ownership is ambiguous'));
  assert.ok(gate.escalate_when.includes('a new top-level directory or space is proposed'));
  assert.ok(gate.escalate_when.includes('a semantic boundary or taxonomy would change'));
  assert.match(gate.required_before, /Mara review is required only/);
  assert.ok(gate.direct_examples.some(example => /focused validator test/.test(example)));
  assert.ok(gate.escalation_examples.some(example => /sibling repository/.test(example)));

  assert.match(agents, /placement table and gate directly/);
  assert.match(agents, /Escalate to Mara Okoye/);
  assert.match(docs, /place the artifact directly/);
  assert.match(docs, /Escalate the placement question to Mara Okoye/);
  assert.match(docs, /does not grant mutation permission/);
  assert.match(docs, /does not bypass change-impact reconciliation/);
});
