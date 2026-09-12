# Web App Design System Starter

- Status: project-local seed; published as a candidate external Template
- Revision: 0.1.0
- Target product: TBD
- Owner: TBD
- Template basis: [Web App Design System](../dist/template.html?template=template-design-system-web-app)
- Operating context: `operating-pack-design-system` (Design System)
- Evidence boundary: this file is the project-local seed that was adapted into [template-library](https://github.com/rickvang/template-library/tree/c01e9e605d2d7dfd8f12d189cfbce8c6f9237927/templates/design-systems/web-app); the target repository now owns the reusable artifact.

## Purpose

Use this file as the first shared starting point for a web application design system. It gives the team one place to name foundations, organize components, describe shared patterns, state responsive conventions, and capture the states that must be designed and implemented.

The structure is reusable. The values, component decisions, and product language below are recommendations or placeholders until the target product owner confirms them.

## Boundary

This starter owns the initial shape of the system:

- semantic token categories;
- component and pattern inventory;
- layout conventions;
- representative interaction states;
- open decisions needed before implementation.

Reusable professional judgment remains in the relevant Skills. Team rules, accessibility and responsive requirements, naming conventions, change procedures, and release checks remain governed by the Design System Operating Pack. Product code, source assets, and delivery tooling remain in the consuming product repository.

## 1. Semantic token starter

Use semantic names at component call sites. Keep raw values in a separate foundation layer when the implementation grows. The values below are illustrative placeholders and require product, brand, contrast, and implementation review.

```css
:root {
  /* Color — placeholder values */
  --color-surface-canvas: #ffffff;
  --color-surface-raised: #f7f8fa;
  --color-surface-inset: #eef1f5;
  --color-text-primary: #172033;
  --color-text-muted: #5c667a;
  --color-border-default: #cbd2dd;
  --color-action-primary: #315efb;
  --color-action-on-primary: #ffffff;
  --color-status-danger: #b42318;
  --color-status-success: #147a4a;

  /* Typography — placeholder values */
  --font-family-sans: system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
  --font-size-heading: 1.5rem;
  --line-height-body: 1.5;
  --line-height-heading: 1.2;

  /* Space, shape, and elevation — placeholder values */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --radius-control: 0.375rem;
  --radius-surface: 0.75rem;
  --shadow-raised: 0 0.25rem 1rem rgb(23 32 51 / 12%);
}
```

Before these tokens become shared defaults, confirm the product type, brand direction, typeface and licensing, contrast outcomes, dark-mode needs, motion preferences, and supported environments.

## 2. Component organization

Keep the first implementation slice small and make ownership visible.

| Layer | Initial contents | Boundary |
| --- | --- | --- |
| Foundations | color, type, space, shape, elevation, motion tokens | No component-specific aliases here. |
| Components | Button, TextField, Select, Alert, Card | Each component documents anatomy, variants, states, and content constraints. |
| Patterns | form validation, loading and progress, empty and retry, confirmation | Patterns combine components around a recurring task or state. |
| Layouts | page shell, content container, split view, responsive data region | Layouts express content and task constraints rather than device labels alone. |

### Initial component inventory

| Component | First purpose | Starter variants | States to cover |
| --- | --- | --- | --- |
| Button | Start, confirm, or cancel an action | primary, secondary, quiet, destructive | default, hover, pressed, focus-visible, disabled, loading |
| TextField | Collect one short value | single-line, password, search | empty, filled, focus-visible, invalid, disabled, read-only |
| Select | Choose from a bounded set | single-select, multi-select if needed | closed, open, focus-visible, invalid, disabled |
| Alert | Surface status or recovery information | info, success, warning, danger | visible, dismissible, action available |
| Card | Group related content or actions | informational, interactive | default, hover or focus, loading, empty, error |

## 3. Shared patterns

Start with patterns that make incomplete and interrupted work legible:

- inline validation that preserves entered values and explains recovery;
- loading or progress feedback for work that does not complete immediately;
- empty states that explain what is missing and offer a useful next action;
- error states with a clear recovery path and a retry or correction action;
- confirmation and completion states for actions with meaningful consequences;
- bounded responsive data regions when comparison requires more than one dimension.

Each pattern should name its intended task, required content, triggering condition, recovery path, and relationship to the components it combines. These are starter fields, not a replacement for the team’s operating guidance.

## 4. Layout conventions

These are initial layout hypotheses for a web application. Replace them when the product’s content, workflow, or tested viewport constraints require a different model.

```css
:root {
  --layout-max-content: 72rem;
  --layout-gutter: clamp(1rem, 3vw, 2rem);
  --layout-section-gap: clamp(2rem, 5vw, 4rem);
  --layout-grid-gap: 1.5rem;
}

.page-container {
  width: min(100% - (2 * var(--layout-gutter)), var(--layout-max-content));
  margin-inline: auto;
}
```

Use content-driven transformations as the viewport narrows:

- preserve reading and action order when columns stack;
- keep primary actions reachable without requiring horizontal page scrolling;
- keep genuinely two-dimensional content inside a bounded region when it cannot reflow;
- test long labels, validation messages, zoom, keyboard navigation, and touch targets at the narrowest supported width.

## 5. State contract

Every component or pattern added to the system should record the states that apply to it and the user-visible behavior for each one.

| State | Minimum contract |
| --- | --- |
| Default | Explain the normal affordance and content expectation. |
| Hover / pressed | Show whether the action or target is available and what changes visually. |
| Focus-visible | Preserve a clear keyboard focus indicator and logical focus order. |
| Disabled | Explain why the control cannot act when that context is necessary; do not rely on color alone. |
| Loading | Show that work has started and prevent accidental duplicate action where needed. |
| Empty | Explain the absence of content and provide the next useful action or instruction. |
| Error | State what failed, what remains intact, and how the person can recover. |
| Complete | Confirm what happened and identify the next step when one exists. |

## 6. Component handoff fields

When a component becomes real implementation work, add these fields to its documentation or issue:

- purpose and out-of-scope uses;
- anatomy and semantic HTML;
- token aliases and allowed variants;
- content and localization constraints;
- interaction and state behavior;
- keyboard, focus, semantics, and contrast notes;
- responsive transformation and overflow behavior;
- realistic examples, including long and invalid content;
- owner, implementation location, revision, and unresolved questions.

## Open decisions

- [ ] Name the target product and accountable owner.
- [ ] Replace illustrative token values with product-approved values.
- [ ] Confirm supported browsers, viewport range, input modes, and motion preferences.
- [ ] Choose the first production slice and its implementation location.
- [ ] Confirm whether dark mode, localization, right-to-left layout, or density variants are in scope.
- [ ] Link the component change and release checks required by the Design System Operating Pack.

## Provenance and next use

The reusable starting identity is `template-design-system-web-app`. Its catalog record now points to `templates/design-systems/web-app/README.md` at revision `c01e9e605d2d7dfd8f12d189cfbce8c6f9237927`. The record declares semantic token structure, component organization, shared patterns, layout conventions, and example states, and relates the starting structure to the Design System Operating Pack and the component, interaction-state, responsive-layout, and accessibility Skills. This file remains the project-local seed used to compose the reusable artifact.

The external Template remains a candidate until repeated reuse evidence supports promotion beyond its first publication.
