import { defineConfig, devices } from '@playwright/test';

/**
 * Enterprise-grade Playwright configuration for React Responsive Easy
 * Optimized for CI/CD, reliability, and comprehensive testing
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Test execution configuration */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1, // More retries for CI stability
  workers: process.env.CI ? 2 : undefined, // Allow 2 workers in CI for better performance
  timeout: 30000, // 30 second timeout per test
  expect: {
    timeout: 10000, // 10 second timeout for assertions
  },
  
  /* Global test configuration */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
  
  /* Enterprise-grade reporting */
  reporter: [
    ['list'], // Console output
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never' // Don't auto-open in CI
    }],
    ['json', { 
      outputFile: 'test-results/results.json' 
    }],
    ['junit', { 
      outputFile: 'test-results/results.xml',
      includeProjectInTestName: true
    }],
    ['github'], // GitHub Actions integration
    ['blob', { 
      outputDir: 'test-results/blob-report' 
    }] // For CI artifact storage
  ],
  
  /* Shared settings for all projects */
  use: {
    baseURL: 'http://localhost:3000',
    
    /* Enhanced debugging and monitoring */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Performance monitoring */
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    /* Browser context options */
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    /* Network and resource handling */
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    },
    
    /* Accessibility testing */
    colorScheme: 'light',
  },

  /* Comprehensive browser and device testing */
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enhanced Chrome settings
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox',
            '--disable-setuid-sandbox'
          ]
        }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox-specific optimizations
        launchOptions: {
          firefoxUserPrefs: {
            'dom.webnotifications.enabled': false,
            'media.navigator.streams.fake': true,
            'media.navigator.permission.disabled': true
          }
        }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // WebKit optimizations
        launchOptions: {
          args: ['--disable-web-security']
        }
      },
    },

    // Mobile devices
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Mobile-specific settings
        isMobile: true,
        hasTouch: true
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        isMobile: true,
        hasTouch: true
      },
    },

    // Tablet testing
    {
      name: 'Tablet Chrome',
      use: { 
        ...devices['iPad Pro'],
        isMobile: true,
        hasTouch: true
      },
    },

    // Accessibility testing
    {
      name: 'accessibility',
      use: { 
        ...devices['Desktop Chrome'],
        // Accessibility-focused settings
        colorScheme: 'light'
      },
    },

    // Performance testing
    {
      name: 'performance',
      use: { 
        ...devices['Desktop Chrome'],
        // Performance testing settings
        launchOptions: {
          args: [
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection'
          ]
        }
      },
    },
  ],

  /* Enhanced web server configuration */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      NODE_ENV: 'test',
      CI: process.env.CI || 'false'
    }
  },

  /* Test output directory */
  outputDir: 'test-results/',
  
  /* Global test timeout */
  globalTimeout: 600000, // 10 minutes for entire test suite
});
