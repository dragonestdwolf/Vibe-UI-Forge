"use client"

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react"
import { ChevronDown, Clock3 } from "lucide-react"

import { HarmonyPageShell } from "@/component/HarmonyPageShell"
import { FeaturePromoCard } from "@/component/FeaturePromoCard"
import { Switch } from "@/component/Switch"
import { SwiperNav } from "@/component/SwiperNav"
import { TitleBar } from "@/component/TitleBar"
import {
  DoNotDisturbIcon,
  PersonalModeIcon,
  SleepModeIcon,
  WorkModeIcon,
} from "@/component/FeaturePromoCard/mode-icons"

import iconArrowRightSmall from "../../blocks/assets/pixso-icons/icon-arrow-right-small.png"
import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

const PAGE_BG = "#F2F3F5"
const BRAND_BLUE = "#0A59F7"
const TEXT_PRIMARY = "rgba(0, 0, 0, 0.9)"
const TEXT_SECONDARY = "rgba(0, 0, 0, 0.6)"
const DIVIDER = "rgba(0, 0, 0, 0.08)"
const CARD_WIDTH = 244
const CARD_GAP = 12

type ModeKey = "dnd" | "personal" | "work" | "sleep"

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

function createIconDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const iconAdd = createIconDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`
)

const iconHelp = createIconDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#000000" stroke-width="2" />
    <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7C13.38 7 14.5 8.12 14.5 9.5C14.5 10.5 14 11 13 11.5C12.3 11.85 12 12.3 12 13.2V13.5" stroke="#000000" stroke-width="2" stroke-linecap="round" />
    <circle cx="12" cy="16.8" r="1.05" fill="#000000" />
  </svg>`
)

