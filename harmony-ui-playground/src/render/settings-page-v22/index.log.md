# Settings Page V22 - Generation Log

> 移动端系统设置页 v1.1 生成记录

---

## Input

```text
生成移动端“系统设置”页面，大标题为“设置”；顶部包含全局搜索框；采用卡片式分组列表布局，核心结构如下： 个人账号卡片：包含头像与用户名，展示账号管理入口（含支付、账单、云空间等描述），并集成一个独立的状态区域，需明确展示“云空间”实时使用进度条（已用空间/总空间）及“查找设备”快捷入口； 设备信息卡片：展示当前关联的设备型号入口； 网络与连接分组：包含WLAN、蓝牙、移动网络、卫星网络、多设备协同，各列表项需根据当前状态展示连接摘要或开启情况； 外观与显示分组：包含桌面和个性化、显示和亮度； 不包含底部导航栏——v1.1——根据这份提示词帮我生成一份v22页面
```

---

## Route Matching

**命中页面类型：**

| Field | Value |
|-------|-------|
| `page_type` | `mobile-settings` |
| `route` | `Render/SettingsPageV22` |
| `output_dir` | `harmony-ui-playground/src/render/settings-page-v22` |
| `story_id` | `render-settingspagev22--default` |

**命中依据：**

- 需求包含“移动端”“系统设置”“设置”“卡片式分组列表”等典型设置页语义。
- 内容以设置入口、状态摘要、设备入口、分组列表为主，符合 `mobile-settings` / `settings-page` 结构。
- 明确要求“不包含底部导航栏”，因此没有使用 `AiBottomBar`、`bottomtab` 或底部导航组件。

---

## Referenced Pages And Blocks

> Policy note: 本记录描述 v22 生成当时的实际参考过程。自本次 workflow 更新后，后续页面生成不得再把历史 `src/render/**` 页面作为模板或视觉参考来源，只能使用 `.resources` 中登记的稳定 `src/blocks/**`、组件、样式与 token 资源。

**参考页面版本：**

| Reference | Purpose |
|-----------|---------|
| `src/render/settings-page-v19/index.tsx` | 参考系统设置页的搜索框、账号卡、网络连接分组语义 |
| `src/render/settings-page-v20/index.tsx` | 参考大标题、卡片圆角、移动端 360px 画布表达 |
| `src/render/settings-page-v21/index.tsx` | 参考 `ServiceCard` 组合和独立 render page/story 组织方式 |
| `src/blocks/settings-page.tsx` | 参考基础“设置”页面和 Harmony 风格列表项 |

**最终路由到：**

```text
harmony-ui-playground/src/render/settings-page-v22/index.tsx
harmony-ui-playground/src/render/settings-page-v22/index.stories.tsx
```

---

## Component Resources

**复用组件：**

| Component | Import | Usage |
|-----------|--------|-------|
| `StatusBar` | `@/component/StatusBar` | 顶部系统状态栏 |
| `ServiceCard` | `@/component/ServiceCard` | 账号卡、设备卡、网络分组、外观分组的卡片容器 |

**图标资源：**

| Resource | Source | Usage |
|----------|--------|-------|
| `icon-chevron-backward.png` | `src/blocks/assets/pixso-icons` | 顶部返回按钮 |
| `lucide-react/Search` | `lucide-react` | 搜索框图标 |
| `lucide-react/UserRound` | `lucide-react` | 账号头像符号 |
| `lucide-react/Cloud` | `lucide-react` | 账号管理与云空间语义 |
| `lucide-react/Radar` | `lucide-react` | 查找设备快捷入口 |
| `lucide-react/Smartphone` | `lucide-react` | 当前设备入口 |
| `lucide-react/Wifi` | `lucide-react` | WLAN |
| `lucide-react/Bluetooth` | `lucide-react` | 蓝牙 |
| `lucide-react/Signal` | `lucide-react` | 移动网络 |
| `lucide-react/Satellite` | `lucide-react` | 卫星网络 |
| `lucide-react/MonitorSmartphone` | `lucide-react` | 多设备协同 |
| `lucide-react/Palette` | `lucide-react` | 桌面和个性化 |
| `lucide-react/SunMedium` | `lucide-react` | 显示和亮度 |
| `lucide-react/ChevronRight` | `lucide-react` | 列表入口箭头 |

**本页内局部组合：**

| Local Function | Purpose |
|----------------|---------|
| `HeaderButton` | 顶部圆形返回按钮 |
| `IconTile` | 设置项左侧彩色图标底板 |
| `SectionLabel` | 分组标题 |
| `SettingsRow` | 卡片分组内的可点击设置行 |
| `AccountCard` | 个人账号卡片，包含账号管理、云空间进度、查找设备 |

---

## Page Structure

```text
SettingsPageV22
├─ StatusBar
├─ Header
│  ├─ Back button
│  ├─ H1: 设置
│  └─ Global search input: 搜索设置
├─ AccountCard
│  ├─ Avatar + username
│  ├─ 账号管理: 支付、账单、云空间、订阅与安全
│  └─ Independent status area
│     ├─ 云空间: 142.8GB / 200GB
│     ├─ Progress bar: 71%
│     └─ 查找设备: 2 台在线
├─ Device card
│  └─ HUAWEI Mate 70 Pro / 本机
├─ 网络与连接
│  ├─ WLAN / 已连接 Harmony_5G
│  ├─ 蓝牙 / 已开启
│  ├─ 移动网络 / 中国移动 5G
│  ├─ 卫星网络 / 未开启
│  └─ 多设备协同 / 平板可协同
├─ 外观与显示
│  ├─ 桌面和个性化 / 主题与壁纸
│  └─ 显示和亮度 / 自动
└─ Home indicator
```

---

## Generated Files

| File | Description |
|------|-------------|
| `index.tsx` | v22 页面源码 |
| `index.stories.tsx` | Storybook 入口，title 为 `Render/SettingsPageV22` |
| `index.log.md` | 本次生成路由、组件与校验记录 |

---

## Validation

| Command | Result |
|---------|--------|
| `pnpm --dir harmony-ui-playground typecheck` | 通过 |
| `pnpm --dir harmony-ui-playground build-storybook` | 通过 |
| `pnpm --dir harmony-ui-playground exec eslint src/render/settings-page-v22` | 通过 |

**预览地址：**

```text
http://localhost:6011/iframe.html?id=render-settingspagev22--default
```

**注意：**

- 全仓库 `pnpm --dir harmony-ui-playground lint` 仍会命中既有历史 lint 问题，错误不来自 `settings-page-v22`。
- Playwright MCP 截图受本机 `/.playwright-mcp` 写入权限限制，本轮未完成截图。

---

## Metadata

| Field | Value |
|-------|-------|
| `generated_at` | 2026-04-20 |
| `workspace` | `Vibe-UI-Forge-main` |
| `package` | `harmony-ui-playground` |
| `version_label` | `v22` |
| `prompt_label` | `v1.1` |
| `layout_basis` | `mobile-settings` / card grouped list |
| `bottom_navigation` | `not included` |
