"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/component/Card"
import { Divider } from "@/component/Divider"
import { List, ListItem } from "@/component/List"
import { SliderWithIcons } from "@/component/Slider"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"
import { cn } from "@/lib/utils"
import { ChevronRight, Sun, SunDim } from "lucide-react"

import "./index.css"

type DisplayMode = "light" | "dark"

function ModePreview({
  mode,
  selected,
  onSelect,
}: {
  mode: DisplayMode
  selected: boolean
  onSelect: (mode: DisplayMode) => void
}) {
  const isLight = mode === "light"

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "display-brightness-settings-v1__mode-button",
        selected && "display-brightness-settings-v1__mode-button--selected"
      )}
      onClick={() => onSelect(mode)}
    >
      {selected ? (
        <span className="display-brightness-settings-v1__mode-badge">已选中</span>
      ) : null}

      <div
        className={cn(
          "display-brightness-settings-v1__phone",
          isLight
            ? "display-brightness-settings-v1__phone--light"
            : "display-brightness-settings-v1__phone--dark"
        )}
      >
        <div className="display-brightness-settings-v1__phone-notch" />
        <div className="display-brightness-settings-v1__phone-panel">
          <div className="display-brightness-settings-v1__phone-header" />
          <div className="display-brightness-settings-v1__phone-lines">
            <div className="display-brightness-settings-v1__phone-line display-brightness-settings-v1__phone-line--accent" />
            <div className="display-brightness-settings-v1__phone-line" />
            <div className="display-brightness-settings-v1__phone-line display-brightness-settings-v1__phone-line--short" />
          </div>
        </div>
      </div>

      <div className="display-brightness-settings-v1__mode-meta">
        <span className="display-brightness-settings-v1__mode-title">
          {isLight ? "浅色模式" : "深色模式"}
        </span>
        <span className="display-brightness-settings-v1__mode-description">
          {isLight ? "明亮通透，适合白天浏览" : "更克制柔和，夜间更舒适"}
        </span>
      </div>

      <div className="display-brightness-settings-v1__mode-footer">
        <span className="display-brightness-settings-v1__mode-dot" />
        <span>{selected ? "当前显示模式" : "点击切换"}</span>
      </div>
    </button>
  )
}

function RightValue({ value }: { value: string }) {
  return (
    <div className="display-brightness-settings-v1__right-value">
      <span className="display-brightness-settings-v1__right-text">{value}</span>
      <ChevronRight size={18} strokeWidth={1.9} className="text-black/30" />
    </div>
  )
}

export default function DisplayBrightnessSettingsV1() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("light")
  const [brightness, setBrightness] = useState(62)
  const [autoBrightness, setAutoBrightness] = useState(true)

  return (
    <div className="display-brightness-settings-v1">
      <StatusBar time="08:08" backgroundColor="transparent" />

      <div className="display-brightness-settings-v1__shell">
        <TitleBar
          title="显示和亮度"
          subtitle=""
          rightIcons={[]}
          backgroundColor="transparent"
        />

        <main className="display-brightness-settings-v1__stack">
          <Card className="display-brightness-settings-v1__mode-card">
            <CardHeader>
              <CardTitle>显示模式</CardTitle>
              <CardDescription>
                选择适合当前环境的系统界面风格，卡片预览会同步展示效果。
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="display-brightness-settings-v1__mode-grid">
                <ModePreview
                  mode="light"
                  selected={displayMode === "light"}
                  onSelect={setDisplayMode}
                />
                <ModePreview
                  mode="dark"
                  selected={displayMode === "dark"}
                  onSelect={setDisplayMode}
                />
              </div>
            </CardContent>

            <CardFooter>
              <div className="display-brightness-settings-v1__mode-summary">
                当前模式：{displayMode === "light" ? "浅色模式" : "深色模式"}
              </div>
            </CardFooter>
          </Card>

          <List className="display-brightness-settings-v1__settings-list">
            <section className="display-brightness-settings-v1__brightness-block">
              <div className="display-brightness-settings-v1__brightness-top">
                <div className="display-brightness-settings-v1__brightness-title">亮度</div>
                <div className="display-brightness-settings-v1__brightness-value">
                  {brightness}%
                </div>
              </div>

              <div className="display-brightness-settings-v1__brightness-slider">
                <SliderWithIcons
                  modelValue={brightness}
                  onUpdateModelValue={setBrightness}
                  leftIcon={<SunDim size={18} strokeWidth={1.9} />}
                  rightIcon={<Sun size={18} strokeWidth={1.9} />}
                />
              </div>

              <div className="display-brightness-settings-v1__brightness-note">
                {displayMode === "light"
                  ? "浅色模式下保持更高可读性。"
                  : "深色模式下亮度已适配更柔和的夜间体验。"}
              </div>
            </section>

            <div className="display-brightness-settings-v1__list-divider">
              <Divider margin="0" hairline />
            </div>

            <ListItem
              title={<span className="font-medium">自动调节</span>}
              subtitle="根据环境光线自动调节亮度"
              right={
                <Switch
                  modelValue={autoBrightness}
                  onUpdateModelValue={setAutoBrightness}
                />
              }
              showArrow={false}
            />

            <ListItem
              title={<span className="font-medium">护眼模式</span>}
              right={<RightValue value="关闭" />}
              showArrow={false}
            />

            <ListItem
              title={<span className="font-medium">字体缩放</span>}
              right={<RightValue value="标准" />}
              showArrow={false}
              border={false}
            />
          </List>
        </main>

        <footer className="display-brightness-settings-v1__footer">
          <div className="display-brightness-settings-v1__home-indicator" />
        </footer>
      </div>
    </div>
  )
}
