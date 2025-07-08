<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- 内容容器 -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div 
            class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            @click.stop
          >
            <!-- 头部 -->
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">角色对比</h2>
                <button 
                  @click="close"
                  class="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- 对比内容 -->
            <div class="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <!-- 基础信息对比 -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4">基础信息</h3>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left p-2">项目</th>
                        <th v-for="char in characters" :key="char.id" class="p-2 text-center">
                          {{ char.name }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b">
                        <td class="p-2 font-medium">年龄</td>
                        <td v-for="char in characters" :key="char.id" class="p-2 text-center">
                          {{ char.age }}岁
                        </td>
                      </tr>
                      <tr class="border-b">
                        <td class="p-2 font-medium">身高</td>
                        <td v-for="char in characters" :key="char.id" class="p-2 text-center">
                          {{ char.height }}
                        </td>
                      </tr>
                      <tr class="border-b">
                        <td class="p-2 font-medium">体重</td>
                        <td v-for="char in characters" :key="char.id" class="p-2 text-center">
                          {{ char.weight }}
                        </td>
                      </tr>
                      <tr class="border-b">
                        <td class="p-2 font-medium">体型</td>
                        <td v-for="char in characters" :key="char.id" class="p-2 text-center">
                          {{ char.build }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- 身高体型可视化 -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4">身高对比</h3>
                <div class="flex items-end justify-center space-x-8 p-4 bg-gray-50 rounded-lg">
                  <div
                    v-for="char in characters"
                    :key="char.id"
                    class="text-center"
                  >
                    <div 
                      class="w-16 bg-purple-500 rounded-t"
                      :style="{ height: `${getHeightPixels(char.height)}px` }"
                    ></div>
                    <p class="mt-2 text-sm font-medium">{{ char.name }}</p>
                    <p class="text-xs text-gray-600">{{ char.height }}</p>
                  </div>
                </div>
              </div>
              
              <!-- 私密部位对比（需要解锁） -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                  私密部位对比
                  <svg class="w-4 h-4 ml-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </h3>
                
                <div class="bg-pink-50 p-4 rounded-lg">
                  <div class="overflow-x-auto">
                    <table class="w-full">
                      <thead>
                        <tr class="border-b border-pink-200">
                          <th class="text-left p-2">项目</th>
                          <th v-for="char in characters" :key="char.id" class="p-2 text-center">
                            {{ char.name }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="border-b border-pink-100">
                          <td class="p-2 font-medium">疲软长度</td>
                          <td v-for="char in characters" :key="char.id" class="p-2 text-center">
                            {{ char.privateAnatomy.penis.lengthFlaccid }}
                          </td>
                        </tr>
                        <tr class="border-b border-pink-100">
                          <td class="p-2 font-medium">勃起长度</td>
                          <td v-for="char in characters" :key="char.id" class="p-2 text-center font-semibold text-purple-600">
                            {{ char.privateAnatomy.penis.lengthErect }}
                          </td>
                        </tr>
                        <tr class="border-b border-pink-100">
                          <td class="p-2 font-medium">粗细</td>
                          <td v-for="char in characters" :key="char.id" class="p-2 text-center text-sm">
                            {{ char.privateAnatomy.penis.girth }}
                          </td>
                        </tr>
                        <tr class="border-b border-pink-100">
                          <td class="p-2 font-medium">臀部</td>
                          <td v-for="char in characters" :key="char.id" class="p-2 text-center text-sm">
                            {{ char.privateAnatomy.buttocks.shape }}
                          </td>
                        </tr>
                        <tr class="border-b border-pink-100">
                          <td class="p-2 font-medium">后庭经验</td>
                          <td v-for="char in characters" :key="char.id" class="p-2 text-center text-sm">
                            {{ char.privateAnatomy.anus.experience }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <!-- 尺寸可视化对比 -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4">尺寸对比图</h3>
                <div class="bg-gray-50 p-6 rounded-lg">
                  <div class="space-y-4">
                    <div v-for="char in characters" :key="char.id">
                      <p class="font-medium mb-2">{{ char.name }}</p>
                      <div class="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          class="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          :style="{ width: `${getLengthPercentage(char.privateAnatomy.penis.lengthErect)}%` }"
                        ></div>
                        <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-white font-medium">
                          {{ char.privateAnatomy.penis.lengthErect }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 性特征对比 -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4">性特征对比</h3>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left p-2">项目</th>
                        <th v-for="char in characters" :key="char.id" class="p-2 text-center">
                          {{ char.name }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b">
                        <td class="p-2 font-medium">性经验</td>
                        <td v-for="char in characters" :key="char.id" class="p-2 text-center text-sm">
                          {{ char.sexualTraits.experience }}
                        </td>
                      </tr>
                      <tr class="border-b">
                        <td class="p-2 font-medium">持久力</td>
                        <td v-for="char in characters" :key="char.id" class="p-2 text-center">
                          {{ char.sexualTraits.stamina }}
                        </td>
                      </tr>
                      <tr class="border-b">
                        <td class="p-2 font-medium">性欲强度</td>
                        <td v-for="char in characters" :key="char.id" class="p-2 text-center">
                          {{ char.sexualTraits.libido }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Character } from '@/types/character'

interface Props {
  modelValue: boolean
  characters: Character[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 关闭弹窗
const close = () => {
  emit('update:modelValue', false)
}

// 处理背景点击
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

// 获取身高像素值（用于可视化）
const getHeightPixels = (height: string): number => {
  const cm = parseInt(height)
  // 170cm = 150px, 190cm = 250px
  return Math.round((cm - 170) * 5 + 150)
}

// 获取长度百分比（用于可视化）
const getLengthPercentage = (length: string): number => {
  const cm = parseInt(length)
  // 最大25cm = 100%
  return Math.round((cm / 25) * 100)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white {
  transform: scale(0.9);
}

.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>