(() => {
  const FORMAT = 'persona-library-job-applications';
  const VERSION = 1;
  const STATUSES = ['Found', 'Reviewing', 'Packet Ready', 'Applied', 'Interviewing', 'Offer', 'Closed'];
  const STATUS_RANK = Object.fromEntries(STATUSES.map((status, index) => [status, index]));
  const RECORD_FIELDS = ['id', 'company', 'role', 'status', 'location', 'compensation', 'foundDate', 'appliedDate', 'nextAction', 'sourceUrl', 'packetUrl', 'notes', 'updatedAt'];

  function defaultId() {
    return globalThis.crypto?.randomUUID?.() || 'job-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function safeUrl(value) {
    if (!value) return '';
    try {
      const parsed = new URL(value);
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
    } catch {
      return '';
    }
  }

  function canonicalizeSourceUrl(value) {
    const href = safeUrl(value);
    if (!href) return '';
    const parsed = new URL(href);
    parsed.hash = '';
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.protocol = parsed.protocol.toLowerCase();
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    const keptParams = [...parsed.searchParams]
      .filter(([key]) => !/^utm_/i.test(key) && !['fbclid', 'gclid', 'mc_cid', 'mc_eid'].includes(key.toLowerCase()))
      .sort(([left], [right]) => left.localeCompare(right));
    parsed.search = '';
    for (const [key, valuePart] of keptParams) parsed.searchParams.append(key, valuePart);
    return parsed.href;
  }

  function normalizeRecord(record = {}, createId = defaultId, getNow = nowIso) {
    return {
      id: String(record.id || createId()),
      company: String(record.company || '').trim(),
      role: String(record.role || '').trim(),
      status: STATUSES.includes(record.status) ? record.status : 'Found',
      location: String(record.location || '').trim(),
      compensation: String(record.compensation || '').trim(),
      foundDate: String(record.foundDate || ''),
      appliedDate: String(record.appliedDate || ''),
      nextAction: String(record.nextAction || '').trim(),
      sourceUrl: safeUrl(record.sourceUrl),
      packetUrl: safeUrl(record.packetUrl),
      notes: String(record.notes || '').trim(),
      updatedAt: String(record.updatedAt || getNow())
    };
  }

  function parseImport(parsed) {
    if (Array.isArray(parsed)) return parsed;
    if (!parsed || typeof parsed !== 'object' || parsed.format !== FORMAT) throw new Error('Unsupported tracker format');
    const version = Number(parsed.version ?? VERSION);
    if (!Number.isInteger(version) || version < 1 || version > VERSION) throw new Error('Tracker export is from a newer or unsupported version');
    if (!Array.isArray(parsed.records)) throw new Error('No records array found');
    return parsed.records;
  }

  function normalizeIncoming(incoming, createId, getNow) {
    if (!Array.isArray(incoming)) throw new Error('No records array found');
    return incoming.map((record, index) => {
      const normalized = normalizeRecord(record, createId, getNow);
      if (!normalized.company || !normalized.role) throw new Error('Invalid tracker record at index ' + index + ': company and role are required');
      return normalized;
    });
  }

  function identityMatches(working, record) {
    const inputId = String(record.id || '').trim();
    const sourceKey = canonicalizeSourceUrl(record.sourceUrl);
    const byId = inputId ? working.map((candidate, index) => candidate.id === inputId ? index : -1).filter(index => index >= 0) : [];
    const byUrl = sourceKey ? working.map((candidate, index) => canonicalizeSourceUrl(candidate.sourceUrl) === sourceKey ? index : -1).filter(index => index >= 0) : [];
    const unique = values => [...new Set(values)];
    const idMatches = unique(byId);
    const urlMatches = unique(byUrl);
    if (idMatches.length > 1 || urlMatches.length > 1 || (idMatches.length && urlMatches.length && idMatches[0] !== urlMatches[0])) {
      return { conflict: true, reason: 'Incoming identity matches multiple existing records or has conflicting id/sourceUrl identities' };
    }
    if (idMatches.length) return { index: idMatches[0], matchedBy: 'id' };
    if (urlMatches.length) return { index: urlMatches[0], matchedBy: 'sourceUrl' };
    return { index: -1, matchedBy: 'new' };
  }

  function mergeRecord(existing, incoming, getNow = nowIso) {
    const existingRank = STATUS_RANK[existing.status] ?? 0;
    const incomingRank = STATUS_RANK[incoming.status] ?? 0;
    return {
      ...existing,
      id: existing.id || incoming.id,
      company: existing.company || incoming.company,
      role: existing.role || incoming.role,
      status: incomingRank > existingRank ? incoming.status : existing.status,
      location: existing.location || incoming.location,
      compensation: existing.compensation || incoming.compensation,
      foundDate: existing.foundDate || incoming.foundDate,
      appliedDate: existing.appliedDate || incoming.appliedDate,
      nextAction: existing.nextAction || incoming.nextAction,
      sourceUrl: incoming.sourceUrl || existing.sourceUrl,
      packetUrl: existing.packetUrl || incoming.packetUrl,
      notes: existing.notes || incoming.notes,
      updatedAt: getNow()
    };
  }

  function comparable(record) {
    return RECORD_FIELDS.filter(field => field !== 'updatedAt').reduce((result, field) => {
      result[field] = record[field] || '';
      return result;
    }, {});
  }

  function sameRecord(left, right) {
    return JSON.stringify(comparable(left)) === JSON.stringify(comparable(right));
  }

  function previewMerge(existingRecords, incomingRecords, options = {}) {
    const createId = options.createId || defaultId;
    const getNow = options.getNow || nowIso;
    const working = (Array.isArray(existingRecords) ? existingRecords : []).map(record => normalizeRecord(record, createId, getNow));
    const incoming = normalizeIncoming(incomingRecords, createId, getNow);
    const conflicts = [];
    let added = 0;
    let updated = 0;
    let unchanged = 0;

    for (const candidate of incoming) {
      const match = identityMatches(working, candidate);
      if (match.conflict) {
        conflicts.push({ record: candidate, reason: match.reason });
        continue;
      }
      if (match.index < 0) {
        working.push(candidate);
        added += 1;
        continue;
      }
      const merged = mergeRecord(working[match.index], candidate, getNow);
      if (sameRecord(working[match.index], merged)) unchanged += 1;
      else {
        working[match.index] = merged;
        updated += 1;
      }
    }

    return { records: working, incoming, added, updated, unchanged, conflicts };
  }

  function replaceAll(incomingRecords, options = {}) {
    const createId = options.createId || defaultId;
    const getNow = options.getNow || nowIso;
    return normalizeIncoming(incomingRecords, createId, getNow);
  }

  globalThis.PersonaLibraryJobTrackerImport = Object.freeze({
    FORMAT,
    VERSION,
    STATUSES,
    safeUrl,
    canonicalizeSourceUrl,
    normalizeRecord,
    parseImport,
    previewMerge,
    replaceAll
  });
})();
