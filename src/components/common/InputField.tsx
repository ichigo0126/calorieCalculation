import { useState, useCallback } from '@lynx-js/react';
import { InputModal } from './InputModal.js';

interface InputFieldProps {
  value: string;
  placeholder: string;
  type?: 'text' | 'password' | 'email';
  className?: string;
  onInput: (value: string) => void;
}

export function InputField({ 
  value, 
  placeholder, 
  type = 'text',
  className = '',
  onInput 
}: InputFieldProps) {
  const [showModal, setShowModal] = useState(false);
  
  const handleTap = useCallback(() => {
    'background only';
    setShowModal(true);
  }, []);

  const handleModalConfirm = useCallback((newValue: string) => {
    'background only';
    onInput(newValue);
    setShowModal(false);
  }, [onInput]);

  const handleModalCancel = useCallback(() => {
    'background only';
    setShowModal(false);
  }, []);

  const displayValue = () => {
    if (!value) {
      return placeholder;
    }
    
    if (type === 'password') {
      return '●'.repeat(value.length);
    }
    
    return value;
  };

  const getClassName = () => {
    let baseClass = 'input-field';
    if (!value) {
      baseClass += ' input-field-placeholder';
    }
    if (className) {
      baseClass += ` ${className}`;
    }
    return baseClass;
  };

  const getModalTitle = () => {
    if (type === 'password') {
      return 'パスワードを入力（6文字以上）';
    } else if (type === 'email') {
      return 'メールアドレスを入力';
    }
    return placeholder;
  };

  return (
    <>
      <view className="input-container">
        <view className={getClassName()} bindtap={handleTap}>
          <text className="input-text">{displayValue()}</text>
          <view className="input-icon">
            <text className="input-icon-text">✏️</text>
          </view>
        </view>
      </view>
      
      <InputModal
        visible={showModal}
        title={getModalTitle()}
        placeholder={placeholder}
        value={type === 'password' ? '' : value}
        type={type}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </>
  );
}