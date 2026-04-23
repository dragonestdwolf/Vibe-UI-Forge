"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import {
  BellDot,
  BellRing,
  ChevronRight,
  Lock,
  Search,
} from "lucide-react"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"
import { List, ListItem } from "@/component/List"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

/* ─── constants ─────────────────────────────────────────── */
const BG = "#f2f4f8"
const CARD_SHADOW = "0_6px_20px_rgba(0,0,0,0.07)"

/* ─── segmented button (Outline 变体，规格来源：benchmark.html) ── */
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
      aria-label="筛选类型"
      className="flex w-full items-stretch rounded-[20px] p-[2px]"
      style={{ background: "rgba(0,0,0,0.047)" }}
    >
      {options.map((opt) => {
        const active = opt === selected
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={[
              "flex min-h-[36px] flex-1 cursor-pointer select-none items-center justify-center",
              "rounded-[18px] border-0 px-3 py-[6px]",
              "text-[14px] font-medium leading-[20px]",
              "transition-all duration-150",
              active
                ? "bg-white shadow-[0_0_3px_rgba(0,0,0,0.20)] text-[rgba(0,0,0,0.898)]"
                : "bg-transparent text-[rgba(0,0,0,0.60)]",
            ].join(" ")}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/* ─── notification tile（三张平铺式卡片） ──────────────────── */
function NotifTile({
  icon,
  iconBg,
  iconColor,
  label,
  enabled,
  onToggle,
}: {
  icon: ReactNode
  iconBg: string
  iconColor: string
  label: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`flex flex-1 flex-col rounded-[20px] bg-white px-3 py-4 shadow-[${CARD_SHADOW}]`}
    >
      {/* icon */}
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <span style={{ color: iconColor }}>{icon}</span>
      </div>

      {/* label */}
      <span className="mt-2.5 text-[13px] font-semibold leading-[18px] text-[#191d24]">
        {label}
      </span>

      {/* status + toggle */}
      <div className="mt-2 flex items-center justify-between gap-1">
        <span
          className={[
            "text-[11px] leading-[16px]",
            enabled ? "text-[#0a59f7]" : "text-[rgba(0,0,0,0.45)]",
          ].join(" ")}
        >
          {enabled ? "已开启" : "已关闭"}
        </span>
        <Switch
          modelValue={enabled}
          onUpdateModelValue={onToggle}
        />
      </div>
    </div>
  )
}

/* ─── app icon（圆角方块 + 首字） ─────────────────────────── */
function AppIcon({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px] text-white"
      style={{ backgroundColor: color }}
    >
      <span className="text-[16px] font-semibold leading-none">
        {name.charAt(0)}
      </span>
    </div>
  )
}

/* ─── section label（对齐 v24 规格） ─────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 px-1 text-[13px] font-medium leading-[18px] text-[#727985]">
      {children}
    </p>
  )
}

/* ─── data ───────────────────────────────────────────────── */
type AppEntry = {
  id: string
  name: string
  color: string
  enabled: boolean
}

type NotifEntry = {
  id: string
  icon: ReactNode
  iconBg: string
  iconColor: string
  label: string
  enabled: boolean
}

const INITIAL_NOTIFS: NotifEntry[] = [
  {
    id: "lockscreen",
    icon: <Lock size={20} strokeWidth={1.7} />,
    iconBg: "#e8f0ff",
    iconColor: "#2368f3",
    label: "锁屏通知",
    enabled: true,
  },
  {
    id: "banner",
    icon: <BellRing size={20} strokeWidth={1.7} />,
    iconBg: "#fff2e0",
    iconColor: "#e07820",
    label: "横幅通知",
    enabled: true,
  },
  {
    id: "badge",
    icon: <BellDot size={20} strokeWidth={1.7} />,
    iconBg: "#f0eaff",
    iconColor: "#7b40f0",
    label: "桌面角标",
    enabled: false,
  },
]

const INITIAL_APPS: AppEntry[] = [
  { id: "iqiyi",    name: "爱奇艺",   color: "#00bc06", enabled: true  },
  { id: "baidu",    name: "百度网盘", color: "#2468f2", enabled: false },
  { id: "memo",     name: "备忘录",   color: "#ff9500", enabled: true  },
  { id: "bilibili", name: "哔哩哔哩", color: "#fb7299", enabled: false },
  { id: "cainiao",  name: "菜鸟",     color: "#ff6a00", enabled: true  },
]

function appStatus(enabled: boolean): string {
  return enabled ? "锁屏、角标" : "已关闭通知"
}

/* ─── page ───────────────────────────────────────────────── */
export default function NotificationSettingsV2() {
  const [activeTab, setActiveTab] = useState("应用")
  const [notifs, setNotifs] = useState<NotifEntry[]>(INITIAL_NOTIFS)
  const [apps, setApps] = useState<AppEntry[]>(INITIAL_APPS)

  function toggleNotif(id: string) {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    )
  }

  function toggleApp(id: string) {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    )
  }

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f2f4f8] text-[#191d24]">
      <StatusBar time="09:41" backgroundColor={BG} />

      {/* ── 标题栏 ── */}
      <header className="px-4 pt-2">
        {/* 顶部操作行：返回 / 搜索 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="返回"
            className="flex size-10 items-center justify-center rounded-full border-0 bg-white/85 p-0 shadow-[0_1px_8px_rgba(28,35,45,0.06)]"
          >
            <img src={iconChevronBack} alt="" className="size-6" />
          </button>

          <button
            type="button"
            aria-label="搜索"
            className="flex size-10 items-center justify-center rounded-full border-0 bg-white/85 p-0 shadow-[0_1px_8px_rgba(28,35,45,0.06)]"
          >
            <Search size={20} strokeWidth={1.8} className="text-[#191d24]" />
          </button>
        </div>

        {/* 大标题 */}
        <h1 className="mt-2 text-[32px] font-semibold leading-[40px] text-[#191d24]">
          通知和状态栏
        </h1>
      </header>

      {/* ── 内容 ── */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-5">
        <div className="flex flex-col gap-5">

          {/* 一楼：状态栏 & 实况窗 */}
          <div className={`overflow-hidden rounded-[24px] bg-white shadow-[${CARD_SHADOW}]`}>
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

          {/* 二楼：通知管理（三张平铺卡片） */}
          <section>
            <SectionLabel>通知管理</SectionLabel>
            <div className="flex gap-3">
              {notifs.map((n) => (
                <NotifTile
                  key={n.id}
                  icon={n.icon}
                  iconBg={n.iconBg}
                  iconColor={n.iconColor}
                  label={n.label}
                  enabled={n.enabled}
                  onToggle={() => toggleNotif(n.id)}
                />
              ))}
            </div>
          </section>

          {/* 三楼：分段按钮 + 应用列表 */}
          <section className="flex flex-col gap-3">
            <SegmentedButton
              options={["应用", "元服务"]}
              selected={activeTab}
              onChange={setActiveTab}
            />

            <div className={`overflow-hidden rounded-[24px] bg-white shadow-[${CARD_SHADOW}]`}>
              <List>
                {apps.map((app, idx) => (
                  <ListItem
                    key={app.id}
                    left={<AppIcon name={app.name} color={app.color} />}
                    title={app.name}
                    subtitle={
                      <span
                        style={{
                          color: app.enabled
                            ? "#0a59f7"
                            : "rgba(0,0,0,0.45)",
                        }}
                      >
                        {appStatus(app.enabled)}
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
