import {
  LEVELS as flightLevels,
  signalPool as flightPool,
  examples as flightExamples,
  COLORS as flightColors,
  COLOR_NAMES as flightColorNames,
} from "./flight-levels.mjs";
export const CHAPTERS = [
  {
    name: "地月启航",
    tower: "地月节点",
    color: "#85dce9",
    line: "一起唤醒地月观测网",
    badge: "地月通信章",
  },
  {
    name: "向阳观测",
    tower: "向阳节点",
    color: "#edc994",
    line: "接收向阳观测数据，找回失联科考船",
    badge: "向阳观测章",
  },
  {
    name: "火星来信",
    tower: "火星节点",
    color: "#efad92",
    line: "接通红色星球与主小行星带",
    badge: "火星探索章",
  },
  {
    name: "巨行星之约",
    tower: "巨行星节点",
    color: "#d5c3ad",
    line: "恢复木星与土星的观测数据",
    badge: "巨行星观测章",
  },
  {
    name: "遥望远方",
    tower: "远方节点",
    color: "#b3bbed",
    line: "接通太阳系最后的观测节点",
    badge: "太阳系通信章",
  },
];
export const COLORS = {
  ...flightColors,
  orange: "#ffb45f",
};
export const COLOR_NAMES = {
  ...flightColorNames,
  blue: "蓝色",
  yellow: "黄色",
  purple: "紫色",
  green: "绿色",
  red: "红色",
  orange: "橙色",
};
export const SHAPE_NAMES = {
  circle: "圆形",
  triangle: "三角形",
  star: "星形",
  square: "方形",
  diamond: "菱形",
  spark: "六边形",
};
const configs = [
  [
    "唤醒接收器",
    "earth"
  ],
  [
    "接通月面信标",
    "moon"
  ],
  [
    "寻找月背回音",
    "moon"
  ],
  [
    "搭起通信鹊桥",
    "moon"
  ],
  [
    "地月联网验收",
    "earthmoon"
  ],
  [
    "接收日光观测",
    "sun"
  ],
  [
    "找准观测方向",
    "mercury"
  ],
  [
    "守住陨坑上空",
    "mercury"
  ],
  [
    "穿过厚云通信",
    "venus"
  ],
  [
    "向阳观测验收",
    "venus"
  ],
  [
    "红色星球来信",
    "mars"
  ],
  [
    "同步巡视数据",
    "mars"
  ],
  [
    "辨认微小差别",
    "mars"
  ],
  [
    "打开左右扫描区",
    "asteroids"
  ],
  [
    "主小行星带验收",
    "asteroids"
  ],
  [
    "恢复云带数据",
    "jupiter"
  ],
  [
    "排除反向信号",
    "jupiter"
  ],
  [
    "看清风暴轮廓",
    "jupiter"
  ],
  [
    "等待久违的信号",
    "saturn"
  ],
  [
    "巨行星观测验收",
    "saturn"
  ],
  [
    "接收双路报告",
    "uranus"
  ],
  [
    "连接三座接收器",
    "neptune"
  ],
  [
    "核对远端方向",
    "neptune"
  ],
  [
    "追踪远方数据",
    "kuiper"
  ],
  [
    "太阳系全网验收",
    "solar"
  ]
];
export const LEVELS = configs.map(([name, body], i) => ({
  ...flightLevels[i],
  name,
  body,
  demo: "",
}));
export function matches(s, rule) {
  return rule.some((r) => Object.entries(r).every(([k, v]) => s[k] === v));
}
export function ruleText(rule) {
  return rule
    .map(
      (r) =>
        `${COLOR_NAMES[r.color] || ""}${r.direction ? "朝上的" : ""}${r.halo ? "带光环的" : ""}${r.solid ? "实心" : ""}${SHAPE_NAMES[r.shape] || "信号"}${!r.color && r.shape && !r.halo && !r.direction ? "（不限颜色）" : ""}${r.color && Object.keys(r).length === 1 ? "（不限形状）" : ""}`,
    )
    .join(" 或 ");
}
export function seeded(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function signalPool(l) {
  return flightPool(l);
}
export function similarity(s, rule) {
  return Math.max(...rule.map((r) => Object.entries(r).filter(([k, v]) => s[k] === v).length));
}
export function examples(l) {
  return flightExamples(l);
}
export function mismatch(s, rule) {
  const closest = [...rule].sort((a, b) => similarity(s, [b]) - similarity(s, [a]))[0];
  for (const [key, label] of [
    ["color", "颜色不符"],
    ["shape", "形状不符"],
    ["direction", "方向不符"],
    ["halo", "光环不符"],
    ["solid", "填充不符"],
  ])
    if (key in closest && s[key] !== closest[key]) return label;
  return "规则不符";
}
