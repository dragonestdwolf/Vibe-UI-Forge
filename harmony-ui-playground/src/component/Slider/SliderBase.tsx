import { forwardRef } from "react"

import { Slider, type SliderProps } from "./Slider"

export interface SliderBaseProps
  extends Omit<
    SliderProps,
    "type" | "value" | "defaultValue" | "onChange" | "leadingIcon" | "trailingIcon"
  > {
  modelValue?: number
  onUpdateModelValue?: (value: number) => void
  activeColor?: string
  inactiveColor?: string
  thumbColor?: string
}

export const SliderBase = forwardRef<HTMLDivElement, SliderBaseProps>(
  function SliderBase(
    {
      modelValue,
      onUpdateModelValue,
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
        type="basic"
        block={block}
        value={modelValue}
        onChange={onUpdateModelValue}
      />
    )
  },
)

export default SliderBase
