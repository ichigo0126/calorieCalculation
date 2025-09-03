// シンプルなREST API クライアント
// Lynx.js環境での安全な環境変数取得
const getEnvVar = (name: string, defaultValue: string) => {
  try {
    return import.meta.env?.[name] || defaultValue;
  } catch (error) {
    console.warn(
      `環境変数 ${name} の取得に失敗、デフォルト値を使用:`,
      defaultValue
    );
    return defaultValue;
  }
};

// デモ用: 環境変数を使わずにハードコード（後で実際のURLに変更）
const SUPABASE_URL = "https://wjpfesqvpcdkldqssyhy.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcGZlc3F2cGNka2xkcXNzeWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODMyMzgsImV4cCI6MjA3MjA1OTIzOH0.Bq-GyymFXd19MMdi8jWYYVhvTMjXOpzyaKVJ6kJeag8";

console.log("API設定:", { SUPABASE_URL, hasKey: !!SUPABASE_KEY });

// API呼び出し用のベース関数
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL}/rest/v1${endpoint}`;

  const defaultHeaders = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API呼び出しエラー:", error);
    throw error;
  }
}

// 歩数データの送信
export async function saveSteps(steps: number, date: string) {
  return apiCall("/steps", {
    method: "POST",
    body: JSON.stringify({
      steps,
      date,
      created_at: new Date().toISOString(),
    }),
  });
}

// 歩数データの取得
export async function getSteps(date: string) {
  return apiCall(`/steps?date=eq.${date}&select=*`);
}

// カロリーデータの取得
export async function getCalories(date: string) {
  return apiCall(`/calories?date=eq.${date}&select=*`);
}

// ユーザー認証（デモ版 - 実際のAPI呼び出しなし）
export async function signUp(email: string, password: string) {
  console.log("サインアップ:", email);
  // デモ用: 常に成功
  await new Promise((resolve) => setTimeout(resolve, 500)); // 少し待機
  return { success: true, user: { email } };
}

export async function signIn(email: string, password: string) {
  console.log("サインイン:", email);
  // デモ用: 簡単な認証チェック
  await new Promise((resolve) => setTimeout(resolve, 500)); // 少し待機

  if (email && password.length >= 1) {
    return { success: true, user: { email } };
  }
  return {
    success: false,
    error: "メールアドレスとパスワードを入力してください",
  };
}

export async function signOut() {
  console.log("サインアウト");
  await new Promise((resolve) => setTimeout(resolve, 200)); // 少し待機
  return { success: true };
}
