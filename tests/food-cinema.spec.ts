import { expect, test } from '@playwright/test'

test('story chapters respond to native scrolling and load only nearby frames', async ({ page }) => {
  const frames = new Set<string>()
  page.on('request', request => {
    if (request.url().includes('/paneer-frames/')) frames.add(request.url())
  })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const hero = page.getByRole('img', { name: /Illustrative paneer curry/ })
  await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  expect(frames.size).toBe(0)
  const scene = page.getByRole('region', { name: 'The art of the plate.' })
  const track = scene.locator('.food-cinema-track')
  await track.evaluate(element => window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top - 88, behavior: 'instant' }))
  await expect(scene.locator('canvas')).toHaveAttribute('data-showing-frame', 'true')
  expect(frames.size).toBeLessThan(7)
  await track.evaluate(element => {
    const top = window.scrollY + element.getBoundingClientRect().top
    window.scrollTo({ top: top + (element.clientHeight - innerHeight) * .65, behavior: 'instant' })
  })
  await expect(scene.locator('.food-cinema-line').last()).toHaveText('Every Detail, Beautifully Presented.')
  await scene.getByRole('button', { name: 'Golden Dosa' }).click()
  await expect(scene.getByRole('img', { name: /golden masala dosa/ })).toBeVisible()
  await expect(scene.locator('canvas')).toHaveCount(0)
})

test('reduced motion exposes manual chapters without requesting frames', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const frames: string[] = []
  page.on('request', request => { if (request.url().includes('/paneer-frames/')) frames.push(request.url()) })
  await page.goto('/#food-stories')
  const scene = page.getByRole('region', { name: 'The art of the plate.' })
  await scene.getByRole('button', { name: 'Grand Thali' }).click()
  await expect(scene.locator('.food-cinema-line')).toHaveText('A Feast of Colours.')
  await scene.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(scene.locator('.food-cinema-line')).toHaveText('Many Flavours. One Beautiful Experience.')
  await scene.getByRole('button', { name: 'Previous', exact: true }).click()
  await expect(scene.locator('.food-cinema-line')).toHaveText('A Feast of Colours.')
  await expect(scene.locator('canvas')).toHaveCount(0)
  expect(frames).toEqual([])
})

test('missing sequence frames leave the poster and controls available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  let requested = 0
  await page.route(url => url.pathname.includes('/paneer-frames/'), route => { requested++; return route.abort() })
  await page.goto('/')
  const scene = page.getByRole('region', { name: 'The art of the plate.' })
  await scene.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }))
  await expect.poll(() => requested).toBeGreaterThan(0)
  await expect(scene.locator('canvas')).toHaveAttribute('data-showing-frame', 'false')
  await expect.poll(() => scene.getByRole('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await scene.getByRole('link', { name: 'Skip to menu' }).click()
  await expect(page).toHaveURL(/#menu$/)
})
