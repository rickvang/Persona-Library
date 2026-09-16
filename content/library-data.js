(() => {
  const fragments = window.PersonaLibraryDataFragments || {};
  const requiredKeys = [
    'personas',
    'skillLibrary',
    'flowLibrary',
    'playbookCatalog',
    'operatingPacks',
    'templates',
    'personaToolRequirements',
    'personaHandoffs',
    'toolUseRecipes',
    'skillGuidance',
    'skillPractice',
    'skillUnits',
    'skillRelations'
  ];

  const missing = requiredKeys.filter(key => !(key in fragments));
  if (missing.length) {
    throw new Error(`Missing PersonaLibraryData source fragments: ${missing.join(', ')}`);
  }

  const data = {};
  for (const key of requiredKeys) data[key] = fragments[key];

  window.PersonaLibraryData = data;
  delete window.PersonaLibraryDataFragments;
})();
