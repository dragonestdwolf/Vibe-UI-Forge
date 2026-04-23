"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import {
  Badge,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Lock,
  Search,
} from "lucide-react"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { List, ListItem } from "@/component/List"

/* ─── types ─────────────────────────────────────────────── */
interface AppItem {
  id: string
  name: string
  color: string
  status: "已关闭通知" | "锁屏、角标"
  enabled: boolean
}

/* ─── data ───────────────────────────────────────────────── */
const INITIAL_APPS: AppItem[] = [
  { id: "iqiyi",   name: "爱奇艺",   color: "#00be06", status: "锁屏、角标",  enabled: true  },
  { id: "baidu",   name: "百度网盘", color: "#2468f2", status: "已关闭通知", enabled: false },
  { id: "memo",    name: "备忘录",   color: "#ff9500", status: "锁屏、角标",  enabled: true  },
  { id: "bilibili",name: "哔哩哔哩", color: "#fb7299", status: "已关闭通知", enabled: false },
  { id: "cainiao", name: "菜鸟",     color: "#ff6a00", status: "锁屏、角标",  enabled: true  },
]

/* ─── helpers ────────────────────────────────────────────── */

/** 圆形图标按钮（返回 / 搜索） */
function HeaderIconBtn({
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
      className="flex size-10 shrink-0 items-center justify-center rounded-full border-0 bg-white/85 p-0 shadow-[0_2px_8px_rgba(0,0,0,0.09)]"
    >
      {children}
    </button>
  )
}

/** Outline 分段按钮（规格来源：benchmark.html Outline 变体） */
function SegmentedButton({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string
  onChange: (v: string) => void
}) {
  return (
    <div
      role="radiogroup"
      className="flex w-full items-stretch rounded-[20px] p-[2px]"
      style={{ background: "rgba(0,0,0,0.047)" }}
    >
      {options.map((opt) => {
        const isSelected = opt === selected
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt)}
            className={[
              "flex min-h-[36px] flex-1 items-center justify-center rounded-[18px] border-0 px-3 py-1.5",
              "text-[14px] font-medium leading-[20px] transition-all duration-150",
              isSelected
                ? "bg-white shadow-[0_0_3px_rgba(0,0,0,0.2)] text-[rgba(0,0,0,0.898)]"
                : "bg-transparent text-[rgba(0,0,0,0.6)]",
            ].join(" ")}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/** 通知类型平铺卡片 */
function NotifTile({
  icon,
  label,
  iconBg,
  iconColor,
  enabled,
}: {
  icon: ReactNode
  label: string
  iconBg: string
  iconColor: string
  enabled: boolean
}) {
  return (
    <div className="flex flex-1 flex-col items-start gap-2 rounded-[20px] bg-white px-4 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.07)]">
      {/* icon */}
      <div
        className="flex size-10 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      {/* label */}
      <span className="text-[14px] font-semibold leading-[20px] text-[#191d24]">
        {label}
      </span>
      {/* status */}
      <span
        className={[
          "text-[12px] leading-[16px]",
          enabled ? "text-[#0a59f7]" : "text-[#9ba4b0]",
        ].join(" ")}
      >
        {enabled ? "已开启" : "已关闭"}
      </span>
    </div>
  )
}

/** 应用图标（圆形色块 + 首字） */
function AppIcon({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="flex size-[42px] shrink-0 items-center justify-center rounded-[14px] text-white"
      style={{ backgroundColor: color }}
    >
      <span className="text-[16px] font-semibold leading-none">
        {name.charAt(0)}
      </span>
    </div>
  )
}

/* ─── page ──────────────────────────────────────────────── */
export default function NotificationSettingsV1() {
  const [activeTab, setActiveTab] = useState("应用")
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS)

  function toggleApp(id: string) {
    setApps((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              enabled: !a.enabled,
              status: !a.enabled ? "锁屏、角标" : "已关闭通知",
            }
          : a
      )
    )
  }

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f2f4f8] text-[#191d24]">
      <StatusBar time="09:41" backgroundColor="#f2f4f8" />

      {/* ── 标题栏 ── */}
      <header className="flex items-center gap-2 px-4 pt-2 pb-1">
        <HeaderIconBtn ariaLabel="返回">
          <ChevronLeft size={22} strokeWidth={2} className="text-[#191d24]" />
        </HeaderIconBtn>

        <h1 className="min-w-0 flex-1 text-[28px] font-bold leading-[36px] text-[#191d24]">
          通知和状态栏
        </h1>

        <HeaderIconBtn ariaLabel="搜索">
          <Search size={20} strokeWidth={2} className="text-[#191d24]" />
        </HeaderIconBtn>
      </header>

      {/* ── 内容区 ── */}
      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-5">
        <div className="flex flex-col gap-5">

          {/* ── 一楼：状态栏 & 实况窗 ── */}
          <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.07)]">
            <List>
              <ListItem
                title="状态栏"
                right={
                  <ChevronRight size={18} strokeWidth={1.8} className="text-[#c2c8d0]" />
                }
                showArrow={false}
                border
              />
              <ListItem
                title="实况窗"
                right={
                  <ChevronRight size={18} strokeWidth={1.8} className="text-[#c2c8d0]" />
                }
                showArrow={false}
                border={false}
              />
            </List>
          </div>

          {/* ── 二楼：通知管理（三张平铺卡片）── */}
          <section>
            <p className="mb-2 px-1 text-[13px] leading-[18px] text-[#8a9099]">
              通知管理
            </p>
            <div className="flex gap-3">
              <NotifTile
                icon={<Lock size={20} strokeWidth={1.7} />}
                label="锁屏通知"
                iconBg="#e8f0ff"
                iconColor="#2368f3"
                enabled={true}
              />
              <NotifTile
                icon={<BellRing size={20} strokeWidth={1.7} />}
                label="横幅通知"
                iconBg="#fff0e8"
                iconColor="#e07820"
                enabled={true}
              />
              <NotifTile
                icon={<Badge size={20} strokeWidth={1.7} />}
                label="桌面角标"
                iconBg="#f0e8ff"
                iconColor="#8b40f0"
                enabled={false}
              />
            </div>
          </section>

          {/* ── 三楼：分段按钮 + 应用列表 ── */}
          <section className="flex flex-col gap-3">
            <SegmentedButton
              options={["应用", "元服务"]}
              selected={activeTab}
              onChange={setActiveTab}
            />

            <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.07)]">
              <List>
                {apps.map((app, idx) => (
                  <ListItem
                    key={app.id}
                    left={<AppIcon name={app.name} color={app.color} />}
                    title={app.name}
                    subtitle={
                      <span
                        className={
                          app.enabled ? "text-[#0a59f7]" : "text-[rgba(0,0,0,0.45)]"
                        }
                      >
                        {app.status}
                      </span>
                    }
                    right={
                      <Switch
                        modelValue={app.enabled}
                        onUpdateModelValue={() => toggleApp(app.id)}
                      />
                    }
                    showArrow={false}
                    border={idx < apps.length - 1}
                    leftGap={12}
                  />
                ))}
              </List>
            </div>
          </section>

        </div>
      </main>

      {/* ── Home indicator ── */}
      <div className="flex h-7 shrink-0 items-center justify-center pb-2">
        <div className="h-[5px] w-28 rounded-full bg-[#b9bec7]" />
      </div>
    </div>
  )
}
