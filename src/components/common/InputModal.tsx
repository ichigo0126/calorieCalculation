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
  const [capsLock, setCapsLock] = useState(false);
  const [showNumbers, setShowNumbers] = useState(type === 'text' ? false : true);

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
    const finalChar = capsLock && char.match(/[a-z]/) ? char.toUpperCase() : char;
    setInputValue(prev => prev + finalChar);
  }, [capsLock]);

  const toggleCapsLock = useCallback(() => {
    'background only';
    setCapsLock(prev => !prev);
  }, []);

  const toggleKeyboardMode = useCallback(() => {
    'background only';
    setShowNumbers(prev => !prev);
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

          {/* Improved virtual keyboard */}
          <view className="virtual-keyboard">
            {showNumbers ? (
              <>
                {/* Numbers and symbols */}
                <view className="keyboard-row">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(num => (
                    <view key={num} className="key" bindtap={() => addCharacter(num)}>
                      <text className="key-text">{num}</text>
                    </view>
                  ))}
                </view>
                
                <view className="keyboard-row">
                  {['-', '=', '[', ']', '\\', ';', "'", ',', '.', '/'].map(char => (
                    <view key={char} className="key" bindtap={() => addCharacter(char)}>
                      <text className="key-text">{char}</text>
                    </view>
                  ))}
                </view>

                {/* Email specific characters */}
                {type === 'email' && (
                  <view className="keyboard-row">
                    <view className="key key-wide" bindtap={() => addCharacter('@')}>
                      <text className="key-text">@</text>
                    </view>
                    <view className="key" bindtap={() => addCharacter('.')}>
                      <text className="key-text">.</text>
                    </view>
                    <view className="key" bindtap={() => addCharacter('-')}>
                      <text className="key-text">-</text>
                    </view>
                    <view className="key" bindtap={() => addCharacter('_')}>
                      <text className="key-text">_</text>
                    </view>
                  </view>
                )}

                {/* Switch to letters */}
                <view className="keyboard-row">
                  <view className="key key-function" bindtap={toggleKeyboardMode}>
                    <text className="key-text">ABC</text>
                  </view>
                  <view className="key key-space" bindtap={() => addCharacter(' ')}>
                    <text className="key-text">スペース</text>
                  </view>
                  <view className="key key-delete" bindtap={deleteCharacter}>
                    <text className="key-text">⌫</text>
                  </view>
                </view>
              </>
            ) : (
              <>
                {/* Letters */}
                <view className="keyboard-row">
                  {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(letter => (
                    <view key={letter} className="key" bindtap={() => addCharacter(letter)}>
                      <text className="key-text">{capsLock ? letter.toUpperCase() : letter}</text>
                    </view>
                  ))}
                </view>

                <view className="keyboard-row">
                  {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(letter => (
                    <view key={letter} className="key" bindtap={() => addCharacter(letter)}>
                      <text className="key-text">{capsLock ? letter.toUpperCase() : letter}</text>
                    </view>
                  ))}
                </view>

                <view className="keyboard-row">
                  <view className={`key key-function ${capsLock ? 'active' : ''}`} bindtap={toggleCapsLock}>
                    <text className="key-text">⇧</text>
                  </view>
                  {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(letter => (
                    <view key={letter} className="key" bindtap={() => addCharacter(letter)}>
                      <text className="key-text">{capsLock ? letter.toUpperCase() : letter}</text>
                    </view>
                  ))}
                  <view className="key key-delete" bindtap={deleteCharacter}>
                    <text className="key-text">⌫</text>
                  </view>
                </view>

                {/* Bottom row */}
                <view className="keyboard-row">
                  <view className="key key-function" bindtap={toggleKeyboardMode}>
                    <text className="key-text">123</text>
                  </view>
                  <view className="key key-space" bindtap={() => addCharacter(' ')}>
                    <text className="key-text">スペース</text>
                  </view>
                  <view className="key key-function" bindtap={clearInput}>
                    <text className="key-text">全削除</text>
                  </view>
                </view>
              </>
            )}
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