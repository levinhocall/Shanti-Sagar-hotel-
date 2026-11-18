import { defineConfig, devices } from '@playwright/test';

const production = process.env.PLAYWRIGHT_PRODUCTION === '1';
const port = production ? 4175 : 5173;
const baseURL = `http://127.0.0.1:${port}`;
const chromiumOptions = {
  executablePath: process.env.CHROMIUM_PATH,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
};

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  workers: 1,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 }, launchOptions: chromiumOptions } },
    { name: 'android', use: { ...devices['Pixel 7'], reducedMotion: 'reduce', launchOptions: chromiumOptions } },
    ...(process.env.PLAYWRIGHT_WEBKIT === '1' ? [{ name: 'iphone-webkit', use: { ...devices['iPhone 13'], defaultBrowserType: 'webkit' as const } }] : []),
  ],
  webServer: {
    command: `npm run ${production ? 'preview' : 'dev'} -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !production,
  },
});
