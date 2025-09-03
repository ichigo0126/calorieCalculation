// Supabase REST API 直接実装
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://wjpfesqvpcdkldqssyhy.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcGZlc3F2cGNka2xkcXNzeWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODMyMzgsImV4cCI6MjA3MjA1OTIzOH0.Bq-GyymFXd19MMdi8jWYYVhvTMjXOpzyaKVJ6kJeag8';


// 認証API
export const signUp = async (email, password) => {
  
  // **重要**: まずはSupabase SDKスタイルに戻して試す
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        data: {},
        email_confirm: false // メール確認をスキップ
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, user: { email: email } };
    } else {
      return { 
        success: false, 
        error: data.error || data.error_description || data.message || 'サインアップ失敗' 
      };
    }
  } catch (error) {
    return { success: false, error: `ネットワークエラー: ${error.message}` };
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, user: { email: data.user?.email || email } };
    } else {
      return { success: false, error: data.msg || 'サインインに失敗' };
    }
  } catch (error) {
    return { success: false, error: 'ネットワークエラー' };
  }
};

export const signOut = async () => {
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'ログアウトエラー' };
  }
};

// データベースAPI（歩数データ用）
export const saveStepData = async (userId, stepCount, date) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/daily_steps`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        step_count: stepCount,
        date: date,
        calories_burned: Math.floor(stepCount * 0.04) // 概算カロリー
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('歩数データ保存エラー:', error);
    return false;
  }
};

export const getStepData = async (userId, date) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/daily_steps?user_id=eq.${userId}&date=eq.${date}`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('歩数データ取得エラー:', error);
    return null;
  }
};