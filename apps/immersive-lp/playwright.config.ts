import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.ts', timeout: 45_000,
  expect: { timeout: 10_000 }, fullyParallel: true, workers: 2, retries: 0,
  reporter: [['list'], ['json', { outputFile:'evidence/playwright-results.json' }]],
  use: { baseURL:'http://127.0.0.1:4177', reducedMotion:'reduce', launchOptions:{ executablePath }, trace:'retain-on-failure', screenshot:'only-on-failure' },
  projects: [
    { name:'desktop', use:{ ...devices['Desktop Chrome'], viewport:{width:1440,height:1000}, reducedMotion:'reduce' } },
    { name:'mobile', use:{ ...devices['iPhone 13'], defaultBrowserType:'chromium', reducedMotion:'reduce' } },
  ],
  webServer: { command:'node scripts/serve.mjs', port:4177, reuseExistingServer:!process.env.CI, timeout:30_000 },
});
