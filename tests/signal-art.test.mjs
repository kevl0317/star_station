import test from "node:test";
import assert from "node:assert/strict";
import { LEVELS, signalPool, COLORS, COLOR_NAMES } from "../src/levels.mjs";
import { makeSchedule } from "../src/engine.mjs";
import { signalSVG, signalName } from "../src/art.mjs";

test("所有关卡的每种信号都有颜色、美术及可读名称", () => {
  for (const level of LEVELS) {
    for (const signal of signalPool(level)) {
      assert.match(COLORS[signal.color] ?? "", /^#[0-9a-f]{6}$/i, `第${level.id}关：${signal.color}`);
      assert.ok(COLOR_NAMES[signal.color]);
      assert.doesNotThrow(() => signalSVG(signal));
      assert.ok(!signalSVG(signal).includes("undefined"));
      assert.ok(!signalName(signal).includes("undefined"));
    }
  }
});

test("第23关含青色与淡紫色的完整随机序列可持续渲染", () => {
  const colors = new Set();
  for (let seed = 1; seed <= 120; seed++) {
    for (const signal of makeSchedule(LEVELS[22], seed)) {
      colors.add(signal.color);
      assert.doesNotThrow(() => signalSVG(signal));
    }
  }
  assert.ok(colors.has("cyan"));
  assert.ok(colors.has("lilac"));
});
