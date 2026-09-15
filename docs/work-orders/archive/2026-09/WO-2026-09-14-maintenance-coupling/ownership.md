# Ownership audit

This audit covers the durable rules and enforcement surfaces named by issue #70. It distinguishes canonical semantic ownership from validation and human-readable presentation.

| Rule or contract | Current locations | Canonical owner | Enforcer or presentation | Duplication disposition |
| --- | --- | --- | --- | --- |
| Repository activation and pre-routing safety | `AGENTS.md`, `content/site-orientation.json` | `AGENTS.md` for activation; bootstrap for universal routing policy | `scripts/validation/orientation.mjs` checks shape; Docs explains it | Intentional high-risk repetition at the agent boundary; validator does not restate prose |
| Request modes, primary spaces, route boundary, and handoff | `content/site-orientation.json`, `content/orientation/*.json` | Bootstrap plus selected route group | `orientation.mjs`; generated `dist/data/orientation/*.json` | Route data is canonical; generated copies are freshness-checked |
| Canonical Persona identity, workflow, and Persona Skill application | `content/library-data.js` | `content/library-data.js` and its model projections | `personas.mjs`; `dist/index.html` presents it | Presentation derives from source; no new Persona source file |
| Callable Skill metadata and reusable capability profile | `.agents/skills/**/SKILL.md`, `content/library-data.js` | Package owns callable instructions; library data owns normalized identity and relationships | `orientation.mjs` checks package contract; `skills.mjs` checks catalog/profile shape | Keep both because package operation and library identity are different contracts |
| Typed cross-domain Skill and Tool relationships | `content/library-data.js`, `content/library-model.js` | Authored relationships in `content/library-data.js`; normalization in `content/library-model.js` | `relationships.mjs` | Explicit cross-space validator preserves relationship ownership |
| Operating Pack identity, source, revision, availability, and applications | `content/library-data.js` | Operating Pack record plus model projection | `operating-packs.mjs`; Site catalog presents it | Source/verification/runtime distinctions remain domain-owned |
| Template identity, source, revision, availability, and viewer state | `content/library-data.js`, `client/template-preview.js` | Template record plus preview registry for viewer capability | `templates.mjs`, `generated.mjs`; Site catalog/viewer presents it | Template source and preview capability remain separate by design |
| Prototype isolation | `content/library-data.js`, `ARCHITECTURE.md`, Site/prototype content | Architecture and canonical prototype boundaries | Domain validators and `generated.mjs` | Repeated at live-record and presentation boundaries because leakage is high risk |
| Generated source/output correspondence | `scripts/build-library.mjs`, `dist/**` | Build manifest and authored source paths | `generated.mjs` | Generated files remain outputs and are checked, never authored |
| Semantic maintenance revision metadata | `content/library-data.js` | `data.maintenance` | `maintenance.mjs` | Kept beside the domain records; Git revision remains separate |
| Reconciliation after durable changes | `AGENTS.md`, bootstrap, Skill frontmatter, reconciliation Skill | Initiating workflow contract plus universal reconciliation protocol | Work Order/reconciliation report | Guidance is intentionally visible at routing, package, and governance boundaries |

The audit supports the issue’s canonical-owner rule without splitting the shared authored data/model files. Domain ownership is semantic; the focused modules enforce the contracts their owners already expose.
