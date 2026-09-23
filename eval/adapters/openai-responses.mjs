import { validateUsage } from '../contract.mjs';

export function normalizeOpenAIResponseUsage(response, { turnId, observedAt } = {}) {
  const responseUsage = response?.usage;
  const responseId = turnId || response?.id || null;
  if (!responseUsage) {
    return {
      measurement: 'unavailable',
      scope: 'turn',
      ...(responseId ? { turn_id: responseId } : {}),
      input_tokens: null,
      cached_input_tokens: null,
      output_tokens: null,
      reasoning_tokens: null,
      total_tokens: null,
      source: 'OpenAI Responses API response.usage',
      reason: 'The response did not expose a usage object.'
    };
  }
  if (!responseId) throw new Error('A stable response id or caller-supplied turnId is required for measured usage.');

  const usage = {
    measurement: 'measured',
    scope: 'turn',
    turn_id: responseId,
    input_tokens: responseUsage.input_tokens ?? null,
    cached_input_tokens: responseUsage.input_tokens_details?.cached_tokens ?? null,
    output_tokens: responseUsage.output_tokens ?? null,
    reasoning_tokens: responseUsage.output_tokens_details?.reasoning_tokens ?? null,
    total_tokens: responseUsage.total_tokens ?? null,
    source: 'OpenAI Responses API response.usage',
    observed_at: observedAt || new Date().toISOString(),
    provider_metadata: {
      provider: 'OpenAI',
      model: response?.model || null,
      response_id: response?.id || responseId
    }
  };
  const validation = validateUsage(usage);
  if (!validation.valid) throw new Error('OpenAI response usage could not be normalized: ' + validation.errors.join('; '));
  return usage;
}
