"use client"

import { useState } from "react"
import {
  BarChart2,
  ChevronLeft,
  Heart,
  Lock,
  QrCode,
  Smartphone,
} from "lucide-react"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { Button } from "@/component/Button"
import { List, ListItem } from "@/component/List"

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="px-1 pb-2 text-[13px] font-medium leading-[18px] text-[#727985]">
      {children}
    </h2>
  )
}

function HeaderBackButton() {
  return (
    <button
      type="button"
      aria-label="返回"
      className="flex size-10 shrink-0 items-center justify-center rounded-full border-0 bg-white/80 p-0 shadow-[0_1px_8px_rgba(28,35,45,0.06)]"
    >
      <ChevronLeft size={22} strokeWidth={1.8} className="text-[#191d24]" />
    </button>
  )
}

function UsageStatCard() {
  return (
    <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_28px_rgba(34,42,58,0.08)]">
      {/* Card hero area */}
      <div className="relative bg-gradient-to-br from-[#e8f0ff] via-[#eef4ff] to-[#f0f5ff] px-5 pt-5 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-medium leading-[16px] text-[#5b7bf5]">
              屏幕时间管理
            </span>
            <span className="text-[20px] font-semibold leading-[26px] text-[#191d24]">
              使用统计和管理
            </span>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-[#2368f3]/10">
            <BarChart2 size={26} strokeWidth={1.6} className="text-[#2368f3]" />
          </div>
        </div>

        {/* Decorative bar chart illustration */}
        <div className="mt-4 flex items-end gap-1.5 px-1 pb-0">
          {[28, 44, 36, 60, 48, 72, 52].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: h,
                background:
                  i === 5
                    ? "linear-gradient(180deg,#2368f3 0%,#4d8bff 100%)"
                    : "rgba(35,104,243,0.12)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pt-4 pb-5">
        <p className="text-[14px] leading-[22px] text-[#737b87]">
          了解自己的屏幕使用情况，按需设置使用限制，合理规划设备使用时长
        </p>
        <div className="mt-4">
          <Button type="primary" size="large" round block>
            开启
          </Button>
        </div>
      </div>
    </div>
  )
}

function GuardianCard({
  icon,
  title,
  description,
  buttonLabel,
  accentFrom,
  accentTo,
  iconColor,
  iconBg,
}: {
  icon: React.ReactNode
  title: string
  description: string
  buttonLabel: string
  accentFrom: string
  accentTo: string
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_8px_20px_rgba(34,42,58,0.07)]">
      <div
        className="px-4 pt-4 pb-3"
        style={{
          background: `linear-gradient(135deg, ${accentFrom} 0%, ${accentTo} 100%)`,
        }}
      >
        <div
          className="flex size-10 items-center justify-center rounded-[14px]"
          style={{ backgroundColor: iconBg }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className="mt-3 text-[15px] font-semibold leading-[20px] text-[#191d24]">
          {title}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between px-4 pt-3 pb-4">
        <p className="text-[12px] leading-[18px] text-[#737b87]">{description}</p>
        <div className="mt-3">
          <Button type="primary" size="small" round>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DeviceHealthPage() {
  const [passwordEnabled, setPasswordEnabled] = useState(false)
  const minorModeEnabled = false

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f2f4f8] text-[#191d24]">
      <StatusBar time="09:41" backgroundColor="#f2f4f8" />

      {/* Header */}
      <header className="px-4 pt-2 pb-1">
        <div className="flex items-center gap-3">
          <HeaderBackButton />
          <h1 className="min-w-0 flex-1 text-[32px] font-semibold leading-[40px] text-[#191d24]">
            健康使用设备
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-5">
        <div className="flex flex-col gap-5">

          {/* Floor 1: 自己使用 */}
          <section>
            <SectionLabel>自己使用</SectionLabel>
            <UsageStatCard />
          </section>

          {/* Floor 2: 远程守护 */}
          <section>
            <SectionLabel>远程守护</SectionLabel>
            <div className="flex gap-3">
              <GuardianCard
                icon={<Heart size={20} strokeWidth={1.7} />}
                title="守护家人"
                description="建立守护关系，管理家人设备使用情况"
                buttonLabel="去守护"
                accentFrom="#fff0f7"
                accentTo="#ffe8f5"
                iconColor="#e45a85"
                iconBg="#ffd0e8"
              />
              <GuardianCard
                icon={<QrCode size={20} strokeWidth={1.7} />}
                title="被家人守护"
                description="展示二维码，家人可以扫码守护我"
                buttonLabel="二维码"
                accentFrom="#f0f7ff"
                accentTo="#e8f3ff"
                iconColor="#2368f3"
                iconBg="#d0e4ff"
              />
            </div>
          </section>

          {/* Floor 3: 临时给孩子使用 */}
          <section>
            <SectionLabel>临时给孩子使用</SectionLabel>
            <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_20px_rgba(34,42,58,0.05)]">
              <List>
                <ListItem
                  left={
                    <div className="flex size-9 items-center justify-center rounded-[12px] bg-[#fff2e8]">
                      <Smartphone size={18} strokeWidth={1.8} className="text-[#e07820]" />
                    </div>
                  }
                  title="未成年人模式"
                  rightText={
                    <span
                      className={[
                        "text-[13px] font-medium",
                        minorModeEnabled ? "text-[#2368f3]" : "text-[#b0b8c5]",
                      ].join(" ")}
                    >
                      {minorModeEnabled ? "已开启" : "未开启"}
                    </span>
                  }
                  showArrow
                  border={false}
                  leftGap={12}
                />
              </List>
            </div>
            <p className="mt-2 px-1 text-[12px] leading-[18px] text-[#9ba4b0]">
              开启后可限制部分功能，保护未成年人健康使用设备
            </p>
          </section>

          {/* Floor 4: 密码管理 */}
          <section>
            <SectionLabel>密码管理</SectionLabel>
            <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_20px_rgba(34,42,58,0.05)]">
              <List>
                <ListItem
                  left={
                    <div className="flex size-9 items-center justify-center rounded-[12px] bg-[#eef3ff]">
                      <Lock size={18} strokeWidth={1.8} className="text-[#2368f3]" />
                    </div>
                  }
                  title="健康使用设备密码"
                  right={
                    <Switch
                      modelValue={passwordEnabled}
                      onUpdateModelValue={setPasswordEnabled}
                    />
                  }
                  showArrow={false}
                  border={false}
                  leftGap={12}
                />
              </List>
            </div>
          </section>

        </div>
      </main>

      {/* Home indicator */}
      <div className="flex h-7 shrink-0 items-center justify-center pb-2">
        <div className="h-[5px] w-28 rounded-full bg-[#b9bec7]" />
      </div>
    </div>
  )
}
