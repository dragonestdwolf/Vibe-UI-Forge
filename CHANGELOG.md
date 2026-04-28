# CHANGELOG

> Design System Skill Wiki 变更记录。

---

## 版本历史

### v0.2.0 — 2026-04-28

**新增**

- 新增 `grouped-list-section` block，支持可选 subtitle 和辅助文本
- 将 `SettingsPage`、`WaterSetting` 收敛到 `pages` 目录，作为真值参考实现
- 补齐对应 Harmony 资源索引与页面说明

**修复**

- 修复多处 render/story 对组件字段的错误引用，恢复构建可用性
- 将 `App.tsx` 恢复为更稳定的 `SettingsPage` 入口
- 通过 `harmony-ui-playground` 的 `build` 与 `build-storybook` 校验

**移除**

- 删除效果不佳或错误归档的 `HealthClover`、`Medication` 相关 block 与资源
- 删除错误的 `component/SettingsPage` 资源目录
- 清理历史 Playwright 页面快照与预览 PNG 产物

### v0.1.0 — 2026-04-20

**新增**

- 初始 Wiki 框架
- 目录结构搭建
- 所有文档占位符创建

---

> 本文件记录 Wiki 文档的所有变更。
