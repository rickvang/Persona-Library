import {readFile, writeFile, copyFile, mkdir, realpath} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {Marked, Renderer} from 'marked';

export const REFERENCE_PAGE_SOURCES = {
  manifest:'content/site-publication.json',
  catalogTemplate:'content/site-pages/playbooks.html',
  guideTemplate:'content/site-pages/guide.html',
  readerTemplate:'content/site-pages/reference-reader.html',
  buildDependencyManifest:'package.json',
  buildDependencyLock:'package-lock.json',
  libraryData:'dist/data/library-data.js',
  libraryModel:'dist/data/library-model.js'
};
const REPO_URL = 'https://github.com/rickvang/Persona-Library/blob/main/';
export const escapeHtml = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const sourceHref = source => REPO_URL + source.split('/').map(encodeURIComponent).join('/');
const plainText = tokens => (tokens || []).map(token => token.type === 'html' ? '' : token.tokens ? plainText(token.tokens) : token.text || '').join('');
const slug = text => text.toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu,'').trim().replace(/\s/g,'-');
const idPattern = /^[a-z][a-z0-9-]*$/;

export function validatePublicationManifest(manifest, data) {
  if (manifest.schema_version !== 'persona-library.site-publication/v1' || !Array.isArray(manifest.documents) || !Array.isArray(manifest.playbooks)) throw new Error('Invalid Site publication manifest');
  const unique = (entries, label) => {
    const ids = new Set();
    for (const entry of entries) {
      if (!idPattern.test(entry.id || '') || ids.has(entry.id)) throw new Error(`Invalid or duplicate ${label}: ${entry.id}`);
      ids.add(entry.id);
    }
    return ids;
  };
  const documentIds = unique(manifest.documents,'published document');
  const playbookIds = unique(manifest.playbooks,'Playbook binding');
  const canonicalIds = unique(data.playbookCatalog || [],'canonical Playbook');
  if (canonicalIds.size !== playbookIds.size || [...canonicalIds].some(id => !playbookIds.has(id)) || [...playbookIds].some(id => !canonicalIds.has(id))) throw new Error('Every canonical Playbook must have exactly one publication binding; bindings cannot invent identities');
  const sources = new Set();
  const aliases = new Set();
  for (const entry of manifest.documents) {
    if (!/^docs\/(?:[a-z0-9-]+\/)*[a-zA-Z0-9-]+\.md$/.test(entry.source || '') || /^docs\/(work-orders|internal|decisions)\//.test(entry.source)) throw new Error(`Unpublishable document source: ${entry.source}`);
    if (sources.has(entry.source)) throw new Error(`Duplicate published source: ${entry.source}`);
    sources.add(entry.source);
    if (!entry.category?.trim()) throw new Error(`Missing document category: ${entry.id}`);
    if (entry.legacyMarkdown) {
      if (!/^docs\/[a-z0-9-]+\.md$/.test(entry.legacyMarkdown) || aliases.has(entry.legacyMarkdown)) throw new Error(`Invalid or duplicate legacy Markdown URL: ${entry.id}`);
      aliases.add(entry.legacyMarkdown);
    }
  }
  const boundSources = new Set();
  for (const entry of manifest.playbooks) {
    if (Boolean(entry.document) === Boolean(entry.overviewSource) || (entry.document && !documentIds.has(entry.document))) throw new Error(`Playbook needs one known document or authored overview: ${entry.id}`);
    if (entry.overviewSource && !/^content\/site-pages\/[a-z0-9-]+-overview\.md$/.test(entry.overviewSource)) throw new Error(`Invalid overview source: ${entry.id}`);
    const binding = entry.document || entry.overviewSource;
    if (boundSources.has(binding)) throw new Error(`Conflicting Playbook source binding: ${binding}`);
    boundSources.add(binding);
    if (!entry.outlineSection?.trim() || !entry.summarySection?.trim() || !idPattern.test(entry.legacyAnchor || '') || aliases.has(entry.legacyAnchor)) throw new Error(`Invalid or duplicate Playbook section binding: ${entry.id}`);
    aliases.add(entry.legacyAnchor);
    if (entry.operatorPersonaId && !(data.personas || []).some(persona => persona.id === entry.operatorPersonaId)) throw new Error(`Unknown operating Persona: ${entry.operatorPersonaId}`);
  }
}

function sectionTokens(tokens, name) {
  const starts = tokens.map((token,index) => token.type === 'heading' && token.depth === 2 && plainText(token.tokens) === name ? index : -1).filter(index => index >= 0);
  if (starts.length !== 1) throw new Error(`Expected one source section: ${name}`);
  const start = starts[0];
  const end = tokens.findIndex((token,index) => index > start && token.type === 'heading' && token.depth <= 2);
  return tokens.slice(start + 1,end < 0 ? tokens.length : end);
}

export function publicationLink(href, source, documentBySource) {
  const value = String(href || '').trim();
  if (!value || /[\u0000-\u001f\u007f\\]/.test(value)) return '';
  if (value.startsWith('#')) return value;
  if (value.startsWith('//')) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; }
  }
  const url = new URL(value,'https://source.invalid/' + source);
  let target;
  try { target = decodeURIComponent(url.pathname.slice(1)); } catch { return ''; }
  if (documentBySource.has(target)) return documentBySource.get(target).href + url.hash;
  // Authored Site overviews use public page links, not repository-relative file links.
  if (source.startsWith('content/site-pages/') && /^content\/site-pages\/[a-z0-9-]+\.html$/.test(target)) return path.posix.basename(target) + url.hash;
  if (/^content\/site-pages\/[a-z0-9-]+\.html$/.test(target)) return path.posix.basename(target) + url.hash;
  return sourceHref(target) + url.hash;
}

