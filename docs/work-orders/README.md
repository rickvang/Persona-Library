# Work Order Artifacts

This directory is the default repository home for non-trivial project work.

## Default location

Use:

docs/work-orders/<work-order-id>/

The Work Order is the active progress record and artifact index. Keep project-specific artifacts in the same package when this repository is the authorized target. Use stable filenames only when the project needs them.

## Suggested package layout

- work-order.md — active Work Order and next action;
- context.md — project context and routing snapshot;
- evidence.md — evidence ledger or source trail;
- ia.md — content and information architecture;
- design.md — design direction, interaction states, responsive rules, accessibility, and handoff;
- traceability.md — coverage matrix;
- validation.md — concise evaluation, implementation QA, and limitations;
- prototype-links.md — links to isolated prototypes or external design files.

Do not create every file automatically. Use the smallest package that supports the work. The Work Order must link the concrete files that actually exist.

## Boundaries

- The directory is project-scoped, not a replacement for canonical Personas, Skills, Tools, Playbooks, Decisions, or generated Site output.
- Reusable guidance belongs in the appropriate shared Docs location after review.
- A project package does not grant permission to create, publish, execute, or change anything.
- Keep synthetic participant responses, project assumptions, and unvalidated examples project-scoped.
- If the target is another repository or external project, use its authorized workspace and record the destination in the Work Order.
- For a trivial change, do not create a directory; record why it was not warranted.
- Do not invent a Work Order ID or destination when the target is unclear.

See [Work Orders](../work-orders.md) for the full contract.