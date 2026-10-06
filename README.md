**User submission / admin review guide:** [WORKFLOW-MM.md](WORKFLOW-MM.md)

**Deployment trouble? Read [DEPLOY-RECOVERY-MM.md](DEPLOY-RECOVERY-MM.md).**

# Myanmar Kitchen · 2.4.0

**မြန်မာလို လမ်းညွှန်:** [စတင်အသုံးပြုရန်.md](စတင်အသုံးပြုရန်.md)

A responsive Myanmar cooking community upgraded from the supplied project. This release fixes the recipe-card arrow controls, restores the original project's Firebase web configuration, adds visible Burmese authentication errors, wires the owner's four Stripe links, and restricts administration to exactly two verified Google accounts.

## Run

Use Node.js 22 LTS. From this folder:

```sh
npm ci
npm run dev
```

Open the **localhost** address printed by Vite. The original Firebase project's public auth configuration allows `localhost`, `my-kitch.firebaseapp.com` and `my-kitch.web.app`; `127.0.0.1` was not authorized when checked. Add other domains in Firebase Console → Authentication → Settings → Authorized domains.

```sh
npm test
npm run build
npm run preview
```

`dist/` is a built copy. Serve over HTTP rather than opening the HTML as a file.

## Configuration and Google authentication

`public/app-config.json` contains the original `my-kitch` Firebase **public web configuration**, plus the supplied support links. This is intentionally browser-readable. It contains no Admin SDK credentials, service account, password or OAuth client secret. Keep private credentials out of this file, source control, `public/` and all `VITE_*` variables.

The file is fetched at startup; the deployment copy is `dist/app-config.json`. Edit the source configuration, build and redeploy. Optional `.env.local` values from `.env.example` take precedence. Do not accidentally copy stale Firebase or emulator environment values from an older project.

In Firebase Console enable **Authentication → Sign-in method → Google**, set the support email, and ensure your domain is authorized. The login dialog explains provider-disabled, domain, network and blocked-popup errors in Burmese. A missing Firestore profile does not invalidate an otherwise successful Google sign-in.

No live deployment or real Google account login was performed. The project public auth configuration was read-only checked and returned HTTP 200; Google sign-in was functionally tested with the local Google-provider emulator.

## Deploy the backend and import recipes

Create/enable Firestore for `my-kitch` if necessary. Install Firebase CLI and sign in to an account that owns the project. Cloud Functions deployment needs billing/Blaze configured.

```sh
npm install -g firebase-tools
firebase login
npm ci --prefix functions
npm run build
firebase deploy --project my-kitch --only firestore:rules,storage,functions,hosting
```

Import the original catalog and atomic name registry before accepting contributions. Authenticate your trusted machine with Application Default Credentials (for example `gcloud auth application-default login`), with permission for this project:

```sh
cd functions
GOOGLE_CLOUD_PROJECT=my-kitch node manage.js seed
```

Seed import is transactional, creates missing recipes and preserves existing recipes. If you already have a different Firestore schema, migrate it and populate `recipeNames` before enabling contributions; no Firestore export was included in the source ZIP.

If the database is empty or unavailable, the app shows the original starter collection with an explicit warning. This fallback keeps browsing available; favorites and submissions still require a functioning backend.

## Exactly two admins

- `minmaung0307@gmail.com`
- `panna07@gmail.com`

The authenticated token must have a verified email AND `google.com` as its sign-in provider. The same check is applied in the app, callable backend and Firestore rules. No admin UID grant is needed. Old `admin: true` claims on other accounts do not grant permission. Editable profile fields never control authorization. Deploy the new rules/functions to apply these restrictions in the live project.

## Contributions

Google users can edit their private profiles, save private favorites, submit recipes and suggest edits. English and Burmese exact names are normalized with NFKC, lowercase, whitespace collapse and invisible-format-character removal. Duplicate names route to the existing recipe and an edit request. Server-side checks repeat validation and use transactional name reservations on approval.

Submissions and edits are private to their contributor and admins until publication. Admins see the proposal and current recipe, approve/apply or reject with feedback. Concurrent duplicate approvals and stale edits are rejected. Original author credit is retained after edits, with last-contributor credit added.

The 24 unique original recipes and their Burmese/English text are preserved. Several original entries lack ingredients/steps and are clearly marked as community drafts. Their recipes/translations need editorial review before public launch. Unrelated original stock photos were replaced with local illustrations; see `ASSETS.md` for generated artwork provenance.

## Support links

Footer links directly open a new tab, in the supplied order:

| Option | Destination |
|---|---|
| Coffee | https://buy.stripe.com/5kQ6oHdM85To0WR3xg1B607 |
| Burger | https://buy.stripe.com/14AcN57nKgy2cFzd7Q1B606 |
| Big Meal | https://buy.stripe.com/5kQ28r5fCa9E8pj9VE1B601 |
| Donation / Charity | https://buy.stripe.com/9B600j7nK6Xs20V2tc1B60r |

