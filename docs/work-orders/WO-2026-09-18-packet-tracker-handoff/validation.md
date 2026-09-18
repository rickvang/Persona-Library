# Validation — packet tracker handoff

- Tracker source/runtime generated parity required.
- Handoff requires exact format/version/upsert operation.
- Handoff requires company + role.
- Handoff URLs restricted to HTTP(S).
- Existing row is updated by posting URL or company/role/location fallback rather than duplicated.
- User confirmation required before local mutation.
- Fragment cleared after success, decline, or error.
- No remote `fetch()` persistence path.
- Application Work Order requires tracker state/handoff fields and Packet Ready/Applied mapping.
- DEC-017 records the durable integration boundary.

Canonical local Node build/test commands remain required before merge when executable.
