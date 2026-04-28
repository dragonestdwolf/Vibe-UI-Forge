"use client"

import { useState } from "react"
import {
  AppWindow,
  BellRing,
  Clock3,
  ContactRound,
  Eye,
  MoonStar,
  Plus,
  ShieldCheck,
  Sparkles,
  SunMoon,
} from "lucide-react"

import { GroupedListSection } from "@/blocks/grouped-list-section"
import { HarmonyPageShell } from "@/component/HarmonyPageShell"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"
import iconArrowRightSmall from "../../blocks/assets/pixso-icons/icon-arrow-right-small.png"

type SceneMode = "sleep" | "focus" | "meeting"

type ModeCard = {
  id: SceneMode
  name: string
  intro: string
  action: string
  badge: string
}

const modeCards: ModeCard[] = [
  {
    id: "sleep",
    name: "睡眠免扰",
    intro: "夜间自动静默通知，仅保留重要联系人与闹钟提醒。",
    action: "立即开启",
    badge: "推荐",
  },
  {
    id: "focus",
    name: "专注工作",
    intro: "屏蔽干扰信息，减少横幅与来电打断，保持沉浸节奏。",
    action: "开启专注",
    badge: "工作日",
  },
  {
    id: "meeting",
    name: "会议静默",
    intro: "仅允许白名单提醒，自动关联深色与护眼模式，观感更克制。",
    action: "一键静默",
    badge: "场景",
  },
]

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

function SettingArrowLabel({
  value,
  emphasize = false,
}: {
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={cx(
          "text-[14px] leading-5",
          emphasize ? "font-medium text-[#0A59F7]" : "text-black/60"
        )}
      >
        {value}
      </span>
      <img src={iconArrowRightSmall} alt="" className="h-6 w-3" />
    </div>
  )
}

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-[#0A59F7]/8">
      {children}
    </div>
  )
}

