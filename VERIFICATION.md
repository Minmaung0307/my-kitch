# Version 2.4 verification — 6 October 2026

- Live submitRecipe/reviewRequest and Hosting deployment completed; both callable login gates return 401 to unauthenticated requests.
- All 31 emulator regression checks passed.
- Production build and 12 unit tests passed, including distinct regional names with a shared searchable group and unchanged exact-name collision rules.
- Authenticated emulator browser workflow passed: recipeGroup and region submitted, reviewed, approved, visible as badges, and filterable after publication.
- Mobile browser check passed: group/region filtering, detail badge navigation, no horizontal overflow. Screenshot visually inspected.
- Existing recipes without recipeGroup remain valid; no automatic production content reclassification or replacement.

# Version 2.3 verification — 6 October 2026

- Production build and all 11 unit tests passed.
- All 31 isolated Firebase emulator integration checks passed, including missing starter import, pending edits, approval, and preserving previously edited catalog entries.
- Auth browser workflow and dashboard browser checks passed: contributor submission/status, allowlisted admin approval, duplicate-to-edit, five moderation tabs and published recipe editing.
- Live deployment succeeded for all five functions, Firestore/Storage rules and Hosting.
- Confirmed missing Cloud Run invoker bindings for reviewRequest and uploadRecipePhoto; repaired those two service bindings. Firebase user/admin validation remains enforced in handlers.
- All five live callable endpoints return 401 UNAUTHENTICATED to unauthenticated requests, instead of the prior transport 403.
- Live catalog initialized with 24 trusted original recipes and normalized name registry using create-only writes.
- Published mobile page: 24 cards, no horizontal overflow, no page JavaScript errors.
- Not performed: authenticated production submission/approval using a real person's Google session; actual Stripe payment.

The following sections are historical verification records, not current deployment status.

# Version 2.2.1 verification

Production build, 11 unit tests and 28 emulator integration checks pass. Browser test verifies equal top coordinates/heights for English/Myanmar name fields, collapsed empty duplicate state, mobile dialog fit and actionable error messages. Screenshot visually checked.

Cloud inspection remains blocked: panna07@gmail.com lacks project read permission; saved minmaung0307@gmail.com credentials could not refresh (invalid_grant). No Cloud Build internal logs were obtained; no live deployment/IAM changes were made. Root cause of the two failed builds and the production submission error remains unconfirmed. Recovery scripts deploy rules first and functions sequentially, stopping on failure, without deleting resources or changing IAM.

# Version 2.2 verification · 6 October 2026

- Production build passes. The HEIC decoder is loaded only when needed; its bundle and the Firestore bundle have size advisories.
- 10 unit tests pass, including server WebP conversion, size limits, metadata removal, forged-content rejection and dynamic-category validation.
- 28 emulator checks pass, including admin-only category creation, normalized duplicate names, registered-category submission/approval, authenticated photo upload/download, blocked direct Storage writes and the daily upload limit.
- Browser end-to-end test passes: existing verified Google admin, add category without losing draft, PNG preview/remove, HEIC conversion/preview, upload to Storage emulator, submit, approve, reload and search by the category name.
- Preview visually inspected. The bundled HEIC test fixture was locally converted from the project's generated fried-rice illustration.
- Live Firebase Storage creation, billing and deployment remain owner setup. No production bucket or user data was changed.

## Previous verification · 2.1 · 6 October 2026

Passed:

- Production build.
- Seven unit tests, including verified Google-only access for exactly the owner's two emails.
- Seventeen Firebase emulator integration checks: private profiles/favorites/requests; denial of direct publication and non-admin approvals; denial of legacy admin claims on other emails; allowed access for the second designated admin; transactional approval, exact-name uniqueness and stale-edit rejection.
- Desktop/tablet/mobile browser suite: card arrow opens details, search/filtering, no horizontal overflow, ingredient checklist, language switch, visible in-dialog auth errors and unconfigured support messaging.
- Authenticated browser flow against local demo emulators: Google provider sign-in, favorites, submission, contribution status, allowlisted admin publication and duplicate-to-edit routing.
- All four exact owner-supplied Stripe hrefs and new-tab navigation checked with checkout requests intercepted; no payment made. Mobile recipe arrow also checked.
- Original project's public Firebase auth configuration returned HTTP 200 and authorized localhost, my-kitch.firebaseapp.com and my-kitch.web.app. No live project mutation occurred.

Not verified: complete live Google OAuth, backend deployment, payment-link prices/beneficiaries/status or actual payments. The owner must enable Google if disabled and deploy the new Firestore rules/functions to activate backend changes. Support links are mapped in the supplied order: Coffee, Burger, Big Meal, Donation/Charity.

Environment: macOS Node 23.5.0, Vite 6.4.4, isolated Chromium, local demo Firebase emulators. Production functions target Node 22 LTS. A lazy Firestore SDK chunk triggers a build size advisory; build succeeds. In-app Browser was unavailable due to a missing bundled component, so the documented fallback was used.
