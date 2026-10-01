# Authored Site pages

This directory contains authored page shells and the shared reference-reader template. [scripts/build-library.mjs](../../scripts/build-library.mjs) publishes them together with canonical records, selected Markdown sources, and shared browser modules. Edit authored sources and rebuild; never edit `dist/` directly.

## Choose the authoring source

| What changes | Authored source | Build behavior |
| --- | --- | --- |
| A listed static page's layout or copy | Its HTML shell here, such as [index.html](index.html) or [system-map.html](system-map.html) | The build's explicit page list copies it to the same top-level route, then applies shared navigation normalization |
| Playbook identity or status | [catalogs.js](../library-data/catalogs.js) | Canonical catalog data feeds the published surfaces |
| Published Playbook or reference content | The Markdown source selected in [site-publication.json](../site-publication.json); use the [Docs task index](../../docs/README.md) to find its owner | The reference builder derives catalog summaries, static readers, the Docs index, and map data from selected sources |
| Playbooks catalog presentation | [playbooks.html](playbooks.html) | The reference builder fills its source-derived catalog content |
| Human guide copy or Docs index presentation | [guide.html](guide.html) | The reference builder adds the curated reference index and current catalog-state examples |
| Shared reference-reader layout or behavior | [reference-reader.html](reference-reader.html), [reference-page.mjs](../../client/reference-page.mjs), and [reference-pages.css](../../client/reference-pages.css) | The HTML is a template for generated readers, not a standalone public route |
| Decisions | [records.json](../../docs/decisions/records.json) and [decisions-page.html](../decisions-page.html) | The Decisions builder renders `dist/decisions.html` |
| Applications tracker page | [job-tracker-page.html](../job-tracker-page.html) and relevant [client modules](../../client/) | The build copies the authored tracker page to `dist/job-tracker.html` |

Adding an HTML file here does not publish a route automatically: the main build has an explicit page list. Adding a Markdown document likewise does not publish it automatically: the publication manifest is an explicit allowlist, and existing Playbook IDs keep their source bindings.

[skill-formation-overview.md](skill-formation-overview.md) is an authored overview, not a bound authoritative process contract. Preserve that distinction. Three existing job-search Markdown URLs under `dist/docs/` remain compatibility copies of their selected sources. Internal notes, work records and archives, and Prototyping are not automatically selected as published references.

## Rebuild and check

Follow [Run locally](../../README.md#run-locally) to install build dependencies, rebuild, validate, and serve `dist/` over HTTP. For changes to source publication, also run the focused test:

```text
node --test scripts/validation/reference-publication.test.mjs
```

Use [repository-validation.yml](../../.github/workflows/repository-validation.yml) for the remaining completion gates, and inspect the rebuilt affected route and source links. The published route names remain stable; this guide describes authoring provenance, not new URLs.