export function renderMarkdown(markdown, source, documentBySource = new Map()) {
  const headings = [];
  const counts = new Map();
  const parser = new Marked({gfm:true, renderer:{
    html(token) { return escapeHtml(token.text); },
    heading(token) {
      const label = plainText(token.tokens);
      const base = slug(label) || 'section';
      const count = counts.get(base) || 0;
      counts.set(base,count + 1);
      const id = base + (count ? '-' + count : '');
      headings.push({id,label,depth:token.depth});
      // The reader title owns h1; retain the source heading anchor without a duplicate title.
      if (token.depth === 1) return `<span id="${escapeHtml(id)}"></span>\n`;
      return `<h${token.depth} id="${escapeHtml(id)}">${this.parser.parseInline(token.tokens)}</h${token.depth}>\n`;
    },
    link(token) {
      const href = publicationLink(token.href,source,documentBySource);
      const label = this.parser.parseInline(token.tokens);
      return href ? `<a href="${escapeHtml(href)}"${href.startsWith('https:') ? ' rel="noreferrer"' : ''}>${label}</a>` : label;
    },
    image(token) {
      const href = publicationLink(token.href,source,documentBySource);
      return href ? `<a href="${escapeHtml(href)}" rel="noreferrer">${escapeHtml(token.text || 'Image source')}</a>` : escapeHtml(token.text);
    },
    table(token) { return `<div class="table-scroll" tabindex="0" role="region" aria-label="Reference table">${Renderer.prototype.table.call(this,token)}</div>`; }
  }});
  const tokens = parser.lexer(markdown.replace(/\r\n?/g,'\n'));
  const html = parser.parser(tokens);
  const titles = tokens.filter(token => token.type === 'heading' && token.depth === 1);
  if (titles.length !== 1) throw new Error(`Published source must contain one title: ${source}`);
  return {html,tokens,title:plainText(titles[0].tokens),headings};
}

