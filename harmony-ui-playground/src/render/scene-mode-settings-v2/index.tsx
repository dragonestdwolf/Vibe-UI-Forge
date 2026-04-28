"use client"

import { useState, type ReactNode } from "react"
import { Divider, List, ListItem, StatusBar, Switch } from "@/component"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"

import "./index.css"

type ModeKey = "dnd" | "focus" | "sleep"

type ModeCard = {
  key: ModeKey
  badge?: string
  title: string
  description: string
  cta: string
  icon: ReactNode
}

function DoNotDisturbIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="免打扰"
    >
      <circle cx="32" cy="32" r="29" fill="#0A59F7" />
      <path
        d="M40.4 41.2c-7.4 0-13.4-6-13.4-13.4 0-3 1-5.7 2.6-7.9-5.6 1.4-9.7 6.4-9.7 12.4 0 7.1 5.7 12.8 12.8 12.8 6 0 11-4.1 12.4-9.7-1.4 1-2.9 1.7-4.7 1.8z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function FocusModeIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="专注模式"
    >
      <circle cx="32" cy="32" r="29" fill="#EAF3FF" />
      <circle cx="32" cy="32" r="15" fill="none" stroke="#0A59F7" strokeWidth="3" />
      <circle cx="32" cy="32" r="6" fill="#0A59F7" />
    </svg>
  )
}

function SleepModeIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="睡眠模式"
    >
      <circle cx="32" cy="32" r="29" fill="#EAF7FF" />
      <path
        d="M40 41c-7.5 0-13.5-6-13.5-13.5 0-2.6.7-5 2-7-5.5 1.5-9.5 6.5-9.5 12.5 0 7.2 5.8 13 13 13 5.4 0 10-3.3 12-8-1.3.6-2.7 1-4 1z"
        fill="#0A59F7"
      />
      <circle cx="44.5" cy="19.5" r="2" fill="#5BA4FF" />
      <circle cx="39.5" cy="15" r="1.2" fill="#5BA4FF" />
    </svg>
  )
}

