# Spec: mession-card

[Metadata]
- **Component**: `harmony-mession-card`
- **中文名称**: 任务卡
- **Template Source**: `spec/4.template/mession-card-tem.html`
- **Benchmark Source**: `HistoryRender/Component/mession-card/benchmark.html`
- **MCP Source**: section `3195:4124`

## 1. Content Presentation (内容呈现格式)
- `mession-card` 是同一视觉骨架下的任务卡片族系，统一为「左信息区 + 右控制区」。
- 左信息区固定为 `32x32` icon、`16` gap、两行文本堆栈。
- 右控制区允许展示状态胶囊或行动按钮，始终保持单行、不被左侧长标题挤压。
- 代表变体分为三类：
  - `timing-delta`: 时间偏差型，代表 `规律起床`。
  - `metric-status`: 指标完成型，代表 `锻炼时长`、`呼吸训练-压力`。
  - `metric-action`: 指标行动型，代表 `步数`、`喝水`、`饮食记录`、`正念冥想`、`规律就寝`、`血压测量`、`服药提醒`、`体重测量`。

### 1.1 Variant Summary
- `timing-delta`
  - 第一行：`primaryValue + qualifier + targetValue`
  - 第二行：`title`
  - 右侧：状态胶囊，常见文案 `已完成`
- `metric-status`
  - 第一行：`primaryValue + qualifier + targetValue` 或 `primaryValue + targetValue`
  - 第二行：`title`，可选 `streakLabel`
  - 右侧：状态胶囊，常见文案 `已完成|待完成|未完成`
- `metric-action`
  - 第一行：`primaryValue + targetValue`
  - 第二行：`title`
  - 右侧：CTA pill，常见文案 `去记录|去查看|去服药|去冥想|去睡觉`

### 1.2 Base Structure
```html
<div class="harmony-mession-card harmony-mession-card-variant-{{variant}} harmony-mession-card-{{state}}">
  <div class="harmony-mession-card-left">
    <div class="harmony-mession-card-icon">{{icon}}</div>
    <div class="harmony-mession-card-content">
      <div class="harmony-mession-card-value-row">
        <span class="harmony-mession-card-primary">{{primaryValue}}</span>
        <span class="harmony-mession-card-qualifier">{{qualifier}}</span>
        <span class="harmony-mession-card-target">{{targetValue}}</span>
      </div>
      <div class="harmony-mession-card-title-row">
        <span class="harmony-mession-card-title">{{title}}</span>
        <span class="harmony-mession-card-streak">{{streakLabel}}</span>
      </div>
    </div>
  </div>
  <div class="harmony-mession-card-right">
    <span class="harmony-mession-card-status">{{statusLabel}}</span>
    <button type="button" class="harmony-mession-card-action">{{actionLabel}}</button>
  </div>
</div>
```

### 1.3 Representative Node Mapping
- `3195:3310`: 锻炼时长
- `3195:3309`: 呼吸训练-压力
- `3195:3308`: 步数
- `3195:3312`: 喝水
- `3195:3311`: 饮食记录
- `3195:3317`: 正念冥想
- `3195:3316`: 规律就寝
- `3195:3315`: 任务方案一 / 血压测量
- `3195:3314`: 任务方案一 / 服药提醒
- `3195:3313`: 任务方案一 / 体重测量
- 旧 timing sample：target `3195:700`，用于 `规律起床` 的偏早 / 偏晚 / 准点矩阵。

## 2. Interaction States (交互状态)
- 交互态：`default / hover / pressed / focus`
- 业务内容按变体组织，不在 spec 中定义业务逻辑，只定义视觉命名与显示关系。
- 视觉语义约定：
  - `qualifier=偏早|偏晚` 使用提醒色
  - `qualifier=正常` 使用青绿色
  - `qualifier=准点` 使用中性文本色
  - `statusLabel=已完成` 使用橙色状态胶囊
  - `statusLabel=待完成|未完成` 使用中性状态胶囊
  - `actionLabel=*` 使用中性 CTA pill

