import { defineConfig, devices } from '@playwright/test'
const production = process.env.PLAYWRIGHT_PRODUCTION === '1'
const port = production ? 4175 : 5173
const baseURL = `http://127.0.0.1:${port}`
export default defineConfig({
  testDir: './tests', timeout: 30000, fullyParallel: false, workers: 1,
  use: { baseURL, launchOptions: { executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'android', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium', reducedMotion: 'reduce' } },
  ],
  webServer: { command: `npm run ${production ? 'preview' : 'dev'} -- --host 127.0.0.1 --port ${port} --strictPort`, url: baseURL, reuseExistingServer: !production },
})