function ModeHeroCard({
  mode,
  selected,
  enabled,
  onSelect,
  onAction,
}: {
  mode: ModeCard
  selected: boolean
  enabled: boolean
  onSelect: () => void
  onAction: () => void
}) {
  return (
    <div
      className={[
        "scene-mode-settings-v2__hero-shell",
        selected ? "scene-mode-settings-v2__hero-shell--active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="scene-mode-settings-v2__hero-shell-inner">
        {mode.badge ? (
          <div className="scene-mode-settings-v2__hero-badge">{mode.badge}</div>
        ) : null}

        <div className="scene-mode-settings-v2__hero-card">
          <button
            type="button"
            className="scene-mode-settings-v2__hero-icon"
            onClick={onSelect}
            aria-label={`查看${mode.title}`}
          >
            {mode.icon}
          </button>

          <div className="scene-mode-settings-v2__hero-title">{mode.title}</div>
          <p className="scene-mode-settings-v2__hero-description">{mode.description}</p>

          <button
            type="button"
            className={[
              "scene-mode-settings-v2__hero-button",
              enabled ? "scene-mode-settings-v2__hero-button--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={onAction}
          >
            {enabled ? "已开启" : mode.cta}
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <div className="scene-mode-settings-v2__eyebrow">{children}</div>
}

function RightValue({
  value,
  expand = false,
}: {
  value: string
  expand?: boolean
}) {
  return (
    <div className="scene-mode-settings-v2__right-value">
      <span className="scene-mode-settings-v2__right-value-text">{value}</span>
      {expand ? (
        <ChevronDown size={18} strokeWidth={1.9} className="text-black/32" />
      ) : (
        <ChevronRight size={18} strokeWidth={1.9} className="text-black/32" />
      )}
    </div>
  )
}

const modes: ModeCard[] = [
  {
    key: "dnd",
    badge: "焦点推荐",
    title: "免打扰",
    description: "减少打扰保持专注，进入更安静的沉浸状态。",
    cta: "立即开启",
    icon: <DoNotDisturbIcon />,
  },
  {
    key: "focus",
    title: "专注模式",
    description: "为学习与工作屏蔽分心通知，保持流程不断线。",
    cta: "开启模式",
    icon: <FocusModeIcon />,
  },
  {
    key: "sleep",
    title: "睡眠模式",
    description: "自动放缓夜间提醒，营造更克制柔和的休息节奏。",
    cta: "开启模式",
    icon: <SleepModeIcon />,
  },
]

export default function SceneModeSettingsV2() {
  const [selectedMode, setSelectedMode] = useState<ModeKey>("dnd")
  const [enabledMode, setEnabledMode] = useState<ModeKey>("dnd")
  const [smartRecommendationEnabled, setSmartRecommendationEnabled] = useState(true)
  const [importantReminderEnabled, setImportantReminderEnabled] = useState(false)

  return (
    <div className="scene-mode-settings-v2">
      <div className="relative">
        <div className="scene-mode-settings-v2__ornament scene-mode-settings-v2__ornament--left" />
        <div className="scene-mode-settings-v2__ornament scene-mode-settings-v2__ornament--right" />

        <StatusBar time="08:08" backgroundColor="transparent" />

        <div className="scene-mode-settings-v2__content">
          <header className="pt-4">
            <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-black/95">
              情景模式
            </h1>
            <p className="mt-4 max-w-[286px] text-[16px] leading-[1.72] tracking-[-0.01em] text-black/68">
              HarmonyOS 手机设置界面，轻量卡片式组织，让您在不同场景里自然切换到更沉浸的系统状态。
            </p>
          </header>

          <section className="mt-6">
            <div className="scene-mode-settings-v2__hero-scroll">
              <div className="scene-mode-settings-v2__hero-track">
                {modes.map((mode) => (
                  <ModeHeroCard
                    key={mode.key}
                    mode={mode}
                    selected={selectedMode === mode.key}
                    enabled={enabledMode === mode.key}
                    onSelect={() => setSelectedMode(mode.key)}
                    onAction={() => {
                      setSelectedMode(mode.key)
                      setEnabledMode(mode.key)
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="scene-mode-settings-v2__carousel-indicator">
              <div className="scene-mode-settings-v2__carousel-indicator-track">
                <div className="scene-mode-settings-v2__carousel-indicator-pill" />
              </div>
            </div>
          </section>

          <main className="scene-mode-settings-v2__stack">
            <section className="scene-mode-settings-v2__panel">
              <div className="scene-mode-settings-v2__panel-body">
                <SectionEyebrow>条件开启</SectionEyebrow>

                <div className="scene-mode-settings-v2__condition-layout">
                  <div className="scene-mode-settings-v2__condition-main">
                    <div className="scene-mode-settings-v2__condition-days">周日 周六</div>
                    <div className="scene-mode-settings-v2__condition-time">
                      22:00-次日 07:00
                    </div>

                    <button type="button" className="scene-mode-settings-v2__condition-link">
                      <Plus size={15} strokeWidth={2.4} />
                      添加条件
                    </button>

                    <div className="scene-mode-settings-v2__condition-note">
                      本功能需调用位置权限，读取位置信息
                    </div>
                  </div>

                  <div className="scene-mode-settings-v2__condition-status">已关闭</div>
                </div>
              </div>
            </section>

            <section className="scene-mode-settings-v2__panel">
              <div className="scene-mode-settings-v2__panel-body">
                <div className="scene-mode-settings-v2__switch-row">
                  <div className="min-w-0 flex-1">
                    <h2 className="scene-mode-settings-v2__section-title">推荐开启与关闭</h2>
                    <p className="scene-mode-settings-v2__section-description">
                      基于个人偏好，以及位置、时间等数据信息，智能推荐开启或关闭相应的情景模式，整体体验更克制也更贴近您的节奏。
                    </p>
                  </div>

                  <div className="scene-mode-settings-v2__switch-slot">
                    <Switch
                      modelValue={smartRecommendationEnabled}
                      onUpdateModelValue={setSmartRecommendationEnabled}
                      activeColor="#0A59F7"
                      inactiveColor="rgba(0, 0, 0, 0.16)"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="scene-mode-settings-v2__panel">
              <div className="scene-mode-settings-v2__panel-body">
                <SectionEyebrow>允许打扰</SectionEyebrow>

                <List className="scene-mode-settings-v2__list mt-3">
                  <ListItem
                    title="应用和元服务"
                    right={<RightValue value="未选择" />}
                    leftGap={0}
                    showArrow={false}
                  />
                  <ListItem
                    title="联系人"
                    right={<RightValue value="仅允许收藏联系人" />}
                    leftGap={0}
                    showArrow={false}
                    border={false}
                  />
                </List>
              </div>
            </section>

            <section className="scene-mode-settings-v2__panel">
              <div className="scene-mode-settings-v2__panel-body">
                <div className="scene-mode-settings-v2__switch-row">
                  <div className="min-w-0 flex-1">
                    <h2 className="scene-mode-settings-v2__section-title">重要信息提醒</h2>
                    <p className="scene-mode-settings-v2__section-description">
                      开启后，模式开启期间会提醒重要信息(短信验证码和实况)。
                    </p>
                  </div>

                  <div className="scene-mode-settings-v2__switch-slot">
                    <Switch
                      modelValue={importantReminderEnabled}
                      onUpdateModelValue={setImportantReminderEnabled}
                      activeColor="#0A59F7"
                      inactiveColor="rgba(0, 0, 0, 0.16)"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="scene-mode-settings-v2__panel">
              <div className="scene-mode-settings-v2__panel-body">
                <SectionEyebrow>关联系统功能</SectionEyebrow>

                <List className="scene-mode-settings-v2__list mt-3">
                  <ListItem
                    title="深色模式"
                    right={<RightValue value="不关联" expand />}
                    leftGap={0}
                    showArrow={false}
                  />
                  <ListItem
                    title="护眼模式"
                    right={<RightValue value="不关联" expand />}
                    leftGap={0}
                    showArrow={false}
                    border={false}
                  />
                </List>
              </div>
            </section>

            <div className="scene-mode-settings-v2__split">
              <Divider margin="0" hairline />
            </div>
          </main>

          <footer className="scene-mode-settings-v2__footer">
            <div className="scene-mode-settings-v2__home-indicator" />
          </footer>
        </div>
      </div>
    </div>
  )
}
