"use client"

import { useRef, useState } from "react"
import {
  ChevronRight,
  Clock,
  HelpCircle,
  MoreHorizontal,
  Plus,
} from "lucide-react"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { Divider } from "@/component/Divider"
import { List, ListItem } from "@/component/List"
import { Button } from "@/component/Button"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

/* ─── moon SVG illustration ─────────────────────────────── */
function MoonIllustration({
  moonColor = "rgba(255,255,255,0.92)",
  starColor = "rgba(255,255,255,0.70)",
  glowColor = "rgba(255,255,255,0.10)",
}: {
  moonColor?: string
  starColor?: string
  glowColor?: string
}) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[120px]"
      aria-hidden="true"
    >
      {/* glow halo */}
      <circle cx="58" cy="50" r="38" fill={glowColor} />
      {/* crescent: big circle minus offset circle */}
      <circle cx="58" cy="50" r="28" fill={moonColor} />
      <circle cx="72" cy="42" r="22" fill="currentColor" />
      {/* stars */}
      <circle cx="18" cy="18" r="2.2" fill={starColor} />
      <circle cx="30" cy="8"  r="1.4" fill={starColor} opacity="0.7" />
      <circle cx="96" cy="22" r="1.6" fill={starColor} opacity="0.8" />
      <circle cx="106" cy="12" r="1.0" fill={starColor} opacity="0.5" />
      <circle cx="10" cy="38" r="1.2" fill={starColor} opacity="0.6" />
      <circle cx="100" cy="60" r="1.0" fill={starColor} opacity="0.4" />
    </svg>
  )
}

/* ─── scene card ─────────────────────────────────────────── */
type SceneCard = {
  id: string
  from: string
  to: string
  moonBg: string
  title: string
  subtitle: string
  active: boolean
}

const CARDS: SceneCard[] = [
  {
    id: "dnd",
    from: "#1a2e5a",
    to: "#243b6e",
    moonBg: "#1a2e5a",
    title: "免打扰",
    subtitle: "减少打扰，保持专注",
    active: false,
  },
  {
    id: "sleep",
    from: "#2d1b5a",
    to: "#3d2475",
    moonBg: "#2d1b5a",
    title: "睡眠",
    subtitle: "安静休息，屏蔽通知",
    active: false,
  },
  {
    id: "focus",
    from: "#0f3a35",
    to: "#1a5045",
    moonBg: "#0f3a35",
    title: "专注",
    subtitle: "沉浸工作，提升效率",
    active: false,
  },
]

function SceneCardView({ card }: { card: SceneCard }) {
  const [on, setOn] = useState(card.active)

  return (
    <div
      className="flex shrink-0 snap-center flex-col items-center overflow-hidden rounded-[28px] px-6 pb-6 pt-5"
      style={{
        width: 272,
        background: `linear-gradient(160deg, ${card.from} 0%, ${card.to} 100%)`,
        color: card.moonBg,
      }}
    >
      {/* 月亮插画 */}
      <MoonIllustration />

      {/* 标题 */}
      <h2 className="mt-3 text-[22px] font-semibold leading-[28px] text-white">
        {card.title}
      </h2>

      {/* 副文本 */}
      <p className="mt-1 text-center text-[13px] leading-[18px] text-white/70">
        {card.subtitle}
      </p>

      {/* 立即开启按钮 */}
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={[
          "mt-5 flex h-10 w-full items-center justify-center rounded-full",
          "border-0 text-[15px] font-semibold transition-all duration-150",
          on
            ? "bg-white/20 text-white"
            : "bg-white text-[#1a2e5a]",
        ].join(" ")}
      >
        {on ? "已开启" : "立即开启"}
      </button>
    </div>
  )
}

/* ─── navigation dots ────────────────────────────────────── */
function NavDots({
  total,
  active,
}: {
  total: number
  active: number
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 pt-3">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={[
            "rounded-full transition-all duration-200",
            i === active
              ? "w-4 h-1.5 bg-[#0a59f7]"
              : "size-1.5 bg-[rgba(0,0,0,0.18)]",
          ].join(" ")}
        />
      ))}
    </div>
  )
}

