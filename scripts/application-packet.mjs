/** Native-tool runner. No credentials, candidate data, Node imports or paid API required.
 * Keep input/checkpoint private. Call again with the same checkpoint and a final-file
 * review to record the packet. The caller supplies current tools and domain judgment.
 */
export async function runApplicationPacket(input, tools, checkpoint = {}) {
  const state = checkpoint;
  const fail = message => { throw new Error(message); };
  const unpack = value => {
    if (value?.isError) fail('Provider reported a failure; inspect its tool result.');
    if (value?.structuredContent) return unpack(value.structuredContent);
    if (Array.isArray(value?.content)) {
      const text = value.content.filter(x => x.type === 'text').map(x => x.text).join('\n');
      let parsed;
      try { parsed = JSON.parse(text); } catch { return text; }
      return unpack(parsed);
    }
    if (typeof value?.content === 'string') {
      let parsed;
      try { parsed = JSON.parse(value.content); } catch { return value.content; }
      return unpack(parsed);
    }
    return value;
  };
  const call = async (name, args) => {
    const fn = tools[name] || tools[`mcp__codex_apps__${name}`];
    if (typeof fn !== 'function') { delete state.pendingMutation; fail(`Required native tool unavailable: ${name}`); }
    state.calls = (state.calls || 0) + 1;
    return unpack(await fn(args));
  };
  const snapshot = doc => {
    if (!doc?.documentId || !doc.revisionId) fail('A complete native document revision is required.');
    if (doc.tabs?.length > 1 || doc.tabs?.[0]?.childTabs?.length) fail('Multiple tabs need the exception path.');
    const tab = doc.tabs?.[0];
    const body = tab?.body || tab?.documentTab?.body || doc.body;
    const tabId = tab?.tabId || tab?.tabProperties?.tabId;
    const paragraphs = [];
    const walk = content => {
      for (const item of content || []) {
        if (item.paragraph) {
          const runs = item.paragraph.elements?.filter(x => x.textRun?.content) || [];
          paragraphs.push({ runs, text: runs.map(x => x.textRun.content).join('') });
        }
        for (const row of item.table?.tableRows || [])
          for (const cell of row.tableCells || []) walk(cell.content);
      }
    };
    if (!body?.content) fail('Native document body unavailable.');
    walk(body.content);
    return { id: doc.documentId, revision: doc.revisionId, tabId, paragraphs, text: paragraphs.map(p => p.text).join('') };
  };
  const protectedOrder = text => {
    const positions = [];
    for (const token of input.protectedText) {
      let start = 0, occurrence = 0;
      while ((start = text.indexOf(token, start)) !== -1) {
        positions.push({ token, occurrence: occurrence++, start });
        start += token.length;
      }
      if (!occurrence) fail('A protected career-spine value is missing.');
    }
    return JSON.stringify(positions.sort((a, b) => a.start - b.start || a.token.localeCompare(b.token)).map(({ token, occurrence }) => [token, occurrence]));
  };
  const plan = doc => {
    const edits = input.edits.map(edit => {
      if (!edit.before || typeof edit.after !== 'string' || /[\r\n]/.test(edit.before + edit.after))
        fail('Routine edits must replace nonempty text inside one paragraph.');
      const matches = [];
      for (const paragraph of doc.paragraphs) {
        let offset = -1;
        while ((offset = paragraph.text.indexOf(edit.before, offset + 1)) !== -1) matches.push({ paragraph, offset });
      }
      if (matches.length !== 1) fail('Each edit must match exactly once in the original document.');
      const { paragraph, offset } = matches[0];
      const indexAt = offset => {
        for (const run of paragraph.runs) {
          if (offset < run.textRun.content.length) return run.startIndex + offset;
          offset -= run.textRun.content.length;
        }
        fail('An edit cannot include a paragraph boundary.');
      };
      const start = indexAt(offset), end = indexAt(offset + edit.before.length - 1) + 1;
      if (!Number.isInteger(start) || end - start !== edit.before.length) fail('An edit crosses unsupported inline content.');
      const styles = paragraph.runs.filter(r => r.startIndex < end && r.endIndex > start)
        .map(r => ({ bold: r.textRun.textStyle?.bold === true, italic: r.textRun.textStyle?.italic === true }));
      if (!edit.style && new Set(styles.map(s => JSON.stringify(s))).size > 1)
        fail('Mixed-style edits require an explicit base style and styled spans.');
      for (const span of edit.spans || []) {
        if (!Number.isInteger(span.start) || !Number.isInteger(span.end) || span.start < 0 || span.end > edit.after.length || span.end <= span.start)
          fail('Styled spans must stay inside the replacement.');
        if (!span.style || !Object.keys(span.style).length) fail('Styled spans need an explicit style.');
      }
      if (edit.style && !Object.keys(edit.style).length) fail('Replacement style cannot be empty.');
      return { ...edit, start, end, style: edit.style || styles[0] || { bold: false, italic: false } };
    }).sort((a, b) => b.start - a.start);
    for (let i = 1; i < edits.length; i++) if (edits[i].end > edits[i - 1].start) fail('Edits cannot overlap.');
    const range = (startIndex, endIndex) => ({ startIndex, endIndex, ...(doc.tabId ? { tabId: doc.tabId } : {}) });
    const requests = [];
    for (const edit of edits) {
      requests.push({ deleteContentRange: { range: range(edit.start, edit.end) } });
      if (edit.after) {
        requests.push({ insertText: { location: { index: edit.start, ...(doc.tabId ? { tabId: doc.tabId } : {}) }, text: edit.after } });
        requests.push({ updateTextStyle: { range: range(edit.start, edit.start + edit.after.length), textStyle: edit.style, fields: Object.keys(edit.style).join(',') } });
        for (const span of edit.spans || []) requests.push({ updateTextStyle: {
          range: range(edit.start + span.start, edit.start + span.end), textStyle: span.style, fields: Object.keys(span.style).join(',')
        } });
      }
    }
    // Text expectations use the original paragraphs, never a cascade of replacements.
    const expected = doc.paragraphs.map(paragraph => {
      let text = paragraph.text;
      const local = edits.map(edit => ({ edit, offset: paragraph.text.indexOf(edit.before) }))
        .filter(x => x.offset >= 0).sort((a, b) => b.offset - a.offset);
      for (const { edit, offset } of local) text = text.slice(0, offset) + edit.after + text.slice(offset + edit.before.length);
      return text;
    }).join('');
    if (protectedOrder(doc.text) !== protectedOrder(expected)) fail('Edits change protected facts, coverage or career order.');
    return { requests, expected };
  };
  const privateFile = async (id, folder = false) => {
    const file = await call('google_drive_get_file_metadata', { fileId: id, fields: 'id,mimeType,parents,permissions(type,role)' });
    if (!file.permissions?.length || file.permissions.some(p => p.type !== 'user' || p.role !== 'owner'))
      fail('Owner-only private permissions could not be confirmed.');
    if (folder ? (file.mime_type || file.mimeType) !== 'application/vnd.google-apps.folder'
      : !(file.parent_ids || file.parents || []).includes(input.folderId)) fail('Unexpected private artifact destination.');
    return file;
  };
  const idOf = value => value?.id || value?.file_id || /\/(?:d|folders)\/([\w-]+)/.exec(value?.url || value?.document_url || '')?.[1];
  const quote = value => {
    const text = String(value);
    if (text.includes('\0')) fail('Invalid tracker value.');
    let tag = '$packet$';
    while (text.includes(tag)) tag = tag.replace('$packet', '$packet_');
    return tag + text + tag;
  };
  const rowsOf = result => {
    if (Array.isArray(result)) return result;
    const text = typeof result === 'string' ? result : result?.result;
    const match = /\n<untrusted-data-[^>]+>\n([\s\S]*?)\n<\/untrusted-data-[^>]+>/.exec(text || '');
    if (!match) fail('Tracker response could not be verified.');
    return JSON.parse(match[1]);
  };
  const result = stage => ({ stage, documentId: state.documentId, documentUrl: state.documentId ? `https://docs.google.com/document/d/${state.documentId}` : null,
    revisionId: state.revisionId, pdf: state.reviewedPdf || state.pdf, application: state.application, calls: state.calls || 0, checkpoint: state });
  try {
    if (!input.candidateId || !input.folderId || !input.title || !input.job?.id || !/^https:\/\//.test(input.job.sourceUrl || '')) fail('Candidate, job and private output identities are required.');
    if (!Array.isArray(input.edits) || !input.protectedText?.length || input.protectedText.some(t => typeof t !== 'string' || !t)) fail('Exact edits and a protected career spine are required.');
    const baseline = snapshot(input.baseline);
    const key = JSON.stringify([input.candidateId, baseline.id, baseline.revision, input.folderId, input.title, input.job,
      input.edits, input.protectedText, input.tracker || null]);
    if (state.key && state.key !== key) fail('Checkpoint belongs to different inputs; do not reuse its artifacts.');
    state.key = key;
    if (state.documentId === baseline.id) fail('A checkpoint cannot target the original baseline document.');
    // Validate edits before creating files or touching the tracker.
    const baselinePlan = plan(baseline);
    if (input.tracker && !state.applicationId) {
      const { projectId, userId } = input.tracker;
      if (!/^[\w-]+$/.test(projectId || '') || !/^[\da-f-]{36}$/i.test(userId || '')) fail('A verified tracker project and owner are required.');
      const rows = rowsOf(await call('supabase_execute_sql', { project_id: projectId,
        query: `select id, source_url from app.opportunities where user_id = ${quote(userId)}::uuid and (id = ${quote(input.job.id)} or source_url = ${quote(input.job.sourceUrl)})` }));
      if (rows.length > 1 || (rows[0] && rows[0].source_url !== input.job.sourceUrl)) fail('Resolve conflicting application identities before preparation.');
      state.applicationId = rows[0]?.id || input.job.id;
    }
    if (state.pendingMutation) fail('A mutation response was lost; reconcile the created artifact before retrying.');
    if (!state.privateFolder) { await privateFile(input.folderId, true); state.privateFolder = true; }
    if (!state.documentId) {
      state.pendingMutation = 'copy';
      const copy = await call('google_drive_copy_file', { url: `https://docs.google.com/document/d/${baseline.id}`, new_title: input.title, parent_folder: input.folderId });
      state.documentId = idOf(copy);
      if (!state.documentId || state.documentId === baseline.id) fail('A separate native document copy was not confirmed.');
      delete state.pendingMutation;
    }
    if (!state.composed) {
      await privateFile(state.documentId);
      let doc = snapshot(await call('google_drive_get_document', { document_id: state.documentId }));
      if (doc.text === baselinePlan.expected && state.editAttempted) {
        // A write may have succeeded before its response was lost. Inspect, then adopt it.
        state.composed = true;
      } else {
        if (doc.text !== baseline.text) fail('Copied content differs from the approved baseline; refresh context.');
        const planned = plan(doc);
        if (planned.requests.length) {
          state.editAttempted = true;
          await call('google_drive_batch_update_document', { document_id: doc.id, requests: planned.requests, write_control: { requiredRevisionId: doc.revision } });
          doc = snapshot(await call('google_drive_get_document', { document_id: doc.id }));
        }
        if (doc.text !== planned.expected) fail('The final native revision does not match the planned edits.');
        state.composed = true;
      }
      state.revisionId = doc.revision;
    }
    if (!state.pdf) {
      // Export and upload are adjacent: never expose or manually paste a signed URL.
      const exported = await call('google_drive_export_file', { id: state.documentId, mime_type: 'application/pdf' });
      if (!exported.file_uri) fail('Native export returned no file reference.');
      state.pendingMutation = 'upload';
      const pdf = await call('google_drive_upload_file', { file_uri: exported.file_uri,
        file_name: input.fileName || 'resume.pdf', mime_type: 'application/pdf', parent_folder_id: input.folderId });
      if (pdf.success === false || !idOf(pdf)) fail('PDF upload was not confirmed.');
      state.pdf = { id: idOf(pdf), url: pdf.url, revisionId: state.revisionId };
      delete state.pendingMutation;
    }
    if (!state.privatePdf) { await privateFile(state.pdf.id); state.privatePdf = true; }
    if (!input.review) return result('review_required');
    const review = input.review;
    if (review.documentId !== state.documentId || review.revisionId !== state.revisionId || review.pdfId !== state.pdf.id)
      fail('Review must identify this exact document revision and exported PDF.');
    const checks = ['claims', 'chronology', 'requirements', 'text', 'links', 'pages'];
    if (checks.some(name => typeof review.checks?.[name] !== 'boolean')) fail('Final-file review findings are required.');
    const recordKey = JSON.stringify([review, input.pending || [], input.note || '', input.nextAction || '']);
    const current = snapshot(await call('google_drive_get_document', { document_id: state.documentId }));
    if (current.revision !== state.revisionId || current.text !== baselinePlan.expected) fail('Document changed after export; review is stale.');
    await privateFile(input.folderId, true);
    await privateFile(state.documentId);
    const reviewedFileKey = review.fileUri ? JSON.stringify([review.fileUri, review.fileHash || null]) : null;
    if (review.fileUri && !/^[\da-f]{64}$/i.test(review.fileHash || '')) fail('A transformed PDF needs the SHA-256 of the file actually reviewed.');
    if (!review.fileUri) {
      delete state.reviewedPdf;
      delete state.reviewedFileKey;
    }
    await privateFile((state.reviewedPdf || state.pdf).id);
    if (review.fileUri && state.reviewedFileKey !== reviewedFileKey) {
      state.pendingMutation = 'reviewed-upload';
      const pdf = await call('google_drive_upload_file', { file_uri: review.fileUri,
        file_name: input.fileName || 'resume.pdf', mime_type: 'application/pdf', parent_folder_id: input.folderId });
      if (pdf.success === false || !idOf(pdf)) fail('Reviewed PDF upload was not confirmed.');
      state.reviewedPdf = { id: idOf(pdf), url: pdf.url, revisionId: state.revisionId };
      state.reviewedFileKey = reviewedFileKey;
      delete state.pendingMutation;
      await privateFile(state.reviewedPdf.id);
    }
    if (!input.tracker) return result('reviewed_artifacts_only');
    if (state.application && state.recordKey === recordKey) return result('recorded');
    if (!input.job.company || !input.job.role) fail('Employer and role are required for the application record.');
    const ready = checks.every(name => review.checks[name]) && !(input.pending || []).length;
    const marker = `[packet:${state.documentId}:${state.revisionId}:${(state.reviewedPdf || state.pdf).id}]`;
    const note = [marker, input.note, `PDF: ${(state.reviewedPdf || state.pdf).url}`,
      `Review: ${checks.map(name => `${name}=${review.checks[name] ? 'pass' : 'pending'}`).join(', ')}`,
      input.pending?.length ? `Pending: ${input.pending.join('; ')}` : ''].filter(Boolean).join('\n');
    const desired = ready ? 'Packet Ready' : 'Reviewing';
    const next = input.nextAction || (ready ? 'Review packet and authorize submission.' : 'Resolve the remaining review findings or application answers.');
    const q = quote;
    const query = `insert into app.opportunities as existing (user_id,id,company,role,source_url,packet_url,status,next_action,notes,found_at)
values (${q(input.tracker.userId)}::uuid,${q(state.applicationId)},${q(input.job.company)},${q(input.job.role)},${q(input.job.sourceUrl)},${q(`https://drive.google.com/drive/folders/${input.folderId}`)},${q(desired)},${q(next)},${q(note)},current_date)
on conflict (user_id,id) do update set packet_url=excluded.packet_url,
status=case when existing.applied_at is null and existing.status in ('Found','Reviewing','Packet Ready') then excluded.status else existing.status end,
next_action=case when existing.applied_at is null and existing.status in ('Found','Reviewing','Packet Ready') then excluded.next_action else existing.next_action end,
notes=case when position(${q(note)} in coalesce(existing.notes,''))>0 then existing.notes else concat_ws(E'\\n\\n',nullif(existing.notes,''),excluded.notes) end,updated_at=now()
where existing.user_id=${q(input.tracker.userId)}::uuid and existing.source_url is not distinct from excluded.source_url returning id,status,packet_url,applied_at;`;
    const rows = rowsOf(await call('supabase_execute_sql', { project_id: input.tracker.projectId, query }));
    if (rows.length !== 1 || rows[0].id !== state.applicationId) fail('Application write was not confirmed; inspect the owner-scoped record.');
    state.application = rows[0];
    state.recordKey = recordKey;
    return result('recorded');
  } catch (error) {
    return { ...result('needs_attention'), reason: error.message };
  }
}
