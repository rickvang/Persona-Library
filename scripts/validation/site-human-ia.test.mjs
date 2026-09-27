import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('public Docs progressively disclose the human model before agent machinery', () => {
  const guide = readFileSync(path.join(root, 'content/site-pages/guide.html'), 'utf8');
  const dist = readFileSync(path.join(root, 'dist/guide.html'), 'utf8');

  for (const html of [guide, dist]) {
    const system = html.indexOf('id="system-overview"');
    const library = html.indexOf('id="library-model"');
    const coordination = html.indexOf('id="work-coordination"');
    const agent = html.indexOf('id="agent-orientation"');

    assert.ok(system >= 0, 'missing human system overview');
    assert.ok(library > system, 'Library knowledge model should follow human overview');
    assert.ok(coordination > library, 'work/coordination should follow Library knowledge model');
    assert.ok(agent > coordination, 'agent orientation must come after human-facing mental models');

    assert.match(html, /Place → Work → Truth → Coordination/);
    assert.match(html, /persona-workspace\/blob\/main\/docs\/HOW-IT-WORKS\.md/);
    assert.match(html, /<h2>Library knowledge model<\/h2>/);
    assert.doesNotMatch(html, /<h2>The mental model<\/h2>/);
    assert.match(html, /<h2>Work and coordination<\/h2>/);
    assert.match(html, /Current Work/);
    assert.match(html, /Work Order/);
    assert.match(html, /Riley \+ Work Graph/);
    assert.match(html, /Verification Queue/);
    assert.match(html, /What is true right now\?/);
    assert.match(html, /Advanced: agent &amp; maintainer orientation/);
    assert.match(html, /Ordinary Persona-Library use does not require understanding the orientation bootstrap/);
  }
});

test('homepage remains Persona-first rather than becoming a Workspace dashboard', () => {
  const index = readFileSync(path.join(root, 'content/site-pages/index.html'), 'utf8');
  assert.match(index, /Make the user visible in the room\./);
  assert.match(index, /A shared shelf of working personas/);
  assert.doesNotMatch(index, /Place → Work → Truth → Coordination/);
});
