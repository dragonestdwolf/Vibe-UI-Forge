"use client"

import type { CSSProperties, SVGProps } from "react"
import { useState } from "react"

import { List, ListItem } from "@/component/List"
import { Slider } from "@/component/Slider"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"

import iconArrowRightSmall from "@/blocks/assets/pixso-icons/icon-arrow-right-small.png"

import "./index.css"

type IconProps = SVGProps<SVGSVGElement>

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

function DisplayModeKnobIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <circle cx="6" cy="6" r="2.25" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6 0.9v1.4M6 9.7v1.4M0.9 6h1.4M9.7 6h1.4M2.1 2.1l1 1M8.9 8.9l1 1M8.9 2.1l-1 1M2.1 8.9l1-1"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DisplayModePill() {
  return (
    <div className="display-brightness-v5__mode-pill" aria-hidden="true">
      <span className="display-brightness-v5__mode-pill-knob">
        <DisplayModeKnobIcon className="display-brightness-v5__mode-pill-icon" />
      </span>
    </div>
  )
}

function ChevronValue({ value }: { value: string }) {
  return (
    <div className="display-brightness-v5__trailing" aria-hidden="true">
      <span className="display-brightness-v5__trailing-value">{value}</span>
      <img
        className="display-brightness-v5__chevron"
        src={iconArrowRightSmall}
        alt=""
      />
    </div>
  )
}

const titleStyle: CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  lineHeight: "20px",
  letterSpacing: 0,
}

export default function DisplayBrightnessSettingsV5() {
  const [brightness, setBrightness] = useState(62)
  const [autoAdjust, setAutoAdjust] = useState(true)

  return (
    <div className="display-brightness-v5">
      <StatusBar time="08:08" backgroundColor="#f2f3f5" />

      <div className="display-brightness-v5__titlebar">
        <TitleBar
          title="显示和亮度"
          subtitle=""
          titleStyle={titleStyle}
          rightIcons={[]}
          backgroundColor="#f2f3f5"
        />
      </div>

      <div className="display-brightness-v5__content">
        <List className="display-brightness-v5__card display-brightness-v5__list-card">
          <ListItem
            title="显示模式"
            right={
              <div className="display-brightness-v5__trailing display-brightness-v5__trailing--mode">
                <span className="display-brightness-v5__trailing-value">浅色</span>
                <DisplayModePill />
              </div>
            }
            showArrow={false}
          />
          <ListItem
            title="深色模式"
            right={<ChevronValue value="定时开启" />}
            showArrow={false}
            border={false}
          />
        </List>

        <section className="display-brightness-v5__card display-brightness-v5__brightness-card">
          <Slider
            className="display-brightness-v5__brightness-slider"
            type="icon"
            block
            min={0}
            max={100}
            step={1}
            value={brightness}
            onChange={setBrightness}
            leadingIcon={<BrightnessLowIcon className="display-brightness-v5__brightness-icon" />}
            trailingIcon={<BrightnessHighIcon className="display-brightness-v5__brightness-icon" />}
            aria-label="亮度"
          />

          <div className="display-brightness-v5__setting-row">
            <span className="display-brightness-v5__setting-label">自动调节</span>
            <Switch modelValue={autoAdjust} onUpdateModelValue={setAutoAdjust} />
          </div>
        </section>

        <List className="display-brightness-v5__card display-brightness-v5__list-card display-brightness-v5__list-card--single">
          <ListItem
            title="护眼模式"
            right={<ChevronValue value="全天开启" />}
            showArrow={false}
            border={false}
          />
        </List>

        <List className="display-brightness-v5__card display-brightness-v5__list-card display-brightness-v5__list-card--single">
          <ListItem
            title="字体大小和界面缩放"
            right={<ChevronValue value="全天开启" />}
            showArrow={false}
            border={false}
          />
        </List>
      </div>

      <div className="display-brightness-v5__spacer" />

      <footer className="display-brightness-v5__footer" aria-hidden="true">
        <span className="display-brightness-v5__home-indicator" />
      </footer>
    </div>
  )
}
