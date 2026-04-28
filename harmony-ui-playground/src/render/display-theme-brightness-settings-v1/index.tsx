"use client"

import { type ReactNode, useState } from "react"
import { Image, Moon, Sparkles, Sun } from "lucide-react"

import { List, ListItem } from "@/component/List"
import { SliderBase } from "@/component/Slider"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"
import GroupedListSection from "@/blocks/grouped-list-section"
import { SettingsContextListLayout } from "@/layouts/SettingsContextListLayout"

import "./index.css"

type DisplayMode = "light" | "dark"

const LIGHT_CANVAS = "#F1F3F5"
const DARK_CANVAS = "#000000"
const BRAND_BLUE = "#0A59F7"

function createIconDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function createBackIcon(color: string) {
  return createIconDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M15 5L8 12L15 19" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`
  )
}

function createMoreIcon(color: string) {
  return createIconDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="1.8" fill="${color}" />
      <circle cx="12" cy="12" r="1.8" fill="${color}" />
      <circle cx="18" cy="12" r="1.8" fill="${color}" />
    </svg>`
  )
}

function getBrightnessLabel(value: number) {
  if (value < 30) return "柔和夜读"
  if (value < 70) return "室内舒适"
  return "户外清晰"
}

function getModeLabel(mode: DisplayMode) {
  return mode === "dark" ? "深色模式" : "浅色模式"
}

function getModeDescription(mode: DisplayMode) {
  return mode === "dark"
    ? "降低强光刺激，让夜间浏览更沉静。"
    : "保持界面明亮通透，适合白天使用。"
}

function SettingIconTile({
  mode,
  icon,
}: {
  mode: DisplayMode
  icon: ReactNode
}) {
  return (
    <span
      className={`display-theme-settings__icon-tile display-theme-settings__icon-tile--${mode}`}
      aria-hidden="true"
    >
      {icon}
    </span>
  )
}

function DisplayPreviewCard({
  mode,
  brightness,
  autoBrightness,
  onModeChange,
}: {
  mode: DisplayMode
  brightness: number
  autoBrightness: boolean
  onModeChange: (mode: DisplayMode) => void
}) {
  const isDark = mode === "dark"

  return (
    <section
      className={`display-theme-settings__preview-card display-theme-settings__preview-card--${mode}`}
    >
      <div className="display-theme-settings__preview-header">
        <div className="display-theme-settings__preview-copy">
          <p className="display-theme-settings__eyebrow">屏幕外观</p>
          <h2>{getModeLabel(mode)}</h2>
          <p>{getModeDescription(mode)}</p>
        </div>

        <span className="display-theme-settings__preview-badge">
          {autoBrightness ? "自动亮度" : "手动亮度"}
        </span>
      </div>

      <div className="display-theme-settings__preview-stage">
        <div
          className={`display-theme-settings__ambient-glow display-theme-settings__ambient-glow--${mode}`}
        />

        <div className="display-theme-settings__phone-shell">
          <div
            className={`display-theme-settings__phone-screen display-theme-settings__phone-screen--${mode}`}
            style={{
              filter: `brightness(${0.55 + brightness / 100})`,
            }}
          >
            <div className="display-theme-settings__phone-status">
              <span />
              <span />
              <span />
            </div>

            <div className="display-theme-settings__screen-card">
              <div className="display-theme-settings__screen-card-label">
                {isDark ? "夜间阅读" : "白天浏览"}
              </div>
              <div className="display-theme-settings__screen-card-title">
                {brightness}%
              </div>
              <div className="display-theme-settings__screen-card-subtitle">
                {getBrightnessLabel(brightness)}
              </div>
            </div>

            <div className="display-theme-settings__app-grid">
              {["a", "b", "c", "d"].map((item) => (
                <span key={item} className="display-theme-settings__app-tile" />
              ))}
            </div>

            <div className="display-theme-settings__dock">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      <div className="display-theme-settings__mode-segment" role="group" aria-label="显示模式">
        {(["light", "dark"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={`display-theme-settings__mode-pill ${
              item === mode ? "is-active" : ""
            }`}
            onClick={() => onModeChange(item)}
            aria-pressed={item === mode}
          >
            {item === "light" ? "浅色" : "深色"}
          </button>
        ))}
      </div>

      <div className="display-theme-settings__metric-row">
        <div>
          <div className="display-theme-settings__metric-label">当前亮度</div>
          <div className="display-theme-settings__metric-value">{brightness}%</div>
        </div>
        <div className="display-theme-settings__metric-chip">
          {getBrightnessLabel(brightness)}
        </div>
      </div>
    </section>
  )
}

export default function DisplayThemeBrightnessSettingsV1() {
  const [mode, setMode] = useState<DisplayMode>("light")
  const [brightness, setBrightness] = useState(62)
  const [autoBrightness, setAutoBrightness] = useState(true)
  const [sunlightReadable, setSunlightReadable] = useState(true)
  const [autoDarkAtSunset, setAutoDarkAtSunset] = useState(false)
  const [dimWallpaper, setDimWallpaper] = useState(true)

  const isDark = mode === "dark"
  const background = isDark ? DARK_CANVAS : LIGHT_CANVAS
  const iconColor = isDark ? "#FFFFFF" : "#000000"
  const inactiveSwitchColor = isDark
    ? "rgba(255, 255, 255, 0.16)"
    : "rgba(0, 0, 0, 0.1)"
  const inactiveSliderColor = isDark
    ? "rgba(255, 255, 255, 0.14)"
    : "rgba(0, 0, 0, 0.1)"

  return (
    <SettingsContextListLayout
      className={`display-theme-settings display-theme-settings--${mode}`}
      theme={mode}
      background={background}
      statusBar={
        <StatusBar
          mode={mode}
          time="09:41"
          backgroundColor={background}
        />
      }
      titleBar={
        <TitleBar
          title="显示和亮度"
          subtitle=""
          leftIcon={createBackIcon(iconColor)}
          rightIcons={[createMoreIcon(iconColor)]}
          backgroundColor={background}
        />
      }
      context={
        <div className="display-theme-settings__context-stack">
          <p className="scl-header-subtitle">
            在不同光线环境下切换深浅模式，并把屏幕亮度调到你觉得最舒服的状态。
          </p>

          <DisplayPreviewCard
            mode={mode}
            brightness={brightness}
            autoBrightness={autoBrightness}
            onModeChange={setMode}
          />
        </div>
      }
      listGroup={
        <>
          <GroupedListSection
            subtitle="亮度调节"
            footnote="自动亮度会综合当前环境光、使用场景和电量状态做平衡。"
            theme={mode}
          >
            <List className="display-theme-settings__list">
              <div className="display-theme-settings__slider-block">
                <div className="display-theme-settings__slider-head">
                  <span className="display-theme-settings__slider-title">亮度</span>
                  <span className="display-theme-settings__slider-value">
                    {brightness}%
                  </span>
                </div>

                <div className="display-theme-settings__slider-row">
                  <Sun
                    size={18}
                    strokeWidth={1.8}
                    className="display-theme-settings__slider-sun"
                    aria-hidden="true"
                  />
                  <SliderBase
                    modelValue={brightness}
                    onUpdateModelValue={setBrightness}
                    activeColor={BRAND_BLUE}
                    inactiveColor={inactiveSliderColor}
                    thumbColor="#FFFFFF"
                  />
                  <Sun
                    size={22}
                    strokeWidth={1.8}
                    className="display-theme-settings__slider-sun display-theme-settings__slider-sun--large"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <ListItem
                left={
                  <SettingIconTile
                    mode={mode}
                    icon={<Sun size={18} strokeWidth={1.8} />}
                  />
                }
                title="自动亮度"
                subtitle="根据环境光自动调整到更舒适的亮度"
                right={
                  <Switch
                    modelValue={autoBrightness}
                    onUpdateModelValue={setAutoBrightness}
                    activeColor={BRAND_BLUE}
                    inactiveColor={inactiveSwitchColor}
                  />
                }
                showArrow={false}
              />

              <ListItem
                left={
                  <SettingIconTile
                    mode={mode}
                    icon={<Sparkles size={18} strokeWidth={1.8} />}
                  />
                }
                title="阳光下增强显示"
                subtitle="强光环境下提升可读性与对比度"
                right={
                  <Switch
                    modelValue={sunlightReadable}
                    onUpdateModelValue={setSunlightReadable}
                    activeColor={BRAND_BLUE}
                    inactiveColor={inactiveSwitchColor}
                  />
                }
                showArrow={false}
                border={false}
              />
            </List>
          </GroupedListSection>

          <GroupedListSection subtitle="外观偏好" theme={mode}>
            <List className="display-theme-settings__list">
              <ListItem
                left={
                  <SettingIconTile
                    mode={mode}
                    icon={
                      isDark ? (
                        <Moon size={18} strokeWidth={1.8} />
                      ) : (
                        <Sun size={18} strokeWidth={1.8} />
                      )
                    }
                  />
                }
                title="当前模式"
                rightText={getModeLabel(mode)}
                showArrow={false}
              />

              <ListItem
                left={
                  <SettingIconTile
                    mode={mode}
                    icon={<Moon size={18} strokeWidth={1.8} />}
                  />
                }
                title="日落后自动开启"
                subtitle="在夜晚自动切换到深色模式"
                right={
                  <Switch
                    modelValue={autoDarkAtSunset}
                    onUpdateModelValue={setAutoDarkAtSunset}
                    activeColor={BRAND_BLUE}
                    inactiveColor={inactiveSwitchColor}
                  />
                }
                showArrow={false}
              />

              <ListItem
                left={
                  <SettingIconTile
                    mode={mode}
                    icon={<Image size={18} strokeWidth={1.8} />}
                  />
                }
                title="深色壁纸"
                subtitle="跟随深色模式降低壁纸高光和眩光"
                right={
                  <Switch
                    modelValue={dimWallpaper}
                    onUpdateModelValue={setDimWallpaper}
                    activeColor={BRAND_BLUE}
                    inactiveColor={inactiveSwitchColor}
                  />
                }
                showArrow={false}
                border={false}
              />
            </List>
          </GroupedListSection>
        </>
      }
      footer="部分应用需要重新打开后，才会完整应用新的模式和亮度策略。"
      showFooter
    />
  )
}
