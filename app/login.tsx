import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ ログイン成功");

      // ログイン成功後、ホーム画面にリダイレクト
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("❌ ログインエラー:", error);

      let errorMessage = "ログインに失敗しました";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "このメールアドレスのアカウントが見つかりません";
          break;
        case "auth/wrong-password":
          errorMessage = "パスワードが間違っています";
          break;
        case "auth/invalid-email":
          errorMessage = "メールアドレスの形式が正しくありません";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "ログイン試行回数が多すぎます。しばらく待ってから再試行してください";
          break;
        case "auth/invalid-credential":
          errorMessage = "メールアドレスまたはパスワードが間違っています";
          break;
      }

      Alert.alert("ログインエラー", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>カロリー計算アプリ</Text>
        <Text style={styles.subtitle}>アカウントにログイン</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="パスワード"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
          autoComplete="password"
        />

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>ログイン</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>アカウントを作成</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    padding: 15,
  },
  registerButtonText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 16,
  },
});
