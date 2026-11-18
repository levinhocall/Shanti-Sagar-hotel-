# Shanti Sagar Pure Veg · Cinematic V4

[Existing Cloudflare Worker](https://shanti-sagar-hotel.meetatiwari47.workers.dev)

This independent restaurant concept extends the React, TypeScript, Vite and
Tailwind project on main. The food explorer, gallery, still life and visit
sections are usable without WebGL. The optional 3D thali uses React Three Fiber
and renders on demand using concept food textures. Motion handles card filtering, the shared dish image,
the scroll reveal and pan feedback. The paneer study streams nearby frames from a 16-frame WebP sequence. The thali and dosa studies use scroll-linked stills. Pinned desktop story imagery uses CSS
sticky positioning and the page uses native scrolling.

## Build and verify

Use Node.js 24.

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npx playwright install --with-deps chromium webkit
PLAYWRIGHT_WEBKIT=1 npm run test:prod
```

The [V3 Quality Gate](.github/workflows/v3-ci.yml) runs these checks on feature
and production branches and uploads browser evidence and the production build.
Playwright covers desktop Chromium, Pixel 7 emulation and iPhone 13 WebKit
emulation. The suite includes keyboard navigation, motion preferences,
horizontal overflow, WebGL loading/fallback and axe accessibility checks.
Emulation gives browser-engine and layout coverage. Physical device testing
requires Android Chrome and iOS Safari devices.

Source sections are in `src/components/`, business data in
`src/data/restaurantData.ts`, and design tokens in `src/styles/`.

## Public listings and sample content

[Zomato](https://www.zomato.com/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane)
lists the restaurant’s Camp Road address, cuisine categories and telephone.
[District](https://www.district.in/dining/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane)
corroborates the location and provides a live destination for posted hours.
The map uses a Google Maps search and requests an embed only when activated.
External listing links handle reviews and ordering. The demo does not process
orders or collect contact details.

The hero, featured food stories and selected explorer and gallery images use AI concept images. See the [V4 asset manifest and shot specifications](docs/v4-food-assets.md). The stock food photography is illustrative,
and the sample menu makes no official price, ingredient or allergen claims.
See [asset credits](docs/ASSET-LICENSES.md). Replace sample food content with
restaurant-approved material before presenting this as the official site.

## Cloudflare release verification

Preserve the connected production branch and existing `shanti-sagar-hotel`
Worker. The Worker configuration serves `dist/`. Build with `npm run build`
and deploy with `npx wrangler deploy` through the existing Cloudflare setup.

After the production deploy completes, check the exact deployed revision and
run the public browser smoke test.

```sh
node scripts/verify-public.mjs \
  https://shanti-sagar-hotel.meetatiwari47.workers.dev \
  FULL_MAIN_COMMIT_SHA
```

The script compares `/release.json` with the expected commit before testing
the public homepage. Prior release evidence remains in [the V2 notes](docs/CINEMATIC-V2.md).
