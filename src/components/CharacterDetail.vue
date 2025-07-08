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
            class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            @click.stop
          >
            <!-- 头部 -->
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
              <div class="flex justify-between items-start">
                <div>
                  <h2 class="text-2xl font-bold mb-1">{{ character.name }}</h2>
                  <p class="text-lg opacity-90">{{ character.role }} · {{ character.age }}岁</p>
                </div>
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
            
            <!-- 内容区域 -->
            <div class="overflow-y-auto max-h-[calc(90vh-120px)]">
              <!-- Tab 导航 -->
              <div class="border-b border-gray-200">
                <nav class="flex -mb-px">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="currentTab = tab.id"
                    :class="[
                      'py-3 px-6 text-sm font-medium transition-colors',
                      currentTab === tab.id 
                        ? 'border-b-2 border-purple-500 text-purple-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    ]"
                  >
                    {{ tab.label }}
                    <svg 
                      v-if="tab.locked && isTabLocked(tab.id)" 
                      class="inline-block w-3 h-3 ml-1"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
              
              <!-- Tab 内容 -->
              <div class="p-6">
                <!-- 基础信息 -->
                <div v-if="currentTab === 'basic'" class="space-y-6">
                  <!-- 基本数据 -->
                  <div>
                    <h3 class="text-lg font-semibold mb-3">基本信息</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div class="bg-gray-50 p-3 rounded">
                        <p class="text-sm text-gray-600">身高</p>
                        <p class="font-semibold">{{ character.height }}</p>
                      </div>
                      <div class="bg-gray-50 p-3 rounded">
                        <p class="text-sm text-gray-600">体重</p>
                        <p class="font-semibold">{{ character.weight }}</p>
                      </div>
                      <div class="bg-gray-50 p-3 rounded">
                        <p class="text-sm text-gray-600">体型</p>
                        <p class="font-semibold">{{ character.build }}</p>
                      </div>
                      <div class="bg-gray-50 p-3 rounded">
                        <p class="text-sm text-gray-600">职业</p>
                        <p class="font-semibold">{{ character.occupation }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 外貌描述 -->
                  <div>
                    <h3 class="text-lg font-semibold mb-3">外貌特征</h3>
                    <div class="space-y-2">
                      <p><span class="font-medium">脸型：</span>{{ character.appearance.face }}</p>
                      <p><span class="font-medium">肤色：</span>{{ character.appearance.skin }}</p>
                      <p><span class="font-medium">发型：</span>{{ character.appearance.hair }}</p>
                      <p><span class="font-medium">眼睛：</span>{{ character.appearance.eyes }}</p>
                      <p><span class="font-medium">嘴唇：</span>{{ character.appearance.lips }}</p>
                    </div>
                    <div class="mt-3">
                      <p class="font-medium mb-2">特殊标记：</p>
                      <div class="flex flex-wrap gap-2">
                        <span 
                          v-for="(feature, index) in character.appearance.distinguishingFeatures" 
                          :key="index"
                          class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                        >
                          {{ feature }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 性格特点 -->
                  <div>
                    <h3 class="text-lg font-semibold mb-3">性格特点</h3>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="(trait, index) in character.personality" 
                        :key="index"
                        class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {{ trait }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- 背景故事 -->
                  <div>
                    <h3 class="text-lg font-semibold mb-3">背景故事</h3>
                    <p class="text-gray-700 leading-relaxed">{{ character.background }}</p>
                  </div>
                </div>
                
                <!-- 身体详情 -->
                <div v-if="currentTab === 'body'" class="space-y-6">
                  <div class="bg-yellow-50 p-4 rounded-lg mb-4">
                    <p class="text-sm text-yellow-800">
                      <svg class="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      以下内容包含详细身体描写
                    </p>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-semibold mb-2">上半身</h4>
                      <div class="space-y-2 text-sm">
                        <p><span class="font-medium">胸部：</span>{{ character.body.chest }}</p>
                        <p><span class="font-medium">乳头：</span>{{ character.body.nipples }}</p>
                        <p><span class="font-medium">腹肌：</span>{{ character.body.abs }}</p>
                        <p><span class="font-medium">腰部：</span>{{ character.body.waist }}</p>
                        <p><span class="font-medium">手臂：</span>{{ character.body.arms }}</p>
                      </div>
                    </div>
                    <div>
                      <h4 class="font-semibold mb-2">下半身</h4>
                      <div class="space-y-2 text-sm">
                        <p><span class="font-medium">臀部：</span>{{ character.body.hips }}</p>
                        <p><span class="font-medium">大腿：</span>{{ character.body.thighs }}</p>
                        <p><span class="font-medium">小腿：</span>{{ character.body.calves }}</p>
                        <p><span class="font-medium">手部：</span>{{ character.body.hands }}</p>
                        <p><span class="font-medium">脚部：</span>{{ character.body.feet }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 其他特征 -->
                  <div v-if="character.voiceDescription || character.scent">
                    <h4 class="font-semibold mb-2">其他特征</h4>
                    <div class="space-y-2 text-sm">
                      <p v-if="character.voiceDescription">
                        <span class="font-medium">声音：</span>{{ character.voiceDescription }}
                      </p>
                      <p v-if="character.scent">
                        <span class="font-medium">体味：</span>{{ character.scent }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- 私密档案 -->
                <div v-if="currentTab === 'private'">
                  <!-- 未解锁提示 -->
                  <div v-if="isTabLocked('private')" class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p class="text-gray-600 mb-4">私密档案需要解锁后查看</p>
                    <button 
                      @click="$emit('unlock', character.id)"
                      class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      解锁查看
                    </button>
                  </div>
                  
                  <!-- 私密内容 -->
                  <div v-else class="space-y-6">
                    <div class="bg-pink-50 p-4 rounded-lg">
                      <p class="text-sm text-pink-800">
                        <svg class="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        以下内容包含成人内容描写
                      </p>
                    </div>
                    
                    <!-- 生殖器详情 -->
                    <div>
                      <h4 class="font-semibold mb-3">生殖器官</h4>
                      <div class="bg-gray-50 p-4 rounded space-y-3">
                        <div>
                          <p class="font-medium text-purple-700 mb-2">阴茎详情</p>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <p><span class="font-medium">疲软长度：</span>{{ character.privateAnatomy.penis.lengthFlaccid }}</p>
                            <p><span class="font-medium">勃起长度：</span>{{ character.privateAnatomy.penis.lengthErect }}</p>
                            <p><span class="font-medium">粗细：</span>{{ character.privateAnatomy.penis.girth }}</p>
                            <p><span class="font-medium">形状：</span>{{ character.privateAnatomy.penis.shape }}</p>
                            <p><span class="font-medium">颜色：</span>{{ character.privateAnatomy.penis.color }}</p>
                            <p><span class="font-medium">包皮：</span>{{ character.privateAnatomy.penis.foreskin }}</p>
                            <p><span class="font-medium">龟头：</span>{{ character.privateAnatomy.penis.glans }}</p>
                            <p><span class="font-medium">血管：</span>{{ character.privateAnatomy.penis.veins }}</p>
                            <p><span class="font-medium">阴毛：</span>{{ character.privateAnatomy.penis.pubicHair }}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p class="font-medium text-purple-700 mb-2">睾丸</p>
                          <div class="text-sm space-y-1">
                            <p><span class="font-medium">大小：</span>{{ character.privateAnatomy.testicles.size }}</p>
                            <p><span class="font-medium">下垂度：</span>{{ character.privateAnatomy.testicles.hang }}</p>
                            <p><span class="font-medium">描述：</span>{{ character.privateAnatomy.testicles.description }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 臀部与肛门 -->
                    <div>
                      <h4 class="font-semibold mb-3">臀部与后庭</h4>
                      <div class="bg-gray-50 p-4 rounded space-y-3">
                        <div>
                          <p class="font-medium text-purple-700 mb-2">臀部</p>
                          <div class="text-sm space-y-1">
                            <p><span class="font-medium">形状：</span>{{ character.privateAnatomy.buttocks.shape }}</p>
                            <p><span class="font-medium">大小：</span>{{ character.privateAnatomy.buttocks.size }}</p>
                            <p><span class="font-medium">紧实度：</span>{{ character.privateAnatomy.buttocks.firmness }}</p>
                            <p v-if="character.privateAnatomy.buttocks.dimples">
                              <span class="font-medium">特征：</span>有腰窝
                            </p>
                            <p><span class="font-medium">描述：</span>{{ character.privateAnatomy.buttocks.description }}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p class="font-medium text-purple-700 mb-2">肛门</p>
                          <div class="text-sm space-y-1">
                            <p><span class="font-medium">紧致度：</span>{{ character.privateAnatomy.anus.tightness }}</p>
                            <p><span class="font-medium">颜色：</span>{{ character.privateAnatomy.anus.color }}</p>
                            <p><span class="font-medium">质感：</span>{{ character.privateAnatomy.anus.texture }}</p>
                            <p><span class="font-medium">毛发：</span>{{ character.privateAnatomy.anus.hairiness }}</p>
                            <p><span class="font-medium">敏感度：</span>{{ character.privateAnatomy.anus.sensitivity }}</p>
                            <p><span class="font-medium">经验：</span>{{ character.privateAnatomy.anus.experience }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 性特征 -->
                    <div>
                      <h4 class="font-semibold mb-3">性特征</h4>
                      <div class="space-y-2">
                        <p><span class="font-medium">性经验：</span>{{ character.sexualTraits.experience }}</p>
                        <p><span class="font-medium">性偏好：</span>{{ character.sexualTraits.preference }}</p>
                        <p><span class="font-medium">持久力：</span>{{ character.sexualTraits.stamina }}</p>
                        <p><span class="font-medium">性欲强度：</span>{{ character.sexualTraits.libido }}</p>
                        <div>
                          <span class="font-medium">敏感部位：</span>
                          <span class="text-purple-600">{{ character.sexualTraits.sensitivity.join('、') }}</span>
                        </div>
                        <div v-if="character.sexualTraits.kinks.length > 0">
                          <span class="font-medium">特殊癖好：</span>
                          <div class="flex flex-wrap gap-2 mt-1">
                            <span 
                              v-for="(kink, index) in character.sexualTraits.kinks" 
                              :key="index"
                              class="bg-pink-100 text-pink-700 px-2 py-1 rounded text-sm"
                            >
                              {{ kink }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 秘密 -->
                <div v-if="currentTab === 'secrets' && character.secrets">
                  <div v-if="isTabLocked('secrets')" class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p class="text-gray-600 mb-4">秘密档案需要解锁后查看</p>
                    <button 
                      @click="$emit('unlock', character.id)"
                      class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      解锁查看
                    </button>
                  </div>
                  
                  <div v-else>
                    <h3 class="text-lg font-semibold mb-4">不为人知的秘密</h3>
                    <div class="space-y-3">
                      <div 
                        v-for="(secret, index) in character.secrets" 
                        :key="index"
                        class="bg-gray-50 p-4 rounded-lg"
                      >
                        <p class="text-gray-700">
                          <span class="text-purple-600 font-medium">秘密 {{ index + 1 }}：</span>
                          {{ secret }}
                        </p>
                      </div>
                    </div>
                  </div>
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
import { ref, computed } from 'vue'
import type { Character } from '@/types/character'

interface Props {
  modelValue: boolean
  character: Character
  unlockedTabs?: string[]
}

interface Tab {
  id: string
  label: string
  locked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  unlockedTabs: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'unlock': [characterId: string]
}>()

const currentTab = ref('basic')

const tabs: Tab[] = [
  { id: 'basic', label: '基础信息' },
  { id: 'body', label: '身体详情' },
  { id: 'private', label: '私密档案', locked: true },
  { id: 'secrets', label: '秘密', locked: true }
]

const isTabLocked = (tabId: string) => {
  const tab = tabs.find(t => t.id === tabId)
  return tab?.locked && !props.unlockedTabs.includes(tabId)
}

const close = () => {
  emit('update:modelValue', false)
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close()
  }
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