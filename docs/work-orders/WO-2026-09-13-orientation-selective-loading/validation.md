# Selective orientation loading validation

- Work Order: WO-2026-09-13-orientation-selective-loading
- GitHub issue: #69
- Date: 2026-09-13
- Status: complete for repository implementation checks

## Checks passed

- `node scripts/build-library.mjs` copied the canonical bootstrap and all nine declared route groups into `dist/data/`.
- `node scripts/validate-content.mjs` passed: 20 Personas, 2 operators, 2 leaders, 16 specialists, and 20 workflow maps.
- `node --check` passed for the build script, content validator, generated data modules, shared browser modules, and workflow-canvas modules.
- Inline JavaScript in `dist/templates.html` and `dist/template.html` parsed successfully with `new Function`.
- `git diff --check` passed; only the repository's existing LF-to-CRLF normalization warnings were emitted.

## Structural checks added or re-run

- Bootstrap schema `2.0` is checked for universal policy and the absence of an authored monolithic `routing.routes` list.
- Each existing primary space declares exactly one `content/orientation/<space>.json` route group and its expected route count.
- Each group preserves its space-level read/write/do-not contract, declares the matching primary space, and has a fresh generated copy.
- The validator checks the pre-split route inventory: all 29 route IDs are present exactly once, route semantics remain valid, repository Skill packages resolve, and universal policy fields are not duplicated in groups.
- The orientation golden set now includes selective-loading and route-set/generated-copy regression cases.

## Context measurements

| Context surface | Bytes | Lines | Routes |
| --- | ---: | ---: | ---: |
| Pre-split `content/site-orientation.json` | 43,676 | 622 | 29 |
| Bootstrap `content/site-orientation.json` | 9,215 | 202 | index |
| `AGENTS.md` activation contract | 3,136 | 25 | pointer |
| Selected `orientation/personas.json` | 3,774 | 116 | 3 |
| Selected `orientation/templates.json` | 8,191 | 205 | 5 |
| Selected `orientation/docs.json` | 7,428 | 227 | 6 |

The representative bootstrap-plus-route contexts are 16,125 bytes for Personas, 20,542 bytes for Templates, and 19,779 bytes for Docs when `AGENTS.md` is included. Each is materially smaller than loading the old monolith with the activation contract, while preserving the selected route contract.

## Bounded limitations

- The measurement is a repository context comparison, not a token benchmark across model runtimes.
- Browser smoke behavior for the Template pages was previously recorded in the #68 Work Order and the current change does not modify either Template page. Current inline-script parsing and full content validation were re-run; no external Template artifact was fetched or rendered.
