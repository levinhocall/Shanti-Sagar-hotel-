import { expect, test } from '@playwright/test';
import { ARM_LENGTHS, distance, solveArm, viewportToWorld } from '../src/components/puppet/puppet-rig';

test('two-link IK matches reachable fingertips and preserves limb lengths outside reach', () => {
  const shoulder = { x: 35, y: 60 };
  for (const scale of [.63, 1, 1.15]) {
    for (const side of [-1, 1] as const) {
      for (const target of [{ x: 114, y: 103 }, { x: 510, y: 660 }, shoulder]) {
        const arm = solveArm(shoulder, target, side, scale);
        expect(distance(arm.shoulder, arm.elbow)).toBeCloseTo(ARM_LENGTHS.upper * scale, 5);
        expect(distance(arm.elbow, arm.wrist)).toBeCloseTo(ARM_LENGTHS.forearm * scale, 5);
        expect(distance(arm.wrist, arm.tip)).toBeCloseTo(ARM_LENGTHS.finger * scale, 5);
        if (arm.reachable) expect(distance(arm.tip, target)).toBeLessThan(.05);
        else expect(distance(shoulder, arm.tip)).toBeLessThanOrEqual((72 + 64 + 29) * scale);
      }
    }
  }
  expect(viewportToWorld({ x: 0, y: 0 }, { width: 400, height: 800 })).toEqual({ x: -200, y: 400 });
  expect(viewportToWorld({ x: 400, y: 800 }, { width: 400, height: 800 })).toEqual({ x: 200, y: -400 });
});

test('ordinary homepage keeps the mascot and skips the puppet canvas', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', request => requested.push(request.url()));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Say hello to the mascot' })).toBeVisible();
  await expect(page.locator('.puppet-canvas')).toHaveCount(0);
  expect(requested.some(url => /PuppetStage|puppet\/puppet-director/.test(url))).toBe(false);
});

test('reduced motion and denied WebGL retain the smiling fallback and site navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?puppet=rig-test');
  await expect(page.locator('[data-puppet-mode="fallback"]')).toHaveText('Static preview · reduced motion');
  await expect(page.locator('.puppet-canvas')).toHaveCount(0);
  await expect(page.locator('.puppet-fallback img')).toHaveAttribute('src', '/images/mascot/idle.webp');
  await page.getByRole('link', { name: 'Explore Menu' }).click();
  await expect(page).toHaveURL(/#menu$/);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      return args[0] === 'webgl2' ? null : Reflect.apply(original, this, args);
    } as typeof original;
  });
  await page.goto('/?puppet=rig-test');
  await expect(page.locator('[data-puppet-mode="fallback"]')).toHaveText('Static preview · 3D unavailable');
  await expect(page.locator('.puppet-canvas')).toHaveCount(0);
});

test('rig contacts a visible dish, cancels on scroll and preserves the original click', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The calibration render is exercised on Chromium with software WebGL.');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?puppet=rig-test');
  const rig = page.locator('[data-puppet-mode="rig-test"]');
  const canvas = rig.locator('canvas');
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveCSS('pointer-events', 'none');
  await expect(rig).toHaveAttribute('data-phase', 'entrance');
  await expect(rig).toHaveAttribute('data-phase', 'idle', { timeout: 5500 });
  await page.evaluate(() => {
    const card = document.querySelector('[data-puppet-target="dish"]')!;
    scrollTo({ top: scrollY + card.getBoundingClientRect().top - innerHeight * .36, behavior: 'instant' });
  });
  await expect(rig).toHaveAttribute('data-contact-error', /^([0-3]\.[0-9]{2}|4\.00)$/);
  const pulsed = page.locator('[data-puppet-contact="true"]');
  await expect(pulsed).toHaveCount(1);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(rig).toHaveAttribute('data-phase', 'travel');
  await expect(rig).toHaveAttribute('data-direction', 'up');
  await expect(pulsed).toHaveCount(0);
  await expect(rig).toHaveAttribute('data-phase', 'idle', { timeout: 2200 });
  const card = page.getByRole('button', { name: /Idli & sambar/i });
  await card.evaluate(node => scrollTo({ top: scrollY + node.getBoundingClientRect().top - innerHeight * .34, behavior: 'instant' }));
  await card.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(canvas).toBeHidden();
  await page.getByRole('button', { name: 'Back to the table' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(card).toBeFocused();
  expect(errors).toEqual([]);
});

test('keyboard presentation, visit approval and context-loss cleanup stay separate from activation', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The calibration render is exercised on Chromium with software WebGL.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?puppet=rig-test');
  const rig = page.locator('[data-puppet-mode="rig-test"]');
  await expect(rig.locator('canvas')).toBeVisible();
  await rig.evaluate(node => {
    const phases = new Set<string>();
    new MutationObserver(() => {
      const phase = node.getAttribute('data-phase');
      if (phase) phases.add(phase);
      node.setAttribute('data-observed-phases', [...phases].join(' '));
    }).observe(node, { attributes: true, attributeFilter: ['data-phase'] });
  });
  const card = page.getByRole('button', { name: /Idli & sambar/i });
  await card.evaluate(node => scrollTo({ top: scrollY + node.getBoundingClientRect().top - innerHeight * .36, behavior: 'instant' }));
  await expect(rig).toHaveAttribute('data-direction', 'down');
  await expect(rig).toHaveAttribute('data-phase', /^(look|reach|contact|recover|idle)$/);
  await card.focus();
  await expect(card).toBeFocused();
  await expect(rig).toHaveAttribute('data-observed-phases', /\bpresent\b/);
  await expect(page.getByRole('dialog')).toBeHidden();

  const visit = page.getByRole('link', { name: 'Get directions' });
  await visit.evaluate(node => scrollTo({ top: scrollY + node.getBoundingClientRect().top - innerHeight * .44, behavior: 'instant' }));
  await expect(rig).toHaveAttribute('data-observed-phases', /\bapprove\b/);
  await expect(page).toHaveURL(/puppet=rig-test$/);
  await expect(visit).toBeVisible();
  await rig.locator('canvas').dispatchEvent('webglcontextlost');
  await expect(page.locator('[data-puppet-mode="fallback"]')).toHaveText('Static preview · 3D unavailable');
  await expect(page.locator('.puppet-canvas')).toHaveCount(0);
  await expect(page.locator('[data-puppet-contact="true"]')).toHaveCount(0);
});
