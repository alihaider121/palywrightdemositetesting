/**
 * Test: Multi-Tab/Window Handling
 * 
 * DEMONSTRATES PLAYWRIGHT ADVANTAGE #1:
 * Multi-tab and multi-window support - something Cypress CANNOT do natively
 * 
 * This is one of the most common pain points for Cypress users.
 * Many modern applications use new tabs/windows (OAuth, payments, help links, etc.)
 * and Cypress cannot handle them.
 * 
 * Playwright handles this elegantly with context.waitForEvent('page')
 * 
 * EQUIVALENT IN CYPRESS:
 * There is NO good equivalent. Common workarounds:
 * 1. Remove target="_blank" before testing (bad practice)
 * 2. Use third-party plugins (unreliable)
 * 3. Skip the feature entirely (poor test coverage)
 */

const { test, expect } = require('@playwright/test');
const InternetPage = require('../pages/InternetPage');

test.describe('Multi-Tab/Window Handling - Playwright Advantage', () => {
  
  let page;
  let internetPage;

  test.beforeEach(async ({ page: testPage }) => {
    // PLAYWRIGHT vs CYPRESS:
    // Playwright injects page object into test (more explicit)
    // Cypress uses global cy object (implicit, harder to extend)
    page = testPage;
    internetPage = new InternetPage(page);
  });

  /**
   * TEST: Open new window and interact with it
   * 
   * CRITICAL PLAYWRIGHT ADVANTAGE:
   * - Cypress CANNOT do this
   * - Playwright handles it natively and elegantly
   * - Real-world use case: OAuth popups, payment gateways, help links
   */
  test('should open new tab and get its title', async () => {
    // Navigate to page with "Click Here" link that opens new window
    await internetPage.navigateToInternet();
    
    // PLAYWRIGHT PATTERN: Wait for new page AND trigger action simultaneously
    // This is crucial - if you click first then wait, the page might not be captured
    // if click then wait: page might be created before waitForEvent listener
    // Solution: Use Promise.all() to set up listener first
    
    const newPagePromise = internetPage.page.context().waitForEvent('page');
    
    // Click the "Click Here" link under "Multiple Windows"
    // First, navigate to multiple windows page
    await internetPage.navigateToInternet();
    const multiWindowLink = page.locator('a', { hasText: 'Multiple Windows' });
    await multiWindowLink.click();
    
    // Now click the "Click Here" link
    const clickHereLink = page.locator('a', { hasText: 'Click Here' });
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      clickHereLink.click()
    ]);

    // NEW PAGE is now available and ready to use
    // CYPRESS CANNOT DO THIS
    
    // Interact with the new page
    const newPageTitle = await newPage.title();
    
    // Verify new page opened correctly
    expect(newPageTitle).toContain('New Window');
    
    // You can interact with the new page just like the original
    const newPageContent = await newPage.content();
    expect(newPageContent).toContain('Opening a new window');
    
    // Close the new page
    await newPage.close();
    
    // Continue testing on original page
    expect(page.url()).toContain('windows');
  });

  /**
   * TEST: Multiple pages in same context (useful for multi-user scenarios)
   * 
   * Real-world example: Testing collaboration features with two users
   * User A logs in, takes an action, User B sees the update
   */
  test('should handle multiple pages in same context', async ({ context }) => {
    // PLAYWRIGHT ADVANTAGE: Context can manage multiple pages
    // This is useful for:
    // - Simulating multiple users
    // - Testing real-time updates
    // - Testing collaboration features
    // CYPRESS: Would need separate browser instances (slow, expensive)
    
    // Create first page
    const page1 = page;
    
    // Create second page in same context (shares cookies/auth if needed)
    const page2 = await context.newPage();
    
    try {
      // Navigate both pages
      await page1.goto('https://www.saucedemo.com/');
      await page2.goto('https://www.saucedemo.com/');
      
      // Both pages share the same context (cookies, storage)
      const url1 = page1.url();
      const url2 = page2.url();
      
      expect(url1).toBe(url2);
      
      // Close the second page
      await page2.close();
    } finally {
      if (!page2.isClosed()) {
        await page2.close();
      }
    }
  });

  /**
   * TEST: Page lifecycle - waiting for page load
   * 
   * Demonstrates how to handle page timing issues
   */
  test('should properly wait for page navigation', async () => {
    // Navigate to page that might do redirects
    const navigationPromise = page.waitForURL(/.*windows/);
    
    // Trigger navigation
    await page.goto('https://the-internet.herokuapp.com/');
    const multiWindowLink = page.locator('a', { hasText: 'Multiple Windows' });
    await multiWindowLink.click();
    
    // Wait for specific URL
    await navigationPromise;
    
    // Verify we're on the right page
    expect(page.url()).toContain('windows');
  });
});
