/**
 * ScenarioModePageV8 — 情景模式
 *
 * 移动端设置页面下的二级页面
 *
 * 结构：
 *  - HeaderSlot: StatusBar + TitleBar（左返回，右：新增/问号/更多）
 *  - ContextSlot (bleed):
 *      scl-header-subtitle 描述文字（14px / lh 22px / font_secondary）
 *      scl-carousel-track 横向滚动情景卡片（FeaturePromoCard × 3，center snap，padding-inline 32px）
 *      导航点
 *  - ListGroupSlot:
 *      Group-1 (条件开启): SubHeader + list-card(TimeIcon + Divider + 添加条件) + footnote
 *      Group-2 (智能推荐): SubHeader + list-card(Switch) + footnote
 *
 * V8 vs V7 改进：
 *  - 描述文字改用 scl-header-subtitle 类（14px / 22px / rgba(0,0,0,0.6)），修正 V7 的 FONT_TERTIARY + 13px 错误
 *  - 轮播轨道改用 scl-carousel-track（32px padding-inline，scroll-snap-align center），修正 V7 的 start snap + 16px padding
 *  - footnote 文字移除内联 color 覆盖（V7 用 FONT_TERTIARY 0.45 覆盖了 footnote-text 的正确 0.6）
 *  - 移除自定义 smpv7-rail / smpv7-hide-scrollbar CSS，复用布局系统 scl-carousel-track
 */

"use client"

import { useRef, useState, useCallback } from "react"
import { SettingsContextListLayout } from "@/layouts/SettingsContextListLayout"
import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { SubHeader } from "@/component/SubHeader"
import { ListItem } from "@/component/List"
import { Divider } from "@/component/Divider"
import { Switch } from "@/component/Switch"
import { FeaturePromoCard } from "@/component/FeaturePromoCard"

import iconChevronBack from "@/blocks/assets/pixso-icons/icon-chevron-backward.png"
import iconArrowRightSmall from "@/blocks/assets/pixso-icons/icon-arrow-right-small.png"

import "./index.css"

/* ---------- Token 常量 ---------- */

const BRAND_BLUE = "#0a59f7"
const FONT_PRIMARY = "rgba(0, 0, 0, 0.9)"
const FONT_SECONDARY = "rgba(0, 0, 0, 0.6)"
const CARD_BG = "#FFFFFF"

const CARD_W = 244
const CARD_GAP = 12

/* ---------- TitleBar 右侧 SVG 图标 ---------- */

const mkSvg = (svg: string) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(svg)

const iconAdd = mkSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
)

const iconHelp = mkSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#000000" stroke-width="2"/>
    <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7C13.38 7 14.5 8.12 14.5 9.5C14.5 10.5 14 11 13 11.5C12.3 11.85 12 12.3 12 13.2V13.5" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="16.8" r="1.05" fill="#000000"/>
  </svg>`
)

const iconMore = mkSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="12" r="1.8" fill="#000000"/>
    <circle cx="12" cy="12" r="1.8" fill="#000000"/>
    <circle cx="18" cy="12" r="1.8" fill="#000000"/>
  </svg>`
)

/* ---------- FeaturePromoCard 图标 ---------- */

function MoonIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="v8-moon-bg" x1="12%" y1="6%" x2="92%" y2="100%">
          <stop offset="0%" stopColor="#B69CFF" />
          <stop offset="100%" stopColor="#7B5CFF" />
        </linearGradient>
        <linearGradient id="v8-moon-shape" x1="20%" y1="10%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E2D6FF" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#v8-moon-bg)" />
      <path
        d="M40.5 19c-.5 0-1 .03-1.5.08a14 14 0 0 0 6.4 23.43A15 15 0 1 1 40.5 19Z"
        fill="url(#v8-moon-shape)"
      />
      <circle cx="22" cy="20" r="1.5" fill="#FFFFFF" opacity="0.85" />
      <circle cx="48" cy="46" r="1.2" fill="#FFFFFF" opacity="0.7" />
      <circle cx="18" cy="44" r="1" fill="#FFFFFF" opacity="0.6" />
    </svg>
  )
}

function FocusIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="v8-focus-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD27A" />
          <stop offset="100%" stopColor="#FF8A4C" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#v8-focus-bg)" />
      <circle cx="32" cy="32" r="15" fill="none" stroke="#FFFFFF" strokeWidth="3.5" opacity="0.9" />
      <circle cx="32" cy="32" r="6" fill="#FFFFFF" />
    </svg>
  )
}

function SleepIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="v8-sleep-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#v8-sleep-bg)" />
      <text x="32" y="40" fontFamily="HarmonyOS Sans, -apple-system, sans-serif" fontSize="24" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Zz</text>
    </svg>
  )
}

/* ---------- 时间图标 ---------- */

