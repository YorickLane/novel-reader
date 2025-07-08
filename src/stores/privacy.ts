import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ContentRating } from '@/utils/contentFilter'

export const usePrivacyStore = defineStore('privacy', () => {
  // 状态
  const isPrivacyMode = ref(false)
  const isAuthenticated = ref(false)
  const authPassword = ref<string | null>(null)
  const sessionStartTime = ref<number | null>(null)
  const ageConfirmed = ref(false)
  
  // 用户设置
  const showAdultContent = ref(false)
  const maxRating = ref<ContentRating>('PG-13')
  const autoLockTimeout = ref(5 * 60 * 1000) // 5分钟自动锁定
  const blurCovers = ref(true) // 模糊成人内容封面

  // 计算属性
  const isSessionValid = computed(() => {
    if (!sessionStartTime.value) return false
    const elapsed = Date.now() - sessionStartTime.value
    return elapsed < autoLockTimeout.value
  })

  const canAccessAdultContent = computed(() => {
    return isPrivacyMode.value && isAuthenticated.value && ageConfirmed.value && isSessionValid.value
  })

  // 方法
  const enablePrivacyMode = (password: string) => {
    console.log('[PrivacyStore] 启用隐私模式')
    isPrivacyMode.value = true
    isAuthenticated.value = true
    authPassword.value = password
    sessionStartTime.value = Date.now()
    showAdultContent.value = true
    maxRating.value = 'R-21'
    ageConfirmed.value = true // 认证成功即表示年龄已确认
    console.log('[PrivacyStore] 隐私模式已启用，当前状态:', {
      isPrivacyMode: isPrivacyMode.value,
      isAuthenticated: isAuthenticated.value,
      ageConfirmed: ageConfirmed.value,
      canAccessAdultContent: canAccessAdultContent.value
    })
  }

  const disablePrivacyMode = () => {
    console.log('[PrivacyStore] 禁用隐私模式')
    isPrivacyMode.value = false
    isAuthenticated.value = false
    authPassword.value = null
    sessionStartTime.value = null
    ageConfirmed.value = false
    showAdultContent.value = false
    maxRating.value = 'PG-13'
    console.log('[PrivacyStore] 隐私模式已禁用')
  }

  const refreshSession = () => {
    if (isAuthenticated.value) {
      sessionStartTime.value = Date.now()
    }
  }

  const confirmAge = (remember: boolean = false) => {
    ageConfirmed.value = true
    if (remember) {
      // 在会话期间记住选择
      sessionStorage.setItem('ageConfirmed', 'true')
    }
  }

  const togglePrivacyMode = () => {
    if (isPrivacyMode.value) {
      disablePrivacyMode()
    } else {
      // 需要通过认证流程启用
      return false
    }
  }

  // 自动锁定检查
  setInterval(() => {
    if (isAuthenticated.value && !isSessionValid.value) {
      disablePrivacyMode()
    }
  }, 60000) // 每分钟检查一次

  // 初始化
  const init = () => {
    // 检查会话存储
    const confirmed = sessionStorage.getItem('ageConfirmed')
    if (confirmed === 'true') {
      ageConfirmed.value = true
    }
  }

  init()

  return {
    // 状态
    isPrivacyMode,
    isAuthenticated,
    authPassword,
    ageConfirmed,
    showAdultContent,
    maxRating,
    autoLockTimeout,
    blurCovers,
    
    // 计算
    canAccessAdultContent,
    isSessionValid,
    
    // 方法
    enablePrivacyMode,
    disablePrivacyMode,
    refreshSession,
    confirmAge,
    togglePrivacyMode
  }
})