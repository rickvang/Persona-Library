# Seen-job deduplication scope correction Work Order

## Header

- Work Order ID: WO-2026-09-16-seen-job-dedup
- Issue: #96
- Status: ready-for-review
- Authorized repository: `rickvang/Persona-Library`
- Branch: `fix/issue-96-seen-job-dedup`
- Change mode: source update + reconciliation

## Outcome

Correct the overbuilt job-ledger concept to the actual requirement: repeated Creative Job Search / job-discovery checks remember openings already presented and suppress those duplicates on later “what’s new?” runs.

## Boundary

- Keep only stable identity + lightweight private seen-job state.
- No application tracker, lifecycle state machine, campaign database, scheduler, queue, sync service, or JobAgent integration.
- Keep real seen-job state outside Persona-Library in the consuming Skill/runtime.
- Preserve Riley → Priya → Playbook → specialist architecture from #112/#114.
- Preserve historical Decisions and archived Work Orders; this correction changes current guidance, not history.

## Reconciliation

Updated the current contract, job-search implementation guidance, Elena search workflow wording, Priya validation wording, Docs orientation pointer, application Work Order template, Playbooks Site shared-state card, and focused validators. Historical DEC-011 / archived proof records remain unchanged.

## Validation

Run the repository build, top-level content validator, focused validation tests, isolated Persona–Skill validation, and `git diff --check`. Merge remains separate.
