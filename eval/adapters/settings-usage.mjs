import { validateAllowanceSnapshot } from '../allowance-usage.mjs';

function normalizeWindow(window) {
  const base = { window_id: window.window_id, reset_at: window.reset_at ?? null, resolution: window.resolution ?? null };
  const candidates = [
    ['used_percent', 'percent', 'used'],
    ['remaining_percent', 'percent', 'remaining'],
    ['used_credits', 'credits', 'used'],
    ['remaining_credits', 'credits', 'remaining']
  ].filter(([field]) => window[field] !== undefined && window[field] !== null);
  if (window.value !== undefined || window.unit !== undefined || window.mode !== undefined) {
    if (candidates.length) throw new Error(`Settings usage window ${window.window_id || '(unknown)'} mixes normalized and convenience fields.`);
    return { ...base, unit: window.unit, mode: window.mode, value: window.value };
  }
  if (candidates.length !== 1) throw new Error(`Settings usage window ${window.window_id || '(unknown)'} must provide exactly one supported value field.`);
  const [field, unit, mode] = candidates[0];
  return { ...base, unit, mode, value: window[field] };
}

export function normalizeSettingsUsageSnapshot(input) {
  if (!input || typeof input !== 'object') throw new Error('Settings usage input must be an object.');
  const snapshot = {
    source: input.source || 'ChatGPT Settings → Usage',
    observed_at: input.observed_at,
    windows: (input.windows || []).map(normalizeWindow)
  };
  const validation = validateAllowanceSnapshot(snapshot);
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  return snapshot;
}
