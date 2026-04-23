import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import "./SearchV3.css"

// ============================================================
// Types
// ============================================================

/**
 * 组件变体
 * - primary  → harmony-search-primary，一级/首页搜索入口
 * - secondary → harmony-search-second，二级/搜索结果页
 */
export type SearchV3Variant = "primary" | "secondary"

/**
 * primary 专属显示模式（对应 spec Search=OFF / Search=ON）
 * - off（默认）: 全宽 pill，无右侧操作区
 * - on         : 左侧内容区 + 右侧操作区（语音按钮 + 分隔线 + 搜索按钮）
 */
export type SearchV3Mode = "off" | "on"

/**
 * 视觉状态（对应 spec 状态矩阵 §2.1 / §2.2）
 * 不传 state prop 时由内部交互自动计算。
 */
export type SearchV3State =
  | "normal"
  | "hover"
  | "press"
  | "focus"
  | "focus-field"
  | "actived"
  | "output"
  | "disabled"
  | "icon-hover"
  | "icon-focus"
  | "icon-press"

/** state → CSS class 映射（与 benchmark 完全一致） */
const STATE_CLASS_MAP: Record<SearchV3State, string> = {
  normal: "",
  hover: "is-hover",
  press: "is-press",
  focus: "is-focus",
  "focus-field": "is-focus-field",
  actived: "is-actived",
  output: "is-output",
  disabled: "is-disabled",
  "icon-hover": "is-icon-hover",
  "icon-focus": "is-icon-focus",
  "icon-press": "is-icon-press",
}

// ============================================================
// CVA — 管理 variant（primary / secondary）
// mode(off/on) 和 state 类由组件逻辑动态追加
// ============================================================

