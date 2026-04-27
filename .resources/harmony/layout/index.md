# Layout Index

> 布局索引：page_type -> layout markdown

## Available Layouts

| page_type | layout file | description |
|-----------|-------------|-------------|
| mobile-settings | mobile-settings.md | 喝水设置页面 - 设置项列表与开关控制 |
| health-dashboard | health-dashboard.md | 健康任务进度页 - 三叶草展示 |
| mobile-sheet | mobile-sheet.md | 服药提醒半模态页 - 浮层卡片列表 |
| settings-context-list | settings-context-list.md | 情景模式 / 显示与亮度 / 云空间 / 智慧多窗 - 顶部业务卡片（轮播/预览/容量环）+ 下方 list 卡片组合 |

## Page Templates

| template | layout family | template file | source block | description |
|----------|---------------|---------------|--------------|-------------|
| settings-page | mobile-settings | settings-page.md | src/blocks/settings-page.tsx | 通用系统设置页模板，多组设置卡片 |
| scenario-mode-page | settings-context-list | settings-context-list.md | src/render/scenario-mode-page-v5 | 情景模式设置页，顶部轮播卡片 + 下方 list 卡片 |

## Layout Structure

每个 layout markdown 必须包含：

- `hit_rules` - 命中规则
- `exclusion_rules` - 排除规则
- `reference_blocks` - 参考区块
- `layout_skeleton` - 布局骨架
- `needed_components` - 需要的组件
- `composition_mapping` - 组合映射
- `generation_constraints` - 生成约束
- `validation_notes` - 验证笔记