(() => {
  const fragments = window.PersonaLibraryDataFragments || {};
  const requiredKeys = [
    'skillLibrary',
    'flowLibrary',
    'playbookCatalog',
    'operatingPacks',
    'templates',
    'toolCatalog',
    'toolReferences',
    'personaToolRequirements',
    'personaHandoffs',
    'toolUseRecipes',
    'skillGuidance',
    'skillPractice',
    'skillUnits',
    'skillRelations',
    'operationalScenarios'
  ];

  const missing = requiredKeys.filter(key => !(key in fragments));
  if (missing.length) {
    throw new Error(`Missing PersonaLibraryData source fragments: ${missing.join(', ')}`);
  }

  const data = {};
  for (const key of requiredKeys) data[key] = fragments[key];

  data.personas = fragments.personas ?? [];
  window.PersonaLibraryData = data;
  delete window.PersonaLibraryDataFragments;
})();