const iconMore = createIconDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="12" r="1.8" fill="#000000" />
    <circle cx="12" cy="12" r="1.8" fill="#000000" />
    <circle cx="18" cy="12" r="1.8" fill="#000000" />
  </svg>`
)

const MODE_OPTIONS: Array<{
  key: ModeKey
  title: string
  subtitle: string
  summary: string
  conditionDays: string
  conditionTime: string
  appValue: string
  contactValue: string
  darkLinkValue: string
  eyeLinkValue: string
  icon: ReactNode
}> = [
  {
    key: "dnd",
    title: "免打扰",
    subtitle: "减少打扰保持专注",
    summary: "左右滑动卡片即可切换模式，当前模式会在本页实时生效。",
    conditionDays: "周日 周六",
    conditionTime: "22:00-次日 07:00",
    appValue: "未选择",
    contactValue: "仅允许收藏联系人",
    darkLinkValue: "不关联",
    eyeLinkValue: "不关联",
    icon: <DoNotDisturbIcon />,
  },
  {
    key: "personal",
    title: "个人",
    subtitle: "个人日程更从容",
    summary: "更偏向个人事务与生活提醒，减少工作类消息的侵入节奏。",
    conditionDays: "每天",
    conditionTime: "08:30-22:30",
    appValue: "日历、提醒",
    contactValue: "所有联系人",
    darkLinkValue: "不关联",
    eyeLinkValue: "关联",
    icon: <PersonalModeIcon />,
  },
  {
    key: "work",
    title: "工作",
    subtitle: "会议与专注优先",
    summary: "工作时段优先保留邮箱、会议与协作提醒，控制非必要打扰。",
    conditionDays: "工作日",
    conditionTime: "09:00-18:30",
    appValue: "会议、邮箱",
    contactValue: "仅允许星标联系人",
    darkLinkValue: "自动开启",
    eyeLinkValue: "不关联",
    icon: <WorkModeIcon />,
  },
  {
    key: "sleep",
    title: "睡眠",
    subtitle: "夜间静默更柔和",
    summary: "夜间自动转入安静状态，保留必要提醒并联动更柔和的显示方式。",
    conditionDays: "每日",
    conditionTime: "22:30-次日 07:00",
    appValue: "闹钟、健康",
    contactValue: "仅允许紧急联系人",
    darkLinkValue: "关联",
    eyeLinkValue: "关联",
    icon: <SleepModeIcon />,
  },
]

function Card({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-[20px] bg-white">{children}</div>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="px-px pb-2 text-[16px] leading-[19px] font-medium"
      style={{ color: TEXT_PRIMARY }}
    >
      {children}
    </div>
  )
}

function SectionNote({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cx("pt-2 text-[12px] leading-[16.8px]", className)}
      style={{ color: TEXT_SECONDARY }}
    >
      {children}
    </p>
  )
}

function SettingValue({
  value,
  down = false,
  accent = false,
}: {
  value: string
  down?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      <span
        className="whitespace-nowrap text-[14px] leading-[14px]"
        style={{ color: accent ? BRAND_BLUE : TEXT_SECONDARY }}
      >
        {value}
      </span>
      {down ? (
        <ChevronDown size={18} strokeWidth={1.9} color="rgba(0, 0, 0, 0.28)" />
      ) : (
        <img src={iconArrowRightSmall} alt="" className="h-6 w-3" />
      )}
    </div>
  )
}

function Row({
  leading,
  title,
  subtitle,
  trailing,
  border = true,
  compact = false,
}: {
  leading?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  border?: boolean
  compact?: boolean
}) {
  const multiline = subtitle !== undefined && subtitle !== null && subtitle !== false

  return (
    <div
      className={cx(
        "flex gap-3 px-4",
        multiline ? "min-h-[72px] items-start py-3" : compact ? "min-h-[48px] items-center" : "min-h-[56px] items-center",
        border && "border-b"
      )}
      style={border ? { borderColor: DIVIDER } : undefined}
    >
      {leading ? <div className="flex h-6 w-6 shrink-0 items-center justify-center self-center">{leading}</div> : null}

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="min-w-0">
          <div
            className="truncate text-[16px] leading-[16px] font-medium"
            style={{ color: TEXT_PRIMARY }}
          >
            {title}
          </div>
          {multiline ? (
            <div
              className="mt-1 truncate text-[12px] leading-[16px]"
              style={{ color: TEXT_SECONDARY }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </div>
  )
}

function SwitchRow({
  title,
  checked,
  onChange,
}: {
  title: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex min-h-[56px] items-center justify-between gap-3 px-4">
      <div className="text-[16px] leading-[16px] font-medium" style={{ color: TEXT_PRIMARY }}>
        {title}
      </div>
      <Switch
        modelValue={checked}
        onUpdateModelValue={onChange}
        activeColor={BRAND_BLUE}
        inactiveColor="rgba(0, 0, 0, 0.12)"
      />
    </div>
  )
}

export default function SceneModeSettingsV4() {
  const railRef = useRef<HTMLDivElement | null>(null)
  const [activeMode, setActiveMode] = useState<ModeKey>("dnd")
  const [smartRecommendationEnabled, setSmartRecommendationEnabled] = useState(true)
  const [importantReminderEnabled, setImportantReminderEnabled] = useState(true)

  const activeIndex = useMemo(
    () => MODE_OPTIONS.findIndex((mode) => mode.key === activeMode),
    [activeMode]
  )
  const activeModeData = MODE_OPTIONS[activeIndex] ?? MODE_OPTIONS[0]

  const scrollToMode = useCallback((index: number) => {
    const rail = railRef.current
    const target = rail?.children[index]
    if (!target || !(target instanceof HTMLElement)) return
    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }, [])

  const handleModeScroll = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const index = Math.round(rail.scrollLeft / (CARD_WIDTH + CARD_GAP))
    const next = MODE_OPTIONS[index]
    if (next && next.key !== activeMode) {
      setActiveMode(next.key)
    }
  }, [activeMode])

  const handleModeSelect = useCallback(
    (index: number) => {
      const next = MODE_OPTIONS[index]
      if (!next) return
      setActiveMode(next.key)
      scrollToMode(index)
    },
    [scrollToMode]
  )

  return (
    <HarmonyPageShell background={PAGE_BG} statusBarProps={{ time: "08:08" }}>
      <div className="mx-auto w-[328px] pb-8">
        <TitleBar
          title="情景模式"
          subtitle=""
          leftIcon={iconChevronBack}
          rightIcons={[iconAdd, iconHelp, iconMore]}
          backgroundColor={PAGE_BG}
        />

        <p
          className="mt-2 text-[14px] leading-[22px]"
          style={{ color: TEXT_SECONDARY }}
        >
          情景模式开启后会自动调整系统功能，让您能全身心投入情景。
        </p>

        <section className="mt-6">
          <div
            ref={railRef}
            className="mx-[-16px] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[58px] pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollPaddingInline: 58 }}
            onScroll={handleModeScroll}
            role="list"
            aria-label="情景模式轮播"
          >
            {MODE_OPTIONS.map((mode, index) => {
              const selected = mode.key === activeMode

              return (
                <div
                  key={mode.key}
                  className="shrink-0 snap-center"
                  role="listitem"
                >
                  <FeaturePromoCard
                    icon={mode.icon}
                    title={mode.title}
                    subtitle={mode.subtitle}
                    actionLabel={selected ? "当前模式" : "设为当前模式"}
                    onAction={() => handleModeSelect(index)}
                    actionDisabled={selected}
                    className={cx(
                      "transition-all duration-200",
                      selected
                        ? "shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
                        : "scale-[0.985] opacity-80"
                    )}
                  />
                </div>
              )
            })}
          </div>

          <div className="mt-1 flex justify-center">
            <SwiperNav
              variant="dots"
              current={activeIndex + 1}
              dotsCount={MODE_OPTIONS.length}
              total={MODE_OPTIONS.length}
              className="!w-auto"
            />
          </div>

          <div className="mt-2 rounded-[18px] bg-white/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] leading-[13px] font-medium text-[#0A59F7]">
                当前模式
              </span>
              <span className="text-[16px] leading-[16px] font-medium" style={{ color: TEXT_PRIMARY }}>
                {activeModeData.title}
              </span>
            </div>
            <p className="mt-2 text-[12px] leading-[18px]" style={{ color: TEXT_SECONDARY }}>
              {activeModeData.summary}
            </p>
          </div>
        </section>

        <section className="mt-4">
          <SectionLabel>条件开启</SectionLabel>
          <Card>
            <Row
              leading={<Clock3 size={20} strokeWidth={1.9} color={TEXT_PRIMARY} />}
              title={activeModeData.conditionDays}
              subtitle={activeModeData.conditionTime}
              trailing={<SettingValue value="右侧文本" accent={activeMode === "work"} />}
            />
            <div className="px-4 py-[15px] text-[16px] leading-[16px] font-medium" style={{ color: BRAND_BLUE }}>
              添加条件
            </div>
          </Card>
          <SectionNote>本功能需调用位置权限，读取位置信息</SectionNote>
        </section>

        <section className="mt-4">
          <SectionLabel>推荐开启与关闭</SectionLabel>
          <Card>
            <SwitchRow
              title="推荐开启与关闭"
              checked={smartRecommendationEnabled}
              onChange={setSmartRecommendationEnabled}
            />
          </Card>
          <SectionNote>
            基于个人偏好,以及位置、时间等数据信息,智能推荐开启或关闭相应的情景模式,关闭后将影响情景模式的推荐体验。
            <a
              href="#"
              className="block pt-1 no-underline"
              style={{ color: BRAND_BLUE }}
            >
              查看使用个性化智能服务的应用
            </a>
          </SectionNote>
        </section>

        <section className="mt-4">
          <SectionLabel>允许打扰</SectionLabel>
          <Card>
            <Row
              title="应用和元服务"
              trailing={<SettingValue value={activeModeData.appValue} />}
            />
            <Row
              title="联系人"
              trailing={<SettingValue value={activeModeData.contactValue} />}
              border={false}
            />
          </Card>
        </section>

        <section className="mt-4">
          <SectionLabel>重要信息提醒</SectionLabel>
          <Card>
            <SwitchRow
              title="重要信息提醒"
              checked={importantReminderEnabled}
              onChange={setImportantReminderEnabled}
            />
          </Card>
          <SectionNote>开启后,模式开启期间会提醒重要信息(短信验证码和实况)。</SectionNote>
        </section>

        <section className="mt-4">
          <SectionLabel>关联系统功能</SectionLabel>
          <Card>
            <Row
              title="深色模式"
              trailing={<SettingValue value={activeModeData.darkLinkValue} down />}
            />
            <Row
              title="护眼模式"
              trailing={<SettingValue value={activeModeData.eyeLinkValue} down />}
              border={false}
            />
          </Card>
        </section>

        <div className="h-5" />
      </div>
    </HarmonyPageShell>
  )
}
