window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
window.PersonaLibraryDataFragments.operationalScenarios = window.PersonaLibraryDataFragments.operationalScenarios || [];
window.PersonaLibraryDataFragments.operationalScenarios.push({
  "id": "scenario-architecture-proportionate-decision",
  "title": "Choose the simplest architecture that satisfies the current requirement",
  "ownerType": "skill",
  "ownerId": "skill-architecture-decision-making",
  "situation": "An architecturally significant choice could add infrastructure, coupling, or hard-to-reverse complexity before the requirement proves it is necessary.",
  "expectedRoute": "Owning architect Persona → Architecture decision-making Skill",
  "route": {
    "personaIds": [
      "frontend-systems-engineer",
      "application-data-architect"
    ],
    "skillIds": [
      "skill-architecture-decision-making"
    ],
    "toolRecipeIds": [],
    "operatingPackIds": []
  },
  "match": {
    "phrases": [
      "architecture decision",
      "do we need a database",
      "should we add a cms",
      "choose architecture"
    ],
    "keywords": [
      "architecture",
      "tradeoff",
      "database",
      "cms",
      "framework",
      "dependency",
      "scale",
      "reversible"
    ]
  },
  "preconditions": [
    "Outcome, current system, requirements, constraints, and quality attributes can be stated."
  ],
  "do": [
    "Frame the decision before naming technology.",
    "Include keep-current, do nothing yet, or defer as an option when credible.",
    "Separate reversible implementation detail from hard-to-reverse structure.",
    "Use measurable scaling or revisit triggers instead of vague future growth.",
    "Record rejected credible alternatives and why they lost under current constraints."
  ],
  "dont": [
    "Start with a favored vendor and reverse-fit the problem.",
    "Add persistence, abstraction, queues, or services for hypothetical scale with no trigger.",
    "Compare many options when two or three credible choices cover the decision.",
    "Present a low-confidence assumption as settled architecture."
  ],
  "recommendedSequence": [
    "State the outcome, functional/nonfunctional requirements, constraints, and current architecture.",
    "Identify the smallest credible alternatives, including keep-current, do nothing yet, or defer where viable.",
    "Compare only material tradeoffs: complexity, reliability, security, cost, maintainability, lock-in, reversibility, and team capability.",
    "Gather proof/benchmark/production evidence only for consequential uncertainty.",
    "Choose, defer, or keep current; record confidence, consequences, owner, and explicit revisit condition."
  ],
  "stateToReuse": [
    "Accepted requirements and constraints until product/context changes.",
    "Existing ADR rationale until a stated assumption or revisit trigger changes."
  ],
  "freshnessTriggers": [
    "A requirement, scale measure, provider constraint, security requirement, or team capability materially changes.",
    "Observed production evidence crosses a recorded trigger."
  ],
  "stopConditions": [
    "One option satisfies the current requirement with proportionate complexity and remaining uncertainty is non-consequential.",
    "The correct decision is explicit defer/no-change with a measurable revisit trigger."
  ],
  "escalationTriggers": [
    "A consequential unknown can change the selected architecture and needs a proof, benchmark, or specialist review."
  ],
  "successSignals": [
    "The decision is traceable to current requirements rather than trend.",
    "No selected option is more complex than the present need justifies.",
    "A future maintainer can tell what evidence would reopen the choice."
  ],
  "goodTrace": [
    "requirements + constraints → keep-current option → 2 credible alternatives → material tradeoffs → evidence only for key unknown → decision/defer → measurable revisit trigger"
  ],
  "antiPatterns": [
    "Technology-first decision making.",
    "Future-scale hand waving.",
    "Option-list ceremony without a decision discriminator.",
    "ADR as vendor tutorial."
  ],
  "badTrace": [
    "“we may scale” → pick database/CMS/cloud service → add provider abstraction → add caching/queues → no measured need → no revisit trigger"
  ],
  "whyBad": [
    "Hypothetical future load is treated as current evidence.",
    "Complexity is incurred before it buys a required quality attribute.",
    "The system gains irreversible coupling without a clear decision record."
  ],
  "recoveryPath": [
    "Return to the decision statement, remove unsupported future assumptions, reintroduce keep-current/defer, and define the smallest evidence needed to distinguish viable options."
  ],
  "evidenceStatus": "reviewed",
  "evidence": [
    "Microsoft ADR guidance used in issue #182 research",
    "Architecture decision-making Skill practice",
    "Issue #183 Persona implementation and validation scenarios"
  ],
  "confidence": "Reviewed working practice; individual architecture choices still require project evidence.",
  "status": "active"
});