export function compilePublication(manifest, data, sourceByPath) {
  validatePublicationManifest(manifest,data);
  const documentBySource = new Map(manifest.documents.map(entry => [entry.source,{...entry,href:'doc-' + entry.id + '.html'}]));
  for (const binding of manifest.playbooks) if (binding.document) {
    const entry = manifest.documents.find(doc => doc.id === binding.document);
    documentBySource.get(entry.source).href = binding.id + '.html';
  }
  const compiled = new Map();
  for (const source of new Set([...manifest.documents.map(entry => entry.source),...manifest.playbooks.map(entry => entry.overviewSource).filter(Boolean)])) {
    const markdown = sourceByPath.get(source);
    if (typeof markdown !== 'string') throw new Error(`Missing published source: ${source}`);
    compiled.set(source,{...renderMarkdown(markdown,source,documentBySource),source,sourceHref:sourceHref(source),sourceSha256:createHash('sha256').update(markdown.replace(/\r\n?/g,'\n')).digest('hex')});
  }
  const documents = manifest.documents.map(entry => {
    const doc = compiled.get(entry.source);
    const intro = doc.tokens.find(token => token.type === 'paragraph');
    return {id:entry.id,title:doc.title,summary:plainText(intro?.tokens),category:entry.category,source:entry.source,sourceHref:doc.sourceHref,sourceSha256:doc.sourceSha256,href:documentBySource.get(entry.source).href,headings:doc.headings.filter(heading => heading.depth === 2)};
  });
  const playbooks = Array.from(data.playbookCatalog || [],record => {
    const binding = manifest.playbooks.find(entry => entry.id === record.id);
    const source = binding.overviewSource || manifest.documents.find(doc => doc.id === binding.document).source;
    const doc = compiled.get(source);
    const outlineTokens = sectionTokens(doc.tokens,binding.outlineSection);
    const table = outlineTokens.find(token => token.type === 'table');
    const outline = table ? table.rows.map(row => plainText(row[0].tokens)) : outlineTokens.filter(token => token.type === 'heading' && token.depth === 3).map(token => plainText(token.tokens));
    if (!outline.length) throw new Error(`No source outline found: ${record.id}`);
    const summary = sectionTokens(doc.tokens,binding.summarySection).find(token => token.type === 'paragraph');
    if (!summary) throw new Error(`No source summary found: ${record.id}`);
    const rolesTable = binding.rolesSection && sectionTokens(doc.tokens,binding.rolesSection).find(token => token.type === 'table');
    if (binding.rolesSection && !rolesTable) throw new Error(`No source roles found: ${record.id}`);
    const persona = (data.personas || []).find(persona => persona.id === binding.operatorPersonaId);
    return {...record,summary:plainText(summary.tokens),kind:binding.overviewSource ? 'overview' : 'process',source,sourceHref:doc.sourceHref,sourceSha256:doc.sourceSha256,href:record.id + '.html',legacyAnchor:binding.legacyAnchor,outline,outlineHeading:binding.outlineSection,outlineLabel:binding.outlineSection === 'Stages' ? 'stages' : 'outline sections',roles:rolesTable ? rolesTable.rows.map(row => plainText(row[0].tokens)) : [],operator:persona ? {id:persona.id,name:persona.name,roleLabel:persona.roleLabel} : null};
  });
  return {schema_version:manifest.schema_version,playbooks,documents,compiled};
}

const excerpt = text => text.length > 245 ? text.slice(0,242).trimEnd() + '...' : text;
export function renderPlaybookCard(entry) {
  const meta = [entry.status,`${entry.outline.length} ${entry.outlineLabel}`,entry.roles.length ? `${entry.roles.length} roles` : ''].filter(Boolean);
  return `<article class="tool-card" id="${entry.legacyAnchor}" data-playbook-id="${entry.id}" data-reference-item data-category="${entry.kind}" data-search="${escapeHtml([entry.name,entry.summary,...entry.outline,entry.operator?.name].join(' ').toLowerCase())}">
  <div class="tool-meta"><span class="tag ${entry.kind === 'process' ? 'canonical' : 'capability'}">${entry.kind === 'process' ? 'Documented process' : 'Authored overview'}</span>${meta.map(value => `<span>${escapeHtml(value)}</span>`).join('')}</div>
  <span id="${entry.id}" class="fragment-anchor" aria-hidden="true"></span>
  <h2><a href="${entry.href}">${escapeHtml(entry.name)}</a></h2><p>${escapeHtml(excerpt(entry.summary))}</p>
  ${entry.operator ? `<p class="operator">Operated by <a href="index.html?persona=${entry.operator.id}">${escapeHtml(entry.operator.name + ' \u00b7 ' + entry.operator.roleLabel)}</a></p>` : ''}
  ${entry.kind === 'overview' ? '<p class="overview-warning">Process source not yet bound.</p>' : ''}
  <details class="outline"><summary>${entry.kind === 'overview' ? 'Illustrative sequence' : 'Process outline'}</summary><ol>${entry.outline.map(label => `<li>${escapeHtml(label)}</li>`).join('')}</ol></details>
  <a class="detail-link" href="${entry.href}">${entry.kind === 'overview' ? 'Read overview' : 'Read process'}</a></article>`.replace(/[ \t]+$/gm,'');
}

