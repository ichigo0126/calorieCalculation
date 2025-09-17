import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.js'

interface SignUpFormProps {
  onToggleMode: () => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { signUp } = useAuth()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      const result = await signUp(email, password);
      
      if (result.error) {
        setError(result.error.message || 'アカウント作成に失敗しました');
      } else {
        setMessage('アカウント作成が完了しました！メインアプリに移動します。');
        // サインアップ成功時はログイン状態が自動更新されるので、画面が自動切り替わる
      }
    } catch (err) {
      setError('アカウント作成処理でエラーが発生しました');
    }
    
    setLoading(false)
  }

  return (
    <view style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <text className='Title' style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>サインアップ</text>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <view>
          <text style={{ marginBottom: '0.5rem' }}>メールアドレス</text>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力してください"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: 'white',
            }}
          />
        </view>
        
        <view>
          <text style={{ marginBottom: '0.5rem' }}>パスワード</text>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力してください"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: 'white',
            }}
          />
        </view>
        
        <view>
          <text style={{ marginBottom: '0.5rem' }}>パスワード確認</text>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="パスワードを再入力してください"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: 'white',
            }}
          />
        </view>
        {error && (
          <view style={{ 
            color: 'red', 
            fontSize: '0.875rem', 
            padding: '0.5rem', 
            backgroundColor: '#ffebee', 
            borderRadius: '4px',
            maxHeight: '100px',
            overflow: 'scroll'
          }}>
            <text style={{ color: 'red', fontSize: '0.75rem' }}>エラー:</text>
            <text style={{ color: 'red', fontSize: '0.7rem' }}>
              {typeof error === 'string' ? error.substring(0, 150) + '...' : JSON.stringify(error).substring(0, 150) + '...'}
            </text>
          </view>
        )}
        {message && (
          <view style={{ color: 'green', fontSize: '0.875rem' }}>
            <text style={{ color: 'green' }}>{message}</text>
          </view>
        )}
        <view 
          bindtap={loading ? undefined : handleSubmit}
          style={{
            padding: '0.75rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            textAlign: 'center'
          }}
        >
          <text style={{ color: 'white' }}>{loading ? '登録中...' : 'アカウント作成'}</text>
        </view>
        <view style={{ textAlign: 'center' }}>
          <text>すでにアカウントをお持ちの方は </text>
          <text
            bindtap={onToggleMode}
            style={{
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            ログイン
          </text>
        </view>
      </view>
    </view>
  )
}