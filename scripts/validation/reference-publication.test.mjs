import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {loadValidationContext} from './context.mjs';
import {compilePublication, validatePublicationManifest, renderReferenceCatalogs, renderReferenceReader, renderMarkdown, publicationLink, REFERENCE_PAGE_SOURCES} from '../build-reference-pages.mjs';
import {deriveSourceGeneratedGraph} from '../build-technical-system-maps.mjs';

const {root,data} = await loadValidationContext();
const read = relative => readFile(path.join(root,relative),'utf8');
const manifest = JSON.parse(await read(REFERENCE_PAGE_SOURCES.manifest));
const sourceByPath = new Map();
for (const source of [...manifest.documents.map(entry => entry.source),...manifest.playbooks.map(entry => entry.overviewSource).filter(Boolean)]) sourceByPath.set(source,await read(source));
const publication = compilePublication(manifest,data,sourceByPath);
const templates = {playbooks:await read(REFERENCE_PAGE_SOURCES.catalogTemplate),guide:await read(REFERENCE_PAGE_SOURCES.guideTemplate),reader:await read(REFERENCE_PAGE_SOURCES.readerTemplate)};

test('publication binds the existing catalog without promoting the source-less overview', () => {
  assert.deepEqual(publication.playbooks.map(entry => entry.id),Array.from(data.playbookCatalog,entry => entry.id));
  assert.equal(publication.playbooks.filter(entry => entry.kind === 'process').length,4);
  const overview = publication.playbooks.find(entry => entry.kind === 'overview');
  assert.equal(overview.id,'playbook-create-and-integrate-reusable-skill');
  assert.equal(overview.source,'content/site-pages/skill-formation-overview.md');
  const catalogs = renderReferenceCatalogs(templates.playbooks,templates.guide,publication,data);
  assert.match(catalogs.playbooks,/Process source not yet bound/);
  assert.match(renderReferenceReader(templates.reader,overview,publication.compiled.get(overview.source),publication,true),/not a bound process contract/);
});

test('an edited process reaches its card, Guide, reader, and map projection', () => {
  const sources = new Map(sourceByPath);
  const source = 'docs/playbooks/bounded-parallel-implementation.md';
  sources.set(source,sources.get(source).replace('Produce a small set','Source-propagation fixture: produce a small set').replace('## Usage containment','### 8. Unique fixture stage\n\nFixture stage body.\n\n## Usage containment'));
  const changed = compilePublication(manifest,data,sources);
  const entry = changed.playbooks.find(entry => entry.id === 'playbook-bounded-parallel-implementation');
  const catalogs = renderReferenceCatalogs(templates.playbooks,templates.guide,changed,data);
  assert.match(catalogs.playbooks,/Source-propagation fixture/);
  assert.match(catalogs.guide,/Source-propagation fixture/);
  assert.match(catalogs.playbooks,/9 stages/);
  assert.equal(entry.outline.at(-1),'8. Unique fixture stage');
  assert.match(renderReferenceReader(templates.reader,entry,changed.compiled.get(source),changed,true),/Fixture stage body/);
  assert.match(JSON.stringify(changed.playbooks),/Unique fixture stage/);
  assert.notEqual(entry.sourceSha256,publication.playbooks.find(record => record.id === entry.id).sourceSha256);
});

test('catalog status and operating Persona are derived from existing identities', () => {
  const changedData = structuredClone(data);
  changedData.playbookCatalog[0].status = 'Fixture status';
  changedData.personas.find(persona => persona.id === 'job-search-orchestrator').name = 'Fixture operator';
  const changed = compilePublication(manifest,changedData,sourceByPath);
  const catalogs = renderReferenceCatalogs(templates.playbooks,templates.guide,changed,changedData);
  assert.match(catalogs.playbooks,/Fixture status/);
  assert.match(catalogs.playbooks,/Fixture operator/);
  assert.equal(changed.playbooks[0].operator.id,'job-search-orchestrator');
});

test('table-defined and heading-defined outlines preserve source order without inferred stages', () => {
  const collaboration = publication.playbooks.find(entry => entry.id === 'playbook-multi-persona-collaboration');
  assert.deepEqual(collaboration.outline,['Frame','Select','Contribute','Synthesize','Build','Review','Handoff / recover','Close']);
  const bounded = publication.playbooks.find(entry => entry.id === 'playbook-bounded-parallel-implementation');
  assert.equal(bounded.outline[0],'0. Orientation preflight');
  assert.equal(bounded.outline[1],'1. Ground candidate workstreams in target-repository source');
  assert.deepEqual(bounded.roles,['Coordinator','Implementer','Reviewer','Authorizer']);
  const jobSearch = publication.playbooks.find(entry => entry.id === 'playbook-evidence-led-job-search');
  assert.equal(jobSearch.outlineLabel,'outline sections');
  assert.ok(jobSearch.outline.some(title => title.startsWith('Application preflight')));
});

