import { ref, computed } from 'vue'
import { db, type Book, type Chapter } from '@/services/database'

export function useBookStorage() {
  const books = ref<Book[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 解析章节（简单的文本分割）
  const parseChapters = (content: string): { title: string; content: string }[] => {
    // 简单实现：按照常见的章节标识符分割
    const chapterRegex = /第[一二三四五六七八九十百千万\d]+章[\s\S]*?(?=第[一二三四五六七八九十百千万\d]+章|$)/g
    const matches = content.match(chapterRegex)
    
    if (matches && matches.length > 0) {
      return matches.map((chapter, index) => {
        const lines = chapter.trim().split('\n')
        const title = lines[0] || `第${index + 1}章`
        const content = lines.slice(1).join('\n').trim()
        return { title, content }
      })
    }
    
    // 如果没有明显的章节分割，按照固定字数分割
    const wordsPerChapter = 3000
    const chapters: { title: string; content: string }[] = []
    let index = 0
    
    while (index < content.length) {
      const chapterContent = content.slice(index, index + wordsPerChapter)
      chapters.push({
        title: `第${chapters.length + 1}章`,
        content: chapterContent
      })
      index += wordsPerChapter
    }
    
    return chapters
  }

  // 添加书籍
  const addBook = async (file: File, options?: { isAdult?: boolean; rating?: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const text = await file.text()
      const chapters = parseChapters(text)
      
      // 提取书名（从文件名）
      const title = file.name.replace(/\.(txt|epub)$/i, '')
      
      // 创建书籍记录
      const book: Book = {
        title,
        author: 'Unknown',
        totalChapters: chapters.length,
        addedDate: new Date(),
        fileSize: file.size,
        format: 'txt', // 暂时只支持 txt
        rating: (options?.rating as 'G' | 'PG-13' | 'R-18' | 'R-21') || 'G', // 使用传入的评级或默认全年龄
        isAdult: options?.isAdult || false
      }
      
      // 保存到数据库
      const bookId = await db.books.add(book)
      
      // 保存章节
      if (bookId) {
        const chapterData: Chapter[] = chapters.map((chapter, index) => ({
          bookId: bookId as number,
          chapterIndex: index,
          title: chapter.title,
          content: chapter.content
        }))
        
        await db.chapters.bulkAdd(chapterData)
      }
      
      await fetchBooks()
      return bookId
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加书籍失败'
      console.error('添加书籍失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // 获取所有书籍
  const fetchBooks = async () => {
    loading.value = true
    try {
      books.value = await db.books.toArray()
      // 按添加日期倒序排列
      books.value.sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime())
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取书籍失败'
      console.error('获取书籍失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 删除书籍
  const deleteBook = async (bookId: number) => {
    try {
      await db.transaction('rw', db.books, db.chapters, db.progress, db.bookmarks, async () => {
        await db.books.delete(bookId)
        await db.chapters.where('bookId').equals(bookId).delete()
        await db.progress.where('bookId').equals(bookId).delete()
        await db.bookmarks.where('bookId').equals(bookId).delete()
      })
      
      await fetchBooks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除书籍失败'
      console.error('删除书籍失败:', err)
    }
  }

  // 获取单本书籍
  const getBook = async (bookId: number) => {
    try {
      return await db.books.get(bookId)
    } catch (err) {
      console.error('获取书籍失败:', err)
      return null
    }
  }

  return {
    books,
    loading,
    error,
    addBook,
    fetchBooks,
    deleteBook,
    getBook
  }
}