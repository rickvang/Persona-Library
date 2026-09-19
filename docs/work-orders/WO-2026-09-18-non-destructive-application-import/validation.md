# Validation — WO-2026-09-18-non-destructive-application-import

## Automated coverage

The focused tracker tests cover:

- importing into an empty tracker;
- importing four new records alongside unrelated existing state;
- re-importing the same source without duplicates;
- protecting an existing `Applied` record from incoming `Packet Ready`;
- preserving existing user notes and next action;
- filling an empty `packetUrl`;
- canonical-equivalent source URLs;
- malformed records and unsupported/newer payloads failing safely;
- explicit Replace all availability;
- absence of private opportunity records from tracker source/runtime fixtures.

## Generated/source checks

- `client/job-tracker-import.js` exactly matches `dist/js/job-tracker-import.js`.
- `client/job-tracker.js` exactly matches `dist/js/job-tracker.js`.
- `content/job-tracker-page.html` exactly matches `dist/job-tracker.html`.
- Build wiring copies the new import module into generated output.
- Contract and validator enforce browser-local storage, version 1 portability, no network persistence, and no private seed data.

## Canonical commands

Run before review completion:

```text
node scripts/build-library.mjs
node --test scripts/validation/validation.test.mjs
node scripts/validate-content.mjs
git diff --check
```

## Browser evidence

If a current Applications tracker deployment is available, verify import review, safe merge, explicit Replace all, and localStorage persistence. Do not report private records as inserted unless the browser-local result is directly inspected.
