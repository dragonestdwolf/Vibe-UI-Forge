"use client"

import { useMemo, useState, type ReactNode } from "react"

import { Divider } from "@/component/Divider"
import { FeaturePromoCard } from "@/component/FeaturePromoCard"
import { List, ListItem } from "@/component/List"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { TitleBar } from "@/component/TitleBar"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  MoonStar,
  Plus,
  Sparkles,
  TimerReset,
} from "lucide-react"

import "./index.css"

type ModeKey = "dnd" | "focus" | "sleep"

type ModeDefinition = {
  key: ModeKey
  title: string
  subtitle: string
  summary: string
  actionLabel: string
  icon: ReactNode
}

function DoNotDisturbIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="免打扰">
      <defs>
        <linearGradient id="scene-mode-dnd-fill" x1="14" y1="10" x2="50" y2="54">
          <stop offset="0%" stopColor="#1F78FF" />
          <stop offset="100%" stopColor="#0A59F7" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="url(#scene-mode-dnd-fill)" />
      <path
        d="M40.4 41.2c-7.4 0-13.4-6-13.4-13.4 0-3 1-5.7 2.6-7.9-5.6 1.4-9.7 6.4-9.7 12.4 0 7.1 5.7 12.8 12.8 12.8 6 0 11-4.1 12.4-9.7-1.4 1-2.9 1.7-4.7 1.8z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function FocusModeIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="专注模式">
      <circle cx="32" cy="32" r="29" fill="#E8F1FF" />
      <circle cx="32" cy="32" r="15" fill="none" stroke="#0A59F7" strokeWidth="3" />
      <circle cx="32" cy="32" r="6" fill="#0A59F7" />
      <path d="M32 14v8M32 42v8M14 32h8M42 32h8" stroke="#7BA9FF" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function SleepModeIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="睡眠模式">
      <circle cx="32" cy="32" r="29" fill="#EEF6FF" />
      <path
        d="M40 41c-7.5 0-13.5-6-13.5-13.5 0-2.6.7-5 2-7-5.5 1.5-9.5 6.5-9.5 12.5 0 7.2 5.8 13 13 13 5.4 0 10-3.3 12-8-1.3.6-2.7 1-4 1z"
        fill="#0A59F7"
      />
      <circle cx="44.5" cy="19.5" r="2" fill="#7BB4FF" />
      <circle cx="39.5" cy="15" r="1.2" fill="#7BB4FF" />
    </svg>
  )
}

function SectionEyebrow({
  icon,
  children,
}: {
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="scene-mode-settings-v3__eyebrow">
      {icon ? <span className="scene-mode-settings-v3__eyebrow-icon">{icon}</span> : null}
      <span>{children}</span>
    </div>
  )
}

function RightValue({
  value,
  expand = false,
}: {
  value: string
  expand?: boolean
}) {
  return (
    <div className="scene-mode-settings-v3__right-value">
      <span className="scene-mode-settings-v3__right-value-text">{value}</span>
      {expand ? (
        <ChevronDown size={18} strokeWidth={1.9} className="text-black/32" />
      ) : (
        <ChevronRight size={18} strokeWidth={1.9} className="text-black/32" />
      )}
    </div>
  )
}

const modes: ModeDefinition[] = [
  {
    key: "dnd",
    title: "免打扰",
    subtitle: "减少打扰保持专注",
    summary: "保留重要信息提醒，让安静和效率同时在线。",
    actionLabel: "立即开启",
    icon: <DoNotDisturbIcon />,
  },
  {
    key: "focus",
    title: "专注模式",
    subtitle: "学习工作更少分心",
    summary: "压低娱乐型提醒，保持阅读、会议与创作节奏。",
    actionLabel: "切换模式",
    icon: <FocusModeIcon />,
  },
  {
    key: "sleep",
    title: "睡眠模式",
    subtitle: "夜间通知更克制柔和",
    summary: "放缓夜间通知节奏，让休息时间更完整、不被轻易打断。",
    actionLabel: "切换模式",
    icon: <SleepModeIcon />,
  },
]

