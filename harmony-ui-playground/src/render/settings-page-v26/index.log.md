# Settings Page V26 - Generation Log

> 情景模式设置页重新生成记录

---

## Input

```text
还原一个“情景模式”的设置页面。顶部是标准导航栏，标题“情景模式”，右侧保留添加、帮助、更多操作图标；标题下方有一句说明，表达该功能会自动调系统功能，让人更专注。主体有一张显眼的大圆角白色轮播卡片，展示紫色圆底月亮图标、“免打扰”“减少打扰保持专注”和浅灰色“立即开启”按钮，卡片下方三个圆点且当前停在第一个。继续向下是“条件开启”区域，已有规则“周日 周六 22:00 到次日 07:00”，状态“已关闭”，右侧可添加新条件，并附带位置权限提示。然后是一组设置项，包括“推荐开启与关闭”开关及偏好/位置说明；“允许打扰”白名单中的“应用和元服务 / 未选择”与“联系人 / 仅限收藏”；“重要信息提醒”开关，控制验证码与实况消息；最后是“关联系统功能”，含“深色模式”“护眼模式”两个下拉选框，当前均为“不关联”。忽略历史 render 结果，重新生成一份 Render/Setting Page-V26，并记录相关 log。
```

---

## Route Matching

| Field | Value |
|-------|-------|
| `page_type` | `mobile-settings` |
| `layout` | `.resources/harmony/layout/mobile-settings.md` |
| `route` | `Render/Setting Page-V26` |
| `output_dir` | `harmony-ui-playground/src/render/settings-page-v26` |
| `story_id` | `render-setting-page-v26--default` |

**命中依据：**

- 页面为移动端单列设置页语义，包含状态栏、标题栏、卡片式内容区与分组设置行。
- 主体由单列卡片和设置项组成，符合 `mobile-settings` 的骨架约束。
- 无底部主 CTA 或多列结构，因此不命中其它 layout。

---

## Source Grounding

**本次仅使用以下来源，不参考任何历史 render 页面代码：**

| Source | Usage |
|--------|-------|
| `.resources/config.json` | 读取当前激活资源 `harmony` |
| `.resources/harmony/route-index.md` | 将请求归类为 `mobile-settings` |
| `.resources/harmony/layout/mobile-settings.md` | 约束页面壳层、宽度、单列卡片布局 |
| `.resources/harmony/blocks.json` | 确认可复用的设置页 block 范围 |
| `src/component/StatusBar/StatusBar.tsx` | 顶部系统状态栏 |
| `src/component/List/List.tsx` | 设置分组容器 |
| `src/component/List/ListItem.tsx` | 行级设置项布局 |
| `src/component/Switch/Switch.tsx` | 开关控件 |

---

## Page Structure

```text
SettingsPageV26
├─ StatusBar
├─ Custom Header Shell
│  ├─ title: 情景模式
│  ├─ subtitle: 自动调系统功能，更专注
│  └─ actions: 添加 / 帮助 / 更多操作
├─ CarouselCard
│  ├─ moon icon
│  ├─ title: 免打扰
│  ├─ subtitle: 减少打扰保持专注
│  ├─ CTA: 立即开启
│  └─ dots: 3 (active = first)
├─ 条件开启
│  ├─ rule: 周日 周六 22:00 到次日 07:00
│  ├─ status: 已关闭
│  ├─ add button
│  └─ note: 位置权限提示
├─ 推荐开启与关闭
│  ├─ switch
│  └─ description: 偏好与位置自动推荐
├─ 允许打扰
│  ├─ 应用和元服务 / 未选择
│  └─ 联系人 / 仅限收藏
├─ 重要信息提醒
│  ├─ switch
│  └─ description: 验证码、实况消息
├─ 关联系统功能
│  ├─ 深色模式 / 不关联
│  └─ 护眼模式 / 不关联
└─ Home indicator
```

---

## Generated Files

| File | Description |
|------|-------------|
| `index.tsx` | `settings-page-v26` 页面源码 |
| `index.stories.tsx` | Storybook 入口，title 为 `Render/Setting Page-V26` |
| `index.log.md` | 本次生成记录 |

---

## Validation

| Command | Result |
|---------|--------|
| `pnpm --dir harmony-ui-playground typecheck` | 通过 |
| `pnpm --dir harmony-ui-playground exec eslint src/render/settings-page-v26` | 通过 |
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
