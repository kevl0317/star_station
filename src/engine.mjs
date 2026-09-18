import { LEVELS, matches, seeded, signalPool, similarity } from "./levels.mjs";
export { LEVELS, COLORS, COLOR_NAMES, SHAPE_NAMES, ruleText, matches, seeded } from "./levels.mjs";
export function sequence(targets, distractors, random, drought = false) {
  const result = [],
    memo = new Map();
  function possible(t, d, last = -1, run = 0) {
    if (t === 0 && d === 0) return true;
    const key = `${t},${d},${last},${run}`;
    if (memo.has(key)) return memo.get(key);
    const ok =
      (t > 0 && (last !== 1 || run < 2) && possible(t - 1, d, 1, last === 1 ? run + 1 : 1)) ||
      (d > 0 && (last !== 0 || run < 6) && possible(t, d - 1, 0, last === 0 ? run + 1 : 1));
    memo.set(key, ok);
    return ok;
  }
  let last = -1,
    run = 0;
  if (drought && distractors >= 5) {
    for (let i = 0; i < 5; i++) result.push(false);
    distractors -= 5;
    last = 0;
    run = 5;
  }
  while (targets + distractors > 0) {
    const candidates = [];
    if (
      targets &&
      (last !== 1 || run < 2) &&
      possible(targets - 1, distractors, 1, last === 1 ? run + 1 : 1)
    )
      candidates.push(1);
    if (
      distractors &&
      (last !== 0 || run < 6) &&
      possible(targets, distractors - 1, 0, last === 0 ? run + 1 : 1)
    )
      candidates.push(0);
    if (!candidates.length) throw new Error("Invalid signal quotas");
    const value =
      candidates.length === 1
        ? candidates[0]
        : random() < targets / (targets + distractors)
          ? 1
          : 0;
    result.push(!!value);
    if (value) targets--;
    else distractors--;
    run = last === value ? run + 1 : 1;
    last = value;
  }
  return result;
}
export function makeSchedule(level, seed = Date.now()) {
  const random = seeded(level.seed ?? seed),
    pick = (a) => a[Math.floor(random() * a.length)];
  let slots = [];
  if (level.phases) {
    for (let at = 0.65; at < level.duration;) {
      const phase = Math.min(2, Math.floor(at / (level.duration / 3))),
        life = [4.2, 3.4, 2.6][phase];
      if (at + life <= level.duration - 0.15) slots.push({ at, life });
      at += [1.6, 1.12, 0.8][phase];
    }
  } else {
    const count = level.count,
      first = 0.65,
      last = level.duration - level.life - 0.2;
    const weights = Array.from({ length: count - 1 }, () =>
      level.irregular ? 0.65 + random() * 0.85 : 1,
    );
    const total = weights.reduce((a, b) => a + b, 0);
    let at = first;
    for (let i = 0; i < count; i++) {
      slots.push({ at, life: level.life });
      if (i < count - 1) at += (weights[i] / total) * (last - first);
    }
  }
  const desired =
    level.targetCount ??
    Math.round(slots.length * (level.targetProbability + (random() - 0.5) * 0.03));
  const flags = sequence(desired, slots.length - desired, random, level.drought);
  const pool = signalPool(level),
    targets = pool.filter((s) => matches(s, level.rule));
  let decoys = pool.filter((s) => !matches(s, level.rule));
  if (level.baseline || (level.checkpoint && !level.similar))
    decoys = pool.filter(
      (s) =>
        (s.color === "blue" && s.shape === "circle") ||
        (s.color === "green" && s.shape === "triangle"),
    );
  if (level.easy)
    decoys = decoys.filter((s) =>
      level.rule.every((r) => s.color !== r.color && s.shape !== r.shape),
    );
  const near = decoys.filter((s) => similarity(s, level.rule) > 0);
  let previousZone = Math.floor(random() * 3);
  return slots.map((slot, i) => {
    if (level.scan === "three") previousZone = (previousZone + 1 + Math.floor(random() * 2)) % 3;
    const target = flags[i],
      appearance = pick(
        target ? targets : level.similar && near.length && random() < 0.8 ? near : decoys,
      );
    const signal = {
      ...appearance,
      ...slot,
      id: i + 1,
      target,
      lane: i % 6,
      side: random() < 0.5 ? -1 : 1,
      zone:
        level.scan === "three"
          ? previousZone
          : level.scan === "sides"
            ? random() < 0.5
              ? 0
              : 2
            : 1,
      phase: random() * Math.PI * 2,
      occluded: !!level.occlusion && slot.life >= 1.95 && random() < 0.22,
      occlusionStart: null,
    };
    if (signal.occluded) {
      // Leave at least 0.7 seconds clear before and after the occlusion.
      signal.occlusionStart = 0.7 + random() * (slot.life - 0.55 - 1.4);
    }
    return signal;
  });
}
export function isHidden(s, t) {
  const age = t - s.at;
  return s.occluded && age >= s.occlusionStart && age < s.occlusionStart + 0.55;
}
export function progressAt(s, t) {
  return Math.max(0, Math.min(1, (t - s.at) / s.life));
}
export function metrics(s, l) {
  const total = s.hits + s.misses,
    decoys = s.falseAlarms + s.rejections;
  const hitRate = total ? s.hits / total : null,
    rejectionRate = decoys ? s.rejections / decoys : null,
    falseRate = decoys ? s.falseAlarms / decoys : null;
  const clarity =
    hitRate === null || rejectionRate === null
      ? null
      : Math.round(hitRate * 60 + rejectionRate * 40);
  const passed =
    hitRate !== null && falseRate !== null && hitRate >= l.minHit && falseRate <= l.maxFalse;
  const stars = !passed
    ? 0
    : hitRate >= 0.95 && rejectionRate >= 0.95
      ? 3
      : hitRate >= 0.85 && rejectionRate >= 0.9
        ? 2
        : 1;
  return { hitRate, rejectionRate, falseRate, clarity, passed, stars };
}
export class Session {
  constructor(level, seed) {
    this.level = level;
    this.schedule = makeSchedule(level, seed);
    this.elapsed = 0;
    this.state = "ready";
    this.active = [];
    this.cursor = 0;
    this.events = [];
    this.log = [];
    this.resolved = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      falseAlarms: 0,
      rejections: 0,
      streak: 0,
      bestStreak: 0,
      reactions: [],
      duplicates: 0,
    };
  }
  start() {
    if (this.state === "ready") {
      this.state = "playing";
    }
  }
  pause() {
    if (this.state === "playing") this.state = "paused";
  }
  resume() {
    if (this.state === "paused") this.state = "playing";
  }
  judge(kind, s, time = this.elapsed) {
    if (this.resolved.has(s.id)) return;
    this.stats[kind]++;
    if (kind === "hits") this.stats.streak++;
    else if (kind !== "rejections") this.stats.streak = 0;
    this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.streak);
    if (kind === "hits") this.stats.reactions.push(time - s.at);
    this.resolved.set(s.id, kind);
    this.events.push({ kind, signal: s, time });
    this.log.push({
      type: kind,
      id: s.id,
      time,
      reaction: kind === "hits" ? time - s.at : undefined,
    });
  }
  tick(dt) {
    if (this.state !== "playing" || !Number.isFinite(dt) || dt <= 0) return;
    this.elapsed = Math.min(this.level.duration, this.elapsed + dt);
    while (
      this.cursor < this.schedule.length &&
      this.schedule[this.cursor].at <= this.elapsed + 1e-9
    ) {
      const s = this.schedule[this.cursor++];
      this.active.push(s);
      this.log.push({
        type: "stimulus",
        id: s.id,
        time: s.at,
        target: s.target,
        color: s.color,
        shape: s.shape,
        direction: s.direction,
        halo: s.halo,
        solid: s.solid,
        zone: s.zone,
        period: s.period,
      });
    }
    this.active = this.active.filter((s) => {
      if (this.elapsed + 1e-9 >= s.at + s.life) {
        this.judge(s.target ? "misses" : "rejections", s, s.at + s.life);
        return false;
      }
      return true;
    });
    if (this.elapsed >= this.level.duration) this.state = "finished";
  }
  click(id) {
    if (this.state !== "playing") return null;
    if (["hits", "falseAlarms"].includes(this.resolved.get(id))) {
      this.stats.duplicates++;
      this.log.push({ type: "duplicate_click", id, time: this.elapsed });
      return "duplicate_click";
    }
    const s = this.active.find((s) => s.id === id);
    if (!s || isHidden(s, this.elapsed) || this.elapsed + 1e-9 >= s.at + s.life) return null;
    this.active = this.active.filter((s) => s.id !== id);
    const kind = s.target ? "hits" : "falseAlarms";
    this.judge(kind, s);
    return kind;
  }
  receiveCurrent(repeat = false) {
    if (repeat || !this.active.length) return null;
    return this.click(this.active[0].id);
  }
  result() {
    return metrics(this.stats, this.level);
  }
}
export const SAVE_KEY = "star-signal-station-v2";
export function emptySave() {
  return {
    version: 2,
    ruleVersion: 4,
    stars: {},
    cards: [],
    shownCards: [],
    history: [],
    practiced: [],
    muted: false,
  };
}
export function readSave(raw) {
  const clean = emptySave();
  try {
    const d = JSON.parse(raw);
    if (d?.version !== 2) return clean;
    for (const [id, s] of Object.entries(d.stars ?? {}))
      if (Number.isInteger(+id) && +id >= 1 && +id <= 25 && Number.isInteger(s) && s >= 1 && s <= 3)
        clean.stars[id] = s;
    clean.cards = Object.keys(clean.stars)
      .map(Number)
      .sort((a, b) => a - b);
    clean.practiced =
      d.ruleVersion === 4 && Array.isArray(d.practiced)
        ? [...new Set(d.practiced.filter((x) => [1, 2, 3].includes(x)))]
        : [];
    clean.muted = d.muted === true;
    clean.history = Array.isArray(d.history)
      ? d.history
          .filter(
            (r) =>
              r &&
              Number.isInteger(r.level) &&
              r.level >= 1 &&
              r.level <= 25 &&
              typeof r.date === "string" &&
              Number.isFinite(Date.parse(r.date)) &&
              typeof r.passed === "boolean" &&
              ["clarity", "hitRate", "rejectionRate"].every(
                (k) => Number.isFinite(r[k]) && r[k] >= 0 && r[k] <= (k === "clarity" ? 100 : 1),
              ),
          )
          .slice(-100)
      : [];
    clean.shownCards = [
      ...new Set(
        [
          ...(Array.isArray(d.shownCards) ? d.shownCards : []),
          ...clean.cards,
          ...clean.history.map((r) => r.level),
        ].filter((id) => Number.isInteger(id) && id >= 1 && id <= 25),
      ),
    ].sort((a, b) => a - b);
    return clean;
  } catch {
    return clean;
  }
}
export function unlocked(save) {
  for (let i = 1; i <= 25; i++) if (!save.stars[i]) return i;
  return 25;
}
export function towerProgress(save, chapter) {
  return LEVELS.filter((l) => l.chapter === chapter && save.stars[l.id]).length;
}
export function recordResult(save, session) {
  if (session.state !== "finished") return save;
  const r = session.result(),
    next = structuredClone(save);
  next.shownCards = [...new Set([...(next.shownCards ?? []), session.level.id])].sort((a, b) => a - b);
  if (r.passed) {
    next.stars[session.level.id] = Math.max(next.stars[session.level.id] ?? 0, r.stars);
    next.cards = [...new Set([...(next.cards ?? []), session.level.id])].sort((a, b) => a - b);
  }
  next.history.push({
    level: session.level.id,
    ruleVersion: 4,
    date: new Date().toISOString(),
    ...r,
    hits: session.stats.hits,
    misses: session.stats.misses,
    falseAlarms: session.stats.falseAlarms,
    rejections: session.stats.rejections,
    duplicates: session.stats.duplicates,
    events: session.log,
  });
  next.history = next.history.slice(-100);
  return next;
}
