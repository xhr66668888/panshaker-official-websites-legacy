# Panshaker Services — 官方网站 设计规范与技术规范文档

> 版本: 1.0.0 | 最后更新: 2026-02-20 | 维护人: 技术团队

---

## 目录

1. [品牌设计规范](#1-品牌设计规范)
2. [项目目录结构](#2-项目目录结构)
3. [页面清单与职责](#3-页面清单与职责)
4. [技术规范](#4-技术规范)
5. [国际化 (i18n) 模块](#5-国际化-i18n-模块)
6. [设备检测模块](#6-设备检测模块)
7. [响应式设计策略](#7-响应式设计策略)
8. [SEO 与性能优化](#8-seo-与性能优化)
9. [内容管理注意事项](#9-内容管理注意事项)
10. [部署与维护指南](#10-部署与维护指南)

---

## 1. 品牌设计规范

### 1.1 品牌名称

| 语境 | 正确写法 | ❌ 错误写法 |
|------|---------|------------|
| 英文品牌名 | **Panshaker Services** | PanShaker Services, Pan Shaker |
| 中文品牌名 | 伴勺科技 | 半勺科技 |
| 法律主体 | Panshaker Inc | Panshaker LLC, PanShaker LLC |
| Tab标题(所有页面) | **Panshaker Services** | 伴勺科技, The Art of Wok |

### 1.2 品牌色彩

**严格遵循以下两种品牌色，不使用任何渐变设计（gradient）。**

| 色彩名称 | HEX Code | RGB | 用途 |
|---------|----------|-----|------|
| 品牌蓝 (Brand Blue) | `#0E427E` | rgb(14, 66, 126) | 主色调、标题文字、Logo 首部、CTA按钮、导航 hover 状态 |
| 品牌绿 (Brand Green) | `#62BA46` | rgb(98, 186, 70) | 强调色、Logo 尾部 ("Services")、链接 hover、分割线、CTA 按钮底色 |

**辅助色（仅用于背景与文本层次）:**

| 色彩 | HEX | 用途 |
|------|-----|------|
| 深蓝文字 | `#0E427E` | body 主文字色 |
| 中灰文字 | `#666666` | 副标题、正文 |
| 浅灰文字 | `#999999` | 注释、辅助信息 |
| 页面背景白 | `#FFFFFF` | 主背景 |
| 浅灰背景 | `#F5F5F5` / `#FAFAFA` | Section 交替背景 |
| 分割线 | `#E0E0E0` / `#EEEEEE` | Footer、Card 边框 |

### 1.3 禁止使用渐变

⚠️ **整站禁止使用任何 CSS `linear-gradient`、`radial-gradient` 或 `conic-gradient` 属性用于装饰目的。**

渐变设计容易给人"AI自动生成"的印象，与品牌调性不符。所有需要色彩过渡的位置，使用纯色替代：

```css
/* ❌ 禁止 */
background: linear-gradient(135deg, #0E427E 0%, #62BA46 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* ✅ 正确 */
color: #0E427E;
```

**唯一例外:** 浏览器默认 UI 渐变（如视频播放器控件）可保留。

### 1.4 Logo 规范

- 英文 Logo: 使用 `LogoFont` 字体
  - "Panshaker" 颜色: `#0E427E`
  - "Services" 颜色: `#62BA46`
  - 字间距: `-1px`
- 中文 Logo（hover 切换）: "伴勺" `#0E427E` + "科技" `#62BA46`
- Favicon: `assets/images/logo-transparent.png`（需提供透明底 PNG 文件）

### 1.5 字体

| 字体名称 | 文件 | 用途 |
|---------|------|------|
| MyBrandFont | `assets/fonts/myfont.ttf` | 网页正文首选字体 |
| LogoFont | `assets/fonts/logo.otf` | 仅用于 Logo 显示 |

**字体回退栈:**
```css
font-family: 'MyBrandFont', "PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, sans-serif;
```

### 1.6 Slogan 规范

⚠️ 以下 Slogan 已弃用，不得在任何页面出现：
- "The Art of Wok"
- "Amazing Wok"
- 任何包含 "Wok" 的英文宣传语

---

## 2. 项目目录结构

```
panshaker-official-websites/
├── index.html                  # 首页（主页）
├── about.html                  # 关于我们（公司介绍 + 管理团队）
├── careers.html                # 加入团队（招聘信息）
├── investors.html              # 投资者关系（彩蛋页）
├── synapse_os.html             # Synapse OS 产品页
├── profile_xu.html             # 个人简历：徐浩然（创始人）
├── profile_sun.html            # 个人简历：孙启圣（联合创始人）⚠️ 页面暂时隐藏入口
├── profile_unknown.html        # 个人简历：CTO ⚠️ 页面暂时隐藏入口
├── web.config                  # IIS 服务器 MIME 类型配置
│
├── assets/
│   ├── images/
│   │   ├── 09-JackRacino.jpeg      # About 页面 Banner 背景
│   │   ├── gaoleilei.png            # 品牌大使照片
│   │   ├── headcompanyinfo.avif     # 公司信息页头图
│   │   ├── imac-silver-cto-hero-202410.png  # 参考素材
│   │   ├── logo.png                 # Logo 图片
│   │   ├── logo-transparent.png     # 🔴 需提供！Favicon 用透明底 Logo
│   │   ├── managementteam.jpg       # 管理团队 Section 背景
│   │   ├── product.jpg              # 产品展示图
│   │   ├── relations.jpg            # 投资者关系页图片
│   │   ├── restaurant.webp          # 餐厅概念图
│   │   └── synapseoslogo.png        # Synapse OS Logo
│   ├── fonts/
│   │   ├── myfont.ttf               # 品牌正文字体
│   │   └── logo.otf                 # Logo 专用字体
│   ├── media/
│   │   └── mymusic.mp3              # 投资者页背景音乐
│   └── screenshots/
│       ├── 屏幕截图 2026-01-28 131913.png   # Synapse OS - AI 助手
│       ├── 屏幕截图 2026-01-28 131934.png   # Synapse OS - 仪表盘
│       ├── 屏幕截图 2026-01-28 131951.png   # Synapse OS - 机器人控制
│       ├── 屏幕截图 2026-01-28 132010.png   # Synapse OS - 外卖平台
│       ├── 屏幕截图 2026-01-28 132040.png   # Synapse OS - 顾客管理
│       └── 屏幕录制 2026-01-28 131820.mp4   # Synapse OS 演示视频
│
├── js/
│   ├── device.js                # 设备检测模块
│   ├── i18n.js                  # 国际化语言切换模块
│   └── lang/
│       ├── zh-CN.json           # 简体中文 (默认)
│       ├── en.json              # English
│       ├── zh-TW.json           # 繁體中文
│       ├── ko.json              # 한국어
│       └── ja.json              # 日本語
│
└── docs/
    ├── DEVELOPMENT_GUIDE.md     # 本文档（设计与技术规范）
    └── SynapseOSReadme.md       # Synapse OS 系统文档
```

---

## 3. 页面清单与职责

| 页面 | URL | 描述 | 状态 |
|------|-----|------|------|
| 首页 | `index.html` | 品牌展示、核心理念、解决方案、品牌大使、ESG | ✅ 在线 |
| 关于我们 | `about.html` | 公司介绍、管理团队 | ✅ 在线 |
| 加入团队 | `careers.html` | 招聘信息 | ✅ 在线 |
| 投资者关系 | `investors.html` | 彩蛋页面（音乐 + 图片） | ✅ 在线 |
| Synapse OS | `synapse_os.html` | 产品详细介绍页 | ✅ 在线 |
| 徐浩然简历 | `profile_xu.html` | 创始人个人简介 | ✅ 在线 |
| 孙启圣简历 | `profile_sun.html` | 联合创始人简介 | ⏸️ 页面保留，入口隐藏 |
| CTO 简历 | `profile_unknown.html` | CTO 个人简介 | ⏸️ 页面保留，入口隐藏 |

### 3.1 隐藏/上线团队成员

孙启圣和 CTO 的卡片已在 `about.html` 中通过 HTML 注释方式屏蔽。需要上线时，在 `about.html` 管理团队区域找到对应注释块，**取消注释**即可：

```html
<!-- 联合创始人 - 暂时屏蔽，保留代码，需要时取消注释即可上线 -->
<!--
<div class="team-card">
    <span class="team-name">孙启圣</span>
    ...
</div>
-->
```

**同理，CTO 卡片也是注释方式屏蔽。**

---

## 4. 技术规范

### 4.1 基础技术栈

- **纯静态 HTML/CSS/JS**（无构建工具、无框架依赖）
- **CSS**: 内联 `<style>` 标签（单文件部署友好）
- **JavaScript**: Vanilla JS，ES5 兼容（保证微信浏览器兼容性）
- **字体**: 自托管 TTF/OTF
- **部署**: 静态文件服务器（IIS/Nginx/Azure Static Web Apps）

### 4.2 浏览器兼容性

| 浏览器 | 最低版本 | 优先级 |
|--------|---------|--------|
| 微信内置浏览器 (iOS) | — | 🔴 最高 |
| Safari (iPhone) | iOS 13+ | 🔴 最高 |
| Chrome (Android) | 80+ | 🟡 高 |
| Chrome (Desktop) | 90+ | 🟡 高 |
| Edge (Desktop) | 90+ | 🟢 标准 |
| Firefox | 90+ | 🟢 标准 |
| Safari (macOS) | 14+ | 🟢 标准 |

### 4.3 CSS 编码规范

```css
/* 颜色必须使用品牌色常量 */
color: #0E427E;         /* Brand Blue */
color: #62BA46;         /* Brand Green */

/* Synapse OS 页面使用 CSS 变量 */
var(--brand-blue)       /* #0E427E */
var(--brand-green)      /* #62BA46 */

/* 禁止声明 */
/* ❌ */ background: linear-gradient(...);
/* ❌ */ -webkit-background-clip: text;
/* ❌ */ -webkit-text-fill-color: transparent;
```

### 4.4 资源引用规范

```html
<!-- 字体引用 -->
src: url('assets/fonts/myfont.ttf') format('truetype');
src: url('assets/fonts/logo.otf') format('opentype');

<!-- 图片引用 -->
<img src="assets/images/product.jpg" alt="描述" loading="lazy">

<!-- 截图引用 -->
<img src="assets/screenshots/屏幕截图 2026-01-28 131913.png" alt="描述" loading="lazy">

<!-- JS 模块引用（放在 </body> 前） -->
<script src="js/device.js"></script>
<script src="js/i18n.js"></script>
```

---

## 5. 国际化 (i18n) 模块

### 5.1 支持语言

| 代码 | 语言 | 状态 |
|------|------|------|
| `zh-CN` | 简体中文 | ✅ 默认语言，内容完整 |
| `en` | English | ✅ 翻译完成 |
| `zh-TW` | 繁體中文 | ✅ 翻译完成 |
| `ko` | 한국어 | ✅ 翻译完成 |
| `ja` | 日本語 | ✅ 翻译完成 |

### 5.2 语言检测策略

**优先级: Cookie > 浏览器语言 > 默认(zh-CN)**

1. 检查 `ps_lang` Cookie
2. 若无 Cookie，读取 `navigator.languages` 匹配支持列表
3. 若无匹配，回退到 `zh-CN`
4. 用户切换语言后，保存到 Cookie（365天有效期，SameSite=Lax）

### 5.3 使用方法

在 HTML 元素上添加 `data-i18n` 属性：

```html
<a href="index.html" data-i18n="nav.home">首页</a>
<h1 data-i18n="hero.headline">AI 赋能下低人工成本</h1>
<input data-i18n-placeholder="search.placeholder" placeholder="搜索...">
```

### 5.4 语言包文件

位于 `js/lang/` 目录，JSON 格式。键值对结构：

```json
{
  "nav.home": "首页",
  "hero.headline": "AI 赋能下低人工成本",
    "footer.copyright": "©2026 Panshaker Inc. All Rights Reserved."
}
```

### 5.5 JavaScript API

```javascript
// 获取当前语言
PanI18n.currentLang  // "zh-CN"

// 切换语言
PanI18n.switchLang('en');

// 获取翻译文本
PanI18n.t('nav.home', '首页');  // 返回对应语言的文本

// 监听语言变化事件
document.addEventListener('langchange', function(e) {
    console.log('语言已切换:', e.detail.lang);
});
```

### 5.6 语言切换器 UI

模块自动在页面右下角生成一个圆形语言切换按钮（🌐图标），点击展开语言列表。
- 位置: `position: fixed; bottom: 20px; right: 20px;`
- z-index: 9999
- 当前语言高亮显示为品牌绿

---

## 6. 设备检测模块

### 6.1 检测类型

| 类型 | Body Class | 检测条件 |
|------|-----------|---------|
| PC/桌面端 | `.device-pc` | 非 Mobile 且非 Tablet |
| 手机 | `.device-mobile` | iPhone/Android Phone/小屏触控设备 |
| 平板 | `.device-tablet` | iPad/Android Tablet/大屏触控设备 |
| iOS | `.device-ios` | iPhone/iPad/iPod |
| Android | `.device-android` | Android UA |
| 微信浏览器 | `.device-wechat` | MicroMessenger UA |
| 竖屏 | `.device-portrait` | height > width |
| 横屏 | `.device-landscape` | width > height |

### 6.2 CSS 使用示例

```css
/* 仅微信浏览器显示特殊按钮 */
.wechat-only-btn { display: none; }
.device-wechat .wechat-only-btn { display: block; }

/* 移动端隐藏某些内容 */
.device-mobile .desktop-only { display: none; }
```

### 6.3 JavaScript API

```javascript
PanDevice.isMobile    // true/false
PanDevice.isTablet    // true/false
PanDevice.isPC        // true/false
PanDevice.isWeChat    // true/false
PanDevice.isIOS       // true/false
PanDevice.isPortrait  // true/false

// 获取完整设备信息
PanDevice.getInfo();
// { type: 'mobile', os: 'ios', isWeChat: true, orientation: 'portrait', ... }

// 监听横竖屏切换
document.addEventListener('deviceorientationchange', function(e) {
    console.log(e.detail.portrait ? '竖屏' : '横屏');
});
```

---

## 7. 响应式设计策略

### 7.1 断点标准

| 断点 | 范围 | 目标设备 |
|------|------|---------|
| Small Mobile | < 375px | iPhone SE, 小屏手机 |
| Mobile | 375px - 768px | iPhone 12/13/14/15, Android |
| Tablet | 769px - 1024px | iPad, Android Tablet |
| Desktop | > 1024px | PC, MacBook |

### 7.2 关键设计决策

- **导航栏**: 移动端从水平导航栏变为居中折行的标签按钮
- **Hero 区**: 移动端减小字号（36px→72px range），隐藏英文 slogan
- **图文分栏**: 桌面端双列 grid，移动端堆叠为单列
- **Footer**: 桌面端三列，移动端单列居中
- **字体大小**: 移动端 body 保持 16px（防止微信浏览器缩放问题）

### 7.3 微信浏览器 (iPhone) 专项优化

```css
/* 禁止双击缩放 */
touch-action: manipulation;

/* 防止文字大小自动调整 */
-webkit-text-size-adjust: 100%;

/* 安全区域适配 (iPhone X+) */
padding-bottom: env(safe-area-inset-bottom);

/* 输入框字号 ≥ 16px (防止自动缩放) */
input, textarea { font-size: 16px; }

/* 点击反馈色 */
-webkit-tap-highlight-color: rgba(98, 186, 70, 0.2);
```

---

## 8. SEO 与性能优化

### 8.1 图片优化

- 所有展示图片使用 `loading="lazy"` 延迟加载
- 优先使用 WebP 格式（需 `web.config` 添加 MIME 支持）
- 必须添加 `alt` 属性

### 8.2 性能建议

- 粒子动画: 移动端减少粒子数量（100→20）
- `prefers-reduced-motion`: 对无障碍设备禁用动画
- 低端设备: 自动检测 `navigator.hardwareConcurrency ≤ 2` 时简化动画

### 8.3 每页必须包含

```html
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
    <meta name="format-detection" content="telephone=no">
    <title>Panshaker Services</title>
    <link rel="icon" type="image/png" href="assets/images/logo-transparent.png">
</head>
```

```html
<!-- 在 </body> 之前 -->
<script src="js/device.js"></script>
<script src="js/i18n.js"></script>
```

---

## 9. 内容管理注意事项

### 9.1 管理团队上下线

- **当前上线**: 仅徐浩然（创始人）
- **待上线**: 孙启圣（联合创始人）、CTO
- **操作方法**: 编辑 `about.html`，找到 HTML 注释 `<!-- 联合创始人 - 暂时屏蔽 -->` 和 `<!-- CTO - 暂时屏蔽 -->`，取消注释即可
- **对应简历页**: `profile_sun.html` 和 `profile_unknown.html` 已存在，无需额外创建

### 9.2 新增团队成员

在 `about.html` 的 `.team-grid` 容器中添加：
```html
<div class="team-card">
    <span class="team-name">姓名</span>
    <div class="team-title">职务</div>
    <a href="profile_xxx.html" class="view-profile-btn">阅读简历 <span style="margin-left:5px;">→</span></a>
</div>
```

### 9.3 新增语言

1. 在 `js/lang/` 目录创建 `xx.json` 文件
2. 在 `js/i18n.js` 中将语言代码添加到 `SUPPORTED_LANGS` 数组和 `LANG_LABELS` 对象

### 9.4 品牌名称规范提醒

- ✅ **Panshaker** (lowercase 's' in shaker)
- ❌ ~~PanShaker~~ (已弃用)
- Tab 标题统一为 **Panshaker Services**
- 不使用"伴勺科技"作为标签页标题（正文内容中可保留）

---

## 10. 部署与维护指南

### 10.1 部署方式

纯静态文件，支持任何静态文件托管：
- Azure Static Web Apps
- Nginx / Apache
- IIS (`web.config` 已配置 WebP MIME 类型)
- GitHub Pages
- Cloudflare Pages

### 10.2 待办事项

- [x] 首页 Synapse OS 图片加载错误修复（统一改用英文文件名）
- [x] 提供 `logo-transparent.png` 文件作为 Favicon
- [x] 将截图文件名从中文改为英文（避免 URL 编码问题）
- [x] 为 i18n 系统的 HTML 元素添加 `data-i18n` 属性以完成完整翻译覆盖（首页/关于/招聘/投资者/个人页）
- [x] 提取共享 CSS（`assets/styles/shared.css`）并在各页面复用
- [ ] 添加 OpenGraph / Twitter Card meta 标签
- [ ] 添加 Google Analytics 或 百度统计
- [ ] 配置 HTTPS 和 CDN

### 10.3 更新日志

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-02-20 | 1.0.0 | 初始规范建立。清理项目结构，移除渐变设计，统一品牌名为 Panshaker，隐藏部分团队成员，新增 i18n 和设备检测模块，建立设计与技术规范文档 |
| 2026-03-XX | 1.0.1 | 统一品牌主体为 Panshaker Inc，修复 Synapse OS 图片与截图文件名，新增透明底 Favicon，抽取共享样式，补齐多语言翻译与页面 data-i18n 覆盖，完善招聘与团队页面文案 |

---

*本文档由技术团队维护。如有修改请同步更新版本号和更新日志。*
