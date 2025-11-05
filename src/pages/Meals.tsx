import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { MealCard, Meal } from '../features/meals/components/MealCard';
import { AddMealModal } from '../features/meals/components/AddMealModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { NutritionChart } from '../features/meals/components/NutritionChart';
import { useMeals } from '../features/meals/hooks/useMeals';

const getPeriodFromTime = (time: string): string => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 11) return '아침';
  if (hour < 15) return '점심';
  return '저녁';
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const MealsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);
  const { getMealsByDate, deleteMeal, updateMeal, addMeal, hasMealsOnDate } = useMeals();

  // URL 파라미터에서 날짜를 가져와서 selectedDate 설정
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const [year, month, day] = dateParam.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  }, [searchParams]);

  // Date를 YYYY-MM-DD 문자열로 변환 (타임존 문제 방지)
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateMeals = getMealsByDate(selectedDate);

  // 어제 날짜의 식사 기록 가져오기
  const yesterday = new Date(selectedDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayMeals = getMealsByDate(yesterday);

  const handleDeleteConfirm = () => {
    if (mealToDelete) {
      const date = selectedDateMeals.includes(mealToDelete) ? selectedDate : yesterday;
      deleteMeal(date, mealToDelete.id);
      setMealToDelete(null);
    }
  };

  const handleDelete = (meal: Meal) => {
    setMealToDelete(meal);
  };

  const handleEdit = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setSelectedMeal(null);
  };

  const handleMealSubmit = (meal: Meal) => {
    if (selectedMeal) {
      // 수정 모드
      const date = selectedDateMeals.includes(selectedMeal) ? selectedDate : yesterday;
      updateMeal(date, selectedMeal.id, meal);
    } else {
      // 추가 모드
      const newMeal: Meal = {
        ...meal,
        id: Date.now().toString() // 고유 ID 생성
      };
      addMeal(selectedDate, newMeal);
    }
    handleModalClose();
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-6 max-w-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">식사 기록</h1>
        <motion.button
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAddModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          식사 추가
        </motion.button>
      </motion.div>

      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={formatDateString(selectedDate)}
            onChange={(e) => {
              const [year, month, day] = e.target.value.split('-').map(Number);
              setSelectedDate(new Date(year, month - 1, day));
            }}
            className="flex-1 p-3 border border-gray-200 rounded-lg"
          />
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-3 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            오늘
          </button>
        </div>
      </motion.div>

      {/* 선택한 날짜의 영양 차트 */}
      {selectedDateMeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <NutritionChart meals={selectedDateMeals} date={selectedDate} />
        </motion.div>
      )}


      <AnimatePresence>
        <motion.div className="space-y-6">
          {/* 선택한 날짜의 식사 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
            layout
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">{formatDate(selectedDate)}의 식사</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {selectedDateMeals.length > 0 ? (
                  selectedDateMeals.map((meal) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MealCard
                        meal={{
                          ...meal,
                          time: meal.time || '12:00' // 기본값 설정
                        }}
                        accentColor="text-emerald-500"
                        onDelete={() => handleDelete(meal)}
                        onEdit={() => handleEdit(meal)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {formatDate(selectedDate)}의 기록된 식사가 없습니다
                  </div>
                )}
              </div>
            </div>
          </motion.div>



          {/* 어제의 식사 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
            layout
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">{formatDate(yesterday)}의 식사</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {yesterdayMeals.length > 0 ? (
                  yesterdayMeals.map((meal) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MealCard
                        meal={{
                          ...meal,
                          time: meal.time || '12:00' // 기본값 설정
                        }}
                        accentColor="text-emerald-500"
                        onDelete={() => handleDelete(meal)}
                        onEdit={() => handleEdit(meal)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {formatDate(yesterday)}의 기록된 식사가 없습니다
                  </div>
                )}
              </div>
            </div>
          </motion.div>



        </motion.div>
      </AnimatePresence>

      <AddMealModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        initialMeal={selectedMeal}
        onSubmit={handleMealSubmit}
      />

      <ConfirmModal
        isOpen={mealToDelete !== null}
        onClose={() => setMealToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="식사 기록 삭제"
        message={`${mealToDelete?.name || ''} 기록을 삭제하시겠습니까?`}
      />
    </motion.div>
  );
};