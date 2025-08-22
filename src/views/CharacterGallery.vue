<template>
  <div class="character-gallery min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">人物图鉴</h1>
            <p class="text-lg opacity-90">《神陆纪元》主要角色档案</p>
          </div>
          <button
            @click="router.back()"
            class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 筛选栏 -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">角色分类：</span>
            <div class="flex space-x-2">
              <button
                v-for="role in roles"
                :key="role.value"
                @click="selectedRole = role.value"
                :class="[
                  'px-4 py-1 rounded-full text-sm transition-colors',
                  selectedRole === role.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ role.label }}
              </button>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="showPrivate"
                class="mr-2"
              >
              <span class="text-sm text-gray-700">显示私密信息</span>
            </label>
            
            <button
              @click="toggleView"
              class="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              title="切换视图"
            >
              <svg v-if="viewMode === 'grid'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 角色列表 -->
    <div class="container mx-auto px-4 py-8">
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CharacterCard
          v-for="character in filteredCharacters"
          :key="character.id"
          :character="character"
          :show-private="showPrivate"
          :is-locked="!unlockedCharacters.includes(character.id)"
          @click="selectCharacter"
          @unlock="unlockCharacter"
          @view-detail="showCharacterDetail"
        />
      </div>
      
      <!-- 列表视图 -->
      <div v-else class="space-y-4">
        <div
          v-for="character in filteredCharacters"
          :key="character.id"
          @click="showCharacterDetail(character)"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-4 mb-3">
                <h3 class="text-xl font-bold">{{ character.name }}</h3>
                <span class="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  {{ character.role }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span class="text-sm text-gray-600">年龄：</span>
                  <span class="font-medium">{{ character.age }}岁</span>
                </div>
                <div>
                  <span class="text-sm text-gray-600">身高：</span>
                  <span class="font-medium">{{ character.height }}</span>
                </div>
                <div>
                  <span class="text-sm text-gray-600">体型：</span>
                  <span class="font-medium">{{ character.build }}</span>
                </div>
                <div>
                  <span class="text-sm text-gray-600">职业：</span>
                  <span class="font-medium">{{ character.occupation }}</span>
                </div>
              </div>
              
              <p class="text-gray-700 mb-3">{{ character.appearance.face }}</p>
              
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(trait, index) in character.personality.slice(0, 3)"
                  :key="index"
                  class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {{ trait }}
                </span>
              </div>
            </div>
            
            <div class="ml-4">
              <button
                @click.stop="showCharacterDetail(character)"
                class="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 对比功能 -->
      <div v-if="selectedCharacters.length > 1" class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">已选择 {{ selectedCharacters.length }} 个角色</span>
              <div class="flex -space-x-2">
                <div
                  v-for="char in selectedCharacters.slice(0, 5)"
                  :key="char.id"
                  class="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold border-2 border-white"
                >
                  {{ char.name.charAt(0) }}
                </div>
                <div
                  v-if="selectedCharacters.length > 5"
                  class="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-bold border-2 border-white"
                >
                  +{{ selectedCharacters.length - 5 }}
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <button
                @click="clearSelection"
                class="text-sm text-gray-600 hover:text-gray-800"
              >
                清除选择
              </button>
              <button
                @click="showComparison"
                class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                对比角色
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 角色详情弹窗 -->
    <CharacterDetail
      v-if="selectedCharacter"
      v-model="showDetail"
      :character="selectedCharacter"
      :unlocked-tabs="getUnlockedTabs(selectedCharacter.id)"
      @unlock="unlockCharacter"
    />
    
    <!-- 角色对比弹窗 -->
    <CharacterComparison
      v-if="showComparisonModal"
      v-model="showComparisonModal"
      :characters="selectedCharacters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { allCharacters } from '@/data/characters'
import type { Character } from '@/types/character'
import CharacterCard from '@/components/CharacterCard.vue'
import CharacterDetail from '@/components/CharacterDetail.vue'
import CharacterComparison from '@/components/CharacterComparison.vue'

const router = useRouter()

// 状态
const viewMode = ref<'grid' | 'list'>('grid')
const selectedRole = ref('all')
const showPrivate = ref(false)
const selectedCharacter = ref<Character | null>(null)
const showDetail = ref(false)
const selectedCharacters = ref<Character[]>([])
const showComparisonModal = ref(false)
const unlockedCharacters = ref<string[]>([])

// 角色分类
const roles = [
  { value: 'all', label: '全部' },
  { value: '主角', label: '主角' }
]

// 过滤角色
const filteredCharacters = computed(() => {
  if (selectedRole.value === 'all') {
    return allCharacters
  }
  return allCharacters.filter(char => char.role === selectedRole.value)
})

// 获取解锁的标签页
const getUnlockedTabs = (characterId: string) => {
  if (unlockedCharacters.value.includes(characterId)) {
    return ['private', 'secrets']
  }
  return []
}

// 切换视图
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

// 选择角色（用于对比）
const selectCharacter = (character: Character) => {
  const index = selectedCharacters.value.findIndex(c => c.id === character.id)
  if (index > -1) {
    selectedCharacters.value.splice(index, 1)
  } else {
    selectedCharacters.value.push(character)
  }
}

// 显示角色详情
const showCharacterDetail = (character: Character) => {
  selectedCharacter.value = character
  showDetail.value = true
}

// 解锁角色
const unlockCharacter = (characterId: string) => {
  if (!unlockedCharacters.value.includes(characterId)) {
    unlockedCharacters.value.push(characterId)
  }
}

// 清除选择
const clearSelection = () => {
  selectedCharacters.value = []
}

// 显示对比
const showComparison = () => {
  showComparisonModal.value = true
}
</script>