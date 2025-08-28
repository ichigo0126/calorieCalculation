import { useState, useCallback } from '@lynx-js/react';
import { HomeScreen } from './screens/HomeScreen.js';
import { FoodScreen } from './screens/FoodScreen.js';
import { CalendarScreen } from './screens/CalendarScreen.js';
import { ProfileScreen } from './screens/ProfileScreen.js';

interface TabNavigationProps {
  onRender?: () => void;
}

export function TabNavigation({ onRender }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: 'ホーム', icon: '🏠' },
    { id: 1, label: '食事', icon: '🍽️' },
    { id: 2, label: 'カレンダー', icon: '📅' },
    { id: 3, label: 'プロフィール', icon: '👤' },
  ];

  const handleTabPress = useCallback((tabId: number) => {
    'background only';
    setActiveTab(tabId);
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 0:
        return <HomeScreen onRender={onRender} />;
      case 1:
        return <FoodScreen onRender={onRender} />;
      case 2:
        return <CalendarScreen onRender={onRender} />;
      case 3:
        return <ProfileScreen onRender={onRender} />;
      default:
        return <HomeScreen onRender={onRender} />;
    }
  };

  return (
    <view className="tab-container">
      <view className="screen-content">
        {renderScreen()}
      </view>
      
      <view className="tab-bar">
        {tabs.map((tab) => (
          <view
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'tab-item-active' : ''}`}
            bindtap={() => handleTabPress(tab.id)}
          >
            <text className="tab-icon">{tab.icon}</text>
            <text className="tab-label">{tab.label}</text>
          </view>
        ))}
      </view>
    </view>
  );
}