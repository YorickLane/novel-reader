<template>
  <div class="book-shelf p-4">
    <!-- Tailwind 测试 -->
    <div class="hidden">
      <div class="h-12 w-12 bg-red-500"></div>
    </div>
    <!-- 上传区域 -->
    <div class="upload-area mb-6 flex flex-wrap gap-3">
      <label
        for="file-upload"
        class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>添加书籍</span>
      </label>
      <input
        id="file-upload"
        type="file"
        @change="handleFileUpload"
        accept=".txt,.epub"
        multiple
        class="hidden"
      />
      
      <!-- 批量导入按钮（隐私模式下显示） -->
      <router-link
        v-if="privacyStore.canAccessAdultContent"
        to="/batch-import"
        class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>批量导入</span>
      </router-link>
      
      <!-- 开发模式按钮 -->
      <button
        @click="router.push('/dev-reader')"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
        title="开发模式：直接查看《乡欲》"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span>开发模式</span>
      </button>
      
      <!-- 测试导入按钮（开发环境） -->
      <button
        @click="importTestBooks"
        class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <span>测试导入</span>
      </button>
      
      <!-- 人物图鉴按钮 -->
      <button
        @click="router.push('/characters')"
        class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
        title="查看人物图鉴"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>人物图鉴</span>
      </button>
      
      <!-- 清空数据按钮（开发环境） -->
      <button
        v-if="books.length > 0"
        @click="clearAllBooks"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>清空所有</span>
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="mt-2 text-gray-600">加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- 书籍列表 -->
    <div v-if="!loading && books.length === 0" class="text-center py-16 text-gray-500">
      <svg 
        class="mx-auto text-gray-400 mb-4 w-12 h-12" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p>还没有添加任何书籍</p>
      <p class="text-sm mt-2">点击上方按钮添加你的第一本书</p>
    </div>

    <div v-else-if="displayedBooks.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="book in displayedBooks"
        :key="book.id"
        class="book-item group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        @click="openBook(book.id!)"
      >
        <!-- 封面占位符 -->
        <div class="aspect-[3/4] bg-gradient-to-br flex items-center justify-center relative"
          :class="book.isAdult ? 'from-purple-500 to-pink-500' : 'from-blue-400 to-purple-500'">
          <svg class="w-16 h-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          
          <!-- 成人内容标记 -->
          <div v-if="book.isAdult" class="absolute top-2 left-2">
            <span class="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              {{ book.rating || 'R-18' }}
            </span>
          </div>
          
          <!-- 模糊效果（普通模式下） -->
          <div v-if="book.isAdult && !privacyStore.canAccessAdultContent && privacyStore.blurCovers"
            class="absolute inset-0 backdrop-blur-md bg-black bg-opacity-30 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        <!-- 书籍信息 -->
        <div class="p-3">
          <h3 class="font-semibold text-gray-800 truncate" :title="book.title">{{ book.title }}</h3>
          <p class="text-sm text-gray-600">{{ book.author }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ book.totalChapters }} 章</p>
        </div>

        <!-- 删除按钮 -->
        <button
          @click.stop="confirmDelete(book)"
          class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="删除书籍"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 隐私模式提示 -->
    <div v-if="books.length > displayedBooks.length" class="mt-8 text-center p-4 bg-purple-50 rounded-lg">
      <p class="text-purple-800 flex items-center justify-center">
        <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>有 {{ books.length - displayedBooks.length }} 本私密书籍已隐藏。</span>
        <button @click="togglePrivacyMode" class="text-purple-600 hover:text-purple-800 underline ml-1">
          开启隐私模式查看
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStorage } from '@/composables/useBookStorage'
import { usePrivacyStore } from '@/stores/privacy'
import { db, type Book } from '@/services/database'

const router = useRouter()
const privacyStore = usePrivacyStore()
const { books, loading, error, addBook, fetchBooks, deleteBook } = useBookStorage()

// 过滤显示的书籍
const displayedBooks = computed(() => {
  if (privacyStore.canAccessAdultContent) {
    // 隐私模式下显示所有内容
    return books.value
  }
  
  // 普通模式下过滤成人内容
  return books.value.filter(book => !book.isAdult)
})

onMounted(() => {
  fetchBooks()
})

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  for (const file of files) {
    await addBook(file)
  }
  
  // 清空输入，允许重复选择相同文件
  target.value = ''
}

const openBook = (bookId: number) => {
  router.push(`/reader/${bookId}`)
}

const confirmDelete = async (book: Book) => {
  if (confirm(`确定要删除《${book.title}》吗？`)) {
    if (book.id) {
      await deleteBook(book.id)
    }
  }
}

const togglePrivacyMode = () => {
  console.log('[BookShelf] 触发隐私模式切换事件')
  // 触发隐私模式切换，这会显示认证对话框
  window.dispatchEvent(new CustomEvent('toggle-privacy-mode'))
}