/* ─── page ───────────────────────────────────────────────── */
export default function SceneModeV1() {
  const [activeDot, setActiveDot] = useState(0)
  const [autoRecommend, setAutoRecommend] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = 272 + 12 // card width + gap
    const idx = Math.round(el.scrollLeft / cardWidth)
    setActiveDot(Math.min(idx, CARDS.length - 1))
  }

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f2f4f8] text-[#191d24]">
      <StatusBar time="09:41" backgroundColor="#f2f4f8" />

      {/* ── 标题栏 ── */}
      <header className="px-4 pt-2">
        {/* 操作行：返回 ＋ 三个右侧按钮 */}
        <div className="flex items-center justify-between">
          {/* 返回 */}
          <button
            type="button"
            aria-label="返回"
            className="flex size-10 items-center justify-center rounded-full border-0 bg-[rgba(0,0,0,0.047)] p-0"
          >
            <img src={iconChevronBack} alt="" className="size-6" />
          </button>

          {/* 右侧三按钮 */}
          <div className="flex items-center gap-2">
            {[
              { icon: <Plus size={20} strokeWidth={2} />, label: "新增" },
              { icon: <HelpCircle size={20} strokeWidth={1.8} />, label: "帮助" },
              { icon: <MoreHorizontal size={20} strokeWidth={2} />, label: "更多" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border-0 bg-[rgba(0,0,0,0.047)] p-0 text-[rgba(0,0,0,0.898)]"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* 大标题 */}
        <h1 className="mt-1 text-[32px] font-semibold leading-[40px] text-[#191d24]">
          情景模式
        </h1>
      </header>

      {/* ── 内容区 ── */}
      <main className="flex-1 overflow-y-auto pb-5">
        <div className="flex flex-col gap-5">

          {/* 描述文字 */}
          <p className="px-5 pt-1 text-[13px] leading-[20px] text-[rgba(0,0,0,0.55)]">
            开启后会自动调整系统功能，让您能全身心投入情景
          </p>

          {/* ── 二楼：情景卡片轮播 ── */}
          <section>
            {/* 横向滚动区 */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto"
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`.scene-scroll::-webkit-scrollbar{display:none}`}</style>
              {CARDS.map((card) => (
                <SceneCardView key={card.id} card={card} />
              ))}
              {/* trailing spacer to allow last card to center */}
              <div className="shrink-0" style={{ width: 16 }} />
            </div>

            {/* 导航点 */}
            <NavDots total={CARDS.length} active={activeDot} />
          </section>

          {/* ── 条件开启卡片 ── */}
          <section className="px-4">
            <p className="mb-2 px-1 text-[13px] font-medium leading-[18px] text-[#727985]">
              条件开启
            </p>

            <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.07)]">
              <List>
                <ListItem
                  left={
                    <div className="flex size-9 items-center justify-center rounded-[10px] bg-[#e8f0ff]">
                      <Clock size={18} strokeWidth={1.8} className="text-[#2368f3]" />
                    </div>
                  }
                  title="周日 周六"
                  subtitle="22:00-次日 07:00"
                  right={
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] text-[rgba(0,0,0,0.45)]">
                        已关闭
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
                  leftGap={12}
                />
              </List>

              <Divider margin={0} />

              {/* 添加条件按钮 */}
              <div className="px-4 py-3">
                <Button type="primary" size="large" round block>
                  添加条件
                </Button>
              </div>
            </div>

            {/* 卡片下方说明 */}
            <p className="mt-2 px-1 text-[12px] leading-[18px] text-[#9ba4b0]">
              本功能需调用位置权限，读取位置信息
            </p>
          </section>

          {/* ── 三楼：推荐开启与关闭 ── */}
          <section className="px-4">
            <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.07)]">
              <List>
                <ListItem
                  title="推荐开启与关闭"
                  right={
                    <Switch
                      modelValue={autoRecommend}
                      onUpdateModelValue={setAutoRecommend}
                    />
                  }
                  showArrow={false}
                  border={false}
                />
              </List>
            </div>

            {/* 卡片下方说明 */}
            <p className="mt-2 px-1 text-[12px] leading-[20px] text-[#9ba4b0]">
              基于个人偏好，以及位置、时间等数据信息，智能推荐开启或关闭相应的情景模式，关闭后将影响情景模式的推荐体验。
            </p>
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