export default function SceneModeSettingsV3() {
  const [selectedMode, setSelectedMode] = useState<ModeKey>("dnd")
  const [enabledMode, setEnabledMode] = useState<ModeKey>("dnd")
  const [smartRecommendationEnabled, setSmartRecommendationEnabled] = useState(true)
  const [importantReminderEnabled, setImportantReminderEnabled] = useState(false)

  const orderedModes = useMemo(() => {
    const active = modes.find((mode) => mode.key === selectedMode)
    const rest = modes.filter((mode) => mode.key !== selectedMode)
    return active ? [active, ...rest] : modes
  }, [selectedMode])

  const selectedModeData =
    modes.find((mode) => mode.key === selectedMode) ?? modes[0]

  return (
    <div className="scene-mode-settings-v3">
      <StatusBar time="08:08" backgroundColor="transparent" />

      <div className="scene-mode-settings-v3__shell">
        <TitleBar
          title="情景模式"
          subtitle=""
          rightIcons={[]}
          backgroundColor="transparent"
        />

        <section className="scene-mode-settings-v3__hero">
          <SectionEyebrow icon={<Sparkles size={14} strokeWidth={2.1} />}>
            焦点场景
          </SectionEyebrow>

          <div className="scene-mode-settings-v3__hero-copy">
            <h1 className="scene-mode-settings-v3__hero-title">
              让模式切换更自然地贴合当下状态
            </h1>
            <p className="scene-mode-settings-v3__hero-description">
              开启后会自动过滤低优先级提醒，并根据你的节奏联动安静时段与系统功能，让专注更顺滑。
            </p>
          </div>

          <div className="scene-mode-settings-v3__hero-scroll">
            <div className="scene-mode-settings-v3__hero-track">
              {orderedModes.map((mode) => {
                const selected = mode.key === selectedMode
                const enabled = mode.key === enabledMode

                return (
                  <button
                    key={mode.key}
                    type="button"
                    className={cn(
                      "scene-mode-settings-v3__mode-shell",
                      selected && "scene-mode-settings-v3__mode-shell--selected"
                    )}
                    onClick={() => setSelectedMode(mode.key)}
                  >
                    <FeaturePromoCard
                      icon={mode.icon}
                      title={mode.title}
                      subtitle={mode.subtitle}
                      className={cn(
                        "scene-mode-settings-v3__mode-card",
                        enabled &&
                          selected &&
                          "scene-mode-settings-v3__mode-card--enabled"
                      )}
                      actionLabel={selected ? (enabled ? "已开启" : mode.actionLabel) : undefined}
                      actionDisabled={enabled}
                      onAction={(event) => {
                        event.stopPropagation()
                        setSelectedMode(mode.key)
                        setEnabledMode(mode.key)
                      }}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="scene-mode-settings-v3__hero-footer">
            <div className="scene-mode-settings-v3__hero-summary">
              <span className="scene-mode-settings-v3__hero-summary-label">当前模式</span>
              <strong>{selectedModeData.title}</strong>
              <span>{selectedModeData.summary}</span>
            </div>

            <div className="scene-mode-settings-v3__pager" aria-hidden="true">
              {modes.map((mode) => (
                <span
                  key={mode.key}
                  className={cn(
                    "scene-mode-settings-v3__pager-dot",
                    mode.key === selectedMode && "scene-mode-settings-v3__pager-dot--active"
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="scene-mode-settings-v3__hero-divider">
          <Divider margin="0" hairline />
        </div>

        <main className="scene-mode-settings-v3__stack">
          <section>
            <SectionEyebrow icon={<TimerReset size={14} strokeWidth={2.1} />}>
              条件开启
            </SectionEyebrow>

            <List className="scene-mode-settings-v3__group">
              <ListItem
                title={<span className="font-medium">定时开启</span>}
                subtitle="周日 周六 · 22:00 - 次日 07:00"
                right={<RightValue value="已关闭" />}
                leftGap={0}
                showArrow={false}
              />
              <ListItem
                title={<span className="font-medium">添加条件</span>}
                subtitle="位置、蓝牙设备或指定应用"
                right={
                  <div className="scene-mode-settings-v3__link-action">
                    <Plus size={15} strokeWidth={2.4} />
                    <span>新建</span>
                  </div>
                }
                leftGap={0}
                showArrow={false}
                border={false}
              />
            </List>

            <p className="scene-mode-settings-v3__group-note">
              本功能可在授权后联动位置与时间条件，在进入指定情境时自动切换模式。
            </p>
          </section>

          <section>
            <SectionEyebrow icon={<Sparkles size={14} strokeWidth={2.1} />}>
              推荐开启与关闭
            </SectionEyebrow>

            <List className="scene-mode-settings-v3__group">
              <ListItem
                title={<span className="font-medium">智能推荐</span>}
                subtitle="基于时间与位置智能建议模式"
                right={
                  <Switch
                    modelValue={smartRecommendationEnabled}
                    onUpdateModelValue={setSmartRecommendationEnabled}
                    activeColor="#0A59F7"
                    inactiveColor="rgba(0, 0, 0, 0.16)"
                  />
                }
                leftGap={0}
                showArrow={false}
                border={false}
                onClick={() =>
                  setSmartRecommendationEnabled((value) => !value)
                }
              />
            </List>
          </section>

          <section>
            <SectionEyebrow>允许打扰</SectionEyebrow>

            <List className="scene-mode-settings-v3__group">
              <ListItem
                title={<span className="font-medium">应用和元服务</span>}
                right={<RightValue value="未选择" />}
                leftGap={0}
                showArrow={false}
              />
              <ListItem
                title={<span className="font-medium">联系人</span>}
                right={<RightValue value="仅允许收藏联系人" />}
                leftGap={0}
                showArrow={false}
                border={false}
              />
            </List>
          </section>

          <section>
            <SectionEyebrow>重要信息提醒</SectionEyebrow>

            <List className="scene-mode-settings-v3__group">
              <ListItem
                title={<span className="font-medium">保持重要提醒可达</span>}
                subtitle="验证码与实况通知仍可送达"
                right={
                  <Switch
                    modelValue={importantReminderEnabled}
                    onUpdateModelValue={setImportantReminderEnabled}
                    activeColor="#0A59F7"
                    inactiveColor="rgba(0, 0, 0, 0.16)"
                  />
                }
                leftGap={0}
                showArrow={false}
                border={false}
                onClick={() =>
                  setImportantReminderEnabled((value) => !value)
                }
              />
            </List>
          </section>

          <section>
            <SectionEyebrow icon={<MoonStar size={14} strokeWidth={2.1} />}>
              关联系统功能
            </SectionEyebrow>

            <List className="scene-mode-settings-v3__group">
              <ListItem
                title={<span className="font-medium">深色模式</span>}
                right={<RightValue value="不关联" expand />}
                leftGap={0}
                showArrow={false}
              />
              <ListItem
                title={<span className="font-medium">护眼模式</span>}
                right={<RightValue value="不关联" expand />}
                leftGap={0}
                showArrow={false}
                border={false}
              />
            </List>
          </section>
        </main>

        <footer className="scene-mode-settings-v3__footer">
          <p className="scene-mode-settings-v3__footer-note">
            模式开启后仍会保留必要的联系人与系统级提醒，避免安静模式影响关键事务。
          </p>
          <div className="scene-mode-settings-v3__home-indicator" />
        </footer>
      </div>
    </div>
  )
}
