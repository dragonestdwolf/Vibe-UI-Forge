# 02 | route-index 模板

> `route-index.md` 用于把用户意图或 Figma 页面意图匹配到 page_type。

---

## 文件位置

```text
.resources/{system}/route-index.md
```

---

## 模板

```markdown
# Route Index

> 页面类型路由：prompt / Figma 意图 -> page_type -> layout path

## Page Types

| page_type | layout | hit_rules | exclusion_rules |
|---|---|---|---|
| mobile-settings | layout/mobile-settings.md | 设置页 / 账号设置 / 网络设置 | 健康 / 服药 / dashboard |

## Fallback

未命中上述规则时，默认使用 `mobile-settings`。

## Notes

- page_type 使用 kebab-case
- layout 路径相对于 `.resources/{system}/`
```

---

## 字段说明

| 字段 | 说明 |
|---|---|
| `page_type` | 页面类型 ID |
| `layout` | 对应 layout markdown |
| `hit_rules` | 哪些关键词或意图会命中 |
| `exclusion_rules` | 哪些关键词或意图要排除 |

---

## 审核点

- hit rules 是否覆盖常见说法
- exclusion rules 是否能避免误匹配
- layout 文件是否真实存在
- fallback 是否合理
