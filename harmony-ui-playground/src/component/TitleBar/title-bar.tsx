import type { CSSProperties, MouseEvent, ReactNode } from "react"

import { cn } from "@/lib/utils"

import "./title-bar.css"
const defaultBackIcon =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M15 5L8 12L15 19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  )

const defaultRightIcon0 =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="1.8" fill="#000000" />
      <circle cx="12" cy="12" r="1.8" fill="#000000" />
      <circle cx="18" cy="12" r="1.8" fill="#000000" />
    </svg>`
  )

const defaultRightIcon1 =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="#000000" stroke-width="2" stroke-linecap="round" />
    </svg>`
  )

export type TitleBarProps = {
  title?: string
  subtitle?: string
  titleStyle?: CSSProperties
  subtitleStyle?: CSSProperties
  leftIcon?: string
  leftAriaLabel?: string
  onLeftClick?: (event: MouseEvent<HTMLButtonElement>) => void
  /** Up to three circular icon actions on the right (Pixso export used two). */
  rightIcons?: string[]
  onRightIconClick?: (event: MouseEvent<HTMLButtonElement>, index: number) => void
  backgroundColor?: string
  left?: ReactNode
  right?: ReactNode
  className?: string
}

export function TitleBar({
  title = "Title",
  subtitle = "Subtitle",
  titleStyle,
  subtitleStyle,
  leftIcon = defaultBackIcon,
  leftAriaLabel = "back",
  onLeftClick,
  rightIcons = [defaultRightIcon0, defaultRightIcon1],
  onRightIconClick,
  backgroundColor,
  left,
  right,
  className,
}: TitleBarProps) {
  const rootStyle: CSSProperties | undefined = backgroundColor
    ? { backgroundColor }
    : undefined

  const icons = rightIcons.slice(0, 3)
  const showLeft = Boolean(left || leftIcon)
  const showDefaultRight = !right && icons.length > 0

  return (
    <div
      className={cn("title-bar-h", className)}
      style={rootStyle}
      data-runtime-component="TitleBar"
    >
      <div className="title-bar-h__left">
        {left ? (
          left
        ) : showLeft ? (
          <button
            type="button"
            className="title-bar-h__bubble"
            onClick={onLeftClick}
            aria-label={leftAriaLabel}
          >
            <img className="title-bar-h__img" src={leftIcon} alt="" />
          </button>
        ) : null}
      </div>

      <div className="title-bar-h__center">
        <div className="title-bar-h__textblock">
          <div className="title-bar-h__title" style={titleStyle} title={title}>
            {title}
          </div>
          {subtitle ? (
            <div
              className="title-bar-h__subtitle"
              style={subtitleStyle}
              title={subtitle}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      {right ? (
        <div className="title-bar-h__right">{right}</div>
      ) : showDefaultRight ? (
        <div className="title-bar-h__right">
          {icons.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              className="title-bar-h__bubble"
              onClick={(event) => onRightIconClick?.(event, index)}
              aria-label={`action ${index + 1}`}
            >
              <img className="title-bar-h__img" src={src} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
