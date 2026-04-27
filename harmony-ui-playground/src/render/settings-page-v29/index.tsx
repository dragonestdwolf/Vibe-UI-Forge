"use client"

import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { Switch } from "@/component/Switch"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */
function FocusModeIcon({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="专注">
      <circle
        cx="32"
        cy="32"
        r="29"
        fill={active ? "#FFFFFF" : "#542BD7"}
        fillOpacity={active ? 0.3 : 1}
      />
      <circle
        cx="32"
        cy="32"
        r="16"
        fill="none"
        stroke={active ? "#FFFFFF" : "#542BD7"}
        strokeWidth="3"
      />
      <circle cx="32" cy="32" r="6" fill={active ? "#FFFFFF" : "#542BD7"} />
    </svg>
  )
}

function DoNotDisturbIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="免打扰">
      <circle cx="32" cy="32" r="29" fill="#542BD7" />
      <path
        d="M40.4 41.2c-7.4 0-13.4-6-13.4-13.4 0-3 1-5.7 2.6-7.9-5.6 1.4-9.7 6.4-9.7 12.4 0 7.1 5.7 12.8 12.8 12.8 6 0 11-4.1 12.4-9.7-1.4 1-2.9 1.7-4.7 1.8z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function EyeProtectionIcon() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="护眼模式">
      <circle cx="32" cy="32" r="29" fill="#07C160" />
      <path
        d="M32 20C22 20 14 28 8 32C14 36 22 44 32 44C42 44 50 36 56 32C50 28 42 20 32 20Z"
        fill="#FFFFFF"
      />
      <circle cx="32" cy="32" r="8" fill="#07C160" />
    </svg>
  )
}

