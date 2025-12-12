/**
 * Test: Iframe Handling
 * 
 * DEMONSTRATES PLAYWRIGHT ADVANTAGE #2:
 * Iframe support - Cypress has severe limitations here
 * 
 * PLAYWRIGHT IFRAME ADVANTAGES:
 * 1. Native frameLocator() designed specifically for iframes
 * 2. Works with nested iframes elegantly
 * 3. Automatic contentDocument handling (Cypress requires manual hackery)
 * 4. Better error messages when iframe isn't found
 * 5. Works with dynamic iframes
 * 
 * CYPRESS IFRAME ISSUES:
 * - Very difficult to work with
 * - Requires accessing contentDocument.body (hacky)
 * - Breaks with nested iframes
 * - Requires custom commands to manage
 * - Many developers report this as a major pain point
 * 
 * This is a real pain point for applications using iframes:
 * - Payment processors (Stripe Frames, PayPal)
 * - Rich text editors (TinyMCE, CKEditor)
 * - Embedded content platforms
 * - Legacy applications relying on frames for isolation
 */

const { test, expect } = require('@playwright/test');
const InternetPage = require('../pages/InternetPage');

test.describe('Iframe Handling - Playwright Advantage', () => {
  
  let page;
  let internetPage;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    internetPage = new InternetPage(page);
  });

  /**
   * TEST: Read content from nested iframes
   * 
   * PLAYWRIGHT ADVANTAGE: frameLocator() is elegant and powerful
   * The Nested Frames page has a structure like:
   * - <frame name="frame-top">
   *   - <frame name="frame-left"> contains "LEFT"
   *   - <frame name="frame-right"> contains "RIGHT"
   * - <frame name="frame-bottom"> contains "BOTTOM"
   */
  test('should read text from nested iframes', async () => {
    await internetPage.navigateToNestedFrames();
    
    // PLAYWRIGHT PATTERN: Use frameLocator() to select iframe
    // Then use locator() on the frame to select elements inside
    
    // Get text from left frame
    const leftFrameText = await internetPage.getLeftFrameText();
    expect(leftFrameText).toContain('LEFT');
    
    // Get text from right frame
    const rightFrameText = await internetPage.getRightFrameText();
    expect(rightFrameText).toContain('RIGHT');
    
    // Get text from top frame
    const topFrameText = await internetPage.getTopFrameText();
    expect(topFrameText.toLowerCase()).toContain('top');
  });

  /**
   * TEST: Interact with form inside iframe
   * 
   * Real-world scenario: Payment processor iframe with form inputs
   * (Stripe, PayPal, Square all use iframes for security)
   * 
   * We'll use the "Frames" page which has a simpler single iframe
   */
  test('should interact with iframe content', async () => {
    // Navigate to frames page
    await page.goto('https://the-internet.herokuapp.com/frames');
    
    // Click on "iFrame" link to get to a simple iframe test
    const iframeLink = page.locator('a', { hasText: 'iFrame' });
    await iframeLink.click();
    
    // Now we're on a page with an iframe containing a rich text editor
    
    // PLAYWRIGHT PATTERN: Use frameLocator to select the iframe
    const frameLocator = page.frameLocator('iframe[id="mce_0_ifr"]');
    
    // Select the iframe body
    const iframeBody = frameLocator.locator('body');
    
    // Verify iframe is accessible
    const isVisible = await iframeBody.isVisible();
    expect(isVisible).toBe(true);
    
    // Find the text area and interact with it
    const textArea = frameLocator.locator('#tinymce');
    
    // Verify we can get text from it
    const initialText = await textArea.textContent();
    expect(initialText).toBeDefined();
    
    // PLAYWRIGHT ADVANTAGE vs CYPRESS:
    // This just worked cleanly. In Cypress, you'd need:
    // cy.get('iframe')
    //   .its('0.contentDocument.body')
    //   .should('not.be.empty')
    //   .then(cy.wrap)
    //   .find('#tinymce')
    // Much more fragile and harder to understand
  });

  /**
   * TEST: Multiple iframes on same page
   * 
   * Demonstrates Playwright's strength with complex iframe scenarios
   */
  test('should handle multiple iframes independently', async () => {
    await internetPage.navigateToNestedFrames();
    
    // Get content from all frames at once
    const [leftText, rightText, topText] = await Promise.all([
      internetPage.getLeftFrameText(),
      internetPage.getRightFrameText(),
      internetPage.getTopFrameText()
    ]);
    
    // All should be accessible without errors
    expect(leftText).toBeTruthy();
    expect(rightText).toBeTruthy();
    expect(topText).toBeTruthy();
    
    // PLAYWRIGHT ADVANTAGE: Promise.all() works perfectly with frameLocators
    // This demonstrates how Playwright's async/await pattern
    // is better for complex scenarios than Cypress's chaining
    
    // In Cypress, coordinating multiple async iframe operations would be:
    // - Difficult to read
    // - Prone to race conditions
    // - Require nested .then() callbacks (callback hell)
    // 
    // Playwright's async/await makes this crystal clear and safe
  });

  /**
   * TEST: Navigate within iframe
   * 
   * More advanced: If iframe content changes or navigates
   */
  test('should wait for iframe to load', async () => {
    await page.goto('https://the-internet.herokuapp.com/frames');
    
    // Click on iFrame link
    const iframeLink = page.locator('a', { hasText: 'iFrame' });
    await iframeLink.click();
    
    // PLAYWRIGHT PATTERN: Wait for iframe selector explicitly
    // This is more reliable than assuming it loads immediately
    await page.waitForSelector('iframe[id="mce_0_ifr"]');
    
    // Now interact with it
    const frameLocator = page.frameLocator('iframe[id="mce_0_ifr"]');
    const body = frameLocator.locator('body');
    
    // Verify loaded
    await expect(body).toBeVisible();
    
    // PLAYWRIGHT ADVANTAGE: Explicit wait for iframe
    // Cypress doesn't have a good way to wait for iframes
    // You have to rely on general cy.get() with timeout
    // and hope it works
  });

  /**
   * IMPORTANT NOTE: Why iframe handling is critical
   * 
   * Modern web applications rely heavily on iframes for:
   * 
   * 1. PAYMENT PROCESSING (85% of e-commerce sites)
   *    - Stripe Elements use iframes
   *    - PayPal iframe
   *    - Square iframe
   *    - This is CRITICAL for testing checkout flows
   * 
   * 2. RICH TEXT EDITORS (many SaaS apps)
   *    - TinyMCE uses iframes
   *    - CKEditor uses iframes
   *    - Many content management systems
   * 
   * 3. THIRD-PARTY WIDGETS
   *    - Chat widgets (Intercom, Drift)
   *    - Analytics (Google Analytics has iframes)
   *    - Ads and tracking
   * 
   * 4. SECURITY ISOLATION
   *    - Many companies use iframes to sandbox untrusted content
   *    - Progressive Web Apps with multiple isolated contexts
   * 
   * If you can't test iframes, you can't test a huge portion
   * of modern web applications. This is why Playwright's
   * strong iframe support is such a significant advantage.
   */
});
