// 구독 싹쓸이 - 데이터 모델 정의

export type UsageFrequency = 'rarely' | 'sometimes' | 'often';

export type Category = 'OTT' | 'Music' | 'Productivity' | 'Cloud' | 'Other';

export interface Subscription {
  id: string;
  name: string;           // 서비스명
  icon: string;           // 이모지 또는 아이콘 키
  category: Category;
  monthlyFee: number;     // 월 요금 (원)
  billingDay: number;     // 매월 결제일 (1~31)
  usageFrequency: UsageFrequency; // 사용 빈도
  createdAt: string;      // 등록일 (ISO 문자열)
}

// 온보딩 그리드에서 선택 가능한 사전 정의 서비스 목록
export interface PresetService {
  key: string;
  name: string;
  icon: string;
  category: Category;
  defaultFee: number;
}

export const PRESET_SERVICES: PresetService[] = [
  { key: 'netflix',   name: '넷플릭스',       icon: '🎬', category: 'OTT',          defaultFee: 17000 },
  { key: 'youtube',   name: '유튜브 프리미엄', icon: '▶️',  category: 'OTT',          defaultFee: 14900 },
  { key: 'coupang',   name: '쿠팡와우',        icon: '🛒', category: 'Other',        defaultFee: 7890  },
  { key: 'tving',     name: '티빙',            icon: '📺', category: 'OTT',          defaultFee: 13900 },
  { key: 'wavve',     name: '웨이브',          icon: '🌊', category: 'OTT',          defaultFee: 7900  },
  { key: 'disney',    name: '디즈니+',         icon: '✨', category: 'OTT',          defaultFee: 9900  },
  { key: 'melon',     name: '멜론',            icon: '🍈', category: 'Music',        defaultFee: 10900 },
  { key: 'genie',     name: '지니',            icon: '🎵', category: 'Music',        defaultFee: 8900  },
  { key: 'spotify',   name: '스포티파이',      icon: '🎧', category: 'Music',        defaultFee: 10900 },
  { key: 'adobe',     name: '어도비',          icon: '🖌️', category: 'Productivity', defaultFee: 29700 },
  { key: 'ms365',     name: 'MS365',           icon: '💼', category: 'Productivity', defaultFee: 8900  },
  { key: 'notion',    name: '노션',            icon: '📓', category: 'Productivity', defaultFee: 16000 },
  { key: 'dropbox',   name: '드롭박스',        icon: '📦', category: 'Cloud',        defaultFee: 15000 },
  { key: 'icloud',    name: 'iCloud',          icon: '☁️', category: 'Cloud',        defaultFee: 1900  },
  { key: 'other',     name: '기타',            icon: '➕', category: 'Other',        defaultFee: 0     },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  OTT:          'OTT',
  Music:        '음악',
  Productivity: '생산성',
  Cloud:        '클라우드',
  Other:        '기타',
};

export const FREQUENCY_LABELS: Record<UsageFrequency, string> = {
  rarely:    '거의 안 씀',
  sometimes: '가끔',
  often:     '자주 사용',
};

// 더미 초기 데이터 (3~4개)
export const DUMMY_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    name: '넷플릭스',
    icon: '🎬',
    category: 'OTT',
    monthlyFee: 17000,
    billingDay: 15,
    usageFrequency: 'often',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'sub-2',
    name: '티빙',
    icon: '📺',
    category: 'OTT',
    monthlyFee: 13900,
    billingDay: 20,
    usageFrequency: 'rarely',
    createdAt: '2024-03-01T00:00:00.000Z',
  },
  {
    id: 'sub-3',
    name: '멜론',
    icon: '🍈',
    category: 'Music',
    monthlyFee: 10900,
    billingDay: 5,
    usageFrequency: 'sometimes',
    createdAt: '2024-02-10T00:00:00.000Z',
  },
  {
    id: 'sub-4',
    name: '유튜브 프리미엄',
    icon: '▶️',
    category: 'OTT',
    monthlyFee: 14900,
    billingDay: 28,
    usageFrequency: 'often',
    createdAt: '2023-12-28T00:00:00.000Z',
  },
];
