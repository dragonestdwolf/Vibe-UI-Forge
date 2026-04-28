"use client"

import type { CSSProperties, ReactNode, SVGProps } from "react"
import { useState } from "react"

import iconArrowRightSmall from "@/blocks/assets/pixso-icons/icon-arrow-right-small.png"
import darkModePreview from "@/blocks/assets/pixso-icons/icon-setting-dark.png"
import lightModePreview from "@/blocks/assets/pixso-icons/icon-setting-light.png"
import { StatusBar } from "@/component/StatusBar"
import { Slider } from "@/component/Slider"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"

import "./index.css"

type DisplayMode = "light" | "dark"
type IconProps = SVGProps<SVGSVGElement>

const titleStyle: CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  lineHeight: "20px",
  letterSpacing: 0,
}

const modeMeta: Record<
  DisplayMode,
  {
    label: string
    caption: string
    accent: string
    imageSrc: string
  }
> = {
  light: {
    label: "浅色模式",
    caption: "通透明亮，适合白天浏览",
    accent: "日间推荐",
    imageSrc: lightModePreview,
  },
  dark: {
    label: "深色模式",
    caption: "压低眩光，夜晚更舒适",
    accent: "夜间友好",
    imageSrc: darkModePreview,
  },
}

function BrightnessLowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.75V5.25M12 18.75v2.5M4.75 12H2.25M21.75 12h-2.5M5.93 5.93l1.77 1.77M18.07 18.07l-1.77-1.77M18.07 5.93 16.3 7.7M5.93 18.07l1.77-1.77"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BrightnessHighIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.14" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.75V5.25M12 18.75v2.5M4.75 12H2.25M21.75 12h-2.5M5.93 5.93l1.77 1.77M18.07 18.07l-1.77-1.77M18.07 5.93 16.3 7.7M5.93 18.07l1.77-1.77"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronValue({ value }: { value: string }) {
  return (
    <div className="display-brightness-v6__row-trailing" aria-hidden="true">
      <span className="display-brightness-v6__row-value">{value}</span>
      <img
        className="display-brightness-v6__chevron"
        src={iconArrowRightSmall}
        alt=""
      />
    </div>
  )
}

function ModePreview({
  mode,
  active,
  onSelect,
}: {
  mode: DisplayMode
  active: boolean
  onSelect: (mode: DisplayMode) => void
}) {
  const meta = modeMeta[mode]

  return (
    <button
      type="button"
      className={`display-brightness-v6__mode-preview ${active ? "is-active" : ""}`}
      onClick={() => onSelect(mode)}
      aria-pressed={active}
    >
      <div className="display-brightness-v6__mode-frame">
        <img
          className="display-brightness-v6__mode-image"
          src={meta.imageSrc}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className="display-brightness-v6__mode-copy">
        <div className="display-brightness-v6__mode-title-row">
          <span className="display-brightness-v6__mode-label">{meta.label}</span>
          <span className="display-brightness-v6__mode-chip">{meta.accent}</span>
        </div>
        <p className="display-brightness-v6__mode-caption">{meta.caption}</p>
      </div>
    </button>
  )
}

function SimpleSettingRow({
  label,
  trailing,
}: {
  label: string
  trailing: ReactNode
}) {
  return (
    <div className="display-brightness-v6__simple-row">
      <span className="display-brightness-v6__simple-row-label">{label}</span>
      {trailing}
    </div>
  )
}

export default function DisplayBrightnessSettingsV6() {
  const [mode, setMode] = useState<DisplayMode>("light")
  const [brightness, setBrightness] = useState(62)
  const [autoAdjust, setAutoAdjust] = useState(true)

  return (
    <div className="display-brightness-v6">
      <StatusBar time="08:08" backgroundColor="#f2f3f5" />

      <div className="display-brightness-v6__titlebar">
        <TitleBar
          title="显示和亮度"
          subtitle=""
          titleStyle={titleStyle}
          rightIcons={[]}
          backgroundColor="#f2f3f5"
        />
      </div>

      <div className="display-brightness-v6__content">
        <section className="display-brightness-v6__hero-card">
          <div className="display-brightness-v6__hero-head">
            <div>
              <p className="display-brightness-v6__eyebrow">模式预览</p>
              <h2 className="display-brightness-v6__hero-title">显示模式</h2>
              <p className="display-brightness-v6__hero-subtitle">
                把浅色与深色直接摆到前台，切换判断会更快，也让页面视觉重心更集中。
              </p>
            </div>
            <div className="display-brightness-v6__hero-badge">双模式可视化</div>
          </div>

          <div className="display-brightness-v6__mode-grid">
            <ModePreview mode="light" active={mode === "light"} onSelect={setMode} />
            <ModePreview mode="dark" active={mode === "dark"} onSelect={setMode} />
          </div>

          <div className="display-brightness-v6__hero-footer">
            <div className="display-brightness-v6__focus-copy">
              <span className="display-brightness-v6__focus-label">当前模式</span>
              <strong className="display-brightness-v6__focus-value">
                {modeMeta[mode].label}
              </strong>
            </div>
            <ChevronValue value="定时开启" />
          </div>
        </section>

        <section className="display-brightness-v6__card display-brightness-v6__brightness-card">
          <div className="display-brightness-v6__card-head">
            <span className="display-brightness-v6__card-title">亮度</span>
            <span className="display-brightness-v6__card-value">{brightness}%</span>
          </div>

          <Slider
            className="display-brightness-v6__brightness-slider"
            type="icon"
            block
            min={0}
            max={100}
            step={1}
            value={brightness}
            onChange={setBrightness}
            leadingIcon={<BrightnessLowIcon className="display-brightness-v6__brightness-icon" />}
            trailingIcon={<BrightnessHighIcon className="display-brightness-v6__brightness-icon" />}
            aria-label="亮度"
          />

          <div className="display-brightness-v6__divider" />

          <SimpleSettingRow
            label="自动调节"
            trailing={<Switch modelValue={autoAdjust} onUpdateModelValue={setAutoAdjust} />}
          />
        </section>

        <section className="display-brightness-v6__card display-brightness-v6__rows-card">
          <SimpleSettingRow label="护眼模式" trailing={<ChevronValue value="全天开启" />} />
        </section>

        <section className="display-brightness-v6__card display-brightness-v6__rows-card">
          <SimpleSettingRow
            label="字体大小和界面缩放"
            trailing={<ChevronValue value="全天开启" />}
          />
        </section>
      </div>

      <div className="display-brightness-v6__spacer" />

      <footer className="display-brightness-v6__footer" aria-hidden="true">
        <span className="display-brightness-v6__home-indicator" />
      </footer>
    </div>
  )
}
