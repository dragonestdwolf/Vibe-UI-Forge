# 04 | 改 Page 与 Block

> 当需求涉及页面结构、区块组合或信息层级变化时，进入 Page / Block 层。
> 这一层有两种东西要改：Block 和 Page，各有新增和修改两种场景。

---

## 开头三问

**什么时候改这一层？**

当需求涉及页面结构、区块组合或新增页面类型时：调整 Block 顺序、新增区块、新建页面类型。

**设计师只需要做什么？**

修改前说明页面结构变化（哪些 Block 变了）。修改后在 Storybook 中检查页面结构是否符合预期。

**Agent 会自动做什么？**

定位 Page / Block 源码、执行修改、同步更新 Resource Layer（route-index / layout / blocks.json）、跑质量门禁、说明影响范围。

---

## 1. 适合这一层的需求

| 需求 | 是否适合 Page / Block 层 |
| --- | --- |
| 页面从单栏改双栏 | 是 |
| dashboard 区块重排 | 是 |
| 设置页新增一个分组 | 是 |
| 列表筛选区位置变化 | 是 |
| 改按钮颜色 | 否，先看 CSS / Token 层 |
| 给 Select 新增 variant | 否，进入 Component 层 |

---

## 2. 两个东西：Block 和 Page

| 东西 | 定义 | 接口 |
| --- | --- | --- |
| **Block** | 稳定的页面区块模板，由多个组件组合而成 | **组件嵌套关系**（这个 Block 由哪些组件、如何嵌套组成） |
| **Page** | 完整页面模板，对应一个 `page_type` | **layout_skeleton**（页面骨架，由哪些 Block 组成） |

```
Page
└── Block A
    ├── Component X
    ├── Component Y
    └── Component Z
└── Block B
    └── ...
```

---

## 3. 两条核心原则

**原则一：源码和 markdown 必须同步修改。**

- Block 改了 → `block/*.md` 必须同步更新
- Page 的 layout_skeleton 改了 → `layout/{page_type}.md` 必须同步更新

`block/*.md` / `layout markdown` 是 AI 的使用说明，源码改了 markdown 没改 = AI 拿到旧地图。

**原则二：Page 新增时，只有引用了新 Block 才需要更新 blocks.json。**

Page 本体进入 `route-index.md` 和 `layout/{page_type}.md`；只有当页面使用了新的 Block 时，才需要更新 `blocks.json`。

---

## 4. 四条路径的快速判断

在展开四条流程之前，先用这张表判断自己应该走哪条：

| 需求 | 应该走哪条 |
| --- | --- |
| 改区块内部的组件组合（如 Card 里换了个子组件） | Block 修改 |
| 从设计稿抽取一个新区块，供多个页面复用 | Block 新增 |
| 改页面的 Block 组合或区块顺序 | Page 修改 |
| 新增一种页面类型（如新的仪表盘布局） | Page 新增 |

---

## 5. Block 层：新增

### 场景说明

从设计稿抽取新 Block，纳入可调用范围，供 Page 层组合使用。

### 完整工作流

```
👤 设计师 提供设计稿或 Figma 链接
    ↓
🤖 AI 分析 Block 的组件嵌套关系
    ↓
🤖 AI 生成 Block TSX 源码
    ↓
🤖 AI 补 Storybook story
    ↓
👤 设计师 在 Storybook 验收
    ↓
🤖 AI 注册到 blocks.json
    ↓
🤖 AI 写 block/{BlockName}.md（组件嵌套关系、状态同步、适用场景）
```

---

## 6. Block 层：修改

### 场景说明

规范更新后修改已有 Block。必须同步更新源码和 markdown。

### 完整工作流

```
👤 设计师 说明规范变化
    ↓
🤖 AI 定位 src/blocks/{BlockName}/ 和 block/{BlockName}.md
    ↓
🤝 设计师确认修改范围（影响哪些页面）
    ↓
🤖 AI 修改 Block TSX 源码（保持组件嵌套关系稳定）
    ↓
🤖 AI 更新 block/*.md（如果嵌套关系变了）
    ↓
🤖 AI 更新 Storybook story（如涉及）
    ↓
👤 设计师 在 Storybook 验收
    ↓
🤖 AI 说明影响范围
```

### 修改注意事项

| 可以做 | 不可以做 |
| --- | --- |
| 调整组件内部实现细节 | 改变组件嵌套关系（除非新增 slot） |
| 新增可选子组件 slot | 删除已有子组件 slot |
| 调整状态同步逻辑 | 改变已有状态的默认行为 |
| 新增 Block 变体（可选） | 改变已有 Block 的默认结构 |

---

## 7. Page 层：新增

### 场景说明

新建完整页面模板，对应新的 `page_type`。

### 完整工作流

```
👤 设计师 提供新页面需求
    ↓
🤖 AI 判断是否已有相似的 page_type（优先复用）
    ↓
🤖 AI 确定页面由哪些 Block 组成
    ↓
🤖 AI 注册到 blocks.json（如有新 Block）
    ↓
🤖 AI 更新 route-index.md（新增 page_type）
    ↓
🤖 AI 写 layout/{page_type}.md（layout_skeleton、reference_blocks、generation_constraints）
    ↓
🤖 AI 生成 Page TSX 源码
    ↓
👤 设计师 验收页面结构
    ↓
🤖 AI 说明 layout_skeleton 和 Block 组合
```

---

## 8. Page 层：修改

### 场景说明

修改已有页面的结构、区块组合。必须同步更新 layout markdown。

### 完整工作流

