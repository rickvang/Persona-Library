import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const workspaceHumanModel = 'https://github.com/rickvang/persona-workspace/blob/main/docs/HOW-IT-WORKS.md';

test('Persona-Library points humans upward without duplicating the Workspace model', () => {
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
  const docs = readFileSync(path.join(root, 'docs/README.md'), 'utf8');
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  const architecture = readFileSync(path.join(root, 'ARCHITECTURE.md'), 'utf8');

  assert.match(readme, /## Human orientation/);
  assert.ok(readme.includes(workspaceHumanModel));
  assert.match(readme, /system-knowledge repository/);
  assert.match(readme, /do \*\*not\*\* need to understand route groups, activation metadata, reconciliation adapters, Operational Scenarios, or harness internals/);

  assert.ok(docs.includes(workspaceHumanModel));
  assert.match(docs, /maintainer guidance for placing files \*inside Persona-Library\*/);

  assert.ok(agents.includes(workspaceHumanModel));
  assert.match(agents, /do not duplicate the whole-workspace human model here/);

  assert.match(architecture, /Persona Workspace owns the plain-language cross-repository mental model/);
  assert.match(architecture, /Persona-Library owns the technical semantic architecture/);
});

test('technical routing remains available as deeper repository detail', () => {
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');

  assert.match(readme, /content\/site-orientation\.json/);
  assert.match(readme, /content\/orientation\//);
  assert.match(agents, /library-semantic/);
  assert.match(agents, /content\/site-orientation\.json/);
  assert.match(agents, /Operational Scenario/);
});
