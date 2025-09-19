import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useTodayMeals } from '@/hooks/useTodayMeals'
import { useProfile } from '@/hooks/useProfile'
import { useActivityTracker } from '@/hooks/useActivityTracker'
import { CalorieBalanceSummary } from '@/components/CalorieBalanceSummary'

export default function HomeScreen() {
  const { stats, loading: mealsLoading, getRecentMeals, getMealTypeStats, fetchTodayMeals } = useTodayMeals()
  const { profile } = useProfile()
  const { activityData, loading: activityLoading } = useActivityTracker()
  const recentMeals = getRecentMeals()
  const mealTypeStats = getMealTypeStats()

  const loading = mealsLoading || activityLoading

  // 画面にフォーカスが戻ったときにデータを更新（バックグラウンド）
  useFocusEffect(
    React.useCallback(() => {
      fetchTodayMeals(false) // ローディング表示なし
    }, [])
  )

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'おはようございます'
    if (hour < 18) return 'こんにちは'
    return 'こんばんは'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return '#38a169'
    if (percentage < 100) return '#d69e2e'
    return '#e53e3e'
  }

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return 'coffee'
      case 'lunch': return 'cutlery'
      case 'dinner': return 'glass'
      case 'snack': return 'apple'
      default: return 'cutlery'
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
        <Text style={styles.loadingText}>データを読み込み中...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{profile?.name || 'ユーザー'}さん</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
          <FontAwesome name="user-circle" size={32} color="#4299e1" />
        </TouchableOpacity>
      </View>

      {/* 今日の活動・消費カロリー概要 */}
      <View style={styles.calorieCard}>
        <Text style={styles.cardTitle}>今日の活動</Text>
        {activityData.isAvailable ? (
          <>
            <View style={styles.activityMainDisplay}>
              <View style={styles.mainActivityItem}>
                <FontAwesome name="street-view" size={24} color="#4299e1" />
                <Text style={styles.activityMainValue}>{activityData.steps.toLocaleString()}</Text>
                <Text style={styles.activityMainLabel}>歩</Text>
              </View>
              <View style={styles.mainActivityItem}>
                <FontAwesome name="fire" size={24} color="#e53e3e" />
                <Text style={styles.activityMainValue}>{activityData.caloriesBurned}</Text>
                <Text style={styles.activityMainLabel}>kcal消費</Text>
              </View>
            </View>
            <View style={styles.activitySubDisplay}>
              <View style={styles.subActivityItem}>
                <Text style={styles.subActivityValue}>{activityData.distance.toFixed(2)} km</Text>
                <Text style={styles.subActivityLabel}>移動距離</Text>
              </View>
              <View style={styles.subActivityItem}>
                <Text style={styles.subActivityValue}>{activityData.activeMinutes} 分</Text>
                <Text style={styles.subActivityLabel}>活動時間</Text>
              </View>
            </View>
            <View style={styles.remainingCalories}>
              <Text style={styles.remainingText}>
                食べられるカロリー: {activityData.remainingCalories} kcal
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.unavailableContainer}>
            <FontAwesome name="exclamation-triangle" size={24} color="#e53e3e" />
            <Text style={styles.unavailableText}>歩数計が利用できません</Text>
          </View>
        )}
      </View>

      {/* 摂取カロリー概要 */}
      <View style={styles.nutritionCard}>
        <Text style={styles.cardTitle}>今日の摂取カロリー</Text>
        <View style={styles.calorieIntakeRow}>
          <View style={styles.intakeItem}>
            <Text style={styles.intakeValue}>{stats.totalCalories}</Text>
            <Text style={styles.intakeLabel}>摂取カロリー</Text>
          </View>
          <View style={styles.intakeItem}>
            <Text style={styles.intakeValue}>{stats.mealCount}</Text>
            <Text style={styles.intakeLabel}>食事回数</Text>
          </View>
          <View style={styles.intakeItem}>
            <Text style={styles.intakeValue}>{stats.goalCalories}</Text>
            <Text style={styles.intakeLabel}>目標カロリー</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.mealManagementButton}
          onPress={() => router.push('/(tabs)/two')}
        >
          <Text style={styles.mealManagementText}>食事管理へ</Text>
          <FontAwesome name="arrow-right" size={16} color="#4299e1" />
        </TouchableOpacity>
      </View>

      {/* 活動・カロリー収支サマリー */}
      <CalorieBalanceSummary />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  greeting: {
    fontSize: 16,
    color: '#718096',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  calorieCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  calorieProgress: {
    alignItems: 'center',
  },
  calorieNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currentCalories: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4299e1',
  },
  goalCalories: {
    fontSize: 18,
    color: '#718096',
    marginLeft: 8,
  },
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  remainingCalories: {
    marginTop: 12,
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 16,
    color: '#4a5568',
  },
  nutritionCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  mealTypesCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mealTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealTypeItem: {
    width: '48%',
    backgroundColor: '#f7fafc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTypeIcon: {
    marginBottom: 8,
  },
  mealTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  mealTypeCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4299e1',
  },
  mealTypeCount: {
    fontSize: 12,
    color: '#718096',
  },
  recentMealsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4299e1',
    fontWeight: '600',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fafc',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  mealTime: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    marginVertical: 16,
  },
  addMealButton: {
    backgroundColor: '#4299e1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addMealButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionItem: {
    alignItems: 'center',
    padding: 16,
  },
  quickActionText: {
    fontSize: 14,
    color: '#2d3748',
    marginTop: 8,
    fontWeight: '500',
  },
  // 新しい活動表示用スタイル
  activityMainDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  mainActivityItem: {
    alignItems: 'center',
    flex: 1,
  },
  activityMainValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 8,
  },
  activityMainLabel: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  activitySubDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#f7fafc',
    borderRadius: 8,
    padding: 12,
  },
  subActivityItem: {
    alignItems: 'center',
    flex: 1,
  },
  subActivityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
  subActivityLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  unavailableContainer: {
    alignItems: 'center',
    padding: 20,
  },
  unavailableText: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
  },
  // 摂取カロリー表示用スタイル
  calorieIntakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  intakeItem: {
    alignItems: 'center',
    flex: 1,
  },
  intakeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  intakeLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  mealManagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  mealManagementText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299e1',
  },
});