Tests verify exact link destinations and tab navigation without making payments. Checkout prices, beneficiary details and current Stripe payment-link status were not verified. An unconfigured link still displays an honest explanation instead of navigating to a fabricated destination.

Footer also includes Made by MM, a heart, dynamic year, Privacy, Terms and Admin. Privacy/Terms are starter text in `src/main.js`; add the operator identity and a direct support/deletion contact before public launch.

## Architecture and limits

- `src/main.js` / `src/style.css`: responsive app, accessible dialogs and controls.
- `src/api.js`: runtime configuration, Firebase Auth/Firestore/Functions adapter.
- `functions/lib/model.js`: shared validation, safe URLs, exact-name normalization, search.
- `functions/lib/admin.js` and `firestore.rules`: administrator allowlist.
- `functions/index.js`: authenticated submissions and atomic moderation.
- `functions/manage.js`: trusted seed import.

Photo/video URLs must be HTTPS; arbitrary HTML is not accepted. YouTube uses validated IDs and click-to-load privacy-enhanced embeds. TikTok and other services open externally. Device photo uploads are supported; there is no offline cloud synchronization. Search loads the published collection client-side; a large catalog needs pagination and a search service. Add deployment-specific abuse controls/App Check as needed.

## Tests

```sh
npm test
firebase emulators:start --only auth,firestore,functions,storage --project demo-myanmar-kitchen
# another terminal
node tests/integration.mjs
```

Ten unit tests and twenty-eight emulator checks cover normalization, permissions, private data, the two-admin restriction, old-claim rejection, moderation, name collisions and stale edits.

`tests/browser.mjs` covers responsive layout, recipe arrows and unconfigured auth/support states. `tests/support-browser.mjs` checks all four exact Stripe links and mobile arrows, intercepting payment navigation. `tests/auth-browser.mjs` tests sign-in and publishing on a dev server connected to local emulators. Set `TEST_URL` to the relevant server. The auth test's default port is 5174; other tests default to 5173. Use the `.env.example` Firebase fields with a `demo-myanmar-kitchen` project and `VITE_USE_EMULATORS=true` for the auth test only. Never use emulator settings in production.

Browser tests use installed macOS Chrome; set `CHROME_PATH` to a suitable executable on your system. See `VERIFICATION.md` for the last run's results and limitations.


## Version 2.2: categories and device photos

Admins can add named/bilingual categories from the review inbox or inline in the recipe form without losing their draft. Firestore-backed categories feed filters and recipe submission validation. The backend authorizes the same two verified Google emails and atomically prevents duplicate category names. Existing categories are retained; this release adds creation, not deletion.

Device photos support JPEG, PNG, WebP, GIF, AVIF and HEIC/HEIF (lazy-loaded `heic-to` decoder). The browser creates a preview and compresses to at most 1600 px / 600 KiB before submission. Inputs are limited to 25 MiB / 60 MP; animations become still images. The authenticated upload callable uses Sharp to verify, auto-orient, strip metadata and encode WebP, capped at 700 KiB. Uploads are limited to 30 attempts per user per UTC day. Unsupported/corrupt formats show an actionable error. HEIC/PNG were exercised in Chrome; device/browser codecs can differ.

Enable Firebase Storage (Blaze required) and create the bucket. `RECIPE_PHOTO_BUCKET` is a server parameter defaulting to the original project's `my-kitch.firebasestorage.app`; override it in `functions/.env.my-kitch` when necessary. Deploy `storage`, `firestore:rules`, `functions` and hosting. `storage.rules` blocks direct SDK reads/writes; upload goes through the authenticated callable. The returned unguessable download-token URL is shareable, including before publication. Failed/abandoned recipe submissions can leave unused uploads; clean these through Storage Console when appropriate.

Install both frontend and function dependencies before running all tests. `tests/photos.test.js` exercises server encoding and validation; `tests/category-photo-browser.mjs` checks category creation, preserved draft fields, PNG/HEIC previews, storage upload and publication against emulators. Its HEIC fixture is passed via `HEIC_FIXTURE` (default `tests/fixtures/recipe.heic`); use a local test image, not personal photos. No live bucket was modified. See the Burmese guide for setup.

References: https://firebase.google.com/docs/storage/admin/start and https://github.com/hoppergee/heic-to .

## Version 2.4: recipe families and regional styles

The optional `recipeGroup` field links distinct named recipes (for example Rakhine Mont Ti and Mandalay Mont Ti). Published groups and regions appear as filters and clickable badges. Contributors can reuse published group suggestions or propose a new group; it becomes public only when its recipe is approved. Admin comparison includes the group. Exact recipe-name uniqueness is unchanged and does not treat a shared group as a duplicate. Existing recipes remain valid without a group; edit them through the normal review workflow to add one.
