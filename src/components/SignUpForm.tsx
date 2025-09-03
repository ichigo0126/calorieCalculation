import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.js'

interface SignUpFormProps {
  onToggleMode: () => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [editingField, setEditingField] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { signUp } = useAuth()

  const handleFieldEdit = (field: string) => {
    setEditingField(field)
    setInputValue(
      field === 'email' ? email :
      field === 'password' ? password :
      field === 'confirmPassword' ? confirmPassword : ''
    )
  }

  const handleSaveField = () => {
    if (editingField === 'email') setEmail(inputValue)
    else if (editingField === 'password') setPassword(inputValue)
    else if (editingField === 'confirmPassword') setConfirmPassword(inputValue)
    
    setEditingField(null)
    setInputValue('')
  }

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
          {editingField === 'email' ? (
            <view style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <text style={{ padding: '0.5rem', border: '1px solid #007bff', borderRadius: '4px', fontSize: '0.9rem' }}>
                {inputValue}
              </text>
              <view style={{ display: 'flex', gap: '0.5rem' }}>
                <view 
                  bindtap={handleSaveField}
                  style={{ padding: '0.5rem', backgroundColor: '#28a745', color: 'white', borderRadius: '4px', flex: 1, textAlign: 'center' }}
                >
                  <text style={{ color: 'white' }}>保存</text>
                </view>
                <view 
                  bindtap={() => setEditingField(null)}
                  style={{ padding: '0.5rem', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px', flex: 1, textAlign: 'center' }}
                >
                  <text style={{ color: 'white' }}>キャンセル</text>
                </view>
              </view>
              <view style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','@','.','-','_','0','1','2','3','4','5','6','7','8','9'].map(char => (
                  <view 
                    key={char}
                    bindtap={() => setInputValue(prev => prev + char)}
                    style={{ padding: '0.3rem', backgroundColor: '#e9ecef', borderRadius: '3px', minWidth: '25px', textAlign: 'center' }}
                  >
                    <text style={{ fontSize: '0.8rem' }}>{char}</text>
                  </view>
                ))}
                <view 
                  bindtap={() => setInputValue(prev => prev.slice(0, -1))}
                  style={{ padding: '0.3rem', backgroundColor: '#dc3545', color: 'white', borderRadius: '3px', textAlign: 'center' }}
                >
                  <text style={{ color: 'white', fontSize: '0.8rem' }}>削除</text>
                </view>
              </view>
            </view>
          ) : (
            <view>
              <text style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px', display: 'block', marginBottom: '0.5rem' }}>
                {email || 'メールアドレスを入力してください'}
              </text>
              <view 
                bindtap={() => handleFieldEdit('email')}
                style={{ padding: '0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', textAlign: 'center' }}
              >
                <text style={{ color: 'white' }}>編集</text>
              </view>
            </view>
          )}
        </view>
        
        <view>
          <text style={{ marginBottom: '0.5rem' }}>パスワード</text>
          {editingField === 'password' ? (
            <view style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <text style={{ padding: '0.5rem', border: '1px solid #007bff', borderRadius: '4px', fontSize: '0.9rem' }}>
                {'*'.repeat(inputValue.length)}
              </text>
              <view style={{ display: 'flex', gap: '0.5rem' }}>
                <view 
                  bindtap={handleSaveField}
                  style={{ padding: '0.5rem', backgroundColor: '#28a745', color: 'white', borderRadius: '4px', flex: 1, textAlign: 'center' }}
                >
                  <text style={{ color: 'white' }}>保存</text>
                </view>
                <view 
                  bindtap={() => setEditingField(null)}
                  style={{ padding: '0.5rem', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px', flex: 1, textAlign: 'center' }}
                >
                  <text style={{ color: 'white' }}>キャンセル</text>
                </view>
              </view>
              <view style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','!','@','#','$','%'].map(char => (
                  <view 
                    key={char}
                    bindtap={() => setInputValue(prev => prev + char)}
                    style={{ padding: '0.3rem', backgroundColor: '#e9ecef', borderRadius: '3px', minWidth: '25px', textAlign: 'center' }}
                  >
                    <text style={{ fontSize: '0.8rem' }}>{char}</text>
                  </view>
                ))}
                <view 
                  bindtap={() => setInputValue(prev => prev.slice(0, -1))}
                  style={{ padding: '0.3rem', backgroundColor: '#dc3545', color: 'white', borderRadius: '3px', textAlign: 'center' }}
                >
                  <text style={{ color: 'white', fontSize: '0.8rem' }}>削除</text>
                </view>
              </view>
            </view>
          ) : (
            <view>
              <text style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px', display: 'block', marginBottom: '0.5rem' }}>
                {password ? '*'.repeat(password.length) : 'パスワードを入力してください'}
              </text>
              <view 
                bindtap={() => handleFieldEdit('password')}
                style={{ padding: '0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', textAlign: 'center' }}
              >
                <text style={{ color: 'white' }}>編集</text>
              </view>
            </view>
          )}
        </view>
        
        <view>
          <text style={{ marginBottom: '0.5rem' }}>パスワード確認</text>
          {editingField === 'confirmPassword' ? (
            <view style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <text style={{ padding: '0.5rem', border: '1px solid #007bff', borderRadius: '4px', fontSize: '0.9rem' }}>
                {'*'.repeat(inputValue.length)}
              </text>
              <view style={{ display: 'flex', gap: '0.5rem' }}>
                <view 
                  bindtap={handleSaveField}
                  style={{ padding: '0.5rem', backgroundColor: '#28a745', color: 'white', borderRadius: '4px', flex: 1, textAlign: 'center' }}
                >
                  <text style={{ color: 'white' }}>保存</text>
                </view>
                <view 
                  bindtap={() => setEditingField(null)}
                  style={{ padding: '0.5rem', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px', flex: 1, textAlign: 'center' }}
                >
                  <text style={{ color: 'white' }}>キャンセル</text>
                </view>
              </view>
              <view style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','!','@','#','$','%'].map(char => (
                  <view 
                    key={char}
                    bindtap={() => setInputValue(prev => prev + char)}
                    style={{ padding: '0.3rem', backgroundColor: '#e9ecef', borderRadius: '3px', minWidth: '25px', textAlign: 'center' }}
                  >
                    <text style={{ fontSize: '0.8rem' }}>{char}</text>
                  </view>
                ))}
                <view 
                  bindtap={() => setInputValue(prev => prev.slice(0, -1))}
                  style={{ padding: '0.3rem', backgroundColor: '#dc3545', color: 'white', borderRadius: '3px', textAlign: 'center' }}
                >
                  <text style={{ color: 'white', fontSize: '0.8rem' }}>削除</text>
                </view>
              </view>
            </view>
          ) : (
            <view>
              <text style={{ padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px', display: 'block', marginBottom: '0.5rem' }}>
                {confirmPassword ? '*'.repeat(confirmPassword.length) : 'パスワードを再入力してください'}
              </text>
              <view 
                bindtap={() => handleFieldEdit('confirmPassword')}
                style={{ padding: '0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', textAlign: 'center' }}
              >
                <text style={{ color: 'white' }}>編集</text>
              </view>
            </view>
          )}
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