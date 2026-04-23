# 03 | 改 Component

> 当视觉层已经不够，需要改变组件的结构、variant、slot 或交互时，进入 Component 层。
> 这一层有两种场景：新增 Component 和修改已有 Component。

---

## 开头三问

**什么时候改这一层？**

当需求涉及组件的 API、variant、slot、状态或结构变化时：新增 variant、新增 slot、修改交互行为。

**设计师只需要做什么？**

修改前说明组件的变化（新增什么 variant 或状态）。修改后在 Storybook 中检查组件状态和变体是否符合预期。

**Agent 会自动做什么？**

定位组件源码、确认接口向后兼容、执行修改、补全 story、跑质量门禁、说明影响范围。

---

## 1. 适合这一层的需求

| 需求 | 是否适合 Component 层 |
|---|---|
| 给 Button 新增 variant | 是 |
| Card 新增固定 header slot | 是 |
| Dialog 改组合结构 | 是 |
| Select 新增业务组合方式 | 是 |
| 改按钮颜色 | 否，先看 CSS / Token 层 |
| 调整页面区块顺序 | 否，进入 Page / Block 层 |
| 组件需要新增状态 | 是 |

---

## 2. 两种场景

| 场景 | 说明 |
|---|---|
| **新增 Component** | 从 Figma 或设计稿抽取新组件，纳入可调用范围 |
| **修改 Component** | 规范更新后同步源码，刷新已有组件的实现 |

新增 Component 的完整流程见 [04-抽取 Component 资源](../../02-从%200%20构建资源接入/04-抽取%20Component%20资源.md)。**本章重点是修改已有 Component。**

---

## 3. 修改前的两条红线

### 3.1 接口必须向后兼容

组件的 Props 接口一旦发布，不能随意删改已有字段。

| 可以做 | 不可以做 |
|---|---|
| 新增 optional Props | 删除已有 Props |
| 新增 variant（不改变默认行为） | 改变已有 variant 的默认样式 |
| 新增 slot | 修改已有 slot 的结构或名称 |
| 新增状态（不影响默认展示） | 改变已有状态的默认样式或行为 |

```tsx
// 好：新增 Props 不影响已有调用方
interface ButtonProps {
  variant?: 'primary' | 'secondary';  // 新增可选
  loading?: boolean;                    // 新增可选
}

// 坏：删除已有 Props，导致所有调用方报错
interface ButtonProps {
  // ❌ 删除了已有 variant
}
```

### 3.2 组件结构必须和存量组件保持一致

新组件或修改后的组件必须和存量组件在同一套模式里，才能混用。

注册格式（来自 `components.json`）：

```json
{
  "id": "StatusBar",
  "source": "harmony-ui-playground/src/component/StatusBar/index.tsx",
  "stories": "harmony-ui-playground/src/component/StatusBar/index.stories.tsx"
}
```

新组件也必须放在 `src/component/{ComponentName}/` 目录下，导出名为 PascalCase，有对应的 stories 文件，注册到 `components.json`。

---

## 4. 判断示例

| 需求 | 判断结果 | 原因 |
|---|---|---|
| 给 Button 新增 loading variant | Component | 新增 variant，不影响已有 props |
| 修改 Button 默认背景色 | CSS / Token | 只是视觉值变化，不涉及 API |
| Switch 组件新增 disabled 状态 | Component | 涉及组件状态变化 |
| 设置页改成三栏布局 | Page / Block | 改变页面结构 |
| Card 需要新增 header slot | Component | 新增 slot 结构 |
| Dialog 改变关闭动画行为 | Component | 改变组件行为，但不改变 props |

---

## 5. 修改 Component 完整工作流

```
👤 设计师 说明规范变化和预期结果
    ↓
🤖 AI 定位组件源码：src/component/{ComponentName}/index.tsx
    ↓
🤝 设计师确认修改范围（影响哪些已有调用方）
    ↓
🤖 AI 确认接口向后兼容
    ↓
🤖 AI 修改 React TSX 源码（保持 props 签名稳定）
    ↓
🤖 AI 更新 Storybook story（如涉及新状态）
    ↓
👤 设计师 在 Storybook 验收
    ↓
🤖 AI 说明 props 变化和影响范围
    ↓
🤖 AI 跑质量门禁验证
```

---

## 6. 执行步骤

### Step 1：定位组件源码

AI 读取组件目录：

```
src/component/{ComponentName}/
├── index.tsx        # 组件实现
└── index.stories.tsx  # story 文件
```

如果组件复杂，AI 会额外读取 `component/*.md` 使用说明。

### Step 2：确认接口兼容性

在修改前，AI 必须检查现有 Props 有哪些字段、计划修改是否涉及字段增删、是否有其他组件或页面依赖这个组件。如果修改会破坏接口，AI 应先说明影响，再让设计师确认是否继续。

### Step 3：执行修改

- 不删除已有 Props 字段
- 不改变已有 variant 的默认样式
- 新增 variant / slot / 状态时使用可选字段
- 保持和存量组件相同的目录结构和导出方式

### Step 4：更新 Storybook story

如果修改涉及新状态，AI 补全对应的 story：

```tsx
export const Loading: Story = {
  args: {
    loading: true,
    children: '提交中',
  },
};
```

### Step 5：验证

质量门禁三个命令（详见 [05-质量审核与回归验证](./05-质量审核与回归验证.md)）：

```bash
node scripts/validate_design_system_resources.mjs
npm run build
npm run build-storybook
```

---

## 7. 设计师给 AI 的推荐开头

修改已有组件时：

```text
[组件名] 需要 [新增 variant / 新增状态 / 改变某行为]。
这是 Component 层修改，不是 CSS / Token 层。
请确认接口向后兼容，不要删除已有 Props。
改完后说明 props 变化和影响范围。
```

新增组件时：

```text
请根据这个 Figma 链接生成 [组件名] 组件。
完整流程参考 04-抽取 Component 资源。
新组件要和存量组件保持一致的目录结构和导出格式。
```

---

## 8. 验收标准

| 验收项 | 通过标准 |
|---|---|
| 接口兼容 | 已有 Props 字段未被删除或重命名 |
| 结构一致 | 组件目录、导出名、story 路径符合注册格式 |
| 状态覆盖 | Storybook story 覆盖新增状态 |
| 质量门禁 | 三个验证命令全部通过（详见 [05-质量审核与回归验证](./05-质量审核与回归验证.md)） |

---

## 9. 相关文档

| 想了解 | 去读 |
|---|---|
| 如何判断需求属于哪一层 | [01-先判断应该改哪一层](./01-先判断应该改哪一层.md) |
| 新增 Component 完整流程 | [04-抽取 Component 资源](../../02-从%200%20构建资源接入/04-抽取%20Component%20资源.md) |
| 改 CSS / Token 的具体做法 | [02-改 CSS 和 Token](./02-改%20CSS%20和%20Token.md) |
| 改 Page 与 Block 的具体做法 | [04-改 Page 与 Block](./04-改%20Page%20与%20Block.md) |
| 如何验收修改结果 | [05-质量审核与回归验证](./05-质量审核与回归验证.md) |
