import { useEffect, useState } from 'react'
import { Pedometer } from 'expo-sensors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useProfile } from '@/hooks/useProfile'

export interface ActivityData {
  steps: number
  distance: number // km
  caloriesBurned: number
  remainingCalories: number // 消費カロリーから食べた分を差し引いた残り
  activeMinutes: number
  isAvailable: boolean
  lastUpdated: Date
}

export const useActivityTracker = () => {
  const { profile } = useProfile()
  const [activityData, setActivityData] = useState<ActivityData>({
    steps: 0,
    distance: 0,
    caloriesBurned: 0,
    remainingCalories: 0,
    activeMinutes: 0,
    isAvailable: false,
    lastUpdated: new Date(),
  })
  const [loading, setLoading] = useState(true)

  // 歩数から距離を計算（平均歩幅を使用）
  const calculateDistance = (steps: number): number => {
    // 身長から推定歩幅を計算: 身長 × 0.45 (一般的な係数)
    const height = profile?.height || 170 // デフォルト170cm
    const averageStepLength = (height * 0.45) / 100 // メートル
    return (steps * averageStepLength) / 1000 // km
  }

  // 歩数から消費カロリーを計算
  const calculateCaloriesBurned = (steps: number): number => {
    // 体重を取得（デフォルト60kg）
    const weight = profile?.weight || 60

    // 修正された計算式: 歩数 × 体重(kg) × 0.0004
    // 1000歩で約30-40kcal消費となるよう調整
    return Math.round(steps * weight * 4)
  }

  // アクティブ時間を推定（歩数から）
  const calculateActiveMinutes = (steps: number): number => {
    // 1分間に約100歩と仮定
    return Math.round(steps / 100)
  }

  // 今日消費したカロリーを保存/取得
  const getTodayConsumedCalories = async (): Promise<number> => {
    const today = new Date().toDateString()
    const key = `consumed_calories_${today}`

    try {
      const stored = await AsyncStorage.getItem(key)
      return stored ? parseInt(stored, 10) : 0
    } catch (error) {
      console.log('Consumed calories storage error:', error)
      return 0
    }
  }

  // 今日消費したカロリーを保存
  const saveTodayConsumedCalories = async (calories: number): Promise<void> => {
    const today = new Date().toDateString()
    const key = `consumed_calories_${today}`

    try {
      await AsyncStorage.setItem(key, calories.toString())
    } catch (error) {
      console.log('Save consumed calories error:', error)
    }
  }

  // 食べ物を消費してカロリーを減らす
  const consumeFood = async (foodCalories: number): Promise<void> => {
    const currentConsumed = await getTodayConsumedCalories()
    const newConsumed = currentConsumed + foodCalories
    await saveTodayConsumedCalories(newConsumed)

    // 残りカロリーを更新
    const remaining = Math.max(0, activityData.caloriesBurned - newConsumed)
    setActivityData(prev => ({
      ...prev,
      remainingCalories: remaining,
      lastUpdated: new Date()
    }))
  }

  // 今日の開始時点での歩数を保存/取得
  const getTodayStartSteps = async (): Promise<number> => {
    const today = new Date().toDateString()
    const key = `steps_start_${today}`

    try {
      const stored = await AsyncStorage.getItem(key)
      if (stored) {
        return parseInt(stored, 10)
      }

      // 今日初回の場合、現在の歩数を開始点として保存
      const end = new Date()
      const start = new Date()
      start.setHours(0, 0, 0, 0)

      const result = await Pedometer.getStepCountAsync(start, end)
      const startSteps = result.steps || 0

      await AsyncStorage.setItem(key, startSteps.toString())
      return startSteps
    } catch (error) {
      console.log('Start steps storage error:', error)
      return 0
    }
  }

  // 歩数データを更新
  const updateActivityData = async () => {
    try {
      // 歩数計が利用可能かチェック
      const isAvailable = await Pedometer.isAvailableAsync()

      if (!isAvailable) {
        setActivityData(prev => ({ ...prev, isAvailable: false, lastUpdated: new Date() }))
        return
      }

      // 今日の開始と現在時刻
      const end = new Date()
      const start = new Date()
      start.setHours(0, 0, 0, 0)

      // 今日の歩数を取得
      const result = await Pedometer.getStepCountAsync(start, end)
      const totalSteps = result.steps || 0

      // 今日の開始点の歩数を取得
      const startSteps = await getTodayStartSteps()

      // 今日の実際の歩数（開始点からの差分）
      const todaySteps = Math.max(0, totalSteps - startSteps)

      // 各種データを計算
      const distance = calculateDistance(todaySteps)
      const caloriesBurned = calculateCaloriesBurned(todaySteps)
      const activeMinutes = calculateActiveMinutes(todaySteps)

      // 今日消費したカロリーを取得して残りを計算
      const consumedCalories = await getTodayConsumedCalories()
      const remainingCalories = Math.max(0, caloriesBurned - consumedCalories)

      setActivityData({
        steps: todaySteps,
        distance,
        caloriesBurned,
        remainingCalories,
        activeMinutes,
        isAvailable: true,
        lastUpdated: new Date(),
      })

    } catch (error) {
      console.log('Activity tracking error:', error)
      setActivityData(prev => ({
        ...prev,
        isAvailable: false,
        remainingCalories: 0,
        lastUpdated: new Date()
      }))
    }
  }

  // リアルタイム歩数監視
  useEffect(() => {
    let subscription: any = null

    const startTracking = async () => {
      setLoading(true)

      try {
        const isAvailable = await Pedometer.isAvailableAsync()

        if (isAvailable) {
          // 初回データ更新
          await updateActivityData()

          // リアルタイム監視を開始
          subscription = Pedometer.watchStepCount((result) => {
            // バックグラウンドでのデータ更新をトリガー
            updateActivityData()
          })
        } else {
          setActivityData(prev => ({ ...prev, isAvailable: false }))
        }
      } catch (error) {
        console.log('Pedometer setup error:', error)
        setActivityData(prev => ({ ...prev, isAvailable: false }))
      } finally {
        setLoading(false)
      }
    }

    startTracking()

    // 定期的な更新（5分ごと）
    const interval = setInterval(updateActivityData, 5 * 60 * 1000)

    return () => {
      if (subscription) {
        subscription.remove()
      }
      clearInterval(interval)
    }
  }, [profile?.height, profile?.weight])

  // 手動でデータを更新
  const refreshActivityData = async () => {
    setLoading(true)
    await updateActivityData()
    setLoading(false)
  }

  // 目標達成率を計算
  const getStepGoalProgress = (goalSteps: number = 10000): number => {
    return Math.min(100, (activityData.steps / goalSteps) * 100)
  }

  // カロリー収支を計算
  const getCalorieBalance = (consumedCalories: number, goalCalories: number) => {
    const bmr = calculateBMR() // 基礎代謝
    const totalBurned = bmr + activityData.caloriesBurned
    const balance = consumedCalories - totalBurned

    return {
      consumed: consumedCalories,
      burned: totalBurned,
      bmr,
      activityBurn: activityData.caloriesBurned,
      balance,
      goalCalories,
    }
  }

  // 基礎代謝計算（プロフィールから）
  const calculateBMR = (): number => {
    if (!profile?.height || !profile?.weight || !profile?.gender) {
      return 1500 // デフォルト値
    }

    // Harris-Benedict式
    let bmr: number
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * 30)
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * 30)
    }

    return Math.round(bmr)
  }

  return {
    activityData,
    loading,
    refreshActivityData,
    getStepGoalProgress,
    getCalorieBalance,
    calculateBMR,
    consumeFood,
  }
}