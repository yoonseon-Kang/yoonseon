import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useMeals } from '../features/meals/hooks/useMeals';

export const CalendarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { getMealsByDate, hasMealsOnDate } = useMeals();

  // 현재 월의 시작일과 마지막일
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // 캘린더에 표시할 날짜 범위 (이전/다음 달의 일부 날짜 포함)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  // 캘린더에 표시할 모든 날짜
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // 식사 클릭 핸들러 - meals 페이지로 이동하며 해당 날짜를 선택
  const handleMealClick = (date: Date) => {
    // 선택된 날짜를 URL 파라미터로 전달
    const dateString = format(date, 'yyyy-MM-dd');
    navigate(`/meals?date=${dateString}`);
  };


  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-neutral-600 hover:text-emerald-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-neutral-900">
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h1>
          <button
            onClick={goToToday}
            className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
          >
            오늘
          </button>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 text-neutral-600 hover:text-emerald-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isToday = isSameDay(date, new Date());
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const hasMeals = hasMealsOnDate(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`
                relative h-12 text-sm rounded-lg transition-colors
                ${isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'}
                ${isToday ? 'bg-emerald-100 text-emerald-700 font-bold' : ''}
                ${isSelected ? 'bg-emerald-500 text-white' : ''}
                ${!isSelected && !isToday ? 'hover:bg-neutral-100' : ''}
              `}
            >
              {format(date, 'd')}
              {hasMeals && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜의 식사 정보 */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">
            {format(selectedDate, 'M월 d일 (E)', { locale: ko })} 식사 기록
          </h3>
          {getMealsByDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getMealsByDate(selectedDate).map((meal) => (
                <div
                  key={meal.id}
                  onClick={() => handleMealClick(selectedDate)}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <div>
                      <span className="text-neutral-900 font-medium">{meal.name}</span>
                      <div className="text-sm text-neutral-500">
                        {meal.amount}g · {meal.calories}kcal
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p>이 날의 식사 기록이 없습니다</p>
              <button className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                식사 추가하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
