"use client"

import { useState } from "react"
import { StatusBar } from "@/component/StatusBar"
import { TitleBar } from "@/component/TitleBar"
import { ServiceCard } from "@/component/ServiceCard"
import { ServiceCardItem } from "@/component/ServiceCard/ServiceCardItem"
import { Avatar } from "@/component/Avatar"
import { List, ListItem } from "@/component/List"
import { Switch } from "@/component/Switch"

import iconChevronBack from "../../blocks/assets/pixso-icons/icon-chevron-backward.png"

import {
  Wifi,
  Bluetooth,
  Signal,
  Satellite,
  Monitor,
  Sun,
  Cloud,
  Locate,
  CreditCard,
  FileText,
  HardDrive,
  Smartphone,
  Search,
  ChevronRight,
  Layout,
} from "lucide-react"

function SettingsPageV18() {
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [mobileNetworkEnabled, setMobileNetworkEnabled] = useState(true)
  const [satelliteEnabled, setSatelliteEnabled] = useState(false)
  const [multiDeviceEnabled, setMultiDeviceEnabled] = useState(true)

  // 云空间状态
  const cloudUsed = 45.2
  const cloudTotal = 200
  const cloudPercent = (cloudUsed / cloudTotal) * 100

  return (
    <div className="w-[360px] min-h-[792px] mx-auto bg-gray-100">
      <StatusBar time="09:41" backgroundColor="#f3f4f6" />

      <div className="w-[328px] mx-auto">
        <TitleBar title="设置" leftIcon={iconChevronBack} />
      </div>

      {/* 全局搜索框 */}
      <div className="px-4 mt-1">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="搜索设置"
            className="w-full h-11 pl-11 pr-4 bg-white rounded-[20px] text-sm placeholder:text-gray-400 outline-none border border-gray-200 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="px-4 space-y-3 mt-3">
        {/* 个人账号卡片 */}
        <ServiceCard variant="white">
          <div className="px-3">
            {/* 头像与用户名 */}
            <div className="flex items-center gap-3 py-2">
              <Avatar
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                size={56}
              />
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-gray-900">张三</div>
                <div className="text-sm text-gray-500 mt-0.5">138****8888</div>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          </div>

          {/* 账号管理入口 */}
          <div className="mx-3 mt-1 p-3 bg-gray-50 rounded-[16px]">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex gap-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CreditCard size={16} strokeWidth={1.5} />
                  <span>支付</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <FileText size={16} strokeWidth={1.5} />
                  <span>账单</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <HardDrive size={16} strokeWidth={1.5} />
                  <span>云空间</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>

          {/* 云空间进度条 */}
          <div className="mx-3 mt-2 p-3 bg-gray-50 rounded-[16px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cloud size={18} className="text-blue-500" strokeWidth={1.5} />
                <span className="text-sm font-medium text-gray-900">云空间</span>
              </div>
              <span className="text-sm text-gray-500">
                {cloudUsed} GB / {cloudTotal} GB
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${cloudPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-gray-400">已用 {cloudPercent.toFixed(1)}%</span>
              <span className="text-xs text-blue-500">开通会员</span>
            </div>
          </div>

          {/* 查找设备快捷入口 */}
          <div className="mx-3 mt-2 p-3 bg-gray-50 rounded-[16px]">
            <div className="flex items-center gap-3">
              <Locate size={18} className="text-orange-500" strokeWidth={1.5} />
              <span className="flex-1 text-sm font-medium text-gray-900">查找设备</span>
              <span className="text-xs text-gray-400">定位我的设备</span>
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </div>
        </ServiceCard>

        {/* 设备信息卡片 */}
        <ServiceCard variant="white">
          <ServiceCardItem
            icon={<Smartphone size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
            title="当前设备"
            subtitle="Mate 70 Pro"
            border={false}
          />
        </ServiceCard>

        {/* 网络与连接分组 */}
        <div className="pt-1">
          <div className="px-1 mb-2">
            <span className="text-xs text-gray-500 font-medium">网络与连接</span>
          </div>
          <List className="rounded-[20px]">
            <ListItem
              left={<Wifi size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium">WLAN</span>}
              right={
                wifiEnabled ? (
                  <span className="text-sm text-green-600">已连接</span>
                ) : (
                  <Switch
                    modelValue={wifiEnabled}
                    onUpdateModelValue={setWifiEnabled}
                  />
                )
              }
              showArrow={false}
            />
            <ListItem
              left={<Bluetooth size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium">蓝牙</span>}
              right={
                bluetoothEnabled ? (
                  <span className="text-sm text-green-600">已开启</span>
                ) : (
                  <Switch
                    modelValue={bluetoothEnabled}
                    onUpdateModelValue={setBluetoothEnabled}
                  />
                )
              }
              showArrow={false}
            />
            <ListItem
              left={<Signal size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium">移动网络</span>}
              right={
                mobileNetworkEnabled ? (
                  <span className="text-sm text-green-600">5G 已连接</span>
                ) : (
                  <Switch
                    modelValue={mobileNetworkEnabled}
                    onUpdateModelValue={setMobileNetworkEnabled}
                  />
                )
              }
              showArrow={false}
            />
            <ListItem
              left={<Satellite size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium">卫星网络</span>}
              right={
                satelliteEnabled ? (
                  <span className="text-sm text-green-600">已开启</span>
                ) : (
                  <Switch
                    modelValue={satelliteEnabled}
                    onUpdateModelValue={setSatelliteEnabled}
                  />
                )
              }
              showArrow={false}
            />
            <ListItem
              left={<Monitor size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium">多设备协同</span>}
              right={
                multiDeviceEnabled ? (
                  <span className="text-sm text-green-600">3 台设备</span>
                ) : (
                  <Switch
                    modelValue={multiDeviceEnabled}
                    onUpdateModelValue={setMultiDeviceEnabled}
                  />
                )
              }
              showArrow={false}
              border={false}
            />
          </List>
        </div>

        {/* 外观与显示分组 */}
        <div className="pt-1">
          <div className="px-1 mb-2">
            <span className="text-xs text-gray-500 font-medium">外观与显示</span>
          </div>
          <List className="rounded-[20px]">
            <ListItem
              left={<Layout size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium">桌面和个性化</span>}
              right={
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">默认</span>
                  <img src={iconChevronBack} alt="" className="w-2 h-4 rotate-180" />
                </div>
              }
              showArrow={false}
            />
            <ListItem
              left={<Sun size={22} color="rgba(0, 0, 0, 0.9)" strokeWidth={1.5} />}
              title={<span className="font-medium">显示和亮度</span>}
              right={
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">中等</span>
                  <img src={iconChevronBack} alt="" className="w-2 h-4 rotate-180" />
                </div>
              }
              showArrow={false}
              border={false}
            />
          </List>
        </div>
      </div>

      {/* 底部指示条 */}
      <div className="h-7 flex justify-center mt-4 mb-2">
        <div className="w-28 h-1.5 rounded-full bg-gray-300"></div>
      </div>
    </div>
  )
}

export default SettingsPageV18
