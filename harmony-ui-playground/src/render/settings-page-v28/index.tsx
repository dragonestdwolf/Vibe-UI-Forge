"use client"

import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { FeaturePromoCard } from "@/component/FeaturePromoCard"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import {
  ChevronDown,
  Phone,
  MessageCircle,
  BellOff,
  Vibrate,
} from "lucide-react"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

function DoNotDisturbIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="免打扰"
    >
      <circle cx="32" cy="32" r="29" fill="#542BD7" />
      <path
        d="M40.4 41.2c-7.4 0-13.4-6-13.4-13.4 0-3 1-5.7 2.6-7.9-5.6 1.4-9.7 6.4-9.7 12.4 0 7.1 5.7 12.8 12.8 12.8 6 0 11-4.1 12.4-9.7-1.4 1-2.9 1.7-4.7 1.8z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function SelectPill({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-[#f5f6f8] px-3 py-1.5">
      <span className="text-[13px] leading-[18px] text-black/50">{value}</span>
      <ChevronDown size={15} strokeWidth={1.9} className="text-black/35" />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-1 py-2">
      <span className="text-[13px] font-medium leading-[18px] text-black/45">
        {children}
      </span>
    </div>
  )
}

export default function DoNotDisturbPage() {
  const [dndEnabled, setDndEnabled] = useState(false)
  const [hideContent, setHideContent] = useState(false)
  const [silent, setSilent] = useState(true)
  const [vibrate, setVibrate] = useState(false)
  const [repeatCaller, setRepeatCaller] = useState(false)

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-comp-background-gray">
      <StatusBar time="09:41" backgroundColor="#F1F3F5" />

      <div className="w-[328px] mx-auto">
        <TitleBar
          title="免打扰"
          leftIcon={iconChevronBack}
          backgroundColor="#F1F3F5"
        />
      </div>

      <main className="flex-1 px-4">
        {/* Hero Card */}
        <section className="flex justify-center pt-2">
          <FeaturePromoCard
            icon={<DoNotDisturbIcon />}
            title="免打扰"
            subtitle="减少打扰保持专注"
            actionLabel={dndEnabled ? "已开启" : "立即开启"}
            actionDisabled={dndEnabled}
            onAction={() => setDndEnabled(true)}
          />
        </section>

        {/* Allow Calls */}
        <section className="mt-5">
          <SectionLabel>允许来电</SectionLabel>
          <List className="overflow-hidden rounded-3xl">
            <ListItem
              left={
                <Phone
                  size={22}
                  strokeWidth={1.8}
                  className="text-black/60"
                />
              }
              title="来电"
              right={<SelectPill value="所有人" />}
              showArrow={false}
            />
            <ListItem
              left={
                <MessageCircle
                  size={22}
                  strokeWidth={1.8}
                  className="text-black/60"
                />
              }
              title="消息"
              right={<SelectPill value="不允许" />}
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        {/* Notification Behavior */}
        <section className="mt-1">
          <SectionLabel>通知行为</SectionLabel>
          <List className="overflow-hidden rounded-3xl">
            <ListItem
              left={
                <BellOff
                  size={22}
                  strokeWidth={1.8}
                  className="text-black/60"
                />
              }
              title="隐藏通知内容"
              subtitle="锁屏通知不显示内容"
              right={
                <Switch
                  modelValue={hideContent}
                  onUpdateModelValue={setHideContent}
                />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-black/60"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              }
              title="静音"
              right={
                <Switch modelValue={silent} onUpdateModelValue={setSilent} />
              }
              showArrow={false}
            />
            <ListItem
              left={
                <Vibrate
                  size={22}
                  strokeWidth={1.8}
                  className="text-black/60"
                />
              }
              title="振动"
              subtitle="响铃时振动"
              right={
                <Switch
                  modelValue={vibrate}
                  onUpdateModelValue={setVibrate}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        {/* Other */}
        <section className="mt-1">
          <SectionLabel>其它</SectionLabel>
          <List className="overflow-hidden rounded-3xl">
            <ListItem
              left={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-black/60"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
              title="重复来电"
              subtitle="同一号码 5 分钟内来电响铃"
              right={
                <Switch
                  modelValue={repeatCaller}
                  onUpdateModelValue={setRepeatCaller}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        {/* Linked System Functions */}
        <section className="mt-1">
          <SectionLabel>关联系统功能</SectionLabel>
          <List className="overflow-hidden rounded-3xl">
            <ListItem
              left={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-black/60"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              }
              title="深色模式"
              right={<SelectPill value="同步开启" />}
              showArrow={false}
            />
            <ListItem
              left={
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-black/60"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              }
              title="护眼模式"
              right={<SelectPill value="不关联" />}
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        {/* Note */}
        <section className="mt-4">
          <p className="px-1 text-[12px] leading-[18px] text-black/35">
            已开启的功能将在此情景模式激活时自动启用，关闭后恢复原状。
          </p>
        </section>
      </main>

      <div className="flex h-8 items-center justify-center">
        <div className="h-1.5 w-28 rounded-full bg-black/[0.16]" />
      </div>
    </div>
  )
}
