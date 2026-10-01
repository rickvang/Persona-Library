const SOURCE = 'https://github.com/rickvang/Persona-Library/blob/main/content/library-data/tool-integration.js';

export const toolDetailHref = id => 'tool.html?id=' + encodeURIComponent(id);
export const escapeHtml = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const label = kind => ({canonical:'Canonical Tool',reference:'Reference',capability:'Capability need'})[kind];
const externalLink = resource => /^https:\/\//.test(resource.href || '')
  ? '<a href="' + escapeHtml(resource.href) + '">' + escapeHtml(resource.label) + '</a>' : escapeHtml(resource.label);

export function buildToolEntries(data) {
  const recipes = new Map((data.toolUseRecipes || []).map(recipe => [recipe.id, recipe]));
  const ids = new Set();
  const take = (id, kind) => {
    if (!id || ids.has(id)) throw new Error('Duplicate or missing Tool presentation ID: ' + id);
    if (kind !== 'canonical' && !id.startsWith('reference-')) throw new Error('Tool references must use presentation-only IDs: ' + id);
    ids.add(id);
  };
  const resolveRecipes = (owner, declaredIds) => (declaredIds || []).map(id => {
    const recipe = recipes.get(id);
    if (!recipe) throw new Error('Unknown recipe in Tool presentation: ' + owner + ' -> ' + id);
    return recipe;
  });
  const entries = (data.toolCatalog || []).map(record => {
    take(record.id, 'canonical');
    const linked = resolveRecipes(record.id, record.toolUseRecipeIds);
    if (linked.some(recipe => recipe.toolId !== record.id)) throw new Error('Tool recipe binding disagrees with canonical identity: ' + record.id);
    return {...record, kind:'canonical', summary:record.capability, href:toolDetailHref(record.id),
      recipes:linked, requirements:(data.personaToolRequirements || []).filter(requirement => requirement.preferredToolId === record.id),
      sourceHref:SOURCE};
  });
  for (const reference of data.toolReferences || []) {
    if (!['reference','capability'].includes(reference.kind)) throw new Error('Invalid Tool reference kind: ' + reference.id);
    if (['name','category','summary','scope','risk'].some(key => !reference[key])) throw new Error('Incomplete Tool presentation reference: ' + reference.id);
    take(reference.id, reference.kind);
    const linked = resolveRecipes(reference.id, reference.recipeIds);
    if (linked.some(recipe => recipe.toolId)) throw new Error('A canonical recipe cannot be assigned to a presentation reference: ' + reference.id);
    entries.push({...reference, href:toolDetailHref(reference.id), recipes:linked, requirements:[], sourceHref:SOURCE});
  }
  return entries;
}

export function filterToolEntries(entries, {kind = 'all', query = ''} = {}) {
  const term = query.trim().toLocaleLowerCase();
  return entries.filter(entry => (kind === 'all' || entry.kind === kind) &&
    [entry.name, entry.summary, entry.category, entry.scope, ...entry.recipes.map(recipe => recipe.title)].join(' ').toLocaleLowerCase().includes(term));
}

export function renderToolCard(entry) {
  const identity = entry.kind === 'canonical' ? ' data-tool-id="' + escapeHtml(entry.id) + '"' : '';
  const search = [entry.name,entry.summary,entry.category,entry.scope,...entry.recipes.map(recipe => recipe.title)].join(' ');
  const legacyRecipe = entry.recipes.find(recipe => recipe.id === 'recipe-riley-vercel-review-checkpoint');
  return '<article class="tool-card" id="' + escapeHtml(entry.id) + '"' + identity + ' data-entry-kind="' + entry.kind + '" data-search="' + escapeHtml(search) + '">' +
    '<div class="tool-meta"><span class="tag ' + entry.kind + '">' + label(entry.kind) + '</span><span>' + escapeHtml(entry.category) + '</span></div>' +
    '<h3>' + escapeHtml(entry.name) + '</h3><p>' + escapeHtml(entry.summary) + '</p>' +
    '<dl class="compact-facts"><div><dt>Scope</dt><dd>' + escapeHtml(entry.scope) + '</dd></div><div><dt>Runtime access</dt><dd>Not checked here</dd></div><div class="risk"><dt>Risk</dt><dd>' + escapeHtml(entry.risk) + '</dd></div></dl>' +
    '<a class="detail-link" href="' + escapeHtml(entry.href) + '">View ' + escapeHtml(entry.name) + ' details</a>' +
    (legacyRecipe ? '<a class="detail-link" href="#recipe-vercel-review-checkpoint">Linked review-checkpoint recipe</a>' : '') +
    (entry.kind !== 'canonical' ? (entry.resources || []).map(resource => '<p class="source-link">' + externalLink(resource) + '</p>').join('') : '') + '</article>';
}

const facts = pairs => '<dl class="facts">' + pairs.filter(([, value]) => value).map(([title, value]) =>
  '<div><dt>' + escapeHtml(title) + '</dt><dd>' + escapeHtml(value) + '</dd></div>').join('') + '</dl>';

