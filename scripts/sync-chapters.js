#!/usr/bin/env node

/**
 * 自动同步章节内容到quickImport.ts
 * 解决手动更新的效率问题
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // 章节文件目录
  chaptersDir: path.join(__dirname, '../content-private/stories/drafts/神陆纪元/chapters'),
  // 输出文件
  outputFile: path.join(__dirname, '../src/utils/quickImport.ts'),
  // 书籍信息
  bookInfo: {
    title: '神陆纪元',
    author: '苍玄道人'
  }
};

/**
 * 读取markdown文件内容
 */
function readMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // 移除markdown标题行（第一行）
    const lines = content.split('\n');
    const title = lines[0].replace(/^#\s*/, '').trim();
    const bodyContent = lines.slice(1).join('\n').trim();
    
    return {
      title,
      content: bodyContent
    };
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error.message);
    return null;
  }
}

/**
 * 获取所有章节文件
 */
function getChapterFiles() {
  try {
    const files = fs.readdirSync(CONFIG.chaptersDir);
    return files
      .filter(file => file.endsWith('.md'))
      .filter(file => file.match(/^第\d+章/)) // 只处理正式章节
      .sort((a, b) => {
        // 按章节号排序
        const aNum = parseInt(a.match(/第(\d+)章/)[1]);
        const bNum = parseInt(b.match(/第(\d+)章/)[1]);
        return aNum - bNum;
      });
  } catch (error) {
    console.error('读取章节目录失败:', error.message);
    return [];
  }
}

/**
 * 转义字符串用于TypeScript
 */
function escapeForTS(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');
}

/**
 * 生成quickImport.ts内容
 */
function generateQuickImportContent(chapters) {
  const chaptersContent = chapters.map(chapter => {
    return `    {
      title: "${chapter.title}",
      content: \`${escapeForTS(chapter.content)}\`
    }`;
  }).join(',\n');

  return `/**
 * 快速导入数据
 * 此文件由 scripts/sync-chapters.js 自动生成
 * 请勿手动修改，修改章节内容请编辑对应的markdown文件
 */
export interface QuickImportData {
  title: string
  author: string
  chapters: Array<{
    title: string
    content: string
  }>
}

/**
 * 《${CONFIG.bookInfo.title}》
 */
export const shenLuJiYuanData: QuickImportData = {
  title: "${CONFIG.bookInfo.title}",
  author: "${CONFIG.bookInfo.author}",
  chapters: [
${chaptersContent}
  ]
}
`;
}

/**
 * 主函数
 */
function syncChapters() {
  console.log('🚀 开始同步章节内容...');
  
  // 获取章节文件
  const chapterFiles = getChapterFiles();
  if (chapterFiles.length === 0) {
    console.log('❌ 未找到任何章节文件');
    return;
  }
  
  console.log(`📚 找到 ${chapterFiles.length} 个章节文件:`);
  chapterFiles.forEach(file => console.log(`   - ${file}`));
  
  // 读取章节内容
  const chapters = [];
  for (const file of chapterFiles) {
    const filePath = path.join(CONFIG.chaptersDir, file);
    const chapterData = readMarkdownFile(filePath);
    
    if (chapterData) {
      chapters.push(chapterData);
      console.log(`✅ 成功读取: ${chapterData.title}`);
    } else {
      console.log(`❌ 读取失败: ${file}`);
    }
  }
  
  if (chapters.length === 0) {
    console.log('❌ 没有成功读取任何章节内容');
    return;
  }
  
  // 生成TypeScript内容
  const tsContent = generateQuickImportContent(chapters);
  
  // 写入文件
  try {
    fs.writeFileSync(CONFIG.outputFile, tsContent, 'utf8');
    console.log(`✅ 成功生成 quickImport.ts，包含 ${chapters.length} 个章节`);
    
    // 显示生成的章节
    console.log('\n📖 生成的章节:');
    chapters.forEach((chapter, index) => {
      console.log(`   ${index + 1}. ${chapter.title}`);
    });
    
  } catch (error) {
    console.error('❌ 写入文件失败:', error.message);
  }
}

/**
 * 监控模式
 */
function watchMode() {
  console.log('👀 启动监控模式...');
  
  // 首次同步
  syncChapters();
  
  // 监控章节目录
  fs.watch(CONFIG.chaptersDir, { recursive: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.md') && filename.match(/^第\d+章/)) {
      console.log(`\n🔄 检测到文件变化: ${filename}`);
      setTimeout(syncChapters, 100); // 延迟一点避免文件正在写入
    }
  });
  
  console.log(`监控目录: ${CONFIG.chaptersDir}`);
  console.log('按 Ctrl+C 退出监控模式\n');
}

// 命令行参数处理
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watchMode();
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
乡欲章节同步工具

用法:
  node sync-chapters.js         # 执行一次同步
  node sync-chapters.js --watch # 监控模式，自动同步
  node sync-chapters.js --help  # 显示帮助

功能:
  - 自动读取章节markdown文件
  - 生成quickImport.ts文件
  - 支持监控模式实时更新
`);
} else {
  syncChapters();
}