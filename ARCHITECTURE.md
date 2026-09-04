# Personas system architecture

## Current boundary

The library remains a static Site. Persona content is the source of truth; the browser page is a renderer of that content.

```text
content/library-data.js + content/library-model.js
        |
        v
scripts/build-library.mjs
        |
        v
dist/data/*.js + dist/js/*.js + dist/*.html
        |
        v
private Sites deployment
```

## Source of truth

- `content/library-data.js` owns authored personas, workflow maps, skill profiles, resource trails, modular skill guidance and practice overrides, primitive skill units, and typed skill relationships.
- `content/library-model.js` is the canonical normalizer. It derives stable skill IDs, merges persona-specific skill applications, maps workflow reach, resolves operating and quality guidance plus modular building blocks and related connections, and supplies a reusable operating-loop fallback for less-expanded skills.
- `client/library-ui.js` owns shared browser render helpers for lists, resources, revision history, escaping, and trigger chips.
- `client/library-state.js` owns small URL-aware page state such as role filters, search terms, and selected records.
- `dist/data/*.js` and `dist/js/*.js` are generated output consumed by `dist/index.html` and `dist/skills.html`.
- `dist/index.html` owns persona presentation and page-specific interaction, not persona records or shared render primitives.
- `dist/skills.html` is the cross-persona Skills space: it indexes reusable capabilities and opens their triggers, operating model, quality signals, observable actions, workflow reach, evidence, modular anatomy, and persona applications.
- `dist/playbooks.html` is the Playbooks space: it explains how personas, skills, workflows, artifacts, evidence, and quality gates compose around an outcome. Detailed playbooks can live behind it as deep links, such as `dist/job-search.html`.
- Persona and skill maintenance metadata records semantic revisions alongside file-level Git history.
- `dist/prototyping.html` is the active prototype index. `dist/activity-views.html` and `dist/skill-views.html` are focused prototype detail surfaces; future experiments should be added here before they affect the current system.
- `dist/guide.html` is the wiki for using the system, including the mental model and playbook composition rules. `dist/decisions.html` is the private archive of selected and applied decisions; `dist/job-search.html` is the first detailed playbook surface.
- `JOB_SEARCH_IMPLEMENTATION.md` is the scope and sequencing document for that future workspace. The current Site exposes its responsive MVP reference page without implying scraping, autonomous outreach, mass submission, or persistent tracking.

## Docs, prototyping, and decisions boundary

Keep the three spaces complementary:

- Docs contain the current truth: definitions, boundaries, instructions, examples, prompts, and the current information architecture. They should be enough for orientation and reuse.
- Prototyping contains active experiments: alternative structures, interaction directions, sample content, and temporary comparison surfaces. It is safe to change or discard a prototype.
- Decisions contain the reasoning and history behind that truth: explorations, alternatives, tradeoffs, evidence, status, affected surfaces, and revisit conditions. They should make change understandable and accountable.

The working rule is: **Prototyping explores; Decisions archive; Docs explain what is true now.** Link a prototype to its decision record, link the decision to the Docs section or product surface it changed, and avoid copying whole explanations between the three spaces.

Use prototype status `Active → Selected → Archived`. Use decision status `Proposed → Decided → Applied → Superseded`. Use `Parked` for a useful idea intentionally deferred.

## Invariants

Run `node scripts/build-library.mjs` after changing content or client modules, then run `node scripts/validate-content.mjs` before publishing. Validation checks stable IDs, supported roles and flow tiers, complete workflow activity rows, skill-profile references, normalized catalog relationships, resource URLs, generated module freshness, and the page script boundary.

Counts and filters should be derived from the content module. Do not hand-edit persona totals or role totals as the library grows.

## When to expand the stack

Keep the static-first architecture while content is primarily authored in Git and the library is read-only. Add a database and authenticated authoring only when the product needs collaborative editing, comments, permissions, persistent user-created personas, or server-backed search. Keep page state in the URL-aware helper until state must persist across users or sessions.
