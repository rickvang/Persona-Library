(() => {
  const previewRenderers = {
    'template-design-system-resume-document': 'resumeMockup',
    'template-resume-classic-single-column': 'classicResumeMockup',
    'template-cover-letter-evidence-led': 'coverLetterMockup',
    'template-job-application-notes': 'applicationNotesMockup',
    'template-design-system-web-app': 'webAppDesignSystemMockup'
  };

  window.PersonaLibraryTemplatePreviewConfig = Object.freeze({
    previewRenderers: Object.freeze(previewRenderers)
  });
})();
