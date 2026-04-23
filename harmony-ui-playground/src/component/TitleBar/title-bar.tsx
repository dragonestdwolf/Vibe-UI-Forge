import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import "./title-bar.css"

const titleBarVariants = cva("title-bar", {
  variants: {
    variant: {
      normal: "title-bar--normal",
      secondary: "title-bar--secondary",
      drawer: "title-bar--drawer",
      large: "title-bar--large",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
})

function ChevronBackIcon() {
  return (
    <svg
      className="title-bar__icon-svg"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15.5 5L8.5 12L15.5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg
      className="title-bar__icon-svg"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export type TitleBarVariant = "normal" | "secondary" | "drawer" | "large"

export type TitleBarIconAction = {
  icon: React.ReactNode
  label?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export interface TitleBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof titleBarVariants> {
  title?: string
  subtitle?: string
  /** Custom left slot — overrides the built-in back/hamburger button */
  left?: React.ReactNode
  /** Called when the back button is clicked (secondary variant) */
  onBack?: React.MouseEventHandler<HTMLButtonElement>
  /** Called when the hamburger button is clicked (drawer variant) */
  onMenuOpen?: React.MouseEventHandler<HTMLButtonElement>
  /** Custom right slot — overrides the built-in actions area */
  right?: React.ReactNode
  /** Icon action buttons in the right area (max 3, ignored when actionText is set) */
  actions?: TitleBarIconAction[]
  /** Right text button label — takes priority over actions */
  actionText?: string
  /** Called when the right text button is clicked */
  onActionText?: React.MouseEventHandler<HTMLButtonElement>
  /** Replaces the title/subtitle block in the center (e.g. Avatar) */
  avatar?: React.ReactNode
}

export const TitleBar = React.forwardRef<HTMLDivElement, TitleBarProps>(
  function TitleBar(
    {
      variant = "normal",
      title = "Title",
      subtitle,
      left,
      onBack,
      onMenuOpen,
      right,
      actions,
      actionText,
      onActionText,
      avatar,
      className,
      ...props
    },
    ref
  ) {
    const cappedActions = actions?.slice(0, 3) ?? []
    const showTextAction = Boolean(actionText)
    const showIconActions = !showTextAction && cappedActions.length > 0
    const rightItemsGapClass =
      variant === "secondary" || variant === "drawer"
        ? "title-bar__items--gap10"
        : ""

    const rightSection =
      right !== undefined ? (
        right
      ) : showTextAction || showIconActions ? (
        <div className={cn("title-bar__items", rightItemsGapClass)}>
          {showTextAction && (
            <button
              type="button"
              className="title-bar__text-btn"
              onClick={onActionText}
              aria-label={actionText}
            >
              {actionText}
            </button>
          )}
          {showIconActions &&
            cappedActions.map((action, i) => (
              <button
                key={action.label ?? i}
                type="button"
                className="title-bar__bubble"
                onClick={action.onClick}
                aria-label={action.label ?? `action ${i + 1}`}
              >
                {action.icon}
              </button>
            ))}
        </div>
      ) : null

    if (variant === "large") {
      return (
        <div
          ref={ref}
          {...props}
          className={cn(titleBarVariants({ variant }), className)}
          data-runtime-component="TitleBar"
        >
          <div className="title-bar__large-actions">
            {right !== undefined ? (
              right
            ) : showTextAction || showIconActions ? (
              <>
                {showTextAction && (
                  <button
                    type="button"
                    className="title-bar__text-btn"
                    onClick={onActionText}
                    aria-label={actionText}
                  >
                    {actionText}
                  </button>
                )}
                {showIconActions &&
                  cappedActions.map((action, i) => (
                    <button
                      key={action.label ?? i}
                      type="button"
                      className="title-bar__bubble"
                      onClick={action.onClick}
                      aria-label={action.label ?? `action ${i + 1}`}
                    >
                      {action.icon}
                    </button>
                  ))}
              </>
            ) : null}
          </div>
          <div className="title-bar__large-title-area">
            <span className="title-bar__title" title={title}>
              {title}
            </span>
            {subtitle && (
              <span className="title-bar__subtitle" title={subtitle}>
                {subtitle}
              </span>
            )}
          </div>
        </div>
      )
    }

    const leftSection =
      left !== undefined ? (
        left
      ) : variant === "secondary" ? (
        <button
          type="button"
          className="title-bar__bubble"
          onClick={onBack}
          aria-label="返回"
        >
          <ChevronBackIcon />
        </button>
      ) : variant === "drawer" ? (
        <button
          type="button"
          className="title-bar__bubble"
          onClick={onMenuOpen}
          aria-label="导航菜单"
        >
          <HamburgerIcon />
        </button>
      ) : null

    return (
      <div
        ref={ref}
        {...props}
        className={cn(titleBarVariants({ variant }), className)}
        data-runtime-component="TitleBar"
      >
        {leftSection}
        <div className="title-bar__center">
          {avatar ? (
            <div className="title-bar__avatar-wrap">{avatar}</div>
          ) : (
            <div className="title-bar__textblock">
              <span className="title-bar__title" title={title}>
                {title}
              </span>
              {subtitle && (
                <span className="title-bar__subtitle" title={subtitle}>
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>
        {rightSection}
      </div>
    )
  }
)

TitleBar.displayName = "TitleBar"
