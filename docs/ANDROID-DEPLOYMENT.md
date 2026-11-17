# Publish this demo from an Android phone — free Vercel hosting

Use Chrome. No laptop, terminal, GitHub repository, domain purchase or paid plan
is needed. These steps use Vercel's documented ZIP upload flow:
https://vercel.com/docs/drop

## Keep the preview that was already published

The current public preview and expiry are in `PUBLIC-DEPLOYMENT.json`. To keep
that same preview, download the separate **shanti-sagar-claim-private.txt** from
the chat. Open its ownership link in Chrome, sign in to your own free Vercel
account, and complete the claim before expiry. Only share the public website
URL with the restaurant owner. The ownership link is not included in either ZIP.
If the temporary preview has expired, use the upload steps below.

## Recommended: upload the already-built demo

1. Download **shanti-sagar-deploy.zip** from the chat to your phone's Downloads.
   This contains the tested production website, including the lazy 3D chunk,
   photographs and fonts. Keep the ZIP intact; do not extract it.
2. Open **https://vercel.com/drop** in Chrome.
3. Sign in to your own free Vercel Hobby account. If you need to create an
   account, complete signup yourself. Do not select a Pro trial or paid plan.
4. Tap **choose a file** (or the upload area). In Android's picker, choose
   **Files → Downloads → shanti-sagar-deploy.zip**. You do not need to drag files.
   If the controls are hard to see, use Chrome's **⋮ → Desktop site**.
5. If prompted, select your personal Hobby workspace and enter a project name,
   such as `shanti-sagar-demo`. Pick a different name if it is taken.
6. Tap **Deploy**. This ZIP is a static build, so no framework build or environment
   variables are required. If asked to choose a homepage, select **index.html**.
7. Wait for the successful deployment screen. Tap **Visit**, then copy the actual
   **HTTPS website URL** ending in `.vercel.app` from Chrome's address bar.
   Do not copy the Vercel dashboard/inspection link.
8. Open that URL in a Chrome **Incognito** tab. Confirm it opens without login,
   tap a food card, then **Back to the table**. Also test Gallery and the mobile menu.
9. Share that tested website URL with the restaurant owner through your usual
   sharing app. Keep the visible unofficial-demo notice.

If you upload while logged out, Vercel can create a temporary site with an expiry
countdown. Select **Claim Project** and complete the free-account flow before
expiry to retain it. The claim link controls ownership: keep it private and share
only the public website URL. If it expires, sign in and upload the same ZIP again.

## Alternative: upload the editable source

Download **shanti-sagar-source.zip**, then follow the same upload steps while
signed in. Vercel Drop detects the framework and builds it. Expected settings:

| Setting | Value |
| --- | --- |
| Project root | ZIP root, containing package.json |
| Framework | Vite |
| Install | npm ci |
| Build | npm run build |
| Output | dist |
| Node.js | 24.x |
| Environment variables | None |

The source archive is for editing and rebuilding. The deploy archive is already
built and is the simpler phone upload. Upload only one archive per deployment.

## If something goes wrong

- **Login required on the shared site:** use the production website domain from
  the project's **Domains** section. Check **Settings → Deployment Protection**
  and make sure the intended public demo is accessible; recheck in Incognito.
- **404 homepage:** select index.html. The supplied ZIP puts it at the root.
- **Build error from the deploy ZIP:** it should be treated as static, not Vite;
  it contains no package.json and has no build command. Use the source ZIP if
  you want Vercel to run a Vite build.
- **3D not available:** the intentionally lightweight still life remains usable.
  The WebGL experience is optional and depends on the phone/browser.
- **Call/WhatsApp/order buttons disabled:** expected, until verified destinations
  are configured. This is not a hosting failure.
- **A paid upgrade is suggested:** stay on the free personal Hobby plan; no
  custom domain, add-on or paid upgrade is needed for this demo. Usage limits and
  plan eligibility apply: https://vercel.com/docs/plans/hobby

No permanent public deployment is implied by this guide. Only Vercel's successful
deployment response creates the actual URL. Phone dashboard controls were
checked against current official documentation; the cloud browser runtime could
not start to test the signed-in upload flow directly.