test('a new explicitly curated source gets an index row and reader without custom page edits', () => {
  const editedManifest = structuredClone(manifest);
  editedManifest.documents.push({id:'fixture-reference',source:'docs/fixture-reference.md',category:'Processes'});
  const sources = new Map(sourceByPath);
  sources.set('docs/fixture-reference.md','# New fixture reference\n\nUnique document purpose.\n\n## Unique document section\n\nDocument body.');
  const changed = compilePublication(editedManifest,data,sources);
  const entry = changed.documents.at(-1);
  const catalogs = renderReferenceCatalogs(templates.playbooks,templates.guide,changed,data);
  assert.match(catalogs.guide,/New fixture reference/);
  assert.equal(entry.href,'doc-fixture-reference.html');
  assert.match(renderReferenceReader(templates.reader,entry,changed.compiled.get(entry.source),changed,false),/Document body/);
});

test('missing, conflicting, unknown, and duplicate bindings reject publication', () => {
  const missing = structuredClone(manifest); missing.playbooks.pop();
  assert.throws(() => validatePublicationManifest(missing,data),/exactly one/);
  const conflict = structuredClone(manifest); conflict.playbooks[0].overviewSource = 'content/site-pages/fixture-overview.md';
  assert.throws(() => validatePublicationManifest(conflict,data),/one known document or authored overview/);
  const duplicate = structuredClone(manifest); duplicate.playbooks.push({...duplicate.playbooks[0]});
  assert.throws(() => validatePublicationManifest(duplicate,data),/duplicate Playbook binding/);
  const unknown = structuredClone(manifest); unknown.playbooks[0].document = 'unknown';
  assert.throws(() => validatePublicationManifest(unknown,data),/one known document/);
  const operator = structuredClone(manifest); operator.playbooks[0].operatorPersonaId = 'unknown';
  assert.throws(() => validatePublicationManifest(operator,data),/Unknown operating Persona/);
  const shared = structuredClone(manifest); shared.playbooks[2].document = shared.playbooks[0].document;
  assert.throws(() => validatePublicationManifest(shared,data),/Conflicting Playbook source binding/);
  const aliases = structuredClone(manifest); aliases.playbooks[1].legacyAnchor = aliases.playbooks[0].legacyAnchor;
  assert.throws(() => validatePublicationManifest(aliases,data),/duplicate Playbook section/);
  const documents = structuredClone(manifest); documents.documents[1].source = documents.documents[0].source;
  assert.throws(() => validatePublicationManifest(documents,data),/Duplicate published source/);
});

test('missing sources and missing or ambiguous outline sections fail instead of making up data', () => {
  const absent = new Map(sourceByPath); absent.delete('docs/playbooks/template-lifecycle.md');
  assert.throws(() => compilePublication(manifest,data,absent),/Missing published source/);
  const source = 'docs/playbooks/template-lifecycle.md';
  for (const replacement of ['## No stages','## Stages\n\n## Stages']) {
    const sources = new Map(sourceByPath); sources.set(source,sources.get(source).replace('## Stages',replacement));
    assert.throws(() => compilePublication(manifest,data,sources),/Expected one source section: Stages/);
  }
});

test('curation rejects prototype, internal, archive, and traversal paths', () => {
  for (const source of ['content/prototypes/fixture.md','docs/work-orders/fixture.md','docs/work-orders/archive/fixture.md','docs/internal/fixture.md','docs/decisions/fixture.md','docs/../fixture.md','../docs/fixture.md','docs\\fixture.md']) {
    const editedManifest = structuredClone(manifest); editedManifest.documents[0].source = source;
    assert.throws(() => validatePublicationManifest(editedManifest,data),/Unpublishable document source/);
  }
  const fixture = new Map(sourceByPath); fixture.set('docs/unselected.md','# Unselected fixture');
  const output = compilePublication(manifest,data,fixture);
  assert.ok(!JSON.stringify(output.documents).includes('Unselected fixture'));
  assert.ok(!JSON.stringify(output).includes('proto-'));
});

test('Markdown renders real lists and tables while escaping HTML and unsafe links', () => {
  const markdown = '# Safety\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(2)>\n\n[Bad](javascript:alert%281%29) [Good](https://example.com/?a=1&b=2)\n\n![Image](data:text/html;base64,abcd)\n\n- List item\n\n| Column | Value |\n| --- | --- |\n| Cell | Text |';
  const {html} = renderMarkdown(markdown,'docs/safety.md');
  assert.doesNotMatch(html,/<script|<img|href="javascript:|src="data:/);
  assert.match(html,/&lt;script&gt;/);
  assert.match(html,/<ul>/); assert.match(html,/<table>/);
  assert.match(html,/href="https:\/\/example.com\/\?a=1&amp;b=2"/);
  assert.match(html,/role="region" aria-label="Reference table"/);
});