const searchV3Variants = cva("my-search-v3", {
  variants: {
    variant: {
      /** harmony-search-primary：328×40 pill，cornerRadius 24 */
      primary: "my-search-v3--primary",
      /** harmony-search-second：[back 40] + [field flex:1] + [scan 40] */
      secondary: "my-search-v3--secondary",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

// ============================================================
// Props
// ============================================================

export interface SearchV3Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof searchV3Variants> {
  // ── 基础 ────────────────────────────────────────────────
  /** 受控值 */
  value?: string
  /** 非受控默认值 */
  defaultValue?: string
  /** 占位文字，默认 "Search" */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 有值时显示清除按钮，默认 true */
  clearable?: boolean

  // ── primary 专属 ─────────────────────────────────────
  /**
   * Search=OFF（全宽，无操作区）/ Search=ON（右侧带操作区）
   * 仅 primary 有效，secondary 忽略此 prop。
   * @default "off"
   */
  mode?: SearchV3Mode
  /** 搜索按钮文字（primary ON），默认 "Search" */
  actionText?: string
  /** 是否显示语音按钮（primary ON），默认 true */
  showVoice?: boolean

  // ── 图标插槽 ─────────────────────────────────────────
  /** 搜索图标，默认内置 magnifyingglass SVG */
  searchIcon?: React.ReactNode
  /** 清除图标，默认内置 xmark SVG */
  clearIcon?: React.ReactNode
  /** 语音图标（primary ON），默认内置 mic SVG */
  voiceIcon?: React.ReactNode
  /** 返回图标（secondary），默认内置 chevron_left SVG */
  backIcon?: React.ReactNode
  /** 扫码图标（secondary），默认内置 line_viewfinder SVG */
  scanIcon?: React.ReactNode

  // ── secondary 专属 ───────────────────────────────────
  /** 是否显示左侧返回按钮（secondary），默认 true */
  showBack?: boolean
  /** 是否显示右侧扫码按钮（secondary），默认 true */
  showScan?: boolean

  // ── 状态覆盖（Storybook / 测试）────────────────────
  /**
   * 显式覆盖视觉状态，不传则由内部交互自动计算。
   * 用于 Storybook 展示各状态切片，或 UI 测试快照。
   */
  state?: SearchV3State

  // ── 事件 ────────────────────────────────────────────
  onChange?: (value: string) => void
  /** 触发搜索（Enter / 点击搜索图标 / 点击搜索按钮） */
  onSearch?: (value: string) => void
  onClear?: () => void
  /** 点击返回按钮（secondary） */
  onBack?: () => void
  /** 点击扫码按钮（secondary） */
  onScan?: () => void
  /** 点击语音按钮（primary ON） */
  onVoice?: () => void
}

// ============================================================
// 默认图标（HMSymbol 语义对应的 SVG fallback）
// spec §6: magnifyingglass F0029 / xmark F0056 / mic_fill F0315
//          chevron_left F00DA / line_viewfinder F0028
// ============================================================

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconClear() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconVoice() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconBack() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconScan() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ============================================================
// SearchV3 主组件
// ============================================================

/**
 * SearchV3 搜索框组件
 *
 * 对应 spec harmony-search-primary（Pixso 3208:426）和
 * harmony-search-second（Pixso 40:33944 / 39:34364）。
 *
 * ## 变体
 * - **primary**（默认）：一级页面 pill 搜索框
 *   - mode="off"：全宽，无操作区
 *   - mode="on" ：右侧带 [语音 | 搜索] 操作区
 * - **secondary**：二级页面，三列布局
 *   - [返回 40×40] + [搜索栏 flex:1] + [扫码 40×40]
 *
 * ## 状态
 * normal / hover / press / focus / focus-field /
 * actived / typing / output / disabled /
 * icon-hover / icon-focus / icon-press
 */
export const SearchV3 = React.forwardRef<HTMLInputElement, SearchV3Props>(
  function SearchV3(
    {
      variant = "primary",
      mode = "off",
      value,
      defaultValue = "",
      placeholder = "Search",
      disabled = false,
      clearable = true,
      state: stateProp,
      actionText = "Search",
      showVoice = true,
      searchIcon,
      clearIcon,
      voiceIcon,
      backIcon,
      scanIcon,
      showBack = true,
      showScan = true,
      className,
      style,
      onChange,
      onSearch,
      onClear,
      onBack,
      onScan,
      onVoice,
      ...rest
    },
    ref
  ) {
    // --------------------------------------------------
    // 内部状态
    // --------------------------------------------------
    const [innerValue, setInnerValue] = React.useState(defaultValue)
    const [fieldFocused, setFieldFocused] = React.useState(false)
    const [backFocused, setBackFocused] = React.useState(false)
    const [searchBtnFocused, setSearchBtnFocused] = React.useState(false)

    const isControlled = value !== undefined
    const inputValue = isControlled ? value : innerValue

    // --------------------------------------------------
    // 自动计算有效视觉状态（优先使用外部 stateProp）
    // --------------------------------------------------
    const computedStateClass = React.useMemo((): string => {
      if (disabled) return "is-disabled"
      if (fieldFocused) return "is-actived"
      // secondary: 返回按钮获得键盘焦点 → is-focus
      if (variant === "secondary" && backFocused) return "is-focus"
      // primary ON: 搜索按钮获得键盘焦点 → is-focus（spec §2.1 Focus(ON)）
      if (variant === "primary" && mode === "on" && searchBtnFocused) return "is-focus"
      // primary ON: 有值且未聚焦 → is-output（spec §2.1 Output(ON)）
      if (variant === "primary" && mode === "on" && inputValue.length > 0) return "is-output"
      return ""
    }, [disabled, fieldFocused, backFocused, searchBtnFocused, variant, mode, inputValue])

    const effectiveStateClass =
      stateProp != null ? (STATE_CLASS_MAP[stateProp] ?? "") : computedStateClass

    // --------------------------------------------------
    // mode class（仅 primary）
    // --------------------------------------------------
    const modeClass = variant === "primary" ? (mode === "on" ? "is-on" : "is-off") : ""

    // --------------------------------------------------
    // 事件处理
    // --------------------------------------------------
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value
        if (!isControlled) setInnerValue(v)
        onChange?.(v)
      },
      [isControlled, onChange]
    )

    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isControlled) setInnerValue("")
        onChange?.("")
        onClear?.()
      },
      [isControlled, onChange, onClear]
    )

    const handleSearch = React.useCallback(() => {
      if (!disabled) onSearch?.(inputValue)
    }, [disabled, inputValue, onSearch])

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch()
      },
      [handleSearch]
    )

    // --------------------------------------------------
    // 派生条件
    // --------------------------------------------------
    const showClear = clearable && !disabled && inputValue.length > 0

    // --------------------------------------------------
    // 根元素 className
    // --------------------------------------------------
    const rootClass = cn(
      searchV3Variants({ variant }),
      modeClass,
      effectiveStateClass,
      className
    )

    // --------------------------------------------------
    // 共享输入区内容
    // --------------------------------------------------
    const inputNode = (
      <input
        ref={ref}
        className="my-search-v3__input"
        type="search"
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFieldFocused(true)}
        onBlur={() => setFieldFocused(false)}
      />
    )

    const clearNode = showClear && (
      <button
        type="button"
        className="my-search-v3__clear"
        aria-label="清除"
        tabIndex={-1}
        onClick={handleClear}
      >
        {clearIcon ?? <IconClear />}
      </button>
    )

    // --------------------------------------------------
    // secondary 变体渲染
    // [返回 40×40] + [field pill flex:1] + [扫码 40×40]
    // --------------------------------------------------
    if (variant === "secondary") {
      return (
        <div className={rootClass} style={style} data-state={effectiveStateClass || "normal"} {...rest}>
          {showBack && (
            <button
              type="button"
              className="my-search-v3__side my-search-v3__side--back"
              aria-label="返回"
              disabled={disabled}
              onClick={onBack}
              onFocus={() => setBackFocused(true)}
              onBlur={() => setBackFocused(false)}
            >
              {backIcon ?? <IconBack />}
            </button>
          )}

          <div className="my-search-v3__field">
            <span className="my-search-v3__icon" aria-hidden="true">
              {searchIcon ?? <IconSearch />}
            </span>
            {inputNode}
            {clearNode}
          </div>

          {showScan && (
            <button
              type="button"
              className="my-search-v3__side my-search-v3__side--scan"
              aria-label="扫码"
              disabled={disabled}
              onClick={onScan}
            >
              {scanIcon ?? <IconScan />}
            </button>
          )}
        </div>
      )
    }

    // --------------------------------------------------
    // primary 变体渲染
    // is-off: [icon + input + clear]
    // is-on:  [icon + input + clear] + [voice | divider | btn]
    // --------------------------------------------------
    return (
      <div className={rootClass} style={style} data-state={effectiveStateClass || "normal"} {...rest}>
        {/* __inner：flex:1 1 0，不挤压右侧 action slot */}
        <div className="my-search-v3__inner">
          <button
            type="button"
            className="my-search-v3__icon-btn"
            aria-label="搜索"
            tabIndex={-1}
            disabled={disabled}
            onClick={handleSearch}
          >
            <span className="my-search-v3__icon" aria-hidden="true">
              {searchIcon ?? <IconSearch />}
            </span>
          </button>
          {inputNode}
          {clearNode}
        </div>

        {/* __action：仅 mode="on" 时渲染，总宽约 109px */}
        {mode === "on" && (
          <div className="my-search-v3__action">
            {showVoice && (
              <button
                type="button"
                className="my-search-v3__voice"
                aria-label="语音搜索"
                disabled={disabled}
                onClick={onVoice}
              >
                {voiceIcon ?? <IconVoice />}
              </button>
            )}
            <div className="my-search-v3__divider" aria-hidden="true" />
            <button
              type="button"
              className="my-search-v3__btn"
              disabled={disabled}
              onClick={handleSearch}
              onFocus={() => setSearchBtnFocused(true)}
              onBlur={() => setSearchBtnFocused(false)}
            >
              {actionText}
            </button>
          </div>
        )}
      </div>
    )
  }
)

SearchV3.displayName = "SearchV3"

export type SearchV3VariantProps = VariantProps<typeof searchV3Variants>
export { searchV3Variants }
export default SearchV3
