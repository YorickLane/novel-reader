/**
 * 人物角色类型定义
 */

// 外貌特征
export interface Appearance {
  face: string          // 脸型
  skin: string          // 肤色
  hair: string          // 发型
  eyes: string          // 眼睛
  lips: string          // 嘴唇
  distinguishingFeatures: string[]  // 特征
}

// 身体特征
export interface Body {
  chest: string         // 胸部
  nipples: string       // 乳头
  abs: string           // 腹肌
  waist: string         // 腰部
  hips: string          // 臀部
  thighs: string        // 大腿
  calves: string        // 小腿
  arms: string          // 手臂
  hands: string         // 手部
  feet: string          // 脚部
}

// 男性生殖器详情
export interface Penis {
  lengthFlaccid: string    // 疲软长度
  lengthErect: string      // 勃起长度
  girth: string            // 粗细
  shape: string            // 形状
  color: string            // 颜色
  foreskin: string         // 包皮状态
  glans: string            // 龟头描写
  veins: string            // 血管纹理
  pubicHair: string        // 阴毛
}

// 睾丸详情
export interface Testicles {
  size: string             // 大小
  hang: string             // 下垂程度
  description: string      // 其他特征
}

// 肛门详情
export interface Anus {
  tightness: string        // 紧致度
  color: string            // 颜色
  texture: string          // 质感
  hairiness: string        // 周围毛发
  sensitivity: string      // 敏感度
  experience: string       // 使用经验
}

// 臀部详情
export interface Buttocks {
  shape: string            // 形状
  size: string             // 大小
  firmness: string         // 紧实度
  dimples: boolean         // 是否有腰窝
  description: string      // 详细描述
}

// 私密部位综合
export interface PrivateAnatomy {
  penis: Penis
  testicles: Testicles
  anus: Anus
  buttocks: Buttocks
}

// 性特征
export interface SexualTraits {
  experience: string       // 性经验
  preference: string       // 性偏好
  sensitivity: string[]    // 敏感部位
  kinks: string[]         // 特殊癖好
  stamina: string         // 持久力
  libido: string          // 性欲强度
}

// 人物关系
export interface Relationship {
  characterId: string
  type: string            // 关系类型
  intimacy: number        // 亲密度 0-100
  history: string         // 关系历史
}

// 人物状态
export interface CharacterStatus {
  physical: string        // 身体状态
  mental: string          // 精神状态
  arousal: number         // 情欲值 0-100
  location: string        // 当前位置
  lastUpdate: string      // 最后更新时间
}

// 人物角色完整定义
export interface Character {
  id: string
  name: string
  age: number
  height: string
  weight: string
  build: string           // 体型
  role: string            // 角色定位
  
  appearance: Appearance
  body: Body
  privateAnatomy: PrivateAnatomy
  
  personality: string[]   // 性格特点
  background: string      // 背景故事
  occupation: string      // 职业
  
  sexualTraits: SexualTraits
  relationships: Relationship[]
  
  status: CharacterStatus
  
  // 额外信息
  voiceDescription?: string   // 声音描述
  scent?: string             // 体味描述
  habits?: string[]          // 生活习惯
  secrets?: string[]         // 秘密
}

// 人物对比数据
export interface CharacterComparison {
  category: string
  characters: {
    id: string
    value: number | string
  }[]
}