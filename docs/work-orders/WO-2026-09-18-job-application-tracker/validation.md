# Validation — WO-2026-09-18-job-application-tracker

## Source and generated checks

- PASS — `content/job-tracker-page.html` exactly matches `dist/job-tracker.html`.
- PASS — `client/job-tracker.js` exactly matches `dist/js/job-tracker.js`.
- PASS — all primary Site pages checked on the branch include `job-tracker.html` in primary navigation.
- PASS — tracker source contains no candidate-specific seed values.
- PASS — tracker runtime uses namespaced browser `localStorage` and contains no remote `fetch()` persistence path.
- PASS — lifecycle vocabulary includes Found, Reviewing, Packet Ready, Applied, Interviewing, Offer, and Closed.
- PASS — JSON export/import is versioned with `persona-library-job-applications`.
- PASS — imported external links are restricted to HTTP/HTTPS before rendering.
- PASS — DEC-016 exists in the authored Decision collection and generated Decisions output.
- PASS — focused validator code covers tracker source/generated parity, privacy, lifecycle, portability, no-network persistence, and no candidate seed data.

## Browser/deployment evidence

Vercel preview deployments are being created for `feat/job-application-tracker`. Final preview readiness and page interaction smoke testing must be checked on the latest branch deployment before merge.

## Unexecuted canonical checks

The connected runtime cannot clone the repository into its local test environment, so these canonical commands have **not** been claimed as passed:

```text
node scripts/build-library.mjs
node --test scripts/validation/validation.test.mjs
node scripts/validate-content.mjs
git diff --check
```

The branch materializes the deterministic generated tracker/page/navigation output through the connected GitHub surface, but canonical local Node execution remains a pre-merge verification requirement unless equivalent CI evidence appears on the PR.

## Manual smoke cases still required on the latest preview

1. Open Applications from primary navigation.
2. Add a record.
3. Edit its status and fields.
4. Search/filter it.
5. Export JSON.
6. Delete the record.
7. Import the export and verify restoration.
8. Verify Posting/Packet links reject non-HTTP(S) imported values.
