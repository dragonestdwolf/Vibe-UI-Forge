"use client"

import { useState, type ReactNode } from "react"
import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { FeaturePromoCard } from "@/component/FeaturePromoCard"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import {
  BellRing,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Ellipsis,
  MapPin,
  Plus,
  ShieldAlert,
  Sparkles,
} from "lucide-react"

function ActionBubble({
  ariaLabel,
  children,
}: {
  ariaLabel: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex size-10 items-center justify-center rounded-full border-0 bg-black/[0.047] p-0 text-black/90"
    >
      {children}
    </button>
  )
}

function SectionTitle({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <h2 className="text-[16px] font-semibold leading-[22px] text-black/90">
        {title}
      </h2>
      {action}
    </div>
  )
}

function TrailingValue({
  value,
  emphasized = false,
}: {
  value: string
  emphasized?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`text-[14px] leading-5 ${
          emphasized ? "text-[#0a59f7]" : "text-black/40"
        }`}
      >
        {value}
      </span>
      <ChevronRight size={17} strokeWidth={1.8} className="text-black/25" />
    </div>
  )
}

function SelectPill({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-[#f3f4f8] px-3 py-1.5">
      <span className="text-[13px] leading-[18px] text-black/50">{value}</span>
      <ChevronDown size={15} strokeWidth={1.9} className="text-black/35" />
    </div>
  )
}

function QuietModeIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="免打扰"
      className="size-full"
    >
      <defs>
        <linearGradient id="quietModeGradient" x1="12" y1="12" x2="52" y2="52">
          <stop offset="0%" stopColor="#7C4DFF" />
          <stop offset="100%" stopColor="#4A27D2" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="url(#quietModeGradient)" />
      <path
        d="M40.3 41.2c-7.4 0-13.4-6-13.4-13.4 0-3 1-5.7 2.6-7.9-5.6 1.4-9.7 6.4-9.7 12.4 0 7.1 5.7 12.8 12.8 12.8 6 0 11-4.1 12.4-9.7-1.3 1-2.9 1.6-4.7 1.8z"
        fill="#FFFFFF"
      />
      <path
        d="M42.8 18.5l.7 2.4 2.4.7-2.4.7-.7 2.4-.7-2.4-2.4-.7 2.4-.7.7-2.4z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export default function SettingsPageV27() {
  const [habitRecommendationEnabled, setHabitRecommendationEnabled] = useState(true)
  const [repeatCallEnabled, setRepeatCallEnabled] = useState(false)
  const [importantReminderEnabled, setImportantReminderEnabled] = useState(true)

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-comp-background-gray text-black/90">
      <StatusBar time="09:41" backgroundColor="#F1F3F5" />

      <div className="w-[328px] self-center">
        <TitleBar
          title="情景模式"
          subtitle=""
          backgroundColor="#F1F3F5"
          right={
            <div className="flex items-center gap-2">
              <ActionBubble ariaLabel="帮助">
                <CircleHelp size={20} strokeWidth={2} />
              </ActionBubble>
              <ActionBubble ariaLabel="更多操作">
                <Ellipsis size={20} strokeWidth={2.1} />
              </ActionBubble>
            </div>
          }
        />
      </div>

      <main className="flex-1 px-4 pb-4">
        <p className="px-1 text-[13px] leading-[18px] text-black/55">
          自动调整通知、显示与提醒方式，让免打扰更自然地融入你的工作和休息节奏。
        </p>

        <section className="relative mt-4 overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#eef0ff_0%,#f7f8fc_56%,#F1F3F5_100%)] px-5 pt-5 pb-6">
          <div className="absolute top-0 left-1/2 h-28 w-56 -translate-x-1/2 rounded-full bg-[#bfaeff]/40 blur-3xl" />
          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-white/85 px-3 py-1 text-[12px] font-medium leading-4 text-[#5d43d4]">
                静音通知
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-[12px] font-medium leading-4 text-black/55">
                隐藏横幅
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-[12px] font-medium leading-4 text-black/55">
                白名单放行
              </span>
            </div>

            <div className="flex justify-center">
              <FeaturePromoCard
                icon={<QuietModeIcon />}
                title="免打扰"
                subtitle="减少来电和通知打扰"
                actionLabel="立即开启"
                className="shadow-[0_22px_44px_rgba(94,76,192,0.08)]"
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-2.5 w-5 rounded-full bg-[#0a59f7]" />
              <span className="size-2.5 rounded-full bg-black/[0.12]" />
              <span className="size-2.5 rounded-full bg-black/[0.12]" />
            </div>
          </div>
        </section>

        <section className="mt-6">
          <SectionTitle
            title="自动开启"
            action={
              <button
                type="button"
                aria-label="新增规则"
                className="flex size-8 items-center justify-center rounded-full border-0 bg-black/[0.047] p-0 text-black/60"
              >
                <Plus size={18} strokeWidth={2.2} />
              </button>
            }
          />

          <List className="mt-2 overflow-hidden rounded-[24px]">
            <ListItem
              left={
                <div className="flex size-9 items-center justify-center rounded-[12px] bg-[#eef2ff]">
                  <CalendarDays size={19} strokeWidth={1.9} className="text-[#5d43d4]" />
                </div>
              }
              title="工作日 22:30 至次日 07:00"
              subtitle="睡前自动开启，起床后恢复正常提醒"
              right={<TrailingValue value="已设置" emphasized />}
              leftGap={12}
              showArrow={false}
            />
            <ListItem
              left={
                <div className="flex size-9 items-center justify-center rounded-[12px] bg-[#eef7ff]">
                  <MapPin size={19} strokeWidth={1.9} className="text-[#0a59f7]" />
                </div>
              }
              title="到达办公室时"
              subtitle="进入已保存地点后自动切换到安静模式"
              right={<TrailingValue value="已开启" />}
              leftGap={12}
              showArrow={false}
            />
            <ListItem
              left={
                <div className="flex size-9 items-center justify-center rounded-[12px] bg-[#fff3e9]">
                  <Sparkles size={18} strokeWidth={2} className="text-[#e9892f]" />
                </div>
              }
              title="根据习惯推荐"
              subtitle="结合偏好与位置自动建议开启"
              right={
                <Switch
                  modelValue={habitRecommendationEnabled}
                  onUpdateModelValue={setHabitRecommendationEnabled}
                />
              }
              leftGap={12}
              showArrow={false}
              border={false}
            />
          </List>

          <p className="mt-2 px-1 text-[12px] leading-[18px] text-black/40">
            若要使用地点自动开启，请允许系统访问位置信息。
          </p>
        </section>

        <section className="mt-4">
          <SectionTitle title="允许打扰" />
          <List className="mt-2 overflow-hidden rounded-[24px]">
            <ListItem
              left={
                <div className="flex size-9 items-center justify-center rounded-[12px] bg-[#f4efff]">
                  <ShieldAlert size={18} strokeWidth={2} className="text-[#7a59e6]" />
                </div>
              }
              title="应用和联系人白名单"
              subtitle="仅允许收藏联系人和重点应用继续提醒"
              right={<TrailingValue value="已配置" />}
              leftGap={12}
              showArrow={false}
            />
            <ListItem
              left={
                <div className="flex size-9 items-center justify-center rounded-[12px] bg-[#eff7ff]">
                  <BellRing size={18} strokeWidth={2} className="text-[#0a59f7]" />
                </div>
              }
              title="重复来电"
              subtitle="3 分钟内再次来电时允许响铃"
              right={
                <Switch
                  modelValue={repeatCallEnabled}
                  onUpdateModelValue={setRepeatCallEnabled}
                />
              }
              leftGap={12}
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        <section className="mt-4">
          <SectionTitle title="重要信息提醒" />
          <List className="mt-2 overflow-hidden rounded-[24px]">
            <ListItem
              title="重要信息提醒"
              subtitle="验证码、实况消息与取件提醒继续显示"
              right={
                <Switch
                  modelValue={importantReminderEnabled}
                  onUpdateModelValue={setImportantReminderEnabled}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        <section className="mt-4">
          <SectionTitle title="联动效果" />
          <List className="mt-2 overflow-hidden rounded-[24px]">
            <ListItem
              title="深色模式"
              right={<SelectPill value="自动开启" />}
              showArrow={false}
            />
            <ListItem
              title="护眼模式"
              right={<SelectPill value="同步开启" />}
              showArrow={false}
            />
            <ListItem
              title="锁屏通知样式"
              right={<SelectPill value="仅显示摘要" />}
              showArrow={false}
              border={false}
            />
          </List>
        </section>
      </main>

      <div className="flex h-8 items-center justify-center">
        <div className="h-1.5 w-28 rounded-full bg-black/[0.16]" />
      </div>
    </div>
  )
}
