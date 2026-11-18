import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('conveyor supports keyboard selection, immersive details, Back, and menu filters', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#menu')
  await page.getByRole('button', { name: 'Conveyor view' }).click()
  const conveyor = page.getByRole('region', { name: 'The rolling table' })
  await expect(conveyor).toBeVisible()
  await expect(conveyor.getByRole('button', { name: 'Pause belt' })).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth === innerWidth)).toBe(true)

  const first = conveyor.getByRole('button', { name: 'Idli & sambar', exact: true })
  const second = conveyor.getByRole('button', { name: 'Masala dosa', exact: true })
  await first.press('ArrowRight')
  await expect(second).toBeFocused()
  await expect(second).toHaveAttribute('data-active', 'true')
  await second.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page).toHaveURL(/dish=masala-dosa/)
  await page.getByRole('button', { name: 'Back to the table' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(second).toBeFocused()
  await second.press('Enter')
  await page.goBack()
  await expect(second).toBeFocused()

  await page.getByRole('button', { name: 'North Indian', exact: true }).click()
  await expect(conveyor.getByRole('button')).toHaveCount(1)
  await expect(conveyor.getByRole('button', { name: 'Paneer curry' })).toBeVisible()
  const scan = await new AxeBuilder({ page }).include('.conveyor-menu').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(scan.violations).toEqual([])
  await page.getByRole('button', { name: 'Grid view' }).click()
  await expect(conveyor).toHaveCount(0)
  await expect(page.locator('.dish')).toHaveCount(1)
})

test('horizontal drag selects a plate without opening it', async ({ page, isMobile, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#menu')
  await page.getByRole('button', { name: 'Conveyor view' }).click()
  const stage = page.locator('.conveyor-stage')
  await expect(stage).toBeVisible()
  await stage.scrollIntoViewIfNeeded()
  const box = (await stage.boundingBox())!
  const start = { x: box.x + box.width * 0.75, y: box.y + box.height * 0.5 }
  const endX = start.x - box.width * 0.4
  if (isMobile && browserName === 'chromium') {
    const session = await page.context().newCDPSession(page)
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] })
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: endX, y: start.y }] })
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await session.detach()
  } else {
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(endX, start.y, { steps: 8 })
    await page.mouse.up()
  }
  await expect(stage.getByRole('button', { name: 'Masala dosa' })).toHaveAttribute('data-active', 'true')
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('the belt moves when playing and stays still when paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/#menu')
  await page.getByRole('button', { name: 'Conveyor view' }).click()
  const region = page.getByRole('region', { name: 'The rolling table' })
  const stage = region.locator('.conveyor-stage')
  await stage.scrollIntoViewIfNeeded()
  const seams = stage.locator('.conveyor-track-seams')
  const firstFrame = await seams.getAttribute('d')
  await expect(seams).not.toHaveAttribute('d', firstFrame!)
  await region.getByRole('button', { name: 'Pause belt' }).click()
  const play = region.getByRole('button', { name: 'Play belt' })
  await expect(play).toBeVisible()
  const pausedFrame = await seams.getAttribute('d')
  await expect.poll(async () => {
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    return seams.getAttribute('d')
  }).toBe(pausedFrame)
  await play.click()
  await expect(seams).not.toHaveAttribute('d', pausedFrame!)
})
