# Current release: Cinematic V2

See [Cinematic V2 release notes](CINEMATIC-V2.md) for current implementation, checks, audit and Cloudflare release information. The report below records the earlier V1 work.

# Verification — 17 November 2026

Final implementation in `/workspace/shanti-sagar`:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed (strict application TypeScript configuration) |
| `npm run lint` | Passed (Oxlint) |
| `npm run build` | Passed (Vite static production output in `dist/`) |
| `npm run test:e2e` | 13 passed, 1 intentional skip, 1.8 minutes |

Browser projects: 1440×1000 desktop Chromium and Pixel 7 Chromium emulation with
reduced motion. The skipped test is Android 3D; the baseline deliberately uses
the lightweight still life. Desktop software-WebGL rendering is tested with
SwiftShader; this is not hardware GPU or physical Android performance validation.
All completed browser tests also assert no uncaught page errors.

## Verified behavior

- Hero renders, local photography loads, mobile navigation opens/closes and links work.
- Document width stays within the mobile viewport (the original carousel overflow
  issue found during testing was fixed with a proper overflow viewport).
- Menu filters and shared-image full-screen dish details.
- Ingredient/dietary information tabs and arrow-key tab selection.
- Additional dish imagery and thumbnails.
- Browser Back/Forward, Escape, direct dish links and dialog focus containment.
- Return focus and restoration of the original card’s scroll position.
- Gallery keyboard navigation, synthetic touch swipe, Escape and return focus.
- Unverified call, WhatsApp, ordering and Google review destinations stay disabled.
- Google Maps iframe is absent until requested (external map response stubbed).
- Image request failures show a useful accessible fallback.
- 3D is absent at first load, mounts only on activation and can be unmounted.
- The 3D canvas has a valid WebGL context in the desktop test browser.
- Shared layout frame inspection measured a selected card image moving from
  approximately 388px wide / 314px top to 604px wide / 135px top, with intermediate
  Motion projection transforms. This confirms actual geometric animation.

## Manual review and infrastructure

The shared cloud browser rendered the hero and dish explorer. Browser Back
returned focus to the source card. That browser lacked WebGL; the still-life
fallback appeared correctly. Playwright’s separate software-WebGL test verified
the optional 3D renderer. Desktop, mobile, detail and 3D screenshots are in `docs/`.

The managed `sites-preview` first failed binding port 4173 with `EPERM`. A permitted
retry reached the relay but timed out waiting for relay readiness. The project’s
normal Vite server on port 5173 then worked through the approved command flow and
was used for browser QA. No app code was weakened to work around the infrastructure.

## Production output and limits

The initial app bundle is approximately 434KB minified / 141KB gzip. The optional
3D chunk is approximately 996KB / 269KB gzip and triggers Vite’s 500KB chunk-size
advisory. It is lazy and opt-in; it is not downloaded by the default still life.
This advisory is not a build failure. No Lighthouse/Core Web Vitals score is claimed.

No physical Android, exhaustive assistive-technology, slow-network or live external
provider integration test was performed. Touch gallery gestures are simulated;
external contact destinations remain unconfigured. Images and menu information
are demo content, and the rating is a user-supplied snapshot.

At the end of the initial implementation, Vercel authentication was unavailable
and no deployment had been performed. The production release below supersedes
that status: an official temporary deployment was subsequently published.


## Production release verification and deployment

The existing production build was regenerated and checked again on 17 November
2026. `npm run typecheck`, `npm run lint`, and `npm run build` passed.
`PLAYWRIGHT_PRODUCTION=1 npm run test:e2e` tested `vite preview` serving the
actual `dist/` output: **13 passed, 1 intentional Android 3D skip (1.7 minutes)**.
The detail test explicitly clicks the on-screen **Back to the table** button.
No website sections or 2D/3D features were removed. Live testing subsequently
found a fragment-history focus race on mobile; see the release note below.

Despite no saved Vercel authentication, the official `vercel deploy --temporary`
flow successfully published the existing static build. The CLI returned status
`ok` and ready state `READY`; an independent HTTPS request returned HTTP 200
with the correct restaurant title. This is an accountless temporary deployment,
not a permanent claimed Vercel project. See `PUBLIC-DEPLOYMENT.json` for its
actual public URL and server-reported expiry. Ownership links are excluded from
the source, deployment ZIPs and public documentation.

To keep the deployment live, its owner must claim it before expiry with their
free Vercel account, or sign in and upload the packaged ZIP through Vercel Drop.
The separate private claim download must never be shared with visitors.

The cloud browser publishing runtime could not initialize (`gaas-browser
node_repl sandbox cannot be disabled`). The documented CLI route was used
instead; this was not a Vercel site rejection. Phone upload instructions use
current Vercel Drop documentation. Physical Android testing remains unverified.


### Live mobile focus correction

Live smoke testing entered the menu via its anchor link. On reduced-motion
mobile, native fragment-history focus restoration could run after the dialog
closed, overriding focus on the source card. The explorer now restores scroll
and focus after two animation frames, allowing native history navigation to
settle first. The production regression test now enters through Explore Menu
before filtering and opening a dish, so it covers the anchored return path.

The corrected production regression suite completed with **13 passed, 1 intentional skip (1.5 minutes)**. The same temporary public project was successfully updated; its CLI response again reported `ok` / `READY`.


Final live public smoke checks also passed on desktop Chromium (including
software WebGL) and Android-size Chromium at 360px, 393px and 412px. Verified
HTTP 200, dish opening, on-screen Back, return focus, gallery navigation, mobile
menu, and desktop 3D loading. Results are recorded in `PUBLIC-SMOKE-TEST.json`.
The public homepage HTML byte hash matches the final local production build.
