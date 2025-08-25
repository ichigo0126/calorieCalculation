import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    height: "",
    weight: "",
    age: "",
    gender: "male",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword, name, height, weight, age } =
      formData;

    if (!email || !password || !name || !height || !weight || !age) {
      Alert.alert("エラー", "すべての項目を入力してください");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("エラー", "パスワードが一致しません");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("エラー", "パスワードは6文字以上で入力してください");
      return false;
    }

    return true;
  };

  const calculateBMR = (
    weight: number,
    height: number,
    age: number,
    gender: string
  ) => {
    // Harris-Benedict式による基礎代謝計算
    if (gender === "male") {
      return Math.round(
        88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      );
    } else {
      return Math.round(447.593 + 9.247 * weight + 3.098 * height - 4.33 * age);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Firebase Authenticationでユーザー作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // ユーザープロフィールを更新
      await updateProfile(user, {
        displayName: formData.name,
      });

      // 基礎代謝を計算
      const bmr = calculateBMR(
        parseInt(formData.weight),
        parseInt(formData.height),
        parseInt(formData.age),
        formData.gender
      );

      // Firestoreにユーザー詳細情報を保存
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        age: parseInt(formData.age),
        gender: formData.gender,
        bmr: bmr,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      Alert.alert(
        "登録完了",
        "アカウントが作成されました！\nカロリー計算アプリを始めましょう。",
        [
          {
            text: "OK",
            onPress: () => {
              // アカウント作成後、ログイン状態のままホーム画面に遷移
              router.replace("/(tabs)/home");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("登録エラー:", error);

      let errorMessage = "アカウント作成に失敗しました";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "このメールアドレスは既に使用されています";
          break;
        case "auth/invalid-email":
          errorMessage = "メールアドレスの形式が正しくありません";
          break;
        case "auth/weak-password":
          errorMessage = "パスワードが弱すぎます";
          break;
      }

      Alert.alert("登録エラー", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>アカウント作成</Text>
        <Text style={styles.subtitle}>基本情報を入力してください</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>アカウント情報</Text>

        <TextInput
          style={styles.input}
          placeholder="お名前"
          value={formData.name}
          onChangeText={(value) => handleInputChange("name", value)}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="パスワード（6文字以上）"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="パスワード確認"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          secureTextEntry
          editable={!isLoading}
        />

        <Text style={styles.sectionTitle}>身体情報</Text>
        <Text style={styles.sectionSubtitle}>基礎代謝計算に使用されます</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="身長 (cm)"
            value={formData.height}
            onChangeText={(value) => handleInputChange("height", value)}
            keyboardType="numeric"
            editable={!isLoading}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="体重 (kg)"
            value={formData.weight}
            onChangeText={(value) => handleInputChange("weight", value)}
            keyboardType="numeric"
            editable={!isLoading}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="年齢"
          value={formData.age}
          onChangeText={(value) => handleInputChange("age", value)}
          keyboardType="numeric"
          editable={!isLoading}
        />

        <View style={styles.genderContainer}>
          <Text style={styles.genderLabel}>性別</Text>
          <View style={styles.genderButtons}>
            {[
              { key: "male", label: "男性" },
              { key: "female", label: "女性" },
              { key: "other", label: "その他" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.genderButton,
                  formData.gender === option.key && styles.genderButtonActive,
                ]}
                onPress={() => handleInputChange("gender", option.key)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    formData.gender === option.key &&
                      styles.genderButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.registerButtonText}>アカウント作成</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToLogin}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>ログイン画面に戻る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    marginTop: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  genderButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#333",
  },
  genderButtonTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 16,
  },
});
