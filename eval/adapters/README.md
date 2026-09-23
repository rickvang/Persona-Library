# Conformance adapters

Adapters translate a model or assistant surface into the normalized result shape consumed by `eval/contract.mjs`.

The first implementation is deliberately file-based. A runtime adapter must provide the fixture ID, model and version, surface, repository reference, supplied context, available and attempted Tools, permission results, response-contract fields, claims about execution or mutation, and evidence references.

An adapter must record unavailable access as an access condition. It must not turn a missing credential, connector, trace, or permission into an inferred success.

Provider integrations that make requests or connect to runtimes belong here only when the runtime and authorization are available. A normalizer can accept a caller-supplied response object without provider connectivity. The repository currently includes the recorded-result adapter for replayable, sanitized evidence; it does not claim live access to external LLM providers.


## Token-usage adapters

A surface adapter may normalize token counts only from metadata returned directly by that runtime. openai-responses.mjs accepts a completed OpenAI Responses API response object and reads only its usage fields and response identity. It does not make requests, read credentials, or retain prompts or traces. If usage is absent, the adapter returns unavailable evidence. Do not label subscription allowance, static context estimates, or inferred counts as measured API usage.

