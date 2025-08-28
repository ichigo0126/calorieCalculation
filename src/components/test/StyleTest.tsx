import { useCallback } from '@lynx-js/react';

export function StyleTest() {
  const handleTest = useCallback(() => {
    'background only';
    console.log('Style test component clicked');
    
    // promptが使えるかテスト
    if (typeof prompt !== 'undefined') {
      const result = prompt('テスト入力', '');
      console.log('Prompt result:', result);
    } else {
      console.log('Prompt is not available');
    }
  }, []);

  return (
    <view style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
      <text style={{ fontSize: 18, marginBottom: 10 }}>Style Test</text>
      
      <view 
        style={{
          borderWidth: 1,
          borderColor: '#007AFF',
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#fff',
          marginBottom: 15
        }}
        bindtap={handleTest}
      >
        <text style={{ color: '#007AFF' }}>Tap to test prompt</text>
      </view>
      
      <view 
        style={{
          borderWidth: 2,
          borderColor: '#ff6b6b',
          padding: 15,
          borderRadius: 10,
          backgroundColor: '#ffe0e0'
        }}
      >
        <text style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
          Style properties test
        </text>
      </view>
    </view>
  );
}