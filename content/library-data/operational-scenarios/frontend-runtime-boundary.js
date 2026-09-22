window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
window.PersonaLibraryDataFragments.operationalScenarios = window.PersonaLibraryDataFragments.operationalScenarios || [];
window.PersonaLibraryDataFragments.operationalScenarios.push({
  "id": "scenario-frontend-runtime-boundary",
  "title": "Keep frontend runtime decisions inside the frontend boundary",
  "ownerType": "skill",
  "ownerId": "skill-web-application-architecture",
  "situation": "A web feature needs implementation/runtime structure and may contain unresolved interface, UX, persistence, authorization, or provider questions that should not be silently absorbed by the frontend.",
  "expectedRoute": "Evan Reyes → Web application architecture; hand off unresolved design/UX/data ownership",
  "route": {
    "personaIds": [
      "frontend-systems-engineer"
    ],
    "skillIds": [
      "skill-web-application-architecture"
    ],
    "toolRecipeIds": [],
    "operatingPackIds": []
  },
  "match": {
    "phrases": [
      "frontend implementation",
      "nextjs runtime architecture",
      "server client boundary",
      "web application architecture"
    ],
    "keywords": [
      "frontend",
      "web",
      "nextjs",
      "rendering",
      "client",
      "server",
      "state",
      "performance",
      "accessibility"
    ]
  },
  "preconditions": [
    "User/task intent, approved interaction direction, representative content/data contract, and runtime constraints are available or their owners are identifiable."
  ],
  "do": [
    "Map execution, data flow, state, failure, and rendering boundaries before adding abstractions.",
    "Keep server/client state and dependencies as small as the workload permits.",
    "Route visual/interaction design judgment to Camille and unresolved task/content semantics to Jordan.",
    "Route persistent source-of-truth, CMS/database, service, and authorization architecture to Nadia.",
    "Validate realistic loading/error/content/responsive/accessibility behavior at the cheapest sufficient layer."
  ],
  "dont": [
    "Turn every interactive component into client-side state by default.",
    "Let component reuse override task-specific semantics.",
    "Let the frontend invent the database, authorization model, or editorial workflow.",
    "Use one local performance run as production proof.",
    "Add a framework dependency without a capability gap it closes."
  ],
  "recommendedSequence": [
    "Start from task/design intent, content/data contract, and browser/runtime constraints.",
    "Map where code runs, how data arrives, where state lives, and how failure/recovery works.",
    "Resolve or hand off out-of-boundary questions before encoding them into frontend structure.",
    "Choose the simplest rendering, component, state, cache, and dependency boundaries.",
    "Implement the riskiest boundary with realistic content and failure states.",
    "Run proportionate build/test/browser/accessibility/performance checks and record unverified conditions."
  ],
  "stateToReuse": [
    "Approved interface intent and data contract until their owner changes them.",
    "Passing source/build checks until affected source changes."
  ],
  "freshnessTriggers": [
    "Design/task semantics change.",
    "Data/service contract changes.",
    "Runtime dependency or rendering boundary changes.",
    "A performance/accessibility regression appears in representative evidence."
  ],
  "stopConditions": [
    "Runtime behavior is validated for the requested scope and remaining questions belong to another owner.",
    "A domain handoff is required before safe implementation can continue."
  ],
  "escalationTriggers": [
    "Visual or interaction intent is unresolved → Camille.",
    "Task/content/navigation semantics are unresolved → Jordan.",
    "Persistence/source-of-truth/service/authorization is unresolved → Nadia.",
    "Deployed behavior cannot be proven below Preview/runtime evidence."
  ],
  "successSignals": [
    "Runtime boundaries can be explained from workload requirements.",
    "Realistic loading/error/content/responsive/accessibility cases hold.",
    "Out-of-boundary decisions are explicit handoffs rather than frontend assumptions."
  ],
  "goodTrace": [
    "task + design intent + data contract → execution/data/state map → hand off unresolved UX/data questions → simplest runtime boundaries → realistic implementation → proportionate validation"
  ],
  "antiPatterns": [
    "Frontend-local database or authorization decisions.",
    "Client-everywhere architecture.",
    "Dependency-first implementation.",
    "Polished happy path with untested errors/loading/long content."
  ],
  "badTrace": [
    "mock UI → add client state everywhere → call provider directly from components → invent auth rules → optimize locally → declare architecture complete"
  ],
  "whyBad": [
    "Presentation code becomes the accidental source of truth.",
    "Authorization and persistence decisions lack the correct owner.",
    "Runtime quality is inferred from a narrow local happy path."
  ],
  "recoveryPath": [
    "Separate interface intent, runtime structure, and persistence concerns; route unresolved semantics/data ownership; then rebuild the smallest affected frontend boundary and revalidate representative states."
  ],
  "evidenceStatus": "reviewed",
  "evidence": [
    "Issue #182 frontend systems research",
    "Issue #183 Evan Reyes implementation",
    "Next.js/WCAG/Web Vitals evidence encoded in the Skill practice"
  ],
  "confidence": "Reviewed role/Skill boundary; project-specific implementation still requires current runtime evidence.",
  "status": "active"
});
