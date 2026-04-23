import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import "./SegmentedButton.css"

// ============================================================
// Types
// ============================================================

export type SegmentedButtonVariant = "outline" | "primary"

/** 单个选项配置 */
export interface SegmentedButtonOption {
  /** 选项唯一标识 */
  value: string
  /** 文字标签，icon 和 label 至少填一个 */
  label?: string
  /** 图标（建议 24×24 SVG） */
  icon?: React.ReactNode
  /** 单独禁用该选项 */
  disabled?: boolean
}

// ============================================================
// CVA
// ============================================================

/** 容器 CVA：variant → 外层 class */
const segmentedButtonVariants = cva("my-segbtn", {
  variants: {
    variant: {
      /**
       * outline：pill 容器 bg rgba(0,0,0,0.047)，padding 2px，
       * 选中项白底 + 0 0 3px rgba(0,0,0,0.2) shadow
       */
      outline: "my-segbtn--outline",
      /**
       * primary：无外层背景，items gap 1px，
       * 选中项 #0A59F7，首尾项有圆角
       */
      primary: "my-segbtn--primary",
    },
  },
  defaultVariants: {
    variant: "outline",
  },
})

/** 单项 CVA：variant + selected → item class */
const segmentedButtonItemVariants = cva("my-segbtn__item", {
  variants: {
    variant: {
      outline: "my-segbtn__item--outline",
      primary: "my-segbtn__item--primary",
    },
    selected: {
      true: "is-selected",
      false: "",
    },
  },
  defaultVariants: {
    variant: "outline",
    selected: false,
  },
})

// ============================================================
// Props
// ============================================================

export interface SegmentedButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof segmentedButtonVariants> {
  /** 选项列表，至少 2 项 */
  items: SegmentedButtonOption[]
  /** 受控选中值 */
  value?: string
  /** 非受控默认选中值（不传则默认选第一项） */
  defaultValue?: string
  /** 是否整体禁用 */
  disabled?: boolean
  /** 选中值变化回调 */
  onChange?: (value: string) => void
}

// ============================================================
// SegmentedButton 主组件
// ============================================================

/**
 * SegmentedButton 分段按钮
 *
 * 对应 Pixso benchmark: OPXcaxT2Rj_9QE_M8xckbw / 3261:793
 *
 * ## 变体
 * - **outline**（默认）：pill 容器，选中项白底 + shadow
 * - **primary**：无容器背景，选中项品牌蓝填充，首尾有圆角
 *
 * ## 用法
 * ```tsx
 * <SegmentedButton
 *   items={[
 *     { value: "a", label: "Tabs", icon: <StarIcon /> },
 *     { value: "b", label: "Tabs", icon: <StarIcon /> },
 *   ]}
 *   defaultValue="a"
 *   onChange={v => console.log(v)}
 * />
 * ```
 */
export const SegmentedButton = React.forwardRef<HTMLDivElement, SegmentedButtonProps>(
  function SegmentedButton(
    {
      variant = "outline",
      items,
      value,
      defaultValue,
      disabled = false,
      className,
      style,
      onChange,
      ...rest
    },
    ref
  ) {
    // --------------------------------------------------
    // 受控 / 非受控
    // --------------------------------------------------
    const isControlled = value !== undefined
    const [innerValue, setInnerValue] = React.useState<string>(
      defaultValue ?? items[0]?.value ?? ""
    )
    const selectedValue = isControlled ? value : innerValue

    const handleSelect = React.useCallback(
      (option: SegmentedButtonOption) => {
        if (disabled || option.disabled) return
        if (!isControlled) setInnerValue(option.value)
        onChange?.(option.value)
      },
      [disabled, isControlled, onChange]
    )

    // --------------------------------------------------
    // 渲染
    // --------------------------------------------------
    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          segmentedButtonVariants({ variant }),
          disabled && "is-disabled",
          className
        )}
        aria-disabled={disabled || undefined}
        style={style}
        {...rest}
      >
        {items.map((option) => {
          const isSelected = option.value === selectedValue
          const isItemDisabled = disabled || option.disabled

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isItemDisabled}
              className={cn(
                segmentedButtonItemVariants({ variant, selected: isSelected })
              )}
              onClick={() => handleSelect(option)}
            >
              {option.icon && (
                <span className="my-segbtn__icon" aria-hidden="true">
                  {option.icon}
                </span>
              )}
              {option.label && (
                <span className="my-segbtn__label">{option.label}</span>
              )}
            </button>
          )
        })}
      </div>
    )
  }
)

SegmentedButton.displayName = "SegmentedButton"

export type SegmentedButtonVariantProps = VariantProps<typeof segmentedButtonVariants>
export { segmentedButtonVariants, segmentedButtonItemVariants }
export default SegmentedButton