export function renderDocsIndex(publication) {
  const categories = [...new Set(publication.documents.map(entry => entry.category))];
  return `<div data-reference-catalog><div class="catalog-toolbar"><label class="search"><span class="sr-only">Search reference docs</span><input type="search" data-reference-search placeholder="Search reference docs" autocomplete="off"></label><div class="filters" aria-label="Reference categories"><button class="filter" data-reference-filter="all" aria-pressed="true">All</button>${categories.map(category => `<button class="filter" data-reference-filter="${escapeHtml(category)}" aria-pressed="false">${escapeHtml(category)}</button>`).join('')}</div></div>
  <p class="result-count" data-reference-count role="status">${publication.documents.length} reference documents</p>
  <div class="document-list">${publication.documents.map(entry => `<article class="document-row" data-reference-item data-category="${escapeHtml(entry.category)}" data-search="${escapeHtml([entry.title,entry.summary,entry.category,entry.source,...entry.headings.map(heading => heading.label)].join(' ').toLowerCase())}"><span class="doc-category">${escapeHtml(entry.category)}</span><div><h3><a href="${entry.href}">${escapeHtml(entry.title)}</a></h3><p>${escapeHtml(excerpt(entry.summary))}</p><p class="source-path">${escapeHtml(entry.source)}</p></div></article>`).join('')}</div><p class="empty-state" data-reference-empty hidden>No matching documents.</p></div>`;
}

function replaceMarkers(template, values) {
  let html = template;
  for (const [marker,value] of Object.entries(values)) {
    if (!html.includes(marker)) throw new Error(`Missing reference publication marker: ${marker}`);
    html = html.replaceAll(marker,String(value));
  }
  return html.replace(/^[ \t]+$/gm,'');
}

export function renderReferenceCatalogs(playbooksTemplate, guideTemplate, publication, data) {
  const processCount = publication.playbooks.filter(entry => entry.kind === 'process').length;
  const playbooks = replaceMarkers(playbooksTemplate,{'{{PLAYBOOK_COUNT}}':publication.playbooks.length,'{{PROCESS_COUNT}}':processCount,'{{OVERVIEW_COUNT}}':publication.playbooks.length - processCount,'<!-- PLAYBOOK_CATALOG -->':publication.playbooks.map(renderPlaybookCard).join('\n')});
  const catalogState = (entries,hrefForId) => `<ul class="current-catalog">${entries.map(entry => `<li><a href="${hrefForId(entry.id)}">${escapeHtml(entry.name)}</a><span>${escapeHtml(entry.lifecycleState?.label || entry.status)}; ${escapeHtml(entry.sourceState?.label || entry.source?.availability || 'Source state not declared')}</span></li>`).join('')}</ul>`;
  const examples = publication.playbooks.map(entry => `<div class="source-callout"><div><h3>${entry.legacyAnchor === 'template-lifecycle' ? 'Template lifecycle example' : escapeHtml(entry.name)}</h3><p><strong>${escapeHtml(entry.name)}</strong>: ${escapeHtml(excerpt(entry.summary))}${entry.kind === 'overview' ? ' Authored overview; process source not yet bound.' : ''}</p></div><a class="back" href="playbooks.html#${entry.legacyAnchor}">${entry.kind === 'overview' ? 'Open overview' : 'Open process'}</a></div>`).join('\n');
  const guide = replaceMarkers(guideTemplate,{'<!-- DOCS_INDEX -->':renderDocsIndex(publication),'<!-- PACK_CATALOG_STATE -->':catalogState(data.operatingPackCatalog || [],id => 'operating-packs.html?pack=' + encodeURIComponent(id)),'<!-- TEMPLATE_CATALOG_STATE -->':catalogState(data.templateCatalog || [],id => 'templates.html#' + encodeURIComponent(id)),'<!-- PLAYBOOK_EXAMPLES -->':examples});
  return {playbooks,guide};
}

