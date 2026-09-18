# 2026-09-17 生成美术资源

使用内置 image_gen 生成，透明 PNG 原图和保留 alpha 的 640 像素 WebP 运行资源位于 `assets/solar-art-v1/`。未进行重绘或抠图，运行图仅等比缩放、格式压缩。完整逐图提示词及生成源文件路径见该目录 `manifest.json`。

已生成并接入全部 13 张：太阳、水星、金星、地球、月球、火星、木星、土星、天王星、海王星、主小行星带、柯伊伯带、星小兔。用于首页、太阳系星图、关前观测图、修复图和知识卡。星小兔为兔耳机器人，白色陶瓷外壳、青色表情屏和云纹。天体为游戏插画示意，不按真实大小、距离比例绘制。

本轮使用内置 image_gen 补齐剩余 5 张，未调用 API 回退。所有素材均已核验包含透明通道。完整提示词与源文件对应关系见 `assets/solar-art-v1/manifest.json`，其中 pending 为空。

以下为历史素材记录，新生成素材覆盖相应旧版 SVG 的显示，科普连线和文字继续保留。

# 3.0 太阳系素材补充

太阳、八大行星、月球、小行星带、柯伊伯带、25 张知识卡示意图及星小兔均为 `src/astronomy.mjs` 内本地 SVG 绘图。示意图不按距离和大小比例绘制。知识文字及来源链接来自用户提供的新版脚本，链接保留在卡片中。

# 星际信号站素材记录

## 星尘遮挡图更新

使用内置 ImageGen 生成透明背景星尘遮挡物，原图保存在 `assets/signal-occluder.png`（1619 × 971）。游戏使用保留透明通道的 `assets/signal-occluder.webp`（384 × 230，27,322 字节），仅缩小和压缩格式。该素材在 3.0 中仅作为扫描窗外的背景星尘，不再遮挡信号。

生成提示词：

Use case: stylized-concept. Asset type: transparent-background 2D sprite for a polished illustrated space game. A single small dense irregular cloud of interstellar dust used as a foreground occluder over a bright geometric signal. Wide horizontal silhouette, compact lumpy dense opaque blue-gray and slate-gray core with clearly visible overlapping billows and silver-blue rim light, a few tiny rough dark stone fragments embedded in the dust. Darker solid core must actually conceal the object behind it; softly feathered irregular outer wisps only. This is an obvious physical foreground dust cloud, not a gaussian blur or flat gradient. Hand-painted dimensional game art, readable at 100 pixels wide. Centered, occupies 85 percent of image width and about 60 percent height, generous transparent margins, single sprite only, genuine transparent alpha background. No stars, no spaceship, no signal shape, no text, no UI, no frame, no checkerboard.

新版使用内置 ImageGen 生成三张原创素材，并复制到项目。没有使用第三方网站素材。

- `assets/galaxy.png`：生成原图，1672 × 941。游戏使用 `assets/galaxy.webp`，150,122 字节。
- `assets/rescue-ship.png`：带透明通道的飞船原图，1536 × 1024。游戏使用 `assets/rescue-ship.webp`，333,066 字节，保留透明通道。
- WebP 仅进行格式压缩，未改动画面内容。原始生成文件同时保留在 Codex 的 generated_images 目录。
- 通讯塔、机器人、规则示例与可点击信号使用项目内 SVG；光束、粒子和星空动态使用 Canvas；提示音和环境底音使用 Web Audio。

## 星域背景生成提示词

Use case: stylized-concept. Asset type: finished environment background for a premium 2D sci-fi adventure game about restoring an interstellar communications network, landscape 16:9. Primary request: a beautifully art-directed hand-painted cinematic deep-space vista. Composition: a magnificent blue-teal planet curves across the lower left quarter, bright thin atmospheric rim. At lower-left outer edge a small remote orbital communications outpost, antenna silhouette, warm amber windows. Wisps of turquoise and midnight blue nebula across the distant center-right, many fine tiny stars with a few brighter stars, distant crescent moon upper right. The middle 60 percent is calm, very dark and open for a playable field and moving bright objects, clear atmospheric depth. Color palette: very deep blue, muted teal, brilliant ice blue rim lights, small restrained warm copper accents. Rich painterly surfaces, cinematic light and dimensional depth, lovingly painted game world like a high-budget indie space adventure. No spaceship in the center, no interface, no words, no text, no lettering, no watermarks, no logos, no floating colored gameplay shapes, no large white glare. This is a genuine finished in-game environment illustration, NOT an interface screenshot. Wide landscape framing.

## 救援飞船生成提示词

Use case: stylized-concept. Asset type: isolated transparent PNG hero spacecraft sprite for a premium illustrated space adventure game, centered single subject. Primary request: a charming highly detailed small rescue spacecraft, front three-quarter view tilted diagonally nose pointing slightly upper-left, broad symmetrical swept wings, chunky white ceramic armor, orange rescue panels, a large dark teal glass canopy, gold mechanical joints, a short radio antenna, twin blue ion engines with short contained exhaust glows. The vehicle feels physical, polished and hand-painted, almost a miniature model, with beautiful blue rim lighting and warm reflected light, brushed metal, elegant beveled edges and a coherent believable silhouette. Entire spacecraft fully visible with generous transparent margin, suitable to float over a dark starfield game scene. No planet, no stars, no background, no pedestal, no ground, no lettering, no text, no logos, no watermark, no square or rectangular backdrop. Genuine transparent background with alpha. One spacecraft only, no asset sheet.

海王星去环更新：使用内置 image_gen 编辑原素材，移除整条行星环并补全云层。当前游戏使用 `assets/solar-art-v1/neptune-ringless.webp`，原图为同名 PNG，完整提示词见 `neptune-ringless-edit.json`。旧图保留作为历史版本。
