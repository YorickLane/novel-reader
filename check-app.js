import { chromium } from 'playwright';

async function checkApp() {
  console.log('🚀 启动浏览器检查应用...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // 尝试多个端口
    const ports = [5174, 5173, 3000, 8080];
    let appUrl = null;
    
    for (const port of ports) {
      const url = `http://localhost:${port}`;
      console.log(`🔍 尝试连接 ${url}...`);
      try {
        await page.goto(url);
        console.log(`✅ 连接成功: ${url}`);
        appUrl = url;
        break;
      } catch (error) {
        console.log(`❌ 连接失败: ${url}`);
      }
    }
    
    if (!appUrl) {
      throw new Error('无法连接到任何端口，请确保开发服务器正在运行');
    }
    
    // 等待页面加载
    await page.waitForLoadState('networkidle');
    
    console.log('📄 页面标题:', await page.title());
    
    // 检查隐私模式按钮
    console.log('🔍 检查隐私模式按钮...');
    const privacyButton = await page.locator('button:has-text("普通模式"), button:has-text("隐私模式")').first();
    
    if (await privacyButton.isVisible()) {
      console.log('✅ 隐私模式按钮已找到');
      const buttonText = await privacyButton.textContent();
      console.log('📝 按钮文本:', buttonText?.trim());
      
      // 检查按钮样式
      const buttonClass = await privacyButton.getAttribute('class');
      console.log('🎨 按钮样式:', buttonClass);
      
      // 尝试点击按钮
      console.log('👆 点击隐私模式按钮...');
      await privacyButton.click();
      
      // 等待一下看是否有对话框出现
      await page.waitForTimeout(2000);
      
      // 检查是否出现认证对话框
      const authDialog = await page.locator('[data-testid="adult-content-guard"], .fixed:has-text("隐私内容保护")').first();
      
      if (await authDialog.isVisible()) {
        console.log('✅ 认证对话框已显示');
      } else {
        console.log('❌ 认证对话框未显示');
      }
      
    } else {
      console.log('❌ 隐私模式按钮未找到');
    }
    
    // 检查其他页面元素
    console.log('🔍 检查页面元素...');
    
    const title = await page.locator('h1:has-text("小说阅读器")').first();
    console.log('📚 应用标题存在:', await title.isVisible());
    
    const addButton = await page.locator('label:has-text("添加书籍")').first();
    console.log('➕ 添加书籍按钮存在:', await addButton.isVisible());
    
    const emptyState = await page.locator('text=还没有添加任何书籍').first();
    console.log('📖 空状态提示存在:', await emptyState.isVisible());
    
    // 截图保存
    await page.screenshot({ path: 'app-screenshot.png', fullPage: true });
    console.log('📸 截图已保存为 app-screenshot.png');
    
    // 检查控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🚨 控制台错误:', msg.text());
      }
    });
    
    // 检查网络错误
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log('🌐 网络错误:', response.url(), response.status());
      }
    });
    
    console.log('✅ 检查完成！');
    
  } catch (error) {
    console.error('❌ 检查过程中出错:', error.message);
  } finally {
    await browser.close();
  }
}

checkApp().catch(console.error);