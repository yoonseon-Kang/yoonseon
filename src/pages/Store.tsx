import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { KakaoMap, Store } from '../components/KakaoMap';
import { useUser } from '../contexts/UserContext';
import { getStoresByDistrict } from '../services/storeService';

type CityKey = '서울특별시' | '부산광역시' | '대구광역시' | '인천광역시' | '광주광역시' | '대전광역시' | '울산광역시' | '세종특별자치시' | '경기도' | '강원특별자치도' | '충청북도' | '충청남도' | '경상남도' | '경상북도' | '전북특별자치도';

export const StorePage: React.FC = () => {
  const { userInfo } = useUser();

  const parseAddress = (address: string): { city: CityKey | null; district: string | null } => {
    if (!address) return { city: null, district: null };

    // 주소 정규화 - "서울시" -> "서울특별시"
    let normalized = address.trim();

    // 약칭을 전체 이름으로 변환
    const cityMapping: Record<string, CityKey> = {
      '서울시': '서울특별시',
      '서울': '서울특별시',
      '부산시': '부산광역시',
      '부산': '부산광역시',
      '대구시': '대구광역시',
      '대구': '대구광역시',
      '인천시': '인천광역시',
      '인천': '인천광역시',
      '광주시': '광주광역시',
      '광주': '광주광역시',
      '대전시': '대전광역시',
      '대전': '대전광역시',
      '울산시': '울산광역시',
      '울산': '울산광역시',
      '세종시': '세종특별자치시',
      '세종': '세종특별자치시',
      '경기': '경기도',
      '강원': '강원특별자치도',
      '충북': '충청북도',
      '충남': '충청남도',
      '경남': '경상남도',
      '경북': '경상북도',
      '전북': '전북특별자치도'
    };

    // 시도명 매칭
    for (const [short, full] of Object.entries(cityMapping)) {
      if (normalized.startsWith(short)) {
        const rest = normalized.substring(short.length).trim();
        return {
          city: full,
          district: rest
        };
      }
    }

    // 정규식으로 파싱 (완전한 형태)
    const addressPattern = /^(.+?)(특별시|광역시|특별자치시|특별자치도|도)\s+(.+?)(구|군|시)/;
    const match = normalized.match(addressPattern);

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
    '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도',
    '충청북도', '충청남도', '경상남도', '경상북도', '전북특별자치도'
  ];

  const districtsByCity: Record<CityKey, string[]> = {
    '서울특별시': ['강남구', '강북구', '강서구', '관악구', '광진구', '동대문구', '동작구', '마포구', '성북구', '영등포구', '용산구', '중구', '중랑구'],
    '부산광역시': ['강서구', '동래구', '북구', '서구', '연제구', '해운대구'],
    '대구광역시': ['남구', '달서구', '북구', '수성구', '중구'],
    '인천광역시': ['남동구', '미추홀구', '연수구'],
    '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
    '대전광역시': ['서구', '유성구'],
    '울산광역시': ['울주군', '중구'],
    '세종특별자치시': ['없음'],
    '경기도': ['과천시', '광명시', '구리시', '군포시', '동두천시', '부천시', '수원시', '안산시 단원구', '안산시 상록구', '양주시', '여주시', '연천군', '용인시', '의왕시', '의정부시', '파주시', '평택시', '하남시'],
    '강원특별자치도': ['삼척시', '속초시', '영월군', '원주시', '춘천시', '화천군'],
    '충청북도': ['단양군', '증평군'],
    '충청남도': ['금산군', '논산시', '부여군', '서산시', '천안시 동남구', '천안시 서북구', '청양군', '태안군', '홍성군'],
    '경상남도': ['김해시', '밀양시', '사천시', '창원시', '통영시', '함양군'],
    '경상북도': ['경산시', '경주시', '구미시', '김천시', '문경시', '상주시', '영주시', '영천시', '울진군', '청도군', '포항시'],
    '전북특별자치도': ['남원시', '전주시 덕진구', '전주시 완산구', '정읍시']
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

  // 매장 데이터 상태
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Store[]>([]);

  // 선택된 지역에 따라 매장 데이터 로드
  useEffect(() => {
    const loadStores = async () => {
      setLoading(true);
      try {
        const stores = await getStoresByDistrict(selectedCity, selectedDistricts);
        setAllStores(stores);
      } catch (error) {
        console.error('매장 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, [selectedCity, selectedDistricts]);

  // 선택된 지역에 따라 필터링된 매장
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) {
      return allStores;
    }

    // 검색어가 있으면 매장명, 주소, 동으로 필터링
    return allStores.filter(store =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.dong.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allStores, searchQuery]);

  // 매장 클릭 핸들러
  const handleStoreClick = (store: Store) => {
    // 매장 클릭 시 지도를 해당 매장 위치로 이동
    setSelectedStoreId(store.id);

    // 지도가 있는 위치로 스크롤
    const mapElement = document.querySelector('.h-64');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 매장 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6 space-y-3 max-w-lg"
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

      {/* 매장 검색 + 카카오맵 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-4 pb-4 px-4 space-y-3">
            {/* 검색창 */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="매장명·주소·동 검색"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#f5f5f5',
                outline: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                color: '#1a1a1a',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#ebebeb';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
            />

            {/* 지도 */}
            <div className="h-64 relative bg-gray-100 rounded-lg overflow-hidden">
              <KakaoMap
                city={selectedCity}
                districts={selectedDistricts}
                stores={filteredStores}
                onStoreClick={handleStoreClick}
                selectedStoreId={selectedStoreId}
              />
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
              <CardTitle className="text-lg">매장 목록 ({filteredStores.length}개)</CardTitle>
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
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">매장 정보를 불러오는 중...</p>
                </div>
              ) : filteredStores.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  선택한 지역에 매장이 없습니다.
                </div>
              ) : (
                filteredStores.map((store) => (
                  <motion.div
                    key={store.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02, backgroundColor: "#F3F4F6" }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    onClick={() => handleStoreClick(store)}
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
                        {store.tel && <p className="text-xs text-gray-500">☎ {store.tel}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
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