import { useState, useCallback } from '@lynx-js/react';
import { InputField } from '../common/InputField.js';

interface UserProfile {
  height: string;
  weight: string;
  age: string;
  gender: string;
  activityLevel: string;
}

interface ProfileSetupScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const [profile, setProfile] = useState<UserProfile>({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: ''
  });

  const handleInputChange = useCallback((field: keyof UserProfile, value: string) => {
    'background only';
    setProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGenderSelect = useCallback((gender: string) => {
    'background only';
    setProfile(prev => ({ ...prev, gender }));
  }, []);

  const handleActivitySelect = useCallback((activityLevel: string) => {
    'background only';
    setProfile(prev => ({ ...prev, activityLevel }));
  }, []);

  const isFormValid = profile.height && profile.weight && profile.age && profile.gender && profile.activityLevel;

  const handleComplete = useCallback(() => {
    'background only';
    console.log('Complete button clicked, profile:', profile);
    console.log('Form valid:', isFormValid);
    if (isFormValid) {
      console.log('Calling onComplete with profile');
      onComplete(profile);
    } else {
      console.log('Form is not valid, cannot complete');
    }
  }, [profile, onComplete, isFormValid]);

  return (
    <view className="profile-setup-screen">
      <view className="profile-setup-header">
        <text className="profile-setup-title">プロフィール設定</text>
        <text className="profile-setup-subtitle">より正確なカロリー計算のため、基本情報を入力してください</text>
      </view>

      <view className="profile-setup-scroll">
        <view className="profile-setup-form">
          <view className="form-group">
            <text className="form-label">身長 (cm)</text>
            <InputField
              value={profile.height}
              placeholder="例: 170"
              type="text"
              className="profile-input"
              onInput={(value) => handleInputChange('height', value)}
            />
          </view>

          <view className="form-group">
            <text className="form-label">体重 (kg)</text>
            <InputField
              value={profile.weight}
              placeholder="例: 65"
              type="text"
              className="profile-input"
              onInput={(value) => handleInputChange('weight', value)}
            />
          </view>

          <view className="form-group">
            <text className="form-label">年齢</text>
            <InputField
              value={profile.age}
              placeholder="例: 25"
              type="text"
              className="profile-input"
              onInput={(value) => handleInputChange('age', value)}
            />
          </view>

          <view className="form-group">
            <text className="form-label">性別</text>
            <view className="gender-buttons">
              <view 
                className={`gender-button ${profile.gender === 'male' ? 'selected' : ''}`}
                bindtap={() => handleGenderSelect('male')}
              >
                <text className="gender-button-text">男性</text>
              </view>
              <view 
                className={`gender-button ${profile.gender === 'female' ? 'selected' : ''}`}
                bindtap={() => handleGenderSelect('female')}
              >
                <text className="gender-button-text">女性</text>
              </view>
            </view>
          </view>

          <view className="form-group">
            <text className="form-label">活動レベル</text>
            <view className="activity-buttons">
              <view 
                className={`activity-button ${profile.activityLevel === 'sedentary' ? 'selected' : ''}`}
                bindtap={() => handleActivitySelect('sedentary')}
              >
                <text className="activity-button-text">低い</text>
                <text className="activity-button-desc">デスクワーク中心</text>
              </view>
              <view 
                className={`activity-button ${profile.activityLevel === 'light' ? 'selected' : ''}`}
                bindtap={() => handleActivitySelect('light')}
              >
                <text className="activity-button-text">やや低い</text>
                <text className="activity-button-desc">軽い運動時々</text>
              </view>
              <view 
                className={`activity-button ${profile.activityLevel === 'moderate' ? 'selected' : ''}`}
                bindtap={() => handleActivitySelect('moderate')}
              >
                <text className="activity-button-text">普通</text>
                <text className="activity-button-desc">定期的な運動</text>
              </view>
              <view 
                className={`activity-button ${profile.activityLevel === 'active' ? 'selected' : ''}`}
                bindtap={() => handleActivitySelect('active')}
              >
                <text className="activity-button-text">高い</text>
                <text className="activity-button-desc">激しい運動習慣</text>
              </view>
            </view>
          </view>

          <view className="profile-setup-buttons">
            <view 
              className={`complete-button ${isFormValid ? '' : 'disabled'}`}
              bindtap={handleComplete}
            >
              <text className="complete-button-text">完了</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  );
}