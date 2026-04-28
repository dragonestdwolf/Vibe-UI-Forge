"use client"

import { useMemo, useState } from "react"
import { FeaturePromoCard } from "@/component/FeaturePromoCard"
import { List, ListItem } from "@/component/List"
import { SliderBase } from "@/component/Slider"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"
import { cn } from "@/lib/utils"
import { ChevronRight, MoonStar, Sparkles, SunMedium } from "lucide-react"

import "./index.css"

type DisplayMode = "light" | "dark"

const modeMeta: Record<
  DisplayMode,
  {
    title: string
    subtitle: string
    badge: string
    description: string
  }
> = {
  light: {
    title: "浅色模式",
    subtitle: "界面更明亮，白天浏览更通透",
    badge: "通透清亮",
    description: "适合强光环境与高频浏览",
  },
  dark: {
    title: "深色模式",
    subtitle: "降低炫光刺激，夜间阅读更柔和",
    badge: "夜间舒缓",
    description: "适合低照度环境与晚间使用",
  },
}

function ModeGlyph({
  mode,
  hero = false,
}: {
  mode: DisplayMode
  hero?: boolean
}) {
  return (
    <div
      className={cn(
        "display-brightness-settings-v2__glyph",
        `display-brightness-settings-v2__glyph--${mode}`,
        hero && "display-brightness-settings-v2__glyph--hero"
      )}
      aria-hidden="true"
    >
      <div className="display-brightness-settings-v2__glyph-core">
        {mode === "light" ? (
          <SunMedium size={hero ? 30 : 18} strokeWidth={1.9} />
        ) : (
          <MoonStar size={hero ? 30 : 18} strokeWidth={1.9} />
        )}
      </div>
      <div className="display-brightness-settings-v2__glyph-orbit" />
    </div>
  )
}

function ModeChip({
  mode,
  selected,
  onSelect,
}: {
  mode: DisplayMode
  selected: boolean
  onSelect: (mode: DisplayMode) => void
}) {
  const meta = modeMeta[mode]

  return (
    <button
      type="button"
      className={cn(
        "display-brightness-settings-v2__mode-chip",
        selected && "display-brightness-settings-v2__mode-chip--selected"
      )}
      aria-pressed={selected}
      onClick={() => onSelect(mode)}
    >
      <div className="display-brightness-settings-v2__mode-chip-preview">
        <ModeGlyph mode={mode} />
        <div className="display-brightness-settings-v2__mode-chip-lines">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="display-brightness-settings-v2__mode-chip-copy">
        <span className="display-brightness-settings-v2__mode-chip-title">
          {meta.title}
        </span>
        <span className="display-brightness-settings-v2__mode-chip-description">
          {meta.badge}
        </span>
      </div>
    </button>
  )
}

function RightValue({ value }: { value: string }) {
  return (
    <div className="display-brightness-settings-v2__right-value">
      <span className="display-brightness-settings-v2__right-text">{value}</span>
      <ChevronRight size={16} strokeWidth={1.85} className="text-black/30" />
    </div>
  )
}

