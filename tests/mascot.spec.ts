import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const mascotIn = (page: Page) => page.getByRole('button', { name: 'Say hello to the mascot' });

async function enter(page: Page, id: string) {
  await page.locator(id).evaluate(element => window.scrollTo({
    top: window.scrollY + element.getBoundingClientRect().top - innerHeight * .22,
    behavior: 'instant',
  }));
}

test('mascot stays centered at the top and switches visible expressions', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const mascot = mascotIn(page);
  await expect(page.locator('.masthead-mascot').getByRole('button', { name: 'Say hello to the mascot' })).toBeVisible();
  await expect(mascot).toHaveAttribute('data-mascot-status', 'ready');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'idle');
  await page.evaluate(() => window.scrollBy({ top: 55, behavior: 'instant' }));
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'curious');

  await enter(page, '#menu');
  await expect(mascot).toHaveAttribute('data-expression', 'surprised');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'surprised');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'happy');
  await expect(mascot.locator('img[src$="happy.webp"]')).toBeVisible();

  await enter(page, '#location');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'approval');
  await expect(page.getByRole('link', { name: 'Get directions' })).toBeVisible();
  await expect(mascot.locator('img[src$="approval.webp"]')).toBeVisible();
  const button = (await mascot.boundingBox())!;
  const navigation = (await page.locator('.site-header').boundingBox())!;
  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(Math.abs(button.x + button.width / 2 - viewportWidth / 2)).toBeLessThan(4);
  expect(button.y).toBeLessThan(18);
  expect(button.y + button.height).toBeLessThanOrEqual(navigation.y + 1);
  expect(button.width).toBeGreaterThanOrEqual(44);
  expect(errors).toEqual([]);
});

test('reduced motion keeps reaction art static and activation returns to idle', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', request => {
    if (request.url().includes('/images/mascot/')) requested.push(new URL(request.url()).pathname);
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const mascot = mascotIn(page);
  await expect(mascot).toHaveAttribute('data-mascot-status', 'ready');
  await expect(mascot).toHaveAttribute('data-animated', 'false');
  await expect(mascot.locator('.mascot-breath')).toHaveCSS('animation-name', 'none');
  expect([...new Set(requested)]).toEqual(['/images/mascot/idle.webp']);

  await mascot.press('Enter');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'happy');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'idle');
  expect(requested.some(path => path.endsWith('/blink.webp'))).toBe(false);
  await expect(page.getByRole('link', { name: 'Explore Menu' })).toBeVisible();
});

test('missing mascot artwork leaves navigation and the fallback usable', async ({ page }) => {
  await page.route(url => url.pathname.startsWith('/images/mascot/'), route => route.abort());
  await page.goto('/');
  const mascot = mascotIn(page);
  await expect(mascot).toHaveAttribute('data-mascot-status', 'failed');
  await expect(mascot.locator('.mascot-fallback')).toBeVisible();
  await page.getByRole('link', { name: 'Explore Menu', exact: true }).click();
  await expect(page).toHaveURL(/#menu$/);
  await expect(page.getByRole('heading', { name: 'What are you craving?' })).toBeVisible();
});

test('the legacy public puppet link shows the character without a rig overlay', async ({ page, baseURL }) => {
  const origin = 'http://shanti-public.test';
  await page.route(`${origin}/**`, async route => {
    const url = new URL(route.request().url());
    await route.fulfill({ response: await route.fetch({ url: new URL(url.pathname + url.search, baseURL).href }) });
  });
  await page.goto(`${origin}/?puppet=rig-test`);
  await expect(page.locator('.masthead-mascot').getByRole('button', { name: 'Say hello to the mascot' })).toBeVisible();
  await expect(page.locator('.puppet-calibration, .puppet-canvas')).toHaveCount(0);
  await expect(mascotIn(page)).toHaveAttribute('data-mascot-status', 'ready');
});
