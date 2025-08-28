import { useState, useCallback, useEffect } from '@lynx-js/react';

interface DayData {
  date: string;
  calories: number;
  target: number;
  achieved: boolean;
}

interface CalendarScreenProps {
  onRender?: () => void;
}

export function CalendarScreen({ onRender }: CalendarScreenProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dailyTarget, setDailyTarget] = useState(2000);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempTarget, setTempTarget] = useState('2000');

  // サンプルデータ
  const [monthlyData] = useState<DayData[]>([
    { date: '2024-01-01', calories: 1850, target: 2000, achieved: false },
    { date: '2024-01-02', calories: 2100, target: 2000, achieved: true },
    { date: '2024-01-03', calories: 1900, target: 2000, achieved: false },
    { date: '2024-01-04', calories: 2050, target: 2000, achieved: true },
    { date: '2024-01-05', calories: 1750, target: 2000, achieved: false },
  ]);

  useEffect(() => {
    onRender?.();
  }, [onRender]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // 前月の日付で埋める
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 当月の日付
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const getDayData = (day: number) => {
    const dateStr = formatDate(day);
    return monthlyData.find(data => data.date === dateStr);
  };

  const handleDayPress = useCallback((day: number | null) => {
    'background only';
    if (day) {
      const dateStr = formatDate(day);
      setSelectedDate(dateStr);
    }
  }, [currentDate]);

  const handlePreviousMonth = useCallback(() => {
    'background only';
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    'background only';
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleGoalPress = useCallback(() => {
    'background only';
    setTempTarget(dailyTarget.toString());
    setShowGoalModal(true);
  }, [dailyTarget]);

  const handleSaveGoal = useCallback(() => {
    'background only';
    const newTarget = parseInt(tempTarget);
    if (newTarget > 0) {
      setDailyTarget(newTarget);
    }
    setShowGoalModal(false);
  }, [tempTarget]);

  const handleCloseGoalModal = useCallback(() => {
    'background only';
    setShowGoalModal(false);
  }, []);

  const days = getDaysInMonth(currentDate);
  const selectedDayData = selectedDate ? monthlyData.find(data => data.date === selectedDate) : null;
  const monthName = currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

  // 今月の統計
  const thisMonthData = monthlyData.filter(data => data.date.startsWith(currentDate.toISOString().slice(0, 7)));
  const achievedDays = thisMonthData.filter(data => data.achieved).length;
  const totalDays = thisMonthData.length;
  const averageCalories = thisMonthData.length > 0 
    ? Math.round(thisMonthData.reduce((sum, data) => sum + data.calories, 0) / thisMonthData.length)
    : 0;

  return (
    <view className="calendar-screen">
      {/* ヘッダー */}
      <view className="calendar-header">
        <view className="month-navigation">
          <view className="nav-button" bindtap={handlePreviousMonth}>
            <text className="nav-text">←</text>
          </view>
          <text className="month-title">{monthName}</text>
          <view className="nav-button" bindtap={handleNextMonth}>
            <text className="nav-text">→</text>
          </view>
        </view>
      </view>

      {/* 目標設定 */}
      <view className="goal-section">
        <view className="goal-card" bindtap={handleGoalPress}>
          <text className="goal-label">日別目標カロリー</text>
          <text className="goal-value">{dailyTarget}kcal</text>
          <text className="goal-hint">タップして変更</text>
        </view>
      </view>

      {/* 月間統計 */}
      <view className="stats-section">
        <view className="stats-grid">
          <view className="stat-item">
            <text className="stat-value">{achievedDays}/{totalDays}</text>
            <text className="stat-label">目標達成日</text>
          </view>
          <view className="stat-item">
            <text className="stat-value">{averageCalories}</text>
            <text className="stat-label">平均摂取</text>
          </view>
        </view>
      </view>

      {/* カレンダー */}
      <view className="calendar-grid">
        <view className="weekdays">
          {['日', '月', '火', '水', '木', '金', '土'].map(weekday => (
            <text key={weekday} className="weekday">{weekday}</text>
          ))}
        </view>
        
        <view className="calendar-days">
          {days.map((day, index) => {
            const dayData = day ? getDayData(day) : null;
            const isSelected = day && selectedDate === formatDate(day);
            
            return (
              <view
                key={index}
                className={`calendar-day ${day ? 'calendar-day-active' : ''} ${isSelected ? 'calendar-day-selected' : ''}`}
                bindtap={() => handleDayPress(day)}
              >
                {day && (
                  <>
                    <text className="day-number">{day}</text>
                    {dayData && (
                      <view className={`day-indicator ${dayData.achieved ? 'achieved' : 'not-achieved'}`} />
                    )}
                  </>
                )}
              </view>
            );
          })}
        </view>
      </view>

      {/* 選択日の詳細 */}
      {selectedDayData && (
        <view className="day-detail">
          <text className="detail-title">
            {new Date(selectedDate!).toLocaleDateString('ja-JP')}の詳細
          </text>
          <view className="detail-stats">
            <view className="detail-item">
              <text className="detail-label">摂取カロリー</text>
              <text className="detail-value">{selectedDayData.calories}kcal</text>
            </view>
            <view className="detail-item">
              <text className="detail-label">目標</text>
              <text className="detail-value">{selectedDayData.target}kcal</text>
            </view>
            <view className="detail-item">
              <text className="detail-label">達成状況</text>
              <text className={`detail-status ${selectedDayData.achieved ? 'achieved' : 'not-achieved'}`}>
                {selectedDayData.achieved ? '達成' : '未達成'}
              </text>
            </view>
          </view>
        </view>
      )}

      {/* 目標設定モーダル */}
      {showGoalModal && (
        <view className="modal-overlay">
          <view className="modal-content">
            <text className="modal-title">日別目標カロリー設定</text>
            <view className="goal-input-section">
              <text className="input-label">目標カロリー (kcal)</text>
              <text 
                className="goal-input"
                bindtap={() => {
                  const newTarget = prompt('目標カロリーを入力してください', tempTarget) || tempTarget;
                  setTempTarget(newTarget);
                }}
              >
                {tempTarget || '2000'}
              </text>
            </view>
            
            <view className="modal-buttons">
              <view className="modal-button cancel" bindtap={handleCloseGoalModal}>
                <text className="modal-button-text">キャンセル</text>
              </view>
              <view className="modal-button confirm" bindtap={handleSaveGoal}>
                <text className="modal-button-text">保存</text>
              </view>
            </view>
          </view>
        </view>
      )}
    </view>
  );
}