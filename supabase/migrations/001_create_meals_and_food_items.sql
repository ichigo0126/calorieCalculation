-- カロリー計算アプリに必要なテーブルを作成

-- mealsテーブル: ユーザーの食事記録
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  protein NUMERIC(5,2) CHECK (protein >= 0),
  carbs NUMERIC(5,2) CHECK (carbs >= 0),
  fat NUMERIC(5,2) CHECK (fat >= 0),
  meal_time TIMESTAMPTZ NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- food_itemsテーブル: 食品データベース
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  calories_per_100g INTEGER NOT NULL CHECK (calories_per_100g >= 0),
  protein_per_100g NUMERIC(5,2) CHECK (protein_per_100g >= 0),
  carbs_per_100g NUMERIC(5,2) CHECK (carbs_per_100g >= 0),
  fat_per_100g NUMERIC(5,2) CHECK (fat_per_100g >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- profilesテーブルに日次カロリー目標を追加（既存テーブルの場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'daily_calorie_goal'
  ) THEN
    ALTER TABLE profiles ADD COLUMN daily_calorie_goal INTEGER DEFAULT 2000 CHECK (daily_calorie_goal > 0);
  END IF;
END $$;

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_meal_time ON meals(meal_time);
CREATE INDEX IF NOT EXISTS idx_meals_user_id_meal_time ON meals(user_id, meal_time);
CREATE INDEX IF NOT EXISTS idx_food_items_name ON food_items(name);

-- RLSポリシー設定
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

-- mealsテーブルのRLSポリシー: ユーザーは自分の食事記録のみアクセス可能
CREATE POLICY "Users can view their own meals" ON meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" ON meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" ON meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" ON meals
  FOR DELETE USING (auth.uid() = user_id);

-- food_itemsテーブルのRLSポリシー: 全ユーザーが読み取り可能、認証済みユーザーは追加可能
CREATE POLICY "Anyone can view food items" ON food_items
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert food items" ON food_items
  FOR INSERT TO authenticated WITH CHECK (true);

-- サンプル食品データを挿入
INSERT INTO food_items (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g) VALUES
  ('白米', 358, 6.1, 77.6, 0.9),
  ('玄米', 353, 6.8, 73.8, 2.7),
  ('鶏胸肉(皮なし)', 108, 22.3, 0.0, 1.5),
  ('鶏もも肉(皮なし)', 116, 18.8, 0.0, 3.9),
  ('豚ロース', 263, 19.3, 0.2, 19.2),
  ('牛もも肉', 182, 21.2, 0.3, 9.6),
  ('サーモン', 139, 22.3, 0.1, 4.5),
  ('まぐろ(赤身)', 125, 26.4, 0.1, 1.4),
  ('卵', 151, 12.3, 0.3, 10.3),
  ('牛乳', 67, 3.3, 4.8, 3.8),
  ('ヨーグルト(プレーン)', 62, 3.6, 4.9, 3.0),
  ('バナナ', 86, 1.1, 22.5, 0.2),
  ('りんご', 54, 0.2, 14.6, 0.1),
  ('ブロッコリー', 33, 4.3, 5.2, 0.5),
  ('ほうれん草', 20, 2.2, 3.1, 0.4)
ON CONFLICT (name) DO NOTHING;