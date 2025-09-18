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
} from 'react-native'
import { router } from 'expo-router'
import { Picker } from '@react-native-picker/picker'
import { useProfile } from '@/hooks/useProfile'

export default function EditProfileScreen() {
  const { profile, loading, updateProfile } = useProfile()
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    gender: 'other' as 'male' | 'female' | 'other',
    daily_calorie_goal: '2000',
  })
  const [saving, setSaving] = useState(false)

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
        name: formData.name || null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        gender: formData.gender,
        daily_calorie_goal: formData.daily_calorie_goal ? Number(formData.daily_calorie_goal) : 2000,
      }

      const result = await updateProfile(updates)

      if (result.success) {
        Alert.alert('保存完了', 'プロフィールを更新しました', [
          { text: 'OK', onPress: () => router.back() }
        ])
      } else {
        Alert.alert('エラー', result.error || 'プロフィールの更新に失敗しました')
      }
    } catch (error) {
      Alert.alert('エラー', 'プロフィールの更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
        <Text style={styles.loadingText}>プロフィールを読み込み中...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>プロフィール編集</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>名前</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="山田太郎"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>身長 (cm)</Text>
          <TextInput
            style={styles.input}
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
            placeholder="170"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>体重 (kg)</Text>
          <TextInput
            style={styles.input}
            value={formData.weight}
            onChangeText={(text) => setFormData({ ...formData, weight: text })}
            placeholder="60"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>性別</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              style={styles.picker}
            >
              <Picker.Item label="選択してください" value="other" />
              <Picker.Item label="男性" value="male" />
              <Picker.Item label="女性" value="female" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>1日の目標カロリー (kcal)</Text>
          <TextInput
            style={styles.input}
            value={formData.daily_calorie_goal}
            onChangeText={(text) => setFormData({ ...formData, daily_calorie_goal: text })}
            placeholder="2000"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>キャンセル</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  form: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f7fafc',
  },
  pickerContainer: {
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f7fafc',
  },
  picker: {
    height: 48,
  },
  saveButton: {
    backgroundColor: '#4299e1',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#718096',
    fontSize: 16,
    fontWeight: '600',
  },
})