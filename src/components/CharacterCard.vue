<template>
  <div 
    class="character-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
    @click="$emit('click', character)"
  >
    <!-- 头部信息 -->
    <div class="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <h3 class="text-xl font-bold">{{ character.name }}</h3>
      <p class="text-sm opacity-90">{{ character.role }}</p>
    </div>
    
    <!-- 基础信息 -->
    <div class="p-4">
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span class="text-gray-600">年龄：</span>
          <span class="font-medium">{{ character.age }}岁</span>
        </div>
        <div>
          <span class="text-gray-600">身高：</span>
          <span class="font-medium">{{ character.height }}</span>
        </div>
        <div>
          <span class="text-gray-600">体重：</span>
          <span class="font-medium">{{ character.weight }}</span>
        </div>
        <div>
          <span class="text-gray-600">体型：</span>
          <span class="font-medium">{{ character.build }}</span>
        </div>
      </div>
      
      <!-- 外貌特征 -->
      <div class="mt-4">
        <h4 class="font-semibold text-gray-700 mb-2">外貌特征</h4>
        <p class="text-sm text-gray-600 line-clamp-3">
          {{ character.appearance.face }}
        </p>
        <div class="flex flex-wrap gap-1 mt-2">
          <span 
            v-for="(feature, index) in character.appearance.distinguishingFeatures.slice(0, 3)" 
            :key="index"
            class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
          >
            {{ feature }}
          </span>
        </div>
      </div>
      
      <!-- 性格标签 -->
      <div class="mt-4">
        <h4 class="font-semibold text-gray-700 mb-2">性格特点</h4>
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="(trait, index) in character.personality.slice(0, 4)" 
            :key="index"
            class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
          >
            {{ trait }}
          </span>
        </div>
      </div>
      
      <!-- 私密信息提示（需要解锁） -->
      <div v-if="showPrivate && isLocked" class="mt-4 p-3 bg-gray-100 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600">
            <svg class="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            私密档案
          </span>
          <button 
            @click.stop="$emit('unlock', character.id)"
            class="text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
          >
            解锁查看
          </button>
        </div>
      </div>
      
      <!-- 私密信息预览（已解锁） -->
      <div v-else-if="showPrivate && !isLocked" class="mt-4 p-3 bg-pink-50 rounded-lg">
        <h4 class="font-semibold text-pink-700 mb-2 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          私密档案
        </h4>
        <div class="text-xs text-gray-600 space-y-1">
          <div>
            <span class="font-medium">敏感部位：</span>
            {{ character.sexualTraits.sensitivity.slice(0, 3).join('、') }}...
          </div>
          <div>
            <span class="font-medium">性经验：</span>
            {{ character.sexualTraits.experience.slice(0, 20) }}...
          </div>
        </div>
      </div>
    </div>
    
    <!-- 查看详情按钮 -->
    <div class="px-4 pb-4">
      <button 
        @click.stop="$emit('view-detail', character)"
        class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition-colors text-sm font-medium"
      >
        查看详细资料
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '@/types/character'

interface Props {
  character: Character
  showPrivate?: boolean
  isLocked?: boolean
}

defineProps<Props>()

defineEmits<{
  click: [character: Character]
  unlock: [characterId: string]
  'view-detail': [character: Character]
}>()
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>