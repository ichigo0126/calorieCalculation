// シンプルなREST API認証システム
import {
  signUp as apiSignUp,
  signIn as apiSignIn,
  signOut as apiSignOut,
} from "./api.js";

console.log("シンプルなREST API認証システムを使用中");

// メモリ内認証状態（LocalStorageの代替）
let currentUser: { email: string } | null = null;

// 安全なストレージアクセス
const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage?.getItem(key) || null;
    } catch (error) {
      console.warn("LocalStorage使用不可、メモリ内状態を使用");
      return currentUser ? JSON.stringify(currentUser) : null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage?.setItem(key, value);
    } catch (error) {
      console.warn("LocalStorage使用不可、メモリ内状態を更新");
      if (key === "currentUser") {
        currentUser = JSON.parse(value);
      }
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage?.removeItem(key);
    } catch (error) {
      console.warn("LocalStorage使用不可、メモリ内状態をクリア");
      if (key === "currentUser") {
        currentUser = null;
      }
    }
  },
};

// Lynx.js互換のSupabaseクライアント（REST APIベース）
export const supabase = {
  auth: {
    getSession: () => {
      // 安全なストレージから認証情報を取得
      const user = safeStorage.getItem("currentUser");
      return Promise.resolve({
        data: {
          session: user ? { user: JSON.parse(user) } : null,
        },
        error: null,
      });
    },
    signUp: async (credentials: { email: string; password: string }) => {
      console.log('=== supabase.ts: signUp開始 ===');
      const result = await apiSignUp(credentials.email, credentials.password);
      console.log('API結果:', result);
      
      if (result.success) {
        // ユーザー情報を保存してログイン状態にする
        const user = { email: credentials.email };
        const session = { user: user };
        safeStorage.setItem("currentUser", JSON.stringify(user));
        
        // 即座にログイン状態を更新（グローバル状態を変更）
        return {
          error: null,
          data: { user: user, session: session },
          autoLogin: true // 自動ログインフラグ
        };
      }
      return {
        error: { 
          message: "サインアップに失敗しました", 
          details: (result as any).error || "不明なエラー",
          apiResult: JSON.stringify(result)
        },
        data: null,
      };
    },
    signInWithPassword: async (credentials: {
      email: string;
      password: string;
    }) => {
      console.log('=== supabase.ts: signInWithPassword開始 ===');
      const result = await apiSignIn(credentials.email, credentials.password);
      console.log('API結果:', result);
      
      if (result.success) {
        // ユーザー情報を保存してログイン状態にする
        const user = result.user || { email: credentials.email };
        const session = { user: user };
        safeStorage.setItem("currentUser", JSON.stringify(user));
        
        return {
          error: null,
          data: { user: user, session: session },
        };
      }
      return {
        error: { message: result.error || "サインインに失敗しました" },
        data: null,
      };
    },
    signOut: async () => {
      try {
        console.log('=== supabase.ts: signOut実行 ===');
        const result = await apiSignOut();
        console.log('API signOut結果:', result);
        
        // ストレージからユーザー情報を削除
        safeStorage.removeItem("currentUser");
        console.log('ユーザー情報をストレージから削除');
        
        return { error: null };
      } catch (error) {
        console.error('SignOut API エラー:', error);
        // エラーが発生してもローカル状態はクリア
        safeStorage.removeItem("currentUser");
        return { error: { message: 'ログアウト処理でエラーが発生しました' } };
      }
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // 認証状態の変更を監視（シンプル版）
      return {
        data: {
          subscription: {
            unsubscribe: () => console.log("認証監視を停止"),
          },
        },
      };
    },
  },
};
