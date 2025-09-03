import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
// シンプルな型定義
type User = { email: string };
type Session = { user: User };
type AuthError = { message: string };
import { supabase } from "../lib/supabase.js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log("認証セッション取得成功:", !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("認証セッション取得エラー:", error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('=== AuthContext: signUp実行 ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);
    
    const result = await supabase.auth.signUp({ email, password });
    console.log('Supabase signUp結果:', result);
    
    // サインアップ成功時に即座にログイン状態を更新
    if (!result.error && (result as any).autoLogin) {
      setUser(result.data.user);
      setSession(result.data.session);
    }
    
    return { error: result.error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('=== AuthContext: signIn実行 ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);
    
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('Supabase signIn結果:', result);
    
    // サインイン成功時に即座にログイン状態を更新
    if (!result.error && result.data?.user) {
      setUser(result.data.user);
      setSession(result.data.session || { user: result.data.user });
      console.log('ログイン状態を更新しました:', result.data.user);
    }
    
    return { error: result.error };
  };

  const signOut = async () => {
    try {
      console.log('=== AuthContext: signOut実行 ===');
      const result = await supabase.auth.signOut();
      console.log('SignOut結果:', result);
      
      // ローカル状態もクリア
      setUser(null);
      setSession(null);
      console.log('ローカル状態クリア完了');
      
      return { error: result.error };
    } catch (error) {
      console.error('SignOutエラー:', error);
      return { error: { message: 'ログアウトに失敗しました' } };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
