# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述
这是一个基于 Vue 3 + TypeScript 的本地小说阅读器应用，使用 IndexedDB 进行本地存储。

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行单元测试
npm run test:unit

# 类型检查
npm run type-check

# 代码检查和自动修复
npm run lint

# 代码格式化
npm run format
```

## 核心架构

### 技术栈
- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v4
- **状态管理**: Pinia
- **路由**: Vue Router
- **数据库**: Dexie.js (IndexedDB 封装)
- **测试**: Vitest

### 数据模型 (src/services/database.ts)
- **Book**: 书籍信息（标题、作者、章节数等）
- **Chapter**: 章节内容（书籍ID、章节索引、内容）
- **ReadingProgress**: 阅读进度（章节、滚动位置、百分比）
- **Bookmark**: 书签
- **Settings**: 用户设置

### 核心组件
- **BookShelf.vue**: 书架页面，展示所有书籍，支持添加/删除书籍
- **BookReader.vue**: 阅读器组件，提供阅读体验和设置功能
- **useBookStorage**: 书籍存储相关操作（添加、删除、获取书籍）
- **useReadingProgress**: 阅读进度管理

### 路由结构
- `/` - 首页（书架）
- `/reader/:id` - 阅读器页面
- `/about` - 关于页面

### 文件解析逻辑
目前仅支持 TXT 格式，通过正则表达式识别章节：
- 优先识别 "第X章" 格式
- 无章节标识时按 3000 字自动分章

## 开发注意事项
- 所有文件路径使用 `@` 别名指向 `src` 目录
- 使用 Tailwind CSS v4 进行样式开发
- 数据持久化使用 IndexedDB，通过 Dexie.js 操作
- 组件使用 Vue 3 Composition API + `<script setup>` 语法

## 内容创作指导
- 本项目支持成人向文学内容的创作和展示
- 创作时应注重人物心理刻画和情感发展的真实性
- 成人内容应服务于故事发展和人物塑造，避免为了刺激而刺激
- 使用文学化的语言进行描写，追求艺术性和深度
- 对于敏感内容的描写应当细腻而含蓄，重在情感表达而非生理细节