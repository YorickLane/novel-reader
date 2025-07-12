/**
 * 《乡欲》人物数据
 */

import type { Character } from '@/types/character'

// 陈宇 - 主角
export const chenYu: Character = {
  id: 'chen-yu',
  name: '陈宇',
  age: 26,
  height: '183cm',
  weight: '78kg',
  build: '健壮有型',
  role: '主角',
  
  appearance: {
    face: '方形脸，轮廓分明，下颌线条硬朗',
    skin: '健康的小麦色，阳光晒出的野性肤色',
    hair: '黑色短发，寸头造型，干净利落',
    eyes: '剑眉星目，眼神深邃有神，透着坚毅',
    lips: '薄唇紧抿，嘴角微微上扬带着自信',
    distinguishingFeatures: [
      '左眉有道硬汉疤痕（格斗训练留下）',
      '下巴有浅浅的美人沟',
      '颈部有明显的喉结'
    ]
  },
  
  body: {
    chest: '宽阔厚实的胸膛，胸肌发达，中缝深邃',
    nipples: '深褐色，男性化特征明显',
    abs: '八块腹肌棱角分明，人鱼线性感',
    waist: '腰身强健有力，倒三角身材',
    hips: '臀部紧实上翘，肌肉感十足',
    thighs: '大腿粗壮有力，肌肉线条清晰',
    calves: '小腿肌肉发达，爆发力十足',
    arms: '手臂粗壮，肱二头肌饱满',
    hands: '手掌宽大，指节粗壮，满是老茧',
    feet: '脚掌宽大，典型的男人脚'
  },
  
  privateAnatomy: {
    penis: {
      lengthFlaccid: '14cm',
      lengthErect: '20cm',
      girth: '粗壮有力，握感充实',
      shape: '笔直挺拔，霸气十足',
      color: '深褐色，充满男性荷尔蒙',
      foreskin: '环切状态，龟头常年外露',
      glans: '龟头硕大威猛，颜色深沉',
      veins: '青筋暴起，血管粗壮',
      pubicHair: '浓密粗硬，男人味十足'
    },
    testicles: {
      size: '鸡蛋大小，沉甸甸的',
      hang: '低垂有分量，充满力量',
      description: '阴囊皮肤粗糙，有稀疏毛发'
    },
    anus: {
      tightness: '紧实有力，肌肉发达',
      color: '健康的褐色',
      texture: '粗糙有男人味',
      hairiness: '有适量体毛',
      sensitivity: '一般敏感度',
      experience: '纯爷们，从未被碰过'
    },
    buttocks: {
      shape: '肌肉紧实，线条硬朗',
      size: '健壮有力，充满爆发力',
      firmness: '钢铁般坚硬，肌肉感十足',
      dimples: false,
      description: '典型的运动员臀部，力量与美感并存'
    }
  },
  
  personality: [
    '沉稳内敛',
    '坚毅果断',
    '责任心强',
    '保护欲强',
    '霸道总裁范'
  ],
  
  background: '高中毕业后南下广东打工，电子厂、餐厅、快递等工作都做过。8年漂泊攲98万积蓄，决定回乡承包山地搞生态农庄。家里在村里有三层平房，父母务农。',
  
  occupation: '农庄主 / 养殖户',
  
  sexualTraits: {
    experience: '只跟过两个女友，经验不多',
    preference: '自认为喜欢女人，但对男性身体会有反应',
    sensitivity: ['乳头', '耳朵', '腰窝', '会阴', '前列腺'],
    kinks: ['被支配', '轻微疼痛', '言语羞辱'],
    stamina: '年轻体壮，恢复力强',
    libido: '性欲旺盛，单身已久'
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
  habits: ['早起喜鸡鸭', '喜欢游泳', '晚上喜欢喝点酒'],
  secrets: ['对梁志强的身材有好感', '做过关于男人的春梦', '偶尔会看基情小说']
}


// 梁志强 - 小学同学
export const liangZhiQiang: Character = {
  id: 'liang-zhiqiang',
  name: '梁志强',
  age: 28,
  height: '175cm',
  weight: '70kg',
  build: '结实健壮',
  role: '配角',
  
  appearance: {
    face: '国字脸，浓眉大眼，笑起来憨厚',
    skin: '小麦色，常年户外劳作晒黑',
    hair: '黑色短发，略显粗硬',
    eyes: '眼神清澈，带着朴实',
    lips: '唇厚实，常带笑意',
    distinguishingFeatures: [
      '右手手背有道疤痕（小时候被狗咬的）',
      '左臂有个纹身（年轻时纹的龙）',
      '笑起来有酒窝'
    ]
  },
  
  body: {
    chest: '胸肌厚实，不是健身房的那种，但很有力量',
    nipples: '深褐色，偏大',
    abs: '没有明显六块腹肌，但腹部紧实',
    waist: '腰身粗壮，力量型身材',
    hips: '臀部结实有力',
    thighs: '大腿粗壮，爬山下地练出来的',
    calves: '小腿肌肉发达，青筋明显',
    arms: '手臂粗壮有力，前臂肌肉明显',
    hands: '手掌宽大，满是老茧',
    feet: '脚掌宽大，42码'
  },
  
  privateAnatomy: {
    penis: {
      lengthFlaccid: '11cm',
      lengthErect: '16cm',
      girth: '粗壮有力',
      shape: '笔直，略微向左弯曲',
      color: '深褐色',
      foreskin: '包皮过长，勃起时也半包',
      glans: '龟头大而圆润',
      veins: '血管粗壮明显',
      pubicHair: '浓密卷曲'
    },
    testicles: {
      size: '鸡蛋大小',
      hang: '自然下垂',
      description: '阴囊有稀疏毛发'
    },
    anus: {
      tightness: '紧实',
      color: '深褐色',
      texture: '粗糙',
      hairiness: '有适量体毛',
      sensitivity: '一般',
      experience: '无'
    },
    buttocks: {
      shape: '结实有力',
      size: '中等大小',
      firmness: '硬实',
      dimples: false,
      description: '劳动者的臀部，充满力量'
    }
  },
  
  personality: [
    '爽朗直率',
    '讲义气',
    '有点大男人主义',
    '疼老婆孩子',
    '喜欢喝酒'
  ],
  
  background: '土生土长的荔湾村人，初中毕业后学泥水匠。早婚，18岁就结婚生子。老婆在镇上制衣厂打工，周末才回家。平时既要工作又要带孩子，生活压力不小。',
  
  occupation: '泥水匠 / 装修工',
  
  sexualTraits: {
    experience: '只有老婆一个伴侣',
    preference: '传统异性恋',
    sensitivity: ['耳垂', '乳头', '大腿内侧'],
    kinks: ['喜欢主动', '偏好丰满的臀部'],
    stamina: '体力好，持久',
    libido: '一周一次的夫妻生活'
  },
  
  relationships: [
    {
      characterId: 'chen-yu',
      type: '小学同学',
      intimacy: 70,
      history: '多年未见，重逢后感觉亲切'
    }
  ],
  
  status: {
    physical: '健康强壮',
    mental: '略显疲惫，但乐观',
    arousal: 20,
    location: '荔湾村',
    lastUpdate: '第一章'
  },
  
  voiceDescription: '声音洪亮，带点乡音',
  scent: '汗味混合水泥味',
  habits: ['爱打篮球', '喜欢喝酒', '吃槟榔'],
  secrets: ['偶尔会去镇上洗脚城放松', '对陈宇的臀部有好感']
}

// 梁俊浩 - 梁志强的儿子
export const liangJunHao: Character = {
  id: 'liang-junhao',
  name: '梁俊浩',
  age: 10,
  height: '140cm',
  weight: '35kg',
  build: '偏瘦但结实',
  role: '配角',
  
  appearance: {
    face: '虎头虎脑，继承父亲的浓眉大眼',
    skin: '偏黑，但比父亲白一些',
    hair: '黑色短发，略微自然卷',
    eyes: '眼神清亮，充满好奇',
    lips: '唇红齿白',
    distinguishingFeatures: [
      '右脸有个小酒窝',
      '膝盖常年有擦伤',
      '笑起来有两个小虎牙'
    ]
  },
  
  body: {
    chest: '瘦小的胸膛',
    nipples: '小小的粉色',
    abs: '平坦的小肚子',
    waist: '细瘦',
    hips: '小小的',
    thighs: '细瘦但有力',
    calves: '跑得快',
    arms: '细手细脚',
    hands: '小手灵巧',
    feet: '小脚丫'
  },
  
  privateAnatomy: {
    penis: {
      lengthFlaccid: '儿童状态',
      lengthErect: '儿童状态',
      girth: '儿童状态',
      shape: '儿童状态',
      color: '粉红色',
      foreskin: '包皮',
      glans: '小小的',
      veins: '几乎不可见',
      pubicHair: '无'
    },
    testicles: {
      size: '小巧',
      hang: '紧贴',
      description: '儿童状态'
    },
    anus: {
      tightness: '紧密',
      color: '粉色',
      texture: '嫩滑',
      hairiness: '无毛',
      sensitivity: '一般',
      experience: '无'
    },
    buttocks: {
      shape: '小小的圆润',
      size: '小巧',
      firmness: 'Q弹',
      dimples: true,
      description: '小孩子的小屁股'
    }
  },
  
  personality: [
    '活泼好动',
    '话多',
    '好奇心强',
    '调皮但不失礼貌',
    '喜欢缠着大人'
  ],
  
  background: '梁志强和小芳的独子，从小在村里长大。母亲常年在外打工，主要由父亲带大。在村小学读书，成绩中等。',
  
  occupation: '小学生',
  
  sexualTraits: {
    experience: '无',
    preference: '儿童',
    sensitivity: [],
    kinks: [],
    stamina: '儿童',
    libido: '儿童'
  },
  
  relationships: [
    {
      characterId: 'liang-zhiqiang',
      type: '父子',
      intimacy: 95,
      history: '崇拜父亲'
    },
    {
      characterId: 'chen-yu',
      type: '叔叔',
      intimacy: 85,
      history: '对这个新来的叔叔很好奇'
    }
  ],
  
  status: {
    physical: '健康活泼',
    mental: '快乐无忧',
    arousal: 0,
    location: '荔湾村',
    lastUpdate: '第一章'
  },
  
  voiceDescription: '童音，清脆响亮',
  scent: '奶香味混合泥土味',
  habits: ['看动画片', '玩手机游戏', '爬树'],
  secrets: ['偷偷藏了零花钱买玩具']
}

// 所有角色集合
export const allCharacters: Character[] = [
  chenYu,
  liangZhiQiang,
  liangJunHao
]

// 根据ID获取角色
export function getCharacterById(id: string): Character | undefined {
  return allCharacters.find(char => char.id === id)
}

// 根据名字获取角色
export function getCharacterByName(name: string): Character | undefined {
  return allCharacters.find(char => char.name === name)
}