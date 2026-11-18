import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
const [url, expectedCommit] = process.argv.slice(2)
if (!url || !url.startsWith('https://')) throw new Error('Pass the actual public HTTPS deployment URL')
if (!/^[a-f0-9]{40}$/.test(expectedCommit ?? '')) throw new Error('Pass the full expected git commit SHA')
const marker = await globalThis.fetch(new URL('/release.json', url), { cache: 'no-store' })
assert.equal(marker.status, 200)
assert.deepEqual(await marker.json(), { commit: expectedCommit, design: 'cinematic-v4' })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const results = []
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: mobile ? { width: 393, height: 851 } : { width: 1440, height: 1000 }, isMobile: mobile, hasTouch: mobile, reducedMotion: mobile ? 'reduce' : 'no-preference' })
    const page = await context.newPage(); const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const response = await page.goto(url)
    assert.equal(response.status(), 200)
    await page.getByRole('heading', { level: 1 }).waitFor()
    assert.equal(await page.locator('main').getAttribute('data-design-version'), 'cinematic-v4')
    assert.match(await page.title(), /Shanti Sagar/)
    if (mobile) {
      for (const width of [360, 393, 412]) {
        await page.setViewportSize({ width, height: 851 })
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `Horizontal overflow at ${width}px`)
      }
      await page.getByRole('button', { name: 'Open navigation' }).click()
      await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /Menu/ }).click()
    }
    const menu = page.getByRole('region', { name: 'What are you craving?' })
    await menu.getByRole('button', { name: 'Conveyor view' }).click()
    const conveyor = page.getByRole('region', { name: 'The rolling table' })
    await expect(conveyor.getByRole('button', { name: 'Paneer curry' })).toBeVisible()
    await menu.getByRole('button', { name: 'Grid view' }).click()
    const card = page.getByRole('button', { name: /Paneer curry/i })
    await card.click()
    await page.getByRole('dialog').waitFor({ state: 'visible' })
    assert.match(page.url(), /dish=paneer-curry/)
    await page.getByRole('button', { name: 'Back to the table' }).click()
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    await expect(card).toBeFocused()
    await page.getByRole('button', { name: 'Open gallery: The art of sharing' }).click()
    await page.getByRole('button', { name: 'Next gallery image' }).click()
    assert.match(page.url(), /gallery=dosa/)
    await page.getByRole('button', { name: 'Close gallery' }).click()
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    if (!mobile) {
      await page.getByRole('button', { name: 'Explore in 3D', exact: true }).click()
      await page.locator('.scene-host canvas').waitFor({ state: 'visible', timeout: 20000 })
      await expect.poll(() => page.locator('.scene-host canvas').evaluate(canvas => { const gl = canvas.getContext('webgl2') || canvas.getContext('webgl'); return !!gl?.getParameter(gl.CURRENT_PROGRAM) })).toBe(true)
      await expect(page.locator('.sculpture-stage')).toHaveAttribute('data-render-ready', 'true')
      await page.getByRole('button', { name: 'Return to still life' }).click()
    }
    assert.deepEqual(errors, [])
    results.push({ device: mobile ? 'Android-size Chromium, 360/393/412px' : 'Desktop Chromium + software WebGL', result: 'passed', checks: ['public HTTP 200', 'dish opens', 'on-screen Back closes', 'focus returns', 'gallery advances', mobile ? 'mobile menu and widths' : '3D loads'] })
    await context.close()
  }
  console.log(JSON.stringify({ url, commit: expectedCommit, results }, null, 2))
} finally { await browser.close() }
