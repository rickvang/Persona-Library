# Template creation Site-visibility Work Order

## Header

- Work Order ID: WO-2026-09-16-template-site-visibility
- Title: Make Templates-tab visibility part of Template creation completion
- Status: ready-for-review
- Created: 2026-09-16
- Last updated: 2026-09-16
- Requester: repository owner
- Current owner: Template lifecycle maintenance
- Request mode: update
- Primary space: Templates
- Issue: #126
- Artifact home: `docs/work-orders/WO-2026-09-16-template-site-visibility/`
- Explicit authorization and target: update the existing Template creation/lifecycle flow so reusable Template publication is not complete until Persona-Library catalog metadata, generated Site data, and Templates-tab visibility are reconciled
- Stopping condition: review-ready PR with the completion gate encoded in the lifecycle Playbook, composer, and Template reconciliation Skill; no merge without separate authorization

## Placement

This is an existing-flow extension. No new Persona, Skill, Playbook, artifact kind, space, or architecture concept is warranted.

- `docs/playbooks/template-lifecycle.md` owns the end-to-end lifecycle completion gate.
- `.agents/skills/template-composer/SKILL.md` owns the canonical-publication handoff after source creation.
- `.agents/skills/template-reconciliation/SKILL.md` owns read-only verification that the catalog and generated Templates surface are coherent.
- `content/orientation/templates.json` does not need a semantic change for this scoped fix; avoiding it also avoids an unnecessary generated orientation mirror change.

## Required behavior

For reusable/canonical Template publication:

1. publish or verify the canonical starter in `rickvang/template-library` or another verified canonical source;
2. add or refresh the Persona-Library Template catalog record;
3. run the repository build that refreshes generated Site data, including `dist/data/library-data.js`;
4. verify the Template appears in the Persona-Library Templates tab with the intended identity, source, lifecycle, and availability state;
5. run Template reconciliation and one universal change-impact reconciliation pass when required.

A canonical starter that exists externally but is missing from the Persona-Library Templates tab is not a complete publication.

## Boundaries

- Do not copy canonical starter files into Persona-Library.
- Templates-tab visibility does not prove runtime access, fetch/install capability, or renderability.
- Do not touch PR #123 or unrelated job-search semantics.
- No merge without separate authorization.

## Progress

| Phase | Status | Evidence / result | Next action |
| --- | --- | --- | --- |
| Placement review | complete | Existing lifecycle/composer/reconciliation surfaces own the change | Done |
| Contract update | complete | Lifecycle Playbook, `$template-composer`, and `$template-reconciliation` now require catalog + generated Site + Templates-tab completion for reusable publication | Review PR |
| Validation | complete | Branch compares cleanly to current `main`; only the three intended lifecycle surfaces plus this Work Order changed; no generated source changed in this patch | Open PR |

## Validation boundary

This change defines the future completion contract; it does not add or modify a Template catalog record itself, so no generated Site rebuild is required for this patch. The new rule explicitly requires that rebuild whenever reusable/canonical Template publication changes catalog source data.

## Next action

Open the review PR for issue #126. Do not merge without separate authorization.
