"use client"

import type { ReactNode } from "react"
import { Avatar } from "@/component/Avatar"
import { List, ListItem } from "@/component/List"
import { StatusBar } from "@/component/StatusBar"
import {
  Bluetooth,
  ChevronRight,
  Layers3,
  Monitor,
  PaintbrushVertical,
  Search,
  Signal,
  Smartphone,
  Satellite,
  Wifi,
} from "lucide-react"

type SettingItem = {
  icon: ReactNode
  iconBg: string
  title: string
  value?: string
}

const connectivityItems: SettingItem[] = [
  {
    icon: <Wifi size={22} strokeWidth={2.2} />,
    iconBg: "#1F63F3",
    title: "WLAN",
    value: "Huawei-Employee",
  },
  {
    icon: <Bluetooth size={22} strokeWidth={2.2} />,
    iconBg: "#1F63F3",
    title: "蓝牙",
    value: "已开启",
  },
  {
    icon: <Signal size={22} strokeWidth={2.2} />,
    iconBg: "#34C759",
    title: "移动网络",
    value: "5G",
  },
  {
    icon: <Satellite size={22} strokeWidth={2.2} />,
    iconBg: "#F5A623",
    title: "卫星网络",
    value: "可用",
  },
  {
    icon: <Layers3 size={22} strokeWidth={2.2} />,
    iconBg: "#1F63F3",
    title: "多设备协同",
    value: "2 台设备",
  },
]

const displayItems: SettingItem[] = [
  {
    icon: <PaintbrushVertical size={22} strokeWidth={2.2} />,
    iconBg: "#FF6B57",
    title: "桌面和个性化",
  },
  {
    icon: <Monitor size={22} strokeWidth={2.2} />,
    iconBg: "#34C759",
    title: "显示和亮度",
  },
]

function SearchBar() {
  return (
    <div className="flex h-14 items-center gap-3 rounded-full bg-[#ECEDEF] px-5 text-[#8A8D93]">
      <Search size={22} strokeWidth={2.25} />
      <span className="text-[17px] font-medium">搜索设置项</span>
    </div>
  )
}

function AvatarPortrait() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_72%_25%,#f4dac9_0_12%,transparent_13%),linear-gradient(140deg,#31c9ff_0%,#246bff_42%,#efe0cf_43%,#9f7863_70%,#6f4939_100%)]">
      <div className="absolute left-[7px] top-[10px] h-[62px] w-[40px] rounded-[24px] bg-[linear-gradient(180deg,#7d4030_0%,#b8674d_55%,#5b2f22_100%)] opacity-85" />
      <div className="absolute left-[28px] top-[18px] h-[20px] w-[18px] rounded-full bg-[#f3cfba]" />
      <div className="absolute left-[24px] top-[32px] h-[24px] w-[28px] rounded-[16px] bg-[#f6dcc8]" />
    </div>
  )
}

