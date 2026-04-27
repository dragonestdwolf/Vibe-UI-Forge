"use client"

import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { TitleBarHarmony3267 } from "@/component/TitleBarHarmony3267"
import { List, ListItem } from "@/component/List"
import { SliderWithIcons } from "@/component/Slider"
import { Switch } from "@/component/Switch"
import { SunDim, Sun, Moon, ChevronRight } from "lucide-react"

/* -------------------------------------------------------------------------- */
/* Phone Preview Mockups                                                        */
/* -------------------------------------------------------------------------- */
function PhonePreviewLite({
  selected = false,
  label,
}: {
  selected?: boolean
  label: string
}) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative overflow-hidden rounded-[20px] border-2"
        style={{
          width: 84,
          height: 156,
          borderColor: selected ? "#0A59F7" : "rgba(0,0,0,0.08)",
          backgroundColor: "#FFFFFF",
          boxShadow: selected
            ? "0 4px 16px rgba(10,89,247,0.18)"
            : "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Status bar dots */}
        <div className="flex h-4 items-center justify-center gap-1.5 pt-1">
          <div className="h-1 w-1 rounded-full bg-black/20" />
          <div className="h-1 w-1 rounded-full bg-black/20" />
        </div>
        {/* App grid */}
        <div className="grid grid-cols-3 gap-1 px-2 pt-1">
          {["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"].map((c, i) => (
            <div
              key={i}
              className="aspect-square rounded-[6px]"
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="col-span-2 rounded-[6px] bg-blue-400" />
          <div className="rounded-[6px] bg-orange-400" />
        </div>
      </div>
      {selected && (
        <div className="mt-1.5 flex items-center gap-1">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 3.5L3.5 6L9 1"
              stroke="#0A59F7"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] font-medium text-[#0A59F7]">已选择</span>
        </div>
      )}
      {!selected && (
        <div className="mt-1.5 text-[11px] font-medium text-black/30">{label}</div>
      )}
    </div>
  )
}

function PhonePreviewDark({
  selected = false,
  label,
}: {
  selected?: boolean
  label: string
}) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="relative overflow-hidden rounded-[20px] border-2"
        style={{
          width: 84,
          height: 156,
          borderColor: selected ? "#0A59F7" : "rgba(255,255,255,0.1)",
          backgroundColor: "#1A1A2E",
          boxShadow: selected
            ? "0 4px 16px rgba(10,89,247,0.18)"
            : "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {/* Status bar dots */}
        <div className="flex h-4 items-center justify-center gap-1.5 pt-1">
          <div className="h-1 w-1 rounded-full bg-white/30" />
          <div className="h-1 w-1 rounded-full bg-white/30" />
        </div>
        {/* App grid - dark */}
        <div className="grid grid-cols-3 gap-1 px-2 pt-1">
          {["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"].map((c, i) => (
            <div
              key={i}
              className="aspect-square rounded-[6px]"
              style={{ backgroundColor: c, opacity: 0.7 }}
            />
          ))}
          <div className="col-span-2 rounded-[6px] bg-blue-400" style={{ opacity: 0.7 }} />
          <div className="rounded-[6px] bg-orange-400" style={{ opacity: 0.7 }} />
        </div>
      </div>
      {selected && (
        <div className="mt-1.5 flex items-center gap-1">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 3.5L3.5 6L9 1"
              stroke="#0A59F7"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] font-medium text-[#0A59F7]">已选择</span>
        </div>
      )}
      {!selected && (
        <div className="mt-1.5 text-[11px] font-medium text-white/30">{label}</div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Mode toggle chips                                                            */
/* -------------------------------------------------------------------------- */
function ModeChips({
  value,
  onChange,
}: {
  value: "light" | "dark"
  onChange: (v: "light" | "dark") => void
}) {
  return (
    <div className="flex items-center rounded-full bg-[#F5F6F8] p-1">
      <button
        type="button"
        aria-pressed={value === "light"}
        onClick={() => onChange("light")}
        className={[
          "min-w-[96px] rounded-full py-2 text-[13px] font-medium transition-all duration-200",
          value === "light"
            ? "bg-white text-[#0A59F7] shadow-[0_2px_8px_rgba(10,89,247,0.15)]"
            : "text-black/40",
        ].join(" ")}
      >
        浅色模式
      </button>
      <button
        type="button"
        aria-pressed={value === "dark"}
        onClick={() => onChange("dark")}
        className={[
          "min-w-[96px] rounded-full py-2 text-[13px] font-medium transition-all duration-200",
          value === "dark"
            ? "bg-white text-[#0A59F7] shadow-[0_2px_8px_rgba(10,89,247,0.15)]"
            : "text-black/40",
        ].join(" ")}
      >
        深色模式
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Brightness summary                                                           */
/* -------------------------------------------------------------------------- */
function BrightnessSummary({ value }: { value: number }) {
  const label =
    value < 33 ? "较暗" : value < 66 ? "室内舒适" : "较亮"
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="text-[13px] text-black/45">当前亮度</div>
        <div className="mt-0.5 text-[30px] font-semibold leading-[34px] tracking-[-0.02em] text-black/90">
          {value}%
        </div>
      </div>
      <div className="rounded-full bg-[#F5F6F8] px-3 py-1.5 text-[12px] font-medium text-black/50">
        {label}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */
export default function DisplayBrightnessPage() {
  const [mode, setMode] = useState<"light" | "dark">("light")
  const [brightness, setBrightness] = useState(55)
  const [autoBrightness, setAutoBrightness] = useState(true)
  const [eyeComfort, setEyeComfort] = useState(false)

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-comp-background-gray">
      {/* Status bar */}
      <StatusBar time="09:41" backgroundColor="#F1F3F5" />

      {/* Title bar */}
      <div className="bg-comp-background-gray">
        <TitleBarHarmony3267
          title="显示和亮度"
          subtitle="调节外观与屏幕亮度"
          backgroundColor="#F1F3F5"
          leftIcon={
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path d="M15 5L8 12L15 19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`
            )
          }
          rightIcons={[
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <circle cx="6" cy="12" r="1.8" fill="#000000"/>
                <circle cx="12" cy="12" r="1.8" fill="#000000"/>
                <circle cx="18" cy="12" r="1.8" fill="#000000"/>
              </svg>`
            ),
          ]}
        />
      </div>

      <main className="flex-1 px-4 pb-4">
        {/* Display Mode Card */}
        <section className="mt-2">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_6px_24px_rgba(26,34,48,0.05)]">
            {/* Phone previews */}
            <div className="flex items-end justify-center gap-4 py-7">
              <PhonePreviewLite
                selected={mode === "light"}
                label="浅色预览"
              />
              <PhonePreviewDark
                selected={mode === "dark"}
                label="深色预览"
              />
            </div>

            {/* Mode chips */}
            <div className="flex justify-center pb-6">
              <ModeChips value={mode} onChange={setMode} />
            </div>
          </div>
        </section>

        {/* Brightness */}
        <section className="mt-3">
          <div className="overflow-hidden rounded-[24px] bg-white px-4 pt-4 pb-5 shadow-[0_4px_16px_rgba(26,34,48,0.04)]">
            <BrightnessSummary value={brightness} />

            <div className="mt-5">
              <SliderWithIcons
                modelValue={brightness}
                onUpdateModelValue={setBrightness}
                leftIcon={
                  <SunDim size={18} strokeWidth={1.8} className="text-black/40" />
                }
                rightIcon={
                  <Sun size={20} strokeWidth={1.8} className="text-black/75" />
                }
                iconGap={10}
                activeColor="#0A59F7"
              />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[18px] bg-[#F7F8FB] px-4 py-3">
              <div>
                <div className="text-[15px] font-medium leading-5 text-black/90">
                  自动亮度调节
                </div>
                <div className="mt-0.5 text-[13px] leading-[18px] text-black/42">
                  根据环境光自动优化
                </div>
              </div>
              <Switch
                modelValue={autoBrightness}
                onUpdateModelValue={setAutoBrightness}
              />
            </div>
          </div>
        </section>

        {/* More settings */}
        <section className="mt-3">
          <List className="overflow-hidden rounded-[24px] bg-white shadow-[0_4px_16px_rgba(26,34,48,0.04)]">
            <ListItem
              left={
                <div className="flex size-10 items-center justify-center rounded-full bg-[#EDF2FC]">
                  <Moon size={18} strokeWidth={1.8} className="text-[#0A59F7]" />
                </div>
              }
              title="护眼模式"
              subtitle="降低蓝光，夜间观看更柔和"
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
                <div className="flex size-10 items-center justify-center rounded-full bg-[#EDF2FC]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A59F7" strokeWidth="1.8">
                    <path d="M4 7V4h16v3M9 20h6M12 4v16" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              }
              title="字体大小与粗细"
              right={
                <div className="flex items-center gap-1">
                  <span className="text-[14px] text-black/40">标准</span>
                  <ChevronRight size={16} strokeWidth={1.8} className="text-black/25" />
                </div>
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        {/* Note */}
        <section className="mt-3 px-1">
          <p className="text-[12px] leading-[18px] text-black/35">
            开启自动亮度后，系统会结合环境光变化和你的调节习惯动态优化屏幕显示效果。
          </p>
        </section>
      </main>

      {/* Home indicator */}
      <div className="flex h-8 items-center justify-center pb-1">
        <div className="h-1.5 w-28 rounded-full bg-black/[0.16]" />
      </div>
    </div>
  )
}