function TimeIcon() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(10, 89, 247, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke={BRAND_BLUE} strokeWidth="1.8" />
        <path d="M12 7.5V12L15 14" stroke={BRAND_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ---------- 页面主体 ---------- */

const CARDS = [
  { id: "dnd",   icon: <MoonIcon />,  title: "免打扰",  subtitle: "减少打扰保持专注", action: "立即开启" },
  { id: "focus", icon: <FocusIcon />, title: "专注模式", subtitle: "屏蔽通知全心投入", action: "立即开启" },
  { id: "sleep", icon: <SleepIcon />, title: "睡眠模式", subtitle: "调暗屏幕安然入睡", action: "立即开启" },
]

export default function ScenarioModePageV8() {
  const [recommendOn, setRecommendOn] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const railRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const el = railRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / (CARD_W + CARD_GAP))
    if (idx !== activeIndex && idx >= 0 && idx < CARDS.length) {
      setActiveIndex(idx)
    }
  }, [activeIndex])

  return (
    <SettingsContextListLayout
      statusBar={<StatusBar time="09:41" backgroundColor="#F1F3F5" />}
      titleBar={
        <TitleBar
          title="情景模式"
          leftIcon={iconChevronBack}
          rightIcons={[iconAdd, iconHelp, iconMore]}
          backgroundColor="#F1F3F5"
        />
      }
      background="#F1F3F5"
      theme="light"
      contextWidth="bleed"
      context={
        <>
          {/* 描述文字：Font/Subtitle_S/Regular 14px/22px/400，color font_secondary rgba(0,0,0,0.6) */}
          <p className="scl-header-subtitle" style={{ marginBottom: 16 }}>
            开启后会自动调整系统功能，让您能全身心投入情景。
          </p>

          {/* 横向轮播：scl-carousel-track 保证 32px padding-inline + center snap */}
          <div
            ref={railRef}
            onScroll={handleScroll}
            className="scl-carousel-track"
            role="list"
            aria-label="情景模式卡片列表"
          >
            {CARDS.map((card) => (
              <div key={card.id} role="listitem">
                <FeaturePromoCard
                  icon={card.icon}
                  title={card.title}
                  subtitle={card.subtitle}
                  actionLabel={card.action}
                  onAction={() => {}}
                />
              </div>
            ))}
          </div>

          {/* 导航点 */}
          <div className="smpv8-dots" role="tablist" aria-label="情景模式分页">
            {CARDS.map((card, idx) => (
              <span
                key={card.id}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={card.title}
                className="smpv8-dot"
                data-active={idx === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
        </>
      }
      listGroup={
        <>
          {/* ── Group 1: 条件开启 ── */}
          {/* marginTop: -12px 补偿父 gap=12px，使 SubHeader 顶边紧贴导航点底边（0px） */}
          <div className="flex flex-col" style={{ marginTop: -12 }}>
            <SubHeader
              text="条件开启"
              leftMode="text"
              rightMode="none"
              className="my-subheader--text-none"
            />

            <div className="rounded-[20px] overflow-hidden" style={{ background: CARD_BG }}>
              <ListItem
                left={<TimeIcon />}
                title={<span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>周日 周六</span>}
                subtitle={<span style={{ color: FONT_SECONDARY, fontSize: 12 }}>22:00 - 次日 07:00</span>}
                right={
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: 14, color: FONT_SECONDARY }}>已关闭</span>
                    <img src={iconArrowRightSmall} alt="" className="w-3 h-6" />
                  </div>
                }
                border={false}
                showArrow={false}
                onClick={() => {}}
              />
              <div style={{ paddingInline: 16 }}>
                <Divider hairline margin="0" />
              </div>
              <button type="button" className="smpv8-add-btn" onClick={() => {}}>
                添加条件
              </button>
            </div>

            {/* footnote-text：layout CSS 统一管理 margin-top:8px + 12px/18px/rgba(0,0,0,0.6) */}
            <p className="footnote-text">
              本功能需调用位置权限，读取位置信息。
            </p>
          </div>

          {/* ── Group 2: 智能推荐 ── */}
          {/* marginTop: -12px 补偿父 gap=12px，使 SubHeader 顶边紧贴上方 footnote 底边（0px） */}
          <div className="flex flex-col" style={{ marginTop: -12 }}>
            <SubHeader
              text="智能推荐"
              leftMode="text"
              rightMode="none"
              className="my-subheader--text-none"
            />

            <div className="rounded-[20px] overflow-hidden" style={{ background: CARD_BG }}>
              <ListItem
                title={<span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>推荐开启与关闭</span>}
                right={
                  <Switch modelValue={recommendOn} onUpdateModelValue={setRecommendOn} />
                }
                showArrow={false}
                border={false}
              />
            </div>

            {/* footnote-text：layout CSS 统一管理样式，无需内联 color 覆盖 */}
            <p className="footnote-text">
              基于个人偏好，以及位置、时间等数据信息，智能推荐开启或关闭相应的情景模式，关闭后将影响情景模式的推荐体验。
            </p>
          </div>
        </>
      }
      showFooter={false}
    />
  )
}
