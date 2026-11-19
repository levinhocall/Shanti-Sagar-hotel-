import { expect, test } from '@playwright/test';

test('the editorial host notices a dish after scrolling, reacts, and clears when the visitor moves away', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const host = page.getByRole('complementary', { name: 'Illustrated host' });
  const mascot = host.getByRole('button', { name: 'Say hello to the mascot' });
  await host.scrollIntoViewIfNeeded();
  await expect(mascot).toHaveAttribute('data-mascot-status', 'ready');
  await expect(page.locator('.site-masthead .mascot')).toHaveCount(0);
  await mascot.press('Enter');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'happy');

  await page.getByRole('button', { name: 'North Indian', exact: true }).click();
  await expect(page.locator('.dish')).toHaveCount(1);
  await page.mouse.move(1, 1);
  const dish = page.getByRole('button', { name: /Paneer curry/ });
  // Start a new viewport visit even if the card was briefly visible during filtering.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(dish).not.toBeInViewport();
  await expect(host).toHaveAttribute('data-host-phase', 'idle');
  await host.evaluate(element => {
    const watcher = new MutationObserver(() => {
      if (element.getAttribute('data-host-phase') !== 'notice') return;
      element.setAttribute('data-test-noticed', 'true');
      watcher.disconnect();
    });
    watcher.observe(element, { attributes: true, attributeFilter: ['data-host-phase'] });
  });
  await dish.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(dish).toBeInViewport({ ratio: .85 });
  await expect(host).toHaveAttribute('data-test-noticed', 'true');
  await expect(dish).toHaveAttribute('data-host-highlight', 'true');
  await expect(dish.locator('img[src$="approval.webp"]')).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(dish).toHaveAttribute('data-host-highlight', 'false');
  await expect(host).toHaveAttribute('data-host-phase', 'idle');
  await dish.click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Paneer curry' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dish).toBeFocused();
  expect(errors).toEqual([]);
});

test('reduced motion keeps the character still and dish opening works on touch or keyboard', async ({ page, isMobile }) => {
  const requested: string[] = [];
  page.on('request', request => {
    if (request.url().includes('/images/mascot/')) requested.push(new URL(request.url()).pathname);
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#menu');
  const host = page.getByRole('complementary', { name: 'Illustrated host' });
  const mascot = host.getByRole('button', { name: 'Say hello to the mascot' });
  await host.scrollIntoViewIfNeeded();
  await expect(mascot).toHaveAttribute('data-mascot-status', 'ready');
  await expect(mascot).toHaveAttribute('data-animated', 'false');
  await expect(mascot.locator('.mascot-breath')).toHaveCSS('animation-name', 'none');
  expect([...new Set(requested)]).toEqual(['/images/mascot/idle.webp']);

  const dish = page.getByRole('button', { name: /Idli & sambar/ });
  if (isMobile) await dish.tap();
  else await dish.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(host).toHaveAttribute('data-host-phase', 'idle');
});

test('missing mascot artwork leaves the fallback and dish controls usable', async ({ page }) => {
  await page.route(url => url.pathname.startsWith('/images/mascot/'), route => route.abort());
  await page.goto('/#menu');
  const mascot = page.getByRole('button', { name: 'Say hello to the mascot' });
  await mascot.scrollIntoViewIfNeeded();
  await expect(mascot).toHaveAttribute('data-mascot-status', 'failed');
  await expect(mascot.locator('.mascot-fallback')).toBeVisible();
  await page.getByRole('button', { name: /Idli & sambar/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('the legacy public puppet link shows the character without a rig overlay', async ({ page, baseURL }) => {
  const origin = 'http://shanti-public.test';
  await page.route(`${origin}/**`, async route => {
    const url = new URL(route.request().url());
    await route.fulfill({ response: await route.fetch({ url: new URL(url.pathname + url.search, baseURL).href }) });
  });
  await page.goto(`${origin}/?puppet=rig-test`);
  const mascot = page.getByRole('complementary', { name: 'Illustrated host' }).getByRole('button', { name: 'Say hello to the mascot' });
  await mascot.scrollIntoViewIfNeeded();
  await expect(mascot).toHaveAttribute('data-mascot-status', 'ready');
  await expect(page.locator('.puppet-calibration, .puppet-canvas')).toHaveCount(0);
});
