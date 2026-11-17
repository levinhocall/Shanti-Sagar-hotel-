# Cinematic V2 — implementation and release notes

This redesign extends the existing React/Vite application. It retains the same
restaurant data, demo disclaimer, six restaurant sections, source repository,
and Cloudflare Worker name: `shanti-sagar-hotel`.

## Design research and original direction

The supplied reference video was inspected as a storyboard. It demonstrates a
workflow involving UI/UX Pro Max, Motion and MotionSites and uses dramatic dark
compositions and light/depth. No video imagery, third-party site design, paid
component or proprietary code was incorporated.

Public references consulted:

- https://ui-ux-pro-max-skill.nextlevelbuilder.io (redirects to https://uupm.cc/)
- https://motion.dev (public layout, scroll, spring and gesture documentation)
- https://motionsites.ai (public inspiration landing page)

The resulting direction is original: a forest/ink palette, cream editorial type,
champagne accents, oversized photographic discs, restrained texture/light,
asymmetric menu and gallery compositions, and a continuous food story.

## Implementation

- Full-height hero with a photographic disc, independent foreground layer,
  typography entrances, pointer depth and scroll-linked translation/scale.
- Original scroll story with coordinated photographic rotation, movement and
  atmospheric light; normal native vertical scrolling, with no scroll hijacking.
- Magnetic links use Motion values instead of React rerenders per pointer event.
- Fine-pointer ambient light is decorative, keeps the normal cursor, ignores
  touch and disappears for reduced motion. No essential action depends on hover.
- Active navigation reflects the visible section, alongside the existing mobile
  menu, Escape handling and keyboard-visible focus states.
- Preserved FLIP menu filters, shared-image details, URL/browser history, native
  dialogs, information tabs, image controls, swipe gallery and return focus/scroll.
  Detail presentation is now dark, layered and progressively revealed.
- Enhanced procedural porcelain sculpture: three gold-rimmed plates, knot, leaves,
  warm/cool lights, subtle levitation and pointer response. This is decorative
  art, explicitly not a fabricated photorealistic restaurant dish.
- Optional WebGL continues to require activation. Rendering adapts to coarse
  pointers and low core counts, limits DPR, reduces geometry and shadows on
  compact devices, regresses quality during interaction while keeping DPR at least 1, and pauses offscreen
  or in a hidden tab. A still-life fallback remains available.
- Removed the heavier environment and contact-shadow helpers. Imported only the
  needed Drei controls/adaptive DPR modules, with separate renderer/control chunks.
- Existing licensed food photos now have local WebP variants. The hero additionally
  has a larger source for high-density desktop screens. Original JPEGs remain for
  compatibility. Fonts remain self-hosted under their included licenses.
- GSAP was not added: the implemented native-scroll sequences are covered by Motion,
  avoiding duplicate animation engines and an unnecessary runtime dependency.

## Build and dependency changes

`npm run lint` now runs ESLint 10 (TypeScript and React Hooks rules) and Oxlint.
The compiler uses supported TypeScript 6 because the current typescript-eslint
parser does not support the previously installed TypeScript 7. Strict checking
and the existing TypeScript project structure remain in place.

The initial application bundle is about 439KB minified / 142KB gzip. Optional
3D code is split into renderer and control chunks; the largest optional chunk is
about 383KB, down from the prior single 996KB chunk. Total optional code is still
substantial; splitting does not make that total vanish. It stays off the initial
network path, which is verified by browser tests. No chunk-size advisory remains.
No physical-device performance or Core Web Vitals score is claimed.

## Security audit

`npm audit --omit=dev` reports **zero vulnerabilities**. The complete audit reports
11 high-severity dependency paths stemming from one upstream `picomatch` ReDoS
advisory (GHSA-fc5q-39xc-vjpf), involving build/lint tooling. The latest registry
release is 4.0.7 and is still listed as affected; no published patched release is
available at verification time. No unsupported force-downgrade or audit suppression
was applied. The static production Worker does not execute these build-time
packages or accept untrusted glob patterns. See `DEPENDENCY-AUDIT-V2.json`.

## Existing Cloudflare deployment

The current live URL was checked before editing and served the previous production
HTML. The repository had no tracked Cloudflare configuration. The user confirmed
that GitHub automatic deployment is connected to the existing Worker.

`wrangler.jsonc` now explicitly targets the existing `shanti-sagar-hotel` Worker,
serves `dist/` as static assets and provides SPA fallback. No new Worker name,
account, domain, database or paid service is introduced. Wrangler dry-run validates
this configuration without production credentials. The release is published via
the already-authorized GitHub push workflow, then checked at:

https://shanti-sagar-hotel.meetatiwari47.workers.dev

## Verification

TypeScript, ESLint 10, Oxlint, the production build and Wrangler dry-run passed.
The production Playwright suite completed with **21 passed, 1 intentional skip**.
The skip is the Android-emulation 3D test; desktop software-WebGL rendering is
checked separately. Width checks cover 320, 360, 393, 768, 1024 and 1440 pixels.

Verified: menu filtering, geometric detail transitions, tabs, browser Back/Forward,
Escape/Tab focus containment, return focus/scroll, mobile navigation, swipe gallery,
image errors, map opt-in, disabled unverified contacts, native scroll animation,
reduced motion, and absence of initial 3D network requests.

Actual post-deployment verification is recorded after publication. Automated mobile checks are Chromium emulation, not physical Android
or iOS testing. The shared cloud browser runtime was unavailable; the project's
installed Chromium/Playwright runner performs the browser checks instead.

The final 3D refinement was rechecked separately after the full suite: it waits
for an actual rendered scene (not only canvas creation), displays a loading
state until ready, and verifies repeated enable/disable cycles. This targeted
production test passed. Context-loss handlers are removed during unmount.
