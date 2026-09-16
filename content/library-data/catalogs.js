window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
Object.assign(window.PersonaLibraryDataFragments, {
  playbookCatalog: [
    {id:'playbook-evidence-led-job-search',name:'Evidence-led job search',status:'Working model'},
    {id:'playbook-create-and-integrate-reusable-skill',name:'Create and integrate a reusable skill',status:'Working model'},
    {id:'playbook-multi-persona-collaboration',name:'Multi-Persona Collaboration',status:'Working model'},
    {id:'playbook-bounded-parallel-implementation',name:'Bounded parallel implementation',status:'Working model'},
    {id:'playbook-template-lifecycle',name:'Research, promote, and maintain a reusable Template',status:'Working model'}
  ],
  operatingPacks: [
    {
      id:'operating-pack-design-system',
      name:'Design System',
      purpose:'A reusable Markdown-based context package for teams that design, build, and maintain shared interface patterns.',
      domain:'Product teams with a shared component or design system',
      useWhen:'A task changes a shared component, token, pattern, accessibility rule, naming convention, package boundary, or system-level validation path.',
      status:'Canonical external reference',
      source:{kind:'github_repository',repository:'rickvang/operating-packs',path:'packs/design-system',entrypoint:'AGENTS.md',availability:'documentation_only',verification:'Verified on 2026-09-11 against main at commit 569c326f6f9df4077ee77352fe691bda6ec37b92; packs/design-system and AGENTS.md resolve, and the external README identifies this repository/path/entrypoint as Persona-Library’s stable contract. Runtime access remains capability-dependent.'},
      provides:['Token and component conventions','Accessibility and responsive requirements','Naming and package architecture guidance','SOPs for adding or changing a component','Validation and release checks'],
      relatedSkills:['skill-component-and-design-system-thinking','skill-design-system-stewardship','skill-accessibility-and-inclusive-design','skill-interface-hierarchy-and-visual-communication'],
      applications:[{personaId:'ui-expert',skillId:'skill-component-and-design-system-thinking',workflow:'Extend and govern the design system',reason:'Camille uses the pack when a shared pattern or guideline must travel beyond a local interface decision.'}],
      playbooks:['playbook-create-and-integrate-reusable-skill'],
      evidence:'Verified external source evidence: rickvang/operating-packs/packs/design-system/AGENTS.md identifies the Design System Operating Pack, routes to the pack’s local Markdown guidance and workflows, and matches the repository README stable Persona-Library contract. Persona-Library relationship evidence: Camille Ortiz (ui-expert) applies the Component and design-system thinking Skill in the Extend and govern the design system workflow; the four related design-system Skills, the Playbook identity, and the derived Figma Tool-use context remain unchanged.',
      revision:{version:'0.2',date:'2026-09-11',changeType:'source-verification',summary:'Replaced the planned TemplateRepo source with the verified canonical operating-packs repository and Design System pack entrypoint.',affectedFields:['status','source','evidence'],confidence:'Verified source location and entrypoint at main revision 569c326f6f9df4077ee77352fe691bda6ec37b92; existing applicability relationships unchanged after reconciliation'}
    }
  ],
  templates: [
    {
      id:'template-design-system-resume-document',
      name:'Resume Document Design System',
      purpose:'Provide a reusable starting structure for a visual system used in resumes and structured documents.',
      category:'design-system',
      useWhen:'Creating a repeatable visual system for resumes or structured documents.',
      lifecycle:'candidate',
      status:'Candidate external reference',
      source:{kind:'github_repository',repository:'rickvang/template-library',path:'templates/design-systems/resume-document',entrypoint:'README.md',repositoryDocumentationEntrypoint:'README.md',revision:'0a5c3fc143b5e1fcda3a5868f4c73482ad74d629',availability:'documentation_only',verification:'Verified on 2026-09-12 against main at commit 0a5c3fc143b5e1fcda3a5868f4c73482ad74d629; templates/design-systems/resume-document and its README.md entrypoint resolve, and the starter copy boundary is present. The print-first spacing baseline was tightened in this revision. Runtime access remains capability-dependent.'},
      provides:['semantic token starter structure','document component organization','hierarchy and spacing conventions','repeatable page patterns','example states'],
      applications:[],
      relatedSkills:['skill-interface-hierarchy-and-visual-communication','skill-component-and-design-system-thinking','skill-accessibility-and-inclusive-design'],
      operatingPacks:['operating-pack-design-system'],
      playbooks:[],
      evidence:'Verified external source evidence: templates/design-systems/resume-document and its README.md entrypoint resolve in rickvang/template-library at main revision 0a5c3fc143b5e1fcda3a5868f4c73482ad74d629, with starter/ as the documented copy boundary. The published starter now declares a compact print-first spacing baseline with preserved body text sizing; the related Skills and Sofia Calder’s document-design routing support hierarchy, reusable patterns, accessible structure, and export fidelity. The Template does not own resume-writing expertise, candidate evidence, or submission workflow. Repeated reuse evidence is not yet established, so the Template remains a candidate.',
      revision:{version:'0.3',date:'2026-09-12',changeType:'source-update',summary:'Tightened the Resume Document Design System spacing tokens and documented a print-first compact baseline.',affectedFields:['source','evidence','revision'],confidence:'Path, entrypoint, and starter boundary resolve at main revision 0a5c3fc143b5e1fcda3a5868f4c73482ad74d629; spacing recommendations are updated, while repeated reuse evidence remains unavailable'}
    },
    {
      id:'template-resume-classic-single-column',
      name:'Classic Single-Column Resume',
      purpose:'Provide a reusable content and layout starting structure for a restrained, experience-led resume.',
      category:'resume',
      useWhen:'Creating a single-column resume with clear typographic hierarchy, compact role blocks, and print-first review.',
      lifecycle:'candidate',
      status:'Candidate external reference',
      source:{kind:'github_repository',repository:'rickvang/template-library',path:'templates/resumes/classic-single-column',entrypoint:'README.md',repositoryDocumentationEntrypoint:'README.md',revision:'a275a48',availability:'documentation_only',verification:'Verified on 2026-09-12 against main at commit a275a48; templates/resumes/classic-single-column and its README.md entrypoint resolve, and the starter copy boundary is present. The artifact was adapted from a user-supplied private HTML resume reference without publishing that source or its personal content. Runtime access remains capability-dependent.'},
      provides:['single-column resume content structure','display and body typography pairing','contact, summary, role, achievement, skills, education, and certification patterns','compact print-oriented spacing and review notes'],
      applications:[],
      relatedSkills:['skill-document-information-architecture-and-reading-paths','skill-cross-format-production-and-fidelity-qa','skill-accessible-document-structure-and-export'],
      operatingPacks:[],
      playbooks:[],
      evidence:'Verified external source evidence: templates/resumes/classic-single-column and its README.md entrypoint resolve in rickvang/template-library at main revision a275a48, with starter/ as the documented copy boundary. The Template captures a source-inspired single-column reading order, typography pairing, ruled section boundaries, role syntax, achievement lists, inline skills, and an education / certification ending. Its personal source content remains outside the public artifact. Related document Skills cover reading paths, output fidelity, and accessible export; resume-writing judgment, candidate evidence, and submission workflow remain outside the Template. Repeated reuse evidence is not yet established, so the Template remains a candidate.',
      revision:{version:'0.1',date:'2026-09-12',changeType:'source-publication',summary:'Published a second resume Template adapted from a user-supplied private HTML reference and verified its canonical path, README entrypoint, and starter copy boundary.',affectedFields:['identity','source','status','evidence','revision'],confidence:'Path, entrypoint, and starter boundary resolve at main revision a275a48; the source shape is documented and reusable, while repeated adoption evidence remains unavailable'}
    },
    {
      id:'template-design-system-web-app',
      name:'Web App Design System',
      purpose:'Provide a reusable starting structure for a web application design system.',
      category:'design-system',
      useWhen:'Starting or restructuring a shared UI system for a web application.',
      lifecycle:'candidate',
      status:'Candidate external reference',
      source:{kind:'github_repository',repository:'rickvang/template-library',path:'templates/design-systems/web-app',entrypoint:'README.md',repositoryDocumentationEntrypoint:'README.md',revision:'c01e9e605d2d7dfd8f12d189cfbce8c6f9237927',availability:'documentation_only',verification:'Verified on 2026-09-11 against main at commit c01e9e605d2d7dfd8f12d189cfbce8c6f9237927; templates/design-systems/web-app and its README.md entrypoint resolve, and the starter copy boundary is present. Runtime access remains capability-dependent.'},
      provides:['semantic token starter structure','component organization','shared patterns','layout conventions','example states'],
      applications:[{personaId:'ui-expert',skillId:'skill-component-and-design-system-thinking',workflow:'Extend and govern the design system',reason:'Camille uses this starting structure when establishing a new implementation or restructuring a shared web application system rather than modifying an existing mature system.'}],
      relatedSkills:['skill-component-and-design-system-thinking','skill-interaction-states-and-behavior-design','skill-responsive-and-adaptive-layout','skill-accessibility-and-inclusive-design'],
      operatingPacks:['operating-pack-design-system'],
      playbooks:[],
      evidence:'Verified external source evidence: templates/design-systems/web-app and its README.md entrypoint resolve in rickvang/template-library at main revision c01e9e605d2d7dfd8f12d189cfbce8c6f9237927, with starter/ as the documented copy boundary. Persona-Library relationship evidence: Camille Ortiz applies the Component and design-system thinking Skill in the Extend and govern the design system workflow; the Design System Operating Pack provides related context without owning the starting artifact. Repeated reuse evidence is not yet established, so the Template remains a candidate.',
      revision:{version:'0.2',date:'2026-09-11',changeType:'source-publication',summary:'Published the Web App Design System Template and verified its canonical path, README entrypoint, and starter copy boundary.',affectedFields:['source','status','evidence','revision'],confidence:'Path, entrypoint, and starter boundary resolve at main revision c01e9e605d2d7dfd8f12d189cfbce8c6f9237927; repeated reuse evidence is not yet established'}
    },
    {
      id:'template-design-system-multi-product',
      name:'Multi-Product Design System',
      purpose:'Provide a reusable starting structure for shared design-system foundations across multiple products.',
      category:'design-system',
      useWhen:'Shared foundations must support multiple products with controlled variation.',
      lifecycle:'planned',
      status:'Planned external reference',
      source:{kind:'github_repository',repository:'rickvang/template-library',path:null,entrypoint:null,repositoryDocumentationEntrypoint:'README.md',revision:'f88a4011902b58b2f192305f5a731f1a71263965',availability:'planned',verification:'The repository main revision f88a4011902b58b2f192305f5a731f1a71263965 was inspected on 2026-09-11 and contains only README.md. The proposed templates/design-systems/multi-product path and reusable artifact entrypoint are not present.'},
      provides:['shared foundation structure','product variation boundaries','component and token organization','adoption conventions','example states'],
      applications:[{personaId:'ux-senior',skillId:'skill-design-system-stewardship',workflow:'Steward the experience system',reason:'Jordan uses this starting structure when shared foundations need stewardship across products and local variation must remain explainable.'}],
      relatedSkills:['skill-component-and-design-system-thinking','skill-design-system-stewardship','skill-design-qa-and-implementation-partnership'],
      operatingPacks:['operating-pack-design-system'],
      playbooks:[],
      evidence:'External source evidence is limited to the inspected repository tree: the canonical host exists, but this Template artifact is not yet present. The related Skills cover shared foundations, stewardship, and implementation partnership; orchestration, permissions, and product-specific output remain outside the Template.',
      revision:{version:'0.1',date:'2026-09-11',changeType:'initial-catalog-entry',summary:'Added a planned multi-product Template identity with a scoped stewardship relationship.',affectedFields:['identity','source','applications','relationships','status'],confidence:'Persona–Skill–workflow and Operating Pack relationships resolve; external artifact path and entrypoint are not verified'}
    }
  ]
});
