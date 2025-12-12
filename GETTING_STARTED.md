# Getting Started with Playwright Framework

A quick setup guide for running this Playwright boilerplate framework.

## ✅ Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Git (optional, for version control)

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

   This installs:
   - `@playwright/test` - Playwright testing framework
   - All required browser engines (Chromium, Firefox, WebKit)

   First install will download the browser engines (~300MB total).

2. **Verify installation:**
   ```bash
   npx playwright --version
   ```

## 🚀 Running Tests

### Quick Start

```bash
# Run all tests on all browsers
npm test
```

This will:
1. Run tests on Chromium (Chrome)
2. Run same tests on Firefox
3. Run same tests on WebKit (Safari)
4. Generate HTML report in `playwright-report/`

### Specific Browsers

```bash
npm run test:chrome    # Chromium only
npm run test:firefox   # Firefox only
npm run test:webkit    # WebKit (Safari) only
```

### Interactive Mode (Best for Learning)

```bash
npm run test:ui
```

This opens Playwright's interactive UI where you can:
- See tests running in real-time
- Step through each action
- Inspect elements
- Modify and re-run tests
- Perfect for understanding the framework

### Debug Mode

```bash
npm run test:debug
```

This launches Playwright Inspector with:
- Step-through debugging
- Element inspector
- Console for JavaScript execution
- Perfect for debugging failing tests

### Headed Mode (See the Browser)

```bash
npm run test:headed
```

Tests run with visible browser window (great for watching what happens).

### Record New Test (Codegen)

```bash
npm run codegen
```

This launches code generation tool:
1. Browser opens
2. Click through your app
3. Playwright records your actions
4. Generates test code automatically

## 📝 Test Files Overview

### 1. Multi-Tab Handling (01-multi-tab.spec.js)

Tests that Playwright can:
- Open new tabs/windows
- Interact with multiple pages
- Verify content in new window
- Use context for multi-page scenarios

**Key feature demonstrated:** Native multi-tab support (Cypress cannot do this)

### 2. Iframe Handling (02-iframe-handling.spec.js)

Tests that Playwright can:
- Interact with elements inside iframes
- Handle nested iframes elegantly
- Work with rich text editors in iframes
- Read and modify iframe content

**Key feature demonstrated:** Clean `frameLocator()` API (Cypress requires hacks)

### 3. Auth State Management (03-auth-state-management.spec.js)

Tests that Playwright can:
- Save authentication state to file
- Reuse auth state in subsequent tests
- Manage multiple user contexts
- Significantly speed up tests

**Key feature demonstrated:** File-based state persistence (faster than cy.session)

### 4. Speed & Browsers (04-speed-and-browsers.spec.js)

Tests that Playwright can:
- Run same test on multiple browsers automatically
- Support Safari/WebKit (Cypress cannot)
- Emulate mobile devices
- Measure performance per browser
- Run tests in parallel

**Key feature demonstrated:** Native WebKit support + parallel execution

## 📊 Test Results

After running tests, you'll find:

- **HTML Report:** `playwright-report/index.html`
  - Open in browser to see detailed results
  - Screenshots and videos of failures
  - Execution times per test

- **Test Results:** `test-results/` directory
  - JSON files with detailed test data
  - Useful for CI/CD integration

## 🔍 Understanding Page Objects

Each test uses Page Object Model (POM) pattern:

```
BasePage.js (base class)
  ↓
  ├─ LoginPage.js (extends BasePage)
  ├─ ProductsPage.js (extends BasePage)
  └─ InternetPage.js (extends BasePage)

Tests use these to interact with pages:
  test → LoginPage → page.locator() / page.click() / etc.
```

**Benefits:**
- Change selectors in one place
- Reuse methods across tests
- OOP structure (inheritance, composition)
- Easier to maintain

## 🎯 Common Commands

```bash
# Run all tests
npm test

# Run tests in headless mode (default)
npm test

# Run with visible browser
npm run test:headed

# Debug mode with inspector
npm run test:debug

# Interactive UI mode (best for learning)
npm run test:ui

# Run specific test file
npx playwright test 01-multi-tab.spec.js

# Run tests matching pattern
npx playwright test -g "should open new tab"

# Generate code (codegen)
npm run codegen

# Show test reports
npx playwright show-report
```

