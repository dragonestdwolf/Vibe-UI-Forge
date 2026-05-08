阶段1：定义评分标准
产出：reference.md
阶段2：组件渲染 + 样式采集 + 可选截图
产出：1.组件全状态样式 JSON（width/height/padding/margin/line-height/font-size/color...）2.组件全状态截图
阶段3：视觉 diff + 样式 diff
产出：自动发现尺寸/行高/间距偏差
阶段4：评分与报告
产出：report.md（总分、分项、问题、修复建议）
阶段5：封装为 skill（SKILL.md + scripts 调用）
产出：一句命令/一句提示触发完整检查