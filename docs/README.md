# Documentation and file placement

This directory contains current, reusable guidance and project-scoped work records. Choose a destination by ownership and lifecycle before creating a file.

## Where things live

| Artifact | Destination | Rule |
| --- | --- | --- |
| Canonical Persona, Skill, Tool, Playbook, Template, or Operating Pack data | content/ or its existing canonical owner | Extend the existing owner before creating parallel truth. |
| Callable repository Skill package | .agents/skills/<skill>/ | Keep the package namespace flat until loader support changes. |
| Current reusable system or domain guidance | docs/<subject>/ | Keep current truth here; put rationale in Decisions. |
| Durable Decision records | docs/decisions/records.json | Append the rationale, alternatives, affected surfaces, status, and revisit condition; `content/decisions-page.html` plus `scripts/build-decisions.mjs` generate the Decisions page from this single source. |
| Active project state needing unique recovery detail | docs/work-orders/<id>/ | Use a Work Order only when Current Work plus the issue/PR and domain artifact do not already preserve enough execution/recovery state. |
| Qualifying small repository change | existing authoritative surfaces | Use the small-change lane when a separate Work Order would duplicate state already held by Current Work, the issue/PR, or a domain-specific artifact. A pull request may be the active repository record; preserve existing issues, Current Work, Verification Queue records, and Work Graph membership when they have their own lifecycle. |
| Terminal Work Order package | docs/work-orders/archive/YYYY-MM/<id>/ | Preserve history; archive only after a terminal status is recorded. |
| Evaluation fixtures and results | eval/ | Record conditions and evidence without implying live provider capability. |
| Isolated experiments | the existing prototype-owned path | Keep prototypes out of live records until explicit promotion. |
| Generated Site output | dist/ | Build output only; never hand-edit. |
| Temporary or scratch material | uncommitted temporary workspace | Do not commit by default. |
| External-project artifact | its authorized external repository/system | Link or reference it; do not copy it into Persona-Library for convenience. |

## Work Order lifecycle

Active packages stay directly under docs/work-orders/. A package with a terminal status (complete, no-go, or cancelled) moves to docs/work-orders/archive/YYYY-MM/<id>/ using the month of the reliable terminal update. Archival is lifecycle classification, not deletion. Archived packages are read-only historical evidence unless a later issue explicitly reopens or corrects them; active, blocked, draft, and review work stays in the active namespace.

See [the Work Order contract](work-orders.md) and [the active package index](work-orders/README.md).

## Placement gate

Before committing a new file or directory, answer:

1. What artifact kind is this?
2. Who owns its truth?
3. Is it current guidance, active project state, historical evidence, evaluation evidence, prototype material, canonical source, or generated output?
4. Does an existing file or package already own this responsibility?
5. Is a new file required, or can the existing owner be extended?
6. What is its lifecycle and archive condition?
7. Which references, routes, validators, and generated surfaces must stay aligned?

If the destination is still unclear, pause creation and route the placement question through the repository's existing architecture review.

## Hygiene rules

- Do not add a root file because finding a destination is inconvenient.
- Do not create a second document that restates an existing contract.
- Do not leave two full copies after a move.
- Do not archive active, blocked, draft, or review work.
- Do not leave completed Work Orders indefinitely in the active namespace.
- Do not hand-edit generated files; change authored source and run node scripts/build-library.mjs.
- Do not create nested .agents/skills/ namespaces without proven loader support.
- Do not move external canonical artifacts into this repository.
- Do not commit chat transcripts, giant scratch notes, temporary snapshots, or synthetic output unless they are required evidence with a defined owner and lifecycle.
- A GitHub issue, small-change pull request, or Work Order may track implementation; none grants unrelated mutation or merge authority.

## Generated output

dist/ is the committed, publishable, dependency-free Site output. Change content/ or client/, run node scripts/build-library.mjs, then run node scripts/validate-content.mjs and the focused validation test before handoff. A clean rebuild must reproduce the committed generated data and route copies; no contributor should author changes directly under dist/.
