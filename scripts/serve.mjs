import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";
const root = fileURLToPath(new URL("../", import.meta.url));
const port = 4174,
  lan = process.argv.includes("--lan");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = path.resolve(root, "." + pathname + (pathname.endsWith("/") ? "index.html" : ""));
    const relative = path.relative(root, file);
    if (
      /^(docs|tests|scripts)([\\/]|$)/i.test(relative) ||
      relative.startsWith("..") ||
      path.isAbsolute(relative) ||
      relative.split(/[\\/]/).some((p) => p.startsWith(".")) ||
      !(await stat(file)).isFile()
    )
      throw new Error("Not found");
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("没有找到这个页面。");
  }
});
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? "端口 4174 已占用。如游戏已经启动，请访问 http://127.0.0.1:4174/；否则关闭占用该端口的程序后再试。"
      : error.message,
  );
  process.exitCode = 1;
});
server.listen(port, lan ? "0.0.0.0" : "127.0.0.1", () => {
  console.log("星际信号站已启动\n电脑访问：http://127.0.0.1:4174/");
  if (lan) {
    console.log("手机与电脑连接同一路由器后，可在手机浏览器打开：");
    for (const entries of Object.values(networkInterfaces()))
      for (const item of entries ?? [])
        if (item.family === "IPv4" && !item.internal && !item.address.startsWith("169.254."))
          console.log(`  http://${item.address}:${port}/`);
  }
  console.log("保持服务运行，按 Ctrl+C 关闭。");
  if (process.argv.includes("--open") && process.platform === "win32")
    spawn("cmd.exe", ["/c", "start", "", `http://127.0.0.1:${port}/`], {
      windowsHide: true,
      stdio: "ignore",
    }).unref();
});
