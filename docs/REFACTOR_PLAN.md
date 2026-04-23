# Vibe-UI-Forge 工作流重构计划

> 日期：2026-04-20
> 目标：将 Skill 层与资源层解耦，实现插件化架构

---

## 一、核心理念

**Skill 层与资源层完全切割**：
- Skill 本身具备通用性，对接至任何资源文件即生成对应效果
- 全局性 rules 不带业务属性内容
- 资源层包含所有业务属性，可独立维护、替换

---

## 二、架构设计

### 2.1 分层架构

```
┌─────────────────────────────────────────────────┐
│  SKILL 层（通用，无业务属性）                     │
│                                                  │
│  - 工作流定义（路由 → 布局 → 组件 → 校验 → 生成）│
│  - 降级策略协议（精确 → 模糊 → fallback）        │
│  - 资源加载契约（资源接口定义，不含实际数据）     │
│  - 组合校验规则（几何兼容性检查点）              │
└─────────────────────────────────────────────────┘
                          ↓ 实现了什么？
                          ↓ 加载什么资源？
                          ↓ 遵循什么格式？
┌─────────────────────────────────────────────────┐
│  资源层（业务属性，可替换）                       │
│                                                  │
│  - Harmony 规范 / DevUI 规范 / 其他设计系统      │
│  - 组件 Spec（HTML 结构、尺寸、状态、变量契约）  │
│  - 布局 Spec（骨架、映射规则、语义 Token）       │
│  - 主题 Token（颜色、字阶、间距）                │
└─────────────────────────────────────────────────┘
```

### 2.2 工作流定义

```
输入 prompt / Figma Design
    ↓
┌─────────────────────────────────────┐
│ 1. ROUTE MATCHING                   │
│    → page_type + intent + constraints│
│    资源：{resourcePath}/route-index.md
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 2. LAYOUT RESOLUTION               │
│    精确匹配 → 模糊匹配 → fallback   │
│    资源：{resourcePath}/layout/     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 3. COMPONENT RESOLUTION            │
│    精确匹配 → 模糊匹配 → fallback   │
│    资源：{resourcePath}/component/  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 4. COMPOSITION CHECK               │
│    几何兼容性校验                    │
│    资源：{resourcePath}/composition│
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 5. CODE GENERATION                 │
│    生成 + 注入 Template + 应用 Token │
│    资源：{resourcePath}/template/   │
└─────────────────────────────────────┘
```

### 2.3 多资源切换机制

通过配置文件切换不同设计系统资源：

```json
// .resources/config.json
{
  "active": "harmony",
  "resources": {
    "harmony": {
      "path": ".resources/harmony",
      "routeRules": "route-index.md",
      "layoutFallback": "layout/fallback.md",
      "componentFallback": "component/fallback.md",
      "compositionCheck": "composition-check.md",
      "theme": "theme/tokens.css",
      "globalRules": "global-rules.md"
    },
    "devui": {
      "path": ".resources/devui",
      ...
    }
  }
}
```

---

## 三、文件改造计划

### 3.1 需要新建的文件

#### 资源连接配置

| 文件路径 | 说明 | 优先级 |
|----------|------|--------|
| `.resources/config.json` | Skill 与资源的连接配置 | P0 |

#### Harmony 资源层

| 文件路径 | 说明 | 优先级 |
|----------|------|--------|
| `.resources/harmony/route-index.md` | 路由规则索引 | P0 |
| `.resources/harmony/layout/fallback.md` | 布局降级规则 | P0 |
| `.resources/harmony/component/fallback.md` | 组件降级规则 | P0 |
| `.resources/harmony/composition-check.md` | 组合校验规则 | P1 |
| `.resources/harmony/layout/index.md` | 布局清单索引 | P1 |
| `.resources/harmony/component/index.md` | 组件清单索引 | P1 |
| `.resources/harmony/global-rules.md` | 全局规则索引 | P1 |

#### DevUI 资源层

| 文件路径 | 说明 | 优先级 |
|----------|------|--------|
| `.resources/devui/` | DevUI 完整资源层 | P2 |

### 3.2 需要改造的文件

#### Skill 层改造

| 文件路径 | 改造内容 | 优先级 |
|----------|----------|--------|
| `.agent/skills/shadcn/SKILL.md` | 删除业务属性，改为配置驱动 | P0 |
| `.agent/skills/shadcn/rules/composition.md` | 改为规则模板，不含具体组件 | P1 |
| `.agent/skills/shadcn/rules/styling.md` | 改为规则模板，不含具体 Token | P1 |
| `.agent/skills/shadcn/rules/forms.md` | 保持通用表单规则 | P1 |
| `.agent/skills/shadcn/rules/icons.md` | 保持通用图标规则 | P1 |

