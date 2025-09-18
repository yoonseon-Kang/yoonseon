import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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