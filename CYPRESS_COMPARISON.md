# Playwright vs Cypress - Quick Comparison Guide

## Side-by-Side Code Comparison

### Navigation

```javascript
// PLAYWRIGHT
await page.goto('https://example.com');

// CYPRESS
cy.visit('https://example.com');
```

---

### Finding Elements

```javascript
// PLAYWRIGHT - Locators (preferred)
const button = page.locator('button');
const input = page.locator('[data-test="username"]');
const filtered = page.locator('.item').filter({ hasText: 'Premium' });

// CYPRESS - Selectors
cy.get('button');
cy.get('[data-test="username"]');
cy.get('.item').contains('Premium');
```

**Playwright advantages:**
- More powerful filtering options
- Locators are lazy (don't execute immediately)
- Better composability
- Clearer intent with filter() and locator()

---

### Clicking Elements

```javascript
// PLAYWRIGHT
await page.click('[data-test="button"]');
// OR (more modern)
await page.locator('[data-test="button"]').click();

// CYPRESS
cy.get('[data-test="button"]').click();
```

---

### Typing Text

```javascript
// PLAYWRIGHT
await page.fill('[data-test="username"]', 'john@example.com');
// OR with locator
await page.locator('[data-test="username"]').fill('john@example.com');

// CYPRESS
cy.get('[data-test="username"]').type('john@example.com');
```

**Note:** Playwright's `fill()` auto-clears, Cypress requires separate `clear()` sometimes

---

### Reading Text

```javascript
// PLAYWRIGHT
const text = await page.locator('h1').textContent();

// CYPRESS
cy.get('h1').invoke('text').then(text => {
  // use text here
});
```

---

### Waiting for Elements

```javascript
// PLAYWRIGHT
await page.waitForSelector('.loading', { timeout: 5000 });
// OR
await page.locator('.result').waitFor();

// CYPRESS
cy.get('.loading', { timeout: 5000 });
// Cypress waits implicitly
```

---

### Assertions

```javascript
// PLAYWRIGHT
import { expect } from '@playwright/test';

expect(await page.locator('h1').textContent()).toBe('Welcome');
// OR (recommended for better retry logic)
await expect(page.locator('h1')).toContainText('Welcome');

// CYPRESS
cy.get('h1').should('contain', 'Welcome');
```

---

### Multiple Elements

```javascript
// PLAYWRIGHT
const items = page.locator('.item');
const count = await items.count();
const texts = await items.evaluateAll(elements => 
  elements.map(e => e.textContent)
);

// CYPRESS
cy.get('.item').then($items => {
  const count = $items.length;
  // do something
});
```

---

### Form Interactions

```javascript
// PLAYWRIGHT
// Fill form and submit
await page.locator('[name="username"]').fill('user');
await page.locator('[name="password"]').fill('pass');
await page.locator('button[type="submit"]').click();

// CYPRESS
cy.get('[name="username"]').type('user');
cy.get('[name="password"]').type('pass');
cy.get('button[type="submit"]').click();
```

---

### Select Dropdown

```javascript
// PLAYWRIGHT
await page.selectOption('[name="country"]', 'USA');

// CYPRESS
cy.get('[name="country"]').select('USA');
```

---

### Upload File

```javascript
// PLAYWRIGHT
await page.setInputFiles('[type="file"]', '/path/to/file.txt');

// CYPRESS
cy.get('[type="file"]').selectFile('/path/to/file.txt');
```

---

### Execute JavaScript

```javascript
// PLAYWRIGHT
const result = await page.evaluate(() => {
  return document.title;
});

// CYPRESS
cy.window().then(win => {
  return win.document.title;
});
```

---

### Get Current URL

```javascript
// PLAYWRIGHT
const url = page.url();

// CYPRESS
cy.url().then(url => {
  // use url
});
```

---

### Wait for Navigation

```javascript
// PLAYWRIGHT
await Promise.all([
  page.waitForURL(/.*search/),
  page.click('a[href="/search"]')
]);

// CYPRESS
cy.get('a[href="/search"]').click();
cy.url().should('include', '/search');
```

---

### Multi-Tab/Window

```javascript
// PLAYWRIGHT ✅ WORKS
const [newPage] = await Promise.all([
  page.context().waitForEvent('page'),
  page.click('a[target="_blank"]')
]);
const title = await newPage.title();

// CYPRESS ❌ DOESN'T WORK
// No native support
// Workarounds: remove target="_blank", use plugins (unreliable)
```

---

### Iframes

```javascript
// PLAYWRIGHT ✅ ELEGANT
const frameLocator = page.frameLocator('iframe[id="content"]');
const text = await frameLocator.locator('body').textContent();

// CYPRESS ⚠️ DIFFICULT
cy.get('iframe')
  .its('0.contentDocument.body')
  .should('not.be.empty')
  .then(cy.wrap)
  .find('body')
  .invoke('text');
```

---

### Hover Over Element

```javascript
// PLAYWRIGHT
await page.hover('[data-test="menu"]');

// CYPRESS
cy.get('[data-test="menu"]').trigger('mouseover');
```

---

### Right-Click Context Menu

```javascript
// PLAYWRIGHT
await page.click('[data-test="item"]', { button: 'right' });

// CYPRESS
cy.get('[data-test="item"]').rightclick();
```

---

### Keyboard Input

```javascript
// PLAYWRIGHT
await page.press('button', 'Enter');
// Multiple keys
await page.keyboard.type('Hello World');
// Special keys
await page.keyboard.press('Tab');
await page.keyboard.press('ArrowDown');

// CYPRESS
cy.get('button').type('{enter}');
cy.get('input').type('Hello World');
cy.get('input').type('{tab}');
cy.get('input').type('{downarrow}');
```

---

### Check Checkbox

```javascript
// PLAYWRIGHT
await page.check('[data-test="agree"]');
await page.uncheck('[data-test="agree"]');

// CYPRESS
cy.get('[data-test="agree"]').check();
cy.get('[data-test="agree"]').uncheck();
```

---

### Get Attribute

```javascript
// PLAYWRIGHT
const value = await page.locator('[data-test="input"]').getAttribute('value');
const href = await page.locator('a').getAttribute('href');

// CYPRESS
cy.get('[data-test="input"]').invoke('attr', 'value').then(value => {
  // use value
});
```

---

### Custom Test with Auth

```javascript
// PLAYWRIGHT
test('should show dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  await loginPage.login('user@example.com', 'password');
  
  await expect(page.locator('h1')).toContainText('Dashboard');
});

// CYPRESS
describe('Dashboard', () => {
  beforeEach(() => {
    cy.login('user@example.com', 'password');
  });
  
  it('should show dashboard', () => {
    cy.get('h1').should('contain', 'Dashboard');
  });
});
```

---

## Key Differences Summary

| Aspect | Playwright | Cypress |
|--------|-----------|---------|
| **Async** | `async/await` | Promise chaining |
| **Waits** | Explicit | Implicit |
| **Retry logic** | Built-in for assertions | Implicit on cy commands |
| **Multi-tab** | ✅ Full support | ❌ None |
| **Iframes** | ✅ Native `frameLocator()` | ⚠️ Difficult |
| **Browsers** | Chrome, Firefox, Safari | Chrome, Firefox only |
| **Mobile** | ✅ Device emulation | ⚠️ Limited |
| **Speed** | ✅ 3-5x faster | ⚠️ Slower |
| **Learning curve** | Moderate (modern JS) | Easy (special syntax) |

---

## Tips for Cypress Users Learning Playwright

### 1. Think in async/await, not chaining
```javascript
// Cypress mindset (don't do this in Playwright)
cy.get('input').type('text');
cy.get('button').click();
cy.get('.result').should('be.visible');

// Playwright mindset (correct)
await page.fill('input', 'text');
await page.click('button');
await expect(page.locator('.result')).toBeVisible();
```

### 2. Locators replace get()
```javascript
// Cypress
cy.get('[data-test="button"]')

// Playwright (preferred)
page.locator('[data-test="button"]')
```

### 3. Use expect() for assertions
```javascript
// Cypress
cy.get('h1').should('contain', 'Title');

// Playwright
await expect(page.locator('h1')).toContainText('Title');
```

### 4. Explicit waits are normal
```javascript
// Playwright requires explicit waits
await page.waitForSelector('.loading-complete', { timeout: 5000 });
await page.waitForURL(/.*inventory/);
```

### 5. Page Object Model uses classes
```javascript
// Better than custom Cypress commands
class LoginPage {
  constructor(page) {
    this.page = page;
  }
  
  async login(username, password) {
    // implementation
  }
}
```

---

## Common Gotchas

### ❌ Using old Cypress commands
```javascript
// This won't work in Playwright
cy.get('button').click(); // cy doesn't exist

// Do this instead
await page.click('button');
```

### ❌ Forgetting to await
```javascript
// This is wrong
const text = page.locator('h1').textContent();
console.log(text); // undefined or Promise

// Do this instead
const text = await page.locator('h1').textContent();
console.log(text); // actual text
```

### ❌ Confusing locators with elements
```javascript
// This doesn't work
const button = page.locator('button');
button.click(); // Missing await
button.textContent(); // Missing await, returns Promise

// Do this instead
const button = page.locator('button');
await button.click();
const text = await button.textContent();
```

### ✅ Best practices
1. Always `await` Playwright methods
2. Use `expect()` for assertions with retry logic
3. Create Page Objects for maintainability
4. Use descriptive locators (data-test attributes)
5. Handle async/await properly in loops

---

## Resources

- **Playwright Docs:** https://playwright.dev
- **API Reference:** https://playwright.dev/docs/api/class-page
- **Locator Guide:** https://playwright.dev/docs/locators
- **Best Practices:** https://playwright.dev/docs/best-practices

