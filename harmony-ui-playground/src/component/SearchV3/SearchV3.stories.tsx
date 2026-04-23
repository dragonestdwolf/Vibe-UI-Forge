import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { SearchV3 } from "./SearchV3"
import type { SearchV3State } from "./SearchV3"

const meta = {
  title: "Components/SearchV3",
  component: SearchV3,
  tags: ["autodocs"],
  args: {
    placeholder: "Search",
    variant: "primary",
    mode: "off",
    disabled: false,
    clearable: true,
    showVoice: true,
    actionText: "Search",
    showBack: true,
    showScan: true,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description:
        "primary = harmony-search-primary（一级页面）；secondary = harmony-search-second（二级页面）",
    },
    mode: {
      control: "select",
      options: ["off", "on"],
      description:
        "仅 primary 有效。off = Search=OFF（全宽，无操作区）；on = Search=ON（右侧带语音+搜索按钮）",
    },
    state: {
      control: "select",
      options: [
        undefined,
        "normal",
        "hover",
        "press",
        "focus",
        "focus-field",
        "actived",
        "output",
        "disabled",
        "icon-hover",
        "icon-focus",
        "icon-press",
      ] satisfies (SearchV3State | undefined)[],
      description: "覆盖视觉状态（不传则由内部交互自动计算）",
    },
  },
} satisfies Meta<typeof SearchV3>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================
// Playground
// ============================================================

/** 交互式演示，可通过 Controls 面板切换所有 props */
export const Playground: Story = {}

// ============================================================
// Primary — Search=OFF 全状态（spec §2.1 上半）
// ============================================================

/**
 * harmony-search-primary Search=OFF 全状态矩阵
 * 对应 spec §2.1 + benchmark SECTION 1 上半
 */
export const PrimaryOff_AllStates: Story = {
  name: "Primary OFF — 全状态矩阵",
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["Normal（fill rgba(0,0,0,0.047)）", "normal", ""],
          ["Hover（fill rgba(0,0,0,0.08)）", "hover", ""],
          ["Press（fill rgba(0,0,0,0.12)）", "press", ""],
          ["Focus（pill 整体 inset 2px brand）", "focus", ""],
          ["Actived（comp_background_tertiary，光标出现）", "actived", ""],
          ["Typing（有值 + 清除按钮）", "actived", "Music"],
          ["Output（有值未聚焦，无额外 class）", "normal", "Music"],
          ["Disabled（opacity 0.4）", "disabled", ""],
        ] as [string, SearchV3State, string][]
      ).map(([label, state, val]) => (
        <div key={`${state}-${val}`}>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <SearchV3
            {...args}
            variant="primary"
            mode="off"
            state={state}
            defaultValue={val || undefined}
          />
        </div>
      ))}
    </div>
  ),
}

// ============================================================
// Primary — Search=ON 全状态（spec §2.1 下半）
// ============================================================

/**
 * harmony-search-primary Search=ON 全状态矩阵
 * 右侧操作区：voice(32×32) + divider(1×12) + btn(min-68×32)
 * 对应 spec §2.1 + benchmark SECTION 1 下半
 */
export const PrimaryOn_AllStates: Story = {
  name: "Primary ON — 全状态矩阵（语音+搜索按钮）",
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["Normal", "normal", ""],
          ["Hover（pill 加深）", "hover", ""],
          ["Press（pill 压暗）", "press", ""],
          ["Focus（Search 按钮 inset 2px brand）", "focus", ""],
          ["Actived（field 背景变 tertiary）", "actived", ""],
          ["Typing（有值 + 光标 + 清除）", "actived", "Music"],
          ["Output（有值，btn 获 surface 背景）", "output", "Music"],
          ["icon-hover（语音按钮背景加深）", "icon-hover", ""],
          ["icon-focus（语音按钮 inset 2px brand）", "icon-focus", ""],
          ["icon-press（语音按钮压暗）", "icon-press", ""],
          ["Disabled", "disabled", ""],
        ] as [string, SearchV3State, string][]
      ).map(([label, state, val]) => (
        <div key={`${state}-${val}`}>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <SearchV3
            {...args}
            variant="primary"
            mode="on"
            state={state}
            defaultValue={val || undefined}
          />
        </div>
      ))}
    </div>
  ),
}

// ============================================================
// Primary OFF vs ON 对比
// ============================================================

/**
 * Search=OFF（全宽 pill）和 Search=ON（带操作区）直观对比
 */
