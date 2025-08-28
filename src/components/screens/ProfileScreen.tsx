import { useState, useCallback } from '@lynx-js/react';
import { useAuth } from '../../contexts/AuthContext.js';

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  activityLevel: 'low' | 'moderate' | 'high';
}

interface ProfileScreenProps {
  onRender?: () => void;
}

export function ProfileScreen({ onRender }: ProfileScreenProps) {
  const { user, logout } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.displayName || '太郎',
    age: 30,
    height: 170,
    weight: 65,
    gender: 'male',
    activityLevel: 'moderate'
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile>(profile);

  onRender?.();

  // BMI計算
  const calculateBMI = () => {
    const heightInM = profile.height / 100;
    return (profile.weight / (heightInM * heightInM)).toFixed(1);
  };

  // 基礎代謝計算（Harris-Benedict式）
  const calculateBMR = () => {
    if (profile.gender === 'male') {
      return Math.round(88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age));
    } else {
      return Math.round(447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age));
    }
  };

  // 推奨カロリー計算
  const calculateRecommendedCalories = () => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      low: 1.2,
      moderate: 1.55,
      high: 1.9
    };
    return Math.round(bmr * activityMultipliers[profile.activityLevel]);
  };

  const handleEditPress = useCallback(() => {
    'background only';
    setEditingProfile({ ...profile });
    setShowEditModal(true);
  }, [profile]);

  const handleSaveProfile = useCallback(() => {
    'background only';
    setProfile({ ...editingProfile });
    setShowEditModal(false);
  }, [editingProfile]);

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

  const updateEditingProfile = (field: keyof UserProfile, value: any) => {
    setEditingProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const recommendedCalories = calculateRecommendedCalories();

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: '低体重', color: 'blue' };
    if (bmi < 25) return { status: '標準', color: 'green' };
    if (bmi < 30) return { status: '肥満(1度)', color: 'orange' };
    return { status: '肥満(2度以上)', color: 'red' };
  };

  const bmiStatus = getBMIStatus(parseFloat(bmi));

  return (
    <view className="profile-screen">
      {/* プロフィール情報 */}
      <view className="profile-section">
        <view className="profile-header">
          <view className="avatar">
            <text className="avatar-text">{profile.name.charAt(0)}</text>
          </view>
          <text className="profile-name">{profile.name}</text>
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
            <text className="detail-value">{profile.age}歳</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">身長</text>
            <text className="detail-value">{profile.height}cm</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">体重</text>
            <text className="detail-value">{profile.weight}kg</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">性別</text>
            <text className="detail-value">{profile.gender === 'male' ? '男性' : '女性'}</text>
          </view>
          <view className="detail-row">
            <text className="detail-label">活動レベル</text>
            <text className="detail-value">
              {profile.activityLevel === 'low' ? '低い' : 
               profile.activityLevel === 'moderate' ? '普通' : '高い'}
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
              <view className="form-group">
                <text className="form-label">名前</text>
                <text 
                  className="form-input"
                  bindtap={() => {
                    const newName = prompt('名前を入力してください', editingProfile.name) || editingProfile.name;
                    updateEditingProfile('name', newName);
                  }}
                >
                  {editingProfile.name}
                </text>
              </view>

              <view className="form-group">
                <text className="form-label">年齢</text>
                <text 
                  className="form-input"
                  bindtap={() => {
                    const newAge = prompt('年齢を入力してください', editingProfile.age.toString()) || editingProfile.age.toString();
                    updateEditingProfile('age', parseInt(newAge) || 0);
                  }}
                >
                  {editingProfile.age}
                </text>
              </view>

              <view className="form-group">
                <text className="form-label">身長 (cm)</text>
                <text 
                  className="form-input"
                  bindtap={() => {
                    const newHeight = prompt('身長を入力してください (cm)', editingProfile.height.toString()) || editingProfile.height.toString();
                    updateEditingProfile('height', parseInt(newHeight) || 0);
                  }}
                >
                  {editingProfile.height}cm
                </text>
              </view>

              <view className="form-group">
                <text className="form-label">体重 (kg)</text>
                <text 
                  className="form-input"
                  bindtap={() => {
                    const newWeight = prompt('体重を入力してください (kg)', editingProfile.weight.toString()) || editingProfile.weight.toString();
                    updateEditingProfile('weight', parseInt(newWeight) || 0);
                  }}
                >
                  {editingProfile.weight}kg
                </text>
              </view>

              <view className="form-group">
                <text className="form-label">性別</text>
                <view className="radio-group">
                  <view 
                    className={`radio-option ${editingProfile.gender === 'male' ? 'selected' : ''}`}
                    bindtap={() => updateEditingProfile('gender', 'male')}
                  >
                    <text className="radio-text">男性</text>
                  </view>
                  <view 
                    className={`radio-option ${editingProfile.gender === 'female' ? 'selected' : ''}`}
                    bindtap={() => updateEditingProfile('gender', 'female')}
                  >
                    <text className="radio-text">女性</text>
                  </view>
                </view>
              </view>

              <view className="form-group">
                <text className="form-label">活動レベル</text>
                <view className="radio-group vertical">
                  <view 
                    className={`radio-option ${editingProfile.activityLevel === 'low' ? 'selected' : ''}`}
                    bindtap={() => updateEditingProfile('activityLevel', 'low')}
                  >
                    <text className="radio-text">低い（デスクワーク中心）</text>
                  </view>
                  <view 
                    className={`radio-option ${editingProfile.activityLevel === 'moderate' ? 'selected' : ''}`}
                    bindtap={() => updateEditingProfile('activityLevel', 'moderate')}
                  >
                    <text className="radio-text">普通（軽い運動）</text>
                  </view>
                  <view 
                    className={`radio-option ${editingProfile.activityLevel === 'high' ? 'selected' : ''}`}
                    bindtap={() => updateEditingProfile('activityLevel', 'high')}
                  >
                    <text className="radio-text">高い（激しい運動）</text>
                  </view>
                </view>
              </view>
            </view>

            <view className="modal-buttons">
              <view className="modal-button cancel" bindtap={handleCloseModal}>
                <text className="modal-button-text">キャンセル</text>
              </view>
              <view className="modal-button confirm" bindtap={handleSaveProfile}>
                <text className="modal-button-text">保存</text>
              </view>
            </view>
          </view>
        </view>
      )}
    </view>
  );
}