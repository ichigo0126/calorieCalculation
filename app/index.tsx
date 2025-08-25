import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function RootScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log("🔍 認証チェック中:", { isLoading, isAuthenticated });

    if (!isLoading) {
      console.log("🔐 認証状態確定:", isAuthenticated);
      if (isAuthenticated) {
        console.log("✅ 認証済み → ホーム画面へ");
        router.replace("/(tabs)/home");
      } else {
        console.log("❌ 未認証 → ログイン画面へ");
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 10, fontSize: 16 }}>アプリを起動中...</Text>
    </View>
  );
}
