import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PREVIEW_MARKER = '[vercel-preview]';

export function shouldIgnoreVercelBuild({
  commitRef = '',
  commitMessage = '',
  productionBranch = 'main'
} = {}) {
  const ref = String(commitRef || '').trim();
  const message = String(commitMessage || '').toLowerCase();

  if (!ref) return false;
  if (ref === productionBranch) return false;
  return !message.includes(PREVIEW_MARKER);
}

const isDirectExecution = Boolean(process.argv[1])
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  const commitRef = process.env.VERCEL_GIT_COMMIT_REF || '';
  const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE || '';
  const ignore = shouldIgnoreVercelBuild({ commitRef, commitMessage });

  if (ignore) {
    console.log(`Skipping Vercel build for ${commitRef || 'unknown ref'}: no meaningful preview checkpoint marker.`);
    process.exit(0);
  }

  console.log(`Running Vercel build for ${commitRef || 'unknown ref'}: production or explicit preview checkpoint.`);
  process.exit(1);
}
