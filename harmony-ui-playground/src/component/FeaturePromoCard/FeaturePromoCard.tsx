import * as React from "react"

import { cn } from "@/lib/utils"

import "./FeaturePromoCard.css"

/**
 * FeaturePromoCard — Pixso 节点 `3368:152`「Symbol_3368_152」
 * Design: https://pixso.cn/app/design/OPXcaxT2Rj_9QE_M8xckbw?item-id=3368:152
 *
 * 与 `SceneModeCard` 共享 244×220/r24 玻璃面板 + 居中 icon/title/subtitle 的版式，
 * 但底部追加一颗整宽 CTA 胶囊按钮（`3368:133` —「MediumNormalEnabled」实例），
 * 用于「立即开启」类的功能营销/引导场景。
 *
 * 关键量化结论（与 DSL 1:1）：
 * - 卡片：244×220，r=24，bg `rgba(255,255,255,0.8)`
 * - 图标：64×64，居中，top=14
 * - 标题：top=90，24/28 Regular，color `rgba(0,0,0,0.898)`
 * - 副标题：top=120，14/16 Bold，color `rgba(0,0,0,0.4)`
 * - 按钮：212×40，r=20，top=164，left=16，bg `rgba(0,0,0,0.047)`
 *   文案 16/24 Medium，color `rgba(0,0,0,0.9)`
 */
export interface FeaturePromoCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 顶部图标插槽（建议 64×64 SVG） */
  icon?: React.ReactNode
  /** 主标题，对应设计稿「免打扰」 */
  title?: React.ReactNode
  /** 副标题，对应设计稿「减少打扰保持专注」 */
  subtitle?: React.ReactNode
  /** CTA 按钮文案，对应设计稿「立即开启」 */
  actionLabel?: React.ReactNode
  /** 点击 CTA 按钮时回调；不传时按钮仍可视渲染但点击无响应 */
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** 整体禁用（视觉弱化 + 阻止点击） */
  disabled?: boolean
  /** CTA 按钮单独禁用（不影响卡片其它部分） */
  actionDisabled?: boolean
}

export function FeaturePromoCard({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  disabled = false,
  actionDisabled = false,
  className,
  ...rest
}: FeaturePromoCardProps) {
  const handleAction = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || actionDisabled) return
      onAction?.(event)
    },
    [disabled, actionDisabled, onAction]
  )

  return (
    <div
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn("my-feature-promo-card", className)}
      {...rest}
    >
      <div className="my-feature-promo-card__inner">
        {icon ? (
          <div className="my-feature-promo-card__icon" aria-hidden="true">
            {icon}
          </div>
        ) : null}

        {title ? (
          <div className="my-feature-promo-card__title">{title}</div>
        ) : null}

        {subtitle ? (
          <div className="my-feature-promo-card__subtitle">{subtitle}</div>
        ) : null}

        {actionLabel ? (
          <button
            type="button"
            className="my-feature-promo-card__action"
            disabled={disabled || actionDisabled}
            data-disabled={disabled || actionDisabled || undefined}
            onClick={handleAction}
          >
            <span className="my-feature-promo-card__action-text">
              {actionLabel}
            </span>
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default FeaturePromoCard
