# Information architecture — library data modules

## Placement question

Where should the authored records currently accumulated in `content/library-data.js` live after modularization?

## Mara Okoye placement review

Classification: canonical authored library source, not documentation, generated output, prototype material, or a new first-class library space.

### Candidate destinations

| Candidate | Decision | Reason |
| --- | --- | --- |
| Keep all authored data in `content/library-data.js` | reject | Preserves the current 318 KB mixed-domain maintenance problem and does not satisfy #106. |
| Add a new top-level `data/` or `catalogs/` space | reject | Creates parallel source authority outside the existing `content/` boundary. |
| Add domain modules under `content/library-data/` | select | Extends the existing canonical content owner, makes ownership visible, and does not introduce a new product concept or runtime. |
| Move data into `.agents/skills/` packages | reject | Skill packages are callable behavior packages, not canonical library record storage; their namespace must remain flat. |

## Selected structure

```text
content/
├── library-data.js                  # compatibility aggregation entrypoint
└── library-data/
    ├── personas.js                  # Persona records
    ├── skills.js                    # Skill profiles, guidance, practice, units, relations
    ├── workflows.js                 # Persona workflow maps
    ├── catalogs.js                  # Playbook, Operating Pack, Template records
    └── tool-integration.js          # Persona tool requirements, handoffs, recipes
```

The directory is an implementation/source boundary inside the existing `content/` authority, not a new first-class user-facing space.

## Compatibility boundary

`content/library-data.js` remains the stable aggregation entrypoint for source-side consumers. The build composes the authored modules and aggregator into one generated `dist/data/library-data.js` classic-script bundle, preserving the Site contract and `window.PersonaLibraryData` shape.

No module is a reference-only pointer: each owns actual authored records moved out of the former monolith.

## Change-impact map

Required updates:

- `scripts/build-library.mjs`: compose modules into the generated bundle rather than copy one monolith.
- `scripts/validation/context.mjs`: load authored module sources in deterministic order before the compatibility aggregator.
- `eval/isolated-persona-skill.mjs`: use the same authored source sequence for isolated evaluation.
- `ARCHITECTURE.md`: replace the monolithic-source description with the actual modular source boundary.
- current instructions or tests that explicitly assert the source is a single file: update only where operationally required.

Historical Work Orders remain historical evidence and are not rewritten merely because source paths evolve.
