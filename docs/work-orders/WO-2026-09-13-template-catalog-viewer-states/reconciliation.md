# Template catalog and viewer states reconciliation

- Status: complete
- Change observed: redundant derived Template record fields were removed; normalized display states, Site-local preview configuration, catalog/viewer Site surfaces, validator coverage, and directly affected Docs were updated for issue #68.
- Initiating contract: repository update authorized by the user; `change_mode: update`; `change_domain: templates`; domain reconciliation: `template-reconciliation`; universal `change-impact-reconciliation` run once afterward.
- Scope checked: four canonical Template records, normalized Template catalog, related Persona–Skill–workflow applications, Operating Pack and Playbook relationships, related Tool-use context, catalog and viewer pages, generated data, Template guidance, architecture wording, validator, and explicit Template Work Orders.

## Template adapter pass

| Dependent | Relationship | Class | Evidence | Confidence | Action |
| --- | --- | --- | --- | --- | --- |
| Four canonical Template records | Canonical source and lifecycle metadata | qualifies | Each record retains its existing ID, purpose, applicability, relationships, evidence, and revision while removing derived runtime and viewer fields. | high | none required |
| External `rickvang/template-library` source | Revision-pinned provenance and availability | qualifies | Catalog and viewer links still target the recorded revision and path; runtime display now derives from source availability and does not claim external access. | high | retain availability and source evidence |
| Related Skills, workflows, Operating Pack, Playbook, and Tool-use relationships | Template applicability and boundary | confirms | The normalizer still resolves the declared relationships; no domain judgment, permission, orchestration, or workflow ownership moved into the Template. | high | none required |
| Catalog cards and filters | Starting-point discovery | extends | Cards expose task fit, lifecycle, source evidence, viewer representation, and inspection before expanded metadata. | high | none required |
| Focused viewer | Decision record for one Template | extends | The viewer derives illustrative state from the local renderer map and separates lifecycle, source verification, runtime access, and local content through the decision panel. | high | none required |

### Required updates

None identified after implementation and validation.

### Optional follow-ups

- Add a reviewed external-artifact preview only after a source path, entrypoint, runtime access, and authorization are established.
- Add a mobile device matrix and assistive-technology review if the Site becomes a high-traffic selection surface.
- Revisit candidate promotion only when repeated reuse evidence supports it.

### Unchanged checked

Template identities, external ownership, related Persona–Skill–workflow applications, Operating Pack relationships, Playbook relationships, Tool-use boundaries, prototype isolation, and historical Work Orders remain unchanged.

## Universal impact pass

The universal pass followed the Template adapter and checked the orientation manifest, canonical data and model, architecture contract, validator, source-to-output copies, affected Site pages, Docs guidance, and explicit Template Work Orders. Repository search was bounded to named Template fields, relationships, navigation, generated output, and stale source or viewer wording; the repository has no generalized dependency graph.

| Dependent area | Relationship | Class | Evidence | Confidence | Action |
| --- | --- | --- | --- | --- | --- |
| `dist/data/library-data.js`, `dist/data/library-model.js`, and `dist/js/template-preview.js` | Generated source-to-output provenance | extends | The build refreshed generated data and the Site-local preview configuration; content validation confirmed derived states match the canonical model and config. | high | none required |
| `dist/templates.html` | Catalog browse surface | extends | New human-readable filters, summary counts, stateful cards, pinned links, and focused-viewer actions are live and browser-checked. | high | none required |
| `dist/template.html` | Focused Template viewer | extends | Four decision states, a data-driven preview registry, planned/no-view recovery, illustrative compositions, and pinned source evidence are live and browser-checked. | high | none required |
| `dist/guide.html` and `ARCHITECTURE.md` | Human-facing contract and navigation | extends | Template guidance now names lifecycle, source evidence, runtime access, and viewer representation as separate review concerns. | high | none required |
| Related Skills, Operating Packs, Playbooks, and Tools | Cross-space boundaries | confirms | Explicit relationships remain intact and the rendered copy continues to state that Templates do not own judgment, rules, orchestration, permissions, or access. | high | none required |
| External Template artifacts | Declared source authority | qualifies | The viewer links to the source but does not fetch, clone, render, execute, or modify it; runtime access remains unverified. | high | keep external ownership and access uncertainty visible |

### Required updates

None.

### Generated outputs and checks

Generated data was refreshed with `node scripts/build-library.mjs`. `node scripts/validate-content.mjs` also confirms the superseded duplicate `card`, `render`, and `renderTemplate` paths are removed. Inline script parsing, loopback browser smoke checks, and `git diff --check` passed.

### Blockers and incomplete visibility

No implementation blocker remains. External runtime access, actual artifact execution, device-matrix behavior, assistive-technology behavior, export fidelity, and exhaustive implicit dependencies remain unverified by design and outside this issue’s authorization.

### Next action

Repository owner: review the working-tree diff and commit or merge the implementation through the normal repository review path.
