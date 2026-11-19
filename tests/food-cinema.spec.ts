import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function mobileSwipe(page: Page, distance: number, point?: { x: number; y: number }) {
  const session = await page.context().newCDPSession(page)
  try {
    const x = Math.round(point?.x ?? await page.evaluate(() => innerWidth / 2))
    const start = Math.round(point?.y ?? (distance > 0 ? 680 : 330))
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: start }] })
    for (let step = 1; step <= 8; step++) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove', touchPoints: [{ x, y: start - distance * step / 8 }],
      })
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  } finally { await session.detach() }
}

test('the art of the plate scrolls through in both directions without pinning or GPU assets', async ({ page, isMobile, browserName }) => {
  const frames: string[] = []
  page.on('request', request => { if (request.url().includes('/paneer-frames/')) frames.push(request.url()) })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/#food-stories')
  const scene = page.getByRole('region', { name: 'The art of the plate.' })
  await expect(scene.locator('canvas')).toHaveCount(0)
  await expect(scene.locator('.food-study-photo')).not.toHaveCSS('position', 'sticky')
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')
  const position = () => scene.evaluate(element => element.getBoundingClientRect().top)
  const scroll = (distance: number) => {
    if (isMobile && browserName === 'chromium') return mobileSwipe(page, distance)
    // Playwright's mobile WebKit backend exposes neither wheel nor continuous touch input.
    if (isMobile && browserName === 'webkit') {
      return page.evaluate(top => window.scrollBy({ top, behavior: 'instant' }), distance)
    }
    return page.mouse.wheel(0, distance)
  }
  const before = await position()
  await scroll(320)
  await expect.poll(position).toBeLessThan(before - 150)
  expect(await page.evaluate(() => document.querySelectorAll('dialog[open]').length)).toBe(0)
  const down = await position()
  await scroll(-285)
  await expect.poll(position).toBeGreaterThan(down + 100)
  await expect(scene.getByRole('link', { name: 'Explore dishes' })).toBeVisible()
  expect(frames).toEqual([])
})

test('vertical touch gestures on the 3D table continue scrolling the page', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || !isMobile, 'Uses Chromium touch input on the Pixel 7 profile.')
  await page.goto('/#experience')
  await page.getByRole('button', { name: 'Explore in 3D' }).click()
  const stage = page.locator('.sculpture-stage')
  await expect(stage).toHaveAttribute('data-render-ready', 'true', { timeout: 15_000 })
  await stage.evaluate(element => {
    window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - 150, behavior: 'instant' })
  })
  const box = (await stage.boundingBox())!
  const position = () => page.evaluate(() => window.scrollY)
  const start = await position()
  await mobileSwipe(page, 230, { x: box.x + box.width / 2, y: box.y + box.height * .83 })
  await expect.poll(position).toBeGreaterThan(start + 70)
  await expect(page.locator('dialog[open]')).toHaveCount(0)
})

test('story and chapter controls work with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#food-stories')
  const scene = page.getByRole('region', { name: 'The art of the plate.' })
  await scene.getByRole('button', { name: 'Grand Thali' }).click()
  await expect(scene.locator('.food-cinema-line')).toHaveText('A Feast of Colours.')
  await scene.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(scene.locator('.food-cinema-line')).toHaveText('Many Flavours. One Beautiful Experience.')
  await scene.getByRole('button', { name: 'Previous', exact: true }).click()
  await expect(scene.locator('.food-cinema-line')).toHaveText('A Feast of Colours.')
  await expect(scene.locator('canvas')).toHaveCount(0)
})

test('a missing feature photograph leaves the chapter and menu link usable', async ({ page }) => {
  await page.route('**/paneer-*.webp', route => route.abort())
  await page.goto('/#food-stories')
  const scene = page.getByRole('region', { name: 'The art of the plate.' })
  await expect(scene.getByRole('img')).toContainText('Image unavailable')
  await scene.getByRole('link', { name: 'Explore dishes' }).click()
  await expect(page).toHaveURL(/#menu$/)
})
