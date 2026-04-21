# 05 | components.json 模板

> `.resources/{system}/components.json` 注册当前资源集可用的 React 组件。

---

## 文件位置

```text
.resources/{system}/components.json
```

---

## 模板

```json
{
  "$schema": "./schemas/components.schema.json",
  "components": [
    {
      "id": "button",
      "name": "Button",
      "path": "src/component/Button",
      "export": "Button",
      "stories": "src/component/Button/Button.stories.tsx",
      "spec": ".resources/harmony/component/button.md"
    }
  ]
}
```

---

## 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | 组件稳定 ID |
| `path` | 是 | 组件源码路径 |
| `export` | 是 | 导出名称 |
| `name` | 否 | 人类可读名称 |
| `stories` | 否 | stories 文件 |
| `spec` | 否 | 补充说明文档 |

---

## 注意

这里的 `components.json` 指 `.resources/{system}/components.json`，它是资源层组件索引。

不要和项目根目录的 `components.json` 混淆。两者区别见 [项目目录说明](./07-项目目录说明.md)。
