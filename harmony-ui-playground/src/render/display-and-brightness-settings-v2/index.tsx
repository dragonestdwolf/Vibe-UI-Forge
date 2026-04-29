import { useState, type ReactNode } from "react"

import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { SubHeader } from "@/component/SubHeader"
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
    <div className="dabv2-mode-card" role="radiogroup" aria-label="显示模式">
      <div className="dabv2-mode-card__row">
        {MODE_OPTIONS.map((option) => {
          const isActive = selected === option.mode
          return (
            <button
              key={option.mode}
              type="button"
              role="radio"
              aria-checked={isActive}
              className="dabv2-mode-card__option"
              data-active={isActive || undefined}
              onClick={() => onSelect(option.mode)}
            >
              <span
                className="dabv2-mode-card__phone"
                data-mode={option.mode}
              >
                <img
                  src={option.image}
                  alt={option.alt}
                  className="dabv2-mode-card__phone-image"
                  draggable={false}
                />
              </span>
              <span className="dabv2-mode-card__label-row">
                <span
                  className="dabv2-mode-card__radio"
                  data-active={isActive || undefined}
                  aria-hidden="true"
                />
                <span className="dabv2-mode-card__label">{option.label}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
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

function ChevronRight() {
  return (
    <img
      src={iconArrowRightSmall}
      alt=""
      className="dabv2-row-chevron"
      aria-hidden="true"
    />
  )
}

function BrightnessSliderRow({
  value,
  onChange,
}: {
  value: number
  onChange: (next: number) => void
}) {
  return (
    <div className="dabv2-brightness-row">
      <span className="dabv2-brightness-row__cap">亮</span>
      <Slider
        value={value}
        onChange={onChange}
        min={0}
        max={100}
        block
        aria-label="亮度"
        className="dabv2-brightness-row__slider"
      />
      <span className="dabv2-brightness-row__cap">暗</span>
    </div>
  )
}

export interface DisplayAndBrightnessSettingsPageV2Props {
  defaultMode?: DisplayMode
}

export function DisplayAndBrightnessSettingsPageV2({
  defaultMode = "light",
}: DisplayAndBrightnessSettingsPageV2Props = {}) {
  const [mode, setMode] = useState<DisplayMode>(defaultMode)
  const [brightness, setBrightness] = useState(42)
  const [autoAdjust, setAutoAdjust] = useState(true)

  return (
    <SettingsContextListLayout
      statusBar={<StatusBar time="08:08" backgroundColor={PAGE_BG} />}
      titleBar={
        <TitleBar
          title="显示和亮度"
          subtitle=""
          leftIcon={iconChevronBack}
          backgroundColor={PAGE_BG}
          rightIcons={[]}
          className="dabv2-title-bar"
        />
      }
      background={PAGE_BG}
      theme="light"
      contextWidth="centered"
      context={
        <div className="dabv2-mode-section">
          <SubHeader
            leftMode="text"
            rightMode="none"
            text="显示模式"
            className="dabv2-mode-subheader"
          />
          <ModePreviewCard selected={mode} onSelect={setMode} />
        </div>
      }
      listGroup={
        <>
          <List className="dabv2-list-card">
            <ListItem
              title={<RowTitle>深色模式</RowTitle>}
              right={
                <span className="dabv2-row-trailing">
                  <RowValue>定时开启</RowValue>
                  <ChevronRight />
                </span>
              }
              showArrow={false}
              border={false}
            />
          </List>

          <List className="dabv2-list-card">
            <div className="dabv2-slider-cell">
              <BrightnessSliderRow
                value={brightness}
                onChange={setBrightness}
              />
            </div>
            <ListItem
              title={<RowTitle>自动调节</RowTitle>}
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

          <List className="dabv2-list-card">
            <ListItem
              title={<RowTitle>护眼模式</RowTitle>}
              right={
                <span className="dabv2-row-trailing">
                  <RowValue>全天开启</RowValue>
                  <ChevronRight />
                </span>
              }
              showArrow={false}
              border={false}
            />
          </List>

          <List className="dabv2-list-card">
            <ListItem
              title={<RowTitle>字体大小和界面缩放</RowTitle>}
              right={<ChevronRight />}
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

export default DisplayAndBrightnessSettingsPageV2
