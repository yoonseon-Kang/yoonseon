/**
 * 식사 데이터 관리 훅
 * - 날짜별 식사 기록 저장 및 조회
 * - CRUD 기능 제공 (추가, 조회, 수정, 삭제)
 */

import { useState } from 'react';
import { Meal } from '../components/MealCard';

// 임시 데이터 - 실제 서비스에서는 API로 대체 예정
const MOCK_MEALS: Record<string, Meal[]> = {
  '2025-09-21': [
    {
      id: '1',
      name: '닭가슴살 샐러드',
      amount: 200,
      calories: 350,
      protein: 40.5,
      carbs: 12.3,
      fat: 15.2,
      time: '08:30',
      sugar: 8.5,
      sodium: 850,
      cholesterol: 45,
      saturatedFat: 3.2,
      transFat: 0.1
    },
    {
      id: '2',
      name: '현미밥과 불고기',
      amount: 400,
      calories: 650,
      protein: 35.8,
      carbs: 85.4,
      fat: 20.1,
      time: '12:30',
      sugar: 12.7,
      sodium: 1200,
      cholesterol: 68,
      saturatedFat: 7.5,
      transFat: 0.3
    },
    {
      id: '3',
      name: '연어스테이크',
      amount: 180,
      calories: 450,
      protein: 45.2,
      carbs: 5.1,
      fat: 25.6,
      time: '18:30',
      sugar: 2.3,
      sodium: 650,
      cholesterol: 82,
      saturatedFat: 5.8,
      transFat: 0
    }
  ],
  '2025-09-20': [
    {
      id: '4',
      name: '오트밀',
      amount: 150,
      calories: 280,
      protein: 12.4,
      carbs: 48.7,
      fat: 6.3,
      time: '08:00',
      sugar: 15.2,
      sodium: 450,
      cholesterol: 0,
      saturatedFat: 1.1,
      transFat: 0
    },
    {
      id: '5',
      name: '그릭 요거트',
      amount: 200,
      calories: 180,
      protein: 20.1,
      carbs: 9.8,
      fat: 8.5,
      time: '15:00',
      sugar: 9.8,
      sodium: 320,
      cholesterol: 25,
      saturatedFat: 5.2,
      transFat: 0
    }
  ],
  '2025-09-19': [
    {
      id: '6',
      name: '김치찌개',
      amount: 350,
      calories: 320,
      protein: 18.5,
      carbs: 25.2,
      fat: 12.8,
      time: '12:00',
      sugar: 6.3,
      sodium: 1850,
      cholesterol: 35,
      saturatedFat: 4.2,
      transFat: 0.1
    },
    {
      id: '7',
      name: '구운 고등어',
      amount: 120,
      calories: 280,
      protein: 26.3,
      carbs: 0.5,
      fat: 18.9,
      time: '18:30',
      sugar: 0.2,
      sodium: 420,
      cholesterol: 75,
      saturatedFat: 5.1,
      transFat: 0
    }
  ]
};

export const useMeals = () => {
  const [meals, setMeals] = useState<Record<string, Meal[]>>(MOCK_MEALS);

  // Date 객체를 YYYY-MM-DD 문자열로 변환 (타임존 문제 방지)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 특정 날짜의 식사 목록 조회 (시간순 정렬)
  const getMealsByDate = (date: Date) => {
    const dateString = formatDate(date);
    return (meals[dateString] || []).sort((a, b) => a.time.localeCompare(b.time));
  };

  // 식사 삭제
  const deleteMeal = (date: Date, mealId: string) => {
    const dateString = formatDate(date);
    setMeals(prev => ({
      ...prev,
      [dateString]: (prev[dateString] || []).filter(meal => meal.id !== mealId)
    }));
  };

  // 식사 수정
  const updateMeal = (date: Date, mealId: string, updatedMeal: Meal) => {
    const dateString = formatDate(date);
    setMeals(prev => ({
      ...prev,
      [dateString]: (prev[dateString] || []).map(meal =>
        meal.id === mealId ? { ...meal, ...updatedMeal } : meal
      )
    }));
  };

  // 식사 추가
  const addMeal = (date: Date, meal: Meal) => {
    const dateString = formatDate(date);
    setMeals(prev => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), meal]
    }));
  };

  // 식사 기록이 있는 모든 날짜 조회
  const getAllMealDates = () => {
    return Object.keys(meals).filter(dateString => meals[dateString].length > 0);
  };

  // 특정 날짜에 식사 기록이 있는지 확인 (캘린더 점 표시용)
  const hasMealsOnDate = (date: Date) => {
    const dateString = formatDate(date);
    return meals[dateString] && meals[dateString].length > 0;
  };

  return {
    getMealsByDate,    // 날짜별 식사 조회
    deleteMeal,        // 식사 삭제
    updateMeal,        // 식사 수정
    addMeal,           // 식사 추가
    getAllMealDates,   // 기록 있는 날짜 목록
    hasMealsOnDate     // 날짜 기록 확인
  };
};