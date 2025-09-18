import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const { profile, loading, calculateBMI, calculateBMR } = useProfile()

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
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/(tabs)/edit-profile')}
        >
          <Text style={styles.editButtonText}>編集</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本情報</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>名前</Text>
          <Text style={styles.value}>{profile?.name || '未設定'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>メールアドレス</Text>
          <Text style={styles.value}>{user?.email || 'Unknown'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>性別</Text>
          <Text style={styles.value}>
            {profile?.gender === 'male' ? '男性' :
             profile?.gender === 'female' ? '女性' : '未設定'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>体型情報</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>身長</Text>
          <Text style={styles.value}>
            {profile?.height ? `${profile.height} cm` : '未設定'}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>体重</Text>
          <Text style={styles.value}>
            {profile?.weight ? `${profile.weight} kg` : '未設定'}
          </Text>
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
          <Text style={styles.value}>
            {profile?.daily_calorie_goal || 2000} kcal
          </Text>
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
})