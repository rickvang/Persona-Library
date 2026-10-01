import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadValidationContext} from './context.mjs';
import {buildToolEntries,filterToolEntries,renderToolCard,renderToolDetail} from '../../client/tool-catalog.mjs';
import {renderToolsPage,TOOL_PAGE_SOURCES} from '../build-tools-pages.mjs';
import {deriveSourceGeneratedGraph} from '../build-technical-system-maps.mjs';

const context = await loadValidationContext();
const data = context.data;
const template = await readFile(new URL('../../content/site-pages/tools.html',import.meta.url),'utf8');

test('Tools keeps canonical identities distinct from migrated presentation references', () => {
  const entries = buildToolEntries(data);
  assert.deepEqual(Array.from(entries.filter(entry => entry.kind === 'canonical'),entry => entry.id),Array.from(data.toolCatalog,entry => entry.id));
  assert.equal(entries.filter(entry => entry.kind === 'reference').length,5);
  assert.equal(entries.filter(entry => entry.kind === 'capability').length,2);
  assert.equal(entries.length,data.toolCatalog.length + data.toolReferences.length);
  assert.ok(entries.filter(entry => entry.kind !== 'canonical').every(entry => !renderToolCard(entry).includes('data-tool-id')));
});

test('a source edit reaches catalog and focused detail without editing either page', () => {
  const edited = structuredClone(data);
  edited.toolCatalog[0].name = 'Vercel fixture';
  edited.toolCatalog[0].capability = 'Unique fixture capability';
  edited.toolCatalog[0].scope = 'Unique fixture scope';
  edited.toolCatalog[0].permission = 'Unique fixture permission';
  edited.toolUseRecipes.find(recipe => recipe.toolId === 'tool-vercel').tool = 'Vercel fixture';
  edited.personaToolRequirements.find(requirement => requirement.preferredToolId === 'tool-vercel').preferredTool = 'Vercel fixture';
  const entry = buildToolEntries(edited)[0];
  const catalog = renderToolsPage(template,edited);
  const detail = renderToolDetail(entry,edited);
  for (const text of ['Vercel fixture','Unique fixture capability','Unique fixture scope']) {
    assert.ok(catalog.includes(text));assert.ok(detail.includes(text));
  }
  assert.ok(detail.includes('Unique fixture permission'));
  assert.equal(entry.href,'tool.html?id=tool-vercel');
});

test('a new canonical source record gets a card and detail without page-specific fixtures', () => {
  const edited = structuredClone(data);
  edited.toolCatalog.push({...edited.toolCatalog[0],id:'tool-fixture',name:'Fixture Tool',toolUseRecipeIds:['recipe-fixture']});
  edited.toolUseRecipes.push({...edited.toolUseRecipes.find(recipe => recipe.toolId === 'tool-vercel'),id:'recipe-fixture',toolId:'tool-fixture',tool:'Fixture Tool'});
  const entries = buildToolEntries(edited);
  const html = renderToolsPage(template,edited);
  assert.equal(entries.filter(entry => entry.kind === 'canonical').length,2);
  assert.match(html, /<strong>2<\/strong> canonical Tools/);
  assert.match(html, /data-tool-id="tool-fixture"/);
  assert.match(renderToolDetail(entries.find(entry => entry.id === 'tool-fixture'),edited), /Fixture Tool/);
});

test('canonical recipe bindings never resolve by similar Tool names', () => {
  const edited = structuredClone(data);
  edited.toolUseRecipes.push({...edited.toolUseRecipes[0],id:'recipe-name-only',tool:'Vercel'});
  const entry = buildToolEntries(edited).find(entry => entry.id === 'tool-vercel');
  assert.deepEqual(entry.recipes.map(recipe => recipe.id),['recipe-riley-vercel-review-checkpoint']);
  assert.equal(entry.requirements.length,1);
});

test('missing, conflicting, and promoted reference bindings fail publication', () => {
  const missing = structuredClone(data);
  missing.toolCatalog[0].toolUseRecipeIds.push('recipe-missing');
  assert.throws(() => buildToolEntries(missing),/Unknown recipe/);
  const conflict = structuredClone(data);
  conflict.toolCatalog[0].toolUseRecipeIds.push('recipe-figma-hierarchy-inspection');
  assert.throws(() => buildToolEntries(conflict),/disagrees with canonical identity/);
  const promoted = structuredClone(data);
  promoted.toolReferences[0].recipeIds.push('recipe-riley-vercel-review-checkpoint');
  assert.throws(() => buildToolEntries(promoted),/canonical recipe cannot/);
  const duplicate = structuredClone(data);
  duplicate.toolReferences.push({...duplicate.toolReferences[0]});
  assert.throws(() => buildToolEntries(duplicate),/Duplicate/);
});

test('search combines kinds, source descriptions, and recipe titles', () => {
  const entries = buildToolEntries(data);
  assert.equal(filterToolEntries(entries,{kind:'canonical'}).length,data.toolCatalog.length);
  assert.equal(filterToolEntries(entries,{query:'  fIgMa  '})[0].id,'reference-figma');
  assert.equal(filterToolEntries(entries,{kind:'reference',query:'hierarchy'})[0].id,'reference-figma');
  assert.equal(filterToolEntries(entries,{query:'nonexistent-fixture-term'}).length,0);
});

test('published source text is escaped and reference URLs cannot execute scripts', () => {
  const edited = structuredClone(data);
  edited.toolReferences[0].summary = '<script>alert("fixture")</script>';
  edited.toolReferences[0].resources = [{label:'Unsafe link',href:'javascript:alert(1)'}];
  const entry = buildToolEntries(edited).find(entry => entry.id === 'reference-figma');
  for (const html of [renderToolCard(entry),renderToolDetail(entry,edited)]) {
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(!html.includes('<script>'));
    assert.ok(!html.includes('href="javascript:'));
  }
});

test('published catalog and browser modules reproduce their shared authored sources', async () => {
  assert.equal(context.files.toolsPage,renderToolsPage(template,data));
  assert.ok(!context.files.toolsPage.includes('{{'));
  for (const file of ['tool-catalog.mjs','tool-page.mjs','tool-pages.css']) {
    const output = file.endsWith('.css') ? 'dist/css/' + file : 'dist/js/' + file;
    assert.equal(await context.readFile('client/' + file),await context.readFile(output));
  }
});

test('the source graph declares catalog publication rather than a direct HTML copy', async () => {
  const graph = await deriveSourceGeneratedGraph();
  const step = 'build-step:scripts/build-tools-pages.mjs';
  assert.ok(graph.edges.some(edge => edge.from === step && edge.to === 'file:dist/tools.html' && edge.relationship === 'generates'));
  for (const input of Object.values(TOOL_PAGE_SOURCES)) {
    assert.ok(graph.edges.some(edge => edge.from === 'file:' + input && edge.relationship === (input.startsWith('dist/') ? 'consumed-by' : 'contributes-to')));
  }
  assert.ok(!graph.edges.some(edge => edge.from === 'file:content/site-pages/tools.html' && edge.relationship === 'copied-to'));
  const mapClient = await context.readFile('client/system-map-simple.mjs');
  assert.ok(mapClient.includes('buildToolEntries(data).filter(entry => entry.kind === \'canonical\')'));
  assert.ok(!mapClient.includes('recipe.tool === record.name'));
});
