# WO-2026-09-18-packet-tracker-handoff

- Issue: #153
- Branch: `feat/packet-tracker-handoff`
- Request mode: update
- Goal: connect application-packet lifecycle events to the browser-local Applications tracker without introducing remote persistence or weakening submission authorization.

## Placement

Extend the existing Applications tracker and application-packet Work Order. Do not create a new Persona, Skill, Playbook, storage service, or tracker database.

## Implementation

- Versioned `persona-library-job-application-handoff` payload.
- Base64url payload in `#handoff=` fragment.
- Confirmed client-side upsert.
- Existing-record identity by canonical posting URL, otherwise company + role + location.
- HTTP(S)-only posting/packet links.
- Fragment cleared after processing.
- Packet Work Order emits lifecycle handoffs at Reviewing, Packet Ready, Applied, Interviewing, Offer, or Closed as appropriate.
- No tracker event grants submission or outreach authorization.

## Privacy

Handoff links are private transient metadata, not encryption. Do not include credentials, demographic answers, or candidate evidence beyond allowed tracker-row fields.

## Merge boundary

Open a PR for review; do not merge without separate authorization.
