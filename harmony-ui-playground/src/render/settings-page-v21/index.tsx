"use client"

import type { CSSProperties, ReactNode } from "react"
import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { ServiceCard } from "@/component/ServiceCard"
import { Switch } from "@/component/Switch"
import { ChevronRight, Search } from "lucide-react"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

type NotificationCard = {
  title: string
  preview: ReactNode
}

type AppItem = {
  key: string
  name: string
  subtitle: string
  enabled: boolean
  icon: ReactNode
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-4 px-1 text-[18px] font-medium tracking-[-0.03em] text-[#666c75]">
      {children}
    </h2>
  )
}

function CircleButton({
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
      className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-0 p-0"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
    >
      {children}
    </button>
  )
}

function TopEntry({
  title,
  border = true,
}: {
  title: string
  border?: boolean
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 border-0 bg-transparent py-5 text-left"
    >
      <span className="flex-1 text-[24px] font-semibold tracking-[-0.04em] text-[#1f2329]">
        {title}
      </span>
      <ChevronRight size={30} strokeWidth={1.5} className="text-[#c7cad1]" />
      {border ? (
        <span
          className="pointer-events-none absolute inset-x-7 bottom-0 h-px"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}
        />
      ) : null}
    </button>
  )
}

function PreviewPhone({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        "relative mx-auto h-[92px] w-[54px] overflow-hidden rounded-[10px] border-[2.5px] border-[#3b79eb] bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}

function LockScreenPreview() {
  return (
    <PreviewPhone>
      <div className="pt-3 text-center text-[10px] leading-none font-bold text-[#1f5fe0]">
        08
      </div>
      <div className="mt-1 text-center text-[10px] leading-none font-bold text-[#1f5fe0]">
        08
      </div>
      <div className="mx-auto mt-5 h-[11px] w-[42px] rounded-[3px] bg-[#1e5fe4]" />
      <div className="mx-auto mt-1.5 h-[10px] w-[42px] rounded-[3px] bg-[#bcd0ff]" />
      <div className="mx-auto mt-1 h-[10px] w-[42px] rounded-[3px] bg-[#bcd0ff]" />
      <div className="absolute bottom-[7px] left-[8px] h-[6px] w-[6px] rounded-full bg-[#bcd0ff]" />
      <div className="absolute right-[8px] bottom-[7px] h-[6px] w-[6px] rounded-full bg-[#bcd0ff]" />
    </PreviewPhone>
  )
}

function BannerPreview() {
  return (
    <PreviewPhone>
      <div className="mx-auto mt-[4px] h-[16px] w-[42px] rounded-[4px] bg-[#1e5fe4]" />
    </PreviewPhone>
  )
}

function BadgePreview() {
  return (
    <PreviewPhone>
      <div className="grid grid-cols-4 gap-[3px] px-[6px] pt-[10px]">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="h-[7px] rounded-[2px] bg-[#c3d6ff]"
            style={
              index === 7
                ? ({
                    position: "relative",
                    overflow: "visible",
                  } as CSSProperties)
                : undefined
            }
          >
            {index === 7 ? (
              <span className="absolute -top-[1px] -right-[1px] h-[4px] w-[4px] rounded-full bg-[#1e5fe4]" />
            ) : null}
          </span>
        ))}
      </div>
      <div className="absolute inset-x-[6px] bottom-[6px] grid grid-cols-4 gap-[3px]">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="h-[9px] rounded-[2px] bg-[#c3d6ff]" />
        ))}
      </div>
    </PreviewPhone>
  )
}

function NotificationTypeCard({ title, preview }: NotificationCard) {
  return (
    <ServiceCard
      variant="white"
      className="gap-4"
      style={{
        width: "100%",
        borderRadius: 24,
        padding: "18px 12px 16px",
      }}
    >
      <div className="flex min-h-[112px] items-center justify-center">
        {preview}
      </div>
      <div className="text-center text-[20px] font-semibold tracking-[-0.04em] text-[#1f2329]">
        {title}
      </div>
    </ServiceCard>
  )
}

