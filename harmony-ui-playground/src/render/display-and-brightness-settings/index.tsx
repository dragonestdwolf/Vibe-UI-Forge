import { useState, type CSSProperties, type ReactNode } from "react"

import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import { Slider } from "@/component/Slider"
import { SettingsContextListLayout } from "@/layouts/SettingsContextListLayout"

import iconChevronBack from "@/blocks/assets/pixso-icons/icon-chevron-backward.png"
import iconArrowRightSmall from "@/blocks/assets/pixso-icons/icon-arrow-right-small.png"
import phonePreviewLight from "@/blocks/assets/pixso-icons/icon-setting-light.png"
import phonePreviewDark from "@/blocks/assets/pixso-icons/icon-setting-dark.png"

import "./index.css"

const FONT_PRIMARY = "rgba(0, 0, 0, 0.9)"
const FONT_SECONDARY = "rgba(0, 0, 0, 0.6)"
const BRAND_BLUE = "#0a59f7"
const PAGE_BG = "#F1F3F5"

export type DisplayMode = "light" | "dark"

interface ModePreviewOption {
  mode: DisplayMode
  label: string
  image: string
  alt: string
}

const MODE_OPTIONS: ModePreviewOption[] = [
  {
    mode: "light",
    label: "浅色",
    image: phonePreviewLight,
    alt: "浅色模式预览",
  },
  {
    mode: "dark",
    label: "深色",
    image: phonePreviewDark,
    alt: "深色模式预览",
  },
]

function ModePreviewCard({
  selected,
  onSelect,
}: {
  selected: DisplayMode
  onSelect: (mode: DisplayMode) => void
}) {
  return (
    <div className="dab-mode-card" role="radiogroup" aria-label="显示模式">
      <div className="dab-mode-card__row">
        {MODE_OPTIONS.map((option) => {
          const isActive = selected === option.mode
          return (
            <button
              key={option.mode}
              type="button"
              role="radio"
              aria-checked={isActive}
              className="dab-mode-card__option"
              data-active={isActive || undefined}
              onClick={() => onSelect(option.mode)}
            >
              <span className="dab-mode-card__phone">
                <img
                  src={option.image}
                  alt={option.alt}
                  className="dab-mode-card__phone-image"
                  draggable={false}
                />
              </span>
              <span className="dab-mode-card__label">
                <span
                  className="dab-mode-card__radio"
                  aria-hidden="true"
                  data-active={isActive || undefined}
                />
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BrightnessRow({
  value,
  onChange,
}: {
  value: number
  onChange: (next: number) => void
}) {
  return (
    <div className="dab-brightness-row">
      <span className="dab-brightness-row__icon" aria-hidden="true">
        <SunIcon dim />
      </span>
      <Slider
        value={value}
        onChange={onChange}
        min={0}
        max={100}
        block
        aria-label="亮度"
      />
      <span className="dab-brightness-row__icon" aria-hidden="true">
        <SunIcon />
      </span>
    </div>
  )
}

function SunIcon({ dim = false }: { dim?: boolean }) {
  const stroke = dim ? "rgba(0, 0, 0, 0.45)" : "rgba(0, 0, 0, 0.9)"
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r={dim ? "2.4" : "3.2"} fill={stroke} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="10"
          y1={dim ? "3.6" : "2.8"}
          x2="10"
          y2={dim ? "5.4" : "5"}
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
          transform={`rotate(${deg} 10 10)`}
        />
      ))}
    </svg>
  )
}

function ChevronRight() {
  return (
    <img
      src={iconArrowRightSmall}
      alt=""
      className="dab-row-chevron"
      aria-hidden="true"
    />
  )
}

function RowTitle({ children }: { children: ReactNode }) {
  return (
    <span style={{ color: FONT_PRIMARY, fontSize: 16, fontWeight: 500 }}>
      {children}
    </span>
  )
}

function RowValue({ children }: { children: ReactNode }) {
  return (
    <span style={{ color: FONT_SECONDARY, fontSize: 14 }}>{children}</span>
  )
}

function FootnoteText({ style }: { style?: CSSProperties }) {
  return (
    <p className="dab-footnote" style={style}>
      自动调节会根据环境光线智能优化显示亮度，帮助保护视力。
    </p>
  )
}

export interface DisplayAndBrightnessSettingsPageProps {
  defaultMode?: DisplayMode
}

export function DisplayAndBrightnessSettingsPage({
  defaultMode = "light",
}: DisplayAndBrightnessSettingsPageProps = {}) {
  const [mode, setMode] = useState<DisplayMode>(defaultMode)
  const [brightness, setBrightness] = useState(58)
  const [autoAdjust, setAutoAdjust] = useState(true)

  return (
    <SettingsContextListLayout
      statusBar={<StatusBar time="09:41" backgroundColor={PAGE_BG} />}
      titleBar={
        <TitleBar
          title="显示和亮度"
          subtitle=""
          leftIcon={iconChevronBack}
          backgroundColor={PAGE_BG}
          rightIcons={[]}
        />
      }
      background={PAGE_BG}
      theme="light"
      contextWidth="centered"
      context={
        <ModePreviewCard selected={mode} onSelect={setMode} />
      }
      listGroup={
        <>
          <List className="dab-list-card">
            <ListItem
              title={<RowTitle>亮度</RowTitle>}
              showArrow={false}
              border={false}
              right={null}
            />
            <div className="dab-slider-cell">
              <BrightnessRow value={brightness} onChange={setBrightness} />
            </div>
            <ListItem
              title={<RowTitle>自动调节</RowTitle>}
              subtitle={
                <span style={{ color: FONT_SECONDARY, fontSize: 12 }}>
                  根据环境光线自动调整屏幕亮度
                </span>
              }
              right={
                <Switch
                  modelValue={autoAdjust}
                  onUpdateModelValue={setAutoAdjust}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>

          <FootnoteText />

          <List className="dab-list-card">
            <ListItem
              title={<RowTitle>护眼模式</RowTitle>}
              right={
                <span className="dab-row-trailing">
                  <RowValue>已开启</RowValue>
                  <ChevronRight />
                </span>
              }
              showArrow={false}
            />
            <ListItem
              title={<RowTitle>字体大小与粗细</RowTitle>}
              right={
                <span className="dab-row-trailing">
                  <RowValue>标准</RowValue>
                  <ChevronRight />
                </span>
              }
              showArrow={false}
              border={false}
            />
          </List>

          <List className="dab-list-card">
            <ListItem
              title={<RowTitle>显示尺寸</RowTitle>}
              right={
                <span className="dab-row-trailing">
                  <RowValue>默认</RowValue>
                  <ChevronRight />
                </span>
              }
              showArrow={false}
              border={false}
            />
          </List>
        </>
      }
      showFooter={false}
    />
  )
}

export default DisplayAndBrightnessSettingsPage

export { BRAND_BLUE }
