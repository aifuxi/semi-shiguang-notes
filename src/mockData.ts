/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, Comment, UpcomingSchedule, TrafficTrendItem, TrafficSourceItem, SiteHealth, VisitorLog, BlogSettings, FriendLink } from './types';

export const initialLinks: FriendLink[] = [
  {
    id: '1',
    name: '拾光漫步',
    url: 'https://shiguang.example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    description: '记录生活中的小确幸，留存每一抹温柔。',
    category: '生活感悟',
    status: '正常',
    sortOrder: 1,
  },
  {
    id: '2',
    name: '代码与诗',
    url: 'https://codepoetry.example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    description: '用逻辑构建世界，用诗意点缀灵魂。',
    category: '技术博客',
    status: '正常',
    sortOrder: 2,
  },
  {
    id: '3',
    name: '数字极简主义',
    url: 'https://minimalist.example.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
    description: '专注极简生活，摆脱数字噪音，回归纯真。',
    category: '创意设计',
    status: '正常',
    sortOrder: 3,
  },
  {
    id: '4',
    name: '极客风暴',
    url: 'https://geekstorm.example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    description: '探索前沿科技，分享极客折腾日记。',
    category: '技术博客',
    status: '异常',
    sortOrder: 4,
  },
  {
    id: '5',
    name: '云端彼岸',
    url: 'https://cloudside.example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
    description: '渴望交换友链，期待与有温度的你相遇。',
    category: '生活感悟',
    status: '待审核',
    sortOrder: 5,
  }
];

export const initialPosts: Post[] = [
  {
    id: 'post-1',
    title: '在路上小确幸的生活',
    status: '已发布',
    publishTime: '2025-05-19 20:30',
    views: 5842,
    category: '生活随感',
    tags: ['旅行', '感悟'],
    content: '在人生的旅途中，我们常常追求那些宏大的目标。但实际上，真正的幸福往往隐藏在日常的那些微小而确实的喜悦中。比如在异地清晨喝到的一杯醇香咖啡，在夕阳西下时偶遇的林荫大道，或是与路人一次温暖的微笑互动。这些“小确幸”，构成了我们生命中最坚实的底色。让我们放慢脚步，用心去捕捉并记录这些在路上的闪光时刻。'
  },
  {
    id: 'post-2',
    title: 'Mac 效率工具清单（2025 版）',
    status: '已发布',
    publishTime: '2025-05-18 11:28',
    views: 8571,
    category: '效率工具',
    tags: ['Mac', '工具'],
    content: '工欲善其事，必先利其器。作为一名内容创作者和开发者，Mac 是我最得力的伙伴。在过去的几年里，我测试了数百款应用，并整理出这份 2025 年的终极效率工具清单。从窗口管理、快速启动、剪贴板增强到沉浸式写作工具，每一款都是经过深度体验并融入工作流的利器。无论你是新手还是重度用户，相信这其中都有能帮你提升效率的新发现。'
  },
  {
    id: 'post-3',
    title: '如何保持写作灵感：10 个实用方法',
    status: '已发布',
    publishTime: '2025-05-16 20:16',
    views: 6108,
    category: '创作心得',
    tags: ['写作', '灵感'],
    content: '灵感就像清晨的露水，美丽却易逝。许多创作者都曾面临“灵感枯竭”的窘境。然而，依赖偶然的灵感并不是长久之计。写作是一项需要系统训练和技巧的技艺。本文分享了我多年写作积累的 10 个实用方法：从建立“灵感收集库”、定期进行“自由写作”、转换思维环境、到通过阅读和跨界交流碰撞火花，帮助你建立源源不断的灵感输入与输出机制。'
  },
  {
    id: 'post-4',
    title: '周末咖啡馆探店记录',
    status: '草稿',
    publishTime: '2025-05-20 15:36',
    views: null,
    category: '探店记录',
    tags: ['咖啡', '休闲'],
    content: '在这个阴雨绵绵的周末，我躲进了市中心一条不起眼的小巷子里。这里的“拾光咖啡馆”有着复古的装潢和极为舒缓的黑胶音乐。主理人是一位对手冲咖啡有着极致追求的年轻人。他熟练地称重、研磨、闷蒸，温润的咖啡香气渐渐弥漫开来。在这里，时间仿佛变慢了。一杯耶加雪菲，一本随笔，便是一段完美的独处时光。'
  },
  {
    id: 'post-5',
    title: '旅行目的地 7 个小技巧',
    status: '草稿',
    publishTime: '2025-05-18 22:10',
    views: null,
    category: '旅行指南',
    tags: ['旅行', '技巧'],
    content: '旅行不仅仅是到达一个目的地，更是一次探索未知的过程。为了让你的旅程更加顺畅和完美，我总结了 7 个超级实用的黄金技巧。包括如何利用数字地图离线规划路线、如何打包出最轻便且功能俱全的行李箱、如何安全地探索当地的小众美食、以及在语言不通的环境中快速沟通的秘诀。掌握这些技巧，让你的下一次出发更显游刃有余。'
  }
];

