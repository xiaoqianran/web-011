# STORYBOARD — 每一帧都是电影

> 像 PR 与 AE 那样呼吸的分镜页面 · 灵感来自 Instagram 的唯美切换 · `pages → actions → pages` 自动部署

**在线预览（GitHub Pages）**: `https://xiaoqianran.github.io/web-011/`  
**分支**: `arena/01a01b5f-web-011` → 合并到 `main` 即自动发布

---

## ✨ 这是什么

这不是普通的滚动页面。这是一条用 **Premiere 时间线思维**、用 **After Effects 缓动** 调校、用 **Instagram 审美** 过滤的分镜长卷。

- **Hero 沉浸开场**：2.39:1 电影画幅 · 胶片颗粒 · 湖面晨雾大图 · 底部附带可动的 PR 时间轴（6 个 Clip + 移动的 Playhead）
- **概念区**：景别 / 运镜 / 转场 三张卡片
- **转场实验室**：8 种电影感转场（溶解 / 推拉 / 缩放 / 遮罩 / 光泄 / 故障 / 旋转 / 百叶窗）—— 点击卡片全屏预览，PR/AE 同款缓动
- **分镜时间线**：6 幕故事（开场→接近→碰撞→呼吸→定格→余韵），每幕含景别、转场参数、色调、拟音，滚动触发视差与缩放（GSAP ScrollTrigger + Lenis 平滑滚动）
- **Instagram 九宫格**：悬停显转场名，点击放大 Lightbox
- **部署可视化**：完整展示 `pages → actions → pages` 流水线

所有转场均用纯 CSS + JS 实现，无需视频文件，性能轻盈，手机端完美适配。

---

## 🚀 Pages 指向 Actions，Actions 部署到 Pages

> **已配置** `.github/workflows/deploy.yml`，符合 GitHub Pages 官方推荐的 `actions/deploy-pages` 方案；仓库 **Settings → Pages → Source 已选择 GitHub Actions**。根目录保留一份同步副本 `deploy-workflow.yml` 作为备份（内容完全一致）。

### 设置状态

1. ✅ 工作流在 `.github/workflows/deploy.yml`（随仓库提交，无需手动上传）
2. ✅ **Build and deployment → Source** = **GitHub Actions**

> 之后任何推送到 `main` 的提交都会触发自动构建与发布。

### 工作流做了什么

```yaml
on:
  push: { branches: [main] }
  workflow_dispatch:

permissions:  # contents: read / pages: write / id-token: write(最小权限)
concurrency:  # group: "pages", 串行部署不取消

jobs:
  build:  # checkout → setup-node 20(带 npm cache) → npm ci → build
          # → 产物校验(dist/index.html) → configure-pages@v5 → upload-pages-artifact@v4
  deploy: # deploy-pages@v4 → 全球 CDN 生效
```

本地验证：

```bash
npm i
npm run build   # 生成 dist/
npm run dev     # http://localhost:5173/web-011/
```

### 本地开发

```bash
git clone https://github.com/xiaoqianran/web-011.git
cd web-011
npm i
npm run dev
# 浏览器打开 http://localhost:5173/web-011/
```

### 部署验证

- 推送到 `main` 后，去 **Actions** 页查看 `Deploy to GitHub Pages` 是否绿勾
- 成功后访问 `https://xiaoqianran.github.io/web-011/` 即为线上版本

---

## 🎬 转场清单

| 转场 | 时长 | 技术 | 氛围 |
|------|------|------|------|
| 溶解 Dissolve | 0.6s | opacity | 文艺 · 温柔 |
| 推拉 Push | 0.5s | translateX | 动感 · 叙事 |
| 缩放 Zoom | 0.7s | scale 1→1.15 | 沉浸 · 呼吸 |
| 遮罩 Wipe | 0.4s | clip-path 45° | 现代 · 极简 |
| 光泄 Light Leak | 0.8s | flare + screen | 复古 · 暖调 |
| 故障 Glitch | 0.3s | RGB split | 先锋 · 锐利 |
| 旋转 Spin | 0.6s | rotate + scale | 梦幻 · 流动 |
| 百叶窗 Blinds | 0.5s | stagger | 节奏 · 时尚 |

---

## 🛠 技术栈

- **Vite 5** — 极速构建，`base: '/web-011/'` 已适配 Pages 子路径
- **Vanilla HTML/CSS/JS** — 无框架，零冗余
- **GSAP 3 + ScrollTrigger** — 滚动视差与时间线
- **Lenis** — 丝滑滚动
- **Unsplash** — 高质量静帧（可一键替换为你自己的照片）
- **A11y** — `prefers-reduced-motion` 全面降级、Lightbox 焦点管理、ARIA 标注、图片懒加载 + OG 分享元数据

---

## 📁 结构

```
.
├── index.html              # 单页主体，所有分镜与转场
├── src/
│   ├── main.js             # 交互、转场、Lenis、GSAP、Lightbox
│   └── style.css           # 电影感样式、胶片颗粒、响应式
├── vite.config.js          # base: '/web-011/' + allowedHosts
├── .github/workflows/deploy.yml  # Pages → Actions 部署
└── package.json
```

---

## 🎨 自定义你的分镜

1. **替换图片**：在 `index.html` 中搜索 `images.unsplash.com`，替换为你的 `images/` 或 CDN 链接
2. **改文案**：每幕 `.shot` 的 `h3 / p / shot-meta` 即为分镜脚本
3. **新增转场**：在 `.trans-grid` 加卡片，在 `src/main.js` 的 `playTransition` 加 case，在 `src/style.css` 加对应 `.transition-layer.xxx` 样式
4. **改色调**：调 `src/style.css` 顶部 `:root` 的 `--gold / --paper / --bg`

推送即自动上线：

```bash
git add -A
git commit -m "feat: 我的分镜故事"
git push origin main
```

---

© 2025 STORYBOARD — Crafted like PR & AE, inspired by Instagram. MIT
