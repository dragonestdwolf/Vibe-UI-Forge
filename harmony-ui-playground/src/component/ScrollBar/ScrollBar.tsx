import type { CSSProperties } from "react"

import "./ScrollBar.css"

export type ScrollBarState = "normal" | "press"

export interface ScrollBarProps {
  state?: ScrollBarState
  className?: string
  style?: CSSProperties
}

/**
 * Pixso node: 3297:7 (状态=normal), 3297:9 (状态=press)
 * Container: 32x80
 * - normal thumb: width 4, right offset 4, radius 16, opacity 0.4
 * - press thumb:  width 8, right offset 4, radius 16, opacity 0.4
 */
export function ScrollBar({
  state = "normal",
  className,
  style,
}: ScrollBarProps) {
  const nextClassName = [
    "my-scrollbar",
    state === "press" ? "my-scrollbar--press" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={nextClassName} style={style} aria-label={`scrollbar-${state}`}>
      <span className="my-scrollbar__thumb" aria-hidden="true" />
    </div>
  )
}

export default ScrollBar
