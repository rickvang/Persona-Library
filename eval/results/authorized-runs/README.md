# Authorized run bundles

Keep one sanitized JSON bundle per model surface and run in this directory.

The bundle is the durable evidence record. Keep it compact:

- common run conditions appear once at the top level;
- each fixture has only its outcome, mode, assumptions, evidence, limitations, next action, and result class;
- the fixture ID supplies the expected contract from `eval/cases.json`;
- raw transcripts, repeated explanations, private prompts, credentials, session links, and sensitive traces stay outside the public repository.

Historical bundles remain available for comparison. New runs should not copy a full surface report into the repository.
