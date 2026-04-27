/**
 * Scenario Mode Page V2 — 情景模式 / 免打扰
 *
 * Layout:
 *  - 顶部：横向滚动的沉浸焦点卡片（呼吸光晕），含模式名 / 介绍 / 开启按钮
 *  - 条件开启：定时设置 + 添加条件
 *  - 智能推荐：推荐开启与关闭 Switch
 *  - 允许打扰：应用和元服务、联系人入口
 *  - 重要信息提醒：开关 + 重复来电
 *  - 关联系统功能：深色模式 / 护眼模式 关联下拉
 *
 * Needed components: status-bar, title-bar, list, list-item, switch
 */

"use client"

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react"
import {
  AppWindow,
  Bell,
  CalendarClock,
  ChevronDown,
  Eye,
  MoonStar,
  Plus,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react"

import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"

import iconChevronBack from "@/blocks/assets/pixso-icons/icon-chevron-backward.png"
import iconArrowRightSmall from "@/blocks/assets/pixso-icons/icon-arrow-right-small.png"

const BRAND_BLUE = "#0a59f7"
const FONT_PRIMARY = "rgba(0, 0, 0, 0.9)"
const FONT_TERTIARY = "rgba(0, 0, 0, 0.55)"
const PAGE_BG = "#ffffff"

type ScenarioModeKey = "dnd" | "work" | "sleep" | "drive" | "custom"

interface ScenarioModeItem {
  key: ScenarioModeKey
  title: string
  subtitle: string
  icon: ReactElement
  status: string
}

const MODES: ScenarioModeItem[] = [
  {
    key: "dnd",
    title: "免打扰",
    subtitle: "屏蔽通知与来电，保留闹钟与重要联系人",
    icon: <MoonStar size={20} color="#ffffff" strokeWidth={1.7} />,
    status: "已开启",
  },
  {
    key: "work",
    title: "工作专注",
    subtitle: "仅保留工作相关应用提醒，过滤社交干扰",
    icon: <Sparkles size={20} color="#ffffff" strokeWidth={1.7} />,
    status: "未开启",
  },
  {
    key: "sleep",
    title: "睡眠模式",
    subtitle: "夜间自动静音并切换深色，保护睡眠",
    icon: <Star size={20} color="#ffffff" strokeWidth={1.7} />,
    status: "定时生效",
  },
  {
    key: "drive",
    title: "驾驶模式",
    subtitle: "连接车机时自动启用，仅播报关键通知",
    icon: <Bell size={20} color="#ffffff" strokeWidth={1.7} />,
    status: "未开启",
  },
  {
    key: "custom",
    title: "自定义",
    subtitle: "新建一个属于你的情景模式",
    icon: <Plus size={20} color={BRAND_BLUE} strokeWidth={2} />,
    status: "添加",
  },
]

const CARD_W = 272
const CARD_GAP = 12
const RAIL_PADDING = 16

function FocusCard({
  mode,
  active,
  onToggle,
}: {
  mode: ScenarioModeItem
  active: boolean
  onToggle: () => void
}) {
  const isCustom = mode.key === "custom"
  const actionLabel = isCustom ? "去添加" : active ? "已开启" : "立即开启"

  return (
    <div
      className="scenario-focus-card"
      data-mode={mode.key}
      data-active={active ? "true" : "false"}
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="scenario-focus-card__halo" aria-hidden />
      <div className="scenario-focus-card__head">
        <span className="scenario-focus-card__icon">{mode.icon}</span>
        <span className="scenario-focus-card__chip">{mode.status}</span>
      </div>

      <div className="scenario-focus-card__body">
        <div className="scenario-focus-card__title">{mode.title}</div>
        <div className="scenario-focus-card__subtitle">{mode.subtitle}</div>
      </div>

      <button
        type="button"
        className="scenario-focus-card__action"
        onClick={onToggle}
        aria-pressed={active}
      >
        {!isCustom ? (
          <span className="scenario-focus-card__dot" aria-hidden />
        ) : null}
        {actionLabel}
      </button>
    </div>
  )
}

function GroupLabel({
  children,
  first = false,
}: {
  children: ReactNode
  first?: boolean
}) {
  return (
    <div
      className="px-1 pb-2 text-[13px] font-medium"
      style={{
        color: FONT_TERTIARY,
        marginTop: first ? 4 : 16,
      }}
    >
      {children}
    </div>
  )
}

function ValueWithChevron({
  value,
  emphasize = false,
}: {
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      <span
        style={{
          fontSize: 14,
          color: emphasize ? BRAND_BLUE : FONT_TERTIARY,
        }}
      >
        {value}
      </span>
      <ChevronDown size={14} color={FONT_TERTIARY} strokeWidth={1.6} />
    </div>
  )
}

function RightLink({ value }: { value?: string }) {
  return (
    <div className="flex items-center gap-1">
      {value ? (
        <span style={{ fontSize: 14, color: FONT_TERTIARY }}>{value}</span>
      ) : null}
      <img src={iconArrowRightSmall} alt="" className="w-3 h-6" />
    </div>
  )
}

export default function ScenarioModePageV2() {
  const [activeMode, setActiveMode] = useState<ScenarioModeKey>("dnd")
  const [scheduleEnabled, setScheduleEnabled] = useState(true)
  const [smartRecommendation, setSmartRecommendation] = useState(true)
  const [importantReminder, setImportantReminder] = useState(true)
  const [repeatedCallsEnabled, setRepeatedCallsEnabled] = useState(true)
  const [scrollIndex, setScrollIndex] = useState(0)

  const railRef = useRef<HTMLDivElement | null>(null)

  const activeIndex = useMemo(
    () => MODES.findIndex((mode) => mode.key === activeMode),
    [activeMode]
  )

  const handleScroll = () => {
    const el = railRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / (CARD_W + CARD_GAP))
    if (idx !== scrollIndex && idx >= 0 && idx < MODES.length) {
      setScrollIndex(idx)
    }
  }

  const handleToggleMode = (key: ScenarioModeKey) => {
    if (key === "custom") return
    setActiveMode((prev) => (prev === key ? "dnd" : key))
  }

  const railStyle: CSSProperties = {
    scrollSnapType: "x mandatory",
    paddingLeft: RAIL_PADDING,
    paddingRight: RAIL_PADDING,
    scrollPaddingLeft: RAIL_PADDING,
    gap: `${CARD_GAP}px`,
  }

  return (
    <div
      className="w-[360px] mx-auto"
      style={{ minHeight: "800px", background: PAGE_BG }}
    >
      <StatusBar time="09:41" backgroundColor={PAGE_BG} />

      <div className="w-[328px] mx-auto">
        <TitleBar
          title="免打扰"
          leftIcon={iconChevronBack}
          backgroundColor={PAGE_BG}
        />
      </div>

      {/* 顶部沉浸焦点卡片轮播 */}
      <div
        ref={railRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pt-1 pb-3 scenario-hide-scrollbar"
        style={railStyle}
        role="list"
      >
        {MODES.map((mode) => (
          <div
            role="listitem"
            key={mode.key}
            className="shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <FocusCard
              mode={mode}
              active={mode.key === activeMode}
              onToggle={() => handleToggleMode(mode.key)}
            />
          </div>
        ))}
      </div>

      {/* 轮播指示点 */}
      <div
        className="flex justify-center items-center gap-1.5 mt-1 mb-2"
        role="tablist"
        aria-label="情景模式分页"
      >
        {MODES.map((mode, idx) => {
          const isCurrent = idx === scrollIndex || idx === activeIndex
          return (
            <span
              key={mode.key}
              role="tab"
              aria-selected={isCurrent}
              style={{
                width: idx === scrollIndex ? 18 : 6,
                height: 6,
                borderRadius: 999,
                background:
                  idx === scrollIndex ? BRAND_BLUE : "rgba(0, 0, 0, 0.14)",
                transition: "all 200ms ease",
              }}
            />
          )
        })}
      </div>

      <div className="px-4 pb-6">
        {/* 条件开启 */}
        <GroupLabel first>条件开启</GroupLabel>
        <List className="rounded-[20px]">
          <ListItem
            left={
              <CalendarClock size={22} color={BRAND_BLUE} strokeWidth={1.6} />
            }
            title={
              <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                定时设置
              </span>
            }
            subtitle={
              scheduleEnabled ? (
                <span style={{ color: FONT_TERTIARY, fontSize: 12 }}>
                  每天 23:00 - 次日 07:00
                </span>
              ) : (
                ""
              )
            }
            right={
              <Switch
                modelValue={scheduleEnabled}
                onUpdateModelValue={setScheduleEnabled}
              />
            }
            showArrow={false}
          />
          <ListItem
            left={<Plus size={22} color={BRAND_BLUE} strokeWidth={1.7} />}
            title={
              <span style={{ color: BRAND_BLUE, fontWeight: 500 }}>
                添加条件
              </span>
            }
            subtitle={
              <span style={{ color: FONT_TERTIARY, fontSize: 12 }}>
                如连接 Wi-Fi、进入特定地点时自动生效
              </span>
            }
            right={<RightLink />}
            showArrow={false}
            border={false}
          />
        </List>

        {/* 智能推荐 */}
        <GroupLabel>智能推荐</GroupLabel>
        <List className="rounded-[20px]">
          <ListItem
            title={
              <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                推荐开启与关闭
              </span>
            }
            subtitle={
              <span style={{ color: FONT_TERTIARY, fontSize: 12 }}>
                根据日程、地点等智能识别后建议切换
              </span>
            }
            right={
              <Switch
                modelValue={smartRecommendation}
                onUpdateModelValue={setSmartRecommendation}
              />
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 允许打扰 */}
        <GroupLabel>允许打扰</GroupLabel>
        <List className="rounded-[20px]">
          <ListItem
            left={<AppWindow size={22} color={BRAND_BLUE} strokeWidth={1.6} />}
            title={
              <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                应用和元服务
              </span>
            }
            right={<RightLink value="3 项" />}
            showArrow={false}
            onClick={() => {}}
          />
          <ListItem
            left={<UserRound size={22} color={BRAND_BLUE} strokeWidth={1.6} />}
            title={
              <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                联系人
              </span>
            }
            right={<RightLink value="星标联系人" />}
            showArrow={false}
            border={false}
            onClick={() => {}}
          />
        </List>

        {/* 重要信息提醒 */}
        <GroupLabel>重要信息提醒</GroupLabel>
        <List className="rounded-[20px]">
          <ListItem
            title={
              <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                重要信息提醒
              </span>
            }
            subtitle={
              <span style={{ color: FONT_TERTIARY, fontSize: 12 }}>
                验证码、出行行程等仍会按重要级别提醒
              </span>
            }
            right={
              <Switch
                modelValue={importantReminder}
                onUpdateModelValue={setImportantReminder}
              />
            }
            showArrow={false}
          />
          <ListItem
            title={
              <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                重复来电
              </span>
            }
            subtitle={
              <span style={{ color: FONT_TERTIARY, fontSize: 12 }}>
                15 分钟内同一联系人来电视为紧急
              </span>
            }
            right={
              <Switch
                modelValue={repeatedCallsEnabled}
                onUpdateModelValue={setRepeatedCallsEnabled}
              />
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 关联系统功能 */}
        <GroupLabel>关联系统功能</GroupLabel>
        <List className="rounded-[20px]">
          <ListItem
            left={<MoonStar size={22} color={BRAND_BLUE} strokeWidth={1.6} />}
            title={
              <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                深色模式
              </span>
            }
            right={<ValueWithChevron value="跟随免打扰" emphasize />}
            showArrow={false}
            onClick={() => {}}
          />
          <ListItem
            left={<Eye size={22} color={BRAND_BLUE} strokeWidth={1.6} />}
            title={
              <span style={{ color: FONT_PRIMARY, fontWeight: 500 }}>
                护眼模式
              </span>
            }
            right={<ValueWithChevron value="不关联" />}
            showArrow={false}
            border={false}
            onClick={() => {}}
          />
        </List>

        <p
          className="px-2 pt-3 text-[12px] leading-relaxed"
          style={{ color: "rgba(0, 0, 0, 0.4)" }}
        >
          开启后，将根据你设定的条件自动进入对应模式；可在「智能推荐」中关闭自动建议。
        </p>
      </div>

      <div className="h-7 flex justify-center items-end pb-1">
        <div className="w-28 h-1.5 rounded-full bg-black/25" />
      </div>

      <style>{`
        .scenario-hide-scrollbar::-webkit-scrollbar { display: none; }
        .scenario-hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }

        @keyframes scenario-breath-glow {
          0%, 100% {
            box-shadow:
              0 8px 24px rgba(10, 89, 247, 0.18),
              0 0 0 0 rgba(10, 89, 247, 0.32);
          }
          50% {
            box-shadow:
              0 16px 40px rgba(10, 89, 247, 0.3),
              0 0 0 14px rgba(10, 89, 247, 0);
          }
        }

        @keyframes scenario-breath-halo {
          0%, 100% {
            opacity: 0.55;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.85;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        .scenario-focus-card {
          position: relative;
          width: ${CARD_W}px;
          height: 196px;
          border-radius: 24px;
          padding: 20px;
          overflow: hidden;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(135deg, #2f50d8 0%, #0a59f7 100%);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .scenario-focus-card[data-mode="dnd"] {
          background: linear-gradient(135deg, #2f50d8 0%, #0a59f7 60%, #6c8cff 100%);
        }
        .scenario-focus-card[data-mode="work"] {
          background: linear-gradient(135deg, #142a72 0%, #2347d6 100%);
        }
        .scenario-focus-card[data-mode="sleep"] {
          background: linear-gradient(135deg, #2a1c66 0%, #4a3ab8 60%, #6c63d9 100%);
        }
        .scenario-focus-card[data-mode="drive"] {
          background: linear-gradient(135deg, #0d4f8f 0%, #1186d4 100%);
        }
        .scenario-focus-card[data-mode="custom"] {
          background: linear-gradient(135deg, #f4f6fb 0%, #e6ecff 100%);
          color: rgba(0, 0, 0, 0.88);
        }
        .scenario-focus-card[data-active="true"] {
          animation: scenario-breath-glow 2.6s ease-in-out infinite;
        }
        .scenario-focus-card__halo {
          position: absolute;
          left: 30%;
          top: 32%;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 70%);
          pointer-events: none;
        }
        .scenario-focus-card[data-active="true"] .scenario-focus-card__halo {
          animation: scenario-breath-halo 2.6s ease-in-out infinite;
        }
        .scenario-focus-card[data-mode="custom"] .scenario-focus-card__halo {
          background: radial-gradient(circle, rgba(10,89,247,0.18) 0%, rgba(10,89,247,0) 70%);
        }
        .scenario-focus-card__head {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1;
        }
        .scenario-focus-card__icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(6px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .scenario-focus-card[data-mode="custom"] .scenario-focus-card__icon {
          background: rgba(10, 89, 247, 0.1);
        }
        .scenario-focus-card__chip {
          font-size: 11px;
          font-weight: 500;
          line-height: 16px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
          letter-spacing: 0.2px;
        }
        .scenario-focus-card[data-mode="custom"] .scenario-focus-card__chip {
          background: rgba(10, 89, 247, 0.1);
          color: #0a59f7;
        }
        .scenario-focus-card__body {
          position: relative;
          z-index: 1;
        }
        .scenario-focus-card__title {
          font-size: 22px;
          font-weight: 600;
          line-height: 28px;
          letter-spacing: 0.1px;
        }
        .scenario-focus-card__subtitle {
          margin-top: 6px;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          opacity: 0.78;
        }
        .scenario-focus-card__action {
          position: relative;
          z-index: 1;
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 32px;
          padding: 0 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          line-height: 18px;
          background: rgba(255, 255, 255, 0.95);
          color: #0a59f7;
          border: none;
          cursor: pointer;
          transition: transform 120ms ease, background 120ms ease;
        }
        .scenario-focus-card__action:hover { background: #ffffff; }
        .scenario-focus-card__action:active { transform: scale(0.97); }
        .scenario-focus-card[data-active="false"] .scenario-focus-card__action {
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .scenario-focus-card[data-mode="custom"][data-active="false"] .scenario-focus-card__action {
          background: rgba(10, 89, 247, 0.08);
          color: #0a59f7;
          border: 1px solid rgba(10, 89, 247, 0.3);
        }
        .scenario-focus-card__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0a59f7;
          box-shadow: 0 0 0 3px rgba(10, 89, 247, 0.18);
        }
        .scenario-focus-card[data-active="false"] .scenario-focus-card__dot {
          background: rgba(255, 255, 255, 0.65);
          box-shadow: none;
        }
      `}</style>
    </div>
  )
}
