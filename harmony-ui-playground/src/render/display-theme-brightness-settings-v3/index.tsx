"use client"

import { useMemo, useState, type CSSProperties } from "react"
import {
  Check,
  Clock3,
  Eye,
  Lightbulb,
  Moon,
  Palette,
  Smartphone,
  Sparkles,
  Sun,
  type LucideIcon,
} from "lucide-react"

import { GroupedListSection } from "@/blocks/grouped-list-section"
import { FeaturePromoCard } from "@/component/FeaturePromoCard"
import { List, ListItem } from "@/component/List"
import { SettingsContextListLayout } from "@/layouts/SettingsContextListLayout"
import { Slider } from "@/component/Slider"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"
import phonePreviewDark from "../../blocks/assets/pixso-icons/icon-setting-dark.png"
import phonePreviewLight from "../../blocks/assets/pixso-icons/icon-setting-light.png"

import "./index.css"

type DisplayTheme = "light" | "dark"

interface IconTileProps {
  icon: LucideIcon
}

function IconTile({ icon: Icon }: IconTileProps) {
  return (
    <span className="display-settings-icon-tile" aria-hidden="true">
      <Icon className="display-settings-icon" strokeWidth={1.7} />
    </span>
  )
}

interface ThemeChoiceProps {
  label: string
  active: boolean
}

function ThemeChoice({ label, active }: ThemeChoiceProps) {
  return (
    <span className="display-settings-choice">
      <span>{label}</span>
      {active ? <Check className="display-settings-check" strokeWidth={2} /> : null}
    </span>
  )
}

function DisplayThemePreview({
  theme,
  brightness,
  onToggleTheme,
}: {
  theme: DisplayTheme
  brightness: number
  onToggleTheme: () => void
}) {
  const brightnessStyle = {
    "--display-brightness": `${brightness}%`,
    "--display-brightness-filter": `${0.68 + (brightness / 100) * 0.42}`,
    "--display-dim-opacity": `${Math.max(0, (100 - brightness) / 145)}`,
  } as CSSProperties

  return (
    <FeaturePromoCard
      className="display-settings-preview-card"
      title={theme === "dark" ? "深色模式" : "浅色模式"}
      subtitle={`亮度 ${brightness}%`}
      actionLabel={theme === "dark" ? "切换浅色" : "切换深色"}
      onAction={onToggleTheme}
      icon={
        <div className="display-settings-phone-stack" style={brightnessStyle}>
          <img
            src={phonePreviewLight}
            alt=""
            className="display-settings-phone display-settings-phone--light"
            data-active={theme === "light" || undefined}
          />
          <img
            src={phonePreviewDark}
            alt=""
            className="display-settings-phone display-settings-phone--dark"
            data-active={theme === "dark" || undefined}
          />
          <span className="display-settings-brightness-mask" aria-hidden="true" />
        </div>
      }
    />
  )
}

export function DisplayThemeBrightnessSettingsV3() {
  const [theme, setTheme] = useState<DisplayTheme>("light")
  const [brightness, setBrightness] = useState(68)
  const [autoBrightness, setAutoBrightness] = useState(true)
  const [eyeComfort, setEyeComfort] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [adaptiveTone, setAdaptiveTone] = useState(true)

  const isDark = theme === "dark"
  const background = isDark ? "#000000" : "#F1F3F5"
  const modeLabel = isDark ? "深色" : "浅色"
  const sliderLabel = useMemo(() => `${brightness}%`, [brightness])

  const switchTheme = (nextTheme: DisplayTheme) => {
    setTheme(nextTheme)
  }

  return (
    <SettingsContextListLayout
      className="display-theme-brightness-settings"
      data-theme={theme}
      theme={theme}
      background={background}
      minHeight={800}
      statusBar={
        <StatusBar
          time="09:41"
          mode={theme}
          backgroundColor={background}
        />
      }
      titleBar={
        <TitleBar
          title="显示与亮度"
          subtitle=""
          leftIcon={iconChevronBack}
          rightIcons={[]}
          backgroundColor={background}
        />
      }
      context={
        <DisplayThemePreview
          theme={theme}
          brightness={brightness}
          onToggleTheme={() => switchTheme(isDark ? "light" : "dark")}
        />
      }
      contextWidth="centered"
      listGroup={
        <>
          <GroupedListSection theme={theme} subtitle="外观">
            <List>
              <ListItem
                left={<IconTile icon={Sun} />}
                title="浅色模式"
                right={<ThemeChoice label="白天使用" active={!isDark} />}
                showArrow={false}
                onClick={() => switchTheme("light")}
              />
              <ListItem
                left={<IconTile icon={Moon} />}
                title="深色模式"
                right={<ThemeChoice label="夜间护眼" active={isDark} />}
                showArrow={false}
                onClick={() => switchTheme("dark")}
                border={false}
              />
            </List>
          </GroupedListSection>

          <GroupedListSection
            theme={theme}
            subtitle="亮度"
            footnote="自动调节会根据环境光线微调屏幕亮度，也会保留你最近一次手动调节的偏好。"
          >
            <List>
              <ListItem
                left={<IconTile icon={Lightbulb} />}
                title="亮度"
                right={<span className="display-settings-value">{sliderLabel}</span>}
                showArrow={false}
              />
              <ListItem
                className="display-settings-slider-item"
                title={
                  <Slider
                    type="icon"
                    value={brightness}
                    min={15}
                    max={100}
                    step={1}
                    block
                    leadingIcon={<Sun className="display-settings-slider-icon" />}
                    trailingIcon={<Sun className="display-settings-slider-icon" />}
                    aria-label="屏幕亮度"
                    onChange={setBrightness}
                  />
                }
                role="group"
                tabIndex={-1}
                showArrow={false}
                border={false}
              />
            </List>
          </GroupedListSection>

          <GroupedListSection theme={theme} subtitle="舒适显示">
            <List>
              <ListItem
                left={<IconTile icon={Sparkles} />}
                title="自动调节"
                subtitle={`当前为${modeLabel}模式，系统将平衡可读性与续航`}
                right={
                  <Switch
                    modelValue={autoBrightness}
                    onUpdateModelValue={setAutoBrightness}
                  />
                }
                showArrow={false}
              />
              <ListItem
                left={<IconTile icon={Eye} />}
                title="护眼模式"
                subtitle="降低蓝光并让色温更柔和"
                right={
                  <Switch
                    modelValue={eyeComfort}
                    onUpdateModelValue={setEyeComfort}
                  />
                }
                showArrow={false}
              />
              <ListItem
                left={<IconTile icon={Palette} />}
                title="自然色彩显示"
                subtitle="跟随环境光调整屏幕色温"
                right={
                  <Switch
                    modelValue={adaptiveTone}
                    onUpdateModelValue={setAdaptiveTone}
                  />
                }
                showArrow={false}
              />
              <ListItem
                left={<IconTile icon={Clock3} />}
                title="定时切换深色模式"
                right={
                  <Switch
                    modelValue={scheduled}
                    onUpdateModelValue={setScheduled}
                  />
                }
                showArrow={false}
                border={false}
              />
            </List>
          </GroupedListSection>

          <GroupedListSection theme={theme} subtitle="设备">
            <List>
              <ListItem
                left={<IconTile icon={Smartphone} />}
                title="屏幕刷新率"
                rightText="智能"
                border={false}
              />
            </List>
          </GroupedListSection>
        </>
      }
    />
  )
}

export default DisplayThemeBrightnessSettingsV3
