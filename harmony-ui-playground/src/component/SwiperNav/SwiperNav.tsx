import * as React from "react"

import { cn } from "@/lib/utils"

import "./SwiperNav.css"

/**
 * SwiperNav — Pixso 节点 `3288:4526`「4.Swiper - 导航点」
 * Design: https://pixso.cn/app/design/OPXcaxT2Rj_9QE_M8xckbw?item-id=3288:4526
 *
 * 关键量化结论（来自 DSL + 截图）：
 * - 外层：360×32，居中对齐
 * - Dot ON：2/4/6/12/6/4/2，gap=8，active=#0A59F7，inactive=rgba(0,0,0,0.098)
 * - Dot OFF：6/6/12/6/6，gap=8
 * - Number：14px / 16px Regular，color=rgba(0,0,0,0.898)
 * - Progress：5 段，height=2，side padding=16，gap=4，active=#fff，inactive=rgba(0,0,0,0.2)
 */
export type SwiperNavVariant = "dots" | "number" | "progress"

export interface SwiperNavProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 导航形态：点状 / 数字 / 进度条 */
  variant?: SwiperNavVariant
  /** 总页数；number/progress 直接使用，dots 可用于自定义圆点数量 */
  total?: number
  /** 当前页，从 1 开始 */
  current?: number
  /** 点状导航是否显示两侧 2px/4px 边缘点，对应 Pixso 的 Multi Dot=ON */
  showEdgeDots?: boolean
  /** 自定义点数量；不传时使用 Pixso ON/OFF 固定序列 */
  dotsCount?: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function toPositiveInteger(value: number | undefined, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback
  return Math.max(1, Math.floor(value))
}

function buildPixsoDotSizes(showEdgeDots: boolean) {
  return showEdgeDots ? [2, 4, 6, 12, 6, 4, 2] : [6, 6, 12, 6, 6]
}

function DotNav({
  total,
  current,
  dotsCount,
  showEdgeDots,
}: Pick<SwiperNavProps, "total" | "current" | "dotsCount" | "showEdgeDots">) {
  const useCustomCount = typeof dotsCount === "number" && dotsCount > 0
  const safeTotal = toPositiveInteger(dotsCount ?? total, showEdgeDots ? 7 : 5)
  const activeIndex = clamp(
    toPositiveInteger(current, Math.ceil(safeTotal / 2)) - 1,
    0,
    safeTotal - 1
  )
  const sizeList = useCustomCount
    ? Array.from({ length: safeTotal }, (_, index) =>
        index === activeIndex ? 12 : 6
      )
    : buildPixsoDotSizes(Boolean(showEdgeDots))

  return (
    <div className="my-swiper-nav__dots" aria-hidden="true">
      {sizeList.map((size, index) => {
        const isActive = size === 12

        return (
          <span
            key={`${index}-${size}`}
            className={cn("my-swiper-nav__dot", {
              "my-swiper-nav__dot--active": isActive,
            })}
            style={
              {
                "--swiper-dot-width": `${size}px`,
                "--swiper-dot-height": isActive ? "6px" : `${size}px`,
              } as React.CSSProperties
            }
          />
        )
      })}
    </div>
  )
}

function NumberNav({
  total,
  current,
}: Pick<SwiperNavProps, "total" | "current">) {
  const safeTotal = toPositiveInteger(total, 22)
  const safeCurrent = clamp(toPositiveInteger(current, 12), 1, safeTotal)

  return (
    <span className="my-swiper-nav__number">{`${safeCurrent}/${safeTotal}`}</span>
  )
}

function ProgressNav({
  total,
  current,
}: Pick<SwiperNavProps, "total" | "current">) {
  const safeTotal = toPositiveInteger(total, 5)
  const activeIndex = clamp(toPositiveInteger(current, 1) - 1, 0, safeTotal - 1)

  return (
    <div className="my-swiper-nav__progress" aria-hidden="true">
      {Array.from({ length: safeTotal }, (_, index) => (
        <span
          key={index}
          className={cn("my-swiper-nav__progress-item", {
            "my-swiper-nav__progress-item--active": index === activeIndex,
          })}
        />
      ))}
    </div>
  )
}

export function SwiperNav({
  variant = "dots",
  total,
  current,
  showEdgeDots = false,
  dotsCount,
  className,
  ...rest
}: SwiperNavProps) {
  return (
    <div
      className={cn("my-swiper-nav", `my-swiper-nav--${variant}`, className)}
      {...rest}
    >
      {variant === "dots" ? (
        <DotNav
          total={total}
          current={current}
          dotsCount={dotsCount}
          showEdgeDots={showEdgeDots}
        />
      ) : null}
      {variant === "number" ? (
        <NumberNav total={total} current={current} />
      ) : null}
      {variant === "progress" ? (
        <ProgressNav total={total} current={current} />
      ) : null}
    </div>
  )
}

export default SwiperNav
