import test from "node:test";
import assert from "node:assert/strict";
import { LEVELS, CHAPTERS, matches, examples, signalPool } from "../src/levels.mjs";
import {
  Session,
  makeSchedule,
  metrics,
  isHidden,
  emptySave,
  readSave,
  recordResult,
  unlocked,
  towerProgress,
} from "../src/engine.mjs";
import { positionOf, receiverEdge, receiverCurve } from "../src/renderer.mjs";
test("每关首次结束记录知识卡展示，失败、重玩与刷新均不重复", () => {
  const initial = emptySave();
  assert.deepEqual(initial.shownCards, []);
  const failed = recordResult(initial, play(LEVELS[0], () => false));
  assert.deepEqual(initial.shownCards, []);
  assert.deepEqual(failed.shownCards, [1]);
  assert.deepEqual(failed.cards, []);
  const replayed = recordResult(readSave(JSON.stringify(failed)), play(LEVELS[0]));
  assert.deepEqual(replayed.shownCards, [1]);
  assert.deepEqual(replayed.cards, [1]);
  const next = recordResult(replayed, play(LEVELS[1]));
  assert.deepEqual(readSave(JSON.stringify(next)).shownCards, [1, 2]);
});
test("未结束不记录知识卡展示，历史截断后展示标记仍保留", () => {
  let save = emptySave();
  const playing = new Session(LEVELS[0], 32);
  playing.start();
  assert.deepEqual(recordResult(save, playing).shownCards, []);
  save = recordResult(save, play(LEVELS[0], () => false));
  const second = play(LEVELS[1], () => false);
  for (let i = 0; i < 101; i++) save = recordResult(save, second);
  assert.equal(save.history.length, 100);
  assert.ok(save.history.every((r) => r.level === 2));
  assert.deepEqual(readSave(JSON.stringify(save)).shownCards, [1, 2]);
});
test("旧存档已结束关卡迁移展示标记，并过滤非法知识卡编号", () => {
  const old = recordResult(emptySave(), play(LEVELS[1], () => false));
  delete old.shownCards;
  old.stars = { 1: 3 };
  assert.deepEqual(readSave(JSON.stringify(old)).shownCards, [1, 2]);
  old.shownCards = [3, 3, 0, 26, "4", null, 2.5];
  assert.deepEqual(readSave(JSON.stringify(old)).shownCards, [1, 2, 3]);
});
function play(level, behavior = (s) => s.target, seed = 32) {
  const s = new Session(level, seed);
  s.start();
  for (let n = 0; s.state !== "finished" && n < 1500; n++) {
    s.tick(0.05);
    for (const signal of [...s.active]) if (behavior(signal, s)) s.click(signal.id);
  }
  return s;
}
test("完整25关，五章各五关，关卡规则与脚本关键特征一致", () => {
  assert.equal(LEVELS.length, 25);
  assert.equal(CHAPTERS.length, 5);
  for (let c = 0; c < 5; c++) assert.equal(LEVELS.filter((l) => l.chapter === c).length, 5);
  assert.deepEqual(LEVELS[0].rule, [{ color: "blue", shape: "circle" }]);
  assert.deepEqual(LEVELS[2].rule, [{ shape: "star" }]);
  assert.deepEqual(LEVELS[5].rule, [{ shape: "circle", halo: true }]);
  assert.deepEqual(LEVELS[6].rule, [{ shape: "triangle", direction: "up" }]);
  assert.deepEqual(LEVELS[17].rule, [{ color: "purple", shape: "circle", solid: true }]);
  assert.equal(LEVELS[20].rule.length, 2);
  assert.equal(LEVELS[21].single, true);
  assert.equal(LEVELS[23].duration, 50);
});
for (const l of LEVELS)
  test(`第${l.id}关：准确判断能通关，所有刺激完整结算`, () => {
    const s = play(l);
    assert.equal(s.state, "finished");
    assert.equal(s.elapsed, l.duration);
    assert.equal(s.active.length, 0);
    assert.equal(s.stats.hits + s.stats.rejections, s.schedule.length);
    assert.equal(s.stats.misses, 0);
    assert.equal(s.stats.falseAlarms, 0);
    assert.equal(s.stats.streak, s.stats.hits, "未点击的干扰不增加或打断连续命中");
    assert.equal(s.stats.bestStreak, s.stats.hits);
    assert.equal(s.result().clarity, 100);
    assert.equal(s.result().stars, 3);
    assert.equal(s.result().passed, true);
  });
