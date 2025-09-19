import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { eventEmitter, EVENTS } from '@/utils/eventEmitter'

export interface UserProfile {
  id: string
  email: string
  name?: string | null
  height?: number | null  // cm
  weight?: number | null  // kg
  gender?: 'male' | 'female' | 'other' | null
  birth_date?: string | null
  age?: number | null  // 年齢
  activity_level?: number | null  // 活動レベル係数
  daily_calorie_goal?: number | null
  created_at: string
  updated_at: string
}

export const useProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // プロフィール取得
  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // レコードが見つからない場合のエラーコード
        console.error('プロフィール取得エラー:', error)
        return
      }

      if (data) {
        console.log('取得したプロフィールデータ:', data)
        setProfile(data)
      } else {
        console.log('プロフィールが存在しないため作成します')
        // プロフィールが存在しない場合は作成
        await createProfile()
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  // プロフィール作成
  const createProfile = async () => {
    if (!user) return

    try {
      const newProfile = {
        id: user.id,
        email: user.email || '',
        daily_calorie_goal: 2000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single()

      if (error) {
        console.error('プロフィール作成エラー:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('プロフィール作成エラー:', error)
    }
  }

  // プロフィール更新
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return { success: false, error: 'プロフィールが見つかりません' }

    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      console.log('プロフィール更新データ:', updatedData)

      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('プロフィール更新エラー:', error)
        return { success: false, error: error.message }
      }

      console.log('更新後のプロフィールデータ:', data)
      setProfile(data)
      // プロフィール更新イベントを発行
      eventEmitter.emit(EVENTS.PROFILE_UPDATED, data)
      console.log('プロフィール更新イベント発行:', data)
      return { success: true, data }
    } catch (error) {
      console.error('プロフィール更新エラー:', error)
      return { success: false, error: 'プロフィールの更新に失敗しました' }
    }
  }

  // BMI計算
  const calculateBMI = () => {
    if (!profile?.height || !profile?.weight) return null
    const heightInMeters = profile.height / 100
    return Number((profile.weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  // 基礎代謝計算（Harris-Benedict式）
  const calculateBMR = () => {
    if (!profile?.height || !profile?.weight || !profile?.gender) return null

    const age = profile.age || 30 // 年齢が未設定の場合は30歳と仮定
    let bmr: number
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * age)
    }

    return Math.round(bmr)
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  return {
    profile,
    loading,
    updateProfile,
    fetchProfile,
    calculateBMI,
    calculateBMR,
  }
}