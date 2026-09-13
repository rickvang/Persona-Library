(() => {
  const previewRenderers = {
    'template-design-system-resume-document': 'resumeMockup',
    'template-resume-classic-single-column': 'classicResumeMockup',
    'template-design-system-web-app': 'webAppDesignSystemMockup'
  };

  window.PersonaLibraryTemplatePreviewConfig = Object.freeze({
    previewRenderers: Object.freeze(previewRenderers)
  });
})();
