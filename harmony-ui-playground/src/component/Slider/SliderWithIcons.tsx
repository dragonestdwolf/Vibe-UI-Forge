import { forwardRef, type ReactNode } from "react"

import { Slider, type SliderProps } from "./Slider"

export interface SliderWithIconsProps
  extends Omit<
    SliderProps,
    "type" | "value" | "defaultValue" | "onChange" | "leadingIcon" | "trailingIcon"
  > {
  modelValue?: number
  onUpdateModelValue?: (value: number) => void
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  iconGap?: number
  activeColor?: string
  inactiveColor?: string
  thumbColor?: string
}

export const SliderWithIcons = forwardRef<HTMLDivElement, SliderWithIconsProps>(
  function SliderWithIcons(
    {
      modelValue,
      onUpdateModelValue,
      leftIcon,
      rightIcon,
      iconGap: _iconGap,
      activeColor: _activeColor,
      inactiveColor: _inactiveColor,
      thumbColor: _thumbColor,
      block = true,
      ...rest
    },
    ref,
  ) {
    return (
      <Slider
        {...rest}
        ref={ref}
        type="icon"
        block={block}
        value={modelValue}
        onChange={onUpdateModelValue}
        leadingIcon={leftIcon}
        trailingIcon={rightIcon}
      />
    )
  },
)

export default SliderWithIcons
