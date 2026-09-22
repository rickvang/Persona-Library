window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
window.PersonaLibraryDataFragments.operationalScenarios = window.PersonaLibraryDataFragments.operationalScenarios || [];
window.PersonaLibraryDataFragments.operationalScenarios.push({
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
});
