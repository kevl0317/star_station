import { knowledgeFigure, milkyWayDiagram, solarOrbitDiagram } from "./knowledge-art.mjs";
export const BODIES = [
  ["sun", "太阳", "恒星", "#f6bf57"],
  ["mercury", "水星", "类地行星", "#a5a298"],
  ["venus", "金星", "类地行星", "#e6c286"],
  ["earth", "地球", "类地行星", "#60bbdf"],
  ["moon", "月球", "天然卫星", "#c0c6cb"],
  ["mars", "火星", "类地行星", "#da8669"],
  ["asteroids", "主小行星带", "小天体区域", "#aca696"],
  ["jupiter", "木星", "气态巨行星", "#d9b797"],
  ["saturn", "土星", "气态巨行星", "#ddc79c"],
  ["uranus", "天王星", "冰巨星", "#99d9df"],
  ["neptune", "海王星", "冰巨星", "#6a94e1"],
  ["kuiper", "柯伊伯带", "海王星外的小天体区域", "#a4aace"],
  ["solar", "太阳系", "本游戏观测网", "#d8ca92"],
  ["earthmoon", "地月联网", "地球与天然卫星月球", "#83c8df"],
].map(([id, name, type, color]) => ({ id, name, type, color }));
export const PLANETS = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];
export const bodyInfo = (id) => BODIES.find((b) => b.id === id) || BODIES[0];
const source = {
  planets: ["NASA · 行星概览", "https://science.nasa.gov/solar-system/planets/"],
  moon: ["NASA · 月球", "https://science.nasa.gov/moon/facts/"],
  change: [
    "国家航天局 · 嫦娥六号",
    "https://www.cnsa.gov.cn/n6758823/n6758844/n10518102/n10518147/c10565180/content.html",
  ],
  zhurong: [
    "国家航天局 · 祝融号",
    "https://www.cnsa.gov.cn/n6758824/n6759009/n6760412/n6760413/c6840384/content.html",
  ],
  sun: ["NASA · 太阳", "https://science.nasa.gov/sun/facts/"],
  mercury: ["NASA · 水星", "https://science.nasa.gov/mercury/facts/"],
  venus: ["NASA · 金星", "https://science.nasa.gov/venus/venus-facts/"],
  mars: ["NASA · 火星", "https://science.nasa.gov/mars/facts/"],
  asteroids: ["NASA · 小行星", "https://science.nasa.gov/solar-system/asteroids/facts/"],
  jupiter: ["NASA · 木星", "https://science.nasa.gov/jupiter/jupiter-facts/"],
  saturn: ["NASA · 土星", "https://science.nasa.gov/saturn/facts/"],
  solar: ["NASA · 太阳系", "https://science.nasa.gov/solar-system/solar-system-facts/"],
  uranus: ["NASA · 天王星", "https://science.nasa.gov/uranus/facts/"],
  neptune: ["NASA · 海王星", "https://science.nasa.gov/neptune/neptune-facts/"],
  kuiper: ["NASA · 柯伊伯带", "https://science.nasa.gov/solar-system/kuiper-belt/facts/"],
};
const cards = [
  ["地球的位置", "地球是按离太阳由近到远排序的第三颗行星。", "earth", "planets"],
  ["我们的月球", "月球是目前唯一一个长期、稳定地绕地球运行的天然天体。", "moon", "moon"],
  ["月背也有白天", "月球背面指背向地球的一面，也会受到太阳照射。", "moon", "moon"],
  ["通信也能搭桥", "嫦娥六号在月球背面工作时，鹊桥二号中继星为它提供通信支持。", "moon", "change"],
  ["嫦娥带回的礼物", "2024年，嫦娥六号完成世界首次月球背面采样返回。", "earthmoon", "change"],
  ["太阳的身份", "太阳是一颗恒星，也是太阳系唯一的恒星。", "sun", "sun"],
  ["最靠近太阳的行星", "水星在八大行星中最靠近太阳，也是其中最小的一颗。", "mercury", "mercury"],
  ["水星的一年", "水星绕太阳一周大约需要88个地球日。", "mercury", "mercury"],
  ["最热的是金星", "金星浓厚的大气产生强烈温室效应，使它成为太阳系最热的行星。", "venus", "venus"],
  ["金星和水星的共同点", "水星和金星都没有天然卫星。", "venus", "mercury", "venus"],
  ["火星为什么红", "火星表面的铁矿物发生氧化，让它看起来偏红。", "mars", "mars"],
  [
    "祝融走上火星",
    "祝融号是天问一号任务的火星车，2021年5月22日驶上火星表面，开始巡视探测。",
    "mars",
    "zhurong",
  ],
  [
    "火星的两位伙伴",
    "火星有两颗已知的天然卫星，分别是火卫一（Phobos，福波斯）和火卫二（Deimos，德莫斯）。",
    "mars",
    "mars",
  ],
  ["小行星主要聚在哪里", "太阳系的主小行星带位于火星与木星轨道之间。", "asteroids", "asteroids"],
  ["小行星的形状", "多数小行星形状不规则，只有少数接近圆球形。", "asteroids", "asteroids"],
  ["最大的行星", "木星是太阳系八大行星中最大的一颗。", "jupiter", "jupiter"],
  ["大红斑是什么", "木星上的大红斑是一场巨大的风暴。", "jupiter", "jupiter"],
  ["木星属于哪一类", "木星是气态巨行星，没有像地球那样可站立的固体表面。", "jupiter", "jupiter"],
  ["土星环的材料", "土星环由大量冰块和岩石碎片组成，不是一整块圆盘。", "saturn", "saturn"],
  ["土星并不孤单", "木星、土星、天王星和海王星都有行星环。", "saturn", "solar"],
  ["躺着转的行星", "天王星的自转轴倾斜接近98度，看上去像侧躺着转。", "uranus", "uranus"],
  ["最外侧的行星", "海王星是八大行星中距离太阳最远的一颗。", "neptune", "neptune"],
  ["海王星的漫长一年", "海王星绕太阳一周大约需要165个地球年。", "neptune", "neptune"],
  ["海王星之外", "海王星轨道之外有柯伊伯带，冥王星是其中的一颗矮行星。", "kuiper", "kuiper"],
  [
    "太阳系在银河系里",
    "太阳系属于银河系，位于猎户臂的一段；银河系远比太阳系大。",
    "solar",
    "solar",
  ],
];
export const CARDS = cards.map(([title, text, body, ...refs], i) => ({
  id: i + 1,
  code: `第${i + 1}关`,
  title,
  text,
  body,
  sources: refs.map((r) => source[r]),
  kind: [4, 5, 12].includes(i + 1) ? "真实探索" : "天文知识",
}));
const generatedBodies = new Set([
  "saturn",
  "uranus",
  "neptune",
  "asteroids",
  "kuiper",
  "sun",
  "mercury",
  "venus",
  "earth",
  "moon",
  "mars",
  "jupiter",
]);
export function planetSVG(id) {
  const b = bodyInfo(id);
  if (generatedBodies.has(id)) {
    // Ringed sprites need a larger image box to balance the visible globe sizes.
    const size = id === "saturn" ? 196 : id === "uranus" ? 175 : 140;
    return `<svg class="generated-planet" viewBox="0 0 160 165" role="img" aria-label="${b.name}" style="overflow:visible"><image href="./assets/solar-art-v1/${id === "neptune" ? "neptune-ringless" : id}.webp" x="${(160 - size) / 2}" y="${(165 - size) / 2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/></svg>`;
  }
  if (id === "solar") return solarOrbitDiagram({ showLabels: false });
  if (id === "earthmoon")
    return `<div class="earth-moon-art">${planetSVG("earth")}<span>${planetSVG("moon")}</span></div>`;
  return "";
}
const item = (id, label = "") =>
  `<div class="figure-object">${planetSVG(id)}<span>${label || bodyInfo(id).name}</span></div>`;
