import Dexie, { type Table } from 'dexie'

export interface Book {
  id?: number
  title: string
  author: string
  cover?: string
  totalChapters: number
  addedDate: Date
  lastReadDate?: Date
  fileSize: number
  format: 'txt' | 'epub' | 'pdf'
  rating?: 'G' | 'PG-13' | 'R-18'
  isAdult?: boolean
}

export interface Chapter {
  id?: number
  bookId: number
  chapterIndex: number
  title: string
  content: string
}

export interface ReadingProgress {
  bookId: number
  chapterIndex: number
  scrollPosition: number
  percentage: number
  lastReadDate: Date
}

export interface Bookmark {
  id?: number
  bookId: number
  chapterIndex: number
  position: number
  note?: string
  createdAt: Date
}

export interface Settings {
  key: string
  value: any
}

class NovelReaderDB extends Dexie {
  books!: Table<Book>
  chapters!: Table<Chapter>
  progress!: Table<ReadingProgress>
  bookmarks!: Table<Bookmark>
  settings!: Table<Settings>

  constructor() {
    super('NovelReaderDB')
    
    this.version(1).stores({
      books: '++id, title, author, addedDate, lastReadDate',
      chapters: '++id, bookId, chapterIndex, [bookId+chapterIndex]',
      progress: 'bookId, lastReadDate',
      bookmarks: '++id, bookId, chapterIndex, createdAt',
      settings: 'key'
    })
  }
}

export const db = new NovelReaderDB()