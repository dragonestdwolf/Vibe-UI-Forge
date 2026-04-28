"use client"

import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import {
  MoonStar,
  ChevronRight,
  ChevronDown,
  Phone,
  MessageCircle,
  BellOff,
  Vibrate,
  Clock,
  Eye,
} from "lucide-react"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

function SectionHeader({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <h2 className="text-[13px] font-medium leading-[18px] text-black/45">
        {title}
      </h2>
      {action}
    </div>
  )
}

function SelectPill({
  value,
}: {
  value: string
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-[#f5f6f8] px-3 py-1.5">
      <span className="text-[13px] leading-[18px] text-black/50">{value}</span>
      <ChevronDown size={15} strokeWidth={1.9} className="text-black/35" />
    </div>
  )
}

export default function DoNotDisturbDetail() {
  const [dndEnabled, setDndEnabled] = useState(true)
  const [hideContent, setHideContent] = useState(true)
  const [soundOff, setSoundOff] = useState(true)
  const [vibrateOff, setVibrateOff] = useState(false)
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
        {/* Hero Section */}
        <section className="mt-1 flex flex-col items-center rounded-[28px] bg-white px-4 pb-6 pt-7 shadow-[0_8px_24px_rgba(26,34,48,0.05)]">
          <div
            className={`flex size-[72px] items-center justify-center rounded-full shadow-[0_10px_20px_rgba(141,83,255,0.28)] transition-colors ${
              dndEnabled
                ? "bg-[#8d53ff]"
                : "bg-black/[0.2]"
            }`}
          >
            <MoonStar
              size={32}
              strokeWidth={2.1}
              className={dndEnabled ? "text-white" : "text-black/40"}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span
              className={`text-[28px] font-semibold leading-[34px] tracking-[-0.02em] transition-colors ${
                dndEnabled ? "text-black/90" : "text-black/40"
              }`}
            >
              免打扰
            </span>
            <Switch
              modelValue={dndEnabled}
              onUpdateModelValue={setDndEnabled}
            />
          </div>

          <p className="mt-1 text-[14px] leading-[20px] text-black/40">
            {dndEnabled ? "已开启" : "已关闭"}
          </p>

          <div className="mt-4 flex w-full items-center justify-between rounded-2xl bg-[#f5f6f8] px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock size={18} strokeWidth={1.8} className="text-black/50" />
              <span className="text-[14px] font-medium leading-[20px] text-black/70">
                始终开启
              </span>
            </div>
            <ChevronRight size={17} strokeWidth={1.8} className="text-black/25" />
          </div>
        </section>

        {/* Allow Calls */}
        <section className="mt-5">
          <SectionHeader title="允许来电" />
          <List className="mt-2 overflow-hidden rounded-[20px]">
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
        <section className="mt-4">
          <SectionHeader title="通知行为" />
          <List className="mt-2 overflow-hidden rounded-[20px]">
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
                <Switch
                  modelValue={soundOff}
                  onUpdateModelValue={setSoundOff}
                />
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
                  modelValue={vibrateOff}
                  onUpdateModelValue={setVibrateOff}
                />
              }
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        {/* Additional Options */}
        <section className="mt-4">
          <SectionHeader title="其它" />
          <List className="mt-2 overflow-hidden rounded-[20px]">
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
        <section className="mt-4">
          <SectionHeader title="关联系统功能" />
          <List className="mt-2 overflow-hidden rounded-[20px]">
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
                <Eye
                  size={22}
                  strokeWidth={1.8}
                  className="text-black/60"
                />
              }
              title="护眼模式"
              right={<SelectPill value="不关联" />}
              showArrow={false}
              border={false}
            />
          </List>
        </section>

        {/* Footer Note */}
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
