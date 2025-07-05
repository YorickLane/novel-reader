import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { db, type ReadingProgress } from '@/services/database'

export function useReadingProgress(bookId: number) {
  const currentChapter = ref(0)
  const scrollPosition = ref(0)
  const percentage = ref(0)
  const isLoading = ref(false)

  // 加载进度
  const loadProgress = async () => {
    isLoading.value = true
    try {
      const progress = await db.progress.get(bookId)
      if (progress) {
        currentChapter.value = progress.chapterIndex
        scrollPosition.value = progress.scrollPosition
        percentage.value = progress.percentage
      }
    } catch (error) {
      console.error('加载进度失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 保存进度（防抖）
  const saveProgress = useDebounceFn(async () => {
    try {
      const progress: ReadingProgress = {
        bookId,
        chapterIndex: currentChapter.value,
        scrollPosition: scrollPosition.value,
        percentage: percentage.value,
        lastReadDate: new Date()
      }
      
      await db.progress.put(progress)
      
      // 更新书籍的最后阅读时间
      await db.books.update(bookId, {
        lastReadDate: new Date()
      })
    } catch (error) {
      console.error('保存进度失败:', error)
    }
  }, 1000)

  // 监听变化自动保存
  watch([currentChapter, scrollPosition, percentage], () => {
    saveProgress()
  })

  // 更新百分比
  const updatePercentage = (current: number, total: number) => {
    percentage.value = Math.round((current / total) * 100)
  }

  return {
    currentChapter,
    scrollPosition,
    percentage,
    isLoading,
    loadProgress,
    saveProgress,
    updatePercentage
  }
}