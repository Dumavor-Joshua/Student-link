import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const js = read('assets/app.js');
const css = read('assets/app.css');
const migration = read('supabase/migrations/20261009_harden_poll_vote_policy.sql');
const profileMigration = read('supabase/migrations/20261009_profile_photos_deactivation_and_feed.sql');
const profileGuardMigration = read('supabase/migrations/20261009_active_profile_write_guards.sql');

assert.ok(html.includes('href="assets/app.css?v='), 'HTML must load the extracted stylesheet, including its cache version');
assert.ok(html.includes('src="assets/app.js?v='), 'HTML must load the extracted application script, including its cache version');
assert.ok(js.includes('body:body||q'), 'Poll posts must provide a non-empty posts.body field');
assert.ok(js.includes('data-vote'), 'Poll options must expose voting controls');
assert.ok(js.includes("if(data.length)") || js.includes("if(data?.length)"), 'An empty feed must not issue queries using an empty post-ID list');
assert.ok(js.includes('option_index:optionIndex'), 'Poll voting must store the selected option index');
assert.ok(js.includes("from('friendships')"), 'Friend requests must use the schema friendships table');
assert.doesNotMatch(js, /friend_requests|convo_id/, 'Legacy table/column names must not remain');
assert.ok(js.includes('conversation_id'), 'Messages must use the schema conversation_id column');
assert.ok(js.includes("$$('[data-cell]').forEach"), 'Tic-Tac-Toe must bind board cells');
assert.ok(css.includes('.header .search{display:block'), 'Search must remain available on small screens');
assert.ok(migration.includes('option_index < jsonb_array_length(p.poll_options)'), 'Poll vote policy must validate the selected option');
assert.ok(js.includes('SUPABASE_ANON_KEY'), 'Frontend must use a publishable/anon key configuration');
assert.doesNotMatch(js, /SUPABASE_SERVICE_ROLE_KEY\s*=/i, 'A service-role key must never be configured in browser code');
assert.ok(js.includes('db.auth.signInWithPassword({ email, password })'), 'Login must call Supabase password authentication');
assert.ok(js.includes('const validEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);'), 'Email validation must use a correctly escaped regular expression');
assert.ok(js.includes('Trending schools are temporarily unavailable.'), 'Trending-schools errors must not replace the current page');
assert.ok(js.includes('My school isn’t listed'), 'School selector must allow a clearly marked manual fallback');


assert.ok(js.includes("from('student_feedback').select"), 'Feedback history must load from Supabase');
assert.ok(js.includes("from('student_feedback').insert"), 'Feedback submissions must be stored in Supabase');
assert.ok(js.includes("table:'friendships'"), 'Friendship changes must refresh through Realtime');
assert.ok(js.includes("table:'post_likes'"), 'Like changes must refresh through Realtime');
assert.ok(js.includes(".ilike('school',chosen)"), 'School pages must filter profiles in the database');
assert.ok(!js.includes("studentlink-suggestion-reports"), 'Feedback must not rely on browser-only storage');


assert.ok(js.includes("get_studentlink_feed"), 'Feed must use the server-side randomized, school-aware query');
assert.ok(js.includes("id=\"feed-filter\""), 'Feed must offer all-schools and own-school filters');
assert.ok(js.includes("data-delete-post"), 'Posts must expose creator-only delete controls');
assert.ok(js.includes(".eq('user_id',S.session.user.id).select('id')"), 'Post deletion must be constrained to the signed-in creator');
assert.ok(js.includes("from('profile-photos').upload"), 'Profile photos must upload to Supabase Storage');
assert.ok(js.includes("deleted_at:null"), 'Deleted profiles must have a restore path');
assert.ok(css.includes('.profile-danger-zone'), 'Profile deletion controls must be styled');
assert.ok(profileMigration.includes("CREATE POLICY \"posts read while author active\""), 'Database must hide posts from deactivated profiles');
assert.ok(profileMigration.includes("CREATE POLICY \"Students upload their own profile photos\""), 'Storage uploads must be restricted to each user folder');
assert.ok(profileGuardMigration.includes('comments readable on active posts'), 'Related activity on deactivated posts must be hidden');

console.log('StudentLink static checks passed.');
