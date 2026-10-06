# Myanmar Kitchen · 2.0

A responsive Myanmar cooking community, rebuilt from the supplied My Kitch project. The 24 distinct legacy recipes are preserved, including Burmese text. Older incomplete recipes are marked as community drafts and invite corrections. Their source text has not been professionally recipe-tested or translated; review it before public launch. Unrelated legacy stock photos were removed. The fried-rice artwork is an AI-generated editorial illustration; other recipes use category illustrations until contributors supply photos. Missing/broken images receive a local kitchen illustration.

## Run locally

Use Node.js 22 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Without Firebase configuration, browsing, bilingual recipe content, search, filters and ingredient checklists work against the starter collection. Sign-in explains that setup is required. It does not create fake accounts or store shared community content in local storage.

```sh
npm test
npm run build
npm run preview
```

`dist/` is included as a ready-to-preview browsing build. Serve it over HTTP, rather than opening index.html as a file. Rebuild after adding Firebase settings; the included build intentionally contains no project configuration.

## Connect Firebase and Google

The original project included Firebase Hosting configuration and an unused Firestore module. This upgrade retains Firebase as the backend and removes its embedded project identifiers from the source. You may reuse your existing Firebase project; no live project was modified during development.

1. In Firebase Console, select your project and register a web app. Create Cloud Firestore in production mode. Enable **Authentication → Sign-in method → Google** and set the support email.
2. Under Authentication settings, add the actual hosting/custom domain to **Authorized domains**. Add `localhost` if you need local Google OAuth testing. For a custom auth domain, follow Firebase's redirect-domain instructions linked below.
3. Copy `.env.example` to `.env.local`. Fill in the Firebase web app fields. Keep `VITE_FUNCTIONS_REGION=us-central1` unless you also change the function region. Keep `VITE_USE_EMULATORS=false` for production.
4. Install the Firebase CLI (`npm install -g firebase-tools`), run `firebase login`, and select your project with `firebase use --add`. Then install function dependencies with `npm ci --prefix functions`.
5. Cloud Functions deployment requires an appropriately configured billing-enabled Firebase project (Blaze). Build and deploy:

```sh
npm run build
firebase deploy --only firestore:rules,functions,hosting
```

6. Import the starting collection and name registry **before opening contributions**. Configure local Application Default Credentials with permission for this project (for example, `gcloud auth application-default login`) and set the project explicitly:

```sh
cd functions
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID node manage.js seed
```

This command creates missing seed records transactionally and preserves existing records. A conflicting normalized name aborts that import rather than overwriting it. If you already have recipes in a different schema or collection, migrate them and populate `recipeNames` first; the original ZIP did not include existing Firestore records.

7. Sign in once in the app, copy your UID from Firebase Authentication, then grant admin from your trusted local environment:

```sh
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID node manage.js admin YOUR_USER_UID
```

Sign out and in again to refresh the custom claim. The footer Admin button then opens the moderation inbox. Never grant admin through an editable profile document.

Firebase web app configuration is delivered to browsers and is not an administrative secret. Access is protected by Firestore rules and verified callable-function authentication. Never put service-account JSON, private keys, OAuth client secrets or Admin SDK credentials in `VITE_*`, `public/`, source files or this ZIP. `.env.local` is ignored. Configure API restrictions, usage alerts and App Check/rate controls appropriate to your deployment before opening a large public community.

Official documentation: [Google sign-in](https://firebase.google.com/docs/auth/web/google-signin), [callable functions](https://firebase.google.com/docs/functions/callable), [custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

## Community workflow

- Google users have a private editable display name/bio and private cloud favorites.
- A submission contains a recipe name, optional Burmese name and text, category, ingredients with measurements, preparation/cooking steps, total minutes, servings, difficulty, region, tags, photo and video links.
- Names use Unicode NFKC, lowercase, collapsed whitespace, trimmed boundaries and removal of invisible formatting characters. Both English and Burmese names participate in exact matching. Similar but non-identical titles remain distinct.
- The form finds exact duplicates and offers the existing recipe or a change request. The server independently repeats this check.
- New submissions and edits are pending until an admin reviews the complete proposal. The edit review includes the current recipe beside the proposal.
- Approval atomically reserves normalized names and publishes the recipe. Concurrent approvals cannot create duplicate published names. Pending proposals do not reserve a name; if two pending proposals collide, only one may publish and the other must be rejected with feedback.
- Edits retain original author credit, add last-contributor credit, increment the version, and reject stale proposals. An admin can reject with feedback; the contributor sees the result in My contributions.
- YouTube videos use an exact-host allowlist, validated IDs and a click-to-load privacy-enhanced player. TikTok and other HTTPS videos open as safe external links. Arbitrary embed HTML is never accepted. Photo URLs must be HTTPS; no file-upload/storage bucket is needed.

## Support and policies

Add your actual HTTPS destinations to `VITE_SUPPORT_COFFEE`, `VITE_SUPPORT_BURGER`, `VITE_SUPPORT_BIG_MEAL` and `VITE_SUPPORT_CHARITY`, then rebuild. Unconfigured options explain that the owner has not added a destination; no fabricated payment or charity links are used.

Footer includes these four support options, Made by MM with a heart, the browser's current year, Privacy, Terms and Admin. Privacy/Terms are editable starter text in `src/main.js`; add your operator identity, direct support/deletion contact and applicable details before launch.

## Architecture

- `src/main.js`: accessible responsive app and dialog workflows; untrusted content is escaped.
- `src/style.css`: mobile-first adaptive layout, reduced-motion support, focus states.
- `src/api.js`: lazily loaded Firebase Auth, Firestore and Functions adapter.
- `src/recipes.json`: preserved catalog for the unconfigured browsing build.
- `functions/lib/model.js`: shared name normalization, validation, search and safe-link logic.
- `functions/index.js`: authenticated submission and admin moderation callables.
- `functions/manage.js`: trusted seed/admin setup; `functions/seed.json`: import catalog.
- `firestore.rules`: private profiles/favorites, owner/admin request access, no direct public-content writes.

This deliberately small application has no frontend framework requirement. Firebase dependencies load only in configured mode. Search is client-side across the published collection; for a very large catalog, add pagination and a dedicated search service. Authenticated inboxes are fetched on opening; recipes refresh after approval and page reload. There is no promised offline synchronization, email notification service or image-upload service.

## Verification

- `npm test`: six tests covering normalization, bilingual exact duplicates, broad search, safe video URLs, validation and migration uniqueness.
- `tests/integration.mjs`: 14 real emulator checks covering authorization, profile escalation prevention, pending moderation, private requests/favorites, admin publication, normalized duplicates, stale edits, rejection and competing approvals.
- `tests/auth-browser.mjs`: authenticated Google-provider emulator UI, favorites, submissions, admin publication and duplicate-to-edit flow. Run the app on port 5174 with the demo project fields and `VITE_USE_EMULATORS=true`.
- `tests/browser.mjs`: browser checks for desktop/tablet/mobile sizing, search, filters, recipe detail, checklists, Burmese switch, unconfigured sign-in and privacy.

Run integration checks against emulators only:

```sh
firebase emulators:start --only auth,firestore,functions --project demo-myanmar-kitchen
# another terminal
node tests/integration.mjs
```

The browser test expects the local dev server on port 5173 and uses installed Google Chrome on macOS. Adjust its executablePath for another OS, or install Playwright Chromium and omit executablePath.

Live Google OAuth, live payments and deployment are not verified without your project configuration. Emulated backend checks do not substitute for a final smoke test on your authorized production domain.
