/**
 * BasePage - Base Page Object Model Class
 * 
 * PLAYWRIGHT vs CYPRESS:
 * - Playwright uses class-based POM with explicit methods for each interaction
 * - Cypress uses custom commands (cy.login(), cy.fillForm(), etc.) via command files
 * - Playwright's method-based approach is more OOP and scalable for large test suites
 * - In Cypress, you'd define commands in cypress/support/commands.js
 * - Playwright's await/async pattern makes async operations more explicit than Cypress chaining
 * 
 * This BasePage provides common utilities that all page objects can inherit
 */

class BasePage {
  constructor(page) {
    /**
     * PLAYWRIGHT DIFFERENCE: 
     * Page object is injected into the class constructor
     * Cypress uses global cy object available everywhere (implicit dependency)
     * This makes Playwright more testable and allows passing different page contexts
     */
    this.page = page;
  }

  /**
   * Navigate to a URL
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: page.goto() with explicit await
   * - Cypress: cy.visit() with automatic chaining
   * - Playwright allows returning navigation promise for better control
   */
  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Click an element
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: locator-based with single step (no implicit wait strategy)
   * - Cypress: cy.get().click() with built-in retry logic
   * - Playwright requires explicit wait configurations when needed
   * - Playwright's approach is faster when elements are ready (no unnecessary waits)
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Fill text input
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: clear + type in one method or use fill()
   * - Cypress: cy.get().clear().type() with implicit waits between
   * - Playwright fill() is more atomic and faster
   */
  async fillText(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Get text content from an element
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: async method that returns text directly
   * - Cypress: cy.get().then() with callback pattern
   * - Playwright's async/await is more readable for modern JS developers
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Wait for element to be visible
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: explicit waitForSelector() or waitForVisible()
   * - Cypress: implicit waiting in cy.get() with configurable timeout
   * - Playwright requires explicit waits; Cypress does it implicitly (can hide issues)
   * - Playwright's explicit waits are more predictable in slow environments
   */
  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Check if element is visible
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: use isVisible() method
   * - Cypress: cy.get().should('be.visible') assertion-based
   * - Playwright's method returns boolean; Cypress uses assertion chain
   */
  async isElementVisible(selector) {
    return await this.page.isVisible(selector);
  }

  /**
   * Press keyboard key
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: page.press() for single key, page.keyboard for complex sequences
   * - Cypress: cy.get().type('{enter}') with special syntax in curly braces
   * - Playwright is more explicit about keyboard interactions
   */
  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  /**
   * Get current URL
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: page.url property (synchronous)
   * - Cypress: cy.url() command (async, chainable)
   * - Playwright's property access is more direct
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Execute JavaScript in page context
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: page.evaluate() with explicit code/function and args
   * - Cypress: cy.window().then() or cy.document()
   * - Playwright is more powerful for complex DOM manipulations
   */
  async executeScript(script, args = null) {
    return await this.page.evaluate(script, args);
  }

  /**
   * PLAYWRIGHT ADVANTAGE - Storage State Management
   * Playwright has native support for saving/loading authentication state
   * This is similar to cy.session() in Cypress but built-in and more powerful
   * 
   * Save the current page state (localStorage, sessionStorage, cookies)
   * Useful for reusing authentication across test runs
   */
  async saveStorageState(filepath) {
    await this.page.context().storageState({ path: filepath });
  }

  /**
   * Handle file uploads
   * 
   * PLAYWRIGHT vs CYPRESS:
   * - Playwright: setInputFiles() for file inputs
   * - Cypress: cy.get('input[type=file]').selectFile()
   * - Both work similarly, but Playwright requires absolute path in some cases
   */
  async uploadFile(selector, filepath) {
    await this.page.setInputFiles(selector, filepath);
  }
}

module.exports = BasePage;
