# Validation — Template lifecycle Playbook

- Work Order: [`work-order.md`](work-order.md)
- Issue: [#72](https://github.com/rickvang/Persona-Library/issues/72)
- Date: 2026-09-14

## Representative successful case

| Step | Expected | Result |
| --- | --- | --- |
| DEFINE | Need brief names reusable design-system starter + authorization | pass — stage requires destination and reuse claim before discovery |
| DISCOVER | Catalog-first search verifies template-library path/revision | pass — unverified repo existence alone cannot exit the gate |
| ROUTE | Camille/Jordan review substantive design-system quality | pass — Elena routes; does not author domain content |
| COMPOSE | Smallest starter only after accepted research | pass — composer gate forbids silent promotion |
| VALIDATE | Source, boundary, specialist quality inspectable | pass |
| LIFECYCLE | Promote/update only with reuse evidence + authorization | pass |
| RECONCILE | `$template-reconciliation` then one universal pass | pass |

## Boundary / failure case

| Step | Expected | Result |
| --- | --- | --- |
| Need | Promote a project resume draft with private facts | enters DEFINE/DISCOVER |
| DISCOVER/VALIDATE | Mixed project output + unverified source | stop — boundary integrity and source truth gates fail |
| LIFECYCLE | No promotion | pass — keep local/candidate; record missing evidence |
| No fabricated canonical Template | pass | |

## Contract checks

| Criterion | Result | Evidence |
| --- | --- | --- |
| Distinct Playbook justified | pass | Existing catalog lacks Template lifecycle outcome; DEC-012 records alternatives |
| Existing Playbook check includes Multi-Persona Collaboration | pass on current branch | Current branch catalog contains `playbook-multi-persona-collaboration` from #91; #91 remains unmerged |
| References existing owners/Skills | pass | Contract names Elena, Template Skills, specialists, Mara |
| No new Persona/Skill/runtime | pass | No new packages beyond Playbook/docs/route/Site/DEC |
| External ownership unchanged | pass | Canonical starters remain in template-library |
| Bounded Skill actions remain non-triggers | pass | Playbooks route + Templates stewardship handoff |
| Current-branch repository validation | pass | `node scripts/build-library.mjs` and `node scripts/validate-content.mjs` |
| Final dependency rebase and DEC-011 + DEC-012 reconciliation | blocked | #91 and #92 are open; after both land, rebase and reconcile the applied-decision summary from 7 to 8 |

## Commands

```text
node scripts/build-library.mjs
node scripts/validate-content.mjs
```

## Limitations

- Cases are reasoned against the contract; no live promotion into template-library was performed.
- Specialist quality remains dependent on naming the correct domain Persona for each artifact type.
- Current-branch checks do not establish the final post-#91/post-#92 base; the draft remains blocked until that rebase is real.
