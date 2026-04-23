"use client"

import type { ReactNode } from "react"
import { StatusBar } from "@/component/StatusBar"
import { ServiceCard } from "@/component/ServiceCard"
import {
  Bluetooth,
  ChevronRight,
  Cloud,
  MonitorSmartphone,
  Palette,
  Radar,
  Satellite,
  Search,
  Signal,
  Smartphone,
  SunMedium,
  UserRound,
  Wifi,
} from "lucide-react"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

type SettingsRowProps = {
  icon: ReactNode
  title: string
  summary?: string
  border?: boolean
}

const cloudUsed = 142.8
const cloudTotal = 200
const cloudPercent = Math.round((cloudUsed / cloudTotal) * 100)

function HeaderButton({
  children,
  ariaLabel,
}: {
  children: ReactNode
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-0 bg-[rgba(0,0,0,0.05)] p-0"
    >
      {children}
    </button>
  )
}

function IconTile({
  color,
  children,
}: {
  color: string
  children: ReactNode
}) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="px-1 text-[13px] font-medium leading-[18px] text-[#7b8088]">
      {children}
    </h2>
  )
}

function SettingsRow({
  icon,
  title,
  summary,
  border = true,
}: SettingsRowProps) {
  return (
    <button
      type="button"
      className="flex min-h-[64px] w-full items-center gap-3 border-0 bg-transparent px-4 py-3 text-left"
    >
      {icon}
      <span
        className={[
          "flex min-h-10 min-w-0 flex-1 items-center gap-2",
          border ? "border-b border-[rgba(0,0,0,0.08)]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="min-w-0 flex-1 text-[16px] font-medium leading-[22px] text-[#1d2026]">
          {title}
        </span>
        {summary ? (
          <span className="max-w-[132px] shrink-0 truncate text-right text-[13px] leading-[18px] text-[#7a808a]">
            {summary}
          </span>
        ) : null}
        <ChevronRight size={19} strokeWidth={1.7} className="shrink-0 text-[#c4c8cf]" />
      </span>
    </button>
  )
}

function AccountCard() {
  return (
    <ServiceCard
      variant="white"
      className="gap-0 overflow-hidden"
      style={{ width: "100%", borderRadius: 24, padding: 0 }}
    >
      <button
        type="button"
        className="flex w-full items-center gap-3 border-0 bg-transparent px-4 pt-4 pb-3 text-left"
      >
        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8eef8]">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#6ec6ff] via-[#3f8cff] to-[#7758ff]">
            <UserRound size={29} strokeWidth={1.8} className="text-white" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[20px] font-semibold leading-[26px] text-[#1d2026]">
            林一舟
          </div>
          <div className="mt-1 text-[13px] leading-[18px] text-[#717782]">
            华为账号 · 已登录
          </div>
        </div>
        <ChevronRight size={21} strokeWidth={1.7} className="text-[#c4c8cf]" />
      </button>

      <div className="mx-4 border-t border-[rgba(0,0,0,0.08)]" />

      <button
        type="button"
        className="flex w-full items-center gap-3 border-0 bg-transparent px-4 py-3 text-left"
      >
        <IconTile color="#fff1df">
          <Cloud size={20} strokeWidth={1.8} className="text-[#f28b22]" />
        </IconTile>
        <div className="min-w-0 flex-1">
          <div className="text-[16px] font-medium leading-[22px] text-[#1d2026]">
            账号管理
          </div>
          <div className="mt-0.5 truncate text-[13px] leading-[18px] text-[#777d86]">
            支付、账单、云空间、订阅与安全
          </div>
        </div>
        <ChevronRight size={19} strokeWidth={1.7} className="text-[#c4c8cf]" />
      </button>

      <div className="mx-4 mb-4 rounded-[18px] bg-[#f6f7fa] p-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-medium leading-[20px] text-[#1d2026]">
                云空间
              </span>
              <span className="shrink-0 text-[13px] leading-[18px] text-[#176bff]">
                {cloudUsed}GB / {cloudTotal}GB
              </span>
            </div>
            <div className="mt-3 h-[7px] overflow-hidden rounded-full bg-[#dfe3ea]">
              <div
                className="h-full rounded-full bg-[#176bff]"
                style={{ width: `${cloudPercent}%` }}
              />
            </div>
            <div className="mt-2 text-[12px] leading-[16px] text-[#858b94]">
              实时同步中 · 已使用 {cloudPercent}%
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 flex h-11 w-full items-center gap-3 rounded-[14px] border-0 bg-white px-3 text-left"
        >
          <IconTile color="#e8f5ee">
            <Radar size={18} strokeWidth={1.9} className="text-[#23a764]" />
          </IconTile>
          <span className="min-w-0 flex-1 text-[15px] font-medium leading-[20px] text-[#1d2026]">
            查找设备
          </span>
          <span className="text-[12px] leading-[16px] text-[#777d86]">
            2 台在线
          </span>
          <ChevronRight size={18} strokeWidth={1.7} className="text-[#c4c8cf]" />
        </button>
      </div>
    </ServiceCard>
  )
}

function SettingsPageV22() {
  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f4f5f7] text-[#1d2026]">
      <StatusBar time="09:41" backgroundColor="#f4f5f7" />

      <header className="px-4 pt-2">
        <div className="flex items-center gap-3">
          <HeaderButton ariaLabel="返回">
            <img src={iconChevronBack} alt="" className="h-6 w-6" />
          </HeaderButton>
          <h1 className="min-w-0 flex-1 text-[32px] font-semibold leading-[40px] text-[#1d2026]">
            设置
          </h1>
        </div>

        <label className="mt-4 flex h-11 items-center gap-2 rounded-full bg-white px-4 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
          <Search size={18} strokeWidth={2} className="shrink-0 text-[#8b9099]" />
          <input
            aria-label="搜索设置"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[#1d2026] outline-none placeholder:text-[#8b9099]"
            placeholder="搜索设置"
            type="search"
          />
        </label>
      </header>

      <main className="flex-1 px-4 pt-4 pb-5">
        <div className="flex flex-col gap-4">
          <AccountCard />

          <ServiceCard
            variant="white"
            className="gap-0 overflow-hidden"
            style={{ width: "100%", borderRadius: 24, padding: 0 }}
          >
            <SettingsRow
              icon={
                <IconTile color="#e8f0ff">
                  <Smartphone size={20} strokeWidth={1.8} className="text-[#2368f3]" />
                </IconTile>
              }
              title="HUAWEI Mate 70 Pro"
              summary="本机"
              border={false}
            />
          </ServiceCard>

          <section className="flex flex-col gap-2">
            <SectionLabel>网络与连接</SectionLabel>
            <ServiceCard
              variant="white"
              className="gap-0 overflow-hidden"
              style={{ width: "100%", borderRadius: 24, padding: 0 }}
            >
              <SettingsRow
                icon={
                  <IconTile color="#e8f0ff">
                    <Wifi size={20} strokeWidth={1.8} className="text-[#2368f3]" />
                  </IconTile>
                }
                title="WLAN"
                summary="已连接 Harmony_5G"
              />
              <SettingsRow
                icon={
                  <IconTile color="#eaf8f0">
                    <Bluetooth size={20} strokeWidth={1.8} className="text-[#1ca35f]" />
                  </IconTile>
                }
                title="蓝牙"
                summary="已开启"
              />
              <SettingsRow
                icon={
                  <IconTile color="#edf7ff">
                    <Signal size={20} strokeWidth={1.8} className="text-[#1682d4]" />
                  </IconTile>
                }
                title="移动网络"
                summary="中国移动 5G"
              />
              <SettingsRow
                icon={
                  <IconTile color="#fff5df">
                    <Satellite size={20} strokeWidth={1.8} className="text-[#d98a12]" />
                  </IconTile>
                }
                title="卫星网络"
                summary="未开启"
              />
              <SettingsRow
                icon={
                  <IconTile color="#f0edff">
                    <MonitorSmartphone
                      size={20}
                      strokeWidth={1.8}
                      className="text-[#6b55e8]"
                    />
                  </IconTile>
                }
                title="多设备协同"
                summary="平板可协同"
                border={false}
              />
            </ServiceCard>
          </section>

          <section className="flex flex-col gap-2">
            <SectionLabel>外观与显示</SectionLabel>
            <ServiceCard
              variant="white"
              className="gap-0 overflow-hidden"
              style={{ width: "100%", borderRadius: 24, padding: 0 }}
            >
              <SettingsRow
                icon={
                  <IconTile color="#fff0f4">
                    <Palette size={20} strokeWidth={1.8} className="text-[#e45a85]" />
                  </IconTile>
                }
                title="桌面和个性化"
                summary="主题与壁纸"
              />
              <SettingsRow
                icon={
                  <IconTile color="#fff5df">
                    <SunMedium size={20} strokeWidth={1.8} className="text-[#e59a18]" />
                  </IconTile>
                }
                title="显示和亮度"
                summary="自动"
                border={false}
              />
            </ServiceCard>
          </section>
        </div>
      </main>

      <div className="flex h-7 shrink-0 items-center justify-center pb-2">
        <div className="h-[5px] w-28 rounded-full bg-[#b9bdc5]" />
      </div>
    </div>
  )
}

export default SettingsPageV22
