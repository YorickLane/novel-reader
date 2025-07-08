import { db } from '@/services/database'
import { ContentFilter } from '@/utils/contentFilter'
import { ContentEncryption } from '@/utils/encryption'

/**
 * 导入私密内容到阅读器
 */
export async function importPrivateBook(
  title: string,
  author: string,
  chapters: Array<{ title: string; content: string }>,
  options: {
    rating?: 'G' | 'PG-13' | 'R-18' | 'R-21'
    isAdult?: boolean
    encrypt?: boolean
    password?: string
  } = {}
) {
  try {
    // 分析内容
    const fullContent = chapters.map(ch => ch.content).join('\n')
    const metadata = ContentFilter.analyzeContent(fullContent, title)
    
    // 创建书籍记录
    const book = {
      title,
      author,
      totalChapters: chapters.length,
      addedDate: new Date(),
      fileSize: new Blob([fullContent]).size,
      format: 'txt' as const,
      rating: options.rating || metadata.rating,
      isAdult: options.isAdult ?? metadata.isAdult,
      isEncrypted: options.encrypt || false,
      themes: metadata.themes,
      warnings: metadata.warnings
    }
    
    // 保存书籍
    const bookId = await db.books.add(book)
    
    if (bookId) {
      // 保存章节
      for (let i = 0; i < chapters.length; i++) {
        let content = chapters[i].content
        
        // 如果需要加密
        if (options.encrypt && options.password) {
          content = await ContentEncryption.encryptAndPack(content, options.password)
        }
        
        await db.chapters.add({
          bookId: bookId as number,
          chapterIndex: i,
          title: chapters[i].title,
          content: content,
          isEncrypted: options.encrypt || false
        })
      }
    }
    
    return bookId
  } catch (error) {
    console.error('导入失败:', error)
    throw error
  }
}

/**
 * 示例：导入《深圳梦》
 */
export async function importShenZhenDream() {
  const chapters = [
    {
      title: "第一章 南下列车",
      content: `2018年春节刚过，广西田东县的汽车站里人头攒动...` // 这里放完整内容
    },
    {
      title: "第二章 城中村的夜", 
      content: `从罗湖到福田，地铁里挤满了下班的人群...` // 这里放完整内容
    }
  ]
  
  return importPrivateBook(
    "深圳梦",
    "陈宇的故事",
    chapters,
    {
      rating: 'R-18',
      isAdult: true,
      encrypt: true,
      password: 'your-content-password' // 使用你的密码
    }
  )
}