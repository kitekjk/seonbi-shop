# 선비샵 QA 리포트

**날짜**: 2026-03-15
**사이트**: https://seonbi-deploy.vercel.app
**Supabase 프로젝트**: nkgdtkmsxzhievrkehyp

---

## 발견된 버그 및 수정 사항

### BUG-1: 로그인 후 헤더에 '로그인' 버튼이 그대로 보임 (Critical)

**증상**: 로그인 성공 후에도 헤더에 항상 '로그인' 버튼만 표시됨. 로그아웃 버튼 없음.

**근본 원인**:
1. `Header` 컴포넌트가 정적 서버 컴포넌트로, 인증 상태를 확인하지 않음
2. Mock 모드에서 로그인 API가 세션 쿠키를 설정하지 않음
3. `getAuthUser()` 헬퍼가 mock 모드에서 항상 mock 유저를 반환 (로그인 여부 무관)
4. 로그아웃 버튼이 UI 어디에도 없음

**수정 내용**:
- `src/components/header.tsx`: async 서버 컴포넌트로 변경, Supabase/mock 인증 상태 확인
- `src/components/auth-button.tsx`: 클라이언트 컴포넌트 신규 생성 (로그인/회원가입 ↔ 마이페이지/로그아웃 전환)
- `src/app/api/auth/login/route.ts`: mock 모드에서 `mock-auth` 쿠키 설정
- `src/app/api/auth/logout/route.ts`: mock 모드에서 `mock-auth` 쿠키 삭제
- `src/lib/api/helpers.ts`: `getAuthUser()`가 mock 모드에서 `mock-auth` 쿠키 확인하도록 수정
- `src/lib/api/helpers.ts`: `requireAdmin()`도 mock 모드에서 실제 인증 확인하도록 수정

### BUG-2: 마이페이지 유저 정보 하드코딩 (Medium)

**증상**: 마이페이지에서 항상 "회원님"으로 표시, 실제 유저 이름/이메일 미반영

**근본 원인**: `setUser({ name: "회원", email: "" })` 하드코딩

**수정 내용**:
- `src/app/api/auth/me/route.ts`: 인증된 유저 정보 반환 API 신규 생성
- `src/app/mypage/page.tsx`: `/api/auth/me` 호출하여 실제 유저 정보 표시, 미인증 시 로그인 페이지로 리다이렉트

### BUG-3: 카테고리 필터 불일치 (Critical)

**증상**: 상품 페이지의 카테고리 필터 클릭 시 상품이 표시되지 않음

**근본 원인**: 상품 페이지 카테고리 목록 (`공예품`, `패션소품`, `문구`, `소품`)이 실제 데이터의 카테고리 (`한지공예`, `전통주잔`, `한복`, `액세서리`)와 불일치

**수정 내용**:
- `src/app/products/page.tsx`: 카테고리 목록을 실제 데이터와 일치시킴
- `src/app/page.tsx`: 홈페이지 카테고리 네비게이션도 동일하게 수정

### BUG-4: 홈페이지 이벤트 링크 오류 (Minor)

**증상**: "이벤트 참여하기" 버튼이 `/events/1`로 링크되지만, 실제 이벤트 ID는 `event-001`

**수정 내용**:
- `src/app/page.tsx`: 링크를 `/events/event-001`로 수정

---

## QA 체크리스트 결과

| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 1 | 헤더: 로그인 상태에 따른 UI 전환 | **수정 완료** | 로그인→마이페이지/로그아웃, 비로그인→로그인/회원가입 |
| 2 | 회원가입 → 로그인 → 로그아웃 플로우 | **수정 완료** | mock-auth 쿠키 기반 세션 관리 구현 |
| 3 | 상품 목록: 카테고리 필터 | **수정 완료** | 카테고리명 실제 데이터와 일치시킴 |
| 4 | 상품 상세: 장바구니 추가 | **정상** | addToCart 서버 액션 정상 동작 |
| 5 | 장바구니: 수량 변경, 삭제 | **정상** | updateCartQuantity, removeFromCart 정상 동작 |
| 6 | 모든 페이지 네비게이션 링크 | **수정 완료** | 이벤트 링크 수정, 카테고리 링크 수정 |
| 7 | 어드민 페이지 접근 | **정상** | /admin 접근 가능, API 레벨 권한 체크 동작 |
| 8 | UI 깨짐 | **정상** | 데스크톱 기준 깨지는 UI 없음 |

---

## 수정된 파일 목록

| 파일 | 변경 유형 |
|------|----------|
| `src/components/header.tsx` | 수정 (async 서버 컴포넌트 + 인증 확인) |
| `src/components/auth-button.tsx` | 신규 (로그인/로그아웃 클라이언트 컴포넌트) |
| `src/app/api/auth/login/route.ts` | 수정 (mock 모드 쿠키 설정) |
| `src/app/api/auth/logout/route.ts` | 수정 (mock 모드 쿠키 삭제) |
| `src/app/api/auth/me/route.ts` | 신규 (현재 유저 정보 API) |
| `src/lib/api/helpers.ts` | 수정 (mock 모드 인증 확인 로직) |
| `src/app/mypage/page.tsx` | 수정 (실제 유저 정보 표시) |
| `src/app/products/page.tsx` | 수정 (카테고리 목록 수정) |
| `src/app/page.tsx` | 수정 (카테고리 링크 + 이벤트 링크 수정) |

---

## 빌드 결과

```
npm run build → 성공 (Next.js 16.1.6 Turbopack)
TypeScript 컴파일 오류 없음
40개 페이지 정상 생성
```

---

## 잔여 이슈 (향후 개선)

1. **어드민 UI 접근 제어**: API 레벨에서는 권한 체크하지만, `/admin` 페이지 자체는 누구나 접근 가능. 클라이언트 사이드 또는 미들웨어에서 접근 제어 추가 권장.
2. **TypeScript `any` 타입 사용**: 일부 API 응답에서 `any` 타입 사용 중 (동작에 영향 없음).
3. **카카오 소셜 로그인**: 로그인 페이지에 "카카오로 시작하기" 버튼이 있지만 미구현 상태.
