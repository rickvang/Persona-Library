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

  function renderConnectionChip(item, kind) {
    return `<button class="connection-chip" type="button" data-connection-kind="${escapeHtml(kind)}" data-connection-name="${escapeHtml(item.name)}" data-connection-summary="${escapeHtml(item.summary || item.definition || '')}">${escapeHtml(item.name)}</button>`;
  }

  function renderSkillPractice(skill) {
    const guidance = skill.guidance;
    if (!guidance?.operation || !guidance?.quality) return '';
    const operation = guidance.operation;
    const quality = guidance.quality;
    const list = items => (items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
    const loop = operation.loop || [];
    const model = (label, items) => `<section><h4>${label}</h4><ul>${list(Array.isArray(items) ? items : [items])}</ul></section>`;
    return `<section class="skill-practice" aria-label="How this skill operates and how to recognize quality"><div class="practice-head"><div><h3>How this skill operates</h3><p>A repeatable loop for turning a trigger into a useful result.</p></div></div><div class="practice-loop"><h4>Operating loop</h4><ol>${list(loop)}</ol></div><div class="practice-model">${model('Inputs', operation.inputs)}${model('Decisions', operation.decisions)}${model('Outputs', operation.outputs)}${model('Feedback', operation.feedback)}${model('Boundaries', operation.boundaries)}</div><div class="quality-head"><div><h3>How to recognize quality</h3><p>Quality is visible in the result, the reasoning, and how the capability holds up under variation.</p></div></div><div class="quality-grid"><section><h4>Quality signals</h4><ul>${list(quality.signals)}</ul></section><section><h4>How to inspect</h4><ul>${list(quality.checks)}</ul></section><section><h4>Watch for</h4><ul>${list(quality.watchFor)}</ul></section></div></section>`;
  }

  function renderSkillSummary() {
    return '<section class="skill-summary" aria-label="Skill detail summary"><div class="summary-label">Skill detail summary</div><p class="summary-order"><strong>Order</strong> Capability → How it operates → How to recognize quality → Triggers/actions → Evidence → Workflows → Skill anatomy → Persona applications → Revision history</p><div class="summary-model"><span><strong>Operating model</strong> Loop · Inputs · Decisions · Outputs · Feedback · Boundaries · Leaves behind</span><span><strong>Quality model</strong> Quality signals · How to inspect · Watch for</span></div></section>';
  }

  function renderSkillAnatomy(skill) {
    const buildingBlocks = skill.buildingBlocks || [];
    const supportingConnections = skill.supportingConnections || [];
    const relatedSkills = skill.relatedSkills || [];
    if (!buildingBlocks.length && !supportingConnections.length && !relatedSkills.length) return '';
    const group = (label, items, kind) => `<section class="anatomy-group"><span>${label}</span><div class="connection-chips">${items.length ? items.map(item => renderConnectionChip(item, kind)).join('') : '<p class="connection-empty">Not mapped yet</p>'}</div></section>`;
    const applicationItems = [
      ...(skill.workflows || []).map(workflow => `${workflow.title} · ${workflow.personaName}`),
      ...(skill.personas || []).map(persona => `${persona.name} · ${persona.roleLabel}`)
    ];
    return `<section class="skill-anatomy"><div class="skill-anatomy-head"><div><h3>Skill anatomy</h3><p>See the reusable pieces behind this capability, then open the focused map when you want more context.</p></div><button class="explore-connections" type="button" data-action="toggle-connections" aria-expanded="false">Explore connections</button></div><div class="anatomy-grid">${group('Built from', buildingBlocks, 'building-block')}${group('Supports', supportingConnections, 'supporting-connection')}${group('Related skills', relatedSkills, 'related-skill')}</div><p class="connection-detail" id="dialog-connection-detail" hidden></p><div class="connection-explorer" data-connection-explorer><h4>Focused connection map</h4><div class="connection-map"><section class="connection-cluster"><h5>Building blocks</h5><ul>${buildingBlocks.map(item => `<li>${escapeHtml(item.name)}</li>`).join('') || '<li>Not mapped yet</li>'}</ul></section><div class="connection-center">${escapeHtml(skill.name)}</div><section class="connection-cluster"><h5>Applications</h5><ul>${applicationItems.map(item => `<li>${escapeHtml(item)}</li>`).join('') || '<li>Not mapped yet</li>'}</ul></section></div><div class="connection-list"><strong>Reference list:</strong> ${escapeHtml(buildingBlocks.map(item => item.name).join(' · ') || 'No building blocks mapped yet.')}</div></div></section>`;
  }

  window.PersonaLibraryUI = { escapeHtml, triggersFor, fillList, renderRevisionHistory, renderResources, renderSkillSummary, renderSkillPractice, renderSkillAnatomy };
})();
