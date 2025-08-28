import { useState, useCallback } from '@lynx-js/react';
import { useAuth } from '../../contexts/AuthContext.js';
import { InputField } from '../common/InputField.js';

interface SignupScreenProps {
  onSwitchToLogin: () => void;
}

export function SignupScreen({ onSwitchToLogin }: SignupScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleSignup = useCallback(async () => {
    'background only';
    if (!email || !password || !confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(email, password);
      console.log('Registration successful');
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'アカウント作成に失敗しました。';
      if (error && error.code) {
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'このメールアドレスは既に使用されています。';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = '無効なメールアドレスです。';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'パスワードが弱すぎます。';
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, register]);

  const handleEmailInput = useCallback((value: string) => {
    'background only';
    setEmail(value);
  }, []);

  const handlePasswordInput = useCallback((value: string) => {
    'background only';
    setPassword(value);
  }, []);

  const handleConfirmPasswordInput = useCallback((value: string) => {
    'background only';
    setConfirmPassword(value);
  }, []);

  return (
    <view className="auth-screen">
      <view className="auth-container">
        <view className="auth-header">
          <text className="auth-title">新規登録</text>
          <text className="auth-subtitle">アカウントを作成して、データを同期しましょう</text>
        </view>

        <view className="auth-form">
          <view className="form-group">
            <text className="form-label">メールアドレス</text>
            <InputField
              value={email}
              placeholder="メールアドレスを入力"
              type="email"
              className="auth-input"
              onInput={handleEmailInput}
            />
          </view>

          <view className="form-group">
            <text className="form-label">パスワード</text>
            <InputField
              value={password}
              placeholder="パスワードを入力（6文字以上）"
              type="password"
              className="auth-input"
              onInput={handlePasswordInput}
            />
          </view>

          <view className="form-group">
            <text className="form-label">パスワード確認</text>
            <InputField
              value={confirmPassword}
              placeholder="パスワードを再入力"
              type="password"
              className="auth-input"
              onInput={handleConfirmPasswordInput}
            />
          </view>

          {error && (
            <view className="error-message">
              <text className="error-text">{error}</text>
            </view>
          )}

          <view 
            className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
            bindtap={loading ? undefined : handleSignup}
          >
            <text className="auth-button-text">
              {loading ? 'アカウント作成中...' : 'アカウント作成'}
            </text>
          </view>

          <view className="auth-link-container">
            <text className="auth-link-text">すでにアカウントをお持ちの方は</text>
            <text className="auth-link" bindtap={onSwitchToLogin}>
              ログイン
            </text>
          </view>
        </view>
      </view>
    </view>
  );
}