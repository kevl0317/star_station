# 2026-09-17 生成美术资源

## 移动信号粉彩美术

第二版使用 `assets/signal-crayon-texture.webp`（2026-09-23 由 1254px PNG 缩为 512px WebP，图案只以 64 单位平铺，画面无差别），以粗纸颗粒、干笔蜡笔纹替代旧的亮面高光和渐变。信号外接半径统一为 26，光环中心线半径 28、宽度 4，内圈半径恰为 26；空心轮廓半径 24、圆角描边宽度 4，外角同样接触内圈。光环增加暖色底层以便圆形目标仍能辨别有无光环。

该纹理为内置 image_gen 生成的象牙白油画棒与水粉纹理（PNG 原件见 Git 历史）。`src/art.mjs` 用原有精确轮廓裁切纹理并按规则颜色着色，覆盖星形、圆形、三角形、方形、菱形和六边形。保留空心、光环与三角形朝向，游戏目标、关前示例及规则图标共用一套美术。可打开 `signal-art-preview.html` 查看颜色和变体。

生成提示词要点：Full-bleed neutral ivory-white oil pastel and gouache pigment texture, subtle paper grain and broad crayon strokes, evenly lit, no objects, no text. Intended for clipping into small geometric collectible sprites and tinting to gameplay colors.

## 星小兔白兔立绘

首页和首次结算知识讲解共用 `assets/solar-art-v1/bunny-white-moon.webp`（由 1145 × 1374 透明 PNG 缩为 640 宽透明 WebP，PNG 原件见 Git 历史）。内置 image_gen 根据用户参考图卡通化，随后按反馈改为白兔、缩小脚掌、调整脸型，最终把圆形吊坠改为金色月牙。保留红色飘带和挥手姿势；旧立绘已移除。图鉴不添加角色。

最终编辑提示：Replace ONLY the round gold medallion with a small warm golden crescent moon pendant, no circular backing. Preserve white fur, face, pink cheeks, ears, small feet, waving pose, red flowing ribbon, proportions, hand-painted texture and transparent alpha background.

## 绘本风背景更新

当前背景为 `assets/galaxy-pastel.webp`（1672 × 941，2026-09-23 由同尺寸 PNG 转为 WebP，约 2.7MB → 0.4MB），使用内置 image_gen 生成。参考用户提供的三张图片的蜡笔、油画棒纸张纹理及蓝黄配色，重新构图为横向星空：左下行星地平线与小型观测站、右上月牙，中间保留暗蓝留白供游戏内容显示。无文字、水印或内嵌角色。只保留当前背景。生成原图：`C:/Users/24510/.codex/generated_images/01a09c8f-e3f8-7241-a555-33359dd191c5/exec-457321ba-c72f-426c-b9cb-2a53f3182b89.png`。

提示词要点：Wide 16:9 storybook game background; wax crayon and oil pastel grain on paper, loose gouache strokes, chalky pale yellow and rich cobalt blue, quiet magical bedtime mood. Blue planetary horizon and tiny observatory at lower left, pale yellow crescent at upper-right edge, sparse handmade stars. Central 70% calm dark indigo negative space. No photorealism, glossy 3D, UI, lettering, watermark, or rabbit baked into the background.

## 当前天体与飞船素材

`assets/solar-art-v1/` 保留当前运行使用的 WebP 天体和白兔 PNG。太阳、八大行星、月球、主小行星带及柯伊伯带为生成插画；不按真实大小和距离比例绘制。太阳系组合图共用这些素材。逐图生成提示词及外部原始文件记录见 `manifest.json`。

- 飞船：`assets/rescue-ship.webp`，透明背景生成插画。
- 随机星尘遮挡物：`assets/signal-occluder.webp`，用于遮挡飞行信号。
- 旧背景、旧角色及未引用的 PNG 副本已移除。
- 动态粒子与接收曲线使用 Canvas，提示音使用 Web Audio。

## 救援飞船生成提示词

Use case: stylized-concept. Asset type: isolated transparent PNG hero spacecraft sprite for a premium illustrated space adventure game, centered single subject. Primary request: a charming highly detailed small rescue spacecraft, front three-quarter view tilted diagonally nose pointing slightly upper-left, broad symmetrical swept wings, chunky white ceramic armor, orange rescue panels, a large dark teal glass canopy, gold mechanical joints, a short radio antenna, twin blue ion engines with short contained exhaust glows. The vehicle feels physical, polished and hand-painted, almost a miniature model, with beautiful blue rim lighting and warm reflected light, brushed metal, elegant beveled edges and a coherent believable silhouette. Entire spacecraft fully visible with generous transparent margin, suitable to float over a dark starfield game scene. No planet, no stars, no background, no pedestal, no ground, no lettering, no text, no logos, no watermark, no square or rectangular backdrop. Genuine transparent background with alpha. One spacecraft only, no asset sheet.

海王星去环更新：使用内置 image_gen 编辑原素材，移除整条行星环并补全云层。当前游戏使用 `assets/solar-art-v1/neptune-ringless.webp`，编辑提示词与原始生成路径见 `neptune-ringless-edit.json`。旧版带环海王星及未引用 PNG 已移除。

## 知识卡真实影像

知识卡补充了月背月壤、祝融号、火星地表、火卫一与火卫二、大红斑、木星云层、土星环和冥王星，共 9 张本地照片。来源、署名、影像处理类型及使用说明见 `assets/knowledge/README.md`、`credits.json`；逐图来源在游戏卡片中显示。图鉴和首次结算共用这些配图，照片可点击查看大图。

八大行星轨道、四颗巨行星的行星环使用原创 SVG 教学示意。完整预览：`knowledge-art-preview.html`，可切换星小兔讲解模式，不修改游戏进度。

K25 银河系位置改用 NASA/JPL-Caltech PIA10748 科学示意图，并根据官方标注版叠加中文太阳系位置。未解锁缩略图与结算图同步使用，来源与图片位于 `assets/knowledge/`。

K04 替换简笔卫星与着陆器：使用鹊桥二号官方效果图和嫦娥六号月背实拍，保留通信关系连线，图旁标注来源及影像类型。

## 2026-09-23 界面美术

- `assets/paper-grain.webp`：由信号蜡笔纹理的亮度生成的白色笔触（最高约 6% 不透明度），叠在面板、卡片与弹窗上形成纸面颗粒。
- 代码绘制（`src/art.mjs`）：月牙品牌标志（也用作网页图标与加载画面）、结算星星（复用信号的蜡笔着色）、五枚章节纪念章（地球与月球、太阳、火星与两颗卫星、土星、远方星光）以及线性图标。改色或改形直接改代码，无需重新生成图片。
- 结尾的行星公转为 SVG 动画；首页舷窗不画轨道或探测器，避免被误认成卫星。
- 全部组件可在 `ui-kit-preview.html` 查看，使用规则见 `DESIGN.md`。
