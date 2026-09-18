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
  code: `K${String(i + 1).padStart(2, "0")}`,
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
let serial = 0;
export function planetSVG(id) {
  const b = bodyInfo(id),
    uid = `orb-${serial++}`;
  if (generatedBodies.has(id)) {
    // Ringed sprites need a larger image box to balance the visible globe sizes.
    const size = id === "saturn" ? 196 : id === "uranus" ? 175 : 140;
    return `<svg class="generated-planet" viewBox="0 0 160 165" role="img" aria-label="${b.name}" style="overflow:visible"><image href="./assets/solar-art-v1/${id === "neptune" ? "neptune-ringless" : id}.webp" x="${(160 - size) / 2}" y="${(165 - size) / 2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/></svg>`;
  }
  if (id === "solar")
    return `<svg viewBox="0 0 160 140" role="img" aria-label="太阳系示意"><circle cx="80" cy="70" r="12" fill="#f6c769"/>${[25, 40, 55, 66].map((r, i) => `<ellipse cx="80" cy="70" rx="${r}" ry="${r * 0.58}" fill="none" stroke="#a6cadd55"/><circle cx="${80 + r}" cy="70" r="${4 + i}" fill="${["#af9b81", "#dfb35f", "#75c9de", "#86aae3"][i]}"/>`).join("")}</svg>`;
  if (id === "asteroids" || id === "kuiper")
    return `<svg viewBox="0 0 160 140" role="img" aria-label="${b.name}示意">${Array.from(
      { length: 16 },
      (_, i) => {
        const x = 15 + ((i * 43) % 135),
          y = 20 + ((i * 37) % 100),
          r = 3 + (i % 5);
        return `<path d="M${x - r} ${y - r}l${r + 3} -2 ${r} ${r} -2 ${r + 3} -${r + 4} 1 -${r} -${r}Z" fill="${i % 2 ? "#97a3b5" : "#665d58"}" stroke="#cad6d666"/>`;
      },
    ).join("")}</svg>`;
  if (id === "earthmoon")
    return `<div class="earth-moon-art">${planetSVG("earth")}<span>${planetSVG("moon")}</span></div>`;
  let surface = "";
  if (id === "earth")
    surface =
      '<path d="M32 48l18-16 22 6 2 16-17 7-5 21-12-8zm53 22l20-15 24 12-10 16-20 5-2 22-13 7-9-23z" fill="#80bca4"/><path d="M40 36q30-18 70 0M35 87q27-11 39-3M93 109l20-8" fill="none" stroke="#eef7e9aa" stroke-width="7"/>';
  else if (["moon", "mercury"].includes(id))
    surface = Array.from(
      { length: 8 },
      (_, i) =>
        `<circle cx="${40 + ((i * 19) % 78)}" cy="${32 + ((i * 27) % 76)}" r="${4 + (i % 6)}" fill="#25354644" stroke="#e2e3d333" stroke-width="2"/>`,
    ).join("");
  else if (id === "mars")
    surface =
      '<path d="M30 55l28-14 27 9 6 25-26 17-27-9m44 12l21-23 24 2" fill="#763f384f"/><ellipse cx="80" cy="23" rx="16" ry="5" fill="#f0e1ce"/>';
  else if (["jupiter", "saturn", "venus"].includes(id))
    surface =
      [37, 52, 68, 85, 99]
        .map(
          (y, i) =>
            `<path d="M23 ${y}q30 ${i % 2 ? 12 : -8} 58 0t58 0" fill="none" stroke="${i % 2 ? "#835b4677" : "#f4dbb580"}" stroke-width="${i % 2 ? 9 : 5}"/>`,
        )
        .join("") +
      (id === "jupiter" ? '<ellipse cx="100" cy="87" rx="15" ry="8" fill="#b6674d"/>' : "");
  const rings = ["jupiter", "saturn", "uranus", "neptune"].includes(id);
  return `<svg viewBox="0 0 160 140" role="img" aria-label="${b.name}"><defs><radialGradient id="${uid}"><stop stop-color="${b.color}"/><stop offset=".7" stop-color="${b.color}"/><stop offset="1" stop-color="#132638"/></radialGradient><clipPath id="${uid}-clip"><circle cx="80" cy="70" r="49"/></clipPath></defs>${rings ? `<ellipse cx="80" cy="72" rx="72" ry="${id === "uranus" ? 57 : 19}" transform="rotate(${id === "uranus" ? 75 : -19} 80 70)" fill="none" stroke="${b.color}" stroke-opacity="${id === "saturn" ? 0.7 : 0.3}" stroke-width="${id === "saturn" ? 10 : 2}"/>` : ""}<circle cx="80" cy="70" r="49" fill="url(#${uid})"/><g clip-path="url(#${uid}-clip)">${surface}</g>${id === "sun" ? '<circle cx="80" cy="70" r="54" fill="none" stroke="#efbc5755" stroke-width="5"/>' : ""}</svg>`;
}
const item = (id, label = "") =>
  `<div class="figure-object">${planetSVG(id)}<span>${label || bodyInfo(id).name}</span></div>`;