export function renderToolRecipe(recipe, data) {
  const skill = (data.skillCatalog || []).find(item => item.id === recipe.skillId);
  const personas = (data.personas || []).filter(persona => recipe.personaIds?.includes(persona.id));
  const legacyAnchor = recipe.id === 'recipe-riley-vercel-review-checkpoint' ? '<span id="recipe-vercel-review-checkpoint"></span>' : '';
  return legacyAnchor + '<details class="recipe" id="' + escapeHtml(recipe.id) + '"><summary><span><strong>' + escapeHtml(recipe.title) + '</strong><span>' + escapeHtml(recipe.tool) + ' / ' + escapeHtml(recipe.mode) + '</span></span></summary><div class="recipe-body">' +
    '<p>' + escapeHtml(recipe.when) + '</p>' + facts([['Requires',recipe.requires],['Output',recipe.output],['Fallback',recipe.fallback],['Evidence status',recipe.status]]) +
    '<ol>' + (recipe.steps || []).map(step => '<li>' + escapeHtml(step) + '</li>').join('') + '</ol>' +
    (skill ? '<p>Skill: <a href="skills.html?skill=' + encodeURIComponent(skill.id) + '">' + escapeHtml(skill.name) + '</a></p>' : '') +
    (personas.length ? '<p>Personas: ' + personas.map(persona => '<a href="index.html?persona=' + encodeURIComponent(persona.id) + '">' + escapeHtml(persona.name) + '</a>').join(', ') + '</p>' : '') +
    '<p>' + (recipe.toolId ? '<a href="' + toolDetailHref(recipe.toolId) + '">Canonical Tool record</a>' : 'Tool named in recipe; no canonical Tool binding is declared.') + '</p></div></details>';
}

export function renderToolDetail(entry, data) {
  const canonical = entry.kind === 'canonical';
  const personas = (data.personas || []).filter(persona => entry.personaIds?.includes(persona.id));
  const skills = (data.skillCatalog || []).filter(skill => entry.skillIds?.includes(skill.id));
  const resourceLinks = canonical ? (entry.resources || []).map(resource => ({label:resource, href:resource})) : entry.resources || [];
  return '<div class="detail-heading"><a href="tools.html">Back to Tools</a><p class="eyebrow">' + label(entry.kind) + '</p><h1>' + escapeHtml(entry.name) + '</h1><p class="lede">' + escapeHtml(entry.summary) + '</p></div>' +
    '<div class="boundary-note"><strong>Runtime access: not checked here.</strong> Runtime availability and account permission must be checked in the active runtime. ' +
    (canonical ? 'Catalog evidence does not grant access or authorization.' : 'This is not a canonical Tool record. Referenced instructions and recipes do not establish connection, access, or approval.') + '</div>' +
    '<section class="detail-section"><h2>Scope and boundaries</h2>' + facts([['Scope',entry.scope],['Risk',entry.risk],['Connector',entry.connector],['Workspace',entry.workspace],['Permission',entry.permission],['Approval',entry.approval],['Data sensitivity',entry.dataSensitivity]]) + '</section>' +
    (canonical ? '<section class="detail-section"><h2>Verification and fallback</h2>' + facts([['Verification',entry.verification],['Fallback',entry.fallback],['Catalog availability',entry.availability]]) + '</section>' : '') +
    '<section class="detail-section"><h2>' + (canonical ? 'Linked recipes' : 'Recipes referencing this entry') + '</h2>' +
    (entry.recipes.length ? entry.recipes.map(recipe => renderToolRecipe(recipe, data)).join('') : '<p>No recipes are declared for this entry.</p>') + '</section>' +
    (canonical ? '<section class="detail-section"><h2>Declared relationships</h2>' +
      '<p>Personas: ' + (personas.map(persona => '<a href="index.html?persona=' + encodeURIComponent(persona.id) + '">' + escapeHtml(persona.name) + '</a>').join(', ') || 'None declared') + '</p>' +
      '<p>Skills: ' + (skills.map(skill => '<a href="skills.html?skill=' + encodeURIComponent(skill.id) + '">' + escapeHtml(skill.name) + '</a>').join(', ') || 'None declared') + '</p>' +
      (entry.requirements.length ? '<ul>' + entry.requirements.map(requirement => '<li>' + escapeHtml(requirement.activity) + ': ' + escapeHtml(requirement.capability) + '</li>').join('') + '</ul>' : '') + '</section>' : '') +
    '<section class="detail-section"><h2>Source' + (canonical ? ' and evidence' : 's') + '</h2><p><a href="' + entry.sourceHref + '">' + (canonical ? 'Canonical catalog source' : 'Presentation reference source') + '</a></p>' +
    (canonical ? facts([['Record status',entry.status],['Catalog evidence',entry.evidenceStatus],['Version',entry.version],['Updated',entry.updated]]) + '<ul>' + (entry.evidence || []).map(item => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>' : '') +
    (resourceLinks.length ? '<ul>' + resourceLinks.map(resource => '<li>' + externalLink(resource) + '</li>').join('') + '</ul>' : '') + '</section>' +
    (canonical && entry.revisions?.length ? '<section class="detail-section"><h2>Revision history</h2><ul>' + entry.revisions.map(revision => '<li><strong>' + escapeHtml(revision.version) + ' / ' + escapeHtml(revision.date) + '</strong><p>' + escapeHtml(revision.summary) + '</p></li>').join('') + '</ul></section>' : '');
}
