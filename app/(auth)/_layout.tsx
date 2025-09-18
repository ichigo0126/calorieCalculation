import { Stack } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#2d3748',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'ログイン',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: '新規登録',
        }}
      />
    </Stack>
  )
}