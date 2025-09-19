import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { eventEmitter, EVENTS } from '@/utils/eventEmitter'

export interface TodayMeal {
  id: string
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  meal_time: string
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export interface TodayStats {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  mealCount: number
  goalCalories: number
  remainingCalories: number
  progressPercentage: number
}

export const useTodayMeals = () => {
  const { user } = useAuth()
  const { profile } = useProfile()
  const [meals, setMeals] = useState<TodayMeal[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TodayStats>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    mealCount: 0,
    goalCalories: 2000,
    remainingCalories: 2000,
    progressPercentage: 0,
  })

  // 基礎代謝を計算（Harris-Benedict式）
  const calculateBMR = (): number => {
    if (!profile?.height || !profile?.weight || !profile?.gender) {
      console.log('BMR計算: プロフィール情報不足、デフォルト値1500を使用')
      return 1500 // デフォルト値
    }

    // 年齢のデフォルト値（30歳と仮定）
    const age = profile.age || 30

    let bmr: number
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * age)
      console.log(`BMR計算（男性）: 88.362 + (13.397 × ${profile.weight}) + (4.799 × ${profile.height}) - (5.677 × ${age}) = ${bmr}`)
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * age)
      console.log(`BMR計算（女性）: 447.593 + (9.247 × ${profile.weight}) + (3.098 × ${profile.height}) - (4.330 × ${age}) = ${bmr}`)
    }

    return Math.round(bmr)
  }

  // 目標カロリーを計算（BMR × 活動レベル）
  const calculateGoalCalories = (): number => {
    console.log('目標カロリー計算 - プロフィール全体:', profile)
    console.log('目標カロリー計算 - プロフィール詳細:', {
      height: profile?.height,
      weight: profile?.weight,
      gender: profile?.gender,
      age: profile?.age,
      daily_calorie_goal: profile?.daily_calorie_goal
    })

    // プロフィール情報が設定されている場合は、その目標カロリーを使用
    if (profile?.daily_calorie_goal && profile.daily_calorie_goal > 0) {
      console.log('プロフィールの目標カロリーを使用:', profile.daily_calorie_goal)
      return profile.daily_calorie_goal
    }

    // プロフィール情報がない場合はBMRから計算
    const bmr = calculateBMR()
    console.log('計算されたBMR:', bmr)

    // 活動レベル係数（軽い活動：1.4、普通：1.6、活発：1.8）
    const activityLevel = profile?.activity_level || 1.5
    const goalCalories = Math.round(bmr * activityLevel)

    console.log('BMRベース目標カロリー:', goalCalories)
    return goalCalories
  }

  // 今日の食事データを取得
  const fetchTodayMeals = async (showLoading = true) => {
    if (!user) return

    try {
      if (showLoading) {
        setLoading(true)
      }

      // 今日の開始と終了時刻を計算
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

      const { data: mealsData, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('meal_time', startOfDay.toISOString())
        .lte('meal_time', endOfDay.toISOString())
        .order('meal_time', { ascending: true })

      // デバッグ: テーブル取得エラーも確認
      if (mealsError) {
        console.error('テーブル取得エラー:', mealsError)
        alert(`取得エラー: ${mealsError.message}`)
      }

      if (mealsError) {
        console.error('今日の食事取得エラー:', mealsError)
        return
      }

      // 目標カロリーを計算（プロフィール情報から自動計算）
      const goalCalories = calculateGoalCalories()

      setMeals(mealsData || [])
      calculateStats(mealsData || [], goalCalories)
    } catch (error) {
      console.error('今日の食事取得エラー:', error)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  // 統計を計算
  const calculateStats = (mealsData: TodayMeal[], goalCalories: number) => {
    const totalCalories = mealsData.reduce((sum, meal) => sum + meal.calories, 0)
    const totalProtein = mealsData.reduce((sum, meal) => sum + (meal.protein || 0), 0)
    const totalCarbs = mealsData.reduce((sum, meal) => sum + (meal.carbs || 0), 0)
    const totalFat = mealsData.reduce((sum, meal) => sum + (meal.fat || 0), 0)

    const remainingCalories = Math.max(0, goalCalories - totalCalories)
    const progressPercentage = Math.min(100, (totalCalories / goalCalories) * 100)

    setStats({
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      mealCount: mealsData.length,
      goalCalories,
      remainingCalories,
      progressPercentage,
    })
  }

  // 食事タイプ別の統計を取得
  const getMealTypeStats = () => {
    const mealTypes: { [key: string]: { count: number; calories: number } } = {
      breakfast: { count: 0, calories: 0 },
      lunch: { count: 0, calories: 0 },
      dinner: { count: 0, calories: 0 },
      snack: { count: 0, calories: 0 },
    }

    meals.forEach(meal => {
      const type = meal.meal_type || 'snack'
      mealTypes[type].count += 1
      mealTypes[type].calories += meal.calories
    })

    return mealTypes
  }

  // 最近の食事を取得（最新3件）
  const getRecentMeals = () => {
    return meals.slice(-3).reverse()
  }

  // 食事を追加
  const addMeal = async (meal: {
    name: string
    calories: number
    protein?: number
    carbs?: number
    fat?: number
    meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  }) => {
    if (!user) {
      console.error('ユーザーが認証されていません')
      return false
    }

    try {
      console.log('食事追加開始:', meal)

      // Supabaseに食事を追加（最小限のデータでテスト）
      const { data, error } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          name: meal.name,
          calories: meal.calories,
          meal_time: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase食事追加エラー:', error)
        alert(`DB エラー: ${error.message}`)
        return false
      }

      console.log('Supabase追加成功:', data)

      // 食事追加成功後、データを再取得して画面を更新
      if (data) {
        console.log('食事追加成功、データ再取得中...')
        // イベントを発行して全体に更新を通知
        eventEmitter.emit(EVENTS.MEAL_ADDED, data)
        // 少し待ってから今日の食事データを再取得（バックグラウンド）
        setTimeout(() => {
          fetchTodayMeals(false)
        }, 200)
      }

      return true
    } catch (error) {
      console.error('食事追加エラー:', error)
      return false
    }
  }

  useEffect(() => {
    if (user) {
      fetchTodayMeals()
    } else {
      setMeals([])
      setStats({
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealCount: 0,
        goalCalories: 2000,
        remainingCalories: 2000,
        progressPercentage: 0,
      })
      setLoading(false)
    }
  }, [user])

  // プロフィール更新イベントを監視して目標カロリーを再計算
  useEffect(() => {
    const handleProfileUpdated = (updatedProfile: any) => {
      console.log('プロフィール更新イベント受信:', updatedProfile)
      if (user && meals.length >= 0) { // mealsが空でも再計算
        const newGoalCalories = calculateGoalCalories()
        console.log('新しい目標カロリー:', newGoalCalories)
        calculateStats(meals, newGoalCalories)
      }
    }

    eventEmitter.on(EVENTS.PROFILE_UPDATED, handleProfileUpdated)

    return () => {
      eventEmitter.off(EVENTS.PROFILE_UPDATED, handleProfileUpdated)
    }
  }, [user, meals])

  // プロフィールデータの直接的な変更も監視
  useEffect(() => {
    if (user && profile) {
      console.log('プロフィールデータ変更検知:', profile)
      const newGoalCalories = calculateGoalCalories()
      console.log('計算された目標カロリー:', newGoalCalories)
      if (meals.length >= 0) {
        calculateStats(meals, newGoalCalories)
      }
    }
  }, [profile?.height, profile?.weight, profile?.gender, profile?.age, profile?.activity_level])

  // バックグラウンドでの定期更新（ローディング表示なし）
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        fetchTodayMeals(false) // ローディング表示なし
      }
    }, 5000) // 5秒ごとに更新チェック（頻度を下げる）

    return () => clearInterval(interval)
  }, [user])

  // 食事追加イベントを監視
  useEffect(() => {
    const handleMealAdded = () => {
      console.log('食事追加イベント受信、データ更新中...')
      if (user) {
        fetchTodayMeals(false) // バックグラウンド更新
      }
    }

    eventEmitter.on(EVENTS.MEAL_ADDED, handleMealAdded)

    return () => {
      eventEmitter.off(EVENTS.MEAL_ADDED, handleMealAdded)
    }
  }, [user])

  return {
    meals,
    stats,
    loading,
    fetchTodayMeals,
    getMealTypeStats,
    getRecentMeals,
    addMeal,
  }
}