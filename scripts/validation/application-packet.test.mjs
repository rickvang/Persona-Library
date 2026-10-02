import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runApplicationPacket } from '../application-packet.mjs';

const source = 'Candidate Name\nDesigner\nFirst bullet\nSecond bullet\nEmployer 2020–2024\n';
const document = (text = source, id = 'baseline', revision = 'r1') => {
  let index = 1;
  return { documentId: id, revisionId: revision, tabs: [{ tabId: 't.0', body: { content: text.match(/[^\n]*\n|[^\n]+$/g).map(text => {
    const startIndex = index; index += text.length;
    return { startIndex, endIndex: index, paragraph: { elements: [{ startIndex, endIndex: index, textRun: { content: text, textStyle: { bold: false } } }] } };
  }) } }] };
};
const fixture = (overrides = {}) => {
  const calls = [], writes = [], files = {};
  let text = source, revision = 'r1', exportFailure = false;
  const input = { candidateId: 'candidate-one', baseline: document(), folderId: 'private-folder', title: 'Role resume', fileName: 'resume.pdf',
    job: { id: 'job-one', company: 'Example', role: 'Designer', sourceUrl: 'https://example.test/jobs/one' },
    protectedText: ['Candidate Name', 'Employer 2020–2024'], edits: [{ before: 'First bullet', after: 'Tailored bullet' }],
    tracker: { projectId: 'test-project', userId: '12345678-1234-1234-1234-123456789abc' }, ...overrides };
  const service = {
    google_drive_get_file_metadata: async ({ fileId }) => ({ id: fileId, mime_type: fileId === 'private-folder' ? 'application/vnd.google-apps.folder' : 'application/pdf', parent_ids: ['private-folder'], permissions: [{ type: 'user', role: 'owner' }] }),
    google_drive_copy_file: async () => { files.copy = true; return { url: 'https://docs.google.com/document/d/copy/edit' }; },
    google_drive_get_document: async () => document(text, 'copy', revision),
    google_drive_batch_update_document: async args => {
      assert.equal(args.write_control.requiredRevisionId, revision);
      writes.push(args);
      for (const request of args.requests) {
        if (request.deleteContentRange) { const r = request.deleteContentRange.range; text = text.slice(0, r.startIndex - 1) + text.slice(r.endIndex - 1); }
        if (request.insertText) { const r = request.insertText; text = text.slice(0, r.location.index - 1) + r.text + text.slice(r.location.index - 1); }
      }
      revision = 'r2'; return {};
    },
    google_drive_export_file: async () => {
      if (exportFailure) { exportFailure = false; throw new Error('Temporary export failure'); }
      return { file_uri: { download_url: 'https://private.test/opaque-export', mime_type: 'application/pdf' } };
    },
    google_drive_upload_file: async args => {
      files.upload = args; return { success: true, id: 'pdf', url: 'https://drive.google.com/file/d/pdf/view' };
    },
    supabase_execute_sql: async ({ query }) => {
      const rows = query.startsWith('select') ? [{ id: 'job-one', source_url: input.job.sourceUrl }]
        : [{ id: 'job-one', status: input.pending?.length ? 'Reviewing' : 'Packet Ready', packet_url: 'https://drive.google.com/drive/folders/private-folder', applied_at: null }];
      return { content: [{ type: 'text', text: JSON.stringify({ result: `Result:\n<untrusted-data-fixture>\n${JSON.stringify(rows)}\n</untrusted-data-fixture>` }) }] };
    }
  };
  const tools = Object.fromEntries(Object.entries(service).map(([name, fn]) => [name, async args => { calls.push({ name, args }); return fn(args); }]));
  const review = result => ({ documentId: result.documentId, revisionId: result.revisionId, pdfId: result.pdf.id,
    checks: Object.fromEntries(['claims','chronology','requirements','text','links','pages'].map(name => [name, true])) });
  return { input, tools, calls, writes, files, review, text: () => text, change: value => { text = value; revision = 'r3'; }, failExport: () => { exportFailure = true; } };
};