export const galaxySVG = milkyWayDiagram;
export function cardFigure(id) {
  const artwork = knowledgeFigure(id);
  if (artwork) return artwork;
  let html = "";
  if ([1, 7, 22].includes(id))
    html = `<div class="planet-order">${PLANETS.map((p, i) => `<div class="${p === CARDS[id - 1].body ? "highlight" : ""}">${planetSVG(p)}<span>${i + 1} ${bodyInfo(p).name}</span></div>`).join("")}</div>`;
  else if (id === 2)
    html = item("earth") + '<span class="diagram-link">↔</span>' + item("moon", "月球 · 天然卫星");
  else if (id === 3)
    html =
      item("sun", "阳光") +
      '<span class="diagram-link">→</span>' +
      item("moon", "正面也有白天") +
      item("moon", "背面也有白天");
  else if (id === 8)
    html =
      item("sun") +
      '<span class="diagram-link">⟲<small>约88个地球日</small></span>' +
      item("mercury");
  else if (id === 9) html = item("mercury", "更靠近太阳") + item("venus", "最热的行星");
  else if (id === 10) html = item("mercury", "无天然卫星") + item("venus", "无天然卫星");
  else if (id === 14) html = item("mars") + item("asteroids") + item("jupiter");
  else if (id === 15) html = item("asteroids", "形状不规则、分布稀疏");
  else if (id === 16)
    html = '<div class="size-earth">' + item("earth") + "</div>" + item("jupiter", "木星 · 最大");
  else if (id === 21)
    html =
      '<div class="tilt-diagram">' +
      planetSVG("uranus") +
      "<i></i><span>自转轴倾角 ≈98°</span></div>";
  else if (id === 23) html = item("earth", "公转约1年") + item("neptune", "公转约165地球年");
  else html = galaxySVG();
  return `<div class="card-figure">${html}</div><small class="diagram-note">示意图 · 距离与大小未按比例</small>`;
}
export function cardHTML(id, { narrated = false } = {}) {
  const c = CARDS[id - 1];
  const explanation = narrated
    ? `<div class="bunny-lesson"><div class="bunny-lesson-art">${bunnySVG}</div><div class="bunny-speech"><p>${c.text}</p></div></div>`
    : `<p>${c.text}</p>`;
  return `<article class="knowledge-card"><div class="card-heading"><span>${c.code} · ${c.kind}</span><strong>${c.title}</strong></div>${cardFigure(id)}${explanation}<footer>${c.sources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`).join("")}</footer></article>`;
}
export const bunnySVG = `<svg class="bunny-art" viewBox="0 0 1145 1374" role="img" aria-label="白兔向导"><image href="./assets/solar-art-v1/bunny-white-moon.png" width="1145" height="1374" preserveAspectRatio="xMidYMid meet"/></svg>`;
