<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { usePrivacyStore } from '@/stores/privacy'
import AdultContentGuard from '@/components/AdultContentGuard.vue'

const privacyStore = usePrivacyStore()
const showAuthDialog = ref(false)

// 监听用户活动，刷新会话
const handleUserActivity = () => {
  if (privacyStore.isAuthenticated) {
    privacyStore.refreshSession()
  }
}

// 切换隐私模式
const togglePrivacyMode = () => {
  if (!privacyStore.isPrivacyMode) {
    showAuthDialog.value = true
  } else {
    privacyStore.disablePrivacyMode()
  }
}

// 处理认证成功
const handleAuthSuccess = (password: string) => {
  privacyStore.enablePrivacyMode(password)
  showAuthDialog.value = false
}

// 添加活动监听
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', handleUserActivity)
  window.addEventListener('keypress', handleUserActivity)
}
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">小说阅读器</h1>
          
          <!-- 隐私模式切换按钮 -->
          <button
            @click="togglePrivacyMode"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            :class="privacyStore.isPrivacyMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!privacyStore.isPrivacyMode" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span class="font-medium">
              {{ privacyStore.isPrivacyMode ? '隐私模式' : '普通模式' }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <!-- 认证对话框 -->
    <Teleport to="body">
      <AdultContentGuard 
        v-if="showAuthDialog"
        @success="handleAuthSuccess"
        @cancel="showAuthDialog = false"
      />
    </Teleport>
  </div>
</template>