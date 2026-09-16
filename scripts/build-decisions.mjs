import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const renderInline = value => escapeHtml(value)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');

const renderLine = (label, value) => value
  ? `<div class="record-line"><strong>${escapeHtml(label)}</strong><span>${renderInline(value)}</span></div>`
  : '';

const renderRecord = record => {
  const status = String(record.status || '').toLowerCase();
  const id = String(record.id || '').toLowerCase();
  const meta = [record.id, record.status, record.category, record.date]
    .filter(Boolean)
    .map((value, index) => `<span class="label${index === 1 && status === 'applied' ? ' applied' : index === 1 && status === 'parked' ? ' parked' : ''}">${renderInline(value)}</span>`)
    .join('');
  const lines = [
    ['Question', record.question],
    ['Decision', record.decision],
    ['Rationale', record.rationale],
    ['Alternatives', record.alternatives],
    ['Tradeoffs', record.tradeoffs],
    ['Affects', record.affects],
    ['Evidence', record.evidence],
    ['Status note', record.status_note],
    ['Qualifies', Array.isArray(record.qualifies) ? record.qualifies.join(', ') : record.qualifies],
    ['Revisit when', record.revisit]
  ].map(([label, value]) => renderLine(label, value)).join('');
  const corrections = Array.isArray(record.corrections)
    ? record.corrections.map(correction => renderLine('Correction', correction)).join('')
    : renderLine('Correction', record.corrections);
  return `        <article class="decision-record" id="${escapeHtml(id)}" data-status="${escapeHtml(status)}"><div class="record-meta">${meta}</div><h3>${renderInline(record.title)}</h3><p class="record-summary">${renderInline(record.summary)}</p><div class="record-lines">${lines}${corrections}</div></article>`;
};

const renderSummary = records => {
  const applied = records.filter(record => String(record.status).toLowerCase() === 'applied').length;
  const parked = records.filter(record => String(record.status).toLowerCase() === 'parked').length;
  return `      <div class="summary-card"><span>Applied decisions</span><strong>${applied}</strong><p>Current recorded choices for the Persona system, including routing, ownership, library boundaries, and evidence-backed practice.</p></div><div class="summary-card"><span>Parked records</span><strong>${parked}</strong><p>Future capabilities preserved with reasons and revisit notes.</p></div><div class="summary-card"><span>Current principle</span><strong>Context first</strong><p>Keep capabilities and priorities attached to the work where they matter.</p></div>`;
};

export function renderDecisionsPage(template, records) {
  const normalizedTemplate = template.replace(/\r\n?/g, '\n');
  const output = normalizedTemplate
    .replace('<!-- GENERATED:DECISION_SUMMARY -->', renderSummary(records))
    .replace('<!-- GENERATED:DECISION_COUNT -->', `${records.length} ${records.length === 1 ? 'record' : 'records'}`)
    .replace('        <!-- GENERATED:DECISION_RECORDS -->', records.map(renderRecord).join('\n'));
  if (output.includes('GENERATED:DECISION_')) throw new Error('Decision page template contains an unresolved generation marker');
  return `${output.replace(/\n+$/, '')}\n`;
}

export async function buildDecisionsPage(root) {
  const [template, source] = await Promise.all([
    readFile(path.join(root, 'content/decisions-page.html'), 'utf8'),
    readFile(path.join(root, 'docs/decisions/records.json'), 'utf8')
  ]);
  const parsed = JSON.parse(source);
  const records = parsed.records;
  const ids = new Set();
  if (!Array.isArray(records) || records.length === 0) throw new Error('Decision source must contain at least one record');
  for (const record of records) {
    if (!record?.id || ids.has(record.id) || !record.status || !record.title || !record.summary) throw new Error(`Decision source has an invalid or duplicate record: ${record?.id || '(missing)'}`);
    ids.add(record.id);
  }
  const outputPath = path.join(root, 'dist/decisions.html');
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderDecisionsPage(template, records), 'utf8');
  console.log(`Built ${records.length} authored Decision records -> dist/decisions.html`);
}
