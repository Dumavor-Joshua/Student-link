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
assert.ok(!js.includes('My school isn’t listed'), 'School selector must not show the unlisted-school checkbox');
assert.ok(js.includes('function canonicalVerifiedSchoolName') && js.includes('String(name).trim().replace'), 'School selector must still accept manually typed school names');


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


assert.ok(js.includes("uniqueSchoolNames"), 'School suggestions must be deduplicated and alphabetically sorted');
assert.ok(js.includes("aria-current"), 'Sidebar active state must be synchronized with the current route');
assert.ok(js.includes("S.view==='game'&&v==='games'"), 'Games navigation must remain active inside a game');
assert.ok(!js.includes("My school isn’t listed"), 'The unlisted-school checkbox must be removed');
assert.ok(js.includes("Start typing your school name"), 'School field must remain searchable and allow manual school names');
assert.ok(css.includes('.leftside .navitem[aria-current="page"]'), 'Selected sidebar route must have a definitive active style');
assert.ok(css.includes('.auth-panel .hero'), 'Authentication forms must use the refined card layout');


const shellStart = js.indexOf('function shell(){');
const shellEnd = js.indexOf('async function boot()', shellStart);
const shellMarkup = js.slice(shellStart, shellEnd);
const profileStart = js.indexOf('function viewProfile()');
const profileEnd = js.indexOf('function profileAvatarMarkup', profileStart);
const profileMarkup = js.slice(profileStart, profileEnd);
assert.ok(shellStart >= 0 && shellEnd > shellStart, 'App shell must remain present');
assert.doesNotMatch(shellMarkup, /profile-danger-zone|id="delete-profile"/, 'Profile deactivation controls must not appear under the main menu');
assert.match(profileMarkup, /profile-danger-zone[\s\S]*id="delete-profile"/, 'Profile deactivation controls must exist on the Profile page');
assert.ok(css.includes('@media(max-width:760px){') && css.includes('.leftside{order:3'), 'Mobile layout must use a touch-friendly bottom navigation');
assert.ok(css.includes('@media(max-width:420px){') && css.includes('overflow-x:hidden'), 'Very narrow phone layouts must guard against horizontal overflow');



const navigationStateStart = js.indexOf('function syncNavigationState()');
const navigationStateEnd = js.indexOf('function setView(', navigationStateStart);
const navigationStateCode = js.slice(navigationStateStart, navigationStateEnd);
assert.ok(navigationStateStart >= 0 && navigationStateEnd > navigationStateStart, 'Navigation state synchronization must remain present');
assert.ok(navigationStateCode.includes("document.querySelectorAll('[data-view]').forEach"), 'Navigation state must iterate over every navigation button, not a single querySelector result');
assert.ok(!/\$\('\[data-view\]'\)\.forEach/.test(navigationStateCode), 'Navigation state must not call forEach on a single DOM element');
assert.ok(navigationStateCode.includes("S.view==='game'&&link.dataset.view==='games'"), 'Games button must remain selected while a multiplayer game is open');
const renderViewStart = js.indexOf('async function renderView()');
const renderViewEnd = js.indexOf('async function viewFeed()', renderViewStart);
const renderViewCode = js.slice(renderViewStart, renderViewEnd);
for (const route of ['feed','friends','messages','games','profile','suggestions']) {
  assert.ok(renderViewCode.includes("S.view==='"+route+"'"), 'Navigation destination must render: '+route);
}

console.log('StudentLink static checks passed.');

assert.ok(html.includes('rel="icon" type="image/svg+xml" href="assets/favicon.svg?v='), 'Website must declare a versioned SVG favicon');
assert.ok(js.includes("provider: 'google'") && js.includes('signInWithOAuth'), 'Continue with Google must use Supabase Google OAuth');
assert.ok(js.includes("redirectTo: window.location.origin + window.location.pathname"), 'Google OAuth must return to the current StudentLink page path');
assert.ok(js.includes("studentlink-google-signup-profile") && js.includes("profile details could not be saved"), 'Google signup must carry nickname and school into a new profile when possible');
assert.ok(!js.includes('Search the alphabetical Ghana SHS/SHTS directory'), 'Signup must not show the extra school helper prompt below the school field');
assert.ok(!js.includes('Google sign-in is not connected yet') && !js.includes('Not connected</span>'), 'Google sign-in must not be shown as disconnected');

assert.ok(js.includes("$('[data-tab]').forEach"), 'Auth tab binding must iterate over all tab buttons using querySelectorAll');
assert.ok(!js.includes("  $('[data-tab]').forEach"), 'Auth rendering must not call forEach on a single querySelector result');
assert.ok(js.includes("authForm.addEventListener('submit'"), 'Login and signup must use an explicitly registered form submit handler');
assert.ok(js.includes("db.auth.signInWithPassword({ email, password })"), 'Login submission must call Supabase password sign-in');
assert.ok(js.includes("authForm.dataset.submitting = 'true'") && js.includes("delete authForm.dataset.submitting"), 'Auth submission must prevent duplicate requests and always clear the loading guard');
