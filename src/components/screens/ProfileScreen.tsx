import { useState, useCallback, useEffect } from '@lynx-js/react';
import { useAuth } from '../../contexts/AuthContext.js';
import { InputField } from '../common/InputField.js';

interface ProfileScreenProps {
  onRender?: () => void;
}

export function ProfileScreen({ onRender }: ProfileScreenProps) {
  const { user, userProfile, logout, saveUserProfile } = useAuth();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState({
    height: userProfile?.height || '',
    weight: userProfile?.weight || '',
    age: userProfile?.age || '',
    gender: userProfile?.gender || '',
    activityLevel: userProfile?.activityLevel || ''
  });

  // userProfileが更新されたときに編集中プロフィールも更新
  useEffect(() => {
    if (userProfile) {
      setEditingProfile({
        height: userProfile.height,
        weight: userProfile.weight,
        age: userProfile.age,
        gender: userProfile.gender,
        activityLevel: userProfile.activityLevel
      });
    }
  }, [userProfile]);

  onRender?.();

  // BMI計算
  const calculateBMI = () => {
    if (!userProfile?.height || !userProfile?.weight) return '---';
    const heightInM = parseFloat(userProfile.height) / 100;
    const weight = parseFloat(userProfile.weight);
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  // 基礎代謝計算（Harris-Benedict式）
  const calculateBMR = () => {
    if (!userProfile?.height || !userProfile?.weight || !userProfile?.age || !userProfile?.gender) return 0;
    const height = parseFloat(userProfile.height);
    const weight = parseFloat(userProfile.weight);
    const age = parseFloat(userProfile.age);
    
    if (userProfile.gender === 'male') {
      return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
    } else {
      return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
    }
  };

  // 推奨カロリー計算
  const calculateRecommendedCalories = () => {
    const bmr = calculateBMR();
    if (bmr === 0 || !userProfile?.activityLevel) return 0;
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.9
    };
    return Math.round(bmr * (activityMultipliers[userProfile.activityLevel as keyof typeof activityMultipliers] || 1.2));
  };

  const handleEditPress = useCallback(() => {
    'background only';
    setShowEditModal(true);
  }, []);

  const handleSaveProfile = useCallback(async () => {
    'background only';
    try {
      await saveUserProfile(editingProfile);
      setShowEditModal(false);
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
    }
  }, [editingProfile, saveUserProfile]);

  const handleInputChange = useCallback((field: string, value: string) => {
    'background only';
    setEditingProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGenderSelect = useCallback((gender: string) => {
    'background only';
    setEditingProfile(prev => ({ ...prev, gender }));
  }, []);

  const handleActivitySelect = useCallback((activityLevel: string) => {
    'background only';
    setEditingProfile(prev => ({ ...prev, activityLevel }));
  }, []);

  const handleCloseModal = useCallback(() => {
    'background only';
    setShowEditModal(false);
  }, []);

  const handleLogout = useCallback(async () => {
    'background only';
    try {
      await logout();
      console.log('ログアウトが実行されました');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  }, [logout]);

  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const recommendedCalories = calculateRecommendedCalories();

  const getBMIStatus = (bmiValue: string) => {
    const bmiNum = parseFloat(bmiValue);
    if (isNaN(bmiNum)) return { status: '---', color: 'gray' };
    if (bmiNum < 18.5) return { status: '低体重', color: 'blue' };
    if (bmiNum < 25) return { status: '標準', color: 'green' };
    if (bmiNum < 30) return { status: '肥満(1度)', color: 'orange' };
    return { status: '肥満(2度以上)', color: 'red' };
  };

  const bmiStatus = getBMIStatus(bmi);

  return (
    <view className="profile-screen">
      {/* プロフィール情報 */}
      <view className="profile-section">
        <view className="profile-header">
          <view className="avatar">
            <text className="avatar-text">{user?.email?.charAt(0).toUpperCase() || 'U'}</text>
          </view>
          <text className="profile-name">{user?.email || 'ユーザー'}</text>
          <view className="edit-button" bindtap={handleEditPress}>
            <text className="edit-text">編集</text>
          </view>
        </view>

        <view className="profile-details">
          <view className="detail-row">
            <text className="detail-label">メール</text>
            <text className="detail-value">{user?.email || '未設定'}</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">年齢</text>
            <text className="detail-value">{userProfile?.age || '未設定'}歳</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">身長</text>
            <text className="detail-value">{userProfile?.height || '未設定'}cm</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">体重</text>
            <text className="detail-value">{userProfile?.weight || '未設定'}kg</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">性別</text>
            <text className="detail-value">
              {userProfile?.gender === 'male' ? '男性' : 
               userProfile?.gender === 'female' ? '女性' : '未設定'}
            </text>
          </view>
          <view className="detail-row">
            <text className="detail-label">活動レベル</text>
            <text className="detail-value">
              {userProfile?.activityLevel === 'sedentary' ? '低い' : 
               userProfile?.activityLevel === 'light' ? 'やや低い' :
               userProfile?.activityLevel === 'moderate' ? '普通' : 
               userProfile?.activityLevel === 'active' ? '高い' : '未設定'}
            </text>
          </view>
        </view>
      </view>

      {/* 健康指標 */}
      <view className="health-section">
        <text className="section-title">健康指標</text>
        <view className="health-cards">
          <view className="health-card">
            <text className="health-label">BMI</text>
            <text className="health-value">{bmi}</text>
            <text className={`health-status ${bmiStatus.color}`}>{bmiStatus.status}</text>
          </view>
          <view className="health-card">
            <text className="health-label">基礎代謝</text>
            <text className="health-value">{bmr}</text>
            <text className="health-unit">kcal/日</text>
          </view>
          <view className="health-card">
            <text className="health-label">推奨摂取</text>
            <text className="health-value">{recommendedCalories}</text>
            <text className="health-unit">kcal/日</text>
          </view>
        </view>
      </view>

      {/* 設定項目 */}
      <view className="settings-section">
        <text className="section-title">設定</text>
        <view className="settings-list">
          <view className="setting-item">
            <text className="setting-label">通知設定</text>
            <text className="setting-arrow">→</text>
          </view>
          <view className="setting-item">
            <text className="setting-label">データエクスポート</text>
            <text className="setting-arrow">→</text>
          </view>
          <view className="setting-item">
            <text className="setting-label">アプリについて</text>
            <text className="setting-arrow">→</text>
          </view>
          <view className="setting-item logout" bindtap={handleLogout}>
            <text className="setting-label logout-text">ログアウト</text>
          </view>
        </view>
      </view>

      {/* 編集モーダル */}
      {showEditModal && (
        <view className="modal-overlay">
          <view className="modal-content profile-edit-modal">
            <text className="modal-title">プロフィール編集</text>
            
            <view className="edit-form">
              {/* 身長 */}
              <view className="form-group">
                <text className="form-label">身長 (cm)</text>
                <InputField
                  value={editingProfile.height}
                  placeholder="例: 170"
                  type="text"
                  className="profile-input"
                  onInput={(value) => handleInputChange('height', value)}
                />
              </view>

              {/* 体重 */}
              <view className="form-group">
                <text className="form-label">体重 (kg)</text>
                <InputField
                  value={editingProfile.weight}
                  placeholder="例: 65"
                  type="text"
                  className="profile-input"
                  onInput={(value) => handleInputChange('weight', value)}
                />
              </view>

              {/* 年齢 */}
              <view className="form-group">
                <text className="form-label">年齢</text>
                <InputField
                  value={editingProfile.age}
                  placeholder="例: 25"
                  type="text"
                  className="profile-input"
                  onInput={(value) => handleInputChange('age', value)}
                />
              </view>

              {/* 性別 */}
              <view className="form-group">
                <text className="form-label">性別</text>
                <view className="gender-buttons">
                  <view 
                    className={`gender-button ${editingProfile.gender === 'male' ? 'selected' : ''}`}
                    bindtap={() => handleGenderSelect('male')}
                  >
                    <text className="gender-button-text">男性</text>
                  </view>
                  <view 
                    className={`gender-button ${editingProfile.gender === 'female' ? 'selected' : ''}`}
                    bindtap={() => handleGenderSelect('female')}
                  >
                    <text className="gender-button-text">女性</text>
                  </view>
                </view>
              </view>

              {/* 活動レベル */}
              <view className="form-group">
                <text className="form-label">活動レベル</text>
                <view className="activity-buttons">
                  <view 
                    className={`activity-button ${editingProfile.activityLevel === 'sedentary' ? 'selected' : ''}`}
                    bindtap={() => handleActivitySelect('sedentary')}
                  >
                    <text className="activity-button-text">低い</text>
                    <text className="activity-button-desc">デスクワーク中心</text>
                  </view>
                  <view 
                    className={`activity-button ${editingProfile.activityLevel === 'light' ? 'selected' : ''}`}
                    bindtap={() => handleActivitySelect('light')}
                  >
                    <text className="activity-button-text">やや低い</text>
                    <text className="activity-button-desc">軽い運動時々</text>
                  </view>
                  <view 
                    className={`activity-button ${editingProfile.activityLevel === 'moderate' ? 'selected' : ''}`}
                    bindtap={() => handleActivitySelect('moderate')}
                  >
                    <text className="activity-button-text">普通</text>
                    <text className="activity-button-desc">定期的な運動</text>
                  </view>
                  <view 
                    className={`activity-button ${editingProfile.activityLevel === 'active' ? 'selected' : ''}`}
                    bindtap={() => handleActivitySelect('active')}
                  >
                    <text className="activity-button-text">高い</text>
                    <text className="activity-button-desc">激しい運動習慣</text>
                  </view>
                </view>
              </view>

              {/* ボタン */}
              <view className="modal-buttons">
                <view className="modal-button cancel" bindtap={handleCloseModal}>
                  <text className="modal-button-text">キャンセル</text>
                </view>
                <view className="modal-button save" bindtap={handleSaveProfile}>
                  <text className="modal-button-text">保存</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      )}
    </view>
  );
}