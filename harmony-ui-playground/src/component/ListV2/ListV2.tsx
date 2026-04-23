import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import "./ListV2.css"

// ============================================================
// Types
// ============================================================

/**
 * 行高规格（对应 spec §4.1 高度矩阵）
 * - single     : 1 行 Medium 48px
 * - single-lg  : 1 行 Large  56px
 * - single-xl  : 1 行 XL     64px
 * - double     : 2 行 Medium 64px
 * - double-lg  : 2 行 Large  72px
 * - triple     : 3 行 Medium 96px
 * - avatar     : Avatar leading 40px, 56px 行高
 * - appicon    : AppIcon leading 48px, 64px 行高
 */
export type ListV2ItemType =
  | "single"
  | "single-lg"
  | "single-xl"
  | "double"
  | "double-lg"
  | "triple"
  | "avatar"
  | "appicon"

/**
 * 交互状态（对应 spec §2 + benchmark 状态矩阵）
 */
export type ListV2ItemState =
  | "default"
  | "hover"
  | "pressed"
  | "focus"
  | "selected"
  | "disabled"

/**
 * Trailing extra 类型快捷值
 * - arrow : 右侧 › 箭头（默认，rgba(0,0,0,0.20)）
 * - dot   : 右侧圆点指示（#46b1e3）
 * - none  : 不渲染 extra
 */
export type ListV2TrailingExtraType = "arrow" | "dot" | "none"

// ============================================================
// CVA — itemType × itemState
// ============================================================

const listV2ItemVariants = cva("my-list-item", {
  variants: {
    /** 行高 + leading 布局规格 */
    itemType: {
      single: "my-list-item--single",
      "single-lg": "my-list-item--single-lg",
      "single-xl": "my-list-item--single-xl",
      double: "my-list-item--double",
      "double-lg": "my-list-item--double-lg",
      triple: "my-list-item--triple",
      avatar: "my-list-item--avatar",
      appicon: "my-list-item--appicon",
    },
    /** 视觉交互状态 */
    itemState: {
      default: "",
      hover: "is-hover",
      pressed: "is-pressed",
      focus: "is-focus",
      selected: "is-selected",
      disabled: "is-disabled",
    },
  },
  defaultVariants: {
    itemType: "single",
    itemState: "default",
  },
})

// ============================================================
// ListV2 Container
// ============================================================

export interface ListV2Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/**
 * ListV2 — list group card 外层容器
 *
 * 328px 宽，border-radius 14px，overflow hidden，
 * 内部 list item 自动叠加分隔线（最后一行无下边框）。
 */
export function ListV2({ className, children, ...props }: ListV2Props) {
  return (
    <div className={cn("my-list", className)} {...props}>
      {children}
    </div>
  )
}

ListV2.displayName = "ListV2"

// ============================================================
// ListV2Item Props
// ============================================================

export interface ListV2ItemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof listV2ItemVariants> {
  // ── 主要内容 ──────────────────────────────────────────────
  /** 主标题（必填） */
  title: string

  /**
   * 副标题
   * - string   : 单行副标题（double/avatar/appicon）
   * - string[] : 多行副标题（triple 传 2 个）
   */
  subtitle?: string | string[]

  // ── Trailing Rail ────────────────────────────────────────
  /** 右侧辅助文字 */
  trailingText?: string

  /**
   * 右侧 extra 元素
   * - "arrow"（默认）: › 箭头图标
   * - "dot"          : 圆点状态指示器（蓝色）
   * - "none"         : 不渲染
   * - ReactNode      : 自定义内容
   */
  trailingExtra?: ListV2TrailingExtraType | React.ReactNode

  // ── Leading Rail ─────────────────────────────────────────
  /**
   * 自定义 leading 内容（传入即覆盖 leadingType 预设）
   * 适合渲染 Icon、Switch、Checkbox 等
   */
  leading?: React.ReactNode

  /**
   * leading 预设类型
   * - "avatar"  : 40×40 圆角 10 头像容器
   * - "appicon" : 48×48 圆角 12 应用图标容器
   * 配合 leadingContent 填充内容
   */
  leadingType?: "avatar" | "appicon"

  /** avatar / appicon 容器内部内容（图片、图标等） */
  leadingContent?: React.ReactNode

  /**
   * leading 与 content rail 之间的间距
   * - "g8"  : 8px（badge/icon 类 leading）
   * - "g16" : 16px（avatar/appicon 类 leading，默认）
   */
  leadingGap?: "g8" | "g16"