## 3. Dynamic Response (动态响应)
- **Layout Stability**: 卡片外框始终保持 `328x72`，左右布局不因文案长度变化而改变高度。
- **Value Row Compaction**: `qualifier` 为空时第一行自动收拢，不保留空白占位。
- **Placeholder Number**: `primaryValue="--"` 视为视觉占位，沿用主值字重与行高，不因占位内容降级样式。
- **Title Overflow**: `title` 默认单行省略，`targetValue`、`statusLabel`、`actionLabel` 优先保留完整。
- **Right Control Guard**: 右侧按钮与状态胶囊不得换行、拉伸或改变圆角。
- **No Stretch Guard**: icon、胶囊底板、连续天数标签必须保持源比例与圆角规格。
- **Optional Streak**: `streakLabel` 仅在 `metric-status` 中出现；为空时第二行回归单标题布局。

## 4. Template Injection (模版注入)
- `{{variant}}`: `timing-delta|metric-status|metric-action`
- `{{state}}`: `default|hover|pressed|focus`
- `{{icon}}`
- `{{primaryValue}}`
- `{{qualifier}}`
- `{{targetValue}}`
- `{{title}}`
- `{{statusLabel}}`
- `{{actionLabel}}`
- `{{streakLabel}}`

### 4.1 Example Mapping
- `timing-delta`
  - `primaryValue=09:30`
  - `qualifier=偏晚`
  - `targetValue=/08:00`
  - `title=规律起床`
  - `statusLabel=已完成`
- `metric-status`
  - `primaryValue=51`
  - `qualifier=正常`
  - `targetValue=/<60`
  - `title=压力均值`
  - `statusLabel=已完成`
- `metric-action`
  - `primaryValue=0`
  - `targetValue=/3 次`
  - `title=饮食记录`
  - `actionLabel=去记录`

### 4.2 Numeric Baseline (Pixso MCP 归一值)
- 共用骨架
  - 卡片：`328x72`
  - 圆角：`20`
  - 左起内边距：`12`
  - 左簇 gap：`16`
  - icon：`32x32`
  - 文本堆栈高度：`39`
  - 两行间距：`2`
- 字体层级
  - `primaryValue`: `16 / 700 / 19`
  - `targetValue`: `12 / 400 / 16`
  - `title`: `12 / 400 / 16`
  - `qualifier`: `12 / 500 / 16`
  - `streakLabel`: `10 / 400 / 14`
- 行内组合参考
  - `锻炼时长`: 左信息区约 `114x39`，主值与目标值组合宽约 `66`
  - `呼吸训练-压力`: 左信息区约 `122x39`，主值 / 限定词 / 目标值组合宽约 `74`
  - `步数|喝水`: 左信息区约 `108x39`
  - `饮食记录|正念冥想|任务方案一`: 左信息区约 `96x39`
  - `规律就寝`: 左信息区约 `99x39`
- 连续天数胶囊
  - 基线约 `55x16`
  - 圆角：`20`
  - 橙色底板 alpha 约 `0.1`
- 右侧胶囊 / 按钮
  - 高度：`28`
  - 圆角：`14`
  - 水平 padding：`8`
  - 宽度：随文案自适应，三字中文基线约 `72`
  - `已完成`: 橙色文字 + 橙色浅底
  - `去记录|去查看|去服药|去冥想|去睡觉|待完成|未完成`: 中性深字 + 浅灰底

## 5. Audit Checklist
- [ ] 仅描述视觉表现，不包含业务逻辑。
- [ ] 三类变体与 benchmark 命名一致。
- [ ] 所有 Pixso 代表卡均能映射到模板字段，无孤儿样式。
- [ ] 右侧 pill 不被左侧标题挤压换行。
- [ ] 图标、按钮与连续天数胶囊无拉伸。
- [ ] 与 `spec/4.template/mession-card-tem.html` 的变量契约一致。
