import { auth, db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 編集フォーム用の状態
  const [editForm, setEditForm] = useState({
    name: "",
    height: "",
    weight: "",
    age: "",
    gender: "male",
  });

  // ユーザープロフィールを取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setUserProfile(userData);
          // 編集フォームにデータをセット
          setEditForm({
            name: userData.name,
            height: userData.height.toString(),
            weight: userData.weight.toString(),
            age: userData.age.toString(),
            gender: userData.gender,
          });
        }
      } catch (error) {
        console.error("プロフィール取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // BMR計算関数（Harris-Benedict式）
  const calculateBMR = (
    weight: number,
    height: number,
    age: number,
    gender: string
  ): number => {
    if (gender === "male") {
      return Math.round(
        88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      );
    } else {
      return Math.round(447.593 + 9.247 * weight + 3.098 * height - 4.33 * age);
    }
  };

  // 編集モーダルを開く
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  // フォーム入力値を更新
  const updateEditForm = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // バリデーション
  const validateForm = (): string | null => {
    if (!editForm.name.trim()) return "名前を入力してください";

    const height = parseInt(editForm.height);
    if (isNaN(height) || height < 100 || height > 250) {
      return "身長は100-250cmの範囲で入力してください";
    }

    const weight = parseInt(editForm.weight);
    if (isNaN(weight) || weight < 30 || weight > 200) {
      return "体重は30-200kgの範囲で入力してください";
    }

    const age = parseInt(editForm.age);
    if (isNaN(age) || age < 10 || age > 120) {
      return "年齢は10-120歳の範囲で入力してください";
    }

    return null;
  };

  // プロフィール更新
  const handleUpdateProfile = async () => {
    const validationError = validateForm();
    if (validationError) {
      if (Platform.OS === "web") {
        alert(validationError);
      } else {
        Alert.alert("入力エラー", validationError);
      }
      return;
    }

    setIsUpdating(true);
    try {
      const height = parseInt(editForm.height);
      const weight = parseInt(editForm.weight);
      const age = parseInt(editForm.age);

      // BMRを再計算
      const newBMR = calculateBMR(weight, height, age, editForm.gender);

      const updatedData = {
        name: editForm.name.trim(),
        height,
        weight,
        age,
        gender: editForm.gender,
        bmr: newBMR,
      };

      // Firestoreを更新
      if (user) {
        await updateDoc(doc(db, "users", user.uid), updatedData);

        // ローカル状態も更新
        setUserProfile((prev) => (prev ? { ...prev, ...updatedData } : null));

        setShowEditModal(false);

        if (Platform.OS === "web") {
          alert("プロフィールを更新しました！");
        } else {
          Alert.alert("更新完了", "プロフィールを更新しました！");
        }
      }
    } catch (error) {
      console.error("プロフィール更新エラー:", error);
      if (Platform.OS === "web") {
        alert("更新に失敗しました");
      } else {
        Alert.alert("エラー", "更新に失敗しました");
      }
    } finally {
      setIsUpdating(false);
    }
  };

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

        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
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

      {/* プロフィール編集モーダル */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>プロフィール編集</Text>

              {/* 名前入力 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>名前</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.name}
                  onChangeText={(value) => updateEditForm("name", value)}
                  placeholder="名前を入力"
                  maxLength={50}
                />
              </View>

              {/* 身長入力 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>身長 (cm)</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.height}
                  onChangeText={(value) => updateEditForm("height", value)}
                  placeholder="身長を入力"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              {/* 体重入力 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>体重 (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.weight}
                  onChangeText={(value) => updateEditForm("weight", value)}
                  placeholder="体重を入力"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              {/* 年齢入力 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>年齢</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.age}
                  onChangeText={(value) => updateEditForm("age", value)}
                  placeholder="年齢を入力"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              {/* 性別選択 */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>性別</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      editForm.gender === "male" && styles.genderButtonActive,
                    ]}
                    onPress={() => updateEditForm("gender", "male")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        editForm.gender === "male" &&
                          styles.genderButtonTextActive,
                      ]}
                    >
                      男性
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      editForm.gender === "female" && styles.genderButtonActive,
                    ]}
                    onPress={() => updateEditForm("gender", "female")}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        editForm.gender === "female" &&
                          styles.genderButtonTextActive,
                      ]}
                    >
                      女性
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ボタン */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowEditModal(false)}
                  disabled={isUpdating}
                >
                  <Text style={styles.cancelButtonText}>キャンセル</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleUpdateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.confirmButtonText}>保存</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  // 編集モーダル用スタイル
  editModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    maxWidth: 500,
    width: "90%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  genderButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});