const moreIcon =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="1.8" fill="white" />
      <circle cx="12" cy="12" r="1.8" fill="white" />
      <circle cx="18" cy="12" r="1.8" fill="white" />
    </svg>`
  )

/* -------------------------------------------------------------------------- */
/* Status Pill badge                                                          */
/* -------------------------------------------------------------------------- */
function StatusPill({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <div
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium leading-4"
      style={{
        backgroundColor: active ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
        color: active ? "#FFFFFF" : "rgba(0,0,0,0.45)",
      }}
    >
      {label}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Active scene card (purple gradient)                                        */
/* -------------------------------------------------------------------------- */
function ActiveSceneCard({
  icon,
  title,
  subtitle,
  statusLabel,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  statusLabel: string
  enabled: boolean
  onToggle: (val: boolean) => void
}) {
  return (
    <div
      className="relative flex w-[200px] flex-col items-center rounded-[28px] px-4 pb-5 pt-8"
      style={{
        background: "linear-gradient(145deg, #7B5CF5 0%, #542BD7 100%)",
        boxShadow: "0 12px 32px rgba(84,43,215,0.28)",
      }}
    >
      <div className="relative">
        {icon}
        {enabled && (
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 3.5L3.5 6L9 1"
                stroke="#07C160"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div
        className="mt-4 text-center text-[20px] font-semibold leading-6 tracking-[-0.02em]"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        {title}
      </div>

      <div
        className="mt-1 text-center text-[13px] font-medium leading-[18px]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {subtitle}
      </div>

      <div className="mt-3">
        <StatusPill label={statusLabel} active />
      </div>

      <div className="mt-4">
        <Switch
          modelValue={enabled}
          onUpdateModelValue={onToggle}
          activeColor="#FFFFFF"
          inactiveColor="rgba(255,255,255,0.3)"
          nodeColor="#FFFFFF"
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Inactive scene card (glass white)                                          */
/* -------------------------------------------------------------------------- */
function InactiveSceneCard({
  icon,
  title,
  subtitle,
  statusLabel,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  statusLabel: string
  enabled: boolean
  onToggle: (val: boolean) => void
}) {
  return (
    <div
      className="relative flex w-[148px] flex-col items-center rounded-[22px] px-3 pb-4 pt-6"
      style={{
        background: "rgba(255,255,255,0.8)",
        boxShadow: "0 6px 20px rgba(26,34,48,0.06)",
      }}
    >
      <div className="relative">
        {icon}
        {enabled && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path
                d="M1 2.5L3 4.5L7 1"
                stroke="#07C160"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div
        className="mt-3 text-center text-[16px] font-medium leading-5 tracking-[-0.01em]"
        style={{ color: "rgba(0,0,0,0.90)" }}
      >
        {title}
      </div>

      <div
        className="mt-0.5 text-center text-[11px] font-medium leading-4"
        style={{ color: "rgba(0,0,0,0.40)" }}
      >
        {subtitle}
      </div>

      <div className="mt-2">
        <StatusPill label={statusLabel} />
      </div>

      <div className="mt-3">
        <Switch
          modelValue={enabled}
          onUpdateModelValue={onToggle}
          activeColor="#542BD7"
          inactiveColor="rgba(0,0,0,0.1)"
          nodeColor="#FFFFFF"
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */
export default function SceneModePage() {
  const [focusEnabled, setFocusEnabled] = useState(true)
  const [dndEnabled, setDndEnabled] = useState(true)
  const [eyeProtectionEnabled, setEyeProtectionEnabled] = useState(true)

  return (
    <div
      className="mx-auto flex min-h-[780px] w-[360px] flex-col"
      style={{ backgroundColor: "#0D0D0D" }}
    >
      {/* Status bar - dark */}
      <StatusBar mode="dark" time="20:42" backgroundColor="#0D0D0D" />

      {/* Title bar - dark */}
      <div className="flex items-center px-4 py-3" style={{ backgroundColor: "#0D0D0D" }}>
        <button
          type="button"
          aria-label="返回"
          className="flex h-10 w-10 items-center justify-center rounded-full"
        >
          <img src={iconChevronBack} alt="" className="h-5 w-5" />
        </button>

        <div className="flex-1 text-center">
          <div
            className="text-[17px] font-semibold leading-6"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            情景模式
          </div>
        </div>

        <button
          type="button"
          aria-label="更多"
          className="flex h-10 w-10 items-center justify-center rounded-full"
        >
          <img src={moreIcon} alt="" className="h-5 w-5" />
        </button>
      </div>

      {/* Subtitle */}
      <div
        className="px-5 text-center text-[13px] font-medium leading-[18px]"
        style={{ color: "rgba(255,255,255,0.45)", backgroundColor: "#0D0D0D" }}
      >
        自动调整系统功能，更专注
      </div>

      {/* Cards */}
      <div
        className="flex flex-1 items-center justify-center gap-3 px-4 py-6"
        style={{ backgroundColor: "#0D0D0D" }}
      >
        {/* Focus card - active */}
        <ActiveSceneCard
          icon={<FocusModeIcon active />}
          title="专注"
          subtitle="专注模式已开启"
          statusLabel="专注模式已开启"
          enabled={focusEnabled}
          onToggle={setFocusEnabled}
        />

        {/* Right column: DND + Eye protection */}
        <div className="flex flex-col gap-3">
          <InactiveSceneCard
            icon={<DoNotDisturbIcon />}
            title="免打扰"
            subtitle="减少打扰保持专注"
            statusLabel="已开启"
            enabled={dndEnabled}
            onToggle={setDndEnabled}
          />
          <InactiveSceneCard
            icon={<EyeProtectionIcon />}
            title="护眼模式"
            subtitle="降低蓝光护眼"
            statusLabel="已开启"
            enabled={eyeProtectionEnabled}
            onToggle={setEyeProtectionEnabled}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center pb-6" style={{ backgroundColor: "#0D0D0D" }}>
        <div className="mb-4 h-1 w-[100px] rounded-full bg-white/20" />
        <div
          className="text-center text-[11px] font-medium leading-4 tracking-wide"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          华为鸿蒙系统
        </div>
        <div
          className="text-center text-[11px] font-medium leading-4 tracking-wide"
          style={{ color: "rgba(255,255,255,0.18)" }}
        >
          HarmonyOS
        </div>
      </div>
    </div>
  )
}