test('one guarded edit batch; native export reference uploads immediately; master stays unchanged', async () => {
  const f = fixture(); const initial = JSON.stringify(f.input.baseline);
  const r = await runApplicationPacket(f.input, f.tools);
  assert.equal(r.stage, 'review_required'); assert.equal(f.writes.length, 1);
  assert.equal(f.text(), source.replace('First bullet', 'Tailored bullet'));
  assert.equal(JSON.stringify(f.input.baseline), initial);
  assert.equal(f.calls.findIndex(x => x.name === 'google_drive_upload_file'), f.calls.findIndex(x => x.name === 'google_drive_export_file') + 1);
  assert.equal(typeof f.files.upload.file_uri, 'object');
  assert.equal(f.calls.filter(x => x.name === 'supabase_execute_sql').length, 1); // Read only.
});
test('swapping text uses original indexed ranges and does not cascade', async () => {
  const f = fixture({ edits: [{ before: 'First bullet', after: 'Second bullet' }, { before: 'Second bullet', after: 'First bullet' }] });
  const r = await runApplicationPacket(f.input, f.tools);
  assert.equal(r.stage, 'review_required'); assert.match(f.text(), /Second bullet\nFirst bullet/);
  assert.equal(f.writes.length, 1);
});
test('ambiguous, overlapping and protected edits fail before side effects', async () => {
  for (const edits of [[{before:'bullet',after:'x'}], [{before:'First bullet',after:'x'},{before:'First',after:'y'}], [{before:'Employer 2020–2024',after:'Employer 2021–2024'}]]) {
    const f = fixture({ edits }); const r = await runApplicationPacket(f.input, f.tools);
    assert.equal(r.stage, 'needs_attention'); assert.equal(f.calls.length, 0);
  }
});
test('mixed bold/body replacement requires explicit formatting, then scopes bold to its label', async () => {
  const f = fixture({ edits: [{ before: 'First bullet', after: 'Skills: Prototyping' }] });
  const p = f.input.baseline.tabs[0].body.content[2].paragraph;
  const start = p.elements[0].startIndex;
  p.elements = [{ startIndex:start, endIndex:start+5, textRun:{content:'First',textStyle:{bold:true}} },
    {startIndex:start+5,endIndex:start+13,textRun:{content:' bullet\n',textStyle:{bold:false}}}];
  let r = await runApplicationPacket(f.input, f.tools);
  assert.equal(r.stage, 'needs_attention'); assert.match(r.reason, /Mixed-style/); assert.equal(f.calls.length,0);
  f.input.edits[0].style = { bold:false, italic:false };
  f.input.edits[0].spans = [{start:0,end:7,style:{bold:true}}];
  r = await runApplicationPacket(f.input, f.tools);
  assert.equal(r.stage,'review_required');
  const styles=f.writes[0].requests.filter(r=>r.updateTextStyle).map(r=>r.updateTextStyle);
  assert.equal(styles[0].textStyle.bold,false); assert.equal(styles[1].range.endIndex-styles[1].range.startIndex,7);
});
test('UTF-16 indexes preserve edits after emoji and native raw tab shape works', async () => {
  const f=fixture({edits:[{before:'First bullet',after:'Useful bullet'}]});
  f.input.baseline=document(source.replace('Designer','Designer 🧭'));
  f.change(source.replace('Designer','Designer 🧭'));
  const tab=f.input.baseline.tabs[0];f.input.baseline.tabs=[{tabProperties:{tabId:'t.0'},documentTab:{body:tab.body}}];
  const r=await runApplicationPacket(f.input,f.tools);
  assert.equal(r.stage,'review_required');assert.match(f.text(),/Designer 🧭\nUseful bullet/);
});
test('changed source, public destination and conflicting application identity stop preparation', async () => {
  for(const failure of ['source','privacy','identity']) {
    const f=fixture();
    if(failure==='source')f.change(source.replace('Designer','Changed without approval'));
    if(failure==='privacy')f.tools.google_drive_get_file_metadata=async()=>({mime_type:'application/vnd.google-apps.folder',permissions:[{type:'anyone',role:'reader'}]});
    if(failure==='identity')f.tools.supabase_execute_sql=async()=>[{id:'wrong-job',source_url:'https://other.test'}];
    const r=await runApplicationPacket(f.input,f.tools);
    assert.equal(r.stage,'needs_attention');assert.equal(f.writes.length,0);assert.equal(f.files.upload,undefined);
  }
});
test('export failure resumes without another copy, edit or context lookup', async () => {
  const f=fixture();f.failExport();let r=await runApplicationPacket(f.input,f.tools);
  assert.equal(r.stage,'needs_attention');assert.equal(r.checkpoint.composed,true);
  r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(r.stage,'review_required');assert.equal(f.calls.filter(x=>x.name==='google_drive_copy_file').length,1);
  assert.equal(f.writes.length,1);assert.equal(f.calls.filter(x=>x.name==='supabase_execute_sql').length,1);
});
test('lost edit response is reconciled against actual content without applying the edits twice',async()=>{
  const f=fixture();const update=f.tools.google_drive_batch_update_document;
  f.tools.google_drive_batch_update_document=async args=>{await update(args);throw new Error('Response lost');};
  let r=await runApplicationPacket(f.input,f.tools);assert.equal(r.stage,'needs_attention');
  r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(r.stage,'review_required');assert.equal(f.writes.length,1);
});
test('unknown upload outcome blocks duplicate uploads until reconciliation',async()=>{
  const f=fixture();f.tools.google_drive_upload_file=async()=>{throw new Error('Response lost');};
  let r=await runApplicationPacket(f.input,f.tools);assert.equal(r.checkpoint.pendingMutation,'upload');
  const count=f.calls.length;r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(r.stage,'needs_attention');assert.match(r.reason,/reconcile/);assert.equal(f.calls.length,count);
});
test('record requires exact final-file review, preserves notes and scopes writes to the owner',async()=>{
  const f=fixture({pending:['Eligibility answer'],note:'Role-fit note'});let r=await runApplicationPacket(f.input,f.tools);
  f.input.review=f.review(r);r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(r.stage,'recorded');assert.equal(r.application.status,'Reviewing');
  const sql=f.calls.filter(x=>x.name==='supabase_execute_sql').at(-1).args.query;
  assert.match(sql,/on conflict \(user_id,id\)/);assert.match(sql,/where existing\.user_id=/);
  assert.match(sql,/coalesce\(existing.notes/);assert.match(sql,/existing.applied_at is null/);
  assert.doesNotMatch(sql,/applied_at\s*=|status\s*=\s*'Applied'/);
});
test('stale revision or mismatched PDF cannot be recorded',async()=>{
  for(const failure of ['revision','pdf']) {
    const f=fixture();let r=await runApplicationPacket(f.input,f.tools);f.input.review=f.review(r);
    if(failure==='revision')f.change(f.text());
    if(failure==='pdf')f.input.review.pdfId='other-pdf';
    r=await runApplicationPacket(f.input,f.tools,r.checkpoint);assert.equal(r.stage,'needs_attention');
  }
});
test('resolved answers reuse the packet and record a new milestone without recreating files',async()=>{
  const f=fixture({pending:['Eligibility answer']});let r=await runApplicationPacket(f.input,f.tools);
  f.input.review=f.review(r);r=await runApplicationPacket(f.input,f.tools,r.checkpoint);assert.equal(r.application.status,'Reviewing');
  f.input.pending=[];r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(r.stage,'recorded');assert.equal(r.application.status,'Packet Ready');
  assert.equal(f.calls.filter(c=>c.name==='google_drive_copy_file').length,1);
  assert.equal(f.calls.filter(c=>c.name==='google_drive_upload_file').length,1);
});
test('identical recording is idempotent and transformed PDFs require a reviewed hash',async()=>{
  const f=fixture();let r=await runApplicationPacket(f.input,f.tools);f.input.review=f.review(r);
  r=await runApplicationPacket(f.input,f.tools,r.checkpoint);const writes=f.calls.filter(c=>c.name==='supabase_execute_sql'&&c.args.query.startsWith('insert')).length;
  r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(f.calls.filter(c=>c.name==='supabase_execute_sql'&&c.args.query.startsWith('insert')).length,writes);
  f.input.review.fileUri='C:/private/reviewed.pdf';r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(r.stage,'needs_attention');assert.match(r.reason,/SHA-256/);
});
test('different candidate/job inputs cannot reuse a checkpoint',async()=>{
  const f=fixture();const r=await runApplicationPacket(f.input,f.tools);f.input.candidateId='candidate-two';
  const count=f.calls.length;const again=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(again.stage,'needs_attention');assert.equal(f.calls.length,count);
});
test('review selects the current transformed PDF or explicitly returns to the native export',async()=>{
  const f=fixture();let r=await runApplicationPacket(f.input,f.tools);
  f.input.review={...f.review(r),fileUri:'C:/private/reviewed.pdf',fileHash:'a'.repeat(64)};
  f.tools.google_drive_upload_file=async()=>({success:true,id:'reviewed-pdf',url:'https://drive.google.com/file/d/reviewed-pdf/view'});
  r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(r.stage,'recorded');assert.equal(r.pdf.id,'reviewed-pdf');
  delete f.input.review.fileUri;delete f.input.review.fileHash;
  r=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(r.stage,'recorded');assert.equal(r.pdf.id,'pdf');
  const sql=f.calls.filter(c=>c.name==='supabase_execute_sql').at(-1).args.query;
  assert.doesNotMatch(sql,/reviewed-pdf/);
});
test('restored checkpoints cannot target the original master',async()=>{
  const f=fixture();const r=await runApplicationPacket(f.input,f.tools);r.checkpoint.documentId=f.input.baseline.documentId;
  const count=f.calls.length;const again=await runApplicationPacket(f.input,f.tools,r.checkpoint);
  assert.equal(again.stage,'needs_attention');assert.match(again.reason,/original baseline/);assert.equal(f.calls.length,count);
});
test('the native runtime loader works without Node imports or unprefixed tool aliases',async()=>{
  const source=readFileSync(new URL('../application-packet.mjs',import.meta.url),'utf8');
  const run=Function(source.replace(/^export /m,'')+';return runApplicationPacket;')();
  const f=fixture();const prefixed=Object.fromEntries(Object.entries(f.tools).map(([key,value])=>['mcp__codex_apps__'+key,value]));
  const r=await run(f.input,prefixed);assert.equal(r.stage,'review_required');
});
