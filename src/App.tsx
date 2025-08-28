import { useEffect, useCallback } from '@lynx-js/react'
import { AuthProvider, useAuth } from './contexts/AuthContext.js'
import { TabNavigation } from './components/TabNavigation.js'
import { AuthScreen } from './components/auth/AuthScreen.js'
import { ProfileSetupScreen } from './components/auth/ProfileSetupScreen.js'
import './App.css'

function AppContent(props: { onRender?: () => void }) {
  const { user, loading, needsProfileSetup, saveUserProfile } = useAuth();

  useEffect(() => {
    console.info('CalorieCalculation App Started')
  }, [])

  useEffect(() => {
    console.log('App state - user:', !!user, 'loading:', loading, 'needsProfileSetup:', needsProfileSetup);
  }, [user, loading, needsProfileSetup]);

  const handleProfileComplete = useCallback(async (profile: any) => {
    'background only';
    console.log('handleProfileComplete called with:', profile);
    try {
      await saveUserProfile(profile);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('プロフィール保存失敗:', error);
    }
  }, [saveUserProfile]);

  // 認証状態をロード中の場合
  if (loading) {
    return (
      <view className="app-container">
        <view className="loading-screen">
          <text className="loading-text">読み込み中...</text>
        </view>
      </view>
    );
  }

  // 認証されていない場合は認証画面を表示
  if (!user) {
    return (
      <view className="app-container">
        <AuthScreen />
      </view>
    );
  }

  // ログイン済みだがプロフィール未設定の場合はプロフィール設定画面を表示
  if (needsProfileSetup) {
    return (
      <view className="app-container">
        <ProfileSetupScreen onComplete={handleProfileComplete} />
      </view>
    );
  }

  // 認証済み且つプロフィール設定済みの場合はメインアプリを表示
  return (
    <view className="app-container">
      <TabNavigation onRender={props.onRender} />
    </view>
  );
}

export function App(props: {
  onRender?: () => void
}) {
  return (
    <AuthProvider>
      <AppContent onRender={props.onRender} />
    </AuthProvider>
  )
}
