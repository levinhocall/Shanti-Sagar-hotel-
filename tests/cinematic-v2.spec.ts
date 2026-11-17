import { expect, test } from '@playwright/test'

test('cinematic V2 stays usable from narrow phones to wide desktops', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main')).toHaveAttribute('data-design-version', 'cinematic-v2')
  for (const width of [320, 360, 393, 768, 1024, 1440]) {
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
  page.on('request', request => { if (/\/(three-renderer|three-controls|table-sculpture)-/.test(request.url())) threeRequests.push(request.url()) })
  await page.goto('/')
  const hero = page.getByRole('img', { name: /Illustrative vegetarian thali/ })
  await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  expect(await hero.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(/\.webp$/)
  await page.getByRole('heading', { name: /A little theatre/ }).scrollIntoViewIfNeeded()
  expect(threeRequests).toEqual([])
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('scroll story responds to scrolling and respects reduced motion', async ({ page }, info) => {
  await page.goto('/')
  await page.locator('.scroll-story').scrollIntoViewIfNeeded()
  const photo = page.locator('.storyline-photo')
  await expect(photo).toBeVisible()
  const before = await photo.evaluate(element => getComputedStyle(element).transform)
  await page.mouse.wheel(0, 320)
  if (info.project.name === 'android') {
    await expect(photo).toHaveCSS('transform', before)
    await expect(page.locator('.ambient-pointer')).toHaveCount(0)
  } else {
    await expect.poll(() => photo.evaluate(element => getComputedStyle(element).transform)).not.toBe(before)
  }
})

test('mobile navigation supports Escape and all detail controls remain keyboard-accessible', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden()
  const card = page.getByRole('button', { name: 'Explore Idli & sambar, sample dish' })
  await card.scrollIntoViewIfNeeded()
  await card.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Back to the table' }).press('Shift+Tab')
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(card).toBeFocused()
})
