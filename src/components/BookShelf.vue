<template>
  <div class="book-shelf p-4">
    <!-- Tailwind 测试 -->
    <div class="hidden">
      <div class="h-12 w-12 bg-red-500"></div>
    </div>
    <!-- 上传区域 -->
    <div class="upload-area mb-6">
      <label
        for="file-upload"
        class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>添加书籍</span>
      </label>
      <input
        id="file-upload"
        type="file"
        @change="handleFileUpload"
        accept=".txt,.epub"
        multiple
        class="hidden"
      />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="mt-2 text-gray-600">加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- 书籍列表 -->
    <div v-if="!loading && books.length === 0" class="text-center py-16 text-gray-500">
      <svg 
        class="mx-auto text-gray-400 mb-4" 
        style="width: 48px; height: 48px;" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p>还没有添加任何书籍</p>
      <p class="text-sm mt-2">点击上方按钮添加你的第一本书</p>
    </div>

    <div v-else-if="displayedBooks.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="book in displayedBooks"
        :key="book.id"
        class="book-item group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        @click="openBook(book.id!)"
      >
        <!-- 封面占位符 -->
        <div class="aspect-[3/4] bg-gradient-to-br flex items-center justify-center relative"
          :class="book.isAdult ? 'from-purple-500 to-pink-500' : 'from-blue-400 to-purple-500'">
          <svg class="w-16 h-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          
          <!-- 成人内容标记 -->
          <div v-if="book.isAdult" class="absolute top-2 left-2">
            <span class="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              {{ book.rating || 'R-18' }}
            </span>
          </div>
          
          <!-- 模糊效果（普通模式下） -->
          <div v-if="book.isAdult && !privacyStore.canAccessAdultContent && privacyStore.blurCovers"
            class="absolute inset-0 backdrop-blur-md bg-black bg-opacity-30 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        <!-- 书籍信息 -->
        <div class="p-3">
          <h3 class="font-semibold text-gray-800 truncate" :title="book.title">{{ book.title }}</h3>
          <p class="text-sm text-gray-600">{{ book.author }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ book.totalChapters }} 章</p>
        </div>

        <!-- 删除按钮 -->
        <button
          @click.stop="confirmDelete(book)"
          class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="删除书籍"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 隐私模式提示 -->
    <div v-if="books.length > displayedBooks.length" class="mt-8 text-center p-4 bg-purple-50 rounded-lg">
      <p class="text-purple-800">
        <svg class="inline-block w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        有 {{ books.length - displayedBooks.length }} 本私密书籍已隐藏。
        <button @click="$router.push('/privacy')" class="text-purple-600 hover:text-purple-800 underline ml-1">
          开启隐私模式查看
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStorage } from '@/composables/useBookStorage'
import { usePrivacyStore } from '@/stores/privacy'
import type { Book } from '@/services/database'

const router = useRouter()
const privacyStore = usePrivacyStore()
const { books, loading, error, addBook, fetchBooks, deleteBook } = useBookStorage()

// 过滤显示的书籍
const displayedBooks = computed(() => {
  if (privacyStore.canAccessAdultContent) {
    // 隐私模式下显示所有内容
    return books.value
  }
  
  // 普通模式下过滤成人内容
  return books.value.filter(book => !book.isAdult)
})

onMounted(() => {
  fetchBooks()
})

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  for (const file of files) {
    await addBook(file)
  }
  
  // 清空输入，允许重复选择相同文件
  target.value = ''
}

const openBook = (bookId: number) => {
  router.push(`/reader/${bookId}`)
}

const confirmDelete = async (book: Book) => {
  if (confirm(`确定要删除《${book.title}》吗？`)) {
    if (book.id) {
      await deleteBook(book.id)
    }
  }
}
</script>