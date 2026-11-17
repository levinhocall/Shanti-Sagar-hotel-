# Shanti Sagar Pure Veg — original interactive website concept

An unofficial restaurant demonstration built on the existing React + TypeScript
+ Vite project. All design and interactive components are original. The
incomplete 21st.dev dependency and integration placeholder have been replaced.

## Start and build

Use Node.js 22.12+ (24 recommended).

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

Components: `components/ui/`. Styles: `src/index.css`. `cn`: `lib/utils.ts`.
The `@/*` alias resolves to the project root. `components.json` retains the
shadcn-compatible structure; no component marketplace or paid UI kit is needed.

## Experience

- Cinematic original hero with pointer depth, animated typography and magnetic CTAs.
- Optional original Three.js / React Three Fiber / Drei table sculpture. Porcelain,
  gold knot and leaves are decorative art, not a simulated photorealistic dish.
- Lightweight CSS still life is the default on every device. 3D downloads only
  on explicit activation, limits DPR to 1–1.5, pauses its render loop offscreen
  or in a hidden tab, and falls back on WebGL failure or context loss.
- Motion reveals, FLIP menu filtering and shared-image dish drill-down transitions.
- Native full-screen dialogs with focus containment, Escape, Back/Forward history,
  direct query links, return focus and scroll restoration.
- Dish imagery, information tabs and explicit ingredient/dietary verification notes.
- Embla touch carousel and editorial gallery with keyboard/swipe lightbox.
- Locally hosted responsive demo photography and open-license fonts.
- User-initiated Google Maps search embed and safe configurable contact actions.
- Reduced-motion support throughout. GSAP was intentionally omitted: Motion and
  CSS cover the effects without a second animation runtime.

## Business information and configurable actions

Edit `src/data.ts`. The name, exact address, vegetarian/South Indian positioning,
facilities and rating snapshot are user-supplied. Rating **3.8/5, 1,364 reviews**
is explicitly displayed as user-supplied demo information, not a live score.
No guest reviews, actual menu prices, recipe details, allergens, nutritional
claims, phone numbers or restaurant history have been invented.

Earlier location cross-checks: [District](https://www.district.in/dining/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane)
and [Zomato](https://www.zomato.com/mumbai/shanti-sagar-pure-veg-ulhasnagar-thane).
Published listings may change; confirm details before visiting.

The following destinations default to empty strings and leave the associated
buttons disabled until verified:

- `googleMapsListing`: exact verified Google Maps business/reviews URL.
- `phone`: international phone number for a `tel:` link.
- `whatsapp`: verified full HTTPS WhatsApp enquiry URL.
- `orderOnline`: verified full HTTPS ordering URL.

Directions and the map embed deliberately use a labeled **Google Maps search**
until an exact listing is configured. The map loads only when requested. Existing
District and Zomato listing links remain available. There is no enquiry storage,
reservation backend, order processing or payment integration.

## Photography and fonts

All photographs are local licensed Unsplash demo images, not restaurant photos.
Photo source IDs are recorded in `src/data.ts`; see `docs/ASSET-LICENSES.md`.
Dishes and details are sample concepts, not confirmed menu items. The idli photo
is correctly labeled as idli, rather than the previous sample dosa label.
Replace sample imagery and menu content with restaurant-approved material before
using this as an official site. Fonts are self-hosted Cormorant Garamond and
Manrope; font licenses ship in `public/licenses/`.

## Browser tests

```sh
npm run test:e2e
```

The committed Playwright configuration uses the installed Chromium at
`/usr/bin/chromium`. Elsewhere, set `CHROMIUM_PATH` to your Chromium executable,
or remove `executablePath` and run `npx playwright install chromium`. Software
WebGL flags in the test configuration support 3D verification in this cloud
machine; they do not affect visitors’ browsers. Tests cover desktop and Pixel 7
emulation (reduced motion). Emulation is not a physical Android device test.

See `docs/VERIFICATION.md` for actual results and limitations. Contact actions
stay disabled during tests; the external map is stubbed to avoid reliance on a
third-party service. Screenshots are in `docs/preview-*.png`.

## Deploy on Vercel and obtain a public URL

**Android: use [the phone deployment guide](docs/ANDROID-DEPLOYMENT.md).**
Vercel Drop accepts either supplied ZIP directly, without GitHub or a terminal.
Use `shanti-sagar-deploy.zip` for the already-built demo, or
`shanti-sagar-source.zip` for a framework build.
Run `python3 scripts/package-demo.py` after a build to regenerate both archives.

The following Git import method remains available if you prefer it.

This static project requires no runtime secrets. A temporary Vercel preview was
published during release verification; see `docs/PUBLIC-DEPLOYMENT.json` for the
actual URL and expiry. It must be claimed before expiry to remain live.

1. Push this project directory and `package-lock.json` to your Git repository.
2. In Vercel, choose **Add New → Project → Import Git Repository**.
3. Set root directory to this project’s directory, framework **Vite**, install
   command `npm ci`, build command `npm run build`, output directory `dist`.
4. Deploy. Copy the actual `https://…vercel.app` URL returned after success.
5. Vercel’s Git integration can create preview deployments for later pull requests.

Alternatively, in this directory run `npx vercel`, sign in to your account and
follow its prompts. Use `npx vercel --prod` for the production alias. Check current
Vercel Hobby eligibility and terms for your intended use. `vercel.json` includes
Vite build settings and basic response headers. Query-string dish/gallery links
work on this single-page static site without additional rewrite rules.

The unofficial demo includes `noindex,follow` metadata to avoid impersonating the
restaurant in search results. Remove it, and configure absolute canonical/social
URLs, only when the appropriate official/public site identity has been confirmed.
