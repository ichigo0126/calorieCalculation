import { useState } from '@lynx-js/react'
import './NavigationBar.css'

interface NavigationBarProps {
  activeTab: 'home' | 'food' | 'calendar' | 'profile'
  onTabChange: (tab: 'home' | 'food' | 'calendar' | 'profile') => void
}

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const tabs = [
    {
      id: 'home' as const,
      label: 'ホーム',
      icon: '🏠',
      description: 'メイン'
    },
    {
      id: 'food' as const,
      label: '食事',
      icon: '🍽️',
      description: '食品管理'
    },
    {
      id: 'calendar' as const,
      label: 'カレンダー',
      icon: '📅',
      description: '目標・グラフ'
    },
    {
      id: 'profile' as const,
      label: 'プロフィール',
      icon: '👤',
      description: '設定'
    }
  ]

  return (
    <view className="navigation-bar">
      {tabs.map(tab => (
        <view
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'nav-item--active' : ''}`}
          bindtap={() => onTabChange(tab.id)}
        >
          <text className="nav-icon">{tab.icon}</text>
          <text className="nav-label">{tab.label}</text>
        </view>
      ))}
    </view>
  )
}