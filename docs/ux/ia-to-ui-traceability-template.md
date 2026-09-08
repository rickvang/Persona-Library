
# IA-to-UI Traceability Matrix Template

Use this matrix with the [Expert UX Design Practice](expert-ux-design-practice.md) and [UX Work Order](ux-work-order-template.md).

The matrix is a coverage artifact. It proves that the important user goals and content needs carry through information architecture, flows, screens, states, responsive behavior, accessibility, and implementation acceptance. It does not replace the work order, research record, decision record, or QA report.

## Header

- Matrix ID:
- Work-order ID:
- Revision:
- Fixture ID or content source:
- Product or surface:
- Proportionality tier:
- Owner:
- Date:
- Scope:
- Source authority:

## Evidence status

Use the same vocabulary throughout the matrix:

- sourced: supported by a named source;
- observed: actual session, field, analytics, support, or implementation evidence with scope;
- heuristic: principle-based review;
- synthetic_assumption: generated participant or scenario model;
- assumption: unverified condition;
- recommendation: proposed choice;
- unknown: unresolved or unavailable.

The matrix should never make an assumption look like an observed requirement.

## Matrix

| Row ID | User goal and task | Content or IA item | Flow ID | Screen/state ID | Component or interaction | Visual/hierarchy rationale | Responsive transform or affected breakpoint | Accessibility condition | Acceptance criterion | Fail condition | Evidence/source | Owner | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UX-001 |  |  |  |  |  |  |  |  |  |  |  |  |  |

Use one row for each consequential relationship, not one row for every decorative element. Add rows for states, recovery, permissions, and responsive changes when they alter the task or meaning.

## Illustrative rows

These rows are examples only and are not user evidence.

| Row ID | User goal and task | Content or IA item | Flow ID | Screen/state ID | Component or interaction | Visual/hierarchy rationale | Responsive transform or affected breakpoint | Accessibility condition | Acceptance criterion | Fail condition | Evidence/source | Owner | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EX-001 | Send one invitation and understand the result | Recipient, message, submit action | flow.invite | screen.invite.form / state.invite.invalid | Email field and submit | Recipient and correction path receive primary emphasis | Fields stack while labels and result remain visible | Label, error association, focus to first actionable error | Invalid input preserves entered data and identifies the correction | Error is only color or submission silently fails | illustrative recommendation |  |  |
| EX-002 | Publish the intended report version safely | Version, review findings, approval, publish consequence | flow.publish | screen.publish.confirm / state.publish.stale | Version summary and destructive confirmation | Version and consequence outrank decoration; publish is distinct from reversible edits | Confirmation preserves version, consequence, cancel, and recovery at affected widths | Status announcement, keyboard order, contrast, confirmation clarity | User can identify the version and consequence before publish | Confirmation omits version or failure leaves status ambiguous | illustrative recommendation |  |  |

## Required orphan and coverage checks

Before passing the matrix:

1. Every important user goal has at least one served row or an explicit unserved decision.
2. Every important content or IA item has a goal, task, or content rationale.
3. Every important screen has its affected states, including recovery and permission conditions where relevant.
4. Every affected responsive environment has a transformation rule.
5. Every acceptance criterion has a testable result and fail condition.
6. Every unknown has an owner or validation path.
7. Every material visual choice is tied to information or task consequence.
8. No row is marked observed without a real source and scope.
9. No Layout Lab comparison row uses a different fixture or evaluation criterion.
10. No row implies that selection, recommendation, or handoff authorized a live mutation.

## Gate result

- Critical orphaned goals or content:
- Critical missing screen or state rows:
- Missing responsive or accessibility conditions:
- Unsupported evidence claims:
- Unresolved alternatives:
- Result: pass / fail / blocked / no-go
- Smallest correction:
- Recheck revision:
