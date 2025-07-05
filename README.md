# 小说阅读器

一个基于 Vue 3 的本地小说阅读器，支持 IndexedDB 本地存储和 Google Drive 备份。

## 功能特性

- 📚 支持 TXT 格式小说导入
- 📖 舒适的阅读体验，支持主题切换
- 💾 使用 IndexedDB 本地存储，数据不会丢失
- ☁️ 支持 Google Drive 备份（需配置）
- 🔖 自动保存阅读进度
- 🎨 可自定义字体大小、行高、主题

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量（可选，用于 Google Drive 备份）

复制 `.env.example` 到 `.env` 并填入你的 Google API 配置：

```bash
cp .env.example .env
```

如果需要使用 Google Drive 备份功能，请按照以下步骤获取 API 密钥：

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google Drive API
4. 创建 OAuth 2.0 客户端 ID
5. 将客户端 ID 填入 `.env` 文件

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 即可使用。

## 使用说明

1. **添加书籍**：点击"添加书籍"按钮，选择 TXT 格式的小说文件
2. **阅读**：点击书籍封面进入阅读界面
3. **阅读设置**：在阅读界面点击右上角设置按钮，可调整字体、主题等
4. **自动保存**：阅读进度会自动保存，下次打开会恢复到上次位置

## 注意事项

- 所有数据都存储在浏览器本地，换电脑或清除浏览器数据会导致数据丢失
- 建议定期使用 Google Drive 备份功能（开发中）
- 目前仅支持 TXT 格式，EPUB 支持正在开发中

## 技术栈

- Vue 3 + TypeScript
- Vite
- Tailwind CSS
- Dexie.js (IndexedDB 封装)
- Vue Router + Pinia

## 开发

```bash
# 运行测试
npm run test:unit

# 构建生产版本
npm run build

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## License

MIT