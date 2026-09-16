window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
Object.assign(window.PersonaLibraryDataFragments, {
  skillUnits: [
    {id:'unit-content-prioritization',kind:'primitive',name:'Content prioritization',summary:'Decide what people need to notice first based on task consequence and intent.'},
    {id:'unit-semantic-grouping',kind:'primitive',name:'Semantic grouping',summary:'Organize related information so the structure can be understood before every detail is read.'},
    {id:'unit-visual-emphasis',kind:'primitive',name:'Visual emphasis',summary:'Use scale, contrast, color, spacing, and position to communicate relative importance.'},
    {id:'unit-contextual-composition',kind:'primitive',name:'Contextual composition',summary:'Adapt proportion, rhythm, density, and tone to the product, audience, and situation.'},
    {id:'unit-responsive-translation',kind:'primitive',name:'Responsive translation',summary:'Preserve hierarchy and control as content and interaction move across environments.'},
    {id:'unit-hierarchy-validation',kind:'primitive',name:'Hierarchy validation',summary:'Check whether real people and realistic content perceive the intended order and emphasis.'}
  ],
  skillRelations: [
    {from:'skill-interface-hierarchy-and-visual-communication',to:'unit-content-prioritization',type:'built-from'},
    {from:'skill-interface-hierarchy-and-visual-communication',to:'unit-semantic-grouping',type:'built-from'},
    {from:'skill-interface-hierarchy-and-visual-communication',to:'unit-visual-emphasis',type:'built-from'},
    {from:'skill-interface-hierarchy-and-visual-communication',to:'unit-contextual-composition',type:'built-from'},
    {from:'skill-interface-hierarchy-and-visual-communication',to:'unit-responsive-translation',type:'built-from'},
    {from:'skill-interface-hierarchy-and-visual-communication',to:'unit-hierarchy-validation',type:'built-from'},
    {from:'unit-visual-emphasis',to:'skill-accessibility-and-inclusive-design',type:'supports'},
    {from:'unit-semantic-grouping',to:'skill-interaction-design-and-information-architecture',type:'supports'},
    {from:'skill-interface-hierarchy-and-visual-communication',to:'skill-contextual-visual-judgment-and-composition',type:'related-to'}
  ]
});
