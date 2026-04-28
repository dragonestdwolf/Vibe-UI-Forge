"use client"

import { useMemo, useState } from "react"
import { List, ListItem } from "@/component/List"
import { SliderBase } from "@/component/Slider"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"
import { cn } from "@/lib/utils"
import previewDark from "@/blocks/assets/pixso-icons/icon-setting-dark.png"
import previewLight from "@/blocks/assets/pixso-icons/icon-setting-light.png"
import iconArrowRightSmall from "@/blocks/assets/pixso-icons/icon-arrow-right-small.png"

import "./index.css"

type DisplayMode = "light" | "dark"

const modeOptions: Array<{
  id: DisplayMode
  title: string
  caption: string
  summary: string
  asset: string
}> = [
  {
    id: "light",
    title: "浅色模式",
    caption: "白天浏览更通透",
    summary: "界面更明亮，信息轮廓更清晰。",
    asset: previewLight,
  },
  {
    id: "dark",
    title: "深色模式",
    caption: "夜间阅读更柔和",
    summary: "降低眩光刺激，暗光环境更舒适。",
    asset: previewDark,
  },
]

const darkModePolicies = ["日落到日出", "定时开启", "手动开启"]
const eyeComfortPolicies = ["全天开启", "日落到日出", "关闭"]
const fontScalePolicies = ["标准", "偏大", "紧凑"]

function RightValue({ value }: { value: string }) {
  return (
    <div className="display-brightness-settings-v3__right-value">
      <span className="display-brightness-settings-v3__right-text">{value}</span>
      <img
        src={iconArrowRightSmall}
        alt=""
        className="display-brightness-settings-v3__right-arrow"
      />
    </div>
  )
}

function ModeOption({
  selected,
  title,
  caption,
  asset,
  onClick,
}: {
  selected: boolean
  title: string
  caption: string
  asset: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "display-brightness-settings-v3__mode-option",
        selected && "display-brightness-settings-v3__mode-option--selected"
      )}
      onClick={onClick}
    >
      <div className="display-brightness-settings-v3__mode-frame">
        <img
          src={asset}
          alt=""
          className="display-brightness-settings-v3__mode-image"
        />
      </div>

      <div className="display-brightness-settings-v3__mode-copy">
        <span className="display-brightness-settings-v3__mode-title">{title}</span>
        <span className="display-brightness-settings-v3__mode-caption">{caption}</span>
      </div>
    </button>
  )
}

export default function DisplayBrightnessSettingsV3() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("dark")
  const [brightness, setBrightness] = useState(64)
  const [autoBrightness, setAutoBrightness] = useState(true)
  const [darkModePolicyIndex, setDarkModePolicyIndex] = useState(1)
  const [eyeComfortPolicyIndex, setEyeComfortPolicyIndex] = useState(0)
  const [fontScalePolicyIndex, setFontScalePolicyIndex] = useState(0)

  const activeMode = useMemo(
    () => modeOptions.find((option) => option.id === displayMode) ?? modeOptions[0],
    [displayMode]
  )

  const brightnessLabel = useMemo(() => {
    if (brightness < 35) return "柔和"
    if (brightness < 70) return "适中"
    return "明亮"
  }, [brightness])

  return (
    <div className="display-brightness-settings-v3">
      <div className="display-brightness-settings-v3__device">
        <StatusBar time="08:08" backgroundColor="#F1F3F5" />

        <div className="display-brightness-settings-v3__shell">
          <TitleBar
            title="显示和亮度"
            subtitle=""
            rightIcons={[]}
            backgroundColor="#F1F3F5"
          />

          <main className="display-brightness-settings-v3__content">
            <section className="display-brightness-settings-v3__focus-card">
              <div className="display-brightness-settings-v3__focus-header">
                <div>
                  <p className="display-brightness-settings-v3__section-label">显示模式</p>
                  <h2 className="display-brightness-settings-v3__focus-title">
                    根据场景切换更舒适的屏幕观感
                  </h2>
                </div>
                <span className="display-brightness-settings-v3__status-pill">
                  当前 {activeMode.title}
                </span>
              </div>

              <div className="display-brightness-settings-v3__mode-grid">
                {modeOptions.map((option) => (
                  <ModeOption
                    key={option.id}
                    selected={option.id === displayMode}
                    title={option.title}
                    caption={option.caption}
                    asset={option.asset}
                    onClick={() => setDisplayMode(option.id)}
                  />
                ))}
              </div>

              <p className="display-brightness-settings-v3__focus-summary">
                {activeMode.summary}
              </p>
            </section>

            <List className="display-brightness-settings-v3__group">
              <section className="display-brightness-settings-v3__brightness-panel">
                <div className="display-brightness-settings-v3__brightness-top">
                  <div>
                    <div className="display-brightness-settings-v3__brightness-title">
                      亮度
                    </div>
                    <p className="display-brightness-settings-v3__brightness-note">
                      根据当前内容与环境获得更自然的视觉平衡
                    </p>
                  </div>

                  <div className="display-brightness-settings-v3__brightness-badge">
                    {brightness}%
                  </div>
                </div>

                <div className="display-brightness-settings-v3__slider-row">
                  <span className="display-brightness-settings-v3__slider-side">暗</span>
                  <div className="display-brightness-settings-v3__slider-main">
                    <SliderBase
                      modelValue={brightness}
                      onUpdateModelValue={setBrightness}
                    />
                  </div>
                  <span className="display-brightness-settings-v3__slider-side">亮</span>
                </div>

                <div className="display-brightness-settings-v3__brightness-meta">
                  <span>当前亮度</span>
                  <span>{brightnessLabel}</span>
                </div>
              </section>

              <ListItem
                title={<span className="font-medium">深色模式</span>}
                right={<RightValue value={darkModePolicies[darkModePolicyIndex]} />}
                showArrow={false}
                onClick={() =>
                  setDarkModePolicyIndex(
                    (current) => (current + 1) % darkModePolicies.length
                  )
                }
              />

              <ListItem
                title={<span className="font-medium">自动调节</span>}
                subtitle="根据环境光自动优化亮度"
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

            <List className="display-brightness-settings-v3__group">
              <ListItem
                title={<span className="font-medium">护眼模式</span>}
                right={<RightValue value={eyeComfortPolicies[eyeComfortPolicyIndex]} />}
                showArrow={false}
                onClick={() =>
                  setEyeComfortPolicyIndex(
                    (current) => (current + 1) % eyeComfortPolicies.length
                  )
                }
              />

              <ListItem
                title={<span className="font-medium">字体大小和界面缩放</span>}
                right={<RightValue value={fontScalePolicies[fontScalePolicyIndex]} />}
                showArrow={false}
                onClick={() =>
                  setFontScalePolicyIndex(
                    (current) => (current + 1) % fontScalePolicies.length
                  )
                }
                border={false}
              />
            </List>
          </main>

          <footer className="display-brightness-settings-v3__footer">
            <div className="display-brightness-settings-v3__home-indicator" />
          </footer>
        </div>
      </div>
    </div>
  )
}
