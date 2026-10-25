# StudentLink repository audit — 25 October 2026

## Scope and method

This is a source-level audit of the current `main` tree and its static validation setup. It covers the HTML shell, CSS/JavaScript asset organization, PWA shell, repository documentation, test workflow, school directory, and Supabase schema/migration layout. Static source inspection is not equivalent to a live browser, two-account, or production-database test.

The refactor is being made on `refactor/repo-wide-audit-2026-10-25`; production `main` is not edited directly.

## Findings

### 1. The site is already multi-file, but it is not yet organized as a modern module-based application

- `index.html` is the single application shell and loads `assets/bootstrap.js`.
- `assets/bootstrap.js` loads classic JavaScript files in a controlled order. The modules share global state/functions, so converting them to ES modules or changing load order without mapping dependencies would risk breaking features.
- The app uses Supabase for dynamic data and realtime functionality. A single HTML entry point does not make the application static; the data and interactions are dynamic.
- There is no root `package.json`/build pipeline in the inspected tree. The current approach is a no-bundler static deployment with Node-based regression checks.

**Recommendation:** migrate gradually toward explicit module boundaries and testable services. Do not add a heavy framework solely for appearance; choose tooling only if it improves dependency management, testing, and delivery.

### 2. CSS ownership and cascade complexity need work

- `assets/css/base.css` is about 98 KB and 1,442 lines.
- Feature stylesheets also exist: feed (~9.7 KB), messages (~19.3 KB), games (~4.7 KB), profile (~5.4 KB), and notifications (~1.5 KB), plus startup styles.
- Several selectors occur repeatedly in `base.css`, and selectors such as profile, trending-school, and Tic-Tac-Toe styles also appear in feature stylesheets. Some repeats are intentional cascade overrides; source text alone cannot prove that a repeated rule is safe to delete.
- All stylesheets are linked in the shell. This is a valid way to allow parallel downloads, but it means feature CSS is downloaded even when a feature is not currently visible.

**Recommendation:** inventory rules by component, consolidate duplicate declarations only after computed-style/regression checks, move feature-owned rules out of `base.css` in small batches, and measure startup before/after. Avoid a blind CSS deduplication pass.

### 3. JavaScript modules are substantial and depend on shared globals

- `assets/js/core.js` is about 55 KB.
- `assets/js/games.js` is about 59 KB.
- Feed, messaging, notifications, status, profile, and startup logic are split into separate files, but some responsibilities and shared-state dependencies remain tightly coupled.
- Script load order and globally declared functions are part of the current runtime contract.

**Recommendation:** establish a documented dependency map, separate pure helpers from DOM/rendering and Supabase access, use feature-scoped event binding and consistent error handling, and only then move code into modules. Keep multiplayer, media, messaging, notification, and profile behavior covered by regression tests.

### 4. Startup HTML has a malformed duplicate attribute

The startup skeleton label had two `class` attributes on the same element. Browsers generally ignore or inconsistently handle duplicate attributes. This was corrected to a single combined class attribute, and a regression assertion was added to `scripts/check-project.mjs`.

### 5. PWA cache and asset references are tightly coupled

The service worker maintains an explicit app-shell list and versioned asset URLs. Any rename, deletion, stylesheet migration, or JavaScript split must update the HTML, bootstrap loader, service-worker precache list, and regression checks together. Stale cache keys can make a correct source change appear broken on installed phones.

**Recommendation:** centralize versioning or add automated consistency checks. Never delete an asset until all references in HTML, CSS, JavaScript, manifest, service worker, redirects, and documentation have been checked.

### 6. Database SQL files have different roles and must not be deleted based on filenames alone

The repository contains a base schema, incremental migrations, and root-level multiplayer SQL setup files. Some setup scripts may overlap, but their contents and deployment history need comparison before any is removed. Migrations must remain additive and safe for the existing production database; do not blindly rerun the base schema.

### 7. Redirect pages are compatibility routes, not automatically duplicate pages

Files under `pages/` redirect old feed, games, messages, notifications, and profile URLs to the main shell with a view parameter. They are small, but may preserve links already shared with users. Keep them unless link usage and hosting behavior confirm that they can be safely retired.

### 8. Verification limitations

The static regression suite is useful but cannot prove:
- sign-up, Google sign-in, password recovery, and session restoration against live Supabase;
- correct RLS/storage behavior for real accounts;
- status expiry/privacy and view-once atomicity;
- message attachment access and unread receipt consistency across devices;
- realtime multiplayer correctness with two separate users;
- actual mobile PWA installation, background notifications, or slow-network performance.

These require a dedicated test Supabase project and real browser/device testing. Production user data must not be used for destructive tests.

## Changes in this refactor branch so far

- Fixed the duplicate `class` attribute in the startup skeleton.
- Removed one provably identical duplicate `.feed-controls` rule from `assets/css/feed.css`; the remaining rule preserves the same styling.
- Added regression assertions for duplicate class attributes, duplicate IDs in the HTML shell, missing local asset references, and the duplicate feed-controls rule.
- Added a regression assertion against duplicate named function declarations across the application JavaScript modules.
- Fixed a service-worker fallback bug: notification queue cleanup was scoped inside `try` but called from `catch`, which could throw a `ReferenceError` when IndexedDB was unavailable. The cleanup now lives in a shared helper, and a regression assertion covers the fallback path.
- Kept the work on a separate branch so `main` remains untouched while broader changes are reviewed.

## Recommended implementation order

1. Build a complete reference map for every HTML/CSS/JS/manifest/service-worker asset and every SQL setup/migration file.
2. Add static checks for duplicate HTML IDs, missing local asset references, script syntax, stale cache versions, and migration safety conventions.
3. Consolidate CSS component ownership in small reviewable batches; compare screenshots and mobile breakpoints.
4. Refactor shared JavaScript helpers and Supabase access behind explicit boundaries without changing feature behavior.
5. Add focused automated tests for pure logic and run the full static suite.
6. Test authentication, feed/polls, chat/media/status, notifications, and all game modes in a test backend with two accounts.
7. Review Netlify's actual Git/deploy connection and verify the published commit before release.

## Release status

**Not release-ready on the strength of static inspection alone.** This branch is an incremental start, not a claim that every line, every database policy, and every real-device behavior has already been proven correct.
