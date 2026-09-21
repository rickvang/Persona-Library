import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const source = readFileSync(path.join(root, 'client/seen-job-store.js'), 'utf8');
const sandbox = { URL, Date, Set, String, Object, Error };
vm.runInNewContext(source, sandbox, { filename: path.join(root, 'client/seen-job-store.js') });
const tools = sandbox.PersonaLibrarySeenJobStore;

test('seen-job identity prefers provider ID over URL', () => {
  const identity = tools.deriveIdentity({
    provider: 'Greenhouse',
    providerJobId: '12345',
    sourceUrl: 'https://jobs.example.com/role/12345?utm_source=indeed'
  });
  assert.equal(identity.stableKey, 'provider:greenhouse:12345');
});

test('seen-job URL identity strips tracking-only parameters', () => {
  const left = tools.deriveIdentity({
    sourceUrl: 'https://jobs.example.com/role/7/?utm_source=old&lever-source=Indeed&foo=bar#apply'
  });
  const right = tools.deriveIdentity({
    sourceUrl: 'https://JOBS.example.com/role/7?foo=bar&utm_medium=new'
  });
  assert.equal(left.stableKey, right.stableKey);
  assert.equal(left.normalizedSourceUrl, 'https://jobs.example.com/role/7?foo=bar');
});

test('fallback fingerprint remains conservative across locations', () => {
  const remote = tools.deriveIdentity({ company: 'Example', title: 'Designer', location: 'Remote' });
  const chicago = tools.deriveIdentity({ company: 'Example', title: 'Designer', location: 'Chicago, IL' });
  assert.notEqual(remote.stableKey, chicago.stableKey);
  assert.throws(
    () => tools.deriveIdentity({ company: 'Example', title: 'Designer' }),
    /requires company, title, and location/
  );
});

test('authenticated store filters before recording and suppresses after recording', async () => {
  const state = new Map();
  const user = { id: 'user-1' };
  const client = {
    auth: {
      async getUser() {
        return { data: { user }, error: null };
      }
    },
    schema(schema) {
      assert.equal(schema, 'app');
      return {
        from(table) {
          assert.equal(table, 'seen_jobs');
          return {
            select() {
              return {
                eq(column, value) {
                  assert.equal(column, 'user_id');
                  assert.equal(value, user.id);
                  return {
                    async in(keyColumn, keys) {
                      assert.equal(keyColumn, 'stable_key');
                      return {
                        data: keys.filter(key => state.has(key)).map(key => ({ stable_key: key })),
                        error: null
                      };
                    }
                  };
                }
              };
            },
            upsert(rows, options) {
              assert.equal(options.onConflict, 'user_id,stable_key');
              assert.equal(options.ignoreDuplicates, true);
              const inserted = [];
              for (const row of rows) {
                if (!state.has(row.stable_key)) {
                  state.set(row.stable_key, row);
                  inserted.push(row);
                }
              }
              return {
                async select() {
                  return {
                    data: inserted.map(row => ({ stable_key: row.stable_key, first_shown_at: row.first_shown_at })),
                    error: null
                  };
                }
              };
            }
          };
        }
      };
    }
  };

  const store = tools.createSupabaseSeenJobStore({
    client,
    getNow: () => '2026-09-21T20:00:00.000Z'
  });
  const job = {
    provider: 'Greenhouse',
    providerJobId: 'abc-123',
    sourceUrl: 'https://jobs.example.com/abc-123?utm_source=indeed',
    company: 'Example',
    title: 'Senior Product Designer',
    location: 'Remote'
  };

  const first = await store.filterUnseen([job]);
  assert.equal(first.newJobs.length, 1);
  assert.equal(first.seenJobs.length, 0);
  assert.equal(state.size, 0, 'reading must not mark the job seen');

  await store.recordPresented(first.newJobs);
  assert.equal(state.size, 1);

  const second = await store.filterUnseen([job]);
  assert.equal(second.newJobs.length, 0);
  assert.equal(second.seenJobs.length, 1);
});

test('seen-job persistence does not silently fall back to local state', () => {
  assert.throws(() => tools.createSeenJobStore({ config: { mode: 'local' } }), /requires the authenticated Supabase private store/);
});
