# Mobile Scale Tokens

## 0. Purpose
- `mobile-scale` 是面向 `360x792` 手机竖屏主场景的页面节奏 token 层。
- 它用于约束页面编排、片段编排和无明确 MCP 真值区域的尺寸选择，避免移动端页面出现系统性放大。
- 它**不替代**组件 spec 中的 `Numeric Baseline`，也**不覆盖**组件私有几何。

## 1. Priority
实现时按以下顺序取值：
1. 组件 `Numeric Baseline`
2. page fragment spec
3. `mobile-scale` token
4. 页面级临时值

约束：
- 页面级临时值只允许在前三者都没有覆盖时出现。
- 页面级临时值若出现，必须吸附到最接近的 `mobile-scale` 档位。
- 页面增强层文字、容器和主视觉几何不得超过对应组件基线的 `1.15x`。

## 2. Spacing Scale
| Token | Value |
| --- | --- |
| `--harmony-space-2` | `2px` |
| `--harmony-space-4` | `4px` |
| `--harmony-space-6` | `6px` |
| `--harmony-space-8` | `8px` |
| `--harmony-space-10` | `10px` |
| `--harmony-space-12` | `12px` |
| `--harmony-space-14` | `14px` |
| `--harmony-space-16` | `16px` |
| `--harmony-space-18` | `18px` |
| `--harmony-space-20` | `20px` |
| `--harmony-space-24` | `24px` |
| `--harmony-space-28` | `28px` |
| `--harmony-space-32` | `32px` |

## 3. Radius Scale
| Token | Value |
| --- | --- |
| `--harmony-radius-4` | `4px` |
| `--harmony-radius-8` | `8px` |
| `--harmony-radius-12` | `12px` |
| `--harmony-radius-14` | `14px` |
| `--harmony-radius-16` | `16px` |
| `--harmony-radius-18` | `18px` |
| `--harmony-radius-20` | `20px` |
| `--harmony-radius-24` | `24px` |
| `--harmony-radius-32` | `32px` |

## 4. Control Heights
| Token | Value |
| --- | --- |
| `--harmony-control-height-28` | `28px` |
| `--harmony-control-height-36` | `36px` |
| `--harmony-control-height-40` | `40px` |
| `--harmony-control-height-56` | `56px` |
| `--harmony-control-height-64` | `64px` |
| `--harmony-control-height-72` | `72px` |

## 5. Mobile Layout Aliases
| Alias Token | Value | Recommended Usage |
| --- | --- | --- |
| `--harmony-page-padding-mobile` | `16px` | 页面左右边距 |
| `--harmony-page-content-width-mobile` | `328px` | `360px` 画布默认内容宽 |
| `--harmony-card-gap-mobile` | `12px` | 卡片之间堆叠间距 |
| `--harmony-section-gap-mobile` | `16px` | 区块之间堆叠间距 |
| `--harmony-inline-gap-tight-mobile` | `4px` | 值与箭头、微型标签间距 |
| `--harmony-inline-gap-mobile` | `12px` | 行内 icon 与文本基础间距 |
| `--harmony-inline-gap-loose-mobile` | `16px` | 行内 icon 与文本宽松间距 |

## 6. Usage Guidance
- 页面级 `padding / gap / margin / radius / height` 默认必须来自 `mobile-scale`。
- 当页面没有明确 fragment spec 时，优先使用 alias token，而不是自由拼装 spacing token。
- 片段 spec 可以引用 `mobile-scale` 作为默认值，并在有 Pixso 真值时覆盖。
- 组件模板只有在“明显属于通用页面节奏”的值上才逐步改用 `mobile-scale`；组件私有 MCP 真值保留。

## 7. Non-goals
- 不负责平板、横屏、折叠屏的节奏系统。
- 不负责具体业务组件的字段契约。
- 不直接定义字体等级；它只负责尺寸、间距、圆角和控制高度。