export default function DisplayBrightnessSettingsV2() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("dark")
  const [brightness, setBrightness] = useState(68)
  const [autoBrightness, setAutoBrightness] = useState(true)
  const [darkScheduleIndex, setDarkScheduleIndex] = useState(1)
  const [eyeComfortIndex, setEyeComfortIndex] = useState(0)
  const [fontScaleIndex, setFontScaleIndex] = useState(1)

  const darkSchedules = ["手动切换", "日落到日出", "自定时间"]
  const eyeComfortModes = ["全天开启", "日落到日出", "关闭"]
  const fontScales = ["紧凑", "标准", "舒展"]

  const activeMode = modeMeta[displayMode]
  const brightnessSummary = useMemo(() => {
    if (brightness < 35) return "适合夜间环境"
    if (brightness < 75) return "当前亮度较为舒适"
    return "适合强光环境"
  }, [brightness])

  return (
    <div className="display-brightness-settings-v2">
      <div className="display-brightness-settings-v2__device">
        <StatusBar time="08:08" backgroundColor="transparent" />

        <div className="display-brightness-settings-v2__shell">
          <TitleBar
            title="显示和亮度"
            subtitle=""
            rightIcons={[]}
            backgroundColor="transparent"
          />

          <main className="display-brightness-settings-v2__content">
            <section className="display-brightness-settings-v2__hero">
              <div className="display-brightness-settings-v2__hero-header">
                <div>
                  <p className="display-brightness-settings-v2__eyebrow">显示模式</p>
                  <h2 className="display-brightness-settings-v2__hero-title">
                    让屏幕跟着环境切换到更舒服的状态
                  </h2>
                </div>

                <div className="display-brightness-settings-v2__hero-badge">
                  <Sparkles size={14} strokeWidth={1.9} />
                  <span>{activeMode.badge}</span>
                </div>
              </div>

              <FeaturePromoCard
                className="display-brightness-settings-v2__promo-card"
                icon={<ModeGlyph mode={displayMode} hero />}
                title={activeMode.title}
                subtitle={activeMode.subtitle}
                actionLabel="当前启用"
                actionDisabled
              />

              <div className="display-brightness-settings-v2__mode-row">
                <ModeChip
                  mode="light"
                  selected={displayMode === "light"}
                  onSelect={setDisplayMode}
                />
                <ModeChip
                  mode="dark"
                  selected={displayMode === "dark"}
                  onSelect={setDisplayMode}
                />
              </div>

              <p className="display-brightness-settings-v2__hero-note">
                {activeMode.description}
              </p>
            </section>

            <List className="display-brightness-settings-v2__panel">
              <section className="display-brightness-settings-v2__brightness-block">
                <div className="display-brightness-settings-v2__brightness-top">
                  <div>
                    <div className="display-brightness-settings-v2__brightness-label">
                      屏幕亮度
                    </div>
                    <p className="display-brightness-settings-v2__brightness-copy">
                      根据当前内容和环境获得更自然的观感
                    </p>
                  </div>

                  <div className="display-brightness-settings-v2__brightness-value">
                    {brightness}%
                  </div>
                </div>

                <div className="display-brightness-settings-v2__slider-wrap">
                  <span className="display-brightness-settings-v2__slider-side">暗</span>
                  <div className="display-brightness-settings-v2__slider-main">
                    <SliderBase
                      modelValue={brightness}
                      onUpdateModelValue={setBrightness}
                    />
                  </div>
                  <span className="display-brightness-settings-v2__slider-side">亮</span>
                </div>

                <div className="display-brightness-settings-v2__brightness-summary">
                  {brightnessSummary}
                </div>
              </section>

              <ListItem
                title={<span className="font-medium">深色模式</span>}
                subtitle="夜间界面与对比度策略"
                right={<RightValue value={darkSchedules[darkScheduleIndex]} />}
                showArrow={false}
                onClick={() =>
                  setDarkScheduleIndex((current) => (current + 1) % darkSchedules.length)
                }
              />

              <ListItem
                title={<span className="font-medium">自动调节</span>}
                subtitle="结合环境光自动优化亮度"
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

            <List className="display-brightness-settings-v2__panel">
              <ListItem
                title={<span className="font-medium">护眼模式</span>}
                subtitle="减少偏蓝光，阅读更柔和"
                right={<RightValue value={eyeComfortModes[eyeComfortIndex]} />}
                showArrow={false}
                onClick={() =>
                  setEyeComfortIndex((current) => (current + 1) % eyeComfortModes.length)
                }
              />

              <ListItem
                title={<span className="font-medium">字体大小与界面缩放</span>}
                subtitle="调整文字、列表和系统界面的疏密"
                right={<RightValue value={fontScales[fontScaleIndex]} />}
                showArrow={false}
                onClick={() =>
                  setFontScaleIndex((current) => (current + 1) % fontScales.length)
                }
              />

              <ListItem
                title={<span className="font-medium">休眠时间</span>}
                subtitle="无操作后自动关闭屏幕"
                right={<RightValue value="30 秒" />}
                showArrow={false}
                border={false}
              />
            </List>
          </main>

          <footer className="display-brightness-settings-v2__footer">
            <div className="display-brightness-settings-v2__home-indicator" />
          </footer>
        </div>
      </div>
    </div>
  )
}
