import { useState, useCallback } from '@lynx-js/react';

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  category: string;
  unit: string;
}

interface FoodScreenProps {
  onRender?: () => void;
}

const foodDatabase: FoodItem[] = [
  // 主食
  { id: 1, name: 'ご飯', calories: 168, category: '主食', unit: '100g' },
  { id: 2, name: 'パン', calories: 264, category: '主食', unit: '100g' },
  { id: 3, name: 'うどん', calories: 105, category: '主食', unit: '100g' },
  { id: 4, name: 'そば', calories: 132, category: '主食', unit: '100g' },
  // 主菜
  { id: 5, name: '鶏むね肉', calories: 108, category: '主菜', unit: '100g' },
  { id: 6, name: '牛肉', calories: 271, category: '主菜', unit: '100g' },
  { id: 7, name: '豚肉', calories: 263, category: '主菜', unit: '100g' },
  { id: 8, name: '卵', calories: 151, category: '主菜', unit: '100g' },
  // 副菜
  { id: 9, name: 'キャベツ', calories: 23, category: '副菜', unit: '100g' },
  { id: 10, name: 'ブロッコリー', calories: 33, category: '副菜', unit: '100g' },
  { id: 11, name: 'にんじん', calories: 37, category: '副菜', unit: '100g' },
  // おやつ
  { id: 12, name: 'チョコレート', calories: 558, category: 'おやつ', unit: '100g' },
  { id: 13, name: 'アイスクリーム', calories: 180, category: 'おやつ', unit: '100g' },
];

const categories = ['すべて', '主食', '主菜', '副菜', 'おやつ'];

export function FoodScreen({ onRender }: FoodScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [consumedFoods, setConsumedFoods] = useState<FoodItem[]>([]);

  onRender?.();

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.includes(searchText);
    const matchesCategory = selectedCategory === 'すべて' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFoodPress = useCallback((food: FoodItem) => {
    'background only';
    setSelectedFood(food);
    setShowModal(true);
  }, []);

  const handleAddFood = useCallback(() => {
    'background only';
    if (selectedFood) {
      setConsumedFoods(prev => [...prev, selectedFood]);
    }
    setShowModal(false);
    setSelectedFood(null);
  }, [selectedFood]);

  const handleCloseModal = useCallback(() => {
    'background only';
    setShowModal(false);
    setSelectedFood(null);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    'background only';
    setSelectedCategory(category);
  }, []);

  const totalCalories = consumedFoods.reduce((total, food) => total + food.calories, 0);

  return (
    <view className="food-screen">
      {/* 検索セクション */}
      <view className="search-section">
        <text className="section-title">食品検索</text>
        <view className="search-input-container">
          <text 
            className="search-input"
            bindtap={() => {
              // 検索入力の代替実装
              const newText = prompt('食品名を入力してください') || '';
              setSearchText(newText);
            }}
          >
            {searchText || '食品名で検索...'}
          </text>
        </view>
      </view>

      {/* カテゴリ選択 */}
      <view className="category-section">
        <text className="section-title">カテゴリ</text>
        <view className="category-buttons">
          {categories.map(category => (
            <view
              key={category}
              className={`category-button ${selectedCategory === category ? 'category-button-active' : ''}`}
              bindtap={() => handleCategoryChange(category)}
            >
              <text className="category-text">{category}</text>
            </view>
          ))}
        </view>
      </view>

      {/* 今日の摂取カロリー */}
      <view className="consumed-section">
        <text className="section-title">今日の摂取カロリー: {totalCalories}kcal</text>
      </view>

      {/* 食品一覧 */}
      <view className="food-list">
        <view className="food-scroll">
          {filteredFoods.map(food => (
            <view
              key={food.id}
              className="food-item"
              bindtap={() => handleFoodPress(food)}
            >
              <view className="food-info">
                <text className="food-name">{food.name}</text>
                <text className="food-details">{food.calories}kcal / {food.unit}</text>
                <text className="food-category">{food.category}</text>
              </view>
              <text className="food-arrow">→</text>
            </view>
          ))}
        </view>
      </view>

      {/* モーダル */}
      {showModal && selectedFood && (
        <view className="modal-overlay">
          <view className="modal-content">
            <text className="modal-title">{selectedFood.name}</text>
            <text className="modal-calories">{selectedFood.calories}kcal / {selectedFood.unit}</text>
            <text className="modal-category">カテゴリ: {selectedFood.category}</text>
            
            <view className="modal-buttons">
              <view className="modal-button cancel" bindtap={handleCloseModal}>
                <text className="modal-button-text">キャンセル</text>
              </view>
              <view className="modal-button confirm" bindtap={handleAddFood}>
                <text className="modal-button-text">食べた</text>
              </view>
            </view>
          </view>
        </view>
      )}
    </view>
  );
}