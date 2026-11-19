import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('cinematic V4 stays usable from narrow phones to wide desktops', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main')).toHaveAttribute('data-design-version', 'cinematic-v4')
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    const hero = page.getByRole('heading', { level: 1 })
    await expect(hero).toBeVisible()
    const box = await hero.boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(width)
  }
})

test('3D JavaScript is absent from initial loading and WebP imagery resolves', async ({ page }) => {
  const threeRequests: string[] = []
  page.on('request', request => { if (/\/(three-core|three-renderer|ThreeCanvas)-/.test(request.url())) threeRequests.push(request.url()) })
  await page.goto('/')
  const hero = page.getByRole('img', { name: /Illustrative masala dosa/ })
  await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  expect(await hero.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(/\.webp$/)
  await page.getByRole('heading', { name: /A seat at the table/ }).scrollIntoViewIfNeeded()
  expect(threeRequests).toEqual([])
  await expect(page.locator('.scene-host canvas')).toHaveCount(0)
})

test('scroll story completes its reveal and reduced motion shows readable text immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const word = page.locator('.story-line').first().locator('span').first()
  await expect(word).toHaveCSS('opacity', '1')
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.reload()
  await expect(word).toHaveCSS('opacity', '0.7')
  await page.locator('.story-tagline').scrollIntoViewIfNeeded()
  await expect(word).toHaveCSS('opacity', '1')
})

test('no WebGL keeps the photo and controls usable', async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (name: string, ...args: unknown[]) {
      if (name.startsWith('webgl')) return null;
      return Reflect.apply(getContext, this, [name, ...args]);
    } as typeof getContext;
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Explore in 3D' }).click()
  await expect(page.getByRole('status')).toContainText('3D is unavailable')
  await expect(page.locator('.scene-host canvas')).toHaveCount(0)
  await page.getByRole('button', { name: 'Paneer', exact: true }).click()
  const table = page.getByRole('region', { name: 'A seat at the table.' })
  await expect(table.getByRole('img', { name: 'Illustrative photo of paneer curry' })).toBeVisible()
})

test('homepage and sample dish dialog pass axe WCAG A and AA rules', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const scan = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect((await scan()).violations).toEqual([])
  await page.getByRole('button', { name: /Idli & sambar/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect((await scan()).violations).toEqual([])
})

test('mobile navigation supports Escape and all detail controls remain keyboard-accessible', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden()
  const card = page.getByRole('button', { name: /Idli & sambar/i })
  await card.scrollIntoViewIfNeeded()
  await card.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Back to the table' }).press('Shift+Tab')
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(card).toBeFocused()
})

test('the mobile hero exposes its primary action in the first screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 660 })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Explore Menu' })).toBeInViewport({ ratio: 1 })
})
