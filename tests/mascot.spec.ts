import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const mascotIn = (page: Page) => page.getByRole('button', { name: 'Say hello to the mascot' });

async function enter(page: Page, id: string) {
  await page.locator(id).evaluate(element => window.scrollTo({
    top: window.scrollY + element.getBoundingClientRect().top - innerHeight * .22,
    behavior: 'instant',
  }));
}

test('mascot loads the smile, reacts to scroll and settles in food and visit sections', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const mascot = mascotIn(page);
  await expect(mascot).toHaveClass(/mascot--hero/);
  await expect(mascot).toHaveAttribute('data-mascot-status', 'ready');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'idle');
  await page.evaluate(() => window.scrollBy({ top: 55, behavior: 'instant' }));
  await expect(mascot).toHaveAttribute('data-expression', 'curious');

  await enter(page, '#menu');
  await expect(mascot).toHaveAttribute('data-expression', 'surprised');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'surprised');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'happy');
  await expect(mascot).toHaveClass(isMobile ? /mascot--header/ : /mascot--dock/);

  await enter(page, '#location');
  await expect(mascot).toHaveAttribute('data-mascot-pose', 'approval');
  await expect(page.getByRole('link', { name: 'Get directions' })).toBeVisible();
  if (isMobile) {
    const button = (await mascot.boundingBox())!;
    const navigation = (await page.getByRole('button', { name: 'Open navigation' }).boundingBox())!;
    expect(button.x + button.width).toBeLessThanOrEqual(navigation.x);
    expect(button.width).toBeGreaterThanOrEqual(44);
  }
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
