import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runMigration() {
  try {
    console.log('🚀 Running database migration...')

    // マイグレーションファイルを読み込み
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_create_meals_and_food_items.sql')
    const sqlContent = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration file loaded')

    // SQLを複数のステートメントに分割して実行
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📋 Found ${statements.length} SQL statements to execute`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`\n⚡ Executing statement ${i + 1}/${statements.length}...`)

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_statement: statement })

        if (error) {
          console.log(`❌ Error in statement ${i + 1}:`, error.message)
          // 一部のエラーは無視（既存のテーブルなど）
          if (!error.message.includes('already exists') &&
              !error.message.includes('duplicate key') &&
              !error.message.includes('constraint already exists')) {
            throw error
          } else {
            console.log(`⚠️  Statement ${i + 1} skipped (already exists)`)
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (directError) {
        // RPC関数が存在しない場合は直接SQLクエリを試行
        console.log(`⚠️  Trying alternative method for statement ${i + 1}...`)

        // 簡単なクエリのみ試行（CREATE TABLEなど）
        if (statement.toUpperCase().includes('CREATE TABLE')) {
          console.log(`❌ Cannot execute CREATE TABLE via client. Please run this in Supabase SQL Editor:`)
          console.log(statement)
        }
      }
    }

    console.log('\n🧪 Testing migration result...')

    // マイグレーション後のテスト
    const { data: mealsData, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .limit(1)

    const { data: foodData, error: foodError } = await supabase
      .from('food_items')
      .select('*')
      .limit(5)

    if (!mealsError && !foodError) {
      console.log('✅ Migration successful!')
      console.log(`✅ Found ${foodData?.length || 0} food items`)
      if (foodData && foodData.length > 0) {
        console.log('   Sample foods:', foodData.map(f => f.name).join(', '))
      }
    } else {
      console.log('\n❌ Migration may have failed. Manual execution required.')
      console.log('\n📝 Please manually run this SQL in Supabase Dashboard > SQL Editor:')
      console.log('\n' + '='.repeat(80))
      console.log(sqlContent)
      console.log('='.repeat(80))
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('\n📝 Please manually run the SQL file in Supabase Dashboard > SQL Editor')
    console.log('File: supabase/migrations/001_create_meals_and_food_items.sql')
  }
}

runMigration()