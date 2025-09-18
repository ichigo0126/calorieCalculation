import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const { profile, loading, updateProfile, calculateBMI, calculateBMR } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    gender: 'other' as 'male' | 'female' | 'other',
    daily_calorie_goal: '2000',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        height: profile.height ? profile.height.toString() : '',
        weight: profile.weight ? profile.weight.toString() : '',
        gender: profile.gender || 'other',
        daily_calorie_goal: profile.daily_calorie_goal ? profile.daily_calorie_goal.toString() : '2000',
      })
    }
  }, [profile])

  const handleSave = async () => {
    // バリデーション
    if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) < 100 || Number(formData.height) > 250)) {
      Alert.alert('エラー', '身長は100-250cmの範囲で入力してください')
      return
    }

    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 30 || Number(formData.weight) > 200)) {
      Alert.alert('エラー', '体重は30-200kgの範囲で入力してください')
      return
    }

    if (formData.daily_calorie_goal && (isNaN(Number(formData.daily_calorie_goal)) || Number(formData.daily_calorie_goal) < 800 || Number(formData.daily_calorie_goal) > 5000)) {
      Alert.alert('エラー', '目標カロリーは800-5000kcalの範囲で入力してください')
      return
    }

    setSaving(true)

    try {
      const updates = {
        name: formData.name || undefined,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        gender: formData.gender as 'male' | 'female' | 'other' | undefined,
        daily_calorie_goal: formData.daily_calorie_goal ? Number(formData.daily_calorie_goal) : 2000,
      }

      const result = await updateProfile(updates)

      if (result.success) {
        setIsEditing(false)
        Alert.alert('保存完了', 'プロフィールを更新しました')
      } else {
        Alert.alert('エラー', result.error || 'プロフィールの更新に失敗しました')
      }
    } catch (error) {
      Alert.alert('エラー', 'プロフィールの更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // フォームデータをリセット
    if (profile) {
      setFormData({
        name: profile.name || '',
        height: profile.height ? profile.height.toString() : '',
        weight: profile.weight ? profile.weight.toString() : '',
        gender: profile.gender || 'other',
        daily_calorie_goal: profile.daily_calorie_goal ? profile.daily_calorie_goal.toString() : '2000',
      })
    }
    setIsEditing(false)
  }

  const handleSignOut = async () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut()
            if (error) {
              Alert.alert('エラー', 'ログアウトに失敗しました')
            }
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
        <Text style={styles.loadingText}>プロフィールを読み込み中...</Text>
      </View>
    )
  }

  const bmi = calculateBMI()
  const bmr = calculateBMR()

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: '低体重', color: '#3182ce' }
    if (bmi < 25) return { text: '普通体重', color: '#38a169' }
    if (bmi < 30) return { text: '肥満(1度)', color: '#d69e2e' }
    return { text: '肥満(2度以上)', color: '#e53e3e' }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>プロフィール</Text>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>編集</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? '保存中...' : '保存'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本情報</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>名前</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="山田太郎"
              autoCapitalize="words"
            />
          ) : (
            <Text style={styles.value}>{profile?.name || '未設定'}</Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>メールアドレス</Text>
          <Text style={styles.value}>{user?.email || 'Unknown'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>性別</Text>
          {isEditing ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="選択してください" value="other" />
                <Picker.Item label="男性" value="male" />
                <Picker.Item label="女性" value="female" />
              </Picker>
            </View>
          ) : (
            <Text style={styles.value}>
              {profile?.gender === 'male' ? '男性' :
               profile?.gender === 'female' ? '女性' : '未設定'}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>体型情報</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>身長</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.height}
              onChangeText={(text) => setFormData({ ...formData, height: text })}
              placeholder="170"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.value}>
              {profile?.height ? `${profile.height} cm` : '未設定'}
            </Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>体重</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(text) => setFormData({ ...formData, weight: text })}
              placeholder="60"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.value}>
              {profile?.weight ? `${profile.weight} kg` : '未設定'}
            </Text>
          )}
        </View>
        {bmi && (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>BMI</Text>
            <View style={styles.bmiContainer}>
              <Text style={styles.value}>{bmi}</Text>
              <Text style={[styles.bmiStatus, { color: getBMIStatus(bmi).color }]}>
                ({getBMIStatus(bmi).text})
              </Text>
            </View>
          </View>
        )}
        {bmr && (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>基礎代謝</Text>
            <Text style={styles.value}>{bmr} kcal/日</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>カロリー設定</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>1日の目標カロリー</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.daily_calorie_goal}
              onChangeText={(text) => setFormData({ ...formData, daily_calorie_goal: text })}
              placeholder="2000"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.value}>
              {profile?.daily_calorie_goal || 2000} kcal
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アカウント</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>登録日</Text>
          <Text style={styles.value}>
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('ja-JP')
              : 'Unknown'
            }
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>ログアウト</Text>
        </TouchableOpacity>
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
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  editButton: {
    backgroundColor: '#4299e1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fafc',
  },
  settingText: {
    fontSize: 16,
    color: '#2d3748',
  },
  settingValue: {
    fontSize: 16,
    color: '#718096',
  },
  signOutButton: {
    backgroundColor: '#e53e3e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bmiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bmiStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    height: 40,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f7fafc',
    marginTop: 4,
  },
  pickerContainer: {
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#f7fafc',
    marginTop: 4,
    minHeight: 48,
    justifyContent: 'center',
  },
  picker: {
    height: 52,
    ...Platform.select({
      ios: {
        marginVertical: -8,
      },
      android: {
        marginVertical: -8,
      },
    }),
  },
  pickerItem: {
    fontSize: 16,
    height: 48,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        height: 48,
      },
      android: {
        textAlignVertical: 'center',
      },
    }),
  },
  saveButton: {
    backgroundColor: '#4299e1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '600',
  },
})