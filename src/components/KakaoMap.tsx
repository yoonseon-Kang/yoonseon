import React from 'react';

type KakaoMapProps = {
  city: string;
  districts: string[];
};

export const KakaoMap: React.FC<KakaoMapProps> = ({ city, districts }) => {
  const getMapUrl = (city: string) => {
    const coordinates: Record<string, string> = {
      '서울특별시': '37.5665,126.9780',
      '부산광역시': '35.1796,129.0756',
      '대구광역시': '35.8714,128.6014',
      '인천광역시': '37.4563,126.7052',
      '광주광역시': '35.1595,126.8526',
      '대전광역시': '36.3504,127.3845',
      '울산광역시': '35.5384,129.3114',
      '세종특별자치시': '36.4800,127.2890',
      '경기도': '37.4138,127.5183',
      '강원도': '37.8228,128.1555',
      '충청북도': '36.6357,127.4917',
      '충청남도': '36.5184,126.8000'
    };

    const coord = coordinates[city] || coordinates['서울특별시'];
    return `https://map.kakao.com/link/map/${city},${coord}`;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.835!2d126.9780!3d37.5665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDMzJzU5LjQiTiAxMjbCsDU4JzQwLjgiRQ!5e0!3m2!1sko!2skr!4v1640000000000!5m2!1sko!2skr`}
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${city} 지도`}
        />
      </div>
    </div>
  );
};