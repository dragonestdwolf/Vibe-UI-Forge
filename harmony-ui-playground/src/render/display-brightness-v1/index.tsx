"use client"

import { useState } from "react"
import { ChevronRight, Sun } from "lucide-react"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { Divider } from "@/component/Divider"
import { List, ListItem } from "@/component/List"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

/* ─── constants ─────────────────────────────────────────── */
const BG = "#f2f4f8"
const CARD_SHADOW = "0_6px_20px_rgba(0,0,0,0.07)"

/* ─── phone preview mockup ───────────────────────────────── */
function PhoneMockup({
  dark,
  selected,
  onClick,
}: {
  dark: boolean
  selected: boolean
  onClick: () => void
}) {
  const screenBg = dark ? "#1c1c1e" : "#ffffff"
  const statusBg = dark ? "#242426" : "#f2f4f8"
  const titleColor = dark ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.88)"
  const barA = dark ? "#3a3a3c" : "#e8eaed"
  const barB = dark ? "#2c2c2e" : "#f4f5f8"
  const cardSurface = dark ? "#2c2c2e" : "#f0f2f6"
  const dot = dark ? "#636366" : "#c7cbd4"

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "relative flex flex-col overflow-hidden rounded-[14px] border-[2.5px] bg-transparent p-0",
        "transition-all duration-150",
        selected
          ? "border-[#0a59f7] shadow-[0_0_0_3px_rgba(10,89,247,0.15)]"
          : "border-[rgba(0,0,0,0.10)]",
      ].join(" ")}
      style={{ width: 126, flexShrink: 0 }}
    >
      {/* status bar */}
      <div
        className="flex items-center justify-between px-2.5 py-[5px]"
        style={{ background: statusBg }}
      >
        <span
          className="text-[7px] font-semibold leading-none"
          style={{ color: titleColor }}
        >
          9:41
        </span>
        <div className="flex items-center gap-1">
          {/* signal */}
          <div className="flex items-end gap-[1.5px]">
            {[3, 5, 7, 9].map((h, i) => (
              <div
                key={i}
                className="w-[1.5px] rounded-[0.5px]"
                style={{
                  height: h,
                  background:
                    i < 3
                      ? titleColor
                      : dark
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
          {/* wifi */}
          <div
            className="size-[6px] rounded-full"
            style={{ background: titleColor }}
          />
          {/* battery */}
          <div
            className="flex h-[6px] w-[10px] items-center overflow-hidden rounded-[1.5px] border"
            style={{ borderColor: titleColor }}
          >
            <div
              className="h-full rounded-[1px]"
              style={{ width: "70%", background: titleColor }}
            />
          </div>
        </div>
      </div>

      {/* screen */}
      <div
        className="flex flex-col gap-1.5 px-2 pb-2 pt-1.5"
        style={{ background: screenBg, minHeight: 150 }}
      >
        {/* search-bar mock */}
        <div
          className="mb-0.5 flex h-4 items-center rounded-full px-2 gap-1"
          style={{ background: cardSurface }}
        >
          <div className="size-2 rounded-full" style={{ background: dot }} />
          <div
            className="flex-1 rounded-full h-1.5"
            style={{ background: dot }}
          />
        </div>

        {/* card mocks */}
        {[["55%", "35%"], ["70%", "40%"], ["45%", "30%"]].map(([w1, w2], i) => (
          <div
            key={i}
            className="rounded-[6px] px-2 py-1.5 flex flex-col gap-1"
            style={{
              background: cardSurface,
              boxShadow: dark
                ? "none"
                : "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="h-1.5 rounded-full"
              style={{ width: w1, background: barA }}
            />
            <div
              className="h-1.5 rounded-full"
              style={{ width: w2, background: barB }}
            />
          </div>
        ))}
      </div>

      {/* selected checkmark */}
      {selected && (
        <div className="absolute bottom-2 right-2 flex size-[18px] items-center justify-center rounded-full bg-[#0a59f7]">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1.5 4l2.5 2.5L8.5 1.5"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  )
}

/* ─── brightness slider ──────────────────────────────────── */
function BrightnessSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* small sun */}
      <Sun
        size={16}
        strokeWidth={2}
        className="shrink-0 text-[rgba(0,0,0,0.45)]"
      />

      {/* slider track */}
      <div className="relative flex-1">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="brightness-slider w-full"
          aria-label="亮度"
        />
        {/* filled track visual */}
        <style>{`
          .brightness-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(
              to right,
              #0a59f7 ${value}%,
              rgba(0,0,0,0.12) ${value}%
            );
            outline: none;
            cursor: pointer;
          }
          .brightness-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #ffffff;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.18);
            cursor: pointer;
            transition: box-shadow 0.15s ease;
          }
          .brightness-slider::-webkit-slider-thumb:active {
            box-shadow: 0 0 0 3px rgba(10,89,247,0.25), 0 2px 8px rgba(0,0,0,0.22);
          }
          .brightness-slider::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border: none;
            border-radius: 50%;
            background: #ffffff;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.18);
            cursor: pointer;
          }
        `}</style>
      </div>

      {/* large sun */}
      <Sun
        size={22}
        strokeWidth={1.8}
        className="shrink-0 text-[rgba(0,0,0,0.7)]"
      />
    </div>
  )
}

/* ─── section label ──────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 px-1 text-[13px] font-medium leading-[18px] text-[#727985]">
      {children}
    </p>
  )
}

/* ─── page ───────────────────────────────────────────────── */
export default function DisplayBrightnessV1() {
  const [displayMode, setDisplayMode] = useState<"light" | "dark">("light")
  const [brightness, setBrightness] = useState(70)
  const [autoAdjust, setAutoAdjust] = useState(true)

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f2f4f8] text-[#191d24]">
      <StatusBar time="09:41" backgroundColor={BG} />

      {/* ── 标题栏 ── */}
      <header className="px-4 pt-2">
        <button
          type="button"
          aria-label="返回"
          className="flex size-10 items-center justify-center rounded-full border-0 bg-white/85 p-0 shadow-[0_1px_8px_rgba(28,35,45,0.06)]"
        >
          <img src={iconChevronBack} alt="" className="size-6" />
        </button>
        <h1 className="mt-2 text-[32px] font-semibold leading-[40px] text-[#191d24]">
          显示和亮度
        </h1>
      </header>

      {/* ── 内容区 ── */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-5">
        <div className="flex flex-col gap-5">

          {/* ── 一楼：显示模式 ── */}
          <section>
            <SectionLabel>显示模式</SectionLabel>
            <div className={`overflow-hidden rounded-[24px] bg-white shadow-[${CARD_SHADOW}]`}>

              {/* 手机预览区 */}
              <div className="flex items-end justify-center gap-0 px-5 pt-5 pb-4">
                {/* 浅色 */}
                <div className="flex flex-col items-center gap-2">
                  <PhoneMockup
                    dark={false}
                    selected={displayMode === "light"}
                    onClick={() => setDisplayMode("light")}
                  />
                  <span
                    className={[
                      "text-[13px] font-medium leading-[18px]",
                      displayMode === "light" ? "text-[#0a59f7]" : "text-[rgba(0,0,0,0.6)]",
                    ].join(" ")}
                  >
                    浅色
                  </span>
                </div>

                {/* 竖向 divider */}
                <div
                  className="mx-4 self-stretch"
                  style={{
                    width: 1,
                    background: "rgba(0,0,0,0.08)",
                    marginBottom: 26,
                  }}
                />

                {/* 深色 */}
                <div className="flex flex-col items-center gap-2">
                  <PhoneMockup
                    dark={true}
                    selected={displayMode === "dark"}
                    onClick={() => setDisplayMode("dark")}
                  />
                  <span
                    className={[
                      "text-[13px] font-medium leading-[18px]",
                      displayMode === "dark" ? "text-[#0a59f7]" : "text-[rgba(0,0,0,0.6)]",
                    ].join(" ")}
                  >
                    深色
                  </span>
                </div>
              </div>

              {/* 水平 divider */}
              <Divider margin={0} />

              {/* 深色模式 list */}
              <List>
                <ListItem
                  title="深色模式"
                  right={
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] text-[rgba(0,0,0,0.45)]">
                        定时开启
                      </span>
                      <ChevronRight
                        size={16}
                        strokeWidth={1.8}
                        className="text-[#c2c8d0]"
                      />
                    </div>
                  }
                  showArrow={false}
                  border={false}
                />
              </List>
            </div>
          </section>

          {/* ── 二楼：亮度 ── */}
          <section>
            <div className={`overflow-hidden rounded-[24px] bg-white shadow-[${CARD_SHADOW}]`}>
              <BrightnessSlider value={brightness} onChange={setBrightness} />

              <Divider margin={0} />

              <List>
                <ListItem
                  title="自动调节"
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
            </div>
          </section>

          {/* ── 三楼：护眼模式 ── */}
          <section>
            <div className={`overflow-hidden rounded-[24px] bg-white shadow-[${CARD_SHADOW}]`}>
              <List>
                <ListItem
                  title="护眼模式"
                  right={
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] text-[rgba(0,0,0,0.45)]">
                        全天开启
                      </span>
                      <ChevronRight
                        size={16}
                        strokeWidth={1.8}
                        className="text-[#c2c8d0]"
                      />
                    </div>
                  }
                  showArrow={false}
                  border={false}
                />
              </List>
            </div>
          </section>

          {/* ── 四楼：字体大小和界面缩放 ── */}
          <section>
            <div className={`overflow-hidden rounded-[24px] bg-white shadow-[${CARD_SHADOW}]`}>
              <List>
                <ListItem
                  title="字体大小和界面缩放"
                  right={
                    <ChevronRight
                      size={18}
                      strokeWidth={1.8}
                      className="text-[#c2c8d0]"
                    />
                  }
                  showArrow={false}
                  border={false}
                />
              </List>
            </div>
          </section>

        </div>
      </main>

      {/* ── Home indicator ── */}
      <div className="flex h-7 shrink-0 items-center justify-center pb-2">
        <div className="h-[5px] w-28 rounded-full bg-[#b9bec7]" />
      </div>
    </div>
  )
}
