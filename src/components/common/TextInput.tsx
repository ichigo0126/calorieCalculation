import { useCallback } from '@lynx-js/react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
  className?: string;
}

export function TextInput({ 
  value, 
  onChange, 
  placeholder = '', 
  type = 'text',
  className = ''
}: TextInputProps) {
  const handleTap = useCallback(() => {
    'background only';
    // ネイティブプロンプトを使用
    const inputType = type === 'password' ? 'secure-text' : 'plain-text';
    const title = type === 'password' ? 'パスワードを入力' : 
                  type === 'email' ? 'メールアドレスを入力' : 
                  placeholder || 'テキストを入力';
    
    // LynxJSでプロンプトが使える場合
    if (typeof prompt !== 'undefined') {
      const result = prompt(title, value);
      if (result !== null) {
        onChange(result);
      }
    } else {
      console.log('Prompt not available, opening modal would be needed');
      // フォールバック: モーダルを開く実装が必要
    }
  }, [value, onChange, placeholder, type]);

  const displayValue = () => {
    if (!value) {
      return placeholder;
    }
    
    if (type === 'password') {
      return '●'.repeat(value.length);
    }
    
    return value;
  };

  return (
    <view 
      className={`text-input-container ${className}`}
      style={{
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        minHeight: 44
      }}
      bindtap={handleTap}
    >
      <text 
        className={`text-input-display ${!value ? 'placeholder' : ''}`}
        style={{
          color: !value ? '#999' : '#333',
          fontSize: 16
        }}
      >
        {displayValue()}
      </text>
    </view>
  );
}