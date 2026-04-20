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
  Speaker,
  Satellite,
  Wifi,
} from "lucide-react"

type SettingItem = {
  icon: ReactNode
  iconBg: string
  title: string
  value?: string
  progress?: number
}

const connectivityItems: SettingItem[] = [
  {
    icon: <Wifi size={24} strokeWidth={2.2} />,
    iconBg: "#1E5CF3",
    title: "Mate 80 Pro",
    value: "HUAWEI-Guest",
  },
  {
    icon: <Bluetooth size={24} strokeWidth={2.2} />,
    iconBg: "#1E5CF3",
    title: "星闪和蓝牙",
    value: "已开启",
  },
  {
    icon: <Signal size={24} strokeWidth={2.2} />,
    iconBg: "#34C759",
    title: "移动网络",
  },
  {
    icon: <Satellite size={24} strokeWidth={2.2} />,
    iconBg: "#F6A623",
    title: "卫星网络",
  },
  {
    icon: <Layers3 size={24} strokeWidth={2.2} />,
    iconBg: "#1E5CF3",
    title: "多设备协同",
  },
]

const personalizationItems: SettingItem[] = [
  {
    icon: <PaintbrushVertical size={24} strokeWidth={2.2} />,
    iconBg: "#FF6A55",
    title: "桌面和个性化",
  },
  {
    icon: <Monitor size={24} strokeWidth={2.2} />,
    iconBg: "#34C759",
    title: "显示和亮度",
  },
  {
    icon: <Speaker size={24} strokeWidth={2.2} />,
    iconBg: "linear-gradient(135deg, #6D5CF6 0%, #7A48F8 100%)",
    title: "声音和振动",
    progress: 0.82,
  },
]

function SearchBar() {
  return (
    <div className="flex h-[56px] items-center gap-3 rounded-[28px] bg-[#EBECEF] px-7 text-[#777A7F]">
      <Search size={28} strokeWidth={2} />
      <span className="text-[22px] font-medium tracking-[-0.02em]">Search</span>
    </div>
  )
}

function DevicePreview({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative h-[42px] w-[28px] overflow-hidden rounded-[10px] border border-black/10 bg-[#0C0B10] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ${className}`}
    >
      <div className="absolute inset-y-[2px] left-1/2 w-[7px] -translate-x-1/2 rounded-full bg-black/60" />
      <div className="absolute inset-[2px] rounded-[8px] bg-[radial-gradient(circle_at_70%_45%,rgba(245,214,155,0.92),rgba(245,214,155,0.12)_24%,transparent_45%),linear-gradient(135deg,#090909_0%,#17161C_48%,#090909_100%)]" />
    </div>
  )
}

function AvatarArt() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_68%_28%,#efd4b5_0_14%,transparent_15%),radial-gradient(circle_at_42%_74%,#72472f_0_18%,transparent_19%),linear-gradient(145deg,#08d2e8_0%,#0f5db6_38%,#d0ceb8_39%,#e6dccb_60%,#725648_61%,#512d24_100%)]">
      <div className="absolute left-[6px] top-[12px] h-[76px] w-[48px] rounded-[28px] bg-[linear-gradient(180deg,#6f3426_0%,#9e5238_50%,#4f2419_100%)] opacity-80 blur-[0.3px]" />
      <div className="absolute left-[34px] top-[20px] h-[24px] w-[20px] rounded-full bg-[#f2d2be] opacity-95" />
      <div className="absolute left-[30px] top-[36px] h-[28px] w-[30px] rounded-[14px] bg-[#f5ddcb] opacity-90" />
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full rounded-full bg-[#D1D2D6]">
      <div
        className="h-full rounded-full bg-[#1E5CF3]"
        style={{ width: `${Math.max(0, Math.min(value, 1)) * 100}%` }}
      />
    </div>
  )
}

