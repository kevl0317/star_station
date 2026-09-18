export const CHAPTERS = [
  {
    name: "星港出发",
    tower: "星港通讯塔",
    color: "#85dce9",
    place: "月海星港",
    line: "唤醒沉睡的接收器",
    badge: "星港领航员",
  },
  {
    name: "星尘航道",
    tower: "航道通讯塔",
    color: "#edc994",
    place: "流星之海",
    line: "把失联的远星号带回家",
    badge: "远星救援者",
  },
  {
    name: "深空密码",
    tower: "深空通讯塔",
    color: "#b8a6ee",
    place: "回声星云",
    line: "解开星海深处的密码",
    badge: "深空解码员",
  },
  {
    name: "信号风暴",
    tower: "风暴通讯塔",
    color: "#ecabb8",
    place: "风暴之眼",
    line: "守住最后一束光",
    badge: "风暴守望者",
  },
  {
    name: "点亮银河",
    tower: "银河通讯塔",
    color: "#b3dfb2",
    place: "银河尽头",
    line: "让五片星域再次相连",
    badge: "银河点灯人",
  },
];
export const COLORS = {
  blue: "#53caff",
  yellow: "#ffda78",
  purple: "#b79aff",
  green: "#8ee3b0",
  red: "#ff858f",
  cyan: "#64e3eb",
  lilac: "#e9b3eb",
};
export const COLOR_NAMES = {
  blue: "蓝色",
  yellow: "黄色",
  purple: "紫色",
  green: "绿色",
  red: "红色",
  cyan: "青色",
  lilac: "浅紫色",
};
export const SHAPE_NAMES = {
  circle: "圆形",
  triangle: "三角形",
  star: "星形",
  diamond: "菱形",
  square: "方形",
  spark: "六边形",
};
const checkpoint = {
  rule: [{ color: "blue", shape: "triangle" }],
  duration: 50,
  count: 45,
  targetCount: 20,
  life: 3.8,
  seed: 52025,
  checkpoint: true,
  minHit: 0.75,
  maxFalse: 0.2,
};
export const LEVELS = [
  {
    name: "初醒信号",
    goal: "唤醒第一台接收器",
    rule: [{ color: "blue", shape: "circle" }],
    minHit: 0.7,
    maxFalse: 0.25,
    count: 30,
    life: 5,
    easy: true,
  },
  {
    name: "月兔来电",
    goal: "连接月兔气象台",
    rule: [{ color: "yellow", shape: "triangle" }],
    minHit: 0.7,
    maxFalse: 0.25,
    count: 34,
    life: 4.8,
    similar: true,
  },
  {
    name: "流星坐标",
    goal: "找回流星坐标",
    rule: [{ shape: "star" }],
    minHit: 0.72,
    maxFalse: 0.25,
    count: 36,
    life: 4.6,
  },
  {
    name: "绿色航线",
    goal: "接通星港主线路",
    rule: [{ color: "green" }],
    minHit: 0.72,
    maxFalse: 0.23,
    count: 38,
    life: 4.5,
  },
  { ...checkpoint, name: "星港之光", goal: "修复星港通讯塔", baseline: true },
  {
    name: "光环补给",
    goal: "为救援船补充导航能量",
    rule: [{ shape: "circle", halo: true }],
    minHit: 0.74,
    maxFalse: 0.22,
    count: 40,
    life: 4.2,
    halo: true,
    similar: true,
  },
  {
    name: "向上航行",
    goal: "穿过方向混乱区",
    rule: [{ shape: "triangle", direction: "up" }],
    minHit: 0.74,
    maxFalse: 0.22,
    count: 40,
    life: 4.1,
    directions: true,
  },
  {
    name: "星尘信标",
    goal: "寻找星尘后的信标",
    rule: [{ color: "purple", shape: "star" }],
    minHit: 0.75,
    maxFalse: 0.22,
    count: 42,
    life: 4,
    occlusion: true,
    similar: true,
  },
  {
    name: "彗星之间",
    goal: "避开彗星雨干扰",
    rule: [{ color: "blue", shape: "circle" }],
    minHit: 0.75,
    maxFalse: 0.2,
    count: 42,
    life: 4,
    comets: true,
    similar: true,
  },
  {
    ...checkpoint,
    name: "远星归来",
    goal: "找到并救回失联飞船",
    similar: true,
    near: true,
    occlusion: true,
  },
  {
    name: "深空密钥",
    goal: "解开第一道通讯密码",
    rule: [{ color: "blue", shape: "circle" }],
    minHit: 0.76,
    maxFalse: 0.2,
    count: 43,
    life: 3.9,
    similar: true,
  },
  {
    name: "跃迁节拍",
    goal: "追踪变速航道",
    rule: [{ color: "red", shape: "triangle" }],
    minHit: 0.77,
    maxFalse: 0.19,
    count: 44,
    life: 3.7,
    irregular: true,
    similar: true,
  },
  {
    name: "真假星光",
    goal: "排除伪装",
    rule: [{ color: "purple", shape: "star" }],
    minHit: 0.77,
    maxFalse: 0.19,
    count: 45,
    life: 3.7,
    near: true,
    similar: true,
  },
  {
    name: "双向扫描",
    goal: "守住左右扫描区",
    rule: [{ color: "green", shape: "circle" }],
    minHit: 0.78,
    maxFalse: 0.18,
    count: 46,
    life: 3.6,
    scan: "sides",
    similar: true,
  },
  { ...checkpoint, name: "深空之光", goal: "修复深空通讯塔", similar: true, near: true },
  {
    name: "风暴光环",
    goal: "找回闪烁的坐标",
    rule: [{ color: "yellow", halo: true }],
    minHit: 0.79,
    maxFalse: 0.18,
    count: 46,
    life: 3.6,
    halo: true,
    shimmer: true,
    similar: true,
  },
  {
    name: "镜像迷航",
    goal: "排除镜像信号",
    rule: [{ color: "blue", shape: "triangle", direction: "up" }],
    minHit: 0.79,
    maxFalse: 0.17,
    count: 47,
    life: 3.5,
    directions: true,
    similar: true,
  },
  {
    name: "空心伪装",
    goal: "排除错误信号",
    rule: [{ color: "purple", shape: "circle", solid: true }],
    minHit: 0.8,
    maxFalse: 0.17,
    count: 48,
    life: 3.4,
    fill: true,
    near: true,
    similar: true,
  },
  {
    name: "静默呼叫",
    goal: "在风暴的静默期捕捉求救信号",
    rule: [{ color: "green", shape: "star" }],
    minHit: 0.8,
    maxFalse: 0.16,
    count: 48,
    life: 3.4,
    drought: true,
    similar: true,
  },
  { ...checkpoint, name: "风暴之光", goal: "稳住风暴中心的通讯塔", life: 2.9 },
  {
    name: "双频救援",
    goal: "同时接收两类求救信号",
    rule: [
      { color: "blue", shape: "triangle" },
      { color: "yellow", shape: "circle" },
    ],
    minHit: 0.81,
    maxFalse: 0.15,
    count: 48,
    life: 3.3,
    similar: true,
  },
  {
    name: "三域巡航",
    goal: "连接分散的三座远端接收器",
    rule: [{ color: "purple", shape: "star" }],
    minHit: 0.81,
    maxFalse: 0.15,
    count: 30,
    life: 1.7,
    scan: "three",
    single: true,
    similar: true,
  },
  {
    name: "镜像追踪",
    goal: "找出混入星网的伪装信号",
    rule: [{ color: "blue", shape: "triangle", direction: "up" }],
    minHit: 0.82,
    maxFalse: 0.15,
    count: 50,
    life: 3,
    directions: true,
    near: true,
    similar: true,
  },
  {
    name: "最后的同步",
    goal: "同步三座远端接收器",
    rule: [{ color: "green", shape: "circle" }],
    minHit: 0.82,
    maxFalse: 0.14,
    duration: 50,
    phases: true,
    life: 4.2,
    similar: true,
  },
  { ...checkpoint, name: "银河长明", goal: "点亮完整银河通讯网", life: 2.7, wide: true },
].map((l, i) => ({
  duration: 60,
  targetProbability: 0.4,
  ...l,
  id: i + 1,
  chapter: Math.floor(i / 5),
  practice: i < 3,
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
export function signalPool(level) {
  const colors = level.near ? Object.keys(COLORS) : ["blue", "yellow", "purple", "green", "red"];
  const shapes = level.directions
    ? ["triangle"]
    : level.fill
      ? ["circle"]
      : level.near
        ? Object.keys(SHAPE_NAMES)
        : ["circle", "triangle", "star", "diamond", "square"];
  return colors.flatMap((color) =>
    shapes.flatMap((shape) =>
      (level.halo ? [false, true] : [false]).flatMap((halo) =>
        (level.fill ? [false, true] : [true]).flatMap((solid) =>
          (level.directions ? ["up", "left", "right", "down"] : ["up"]).map((direction) => ({
            color,
            shape,
            halo,
            solid,
            direction,
          })),
        ),
      ),
    ),
  );
}
export function similarity(s, rule) {
  return Math.max(...rule.map((r) => Object.entries(r).filter(([k, v]) => s[k] === v).length));
}
export function examples(level) {
  const pool = signalPool(level),
    targets = pool.filter((s) => matches(s, level.rule));
  const target = level.rule.map((r) => targets.find((s) => matches(s, [r])));
  let decoys = pool.filter((s) => !matches(s, level.rule));
  if (level.easy) decoys = decoys.filter((s) => s.color !== "blue" && s.shape !== "circle");
  else decoys.sort((a, b) => similarity(b, level.rule) - similarity(a, level.rule));
  return [...target, ...decoys.slice(0, 3 - target.length)].map((s) => ({
    ...s,
    target: matches(s, level.rule),
  }));
}
