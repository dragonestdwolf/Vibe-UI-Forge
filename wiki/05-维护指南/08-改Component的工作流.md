# 08 · 改 Component 的工作流

> 当视觉层已经不够，且你需要改变组件的结构、变体、插槽或交互逻辑时，才进入 component 层改造。

---

## 这类改造解决什么问题

组件级别的改造需求 — 需要改变组件的结构、组合方式、插槽、变体（variant）或新增交互逻辑，超出了 CSS 变量和 className 的能力范围。

---

## 什么时候应该进入这一层

| 需求 | 属于 Component 层？ |
|------|-------------------|
| 给 Button 新增一个 brand variant | ✅ |
| Card 需要多一个固定 slot | ✅ |
| Dialog 的结构需要调整 | ✅ |
| Select 要换成更符合业务的组合 | ✅ |
| FormField / FieldGroup 需要新的包装方式 | ✅ |
| 把主色改成蓝色 | ❌ → CSS / Token 层 |
| 调整页面局部间距 | ❌ → CSS / Token 层 |
| 登录页从单栏改成双栏 | ❌ → Page / Block 层 |

---

## 什么时候不该进入这一层

- 视觉变化通过 CSS 变量或 className 就能解决
- 需求其实只是一个页面的局部定制，更适合基于现有组件封装业务组件，而不是改基础组件
- 改动会影响大量现有页面的基础用法，却没有充分理由

---

## 标准工作流

```
① 判断：CSS / Token 层是否已经不够？
    ↓ 是
② 确认要改的是：
   variant（样式变体）/ slot（插槽）/ structure（结构）/ behavior（交互行为）
    ↓
③ 决定：
   扩展现有 shadcn 组件（改基础组件）
   or
   基于 shadcn 组件封装业务组件（不改基础组件）
    ↓
④ 实现
    ↓
⑤ 检查：是否破坏了原有的复用能力
```

---

## 扩展 vs 封装：两条路径的选择

| 情况 | 路径 |
|------|------|
| 需要改变所有地方的这个组件 | 扩展现有 shadcn 组件 |
| 只是某个页面有特殊需求 | 基于 shadcn 封装业务组件 |
| 需要把这个能力分享给其他项目 | 做成可分发 registry 组件 |

**原则**：优先封装业务组件，只有当改动有全局意义时才扩展基础组件。

---

## AI 默认修改范围

AI 在 Component 层的默认修改顺序：

1. 目标组件的源码（variant / slot / structure）
2. 组件相关的样式定义
3. 必要的 import 和 usage 示例

**可联动**：少量使用处的更新、演示页面的相关调整。

**默认禁区**：除非明确授权，否则不全局替换所有使用该组件的页面、不改 page/block 布局、不修改无关组件。

---

## 本地项目改造时如何与 Agent 协作

### 设计师怎么说

```
这是本地项目里的组件改造，不需要做成 registry 资产。
请直接改我项目里的组件源码，并告诉我影响了哪些现有使用处。
```

### Agent 应该怎么做

1. 根据项目 `aliases.ui` 找到真实组件位置
2. 在本地项目里扩展 variant / slot / 结构
3. 必要时补少量 import 和 usage
4. 通常**不需要注册组件**

---

## 可分发资源改造时如何与 Agent 协作

### 设计师怎么说

```
我要把这个组件能力沉淀成可分发资源，不只是当前项目自己用。
请按 registry 资产的方式改造，并告诉我需要新增哪些依赖、索引或构建步骤。
```

### Agent 应该怎么做

1. 把组件改动放进 registry 源目录
2. 保持它能被 CLI 或 registry 消费
3. 必要时补 registry item 描述、依赖关系和构建产物
4. 让这个组件未来可以被其他项目安装

---

## 什么时候 AI 必须先确认