function ModeCarousel({
  value,
  onChange,
}: {
  value: SceneMode
  onChange: (next: SceneMode) => void
}) {
  return (
    <div
      className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollPaddingInline: 16 }}
    >
      {modeCards.map((card, index) => {
        const active = card.id === value
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onChange(card.id)}
            className={cx(
              "relative w-[288px] shrink-0 snap-center overflow-hidden rounded-[30px] p-5 text-left",
              active ? "bg-[#0A59F7] text-white" : "bg-[#F5F8FC] text-black"
            )}
            aria-pressed={active}
          >
            <div
              className={cx(
                "pointer-events-none absolute inset-x-0 top-0 h-[210px]",
                active
                  ? "bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.30),transparent_36%),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_70%)]"
                  : "bg-[radial-gradient(circle_at_24%_18%,rgba(10,89,247,0.10),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(10,89,247,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,248,252,0.95))]"
              )}
            />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div
                className={cx(
                  "inline-flex rounded-full px-3 py-1 text-[12px] leading-4 font-medium",
                  active ? "bg-white/16 text-white" : "bg-[#0A59F7]/8 text-[#0A59F7]"
                )}
              >
                {card.badge}
              </div>
              <div
                className={cx(
                  "flex size-12 items-center justify-center rounded-full",
                  active ? "bg-white/14" : "bg-white"
                )}
              >
                {index === 0 ? (
                  <MoonStar
                    size={24}
                    strokeWidth={1.8}
                    color={active ? "#FFFFFF" : "rgba(0,0,0,0.9)"}
                  />
                ) : index === 1 ? (
                  <Sparkles
                    size={24}
                    strokeWidth={1.8}
                    color={active ? "#FFFFFF" : "rgba(0,0,0,0.9)"}
                  />
                ) : (
                  <ShieldCheck
                    size={24}
                    strokeWidth={1.8}
                    color={active ? "#FFFFFF" : "rgba(0,0,0,0.9)"}
                  />
                )}
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <div
                className={cx(
                  "text-[28px] leading-[32px] font-semibold tracking-[-0.03em]",
                  active ? "text-white" : "text-black/90"
                )}
              >
                {card.name}
              </div>
              <p
                className={cx(
                  "mt-3 max-w-[220px] text-[14px] leading-[22px]",
                  active ? "text-white/80" : "text-black/55"
                )}
              >
                {card.intro}
              </p>
            </div>

            <div className="relative z-10 mt-10 flex items-center justify-between">
              <div className={cx("text-[12px] leading-4", active ? "text-white/60" : "text-black/38")}>
                向左滑动查看更多模式
              </div>
              <div
                className={cx(
                  "rounded-full px-4 py-2 text-[15px] leading-5 font-medium",
                  active ? "bg-white text-[#0A59F7]" : "bg-[#0A59F7] text-white"
                )}
              >
                {card.action}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default function DoNotDisturbScenePageV2() {
  const [activeMode, setActiveMode] = useState<SceneMode>("sleep")
  const [repeatCallers, setRepeatCallers] = useState(true)
  const [recommendedSilence, setRecommendedSilence] = useState(true)
  const [importantAlerts, setImportantAlerts] = useState(false)
  const [calendarAlerts, setCalendarAlerts] = useState(true)

  return (
    <HarmonyPageShell background="#F1F3F5" statusBarProps={{ time: "09:41" }}>
      <div className="mx-auto w-[328px]">
        <TitleBar
          title="免打扰"
          subtitle=""
          leftIcon={iconChevronBack}
          rightIcons={[]}
          backgroundColor="#F1F3F5"
        />
        <p className="px-1 text-[14px] leading-[22px] text-black/60">
          在不同情景中降低打扰强度，保留真正重要的信息提醒与系统联动。
        </p>
      </div>

      <ModeCarousel value={activeMode} onChange={setActiveMode} />

      <main className="flex flex-col gap-3 px-4 pb-6 pt-4">
        <GroupedListSection
          subtitle="条件开启"
          footnote="可按时间、地点或使用状态自动触发免打扰模式。"
        >
          <List className="rounded-[24px]">
            <ListItem
              left={
                <IconTile>
                  <Clock3 size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">定时设置</span>}
              subtitle="工作日 22:30 - 次日 07:00"
              right={<SettingArrowLabel value="已开启" emphasize />}
              showArrow={false}
            />
            <ListItem
              left={
                <IconTile>
                  <Plus size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">添加条件</span>}
              subtitle="地点、蓝牙连接或指定应用打开时触发"
              right={<SettingArrowLabel value="添加" />}
              showArrow={false}
              border={false}
            />
          </List>
        </GroupedListSection>

        <GroupedListSection subtitle="推荐开启与关闭">
          <List className="rounded-[24px]">
            <ListItem
              left={
                <IconTile>
                  <Sparkles size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">推荐静默通知</span>}
              subtitle="横幅、提醒音与震动统一收敛"
              right={
                <Switch
                  modelValue={recommendedSilence}
                  onUpdateModelValue={setRecommendedSilence}
                />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <IconTile>
                  <BellRing size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">重复来电提醒</span>}
              subtitle="同一联系人 3 分钟内再次来电时放行"
              right={
                <Switch
                  modelValue={repeatCallers}
                  onUpdateModelValue={setRepeatCallers}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </GroupedListSection>

        <GroupedListSection subtitle="允许打扰">
          <List className="rounded-[24px]">
            <ListItem
              left={
                <IconTile>
                  <AppWindow size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">应用和元服务</span>}
              subtitle="允许导航、外卖、健康提醒等重点服务通知"
              right={<SettingArrowLabel value="4 项已允许" />}
              showArrow={false}
            />
            <ListItem
              left={
                <IconTile>
                  <ContactRound size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">联系人</span>}
              subtitle="收藏联系人与紧急联系人可直接呼入"
              right={<SettingArrowLabel value="收藏联系人" />}
              showArrow={false}
              border={false}
            />
          </List>
        </GroupedListSection>

        <GroupedListSection subtitle="重要信息提醒">
          <List className="rounded-[24px]">
            <ListItem
              left={
                <IconTile>
                  <BellRing size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">紧急通知提醒</span>}
              subtitle="高优先级告警可穿透当前静默限制"
              right={
                <Switch
                  modelValue={importantAlerts}
                  onUpdateModelValue={setImportantAlerts}
                />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <IconTile>
                  <ShieldCheck size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">日程与待办提醒</span>}
              subtitle="会议、航班与出行类重要事项优先提醒"
              right={
                <Switch
                  modelValue={calendarAlerts}
                  onUpdateModelValue={setCalendarAlerts}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </GroupedListSection>

        <GroupedListSection subtitle="关联系统功能">
          <List className="rounded-[24px]">
            <ListItem
              left={
                <IconTile>
                  <SunMoon size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">深色模式</span>}
              subtitle="夜间开启免打扰时同步切换更克制的显示风格"
              right={<SettingArrowLabel value="跟随模式" />}
              showArrow={false}
            />
            <ListItem
              left={
                <IconTile>
                  <Eye size={21} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.7} />
                </IconTile>
              }
              title={<span className="font-medium">护眼模式</span>}
              subtitle="在睡眠与专注场景下自动降低蓝光刺激"
              right={<SettingArrowLabel value="夜间自动关联" />}
              showArrow={false}
              border={false}
            />
          </List>
        </GroupedListSection>
      </main>
    </HarmonyPageShell>
  )
}
