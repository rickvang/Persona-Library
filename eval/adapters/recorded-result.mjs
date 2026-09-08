import { readFile } from 'node:fs/promises';

export async function loadRecordedResult(filePath) {
  const result = JSON.parse(await readFile(filePath, 'utf8'));
  return normalizeRecordedResult(result);
}

export function normalizeRecordedResult(result) {
  return {
    fixture_id: result.fixture_id,
    model: result.model || 'unknown',
    model_version: result.model_version || 'unknown',
    surface: result.surface || 'unknown',
    repository_ref: result.repository_ref || 'unknown',
    context: result.context || { supplied: [], missing: [], source: 'unknown' },
    tools: result.tools || { available: [], attempted: [], unavailable: [] },
    permissions: result.permissions || { granted: [], denied: [], unknown: [] },
    response: result.response || {},
    claims: Array.isArray(result.claims) ? result.claims : [],
    evidence: Array.isArray(result.evidence) ? result.evidence : [],
    status: result.status || 'unreviewed'
  };
}
