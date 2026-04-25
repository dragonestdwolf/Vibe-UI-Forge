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
  type ReactNode,
} from "react"

import "./PixsoSlider.css"

/* ==========================================================================
   PixsoSlider
   ----------------------------------------------------------------------------
   Pixso 节点：3286:12110「6.Slider - 滑动条」
   设计稿严格 1:1 还原，包含 9 种类型 × 5 种状态。
   - 类型 type: basic | scale | icon | value | valueWithChange
                | iconWithTitle | bubble | title | textview
   - 状态 state: default | hover | focus | active | disabled
   - 主题 theme: light（鸿蒙 Light tokens；如后续接入 dark 仅替换 CSS 变量）
   ========================================================================== */

/* -------------------- 类型 / Props -------------------- */

export type PixsoSliderType =
  | "basic"
  | "scale"
  | "icon"
  | "value"
  | "valueWithChange"
  | "iconWithTitle"
  | "bubble"
  | "title"
  | "textview"

export type PixsoSliderState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"

export type PixsoSliderTheme = "light"

export interface PixsoSliderProps {
  /** 类型变体 — 9 种 */
  type?: PixsoSliderType
  /** 当前值（受控） */
  value?: number
  /** 默认值（非受控） */
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** 强制视觉状态；用于 Storybook / 文档展示。运行时通常不传。 */
  forceState?: PixsoSliderState
  theme?: PixsoSliderTheme
  /** scale 类型：刻度数（含两端），默认 8 */
  ticks?: number
  /** icon / iconWithTitle 类型：左侧图标 */
  leadingIcon?: ReactNode
  /** icon 类型：右侧图标 */
  trailingIcon?: ReactNode
  /** title / iconWithTitle 类型：主标题 */
  title?: ReactNode
  /** title 类型：右上副标题 / 数值 */
  subtitle?: ReactNode
  /** value / valueWithChange / textview 类型：自定义值文案 */
  valueText?: ReactNode
  /** valueWithChange 类型：左侧前置文案（通常为 +/-） */
  leadingText?: ReactNode
  /** textview 类型：左右两段说明文字 */
  textviewLeft?: ReactNode
  textviewRight?: ReactNode
  /** value 类型：底部刻度文案数组（默认 0/20/40/60/80/100） */
  valueScale?: ReactNode[]
  /** bubble 类型：bubble 内文案，默认显示 value */
  bubbleFormatter?: (value: number) => ReactNode
  /** 让组件自适应父容器 */
  block?: boolean
  className?: string
  style?: CSSProperties
  onChange?: (value: number) => void
  onChangeComplete?: (value: number) => void
  "aria-label"?: string
}

/* -------------------- 工具函数 -------------------- */

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

/* -------------------- 内部子组件 -------------------- */

