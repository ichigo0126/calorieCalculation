import { useState, useCallback } from '@lynx-js/react';
import { useAuth } from '../../contexts/AuthContext.js';
import { InputField } from '../common/InputField.js';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleLogin = useCallback(async () => {
    'background only';
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error: any) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  const handleEmailInput = useCallback((value: string) => {
    'background only';
    setEmail(value);
  }, []);

  const handlePasswordInput = useCallback((value: string) => {
    'background only';
    setPassword(value);
  }, []);

  return (
    <view className="auth-screen">
      <view className="auth-container">
        <view className="auth-header">
          <text className="auth-title">ログイン</text>
          <text className="auth-subtitle">カロリー計算アプリにログインして、データを同期しましょう</text>
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
              placeholder="パスワードを入力"
              type="password"
              className="auth-input"
              onInput={handlePasswordInput}
            />
          </view>

          {error && (
            <view className="error-message">
              <text className="error-text">{error}</text>
            </view>
          )}

          <view 
            className={`auth-button ${loading ? 'auth-button-disabled' : ''}`}
            bindtap={loading ? undefined : handleLogin}
          >
            <text className="auth-button-text">
              {loading ? 'ログイン中...' : 'ログイン'}
            </text>
          </view>

          <view className="auth-link-container">
            <text className="auth-link-text">アカウントをお持ちでない方は</text>
            <text className="auth-link" bindtap={onSwitchToSignup}>
              新規登録
            </text>
          </view>
        </view>
      </view>
    </view>
  );
}