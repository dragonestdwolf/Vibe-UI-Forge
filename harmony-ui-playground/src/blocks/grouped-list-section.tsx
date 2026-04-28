"use client"

import { type HTMLAttributes, type ReactNode } from "react"

import { SubHeader, type SubHeaderProps } from "@/component/SubHeader"
import { cn } from "@/lib/utils"

import "./grouped-list-section.css"

type GroupedListSectionTheme = "light" | "dark"

function hasRenderableContent(value: ReactNode) {
  if (value === null || value === undefined || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  return true
}

export interface GroupedListSectionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  children: ReactNode
  subtitle?: ReactNode
  footnote?: ReactNode
  theme?: GroupedListSectionTheme
  bodyClassName?: string
  subtitleProps?: Omit<SubHeaderProps, "leftMode" | "rightMode" | "text">
}

export function GroupedListSection({
  children,
  subtitle,
  footnote,
  theme = "light",
  bodyClassName,
  subtitleProps,
  className,
  ...rest
}: GroupedListSectionProps) {
  const hasSubtitle = hasRenderableContent(subtitle)
  const hasFootnote = hasRenderableContent(footnote)

  const {
    className: subtitleClassName,
    ...restSubtitleProps
  } = subtitleProps ?? {}

  return (
    <section
      {...rest}
      className={cn("grouped-list-section", className)}
      data-theme={theme}
      data-block="grouped-list-section"
    >
      {hasSubtitle ? (
        typeof subtitle === "string" || typeof subtitle === "number" ? (
          <SubHeader
            {...restSubtitleProps}
            text={String(subtitle)}
            leftMode="text"
            rightMode="none"
            className={cn(
              "grouped-list-section__header",
              "my-subheader--text-none",
              subtitleClassName
            )}
          />
        ) : (
          <div className="grouped-list-section__header">{subtitle}</div>
        )
      ) : null}

      <div className={cn("grouped-list-section__body", bodyClassName)}>{children}</div>

      {hasFootnote ? (
        typeof footnote === "string" || typeof footnote === "number" ? (
          <p className="grouped-list-section__footnote footnote-text">
            {footnote}
          </p>
        ) : (
          <div className="grouped-list-section__footnote">{footnote}</div>
        )
      ) : null}
    </section>
  )
}

export default GroupedListSection
