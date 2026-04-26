import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react"

import { cn } from "@/lib/utils"

import "./PixsoListRowMedium.css"

/**
 * Pixso `3252:489` — List row「行数=1, 尺寸=Medium」
 * Design: https://pixso.cn/app/design/OPXcaxT2Rj_9QE_M8xckbw?item-id=3252:489
 *
 * `design_to_code` 结构：左文案 + 右文案 + 下向 chevron；导出 CSS 因批次过期未拉取，
 * 视觉与尺寸按 `get_image` 对照 + 与现有 `ListItem` token 对齐实现。
 */
export interface PixsoListRowMediumProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  title?: ReactNode
  rightText?: ReactNode
  showChevron?: boolean
  onClick?: (
    event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>
  ) => void
}

function ChevronDownIcon() {
  return (
    <svg
      className="pixso-list-row-medium__chevron"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 4.25L6 7.75L9.5 4.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PixsoListRowMedium({
  title = "Single list",
  rightText = "Right text",
  showChevron = true,
  className,
  onClick,
  role,
  tabIndex,
  onKeyDown,
  ...rest
}: PixsoListRowMediumProps) {
  const interactive = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !interactive) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick?.(event)
    }
  }

  return (
    <div
      {...rest}
      className={cn("pixso-list-row-medium", className)}
      data-runtime-component="PixsoListRowMedium"
      role={role ?? (interactive ? "button" : undefined)}
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
      onClick={(e) => interactive && onClick?.(e)}
      onKeyDown={handleKeyDown}
    >
      <div className="pixso-list-row-medium__left">{title}</div>
      <div className="pixso-list-row-medium__right">
        {rightText != null && rightText !== "" ? (
          <span className="pixso-list-row-medium__right-text">{rightText}</span>
        ) : null}
        {showChevron ? <ChevronDownIcon /> : null}
      </div>
    </div>
  )
}

export default PixsoListRowMedium
