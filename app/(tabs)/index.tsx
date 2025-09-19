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
import { CalorieBalanceSummary } from '@/components/CalorieBalanceSummary'

export default function HomeScreen() {
  const { stats, loading, getRecentMeals, getMealTypeStats, fetchTodayMeals } = useTodayMeals()
  const { profile } = useProfile()
  const recentMeals = getRecentMeals()
  const mealTypeStats = getMealTypeStats()

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

      {/* 今日のカロリー概要 */}
      <View style={styles.calorieCard}>
        <Text style={styles.cardTitle}>今日のカロリー</Text>
        <View style={styles.calorieProgress}>
          <View style={styles.calorieNumbers}>
            <Text style={styles.currentCalories}>{stats.totalCalories}</Text>
            <Text style={styles.goalCalories}>/ {stats.goalCalories} kcal</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(100, stats.progressPercentage)}%`,
                    backgroundColor: getProgressColor(stats.progressPercentage)
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: getProgressColor(stats.progressPercentage) }]}>
              {stats.progressPercentage.toFixed(0)}%
            </Text>
          </View>
        </View>
        <View style={styles.remainingCalories}>
          <Text style={styles.remainingText}>
            残り {stats.remainingCalories} kcal
          </Text>
        </View>
      </View>

      {/* 栄養素カード */}
      <View style={styles.nutritionCard}>
        <Text style={styles.cardTitle}>今日の栄養素</Text>
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{stats.totalProtein.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>タンパク質</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{stats.totalCarbs.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>炭水化物</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{stats.totalFat.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>脂質</Text>
          </View>
        </View>
      </View>

      {/* 活動・カロリー収支サマリー */}
      <CalorieBalanceSummary />

      {/* 食事タイプ別統計 */}
      <View style={styles.mealTypesCard}>
        <Text style={styles.cardTitle}>食事別カロリー</Text>
        <View style={styles.mealTypesGrid}>
          {Object.entries(mealTypeStats).map(([type, data]) => (
            <View key={type} style={styles.mealTypeItem}>
              <FontAwesome
                name={getMealTypeIcon(type)}
                size={20}
                color="#4299e1"
                style={styles.mealTypeIcon}
              />
              <Text style={styles.mealTypeName}>
                {type === 'breakfast' ? '朝食' :
                 type === 'lunch' ? '昼食' :
                 type === 'dinner' ? '夕食' : '間食'}
              </Text>
              <Text style={styles.mealTypeCalories}>{data.calories} kcal</Text>
              <Text style={styles.mealTypeCount}>{data.count}回</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 最近の食事 */}
      <View style={styles.recentMealsCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>最近の食事</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/two')}>
            <Text style={styles.seeAllText}>すべて見る</Text>
          </TouchableOpacity>
        </View>
        {recentMeals.length > 0 ? (
          recentMeals.map((meal) => (
            <View key={meal.id} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>
                  {new Date(meal.meal_time).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="cutlery" size={32} color="#a0aec0" />
            <Text style={styles.emptyText}>まだ食事記録がありません</Text>
            <TouchableOpacity
              style={styles.addMealButton}
              onPress={() => router.push('/(tabs)/two')}
            >
              <Text style={styles.addMealButtonText}>食事を記録する</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

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
});
