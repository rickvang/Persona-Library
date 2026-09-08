# Design Reference Library

Status: starter curated collection for project-context routing. This is intentionally small and is not a ranking of “best” interfaces.

Use entries through stable IDs and project-lens tags. A source can support a principle or pattern within its stated scope; it does not prove that every project or user will respond the same way.

Access date for external sources: 2026-09-08.

## How to use this library

1. Select only entries relevant to the project lens.
2. Read the source itself when a decision depends on detail.
3. Record the reference ID and project-specific application in the Work Order.
4. Separate sourced guidance from heuristic interpretation and recommendation.
5. Preserve tradeoffs and unknowns.
6. Do not copy full external pages or present a product example as user evidence.
7. Add an entry only when it is useful beyond one project and has a source, scope, and maintenance owner.

## Sourced principles and guidance

### REF-CORE-WCAG-22 — WCAG 2.2 as the accessibility baseline

- Category: standard
- Lens tags: all web, mobile, document, accessibility-sensitive
- Source: [W3C WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/)
- Evidence status: sourced
- Supports: WCAG is a shared technical standard with testable success criteria organized under perceivable, operable, understandable, and robust principles.
- Use: establish an accessibility baseline and identify the applicable success criteria for the project.
- Do not infer: that linking WCAG proves conformance, that an automated scan is sufficient, or that every criterion applies identically to every artifact.
- Tradeoff: the standard gives testable criteria, but design and implementation still need context-specific testing.
- Related gates: accessibility, handoff, implementation QA.

### REF-RESP-REFLOW-01 — Reflow and bounded two-dimensional exceptions