export const initialComments: Comment[] = [
  {
    id: 'comment-1',
    author: '小雨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    time: '10 分钟前',
    timestamp: '2025-05-20T15:49:00Z',
    content: '这篇文章太实用了！特别是关于写作灵感的部分，特别是建立“灵感库”和“自由写作”这二点，真的很有启发，期待博主的持续更新，已推荐给身边想写作的朋友！',
    status: '待审核',
    postTitle: '如何保持写作灵感：10 个实用方法',
    email: 'xiaoyu@example.com'
  },
  {
    id: 'comment-2',
    author: 'Jason',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    time: '35 分钟前',
    timestamp: '2025-05-20T15:24:00Z',
    content: '工具清单很给力，已经全套收藏了 👍 里面有几个效率工具（比如窗口管理和剪贴板那款）我自己也一直在用，推荐非常中肯客观，写出了真实的使用体验。',
    status: '待审核',
    postTitle: 'Mac 效率工具清单（2025 版）',
    email: 'jason@example.com'
  },
  {
    id: 'comment-3',
    author: '晨光大海',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    time: '1 小时前',
    timestamp: '2025-05-20T14:59:00Z',
    content: '摄影部分关于光线作用的解释真的太通俗易懂了！一语点醒梦中人，请问对于新手预算 5000 左右，有没有性价比高的入门相机和定焦镜头推荐呢？',
    status: '待审核',
    postTitle: '摄影入门：光线的魔法',
    email: 'chenguang@example.com'
  },
  {
    id: 'comment-4',
    author: '旅行者',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    time: '2 小时前',
    timestamp: '2025-05-20T13:59:00Z',
    content: '这个周末咖啡馆看起来很有文艺范呀！很喜欢博主拍的照片和温馨的文风，求推荐去那里的具体交通路线以及店里最值得点的手冲咖啡是哪一款？',
    status: '待审核',
    postTitle: '周末咖啡馆探店记录',
    email: 'traveler@example.com'
  },
  {
    id: 'comment-5',
    author: 'Forest',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    time: '3 小时前',
    timestamp: '2025-05-20T12:59:00Z',
    content: '感谢博主分享，受益匪浅！博主的文字有股安抚人心的力量，页面排版布局也很舒服，字号间距恰到好处。已加入书签，期待博主带来更多路上的故事！',
    status: '待审核',
    postTitle: '在路上小确幸的生活',
    email: 'forest@example.com'
  },
  {
    id: 'comment-6',
    author: '木子李',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    time: '5 小时前',
    timestamp: '2025-05-20T10:59:00Z',
    content: '文章分析得非常有见地，我已经把这篇分享给我的团队了，大家讨论后一致觉得很有参考价值，期待下篇！',
    status: '已通过',
    postTitle: 'Mac 效率工具清单（2025 版）',
    email: 'muzili@example.com'
  },
  {
    id: 'comment-7',
    author: '编程小白',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    time: '1 天前',
    timestamp: '2025-05-19T09:12:00Z',
    content: '非常好的博主，之前留言提问，博主居然在半夜认真地写了长篇回复解答，真的超感动！祝博主博客越办越好！',
    status: '已通过',
    postTitle: '在路上小确幸的生活',
    email: 'xiaobai@example.com'
  }
];

export const initialSchedules: UpcomingSchedule[] = [
  {
    id: 'sched-1',
    title: '如何写出让人共鸣的文案',
    publishTime: '2025-05-22 10:00',
    month: '5月',
    day: '22',
    status: '已排期'
  },
  {
    id: 'sched-2',
    title: '我的自驾工具推荐',
    publishTime: '2025-05-24 14:00',
    month: '5月',
    day: '24',
    status: '已排期'
  },
  {
    id: 'sched-3',
    title: '摄影入门：光线的魔法',
    publishTime: '2025-05-28 09:00',
    month: '5月',
    day: '28',
    status: '草稿'
  }
];

