# Authored Site pages

These HTML files are the authored sources for static Site routes that publish at the matching top-level path under `dist/`.

- Edit pages here, not under `dist/`.
- `scripts/build-library.mjs` copies these files into `dist/` and then applies the shared Applications-navigation normalization used by the existing Site build.
- `dist/decisions.html` is rendered from Decision records instead of this directory.
- `dist/job-tracker.html` is copied from `content/job-tracker-page.html`.

The published route names are intentionally stable; this directory changes authoring provenance, not URLs.
