import { useState, useEffect } from '@lynx-js/react';

interface HomeScreenProps {
  onRender?: () => void;
}

export function HomeScreen({ onRender }: HomeScreenProps) {
  const [steps, setSteps] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [targetCalories] = useState(2000);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    // シミュレートされた歩数データ（実際の実装では歩数計APIを使用）
    const simulateSteps = () => {
      const randomSteps = Math.floor(Math.random() * 1000) + 5000;
      setSteps(randomSteps);
      setBurnedCalories(Math.floor(randomSteps * 0.04)); // 1歩あたり約0.04kcal
    };

    // 時計の更新
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    simulateSteps();
    const timeInterval = setInterval(updateTime, 1000);
    const stepsInterval = setInterval(simulateSteps, 5000);

    onRender?.();

    return () => {
      clearInterval(timeInterval);
      clearInterval(stepsInterval);
    };
  }, [onRender]);

  const remainingCalories = targetCalories - consumedCalories;
  const calorieBalance = consumedCalories - burnedCalories;

  return (
    <view className="home-screen">
      <view className="header">
        <text className="current-time">{currentTime}</text>
        <text className="date">{new Date().toLocaleDateString('ja-JP')}</text>
      </view>

      {/* リアルタイム活動データ */}
      <view className="activity-section">
        <text className="section-title">今日の活動</text>
        <view className="activity-cards">
          <view className="activity-card">
            <text className="activity-icon">👟</text>
            <text className="activity-value">{steps.toLocaleString()}</text>
            <text className="activity-label">歩数</text>
          </view>
          <view className="activity-card">
            <text className="activity-icon">🔥</text>
            <text className="activity-value">{burnedCalories}</text>
            <text className="activity-label">消費カロリー</text>
          </view>
        </view>
      </view>

      {/* カロリー管理 */}
      <view className="calories-section">
        <text className="section-title">カロリー管理</text>
        <view className="calories-summary">
          <view className="calorie-item consumed">
            <text className="calorie-icon">🍽️</text>
            <text className="calorie-value">{consumedCalories}</text>
            <text className="calorie-label">摂取</text>
          </view>
          <view className="calorie-item remaining">
            <text className="calorie-icon">🎯</text>
            <text className="calorie-value">{remainingCalories}</text>
            <text className="calorie-label">残り</text>
          </view>
          <view className="calorie-item target">
            <text className="calorie-icon">📊</text>
            <text className="calorie-value">{targetCalories}</text>
            <text className="calorie-label">目標</text>
          </view>
        </view>
      </view>

      {/* カロリー収支サマリー */}
      <view className="balance-section">
        <text className="section-title">今日の収支</text>
        <view className="balance-card">
          <view className="balance-item">
            <text className="balance-label">摂取カロリー</text>
            <text className="balance-value positive">+{consumedCalories}</text>
          </view>
          <view className="balance-item">
            <text className="balance-label">消費カロリー</text>
            <text className="balance-value negative">-{burnedCalories}</text>
          </view>
          <view className="balance-divider" />
          <view className="balance-item total">
            <text className="balance-label">収支</text>
            <text className={`balance-value ${calorieBalance > 0 ? 'positive' : 'negative'}`}>
              {calorieBalance > 0 ? '+' : ''}{calorieBalance}
            </text>
          </view>
        </view>
      </view>

      {/* 進捗バー */}
      <view className="progress-section">
        <text className="section-title">目標達成度</text>
        <view className="progress-bar">
          <view 
            className="progress-fill" 
            style={{ 
              width: `${Math.min((consumedCalories / targetCalories) * 100, 100)}%` 
            }} 
          />
        </view>
        <text className="progress-text">
          {Math.round((consumedCalories / targetCalories) * 100)}% 達成
        </text>
      </view>
    </view>
  );
}