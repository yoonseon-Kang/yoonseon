import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

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

  // 영양소 섭취량 비교 데이터 (권장량 대비)
  const nutritionComparisonData = [
    {
      name: '칼로리',
      current: 1850,
      recommended: 2000,
      unit: 'kcal',
      color: '#8B5CF6',
      status: '적정'
    },
    {
      name: '단백질',
      current: 78,
      recommended: 60,
      unit: 'g',
      color: '#10B981',
      status: '충분'
    },
    {
      name: '탄수화물',
      current: 244,
      recommended: 300,
      unit: 'g',
      color: '#3B82F6',
      status: '부족'
    },
    {
      name: '지방',
      current: 66,
      recommended: 50,
      unit: 'g',
      color: '#F59E0B',
      status: '주의'
    },
    {
      name: '식이섬유',
      current: 18,
      recommended: 25,
      unit: 'g',
      color: '#EC4899',
      status: '부족'
    },
    {
      name: '나트륨',
      current: 2800,
      recommended: 2000,
      unit: 'mg',
      color: '#EF4444',
      status: '과다'
    },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case '충분': return 'text-green-600 bg-green-50';
      case '적정': return 'text-blue-600 bg-blue-50';
      case '부족': return 'text-orange-600 bg-orange-50';
      case '주의': return 'text-yellow-600 bg-yellow-50';
      case '과다': return 'text-red-600 bg-red-50';
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
        <Card>
          <CardHeader>
            <CardTitle>영양소 섭취 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="h-[300px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="단백질"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="탄수화물"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="지방"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div 
              className="grid grid-cols-3 gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">단백질</div>
                <div className="text-lg font-semibold text-[#10B981]">78g</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">탄수화물</div>
                <div className="text-lg font-semibold text-[#3B82F6]">244g</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">지방</div>
                <div className="text-lg font-semibold text-[#F59E0B]">66g</div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>영양소 섭취량 비교 분석</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>BMI 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
            >
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold" style={{ color: bmiColor }}>
                  {bmi}
                </div>
                <div className="text-lg font-medium" style={{ color: bmiColor }}>
                  {bmiStatus}
                </div>
              </div>

              <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bmiRanges} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 35]} />
                    <YAxis dataKey="range" type="category" />
                    <Tooltip />
                    <Bar
                      dataKey="max"
                      fill="#E5E7EB"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey="current"
                      fill={bmiColor}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">키</div>
                  <div className="font-medium">{userStats.height} cm</div>
                </div>
                <div>
                  <div className="text-gray-500">체중</div>
                  <div className="font-medium">{userStats.weight} kg</div>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

      </motion.div>
    </motion.div>
  );
};