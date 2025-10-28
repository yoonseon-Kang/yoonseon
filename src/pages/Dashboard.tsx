import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const pieChartVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.2
    }
  }
};

// 임시 데이터 페칭 함수
const fetchDashboardData = async () => {
  // 실제 구현에서는 API 호출
  return {
    userName: null,
    weekly: [
      { day: '월', calories: 1800, protein: 70, carbs: 220, fat: 60 },
      { day: '화', calories: 2000, protein: 75, carbs: 240, fat: 65 },
      { day: '수', calories: 1900, protein: 72, carbs: 230, fat: 62 },
      { day: '목', calories: 2100, protein: 80, carbs: 250, fat: 68 },
      { day: '금', calories: 2200, protein: 85, carbs: 260, fat: 70 },
      { day: '토', calories: 2300, protein: 90, carbs: 270, fat: 75 },
      { day: '일', calories: 1950, protein: 74, carbs: 235, fat: 64 },
    ],
    alerts: [
      { id: '1', type: 'warning', message: '오늘 단백질 섭취량이 목표보다 낮습니다.' },
      { id: '2', type: 'info', message: '물을 더 섭취하는 것이 좋습니다.' },
    ],
  };
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useUser();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-6 space-y-6 max-w-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* 오늘의 섭취 칼로리 */}
      <motion.div variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer active:bg-gray-50 transition-colors"
            onClick={() => navigate('/meals')}
          >
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-bold text-center mb-2">오늘의 섭취 칼로리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-2">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-emerald-600 tracking-tight">1,850 <span className="text-base text-gray-500">kcal</span></div>
                </div>
                <motion.div 
                  className="w-full max-w-[180px] h-[180px] relative mb-2"
                  variants={pieChartVariants}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '탄수화물', value: 60, color: '#3B82F6' },
                          { name: '단백질', value: 20, color: '#10B981' },
                          { name: '지방', value: 20, color: '#F59E0B' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {[
                          { name: '탄수화물', color: '#3B82F6' },
                          { name: '단백질', color: '#10B981' },
                          { name: '지방', color: '#F59E0B' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
                <div className="grid grid-cols-3 gap-4 w-full max-w-[300px] text-center mt-2">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6] mb-1"></div>
                    <div className="text-xs">
                      <div className="font-medium">탄수화물</div>
                      <div className="text-gray-500">60%</div>
                      <div className="text-[10px] text-gray-400">(276g)</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#10B981] mb-1"></div>
                    <div className="text-xs">
                      <div className="font-medium">단백질</div>
                      <div className="text-gray-500">20%</div>
                      <div className="text-[10px] text-gray-400">(92g)</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B] mb-1"></div>
                    <div className="text-xs">
                      <div className="font-medium">지방</div>
                      <div className="text-gray-500">20%</div>
                      <div className="text-[10px] text-gray-400">(41g)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* 근처 가맹점 */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">내 근처 가맹점</CardTitle>
              <span className="text-sm text-gray-500">{userInfo.address || '거주지 미설정'}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: '키즈 키친',
                  address: '서대문구 연희동 123-45',
                  tel: '02-1234-5678',
                  district: '서대문구',
                  dong: '연희동'
                },
                {
                  id: 2,
                  name: '영양만점 식당',
                  address: '서대문구 창천동 56-78',
                  tel: '02-2345-6789',
                  district: '서대문구',
                  dong: '창천동'
                },
                {
                  id: 3,
                  name: '성장맘 레스토랑',
                  address: '서대문구 대현동 90-12',
                  tel: '02-3456-7890',
                  district: '서대문구',
                  dong: '대현동'
                }
              ].map((store) => (
                <motion.div
                  key={store.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02, backgroundColor: "#F3F4F6" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onClick={() => {
                    navigate('/stores');
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{store.name}</h3>
                      <div className="flex space-x-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {store.district}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {store.dong}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-gray-500">{store.address}</p>
                      <p className="text-xs text-gray-500">☎ {store.tel}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 영양 알림 */}
      <motion.div 
        className="space-y-3"
        variants={itemVariants}
      >
        <AnimatePresence>
          {dashboardData?.alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className={`p-4 rounded-lg flex items-center space-x-3 ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                  : 'bg-blue-50 text-emerald-600 border border-blue-200'
              }`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1 
              }}
            >
              <div className="flex-shrink-0">
                {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
              </div>
              <p className="text-sm">{alert.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;