- 发现需求其实只是局部页面定制，更适合封装业务组件
- 改动会影响很多现有页面的 Button / Card / Form 等基础用法
- 需要同步重排 page / block 才能完成目标
- 需要改组件公共 API，可能影响团队未来的复用方式
- 发现需求更适合通过新建业务组件解决，而不是改基础组件

---

## 给 AI 的推荐指令模板

```text
我要改什么：为 [具体组件] 新增 [variant/slot/结构/行为]
这属于哪一层：Component 层
优先改哪里：扩展现有组件 / 基于现有组件封装业务组件
不要碰什么：不要全局批量替换所有用法，不要改 page 布局
如果你判断不适合直接改基础组件，请先停下来告诉我原因
改完后怎么汇报：
  - 改了哪些文件
  - 你是扩展了基础组件还是新封装了业务组件
  - 哪些现有用法可能受影响
```

---

## Component 层的官方规则参考

shadcn 官方 Skill（`skills/shadcn/rules/`）定义了组件组合和样式的正确/错误示例，以下规则在改造时必须遵守：

### 样式规则

- **`className` 只做布局，不做样式覆盖**。改颜色用 variant 或 CSS 变量，不在 className 里写 `bg-blue-500`
- **用语义颜色**：`bg-primary`、`text-muted-foreground`，不用 `bg-blue-500` 这类 raw 值
- **用 `cn()` 做条件类名合并**，不写手动模板字符串拼接

### 组合规则

- **Item 必须放在 Group 里**：`SelectItem` → `SelectGroup`，`DropdownMenuItem` → `DropdownMenuGroup`
- **Dialog / Sheet / Drawer 必须有 Title**：`DialogTitle`、`SheetTitle`、`DrawerTitle`（ accessibility 要求），可用 `className="sr-only"` 视觉隐藏
- **Card 必须用完整结构**：`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`，不要全塞进 `CardContent`
- **Button 没有 `isPending` / `isLoading`**，用 `Spinner` + `data-icon` + `disabled` 组合
- **TabsTrigger 必须放在 TabsList 里**，不能直接放在 Tabs 下

### Base vs Radix

shadcn 有两套底层：`base`（React 19+）和 `radix`（传统）。差异主要在组合语法：

- **Radix** 用 `asChild`：`<DialogTrigger asChild><Button>Open</Button></DialogTrigger>`
- **Base** 用 `render`：`<DialogTrigger render={<Button />}>Open</DialogTrigger>`

用 `npx shadcn@latest info` 的 `base` 字段确认当前项目用的是哪套。

---

## 一个真实案例

**需求**：给 Button 新增一个 brand variant，用于品牌主操作按钮。

**路径选择**：扩展现有 Button（因为这个 variant 以后所有品牌主按钮都会用）

**AI 执行**：
1. 改 `components/ui/button.tsx`，新增 variant
2. 用 cva 定义新样式
3. 汇报：改了 `button.tsx`，哪些页面会受影响，是否需要全局替换

**结果**：一行 variant 定义，全局可用。

---

## 常见误区

| 误区 | 正确做法 |
|------|---------|
| 为了一个页面的特殊需求，直接污染全局 Button | 基于 Button 封装一个业务组件 |
| 把业务逻辑硬塞进基础组件 | 在业务组件层处理，基础组件保持纯净 |
| 本应该封装业务组件，却反过来改基础组件源码 | 先判断是否需要全局影响 |
| 为了改一个颜色去新增组件 | 先试 CSS 变量或 variant，组件是最后手段 |

---

## 验收清单

- [ ] 新能力是否被加在正确层级（不是过度封装，也不是过度改基础组件）
- [ ] 是否只解决当前目标，没有制造全局污染
- [ ] 旧页面是否仍能正常使用
- [ ] AI 有没有把"组件问题"误做成"整页重构"
- [ ] 是否遵守了官方组合规则（Group 嵌套、Title 存在性等）
- [ ] 如果是 Radix 项目，是否用了正确的 `asChild` 语法
