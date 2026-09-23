export function exportProgress(save) {
  return JSON.stringify({ game: "star-signal-station", version: 1, ruleVersion: 4,
    exportedAt: new Date().toISOString(), stars: save.stars }, null, 2);
}

export function mergeProgress(save, text) {
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error("文件无法读取，请选择导出的 JSON 存档。"); }
  if (!data || data.game !== "star-signal-station" || data.version !== 1 || data.ruleVersion !== 4 ||
      !data.stars || typeof data.stars !== "object" || Array.isArray(data.stars)) {
    throw new Error("这不是支持的星际信号站存档。");
  }
  const entries = Object.entries(data.stars);
  if (entries.length > 25 || entries.some(([id, stars]) =>
    !/^(?:[1-9]|1\d|2[0-5])$/.test(id) || !Number.isInteger(stars) || stars < 1 || stars > 3)) {
    throw new Error("存档中的关卡成绩不正确，原有进度未修改。");
  }
  const next = structuredClone(save);
  for (const [id, stars] of entries) next.stars[id] = Math.max(next.stars[id] || 0, stars);
  next.cards = Object.keys(next.stars).map(Number).sort((a, b) => a - b);
  next.shownCards = [...new Set([...next.shownCards, ...next.cards])].sort((a, b) => a - b);
  return next;
}
