import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase設定（直接指定）
const firebaseConfig = {
  apiKey: "AIzaSyDgbt7sg3D4vFPIB04ZnX6H0Wdd_qkJZks",
  authDomain: "caloriecalculation-cde9f.firebaseapp.com",
  projectId: "caloriecalculation-cde9f",
  storageBucket: "caloriecalculation-cde9f.firebasestorage.app",
  messagingSenderId: "27387575991",
  appId: "1:27387575991:web:0e21e7c756691055d65732"
};

// 設定値の確認
console.log('Firebase config:', firebaseConfig);

// 必須の設定値がすべて存在するかチェック
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase configuration is incomplete:', firebaseConfig);
  throw new Error('Firebase configuration is missing required values');
}

// Firebase初期化
const app = initializeApp(firebaseConfig);

// Firebase Authインスタンス
export const auth = getAuth(app);

// Firestore インスタンス
export const db = getFirestore(app);

export default app;