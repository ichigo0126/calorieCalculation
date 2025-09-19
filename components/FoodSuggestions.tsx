import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useFoodSearch, FoodSuggestion } from '@/hooks/useFoodSearch'

interface FoodSuggestionsProps {
  burnedCalories: number
  onFoodSelect?: (food: FoodSuggestion) => void
}

export const FoodSuggestions: React.FC<FoodSuggestionsProps> = ({
  burnedCalories,
  onFoodSelect,
}) => {
  const { suggestFoodsForCalories, loading, error } = useFoodSearch()
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (burnedCalories > 0) {
      loadSuggestions()
    }
  }, [burnedCalories])

  const loadSuggestions = async () => {
    try {
      const results = await suggestFoodsForCalories(burnedCalories)
      setSuggestions(results)
    } catch (err) {
      console.error('食べ物提案の読み込みに失敗:', err)
    }
  }

  const getFoodIcon = (foodName: string): string => {
    const name = foodName.toLowerCase()
    if (name.includes('apple')) return 'apple'
    if (name.includes('banana')) return 'lemon-o'
    if (name.includes('bread') || name.includes('rice')) return 'cutlery'
    if (name.includes('chicken') || name.includes('meat')) return 'cutlery'
    if (name.includes('milk') || name.includes('yogurt')) return 'glass'
    if (name.includes('egg')) return 'circle'
    if (name.includes('cheese')) return 'square'
    return 'cutlery'
  }

  const formatCalories = (calories: number): string => {
    return Math.round(calories).toString()
  }

  const formatPortion = (portion: number): string => {
    if (portion < 0.1) return '少量'
    if (portion < 1) return `${Math.round(portion * 100)}%`
    if (portion >= 10) return `${Math.round(portion)}人前`
    return `${portion.toFixed(1)}人前`
  }

  if (burnedCalories <= 0) {
    return null
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <FontAwesome name="lightbulb-o" size={18} color="#4299e1" />
          <Text style={styles.headerTitle}>
            消費した {burnedCalories}kcal で食べられるもの
          </Text>
        </View>
        <FontAwesome
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color="#718096"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4299e1" />
              <Text style={styles.loadingText}>食べ物を検索中...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-triangle" size={16} color="#e53e3e" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadSuggestions}
              >
                <Text style={styles.retryText}>再試行</Text>
              </TouchableOpacity>
            </View>
          ) : suggestions.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsScroll}
            >
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionCard}
                  onPress={() => onFoodSelect?.(suggestion)}
                  activeOpacity={0.7}
                >
                  <View style={styles.foodIconContainer}>
                    <FontAwesome
                      name={getFoodIcon(suggestion.food.food_name)}
                      size={24}
                      color="#4299e1"
                    />
                  </View>
                  <Text style={styles.foodName} numberOfLines={2}>
                    {suggestion.food.food_name}
                  </Text>
                  <Text style={styles.portionText}>
                    {formatPortion(suggestion.portion)}
                  </Text>
                  <Text style={styles.caloriesText}>
                    {formatCalories(suggestion.food.calories * suggestion.portion)} kcal
                  </Text>
                  <View style={styles.nutritionInfo}>
                    <Text style={styles.nutritionText}>
                      P:{Math.round(suggestion.food.protein * suggestion.portion)}g
                    </Text>
                    <Text style={styles.nutritionText}>
                      C:{Math.round(suggestion.food.carbohydrate * suggestion.portion)}g
                    </Text>
                    <Text style={styles.nutritionText}>
                      F:{Math.round(suggestion.food.fat * suggestion.portion)}g
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noResultsContainer}>
              <FontAwesome name="search" size={24} color="#a0aec0" />
              <Text style={styles.noResultsText}>
                この消費カロリーに適した食べ物が見つかりませんでした
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadSuggestions}
              >
                <Text style={styles.retryText}>再検索</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7fafc',
    borderRadius: 8,
    marginTop: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#edf2f7',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748',
    marginLeft: 8,
  },
  content: {
    padding: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#718096',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginVertical: 8,
  },
  retryButton: {
    backgroundColor: '#4299e1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsScroll: {
    marginHorizontal: -4,
  },
  suggestionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    width: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodIconContainer: {
    backgroundColor: '#edf2f7',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 32,
  },
  portionText: {
    fontSize: 11,
    color: '#4299e1',
    fontWeight: '600',
    marginBottom: 4,
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e53e3e',
    marginBottom: 6,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  nutritionText: {
    fontSize: 10,
    color: '#718096',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginVertical: 12,
  },
})