interface TrackProps {
  percent: number
  state: PixsoSliderState
  disabled: boolean
  showTicks?: boolean
  ticksCount?: number
  ariaLabel?: string
  ariaValueText?: string
  min: number
  max: number
  value: number
  onPointer: (e: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void
  onPointerUp: (e: PointerEvent<HTMLDivElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
  trackRef: React.RefObject<HTMLDivElement | null>
}

const SliderTrack = ({
  percent,
  state,
  disabled,
  showTicks,
  ticksCount = 8,
  ariaLabel,
  ariaValueText,
  min,
  max,
  value,
  onPointer,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  trackRef,
}: TrackProps) => {
  const cssVars = { "--pixso-percent": `${percent}%` } as CSSProperties
  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={ariaValueText}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      data-state={disabled ? "disabled" : state}
      className="pixso-slider__track"
      style={cssVars}
      onPointerDown={onPointer}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className="pixso-slider__fill" />
      {showTicks ? (
        <div className="pixso-slider__ticks" aria-hidden="true">
          {Array.from({ length: ticksCount }, (_, i) => (
            <span key={i} className="pixso-slider__tick" />
          ))}
        </div>
      ) : null}
      <div className="pixso-slider__thumb" />
    </div>
  )
}

interface BubbleProps {
  percent: number
  children: ReactNode
}
const SliderBubble = ({ percent, children }: BubbleProps) => (
  <div
    className="pixso-slider__bubble-layer"
    style={{ "--pixso-percent": `${percent}%` } as CSSProperties}
    aria-hidden="true"
  >
    <div className="pixso-slider__bubble">
      <div className="pixso-slider__bubble-body">{children}</div>
      <div className="pixso-slider__bubble-arrow" />
    </div>
  </div>
)

/* -------------------- 主组件 -------------------- */

export const PixsoSlider = forwardRef<HTMLDivElement, PixsoSliderProps>(
  function PixsoSlider(
    {
      type = "basic",
      value: controlledValue,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      forceState,
      ticks = 8,
      leadingIcon,
      trailingIcon,
      title,
      subtitle,
      valueText,
      leadingText,
      textviewLeft,
      textviewRight,
      valueScale = ["0", "20", "40", "60", "80", "100"],
      bubbleFormatter,
      block = false,
      className,
      style,
      onChange,
      onChangeComplete,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    /* ---------- 受控 / 非受控状态 ---------- */
    const [internal, setInternal] = useState<number>(
      defaultValue ?? controlledValue ?? Math.round((min + max) / 2.4),
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

    /* ---------- 内部 hover / active 状态 ---------- */
    const [hover, setHover] = useState(false)
    const [active, setActive] = useState(false)
    const [focused, setFocused] = useState(false)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const draggingRef = useRef(false)

    const computedState: PixsoSliderState = forceState
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

    /* ---------- 提交值 ---------- */
    const commit = useCallback(
      (v: number, complete = false) => {
        const next = snap(v, min, max, step)
        if (!isControlled) setInternal(next)
        onChange?.(next)
        if (complete) onChangeComplete?.(next)
      },
      [isControlled, min, max, step, onChange, onChangeComplete],
    )

    /* ---------- 指针交互 ---------- */
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

    /* ---------- 键盘交互 ---------- */
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

    /* ---------- 容器 hover/focus 镜像 ---------- */
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

    /* ---------- aria-valuetext ---------- */
    const ariaValueText =
      typeof valueText === "string" || typeof valueText === "number"
        ? String(valueText)
        : `${Math.round(safeValue)}`

    /* ---------- 公共 Track 组件 ---------- */
    const trackEl = (
      <SliderTrack
        percent={percent}
        state={computedState}
        disabled={disabled}
        showTicks={type === "scale"}
        ticksCount={ticks}
        ariaLabel={ariaLabel}
        ariaValueText={ariaValueText}
        min={min}
        max={max}
        value={safeValue}
        trackRef={trackRef}
        onPointer={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      />
    )

    /* ---------- 类型布局 ---------- */
    const containerClasses = [
      "pixso-slider",
      `pixso-slider--${type}`,
      block ? "pixso-slider--block" : "",
      disabled ? "pixso-slider--disabled" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ")

    /* Pixso 各类型行内边距见 DSL 3286:12112/12126/12131/12165/12168 等；轨宽 336 落在 360 水平 12+336+12 */
    const renderRow = (rowClass = "") => (
      <div className={["pixso-slider__row", rowClass].filter(Boolean).join(" ")}>
        {trackEl}
      </div>
    )

    let content: ReactNode = renderRow()

    if (type === "icon") {
      content = (
        <div className="pixso-slider__row pixso-slider__row--icon">
          <span className="pixso-slider__icon">{leadingIcon}</span>
          {trackEl}
          <span className="pixso-slider__icon">{trailingIcon}</span>
        </div>
      )
    }

    if (type === "valueWithChange") {
      content = (
        <div className="pixso-slider__row pixso-slider__row--pad-24-10">
          <span className="pixso-slider__delta-leading">
            {leadingText ?? "+"}
          </span>
          {trackEl}
          <span className="pixso-slider__value-trail">
            {valueText ?? Math.round(safeValue)}
          </span>
        </div>
      )
    }

    if (type === "value") {
      content = (
        <>
          {renderRow()}
          <div className="pixso-slider__value-row">
            {valueScale.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </>
      )
    }

    if (type === "iconWithTitle") {
      content = (
        <>
          <div className="pixso-slider__title-row">
            <span className="pixso-slider__title">{title}</span>
            <span className="pixso-slider__icon">{leadingIcon}</span>
          </div>
          {renderRow()}
        </>
      )
    }

    if (type === "title") {
      content = (
        <>
          <div className="pixso-slider__title-row">
            <span className="pixso-slider__title">{title}</span>
            <span className="pixso-slider__subtitle">
              {subtitle ?? `${Math.round(safeValue)}`}
            </span>
          </div>
          {renderRow("pixso-slider__row--pad-24-10")}
        </>
      )
    }

    if (type === "textview") {
      content = (
        <>
          {renderRow("pixso-slider__row--pad-24-10")}
          <div className="pixso-slider__textview">
            <span>{textviewLeft}</span>
            <span>{textviewRight}</span>
          </div>
        </>
      )
    }

    if (type === "bubble") {
      const formatted = bubbleFormatter
        ? bubbleFormatter(safeValue)
        : Math.round(safeValue)
      content = (
        <>
          <SliderBubble percent={percent}>{formatted}</SliderBubble>
          {renderRow()}
        </>
      )
    }

    return (
      <div ref={ref} className={containerClasses} style={style} {...rest}>
        {content}
      </div>
    )
  },
)

export default PixsoSlider
