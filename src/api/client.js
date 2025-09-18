// 임시 목업 데이터
const mockMeals = [
  { id: '1', name: '아침', time: '08:00', food: '계란 토스트', calories: 350, date: '2025-09-12' },
  { id: '2', name: '점심', time: '12:30', food: '닭가슴살 샐러드', calories: 450, date: '2025-09-12' },
  { id: '3', name: '저녁', time: '19:00', food: '연어 스테이크', calories: 550, date: '2025-09-12' },
];

const mockNutrition = [
  { id: '1', user_id: 'user1', date: '2025-09-12', calories: 1350, protein: 120, carbs: 150, fat: 45 },
  { id: '2', user_id: 'user1', date: '2025-09-11', calories: 1450, protein: 130, carbs: 140, fat: 50 },
];

const mockStores = [
  { id: '1', name: '건강식품 마트', address: '서울시 강남구', rating: 4.5 },
  { id: '2', name: '유기농 식품점', address: '서울시 마포구', rating: 4.8 },
];

const mockUser = {
  id: 'user1',
  email: 'user@example.com',
  name: '홍길동',
};

// 비동기 응답을 시뮬레이션하는 함수
const asyncResponse = (data, error = null, delay = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (error) {
        resolve({ data: null, error });
      } else {
        resolve({ data, error: null });
      }
    }, delay);
  });
};

// API 요청 함수들
export const api = {
  // 인증 관련
  auth: {
    login: async (email, password) => {
      if (email === 'user@example.com' && password === 'password') {
        return asyncResponse({ user: mockUser, session: { token: 'mock-token' } });
      }
      return asyncResponse(null, '이메일 또는 비밀번호가 잘못되었습니다.');
    },
    register: async (email, password) => {
      return asyncResponse({ user: { ...mockUser, email }, session: { token: 'mock-token' } });
    },
    logout: async () => {
      return asyncResponse({});
    },
    getUser: async () => {
      return asyncResponse({ user: mockUser });
    },
  },
  
  // 식사 관련
  meals: {
    getMeals: async () => {
      return asyncResponse(mockMeals);
    },
    addMeal: async (meal) => {
      const newMeal = { ...meal, id: String(Date.now()) };
      mockMeals.push(newMeal);
      return asyncResponse({ id: newMeal.id });
    },
    updateMeal: async (id, meal) => {
      const index = mockMeals.findIndex(m => m.id === id);
      if (index !== -1) {
        mockMeals[index] = { ...mockMeals[index], ...meal };
        return asyncResponse(mockMeals[index]);
      }
      return asyncResponse(null, '식사를 찾을 수 없습니다.');
    },
    deleteMeal: async (id) => {
      const index = mockMeals.findIndex(m => m.id === id);
      if (index !== -1) {
        mockMeals.splice(index, 1);
        return asyncResponse({});
      }
      return asyncResponse(null, '식사를 찾을 수 없습니다.');
    },
  },
  
  // 영양 정보 관련
  nutrition: {
    getNutritionData: async (userId) => {
      return asyncResponse(mockNutrition.filter(n => n.user_id === userId));
    },
  },
  
  // 상점 관련
  stores: {
    getStores: async () => {
      return asyncResponse(mockStores);
    },
    getStoreById: async (id) => {
      const store = mockStores.find(s => s.id === id);
      if (store) {
        return asyncResponse(store);
      }
      return asyncResponse(null, '상점을 찾을 수 없습니다.');
    },
  },
};