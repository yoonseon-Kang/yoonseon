import React, { useState, useEffect } from 'react';
import { Meal } from './MealCard';
import { FoodItem, searchFoods } from '../data/foodData';

export interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeal?: Meal | null;
  onSubmit: (meal: Meal) => void;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  initialMeal,
  onSubmit
}) => {
  const [mealData, setMealData] = useState<Partial<Meal>>(() => {
    if (initialMeal) {
      return { ...initialMeal };
    }
    return {
      name: '',
      amount: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
      saturatedFat: 0,
      transFat: 0,
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCapturing(true);
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      alert('카메라를 시작할 수 없습니다. 카메라 접근 권한을 확인해주세요.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
            setSelectedImage(file);
          }
        }, 'image/jpeg');
      }
      stopCamera();
    }
  };
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchFoods(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateNutrients = (food: FoodItem, amount: number) => {
    const ratio = amount / food.servingSize;
    return {
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10
    };
  };

  const handleFoodSelect = (food: FoodItem) => {
    const nutrients = calculateNutrients(food, food.servingSize);
    setMealData(prev => ({
      ...prev,
      name: food.name,
      amount: food.servingSize,
      foodId: food.id,
      ...nutrients
    }));
    setSearchQuery('');
    setShowResults(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setSelectedImage(null);
      setSearchQuery('');
      setShowResults(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mealData.name && mealData.time) {
      onSubmit(mealData as Meal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {initialMeal ? '식사 정보 수정' : '식사 추가'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                음식 검색
              </label>
              <div id="search-container" className="mt-1 relative">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm pr-10"
                  placeholder="음식명을 입력하세요"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => setShowResults(true)}
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                      {searchResults.map(food => (
                        <li
                          key={food.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFoodSelect(food)}
                        >
                          <div className="font-medium">{food.name}</div>
                          <div className="text-sm text-gray-500">
                            {food.category} · {food.servingSize}g · {food.calories}kcal
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {showResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
                    <div className="px-4 py-3 text-sm text-gray-500">
                      검색 결과가 없습니다.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                음식명
              </label>
              <input
                type="text"
                id="name"
                value={mealData.name}
                onChange={(e) => setMealData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                required
              />
            </div>


            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                양(g)
              </label>
              <input
                type="number"
                id="amount"
                value={mealData.amount || ''}
                onChange={(e) => setMealData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                min="0"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
                  칼로리(kcal)
                </label>
                <input
                  type="number"
                  id="calories"
                  value={mealData.calories || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
                  단백질(g)
                </label>
                <input
                  type="number"
                  id="protein"
                  value={mealData.protein || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
                  탄수화물(g)
                </label>
                <input
                  type="number"
                  id="carbs"
                  value={mealData.carbs || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label htmlFor="sugar" className="block text-sm font-medium text-gray-700">
                  당류(g)
                </label>
                <input
                  type="number"
                  id="sugar"
                  value={mealData.sugar || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, sugar: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fat" className="block text-sm font-medium text-gray-700">
                  지방(g)
                </label>
                <input
                  type="number"
                  id="fat"
                  value={mealData.fat || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, fat: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label htmlFor="saturatedFat" className="block text-sm font-medium text-gray-700">
                  포화지방(g)
                </label>
                <input
                  type="number"
                  id="saturatedFat"
                  value={mealData.saturatedFat || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, saturatedFat: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="transFat" className="block text-sm font-medium text-gray-700">
                  트랜스지방(g)
                </label>
                <input
                  type="number"
                  id="transFat"
                  value={mealData.transFat || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, transFat: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label htmlFor="cholesterol" className="block text-sm font-medium text-gray-700">
                  콜레스테롤(mg)
                </label>
                <input
                  type="number"
                  id="cholesterol"
                  value={mealData.cholesterol || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, cholesterol: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sodium" className="block text-sm font-medium text-gray-700">
                  나트륨(mg)
                </label>
                <input
                  type="number"
                  id="sodium"
                  value={mealData.sodium || ''}
                  onChange={(e) => setMealData(prev => ({ ...prev, sodium: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
              <div></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                사진 추가
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center w-full">
                  {isCapturing ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="mx-auto w-full max-w-sm rounded-lg"
                      />
                      <div className="mt-4 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={captureImage}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          사진 찍기
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : selectedImage ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="mx-auto h-48 w-full max-w-sm object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex flex-col gap-3 items-center mt-4">
                        <button
                          type="button"
                          onClick={startCamera}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          사진 찍기
                        </button>
                        <div className="flex items-center">
                          <div className="h-px w-16 bg-gray-300"></div>
                          <span className="px-3 text-sm text-gray-500">또는</span>
                          <div className="h-px w-16 bg-gray-300"></div>
                        </div>
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          사진 업로드
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setSelectedImage(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {initialMeal ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};