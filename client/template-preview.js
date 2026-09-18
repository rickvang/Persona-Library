(() => {
  const previewRenderers = {
    'template-design-system-resume-document': 'resumeMockup',
    'template-resume-classic-single-column': 'classicResumeMockup',
    'template-cover-letter-evidence-led': 'coverLetterMockup',
    'template-job-application-notes': 'applicationNotesMockup',
    'template-design-system-web-app': 'webAppDesignSystemMockup'
  };

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  const sourceLabel = source => {
    if (source?.kind === 'github_repository' && source.repository) {
      return `${source.repository}${source.path ? ` · ${source.path}` : ''}${source.revision ? ` · pinned ${source.revision}` : ''}`;
    }
    return source?.path || source?.repository || 'declared external source';
  };

  const localPreviewRenderers = {
    coverLetterMockup(source) {
      return `<section class="section" id="mockup"><div class="mockup"><div class="mockup-head"><div><span class="mockup-label">Illustrative output</span><h2>Evidence-led cover letter</h2><p>This synthetic sample shows the Template’s concise contact block, role-specific opening, evidence-backed narrative, and restrained close without copying the external starter.</p></div><span class="mockup-badge">Synthetic sample</span></div><div class="mockup-stage"><article class="resume-sheet" aria-label="Illustrative evidence-led cover letter"><header class="resume-header"><h3 class="resume-name">Morgan Chen</h3><p class="resume-title">Product Designer</p><p class="resume-contact">Minneapolis, MN · morgan.chen@example.com · portfolio.example.com</p></header><section class="resume-section"><p class="resume-summary">September 17, 2026</p><p class="resume-summary">Hiring Team<br>Harbor Labs<br>Senior Product Designer</p></section><section class="resume-section"><p class="resume-summary"><strong>Dear Hiring Team,</strong></p><p class="resume-summary">Harbor Labs’ focus on making complex service work easier to navigate is closely aligned with the problems I have been solving in product design. I am interested in the Senior Product Designer role because it combines workflow clarity, cross-functional systems thinking, and measurable customer outcomes.</p></section><section class="resume-section"><p class="resume-summary">In my current role, I led a redesign of an operations workflow that reduced searching and made next actions easier to identify. I also built a shared component language with engineering, content, and research partners so teams could reuse decisions instead of rebuilding them project by project.</p></section><section class="resume-section"><p class="resume-summary">That experience would let me contribute quickly while still learning the specifics of Harbor Labs’ customers and product constraints. I would welcome the chance to discuss how I approach evidence, interaction quality, and durable design systems.</p><p class="resume-summary">Thank you for your consideration,<br><strong>Morgan Chen</strong></p></section></article><aside class="mockup-notes" aria-label="Mockup notes"><article class="mockup-note"><strong>Structure shown</strong><span>Contact block, date and recipient context, role-specific opening, two evidence-led body paragraphs, and concise close.</span></article><article class="mockup-note"><strong>Evidence boundary</strong><span>Claims are phrased as synthetic examples; a real application must trace material statements to the active candidate evidence.</span></article><article class="mockup-note"><strong>What it demonstrates</strong><span>The letter adds motivation and role relevance instead of repeating resume bullets line by line.</span></article><article class="mockup-note"><strong>Review before use</strong><span>Verify employer language, candidate voice, evidence, recipient details, and channel requirements.</span></article></aside></div><p class="mockup-footnote">This cover-letter content is synthetic and does not represent a real candidate, employer, or application. The viewer is a Persona-Library-local illustrative composition; the reusable Template remains in ${escapeHtml(sourceLabel(source))}.</p></div></section>`;
    },
    applicationNotesMockup(source) {
      return `<section class="section" id="mockup"><div class="mockup"><div class="mockup-head"><div><span class="mockup-label">Illustrative output</span><h2>Application notes in one place</h2><p>This synthetic sample shows how the Template can coordinate role evidence, packet decisions, answers, and submission checks while keeping the resume and cover letter as separate artifacts.</p></div><span class="mockup-badge">Synthetic sample</span></div><div class="mockup-stage"><article class="resume-sheet" aria-label="Illustrative application notes and answers"><header class="resume-header"><h3 class="resume-name">Application Notes &amp; Answers</h3><p class="resume-title">Senior Product Designer · Harbor Labs</p><p class="resume-contact">Status: packet in review · Candidate context: synthetic example · Submission not authorized</p></header><section class="resume-section"><h4 class="resume-section-title">Role-fit evidence</h4><ul class="resume-bullets"><li>Workflow redesign experience maps to the role’s complex-service design requirement.</li><li>Design-system collaboration supports the cross-functional platform work described in the posting.</li><li>Research and facilitation examples support discovery and stakeholder alignment expectations.</li></ul></section><section class="resume-section"><h4 class="resume-section-title">Packet decisions</h4><p class="resume-summary"><strong>Resume:</strong> use the evidence-led single-column version; emphasize workflow and system examples.</p><p class="resume-summary"><strong>Cover letter:</strong> add motivation and one evidence-backed narrative rather than restating resume bullets.</p><p class="resume-summary"><strong>Portfolio:</strong> include the service blueprint and component-system case studies.</p></section><section class="resume-section"><h4 class="resume-section-title">Application answers</h4><p class="resume-summary"><strong>Why this role?</strong> The role combines service complexity, interaction design, and system stewardship—the same intersection represented in the selected evidence.</p><p class="resume-summary"><strong>Work authorization / logistics:</strong> verify against the active candidate context before submission.</p></section><section class="resume-section"><h4 class="resume-section-title">Submission checks</h4><ul class="resume-bullets"><li>Confirm employer and role names across all artifacts.</li><li>Confirm contact details and portfolio links belong to the active candidate.</li><li>Record final resume and cover-letter revisions.</li><li>Do not mark submitted without explicit authorization and submission evidence.</li></ul></section></article><aside class="mockup-notes" aria-label="Mockup notes"><article class="mockup-note"><strong>Structure shown</strong><span>Target metadata, role-fit evidence, packet decisions, application answers, and a submission checklist.</span></article><article class="mockup-note"><strong>Artifact boundary</strong><span>The notes coordinate the application; they do not replace the separate resume, cover letter, evidence source, or tracker.</span></article><article class="mockup-note"><strong>What it demonstrates</strong><span>Decisions and unresolved checks stay inspectable without becoming reusable candidate facts.</span></article><article class="mockup-note"><strong>Review before use</strong><span>Bind exactly one candidate context, verify current role requirements, and keep submission authorization separate.</span></article></aside></div><p class="mockup-footnote">These application notes are synthetic and do not represent a real candidate, employer, or application. The viewer is a Persona-Library-local illustrative composition; the reusable Template remains in ${escapeHtml(sourceLabel(source))}.</p></div></section>`;
    }
  };

  window.PersonaLibraryTemplatePreviewConfig = Object.freeze({
    previewRenderers: Object.freeze(previewRenderers)
  });

  const patchFocusedViewer = () => {
    const selectedId = new URLSearchParams(window.location.search).get('template') || '';
    const rendererName = previewRenderers[selectedId];
    const renderer = localPreviewRenderers[rendererName];
    if (!renderer) return;

    const viewer = document.querySelector('#viewer');
    const template = window.PersonaLibraryData?.templateCatalog?.find(item => item.id === selectedId);
    if (!viewer || !template) return;

    const illustrativeDetail = 'A local synthetic composition demonstrates the starting structure; it is not the external artifact.';
    const previewSection = viewer.querySelector('#preview');
    const previewState = previewSection?.querySelector('.preview-state');
    if (previewState) {
      const icon = previewState.querySelector('.preview-icon');
      const heading = previewState.querySelector('h3');
      const copy = previewState.querySelector('p');
      if (icon) icon.textContent = '✦';
      if (heading) heading.textContent = 'Illustrative concept available';
      if (copy) copy.textContent = 'This local composition helps review the documented shape. It uses synthetic content and does not replace the reusable source.';
    }

    const decisionPreviewState = viewer.querySelector('#decision .decision-state-grid article:last-child');
    if (decisionPreviewState) {
      decisionPreviewState.dataset.state = 'illustrative';
      const label = decisionPreviewState.querySelector('strong');
      const detail = decisionPreviewState.querySelector('p');
      if (label) label.textContent = 'Illustrative concept';
      if (detail) detail.textContent = illustrativeDetail;
    }

    const decisionNote = viewer.querySelector('#decision .decision-note');
    for (const node of decisionNote?.childNodes || []) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('This viewer has no local illustrative composition for the Template yet.')) {
        node.textContent = node.textContent.replace('This viewer has no local illustrative composition for the Template yet.', illustrativeDetail);
      }
    }

    for (const row of viewer.querySelectorAll('#source .meta-row')) {
      if (row.querySelector('dt')?.textContent.trim() === 'Viewer representation') {
        const value = row.querySelector('dd');
        if (value) value.textContent = `Illustrative concept · ${illustrativeDetail}`;
      }
    }

    if (!viewer.querySelector('#mockup') && previewSection) previewSection.insertAdjacentHTML('afterend', renderer(template.source || {}));
  };

  if (typeof window.addEventListener === 'function') {\n    window.addEventListener('DOMContentLoaded', patchFocusedViewer, { once: true });\n  }
})();
