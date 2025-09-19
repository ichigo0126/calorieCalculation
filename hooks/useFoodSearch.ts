import { useState } from 'react'
import * as Crypto from 'expo-crypto'

export interface FoodItem {
  food_id: string
  food_name: string
  brand_name?: string
  food_type: string
  food_url: string
}

export interface FoodNutrition {
  food_id: string
  food_name: string
  calories: number
  carbohydrate: number
  protein: number
  fat: number
  serving_description: string
}

export interface FoodSuggestion {
  food: FoodNutrition
  portion: number // 何人前分か
  displayName: string
}

export const useFoodSearch = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const consumerKey = process.env.EXPO_PUBLIC_FATSECRET_CONSUMER_KEY!
  const consumerSecret = process.env.EXPO_PUBLIC_FATSECRET_CONSUMER_SECRET!

  // OAuth 1.0a署名を生成
  const generateSignature = async (
    method: string,
    url: string,
    params: Record<string, string>
  ): Promise<string> => {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const nonce = Math.random().toString(36).substring(2, 15)

    const oauthParams = {
      oauth_consumer_key: consumerKey,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_version: '1.0',
      ...params,
    }

    // パラメータをソートしてエンコード
    const sortedParams = Object.keys(oauthParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
      .join('&')

    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`
    const signingKey = `${encodeURIComponent(consumerSecret)}&`

    // HMAC-SHA1署名を生成
    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      signingKey + baseString,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    )

    return signature
  }

  // FatSecret APIを呼び出し
  const callFatSecretAPI = async (params: Record<string, string>) => {
    try {
      const baseUrl = 'https://platform.fatsecret.com/rest/server.api'
      console.log('🌐 API呼び出し:', params)

      const signature = await generateSignature('GET', baseUrl, params)
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const nonce = Math.random().toString(36).substring(2, 15)

      const fullParams = new URLSearchParams({
        ...params,
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: timestamp,
        oauth_version: '1.0',
        oauth_signature: signature,
        format: 'json',
      })

      console.log('📡 リクエストURL:', `${baseUrl}?${fullParams}`)
      const response = await fetch(`${baseUrl}?${fullParams}`)
      console.log('📥 レスポンス状態:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ APIエラー詳細:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('📊 APIレスポンス:', data)
      return data
    } catch (err) {
      console.error('❌ FatSecret API Error:', err)
      throw err
    }
  }

  // 食べ物を検索
  const searchFoods = async (query: string): Promise<FoodItem[]> => {
    setLoading(true)
    setError(null)

    try {
      const data = await callFatSecretAPI({
        method: 'foods.search',
        search_expression: query,
        max_results: '10',
      })

      const foods = data.foods?.food || []
      return Array.isArray(foods) ? foods : [foods]
    } catch (err) {
      setError('食べ物の検索に失敗しました')
      return []
    } finally {
      setLoading(false)
    }
  }

  // 食べ物の詳細栄養情報を取得
  const getFoodNutrition = async (foodId: string): Promise<FoodNutrition | null> => {
    try {
      const data = await callFatSecretAPI({
        method: 'food.get',
        food_id: foodId,
      })

      const food = data.food
      if (!food || !food.servings) return null

      // 最初のサービングを使用（通常は標準的な分量）
      const serving = Array.isArray(food.servings.serving)
        ? food.servings.serving[0]
        : food.servings.serving

      return {
        food_id: food.food_id,
        food_name: food.food_name,
        calories: parseFloat(serving.calories || '0'),
        carbohydrate: parseFloat(serving.carbohydrate || '0'),
        protein: parseFloat(serving.protein || '0'),
        fat: parseFloat(serving.fat || '0'),
        serving_description: serving.serving_description || '',
      }
    } catch (err) {
      console.error('Nutrition fetch error:', err)
      return null
    }
  }

  // 消費カロリーに基づいて食べ物を提案（静的データ版）
  const suggestFoodsForCalories = async (targetCalories: number): Promise<FoodSuggestion[]> => {
    setLoading(true)
    setError(null)

    try {
      // 日本の一般的な食べ物データ（1人前あたりのカロリー）
      const foodDatabase = [
        { name: 'みかん', calories: 34, protein: 0.7, carbohydrate: 8.8, fat: 0.1, serving: '1個(75g)' },
        { name: 'いちご', calories: 27, protein: 0.9, carbohydrate: 7.1, fat: 0.1, serving: '5粒(75g)' },
        { name: 'ヨーグルト', calories: 62, protein: 3.6, carbohydrate: 4.9, fat: 3.0, serving: '1個(100g)' },
        { name: 'チーズ', calories: 68, protein: 5.1, carbohydrate: 0.3, fat: 5.2, serving: '1切れ(20g)' },
        { name: 'ゆで卵', calories: 91, protein: 7.7, carbohydrate: 0.2, fat: 6.2, serving: '1個(60g)' },
        { name: 'バナナ', calories: 93, protein: 1.2, carbohydrate: 24.3, fat: 0.2, serving: '1本(108g)' },
        { name: '牛乳', calories: 134, protein: 6.6, carbohydrate: 9.6, fat: 7.6, serving: '1杯(200ml)' },
        { name: 'りんご', calories: 138, protein: 0.5, carbohydrate: 37.4, fat: 0.3, serving: '1個(255g)' },
        { name: '食パン', calories: 158, protein: 5.6, carbohydrate: 28.0, fat: 2.6, serving: '1枚(60g)' },
        { name: 'おにぎり', calories: 179, protein: 2.7, carbohydrate: 39.4, fat: 0.3, serving: '1個' },
        { name: 'アーモンド', calories: 179, protein: 5.6, carbohydrate: 2.9, fat: 16.3, serving: '1掴み(30g)' },
        { name: '焼き鮭', calories: 202, protein: 22.5, carbohydrate: 0.1, fat: 12.8, serving: '1切れ(80g)' },
        { name: '鶏むね肉', calories: 216, protein: 44.6, carbohydrate: 0, fat: 3.0, serving: '1切れ(200g)' },
        { name: 'ご飯', calories: 252, protein: 3.8, carbohydrate: 55.7, fat: 0.5, serving: '1膳(150g)' },
        { name: 'チョコレート', calories: 279, protein: 3.7, carbohydrate: 26.0, fat: 17.1, serving: '1枚(50g)' },
        { name: 'カップ麺', calories: 364, protein: 10.8, carbohydrate: 50.2, fat: 14.5, serving: '1個' },
        { name: 'ハンバーガー', calories: 400, protein: 20.1, carbohydrate: 35.2, fat: 20.8, serving: '1個' },
        { name: 'ピザ', calories: 268, protein: 10.1, carbohydrate: 26.8, fat: 13.3, serving: '1切れ(100g)' },
        { name: 'から揚げ', calories: 290, protein: 16.6, carbohydrate: 9.1, fat: 21.9, serving: '4個(100g)' },
        { name: 'ポテトチップス', calories: 336, protein: 4.7, carbohydrate: 32.4, fat: 21.1, serving: '1袋(60g)' },
      ]

      const suggestions: FoodSuggestion[] = []

      foodDatabase.forEach(food => {
        // 消費カロリー以下の食べ物のみ提案（1人前のカロリーが消費カロリー以下）
        if (food.calories <= targetCalories) {
          suggestions.push({
            food: {
              food_id: food.name,
              food_name: food.name,
              calories: food.calories,
              carbohydrate: food.carbohydrate,
              protein: food.protein,
              fat: food.fat,
              serving_description: food.serving
            },
            portion: 1, // 常に1人前
            displayName: `${food.name} 1人前`
          })
        }
      })

      // カロリーに最も近い順にソート
      suggestions.sort((a, b) => {
        const diffA = Math.abs(a.food.calories * a.portion - targetCalories)
        const diffB = Math.abs(b.food.calories * b.portion - targetCalories)
        return diffA - diffB
      })

      await new Promise(resolve => setTimeout(resolve, 500)) // UI用の短い遅延

      return suggestions.slice(0, 10) // 上位10個を返す
    } catch (err) {
      setError('食べ物の提案に失敗しました')
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    searchFoods,
    getFoodNutrition,
    suggestFoodsForCalories,
    loading,
    error,
  }
}