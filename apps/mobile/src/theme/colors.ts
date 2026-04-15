/**
 * DiviFlow 主题色板
 * 源自交互原型 (diviflow_interactive_1.html) 的设计令牌
 * 暗色为主，金色为品牌锚点
 */
export const colors = {
  // 背景层级
  bg0: '#0a0a08',
  bg1: '#111110',
  bg2: '#1a1a17',
  bg3: '#242420',
  bg4: '#2c2c28',

  // 品牌金
  gold: '#c8a84b',
  gold2: '#e8c96a',
  goldDim: '#8a7235',
  goldFaint: 'rgba(200,168,75,0.08)',

  // 功能色
  green: '#e5514a', // 正收益（东方习惯，红涨绿跌）
  red: '#e74c3c',
  blue: '#5aabf5',

  // 文字层级
  t0: '#f0ead6',
  t1: '#c8bfa0',
  t2: '#8a8070',
  t3: '#5a5448',

  // 边框
  bd: '#2a2a25',
  bd2: '#3a3830',
} as const;

export type ColorKey = keyof typeof colors;
