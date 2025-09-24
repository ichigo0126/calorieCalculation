import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixProfileTable() {
  try {
    console.log('🔧 Fixing profiles table...')

    // 1. 現在のテーブル構造を確認
    console.log('\n1. 現在のテーブル構造を確認中...')
    const { data: currentStructure, error: structureError } = await supabase
      .rpc('exec_sql', {
        sql_statement: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'profiles'
          ORDER BY ordinal_position;
        `
      })

    if (structureError) {
      console.log('⚠️  RPC経由でのアクセスに失敗しました。直接SQLを実行します...')

      // 2. 直接カラムを追加（一つずつ実行）
      const alterQueries = [
        `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_calorie_goal INTEGER DEFAULT 2000;`,
        `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;`,
        `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height INTEGER;`,
        `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2);`,
        `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;`,
        `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();`,
        `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();`
      ]

      for (let i = 0; i < alterQueries.length; i++) {
        const query = alterQueries[i]
        console.log(`\n実行中 (${i + 1}/${alterQueries.length}): ${query}`)

        try {
          // プロファイルテーブルに直接アクセスして構造を推測
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .limit(1)

          if (error && error.message.includes('daily_calorie_goal')) {
            console.log('✅ daily_calorie_goalカラムが不足しています')
          }

        } catch (e) {
          console.log(`⚠️  クエリ実行エラー: ${e}`)
        }
      }
    } else {
      console.log('✅ テーブル構造:', currentStructure)
    }

    // 3. テスト用プロファイル作成/更新を試行
    console.log('\n3. プロファイル更新テスト中...')

    // まず簡単な更新から試す
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (testData && testData.length > 0) {
      const userId = testData[0].id

      // 段階的に更新を試行
      const testUpdates = [
        { name: 'テストユーザー' },
        { daily_calorie_goal: 2000 },
        { height: 170 },
        { weight: 60 },
        { gender: 'other' }
      ]

      for (const update of testUpdates) {
        const field = Object.keys(update)[0]
        console.log(`\n${field}フィールドの更新テスト...`)

        const { error: updateError } = await supabase
          .from('profiles')
          .update(update)
          .eq('id', userId)

        if (updateError) {
          console.log(`❌ ${field}フィールドエラー:`, updateError.message)
          if (updateError.message.includes('does not exist')) {
            console.log(`🔧 ${field}カラムが存在しません。手動でカラム追加が必要です。`)
          }
        } else {
          console.log(`✅ ${field}フィールド更新成功`)
        }
      }
    }

    console.log('\n🎯 修正方法:')
    console.log('以下のSQLをSupabaseダッシュボードのSQL Editorで実行してください:')
    console.log(`
-- プロファイルテーブルに必要なカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_calorie_goal INTEGER DEFAULT 2000;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
    `)

  } catch (error) {
    console.error('❌ エラー:', error)
  }
}

fixProfileTable()