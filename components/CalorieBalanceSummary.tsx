import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useActivityTracker } from '@/hooks/useActivityTracker'
import { useTodayMeals } from '@/hooks/useTodayMeals'
import { FoodSuggestions } from './FoodSuggestions'

export const CalorieBalanceSummary = () => {
  const { activityData, loading: activityLoading, getCalorieBalance, consumeFood } = useActivityTracker()
  const { stats, addMeal, fetchTodayMeals } = useTodayMeals()

  if (activityLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4299e1" />
        <Text style={styles.loadingText}>活動データを読み込み中...</Text>
      </View>
    )
  }

  const calorieBalance = getCalorieBalance(stats.totalCalories, stats.goalCalories)

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return '#e53e3e' // 赤: カロリーオーバー
    if (balance > -200) return '#38a169' // 緑: 適正範囲
    return '#d69e2e' // 黄: アンダー
  }

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return 'arrow-up'
    if (balance > -200) return 'check-circle'
    return 'arrow-down'
  }

  return (
    <View style={styles.container}>
      {/* 歩数・活動データ */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>今日の活動</Text>
        {activityData.isAvailable ? (
          <>
            <View style={styles.activityGrid}>
              <View style={styles.activityItem}>
                <FontAwesome name="street-view" size={20} color="#4299e1" />
                <Text style={styles.activityValue}>{activityData.steps.toLocaleString()}</Text>
                <Text style={styles.activityLabel}>歩</Text>
              </View>
              <View style={styles.activityItem}>
                <FontAwesome name="road" size={20} color="#38a169" />
                <Text style={styles.activityValue}>{activityData.distance.toFixed(2)}</Text>
                <Text style={styles.activityLabel}>km</Text>
              </View>
              <View style={styles.activityItem}>
                <FontAwesome name="fire" size={20} color="#e53e3e" />
                <Text style={styles.activityValue}>{activityData.caloriesBurned}</Text>
                <Text style={styles.activityLabel}>kcal消費</Text>
              </View>
              <View style={styles.activityItem}>
                <FontAwesome name="clock-o" size={20} color="#d69e2e" />
                <Text style={styles.activityValue}>{activityData.activeMinutes}</Text>
                <Text style={styles.activityLabel}>分</Text>
              </View>
            </View>

            {/* 残りカロリー表示 */}
            <View style={styles.remainingCaloriesContainer}>
              <FontAwesome name="cutlery" size={16} color="#4299e1" />
              <Text style={styles.remainingCaloriesText}>
                残り消費カロリー: {activityData.remainingCalories}kcal
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

      {/* カロリー収支サマリー */}
      <View style={styles.balanceSection}>
        <Text style={styles.sectionTitle}>今日のカロリー収支</Text>
        <View style={styles.balanceGrid}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>摂取</Text>
            <Text style={[styles.balanceValue, { color: '#e53e3e' }]}>
              {calorieBalance.consumed}
            </Text>
            <Text style={styles.balanceUnit}>kcal</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>消費</Text>
            <Text style={[styles.balanceValue, { color: '#38a169' }]}>
              {calorieBalance.burned}
            </Text>
            <Text style={styles.balanceUnit}>kcal</Text>
          </View>
          <View style={styles.balanceItem}>
            <FontAwesome
              name={getBalanceIcon(calorieBalance.balance)}
              size={16}
              color={getBalanceColor(calorieBalance.balance)}
            />
            <Text style={styles.balanceLabel}>収支</Text>
            <Text style={[styles.balanceValue, { color: getBalanceColor(calorieBalance.balance) }]}>
              {calorieBalance.balance > 0 ? '+' : ''}{calorieBalance.balance}
            </Text>
            <Text style={styles.balanceUnit}>kcal</Text>
          </View>
        </View>

        {/* 詳細情報 */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>基礎代謝</Text>
            <Text style={styles.detailValue}>{calorieBalance.bmr} kcal</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>活動代謝</Text>
            <Text style={styles.detailValue}>{calorieBalance.activityBurn} kcal</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>目標カロリー</Text>
            <Text style={styles.detailValue}>{calorieBalance.goalCalories} kcal</Text>
          </View>
        </View>

        {/* 収支メッセージ */}
        <View style={styles.messageContainer}>
          {calorieBalance.balance > 200 ? (
            <Text style={[styles.messageText, { color: '#e53e3e' }]}>
              カロリーオーバーです。運動を増やすか食事量を調整しましょう。
            </Text>
          ) : calorieBalance.balance > 0 ? (
            <Text style={[styles.messageText, { color: '#d69e2e' }]}>
              少しカロリーオーバーです。注意しましょう。
            </Text>
          ) : calorieBalance.balance > -200 ? (
            <Text style={[styles.messageText, { color: '#38a169' }]}>
              良好なカロリー収支です！
            </Text>
          ) : (
            <Text style={[styles.messageText, { color: '#d69e2e' }]}>
              カロリー不足です。適度に食事を増やしましょう。
            </Text>
          )}
        </View>

        {/* 食べ物提案 */}
        <FoodSuggestions
          burnedCalories={activityData.remainingCalories}
          onFoodSelect={async (food) => {
            try {
              alert(`${food.food.food_name}を選択しました！`)

              // 1. 消費カロリーから差し引く
              await consumeFood(food.food.calories)
              alert('消費カロリー差し引き完了')

              // 2. 食事記録に追加
              const result = await addMeal({
                name: food.food.food_name,
                calories: food.food.calories,
                protein: food.food.protein,
                carbs: food.food.carbohydrate,
                fat: food.food.fat,
                meal_type: 'snack'
              })

              if (result) {
                alert('食事記録追加成功！')
                // 画面データを強制更新（バックグラウンド）
                setTimeout(() => {
                  fetchTodayMeals(false)
                }, 300)
              } else {
                alert('食事記録追加失敗')
              }

              console.log(`${food.food.food_name}を食べました！残り${activityData.remainingCalories - food.food.calories}kcal`)
            } catch (error) {
              console.error('食べ物消費エラー:', error)
              alert(`エラー: ${error}`)
            }
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#718096',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  activitySection: {
    marginBottom: 20,
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityItem: {
    alignItems: 'center',
    flex: 1,
  },
  activityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 4,
  },
  activityLabel: {
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
  balanceSection: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  balanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceUnit: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  detailsContainer: {
    backgroundColor: '#f7fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4a5568',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
  },
  messageContainer: {
    backgroundColor: '#f7fafc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  remainingCaloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
  },
  remainingCaloriesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    marginLeft: 6,
  },
})