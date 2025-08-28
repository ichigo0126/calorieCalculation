import { useState, useCallback } from '@lynx-js/react';

interface InputModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  value: string;
  type?: 'text' | 'password' | 'email';
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function InputModal({
  visible,
  title,
  placeholder,
  value,
  type = 'text',
  onConfirm,
  onCancel
}: InputModalProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleConfirm = useCallback(() => {
    'background only';
    onConfirm(inputValue);
  }, [inputValue, onConfirm]);

  const handleCancel = useCallback(() => {
    'background only';
    setInputValue(value); // Reset to original value
    onCancel();
  }, [value, onCancel]);

  const addCharacter = useCallback((char: string) => {
    'background only';
    setInputValue(prev => prev + char);
  }, []);

  const deleteCharacter = useCallback(() => {
    'background only';
    setInputValue(prev => prev.slice(0, -1));
  }, []);

  const clearInput = useCallback(() => {
    'background only';
    setInputValue('');
  }, []);

  if (!visible) return null;

  const displayValue = type === 'password' ? '●'.repeat(inputValue.length) : inputValue;

  return (
    <view className="modal-overlay">
      <view className="input-modal">
        <view className="input-modal-header">
          <text className="input-modal-title">{title}</text>
        </view>

        <view className="input-modal-body">
          <view className="input-display">
            <text className="input-display-text">
              {displayValue || placeholder}
            </text>
          </view>

          {/* Simple keyboard for common characters */}
          <view className="virtual-keyboard">
            <text className="keyboard-hint">簡易キーボード（基本文字のみ）</text>
            
            {/* Numbers */}
            <view className="keyboard-row">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(num => (
                <view key={num} className="key" bindtap={() => addCharacter(num)}>
                  <text className="key-text">{num}</text>
                </view>
              ))}
            </view>

            {/* Letters (basic set) */}
            <view className="keyboard-row">
              {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(letter => (
                <view key={letter} className="key" bindtap={() => addCharacter(letter)}>
                  <text className="key-text">{letter}</text>
                </view>
              ))}
            </view>

            <view className="keyboard-row">
              {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(letter => (
                <view key={letter} className="key" bindtap={() => addCharacter(letter)}>
                  <text className="key-text">{letter}</text>
                </view>
              ))}
            </view>

            <view className="keyboard-row">
              {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(letter => (
                <view key={letter} className="key" bindtap={() => addCharacter(letter)}>
                  <text className="key-text">{letter}</text>
                </view>
              ))}
            </view>

            {/* Special characters for email */}
            {type === 'email' && (
              <view className="keyboard-row">
                {['@', '.', '-', '_'].map(char => (
                  <view key={char} className="key" bindtap={() => addCharacter(char)}>
                    <text className="key-text">{char}</text>
                  </view>
                ))}
              </view>
            )}

            {/* Control buttons */}
            <view className="keyboard-row">
              <view className="key key-space" bindtap={() => addCharacter(' ')}>
                <text className="key-text">space</text>
              </view>
              <view className="key key-delete" bindtap={deleteCharacter}>
                <text className="key-text">⌫</text>
              </view>
              <view className="key key-clear" bindtap={clearInput}>
                <text className="key-text">clear</text>
              </view>
            </view>
          </view>
        </view>

        <view className="input-modal-buttons">
          <view className="modal-button cancel" bindtap={handleCancel}>
            <text className="modal-button-text">キャンセル</text>
          </view>
          <view className="modal-button confirm" bindtap={handleConfirm}>
            <text className="modal-button-text">OK</text>
          </view>
        </view>
      </view>
    </view>
  );
}