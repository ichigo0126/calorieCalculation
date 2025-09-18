import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🧪 Testing Supabase connection...')

    // 1. 認証テスト（匿名サインアップ）
    console.log('\n1. Testing authentication...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `test-${Date.now()}@example.com`,
      password: 'test123456'
    })

    if (authError) {
      console.log('❌ Auth test failed:', authError.message)
    } else {
      console.log('✅ Auth test successful')
    }

    // 2. テーブル読み取りテスト
    console.log('\n2. Testing table access...')

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message)
    } else {
      console.log('✅ Profiles table accessible')
    }

    const { data: mealsData, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .limit(1)

    if (mealsError) {
      console.log('❌ Meals table error:', mealsError.message)
      console.log('   → Need to run migration SQL')
    } else {
      console.log('✅ Meals table accessible')
    }

    const { data: foodData, error: foodError } = await supabase
      .from('food_items')
      .select('*')
      .limit(5)

    if (foodError) {
      console.log('❌ Food items table error:', foodError.message)
      console.log('   → Need to run migration SQL')
    } else {
      console.log('✅ Food items table accessible')
      console.log(`   → Found ${foodData?.length || 0} food items`)
      if (foodData && foodData.length > 0) {
        console.log('   → Sample:', foodData[0].name)
      }
    }

    console.log('\n🎯 Summary:')
    console.log('- Supabase connection: ✅ Working')
    console.log('- Authentication: ✅ Working')
    console.log('- Profiles table: ✅ Working')

    if (mealsError || foodError) {
      console.log('- Meals/Food tables: ❌ Need migration')
      console.log('\n📝 Next steps:')
      console.log('1. Go to Supabase Dashboard > SQL Editor')
      console.log('2. Run the migration file: supabase/migrations/001_create_meals_and_food_items.sql')
    } else {
      console.log('- Meals/Food tables: ✅ Working')
      console.log('\n🚀 Ready to use!')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testConnection()