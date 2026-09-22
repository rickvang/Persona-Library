# Work Order — Issue #185 execution-grade operational knowledge

- Work Order ID: `WO-2026-09-21-operational-knowledge`
- Updated: 2026-09-21
- Requester: repository owner
- Owner: Riley Morgan / ChatGPT implementation agent
- Explicit collaborator: Mara Okoye · knowledge systems architect (placement/boundary review)
- Request mode: update
- GitHub issue: https://github.com/rickvang/Persona-Library/issues/185
- Current Work: https://app.notion.com/p/3e3cd82535ff81d28db1d794e2562041
- Branch: `feat/issue-185-operational-knowledge`
- Base refreshed: `main` at `88d5148cd12bc45e188a9f77d5659090bc51a6b3`
- Change mode: source update
- Change domain: Skills, Tool-use recipes, operational knowledge relationships, docs, Decisions, generated library data
- Reconciliation: domain boundary review, then one universal impact pass

## Outcome

Add execution-grade operational knowledge so agents can retrieve concrete examples of good execution instead of reconstructing “best practice” from abstract principles on every run.

The first implementation adds structured Operational / Golden Scenarios attached to existing Skills and Tool-use recipes, with targeted retrieval, evidence lifecycle, good/bad traces, freshness/stop conditions, and five representative seed scenarios.

## Authorization

The requester asked to start issue #185. Persona-Library standing completion authorization covers the scoped implementation path, PR corrections, and merge once current completion gates pass.

## Placement

Mara’s creation gate resolves the new durable structure as relationship data owned by existing capability/execution records, not a new top-level knowledge-base space. Existing `.golden.md` files remain callable-Skill test fixtures.

Canonical destinations: `content/library-data/operational-knowledge.js`, `content/library-model.js`, `docs/operational-knowledge.md`, Tool/Skill routing, DEC-023, focused validation, and generated library data.

## Seed scenarios

1. GitHub issue implementation with bounded evidence and one final freshness gate.
2. Vercel deployed-state verification only when Preview/runtime evidence adds value.
3. Proportionate architecture decisions with keep-current/defer as credible options.
4. Frontend runtime architecture with explicit Camille/Jordan/Nadia handoff boundaries.
5. Application/data source-of-truth selection with files/CMS/DB, authorization, migration, and rollback rules.

## Completion gate

Scenario owners/routes resolve; concrete good/bad guidance is present; targeted retrieval works; no new top-level space appears; generated outputs are current; repository validation/checks pass; reconciliation finds no duplicate source of truth; PR is mergeable with no blocking review.

## Closeout checkpoint

- PR: https://github.com/rickvang/Persona-Library/pull/186
- Final implementation head before archive: `68209a109d581d341e40165b62c11d90054d4a02`
- Repository validation: `35678274016` completed / success.
- Review: Cursor approval present; both later Codex review findings were corrected in `68209a1` and resolved.
- Review corrections:
  - validate every Operational Scenario, not only the original five seeds;
  - validate `route.operatingPackIds` against canonical Operating Packs.
- Branch was 0 behind `main` before closeout.
- Known blocker: none.
- Next action: validate this archive-only commit, perform a fresh PR/base/review/check pre-merge read, then merge if the gate remains clean.
