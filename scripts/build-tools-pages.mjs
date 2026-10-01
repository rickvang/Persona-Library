import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {buildToolEntries, renderToolCard, renderToolRecipe} from '../client/tool-catalog.mjs';

export const TOOL_PAGE_SOURCES = {
  template:'content/site-pages/tools.html',
  projection:'client/tool-catalog.mjs',
  libraryData:'dist/data/library-data.js',
  libraryModel:'dist/data/library-model.js'
};

export function renderToolsPage(template, data) {
  const entries = buildToolEntries(data);
  const replacements = {
    '{{CANONICAL_COUNT}}':entries.filter(entry => entry.kind === 'canonical').length,
    '{{CANONICAL_NOUN}}':entries.filter(entry => entry.kind === 'canonical').length === 1 ? 'Tool' : 'Tools',
    '{{REFERENCE_COUNT}}':entries.filter(entry => entry.kind === 'reference').length,
    '{{CAPABILITY_COUNT}}':entries.filter(entry => entry.kind === 'capability').length,
    '{{ENTRY_COUNT}}':entries.length,
    '<!-- TOOL_CATALOG -->':entries.map(renderToolCard).join('\n'),
    '<!-- TOOL_RECIPES -->':(data.toolUseRecipes || []).map(recipe => renderToolRecipe(recipe,data)).join('\n')
  };
  let html = template;
  for (const [marker,value] of Object.entries(replacements)) {
    if (!html.includes(marker)) throw new Error('Tools page template is missing ' + marker);
    html = html.replaceAll(marker,String(value));
  }
  return html;
}

export async function buildToolsPage(root) {
  const sandbox = {window:{}};
  vm.runInNewContext(await readFile(path.join(root,TOOL_PAGE_SOURCES.libraryData),'utf8'),sandbox);
  vm.runInNewContext(await readFile(path.join(root,TOOL_PAGE_SOURCES.libraryModel),'utf8'),sandbox);
  const template = await readFile(path.join(root,TOOL_PAGE_SOURCES.template),'utf8');
  await writeFile(path.join(root,'dist/tools.html'),renderToolsPage(template,sandbox.window.PersonaLibraryData),'utf8');
}
