<template>
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <!-- 警告图标 -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <!-- 标题 -->
      <h2 class="text-2xl font-bold text-center mb-4 text-gray-800">
        成人内容警告
      </h2>

      <!-- 内容元数据 -->
      <div class="mb-6 p-4 bg-gray-100 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">内容分级：</span>
          <span class="px-2 py-1 bg-red-500 text-white text-sm rounded font-semibold">
            {{ metadata.rating }}
          </span>
        </div>
        
        <div v-if="metadata.themes.length > 0" class="mb-2">
          <span class="text-sm text-gray-600">主题标签：</span>
          <div class="flex flex-wrap gap-1 mt-1">
            <span v-for="theme in metadata.themes" :key="theme"
              class="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
              {{ theme }}
            </span>
          </div>
        </div>

        <div v-if="metadata.warnings.length > 0">
          <span class="text-sm text-gray-600">内容警告：</span>
          <ul class="mt-1 text-sm text-red-600">
            <li v-for="warning in metadata.warnings" :key="warning">
              • {{ warning }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 年龄确认 -->
      <div class="mb-6">
        <p class="text-center text-gray-700 mb-4">
          此内容仅限成年人查看。请确认您的年龄。
        </p>
        
        <div class="flex items-center justify-center space-x-4">
          <label class="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="ageConfirmed"
              class="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            >
            <span class="text-sm text-gray-700">
              我已年满18岁并自愿查看此内容
            </span>
          </label>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex space-x-3">
        <button
          @click="$emit('cancel')"
          class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          返回
        </button>
        <button
          @click="handleConfirm"
          :disabled="!ageConfirmed"
          class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          确认进入
        </button>
      </div>

      <!-- 记住选择 -->
      <div class="mt-4 text-center">
        <label class="text-xs text-gray-500 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="rememberChoice"
            class="mr-1"
          >
          在本次会话中记住我的选择
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ContentMetadata } from '@/utils/contentFilter'

interface Props {
  metadata: ContentMetadata
}

defineProps<Props>()

const emit = defineEmits<{
  confirm: [rememberChoice: boolean]
  cancel: []
}>()

const ageConfirmed = ref(false)
const rememberChoice = ref(false)

const handleConfirm = () => {
  if (ageConfirmed.value) {
    emit('confirm', rememberChoice.value)
  }
}
</script>