test('relative curated references stay in the Site; unselected sources stay at their owner', () => {
  const docs = new Map([['docs/collaboration/problem-context.md',{href:'doc-problem-context.html'}],['docs/playbooks/template-lifecycle.md',{href:'playbook-template-lifecycle.html'}]]);
  assert.equal(publicationLink('../collaboration/problem-context.md#shared-state','docs/playbooks/fixture.md',docs),'doc-problem-context.html#shared-state');
  assert.equal(publicationLink('template-lifecycle.md','docs/playbooks/fixture.md',docs),'playbook-template-lifecycle.html');
  assert.equal(publicationLink('guide.html#skill-authoring','content/site-pages/skill-formation-overview.md',docs),'guide.html#skill-authoring');
  assert.equal(publicationLink('../../AGENTS.md','docs/playbooks/fixture.md',docs),'https://github.com/rickvang/Persona-Library/blob/main/AGENTS.md');
  for (const href of ['javascript:alert(1)','data:text/html,fixture','//unsafe.example','https://user:secret@example.com','https:\\unsafe.example']) assert.equal(publicationLink(href,'docs/fixture.md',docs),'');
});

test('readers expose stable heading anchors, section navigation, and related references without JS', () => {
  const entry = publication.playbooks.find(entry => entry.id === 'playbook-multi-persona-collaboration');
  const html = renderReferenceReader(templates.reader,entry,publication.compiled.get(entry.source),publication,true);
  assert.match(html,/id="stages"/); assert.match(html,/href="#stages"/);
  assert.match(html,/doc-problem-context.html/);
  assert.match(html,/documented process, not an observed request trace/);
  assert.doesNotMatch(html,/\{\{|<!-- READER_/);
  assert.match(html,/<table>/);
  const duplicate = renderMarkdown('# Heading\n\n## Repeated\n\nText\n\n## Repeated\n\nText','docs/fixture.md');
  assert.deepEqual(duplicate.headings.map(heading => heading.id),['heading','repeated','repeated-1']);
});

test('optional reader sections and catalogs do not leave whitespace-only lines', () => {
  const catalogs = renderReferenceCatalogs(templates.playbooks,templates.guide,publication,data);
  const readers = [...publication.playbooks,...publication.documents].map(entry => renderReferenceReader(templates.reader,entry,publication.compiled.get(entry.source),publication,'kind' in entry));
  for (const html of [...Object.values(catalogs),...readers]) assert.doesNotMatch(html,/^[ \t]+$/m);
  const entry = publication.documents[0];
  const doc = {...publication.compiled.get(entry.source),...renderMarkdown('# Code fixture\n\n```text\n  nonblank code  \n```',entry.source)};
  assert.match(renderReferenceReader(templates.reader,entry,doc,publication,false),/  nonblank code  \n/);
});

test('legacy catalog fragments and the three existing Markdown URLs remain published', async () => {
  const html = await read('dist/playbooks.html');
  for (const entry of publication.playbooks) {
    assert.ok(html.includes(`id="${entry.id}"`)); assert.ok(html.includes(`id="${entry.legacyAnchor}"`));
    assert.ok((await read('dist/' + entry.href)).includes(entry.name));
  }
  for (const entry of manifest.documents.filter(entry => entry.legacyMarkdown)) assert.equal(await read('dist/' + entry.legacyMarkdown),await read(entry.source));
  const names = await readdir(path.join(root,'dist'));
  assert.equal(names.filter(name => name.startsWith('playbook-') && name.endsWith('.html')).length,publication.playbooks.length);
  assert.equal(names.filter(name => name.startsWith('doc-') && name.endsWith('.html')).length,publication.documents.length - 4);
});

test('Guide catalog states and Playbook examples are derived, not stale handwritten snapshots', () => {
  const editedData = structuredClone(data);
  editedData.templateCatalog[0].name = 'Fixture Template name';
  editedData.templateCatalog[0].status = 'Fixture status';
  editedData.operatingPackCatalog[0].name = 'Fixture pack name';
  const html = renderReferenceCatalogs(templates.playbooks,templates.guide,publication,editedData).guide;
  assert.match(html,/Fixture Template name/); assert.match(html,/Fixture pack name/);
  assert.doesNotMatch(html,/main revision contains only|three design-system Template identities are planned|A broader playbooks skill can later/);
});

test('source/generated graph records actual publication inputs and build outputs', async () => {
  const graph = await deriveSourceGeneratedGraph(root);
  const step = 'build-step:scripts/build-reference-pages.mjs';
  for (const input of [...Object.values(REFERENCE_PAGE_SOURCES),...manifest.documents.map(entry => entry.source)]) assert.ok(graph.edges.some(edge => edge.from === 'file:' + input && edge.to === step && edge.relationship === 'consumed-by'),input);
  for (const output of ['dist/playbooks.html','dist/guide.html','dist/data/site-publication.json',...publication.playbooks.map(entry => 'dist/' + entry.href)]) assert.ok(graph.edges.some(edge => edge.from === step && edge.to === 'file:' + output && edge.relationship === 'generates'),output);
  assert.ok(!graph.edges.some(edge => edge.from === 'file:content/site-pages/playbooks.html' && edge.to === 'file:dist/playbooks.html' && edge.relationship === 'copied-to'));
});
