<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
      <!-- 锁定图标 -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <!-- 标题 -->
      <h2 class="text-2xl font-bold text-center mb-2">
        隐私内容保护
      </h2>
      <p class="text-gray-600 text-center mb-6">
        请输入访问密码以查看私密内容
      </p>

      <!-- 密码输入表单 -->
      <form @submit.prevent="handleSubmit">
        <!-- 密码输入框 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            访问密码
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': error }"
              placeholder="请输入密码"
              autocomplete="off"
              autofocus
            >
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="error" class="mt-1 text-sm text-red-600">
            {{ error }}
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="!password || loading"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              验证中...
            </span>
            <span v-else>确认</span>
          </button>
        </div>

        <!-- 首次使用提示 -->
        <div v-if="isFirstTime" class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>首次使用提示：</strong><br>
            请设置一个访问密码来保护您的私密内容。此密码将用于加密存储您的内容。
          </p>
        </div>

        <!-- 忘记密码提示 -->
        <div v-else class="mt-4 text-center">
          <button
            type="button"
            @click="showForgotPassword = !showForgotPassword"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            忘记密码？
          </button>
        </div>

        <!-- 忘记密码说明 -->
        <div v-if="showForgotPassword" class="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p class="text-sm text-yellow-800">
            由于安全原因，密码无法找回。如果忘记密码，您需要：<br>
            1. 清除应用数据（所有加密内容将丢失）<br>
            2. 重新设置新密码<br>
            3. 重新导入您的内容
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ContentEncryption } from '@/utils/encryption'
import { db } from '@/services/database'

const emit = defineEmits<{
  success: [password: string]
  cancel: []
}>()

const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const isFirstTime = ref(false)
const showForgotPassword = ref(false)

// 检查是否首次使用
onMounted(async () => {
  const settings = await db.settings.get('adultContentPassword')
  isFirstTime.value = !settings
})

const handleSubmit = async () => {
  if (!password.value) return

  error.value = ''
  loading.value = true

  try {
    const settings = await db.settings.get('adultContentPassword')
    
    if (isFirstTime.value) {
      // 首次使用，设置密码
      const hashedPassword = await ContentEncryption.hashPassword(password.value)
      await db.settings.put({
        key: 'adultContentPassword',
        value: hashedPassword
      })
      emit('success', password.value)
    } else {
      // 验证密码
      const hashedPassword = await ContentEncryption.hashPassword(password.value)
      if (settings?.value === hashedPassword) {
        emit('success', password.value)
      } else {
        error.value = '密码错误，请重试'
        password.value = ''
      }
    }
  } catch (err) {
    error.value = '验证失败，请稍后重试'
    console.error('密码验证错误:', err)
  } finally {
    loading.value = false
  }
}
</script>