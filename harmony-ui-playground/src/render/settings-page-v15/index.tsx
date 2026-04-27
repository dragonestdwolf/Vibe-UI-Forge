"use client"

import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"
import { Button } from "@/component/Button"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

import {
  User,
  Baby,
  Bell,
  Settings,
  Sun,
  Eye,
  Info,
  RefreshCw,
  LogOut,
} from "lucide-react"

function SettingsPageV15() {
  const [youthModeEnabled, setYouthModeEnabled] = useState(false)
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

  return (
    <div className="w-[360px] min-h-[792px] mx-auto bg-comp-background-gray">
      <StatusBar time="09:41" backgroundColor="#F1F3F5" />

      <div className="w-[328px] mx-auto">
        <TitleBar title="设置" leftIcon={iconChevronBack} />
      </div>

      <div className="px-4">
        {/* 账号与安全 */}
        <List className="rounded-[20px] mt-2">
          <ListItem
            left={<User size={24} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium">账号与安全</span>}
            right={
              <div className="flex items-center gap-1">
                <span className="text-gray-500 opacity-60">已登录</span>
                <img src={iconChevronBack} alt="" className="w-2 h-4 rotate-180" />
              </div>
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 青少年模式 */}
        <List className="rounded-[20px] mt-3">
          <ListItem
            left={<Baby size={24} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium">青少年模式</span>}
            right={
              <Switch
                modelValue={youthModeEnabled}
                onUpdateModelValue={setYouthModeEnabled}
              />
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 通知设置 */}
        <List className="rounded-[20px] mt-3">
          <ListItem
            left={<Bell size={24} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium">通知设置</span>}
            right={
              <Switch
                modelValue={notificationEnabled}
                onUpdateModelValue={setNotificationEnabled}
              />
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 通用 */}
        <List className="rounded-[20px] mt-3">
          <ListItem
            left={<Settings size={24} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium">通用</span>}
            right={
              <div className="flex items-center gap-1">
                <img src={iconChevronBack} alt="" className="w-2 h-4 rotate-180" />
              </div>
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 显示与亮度 */}
        <List className="rounded-[20px] mt-3">
          <ListItem
            left={<Sun size={24} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium">显示与亮度</span>}
            right={
              <Switch
                modelValue={darkModeEnabled}
                onUpdateModelValue={setDarkModeEnabled}
              />
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 隐私管理 */}
        <List className="rounded-[20px] mt-3">
          <ListItem
            left={<Eye size={24} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium">隐私管理</span>}
            right={
              <div className="flex items-center gap-1">
                <img src={iconChevronBack} alt="" className="w-2 h-4 rotate-180" />
              </div>
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 关于系统 */}
        <List className="rounded-[20px] mt-3">
          <ListItem
            left={<Info size={24} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium">关于系统</span>}
            right={
              <div className="flex items-center gap-1">
                <span className="text-gray-500 opacity-60">v2.5.0</span>
                <img src={iconChevronBack} alt="" className="w-2 h-4 rotate-180" />
              </div>
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 检查更新 */}
        <List className="rounded-[20px] mt-3">
          <ListItem
            left={<RefreshCw size={24} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title={<span className="font-medium">检查更新</span>}
            right={
              <div className="flex items-center gap-1">
                <span style={{ color: "#0a59f7" }}>已是最新版本</span>
                <img src={iconChevronBack} alt="" className="w-2 h-4 rotate-180" />
              </div>
            }
            showArrow={false}
            border={false}
          />
        </List>

        {/* 退出登录 */}
        <div className="mt-6 mb-4">
          <Button
            type="default"
            block
            className="h-14 rounded-[20px] text-base font-medium bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
            style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
          >
            <span className="flex items-center justify-center gap-2 w-full h-full">
              <LogOut size={20} />
              <span>退出登录</span>
            </span>
          </Button>
        </div>
      </div>

      <div className="h-7 flex justify-center mt-2">
        <div className="w-28 h-1.5 rounded-full bg-gray-300"></div>
      </div>
    </div>
  )
}

export default SettingsPageV15