function SegmentControl({
  value,
  onChange,
}: {
  value: "apps" | "services"
  onChange: (value: "apps" | "services") => void
}) {
  return (
    <div className="flex rounded-full bg-[#e6e7ea] p-[4px]">
      {[
        { key: "apps" as const, label: "应用" },
        { key: "services" as const, label: "元服务" },
      ].map((item) => {
        const selected = item.key === value

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={[
              "h-[56px] flex-1 rounded-full border-0 text-[20px] font-semibold tracking-[-0.03em] transition-all",
              selected
                ? "bg-white text-[#1f2329]"
                : "bg-transparent text-[#61656d]",
            ].join(" ")}
            style={
              selected
                ? { boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }
                : undefined
            }
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

function AppShell({
  children,
  background,
}: {
  children: ReactNode
  background: string
}) {
  return (
    <div
      className="relative flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[20px]"
      style={{
        background,
        boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
      }}
    >
      {children}
    </div>
  )
}

function IqiyiIcon() {
  return (
    <AppShell background="linear-gradient(135deg, #21d86f 0%, #08c07a 42%, #6e52ff 100%)">
      <div className="text-center text-white">
        <div className="text-[14px] leading-none font-black tracking-[-0.05em]">
          iQIYI
        </div>
        <div className="mt-1 text-[8px] leading-none font-bold tracking-[-0.04em]">
          爱奇艺
        </div>
      </div>
    </AppShell>
  )
}

function BaiduIcon() {
  return (
    <AppShell background="linear-gradient(180deg, #ffffff 0%, #fafafa 100%)">
      <div className="relative h-[46px] w-[46px]">
        <span className="absolute top-[16px] left-[2px] h-[18px] w-[18px] rounded-full bg-[#37d6ff] opacity-90" />
        <span className="absolute top-[16px] right-[2px] h-[18px] w-[18px] rounded-full bg-[#63d8ff] opacity-90" />
        <span className="absolute top-[2px] left-[14px] h-[18px] w-[18px] rounded-full bg-[#ff4a8d] opacity-90" />
        <span className="absolute bottom-[2px] left-[14px] h-[18px] w-[18px] rounded-full bg-[#2d8cff] opacity-90" />
        <span className="absolute top-[11px] left-[11px] h-[24px] w-[24px] rounded-full border-[6px] border-white" />
      </div>
      <div
        className="absolute bottom-[4px] left-1/2 h-[4px] w-[18px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #ff477e 0%, #ff477e 50%, #2d8cff 50%, #2d8cff 100%)",
        }}
      />
    </AppShell>
  )
}

function MemoIcon() {
  return (
    <AppShell background="linear-gradient(180deg, #ffd347 0%, #ffd347 42%, #ffffff 42%, #f6f6f6 100%)">
      <div className="relative h-[46px] w-[46px]">
        <span className="absolute top-[18px] left-[4px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#f4c32a] text-[12px] text-white">
          ✓
        </span>
        <span className="absolute top-[19px] left-[28px] h-[4px] w-[14px] rounded-full bg-[#f4c32a]" />
        <span className="absolute top-[28px] left-[28px] h-[4px] w-[14px] rounded-full bg-[#f4c32a]" />
      </div>
    </AppShell>
  )
}

function BilibiliIcon() {
  return (
    <AppShell background="linear-gradient(180deg, #ff6ca7 0%, #ff4a8d 100%)">
      <div className="relative h-[44px] w-[50px] rounded-[12px] border-[3px] border-[#ffd5e6]">
        <span className="absolute -top-[7px] left-[8px] h-[8px] w-[4px] rotate-[-30deg] rounded-full bg-[#ff8fbe]" />
        <span className="absolute -top-[7px] right-[8px] h-[8px] w-[4px] rotate-[30deg] rounded-full bg-[#ff8fbe]" />
        <span className="absolute top-[14px] left-[6px] text-[12px] leading-none font-black text-white">
          {"\u003E||||\u003C"}
        </span>
      </div>
    </AppShell>
  )
}

function CainiaoIcon() {
  return (
    <AppShell background="linear-gradient(180deg, #1f75ff 0%, #145ad8 100%)">
      <div className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white">
        <span className="absolute inset-[8px] rounded-full bg-black" />
        <span className="absolute bottom-[13px] h-[10px] w-[18px] rounded-b-full border-b-[4px] border-[#29e28d]" />
      </div>
      <span className="absolute bottom-[8px] left-[23px] h-[10px] w-[6px] rounded-full bg-[#2be292]" />
      <span className="absolute right-[23px] bottom-[8px] h-[10px] w-[6px] rounded-full bg-[#2be292]" />
    </AppShell>
  )
}

function AppRow({
  name,
  subtitle,
  icon,
  value,
  onToggle,
  border = true,
}: Pick<AppItem, "name" | "subtitle" | "icon"> & {
  value: boolean
  onToggle: (next: boolean) => void
  border?: boolean
}) {
  return (
    <div className="flex gap-4 px-7 py-5">
      <div className="shrink-0">{icon}</div>

      <div
        className={[
          "flex min-h-[72px] min-w-0 flex-1 items-center gap-4",
          border ? "border-b" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={border ? { borderColor: "rgba(0, 0, 0, 0.12)" } : undefined}
      >
        <div className="min-w-0 flex-1 py-1">
          <div className="text-[24px] font-semibold tracking-[-0.04em] text-[#1f2329]">
            {name}
          </div>
          <div className="mt-1 text-[18px] leading-[1.35] tracking-[-0.03em] text-[#6f747d]">
            {subtitle}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-5 pl-2">
          <ChevronRight
            size={30}
            strokeWidth={1.5}
            className="text-[#c7cad1]"
          />
          <div
            className="h-[54px] w-px"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}
          />
          <Switch
            modelValue={value}
            onUpdateModelValue={onToggle}
            activeColor="#1f63ef"
            inactiveColor="#dfdfe2"
            nodeColor="#ffffff"
            style={{
              transform: "scale(1.6)",
              transformOrigin: "center",
            }}
          />
        </div>
      </div>
    </div>
  )
}

const notificationCards: NotificationCard[] = [
  {
    title: "锁屏通知",
    preview: <LockScreenPreview />,
  },
  {
    title: "横幅通知",
    preview: <BannerPreview />,
  },
  {
    title: "桌面角标",
    preview: <BadgePreview />,
  },
]

const appItems: AppItem[] = [
  {
    key: "iqiyi",
    name: "爱奇艺",
    subtitle: "已关闭通知",
    enabled: false,
    icon: <IqiyiIcon />,
  },
  {
    key: "baidu",
    name: "百度网盘",
    subtitle: "已关闭通知",
    enabled: false,
    icon: <BaiduIcon />,
  },
  {
    key: "memo",
    name: "备忘录",
    subtitle: "锁屏、横幅、角标、响铃、振动",
    enabled: true,
    icon: <MemoIcon />,
  },
  {
    key: "bilibili",
    name: "哔哩哔哩",
    subtitle: "已关闭通知",
    enabled: false,
    icon: <BilibiliIcon />,
  },
  {
    key: "cainiao",
    name: "菜鸟",
    subtitle: "锁屏、角标",
    enabled: true,
    icon: <CainiaoIcon />,
  },
]

function SettingsPageV21() {
  const [tab, setTab] = useState<"apps" | "services">("apps")
  const [switches, setSwitches] = useState<Record<string, boolean>>(
    Object.fromEntries(appItems.map((item) => [item.key, item.enabled]))
  )

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f5f6f8] text-[#1f2329]">
      <StatusBar time="15:03" backgroundColor="#f5f6f8" />

      <div className="px-4 pt-2 pb-5">
        <div className="flex items-center gap-4">
          <CircleButton ariaLabel="返回">
            <img src={iconChevronBack} alt="" className="h-7 w-7" />
          </CircleButton>

          <h1 className="flex-1 text-[30px] font-semibold tracking-[-0.05em] text-[#1f2329]">
            通知和状态栏
          </h1>

          <CircleButton ariaLabel="搜索">
            <Search size={28} strokeWidth={2} className="text-[#1f2329]" />
          </CircleButton>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">
        <div className="space-y-7">
          <section>
            <ServiceCard
              variant="white"
              className="gap-0 overflow-hidden"
              style={{
                width: "100%",
                borderRadius: 28,
                padding: 0,
              }}
            >
              <div className="relative px-7">
                <TopEntry title="状态栏" />
              </div>
              <div className="relative px-7">
                <TopEntry title="实况窗" border={false} />
              </div>
            </ServiceCard>
          </section>

          <section>
            <SectionTitle>通知管理</SectionTitle>
            <div className="grid grid-cols-3 gap-4">
              {notificationCards.map((card) => (
                <NotificationTypeCard
                  key={card.title}
                  title={card.title}
                  preview={card.preview}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SegmentControl value={tab} onChange={setTab} />

            <ServiceCard
              variant="white"
              className="gap-0 overflow-hidden"
              style={{
                width: "100%",
                borderRadius: 28,
                padding: 0,
              }}
            >
              {(tab === "apps" ? appItems : appItems.slice(0, 2)).map(
                (item, index, list) => (
                  <AppRow
                    key={item.key}
                    name={item.name}
                    subtitle={item.subtitle}
                    icon={item.icon}
                    value={switches[item.key]}
                    onToggle={(next) =>
                      setSwitches((prev) => ({
                        ...prev,
                        [item.key]: next,
                      }))
                    }
                    border={index !== list.length - 1}
                  />
                )
              )}
            </ServiceCard>
          </section>
        </div>
      </div>

      <div className="flex h-7 items-center justify-center pb-2">
        <div className="h-[6px] w-28 rounded-full bg-[#aaabaf]" />
      </div>
    </div>
  )
}

export default SettingsPageV21
