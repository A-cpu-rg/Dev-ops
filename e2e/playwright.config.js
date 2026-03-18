import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 * The tests expect the frontend to be running at BASE_URL (default: http://localhost:5173)
 * and the backend at http://localhost:5001.
 *
 * In CI the `webServer` blocks start both services automatically.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start both services before the test run when running locally or in CI */
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../server',
      url: 'http://localhost:5001',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      cwd: '../client',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