function AccountCard() {
  return (
    <section className="rounded-[32px] bg-white px-6 pb-6 pt-7 shadow-[0_12px_30px_rgba(17,24,39,0.05)]">
      <div className="flex items-start gap-5">
        <Avatar
          size={92}
          radius={999}
          className="shrink-0 overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
        >
          <AvatarArt />
        </Avatar>
        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#17181C]">
                张小意
              </h2>
              <p className="mt-5 text-[15px] leading-[1.35] text-[#787B81]">
                HUAWEI ID、付款与账单、云空间等
              </p>
            </div>
            <ChevronRight className="mt-3 shrink-0 text-[#C4C6CB]" size={30} strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-[24px] bg-[#F5F5F6] px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="text-[19px] font-semibold tracking-[-0.03em] text-[#16171B]">
              云空间
            </span>
            <span className="text-[18px] font-semibold tracking-[-0.03em] text-[#666A72]">
              25 GB / 50 GB
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar value={0.5} />
          </div>
        </div>

        <div className="rounded-[24px] bg-[#F5F5F6] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[19px] font-semibold tracking-[-0.03em] text-[#16171B]">
              查找设备
            </span>
            <div className="flex items-center">
              <div className="-ml-0">
                <div className="rounded-full bg-white p-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                  <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#DCC4B7_0%,#C59E89_42%,#8A685D_100%)] text-[18px]">
                    🎧
                  </div>
                </div>
              </div>
              <div className="-ml-3 rounded-full bg-white p-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#DCE8E6_0%,#BFD8D3_100%)] text-[18px]">
                  💻
                </div>
              </div>
              <div className="-ml-3 rounded-full bg-white p-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#F5F7F9_0%,#E6EAEE_100%)]">
                  <DevicePreview className="h-[30px] w-[20px] rounded-[7px]" />
                </div>
              </div>
              <div className="-ml-3 rounded-full bg-white p-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#F6F6F7_0%,#ECEDEF_100%)]">
                  <DevicePreview className="h-[30px] w-[20px] rounded-[7px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroDeviceCard() {
  return (
    <List className="rounded-[30px] shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
      <ListItem
        className="min-h-[110px] px-6 [&_.my-list-item__content]:min-h-[110px]"
        left={<DevicePreview />}
        leftGap={16}
        title={
          <span className="text-[26px] font-medium tracking-[-0.03em] text-[#17181C]">
            Mate 80 Pro
          </span>
        }
        right={<ChevronRight className="text-[#C8CAD0]" size={30} strokeWidth={2} />}
        showArrow={false}
        border={false}
      />
    </List>
  )
}

function SettingIcon({ item }: { item: SettingItem }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
      style={{ background: item.iconBg }}
    >
      {item.icon}
    </div>
  )
}

function SettingTitle({ item }: { item: SettingItem }) {
  if (typeof item.progress === "number") {
    return (
      <div className="space-y-3">
        <div className="text-[25px] font-medium tracking-[-0.035em] text-[#17181C]">
          {item.title}
        </div>
        <div className="h-[8px] max-w-[330px] rounded-full bg-[#CACBCD]">
          <div
            className="h-full rounded-full bg-[#B9BBBF]"
            style={{ width: `${Math.max(0, Math.min(item.progress, 1)) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <span className="text-[25px] font-medium tracking-[-0.035em] text-[#17181C]">
      {item.title}
    </span>
  )
}

function SettingRight({ item }: { item: SettingItem }) {
  return (
    <div className="flex items-center gap-3">
      {item.value ? (
        <div className="shrink-0 text-[22px] tracking-[-0.02em] text-[#7D7F84]">
          {item.value}
        </div>
      ) : null}
      <ChevronRight className="shrink-0 text-[#C9CBD0]" size={28} strokeWidth={2} />
    </div>
  )
}

function SettingRow({ item, border = true }: { item: SettingItem; border?: boolean }) {
  return (
    <ListItem
      className={[
        "min-h-[92px] px-6",
        "[&_.my-list-item__content]:min-h-[92px]",
        "[&_.my-list-item__content]:border-[#D8D9DD]",
        "[&_.my-list-item__titles]:flex-1",
        "[&_.my-list-item__title]:w-full",
        item.progress
          ? "[&_.my-list-item__title]:overflow-visible [&_.my-list-item__title]:whitespace-normal"
          : "",
      ].join(" ")}
      left={<SettingIcon item={item} />}
      leftGap={16}
      title={<SettingTitle item={item} />}
      right={<SettingRight item={item} />}
      showArrow={false}
      border={border}
    />
  )
}

function SettingsGroup({ items }: { items: SettingItem[] }) {
  return (
    <List className="rounded-[32px] shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
      {items.map((item, index) => (
        <SettingRow key={item.title} item={item} border={index < items.length - 1} />
      ))}
    </List>
  )
}

function SettingsPageV16() {
  return (
    <div className="mx-auto min-h-[792px] w-[360px] bg-[#F4F5F7] text-[#17181C]">
      <StatusBar time="08:08" backgroundColor="#F4F5F7" />

      <div className="px-4 pb-8">
        <header className="px-1 pt-3">
          <h1 className="text-[33px] font-bold tracking-[-0.06em] text-[#18191D]">设置</h1>
        </header>

        <div className="mt-8">
          <SearchBar />
        </div>

        <div className="mt-8 space-y-6">
          <AccountCard />
          <HeroDeviceCard />
          <SettingsGroup items={connectivityItems} />
          <SettingsGroup items={personalizationItems} />
        </div>
      </div>
    </div>
  )
}

export default SettingsPageV16
