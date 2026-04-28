# DoNotDisturbDetail - Generation Log

> 免打扰情景模式详情页

---

## Input

```
生成一个"免打扰情景模式"的设置详情页面。
- 顶部状态栏 + 标题栏（标题"免打扰"，左侧返回）
- 主区域：大圆角白色卡片，含紫色月亮图标、模式名称、开启/关闭开关、状态说明
- 底部快捷操作栏：始终开启 / 定时...
- "允许来电"分组：来电（所有人）/ 消息（不允许）
- "通知行为"分组：隐藏通知内容、静音、振动（均为开关）
- "其它"分组：重复来电开关
- "关联系统功能"分组：深色模式（同步开启）、护眼模式（不关联）
- 底部说明文案 + Home Indicator
```

---

## Route Matching

| Field | Value |
|-------|-------|
| `page_type` | `mobile-settings` |
| `layout` | `.resources/harmony/layout/mobile-settings.md` |
| `route` | `Render/Setting Page-V26/DoNotDisturbDetail` |
| `output_dir` | `harmony-ui-playground/src/render/settings-page-v26` |
| `story_id` | `render-setting-page-v26-do-not-disturb-detail--default` |

**命中依据：**

- 页面为移动端单屏设置详情页，符合 `mobile-settings` 的单列卡片骨架。
- 主体内容由设置分组卡片构成，无底部主 CTA，符合布局约束。
- 无多列或图表结构，不命中其他 layout。

---

## Source Grounding

**本次不参考任何历史 render 页面，仅使用以下来源：**

| Source | Usage |
|--------|-------|
| `.resources/config.json` | 读取当前激活资源 `harmony` |
| `.resources/harmony/route-index.md` | 将请求归类为 `mobile-settings` |
| `.resources/harmony/layout/mobile-settings.md` | 约束页面壳层、宽度、单列卡片布局 |
| `src/component/StatusBar/StatusBar.tsx` | 顶部系统状态栏 |
| `src/component/TitleBar/TitleBar.tsx` | 标题导航栏 |
| `src/component/List/List.tsx` | 设置分组容器 |
| `src/component/List/ListItem.tsx` | 行级设置项布局 |
| `src/component/Switch/Switch.tsx` | 开关控件 |
| `src/blocks/water-settings.tsx` | 参考设置页结构模式 |
| `src/blocks/settings-page.tsx` | 参考鸿蒙风格字体与间距规范 |

---

## Page Structure

```
DoNotDisturbDetail
├─ StatusBar
├─ TitleBar (title: 免打扰, left: 返回)
├─ Hero Card
│  ├─ MoonStar icon (purple when on, gray when off)
│  ├─ Title + Switch
│  ├─ Status text (已开启/已关闭)
│  └─ Quick action: 始终开启
├─ 允许来电
│  ├─ 来电 / 所有人
│  └─ 消息 / 不允许
├─ 通知行为
│  ├─ 隐藏通知内容 + switch
│  ├─ 静音 + switch
│  └─ 振动 + switch
├─ 其它
│  └─ 重复来电 + switch
├─ 关联系统功能
│  ├─ 深色模式 / 同步开启
│  └─ 护眼模式 / 不关联
└─ Home indicator
```

---

## Generated Files

| File | Description |
|------|-------------|
| `DoNotDisturbDetail.tsx` | 免打扰情景模式详情页源码 |
| `DoNotDisturbDetail.stories.tsx` | Storybook 入口，title 为 `Render/Setting Page-V26/DoNotDisturbDetail` |
| `DoNotDisturbDetail.log.md` | 本次生成记录 |

---

## Validation

| Command | Result |
|---------|--------|
| `pnpm --dir harmony-ui-playground typecheck` | 通过 |
| `pnpm --dir harmony-ui-playground exec eslint src/render/settings-page-v26/DoNotDisturbDetail.tsx` | 通过 |
| `pnpm --dir harmony-ui-playground build-storybook` | 通过（存在非阻塞 chunk warning） |

---

## Metadata

| Field | Value |
|-------|-------|
| `generated_at` | 2026-04-27 |
| `workspace` | `Vibe-UI-Forge-main` |
| `package` | `harmony-ui-playground` |
| `version_label` | `v26` |
| `layout_basis` | `mobile-settings` |
| `history_render_dependency` | `none` |
