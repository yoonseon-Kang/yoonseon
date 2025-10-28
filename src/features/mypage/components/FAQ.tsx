import React, { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  hasSearch?: boolean;
}

export const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: '아동복지카드는 무엇인가요?',
      answer: `아동복지카드는 정부에서 아동의 건강한 성장을 지원하기 위해 제공하는 복지 서비스입니다. 만 18세 미만 아동에게 월 일정 금액을 지원하여 식품비, 의료비, 교육비 등에 사용할 수 있습니다. 소득 기준을 충족하는 가정에서 신청 가능하며, 읍면동 주민센터나 온라인을 통해 신청할 수 있습니다. 카드 사용 내역은 모바일 앱이나 웹사이트에서 확인할 수 있으며, 아동의 건강한 식습관 형성과 영양 개선에 도움이 됩니다.

📞 문의전화 : 129 (보건복지상담센터)

🌐 관련사이트 : www.bokjiro.go.kr (복지로)

📱 모바일앱 : 복지로 앱

🏢 신청장소 : 거주지 읍면동 주민센터`
    },
    {
      id: '2',
      question: '키움밥상은 어떤 서비스인가요?',
      answer: '키움밥상은 아이들의 건강한 식습관 형성을 돕는 식사 기록 및 영양 관리 서비스입니다. 매일의 식사를 기록하고 영양 섭취 현황을 분석하여 맞춤형 피드백을 제공합니다.'
    },
    {
      id: '3',
      question: '식사 기록은 어떻게 하나요?',
      answer: `식사를 기록하는 방법은 두 가지입니다:

1. 식사 페이지 → 상단 오른쪽 '식사 추가' 버튼 클릭
2. 하단 네비게이션 바 → '+' 버튼 클릭

직접 입력하거나 사진을 찍어 간편하게 기록할 수 있습니다.`
    },
    {
      id: '4',
      question: '영양 분석은 어떻게 이루어지나요?',
      answer: '입력하신 식사 정보를 바탕으로 영양소별 섭취량을 계산하고, 연령대별 권장 섭취량과 비교하여 분석 결과를 제공합니다.'
    },
    {
      id: '5',
      question: '아동복지 카드 사용 가능 물품',
      answer: '',
      hasSearch: true
    },
  ]);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };



  const allowedItems = [
    { name: '우유', category: '유제품', allowed: true },
    { name: '흰우유', category: '유제품', allowed: true },
    { name: '바나나우유', category: '유제품', allowed: true },
    { name: '초코우유', category: '유제품', allowed: true },
    { name: '딸기우유', category: '유제품', allowed: true },
    { name: '커피우유', category: '유제품', allowed: false, note: '카페인 함유로 구매 불가' },
    { name: '치즈', category: '유제품', allowed: true },
    { name: '요거트', category: '유제품', allowed: true },
    { name: '버터', category: '유제품', allowed: true },
    { name: '계란', category: '난각류', allowed: true },
    { name: '사과', category: '과일', allowed: true },
    { name: '바나나', category: '과일', allowed: true },
    { name: '오렌지', category: '과일', allowed: true },
    { name: '딸기', category: '과일', allowed: true },
    { name: '포도', category: '과일', allowed: true },
    { name: '수박', category: '과일', allowed: true },
    { name: '도시락', category: '즉석식품', allowed: true },
    { name: '김밥', category: '즉석식품', allowed: true },
    { name: '샌드위치', category: '즉석식품', allowed: true },
    { name: '햄버거', category: '즉석식품', allowed: true },
    { name: '컵라면', category: '즉석식품', allowed: false, note: '인스턴트 라면으로 구매 불가' },
    { name: '삼각김밥', category: '즉석식품', allowed: true },
    { name: '주먹밥', category: '즉석식품', allowed: true },
    { name: '김치', category: '반찬류', allowed: true },
    { name: '반찬', category: '반찬류', allowed: true },
    { name: '나물', category: '반찬류', allowed: true },
    { name: '식빵', category: '빵류', allowed: true },
    { name: '단팥빵', category: '빵류', allowed: true },
    { name: '크림빵', category: '빵류', allowed: true },
    { name: '베이글', category: '빵류', allowed: true },
    { name: '주스', category: '음료', allowed: true },
    { name: '이온음료', category: '음료', allowed: true },
    { name: '생수', category: '음료', allowed: true },
    { name: '두유', category: '음료', allowed: true },
    { name: '쌀', category: '곡물', allowed: true },
    { name: '잡곡', category: '곡물', allowed: true },
    { name: '현미', category: '곡물', allowed: true },
    { name: '라면', category: '가공식품', allowed: false, note: '인스턴트 식품으로 구매 불가' },
    { name: '봉지라면', category: '가공식품', allowed: false, note: '인스턴트 식품으로 구매 불가' },
    { name: '불닭볶음면', category: '가공식품', allowed: false, note: '인스턴트 라면으로 구매 불가' },
    { name: '신라면', category: '가공식품', allowed: false, note: '인스턴트 라면으로 구매 불가' },
    { name: '참치캔', category: '가공식품', allowed: true },
    { name: '햄', category: '가공식품', allowed: true },
    { name: '소시지', category: '가공식품', allowed: true },
    { name: '두부', category: '가공식품', allowed: true },
    { name: '된장', category: '가공식품', allowed: true },
    { name: '고추장', category: '가공식품', allowed: true },
    { name: '간장', category: '가공식품', allowed: true },
    { name: '김', category: '가공식품', allowed: true },
    { name: '당근', category: '채소', allowed: true },
    { name: '양파', category: '채소', allowed: true },
    { name: '감자', category: '채소', allowed: true },
    { name: '배추', category: '채소', allowed: true },
    { name: '상추', category: '채소', allowed: true },
    { name: '닭고기', category: '축산물', allowed: true },
    { name: '돼지고기', category: '축산물', allowed: true },
    { name: '소고기', category: '축산물', allowed: true },
    { name: '생선', category: '수산물', allowed: true },
    { name: '고등어', category: '수산물', allowed: true },
    { name: '아이스크림', category: '간식류', allowed: true, note: '식사류 4천원 이상 구매시 3천원까지 가능' },
    { name: '과자', category: '간식류', allowed: false, note: '구매 불가 (단, 식사류 4천원 이상 구매시 3천원까지 가능)' },
    { name: '젤리', category: '간식류', allowed: false, note: '구매 불가 (단, 식사류 4천원 이상 구매시 3천원까지 가능)' },
    { name: '초콜릿', category: '간식류', allowed: false, note: '구매 불가 (단, 식사류 4천원 이상 구매시 3천원까지 가능)' },
    { name: '사탕', category: '간식류', allowed: false, note: '구매 불가 (단, 식사류 4천원 이상 구매시 3천원까지 가능)' },
    { name: '껌', category: '간식류', allowed: false, note: '구매 불가 (단, 식사류 4천원 이상 구매시 3천원까지 가능)' },
    { name: '쿠키', category: '간식류', allowed: false, note: '구매 불가 (단, 식사류 4천원 이상 구매시 3천원까지 가능)' },
    { name: '탄산음료', category: '음료', allowed: false, note: '구매 불가' },
    { name: '콜라', category: '음료', allowed: false, note: '구매 불가' },
    { name: '사이다', category: '음료', allowed: false, note: '구매 불가' },
    { name: '고카페인음료', category: '음료', allowed: false, note: '구매 불가' },
    { name: '에너지드링크', category: '음료', allowed: false, note: '구매 불가' },
    { name: '커피', category: '음료', allowed: false, note: '고카페인 음료 구매 불가' },
    { name: '짜파게티', category: '가공식품', allowed: false, note: '인스턴트 라면으로 구매 불가' },
    { name: '너구리', category: '가공식품', allowed: false, note: '인스턴트 라면으로 구매 불가' },
    { name: '진라면', category: '가공식품', allowed: false, note: '인스턴트 라면으로 구매 불가' },
    { name: '안성탕면', category: '가공식품', allowed: false, note: '인스턴트 라면으로 구매 불가' },
    { name: '비빔면', category: '가공식품', allowed: false, note: '인스턴트 라면으로 구매 불가' },
    { name: '짜장면', category: '즉석식품', allowed: true },
    { name: '냉동만두', category: '냉동식품', allowed: true },
    { name: '냉동피자', category: '냉동식품', allowed: false, note: '고열량 가공식품으로 구매 불가' },
    { name: '냉동치킨', category: '냉동식품', allowed: false, note: '고열량 가공식품으로 구매 불가' },
    { name: '즉석밥', category: '가공식품', allowed: true },
    { name: '죽', category: '가공식품', allowed: true },
    { name: '시리얼', category: '가공식품', allowed: false, note: '과자로 분류되어 구매 불가' },
    { name: '그래놀라', category: '가공식품', allowed: false, note: '과자로 분류되어 구매 불가' },
    { name: '케첩', category: '소스류', allowed: false, note: '구매 불가' },
    { name: '마요네즈', category: '소스류', allowed: false, note: '구매 불가' },
    { name: '식용유', category: '소스류', allowed: true },
    { name: '참기름', category: '소스류', allowed: true },
    { name: '올리브유', category: '소스류', allowed: true },
    { name: '술', category: '주류', allowed: false, note: '아동·청소년 판매 금지 품목' },
    { name: '소주', category: '주류', allowed: false, note: '아동·청소년 판매 금지 품목' },
    { name: '맥주', category: '주류', allowed: false, note: '아동·청소년 판매 금지 품목' },
    { name: '와인', category: '주류', allowed: false, note: '아동·청소년 판매 금지 품목' },
    { name: '담배', category: '기타', allowed: false, note: '아동·청소년 판매 금지 품목' },
    { name: '전자담배', category: '기타', allowed: false, note: '아동·청소년 판매 금지 품목' },
  ];

  const filteredItems = searchQuery
    ? allowedItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allowedItems;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">자주 묻는 질문</h2>
      
      <div className="space-y-4">
        {faqs.map(faq => (
          <div key={faq.id} className="border-b border-gray-100 last:border-0">
            <button
              onClick={() => toggleItem(faq.id)}
              className="w-full py-4 flex justify-between items-center text-left"
            >
              <span className="font-medium">{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  openItem === faq.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openItem === faq.id && (
              <div className="pb-4">
                {faq.hasSearch ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="물품명을 검색하세요 (예: 쌀, 우유)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="max-h-64 overflow-y-auto">
                      {filteredItems.length > 0 ? (
                        <div className="space-y-2">
                          {filteredItems.map((item, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg ${
                                item.allowed
                                  ? 'bg-emerald-50 border border-emerald-200'
                                  : 'bg-red-50 border border-red-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">{item.name}</div>
                                  <div className="text-xs text-gray-500">{item.category}</div>
                                </div>
                                <div className={`text-xs font-semibold ${
                                  item.allowed ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                  {item.allowed ? '✓ 구매 가능' : '✗ 구매 불가'}
                                </div>
                              </div>
                              {item.note && (
                                <div className="mt-1 text-xs text-gray-600">{item.note}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">검색 결과가 없습니다</p>
                      )}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
                      <p className="font-semibold mb-1">ℹ️ 안내사항</p>
                      <p>• 지역별로 세부 정책이 다를 수 있습니다</p>
                      <p>• 자세한 사항은 거주지 주민센터에 문의하세요</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
