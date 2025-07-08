import { test, expect } from '@playwright/test';

test.describe('隐私模式功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到应用首页
    await page.goto('http://localhost:5174');
    
    // 等待应用加载完成
    await page.waitForSelector('h1:has-text("小说阅读器")');
  });

  test('应该显示隐私模式切换按钮', async ({ page }) => {
    // 检查隐私模式按钮是否存在
    const privacyButton = page.locator('button:has-text("普通模式")');
    await expect(privacyButton).toBeVisible();
    
    // 验证按钮的样式类
    await expect(privacyButton).toHaveClass(/bg-gray-200/);
    
    // 验证按钮图标存在
    const eyeIcon = privacyButton.locator('svg');
    await expect(eyeIcon).toBeVisible();
  });

  test('点击隐私模式按钮应该显示认证对话框', async ({ page }) => {
    // 点击隐私模式按钮
    await page.click('button:has-text("普通模式")');
    
    // 等待认证对话框出现
    await page.waitForSelector('[data-testid="adult-content-guard"]', { timeout: 5000 });
    
    // 验证对话框内容
    const dialog = page.locator('[data-testid="adult-content-guard"]');
    await expect(dialog).toBeVisible();
  });

  test('隐私模式按钮应该有正确的文本', async ({ page }) => {
    // 检查初始状态为普通模式
    const button = page.locator('button', { hasText: /普通模式|隐私模式/ });
    await expect(button).toContainText('普通模式');
  });

  test('隐私模式按钮应该有正确的颜色状态', async ({ page }) => {
    // 检查初始状态的颜色
    const button = page.locator('button:has-text("普通模式")');
    await expect(button).toHaveClass(/bg-gray-200/);
    await expect(button).toHaveClass(/text-gray-700/);
  });

  test('页面标题应该正确显示', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h1')).toContainText('小说阅读器');
  });

  test('应该显示上传书籍按钮', async ({ page }) => {
    // 验证上传按钮存在
    const uploadButton = page.locator('label:has-text("添加书籍")');
    await expect(uploadButton).toBeVisible();
  });

  test('批量导入按钮在普通模式下应该隐藏', async ({ page }) => {
    // 在普通模式下，批量导入按钮应该不可见
    const batchImportButton = page.locator('a:has-text("批量导入")');
    await expect(batchImportButton).toBeHidden();
  });

  test('应该显示空状态提示', async ({ page }) => {
    // 验证空状态提示
    await expect(page.locator('text=还没有添加任何书籍')).toBeVisible();
    await expect(page.locator('text=点击上方按钮添加你的第一本书')).toBeVisible();
  });
});