- Category: standard and example
- Lens tags: mobile, responsive, content-heavy, dashboard, accessibility-sensitive
- Source: [W3C Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- Evidence status: sourced
- Supports: non-excepted content should reflow without loss of information or functionality at the specified narrow-width/zoom condition; tables and other genuinely two-dimensional content can require a bounded exception.
- Observable example: surrounding page content reflows while a data table stays in its own scrollable region; a whole page that forces two-dimensional scrolling for ordinary text is a failure pattern.
- Use: define responsive transformations by content and task, not only by device label.
- Do not infer: that every table or dashboard may force page-level horizontal scrolling.
- Related gates: responsive, accessibility, data-dense, implementation QA.

### REF-STATE-STATUS-01 — Status messages without unnecessary focus changes

- Category: standard and example
- Lens tags: async workflow, search, dashboard, status, accessibility-sensitive
- Source: [W3C Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- Evidence status: sourced
- Supports: important changes such as progress, results, waiting, or errors can be programmatically conveyed without moving focus when the context does not change.
- Observable example: a search announces a result count or no-result state without taking focus away from the user’s work.
- Use: include status behavior in the state matrix and implementation handoff.
- Do not infer: that every update should be announced, or that a status message replaces visible content or an error summary.
- Related gates: state completeness, accessibility, responsive interaction.

### REF-FORM-ERROR-01 — Error summary plus local error message

- Category: design-system guidance and example
- Lens tags: focused form, multi-step workflow, high-risk transaction, accessibility-sensitive
- Sources: [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/) and [GOV.UK Error message](https://design-system.service.gov.uk/components/error-message/)
- Evidence status: sourced guidance
- Supports: a validation error should be summarized, linked to the affected answer, and also explained beside the relevant input; invalid submissions should preserve entered values.
- Observable example: the summary links to each failing field, the local message matches the summary wording, and focus behavior is explicit.
- Use: model recovery as part of the normal flow, not as an afterthought.
- Do not infer: that color alone communicates error, or that clearing form fields is acceptable recovery.
- Related gates: error recovery, content clarity, keyboard/focus, state matrix.

### REF-RISK-CHECK-01 — Review before commit and after completion

- Category: pattern and example
- Lens tags: consequential, multi-step, application, approval, publication
- Sources: [GOV.UK Check answers](https://design-system.service.gov.uk/patterns/check-answers/) and [GOV.UK Confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/)
- Evidence status: sourced guidance
- Supports: a review step can give users a chance to correct answers before a small or medium transaction; completion should communicate what happened and what comes next.
- Observable example: each answer has a specific change path, the user returns to the review page after editing, and completion provides reference or next-step information where applicable.
- Use: add explicit review, confirmation, recovery, and next-step states when an action has material consequences.
- Do not infer: that every short form requires a full review page, or that a green success treatment alone proves completion.
- Related gates: consequential, confirmation, recovery, handoff.

### REF-BROWSE-SEARCH-01 — Search supports known-item discovery

- Category: design-system guidance and example
- Lens tags: content-heavy, browse, dashboard, public site
- Source: [USWDS Search](https://designsystem.digital.gov/components/search/)
- Evidence status: sourced guidance
- Supports: search helps users find specific content when navigation is insufficient; search terms should persist into results, the field needs a label, and a submit button supports the form interaction.
- Observable example: a result page preserves the query and communicates the result state rather than presenting an uncontextualized list.
- Use: define query persistence, result count/status, no-result recovery, and label/accessibility behavior.
- Do not infer: that adding search fixes poor taxonomy, or that advanced filters should be the default.
- Related gates: IA, content, status, accessibility, empty state.

### REF-DATA-TABLE-01 — Tables for regular data and bounded responsive behavior

- Category: design-system guidance and example
- Lens tags: dashboard, data-dense, directory, browse/compare, responsive
- Source: [USWDS Table](https://designsystem.digital.gov/components/table/)
- Evidence status: sourced guidance
- Supports: tables fit consistently structured data and directories; headers, predictable formatting, captions, and project-specific accessibility tests matter. On small screens, a scrollable or stacked variant may be appropriate.
- Observable example: data remains comparable because columns have stable meaning, while the table is bounded rather than forcing unrelated page content to scroll in two dimensions.
- Use: decide whether a table, list, cards, or another pattern best serves comparison.
- Do not infer: that a table is the right answer for a dashboard layout, irregular content, or long prose.
- Related gates: content structure, comparison, responsive, accessibility.

## Illustrative examples

All examples below are illustrative. They are not observed user research, product analytics, or claims that a named product is universally successful.

### EX-FOCUSED-INVITE-01 — Single-goal invitation form

- Lens tags: focused, form, low-consequence
- Evidence status: illustrative heuristic
- Scenario: a user invites a collaborator with name and email, optionally adds a message, and submits.
- Strong pattern: one dominant task, concise field labels, preserved input after validation, clear success state, and a route back to the relevant place.
- Why it appears useful: the visual hierarchy serves one task, while the state model makes the outcome and recovery legible.
- Quality check: test empty, invalid, duplicate, loading, success, and permission-denied states as applicable; do not hide invitation status in decoration.
- Limit: real terminology, permissions, and user behavior remain unknown.

### EX-BROWSE-COMPARE-01 — Content-heavy find, browse, and compare

- Lens tags: content-heavy, browse, compare, dashboard
- Evidence status: illustrative heuristic informed by REF-BROWSE-SEARCH-01 and REF-DATA-TABLE-01
- Scenario: a user searches a catalog, filters results, compares a small set of items, and chooses the next action.
- Strong pattern: query persists, filters have visible applied state, result count/status is clear, each result has comparable fields, and comparison uses consistent structure.
- Responsive rule: on narrow screens, preserve the decision path; stack or collapse secondary fields, and bound any necessary table scrolling to the comparison region.
- Failure risk: cards with inconsistent content or a beautiful grid that makes comparison harder than a plain structured list or table.
- Limit: the right information architecture depends on the actual taxonomy, item length, and task priority.

### EX-CONSEQUENTIAL-REVIEW-01 — Review and publish a consequential report

- Lens tags: consequential, multi-step, approval, publication
- Evidence status: illustrative heuristic informed by REF-RISK-CHECK-01 and REF-STATE-STATUS-01
- Scenario: a reviewer checks report contents, confirms scope and recipients, publishes, and needs a durable completion record.
- Strong pattern: review page exposes material choices, each section has a clear change path, publication has explicit confirmation, errors preserve work, and completion states what happened and what comes next.
- Quality check: verify role/permission, stale data, partial failure, duplicate submission, interruption, recovery, and post-publication status.
- Limit: whether users want a single review page or sectional review must be validated for the actual workflow.

### EX-RESPONSIVE-STATE-01 — Search results at narrow width and zoom

- Lens tags: mobile, responsive, content-heavy, accessibility-sensitive
- Evidence status: illustrative example grounded in sourced guidance
- Scenario: a result page must work at a narrow viewport and increased zoom.
- Strong pattern: ordinary content reflows in one reading direction, query and result status remain visible, filters have a reachable compact form, and any two-dimensional table is contained.
- Failure risk: page-level horizontal scrolling that makes paragraphs, actions, or error messages difficult to read.
- Quality check: check long labels, no results, loading, partial results, keyboard order, status announcement, zoom, and narrow width.
- Limit: exact breakpoint transformations depend on content and interaction mode.

### EX-POLISHED-FAILURE-01 — Premium dashboard that fails the user

- Lens tags: dashboard, data-dense, accessibility-sensitive, failure exhibit
- Evidence status: illustrative heuristic; not a critique of a named product
- Scenario: a visually polished dashboard uses large cards, subtle color, and dense charts, but has inconsistent labels, no empty/partial/error/permission states, unclear table semantics, and page-level horizontal scrolling at zoom.
- Why it fails: visual polish does not compensate for weak information architecture, missing recovery paths, unclear status, or inaccessible structure.
- Gate result: fail state completeness, responsive/reflow, content/IA, accessibility, and traceability gates.
- Repair direction: define the operator’s decision, normalize labels and units, provide a realistic content fixture, add state and recovery behavior, and test a bounded responsive transformation before refining visual polish.
- Limit: this is a teaching failure exhibit, not evidence that a real team or product behaved this way.

## Maintenance

Review this file when a source changes, a lens repeatedly selects irrelevant material, an example is no longer representative, a project produces a generalizable reviewed lesson, or a new domain requires a conditional gate.

Preserve source scope and unknowns. Do not turn a reference collection into an unverified leaderboard.
