import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Avatar } from "./component/Avatar"
import { List, ListItem } from "./component/List"
import { StatusBar } from "./component/StatusBar"
import { Switch } from "./component/Switch"
import { TitleBar } from "./component/TitleBar"
import {
  Bell,
  Globe,
  LockKeyhole,
  Moon,
  Palette,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react"
import "./settings-app.css"

type AppearanceMode = "light" | "dark"

function IconTile({
  children,
  accent = "default",
}: {
  children: ReactNode
  accent?: "default" | "warm" | "dark"
}) {
  return (
    <div className={`settings-app__icon-tile settings-app__icon-tile--${accent}`}>
      {children}
    </div>
  )
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="settings-app__section-intro">
      <div className="settings-app__section-eyebrow">{eyebrow}</div>
      <div className="settings-app__section-title">{title}</div>
      <div className="settings-app__section-description">{description}</div>
    </div>
  )
}

function ModePreview({
  active,
  mode,
  title,
  detail,
  onClick,
}: {
  active: boolean
  mode: AppearanceMode
  title: string
  detail: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`settings-app__mode-card ${active ? "is-active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <div className={`settings-app__mode-preview settings-app__mode-preview--${mode}`}>
        <div className="settings-app__mode-preview-bar" />
        <div className="settings-app__mode-preview-panel" />
        <div className="settings-app__mode-preview-row" />
        <div className="settings-app__mode-preview-row settings-app__mode-preview-row--short" />
      </div>
      <div className="settings-app__mode-meta">
        <div className="settings-app__mode-title">
          {mode === "light" ? <Sun size={16} /> : <Moon size={16} />}
          <span>{title}</span>
        </div>
        <div className="settings-app__mode-detail">{detail}</div>
      </div>
    </button>
  )
}

function SettingsApp() {
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>("dark")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(true)
  const [focusProtectionEnabled, setFocusProtectionEnabled] = useState(false)

  return (
    <div className="settings-app">
      <div className="settings-app__phone">
        <StatusBar time="09:41" backgroundColor="#f3f4f6" />
        <div className="settings-app__titlebar">
          <TitleBar title="设置" subtitle="" backgroundColor="#f3f4f6" />
        </div>

        <div className="settings-app__content">
          <section className="settings-app__spotlight">
            <div className="settings-app__spotlight-copy">
              <div className="settings-app__spotlight-badge">
                <Sparkles size={14} />
                <span>标杆入口</span>
              </div>
              <h2>把显示模式直接做成可感知的入口层</h2>
              <p>
                用真实的深浅模式缩略预览来承接视觉重心，再把常用偏好压缩成结构清晰的设置卡片。
              </p>
            </div>

            <div className="settings-app__mode-grid">
              <ModePreview
                active={appearanceMode === "light"}
                mode="light"
                title="浅色模式"
                detail="白天阅读更轻盈"
                onClick={() => setAppearanceMode("light")}
              />
              <ModePreview
                active={appearanceMode === "dark"}
                mode="dark"
                title="深色模式"
                detail="夜间浏览更聚焦"
                onClick={() => setAppearanceMode("dark")}
              />
            </div>

            <div className="settings-app__spotlight-summary">
              <div className="settings-app__summary-item">
                <span className="settings-app__summary-label">当前策略</span>
                <span className="settings-app__summary-value">
                  {appearanceMode === "dark" ? "日落后自动切换" : "始终保持浅色"}
                </span>
              </div>
              <div className="settings-app__summary-divider" />
              <div className="settings-app__summary-item">
                <span className="settings-app__summary-label">视觉重心</span>
                <span className="settings-app__summary-value">先模式，再偏好，再系统</span>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <SectionIntro
              eyebrow="个人与设备"
              title="先把高频入口放到第一张卡"
              description="账号、显示与个性化归在同一层，用户一进来就能定位到最常用的设置。"
            />
            <List className="settings-section__list">
              <ListItem
                border={true}
                left={
                  <Avatar size={48}>
                    <div className="settings-app__avatar-fallback">R</div>
                  </Avatar>
                }
                title="Ren Yuqing"
                subtitle="Mate 70 Pro · 云空间已同步"
                rightText="管理"
                showArrow={true}
              />
              <ListItem
                border={true}
                left={
                  <IconTile accent={appearanceMode === "dark" ? "dark" : "warm"}>
                    {appearanceMode === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                  </IconTile>
                }
                title="显示与亮度"
                subtitle="直接预览当前显示模式"
                rightText={appearanceMode === "dark" ? "深色" : "浅色"}
                showArrow={true}
              />
              <ListItem
                border={false}
                left={
                  <IconTile accent="default">
                    <Palette size={20} />
                  </IconTile>
                }
                title="壁纸与个性化"
                subtitle="主题、图标与桌面布局"
                rightText="2 项已自定义"
                showArrow={true}
              />
            </List>
          </section>

          <section className="settings-section">
            <SectionIntro
              eyebrow="常用偏好"
              title="用摘要和开关做第二层决策"
              description="减少“点进去才知道状态”的情况，让大部分判断在列表层就能完成。"
            />
            <List className="settings-section__list">
              <ListItem
                border={true}
                left={
                  <IconTile accent="default">
                    <Globe size={20} />
                  </IconTile>
                }
                title="语言与地区"
                subtitle="主语言、日历和数字格式"
                rightText="简体中文"
                showArrow={true}
              />
              <ListItem
                border={true}
                left={
                  <IconTile accent="default">
                    <Bell size={20} />
                  </IconTile>
                }
                title="通知摘要"
                subtitle="应用通知合并与横幅策略"
                right={
                  <Switch
                    modelValue={notificationsEnabled}
                    onUpdateModelValue={setNotificationsEnabled}
                  />
                }
                showArrow={false}
              />
              <ListItem
                border={false}
                left={
                  <IconTile accent="default">
                    <RefreshCw size={20} />
                  </IconTile>
                }
                title="云同步"
                subtitle="照片、密码与设置自动备份"
                right={
                  <Switch
                    modelValue={cloudSyncEnabled}
                    onUpdateModelValue={setCloudSyncEnabled}
                  />
                }
                showArrow={false}
              />
            </List>
          </section>

          <section className="settings-section">
            <SectionIntro
              eyebrow="安全与更新"
              title="把次高频但重要的能力放在收尾区"
              description="保留完整性，但不让它们抢走顶部模式入口的视觉焦点。"
            />
            <List className="settings-section__list">
              <ListItem
                border={true}
                left={
                  <IconTile accent="default">
                    <ShieldCheck size={20} />
                  </IconTile>
                }
                title="专注保护"
                subtitle="会议和夜间时段自动静默"
                right={
                  <Switch
                    modelValue={focusProtectionEnabled}
                    onUpdateModelValue={setFocusProtectionEnabled}
                  />
                }
                showArrow={false}
              />
              <ListItem
                border={true}
                left={
                  <IconTile accent="default">
                    <LockKeyhole size={20} />
                  </IconTile>
                }
                title="隐私与权限"
                subtitle="定位、相机和剪贴板访问"
                rightText="3 项最近调整"
                showArrow={true}
              />
              <ListItem
                border={false}
                left={
                  <IconTile accent="default">
                    <RefreshCw size={20} />
                  </IconTile>
                }
                title="系统更新"
                subtitle="补丁、版本与优化计划"
                rightText="已是最新"
                showArrow={true}
              />
            </List>
          </section>

          <div className="settings-footer">
            <span className="settings-footer__version">
              Benchmark entry v2 · neutral hierarchy, lightweight surface
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: "Playground/SettingsApp",
  component: SettingsApp,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SettingsApp>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