// 导入测试书籍
const importTestBooks = async () => {
  // 先检查是否已存在同名书籍
  const existingBooks = books.value.map(b => b.title)
  
  const testBooks = [
    {
      title: '深圳梦',
      author: '佚名',
      content: `第一章 南下列车

火车在夜色中疾驰，陈宇靠在硬座的椅背上，看着窗外飞速后退的景物。这是他第一次离开家乡，前往那个传说中遍地是黄金的城市——深圳。

口袋里只有不到一千块钱，这是他打工三个月攒下的全部积蓄。他知道这点钱在深圳可能连一个月的房租都不够，但他还是义无反顾地踏上了这趟列车。

"年轻人，第一次去深圳？"旁边一个中年男人搭话道。

陈宇点点头："是的，大哥。"

"去那边有什么打算吗？"

"先找份工作，然后......"陈宇顿了顿，"然后再说吧。"

中年男人笑了笑："年轻就是好啊，有的是机会。我第一次去深圳的时候，也是像你这样，什么都没有，就带着一腔热血。"

"那您现在......"

"混得还行吧，开了个小厂。"中年男人递过来一张名片，"到了深圳如果需要帮助，可以联系我。"

陈宇接过名片，上面写着"深圳市宏达电子厂 总经理 王建国"。他小心地把名片收进钱包里，这是他来到这个陌生城市的第一个联系人。

火车继续向南疾驰，陈宇的心也随着车轮的节奏激动地跳动着。他不知道前方等待他的是什么，但他相信，只要肯努力，一定能在这个城市站稳脚跟。

第二章 初到深圳

清晨六点，火车缓缓驶入深圳站。陈宇提着简单的行李走出车站，迎面而来的是湿热的空气和嘈杂的人声。

站前广场上，到处都是拉客的人："住宿吗？便宜的旅馆！""找工作吗？包吃包住！""去关内吗？拼车走！"

陈宇有些茫然地站在人群中，不知道该往哪里走。他想起王建国的名片，但现在还太早，不好意思打扰别人。

"小伙子，找工作？"一个瘦高的男人凑了过来。

"是的。"陈宇警惕地看着他。

"我们厂正在招工，包吃包住，月薪3500，要不要去看看？"

陈宇心动了，但还是谨慎地问："什么厂？在哪里？"

"电子厂，在龙华那边。现在可以带你过去，车费50块。"

陈宇想了想，决定先去看看。上了面包车，车上已经坐了好几个和他年纪差不多的年轻人，看样子都是刚来深圳找工作的。

车子在城市里穿行，陈宇贪婪地看着窗外的景色。高楼大厦、车水马龙，这个城市的繁华超出了他的想象。`,
      isAdult: true,
      rating: 'R-18'
    },
    {
      title: '普通小说',
      author: '张三',
      content: `第一章 春天的故事

春天来了，公园里的花都开了。小明背着书包走在上学的路上，心情格外愉快。

今天是他转学到新学校的第一天，虽然有些紧张，但更多的是期待。妈妈说，新学校有很大的图书馆，还有漂亮的操场。

"小明！"身后传来一个声音。

小明回头一看，是邻居家的小华。

"你也在这个学校上学吗？"小明惊喜地问。

"是啊，我在三年级二班。你呢？"

"我也是三年级，不过是在一班。"

两个小伙伴一起走向学校，路上有说有笑。春天的阳光洒在他们身上，一切都显得那么美好。

第二章 新朋友

教室里，班主任李老师正在给大家介绍新同学。

"这是我们班的新同学小明，大家欢迎！"

同学们热烈鼓掌，小明有些不好意思地站在讲台上。

"小明，你来做个自我介绍吧。"李老师温柔地说。

"大家好，我叫小明，今年9岁。我喜欢看书和画画，希望能和大家成为好朋友。"

"好的，小明你坐到小红旁边吧。小红，你要多帮助新同学哦。"

小红是个扎着马尾辫的女孩，她友好地对小明笑了笑："你好，以后我们就是同桌了。"`,
      isAdult: false
    }
  ]
  
  // 过滤掉已存在的书籍
  const booksToImport = testBooks.filter(book => !existingBooks.includes(book.title))
  
  if (booksToImport.length === 0) {
    alert('测试书籍已存在，无需重复导入！')
    return
  }
  
  for (const book of booksToImport) {
    const blob = new Blob([book.content], { type: 'text/plain; charset=utf-8' })
    const file = new File([blob], `${book.title}.txt`, { type: 'text/plain' })
    await addBook(file, { isAdult: book.isAdult, rating: book.rating })
  }
  
  alert(`成功导入 ${booksToImport.length} 本测试书籍！`)
}

// 清空所有书籍
const clearAllBooks = async () => {
  if (!confirm('确定要清空所有书籍吗？此操作不可恢复！')) {
    return
  }
  
  try {
    // 获取所有书籍ID
    const bookIds = books.value.map(book => book.id).filter(id => id !== undefined)
    
    // 删除所有章节
    for (const bookId of bookIds) {
      await db.chapters.where('bookId').equals(bookId).delete()
    }
    
    // 删除所有书籍
    await db.books.clear()
    
    // 刷新列表
    await fetchBooks()
    
    alert('所有书籍已清空！')
  } catch (error) {
    console.error('清空书籍失败:', error)
    alert('清空失败，请重试！')
  }
}
</script>