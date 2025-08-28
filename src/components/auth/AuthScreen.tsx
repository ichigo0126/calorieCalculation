import { useState, useCallback } from '@lynx-js/react';
import { LoginScreen } from './LoginScreen.js';
import { SignupScreen } from './SignupScreen.js';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = useCallback(() => {
    'background only';
    setIsLogin(false);
  }, []);

  const switchToLogin = useCallback(() => {
    'background only';
    setIsLogin(true);
  }, []);

  return (
    <view className="auth-wrapper">
      {isLogin ? (
        <LoginScreen onSwitchToSignup={switchToSignup} />
      ) : (
        <SignupScreen onSwitchToLogin={switchToLogin} />
      )}
    </view>
  );
}