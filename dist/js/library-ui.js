(() => {
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const triggersFor = value => String(value || '').split(' · ').map(item => item.trim()).filter(Boolean);

  function fillList(selector, items) {
    document.querySelector(selector).innerHTML = (items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  }

  function renderRevisionHistory(record, mode = 'persona') {
    const revisions = record?.revisions || [];
    const items = revisions.slice().reverse().map(item => {
      const affected = (item.affectedFields || []).map(escapeHtml).join(' · ');
      return `<article class="${mode === 'skill' ? 'application-item' : 'revision-item'}"><strong>v${escapeHtml(item.version)} · ${escapeHtml(item.summary)}</strong><span class="${mode === 'skill' ? 'role' : 'maintenance-meta'}">${escapeHtml(item.date)} · ${escapeHtml(item.changeType)}</span><p><strong>Affected:</strong> ${affected}<br><strong>Evidence:</strong> ${escapeHtml(item.evidence)}<br><strong>Confidence:</strong> ${escapeHtml(item.confidenceChange)}</p></article>`;
    }).join('');
    if (mode === 'skill') return `<section class="application"><h3>Revision history</h3><div class="application-list">${items}</div></section>`;
    return `<section class="maintenance-panel" aria-label="Persona revision history"><div class="maintenance-head"><h3>Revision history</h3><span>Revision ${escapeHtml(record?.version || '1.0')} · Updated ${escapeHtml(record?.updated || 'Not dated')}</span></div><div class="revision-list">${items}</div></section>`;
  }

  function renderResources(persona) {
    const resources = persona.resources || [];
    const prompt = `Check another source for the ${persona.roleLabel} persona (${persona.name}), summarize what it supports or changes, and add the cited source to the Resources section.`;
    const sourceList = resources.length
      ? `<div class="resources-list">${resources.map(resource => `<div class="resource-item"><a href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">${escapeHtml(resource.title)}</a><p>${escapeHtml(resource.publisher)} · ${escapeHtml(resource.checked)}<br>${escapeHtml(resource.why)}</p></div>`).join('')}</div>`
      : '<p class="resources-empty">No cited sources yet. Ask me to check or find a source for this persona and add it here.</p>';
    return `<section class="resources-panel" aria-label="Resources"><div class="resources-head"><h3>Resources</h3><span>${resources.length ? `${resources.length} cited sources` : 'Source trail not started'}</span></div><p class="resources-intro">Sources used to shape this persona. Ask for another source when you want to extend or challenge the current evidence.</p>${sourceList}<div class="resource-actions"><button class="resource-request" type="button" data-prompt="${escapeHtml(prompt)}">Copy follow-up prompt</button><span>Or ask directly: “Check another source and add it to this persona.”</span></div></section>`;
  }

  window.PersonaLibraryUI = { escapeHtml, triggersFor, fillList, renderRevisionHistory, renderResources };
})();
