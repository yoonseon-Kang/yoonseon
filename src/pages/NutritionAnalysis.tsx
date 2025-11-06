import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine, Legend } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const getBMIStatus = (bmi: number): string => {
  if (bmi < 18.5) return '저체중';
  if (bmi < 23) return '정상';
  if (bmi < 25) return '과체중';
  return '비만';
};

const getBMIColor = (bmi: number): string => {
  if (bmi < 18.5) return '#3B82F6'; // 저체중 - 파란색
  if (bmi < 23) return '#10B981'; // 정상 - 초록색
  if (bmi < 25) return '#F59E0B'; // 과체중 - 주황색
  return '#EF4444'; // 비만 - 빨간색
};

export const NutritionAnalysisPage: React.FC = () => {
  // BMI 데이터 상태
  const [userStats, setUserStats] = useState({
    weight: 70, // kg
    height: 170, // cm
  });

  const bmi = calculateBMI(userStats.weight, userStats.height);
  const bmiStatus = getBMIStatus(bmi);
  const bmiColor = getBMIColor(bmi);

  // 주간 날짜 범위 계산 (월요일 기준 시작)
  const getWeekDateRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)

    // 월요일 기준으로 변환 (월=0, 화=1, ..., 일=6)
    const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // 이번 주 월요일 날짜 계산
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayBasedDay);

    // 이번 주 일요일 날짜 계산
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startMonth = monday.getMonth() + 1;
    const startDate = monday.getDate();
    const endMonth = sunday.getMonth() + 1;
    const endDate = sunday.getDate();

    // 같은 달인 경우
    if (startMonth === endMonth) {
      return `${startMonth}월 ${startDate}일 ~ ${endDate}일`;
    }
    // 다른 달인 경우
    return `${startMonth}월 ${startDate}일 ~ ${endMonth}월 ${endDate}일`;
  };

  const weekDateRange = getWeekDateRange();

  // BMI 범위 데이터
  const bmiRanges = [
    { range: '저체중', min: 0, max: 18.5, current: bmi <= 18.5 ? bmi : null },
    { range: '정상', min: 18.5, max: 23, current: bmi > 18.5 && bmi <= 23 ? bmi : null },
    { range: '과체중', min: 23, max: 25, current: bmi > 23 && bmi <= 25 ? bmi : null },
    { range: '비만', min: 25, max: 35, current: bmi > 25 ? bmi : null },
  ];

  // 임시 데이터
  const weeklyData = [
    { day: '월', protein: 75, carbs: 240, fat: 63, '단백질': 75, '탄수화물': 240, '지방': 63 },
    { day: '화', protein: 82, carbs: 250, fat: 70, '단백질': 82, '탄수화물': 250, '지방': 70 },
    { day: '수', protein: 76, carbs: 235, fat: 64, '단백질': 76, '탄수화물': 235, '지방': 64 },
    { day: '목', protein: 85, carbs: 255, fat: 72, '단백질': 85, '탄수화물': 255, '지방': 72 },
    { day: '금', protein: 80, carbs: 248, fat: 68, '단백질': 80, '탄수화물': 248, '지방': 68 },
    { day: '토', protein: 70, carbs: 230, fat: 61, '단백질': 70, '탄수화물': 230, '지방': 61 },
    { day: '일', protein: 78, carbs: 244, fat: 66, '단백질': 78, '탄수화물': 244, '지방': 66 },
  ];

  // 상태 계산: 80% 미만 = 부족, 80-120% = 적정, 120% 초과 = 과다
  const calculateStatus = (current: number, recommended: number): string => {
    const percentage = (current / recommended) * 100;
    if (percentage < 80) return '부족';
    if (percentage <= 120) return '적정';
    return '과다';
  };

  // 상태에 따른 색상 (프로젝트 컬러에 맞춤)
  const getColorByStatus = (status: string): string => {
    switch(status) {
      case '부족': return '#FBBF24'; // 따뜻한 노란색
      case '적정': return '#10B981'; // 에메랄드 그린
      case '과다': return '#F59E0B'; // 오렌지
      default: return '#94A3B8';
    }
  };

  // 영양소 섭취량 비교 데이터 (권장량 대비) - NutritionChart 색상과 일치
  const nutritionComparisonData = [
    {
      name: '칼로리',
      current: 1850,
      recommended: 2000,
      unit: 'kcal',
      fixedColor: '#9ca3af', // 회색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
    {
      name: '탄수화물',
      current: 244,
      recommended: 300,
      unit: 'g',
      fixedColor: '#3b82f6', // 파란색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
    {
      name: '단백질',
      current: 78,
      recommended: 60,
      unit: 'g',
      fixedColor: '#10b981', // 초록색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
    {
      name: '지방',
      current: 66,
      recommended: 50,
      unit: 'g',
      fixedColor: '#f59e0b', // 주황색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
    {
      name: '당류',
      current: 45,
      recommended: 50,
      unit: 'g',
      fixedColor: '#ef4444', // 빨간색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
    {
      name: '포화지방',
      current: 15,
      recommended: 20,
      unit: 'g',
      fixedColor: '#8b5cf6', // 보라색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
    {
      name: '트랜스지방',
      current: 0.5,
      recommended: 2,
      unit: 'g',
      fixedColor: '#ec4899', // 핑크색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
    {
      name: '콜레스테롤',
      current: 180,
      recommended: 300,
      unit: 'mg',
      fixedColor: '#06b6d4', // 청록색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
    {
      name: '나트륨',
      current: 2800,
      recommended: 2000,
      unit: 'mg',
      fixedColor: '#84cc16', // 라임색
      get status() { return calculateStatus(this.current, this.recommended); },
      get color() { return this.fixedColor; }
    },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case '적정': return 'text-emerald-700 bg-emerald-50';
      case '부족': return 'text-yellow-700 bg-yellow-50';
      case '과다': return 'text-orange-700 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6 max-w-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        영양 분석
      </motion.h1>

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* BMI 분석 */}
        <Card>
          <CardHeader>
            <CardTitle>BMI 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* BMI 수치와 상태 */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  신체질량지수(BMI)는 <span className="font-bold text-2xl" style={{ color: bmiColor }}>{bmi}</span> 로 '<span className="font-bold text-xl" style={{ color: bmiColor }}>{bmiStatus}</span>' 입니다.
                </p>
                <p className="text-sm text-gray-600">
                  평균체중은 <span className="font-bold">{userStats.weight} kg</span> 입니다.
                </p>
              </div>

              {/* BMI 범위 바 */}
              <div className="relative">
                <div className="flex h-8 rounded-full overflow-hidden">
                  <div className="bg-blue-400 flex-1 flex items-center justify-center text-xs text-white font-medium">
                    저체중
                  </div>
                  <div className="bg-emerald-400 flex-1 flex items-center justify-center text-xs text-white font-medium">
                    정상
                  </div>
                  <div className="bg-orange-400 flex-1 flex items-center justify-center text-xs text-white font-medium">
                    과체중
                  </div>
                  <div className="bg-red-400 flex-1 flex items-center justify-center text-xs text-white font-medium">
                    비만
                  </div>
                </div>

                {/* BMI 값 표시 화살표 */}
                <div
                  className="absolute top-full mt-1 transform -translate-x-1/2"
                  style={{
                    left: `${Math.min(Math.max((bmi / 35) * 100, 5), 95)}%`
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-transparent border-b-gray-800"></div>
                  </div>
                </div>
              </div>

              {/* 범위 표시 */}
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>0</span>
                <span>18.5</span>
                <span>23</span>
                <span>25</span>
                <span>30+</span>
              </div>

              {/* 키와 체중 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">{userStats.height} cm</div>
                  <div className="text-xs text-gray-500 mt-1">키</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">{userStats.weight} kg</div>
                  <div className="text-xs text-gray-500 mt-1">체중</div>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* 오늘의 영양소 섭취량 분석 */}
        <Card>
          <CardHeader>
            <CardTitle>오늘의 영양소 섭취량 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {nutritionComparisonData.map((nutrient, index) => {
                const percentage = Math.round((nutrient.current / nutrient.recommended) * 100);
                const isOver = percentage > 100;
                const barWidth = Math.min(percentage, 100);

                return (
                  <motion.div
                    key={nutrient.name}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{nutrient.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(nutrient.status)}`}>
                          {nutrient.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold" style={{ color: nutrient.color }}>
                          {nutrient.current}
                        </span>
                        <span className="text-gray-400"> / {nutrient.recommended}</span>
                        <span className="text-gray-500"> {nutrient.unit}</span>
                      </div>
                    </div>

                    <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          backgroundColor: nutrient.color,
                          width: `${barWidth}%`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + (0.1 * index) }}
                      />
                      {isOver && (
                        <motion.div
                          className="absolute right-0 top-0 h-full bg-red-200 opacity-50"
                          style={{
                            width: `${Math.min(percentage - 100, 50)}%`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage - 100, 50)}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + (0.1 * index) }}
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-700">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                className="mt-6 p-4 bg-blue-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-2">💡 영양 섭취 팁</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 탄수화물이 부족합니다. 통곡물이나 현미밥을 추가해보세요.</li>
                    <li>• 나트륨 섭취가 많습니다. 가공식품 섭취를 줄여보세요.</li>
                    <li>• 식이섬유 섭취를 늘리기 위해 채소와 과일을 충분히 드세요.</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        {/* 주간 영양소 섭취 현황 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>주간 영양소 섭취 현황</CardTitle>
              <span className="text-xs text-gray-500">기준: {weekDateRange}</span>
            </div>
          </CardHeader>
          <CardContent>
            <motion.div
              className="h-[400px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#9ca3af"
                    label={{ value: '섭취량 (g)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '6px', color: '#374151', fontSize: '14px' }}
                    itemStyle={{ fontSize: '13px', padding: '2px 0' }}
                    formatter={(value: number, name: string) => {
                      const recommended: { [key: string]: number } = {
                        '단백질': 80,
                        '탄수화물': 300,
                        '지방': 60
                      };
                      const recommendedValue = recommended[name] || 0;
                      const percentage = ((value / recommendedValue) * 100).toFixed(0);
                      return [`${value}g (${percentage}%)`, name];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="square"
                  />

                  {/* 쌓인 막대 그래프: 단백질, 지방, 탄수화물 순 */}
                  <Bar dataKey="단백질" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="지방" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="탄수화물" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* 주간 평균 및 권장량 비교 */}
            <motion.div
              className="mt-4 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-3 gap-3">
                {/* 단백질 */}
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                    <div className="text-xs font-medium text-gray-600">단백질</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">78g</div>
                  <div className="text-xs text-gray-500 mt-0.5">주간 평균</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-200">
                    <span className="text-xs text-gray-500">권장</span>
                    <span className="text-xs font-semibold text-gray-700">80g</span>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-medium">98%</span>
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">부족</span>
                    </div>
                  </div>
                </div>
                {/* 지방 */}
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                    <div className="text-xs font-medium text-gray-600">지방</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">66g</div>
                  <div className="text-xs text-gray-500 mt-0.5">주간 평균</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-orange-200">
                    <span className="text-xs text-gray-500">권장</span>
                    <span className="text-xs font-semibold text-gray-700">60g</span>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-orange-600 font-medium">110%</span>
                      <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">과다</span>
                    </div>
                  </div>
                </div>
                {/* 탄수화물 */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                    <div className="text-xs font-medium text-gray-600">탄수화물</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">244g</div>
                  <div className="text-xs text-gray-500 mt-0.5">주간 평균</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200">
                    <span className="text-xs text-gray-500">권장</span>
                    <span className="text-xs font-semibold text-gray-700">300g</span>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">81%</span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">적정</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

      </motion.div>
    </motion.div>
  );
};