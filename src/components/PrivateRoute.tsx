import React, { type ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext.js'

interface PrivateRouteProps {
  children: ReactNode
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <view style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <text>読み込み中...</text>
      </view>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}