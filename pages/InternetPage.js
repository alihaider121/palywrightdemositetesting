/**
 * InternetPage - Page Object for The Internet (herokuapp.com) Demo Site
 * 
 * Used for demonstrating Playwright's advanced features:
 * - Multi-tab/window handling
 * - Iframe interactions
 * - Advanced locator strategies
 * 
 * NOTE: This site is at https://the-internet.herokuapp.com/
 */

const BasePage = require('./BasePage');

class InternetPage extends BasePage {
  constructor(page) {
    super(page);
    // Links in the main menu
    this.iframesLink = 'text=Frames';
    this.multipleWindowsLink = 'text=Multiple Windows';
    this.nestedFramesLink = 'text=Nested Frames';
    
    // For nested frames test
    this.parentFrame = 'frame[name="frame-top"]';
    this.leftFrame = 'frame[name="frame-left"]';
    this.rightFrame = 'frame[name="frame-right"]';
    this.bodyText = 'body';
  }

  /**
   * Navigate to The Internet main page
   */
  async navigateToInternet() {
    await this.goto('https://the-internet.herokuapp.com/');
  }

  /**
   * Navigate to nested frames page
   */
  async navigateToNestedFrames() {
    await this.navigateToInternet();
    const link = this.page.locator('a', { hasText: 'Nested Frames' });
    await link.click();
  }

  /**
   * PLAYWRIGHT ADVANTAGE - Iframe Handling
   * 
   * Playwright has MUCH better iframe support than Cypress.
   * This is one of the major advantages and a key pain point with Cypress.
   * 
   * Get text from nested iframe (left frame in nested frames)
   * 
   * PLAYWRIGHT approach:
   * ```
   * async getLeftFrameText() {
   *   const frameHandle = await this.page.waitForSelector('frame[name="frame-left"]');
   *   const contentFrame = await frameHandle.contentFrame();
   *   const bodyText = await contentFrame.$eval('body', el => el.innerText);
   *   return bodyText;
   * }
   * ```
   * 
   * CYPRESS approach (NIGHTMARE - this is a known limitation):
   * ```
   * getLeftFrameText() {
   *   return cy.get('iframe[name="frame-left"]')
   *     .its('0.contentDocument.body')
   *     .should('not.be.empty')
   *     .then(cy.wrap)
   *     .find('body')
   *     .invoke('text');
   * }
   * ```
   * 
   * PLAYWRIGHT ADVANTAGES:
   * 1. Native contentFrame() method designed for iframes
   * 2. Handles multiple nested iframes elegantly
   * 3. No need to access contentDocument (hacky in Cypress)
   * 4. Better error messages when iframe isn't found
   * 5. Synchronous frame context switching (Cypress is asynchronous and fragile)
   * 
   * This is one of THE BIGGEST pain points that makes Cypress difficult for iframe-heavy apps
   */
  async getLeftFrameText() {
    // Playwright's iframe handling is MUCH cleaner than Cypress
    const frameLocator = this.page.frameLocator('frame[name="frame-left"]');
    return await frameLocator.locator('body').textContent();
  }

  /**
   * Get text from right nested frame
   */
  async getRightFrameText() {
    const frameLocator = this.page.frameLocator('frame[name="frame-right"]');
    return await frameLocator.locator('body').textContent();
  }

  /**
   * Get text from top frame (parent frame in nested frames)
   */
  async getTopFrameText() {
    const frameLocator = this.page.frameLocator('frame[name="frame-top"]');
    return await frameLocator.locator('body').textContent();
  }

  /**
   * PLAYWRIGHT ADVANTAGE - Multi-Window/Tab Handling
   * 
   * This is a CRITICAL advantage over Cypress.
   * Cypress cannot handle multiple tabs/windows - period.
   * Playwright handles this natively and elegantly.
   * 
   * Click "Click Here" link and wait for new tab
   * Returns the new page object
   * 
   * PLAYWRIGHT approach (elegant):
   * ```
   * async clickNewWindowLink() {
   *   const [newPage] = await Promise.all([
   *     this.page.context().waitForEvent('page'),
   *     this.page.click('a[target="_blank"]')
   *   ]);
   *   return newPage;
   * }
   * ```
   * 
   * CYPRESS approach (IMPOSSIBLE - major limitation):
   * ```
   * // Cypress has NO native support for multiple tabs/windows
   * // Workarounds include:
   * // 1. Remove the target="_blank" attribute (hacky)
   * // 2. Use cy-open-link plugin (unreliable)
   * // 3. Restructure your application (not possible in real scenarios)
   * // 
   * // This is a KNOWN LIMITATION that Cypress team has acknowledged
   * // but hasn't solved - it requires fundamental architecture changes
   * ```
   * 
   * PLAYWRIGHT ADVANTAGES:
   * 1. Native multi-tab/window support out of the box
   * 2. Use Promise.all() to wait for new page AND click simultaneously
   * 3. Interact with multiple pages/contexts in same test
   * 4. Works with popups, new tabs, and new windows
   * 5. Can manage separate auth for different pages
   * 
   * REAL-WORLD IMPACT:
   * - Testing payment gateways (Stripe, PayPal pop in new window)
   * - Testing OAuth flows (Google, GitHub auth in popup)
   * - Testing multi-window workflows
   * - Testing applications that open help/documentation in new tab
   * 
   * This single feature makes Playwright invaluable for many modern web apps
   */
  async clickNewWindowLink() {
    // Listen for new page AND click simultaneously
    // This is how you properly handle new windows/tabs in Playwright
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.locator('a[target="_blank"]').first().click()
    ]);
    return newPage;
  }

  /**
   * Get title of new window (for verification)
   * 
   * @param {Page} newPage - The new page object returned from clickNewWindowLink
   */
  async getNewWindowTitle(newPage) {
    return await newPage.title();
  }

  /**
   * Close a page/tab
   * 
   * @param {Page} page - The page to close
   */
  async closePage(page) {
    await page.close();
  }
}

module.exports = InternetPage;
