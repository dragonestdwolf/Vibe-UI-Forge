import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react"

import "./PixsoSlider.css"

/* ==========================================================================
   PixsoSeekbar
   ----------------------------------------------------------------------------
   Pixso 节点：3286:12185「Slider-Seekbar-Phone」
   细轨道（4px）+ 16px 圆点 thumb，常用于音频/视频进度、亮度系统级控件。
   状态 state: default | hover | focus | active | disabled
   ========================================================================== */

export type PixsoSeekbarState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"

export interface PixsoSeekbarProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  block?: boolean
  /** 强制视觉状态；用于 Storybook 演示 */
  forceState?: PixsoSeekbarState
  className?: string
  style?: CSSProperties
  onChange?: (value: number) => void
  onChangeComplete?: (value: number) => void
  "aria-label"?: string
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
function snap(v: number, min: number, max: number, step: number) {
  const safeStep = step > 0 ? step : 1
  const c = clamp(v, min, max)
  const stepped = Math.round((c - min) / safeStep) * safeStep + min
  return Number(stepped.toFixed(6))
}
function pct(v: number, min: number, max: number) {
  if (max === min) return 0
  return ((v - min) / (max - min)) * 100
}

export const PixsoSeekbar = forwardRef<HTMLDivElement, PixsoSeekbarProps>(
  function PixsoSeekbar(
    {
      value: controlledValue,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      block = false,
      forceState,
      className,
      style,
      onChange,
      onChangeComplete,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const [internal, setInternal] = useState<number>(
      defaultValue ?? controlledValue ?? Math.round((min + max) / 3),
    )
    const isControlled = controlledValue != null
    const rawValue = isControlled ? (controlledValue as number) : internal
    const safeValue = useMemo(
      () => snap(rawValue, min, max, step),
      [rawValue, min, max, step],
    )
    const percent = useMemo(
      () => pct(safeValue, min, max),
      [safeValue, min, max],
    )

    const [hover, setHover] = useState(false)
    const [active, setActive] = useState(false)
    const [focused, setFocused] = useState(false)

    const trackRef = useRef<HTMLDivElement | null>(null)
    const draggingRef = useRef(false)

    const computedState: PixsoSeekbarState = forceState
      ? forceState
      : disabled
        ? "disabled"
        : active
          ? "active"
          : focused
            ? "focus"
            : hover
              ? "hover"
              : "default"

    const commit = useCallback(
      (v: number, complete = false) => {
        const next = snap(v, min, max, step)
        if (!isControlled) setInternal(next)
        onChange?.(next)
        if (complete) onChangeComplete?.(next)
      },
      [isControlled, min, max, step, onChange, onChangeComplete],
    )

    const valueFromClientX = useCallback(
      (clientX: number) => {
        const el = trackRef.current
        if (!el) return safeValue
        const rect = el.getBoundingClientRect()
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
        return min + ratio * (max - min)
      },
      [min, max, safeValue],
    )

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (disabled) return
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        draggingRef.current = true
        setActive(true)
        commit(valueFromClientX(e.clientX))
      },
      [disabled, commit, valueFromClientX],
    )
    const handlePointerMove = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (!draggingRef.current || disabled) return
        commit(valueFromClientX(e.clientX))
      },
      [commit, valueFromClientX, disabled],
    )
    const handlePointerUp = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (!draggingRef.current) return
        draggingRef.current = false
        setActive(false)
        try {
          ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
        } catch {
          /* noop */
        }
        commit(valueFromClientX(e.clientX), true)
      },
      [commit, valueFromClientX],
    )

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return
        const big = (max - min) / 10
        let next: number | null = null
        switch (e.key) {
          case "ArrowLeft":
          case "ArrowDown":
            next = safeValue - step
            break
          case "ArrowRight":
          case "ArrowUp":
            next = safeValue + step
            break
          case "PageDown":
            next = safeValue - big
            break
          case "PageUp":
            next = safeValue + big
            break
          case "Home":
            next = min
            break
          case "End":
            next = max
            break
        }
        if (next != null) {
          e.preventDefault()
          commit(next, true)
        }
      },
      [disabled, max, min, safeValue, step, commit],
    )

    useEffect(() => {
      const el = trackRef.current
      if (!el) return
      const onEnter = () => setHover(true)
      const onLeave = () => setHover(false)
      const onFocus = () => setFocused(true)
      const onBlur = () => setFocused(false)
      el.addEventListener("pointerenter", onEnter)
      el.addEventListener("pointerleave", onLeave)
      el.addEventListener("focus", onFocus)
      el.addEventListener("blur", onBlur)
      return () => {
        el.removeEventListener("pointerenter", onEnter)
        el.removeEventListener("pointerleave", onLeave)
        el.removeEventListener("focus", onFocus)
        el.removeEventListener("blur", onBlur)
      }
    }, [])

    const containerClasses = [
      "pixso-seekbar",
      block ? "pixso-seekbar--block" : "",
      disabled ? "pixso-seekbar--disabled" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ")

    const cssVars = { "--pixso-percent": `${percent}%` } as CSSProperties

    return (
      <div
        ref={(node) => {
          trackRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={safeValue}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        data-state={computedState}
        className={containerClasses}
        style={{ ...cssVars, ...style }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <div className="pixso-seekbar__track">
          <div className="pixso-seekbar__fill" />
        </div>
        <div className="pixso-seekbar__thumb-wrap" aria-hidden="true">
          <div className="pixso-seekbar__thumb" />
        </div>
      </div>
    )
  },
)

export default PixsoSeekbar
