// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 * 
 * PLAYWRIGHT vs CYPRESS:
 * - Playwright supports multiple browser engines natively (Chromium, Firefox, WebKit)
 *   whereas Cypress is limited to Chrome-based browsers and Firefox (and Edge, but no WebKit)
 * - Playwright config is JavaScript-based (more flexible) vs Cypress using JSON/JS hybrid
 * - Playwright allows parallel execution across browsers by default
 * - Playwright supports true headless mode efficiently across all browsers
 */
module.exports = defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.saucedemo.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers
   * 
   * PLAYWRIGHT ADVANTAGE: Native support for WebKit (Safari engine) alongside Chromium and Firefox
   * This is a major advantage over Cypress, which has no WebKit support and limited Safari testing
   * capabilities. In Cypress, you'd need to use separate tools or platforms for Safari testing.
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports.
     * 
     * PLAYWRIGHT ADVANTAGE: Excellent mobile testing with device emulation
     * Cypress has limited mobile support; Playwright provides native device configuration
     */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Run your local dev server before starting the tests
   * 
   * PLAYWRIGHT ADVANTAGE: webServer configuration allows automatic server startup
   * Cypress requires manual server management or additional plugins
   */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
