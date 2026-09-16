import { readFile, writeFile } from 'node:fs/promises';

const replaceOnce = (source, from, to, label) => {
  const first = source.indexOf(from);
  if (first < 0) throw new Error(`Missing anchor: ${label}`);
  if (source.indexOf(from, first + from.length) >= 0) throw new Error(`Ambiguous anchor: ${label}`);
  return source.slice(0, first) + to + source.slice(first + from.length);
};

let implementation = await readFile('docs/job-search/implementation.md', 'utf8');
implementation = replaceOnce(
  implementation,
  '- The end-to-end search workflow owned by the Evidence-led Job Search Playbook',
  '- The end-to-end search workflow defined by the Evidence-led Job Search Playbook and operated by the Job Search Orchestrator',
  'stale Playbook ownership bullet',
);
await writeFile('docs/job-search/implementation.md', implementation, 'utf8');

let validator = await readFile('scripts/validation/generated.mjs', 'utf8');
validator = replaceOnce(
  validator,
  "  if (!jobSearchImpl.includes('Evidence-led Job Search Playbook') || !jobSearchImpl.includes('Job search orchestrator (Priya Desai)') || !jobSearchImpl.includes('Riley Morgan · AI orchestrator') || !jobSearchImpl.includes('job ledger contract')) throw new Error('docs/job-search/implementation.md must define Priya as the Playbook operator, preserve Riley as general AI orchestrator, and retain the ledger contract');",
  "  if (!jobSearchImpl.includes('Evidence-led Job Search Playbook') || !jobSearchImpl.includes('Job search orchestrator (Priya Desai)') || !jobSearchImpl.includes('Riley Morgan · AI orchestrator') || !jobSearchImpl.includes('job ledger contract')) throw new Error('docs/job-search/implementation.md must define Priya as the Playbook operator, preserve Riley as general AI orchestrator, and retain the ledger contract');\n  if (jobSearchImpl.includes('workflow owned by the Evidence-led Job Search Playbook') || jobSearchImpl.includes('Playbook owns the outcome') || jobSearchImpl.includes('Playbook → owns the outcome')) throw new Error('Job-search implementation must not present the Playbook as the actor or outcome owner');",
  'job-search ownership regression assertion',
);
await writeFile('scripts/validation/generated.mjs', validator, 'utf8');

let validation = await readFile('docs/work-orders/WO-2026-09-16-persona-operated-playbooks/validation.md', 'utf8');
validation = replaceOnce(
  validation,
  '- Focused validator checks confirm Priya Desai / `job-search-orchestrator`, the campaign-health and recovery workflows, reused orchestration Skill applications, Persona-operated Playbook wording, Docs routing, DEC-013 supersession, ledger ownership/privacy, and current Site presentation.',
  '- Focused validator checks confirm Priya Desai / `job-search-orchestrator`, the campaign-health and recovery workflows, reused orchestration Skill applications, Persona-operated Playbook wording, Docs routing, DEC-013 supersession, ledger ownership/privacy, and current Site presentation.\n- Final regression coverage rejects stale job-search wording that assigns workflow/outcome ownership to the Playbook; the final branch validation is rerun after this correction.',
  'validation evidence note',
);
await writeFile('docs/work-orders/WO-2026-09-16-persona-operated-playbooks/validation.md', validation, 'utf8');