export const initialTrafficTrend: TrafficTrendItem[] = [
  { date: '05-14', visits: 4000 },
  { date: '05-15', visits: 4200 },
  { date: '05-16', visits: 6000 },
  { date: '05-17', visits: 7500 },
  { date: '05-18', visits: 5800 },
  { date: '05-19', visits: 6400 },
  { date: '05-20', visits: 8200 }
];

export const initialTrafficSources: TrafficSourceItem[] = [
  { name: '直接访问', percentage: 52.7, value: 67952, color: '#3b82f6' }, // Blue
  { name: '搜索引擎', percentage: 24.3, value: 31333, color: '#8b5cf6' }, // Purple
  { name: '社交媒体', percentage: 12.7, value: 16376, color: '#10b981' }, // Green
  { name: '外部链接', percentage: 6.1, value: 7865, color: '#f97316' },  // Orange
  { name: '其他', percentage: 4.2, value: 5416, color: '#f59e0b' }      // Yellow
];

export const defaultSiteHealth: SiteHealth = {
  storageUsed: 3.2,
  storageTotal: 10,
  backupScore: 96,
  backupStatus: '正常',
  securityStatus: '良好',
  securityLabel: '未发现风险',
  lastBackupTime: '2025-05-20 02:30',
  autoBackup: true
};

export const defaultVisitorLogs: VisitorLog[] = [
  {
    id: 'vlog-1',
    ip: '183.14.231.98',
    location: '中国 广东省 深圳市',
    browser: 'Chrome 122.0',
    os: 'macOS 14.2',
    entryPage: '/posts/mac-efficiency-tools-2025',
    duration: '04:12',
    time: '15:58:21'
  },
  {
    id: 'vlog-2',
    ip: '112.97.45.16',
    location: '中国 北京市 朝阳区',
    browser: 'Safari Mobile',
    os: 'iOS 17.3',
    entryPage: '/posts/keep-writing-inspiration-tips',
    duration: '02:45',
    time: '15:54:10'
  },
  {
    id: 'vlog-3',
    ip: '222.186.31.254',
    location: '中国 江苏省 南京市',
    browser: 'Edge 121.0',
    os: 'Windows 11',
    entryPage: '/posts/happy-life-on-the-road',
    duration: '01:18',
    time: '15:48:32'
  },
  {
    id: 'vlog-4',
    ip: '66.249.79.130',
    location: '美国 加利福尼亚州 (Googlebot)',
    browser: 'Chrome Mobile 120.0',
    os: 'Android 10',
    entryPage: '/categories/efficiency-tools',
    duration: '00:05',
    time: '15:45:01'
  },
  {
    id: 'vlog-5',
    ip: '117.136.38.192',
    location: '中国 四川省 成都市',
    browser: 'WeChat Built-in',
    os: 'iOS 17.2',
    entryPage: '/posts/happy-life-on-the-road',
    duration: '08:50',
    time: '15:39:14'
  },
  {
    id: 'vlog-6',
    ip: '116.228.89.44',
    location: '中国 上海市 静安区',
    browser: 'Chrome 122.0',
    os: 'Windows 11',
    entryPage: '/',
    duration: '03:30',
    time: '15:31:44'
  }
];

export const defaultBlogSettings: BlogSettings = {
  title: '拾光笔记',
  subtitle: '个人博客',
  authorName: '拾光',
  authorRole: '站长',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  aboutMe: '记录生活，分享关于效率工具、创意设计、读书感悟与科技探索的见闻。在漫漫时光中，拾起那些散落的吉光片羽。',
  postsPerPage: 10,
  enableComments: true,
  autoBackup: true,
  theme: 'light'
};

export const initialCategories = [
  { name: '生活随感', count: 18, color: '#3b82f6' },
  { name: '效率工具', count: 12, color: '#8b5cf6' },
  { name: '创作心得', count: 15, color: '#10b981' },
  { name: '探店记录', count: 9, color: '#f97316' },
  { name: '旅行指南', count: 21, color: '#ec4899' },
  { name: '科技视界', count: 11, color: '#14b8a6' }
];

export const initialTags = [
  { name: '旅行', count: 32 },
  { name: '写作', count: 25 },
  { name: 'Mac', count: 14 },
  { name: '效率', count: 19 },
  { name: '摄影', count: 16 },
  { name: '感悟', count: 28 },
  { name: '咖啡', count: 10 },
  { name: '读书', count: 22 },
  { name: '极简', count: 12 }
];
