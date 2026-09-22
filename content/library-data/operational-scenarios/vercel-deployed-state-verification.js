window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
window.PersonaLibraryDataFragments.operationalScenarios = window.PersonaLibraryDataFragments.operationalScenarios || [];
window.PersonaLibraryDataFragments.operationalScenarios.push({
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
});
