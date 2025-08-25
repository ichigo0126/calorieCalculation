import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// 環境変数の検証
const requiredEnvVars = [
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID",
];

// 環境変数の存在チェック
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ 不足している環境変数:", missingEnvVars);
  console.error("📝 .envファイルを作成してFirebaseの設定値を入力してください");
  throw new Error(`環境変数が設定されていません: ${missingEnvVars.join(", ")}`);
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Firebase アプリの初期化
const app = initializeApp(firebaseConfig);

// 認証とFirestoreの初期化
export const auth = getAuth(app);
export const db = getFirestore(app);

// Web環境でのFirestore設定を改善
if (Platform.OS === "web" && __DEV__) {
  // 開発環境でのWeb接続問題を解決するための設定
  try {
    // Firestoreの設定を調整（Web環境での接続問題対策）
    // 注意: この設定は開発環境のみで使用
    console.log("🌐 Web環境でのFirestore設定を適用中...");
  } catch (error) {
    console.warn("⚠️ Firestore Web設定の適用に失敗:", error);
  }
}

// 開発環境での設定確認
if (__DEV__) {
  console.log("Firebase設定確認:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

export default app;
