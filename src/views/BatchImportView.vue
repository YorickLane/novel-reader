<template>
  <div class="batch-import-view p-8 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">批量导入私密内容</h2>
    
    <!-- 隐私模式检查 -->
    <div v-if="!privacyStore.canAccessAdultContent" class="bg-yellow-100 p-4 rounded-lg mb-6">
      <p class="text-yellow-800">请先开启隐私模式才能导入成人内容</p>
    </div>
    
    <div v-else>
      <!-- 快速导入区域 -->
      <div class="bg-purple-50 p-6 rounded-lg mb-6">
        <h3 class="text-lg font-semibold mb-4 text-purple-800">快速导入《乡欲》</h3>
        <p class="text-purple-700 mb-4">
          直接导入已创作的《乡欲》第一章内容
        </p>
        
        <div class="flex items-center space-x-4">
          <input
            v-model="quickImportPassword"
            type="password"
            placeholder="设置加密密码"
            class="flex-1 px-3 py-2 border border-purple-300 rounded-lg"
          >
          <button
            @click="quickImportShenZhenDream"
            :disabled="loading || !quickImportPassword"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
          >
            一键导入
          </button>
        </div>
      </div>
      
      <!-- 文件选择区域 -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h3 class="text-lg font-semibold mb-4">选择导入方式</h3>
        
        <!-- 文件夹选择 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            选择包含章节的文件夹
          </label>
          <input
            type="file"
            @change="handleFolderSelect"
            webkitdirectory
            directory
            multiple
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          >
          <p class="mt-1 text-sm text-gray-500">
            选择包含 .txt 或 .md 文件的文件夹
          </p>
        </div>
        
        <!-- 或者单个文件 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            或选择单个文件
          </label>
          <input
            type="file"
            @change="handleFileSelect"
            accept=".txt,.md"
            multiple
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          >
        </div>
        
        <!-- 书籍信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              书名
            </label>
            <input
              v-model="bookInfo.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="如：深圳梦"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              作者
            </label>
            <input
              v-model="bookInfo.author"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="如：佚名"
            >
          </div>
        </div>
        
        <!-- 内容设置 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              内容分级
            </label>
            <select
              v-model="bookInfo.rating"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="G">G - 全年龄</option>
              <option value="PG-13">PG-13 - 建议指导</option>
              <option value="R-18">R-18 - 成人内容</option>
              <option value="R-21">R-21 - 限制级</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              加密密码
            </label>
            <input
              v-model="bookInfo.password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="留空则不加密"
            >
          </div>
        </div>
        
        <!-- 章节预览 -->
        <div v-if="chapters.length > 0" class="mb-6">
          <h4 class="font-medium mb-2">章节预览（共 {{ chapters.length }} 章）</h4>
          <div class="max-h-48 overflow-y-auto border rounded-lg p-2">
            <div v-for="(chapter, index) in chapters" :key="index" class="py-1">
              <span class="text-sm text-gray-600">{{ index + 1 }}.</span>
              <span class="text-sm ml-2">{{ chapter.title }}</span>
            </div>
          </div>
        </div>
        
        <!-- 导入按钮 -->
        <button
          @click="startImport"
          :disabled="loading || chapters.length === 0 || !bookInfo.title"
          class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
        >
          <span v-if="loading">
            <svg class="inline-block animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            导入中...
          </span>
          <span v-else>开始导入</span>
        </button>
      </div>
      
      <!-- 消息提示 -->
      <div v-if="message" 
        class="p-4 rounded-lg"
        :class="success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
      >
        {{ message }}
      </div>
      
      <!-- 使用说明 -->
      <div class="bg-gray-50 p-6 rounded-lg mt-6">
        <h3 class="font-semibold mb-2">使用说明</h3>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• 支持导入 .txt 和 .md 格式的文件</li>
          <li>• 可以选择文件夹批量导入多个章节</li>
          <li>• 文件名将作为章节标题（如：第01章_南下列车.md）</li>
          <li>• 建议为成人内容设置加密密码</li>
          <li>• 所有内容仅存储在本地，不会上传到服务器</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePrivacyStore } from '@/stores/privacy'
import { importPrivateBook } from '@/utils/importPrivateContent'
import { xiangYuData } from '@/utils/quickImport'

const router = useRouter()
const privacyStore = usePrivacyStore()

// 状态
const loading = ref(false)
const message = ref('')
const success = ref(false)
const chapters = ref<Array<{ title: string; content: string }>>([])
const quickImportPassword = ref('')

// 书籍信息
const bookInfo = reactive({
  title: '',
  author: '佚名',
  rating: 'R-18' as 'G' | 'PG-13' | 'R-18' | 'R-21',
  password: ''
})

// 处理文件夹选择
const handleFolderSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  
  // 过滤出文本文件并按名称排序
  const textFiles = files
    .filter(file => file.name.endsWith('.txt') || file.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name))
  
  await processFiles(textFiles)
}

// 处理文件选择
const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  await processFiles(files)
}

// 处理文件
const processFiles = async (files: File[]) => {
  chapters.value = []
  
  for (const file of files) {
    try {
      const content = await file.text()
      const title = file.name.replace(/\.(txt|md)$/, '')
      
      chapters.value.push({
        title,
        content
      })
    } catch (error) {
      console.error(`读取文件 ${file.name} 失败:`, error)
    }
  }
  
  // 如果只有一个文件且没有设置书名，使用文件名
  if (files.length === 1 && !bookInfo.title) {
    bookInfo.title = files[0].name.replace(/\.(txt|md)$/, '')
  }
}

// 快速导入乡欲
const quickImportShenZhenDream = async () => {
  loading.value = true
  message.value = ''
  
  try {
    await importPrivateBook(
      xiangYuData.title,
      xiangYuData.author,
      xiangYuData.chapters,
      {
        rating: 'R-18',
        isAdult: true,
        encrypt: false,  // 暂时关闭加密
        password: quickImportPassword.value
      }
    )
    
    success.value = true
    message.value = `《${xiangYuData.title}》导入成功！共 ${xiangYuData.chapters.length} 章。3秒后返回书架...`
    
    setTimeout(() => {
      router.push('/')
    }, 3000)
    
  } catch (error) {
    success.value = false
    message.value = '导入失败：' + (error as Error).message
  } finally {
    loading.value = false
  }
}

// 开始导入
const startImport = async () => {
  if (!bookInfo.title || chapters.value.length === 0) {
    message.value = '请填写书名并选择文件'
    success.value = false
    return
  }
  
  loading.value = true
  message.value = ''
  
  try {
    const bookId = await importPrivateBook(
      bookInfo.title,
      bookInfo.author,
      chapters.value,
      {
        rating: bookInfo.rating,
        isAdult: bookInfo.rating === 'R-18' || bookInfo.rating === 'R-21',
        encrypt: !!bookInfo.password,
        password: bookInfo.password
      }
    )
    
    success.value = true
    message.value = `导入成功！共导入 ${chapters.value.length} 章内容。`
    
    // 清空表单
    chapters.value = []
    bookInfo.title = ''
    bookInfo.password = ''
    
    // 3秒后跳转
    setTimeout(() => {
      router.push('/')
    }, 3000)
    
  } catch (error) {
    success.value = false
    message.value = '导入失败：' + (error as Error).message
  } finally {
    loading.value = false
  }
}
</script>