## 💡 Tips for Success

### 1. Use Interactive Mode First
```bash
npm run test:ui
```
This helps you understand what's happening visually.

### 2. Read the Test Comments
Each test file has extensive comments explaining:
- What the test does
- How Playwright differs from Cypress
- Real-world use cases

### 3. Modify and Experiment
- Change test selectors
- Add new assertions
- Create new test files
- Understand by doing

### 4. Check Test Reports
After running tests:
```bash
npx playwright show-report
```
See screenshots, videos, and detailed execution info.

### 5. Use Codegen for Learning
```bash
npm run codegen
```
Record yourself clicking through a page to see generated Playwright code.

## ⚙️ Configuration

### playwright.config.js

Main configuration file with:
- Test directory and settings
- Browser configurations
- Device emulation (mobile)
- Timeouts and retries
- Screenshot/video options

Key options:
```javascript
testDir: './tests'              // Where tests are
fullyParallel: true            // Run tests in parallel
workers: undefined             // Use all CPU cores
retries: 0                      // Don't retry failed tests
timeout: 30 * 1000            // 30 seconds per test
use: {
  baseURL: '...',             // Base URL for goto('/')
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

### Environment Variables

```bash
# Run in CI mode (less parallel, more retries)
CI=true npm test

# Debug with traces
PWDEBUG=1 npm test

# Specific browser
BROWSER=firefox npm test
```

## 📈 Project Statistics

This boilerplate includes:

- **4 Page Object Classes**
  - BasePage: Common functionality
  - LoginPage: Authentication
  - ProductsPage: Shopping features
  - InternetPage: Demo site pages

- **4 Test Files**
  - 01: Multi-tab/window tests
  - 02: Iframe handling tests
  - 03: Auth state tests
  - 04: Speed & browser tests

- **3+ Browser Engines**
  - Chromium (Chrome-like)
  - Firefox
  - WebKit (Safari)

- **2+ Mobile Emulations**
  - Pixel 5 (Android)
  - iPhone 12 (iOS)

- **100+ Lines of Comments Per Test**
  - Explaining Cypress vs Playwright differences
  - Real-world scenarios
  - Best practices

## 🚨 Troubleshooting

### Tests timeout
- Increase timeout in `playwright.config.js`
- Check internet connection (test sites must be accessible)
- Some sites may block automated browsers

### Browsers not installed
```bash
npx playwright install
```

### Clear cache/state
```bash
rm -rf test-results/ playwright-report/
rm -rf auth/
npm test
```

### Missing dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. **Understand the Framework**
   - Run `npm run test:ui`
   - Watch tests execute visually
   - Read test comments

2. **Learn Playwright Patterns**
   - Study the Page Objects
   - Understand async/await usage
   - Learn locator strategies

3. **Compare with Cypress**
   - Read CYPRESS_COMPARISON.md
   - Review code differences
   - Understand Playwright advantages

4. **Build Your Tests**
   - Create Page Objects for your site
   - Write test scenarios
   - Use this framework as template

5. **Explore Advanced Features**
   - Read FRAMEWORK_GUIDE.md
   - Review Playwright documentation
   - Master locators and selectors

## 📞 Support

- **Playwright Docs:** https://playwright.dev
- **GitHub Issues:** https://github.com/microsoft/playwright
- **Stack Overflow:** Tag `playwright`

## ✨ Key Takeaways

This framework demonstrates that **Playwright solves problems Cypress cannot:**

1. ✅ Multi-tab/window handling
2. ✅ Iframe interaction
3. ✅ Safari/WebKit support
4. ✅ Superior performance (3-5x faster)
5. ✅ Parallel browser testing
6. ✅ Persistent auth state

Use this framework as a reference for:
- Best practices in Playwright
- Migrating from Cypress
- Teaching automation testing
- Building your own framework

---

**Happy Testing! 🚀**
