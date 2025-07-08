<template>
  <div class="dev-reader h-screen flex bg-gray-50">
    <!-- 侧边栏目录 -->
    <div class="w-80 bg-white shadow-lg overflow-y-auto">
      <div class="p-4 border-b">
        <h2 class="text-xl font-bold text-gray-800">{{ bookData.title }}</h2>
        <p class="text-sm text-gray-600 mt-1">{{ bookData.author }}</p>
        <p class="text-xs text-gray-500 mt-2">共 {{ bookData.chapters.length }} 章</p>
      </div>
      
      <!-- 章节列表 -->
      <div class="chapter-list">
        <div
          v-for="(chapter, index) in bookData.chapters"
          :key="index"
          @click="currentChapter = index"
          :class="[
            'chapter-item px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors',
            currentChapter === index ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          ]"
        >
          <h3 class="font-medium text-gray-800">{{ chapter.title }}</h3>
          <p class="text-xs text-gray-500 mt-1">
            约 {{ Math.round(chapter.content.length / 1000) }}k 字
          </p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部工具栏 -->
      <div class="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="router.push('/')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h3 class="text-lg font-semibold">{{ currentChapterData?.title }}</h3>
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">开发模式</span>
          <button
            @click="router.push('/characters')"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="查看人物图鉴"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button
            @click="showSettings = !showSettings"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 阅读内容区 -->
      <div
        ref="contentRef"
        class="flex-1 overflow-y-auto px-4 md:px-8 py-6"
        :style="readerStyles"
      >
        <div class="max-w-4xl mx-auto">
          <div 
            class="prose prose-lg max-w-none"
            v-html="formattedContent"
          ></div>
        </div>
      </div>

      <!-- 底部导航 -->
      <div class="bg-white shadow-sm px-6 py-3">
        <div class="flex items-center justify-between">
          <button
            @click="prevChapter"
            :disabled="currentChapter === 0"
            class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            上一章
          </button>
          
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <span>第 {{ currentChapter + 1 }} / {{ bookData.chapters.length }} 章</span>
            <span>{{ currentWordCount }} 字</span>
          </div>
          
          <button
            @click="nextChapter"
            :disabled="currentChapter >= bookData.chapters.length - 1"
            class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            下一章
          </button>
        </div>
      </div>
    </div>

    <!-- 设置面板 -->
    <transition name="slide">
      <div
        v-if="showSettings"
        class="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">阅读设置</h3>
            <button
              @click="showSettings = false"
              class="p-1 hover:bg-gray-100 rounded"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 字体大小 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">字体大小</label>
            <div class="flex items-center space-x-2">
              <button
                @click="fontSize = Math.max(12, fontSize - 2)"
                class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                A-
              </button>
              <span class="flex-1 text-center">{{ fontSize }}px</span>
              <button
                @click="fontSize = Math.min(24, fontSize + 2)"
                class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                A+
              </button>
            </div>
          </div>

          <!-- 行高 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">行高</label>
            <select
              v-model="lineHeight"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="1.5">1.5</option>
              <option value="1.75">1.75</option>
              <option value="2">2.0</option>
              <option value="2.25">2.25</option>
            </select>
          </div>

          <!-- 主题 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">主题</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                @click="theme = 'light'"
                :class="['p-2 rounded border', theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-300']"
              >
                日间
              </button>
              <button
                @click="theme = 'sepia'"
                :class="['p-2 rounded border', theme === 'sepia' ? 'border-blue-500 bg-blue-50' : 'border-gray-300']"
              >
                护眼
              </button>
              <button
                @click="theme = 'dark'"
                :class="['p-2 rounded border', theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-300']"
              >
                夜间
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { xiangYuData } from '@/utils/quickImport'

const router = useRouter()
const contentRef = ref<HTMLElement>()

// 使用开发数据
const bookData = ref(xiangYuData)

// 状态
const currentChapter = ref(0)
const showSettings = ref(false)

// 阅读设置
const fontSize = ref(16)
const lineHeight = ref('1.75')
const theme = ref<'light' | 'sepia' | 'dark'>('light')

// 计算属性
const currentChapterData = computed(() => bookData.value.chapters[currentChapter.value])

const currentWordCount = computed(() => {
  if (!currentChapterData.value) return 0
  return currentChapterData.value.content.length
})

const formattedContent = computed(() => {
  if (!currentChapterData.value) return ''
  
  // 将换行符转换为段落
  return currentChapterData.value.content
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p class="mb-4">${line}</p>`)
    .join('')
})

const readerStyles = computed(() => {
  const themes = {
    light: {
      backgroundColor: '#ffffff',
      color: '#1a202c'
    },
    sepia: {
      backgroundColor: '#f9f4e9',
      color: '#5c4b37'
    },
    dark: {
      backgroundColor: '#1a202c',
      color: '#e2e8f0'
    }
  }
  
  return {
    fontSize: `${fontSize.value}px`,
    lineHeight: lineHeight.value,
    ...themes[theme.value]
  }
})

// 方法
const prevChapter = () => {
  if (currentChapter.value > 0) {
    currentChapter.value--
    scrollToTop()
  }
}

const nextChapter = () => {
  if (currentChapter.value < bookData.value.chapters.length - 1) {
    currentChapter.value++
    scrollToTop()
  }
}

const scrollToTop = () => {
  if (contentRef.value) {
    contentRef.value.scrollTop = 0
  }
}

// 监听章节变化
watch(currentChapter, () => {
  scrollToTop()
})
</script>

<style scoped>
.chapter-item {
  border-left: 4px solid transparent;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>