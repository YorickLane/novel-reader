// 临时脚本：清理数据库中的重复书籍
import { db } from '../services/database.js'

async function cleanDuplicateBooks() {
  try {
    // 获取所有书籍
    const books = await db.books.toArray()
    console.log('当前书籍:', books)
    
    // 查找重复的书籍（按标题分组）
    const booksByTitle = {}
    books.forEach(book => {
      if (!booksByTitle[book.title]) {
        booksByTitle[book.title] = []
      }
      booksByTitle[book.title].push(book)
    })
    
    // 删除重复的书籍（保留第一个）
    for (const [title, duplicates] of Object.entries(booksByTitle)) {
      if (duplicates.length > 1) {
        console.log(`发现重复书籍 "${title}": ${duplicates.length} 本`)
        // 保留第一本，删除其他
        for (let i = 1; i < duplicates.length; i++) {
          const bookId = duplicates[i].id
          console.log(`删除重复书籍 ID: ${bookId}`)
          // 删除书籍和相关章节
          await db.chapters.where('bookId').equals(bookId).delete()
          await db.books.delete(bookId)
        }
      }
    }
    
    console.log('清理完成')
  } catch (error) {
    console.error('清理失败:', error)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanDuplicateBooks()
}

export { cleanDuplicateBooks }