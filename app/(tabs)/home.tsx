import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfile {
  name: string;
  height: number;
  weight: number;
  age: number;
  gender: string;
  bmr: number;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [todaySteps, setTodaySteps] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  // 歩数からカロリー消費量を計算（簡易計算）
  useEffect(() => {
    if (userProfile && todaySteps > 0) {
      // 1歩あたり約0.04kcal（体重60kgの場合）
      const weightFactor = userProfile.weight / 60;
      const calories = Math.round(todaySteps * 0.04 * weightFactor);
      setCaloriesBurned(calories);
    }
  }, [todaySteps, userProfile]);

  const remainingCalories = userProfile
    ? userProfile.bmr + caloriesBurned - caloriesConsumed
    : 0;

  const handleStepCounterSetup = () => {
    Alert.alert(
      "歩数計測設定",
      "歩数計測機能は開発中です。\n今後のアップデートで利用可能になります。",
      [{ text: "OK" }]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>データを読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>おかえりなさい！</Text>
        <Text style={styles.nameText}>
          {userProfile?.name || user?.displayName || "ユーザー"}さん
        </Text>
      </View>

      {/* 今日の概要 */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>今日の概要</Text>

        {/* 歩数カード */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🚶‍♂️ 歩数</Text>
            <TouchableOpacity
              onPress={handleStepCounterSetup}
              style={styles.setupButton}
            >
              <Text style={styles.setupButtonText}>設定</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.mainNumber}>{todaySteps.toLocaleString()}</Text>
          <Text style={styles.subText}>歩</Text>
        </View>

        {/* カロリー収支カード */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 カロリー収支</Text>
          <View style={styles.calorieBreakdown}>
            <View style={styles.calorieItem}>
              <Text style={styles.calorieLabel}>基礎代謝</Text>
              <Text style={styles.calorieValue}>
                {userProfile?.bmr || 0} kcal
              </Text>
            </View>
            <View style={styles.calorieItem}>
              <Text style={styles.calorieLabel}>運動消費</Text>
              <Text style={styles.calorieValue}>+{caloriesBurned} kcal</Text>
            </View>
            <View style={styles.calorieItem}>
              <Text style={styles.calorieLabel}>摂取カロリー</Text>
              <Text style={styles.calorieValue}>-{caloriesConsumed} kcal</Text>
            </View>
          </View>
          <View style={styles.remainingCalories}>
            <Text style={styles.remainingLabel}>残り摂取可能</Text>
            <Text
              style={[
                styles.remainingValue,
                remainingCalories < 0
                  ? styles.overCalories
                  : styles.underCalories,
              ]}
            >
              {remainingCalories} kcal
            </Text>
          </View>
        </View>

        {/* プロフィール情報カード */}
        {userProfile && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 あなたの情報</Text>
            <View style={styles.profileGrid}>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>身長</Text>
                <Text style={styles.profileValue}>{userProfile.height}cm</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>体重</Text>
                <Text style={styles.profileValue}>{userProfile.weight}kg</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>年齢</Text>
                <Text style={styles.profileValue}>{userProfile.age}歳</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>性別</Text>
                <Text style={styles.profileValue}>
                  {userProfile.gender === "male"
                    ? "男性"
                    : userProfile.gender === "female"
                    ? "女性"
                    : "その他"}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* クイックアクション */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>クイックアクション</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🍽️ 食事を記録</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📅 カレンダーを見る</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>⚙️ 設定を変更</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#007AFF",
  },
  welcomeText: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 4,
  },
  summaryContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  setupButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  setupButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  mainNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  calorieBreakdown: {
    marginBottom: 15,
  },
  calorieItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calorieLabel: {
    fontSize: 16,
    color: "#666",
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  remainingCalories: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remainingLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  remainingValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  underCalories: {
    color: "#34C759",
  },
  overCalories: {
    color: "#FF3B30",
  },
  profileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  profileItem: {
    width: "48%",
    marginBottom: 15,
  },
  profileLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
