# Validation — Riley / job-search ownership boundary

- Work Order: [`work-order.md`](work-order.md)
- Issue: [#90](https://github.com/rickvang/Persona-Library/issues/90)
- Date: 2026-09-14

## Checks

| Criterion | Result | Evidence |
| --- | --- | --- |
| Riley canonical identity remains AI orchestrator | pass | `content/library-data.js` `roleLabel:'AI orchestrator'`; revision `1.2` confirms contextual job-search coordination only |
| Playbook is the front door for the full outcome | pass | `dist/playbooks.html` current-playbook lede; `JOB_SEARCH_IMPLEMENTATION.md` three-layer model |
| Riley described as coordinator, not domain owner | pass | job-search persona card + Playbooks participant label; no “Job-search orchestrator” identity |
| Elena retains search strategy / targeting | pass | Elena remains career search strategist; ledger disposition attached to her search workflow/skill |
| Marcus, Leah, Samira, Camille, Sofia retain specialist roles | pass | unchanged specialist cards and Playbooks participant list |
| Narrow questions can bypass Riley | pass | Docs route `resume-application-work` + implementation routing convention |
| Multi-specialist runs still use Riley/Playbook | pass | consultation convention preserved as routed panel/Playbook coordination |
| No new Job Search Persona | pass | no new Persona record; DEC-011 rejects that alternative |
| Job ledger contract present without private PL storage | pass | `docs/job-search/job-ledger-contract.md` + Site copy; privacy boundary explicit |
| Durable private runtime/persistence proof is complete | deferred | Contract-level behavior is documented; [#96](https://github.com/rickvang/Persona-Library/issues/96) tracks implementation and proof outside Persona-Library |
| Repository validation | pass | `node scripts/build-library.mjs` and `node scripts/validate-content.mjs` |

## Commands

```text
node scripts/build-library.mjs
node scripts/validate-content.mjs
```

## Limitations

- No live repeated-search runtime was executed in this PR. Durable private ledger persistence and repeated-search deduplication are **contract-complete here but runtime-unproved**; [#96](https://github.com/rickvang/Persona-Library/issues/96) is the focused follow-up for implementation and proof.
- Historical Work Order packets retain older “consult Riley” phrasing where they document past runs; live contracts were updated instead of rewriting history.

## Follow-up (out of scope for this PR)

Track and complete [#96](https://github.com/rickvang/Persona-Library/issues/96) to implement and prove private-workspace ledger persistence across repeated searches (normalize → dedupe → update `last_seen` / disposition → avoid resurfacing known jobs as new). Do not treat this PR as that runtime proof or close #90 before #96 has acceptance evidence.
