# 04 | blocks.json 模板

> `blocks.json` 注册稳定 Block 模板，供 AI 在页面生成时做源码 grounding。

---

## 文件位置

```text
.resources/{system}/blocks.json
```

---

## 模板

```json
{
  "$schema": "./schemas/blocks.schema.json",
  "blocks": [
    {
      "id": "settings-page",
      "name": "settings-page",
      "pageType": "mobile-settings",
      "description": "通用设置页",
      "files": ["src/blocks/settings-page.tsx"],
      "stories": ["src/blocks/settings-page.stories.tsx"],
      "dependencies": ["status-bar", "title-bar", "list", "list-item"]
    }
  ]
}
```

---

## 字段说明

| 字段 | 说明 |
|---|---|
| `id` | Block 稳定 ID |
| `pageType` | 所属页面类型 |
| `description` | Block 语义说明 |
| `files` | Block 源码文件 |
| `stories` | Block stories |
| `dependencies` | 依赖组件 ID |

---

## 禁止事项

不要把以下路径注册为 reference block：

```text
src/render/**
**/src/render/**
```

`src/render/**` 是生成结果，不是稳定模板源。
