import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 配置文件
 * 参考: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* 在 CI 中并行运行测试 */
  fullyParallel: true,
  /* 在 CI 中失败时不重试 */
  forbidOnly: !!process.env.CI,
  /* 在 CI 中不重试 */
  retries: process.env.CI ? 2 : 0,
  /* 本地开发时选择少量的 worker，CI 中则选择更多 */
  workers: process.env.CI ? 1 : undefined,
  /* 报告配置 */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['line'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  /* 所有测试的共享设置 */
  use: {
    /* 失败时收集追踪信息 */
    trace: 'on-first-retry',
    /* 失败时截图 */
    screenshot: 'only-on-failure',
    /* 所有测试的基础 URL */
    baseURL: 'http://localhost:5174',
    /* 等待选择器的超时时间 */
    actionTimeout: 10000,
    /* 导航超时时间 */
    navigationTimeout: 30000,
  },

  /* 配置不同浏览器的项目 */
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

    /* 移动端测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* 品牌浏览器测试 */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* 启动开发服务器 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});