export function renderReferenceReader(template, entry, doc, publication, isPlaybook) {
  const title = isPlaybook ? entry.name : entry.title;
  const backHref = isPlaybook ? 'playbooks.html#' + entry.legacyAnchor : 'guide.html#reference-docs';
  const related = publication.documents.filter(other => other.href !== entry.href && other.category === (isPlaybook ? publication.documents.find(other => other.source === entry.source)?.category : entry.category));
  return replaceMarkers(template,{
    '{{PAGE_TITLE}}':escapeHtml(title), '{{BACK_HREF}}':backHref, '{{BACK_LABEL}}':isPlaybook ? 'Playbooks' : 'Docs',
    '{{PLAYBOOK_CURRENT}}':isPlaybook ? 'aria-current="page"' : '', '{{DOCS_CURRENT}}':isPlaybook ? '' : 'aria-current="page"',
    '<!-- READER_SOURCE_TITLE -->':isPlaybook && doc.title !== title ? `<p class="lede">${escapeHtml(doc.title)}</p>` : '',
    '{{KIND_LABEL}}':isPlaybook ? entry.kind === 'overview' ? 'Authored overview' : 'Documented process' : escapeHtml(entry.category),
    '{{SOURCE_HREF}}':doc.sourceHref, '{{SOURCE_PATH}}':escapeHtml(doc.source),
    '<!-- READER_BOUNDARY -->':isPlaybook ? `<p class="boundary-note">${entry.kind === 'overview' ? 'This authored overview is not a bound process contract.' : 'This is the documented process, not an observed request trace.'} It does not show whether your assistant followed it.</p>` : '',
    '<!-- READER_TOC -->':doc.headings.filter(heading => heading.depth === 2).map(heading => `<a href="#${escapeHtml(heading.id)}">${escapeHtml(heading.label)}</a>`).join('\n'),
    '<!-- READER_BODY -->':doc.html,
    '<!-- READER_RELATED -->':related.length ? `<section class="related-docs"><h2>Related references</h2><ul>${related.map(other => `<li><a href="${other.href}">${escapeHtml(other.title)}</a></li>`).join('')}</ul></section>` : ''
  });
}

export async function loadPublication(root, data) {
  const manifest = JSON.parse(await readFile(path.join(root,REFERENCE_PAGE_SOURCES.manifest),'utf8'));
  validatePublicationManifest(manifest,data);
  const sources = new Set([...manifest.documents.map(entry => entry.source),...manifest.playbooks.map(entry => entry.overviewSource).filter(Boolean)]);
  const sourceByPath = new Map();
  const realRoot = await realpath(root);
  for (const source of sources) {
    const resolved = await realpath(path.join(root,source));
    const relative = path.relative(realRoot,resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Published source escapes repository: ${source}`);
    sourceByPath.set(source,await readFile(resolved,'utf8'));
  }
  return {manifest,publication:compilePublication(manifest,data,sourceByPath)};
}

export async function buildReferencePages(root) {
  const sandbox = {window:{}};
  vm.runInNewContext(await readFile(path.join(root,REFERENCE_PAGE_SOURCES.libraryData),'utf8'),sandbox);
  vm.runInNewContext(await readFile(path.join(root,REFERENCE_PAGE_SOURCES.libraryModel),'utf8'),sandbox);
  const data = sandbox.window.PersonaLibraryData;
  const {manifest,publication} = await loadPublication(root,data);
  const catalogs = renderReferenceCatalogs(await readFile(path.join(root,REFERENCE_PAGE_SOURCES.catalogTemplate),'utf8'),await readFile(path.join(root,REFERENCE_PAGE_SOURCES.guideTemplate),'utf8'),publication,data);
  await writeFile(path.join(root,'dist/playbooks.html'),catalogs.playbooks,'utf8');
  await writeFile(path.join(root,'dist/guide.html'),catalogs.guide,'utf8');
  const reader = await readFile(path.join(root,REFERENCE_PAGE_SOURCES.readerTemplate),'utf8');
  for (const [entries,isPlaybook] of [[publication.playbooks,true],[publication.documents.filter(entry => !publication.playbooks.some(playbook => playbook.href === entry.href)),false]]) {
    for (const entry of entries) await writeFile(path.join(root,'dist',entry.href),renderReferenceReader(reader,entry,publication.compiled.get(entry.source),publication,isPlaybook),'utf8');
  }
  for (const entry of manifest.documents) if (entry.legacyMarkdown) {
    await mkdir(path.dirname(path.join(root,'dist',entry.legacyMarkdown)),{recursive:true});
    await copyFile(path.join(root,entry.source),path.join(root,'dist',entry.legacyMarkdown));
  }
  const {compiled,...projection} = publication;
  await writeFile(path.join(root,'dist/data/site-publication.json'),JSON.stringify(projection,null,2) + '\n','utf8');
  console.log(`Published ${publication.playbooks.length} Playbooks and ${publication.documents.length} curated Docs from their declared sources`);
}