#### 文档改造

| 文件路径 | 改造内容 | 优先级 |
|----------|----------|--------|
| `README.md` | 更新工作流说明 | P1 |
| `docs/preview-environment.md` | 补充新架构说明 | P2 |

### 3.3 改造后的文件结构

```
Vibe-UI-Forge-main/
├── .agent/
│   └── skills/
│       ├── shadcn/
│       │   ├── SKILL.md                    # 改造：通用工作流，配置驱动
│       │   └── rules/
│       │       ├── composition.md          # 改造：规则模板
│       │       ├── styling.md             # 改造：规则模板
│       │       ├── forms.md               # 保持
│       │       ├── icons.md              # 保持
│       │       └── base-vs-radix.md      # 保持
│       └── (其他 Skill...)
├── .resources/                             # 新建：资源层根目录
│   ├── config.json                        # P0：资源配置
│   ├── harmony/                          # P0：Harmony 资源集
│   │   ├── route-index.md
│   │   ├── global-rules.md
│   │   ├── layout/
│   │   │   ├── index.md
│   │   │   ├── fallback.md
│   │   │   └── mobile-settings.md
│   │   ├── component/
│   │   │   ├── index.md
│   │   │   ├── fallback.md
│   │   │   ├── button.md
│   │   │   ├── list.md
│   │   │   └── switch.md
│   │   ├── theme/
│   │   │   ├── tokens.css
│   │   │   └── font-scale.md
│   │   └── template/
│   │       └── button-tem.html
│   └── devui/                             # P2：DevUI 资源集
│       └── ...
└── ...
```

---

## 四、Skill 层改造详情

### 4.1 SKILL.md 改造

**删除内容**（业务属性）：
- Harmony 特定的资源路由表
- 具体组件规范引用（button.md、list.md）
- 具体 Token 引用（font_primary、background_secondary）
- 内联的具体规则示例

**改为内容**（配置驱动）：
```markdown
## Workflow

1. **Route Matching** — 根据资源配置执行路由决策
2. **Layout Resolution** — 加载对应布局规范
3. **Component Resolution** — 加载对应组件规范
4. **Composition Check** — 执行组合校验
5. **Code Generation** — 注入模板生成代码

## Resource Configuration

当前激活资源：`{{activeResource}}`
资源配置路径：`{{resourceConfigPath}}`

资源切换：修改 `.resources/config.json` 中的 `active` 字段。

## 资源加载契约

各工作流步骤应从资源配置中读取：
- `routeRules` → 路由规则文件
- `layoutFallback` → 布局降级规则
- `componentFallback` → 组件降级规则
- `compositionCheck` → 组合校验规则
- `theme` → 主题 Token CSS
- `globalRules` → 全局规则索引
```

### 4.2 rules/*.md 改造

**改造原则**：
- 删除具体组件名（button、list、switch）
- 删除具体 Token 名（font_primary、background_secondary）
- 删除具体尺寸值（48px、64px）
- 保留规则模板格式和协议

**改为格式**：
```markdown
## 通用组件组合规则

### 规则模板
组件规范应包含：
1. Content Presentation — slot 定义格式
2. Interaction States — 状态维度
3. Dynamic Response — 动态行为约束
4. Template Injection — 变量契约格式
5. Numeric Baseline — 尺寸矩阵（格式定义，非具体值）

### 降级协议
当资源层无对应组件时，使用 component-fallback 中的兜底规则：
1. 精确匹配 → 模糊匹配组件族
2. 模糊匹配失败 → 使用原子组件组合
3. 仍无法处理 → 使用 div + CSS 模拟
4. 终止条件：超过 2 层降级则返回错误

### 组合校验点
- 行高与容器高度是否兼容
- 间距是否符合 scale 定义
- 状态层是否覆盖完整
```

---

## 五、资源层设计详情

### 5.1 route-index.md 格式

```markdown
# Harmony 路由规则

## 页面类型识别

| 模式 | page_type | 路由到 |
|------|-----------|--------|
| 设置页 / 个人中心 / 偏好设置 | `mobile-settings` | layout/mobile-settings.md |
| 列表页 / 详情页 | `mobile-list` | layout/mobile-list.md |
| 表单页 / 录入页 | `mobile-form` | layout/mobile-form.md |
| ... | ... | ... |

## Fallback

无法识别时默认路由到：`layout/fallback.md`

## intent_type 识别

| 模式 | intent_type |
|------|-------------|
| 生成新页面 | `create` |
| 修改现有页面 | `update` |
| 扩展现有页面 | `extend` |
```