export function galaxySVG() {
  return `<svg viewBox="0 0 400 190" role="img" aria-label="太阳系位于银河系猎户臂示意"><g transform="translate(200 95) rotate(-18) scale(1 .47)"><ellipse rx="172" ry="145" fill="#62749f18"/>${[0, 90, 180, 270].map((a) => `<path transform="rotate(${a})" d="M0 0C85-60 166 12 108 115S-90 155-153 60" fill="none" stroke="#b0c4ec66" stroke-width="13"/>`).join("")}<ellipse rx="30" ry="45" fill="#edcc9388"/></g><circle cx="285" cy="113" r="5" fill="#a4f8dc"/><path d="M285 113l25 30h58" stroke="#b4efd6" fill="none"/><text x="280" y="164" fill="#d7eee9" font-size="12">太阳系 · 猎户臂</text></svg>`;
}
export function cardFigure(id) {
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
  else if (id === 4)
    html =
      item("earth") +
      '<span class="diagram-link">↔</span><div class="diagram-label">◈<br>鹊桥二号</div><span class="diagram-link">↔</span>' +
      item("moon", "月背探测器");
  else if (id === 5)
    html =
      '<div class="sample-container">◈<br><span>月背月壤样品</span><small>嫦娥六号 · 2024</small></div>';
  else if (id === 6) html = item("sun", "太阳 · 恒星") + item("solar", "行星绕太阳运行");
  else if (id === 8)
    html =
      item("sun") +
      '<span class="diagram-link">⟲<small>约88个地球日</small></span>' +
      item("mercury");
  else if (id === 9) html = item("mercury", "更靠近太阳") + item("venus", "最热的行星");
  else if (id === 10) html = item("mercury", "无天然卫星") + item("venus", "无天然卫星");
  else if (id === 11)
    html =
      item("mars") +
      '<div class="soil-detail">氧化的铁矿物<br><small>红色地表 · 类似铁生锈</small></div>';
  else if (id === 12)
    html =
      '<svg viewBox="0 0 260 130" aria-label="祝融号火星车与轮迹示意" role="img"><path d="M5 116h250M20 125h230" stroke="#a96c56" stroke-dasharray="5 8"/><path d="M74 70h100v24H74zM103 50h48v20h-48z" fill="#c9ba94"/><path d="M102 55H25l8 30h69m49-30h78l-8 30h-70" fill="#374c71" stroke="#97adce"/><path d="M138 50V25h18" stroke="#ccb997" stroke-width="5"/><circle cx="83" cy="100" r="12" fill="#72818b"/><circle cx="127" cy="100" r="12" fill="#72818b"/><circle cx="170" cy="100" r="12" fill="#72818b"/></svg><div class="diagram-label">祝融号<br><small>2021年5月22日</small></div>';
  else if (id === 13)
    html = item("moon", "火卫一 Phobos") + item("mars") + item("asteroids", "火卫二 Deimos");
  else if (id === 14) html = item("mars") + item("asteroids") + item("jupiter");
  else if (id === 15) html = item("asteroids", "形状不规则、分布稀疏");
  else if (id === 16)
    html = '<div class="size-earth">' + item("earth") + "</div>" + item("jupiter", "木星 · 最大");
  else if (id === 17)
    html =
      item("jupiter") + '<div class="diagram-label">↖ 大红斑<br><small>巨大的风暴</small></div>';
  else if (id === 18)
    html =
      item("jupiter") +
      '<div class="diagram-label">◈ 观测节点<br><small>悬于云层外 · 不着陆</small></div>';
  else if (id === 19)
    html =
      item("saturn") + '<span class="diagram-link">→</span>' + item("asteroids", "冰块与岩石碎片");
  else if (id === 20)
    html = ["jupiter", "saturn", "uranus", "neptune"].map((p) => item(p)).join("");
  else if (id === 21)
    html =
      '<div class="tilt-diagram">' +
      planetSVG("uranus") +
      "<i></i><span>自转轴倾角 ≈98°</span></div>";
  else if (id === 23) html = item("earth", "公转约1年") + item("neptune", "公转约165地球年");
  else if (id === 24)
    html =
      item("neptune") +
      '<span class="diagram-link">→</span>' +
      item("kuiper") +
      '<div class="diagram-label">冥王星<br><small>矮行星</small></div>';
  else html = galaxySVG();
  return `<div class="card-figure">${html}</div><small class="diagram-note">示意图 · 距离与大小未按比例</small>`;
}
export function cardHTML(id) {
  const c = CARDS[id - 1];
  return `<article class="knowledge-card"><div class="card-heading"><span>${c.code} · ${c.kind}</span><strong>${c.title}</strong></div>${cardFigure(id)}<p>${c.text}</p><footer>${c.sources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`).join("")}</footer></article>`;
}
export const bunnySVG = `<svg class="bunny-art" viewBox="0 0 1200 1340" role="img" aria-label="星小兔"><image href="./assets/solar-art-v1/bunny.webp" width="1200" height="1340" preserveAspectRatio="xMidYMid meet"/></svg>`;