  // ── 状态 ────────────────────────────────────────────────
  /**
   * 显式覆盖视觉状态（Storybook / 测试用）
   * 不传则由 selected / disabled prop 自动计算
   */
  state?: ListV2ItemState

  /** selected 状态快捷 prop */
  selected?: boolean

  /** disabled 状态，同时将元素 disabled */
  disabled?: boolean

  // ── 渲染模式 ─────────────────────────────────────────────
  /**
   * 是否渲染为 `<button>`
   * 当 onClick 存在时自动为 true；否则渲染为 `<div>`
   */
  interactive?: boolean
}

// ============================================================
// 内置图标
// ============================================================

function ArrowIcon() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
      <path
        d="M1 1L6 6L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ============================================================
// ListV2Item
// ============================================================

/**
 * ListV2Item — 列表行组件
 *
 * 横向结构：[leading rail] + [content rail = copy + trailing]
 * 对应 spec §1 轨道语义 + benchmark 全部行类型。
 */
export const ListV2Item = React.forwardRef<HTMLElement, ListV2ItemProps>(
  function ListV2Item(
    {
      itemType = "single",
      title,
      subtitle,
      trailingText,
      trailingExtra = "arrow",
      leading,
      leadingType,
      leadingContent,
      leadingGap = "g16",
      state: stateProp,
      selected = false,
      disabled = false,
      interactive,
      className,
      onClick,
      ...rest
    },
    ref
  ) {
    // --------------------------------------------------
    // 计算有效状态
    // --------------------------------------------------
    const effectiveState: ListV2ItemState =
      stateProp ?? (disabled ? "disabled" : selected ? "selected" : "default")

    const rootClass = cn(
      listV2ItemVariants({ itemType, itemState: effectiveState }),
      className
    )

    // --------------------------------------------------
    // subtitle 归一化为数组
    // --------------------------------------------------
    const subtitles = Array.isArray(subtitle)
      ? subtitle
      : subtitle
      ? [subtitle]
      : []

    // --------------------------------------------------
    // Leading 渲染
    // --------------------------------------------------
    const leadingNode = (() => {
      if (!leading && !leadingType) return null
      const gapClass = `my-list-item__leading--${leadingGap}`
      if (leading) {
        return (
          <span className={cn("my-list-item__leading", gapClass)}>
            {leading}
          </span>
        )
      }
      if (leadingType === "avatar") {
        return (
          <span className={cn("my-list-item__leading", gapClass)}>
            <span className="my-list-item__avatar">{leadingContent}</span>
          </span>
        )
      }
      if (leadingType === "appicon") {
        return (
          <span className={cn("my-list-item__leading", gapClass)}>
            <span className="my-list-item__appicon">{leadingContent}</span>
          </span>
        )
      }
      return null
    })()

    // --------------------------------------------------
    // Trailing extra 渲染
    // --------------------------------------------------
    const trailingExtraNode = (() => {
      if (!trailingExtra || trailingExtra === "none") return null
      if (trailingExtra === "arrow") {
        return (
          <span className="my-list-item__arrow" aria-hidden="true">
            <ArrowIcon />
          </span>
        )
      }
      if (trailingExtra === "dot") {
        return <span className="my-list-item__dot" aria-hidden="true" />
      }
      // ReactNode
      return (
        <span className="my-list-item__trailing-custom" aria-hidden="true">
          {trailingExtra as React.ReactNode}
        </span>
      )
    })()

    const hasTrailing = !!(trailingText || (trailingExtra && trailingExtra !== "none"))

    // --------------------------------------------------
    // Content
    // --------------------------------------------------
    const content = (
      <>
        {leadingNode}
        {/* content rail = copy + trailing */}
        <div className="my-list-item__main">
          <div className="my-list-item__copy">
            <p className="my-list-item__title">{title}</p>
            {subtitles.map((sub, i) => (
              <p key={i} className="my-list-item__subtitle">
                {sub}
              </p>
            ))}
          </div>
          {hasTrailing && (
            <div className="my-list-item__trailing">
              {trailingText && (
                <span className="my-list-item__trailing-text">{trailingText}</span>
              )}
              {trailingExtraNode}
            </div>
          )}
        </div>
      </>
    )

    // --------------------------------------------------
    // 多态渲染：button（交互式）或 div（纯展示）
    // --------------------------------------------------
    const isInteractive = interactive ?? !!onClick

    if (isInteractive) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={rootClass}
          disabled={disabled}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      )
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={rootClass}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {content}
      </div>
    )
  }
)

ListV2Item.displayName = "ListV2Item"

// ============================================================
// Exports
// ============================================================

export { listV2ItemVariants }
export default ListV2
