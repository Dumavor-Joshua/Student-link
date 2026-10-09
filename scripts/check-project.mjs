import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const js = read('assets/app.js');
const css = read('assets/app.css');
const migration = read('supabase/migrations/20261009_harden_poll_vote_policy.sql');

assert.match(html, /href=["']assets\/app\.css["']/i, 'HTML must load the extracted stylesheet');
assert.match(html, /src=["']assets\/app\.js["']/i, 'HTML must load the extracted application script');
assert.match(js, /body:pollBody/, 'Poll posts must provide the required posts.body field');
assert.match(js, /data-vote/, 'Poll options must expose voting controls');
assert.match(js, /option_index:optionIndex/, 'Poll voting must store the selected option index');
assert.match(js, /from\(['"]friendships['"]\)/, 'Friend requests must use the schema friendships table');
assert.doesNotMatch(js, /friend_requests|convo_id/, 'Legacy table/column names must not remain');
assert.match(js, /conversation_id/, 'Messages must use the schema conversation_id column');
assert.match(js, /\$\$\(['"]\[data-cell\]['"]\)\.forEach/, 'Tic-Tac-Toe must bind all board cells');
assert.match(css, /\.header \.search\{display:block/, 'Search must remain available on small screens');
assert.match(migration, /option_index < jsonb_array_length\(p\.poll_options\)/, 'Poll vote policy must validate the selected option');
assert.match(js, /SUPABASE_ANON_KEY/, 'Frontend must use a publishable/anon key configuration');
assert.doesNotMatch(js, /SUPABASE_SERVICE_ROLE_KEY\s*=/i, 'A service-role key must never be configured in browser code');

console.log('StudentLink static checks passed.');
