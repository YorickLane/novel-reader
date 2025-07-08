<template>
  <div class="test-import p-8">
    <h2 class="text-2xl font-bold mb-6">测试导入《深圳梦》</h2>
    
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          设置访问密码
        </label>
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="设置一个密码保护内容"
        >
      </div>
      
      <button
        @click="testImport"
        :disabled="loading || !password"
        class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
      >
        <span v-if="loading">导入中...</span>
        <span v-else>测试导入《深圳梦》</span>
      </button>
      
      <div v-if="message" class="mt-4 p-4 rounded-lg"
        :class="success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/services/database'
import { ContentEncryption } from '@/utils/encryption'

const router = useRouter()
const password = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)

const testImport = async () => {
  loading.value = true
  message.value = ''
  
  try {
    // 创建测试书籍
    const book = {
      title: "深圳梦",
      author: "陈宇的故事",
      totalChapters: 2,
      addedDate: new Date(),
      fileSize: 50000,
      format: 'txt' as const,
      rating: 'R-18' as const,
      isAdult: true,
      isEncrypted: true,
      themes: ['都市', '情感', '成长'],
      warnings: ['成人内容', '仅限18岁以上']
    }
    
    const bookId = await db.books.add(book)
    
    if (bookId) {
      // 第一章内容
      const chapter1Content = `2018年春节刚过，广西田东县的汽车站里人头攒动。

陈宇站在候车室门口，手里攥着那张去往深圳的火车票，反复确认着车次和时间...`

      // 第二章内容  
      const chapter2Content = `从罗湖到福田，地铁里挤满了下班的人群。陈宇第一次坐地铁，新奇地看着飞速后退的隧道...`

      // 加密内容
      const encryptedContent1 = await ContentEncryption.encryptAndPack(chapter1Content, password.value)
      const encryptedContent2 = await ContentEncryption.encryptAndPack(chapter2Content, password.value)
      
      // 保存章节
      await db.chapters.add({
        bookId: bookId as number,
        chapterIndex: 0,
        title: "第一章 南下列车",
        content: encryptedContent1,
        isEncrypted: true
      })
      
      await db.chapters.add({
        bookId: bookId as number,
        chapterIndex: 1,
        title: "第二章 城中村的夜",
        content: encryptedContent2,
        isEncrypted: true
      })
    }
    
    success.value = true
    message.value = '导入成功！正在跳转到书架...'
    
    setTimeout(() => {
      router.push('/')
    }, 2000)
    
  } catch (error) {
    success.value = false
    message.value = '导入失败：' + (error as Error).message
    console.error('导入错误:', error)
  } finally {
    loading.value = false
  }
}
</script>