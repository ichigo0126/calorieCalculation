import { auth, db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfile {
  name: string;
  email: string;
  height: number;
  weight: number;
  age: number;
  gender: string;
  bmr: number;
  createdAt: any;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ユーザープロフィールを取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error("プロフィール取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = () => {
    if (Platform.OS === "web") {
      // Web環境ではカスタムモーダルを使用
      setShowLogoutModal(true);
    } else {
      // ネイティブ環境では標準のAlertを使用
      Alert.alert("ログアウト", "ログアウトしますか？", [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "ログアウト",
          style: "destructive",
          onPress: performLogout,
        },
      ]);
    }
  };

  const performLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log("🚪 ログアウト処理開始");
      await signOut(auth);
      console.log("✅ Firebase ログアウト成功");

      // 少し待ってからリダイレクト（AuthContextの処理を待つ）
      setTimeout(() => {
        console.log("🔄 ログイン画面にリダイレクト");
        router.replace("/login");
      }, 100);
    } catch (error) {
      console.error("❌ ログアウトエラー:", error);
      if (Platform.OS === "web") {
        alert("ログアウトに失敗しました");
      } else {
        Alert.alert("エラー", "ログアウトに失敗しました");
      }
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>プロフィールを読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>プロフィール</Text>
      </View>

      {/* ユーザー情報カード */}
      {userProfile && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 ユーザー情報</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>名前</Text>
            <Text style={styles.infoValue}>{userProfile.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>メールアドレス</Text>
            <Text style={styles.infoValue}>{userProfile.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>身長</Text>
            <Text style={styles.infoValue}>{userProfile.height} cm</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>体重</Text>
            <Text style={styles.infoValue}>{userProfile.weight} kg</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年齢</Text>
            <Text style={styles.infoValue}>{userProfile.age} 歳</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>性別</Text>
            <Text style={styles.infoValue}>
              {userProfile.gender === "male"
                ? "男性"
                : userProfile.gender === "female"
                ? "女性"
                : "その他"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>基礎代謝</Text>
            <Text style={[styles.infoValue, styles.bmrValue]}>
              {userProfile.bmr} kcal/日
            </Text>
          </View>
        </View>
      )}

      {/* 設定メニュー */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ 設定</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>📝 プロフィール編集</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>🎯 目標設定</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>📊 データエクスポート</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>❓ ヘルプ・サポート</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ログアウトボタン */}
      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.logoutButton, isLoggingOut && styles.disabledButton]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.logoutButtonText}>🚪 ログアウト</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* アプリ情報 */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>カロリー計算アプリ v1.0.0</Text>
        {userProfile?.createdAt && (
          <Text style={styles.appInfoText}>
            登録日:{" "}
            {new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString(
              "ja-JP"
            )}
          </Text>
        )}
      </View>

      {/* Web環境用のログアウト確認モーダル */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ログアウト</Text>
            <Text style={styles.modalMessage}>ログアウトしますか？</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={performLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>ログアウト</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bmrValue: {
    color: "#007AFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  menuItemArrow: {
    fontSize: 18,
    color: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  appInfo: {
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  appInfoText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  // Web環境用モーダルスタイル
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    minWidth: 300,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
