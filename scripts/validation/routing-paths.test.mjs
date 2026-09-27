import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('repository-plumbing and library-semantic paths are deterministic and preserve escalation', () => {
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  const orientation = JSON.parse(readFileSync(path.join(root, 'content/site-orientation.json'), 'utf8'));
  const paths = orientation.routing?.work_paths;

  assert.ok(paths?.['repository-plumbing']);
  assert.ok(paths?.['library-semantic']);
  assert.equal(paths['repository-plumbing'].semantic_bootstrap_required, false);
  assert.equal(paths['library-semantic'].semantic_bootstrap_required, true);

  for (const example of ['CI or workflow maintenance', 'build-script maintenance', 'repository hygiene']) {
    assert.ok(paths['repository-plumbing'].examples.includes(example));
  }
  for (const example of ['Persona records', 'Skill identity, profile, or relationships', 'semantic routing']) {
    assert.ok(paths['library-semantic'].examples.includes(example));
  }

  assert.match(orientation.routing.mixed_escalation_rule, /Before it changes canonical library meaning/);
  assert.match(orientation.routing.mixed_escalation_rule, /never changes mutation authorization or validation requirements/);
  assert.match(agents, /repository-plumbing/);
  assert.match(agents, /library-semantic/);
  assert.match(agents, /escalate to the library-semantic path/);
});