### 5.2 component-fallback.md 格式

```markdown
# 组件降级规则

## 降级层级

### Level 1: 模糊匹配
组件名称近似时，降级到同族组件：
- `list-v2` → `list`
- `medicen-card` → `service-card`

### Level 2: 原子组件组合
无对应复合组件时，使用原子组件组合：
- `list row` → `div + flex + text`
- `entry card` → `card + list row`

### Level 3: div 模拟
无法组合时，使用 div + CSS 模拟：
- 仅保留视觉表现
- 必须符合 theme token

## 终止条件
超过 2 层降级仍无法处理时，中断并返回：
```
[CANNOT_RESOLVE] component: <name>, attempted_levels: 3
```
```

### 5.3 composition-check.md 格式

```markdown
# 组合校验规则

## 校验点

### 1. 几何兼容性
- [ ] list item 高度与 card 容器高度匹配
- [ ] icon 与 slot 尺寸匹配
- [ ] 间距符合 mobile-scale 定义

### 2. 状态覆盖
- [ ] hover / pressed / focus / disabled 状态完整
- [ ] 状态层不覆盖关键内容

### 3. 语义匹配
- [ ] 组件语义与使用场景一致
- [ ] token 引用正确

## 不兼容时的处理

回退到 layout 选择步骤，重新选型。
```

---

## 六、改造优先级与工作量

| 优先级 | 文件 | 类型 | 预估改动量 |
|--------|------|------|-----------|
| P0 | `.resources/config.json` | 新建 | ~20 行 |
| P0 | `.resources/harmony/route-index.md` | 新建 | ~60 行 |
| P0 | `.resources/harmony/layout/fallback.md` | 新建 | ~40 行 |
| P0 | `.resources/harmony/component/fallback.md` | 新建 | ~40 行 |
| P0 | `.agent/skills/shadcn/SKILL.md` | 改造 | -60/+80 行 |
| P1 | `.agent/skills/shadcn/rules/composition.md` | 改造 | -20/+40 行 |
| P1 | `.agent/skills/shadcn/rules/styling.md` | 改造 | -20/+30 行 |
| P1 | `.resources/harmony/global-rules.md` | 新建 | ~30 行 |
| P1 | `.resources/harmony/composition-check.md` | 新建 | ~50 行 |
| P1 | `.resources/harmony/layout/index.md` | 新建 | ~30 行 |
| P1 | `.resources/harmony/component/index.md` | 新建 | ~50 行 |
| P1 | `README.md` | 改造 | ~20 行 |
| P2 | `.resources/harmony/` 其他资源文件 | 新建 | ~200 行 |
| P2 | `.resources/devui/` | 新建 | ~300 行 |
| P2 | `docs/*.md` | 改造 | ~20 行 |

**总改造量**：约 400-500 行，分散在 15+ 文件中

---

## 七、验收标准

### 7.1 功能验收

- [ ] 同一 SKILL 可通过配置切换 Harmony / DevUI 资源
- [ ] 路由匹配能正确识别页面类型
- [ ] 组件降级能按层级 fallback
- [ ] 组合校验能检测几何不兼容
- [ ] 代码生成正确注入模板和 Token

### 7.2 质量验收

- [ ] SKILL 层不含任何业务属性内容
- [ ] 资源层可独立替换，不影响 SKILL 层
- [ ] 工作流步骤清晰，可追踪
- [ ] 降级有终止条件，不会无限循环

---

## 八、后续扩展

### 8.1 新增设计系统

1. 在 `.resources/` 下创建新目录（如 `.resources/antd/`）
2. 按规范填充 route-index.md、layout/、component/、theme/、template/
3. 在 `config.json` 中注册新资源
4. 修改 `active` 字段切换

### 8.2 新增 Layout 类型

1. 在 `layout/` 下创建新文件（如 `mobile-sheet.md`）
2. 在 `route-index.md` 中增加模式匹配规则
3. 在 `layout/index.md` 中注册

### 8.3 新增组件

1. 在 `component/` 下创建新文件（如 `switch.md`）
2. 在 `component/index.md` 中注册
3. 在 `template/` 下创建模板（如 `switch-tem.html`）

---

## 九、风险与对策

| 风险 | 对策 |
|------|------|
| 配置驱动增加复杂度 | 提供默认配置，MVP 先 hardcode 路径 |
| 资源层与 SKILL 层契约漂移 | 增加集成测试，校验资源完整性 |
| 降级层级过多导致代码质量下降 | 严格终止条件 + 人工审核点 |
| 多资源维护成本 | 复用跨资源的通用部分（如 spacing scale） |
