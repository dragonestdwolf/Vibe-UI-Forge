/**
 * SettingsContextListLayout
 *
 * 设置二级页通用布局（spec：`.resources/harmony/layout/settings-context-list.md`）。
 *
 * 三段固定结构：
 *  1. HeaderSlot      —— `status-bar` 与 `title-bar` 紧贴，gap=0
 *  2. ContextSlot     —— 灵活业务卡片区（轮播 / 预览 / 容量环 / 对比图）
 *  3. ListGroupSlot   —— 多张 list 卡片纵向堆叠，卡片间距 12px（强约束）
 *  4. FooterSlot      —— 可选底部说明 / 操作
 *
 * 显隐能力：
 *  - `showContext` / `showFooter`：false 或 slot 为 "none" 时不渲染对应区域
 *  - 当 slot 为 "none" 时不保留空容器
 */

import { type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils"

import "./SettingsContextListLayout.css"

export type SettingsContextListSlot = ReactNode | "none"

export interface SettingsContextListLayoutProps {
  /** 状态栏，必填。固定置于页面顶部。 */
  statusBar: ReactNode
  /** 标题栏，必填。紧贴 status-bar 下方，二者间距固定为 0。 */
  titleBar: ReactNode

  /**
   * 业务展示卡片区。多卡时建议在内部使用横向 scroll-snap 容器。
   * 传 "none" 时不渲染该 slot；同时未传值或 showContext=false 也会跳过渲染。
   */
  context?: SettingsContextListSlot
  /** 是否渲染 ContextSlot，默认 true（前提是 context 有内容）。 */
  showContext?: boolean

  /**
   * 业务展示卡片是否需要满宽（360px）显示，例如横向轮播。
   * - `centered`（默认）：包裹在 328 主内容宽度容器中
   * - `bleed`：使用页面满宽
   */
  contextWidth?: "centered" | "bleed"

  /**
   * list 卡片组合，必填。可以是单个 List，也可以是多个 List 节点（fragment / 数组）。
   * 多张卡片之间统一 12px 垂直间距，由 layout 控制，不要在子卡片上手写 mt-*。
   */
  listGroup: ReactNode

  /** 底部说明文案 / 操作区，可选；传 "none" 或 showFooter=false 时不渲染。 */
  footer?: SettingsContextListSlot
  /** 是否渲染 FooterSlot，默认 false（除非 footer 有内容）。 */
  showFooter?: boolean

  /** 是否显示底部 home indicator，默认 true。 */
  showHomeIndicator?: boolean

  /**
   * 页面背景色。
   * - Light 模式：`#F1F3F5`（鸿蒙 comp_background_gray）
   * - Dark 模式：`#000000`（鸿蒙 comp_background_gray dark）
   * - 纯白覆盖场景可传 `#FFFFFF`
   * 默认为 `#F1F3F5`（Light 模式）。
   */
  background?: string

  /**
   * 主题标识，用于 CSS dark mode 适配（footer / home-indicator 等跟随色）。
   * - `light`：使用浅色语义 token
   * - `dark`：使用深色语义 token
   * 默认为 `light`。
   */
  theme?: "light" | "dark"

  /** 页面最小高度，默认 800px（参考移动端 360 × 800 壳层）。 */
  minHeight?: number | string

  /** 透传到根容器的额外 className。 */
  className?: string
  /** 透传到根容器的额外 style。 */
  style?: CSSProperties
}

/**
 * slot 内容视为「无」：undefined / null / false / 字面量 "none" / 空数组。
 */
function isSlotEmpty(slot: SettingsContextListSlot): boolean {
  if (slot === undefined || slot === null || slot === false) return true
  if (slot === "none") return true
  if (Array.isArray(slot) && slot.length === 0) return true
  return false
}

export function SettingsContextListLayout({
  statusBar,
  titleBar,
  context,
  showContext = true,
  contextWidth = "centered",
  listGroup,
  footer,
  showFooter = false,
  showHomeIndicator = true,
  background = "#F1F3F5",
  theme = "light",
  minHeight = 800,
  className,
  style,
}: SettingsContextListLayoutProps) {
  const renderContext =
    showContext && !isSlotEmpty(context as SettingsContextListSlot)
  const renderFooter =
    showFooter && !isSlotEmpty(footer as SettingsContextListSlot)

  const rootStyle: CSSProperties = {
    background,
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
    ...style,
  }

  return (
    <div
      className={cn("scl-layout", className)}
      style={rootStyle}
      data-layout="settings-context-list"
      data-theme={theme}
    >
      {/* HeaderSlot：StatusBar + TitleBar，gap=0（强约束，由 .scl-layout__header 保证） */}
      <header className="scl-layout__header" data-slot="header">
        {statusBar}
        {titleBar}
      </header>

      <div className="scl-layout__content">
        {/* ContextSlot：灵活业务卡片区 */}
        {renderContext ? (
          <section
            className={cn(
              "scl-layout__context",
              contextWidth === "centered"
                ? "scl-context-centered"
                : "scl-context-bleed"
            )}
            data-slot="context"
            data-context-width={contextWidth}
          >
            {context}
          </section>
        ) : null}

        {/* ListGroupSlot：list 卡片纵向堆叠，卡片间 gap=12（强约束） */}
        <section className="scl-layout__list-group" data-slot="list-group">
          {listGroup}
        </section>

        {/* FooterSlot：底部说明 / 操作（默认隐藏） */}
        {renderFooter ? (
          <section className="scl-layout__footer" data-slot="footer">
            {footer}
          </section>
        ) : null}
      </div>

      {showHomeIndicator ? (
        <div className="scl-layout__home-indicator" aria-hidden>
          <div className="scl-layout__home-indicator-bar" />
        </div>
      ) : null}
    </div>
  )
}

export default SettingsContextListLayout
