/**
 * 内容过滤和分级工具
 */

export type ContentRating = 'G' | 'PG-13' | 'R-18' | 'R-21'

export interface ContentMetadata {
  rating: ContentRating
  themes: string[]
  warnings: string[]
  isAdult: boolean
  requiresAuth: boolean
}

export class ContentFilter {
  // 成人内容关键词（用于自动检测）
  private static adultKeywords = new Set([
    // 这里只放置用于检测的通用词汇
    'explicit', 'mature', 'adult', 'nsfw'
  ])

  // 主题分类
  private static themes = {
    romance: ['romance', 'love', 'relationship'],
    fantasy: ['fantasy', 'magic', 'supernatural'],
    contemporary: ['modern', 'contemporary', 'realistic'],
    historical: ['historical', 'period', 'ancient']
  }

  /**
   * 分析内容并返回元数据
   */
  static analyzeContent(content: string, title: string = ''): ContentMetadata {
    const lowerContent = (content + title).toLowerCase()
    
    // 检测是否包含成人内容
    const isAdult = this.containsAdultContent(lowerContent)
    
    // 确定评级
    const rating = this.determineRating(lowerContent, isAdult)
    
    // 检测主题
    const themes = this.detectThemes(lowerContent)
    
    // 生成警告
    const warnings = this.generateWarnings(rating, themes)

    return {
      rating,
      themes,
      warnings,
      isAdult,
      requiresAuth: rating !== 'G' && rating !== 'PG-13'
    }
  }

  /**
   * 检查是否包含成人内容
   */
  private static containsAdultContent(content: string): boolean {
    for (const keyword of this.adultKeywords) {
      if (content.includes(keyword)) {
        return true
      }
    }
    return false
  }

  /**
   * 确定内容评级
   */
  private static determineRating(content: string, isAdult: boolean): ContentRating {
    if (!isAdult) {
      // 检查是否适合青少年
      if (content.includes('violence') || content.includes('mild')) {
        return 'PG-13'
      }
      return 'G'
    }

    // 成人内容细分
    if (content.includes('extreme') || content.includes('hardcore')) {
      return 'R-21'
    }
    return 'R-18'
  }

  /**
   * 检测内容主题
   */
  private static detectThemes(content: string): string[] {
    const detectedThemes: string[] = []

    for (const [theme, keywords] of Object.entries(this.themes)) {
      for (const keyword of keywords) {
        if (content.includes(keyword)) {
          detectedThemes.push(theme)
          break
        }
      }
    }

    return [...new Set(detectedThemes)]
  }

  /**
   * 生成内容警告
   */
  private static generateWarnings(rating: ContentRating, themes: string[]): string[] {
    const warnings: string[] = []

    switch (rating) {
      case 'R-21':
        warnings.push('极限成人内容')
        warnings.push('仅限21岁以上')
        break
      case 'R-18':
        warnings.push('成人内容')
        warnings.push('仅限18岁以上')
        break
      case 'PG-13':
        warnings.push('建议家长指导')
        break
    }

    return warnings
  }

  /**
   * 过滤内容（根据用户设置）
   */
  static filterContent(
    content: string,
    userSettings: {
      showAdultContent: boolean
      maxRating: ContentRating
    }
  ): string | null {
    const metadata = this.analyzeContent(content)

    // 检查是否允许显示成人内容
    if (metadata.isAdult && !userSettings.showAdultContent) {
      return null
    }

    // 检查评级限制
    const ratingOrder: ContentRating[] = ['G', 'PG-13', 'R-18', 'R-21']
    const contentRatingIndex = ratingOrder.indexOf(metadata.rating)
    const maxRatingIndex = ratingOrder.indexOf(userSettings.maxRating)

    if (contentRatingIndex > maxRatingIndex) {
      return null
    }

    return content
  }

  /**
   * 生成内容预览（隐藏敏感部分）
   */
  static generateSafePreview(content: string, maxLength: number = 200): string {
    const metadata = this.analyzeContent(content)
    
    if (metadata.isAdult) {
      return '[成人内容 - 需要验证后查看]'
    }

    // 截取安全的预览内容
    const preview = content.substring(0, maxLength)
    return preview + (content.length > maxLength ? '...' : '')
  }
}