test("25关 × 120种子：目标最多连续2个、干扰最多连续6个，比例误差不超过3%", () => {
  for (const l of LEVELS)
    for (let seed = 1; seed <= 120; seed++) {
      const arr = makeSchedule(l, seed);
      let tr = 0,
        dr = 0;
      for (const s of arr) {
        tr = s.target ? tr + 1 : 0;
        dr = s.target ? 0 : dr + 1;
        assert.ok(tr <= 2, `L${l.id} target run`);
        assert.ok(dr <= 6, `L${l.id} decoy run`);
        assert.equal(s.target, matches(s, l.rule));
        assert.ok(s.at + s.life <= l.duration + 0.0001);
      }
      const targetCount = arr.filter((s) => s.target).length;
      if (l.checkpoint) {
        assert.equal(targetCount, 20);
        assert.equal(arr.length, 45);
      } else
        assert.ok(
          Math.abs(targetCount / arr.length - l.targetProbability) <= 0.03,
          `L${l.id}: ${targetCount}/${arr.length}`,
        );
    }
});
test("第5关50秒、20目标/25干扰、仅两种指定干扰，固定序列", () => {
  const l = LEVELS[4],
    a = makeSchedule(l, 1);
  assert.equal(l.duration, 50);
  assert.deepEqual(a, makeSchedule(l, 999));
  for (const s of a.filter((s) => !s.target))
    assert.ok(
      (s.color === "blue" && s.shape === "circle") ||
        (s.color === "green" && s.shape === "triangle"),
    );
});
test("第10关遮挡与相似干扰，第15关保持基准速度，第20/25关更快", () => {
  const base = LEVELS[4];
  assert.equal(LEVELS[9].occlusion, true);
  assert.equal(LEVELS[9].near, true);
  assert.equal(LEVELS[14].life, base.life);
  assert.ok(LEVELS[19].life < base.life);
  assert.ok(LEVELS[24].life < base.life);
  assert.equal(LEVELS[24].wide, true);
});
test("所有关前三个示例含目标和干扰，第21关演示两种目标", () => {
  for (const l of LEVELS) {
    const arr = examples(l);
    assert.equal(arr.length, 3);
    assert.ok(arr.some((s) => s.target));
    assert.ok(arr.some((s) => !s.target));
  }
  assert.equal(examples(LEVELS[20]).filter((s) => s.target).length, 2);
});
test("光环、方向、填充必须真实符合规则", () => {
  assert.equal(matches({ shape: "circle", halo: false }, LEVELS[5].rule), false);
  assert.equal(matches({ shape: "triangle", direction: "left" }, LEVELS[6].rule), false);
  assert.equal(matches({ color: "purple", shape: "circle", solid: false }, LEVELS[17].rule), false);
  for (const l of LEVELS) assert.ok(signalPool(l).some((s) => matches(s, l.rule)));
});
test("全程乱点或全部不点都不能过关", () => {
  for (const l of [LEVELS[0], LEVELS[16], LEVELS[24]]) {
    const clickAll = play(l, () => true),
      noClick = play(l, () => false);
    assert.equal(clickAll.result().passed, false);
    assert.equal(clickAll.result().falseRate, 1);
    assert.equal(noClick.result().passed, false);
    assert.equal(noClick.result().hitRate, 0);
    assert.equal(noClick.result().rejectionRate, 1);
  }
});
test("评分严格按60%接收率+40%识别率，不受反应速度或连击影响", () => {
  const stats = { hits: 8, misses: 2, falseAlarms: 1, rejections: 9, reactions: [0], streak: 999 };
  assert.equal(metrics(stats, LEVELS[0]).clarity, 84);
  assert.equal(metrics({ ...stats, reactions: [100] }, LEVELS[0]).clarity, 84);
  assert.equal(
    metrics({ hits: 7, misses: 3, falseAlarms: 5, rejections: 15 }, LEVELS[0]).passed,
    true,
  );
  assert.equal(
    metrics({ hits: 7, misses: 3, falseAlarms: 6, rejections: 14 }, LEVELS[0]).passed,
    false,
  );
});
test("暂停不走时、不移动、不能点击，恢复无额外漏接", () => {
  const s = new Session(LEVELS[0], 32);
  s.start();
  s.tick(1);
  const before = structuredClone(s.stats),
    active = structuredClone(s.active);
  s.pause();
  s.tick(100);
  assert.equal(s.elapsed, 1);
  assert.deepEqual(s.active, active);
  assert.equal(s.click(active[0].id), null);
  assert.deepEqual(s.stats, before);
  s.resume();
  assert.notEqual(s.click(active[0].id), null);
});
test("重复点击写入duplicate_click，但不重复计分或扣分", () => {
  const s = new Session(LEVELS[0], 32);
  s.start();
  s.tick(1);
  const id = s.active[0].id;
  const first = s.click(id),
    count = s.stats[first];
  assert.equal(s.click(id), "duplicate_click");
  assert.equal(s.stats[first], count);
  assert.equal(s.stats.duplicates, 1);
  assert.equal(s.log.at(-1).type, "duplicate_click");
});
test("目标首次命中立即移出活动列表，连点不增加命中或成功事件", () => {
  const s = new Session(LEVELS[0], 32);
  const target = s.schedule.find((signal) => signal.target);
  s.start();
  s.tick(target.at + 0.01);
  assert.equal(s.click(target.id), "hits");
  assert.ok(!s.active.some((signal) => signal.id === target.id));
  const eventCount = s.events.length;
  for (let i = 0; i < 5; i++) s.click(target.id);
  assert.equal(s.stats.hits, 1);
  assert.equal(s.events.length, eventCount);
});
test("连接线起点始终位于朝向目标的圆环边缘", () => {
  const receiver = { x: 200, y: 300, r: 90 };
  for (const target of [
    { x: 400, y: 300 },
    { x: 200, y: 100 },
    { x: 40, y: 500 },
    { x: 220, y: 310 },
  ]) {
    const edge = receiverEdge(receiver, target);
    assert.ok(Math.abs(Math.hypot(edge.x - receiver.x, edge.y - receiver.y) - receiver.r) < 1e-9);
    assert.ok(
      (edge.x - receiver.x) * (target.x - receiver.x) +
        (edge.y - receiver.y) * (target.y - receiver.y) >
        0,
    );
  }
  assert.equal(receiverEdge(receiver, receiver), null);
});
test("曲线在各方向与距离下都不进入圆内、不折返，短线弧度缩小且有上限", () => {
  const receiver = { x: 200, y: 300, r: 90 };
  for (let degrees = 0; degrees < 360; degrees += 5) {
    const angle = (degrees * Math.PI) / 180;
    const ux = Math.cos(angle),
      uy = Math.sin(angle);
    for (const gap of [0.01, 5, 30, 100, 500, 1500]) {
      const target = {
        x: receiver.x + ux * (receiver.r + gap),
        y: receiver.y + uy * (receiver.r + gap),
      };
      const { edge, control } = receiverCurve(receiver, target);
      const bend = Math.hypot(
        control.x - (edge.x + target.x) / 2,
        control.y - (edge.y + target.y) / 2,
      );
      assert.ok(Math.abs(bend - Math.min(gap * 0.22, 48)) < 1e-8);
      let previous = receiver.r;
      for (let step = 0; step <= 100; step++) {
        const t = step / 100,
          u = 1 - t;
        const x = u * u * edge.x + 2 * u * t * control.x + t * t * target.x;
        const y = u * u * edge.y + 2 * u * t * control.y + t * t * target.y;
        assert.ok(Math.hypot(x - receiver.x, y - receiver.y) >= receiver.r - 1e-8);
        const forward = (x - receiver.x) * ux + (y - receiver.y) * uy;
        assert.ok(forward >= previous - 1e-8);
        previous = forward;
      }
    }
  }
  for (const x of [200, 220, 290]) assert.equal(receiverCurve(receiver, { x, y: 300 }), null);
});
test("遮挡前完整出现，遮挡0.55秒且不可点击，恢复后可点", () => {
  const s = new Session(LEVELS[7], 32);
  const target = s.schedule.find((x) => x.occluded);
  assert.ok(target);
  s.start();
  s.tick(target.at + target.occlusionStart + 0.01);
  assert.equal(isHidden(target, s.elapsed), true);
  assert.equal(s.click(target.id), null);
  s.tick(0.56);
  assert.equal(isHidden(target, s.elapsed), false);
  assert.notEqual(s.click(target.id), null);
});
test("遮挡时间按信号随机分布，前后保留清晰窗口，暂停不推进遮挡", () => {
  for (const level of [LEVELS[7], LEVELS[9]]) {
    const starts = [];
    for (let seed = 1; seed <= 100; seed++) {
      for (const signal of makeSchedule(level, seed)) {
        if (!signal.occluded) {
          assert.equal(isHidden(signal, signal.at + signal.life / 2), false);
          continue;
        }
        const start = signal.occlusionStart;
        starts.push(start / signal.life);
        assert.ok(start >= 0.7);
        assert.ok(start + 0.55 <= signal.life - 0.7 + 1e-9);
        assert.equal(isHidden(signal, signal.at + start - 0.01), false);
        assert.equal(isHidden(signal, signal.at + start + 0.01), true);
        assert.equal(isHidden(signal, signal.at + start + 0.56), false);
      }
    }
    assert.ok(Math.min(...starts) < 0.3, "有些信号在前段遮挡");
    assert.ok(Math.max(...starts) > 0.55, "有些信号在后段遮挡");
    assert.ok(new Set(starts.map((v) => v.toFixed(3))).size >= 3);
  }
  const session = new Session(LEVELS[7], 32);
  const signal = session.schedule.find((s) => s.occluded);
  session.start();
  session.tick(signal.at + signal.occlusionStart + 0.1);
  const before = session.elapsed;
  session.pause();
  session.tick(10);
  assert.equal(session.elapsed, before);
  assert.equal(isHidden(signal, session.elapsed), true);
  session.resume();
  session.tick(0.5);
  assert.equal(isHidden(signal, session.elapsed), false);
});
test("第22关同一时刻只有一个信号，并覆盖三个区域", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const a = makeSchedule(LEVELS[21], seed);
    for (let i = 1; i < a.length; i++) assert.ok(a[i].at >= a[i - 1].at + a[i - 1].life);
    assert.equal(new Set(a.map((s) => s.zone)).size, 3);
  }
});
test("第24关慢中快三段保持同一规则，节奏及呈现时间均递进", () => {
  const a = makeSchedule(LEVELS[23], 5);
  const intervals = [[], [], []];
  for (let i = 0; i < a.length - 1; i++) {
    const phase = Math.floor(a[i].at / (50 / 3));
    intervals[phase].push(a[i + 1].at - a[i].at);
  }
  const mean = (x) => x.reduce((a, b) => a + b, 0) / x.length;
  assert.ok(mean(intervals[0]) > mean(intervals[1]));
  assert.ok(mean(intervals[1]) > mean(intervals[2]));
  assert.equal(new Set(a.map((s) => s.life)).size, 3);
});
test("第19关具有4—6个干扰组成的静默期", () => {
  const a = makeSchedule(LEVELS[18], 6);
  assert.ok(a.slice(0, 5).every((s) => !s.target));
});
test("相邻刺激不会完全重叠，窄屏各刺激留在可点击区域", () => {
  for (const l of LEVELS) {
    const arr = makeSchedule(l, 99);
    for (const s of arr) {
      const p = positionOf(s, s.at + s.life * 0.5, 390, 844, l);
      assert.ok(p.x >= p.r);
      assert.ok(p.x <= 390 - p.r);
      assert.ok(p.y >= 100);
      assert.ok(p.y <= 734);
    }
    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i - 1],
        s = arr[i];
      if (s.at < prev.at + prev.life) {
        const a = positionOf(prev, s.at, 1280, 800, l),
          b = positionOf(s, s.at, 1280, 800, l);
        assert.ok(Math.hypot(a.x - b.x, a.y - b.y) > 10);
      }
    }
  }
});
test("通关才修复通讯塔，五关完整修好，重复刷关不增加修复数", () => {
  let save = emptySave();
  assert.equal(unlocked(save), 1);
  save = recordResult(
    save,
    play(LEVELS[0], () => false),
  );
  assert.equal(unlocked(save), 1);
  assert.equal(towerProgress(save, 0), 0);
  for (let i = 0; i < 5; i++) save = recordResult(save, play(LEVELS[i]));
  assert.equal(unlocked(save), 6);
  assert.equal(towerProgress(save, 0), 5);
  save = recordResult(save, play(LEVELS[0]));
  assert.equal(towerProgress(save, 0), 5);
  assert.equal(save.stars[1], 3);
});
test("损坏存档安全降级，新版不误读旧版不同规则的通关记录", () => {
  assert.deepEqual(readSave("broken"), emptySave());
  assert.deepEqual(readSave('{"version":1,"unlocked":9}'), emptySave());
  const r = readSave(
    JSON.stringify({
      version: 2,
      ruleVersion: 4,
      stars: { 1: 3, 2: 1, 26: 3, 3: 9 },
      practiced: [1, 2, 99],
      history: [null, { level: 99 }],
    }),
  );
  assert.deepEqual(r.stars, { 1: 3, 2: 1 });
  assert.deepEqual(r.practiced, [1, 2]);
  assert.equal(unlocked(r), 3);
});

test("左右飞入轨迹实际移动，旧进度与知识卡保留", () => {
  const l = LEVELS[0],
    signals = makeSchedule(l, 123);
  assert.ok(signals.some((s) => s.side === 1));
  assert.ok(signals.some((s) => s.side === -1));
  for (const s of signals) {
    const a = positionOf(s, s.at, 1000, 720, l),
      b = positionOf(s, s.at + s.life, 1000, 720, l);
    assert.ok((b.x - a.x) * s.side > 600);
  }
  const save = readSave(
    JSON.stringify({
      version: 2,
      ruleVersion: 3,
      stars: { 1: 3, 2: 2 },
      cards: [1, 2],
      practiced: [1],
    }),
  );
  assert.deepEqual(save.stars, { 1: 3, 2: 2 });
  assert.deepEqual(save.cards, [1, 2]);
  assert.equal(unlocked(save), 3);
});
