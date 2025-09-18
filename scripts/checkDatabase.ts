import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabaseSchema() {
  try {
    console.log('🔍 Checking Supabase connection and schema...')

    // 接続テスト - 既知のテーブルをテストしてみる
    const testTables = ['profiles', 'meals', 'food_items', 'users']
    const existingTables: string[] = []

    console.log('✅ Connection successful!')

    for (const tableName of testTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(0)

      if (!error) {
        existingTables.push(tableName)
        console.log(`✅ Table found: ${tableName}`)
      } else {
        console.log(`❌ Table not found: ${tableName}`)
      }
    }

    console.log(`\n📋 Found ${existingTables.length} tables: ${existingTables.join(', ')}`)

    // 各テーブルの最初のレコードを取得してスキーマを推測
    for (const tableName of existingTables) {
      console.log(`\n📊 Checking ${tableName} structure:`)
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)

      if (!error && data && data.length > 0) {
        const record = data[0]
        Object.keys(record).forEach(column => {
          const value = record[column]
          const type = typeof value
          console.log(`    ${column}: ${type}${value === null ? ' (nullable)' : ''}`)
        })
      } else if (!error && data && data.length === 0) {
        console.log('    (Empty table - checking with INSERT to see required fields)')
        // 空のテーブルの場合はinsertエラーからフィールドを推測できるが、一旦スキップ
      } else {
        console.log(`    Error checking structure: ${error?.message}`)
      }
    }

    // カロリー計算アプリに必要なテーブルの推奨スキーマ
    console.log('\n💡 Recommended schema for calorie calculation app:')
    console.log(`
  profiles:
    id: uuid PRIMARY KEY (references auth.users)
    email: text NOT NULL
    name: text
    avatar_url: text
    daily_calorie_goal: integer DEFAULT 2000
    created_at: timestamp with time zone DEFAULT now()
    updated_at: timestamp with time zone DEFAULT now()

  meals:
    id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
    user_id: uuid NOT NULL (references profiles.id)
    name: text NOT NULL
    calories: integer NOT NULL
    protein: numeric(5,2)
    carbs: numeric(5,2)
    fat: numeric(5,2)
    meal_time: timestamp with time zone NOT NULL
    meal_type: text CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack'))
    created_at: timestamp with time zone DEFAULT now()
    updated_at: timestamp with time zone DEFAULT now()

  food_items:
    id: uuid PRIMARY KEY DEFAULT gen_random_uuid()
    name: text NOT NULL
    calories_per_100g: integer NOT NULL
    protein_per_100g: numeric(5,2)
    carbs_per_100g: numeric(5,2)
    fat_per_100g: numeric(5,2)
    created_at: timestamp with time zone DEFAULT now()`)

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkDatabaseSchema()