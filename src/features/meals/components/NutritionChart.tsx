import React from 'react';
import { Meal } from './MealCard';

type NutritionChartProps = {
  meals: Meal[];
  date: Date;
};

export const NutritionChart: React.FC<NutritionChartProps> = ({ meals, date }) => {
  const totalNutrition = meals.reduce(
    (total, meal) => ({
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      carbs: total.carbs + meal.carbs,
      fat: total.fat + meal.fat,
      sugar: total.sugar + (meal.sugar || 0),
      sodium: total.sodium + (meal.sodium || 0),
      cholesterol: total.cholesterol + (meal.cholesterol || 0),
      saturatedFat: total.saturatedFat + (meal.saturatedFat || 0),
      transFat: total.transFat + (meal.transFat || 0),
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
      saturatedFat: 0,
      transFat: 0,
    }
  );

  // 8가지 영양소 데이터 (값이 있는 것만 포함)
  const nutritionItems = [
    { name: '탄수화물', value: totalNutrition.carbs, displayValue: totalNutrition.carbs, unit: 'g', color: '#3b82f6' },
    { name: '단백질', value: totalNutrition.protein, displayValue: totalNutrition.protein, unit: 'g', color: '#10b981' },
    { name: '지방', value: totalNutrition.fat, displayValue: totalNutrition.fat, unit: 'g', color: '#f59e0b' },
    { name: '당류', value: totalNutrition.sugar, displayValue: totalNutrition.sugar, unit: 'g', color: '#ef4444' },
    { name: '포화지방', value: totalNutrition.saturatedFat, displayValue: totalNutrition.saturatedFat, unit: 'g', color: '#8b5cf6' },
    { name: '트랜스지방', value: totalNutrition.transFat, displayValue: totalNutrition.transFat, unit: 'g', color: '#ec4899' },
    { name: '콜레스테롤', value: totalNutrition.cholesterol / 100, displayValue: totalNutrition.cholesterol, unit: 'mg', color: '#06b6d4' },
    { name: '나트륨', value: totalNutrition.sodium / 1000, displayValue: totalNutrition.sodium, unit: 'mg', color: '#84cc16' }
  ].filter(item => item.displayValue > 0);

  // 총합 계산 (비율을 위해, 조정된 값 사용)
  const totalValue = nutritionItems.reduce((sum, item) => sum + item.value, 0);

  // SVG 원형 차트를 위한 계산
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  // 각 영양소의 비율과 스트로크 계산
  let currentOffset = 0;
  const chartData = nutritionItems.map(item => {
    const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    const strokeLength = (percentage / 100) * circumference;
    const offset = currentOffset;
    currentOffset += strokeLength;

    return {
      ...item,
      percentage,
      strokeLength,
      offset
    };
  });

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    }
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });
  };

  if (meals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-center mb-6">{formatDate(date)}의 섭취 칼로리</h3>

      {/* 총 칼로리 */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-emerald-600 mb-1">
          {totalNutrition.calories.toLocaleString()}
          <span className="text-lg font-normal text-gray-500 ml-1">kcal</span>
        </div>
      </div>

      {/* 원형 차트 */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg width="180" height="180" className="transform -rotate-90">
            {/* 배경 원 */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#f3f4f6"
              strokeWidth="20"
              fill="transparent"
            />

            {/* 각 영양소별 원형 차트 */}
            {chartData.map((item, index) => (
              <circle
                key={item.name}
                cx="90"
                cy="90"
                r={radius}
                stroke={item.color}
                strokeWidth="20"
                fill="transparent"
                strokeDasharray={`${item.strokeLength} ${circumference}`}
                strokeDashoffset={-item.offset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dasharray 0.5s ease-in-out',
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* 범례 */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold">{item.percentage.toFixed(0)}%</div>
              <div className="text-xs text-gray-500">({item.displayValue.toFixed(1)}{item.unit})</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};