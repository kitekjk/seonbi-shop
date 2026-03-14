// Mock data for standalone demo mode (no Supabase required)

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ─── Users ───────────────────────────────────────────────
export const MOCK_USER = {
  id: "mock-user-001",
  email: "seonbi@demo.com",
  name: "선비",
  phone: "010-1234-5678",
  role: "customer" as const,
  created_at: "2024-12-01T00:00:00Z",
  updated_at: "2024-12-01T00:00:00Z",
};

export const MOCK_ADMIN = {
  id: "mock-admin-001",
  email: "admin@seonbishop.com",
  name: "관리자",
  phone: "010-0000-0000",
  role: "admin" as const,
  created_at: "2024-11-01T00:00:00Z",
  updated_at: "2024-11-01T00:00:00Z",
};

// ─── Categories ──────────────────────────────────────────
export const CATEGORIES = ["도자기", "한지공예", "전통주잔", "한복", "액세서리"];

// ─── Products ────────────────────────────────────────────
function img(name: string) {
  return `https://placehold.co/400x400?text=${encodeURIComponent(name)}`;
}

export const MOCK_PRODUCTS = [
  {
    id: "prod-001",
    name: "술먹는 선비 소주잔 세트",
    slug: "seonbi-soju-glass-set",
    description:
      "조선시대 선비의 풍류를 담은 소주잔 세트. 선비가 술을 마시는 익살스러운 모습을 형상화하여 유쾌한 술자리를 만들어줍니다.",
    detail_html: "<p>선비 소주잔 4종 세트입니다. 각각 다른 포즈를 취하고 있습니다.</p>",
    base_price: 28000,
    category: "전통주잔",
    is_active: true,
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    product_images: [
      { id: "img-001-1", product_id: "prod-001", url: img("소주잔세트"), alt_text: "술먹는 선비 소주잔 세트", sort_order: 0, created_at: "2025-01-15T10:00:00Z" },
      { id: "img-001-2", product_id: "prod-001", url: img("소주잔세트-2"), alt_text: "소주잔 뒷면", sort_order: 1, created_at: "2025-01-15T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-001-1", product_id: "prod-001", tag: "선비" },
      { id: "tag-001-2", product_id: "prod-001", tag: "소주잔" },
      { id: "tag-001-3", product_id: "prod-001", tag: "선물" },
    ],
    product_options: [
      { id: "opt-001-1", product_id: "prod-001", name: "4잔 세트 (기본)", additional_price: 0, stock: 50, is_active: true, created_at: "2025-01-15T10:00:00Z" },
      { id: "opt-001-2", product_id: "prod-001", name: "6잔 세트", additional_price: 12000, stock: 30, is_active: true, created_at: "2025-01-15T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-002",
    name: "한복 인형 커플 세트",
    slug: "hanbok-doll-couple",
    description:
      "전통 한복을 입은 신랑신부 인형 세트. 웨딩 선물이나 외국인 기념품으로 인기가 많습니다.",
    detail_html: "<p>수제 한복 인형 커플 세트입니다. 높이 약 20cm.</p>",
    base_price: 35000,
    category: "한복",
    is_active: true,
    created_at: "2025-01-14T10:00:00Z",
    updated_at: "2025-01-14T10:00:00Z",
    product_images: [
      { id: "img-002-1", product_id: "prod-002", url: img("한복인형"), alt_text: "한복 인형 커플", sort_order: 0, created_at: "2025-01-14T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-002-1", product_id: "prod-002", tag: "한복" },
      { id: "tag-002-2", product_id: "prod-002", tag: "인형" },
      { id: "tag-002-3", product_id: "prod-002", tag: "웨딩" },
    ],
    product_options: [
      { id: "opt-002-1", product_id: "prod-002", name: "기본 커플 세트", additional_price: 0, stock: 25, is_active: true, created_at: "2025-01-14T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-003",
    name: "나전칠기 손거울",
    slug: "najeon-hand-mirror",
    description:
      "전통 나전칠기 기법으로 제작한 손거울. 자개의 영롱한 빛이 아름다운 한국 전통 공예품입니다.",
    detail_html: "<p>천연 자개와 옻칠로 제작되었습니다. 지름 약 8cm.</p>",
    base_price: 42000,
    category: "액세서리",
    is_active: true,
    created_at: "2025-01-13T10:00:00Z",
    updated_at: "2025-01-13T10:00:00Z",
    product_images: [
      { id: "img-003-1", product_id: "prod-003", url: img("나전칠기거울"), alt_text: "나전칠기 손거울", sort_order: 0, created_at: "2025-01-13T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-003-1", product_id: "prod-003", tag: "나전칠기" },
      { id: "tag-003-2", product_id: "prod-003", tag: "거울" },
      { id: "tag-003-3", product_id: "prod-003", tag: "자개" },
    ],
    product_options: [
      { id: "opt-003-1", product_id: "prod-003", name: "매화 문양", additional_price: 0, stock: 15, is_active: true, created_at: "2025-01-13T10:00:00Z" },
      { id: "opt-003-2", product_id: "prod-003", name: "학 문양", additional_price: 5000, stock: 10, is_active: true, created_at: "2025-01-13T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-004",
    name: "고려청자 찻잔 세트",
    slug: "goryeo-celadon-tea-set",
    description:
      "고려청자의 비색을 재현한 찻잔 세트. 전통 도자기 기법으로 하나하나 수작업 제작됩니다.",
    detail_html: "<p>청자 찻잔 2개 + 찻잔 받침 2개 세트입니다.</p>",
    base_price: 68000,
    category: "도자기",
    is_active: true,
    created_at: "2025-01-12T10:00:00Z",
    updated_at: "2025-01-12T10:00:00Z",
    product_images: [
      { id: "img-004-1", product_id: "prod-004", url: img("청자찻잔"), alt_text: "고려청자 찻잔", sort_order: 0, created_at: "2025-01-12T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-004-1", product_id: "prod-004", tag: "청자" },
      { id: "tag-004-2", product_id: "prod-004", tag: "찻잔" },
      { id: "tag-004-3", product_id: "prod-004", tag: "도자기" },
    ],
    product_options: [
      { id: "opt-004-1", product_id: "prod-004", name: "2인 세트", additional_price: 0, stock: 20, is_active: true, created_at: "2025-01-12T10:00:00Z" },
      { id: "opt-004-2", product_id: "prod-004", name: "4인 세트", additional_price: 58000, stock: 10, is_active: true, created_at: "2025-01-12T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-005",
    name: "한지 전등갓",
    slug: "hanji-lamp-shade",
    description:
      "전통 한지로 만든 전등갓. 은은한 한지 특유의 따뜻한 빛이 공간을 아늑하게 만들어줍니다.",
    detail_html: "<p>수제 한지 전등갓입니다. LED 전구 포함.</p>",
    base_price: 55000,
    category: "한지공예",
    is_active: true,
    created_at: "2025-01-11T10:00:00Z",
    updated_at: "2025-01-11T10:00:00Z",
    product_images: [
      { id: "img-005-1", product_id: "prod-005", url: img("한지전등갓"), alt_text: "한지 전등갓", sort_order: 0, created_at: "2025-01-11T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-005-1", product_id: "prod-005", tag: "한지" },
      { id: "tag-005-2", product_id: "prod-005", tag: "전등" },
      { id: "tag-005-3", product_id: "prod-005", tag: "인테리어" },
    ],
    product_options: [
      { id: "opt-005-1", product_id: "prod-005", name: "원형 (소)", additional_price: 0, stock: 12, is_active: true, created_at: "2025-01-11T10:00:00Z" },
      { id: "opt-005-2", product_id: "prod-005", name: "원형 (대)", additional_price: 20000, stock: 8, is_active: true, created_at: "2025-01-11T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-006",
    name: "백자 매병",
    slug: "baekja-plum-vase",
    description:
      "조선 백자의 아름다움을 담은 매병. 순백의 자태가 품격 있는 공간을 연출합니다.",
    detail_html: "<p>전통 가마에서 구워낸 백자 매병입니다. 높이 약 25cm.</p>",
    base_price: 120000,
    category: "도자기",
    is_active: true,
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2025-01-10T10:00:00Z",
    product_images: [
      { id: "img-006-1", product_id: "prod-006", url: img("백자매병"), alt_text: "백자 매병", sort_order: 0, created_at: "2025-01-10T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-006-1", product_id: "prod-006", tag: "백자" },
      { id: "tag-006-2", product_id: "prod-006", tag: "매병" },
      { id: "tag-006-3", product_id: "prod-006", tag: "도자기" },
    ],
    product_options: [
      { id: "opt-006-1", product_id: "prod-006", name: "기본", additional_price: 0, stock: 5, is_active: true, created_at: "2025-01-10T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-007",
    name: "한지 노트 세트",
    slug: "hanji-note-set",
    description:
      "전통 한지로 제작한 노트 세트. 한지 특유의 질감과 따뜻한 색감이 매력적입니다.",
    detail_html: "<p>한지 노트 3권 세트. A5 사이즈, 각 48페이지.</p>",
    base_price: 18000,
    category: "한지공예",
    is_active: true,
    created_at: "2025-01-09T10:00:00Z",
    updated_at: "2025-01-09T10:00:00Z",
    product_images: [
      { id: "img-007-1", product_id: "prod-007", url: img("한지노트"), alt_text: "한지 노트 세트", sort_order: 0, created_at: "2025-01-09T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-007-1", product_id: "prod-007", tag: "한지" },
      { id: "tag-007-2", product_id: "prod-007", tag: "노트" },
      { id: "tag-007-3", product_id: "prod-007", tag: "문구" },
    ],
    product_options: [
      { id: "opt-007-1", product_id: "prod-007", name: "3권 세트", additional_price: 0, stock: 100, is_active: true, created_at: "2025-01-09T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-008",
    name: "노리개 귀걸이",
    slug: "norigae-earrings",
    description:
      "전통 노리개를 모티프로 한 귀걸이. 한복은 물론 일상복에도 잘 어울리는 모던 한국풍 액세서리입니다.",
    detail_html: "<p>925 실버 + 천연석 귀걸이. 길이 약 5cm.</p>",
    base_price: 32000,
    category: "액세서리",
    is_active: true,
    created_at: "2025-01-08T10:00:00Z",
    updated_at: "2025-01-08T10:00:00Z",
    product_images: [
      { id: "img-008-1", product_id: "prod-008", url: img("노리개귀걸이"), alt_text: "노리개 귀걸이", sort_order: 0, created_at: "2025-01-08T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-008-1", product_id: "prod-008", tag: "노리개" },
      { id: "tag-008-2", product_id: "prod-008", tag: "귀걸이" },
      { id: "tag-008-3", product_id: "prod-008", tag: "한국풍" },
    ],
    product_options: [
      { id: "opt-008-1", product_id: "prod-008", name: "옥색", additional_price: 0, stock: 30, is_active: true, created_at: "2025-01-08T10:00:00Z" },
      { id: "opt-008-2", product_id: "prod-008", name: "산호색", additional_price: 0, stock: 25, is_active: true, created_at: "2025-01-08T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-009",
    name: "막걸리 사발 세트",
    slug: "makgeolli-bowl-set",
    description:
      "전통 사발 스타일의 막걸리 잔 세트. 넉넉한 크기로 막걸리의 맛을 제대로 즐길 수 있습니다.",
    detail_html: "<p>도자기 막걸리 사발 4개 + 주전자 1개 세트입니다.</p>",
    base_price: 45000,
    category: "전통주잔",
    is_active: true,
    created_at: "2025-01-07T10:00:00Z",
    updated_at: "2025-01-07T10:00:00Z",
    product_images: [
      { id: "img-009-1", product_id: "prod-009", url: img("막걸리사발"), alt_text: "막걸리 사발 세트", sort_order: 0, created_at: "2025-01-07T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-009-1", product_id: "prod-009", tag: "막걸리" },
      { id: "tag-009-2", product_id: "prod-009", tag: "사발" },
      { id: "tag-009-3", product_id: "prod-009", tag: "전통주" },
    ],
    product_options: [
      { id: "opt-009-1", product_id: "prod-009", name: "기본 세트 (사발4+주전자1)", additional_price: 0, stock: 18, is_active: true, created_at: "2025-01-07T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
  {
    id: "prod-010",
    name: "저고리 블라우스",
    slug: "jeogori-blouse",
    description:
      "한복 저고리를 현대적으로 재해석한 블라우스. 일상에서도 편하게 입을 수 있는 모던 한복입니다.",
    detail_html: "<p>면/린넨 혼방. 일반 세탁 가능.</p>",
    base_price: 89000,
    category: "한복",
    is_active: true,
    created_at: "2025-01-06T10:00:00Z",
    updated_at: "2025-01-06T10:00:00Z",
    product_images: [
      { id: "img-010-1", product_id: "prod-010", url: img("저고리블라우스"), alt_text: "저고리 블라우스", sort_order: 0, created_at: "2025-01-06T10:00:00Z" },
    ],
    product_tags: [
      { id: "tag-010-1", product_id: "prod-010", tag: "한복" },
      { id: "tag-010-2", product_id: "prod-010", tag: "블라우스" },
      { id: "tag-010-3", product_id: "prod-010", tag: "모던한복" },
    ],
    product_options: [
      { id: "opt-010-1", product_id: "prod-010", name: "S", additional_price: 0, stock: 10, is_active: true, created_at: "2025-01-06T10:00:00Z" },
      { id: "opt-010-2", product_id: "prod-010", name: "M", additional_price: 0, stock: 15, is_active: true, created_at: "2025-01-06T10:00:00Z" },
      { id: "opt-010-3", product_id: "prod-010", name: "L", additional_price: 0, stock: 8, is_active: true, created_at: "2025-01-06T10:00:00Z" },
    ],
    reviews: [] as typeof MOCK_REVIEWS,
  },
];

// ─── Reviews ─────────────────────────────────────────────
export const MOCK_REVIEWS = [
  {
    id: "rev-001",
    user_id: MOCK_USER.id,
    product_id: "prod-001",
    order_item_id: "oi-001",
    rating: 5,
    content: "선비 소주잔 너무 귀여워요! 친구들이 다 어디서 샀냐고 물어봅니다. 술자리가 즐거워졌어요.",
    created_at: "2025-02-10T15:30:00Z",
    updated_at: "2025-02-10T15:30:00Z",
    users: { name: "선비" },
    review_images: [],
    products: { name: "술먹는 선비 소주잔 세트" },
  },
  {
    id: "rev-002",
    user_id: MOCK_USER.id,
    product_id: "prod-003",
    order_item_id: "oi-002",
    rating: 4,
    content: "나전칠기 거울 정말 예쁩니다. 자개 빛이 영롱해요. 다만 조금 무거운 게 아쉽네요.",
    created_at: "2025-02-08T11:00:00Z",
    updated_at: "2025-02-08T11:00:00Z",
    users: { name: "선비" },
    review_images: [],
    products: { name: "나전칠기 손거울" },
  },
  {
    id: "rev-003",
    user_id: MOCK_USER.id,
    product_id: "prod-004",
    order_item_id: "oi-003",
    rating: 5,
    content: "청자 찻잔으로 차를 마시니 기분이 고급스러워져요. 색감이 사진보다 실물이 훨씬 좋습니다!",
    created_at: "2025-02-05T09:00:00Z",
    updated_at: "2025-02-05T09:00:00Z",
    users: { name: "선비" },
    review_images: [],
    products: { name: "고려청자 찻잔 세트" },
  },
  {
    id: "rev-004",
    user_id: MOCK_USER.id,
    product_id: "prod-002",
    order_item_id: "oi-004",
    rating: 5,
    content: "외국인 친구 선물로 줬더니 너무 좋아해요! 한복 디테일이 정말 섬세합니다.",
    created_at: "2025-01-28T14:00:00Z",
    updated_at: "2025-01-28T14:00:00Z",
    users: { name: "선비" },
    review_images: [],
    products: { name: "한복 인형 커플 세트" },
  },
  {
    id: "rev-005",
    user_id: MOCK_USER.id,
    product_id: "prod-005",
    order_item_id: "oi-005",
    rating: 4,
    content: "한지 전등갓 분위기 정말 좋아요. 은은한 빛이 방 전체를 따뜻하게 해줍니다.",
    created_at: "2025-01-25T17:30:00Z",
    updated_at: "2025-01-25T17:30:00Z",
    users: { name: "선비" },
    review_images: [],
    products: { name: "한지 전등갓" },
  },
];

// Wire reviews to products
MOCK_PRODUCTS[0].reviews = MOCK_REVIEWS.filter((r) => r.product_id === "prod-001");
MOCK_PRODUCTS[1].reviews = MOCK_REVIEWS.filter((r) => r.product_id === "prod-002");
MOCK_PRODUCTS[2].reviews = MOCK_REVIEWS.filter((r) => r.product_id === "prod-003");
MOCK_PRODUCTS[3].reviews = MOCK_REVIEWS.filter((r) => r.product_id === "prod-004");
MOCK_PRODUCTS[4].reviews = MOCK_REVIEWS.filter((r) => r.product_id === "prod-005");

// ─── Orders ──────────────────────────────────────────────
export const MOCK_ORDERS = [
  {
    id: "order-001",
    user_id: MOCK_USER.id,
    order_number: "ORD-20250210-A1B2C",
    status: "delivered" as const,
    recipient_name: "선비",
    phone: "010-1234-5678",
    postal_code: "03181",
    address_line1: "서울시 종로구 세종대로 175",
    address_line2: "경복궁 앞",
    total_amount: 105000,
    discount_amount: 5000,
    shipping_fee: 0,
    final_amount: 100000,
    coupon_id: "coupon-001",
    note: null,
    created_at: "2025-02-10T12:00:00Z",
    updated_at: "2025-02-15T10:00:00Z",
    order_items: [
      { id: "oi-001", order_id: "order-001", product_id: "prod-001", option_id: "opt-001-1", product_name: "술먹는 선비 소주잔 세트", option_name: "4잔 세트 (기본)", quantity: 1, unit_price: 28000, total_price: 28000, created_at: "2025-02-10T12:00:00Z" },
      { id: "oi-002", order_id: "order-001", product_id: "prod-003", option_id: "opt-003-1", product_name: "나전칠기 손거울", option_name: "매화 문양", quantity: 1, unit_price: 42000, total_price: 42000, created_at: "2025-02-10T12:00:00Z" },
      { id: "oi-003", order_id: "order-001", product_id: "prod-002", option_id: "opt-002-1", product_name: "한복 인형 커플 세트", option_name: "기본 커플 세트", quantity: 1, unit_price: 35000, total_price: 35000, created_at: "2025-02-10T12:00:00Z" },
    ],
    payments: [
      { id: "pay-001", order_id: "order-001", method: "mock_card" as const, amount: 100000, status: "completed" as const, transaction_id: "TXN-001", paid_at: "2025-02-10T12:01:00Z", created_at: "2025-02-10T12:01:00Z" },
    ],
    shipments: [
      { id: "ship-001", order_id: "order-001", carrier: "CJ대한통운", tracking_number: "1234567890", status: "delivered" as const, shipped_at: "2025-02-11T09:00:00Z", delivered_at: "2025-02-13T14:00:00Z", created_at: "2025-02-10T12:01:00Z", updated_at: "2025-02-13T14:00:00Z" },
    ],
  },
  {
    id: "order-002",
    user_id: MOCK_USER.id,
    order_number: "ORD-20250220-D3E4F",
    status: "shipping" as const,
    recipient_name: "선비",
    phone: "010-1234-5678",
    postal_code: "03181",
    address_line1: "서울시 종로구 세종대로 175",
    address_line2: null,
    total_amount: 68000,
    discount_amount: 0,
    shipping_fee: 0,
    final_amount: 68000,
    coupon_id: null,
    note: "부재 시 문 앞에 놓아주세요",
    created_at: "2025-02-20T09:00:00Z",
    updated_at: "2025-02-21T10:00:00Z",
    order_items: [
      { id: "oi-004", order_id: "order-002", product_id: "prod-004", option_id: "opt-004-1", product_name: "고려청자 찻잔 세트", option_name: "2인 세트", quantity: 1, unit_price: 68000, total_price: 68000, created_at: "2025-02-20T09:00:00Z" },
    ],
    payments: [
      { id: "pay-002", order_id: "order-002", method: "mock_card" as const, amount: 68000, status: "completed" as const, transaction_id: "TXN-002", paid_at: "2025-02-20T09:01:00Z", created_at: "2025-02-20T09:01:00Z" },
    ],
    shipments: [
      { id: "ship-002", order_id: "order-002", carrier: "한진택배", tracking_number: "9876543210", status: "in_transit" as const, shipped_at: "2025-02-21T10:00:00Z", delivered_at: null, created_at: "2025-02-20T09:01:00Z", updated_at: "2025-02-21T10:00:00Z" },
    ],
  },
  {
    id: "order-003",
    user_id: MOCK_USER.id,
    order_number: "ORD-20250301-G5H6I",
    status: "preparing" as const,
    recipient_name: "선비",
    phone: "010-1234-5678",
    postal_code: "06236",
    address_line1: "서울시 강남구 테헤란로 212",
    address_line2: "5층",
    total_amount: 55000,
    discount_amount: 5500,
    shipping_fee: 0,
    final_amount: 49500,
    coupon_id: "coupon-002",
    note: null,
    created_at: "2025-03-01T16:00:00Z",
    updated_at: "2025-03-01T16:00:00Z",
    order_items: [
      { id: "oi-005", order_id: "order-003", product_id: "prod-005", option_id: "opt-005-1", product_name: "한지 전등갓", option_name: "원형 (소)", quantity: 1, unit_price: 55000, total_price: 55000, created_at: "2025-03-01T16:00:00Z" },
    ],
    payments: [
      { id: "pay-003", order_id: "order-003", method: "mock_bank_transfer" as const, amount: 49500, status: "completed" as const, transaction_id: "TXN-003", paid_at: "2025-03-01T16:01:00Z", created_at: "2025-03-01T16:01:00Z" },
    ],
    shipments: [
      { id: "ship-003", order_id: "order-003", carrier: "CJ대한통운", tracking_number: null, status: "preparing" as const, shipped_at: null, delivered_at: null, created_at: "2025-03-01T16:01:00Z", updated_at: "2025-03-01T16:01:00Z" },
    ],
  },
];

// ─── Coupons ─────────────────────────────────────────────
export const MOCK_COUPONS = [
  {
    id: "coupon-001",
    code: "WELCOME2025",
    name: "신규가입 5,000원 할인",
    type: "fixed" as const,
    discount_value: 5000,
    min_order_amount: 30000,
    max_discount_amount: null,
    product_id: null,
    starts_at: "2025-01-01T00:00:00Z",
    expires_at: "2025-12-31T23:59:59Z",
    max_uses: 1000,
    used_count: 150,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "coupon-002",
    code: "SPRING10",
    name: "봄맞이 10% 할인",
    type: "percent" as const,
    discount_value: 10,
    min_order_amount: 20000,
    max_discount_amount: 15000,
    product_id: null,
    starts_at: "2025-03-01T00:00:00Z",
    expires_at: "2025-05-31T23:59:59Z",
    max_uses: 500,
    used_count: 45,
    is_active: true,
    created_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "coupon-003",
    code: "SEONBI30",
    name: "선비 소주잔 30% 특별 할인",
    type: "percent" as const,
    discount_value: 30,
    min_order_amount: 0,
    max_discount_amount: 10000,
    product_id: "prod-001",
    starts_at: "2025-02-01T00:00:00Z",
    expires_at: "2025-06-30T23:59:59Z",
    max_uses: 100,
    used_count: 20,
    is_active: true,
    created_at: "2025-02-01T00:00:00Z",
  },
];

export const MOCK_USER_COUPONS = [
  {
    id: "uc-001",
    user_id: MOCK_USER.id,
    coupon_id: "coupon-001",
    is_used: true,
    used_at: "2025-02-10T12:00:00Z",
    created_at: "2025-01-01T00:00:00Z",
    coupons: MOCK_COUPONS[0],
  },
  {
    id: "uc-002",
    user_id: MOCK_USER.id,
    coupon_id: "coupon-002",
    is_used: false,
    used_at: null,
    created_at: "2025-03-01T00:00:00Z",
    coupons: MOCK_COUPONS[1],
  },
  {
    id: "uc-003",
    user_id: MOCK_USER.id,
    coupon_id: "coupon-003",
    is_used: false,
    used_at: null,
    created_at: "2025-02-01T00:00:00Z",
    coupons: MOCK_COUPONS[2],
  },
];

// ─── Events ──────────────────────────────────────────────
export const MOCK_EVENTS = [
  {
    id: "event-001",
    title: "봄맞이 전통 기념품 대전",
    slug: "spring-2025-sale",
    description: "봄을 맞아 선비샵의 인기 상품을 특별 할인가에 만나보세요. 최대 30% 할인!",
    body_html:
      '<h2>봄맞이 전통 기념품 대전</h2><p>선비샵에서 봄을 맞이하여 특별 이벤트를 진행합니다.</p><ul><li>전 상품 10% 할인</li><li>5만원 이상 구매 시 무료배송</li><li>리뷰 작성 시 추가 쿠폰 증정</li></ul><p>기간: 2025년 3월 1일 ~ 5월 31일</p>',
    image_url: img("봄이벤트"),
    starts_at: "2025-03-01T00:00:00Z",
    ends_at: "2025-05-31T23:59:59Z",
    is_active: true,
    created_at: "2025-02-25T10:00:00Z",
    updated_at: "2025-02-25T10:00:00Z",
    event_comments: [
      { id: "ec-001", event_id: "event-001", user_id: MOCK_USER.id, content: "이벤트 기대됩니다! 소주잔 세트 사려고 기다리고 있었어요.", created_at: "2025-03-02T10:00:00Z", users: { name: "선비" } },
      { id: "ec-002", event_id: "event-001", user_id: MOCK_USER.id, content: "쿠폰 코드가 적용이 잘 됩니다. 감사해요!", created_at: "2025-03-05T14:00:00Z", users: { name: "선비" } },
    ],
    event_coupons: [
      { id: "evc-001", event_id: "event-001", coupon_id: "coupon-002", coupons: MOCK_COUPONS[1] },
    ],
  },
  {
    id: "event-002",
    title: "선비샵 오픈 기념 이벤트",
    slug: "grand-opening",
    description: "선비샵 그랜드 오픈! 가입만 해도 5,000원 할인 쿠폰을 드립니다.",
    body_html:
      '<h2>선비샵 오픈 기념</h2><p>선비샵이 드디어 오픈했습니다!</p><p>가입만 해도 5,000원 할인 쿠폰을 드립니다.</p><p>많은 관심 부탁드립니다.</p>',
    image_url: img("오픈이벤트"),
    starts_at: "2025-01-01T00:00:00Z",
    ends_at: "2025-02-28T23:59:59Z",
    is_active: true,
    created_at: "2024-12-25T10:00:00Z",
    updated_at: "2024-12-25T10:00:00Z",
    event_comments: [
      { id: "ec-003", event_id: "event-002", user_id: MOCK_USER.id, content: "오픈 축하합니다! 좋은 상품 많이 올려주세요~", created_at: "2025-01-01T12:00:00Z", users: { name: "선비" } },
    ],
    event_coupons: [
      { id: "evc-002", event_id: "event-002", coupon_id: "coupon-001", coupons: MOCK_COUPONS[0] },
    ],
  },
];

// ─── Inquiries ───────────────────────────────────────────
export const MOCK_INQUIRIES = [
  {
    id: "inq-001",
    user_id: MOCK_USER.id,
    product_id: "prod-001",
    order_id: null,
    type: "product" as const,
    title: "소주잔 세트 추가 구매 문의",
    content: "소주잔을 2개만 추가로 구매할 수 있나요?",
    status: "answered" as const,
    created_at: "2025-02-15T10:00:00Z",
    updated_at: "2025-02-16T09:00:00Z",
    products: { name: "술먹는 선비 소주잔 세트" },
    inquiry_replies: [
      { id: "ir-001", inquiry_id: "inq-001", user_id: MOCK_ADMIN.id, content: "안녕하세요! 개별 구매는 어렵지만, 6잔 세트 옵션을 추천드립니다.", created_at: "2025-02-16T09:00:00Z" },
    ],
  },
  {
    id: "inq-002",
    user_id: MOCK_USER.id,
    product_id: null,
    order_id: "order-002",
    type: "shipping" as const,
    title: "배송 언제 도착하나요?",
    content: "주문한 지 이틀 됐는데 아직 배송 시작 안 된 것 같아요.",
    status: "pending" as const,
    created_at: "2025-02-22T15:00:00Z",
    updated_at: "2025-02-22T15:00:00Z",
    products: null,
    inquiry_replies: [],
  },
];

// ─── Cart (in-memory store for mock mode) ────────────────
let mockCartItems: Array<{
  id: string;
  user_id: string;
  product_id: string;
  option_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  products: {
    id: string;
    name: string;
    base_price: number;
    is_active: boolean;
    product_images: Array<{ url: string; sort_order: number }>;
  };
  product_options: {
    id: string;
    name: string;
    additional_price: number;
    stock: number;
  } | null;
}> = [];

export function getMockCart() {
  return [...mockCartItems];
}

export function addMockCartItem(productId: string, quantity: number, optionId?: string) {
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product || !product.is_active) return { error: "상품을 찾을 수 없습니다." };

  const option = optionId ? product.product_options.find((o) => o.id === optionId) : null;
  if (optionId && (!option || !option.is_active)) return { error: "옵션을 찾을 수 없습니다." };

  const existing = mockCartItems.find(
    (i) => i.product_id === productId && (optionId ? i.option_id === optionId : i.option_id === null)
  );

  if (existing) {
    existing.quantity += quantity;
    existing.updated_at = new Date().toISOString();
  } else {
    mockCartItems.push({
      id: `cart-${Date.now()}`,
      user_id: MOCK_USER.id,
      product_id: productId,
      option_id: optionId ?? null,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      products: {
        id: product.id,
        name: product.name,
        base_price: product.base_price,
        is_active: product.is_active,
        product_images: product.product_images.map((i) => ({ url: i.url, sort_order: i.sort_order })),
      },
      product_options: option
        ? { id: option.id, name: option.name, additional_price: option.additional_price, stock: option.stock }
        : null,
    });
  }
  return { error: null };
}

export function updateMockCartQuantity(cartItemId: string, quantity: number) {
  const item = mockCartItems.find((i) => i.id === cartItemId);
  if (item) {
    item.quantity = quantity;
    item.updated_at = new Date().toISOString();
  }
  return { error: null };
}

export function removeMockCartItem(cartItemId: string) {
  mockCartItems = mockCartItems.filter((i) => i.id !== cartItemId);
  return { error: null };
}

export function clearMockCart() {
  mockCartItems = [];
  return { error: null };
}

// ─── Admin dashboard stats ──────────────────────────────
export const MOCK_DASHBOARD = {
  todayOrders: 7,
  todayRevenue: 423000,
  pendingInquiries: 1,
  totalProducts: MOCK_PRODUCTS.length,
  orderStatusSummary: {
    payment_completed: 2,
    preparing: 1,
    shipping: 1,
    delivered: 3,
    cancelled: 0,
  },
};