export const PrimaryModeComparison: Story = {
  name: "Primary — OFF vs ON 模式对比",
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          Search=OFF — 全宽 pill（无右侧操作区）
        </p>
        <SearchV3 {...args} variant="primary" mode="off" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          Search=ON — 右侧带 [语音 | 搜索] 操作区（action slot ≈109px）
        </p>
        <SearchV3 {...args} variant="primary" mode="on" actionText="Search" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          Search=ON + 有值（Output 状态，btn 获 surface 背景）
        </p>
        <SearchV3 {...args} variant="primary" mode="on" defaultValue="Music" state="output" />
      </div>
    </div>
  ),
}

// ============================================================
// Secondary — 全状态矩阵（spec §2.2）
// ============================================================

/**
 * harmony-search-second 全状态矩阵
 * 结构：[返回 40×40] + [搜索栏 flex:1] + [扫码 40×40]
 * 对应 spec §2.2 + benchmark SECTION 2
 */
export const Secondary_AllStates: Story = {
  name: "Secondary — 全状态矩阵",
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["Normal（两侧按钮 + field fill rgba(0,0,0,0.047)）", "normal", ""],
          ["Hover（两侧 + field 均加深）", "hover", ""],
          ["Press（返回按钮压暗）", "press", ""],
          ["Focus — back button（返回按钮 inset 2px brand）", "focus", ""],
          ["Focus — field（field inset 2px brand）", "focus-field", ""],
          ["Actived（field bg tertiary，光标出现）", "actived", ""],
          ["Typing（is-actived + 有值 + 清除）", "actived", "Music"],
          ["Output（有值未聚焦，无 class 变化）", "normal", "Music"],
          ["icon-hover（扫码按钮背景加深）", "icon-hover", ""],
          ["icon-focus（扫码按钮 inset 2px brand）", "icon-focus", ""],
          ["icon-press（扫码按钮压暗）", "icon-press", ""],
          ["Disabled（opacity 0.4）", "disabled", ""],
        ] as [string, SearchV3State, string][]
      ).map(([label, state, val]) => (
        <div key={`${state}-${val}`}>
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <SearchV3
            {...args}
            variant="secondary"
            state={state}
            defaultValue={val || undefined}
          />
        </div>
      ))}
    </div>
  ),
}

// ============================================================
// Secondary — 布局变体
// ============================================================

/** showBack / showScan 控制两侧按钮的显示 */
export const Secondary_Layout: Story = {
  name: "Secondary — 布局变体（侧边按钮控制）",
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 mb-1">完整（返回 + 搜索栏 + 扫码）</p>
        <SearchV3 {...args} variant="secondary" showBack showScan />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">隐藏扫码</p>
        <SearchV3 {...args} variant="secondary" showBack showScan={false} />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">隐藏返回</p>
        <SearchV3 {...args} variant="secondary" showBack={false} showScan />
      </div>
    </div>
  ),
}

// ============================================================
// 两种变体并排对比
// ============================================================

/** primary（一级页面）vs secondary（二级页面）并排 */
export const VariantComparison: Story = {
  name: "Variant Comparison — primary vs secondary",
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          harmony-search-primary（Search=OFF）
        </p>
        <SearchV3 {...args} variant="primary" mode="off" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          harmony-search-primary（Search=ON）
        </p>
        <SearchV3 {...args} variant="primary" mode="on" actionText="Search" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          harmony-search-second（二级页面）
        </p>
        <SearchV3 {...args} variant="secondary" />
      </div>
    </div>
  ),
}

// ============================================================
// 受控模式
// ============================================================

/** 受控模式：value + onChange + onSearch，事件日志实时显示 */
export const Controlled: Story = {
  name: "Controlled — 受控模式",
  render: (args) => {
    const [value, setValue] = useState("")
    const [log, setLog] = useState<string[]>([])
    const push = (msg: string) => setLog((p) => [msg, ...p].slice(0, 6))

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-400">Primary ON（受控）</p>
          <SearchV3
            {...args}
            variant="primary"
            mode="on"
            value={value}
            onChange={(v) => { setValue(v); push(`onChange: "${v}"`) }}
            onSearch={(v) => push(`onSearch: "${v}"`)}
            onClear={() => push("onClear")}
            onVoice={() => push("onVoice")}
            actionText="Search"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-400">Secondary（受控）</p>
          <SearchV3
            {...args}
            variant="secondary"
            value={value}
            onChange={(v) => { setValue(v); push(`onChange: "${v}"`) }}
            onSearch={(v) => push(`onSearch: "${v}"`)}
            onBack={() => push("onBack")}
            onScan={() => push("onScan")}
          />
        </div>
        <div className="text-sm space-y-1">
          <p className="text-gray-500">
            当前值：<span className="font-mono">{value || "(空)"}</span>
          </p>
          {log.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">事件日志：</p>
              {log.map((e, i) => (
                <p key={i} className="text-xs font-mono text-gray-600">{e}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
}