function DevicePreview({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative h-11 w-7 overflow-hidden rounded-[10px] border border-black/10 bg-[#0D0B10] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ${className}`}
    >
      <div className="absolute inset-y-[2px] left-1/2 w-[6px] -translate-x-1/2 rounded-full bg-black/60" />
      <div className="absolute inset-[2px] rounded-[8px] bg-[radial-gradient(circle_at_70%_45%,rgba(246,216,162,0.92),rgba(246,216,162,0.16)_22%,transparent_45%),linear-gradient(135deg,#09090a_0%,#1a1a22_50%,#09090a_100%)]" />
    </div>
  )
}

function StorageProgress() {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[13px] text-[#7A7D83]">
        <span>5 GB</span>
        <span>/ 5 GB</span>
      </div>
      <div className="mt-2 h-[7px] rounded-full bg-[#D6D8DE]">
        <div className="h-full w-full rounded-full bg-[#1F63F3]" />
      </div>
    </div>
  )
}

function QuickShortcut({
  title,
  subtitle,
  trailing,
}: {
  title: string
  subtitle?: ReactNode
  trailing?: ReactNode
}) {
  return (
    <div className="min-h-[92px] flex-1 rounded-[22px] bg-[#F4F5F7] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[17px] font-semibold tracking-[-0.02em] text-[#17181C]">
          {title}
        </div>
        {trailing}
      </div>
      {subtitle ? <div>{subtitle}</div> : null}
    </div>
  )
}

function AccountCard() {
  return (
    <section className="rounded-[24px] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
      <div className="flex items-start gap-4">
        <Avatar
          size={72}
          radius={999}
          className="shrink-0 overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
        >
          <AvatarPortrait />
        </Avatar>

        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-[28px] font-bold leading-none tracking-[-0.04em] text-[#18191C]">
                Zi0
              </h2>
              <p className="mt-3 text-[14px] leading-5 text-[#7D8086]">
                华为账号、付款与账单、云空间等
              </p>
            </div>
            <ChevronRight className="mt-2 shrink-0 text-[#C8CAD0]" size={22} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <QuickShortcut title="云空间" subtitle={<StorageProgress />} />
        <QuickShortcut
          title="查找设备"
          trailing={<DevicePreview className="h-10 w-6 rounded-[8px]" />}
          subtitle={
            <div className="mt-4 flex items-center gap-2">
              <div className="rounded-full bg-white p-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF1F5]">
                  <Smartphone size={16} className="text-[#1B1C20]" strokeWidth={2.1} />
                </div>
              </div>
              <span className="text-[13px] text-[#7D8086]">快捷入口</span>
            </div>
          }
        />
      </div>
    </section>
  )
}

function DeviceCard() {
  return (
    <List className="rounded-[24px] shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
      <ListItem
        className="min-h-[84px] px-5 [&_.my-list-item__content]:min-h-[84px]"
        left={<DevicePreview />}
        leftGap={16}
        title={
          <span className="text-[20px] font-semibold tracking-[-0.02em] text-[#18191C]">
            Zi0的Pura 70
          </span>
        }
        right={<ChevronRight className="text-[#C8CAD0]" size={22} strokeWidth={2.2} />}
        showArrow={false}
        border={false}
      />
    </List>
  )
}

function SectionRow({ item, border = true }: { item: SettingItem; border?: boolean }) {
  return (
    <ListItem
      className={[
        "min-h-[78px] px-5",
        "[&_.my-list-item__content]:min-h-[78px]",
        "[&_.my-list-item__content]:border-[rgba(0,0,0,0.06)]",
        "[&_.my-list-item__titles]:flex-1",
        "[&_.my-list-item__title]:w-full",
      ].join(" ")}
      left={
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: item.iconBg }}
        >
          {item.icon}
        </div>
      }
      leftGap={14}
      title={
        <span className="text-[17px] font-medium text-[#18191C]">
          {item.title}
        </span>
      }
      right={
        <div className="flex items-center gap-2">
          {item.value ? (
            <span className="text-[14px] text-[#8A8D93]">{item.value}</span>
          ) : null}
          <ChevronRight className="text-[#C8CAD0]" size={20} strokeWidth={2.2} />
        </div>
      }
      showArrow={false}
      border={border}
    />
  )
}

function SectionCard({ items }: { items: SettingItem[] }) {
  return (
    <List className="rounded-[24px] shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
      {items.map((item, index) => (
        <SectionRow key={item.title} item={item} border={index < items.length - 1} />
      ))}
    </List>
  )
}

function SettingsPageV17() {
  return (
    <div className="mx-auto min-h-[792px] w-[360px] bg-[#F5F5F5] text-[#18191C]">
      <StatusBar time="08:08" backgroundColor="#F5F5F5" />

      <div className="px-4 pb-8">
        <header className="pt-2">
          <h1 className="text-[34px] font-bold tracking-[-0.06em] text-[#18191C]">设置</h1>
        </header>

        <div className="mt-6">
          <SearchBar />
        </div>

        <div className="mt-6 space-y-5">
          <AccountCard />
          <DeviceCard />
          <SectionCard items={connectivityItems} />
          <SectionCard items={displayItems} />
        </div>
      </div>
    </div>
  )
}

export default SettingsPageV17
