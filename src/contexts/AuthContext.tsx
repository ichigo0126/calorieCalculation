import { createContext, useContext, useEffect, useState } from '@lynx-js/react';
import { 
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

interface UserProfile {
  height: string;
  weight: string;
  age: string;
  gender: string;
  activityLevel: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  needsProfileSetup: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  saveUserProfile: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: any;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user);
        console.log('User UID:', user?.uid);
        setUser(user);
        
        if (user) {
          // ユーザーのプロフィール情報を読み込み
          try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            console.log('Profile document exists:', docSnap.exists());
            if (docSnap.exists()) {
              const profile = docSnap.data() as UserProfile;
              console.log('Found profile:', profile);
              setUserProfile(profile);
              // プロフィールが完全かチェック
              const isComplete = profile.height && profile.weight && profile.age && profile.gender && profile.activityLevel;
              console.log('Profile is complete:', isComplete);
              setNeedsProfileSetup(!isComplete);
            } else {
              // プロフィールが存在しない場合
              console.log('No profile found, needs setup');
              setUserProfile(null);
              setNeedsProfileSetup(true);
            }
          } catch (error) {
            console.error('プロフィール読み込みエラー:', error);
            setNeedsProfileSetup(true);
          }
        } else {
          setUserProfile(null);
          setNeedsProfileSetup(false);
        }
        
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('ログインエラー:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('Starting registration for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful, user created:', userCredential.user.uid);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  };

  const saveUserProfile = async (profile: UserProfile) => {
    try {
      if (!user) throw new Error('ユーザーがログインしていません');
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profile);
      setUserProfile(profile);
      setNeedsProfileSetup(false);
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    needsProfileSetup,
    login,
    register,
    saveUserProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}