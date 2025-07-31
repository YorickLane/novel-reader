<template>
  <div class="import-view p-8">
    <h2 class="text-2xl font-bold mb-6">导入私密内容</h2>
    
    <div v-if="!privacyStore.canAccessAdultContent" class="bg-yellow-100 p-4 rounded-lg mb-6">
      <p class="text-yellow-800">请先开启隐私模式才能导入成人内容</p>
    </div>
    
    <div v-else class="space-y-4">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">导入《乡欲》</h3>
        <p class="text-gray-600 mb-4">
          这将导入《乡欲》章节内容到阅读器中。
        </p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            加密密码（用于保护内容）
          </label>
          <input
            v-model="contentPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="设置一个密码保护你的内容"
          >
        </div>
        
        <button
          @click="importXiangYu"
          :disabled="loading || !contentPassword"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
        >
          <span v-if="loading">导入中...</span>
          <span v-else>开始导入</span>
        </button>
      </div>
      
      <div v-if="message" 
        class="p-4 rounded-lg"
        :class="success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePrivacyStore } from '@/stores/privacy'
import { importPrivateBook } from '@/utils/importPrivateContent'
import { xiangYuData } from '@/utils/quickImport'

const router = useRouter()
const privacyStore = usePrivacyStore()

const loading = ref(false)
const contentPassword = ref('')
const message = ref('')
const success = ref(false)

const importXiangYu = async () => {
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
        encrypt: true,
        password: contentPassword.value
      }
    )
    
    success.value = true
    message.value = '导入成功！即将跳转到书架...'
    
    setTimeout(() => {
      router.push('/')
    }, 2000)
    
  } catch (error) {
    success.value = false
    message.value = '导入失败：' + (error as Error).message
  } finally {
    loading.value = false
  }
}
</script>