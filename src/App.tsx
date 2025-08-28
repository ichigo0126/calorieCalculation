import { useEffect } from '@lynx-js/react'
import { AuthProvider, useAuth } from './contexts/AuthContext.js'
import { TabNavigation } from './components/TabNavigation.js'
import { AuthScreen } from './components/auth/AuthScreen.js'
import './App.css'

function AppContent(props: { onRender?: () => void }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.info('CalorieCalculation App Started')
  }, [])

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

  // 認証されている場合はメインアプリを表示
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
