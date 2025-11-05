import { Store } from '../components/KakaoMap';

// CSV 데이터를 파싱하는 함수
export const parseStoresFromCSV = (csvText: string): Store[] => {
  const lines = csvText.split('\n');
  const stores: Store[] = [];

  // 첫 번째 줄은 헤더이므로 스킵
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSV 파싱 (쉼표로 분리, 큰따옴표 처리)
    const columns = parseCSVLine(line);

    if (columns.length < 10) continue;

    const name = columns[0];
    const city = columns[2]; // 시도명
    const district = columns[3]; // 시군구명
    const addressRoad = columns[5]; // 도로명주소
    const addressJibun = columns[6]; // 지번주소
    const lat = parseFloat(columns[7]);
    const lng = parseFloat(columns[8]);
    const tel = columns[9];

    // 유효한 좌표가 있는 경우만 추가
    if (Number.isFinite(lat) && Number.isFinite(lng) && name) {
      // 주소에서 동 추출 (간단한 방식)
      const dong = extractDong(addressRoad || addressJibun);

      stores.push({
        id: i,
        name: name,
        address: addressRoad || addressJibun || '',
        tel: tel || undefined,
        lat: lat,
        lng: lng,
        district: district,
        dong: dong
      });
    }
  }

  return stores;
};

// CSV 라인 파싱 (쉼표와 큰따옴표 처리)
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

// 주소에서 동 추출
const extractDong = (address: string): string => {
  if (!address) return '';

  // 정규식으로 동/로/길 추출
  const dongMatch = address.match(/([가-힣]+동|[가-힣]+로|[가-힣]+길)/);
  if (dongMatch) {
    return dongMatch[1];
  }

  return '';
};

// 메모리에 캐시된 매장 데이터
let cachedStores: Store[] | null = null;

// 모든 매장 데이터 가져오기
export const getAllStores = async (): Promise<Store[]> => {
  if (cachedStores) {
    console.log('캐시된 매장 데이터 사용:', cachedStores.length);
    return cachedStores;
  }

  try {
    // public 폴더의 CSV 파일을 fetch로 로드
    console.log('CSV 파일 로드 시작...');
    const response = await fetch('/stores.csv');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    console.log('CSV 파일 크기:', csvText.length, '바이트');

    cachedStores = parseStoresFromCSV(csvText);
    console.log('파싱된 매장 수:', cachedStores.length);

    if (cachedStores.length > 0) {
      console.log('첫 번째 매장:', cachedStores[0]);
    }

    return cachedStores;
  } catch (error) {
    console.error('매장 데이터 로드 실패:', error);
    return [];
  }
};

// 특정 시도의 매장 데이터 가져오기
export const getStoresByCity = async (city: string): Promise<Store[]> => {
  const allStores = await getAllStores();

  // 시도명이 정확히 일치하는 매장만 필터링
  return allStores.filter(store => {
    // 주소에서 시도명 추출하여 비교
    return store.address.includes(city);
  });
};

// 특정 시군구의 매장 데이터 가져오기
export const getStoresByDistrict = async (city: string, districts: string[]): Promise<Store[]> => {
  const cityStores = await getStoresByCity(city);

  console.log('getStoresByDistrict 호출:', { city, districts, cityStoresCount: cityStores.length });

  if (cityStores.length > 0) {
    console.log('첫 번째 매장 샘플:', cityStores[0]);
  }

  if (districts.length === 0) {
    return cityStores;
  }

  const filtered = cityStores.filter(store => {
    const match = districts.some(district =>
      store.district.includes(district) || district.includes(store.district)
    );
    if (match) {
      console.log('매칭된 매장:', store.name, '구:', store.district);
    }
    return match;
  });

  console.log('필터링된 매장 수:', filtered.length);
  return filtered;
};
