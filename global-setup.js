/**
 * Global Setup - Authentication Setup for Entire Test Suite
 * 
 * This file runs ONCE before all tests in the entire suite
 * Use this in playwright.config.js with:
 * globalSetup: require.resolve('./global-setup.js')
 * 
 * PLAYWRIGHT ADVANTAGE:
 * You can set up authentication for all tests in one place
 * All subsequent tests automatically have auth state available
 * No need to log in in individual tests
 * 
 * This is much more efficient than:
 * 1. Logging in before each test
 * 2. Using cy.session() which requires memory-based session
 * 3. Replaying login steps for every test
 * 
 * EXAMPLE USAGE:
 * 1. npx playwright test (uses saved auth state)
 * 2. Each test loads with user already authenticated
 * 3. Tests run 3-5x faster
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const authFile = path.join(__dirname, 'auth', 'auth.json');

async function globalSetup(config) {
  // This runs before all tests
  console.log('🔐 Starting global authentication setup...');
  
  // Create auth directory
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  
  // Check if auth file already exists and is fresh
  // (Optional: could check file age to refresh auth periodically)
  if (fs.existsSync(authFile)) {
    console.log('✅ Auth state already exists, skipping setup');
    return;
  }
  
  // Launch browser for authentication
  const browser = await chromium.launch();
  const context = await browser.createContext();
  const page = await context.newPage();
  
  try {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com/');
    
    // Perform login
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    
    // Wait for products to load (confirmation of successful login)
    await page.waitForSelector('.inventory_container', { timeout: 10000 });
    
    // Save authentication state
    await context.storageState({ path: authFile });
    
    console.log('✅ Authentication setup completed');
    console.log('   Auth state saved to:', authFile);
    
  } catch (error) {
    console.error('❌ Authentication setup failed:', error);
    throw error;
  } finally {
    // Clean up
    await browser.close();
  }
}

module.exports = globalSetup;
