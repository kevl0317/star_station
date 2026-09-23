import { initPhotoViewer } from "./photo-viewer.mjs";
import { endingHTML } from "./ending.mjs";
import { isHidden } from "./engine.mjs";
import { CHAPTERS, LEVELS, COLORS, ruleText, examples, mismatch } from "./levels.mjs";
import {
  BODIES,
  PLANETS,
  CARDS,
  bodyInfo,
  planetSVG,
  cardHTML,
  galaxySVG,
  bunnySVG,
} from "./astronomy.mjs";
import { Session, SAVE_KEY, readSave, unlocked, towerProgress, recordResult } from "./engine.mjs";
import { icon, signalSVG, signalName, towerSVG } from "./art.mjs";
import { WorldRenderer, positionOf } from "./renderer.mjs";
import { GameAudio } from "./audio.mjs";
initPhotoViewer();
const $ = (id) => document.getElementById(id),
  esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
const storageKey = SAVE_KEY + (new URLSearchParams(location.search).has("test") ? "-test" : "");
let raw = null;
try {
  raw = localStorage.getItem(storageKey);
} catch {
  $("storage-note").hidden = false;
}
let save = readSave(raw),
  selected = unlocked(save),
  screen = "home",
  session = null,
  countdown = null,
  practice = null,
  modalMode = null,
  last = 0,
  feedbackUntil = 0,
  toastUntil = 0;
let lastRenderSecond = -1,
  celebrated = false;
let homeChapter = 0;
const reducedOS = matchMedia("(prefers-reduced-motion:reduce)").matches;
const nodes = new Map(),
  audio = new GameAudio(),
  world = new WorldRenderer($("world-fx"));
