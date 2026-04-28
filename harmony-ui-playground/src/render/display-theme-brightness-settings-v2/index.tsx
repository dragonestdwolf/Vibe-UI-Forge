"use client"

import { useMemo, useState, type CSSProperties, type ReactNode } from "react"
import {
  Clock3,
  Eye,
  Lightbulb,
  MonitorSmartphone,
  Moon,
  Sparkles,
  Sun,
  SunDim,
  TextCursorInput,
} from "lucide-react"

import { GroupedListSection } from "@/blocks/grouped-list-section"
import phonePreviewDark from "@/blocks/assets/pixso-icons/icon-setting-dark.png"
import phonePreviewLight from "@/blocks/assets/pixso-icons/icon-setting-light.png"
import { List, ListItem } from "@/component/List"
import { SliderWithIcons } from "@/component/Slider"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"
import { SettingsContextListLayout } from "@/layouts/SettingsContextListLayout"

import "./index.css"

type AppearanceMode = "light" | "dark"

function IconTile({ children }: { children: ReactNode }) {
  return <span className="display-theme-settings__icon-tile">{children}</span>
}

function ModeOption({
  mode,
  active,
  title,
  description,
  previewSrc,
  onSelect,
}: {
  mode: AppearanceMode
  active: boolean
  title: string
  description: string
  previewSrc: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className="display-theme-settings__mode-option"
      data-mode={mode}
      data-active={active || undefined}
      aria-pressed={active}
      onClick={onSelect}
    >
      <span className="display-theme-settings__mode-phone" aria-hidden="true">
        <img src={previewSrc} alt="" />
      </span>
      <span className="display-theme-settings__mode-copy">
        <span className="display-theme-settings__mode-title">
          {mode === "light" ? <Sun /> : <Moon />}
          {title}
        </span>
        <span className="display-theme-settings__mode-description">
          {description}
        </span>
      </span>
      <span className="display-theme-settings__mode-check" aria-hidden="true" />
    </button>
  )
}

export function DisplayThemeBrightnessSettingsV2() {
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>("light")
  const [brightness, setBrightness] = useState(72)
  const [autoBrightness, setAutoBrightness] = useState(true)
  const [scheduledSwitch, setScheduledSwitch] = useState(false)
  const [eyeComfort, setEyeComfort] = useState(false)

  const isDark = appearanceMode === "dark"
  const pageBackground = isDark ? "#000000" : "#F1F3F5"
  const previewBrightness = useMemo(() => {
    return `${0.76 + brightness / 100 * 0.34}`
  }, [brightness])

  const previewStyle = {
    "--display-preview-brightness": previewBrightness,
  } as CSSProperties

  return (
    <SettingsContextListLayout
      theme={appearanceMode}
      background={pageBackground}
      statusBar={
        <StatusBar
          mode={appearanceMode}
          time="09:41"
          backgroundColor={pageBackground}
        />
      }
      titleBar={
        <TitleBar
          title="显示与亮度"
          subtitle=""
          backgroundColor={pageBackground}
          right={
            <span className="display-theme-settings__title-value">
              {brightness}%
            </span>
          }
        />
      }
      contextWidth="centered"
      context={
        <section
          className="display-theme-settings__preview-card"
          style={previewStyle}
          aria-label="深浅模式预览"
        >
          <div className="display-theme-settings__preview-top">
            <div>
              <p className="display-theme-settings__eyebrow">当前外观</p>
              <h2>{isDark ? "深色模式" : "浅色模式"}</h2>
            </div>
            <span className="display-theme-settings__brightness-pill">
              <SunDim />
              {brightness}%
            </span>
          </div>

          <div className="display-theme-settings__mode-grid">
            <ModeOption
              mode="light"
              active={!isDark}
              title="浅色"
              description="明亮清晰"
              previewSrc={phonePreviewLight}
              onSelect={() => setAppearanceMode("light")}
            />
            <ModeOption
              mode="dark"
              active={isDark}
              title="深色"
              description="低光舒适"
              previewSrc={phonePreviewDark}
              onSelect={() => setAppearanceMode("dark")}
            />
          </div>
        </section>
      }
      listGroup={
        <>
          <GroupedListSection subtitle="外观模式" theme={appearanceMode}>
            <List>
              <ListItem
                left={
                  <IconTile>
                    <MonitorSmartphone />
                  </IconTile>
                }
                title="手动选择"
                subtitle={isDark ? "当前使用深色界面" : "当前使用浅色界面"}
                rightText={isDark ? "深色" : "浅色"}
                showArrow={false}
              />
              <ListItem
                left={
                  <IconTile>
                    <Clock3 />
                  </IconTile>
                }
                title="定时切换"
                subtitle="日落后自动进入深色模式"
                right={
                  <Switch
                    modelValue={scheduledSwitch}
                    onUpdateModelValue={setScheduledSwitch}
                  />
                }
                showArrow={false}
                border={false}
              />
            </List>
          </GroupedListSection>

          <GroupedListSection
            subtitle="屏幕亮度"
            theme={appearanceMode}
            footnote="开启自动调节后，系统会根据环境光线和你的使用习惯微调亮度。"
          >
            <List>
              <ListItem
                left={
                  <IconTile>
                    <Lightbulb />
                  </IconTile>
                }
                title="亮度"
                rightText={`${brightness}%`}
                showArrow={false}
              />
              <div className="display-theme-settings__slider-row">
                <SliderWithIcons
                  modelValue={brightness}
                  onUpdateModelValue={setBrightness}
                  min={0}
                  max={100}
                  step={1}
                  leftIcon={<SunDim />}
                  rightIcon={<Sun />}
                  aria-label="屏幕亮度"
                />
              </div>
              <ListItem
                left={
                  <IconTile>
                    <Sparkles />
                  </IconTile>
                }
                title="自动调节"
                subtitle="跟随环境光线"
                right={
                  <Switch
                    modelValue={autoBrightness}
                    onUpdateModelValue={setAutoBrightness}
                  />
                }
                showArrow={false}
                border={false}
              />
            </List>
          </GroupedListSection>

          <GroupedListSection subtitle="舒适显示" theme={appearanceMode}>
            <List>
              <ListItem
                left={
                  <IconTile>
                    <Eye />
                  </IconTile>
                }
                title="护眼模式"
                subtitle="减少蓝光并调整屏幕色温"
                right={
                  <Switch
                    modelValue={eyeComfort}
                    onUpdateModelValue={setEyeComfort}
                  />
                }
                showArrow={false}
              />
              <ListItem
                left={
                  <IconTile>
                    <TextCursorInput />
                  </IconTile>
                }
                title="字体与显示大小"
                subtitle="文字大小、粗细和显示比例"
                rightText="标准"
                border={false}
              />
            </List>
          </GroupedListSection>
        </>
      }
    />
  )
}

export default DisplayThemeBrightnessSettingsV2
