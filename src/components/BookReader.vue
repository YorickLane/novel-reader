<template>
  <div class="reader-container h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="reader-header bg-white shadow-sm px-4 py-2 flex items-center justify-between">
      <button
        @click="router.back()"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="返回书架"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      <h2 class="text-lg font-semibold text-gray-800 truncate flex-1 mx-4">
        {{ currentBook?.title }}
      </h2>
      
      <button
        @click="showSettings = !showSettings"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="设置"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>

    <!-- 阅读内容区 -->
    <div
      ref="contentRef"
      class="reader-content flex-1 overflow-y-auto px-4 md:px-8 py-6"
      :style="readerStyles"
      @scroll="handleScroll"
    >
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">{{ currentChapterData?.title }}</h1>
        <div 
          class="prose prose-lg max-w-none"
          v-html="formattedContent"
        ></div>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="reader-footer bg-white shadow-sm px-4 py-2">
      <div class="flex items-center justify-between">
        <button
          @click="prevChapter"
          :disabled="currentChapter === 0"
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          上一章
        </button>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            第 {{ currentChapter + 1 }} / {{ totalChapters }} 章
          </span>
          <span class="text-sm text-gray-600">
            {{ percentage }}%
          </span>
        </div>
        
        <button
          @click="nextChapter"
          :disabled="currentChapter >= totalChapters - 1"
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          下一章
        </button>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReadingProgress } from '@/composables/useReadingProgress'
import { db, type Book, type Chapter } from '@/services/database'

const route = useRoute()
const router = useRouter()
const bookId = parseInt(route.params.id as string)

// 状态
const currentBook = ref<Book | null>(null)
const chapters = ref<Chapter[]>([])
const contentRef = ref<HTMLElement>()
const showSettings = ref(false)

// 阅读设置
const fontSize = ref(16)
const lineHeight = ref('1.75')
const theme = ref<'light' | 'sepia' | 'dark'>('light')

// 阅读进度
const { 
  currentChapter, 
  scrollPosition, 
  percentage,
  loadProgress,
  updatePercentage
} = useReadingProgress(bookId)

// 计算属性
const totalChapters = computed(() => chapters.value.length)
const currentChapterData = computed(() => chapters.value[currentChapter.value])

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

const formattedContent = computed(() => {
  if (!currentChapterData.value) return ''
  
  // 将换行符转换为段落
  return currentChapterData.value.content
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p class="mb-4">${line}</p>`)
    .join('')
})

// 方法
const loadBook = async () => {
  try {
    currentBook.value = await db.books.get(bookId)
    chapters.value = await db.chapters
      .where('bookId')
      .equals(bookId)
      .sortBy('chapterIndex')
    
    await loadProgress()
  } catch (error) {
    console.error('加载书籍失败:', error)
    router.push('/')
  }
}

const handleScroll = () => {
  if (contentRef.value) {
    scrollPosition.value = contentRef.value.scrollTop
    const scrollHeight = contentRef.value.scrollHeight - contentRef.value.clientHeight
    if (scrollHeight > 0) {
      const currentProgress = (scrollPosition.value / scrollHeight) * 100
      updatePercentage(
        currentChapter.value + currentProgress / 100,
        totalChapters.value
      )
    }
  }
}

const prevChapter = () => {
  if (currentChapter.value > 0) {
    currentChapter.value--
    scrollPosition.value = 0
    scrollToTop()
  }
}

const nextChapter = () => {
  if (currentChapter.value < totalChapters.value - 1) {
    currentChapter.value++
    scrollPosition.value = 0
    scrollToTop()
  }
}

const scrollToTop = async () => {
  await nextTick()
  if (contentRef.value) {
    contentRef.value.scrollTop = 0
  }
}

// 监听章节变化，恢复滚动位置
watch(currentChapter, async () => {
  await nextTick()
  if (contentRef.value && scrollPosition.value > 0) {
    contentRef.value.scrollTop = scrollPosition.value
  }
})

// 加载数据
onMounted(() => {
  loadBook()
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>