```
👤 设计师 说明页面结构变化
    ↓
🤖 AI 定位 layout/{page_type}.md 和对应 Page TSX
    ↓
🤝 设计师确认修改范围（影响哪些已有区块）
    ↓
🤖 AI 修改 Page TSX（如涉及 Block 重组，更新 blocks.json）
    ↓
🤖 AI 同步更新 layout/{page_type}.md（layout_skeleton、reference_blocks）
    ↓
👤 设计师 在 Storybook 验收页面结构
    ↓
🤖 AI 说明 layout_skeleton 变化和影响范围
```

### 修改注意事项

| 可以做 | 不可以做 |
| --- | --- |
| 调整 Block 之间的顺序 | 破坏 layout_skeleton 的基本结构 |
| 替换某个 Block 为已有 Block | 删除 layout_skeleton 中的必要 Block |
| 新增可选 Block（generation_constraints 说明） | 改变已有 Block 的默认 slot |
| 新增 page_type 变体 | 改变已有 page_type 的默认 layout |

---

## 9. 判断示例

| 需求 | 判断结果 | 原因 |
| --- | --- | --- |
| 设置页新增一个"关于我们"区块 | Page-修改 | 改变了页面 Block 组合 |
| 仪表盘三叶草顺序调整 | Page-修改 | Block 组合变化 |
| 某个 Block 内部的 ListItem 文案修改 | Block-修改 | Block 内部实现细节 |
| 新抽取一个通用 Card Block | Block-新增 | 新增稳定模板 |
| 新建一个健康仪表盘页面 | Page-新增 | 新 page_type |
| 修改 Block 的组件嵌套关系 | Block-修改 | 改变接口，需同步更新 markdown |
| 修改已有 page_type 的 layout_skeleton | Page-修改 | 改变接口，需同步更新 markdown |

---

## 10. src/blocks/ vs src/render/ 边界

```
src/blocks/**  = 稳定模板源，可以作为新页面生成的参考
src/render/**  = 生成结果预览，不是模板源，不能反过来当 Block 使用
```

---

## 11. 执行步骤

### Step 1：判断是 Block 层还是 Page 层

参考「判断示例」，确认是改 Block 还是改 Page，还是两者都涉及。

### Step 2：判断是新增还是修改

新增走新增流程，修改走修改流程。

### Step 3：定位相关文件

| 操作 | 需要定位的文件 |
| --- | --- |
| Block-新增 | `src/blocks/{BlockName}/`（待创建）、`blocks.json`（待更新） |
| Block-修改 | `src/blocks/{BlockName}/index.tsx`、`block/{BlockName}.md`、`blocks.json` |
| Page-新增 | `route-index.md`、`layout/{page_type}.md`（待创建）、`blocks.json`（仅在有新 Block 时） |
| Page-修改 | `layout/{page_type}.md`、`src/blocks/{PageName}/`、`blocks.json`（如涉及） |

### Step 4：执行修改

原则：
- **源码和 markdown 必须同步修改**
- 保持组件嵌套关系（Block）或 layout_skeleton（Page）稳定
- 如涉及接口变化，先说明影响范围

### Step 5：验证

质量门禁三个命令（详见 [05-质量审核与回归验证](./05-质量审核与回归验证.md)）：

```bash
node scripts/validate_design_system_resources.mjs
npm run build
npm run build-storybook
```

---

## 12. 设计师给 AI 的推荐开头

Block 相关：

```text
[Block 名称] 需要 [新增 slot / 调整组件组合 / 修改状态同步逻辑]。
这是 Block 层修改，不是 Component 层。
如果涉及嵌套关系变化，请先说明影响范围。
改完后同步更新 block/*.md。
```

Page 相关：

```text
[页面类型] 需要 [调整 Block 组合 / 新增区块 / 修改页面结构]。
这是 Page 层修改。
如果涉及 layout_skeleton 变化，请先说明影响范围。
改完后同步更新 layout/{page_type}.md。
```

---

## 13. 验收标准

| 场景 | 验收重点 | 通过标准 |
| --- | --- | --- |
| Block-新增 | 组件嵌套关系、story 覆盖 | TSX + story 生成完成，blocks.json 已注册 |
| Block-修改 | 嵌套关系稳定、markdown 同步 | 源码和 block/*.md 同时更新 |
| Page-新增 | Block 组合、layout_skeleton 完整 | route-index + layout markdown 已更新 |
| Page-修改 | layout markdown 同步更新 | layout_skeleton 和 Page TSX 同时更新 |
| 通用 | 源码 + markdown 一致性 | 两者同步，无漂移 |
| 通用 | 质量门禁 | 三个验证命令全部通过（详见 [05-质量审核与回归验证](./05-质量审核与回归验证.md)） |

---

## 14. 相关文档

| 想了解 | 去读 |
| --- | --- |
| 如何判断需求属于哪一层 | [01-先判断应该改哪一层](./01-先判断应该改哪一层.md) |
| 改 CSS / Token 的具体做法 | [02-改 CSS 和 Token](./02-改%20CSS%20和%20Token.md) |
| 改 Component 的具体做法 | [03-改 Component](./03-改%20Component.md) |
| 如何验收修改结果 | [05-质量审核与回归验证](./05-质量审核与回归验证.md) |
| Block 抽取完整流程 | [05-抽取 Block](../../02-从%200%20构建资源接入/05-抽取%20Block.md) |
| layout markdown 模板 | [03-layout markdown 模板](../../04-参考资料/03-layout%20markdown%20模板.md) |