const screens = {
  home: "home-screen",
  briefing: "briefing-screen",
  game: "play-screen",
  result: "result-screen",
  chapter: "chapter-screen",
  atlas: "atlas-screen",
  ending: "ending-screen",
};
const pct = (n) => (n === null ? "—" : `${(n * 100).toFixed(1)}%`);
function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(save));
  } catch {
    $("storage-note").hidden = false;
  }
}
function toast(text) {
  $("toast").textContent = text;
  $("toast").classList.add("visible");
  toastUntil = performance.now() + 2300;
}
function preferences() {
  audio.mute(save.muted);
  world.reduced = reducedOS;
  $("game-root").classList.toggle("reduced", world.reduced);
  $("sound").innerHTML = icon(save.muted ? "muted" : "sound");
  $("sound").setAttribute("aria-pressed", String(!save.muted));
  $("sound").setAttribute("aria-label", save.muted ? "开启声音" : "关闭声音");
  $("sound").title = save.muted ? "开启声音" : "关闭声音";
}
function clearSignals() {
  for (const n of nodes.values()) {
    n.el.remove();
    n.dust?.remove();
  }
  nodes.clear();
  world.fx = [];
}
function show(which) {
  screen = which;
  world.screen = which;
  $("game-root").dataset.screen = which;
  for (const [k, id] of Object.entries(screens)) $(id).hidden = k !== which;
  const chapter = LEVELS[selected - 1].chapter;
  $("game-root").style.setProperty("--chapter", CHAPTERS[chapter].color);
  $("star-total").innerHTML =
    `★ ${Object.values(save.stars).reduce((a, b) => a + b, 0)} <small>/ 75</small>`;
}
function levelButton(l) {
  const locked = l.id > unlocked(save);
  return `<button class="mini-level ${save.stars[l.id] ? "passed" : ""}" data-action="level" data-level="${l.id}" ${locked ? "disabled" : ""} aria-label="第${l.id}关 ${bodyInfo(l.body).name} ${l.name}${locked ? "，未解锁" : ""}">${l.id}</button>`;
}
function chapterRoutes() {
  const open = unlocked(save);
  const complete = LEVELS.filter((l) => save.stars[l.id]).length;
  return `<div class="journey-heading"><h2>观测航线</h2><div class="journey-progress"><span><strong>${complete}</strong> / 25 关</span><progress value="${complete}" max="25" aria-label="已通关关卡"></progress></div></div><div class="chapter-tabs" role="group" aria-label="选择观测章节">${CHAPTERS.map((chapter, i) => {
    const levels = LEVELS.filter((l) => l.chapter === i);
    const done = levels.filter((l) => save.stars[l.id]).length;
    return `<button class="chapter-tab ${i === homeChapter ? "active" : ""}" data-action="select-chapter" data-chapter="${i}" aria-pressed="${i === homeChapter}"><span class="chapter-number">0${i + 1}</span><span><strong>${chapter.name}</strong><small>${done}/5</small></span></button>`;
  }).join("")}</div><div class="mission-cards">${LEVELS.filter(l => l.chapter === homeChapter).map(l => {
    const stars = save.stars[l.id] || 0;
    const locked = l.id > open;
    const status = locked ? `通关第 ${l.id - 1} 关后开启` : stars ? "再次观测 ↗" : "开始观测 →";
    return `<button class="mission-card ${stars ? "passed" : ""} ${!stars && !locked ? "current" : ""}" data-action="level" data-level="${l.id}" ${locked ? "disabled" : ""} ${!stars && !locked ? 'aria-current="step"' : ""} aria-label="第${l.id}关 ${l.name}，${locked ? status : stars ? `${stars}星，再次观测` : "当前关卡，开始观测"}"><span class="mission-card-top">第 ${String(l.id).padStart(2, "0")} 关 <small>${l.checkpoint ? "验收" : bodyInfo(l.body).name}</small></span><div class="mission-card-art" aria-hidden="true">${planetSVG(l.body)}</div><strong>${l.name}</strong><span class="mission-card-bottom"><span class="mission-stars" aria-hidden="true">${"★".repeat(stars)}<i>${"☆".repeat(3 - stars)}</i></span><small>${locked ? "未解锁" : stars ? "重玩 ↗" : "开始 →"}</small></span></button>`;
  }).join("")}</div>`;
}
function renderHomeJourney(preserveScroll = false) {
  const previousScroll = preserveScroll ? $("home-solar").querySelector(".chapter-tabs")?.scrollLeft || 0 : 0;
  $("home-solar").innerHTML = chapterRoutes() + `<details class="solar-overview"><summary>太阳系星图</summary>${solarChart()}</details>`;
  const tabs = $("home-solar").querySelector(".chapter-tabs");
  tabs.scrollLeft = previousScroll;
  const active = tabs.querySelector('[aria-pressed="true"]').getBoundingClientRect();
  const bounds = tabs.getBoundingClientRect();
  if (active.right > bounds.right) tabs.scrollLeft += active.right - bounds.right + 4;
  else if (active.left < bounds.left) tabs.scrollLeft -= bounds.left - active.left + 4;
}
function levelsForBody(id) {
  return LEVELS.filter((l) => l.body === id || (id === "earth" && l.body === "earthmoon"));
}
function solarChart() {
  const bodyButton = (id, extra = "") => {
    const b = bodyInfo(id),
      levels = levelsForBody(id),
      done = levels.filter((l) => save.stars[l.id]).length;
    return `<button class="solar-body ${done ? "lit" : ""} ${extra}" data-action="body" data-body="${id}" aria-label="${b.name} ${b.type}，${done}/${levels.length}节点已接通">${planetSVG(id)}<span>${b.name}</span><small>${b.type}</small></button>`;
  };
  return `<div class="solar-system"><div class="sun-column">${bodyButton("sun")}</div><div class="planet-track">${PLANETS.map((id) => `<div class="planet-stop">${bodyButton(id)}${id === "earth" ? `<div class="moon-inset">${bodyButton("moon")}</div>` : ""}</div>`).join("")}</div></div>`;
}
function bodyDetail(id) {
  const b = bodyInfo(id),
    levels = levelsForBody(id);
  modal(
    b.name,
    `<div class="body-detail-art">${planetSVG(id)}</div><p>${b.type}</p><div class="body-levels">${levels.map((l) => `<div>${levelButton(l)}<span>第 ${l.id} 关 · ${l.name}</span></div>`).join("")}</div><button class="action-button outline" data-action="atlas" data-body="${id}">查看知识卡</button>`,
    "body",
  );
}
function atlas(filter = "all") {
  if (screen === "game") pause();
  closeModal();
  audio.stop();
  clearSignals();
  session = null;
  practice = null;
  countdown = null;
  show("atlas");
  $("atlas-count").textContent = `${save.cards.length} / 25 已收藏`;
  $("atlas-solar").innerHTML = solarChart();
  const filters = [
    ["all", "全部"],
    ...BODIES.filter((b) => CARDS.some((c) => c.body === b.id)).map((b) => [b.id, b.name]),
    ["exploration", "真实探索"],
  ];
  $("atlas-filters").innerHTML = filters
    .map(
      ([id, label]) =>
        `<button class="${filter === id ? "active" : ""}" data-action="atlas-filter" data-body="${id}" aria-pressed="${filter === id}">${label}</button>`,
    )
    .join("");
  const cards = CARDS.filter(
    (c) =>
      filter === "all" ||
      (filter === "exploration"
        ? c.kind === "真实探索"
        : c.body === filter || (filter === "earth" && c.body === "earthmoon")),
  );
  $("atlas-cards").innerHTML = cards
    .map((c) =>
      save.cards.includes(c.id)
        ? cardHTML(c.id)
        : `<article class="knowledge-card locked"><span>${c.code} · ${bodyInfo(c.body).name}</span>${c.id === 25 ? galaxySVG() : planetSVG(c.body)}<strong>${c.title}</strong><p>第 ${c.id} 关通关后收藏</p></article>`,
    )
    .join("");
}
function renderPracticeStep() {
  $("examples")
    .querySelectorAll(".example")
    .forEach((el, i) => {
      el.classList.toggle("practice-current", !!practice && i === practice.cursor);
      const button = el.querySelector("button");
      if (button && practice) button.disabled = i !== practice.cursor || practice.hit.has(i);
    });
}
function home() {
  closeModal();
  audio.stop();
  session = null;
  practice = null;
  countdown = null;
  clearSignals();
  selected = unlocked(save);
  const l = LEVELS[selected - 1];
  homeChapter = l.chapter;
  show("home");
  $("continue-label").textContent = LEVELS.every(l => save.stars[l.id]) ? "重温旅程结尾" : Object.keys(save.stars).length ? "继续旅程" : "开始旅程";
  $("hero-planet").innerHTML = planetSVG(l.body);
  $("hero-body-name").textContent = bodyInfo(l.body).name;
  $("home-towers").innerHTML = CHAPTERS.map(
    (c, i) =>
      `<div class="home-tower" role="img" title="${c.tower}，${towerProgress(save, i)}/5" aria-label="${c.tower}，${towerProgress(save, i)}/5"><div aria-hidden="true">${towerSVG(towerProgress(save, i), c.color)}</div></div>`,
  ).join("");
  renderHomeJourney();
}
function briefing(id) {
  if (id > unlocked(save) || id < 1 || id > 25) return;
  closeModal();
  audio.stop();
  session = null;
  countdown = null;
  clearSignals();
  selected = id;
  const l = LEVELS[id - 1],
    c = CHAPTERS[l.chapter];
  show("briefing");
  $("briefing-number").textContent = `第 ${id} 关`;
  $("briefing-title").textContent = l.name;
  $("briefing-rule").textContent = `只点：${ruleText(l.rule)}`;
  $("briefing-details").open = false;
  $("briefing-demo").textContent = l.demo;
  $("briefing-tower").innerHTML = planetSVG(l.body);
  $("briefing-chapter").textContent = c.name;
  $("pass-requirement").textContent =
    `${l.duration} 秒 · 目标接收 ≥ ${pct(l.minHit)} · 干扰识别 ≥ ${pct(1 - l.maxFalse)}`;
  const mustPractice = l.practice && !save.practiced.includes(id);
  practice = mustPractice
    ? { remaining: 5, hit: new Set(), failed: false, examples: examples(l), cursor: 0 }
    : null;
  $("examples").innerHTML = examples(l)
    .map(
      (s, i) =>
        `<div class="example">${mustPractice ? `<button data-action="practice" data-index="${i}" aria-label="练习：${signalName(s)}">${signalSVG(s)}</button>` : signalSVG(s)}<span class="example-cue ${s.target ? "yes" : "no"}" role="img" aria-label="${s.target ? "点击目标" : "忽略干扰"}">${icon(s.target ? "accept" : "ignore")}</span></div>`,
    )
    .join("");
  $("ready").disabled = mustPractice;
  $("ready").innerHTML = mustPractice ? "先完成练习" : "我会了 <b>➜</b>";
  $("practice-hint").className = "practice-hint";
  $("practice-hint").textContent = mustPractice ? "练习 1 / 3 · 5 秒" : "";
  renderPracticeStep();
  last = performance.now();
}
function practiceClick(index) {
  if (!practice || practice.remaining <= 0) return;
  if (index !== practice.cursor) return;
  const s = practice.examples[index],
    button = $("examples").querySelector(`[data-index="${index}"]`);
  if (s.target) {
    if (practice.hit.has(index)) return;
    practice.hit.add(index);
    button.disabled = true;
    button.classList.add("confirmed");
    audio.play("hit");
  } else {
    practice.failed = true;
    button.classList.add("wrong");
    $("practice-hint").className = "practice-hint wrong";
    $("practice-hint").textContent = "再试一次";
    audio.play("error");
  }
}
function tickPractice(dt) {
  if (!practice || $("modal").open || document.hidden) return;
  const before = Math.ceil(practice.remaining);
  practice.remaining -= dt;
  const completed = Math.min(3, Math.floor((5 - practice.remaining + 1e-8) / (5 / 3)));
  while (practice.cursor < completed) {
    if (practice.examples[practice.cursor].target && !practice.hit.has(practice.cursor))
      practice.failed = true;
    practice.cursor++;
  }
  renderPracticeStep();
  if (practice.remaining > 0) {
    if (before !== Math.ceil(practice.remaining) && !practice.failed)
      $("practice-hint").textContent =
        `练习 ${Math.min(3, practice.cursor + 1)} / 3 · ${Math.ceil(practice.remaining)} 秒`;
    return;
  }
  const okay =
    !practice.failed && practice.examples.every((s, i) => !s.target || practice.hit.has(i));
  if (okay) {
    save.practiced = [...new Set([...save.practiced, selected])];
    persist();
    $("practice-hint").className = "practice-hint";
    $("practice-hint").textContent = "";
    $("ready").disabled = false;
    $("ready").innerHTML = "我会了 <b>➜</b>";
    practice = null;
  } else {
    practice = null;
    $("practice-hint").className = "practice-hint wrong";
    $("practice-hint").textContent = "再试一次";
    $("ready").disabled = false;
    $("ready").textContent = "重新练习";
  }
}
function start() {
  const l = LEVELS[selected - 1];
  if (l.practice && !save.practiced.includes(selected)) {
    briefing(selected);
    return;
  }
  closeModal();
  audio.unlock();
  audio.play("launch");
  audio.bed(true);
  practice = null;
  clearSignals();
  session = new Session(l);
  countdown = 3;
  show("game");
  syncReceiver();
  world.level = l;
  $("game-root").classList.remove("paused");
  $("play-level").textContent =
    `${CHAPTERS[l.chapter].name} / ${String(selected).padStart(2, "0")}`;
  $("play-name").textContent = l.name;
  $("scanners").innerHTML = "";
  $("environment-clouds").hidden = !(l.backgroundClouds || l.backgroundDust);
  $("active-rule").innerHTML = l.rule
    .map((r) => {
      const sample = examples({ ...l, rule: [r] })[0];
      return `<span class="rule-symbol">${signalSVG(sample)}</span><span>${esc(ruleText([r]))}</span>`;
    })
    .join("<span>或</span>");
  $("countdown").hidden = false;
  $("countdown").querySelector("strong").textContent = "3";
  $("countdown-rule").textContent = ruleText(l.rule);
  $("judgment").className = "judgment";
  $("judgment").textContent = "";
  $("combo").className = "combo";
  $("hits").textContent = "0";
  const targetCount = session.schedule.filter((s) => s.target).length;
  const tileRows = Math.max(1, Math.round(Math.sqrt(targetCount / 1.15)));
  const tiles = Array.from({ length: tileRows }, (_, row) => {
    const count = Math.floor(targetCount / tileRows) + (row < targetCount % tileRows ? 1 : 0);
    return `<div class="observation-tile-row">${"<i></i>".repeat(count)}</div>`;
  }).join("");
  $("play-tower").innerHTML =
    `<div class="observation-image">${planetSVG(l.body)}<div class="observation-tiles">${tiles}</div></div>`;
  $("play-tower-name").textContent = bodyInfo(l.body).name;
  $("repair-segments").innerHTML =
    `<span id="image-progress">0 / ${targetCount}</span>`;
  updateTime();
  last = performance.now();
  lastRenderSecond = -1;
}
function updateTime() {
  if (!session) return;
  const remaining = Math.max(0, session.level.duration - session.elapsed);
  $("timer").textContent = Math.ceil(remaining);
  $("timer-ring").style.strokeDashoffset = 176 * (1 - remaining / session.level.duration);
  $("timer").parentElement.classList.toggle("urgent", remaining <= 10);
}
function renderSignals() {
  if (!session) return;
  const live = new Set(session.active.map((s) => s.id)),
    now = session.elapsed;
  for (const [id, node] of nodes) {
    if (!live.has(id)) {
      node.el.remove();
      node.dust.remove();
      nodes.delete(id);
    }
  }
  for (const s of session.active) {
    let node = nodes.get(s.id);
    if (!node) {
      const el = document.createElement("button"),
        dust = document.createElement("div");
      el.className = "signal-pod";
      el.dataset.signal = s.id;
      el.style.setProperty("--signal-color", COLORS[s.color]);
      el.setAttribute("aria-label", signalName(s));
      el.innerHTML = signalSVG(s);
      dust.className = "signal-dust";
      dust.setAttribute("aria-hidden", "true");
      dust.hidden = true;
      $("signals").append(el, dust);
      node = { el, dust, s };
      nodes.set(s.id, node);
    }
    const pos = positionOf(s, now, world.width, world.height, session.level);
    node.pos = pos;
    const size = world.width <= 550 ? 62 : 72;
    node.el.style.transform = `translate(${pos.x - size / 2}px,${pos.y - size / 2}px)`;
    const obscured = isHidden(s, now);
    node.el.classList.toggle("obscured", obscured);
    node.el.setAttribute("aria-disabled", String(obscured));
    node.el.tabIndex = obscured ? -1 : 0;
    node.dust.hidden = !obscured;
    const coverWidth = size * 1.45;
    node.dust.style.width = `${coverWidth}px`;
    node.dust.style.height = `${size}px`;
    node.dust.style.transform = `translate(${pos.x - coverWidth / 2}px,${pos.y - size / 2}px) rotate(${s.id % 2 ? -7 : 7}deg)`;
  }
}
function consume() {
  for (const e of session.events.splice(0)) {
    if (e.kind === "rejections") continue;
    const p = positionOf(e.signal, e.time, world.width, world.height, session.level),
      good = e.kind === "hits";
    world.burst(p.x, p.y, good ? COLORS[e.signal.color] : "#f3a98d", good ? "hit" : "error");
    const node = nodes.get(e.signal.id);
    if (node) {
      node.el.remove();
      node.dust?.remove();
      nodes.delete(e.signal.id);
    }
    $("judgment").textContent = good
      ? "接收成功"
      : e.kind === "misses"
        ? "目标漏接"
        : mismatch(e.signal, session.level.rule);
    $("judgment").className = good ? "judgment visible" : "judgment visible error";
    feedbackUntil = session.elapsed + 0.8;
    audio.play(good ? "hit" : "error");
    $("hits").textContent = session.stats.hits;
    $("image-progress").textContent =
      `${session.stats.hits} / ${session.schedule.filter((s) => s.target).length}`;
    $("play-tower")
      .querySelectorAll(".observation-tiles i")
      .forEach((tile, i) =>
        tile.classList.toggle(
          "restored",
          i < session.stats.hits,
        ),
      );
    $("scanners").classList.toggle("accepted", good);
  }
  const streak = session.stats.streak;
  if (streak >= 5) {
    $("combo").innerHTML = `${streak}<small>连续正确</small>`;
    $("combo").className = "combo visible";
  } else $("combo").className = "combo";
}
function clickSignal(id) {
  if (session?.state !== "playing") return;
  audio.unlock();
  const result = session.click(id);
  if (result !== "hits" && result !== "falseAlarms") return;
  consume();
  renderSignals();
}
function finish() {
  audio.stop();
  clearSignals();
  countdown = null;
  $("countdown").hidden = true;
  const r = session.result(),
    l = session.level;

  save = recordResult(save, session);
  persist();
  show("result");
  $("result-kicker").textContent = `第 ${l.id} 关 · ${l.name}`;
  $("result-stars").innerHTML = [1, 2, 3]
    .map((n) => `<span class="${n <= r.stars ? "earned" : ""}">★</span>`)
    .join("");
  $("result-title").textContent = r.passed ? "信号接通" : "再试一次";
  $("result-details").open = false;
  $("result-card").hidden = false;
  $("result-card").innerHTML = cardHTML(l.id, { narrated: true });
  document.querySelector(".result-content").classList.remove("without-card");
  $("result-score").textContent = r.clarity ?? 0;
  $("score-ring").style.strokeDashoffset = 490 * (1 - (r.clarity ?? 0) / 100);
  $("result-hit").textContent = pct(r.hitRate);
  $("result-reject").textContent = pct(r.rejectionRate);
  $("next").hidden = !r.passed;
  $("next").innerHTML = l.id === 25 ? "完成旅程 <b>➜</b>" : l.checkpoint ? "章节验收 <b>➜</b>" : "下一关 <b>➜</b>";
  celebrated = false;
  if (r.passed) {
    audio.play("win");
    world.celebrate(CHAPTERS[l.chapter].color);
  } else audio.play("error");
}
function chapter() {
  const l = LEVELS[selected - 1],
    c = CHAPTERS[l.chapter];
  show("chapter");
  $("chapter-repaired").textContent = `第${["一", "二", "三", "四", "五"][l.chapter]}章完成`;
  $("chapter-art").innerHTML =
    selected === 10
      ? `<div class="chapter-inner-planets">${["sun", "mercury", "venus"].map(id => `<div>${planetSVG(id)}<span>${bodyInfo(id).name}</span></div>`).join("")}</div>`
      : planetSVG(l.body);
  $("chapter-network").innerHTML = CHAPTERS.map(
    (c, i) =>
      `<div class="chapter-stamp ${towerProgress(save, i) === 5 ? "earned" : ""}">✧<small>${c.badge}</small></div>`,
  ).join("");
  $("chapter-network").hidden = false;
  $("chapter-network").style.setProperty(
    "--network-progress",
    `${(session.level.chapter / 4) * 100}%`,
  );
  $("chapter-title").textContent =
    selected === 10
      ? "向阳观测，任务完成"
      : `${c.name} · 验收完成`;
  $("chapter-line").textContent =
    selected === 10
      ? "太阳、水星和金星的五项观测任务已完成，向阳观测节点全部接通！"
      : `${c.name}的五个观测节点已接通`;
  $("chapter-badge").textContent = `✧ 获得徽章 · ${c.badge}`;
  $("chapter-next").innerHTML = "继续旅程 <b>➜</b>";
  audio.play("repair");
  world.celebrate(c.color);
  celebrated = true;
}
function next() {
  if (!session?.result().passed) return;
  if (session.level.id === 25) ending();
  else if (session.level.checkpoint && !celebrated) chapter();
  else briefing(selected + 1);
}
function ending() {
  audio.stop();
  clearSignals();
  $("ending-screen").innerHTML = endingHTML(save);
  show("ending");
  $("ending-screen").scrollTop = 0;
  audio.play("repair");
  world.celebrate("#edc994");
}
function modal(title, html, mode) {
  modalMode = mode;
  $("modal-content").innerHTML =
    `<div class="modal-heading"><h2 id="modal-title">${title}</h2><button data-action="close" aria-label="关闭弹窗">${icon("close")}</button></div>${html}`;
  if (!$("modal").open) $("modal").showModal();
}
function closeModal() {
  if ($("modal").open) $("modal").close();
  modalMode = null;
}
function pause() {
  if (screen !== "game" || !session || !["playing", "ready"].includes(session.state)) return;
  if (session.state === "playing") session.pause();
  else session.state = "paused-countdown";
  audio.stop();
  $("game-root").classList.add("paused");
  modal(
    "已暂停",
    `<button class="action-button gold" data-action="resume">继续 <b>➜</b></button><button class="action-button outline" data-action="restart">重新开始</button><button class="action-button outline" data-action="settings">设置</button><button class="action-button outline" data-action="quit">返回主页</button>`,
    "pause",
  );
}
function resume() {
  closeModal();
  audio.unlock();
  if (session?.state === "paused") session.resume();
  if (session?.state === "paused-countdown") session.state = "ready";
  last = performance.now();
  $("game-root").classList.remove("paused");
  if (screen === "game") audio.bed(true);
}
function settings() {
  if (screen === "game") pause();
  modal(
    "设置",
    `<div class="setting-row"><span>声音</span><button data-action="sound" aria-label="声音" aria-pressed="${!save.muted}">${save.muted ? "已关闭" : "已开启"}</button></div><button class="action-button outline" data-action="help">玩法说明</button><button class="action-button outline" data-action="records">航行记录</button><button class="action-button outline" data-action="clear-records">清空本地记录</button><p class="settings-note">星级、收藏与航行记录自动保存在当前浏览器。</p>`,
    "settings",
  );
}
function confirmClearRecords() {
  modal(
    "清空本地记录？",
    '<p>将清除当前浏览器中的所有关卡进度、星星、知识卡收藏和航行记录，恢复初始设置，并返回主页。清空后无法恢复。</p><button class="action-button gold" data-action="settings">取消</button><button class="action-button outline" data-action="confirm-clear-records">确认清空</button>',
    "clear-records",
  );
}
function clearLocalRecords() {
  if (modalMode !== "clear-records") return;
  try {
    localStorage.removeItem(storageKey);
  } catch {
    toast("清空失败，请检查浏览器是否允许访问本地存储。");
    return;
  }
  save = readSave(null);
  preferences();
  home();
  toast("本地记录已清空，可以重新开始旅程。");
}
function help() {
  const l = LEVELS[selected - 1];
  modal(
    "认准图案",
    `<p class="help-target">${esc(ruleText(l.rule))}</p>${signalGuide(l)}<details class="rule-details"><summary>规则详情</summary><p>点击符合规则的信号，飞出前接住它。</p><p>空格 / Esc 暂停。</p></details><button class="action-button gold" data-action="close">知道了</button>`,
    "help",
  );
}
function signalGuide(level) {
  return `<div class="signal-guide">${examples(level).map(s => `<div class="signal-guide-item ${s.target ? "target" : "ignore"}"><div class="signal-guide-art" role="img" aria-label="${esc(signalName(s))}">${signalSVG(s)}</div>${icon(s.target ? "accept" : "ignore")}<span>${s.target ? "点一下" : "不点"}</span></div>`).join("")}</div>`;
}
function records() {
  if (screen === "game") pause();
  const rows = [...save.history].reverse();
  modal(
    "航行记录",
    rows.length
      ? rows
          .slice(0, 25)
          .map(
            (r) =>
              `<div class="log-row"><div>第 ${r.level} 关 · ${r.ruleVersion === 4 ? LEVELS[r.level - 1].name : "旧版记录"}<small>${pct(r.hitRate)} 接收 · ${pct(r.rejectionRate)} 识别 · ${r.passed ? "通过" : "重试"}</small></div><span>${r.clarity}</span></div>`,
          )
          .join("") + '<button class="action-button outline" data-action="export">导出记录</button>'
      : "<p>暂无记录</p>",
    "records",
  );
}
function exportRecords() {
  const blob = new Blob(
      [
        JSON.stringify(
          { version: 2, exportedAt: new Date().toISOString(), history: save.history },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    ),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "星际信号站-航行记录.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function routeAction(action, button) {
  audio.unlock();
  if (action === "practice") {
    practiceClick(Number(button.dataset.index));
    return;
  }
  if (action === "level") {
    briefing(Number(button.dataset.level));
    return;
  }
  switch (action) {
    case "select-chapter":
      homeChapter = Number(button.dataset.chapter);
      renderHomeJourney(true);
      $("home-solar").querySelector(`[data-chapter="${homeChapter}"]`).focus({ preventScroll: true });
      break;
    case "body":
      bodyDetail(button.dataset.body);
      break;
    case "atlas":
      atlas(button.dataset.body || "all");
      break;
    case "atlas-filter":
      atlas(button.dataset.body);
      break;
    case "chapter-card":
      modal("观测知识", cardHTML(selected), "card");
      break;
    case "rules":
      pause();
      modal(
        "本关规则",
        `<p class="help-target">只点：${esc(ruleText(session.level.rule))}</p>${signalGuide(session.level)}<details class="rule-details"><summary>规则详情</summary><p>${esc(session.level.demo)}</p></details><button class="action-button gold" data-action="resume">继续</button>`,
        "rules",
      );
      break;
    case "home":
      home();
      break;
    case "retry":
      briefing(selected);
      break;
    case "restart":
      if (screen === "game" && session && ["paused", "paused-countdown"].includes(session.state)) start();
      break;
    case "resume":
      resume();
      break;
    case "quit":
      modal(
        "返回主页？",
        '<p>本局进度不会保存。</p><button class="action-button gold" data-action="resume">继续本局</button><button class="action-button outline" data-action="home">返回主页</button>',
        "quit",
      );
      break;
    case "close":
      if (session && ["paused", "paused-countdown"].includes(session.state)) resume();
      else closeModal();
      break;
    case "sound":
      save.muted = !save.muted;
      persist();
      preferences();
      settings();
      break;
    case "settings":
      settings();
      break;
    case "clear-records":
      confirmClearRecords();
      break;
    case "confirm-clear-records":
      clearLocalRecords();
      break;
    case "help":
      help();
      break;
    case "records":
      records();
      break;
    case "export":
      exportRecords();
      break;
  }
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (b && !b.disabled) routeAction(b.dataset.action, b);
});
$("continue").addEventListener("click", () => {
  audio.unlock();
  audio.play("click");
  if (LEVELS.every(l => save.stars[l.id])) ending();
  else briefing(unlocked(save));
});
$("brand-home").addEventListener("click", home);
$("records").addEventListener("click", records);
$("ready").addEventListener("click", start);
$("pause").addEventListener("click", pause);
$("next").addEventListener("click", next);
$("chapter-next").addEventListener("click", () =>
  briefing(selected + 1),
);
$("settings").addEventListener("click", settings);
$("sound").addEventListener("click", () => {
  save.muted = !save.muted;
  persist();
  preferences();
  if (!save.muted) audio.play("click");
});
$("fullscreen").addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    toast("当前浏览器不支持全屏");
  }
});
$("signals").addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  const b = e.target.closest("[data-signal]");
  if (!b) return;
  e.preventDefault();
  clickSignal(Number(b.dataset.signal));
});
$("signals").addEventListener("click", (e) => {
  if (e.detail !== 0) return;
  const b = e.target.closest("[data-signal]");
  if (b) clickSignal(Number(b.dataset.signal));
});
$("modal").addEventListener("cancel", (e) => {
  e.preventDefault();
  routeAction("close");
});
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && screen === "game" && !$("modal").open) {
    e.preventDefault();
    if (!e.repeat) pause();
    return;
  }
  if (e.repeat) return;
  if (e.code === "Escape" && !$("modal").open && screen === "game") {
    e.preventDefault();
    pause();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pause();
    audio.stop();
  } else last = performance.now();
});
window.addEventListener("blur", () => {
  if (!$("modal").open) pause();
});
function syncReceiver() {
  const ship = $("battle-ship").getBoundingClientRect();
  const field = $("game-root").getBoundingClientRect();
  if (!ship.width) return;
  world.receiver = {
    x: ship.left - field.left + ship.width / 2,
    y: ship.top - field.top + ship.height / 2,
    r: ship.width * 0.56,
  };
}
$("battle-ship").querySelector("img").addEventListener("load", syncReceiver);
new ResizeObserver(() => {
  world.resize();
  syncReceiver();
  if (session) renderSignals();
}).observe($("game-root"));
function frame(now) {
  let dt = last ? Math.max(0, (now - last) / 1000) : 0;
  last = now;
  if (dt > 1) {
    if (screen === "game") pause();
    dt = 0;
  }
  if (screen === "briefing") tickPractice(dt);
  if (screen === "game" && session && ["playing", "ready"].includes(session.state)) {
    if (countdown !== null) {
      const before = Math.ceil(countdown);
      countdown -= dt;
      if (countdown <= 0) {
        countdown = null;
        $("countdown").hidden = true;
        session.start();
      } else if (Math.ceil(countdown) !== before) {
        $("countdown").querySelector("strong").textContent = Math.ceil(countdown);
        audio.play("count");
      }
    } else {
      session.tick(dt);
      consume();
      renderSignals();
      if (Math.ceil(session.elapsed) !== lastRenderSecond) {
        lastRenderSecond = Math.ceil(session.elapsed);
        updateTime();
      }
      if (session.elapsed > feedbackUntil) {
        $("judgment").classList.remove("visible");
        $("scanners").classList.remove("accepted");
      }
      if (session.state === "finished") finish();
    }
  }
  world.draw(Math.min(dt, 0.08), session);
  if (now > toastUntil) $("toast").classList.remove("visible");
  requestAnimationFrame(frame);
}
$("home-companion").innerHTML = bunnySVG;
$("home-companion").addEventListener("click", () => {
  const bunny = $("home-companion");
  bunny.classList.remove("greeting");
  void bunny.offsetWidth;
  bunny.classList.add("greeting");
  audio.unlock();
  audio.play("click");
});
$("home-companion").addEventListener("animationend", (event) => {
  if (event.animationName === "bunny-greeting" || event.animationName === "bunny-greeting-gentle") {
    $("home-companion").classList.remove("greeting");
  }
});
$("fullscreen").innerHTML = icon("fullscreen");
$("settings").innerHTML = icon("settings");
$("pause").innerHTML = icon("pause");
preferences();
home();
requestAnimationFrame(frame);
// Same-origin configuration can be updated independently from the client. Loading never blocks play beyond 1.5 seconds.
const abort = new AbortController(),
  timeout = setTimeout(() => abort.abort(), 1500);
fetch("./config.json", { signal: abort.signal, cache: "no-cache" })
  .then((r) => (r.ok ? r.json() : null))
  .then((config) => {
    if (config?.version === 2 && raw === null && config.soundDefault === false) {
      save.muted = true;
      preferences();
    }
  })
  .catch(() => {})
  .finally(() => {
    clearTimeout(timeout);
    $("loading").classList.add("done");
    setTimeout(() => ($("loading").hidden = true), 350);
  });
