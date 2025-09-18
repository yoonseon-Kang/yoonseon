import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Store {
  id: number;
  name: string;
  category: string;
  distance: string;
  address: string;
  tel: string;
  lat: number;
  lng: number;
}

const stores: Store[] = [
  {
    id: 1,
    name: '키즈 키친',
    category: '키즈카페',
    distance: '0.3km',
    address: '서대문구 연희동 123-45',
    tel: '02-1234-5678',
    lat: 37.5665,
    lng: 126.978
  },
  {
    id: 2,
    name: '영양만점 식당',
    category: '한식',
    distance: '0.5km',
    address: '서대문구 창천동 56-78',
    tel: '02-2345-6789',
    lat: 37.5635,
    lng: 126.975
  },
  {
    id: 3,
    name: '성장맘 레스토랑',
    category: '양식',
    distance: '0.7km',
    address: '서대문구 대현동 90-12',
    tel: '02-3456-7890',
    lat: 37.5605,
    lng: 126.972
  }
];

const categories = ['전체', '키즈카페', '한식', '양식'];

export const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number}>({ lat: 37.5665, lng: 126.978 });
  const [filteredStores, setFilteredStores] = useState<Store[]>(stores);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('위치 권한이 없어서 기본 위치를 사용합니다.');
        }
      );
    }
  }, []);

  useEffect(() => {
    if (selectedCategory === '전체') {
      setFilteredStores(stores);
    } else {
      setFilteredStores(stores.filter(store => store.category === selectedCategory));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!mapRef.current) return;

      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=c44dac15778d3b96e883cc105172b982&autoload=false&libraries=services`;
      document.head.appendChild(script);

      script.onload = () => {
        console.log('카카오맵 SDK 로딩 중...');
        (window as any).kakao.maps.load(() => {
          console.log('카카오맵 SDK 로드 성공');
          const container = mapRef.current;
          const options = {
            center: new (window as any).kakao.maps.LatLng(userLocation.lat, userLocation.lng),
            level: 5
          };

          const map = new (window as any).kakao.maps.Map(container, options);

          // 사용자 위치 마커
          const userMarkerPosition = new (window as any).kakao.maps.LatLng(userLocation.lat, userLocation.lng);
          const userMarker = new (window as any).kakao.maps.Marker({
            position: userMarkerPosition
          });
          userMarker.setMap(map);

          // 매장 마커들
          filteredStores.forEach((store) => {
            const markerPosition = new (window as any).kakao.maps.LatLng(store.lat, store.lng);
            const marker = new (window as any).kakao.maps.Marker({
              position: markerPosition,
              title: store.name
            });
            marker.setMap(map);
          });

          setMapLoaded(true);
        });
      };

      script.onerror = (error) => {
        console.error('카카오맵 SDK 로드 실패:', error);
      };
    };

    if (userLocation && mapRef.current) {
      loadKakaoMap();
    }
  }, [userLocation, filteredStores]);

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-bold">내 근처 가맹점</h1>
        <span className="text-sm text-gray-500">서울 서대문구</span>
      </div>

      {/* 필터 */}
      <div className="p-4 border-b bg-white">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 지도 */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* 매장 목록 */}
      <div className="p-4 border-t bg-gray-50 max-h-48 overflow-y-auto">
        <h3 className="font-medium mb-3">매장 목록 ({filteredStores.length}개)</h3>
        <div className="space-y-2">
          {filteredStores.map((store) => (
            <motion.div
              key={store.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{store.name}</h4>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                    {store.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                <p className="text-sm text-gray-500">☎ {store.tel}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600">{store.distance}</div>
                <button
                  onClick={() => window.open(`tel:${store.tel}`, '_self')}
                  className="mt-1 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full hover:bg-emerald-600 transition-colors"
                >
                  전화
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};