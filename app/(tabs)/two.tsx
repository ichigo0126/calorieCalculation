import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useTodayMeals } from '@/hooks/useTodayMeals'
import { useActivityTracker } from '@/hooks/useActivityTracker'
import { FoodSuggestions } from '@/components/FoodSuggestions'

export default function MealManagementScreen() {
  const { stats, meals, loading, addMeal, fetchTodayMeals } = useTodayMeals()
  const { activityData, consumeFood } = useActivityTracker()
  const [isAddingMeal, setIsAddingMeal] = useState(false)
  const [mealForm, setMealForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal_type: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack'
  })

  const handleAddMeal = async () => {
    if (!mealForm.name || !mealForm.calories) {
      Alert.alert('エラー', '食事名とカロリーは必須です')
      return
    }

    const result = await addMeal({
      name: mealForm.name,
      calories: Number(mealForm.calories),
      protein: mealForm.protein ? Number(mealForm.protein) : undefined,
      carbs: mealForm.carbs ? Number(mealForm.carbs) : undefined,
      fat: mealForm.fat ? Number(mealForm.fat) : undefined,
      meal_type: mealForm.meal_type
    })

    if (result) {
      setMealForm({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        meal_type: 'breakfast'
      })
      setIsAddingMeal(false)
      Alert.alert('成功', '食事を追加しました')
    } else {
      Alert.alert('エラー', '食事の追加に失敗しました')
    }
  }

  const getMealTypeColor = (type?: string) => {
    switch (type) {
      case 'breakfast': return '#fbb6ce'
      case 'lunch': return '#bee3f8'
      case 'dinner': return '#c6f6d5'
      case 'snack': return '#fde68a'
      default: return '#e2e8f0'
    }
  }

  const getMealTypeName = (type?: string) => {
    switch (type) {
      case 'breakfast': return '朝食'
      case 'lunch': return '昼食'
      case 'dinner': return '夕食'
      case 'snack': return '間食'
      default: return 'その他'
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
        <Text style={styles.title}>食事管理</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingMeal(true)}
        >
          <FontAwesome name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* 摂取カロリー概要 */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>今日の摂取カロリー</Text>
        <View style={styles.calorieDisplay}>
          <Text style={styles.totalCalories}>{stats.totalCalories}</Text>
          <Text style={styles.goalCalories}>/ {stats.goalCalories} kcal</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progress, {
              width: `${Math.min(100, stats.progressPercentage)}%`,
              backgroundColor: stats.progressPercentage > 100 ? '#e53e3e' : '#38a169'
            }]}
          />
        </View>
        <View style={styles.nutritionSummary}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>P: {stats.totalProtein.toFixed(1)}g</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>C: {stats.totalCarbs.toFixed(1)}g</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>F: {stats.totalFat.toFixed(1)}g</Text>
          </View>
        </View>
      </View>

      {/* 消費カロリー分の食事提案 */}
      <View style={styles.suggestionCard}>
        <Text style={styles.cardTitle}>食べられる食事提案</Text>
        <Text style={styles.suggestionSubtitle}>
          消費カロリー {activityData.remainingCalories} kcal分
        </Text>
        <FoodSuggestions
          burnedCalories={activityData.remainingCalories}
          onFoodSelect={async (food) => {
            try {
              // 1. 消費カロリーから差し引く
              await consumeFood(food.food.calories)

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
                Alert.alert('完了', `${food.food.food_name}を食事記録に追加しました！`)
                fetchTodayMeals(false)
              }
            } catch (error) {
              Alert.alert('エラー', '食事の追加に失敗しました')
            }
          }}
        />
      </View>

      {/* 今日の食事一覧 */}
      <View style={styles.mealsListCard}>
        <Text style={styles.cardTitle}>今日の食事記録</Text>
        {meals.length > 0 ? (
          meals.map((meal, index) => (
            <View key={meal.id || index} style={styles.mealItem}>
              <View style={styles.mealHeader}>
                <View style={[styles.mealTypeBadge, { backgroundColor: getMealTypeColor(meal.meal_type) }]}>
                  <Text style={styles.mealTypeText}>{getMealTypeName(meal.meal_type)}</Text>
                </View>
                <Text style={styles.mealTime}>
                  {meal.meal_time ? new Date(meal.meal_time).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '--:--'}
                </Text>
              </View>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>まだ食事記録がありません</Text>
        )}
      </View>

      {/* 食事追加モーダル */}
      {isAddingMeal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>食事を追加</Text>

            <TextInput
              style={styles.input}
              placeholder="食事名"
              value={mealForm.name}
              onChangeText={(text) => setMealForm({...mealForm, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="カロリー"
              value={mealForm.calories}
              onChangeText={(text) => setMealForm({...mealForm, calories: text})}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="タンパク質 (g)"
              value={mealForm.protein}
              onChangeText={(text) => setMealForm({...mealForm, protein: text})}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="炭水化物 (g)"
              value={mealForm.carbs}
              onChangeText={(text) => setMealForm({...mealForm, carbs: text})}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="脂質 (g)"
              value={mealForm.fat}
              onChangeText={(text) => setMealForm({...mealForm, fat: text})}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddingMeal(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddMeal}
              >
                <Text style={styles.saveButtonText}>追加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  addButton: {
    backgroundColor: '#4299e1',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
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
  calorieDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  totalCalories: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  goalCalories: {
    fontSize: 16,
    color: '#718096',
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progress: {
    height: '100%',
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
  },
  suggestionCard: {
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
  suggestionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  mealsListCard: {
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
  mealItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3748',
  },
  mealTime: {
    fontSize: 12,
    color: '#718096',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 14,
    color: '#e53e3e',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#718096',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#718096',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4299e1',
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
