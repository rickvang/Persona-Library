# Validation — Supabase opportunity persistence

- Work Order: `WO-2026-09-19-supabase-opportunity-store`
- Date: 2026-09-19
- Branch: `feat/issue-156-supabase-opportunity-store`

## Checks completed through connected repository tooling

- Current branch is based on `main @ bb41dac2b9dc887547ff00f7ab305c8e26b270a3` with no behind drift at implementation checkpoint.
- `client/job-tracker-config.js` parses as JavaScript.
- `client/job-tracker-import.js` parses as JavaScript.
- `client/job-tracker-store.js` parses as JavaScript.
- `client/job-tracker.js` parses as JavaScript.
- Decision JSON parses; DEC-016 is `Superseded`; DEC-017 exists.
- Applications page includes:
  - explicit storage-mode state;
  - auth form;
  - local-data migration control;
  - pinned `@supabase/supabase-js@2.116.0` browser dependency;
  - config → import → store → runtime script sequence.
- Tracker contract includes authenticated private storage, RLS, adapter separation, versioned export/import, and no-silent-fallback requirements.
- Architecture contains the authenticated private Supabase boundary.
- Repository diff contains no committed real opportunity records or Supabase secret/service-role key.

## Checks encoded for repository validation

Updated validation requires:

- generated store output freshness;
- explicit local/supabase generated config mode;
- pinned reviewed Supabase browser client;
- LocalStorage and Supabase store implementations;
- authenticated Supabase schema access and persisted auth session;
- sign-in flow with `shouldCreateUser: false`;
- non-destructive import/replace behavior;
- no silent remote → local write fallback;
- DEC-016 supersession + DEC-017 source-of-truth boundary;
- no candidate-specific seed values;
- no secret/service-role client key.

## Not executed / not yet claimable

The connected GitHub surface does not expose repository command execution, so these commands have **not** been claimed as passed:

- `node scripts/build-library.mjs`
- `node --test scripts/validation/validation.test.mjs`
- `node scripts/validate-content.mjs`

Generated `dist/` output has not been hand-edited; it must be produced by the canonical build.

Remote database validation is also not yet claimable because no Persona-Library Supabase project has been authorized or created. Therefore the following remain blocked:

- applying the schema as a real migration;
- Data API exposed-schema verification;
- owner auth setup;
- cross-user RLS tests;
- security/performance advisors;
- local → remote opportunity migration;
- live CRUD proof;
- deployment env configuration.

## Current gate

Repository source implementation: ready for review, subject to canonical build/test execution.

Remote proof: blocked on explicit Supabase organization selection and project cost confirmation.
