import { useCallback, useEffect, useState } from "@lynx-js/react";

import "./App.css";
import { NavigationBar } from "./components/NavigationBar.js";
import { AuthProvider, useAuth } from "./contexts/AuthContext.js";
import { AuthPage } from "./components/AuthPage.js";
import { PrivateRoute } from "./components/PrivateRoute.js";

function AppContent(props: { onRender?: () => void }) {
  const [activeTab, setActiveTab] = useState<
    "home" | "food" | "calendar" | "profile"
  >("home");
  const [debugMessage, setDebugMessage] = useState<string>('');
  const { user, signOut } = useAuth();

  useEffect(() => {
    console.info("Hello, ReactLynx");
  }, []);
  props.onRender?.();

  const handleTabChange = useCallback(
    (tab: "home" | "food" | "calendar" | "profile") => {
      setActiveTab(tab);
      setDebugMessage(`タブ切り替え: ${tab}に移動しました`);
      console.log(`タブ切り替え: ${tab}`);
    },
    []
  );


  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <view className="Content">
            <text className="Title">ホーム（メイン）</text>
            <text className="Description">
              リアルタイム歩数・消費カロリー表示
            </text>
            <text className="Description">
              今日の摂取カロリー・残りカロリー
            </text>
            <text className="Description">今日のカロリー収支サマリー</text>
          </view>
        );
      case "food":
        return (
          <view className="Content">
            <text className="Title">食事</text>
            <text className="Description">食品一覧・検索機能</text>
            <text className="Description">カテゴリ別セレクトボックス</text>
            <text className="Description">摂取カロリー管理の中心</text>
          </view>
        );
      case "calendar":
        return (
          <view className="Content">
            <text className="Title">カレンダー</text>
            <text className="Description">カレンダーUI</text>
            <text className="Description">目標設定機能</text>
            <text className="Description">達成状況の視覚化・グラフ機能</text>
          </view>
        );
      case "profile":
        return (
          <view className="Content">
            <text className="Title">プロフィール</text>
            
            
            <text className="Description">ユーザー情報: {user?.email}</text>
            <text className="Description">身長・体重設定</text>
            <text className="Description">各種設定項目</text>
            <view style={{ marginTop: "20px" }}>
              {/* ログアウトボタン */}
              <view
                bindtap={() => {
                  setDebugMessage('ログアウト処理開始...');
                  console.log('ログアウトボタンがタップされました');
                  
                  signOut().then((result) => {
                    console.log('ログアウト結果:', result);
                    setDebugMessage('ログアウト完了しました');
                  }).catch((error) => {
                    console.error('ログアウトエラー:', error);
                    setDebugMessage('ログアウトエラー: ' + JSON.stringify(error));
                  });
                }}
                style={{
                  padding: "15px 30px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  borderRadius: "10px",
                  textAlign: "center",
                  marginTop: "20px",
                  zIndex: 999,
                  position: "relative"
                }}
              >
                <text style={{ color: "white", fontSize: "18px", pointerEvents: "none" }}>🚪 ログアウト</text>
              </view>
              
              {/* デバッグメッセージ表示 */}
              {debugMessage && (
                <view style={{ 
                  marginTop: "10px", 
                  padding: "10px", 
                  backgroundColor: "#fff3cd", 
                  border: "1px solid #ffeaa7",
                  borderRadius: "5px" 
                }}>
                  <text style={{ fontSize: "14px", color: "#856404" }}>
                    {debugMessage}
                  </text>
                </view>
              )}
              
              {/* デバッグ用：現在のユーザー状態表示 */}
              <view style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                <text style={{ fontSize: "12px", color: "#666", display: "block" }}>
                  デバッグ: ユーザー={user ? 'ログイン中' : 'ログアウト中'}
                </text>
                <text style={{ fontSize: "12px", color: "#666", display: "block" }}>
                  メール: {user?.email || 'なし'}
                </text>
              </view>
            </view>
          </view>
        );
      default:
        return null;
    }
  };

  return (
    <view>
      <view className="Background" />
      <view className="App">
        <view className="Banner">
          <text className="Title">カロリー計算アプリ</text>
        </view>
        {renderContent()}
        <view style={{ flex: 1 }} />
        <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} />
      </view>
    </view>
  );
}

export function App(props: { onRender?: () => void }) {
  return (
    <AuthProvider>
      <AuthApp {...props} />
    </AuthProvider>
  );
}

function AuthApp(props: { onRender?: () => void }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <view
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <text>読み込み中...</text>
      </view>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <PrivateRoute>
      <AppContent {...props} />
    </PrivateRoute>
  );
}
