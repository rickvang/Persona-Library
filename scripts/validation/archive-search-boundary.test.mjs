import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('ordinary repository search excludes archived Work Orders while history can opt in', () => {
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  const reconciliation = readFileSync(path.join(root, '.agents/skills/change-impact-reconciliation/SKILL.md'), 'utf8');

  assert.match(agents, /ordinary repository discovery and code\/content search must exclude `docs\/work-orders\/archive\/\*\*`/);
  assert.match(agents, /historical, provenance, incident, or recovery evidence/);
  assert.match(agents, /Archived Work Orders are evidence, not current ownership or current-state authority/);

  assert.match(reconciliation, /ordinary current-state impact review, exclude `docs\/work-orders\/archive\/\*\*`/);
  assert.match(reconciliation, /Include archived Work Orders only when the requested scope explicitly requires historical, provenance, incident, or recovery evidence/);
  assert.match(reconciliation, /label that evidence as historical/);
});
