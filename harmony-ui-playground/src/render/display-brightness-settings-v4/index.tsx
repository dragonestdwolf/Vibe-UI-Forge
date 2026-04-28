"use client"

import { useState } from "react"
import { Eye, MoonStar, Sun, SunDim, Type } from "lucide-react"

import { HarmonyPageShell } from "@/component/HarmonyPageShell"
import { List, ListItem } from "@/component/List"
import { Slider } from "@/component/Slider"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"

import iconArrowRightSmall from "../../blocks/assets/pixso-icons/icon-arrow-right-small.png"
import previewDark from "../../blocks/assets/pixso-icons/icon-setting-dark.png"
import previewLight from "../../blocks/assets/pixso-icons/icon-setting-light.png"

type DisplayMode = "light" | "dark"

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

function SettingArrowLabel({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[14px] leading-5 text-black/60">{value}</span>
      <img src={iconArrowRightSmall} alt="" className="h-6 w-3" />
    </div>
  )
}

function ModeCard({
  title,
  description,
  preview,
  selected,
  onClick,
}: {
  title: string
  description: string
  preview: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex flex-col rounded-[24px] p-3 text-left transition-all",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A59F7]",
        selected
          ? "bg-white ring-2 ring-[#0A59F7] shadow-[0_8px_18px_rgba(10,89,247,0.12)]"
          : "bg-white/78 ring-1 ring-black/[0.05]"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[16px] font-semibold leading-5 text-black/90">{title}</div>
          <div className="mt-1 text-[12px] leading-[18px] text-black/45">{description}</div>
        </div>
        <div
          className={cx(
            "flex size-6 items-center justify-center rounded-full border text-[12px] font-semibold",
            selected
              ? "border-[#0A59F7] bg-[#0A59F7] text-white"
              : "border-black/8 bg-white text-transparent"
          )}
          aria-hidden="true"
        >
          ✓
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-[18px] bg-[#F4F6FA] p-1.5">
        <img
          src={preview}
          alt=""
          className="h-[150px] w-full rounded-[14px] object-cover object-top"
        />
      </div>
    </button>
  )
}

export default function DisplayBrightnessSettingsV4() {
  const [mode, setMode] = useState<DisplayMode>("light")
  const [brightness, setBrightness] = useState(72)
  const [autoBrightness, setAutoBrightness] = useState(true)

  const isDarkMode = mode === "dark"
  const modeLabel = isDarkMode ? "深色模式" : "浅色模式"
  const modeHint = isDarkMode
    ? "更适合夜间与弱光环境，减少刺眼感。"
    : "保持界面通透明快，适合白天浏览。"

  return (
    <HarmonyPageShell
      background="#F1F3F5"
      statusBarProps={{ time: "09:41" }}
    >
      <div className="mx-auto w-[328px]">
        <TitleBar
          title="显示和亮度"
          subtitle=""
          rightIcons={[]}
          backgroundColor="#F1F3F5"
        />
        <p className="px-1 pb-1 text-[14px] leading-[22px] text-black/60">
          在不同光线环境下切换更舒适的显示模式，并细调屏幕亮度与阅读体验。
        </p>
      </div>

      <div className="px-4 pb-6">
        <section className="rounded-[28px] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[18px] font-semibold leading-6 text-black/90">显示模式</p>
              <p className="mt-1 text-[13px] leading-5 text-black/45">
                左右对比预览，点击即可切换当前界面风格
              </p>
            </div>
            <div className="rounded-full bg-[#0A59F7]/8 px-3 py-1 text-[12px] font-medium leading-4 text-[#0A59F7]">
              当前 {modeLabel}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <ModeCard
              title="浅色"
              description="明亮清爽"
              preview={previewLight}
              selected={!isDarkMode}
              onClick={() => setMode("light")}
            />
            <ModeCard
              title="深色"
              description="柔和沉静"
              preview={previewDark}
              selected={isDarkMode}
              onClick={() => setMode("dark")}
            />
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[16px] font-medium leading-6 text-black/90">亮度</div>
              <div className="mt-1 text-[12px] leading-[18px] text-black/60">{modeHint}</div>
            </div>
            <div className="rounded-full bg-black/[0.04] px-3 py-1 text-[14px] font-medium leading-5 text-black/60">
              {brightness}%
            </div>
          </div>

          <div className="mt-4">
            <Slider
              type="icon"
              value={brightness}
              onChange={setBrightness}
              block
              leadingIcon={<SunDim size={20} strokeWidth={1.7} />}
              trailingIcon={<Sun size={20} strokeWidth={1.7} />}
              aria-label="亮度调节"
            />
          </div>
        </section>

        <List className="mt-3 rounded-[24px] shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <ListItem
            left={
              <div className="flex size-10 items-center justify-center rounded-full bg-[#0A59F7]/8">
                {isDarkMode ? (
                  <MoonStar size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                ) : (
                  <Sun size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                )}
              </div>
            }
            title={<span className="font-medium">自动调节亮度</span>}
            subtitle="根据环境光智能优化当前亮度"
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

        <List className="mt-3 rounded-[24px] shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <ListItem
            left={
              <div className="flex size-10 items-center justify-center rounded-full bg-[#0A59F7]/8">
                <Eye size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
              </div>
            }
            title={<span className="font-medium">护眼模式</span>}
            subtitle={isDarkMode ? "夜间阅读更柔和" : "减少蓝光，阅读更舒适"}
            right={<SettingArrowLabel value={isDarkMode ? "已开启" : "定时开启"} />}
            showArrow={false}
          />
          <ListItem
            left={
              <div className="flex size-10 items-center justify-center rounded-full bg-[#0A59F7]/8">
                <Type size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
              </div>
            }
            title={<span className="font-medium">字体缩放</span>}
            subtitle="调整系统字号与显示大小"
            right={<SettingArrowLabel value={isDarkMode ? "标准偏大" : "标准"} />}
            showArrow={false}
            border={false}
          />
        </List>
      </div>
    </HarmonyPageShell>
  )
}
