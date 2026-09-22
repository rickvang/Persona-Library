window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
Object.assign(window.PersonaLibraryDataFragments, {
  operationalScenarios: [
  {
    "id": "scenario-github-issue-implementation",
    "title": "Implement a GitHub issue without remote-call churn",
    "ownerType": "tool-use-recipe",
    "ownerId": "recipe-riley-github-efficient-change",
    "situation": "A scoped repository issue is authorized for implementation and the agent needs current remote truth, coherent mutations, review evidence, and a safe completion boundary.",
    "expectedRoute": "Riley Morgan → Tool and context design → GitHub efficient-change recipe",
    "route": {
      "personaIds": [
        "ai-orchestrator"
      ],
      "skillIds": [
        "skill-tool-and-context-design"
      ],
      "toolRecipeIds": [
        "recipe-riley-github-efficient-change"
      ],
      "operatingPackIds": []
    },
    "match": {
      "phrases": [
        "implement github issue",
        "implement repository issue",
        "fix github issue",
        "complete repository change"
      ],
      "keywords": [
        "github",
        "repository",
        "issue",
        "implement",
        "fix",
        "pull request",
        "merge"
      ]
    },
    "preconditions": [
      "Named repository and scoped issue or requested change.",
      "Current repository instructions and base state are available.",
      "Mutation class and completion authorization are known."
    ],
    "do": [
      "Gather the minimum coherent source and live state before editing.",
      "Reuse still-valid evidence until a named freshness trigger occurs.",
      "Batch related mutations into reviewable checkpoints.",
      "Use repository/static validation before escalating to deployed-state verification.",
      "Refresh base/head/check/review/mergeability state immediately before merge."
    ],
    "dont": [
      "Refetch unchanged issue, branch, or file state after every internal thought.",
      "Use commits, pull requests, or deployments as a diagnostic scratchpad.",
      "Poll checks when no new run or freshness trigger exists.",
      "Create a Preview to answer a source-level question that CI or static validation can answer.",
      "Continue calling Tools after the requested outcome and completion gate are satisfied."
    ],
    "recommendedSequence": [
      "Read the issue, repository contract, relevant source, and current base in one bounded evidence pass.",
      "Define scope, success criteria, stale-state triggers, and validation layers.",
      "Create or reuse the scoped branch, then batch coherent source changes.",
      "Run the cheapest sufficient source/static validation; use GitHub CI for repository/build validation.",
      "Open or update the pull request only when there is a coherent review checkpoint.",
      "Inspect the current PR head, checks, reviews, and threads; correct observed failures rather than speculative ones.",
      "Immediately before merge, refresh base/head, required checks, blocking review state, unresolved threads, mergeability, and linked-completion effects.",
      "Merge only when the current gate is clean, reconcile durable state, then stop."
    ],
    "stateToReuse": [
      "Issue scope and repository contract until the requester or repository changes them.",
      "Fetched source content until that path, branch, or base relationship changes.",
      "Completed validation evidence until a relevant source change invalidates it."
    ],
    "freshnessTriggers": [
      "A source or branch mutation affects previously inspected state.",
      "A check/review event is expected to have changed.",
      "The base branch moves in a way that can affect mergeability or validation.",
      "Immediately before a consequential mutation such as merge or close."
    ],
    "stopConditions": [
      "Repository evidence is sufficient for the requested claim and no higher-cost evidence is required.",
      "The pull request is merged and linked completion/reconciliation is verified.",
      "A required permission, review, or target cannot be verified; stop with the exact blocker rather than trying alternate workspaces."
    ],
    "escalationTriggers": [
      "Repository CI cannot answer a deployed runtime question.",
      "A failed gate adds new evidence requiring another read or correction.",
      "A materially new visual/integration state is useful for requester review."
    ],
    "successSignals": [
      "Remote reads are bounded by explicit invalidation events.",
      "Commits represent coherent review states.",
      "Validation escalates only when the cheaper layer cannot answer the question.",
      "Final merge uses fresh state and leaves no known blocking review or failed required check."
    ],
    "goodTrace": [
      "issue + AGENTS + relevant source + base → scoped branch → batched edits → source/static validation → PR → CI/review evidence → one final freshness pass → merge → stop"
    ],
    "antiPatterns": [
      "Read-edit-refetch loops with no stale-state trigger.",
      "Premature PR/Preview creation before a coherent checkpoint.",
      "Repeated status polling merely because time passed.",
      "Deploying to diagnose failures already observable in source or CI."
    ],
    "badTrace": [
      "fetch issue → fetch main → fetch file → edit → refetch issue → refetch main → edit another file → open PR early → deploy Preview → edit again → deploy again → repeatedly poll PR"
    ],
    "whyBad": [
      "No invalidation rule distinguishes stale state from reusable state.",
      "Writes and review checkpoints are fragmented instead of batched.",
      "Higher-cost deployment evidence is used before cheaper validation is exhausted.",
      "The agent keeps operating after useful evidence has stopped increasing."
    ],
    "recoveryPath": [
      "If base/head diverges, refresh only the affected branch/merge state and revalidate the impacted layer.",
      "If CI fails, inspect the failed job/evidence, correct that failure, and rerun the smallest relevant validation.",
      "If scope or authorization changes, stop and reconcile the Work Order/Current Work route before further mutation."
    ],
    "evidenceStatus": "validated",
    "evidence": [
      "DEC-018",
      "Issue #159 deployment/tool-call investigation",
      "Persona-Library GitHub operating contract",
      "Repeated repository implementation work through PR #184"
    ],
    "confidence": "High within Persona-Library repository work; runtime-specific connector availability remains separate.",
    "status": "active"
  },
  {
    "id": "scenario-vercel-deployed-state-verification",
    "title": "Use Vercel only when deployed-state evidence adds value",
    "ownerType": "tool-use-recipe",
    "ownerId": "recipe-riley-vercel-review-checkpoint",
    "situation": "Repository validation is available, but the task may require a live Preview, deployment status, runtime logs, routing/environment behavior, or a materially reviewable deployed state.",
    "expectedRoute": "Riley Morgan → Tool and context design → Vercel review-checkpoint recipe",
    "route": {
      "personaIds": [
        "ai-orchestrator"
      ],
      "skillIds": [
        "skill-tool-and-context-design"
      ],
      "toolRecipeIds": [
        "recipe-riley-vercel-review-checkpoint"
      ],
      "operatingPackIds": []
    },
    "match": {
      "phrases": [
        "verify deployed preview",
        "check vercel preview",
        "deployed state",
        "runtime deployment issue"
      ],
      "keywords": [
        "vercel",
        "preview",
        "deployment",
        "deployed",
        "runtime",
        "logs",
        "production"
      ]
    },
    "preconditions": [
      "Named Vercel project/deployment question.",
      "Repository checkpoint and validation state are known.",
      "The current runtime exposes the needed Vercel capability and scope."
    ],
    "do": [
      "Ask what evidence only deployment can provide.",
      "Run source/static and repository CI checks first when they can answer the question.",
      "Create or allow a Preview for a materially new reviewable state or an actual deployed-state question.",
      "Inspect only the deployment/log scope needed to answer that question.",
      "Treat Production as a separate consequential boundary."
    ],
    "dont": [
      "Create a Preview for documentation-only, internal refactor, or source-level validation.",
      "Redeploy unchanged code because an intermediate step exists.",
      "Treat a successful deployment as proof that repository tests, accessibility, or product behavior are correct.",
      "Inspect broad logs when a scoped deployment/status check answers the question."
    ],
    "recommendedSequence": [
      "State the deployed-state question and why repository evidence is insufficient.",
      "Confirm the current repository checkpoint passed the applicable cheaper checks.",
      "Create or identify one relevant Preview checkpoint.",
      "Inspect deployment status, route/environment behavior, or scoped logs needed for the question.",
      "Surface the Preview/evidence and its limits.",
      "Stop until material feedback, a failed deployed-state gate, or a new reviewable state invalidates the evidence."
    ],
    "stateToReuse": [
      "READY deployment status for the exact immutable deployment when the deployment itself has not changed.",
      "Repository validation for the source revision until source changes."
    ],
    "freshnessTriggers": [
      "A new deployment is created.",
      "Environment/configuration relevant to the question changes.",
      "Requester feedback requires a materially changed Preview.",
      "Production verification is explicitly required."
    ],
    "stopConditions": [
      "Repository evidence already answers the question; do not deploy.",
      "The scoped deployed-state question is answered with current evidence.",
      "Vercel access/scope is unavailable; mark deployed behavior unverified rather than substituting another account/project."
    ],
    "escalationTriggers": [
      "Only a deployed environment can reproduce the issue.",
      "A Preview failure requires scoped logs or deployment metadata.",
      "A user-reviewable interaction/integration state cannot be evaluated from source or CI."
    ],
    "successSignals": [
      "Each deployment has an explicit evidence or review purpose.",
      "No deployment is created solely because a commit exists.",
      "The answer distinguishes repository correctness from deployed behavior."
    ],
    "goodTrace": [
      "repository checks pass → deployed-state question remains → one Preview → scoped inspection → user-reviewable evidence → stop"
    ],
    "antiPatterns": [
      "Preview per commit.",
      "Repeated deployment-status checks after READY with no new deployment.",
      "Production verification used as the first validation layer."
    ],
    "badTrace": [
      "small edit → Preview → small edit → Preview → docs tweak → Preview → poll READY repeatedly → inspect broad logs without a failing deployed-state question"
    ],
    "whyBad": [
      "Deployment creation scales with internal iteration instead of evidence needs.",
      "Stable READY state is re-read without an invalidation event.",
      "Broad remote evidence increases cost/noise without changing the decision."
    ],
    "recoveryPath": [
      "If Preview fails, inspect the failed deployment and logs once, correct the evidenced problem at source, revalidate, then create a new Preview only if deployed evidence is still needed."
    ],
    "evidenceStatus": "validated",
    "evidence": [
      "DEC-018",
      "Issue #159 live Vercel inspection",
      "PR #163 repository validation split",
      "PR #167 Vercel Git deployment gating"
    ],
    "confidence": "High for Persona-Library deployment workflow; project-specific Operating Packs may narrow the trigger further.",
    "status": "active"
  },
  {
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
  },
  {
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
  },
  {
    "id": "scenario-application-data-source-of-truth",
    "title": "Choose persistence from information lifecycle, not from technology preference",
    "ownerType": "skill",
    "ownerId": "skill-application-and-data-architecture",
    "situation": "Application or content information needs a source of truth and the team must decide whether structured files, a CMS, a database, a service boundary, or migration work is justified.",
    "expectedRoute": "Nadia Shah → Application and data architecture",
    "route": {
      "personaIds": [
        "application-data-architect"
      ],
      "skillIds": [
        "skill-application-and-data-architecture"
      ],
      "toolRecipeIds": [],
      "operatingPackIds": []
    },
    "match": {
      "phrases": [
        "where should this data live",
        "files vs cms vs database",
        "source of truth",
        "schema migration",
        "application data architecture"
      ],
      "keywords": [
        "data",
        "content",
        "persistence",
        "cms",
        "database",
        "schema",
        "authorization",
        "migration",
        "source of truth"
      ]
    },
    "preconditions": [
      "Representative information objects, producers/consumers, lifecycle, ownership, access needs, and durability requirements can be described."
    ],
    "do": [
      "Model meaning, ownership, lifecycle, and invariants before choosing storage.",
      "Consider files or structured content when one-author/versioned workflows do not need runtime persistence.",
      "Separate authentication from authorization when access control matters.",
      "Keep presentation independent from domain/content contracts where reuse or provider replacement matters.",
      "Treat consequential schema/provider changes as versioned migrations with validation and rollback."
    ],
    "dont": [
      "Choose a database or CMS before defining the information lifecycle.",
      "Copy a screen layout directly into the canonical data model.",
      "Assume authentication alone proves authorization.",
      "Add provider abstraction when there is no meaningful replacement/testing benefit.",
      "Call row copying a migration without checking relationships, permissions, and invariants."
    ],
    "recommendedSequence": [
      "Name concepts, owners, producers, consumers, lifecycle, and invariants.",
      "Define only the durability, consistency, latency, privacy, authorization, recovery, and editorial requirements the use case needs.",
      "Compare the least-complex viable source-of-truth options, including structured files/no database.",
      "Define relationships and service/data-access contracts independently of presentation/provider syntax where it matters.",
      "If evolving schema/provider, define compatibility, migration, validation, rollback, and observability before cutover.",
      "Record measurable triggers for CMS/database/scaling/provider changes."
    ],
    "stateToReuse": [
      "Content/domain semantics until product/editorial meaning changes.",
      "Accepted authority and access model until actors or requirements change.",
      "Migration evidence for an immutable version until the migration plan changes."
    ],
    "freshnessTriggers": [
      "New editor/actor or workflow requires runtime writes.",
      "Durability, privacy, authorization, scale, or recovery requirements change.",
      "Schema/content-model changes affect compatibility or invariants.",
      "Observed operating burden crosses a recorded scaling/provider trigger."
    ],
    "stopConditions": [
      "The least-complex source of truth satisfies the real lifecycle/access requirement.",
      "A persistence decision can be deferred with an explicit trigger.",
      "A migration cannot proceed safely until compatibility/authorization/rollback gaps are resolved."
    ],
    "escalationTriggers": [
      "User-facing terminology/task workflow is unresolved → Jordan.",
      "Browser/runtime integration consequences need implementation ownership → Evan.",
      "Security/privacy requirements exceed the current architecture evidence → specialist review."
    ],
    "successSignals": [
      "Each important datum/content object has one explicit authority and lifecycle.",
      "Persistence complexity is justified by current workflow/durability/access needs.",
      "Authentication and authorization are distinct where required.",
      "Migrations have compatibility, validation, and rollback paths."
    ],
    "goodTrace": [
      "concepts + lifecycle + actors → requirements → files/structured content considered → CMS/DB only if justified → contracts → authz → migration/rollback → measurable revisit triggers"
    ],
    "antiPatterns": [
      "Database/CMS first.",
      "UI-shaped canonical schema.",
      "Authentication-equals-authorization.",
      "Premature provider abstraction.",
      "Migration without rollback or invariant checks."
    ],
    "badTrace": [
      "need editable content someday → add CMS + database now → mirror page fields → login added → assume access is safe → later provider swap has no migration/rollback plan"
    ],
    "whyBad": [
      "The storage choice precedes the information model.",
      "Presentation and provider details become the domain contract.",
      "Access control and evolution risk are discovered after coupling is established."
    ],
    "recoveryPath": [
      "Reconstruct the authoritative concepts/lifecycle/actors, identify the current minimum persistence need, separate auth from authorization, then design a versioned compatibility/rollback path for any already-coupled provider schema."
    ],
    "evidenceStatus": "reviewed",
    "evidence": [
      "Issue #182 application/data architecture research",
      "Issue #183 Nadia Shah implementation",
      "Sanity schema, OWASP authorization, and ADR evidence encoded in the Skill practice"
    ],
    "confidence": "Reviewed working architecture practice; storage/provider choice remains context-dependent.",
    "status": "active"
  }
]
});
