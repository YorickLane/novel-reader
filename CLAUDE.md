# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述
这是一个基于 Vue 3 + TypeScript 的本地小说阅读器应用，使用 IndexedDB 进行本地存储，支持隐私模式和内容加密功能。

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test:unit                # 单元测试
npm run test:e2e                 # E2E 测试
npm run test:e2e:ui              # E2E 测试 UI 模式
npm run test:e2e:headed          # E2E 测试有头模式
npm run test:e2e:report          # 查看 E2E 测试报告

# 类型检查和代码质量
npm run type-check               # TypeScript 类型检查
npm run lint                     # ESLint 检查和自动修复
npm run format                   # Prettier 代码格式化

# 章节内容同步
npm run sync                     # 单次同步章节内容
npm run sync:watch               # 监听模式，自动同步章节变化
```

## 核心架构

### 技术栈
- **前端框架**: Vue 3 + TypeScript (Composition API)
- **构建工具**: Vite 7
- **样式**: Tailwind CSS v4
- **状态管理**: Pinia
- **路由**: Vue Router
- **数据库**: Dexie.js (IndexedDB 封装)
- **测试**: Vitest (单元测试) + Playwright (E2E 测试)
- **工具库**: VueUse

### 数据模型 (src/services/database.ts)
- **Book**: 书籍信息
  - 基础信息：标题、作者、章节数、添加日期、文件大小、格式
  - 内容分级：`rating` ('G' | 'PG-13' | 'R-18' | 'R-21')
  - 隐私保护：`isAdult`, `isEncrypted` 标记
  - 元数据：`themes`, `warnings` 数组
- **Chapter**: 章节内容（bookId, chapterIndex, title, content, isEncrypted）
- **ReadingProgress**: 阅读进度（章节索引、滚动位置、百分比、最后阅读日期）
- **Bookmark**: 书签（书籍ID、章节、位置、笔记）
- **Settings**: 用户设置键值对

### 核心 Composables
- **useBookStorage** (src/composables/useBookStorage.ts)
  - 书籍管理：`addBook`, `deleteBook`, `getBook`, `fetchBooks`
  - 章节解析：`parseChapters` - 支持正则识别章节或按字数自动分章
- **useReadingProgress** (src/composables/useReadingProgress.ts)
  - 阅读进度自动保存和恢复

### 路由结构 (src/router/index.ts)
- `/` - 首页书架 (HomeView)
- `/reader/:id` - 阅读器 (ReaderView)
- `/about` - 关于页面 (AboutView)
- `/import` - 导入页面 (ImportView)
- `/batch-import` - 批量导入 (BatchImportView)
- `/dev-reader` - 开发者阅读器 (DevReader)
- `/characters` - 角色画廊 (CharacterGallery)

### 隐私保护系统

#### 隐私模式 Store (src/stores/privacy.ts)
- **状态管理**:
  - `isPrivacyMode`: 隐私模式开关
  - `isAuthenticated`: 认证状态
  - `ageConfirmed`: 年龄确认
  - `canAccessAdultContent`: 综合访问权限（计算属性）
- **会话管理**:
  - 自动锁定超时 (默认 5 分钟)
  - 会话有效性验证
  - 自动检查并锁定过期会话
- **内容控制**:
  - `maxRating`: 最大内容分级
  - `showAdultContent`: 成人内容显示开关
  - `blurCovers`: 封面模糊选项

#### 内容加密 (src/utils/encryption.ts)
- **加密算法**: AES-GCM 256-bit (Web Crypto API)
- **密钥派生**: PBKDF2 (100000 次迭代)
- **核心方法**:
  - `encryptAndPack(text, password)`: 加密并转换为 Base64 存储格式
  - `unpackAndDecrypt(packed, password)`: 解密还原文本
  - `hashPassword(password)`: SHA-256 密码哈希（用于验证）
  - `generateSecurePassword(length)`: 生成安全随机密码

## 内容同步自动化

### 章节内容管理
- **源文件目录**: `/content-private/stories/drafts/乡欲/chapters/`
- **生成目标**: `src/utils/quickImport.ts`
- **重要**: 不要手动修改 `quickImport.ts`，该文件由脚本自动生成

### 同步脚本 (scripts/sync-chapters.js)
- **功能**: 自动读取 Markdown 章节文件并生成 TypeScript 导入数据
- **使用方式**:
  ```bash
  npm run sync                 # 单次同步
  npm run sync:watch           # 监听模式
  node scripts/sync-chapters.js --help  # 查看帮助
  ```
- **章节文件命名**: `第XX章_标题.md` (如 `第01章_球场重逢.md`)
- **处理逻辑**:
  - 按章节编号自动排序
  - 移除 Markdown 标题行（第一行）
  - 转义特殊字符用于 TypeScript 模板字符串

### 导入数据结构
```typescript
interface QuickImportData {
  title: string
  author: string
  chapters: Array<{
    title: string
    content: string
  }>
}
```

## 开发模式和测试

### 开发阅读器 (/dev-reader)
- 直接使用 `quickImport.ts` 中的数据进行开发和测试
- 无需实际导入文件，快速预览章节内容

### 测试策略
- **单元测试**: 使用 Vitest，测试工具函数和 composables
- **E2E 测试**: 使用 Playwright，测试完整用户流程
- **运行单个测试**: `npm run test:unit -- path/to/test.spec.ts`

## 内容创作指导
- 本项目支持成人向文学内容的创作和展示
- 创作时应注重人物心理刻画和情感发展的真实性
- 成人内容应服务于故事发展和人物塑造
- 使用文学化的语言进行描写，追求艺术性和深度
- 通过隐私模式和加密功能保护用户隐私