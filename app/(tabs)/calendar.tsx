import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Calendar } from 'react-native-calendars'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface MealRecord {
  id: string
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  meal_time: string
  meal_type?: string
}

export default function CalendarScreen() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [meals, setMeals] = useState<MealRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [mealDates, setMealDates] = useState<{ [key: string]: any }>({})

  // 選択した日付の食事記録を取得
  const fetchMealsForDate = async (date: string) => {
    if (!user) return

    setLoading(true)
    try {
      const startOfDay = `${date}T00:00:00`
      const endOfDay = `${date}T23:59:59`

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('meal_time', startOfDay)
        .lte('meal_time', endOfDay)
        .order('meal_time', { ascending: true })

      if (error) {
        console.error('食事記録取得エラー:', error)
        return
      }

      setMeals(data || [])
    } catch (error) {
      console.error('食事記録取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  // カレンダーに表示するマーク用のデータを取得
  const fetchMealDates = async () => {
    if (!user) return

    try {
      // 今月の食事記録があるデータを取得
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const { data, error } = await supabase
        .from('meals')
        .select('meal_time, calories')
        .eq('user_id', user.id)
        .gte('meal_time', startOfMonth.toISOString())
        .lte('meal_time', endOfMonth.toISOString())

      if (error) {
        console.error('食事日付取得エラー:', error)
        return
      }

      // 日付別のカロリー合計を計算
      const dateCalories: { [key: string]: number } = {}
      data?.forEach((meal) => {
        const date = meal.meal_time.split('T')[0]
        dateCalories[date] = (dateCalories[date] || 0) + meal.calories
      })

      // カレンダー用のマーク形式に変換
      const markedDates: { [key: string]: any } = {}
      Object.keys(dateCalories).forEach((date) => {
        const calories = dateCalories[date]
        markedDates[date] = {
          marked: true,
          dotColor: calories > 2500 ? '#e53e3e' : calories > 2000 ? '#d69e2e' : '#38a169',
          customStyles: {
            container: {
              backgroundColor: calories > 2500 ? '#fed7d7' : calories > 2000 ? '#fef5e7' : '#f0fff4',
              borderRadius: 16,
            },
            text: {
              color: '#2d3748',
              fontWeight: 'bold',
            },
          },
        }
      })

      // 選択した日付のスタイルを追加
      if (markedDates[selectedDate]) {
        markedDates[selectedDate].selected = true
        markedDates[selectedDate].selectedColor = '#4299e1'
      } else {
        markedDates[selectedDate] = {
          selected: true,
          selectedColor: '#4299e1',
        }
      }

      setMealDates(markedDates)
    } catch (error) {
      console.error('食事日付取得エラー:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMealsForDate(selectedDate)
      fetchMealDates()
    }
  }, [user, selectedDate])

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString)
  }

  const getTotalCalories = () => {
    return meals.reduce((total, meal) => total + meal.calories, 0)
  }

  const getMealTypeColor = (mealType?: string) => {
    switch (mealType) {
      case 'breakfast': return '#fbb6ce'
      case 'lunch': return '#bee3f8'
      case 'dinner': return '#c6f6d5'
      case 'snack': return '#fde68a'
      default: return '#e2e8f0'
    }
  }

  const getMealTypeName = (mealType?: string) => {
    switch (mealType) {
      case 'breakfast': return '朝食'
      case 'lunch': return '昼食'
      case 'dinner': return '夕食'
      case 'snack': return '間食'
      default: return 'その他'
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>カロリーカレンダー</Text>
        <Text style={styles.subtitle}>日付をタップして食事記録を確認</Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={mealDates}
          markingType="custom"
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#4299e1',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#4299e1',
            dayTextColor: '#2d3748',
            textDisabledColor: '#a0aec0',
            arrowColor: '#4299e1',
            monthTextColor: '#2d3748',
            indicatorColor: '#4299e1',
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
          }}
        />
      </View>

      <View style={styles.dateInfoContainer}>
        <Text style={styles.dateInfoTitle}>
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </Text>
        <Text style={styles.totalCalories}>
          合計カロリー: {getTotalCalories()} kcal
        </Text>
      </View>

      <View style={styles.mealsContainer}>
        <Text style={styles.mealsTitle}>食事記録</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4299e1" />
            <Text style={styles.loadingText}>読み込み中...</Text>
          </View>
        ) : meals.length > 0 ? (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={[
                  styles.mealTypeBadge,
                  { backgroundColor: getMealTypeColor(meal.meal_type) }
                ]}>
                  <Text style={styles.mealTypeText}>
                    {getMealTypeName(meal.meal_type)}
                  </Text>
                </View>
                <Text style={styles.mealTime}>
                  {new Date(meal.meal_time).toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <Text style={styles.mealName}>{meal.name}</Text>
              <View style={styles.nutritionRow}>
                <Text style={styles.calories}>{meal.calories} kcal</Text>
                {meal.protein && (
                  <Text style={styles.nutrition}>P: {meal.protein}g</Text>
                )}
                {meal.carbs && (
                  <Text style={styles.nutrition}>C: {meal.carbs}g</Text>
                )}
                {meal.fat && (
                  <Text style={styles.nutrition}>F: {meal.fat}g</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>この日の食事記録はありません</Text>
            <Text style={styles.emptySubtext}>食事記録タブから記録を追加しましょう</Text>
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
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  calendarContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateInfoContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  totalCalories: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4299e1',
  },
  mealsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mealsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  loadingContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#718096',
  },
  mealCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    borderRadius: 6,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3748',
  },
  mealTime: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53e3e',
  },
  nutrition: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
  },
})