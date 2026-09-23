import test from "node:test";
import assert from "node:assert/strict";
import { emptySave } from "../src/engine.mjs";
import { exportProgress, mergeProgress } from "../src/save-transfer.mjs";

test("合并存档保留最高星级、声音及本地航行记录", () => {
  const local = { ...emptySave(), muted: true, stars: { 1: 3 }, cards: [1], history: [{ level: 1 }] };
  const incoming = { ...emptySave(), stars: { 1: 1, 2: 2 } };
  const merged = mergeProgress(local, exportProgress(incoming));
  assert.deepEqual(merged.stars, { 1: 3, 2: 2 });
  assert.deepEqual(merged.cards, [1, 2]);
  assert.equal(merged.muted, true);
  assert.deepEqual(merged.history, local.history);
  assert.deepEqual(local.stars, { 1: 3 });
  assert.deepEqual(mergeProgress(emptySave(), exportProgress(emptySave())), emptySave());
});

test("无效、其他游戏或版本、非法成绩存档全部拒绝", () => {
  const valid = JSON.parse(exportProgress(emptySave()));
  const invalid = ["not json", "null", JSON.stringify({ version: 2, history: [] }),
    ...[{ game: "panda-delivery" }, { version: 99 }, { ruleVersion: 3 },
      { stars: [] }, { stars: { 26: 1 } }, { stars: { 1: 4 } },
      { stars: { 1: "3" } }, { stars: { "01": 2 } }].map(p => JSON.stringify({ ...valid, ...p }))];
  for (const text of invalid) assert.throws(() => mergeProgress(emptySave(), text));
});
