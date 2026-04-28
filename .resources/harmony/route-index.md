# Route Index

> 页面类型路由：prompt / Figma 意图 -> page_type -> layout path

## Page Types

| page_type | layout | hit_rules | exclusion_rules |
|-----------|--------|-----------|-----------------|
| mobile-settings | layout/mobile-settings.md | "喝水设置" / "water settings" / "设置页" | "显示与亮度" / "情景模式" / "云空间" / "智慧多窗" |
| settings-context-list | layout/settings-context-list.md | "显示与亮度" / "情景模式" / "云空间" / "智慧多窗" | |

## Fallback

> 未命中上述规则时，默认使用 `mobile-settings`

## Active Notes

- `health-dashboard` 与 `mobile-sheet` 的历史 block 已停用，不再作为 active page_type 参与工作流路由

## Notes

- page_type 使用 kebab-case
- layout 路径相对于 `.resources/harmony/`
