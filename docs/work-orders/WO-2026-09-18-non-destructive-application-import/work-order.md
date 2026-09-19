# WO-2026-09-18-non-destructive-application-import

- Created: 2026-09-18
- Requester: repository owner
- Current owner: Persona Library product surface
- Request mode: update
- Primary space: Docs / job-search integration
- GitHub issue: #154
- Branch: `feat/non-destructive-application-import`

## Goal

Make the Applications tracker import path safe for ChatGPT/Codex-assisted opportunity discovery: merge new opportunities into browser-local private state without replacing or downgrading existing application records.

## Placement review

This is an extension of the existing top-level Applications companion surface and its tracker contract. It does not create a new Persona, Skill, Tool, Playbook, canonical data record, server-backed service, or candidate registry.

## Authorized scope

- Isolated tracker import/upsert logic.
- Import review summary and explicit backup restoration action.
- Source/generated tracker parity and build wiring.
- Tracker contract documentation.
- Automated validation for identity, lifecycle, privacy, and malformed imports.
- Reconciliation artifact and review PR.

## Privacy boundary

Real opportunity and application records remain in browser-local `persona-library.job-applications.v1` state. No private records, packet contents, candidate answers, or job-search history may enter Git, source fixtures, canonical Persona-Library data, analytics, or remote persistence.

## Import rules

- Stable `id` is the primary identity.
- Canonicalized `sourceUrl` is the secondary identity when IDs differ.
- Fuzzy company/title similarity is never an automatic overwrite rule.
- Existing lifecycle fields and user-owned notes/nextAction are preserved; incoming metadata fills empty fields.
- Incoming lifecycle state may advance a record but never silently downgrade an advanced existing state.
- Ambiguous identities are surfaced as conflicts and excluded from automatic merge.
- Merge is the default; Replace all remains explicit for backup restoration.

## Success criteria

- Version 1 exports continue to parse.
- Empty and unrelated-record imports add expected opportunities.
- Re-import is idempotent.
- Applied/Interviewing/Offer records are not downgraded.
- Existing notes and next actions are not silently destroyed.
- Missing packet URLs and other empty metadata can be filled.
- Canonical-equivalent posting URLs resolve to one record.
- Malformed or unsupported input changes nothing.
- Browser-local privacy and standalone extraction boundaries remain intact.

## Merge boundary

Do not merge the PR without separate requester authorization.
