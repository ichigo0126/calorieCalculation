import { useEffect, useState } from 'react'
import { Platform, PermissionsAndroid } from 'react-native'
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

  // Android用の権限要求
  const requestAndroidPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true

    try {
      console.log('Android権限要求開始')

      // タイムアウト付きで権限要求
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Permission request timeout')), 10000) // 10秒タイムアウト
      })

      const permissionPromise = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: '活動認識の許可',
          message: '歩数を計測するために活動認識の許可が必要です。',
          buttonNeutral: '後で',
          buttonNegative: 'キャンセル',
          buttonPositive: 'OK',
        }
      )

      const granted = await Promise.race([permissionPromise, timeoutPromise])
      console.log('Android 権限結果:', granted)
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (error) {
      console.log('Android 権限要求エラー:', error)
      // タイムアウトまたは権限拒否の場合はfalseを返す
      return false
    }
  }

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

  // 今日の開始時点での歩数を保存/取得（iOS用）
  const getTodayStartSteps = async (): Promise<number> => {
    if (Platform.OS !== 'ios') return 0

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

  // Android用: 今日の歩数をAsyncStorageから取得
  const getTodayStepsFromStorage = async (): Promise<number> => {
    const today = new Date().toDateString()
    const key = `android_steps_${today}`

    try {
      const stored = await AsyncStorage.getItem(key)
      return stored ? parseInt(stored, 10) : 0
    } catch (error) {
      console.log('Android steps storage error:', error)
      return 0
    }
  }

  // Android用: 今日の歩数をAsyncStorageに保存
  const saveTodayStepsToStorage = async (steps: number): Promise<void> => {
    const today = new Date().toDateString()
    const key = `android_steps_${today}`

    try {
      await AsyncStorage.setItem(key, steps.toString())
      console.log('Android: 歩数保存完了:', steps)
    } catch (error) {
      console.log('Android steps save error:', error)
    }
  }

  // 歩数データを更新
  const updateActivityData = async (showLoading = false) => {
    console.log('updateActivityData 開始 - showLoading:', showLoading)
    try {
      if (showLoading) {
        console.log('ローディング開始')
        setLoading(true)
      }

      console.log('歩数データ更新開始 - プラットフォーム:', Platform.OS)

      // Android の場合は権限をチェック
      if (Platform.OS === 'android') {
        console.log('Android権限チェック開始')

        // まず既存の権限をチェック
        const hasExistingPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
        )

        console.log('既存権限チェック結果:', hasExistingPermission)

        if (!hasExistingPermission) {
          console.log('Android権限が許可されていません。設定から手動で許可してください。')
          console.log('設定 → アプリ → calorieCalculation → 権限 → 身体活動 → 許可')

          // 権限がない場合でも歩数計を試行（一部デバイスでは動作する可能性）
          console.log('権限なしでも歩数計の動作を試行します')
        } else {
          console.log('Android権限OK')
        }
      }

      // 歩数計が利用可能かチェック
      const isAvailable = await Pedometer.isAvailableAsync()
      console.log('Pedometer.isAvailableAsync() 結果:', isAvailable)

      if (!isAvailable) {
        console.log('歩数計が利用できません')

        // 開発環境の場合、モックデータを使用
        if (__DEV__) {
          console.log('開発環境のため、モックデータを使用します')
          const mockSteps = 3000 + Math.floor(Math.random() * 2000) // 3000-5000歩のランダム値
          const mockDistance = calculateDistance(mockSteps)
          const mockCaloriesBurned = calculateCaloriesBurned(mockSteps)
          const mockActiveMinutes = calculateActiveMinutes(mockSteps)

          setActivityData({
            steps: mockSteps,
            distance: mockDistance,
            caloriesBurned: mockCaloriesBurned,
            remainingCalories: mockCaloriesBurned,
            activeMinutes: mockActiveMinutes,
            isAvailable: true, // モックデータとして利用可能扱い
            lastUpdated: new Date(),
          })

          console.log('モックデータ設定完了:', {
            steps: mockSteps,
            distance: mockDistance,
            caloriesBurned: mockCaloriesBurned
          })

          if (showLoading) {
            console.log('モックデータ - ローディング終了')
            setLoading(false)
          }
          return
        }

        setActivityData(prev => ({ ...prev, isAvailable: false, lastUpdated: new Date() }))
        if (showLoading) {
          console.log('歩数計利用不可 - ローディング終了')
          setLoading(false)
        }
        return
      }

      let todaySteps = 0

      if (Platform.OS === 'ios') {
        // iOSの場合は従来の方法を使用
        const end = new Date()
        const start = new Date()
        start.setHours(0, 0, 0, 0)

        console.log('iOS: 歩数取得期間:', {
          start: start.toISOString(),
          end: end.toISOString()
        })

        try {
          const result = await Pedometer.getStepCountAsync(start, end)
          console.log('iOS: Pedometer.getStepCountAsync() 結果:', result)
          const totalSteps = result.steps || 0

          const startSteps = await getTodayStartSteps()
          console.log('iOS: 開始点歩数:', startSteps)

          todaySteps = Math.max(0, totalSteps - startSteps)
          console.log('iOS: 計算された今日の歩数:', todaySteps)
        } catch (error) {
          console.error('iOS歩数取得エラー:', error)
          todaySteps = 0
        }
      } else {
        // Androidの場合はAsyncStorageから今日の歩数を取得
        console.log('Android: 保存された歩数データを取得')
        todaySteps = await getTodayStepsFromStorage()
        console.log('Android: 取得した今日の歩数:', todaySteps)
      }

      // 各種データを計算
      const distance = calculateDistance(todaySteps)
      const caloriesBurned = calculateCaloriesBurned(todaySteps)
      const activeMinutes = calculateActiveMinutes(todaySteps)

      // 今日消費したカロリーを取得して残りを計算
      const consumedCalories = await getTodayConsumedCalories()
      const remainingCalories = Math.max(0, caloriesBurned - consumedCalories)

      console.log('活動データ設定中:', {
        steps: todaySteps,
        distance,
        caloriesBurned,
        remainingCalories,
        activeMinutes,
        isAvailable: true
      })

      setActivityData({
        steps: todaySteps,
        distance,
        caloriesBurned,
        remainingCalories,
        activeMinutes,
        isAvailable: true,
        lastUpdated: new Date(),
      })

      console.log('活動データ設定完了')

    } catch (error) {
      console.error('Activity tracking error:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        platform: Platform.OS
      })
      setActivityData(prev => ({
        ...prev,
        isAvailable: false,
        remainingCalories: 0,
        lastUpdated: new Date()
      }))
    } finally {
      if (showLoading) {
        console.log('finally - ローディング終了')
        setLoading(false)
      }
      console.log('updateActivityData 完了')
    }
  }

  // リアルタイム歩数監視
  useEffect(() => {
    let subscription: any = null
    let androidStepCount = 0 // Android用の歩数カウンター

    const startTracking = async () => {
      console.log('startTracking 開始')
      try {
        console.log('Pedometer.isAvailableAsync チェック中...')
        const isAvailable = await Pedometer.isAvailableAsync()
        console.log('startTracking - isAvailable:', isAvailable)

        if (isAvailable) {
          console.log('初回データ更新開始（ローディングあり）')
          // 初回データ更新（ローディング表示あり）
          await updateActivityData(true)
          console.log('初回データ更新完了')

          // リアルタイム監視を開始
          console.log('リアルタイム監視開始')

          if (Platform.OS === 'android') {
            // Android用: 今日の保存済み歩数を初期値として設定
            androidStepCount = await getTodayStepsFromStorage()
            console.log('Android: 初期歩数:', androidStepCount)
          }

          subscription = Pedometer.watchStepCount((result) => {
            console.log('歩数変化検知:', result)

            if (Platform.OS === 'android') {
              // Androidの場合は歩数を累積
              androidStepCount += result.steps || 0
              console.log('Android: 累積歩数:', androidStepCount)
              saveTodayStepsToStorage(androidStepCount)
            }

            // バックグラウンドでのデータ更新をトリガー（ローディング表示なし）
            updateActivityData(false)
          })
        } else {
          console.log('startTracking - 歩数計利用不可')
          setActivityData(prev => ({ ...prev, isAvailable: false }))
          setLoading(false)
        }
      } catch (error) {
        console.log('Pedometer setup error:', error)
        setActivityData(prev => ({ ...prev, isAvailable: false }))
        setLoading(false)
      }
      console.log('startTracking 完了')
    }

    startTracking()

    // 定期的な更新（5分ごと、ローディング表示なし）
    const interval = setInterval(() => updateActivityData(false), 5 * 60 * 1000)

    return () => {
      if (subscription) {
        subscription.remove()
      }
      clearInterval(interval)
    }
  }, [])

  // 手動でデータを更新
  const refreshActivityData = async () => {
    await updateActivityData(true)
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