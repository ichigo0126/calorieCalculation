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
  const [debugMessage, setDebugMessage] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    console.info("Hello, ReactLynx");
    // プロフィールデータを読み込み
    loadProfileData();
  }, []);
  props.onRender?.();

  const loadProfileData = () => {
    try {
      const profileData = localStorage?.getItem(`profile_${user?.email}`) || null;
      if (profileData) {
        const data = JSON.parse(profileData);
        setHeight(data.height || "");
        setWeight(data.weight || "");
      }
    } catch (error) {
      console.warn("プロフィールデータの読み込みに失敗:", error);
    }
  };

  const saveProfileData = () => {
    try {
      const profileData = { height, weight };
      localStorage?.setItem(`profile_${user?.email}`, JSON.stringify(profileData));
      setDebugMessage("プロフィールを保存しました");
    } catch (error) {
      console.error("プロフィールデータの保存に失敗:", error);
      setDebugMessage("保存に失敗しました");
    }
  };

  const handleProfileFieldEdit = (field: string) => {
    setEditingField(field);
  };

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmi = w / Math.pow(h / 100, 2);
      return bmi.toFixed(1);
    }
    return null;
  };

  const handleTabChange = useCallback(
    (tab: "home" | "food" | "calendar" | "profile") => {
      setActiveTab(tab);
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
        const bmi = calculateBMI();
        return (
          <view className="Content">
            <text className="Title">プロフィール</text>
            <text className="Description">ユーザー情報: {user?.email}</text>

            {/* 編集中の入力フォーム */}
            {editingField && (
              <view style={{ marginTop: "20px", marginBottom: "20px" }}>
                <text style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
                  {editingField === 'height' ? '📏 身長' : '⚖️ 体重'}を入力
                </text>
                <input
                  type="number"
                  value={editingField === 'height' ? height : weight}
                  bindinput={(e) => {
                    const value = e.detail.value;
                    if (editingField === 'height') setHeight(value);
                    else if (editingField === 'weight') setWeight(value);
                  }}
                  placeholder={editingField === 'height' ? '身長を入力 (cm)' : '体重を入力 (kg)'}
                  style={{
                    width: "100%",
                    padding: "15px",
                    border: "2px solid #007bff",
                    borderRadius: "8px",
                    fontSize: "18px",
                    backgroundColor: "white",
                    marginBottom: "15px",
                  }}
                />
                <view style={{ display: "flex", gap: "10px" }}>
                  <view
                    bindtap={() => setEditingField(null)}
                    style={{
                      padding: "15px",
                      backgroundColor: "#28a745",
                      borderRadius: "8px",
                      flex: 1,
                      textAlign: "center",
                      position: "relative",
                      zIndex: 999
                    }}
                  >
                    <text style={{ color: "white", fontSize: "16px", fontWeight: "bold", pointerEvents: "none" }}>✓ 完了</text>
                  </view>
                  <view
                    bindtap={() => setEditingField(null)}
                    style={{
                      padding: "15px",
                      backgroundColor: "#6c757d",
                      borderRadius: "8px",
                      flex: 1,
                      textAlign: "center",
                      position: "relative",
                      zIndex: 999
                    }}
                  >
                    <text style={{ color: "white", fontSize: "16px", fontWeight: "bold", pointerEvents: "none" }}>✕ キャンセル</text>
                  </view>
                </view>
              </view>
            )}

            {/* 通常表示 */}
            {!editingField && (
              <view>
                {/* 身長・体重表示 */}
                <view style={{ marginTop: "30px" }}>
                  <view style={{ 
                    padding: "20px", 
                    backgroundColor: "#ffffff", 
                    borderRadius: "10px",
                    marginBottom: "15px",
                    border: "1px solid #dee2e6"
                  }}>
                    <text style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>📏 身長</text>
                    <view style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <text style={{ fontSize: "20px", color: height ? "#000" : "#6c757d" }}>
                        {height ? `${height} cm` : "未設定"}
                      </text>
                      <view 
                        bindtap={() => handleProfileFieldEdit('height')}
                        style={{ 
                          padding: "8px 15px", 
                          backgroundColor: "#007bff", 
                          borderRadius: "5px",
                          position: "relative",
                          zIndex: 999,
                          marginLeft: "auto"
                        }}
                      >
                        <text style={{ color: "white", fontSize: "14px", pointerEvents: "none" }}>編集</text>
                      </view>
                    </view>
                  </view>

                  <view style={{ 
                    padding: "20px", 
                    backgroundColor: "#ffffff", 
                    borderRadius: "10px",
                    marginBottom: "20px",
                    border: "1px solid #dee2e6"
                  }}>
                    <text style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>⚖️ 体重</text>
                    <view style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <text style={{ fontSize: "20px", color: weight ? "#000" : "#6c757d" }}>
                        {weight ? `${weight} kg` : "未設定"}
                      </text>
                      <view 
                        bindtap={() => handleProfileFieldEdit('weight')}
                        style={{ 
                          padding: "8px 15px", 
                          backgroundColor: "#28a745", 
                          borderRadius: "5px",
                          position: "relative",
                          zIndex: 999,
                          marginLeft: "auto"
                        }}
                      >
                        <text style={{ color: "white", fontSize: "14px", pointerEvents: "none" }}>編集</text>
                      </view>
                    </view>
                  </view>
                </view>

                {/* BMI表示 */}
                {bmi && (
                  <view style={{ 
                    padding: "20px", 
                    backgroundColor: "#e8f5e8", 
                    borderRadius: "10px",
                    marginBottom: "30px",
                    border: "1px solid #28a745"
                  }}>
                    <text style={{ fontSize: "16px", fontWeight: "bold", color: "#155724", marginBottom: "10px" }}>📊 BMI</text>
                    <text style={{ fontSize: "24px", fontWeight: "bold", color: "#155724" }}>
                      {bmi} ({parseFloat(bmi) < 18.5 ? "やせ" : parseFloat(bmi) < 25 ? "標準" : parseFloat(bmi) < 30 ? "肥満1度" : "肥満2度以上"})
                    </text>
                  </view>
                )}

                {/* 操作ボタン */}
                <view style={{ paddingBottom: "30px" }}>
                  <view 
                    bindtap={saveProfileData}
                    style={{
                      padding: "15px",
                      backgroundColor: "#007bff",
                      borderRadius: "8px",
                      textAlign: "center",
                      marginBottom: "15px",
                      position: "relative",
                      zIndex: 999,
                      width: "100%"
                    }}
                  >
                    <text style={{ color: "white", fontSize: "16px", fontWeight: "bold", pointerEvents: "none" }}>💾 保存</text>
                  </view>

                  <view
                    bindtap={() => {
                      setDebugMessage("ログアウト処理開始...");
                      signOut()
                        .then((result) => setDebugMessage("ログアウト完了しました"))
                        .catch((error) => setDebugMessage("ログアウトエラー: " + JSON.stringify(error)));
                    }}
                    style={{
                      padding: "15px",
                      backgroundColor: "#dc3545",
                      borderRadius: "8px",
                      textAlign: "center",
                      position: "relative",
                      zIndex: 999,
                      width: "100%"
                    }}
                  >
                    <text style={{ color: "white", fontSize: "16px", fontWeight: "bold", pointerEvents: "none" }}>🚪 ログアウト</text>
                  </view>
                </view>
              </view>
            )}

            {/* デバッグメッセージ */}
            {debugMessage && (
              <view style={{
                padding: "10px",
                backgroundColor: "#fff3cd",
                border: "1px solid #ffeaa7",
                borderRadius: "5px",
                marginTop: "10px"
              }}>
                <text style={{ fontSize: "14px", color: "#856404" }}>{debugMessage}</text>
              </view>
            )}
          </view>
        );
      default:
        return null;
    }
  };

  return (
    <view>
      <view className="App">
        <view className="Banner">
          <text className="AppName">カロリー計算アプリ</text>
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
