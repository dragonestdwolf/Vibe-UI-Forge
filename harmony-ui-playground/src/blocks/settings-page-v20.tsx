"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { ServiceCard } from "@/component/ServiceCard"
import { Button } from "@/component/Button"
import { Switch } from "@/component/Switch"
import { BarChart3, ChevronRight, Sprout, Umbrella } from "lucide-react"

import iconChevronBack from "./assets/pixso-icons/icon-chevron-backward.png"

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-3 text-[18px] font-medium tracking-[-0.02em] text-[#6a707a]">
      {children}
    </h2>
  )
}

function IconBadge({
  color,
  children,
}: {
  color: string
  children: ReactNode
}) {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full"
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  )
}

function ActionPill({ children }: { children: string }) {
  return (
    <Button
      type="default"
      block
      className="h-[52px] rounded-full border-0 text-[17px] font-medium"
      style={{
        backgroundColor: "#f3f4f6",
        color: "#176bff",
        boxShadow: "none",
      }}
    >
      {children}
    </Button>
  )
}

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
      className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-[rgba(0,0,0,0.05)] p-0"
    >
      {children}
    </button>
  )
}

function FourDots() {
  return (
    <div className="grid grid-cols-2 gap-[5px]">
      {Array.from({ length: 4 }).map((_, index) => (
        <span
          key={index}
          className="h-[5px] w-[5px] rounded-full bg-[rgba(0,0,0,0.86)]"
        />
      ))}
    </div>
  )
}

function SettingsPageV20() {
  const [passwordEnabled, setPasswordEnabled] = useState(false)

  return (
    <div className="mx-auto flex min-h-[792px] w-[360px] flex-col bg-[#f5f6f8] text-[#1f2329]">
      <StatusBar time="08:08" backgroundColor="#f5f6f8" />

      <div className="px-4 pt-1 pb-3">
        <div className="flex items-center gap-4">
          <HeaderButton ariaLabel="返回">
            <img src={iconChevronBack} alt="" className="h-6 w-6" />
          </HeaderButton>

          <h1 className="flex-1 text-[28px] font-semibold tracking-[-0.04em] text-[#20242a]">
            健康使用设备
          </h1>

          <HeaderButton ariaLabel="更多">
            <FourDots />
          </HeaderButton>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">
        <div className="space-y-6">
          <section>
            <SectionTitle>自己使用</SectionTitle>
            <ServiceCard
              variant="white"
              className="gap-5"
              style={{
                width: "100%",
                borderRadius: 30,
                padding: "24px",
              }}
            >
              <div className="flex items-start gap-4">
                <IconBadge color="#1890ff">
                  <BarChart3 size={20} color="#ffffff" strokeWidth={2.1} />
                </IconBadge>
                <div className="min-w-0 flex-1">
                  <div className="text-[22px] font-semibold tracking-[-0.03em] text-[#1f2329]">
                    使用统计和管理
                  </div>
                  <p className="mt-3 text-[16px] leading-[1.42] tracking-[-0.03em] text-[#7a7f88]">
                    了解自己的屏幕使用情况，按需设置使用限制，
                    <br />
                    合理规划设备使用时长
                  </p>
                </div>
              </div>
              <ActionPill>开启</ActionPill>
            </ServiceCard>
          </section>

          <section>
            <SectionTitle>家人守护</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <ServiceCard
                variant="white"
                className="gap-4"
                style={{
                  width: "100%",
                  borderRadius: 28,
                  padding: "24px 22px 22px",
                }}
              >
                <div className="flex items-start gap-3">
                  <IconBadge color="#35c759">
                    <Umbrella size={20} color="#ffffff" strokeWidth={2} />
                  </IconBadge>
                  <div className="min-w-0">
                    <div className="text-[19px] font-semibold tracking-[-0.03em] text-[#1f2329]">
                      远程守护
                    </div>
                    <p className="mt-3 text-[15px] leading-[1.38] tracking-[-0.03em] text-[#7a7f88]">
                      远程守护家人的设备
                      <br />
                      使用情况
                    </p>
                  </div>
                </div>
                <ActionPill>开启</ActionPill>
              </ServiceCard>

              <ServiceCard
                variant="white"
                className="gap-4"
                style={{
                  width: "100%",
                  borderRadius: 28,
                  padding: "24px 22px 22px",
                }}
              >
                <div className="flex items-start gap-3">
                  <IconBadge color="#56d0c9">
                    <Sprout size={20} color="#ffffff" strokeWidth={2} />
                  </IconBadge>
                  <div className="min-w-0">
                    <div className="text-[19px] font-semibold tracking-[-0.03em] text-[#1f2329]">
                      被家人守护
                    </div>
                    <p className="mt-3 text-[15px] leading-[1.38] tracking-[-0.03em] text-[#7a7f88]">
                      邀请家人扫描二维码
                      <br />
                      守护您
                    </p>
                  </div>
                </div>
                <ActionPill>二维码</ActionPill>
              </ServiceCard>
            </div>
          </section>

          <section>
            <SectionTitle>临时给孩子使用</SectionTitle>
            <ServiceCard
              variant="white"
              style={{
                width: "100%",
                borderRadius: 28,
                padding: "14px 10px 14px 16px",
              }}
            >
              <button
                type="button"
                className="flex w-full items-center gap-4 rounded-[24px] border-0 bg-transparent px-1 py-2 text-left"
              >
                <IconBadge color="#35c759">
                  <Umbrella size={21} color="#ffffff" strokeWidth={2} />
                </IconBadge>
                <span className="flex-1 text-[21px] font-semibold tracking-[-0.03em] text-[#1f2329]">
                  未成年人模式
                </span>
                <ChevronRight
                  size={28}
                  strokeWidth={1.5}
                  className="text-[#c8cbd1]"
                />
              </button>
            </ServiceCard>
          </section>

          <section>
            <SectionTitle>密码管理</SectionTitle>
            <ServiceCard
              variant="white"
              style={{
                width: "100%",
                borderRadius: 28,
                padding: "16px 16px 18px",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 text-[21px] font-semibold tracking-[-0.03em] text-[#1f2329]">
                  健康使用设备密码
                </div>
                <Switch
                  modelValue={passwordEnabled}
                  onUpdateModelValue={setPasswordEnabled}
                  activeColor="#176bff"
                  inactiveColor="#d7d9de"
                  nodeColor="#ffffff"
                  style={{
                    transform: "scale(1.45)",
                    transformOrigin: "right center",
                  }}
                />
              </div>
            </ServiceCard>
            <p className="mt-4 px-1 text-[16px] leading-[1.42] tracking-[-0.03em] text-[#7a7f88]">
              开启后，修改屏幕使用管理和远程守护的规则时，需验证密码。
            </p>
          </section>
        </div>
      </div>

      <div className="flex h-7 items-center justify-center pb-2">
        <div className="h-[6px] w-28 rounded-full bg-[#c9ccd3]" />
      </div>
    </div>
  )
}

export default SettingsPageV20
