/**
 * 《乡欲》人物数据
 */

import type { Character } from '@/types/character'

// 陈宇 - 主角
export const chenYu: Character = {
  id: 'chen-yu',
  name: '陈宇',
  age: 25,
  height: '176cm',
  weight: '65kg',
  build: '匀称结实',
  role: '主角',
  
  appearance: {
    face: '鹅蛋脸，线条柔和但不失男性气质',
    skin: '小麦色，带着健康的光泽',
    hair: '黑色短发，微微自然卷，总是有几缕不听话地翘起',
    eyes: '杏仁眼，眼尾微微上挑，眼神清澈',
    lips: '嘴唇不厚不薄，颜色偏粉',
    distinguishingFeatures: [
      '左眉有道小疤（小时候爬树摔的）',
      '笑起来右边有个酒窝',
      '耳垂较大，据说有福气'
    ]
  },
  
  body: {
    chest: '胸肌不算大，但形状完美，有清晰的轮廓',
    nipples: '小巧粉嫩，像两颗樱桃',
    abs: '六块腹肌若隐若现，不夸张但很性感',
    waist: '腰身细韧，一只手能握住大半',
    hips: '胯骨适中，臀腰比例完美',
    thighs: '大腿结实有力，内侧皮肤细腻',
    calves: '小腿线条流畅，跟腱明显',
    arms: '手臂修长，肌肉不大但很有力',
    hands: '手指修长，有薄茧',
    feet: '脚型好看，大小适中'
  },
  
  privateAnatomy: {
    penis: {
      lengthFlaccid: '12cm',
      lengthErect: '17cm',
      girth: '中等偏粗，一手刚好握住',
      shape: '微微上翘，弧度优美',
      color: '粉褐色，比身体略深',
      foreskin: '半包状态，勃起时完全露出龟头',
      glans: '龟头饱满圆润，颜色嫩粉',
      veins: '有几条明显的血管，充血时更突出',
      pubicHair: '不多不少，自然生长，呈倒三角'
    },
    testicles: {
      size: '鸽子蛋大小，左右对称',
      hang: '自然下垂，不松不紧',
      description: '皮肤光滑，几乎无毛'
    },
    anus: {
      tightness: '处女穴，褶皱细密',
      color: '浅粉色，非常干净',
      texture: '娇嫩光滑',
      hairiness: '几乎无毛',
      sensitivity: '极度敏感，轻触就会收缩',
      experience: '完全没有被开发过'
    },
    buttocks: {
      shape: '挺翘饱满，像两个熟透的蜜桃',
      size: '不大不小，刚好一手一个',
      firmness: 'Q弹有肉感，拍上去会颤动',
      dimples: true,
      description: '臀部是陈宇身上最诱人的部位，走路时会自然扭动'
    }
  },
  
  personality: [
    '表面内向害羞',
    '其实内心火热',
    '容易脸红',
    '嘴硬心软',
    '有点傲娇'
  ],
  
  background: '大专毕业后在深圳打工三年，996加班、高房租让他身心俱疲。攒了点钱决定回乡创业，想做农产品电商，自由自在。家里条件不错，住着三层平房。',
  
  occupation: '农民 / 电商',
  
  sexualTraits: {
    experience: '手淫经验丰富，但从未与人发生关系',
    preference: '自认为喜欢女人，但对男性身体会有反应',
    sensitivity: ['乳头', '耳朵', '腰窝', '会阴', '前列腺'],
    kinks: ['被支配', '轻微疼痛', '言语羞辱'],
    stamina: '第一次很快，但恢复力强',
    libido: '性欲旺盛，几乎每天都要自慰'
  },
  
  relationships: [],
  
  status: {
    physical: '健康，农活练就的好身体',
    mental: '略显寂寞，渴望刺激',
    arousal: 30,
    location: '荔湾村',
    lastUpdate: '第一章开始'
  },
  
  voiceDescription: '声音清朗，带点乡音，激动时会破音',
  scent: '淡淡的汗味混合着泥土气息',
  habits: ['早起', '爱干净', '喜欢看手机小说'],
  secrets: ['偷偷看过男男片', '对肌肉男有幻想', '曾经偷闻过别人的内裤']
}


// 所有角色集合
export const allCharacters: Character[] = [
  chenYu
]

// 根据ID获取角色
export function getCharacterById(id: string): Character | undefined {
  return allCharacters.find(char => char.id === id)
}

// 根据名字获取角色
export function getCharacterByName(name: string): Character | undefined {
  return allCharacters.find(char => char.name === name)
}