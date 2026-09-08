# Conformance adapters

Adapters translate a model or assistant surface into the normalized result shape consumed by `eval/contract.mjs`.

The first implementation is deliberately file-based. A runtime adapter must provide the fixture ID, model and version, surface, repository reference, supplied context, available and attempted Tools, permission results, response-contract fields, claims about execution or mutation, and evidence references.

An adapter must record unavailable access as an access condition. It must not turn a missing credential, connector, trace, or permission into an inferred success.

Provider-specific adapters belong here only when the runtime and authorization are available. The repository currently includes the recorded-result adapter for replayable, sanitized evidence; it does not claim live access to external LLM providers.
