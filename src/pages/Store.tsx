import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { KakaoMap } from '../components/KakaoMap';
import { useUser } from '../contexts/UserContext';

type CityKey = '서울특별시' | '부산광역시' | '대구광역시' | '인천광역시' | '광주광역시' | '대전광역시' | '울산광역시' | '세종특별자치시' | '경기도' | '강원도' | '충청북도' | '충청남도';

export const StorePage: React.FC = () => {
  const { userInfo } = useUser();

  const parseAddress = (address: string): { city: CityKey | null; district: string | null } => {
    if (!address) return { city: null, district: null };

    const addressPattern = /^(.+?)(시|도|특별시|광역시|특별자치시|특별자치도)\s+(.+?)(구|군|시)$/;
    const match = address.match(addressPattern);

    if (!match) return { city: null, district: null };

    const cityPart = match[1] + match[2];
    const districtPart = match[3] + match[4];

    return {
      city: cityPart as CityKey,
      district: districtPart
    };
  };

  const { city: initialCity, district: initialDistrict } = parseAddress(userInfo.address);

  const [selectedCity, setSelectedCity] = useState<CityKey>(initialCity || '서울특별시');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(initialDistrict ? [initialDistrict] : ['마포구']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedCity, setTempSelectedCity] = useState<CityKey>(initialCity || '서울특별시');
  const [tempSelectedDistricts, setTempSelectedDistricts] = useState<string[]>(initialDistrict ? [initialDistrict] : ['마포구']);

  const cities: CityKey[] = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
    '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도',
    '충청북도', '충청남도'
  ];

  const districtsByCity: Record<CityKey, string[]> = {
    '서울특별시': ['서대문구', '양천구', '구로구', '영등포구', '관악구', '강남구', '마포구', '강서구', '금천구', '동작구', '서초구', '송파구'],
    '부산광역시': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
    '대구광역시': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
    '인천광역시': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
    '광주광역시': ['동구', '서구', '남구', '북구', '광산구'],
    '대전광역시': ['동구', '중구', '서구', '유성구', '대덕구'],
    '울산광역시': ['중구', '남구', '동구', '북구', '울주군'],
    '세종특별자치시': ['세종시'],
    '경기도': ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '남양주시', '화성시', '평택시', '의정부시', '시흥시', '파주시', '광명시', '김포시', '군포시', '광주시', '이천시', '양주시', '오산시', '구리시', '안성시', '포천시', '의왕시', '하남시', '여주시', '양평군', '동두천시', '과천시', '가평군', '연천군'],
    '강원도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
    '충청북도': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
    '충청남도': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군']
  };

  const currentDistricts = districtsByCity[tempSelectedCity] || [];

  const handleTempCityChange = (city: CityKey) => {
    setTempSelectedCity(city);
    setTempSelectedDistricts([]);
  };

  const handleTempDistrictChange = (district: string) => {
    setTempSelectedDistricts(prev =>
      prev.includes(district)
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const openModal = () => {
    setTempSelectedCity(selectedCity);
    setTempSelectedDistricts([...selectedDistricts]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmSelection = () => {
    setSelectedCity(tempSelectedCity);
    setSelectedDistricts([...tempSelectedDistricts]);
    setIsModalOpen(false);
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6 space-y-6 max-w-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 지역 선택 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="py-3">
            <button
              onClick={openModal}
              className="w-full flex justify-between items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <CardTitle className="text-lg">
                {selectedCity}{selectedDistricts.length > 0 && `, ${selectedDistricts.join(', ')}`}
              </CardTitle>
              <span className="text-sm text-gray-500">{1 + selectedDistricts.length}개 선택</span>
            </button>
          </CardHeader>
        </Card>
      </motion.div>

      {/* 카카오맵 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6 pb-4 px-4">
            <div className="h-64 relative bg-gray-100 rounded-lg overflow-hidden">
              <KakaoMap city={selectedCity} districts={selectedDistricts} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 근처 가맹점 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">매장 목록 (5개)</CardTitle>
              <span className="text-sm text-gray-500">
                {selectedDistricts.length > 0
                  ? `${selectedCity} ${selectedDistricts.join(', ')}`
                  : selectedCity
                }
              </span>
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
                },
                {
                  id: 4,
                  name: '성정담 레스토랑',
                  address: '마포구 대현동 90-12',
                  tel: '02-3456-7890',
                  district: '마포구',
                  dong: '대현동'
                },
                {
                  id: 5,
                  name: '아이사랑 카페',
                  address: '마포구 홍대동 78-90',
                  tel: '02-5678-9012',
                  district: '마포구',
                  dong: '홍대동'
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

      {/* 지역 선택 모달 */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">지역 선택</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 시도별 선택 */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">시도별</h3>
                <div className="grid grid-cols-2 gap-2">
                  {cities.map((city) => (
                    <label key={city} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="city"
                        checked={tempSelectedCity === city}
                        onChange={() => handleTempCityChange(city)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 구별 선택 */}
              {currentDistricts.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3 text-blue-600">{tempSelectedCity} 구별</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentDistricts.map((district: string) => (
                      <label key={district} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSelectedDistricts.includes(district)}
                          onChange={() => handleTempDistrictChange(district)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{district}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 버튼들 */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={confirmSelection}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={tempSelectedDistricts.length === 0}
                >
                  선택 완료
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};