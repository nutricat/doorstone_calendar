# [자취방 프로젝트] UX 개편 및 전략 수정 지시서 (For Next AI Agent)

## 📌 Context & Objectives

이 문서는 이전 담당 에이전트와 사용자가 치열한 PM/기획적 논의를 거쳐 **최종 확정한 아키텍처 및 작업 지시서**입니다.
이 문서를 읽은 다음 에이전트는 기획적 의도를 묻지 말고 즉시 아래 나열된 Phase별 Action Item을 순서대로 수행하여 코드를 작성/수정해야 합니다.

### 핵심 목표
1. **Home**: 기존 "예쁘기만 한" 홈 화면을 버리고, **2단계 온보딩(대분야 → 하위직무) → 자격증 번들 추천 구조**로 전면 재작성.
2. **Detail**: 상세페이지를 모바일 우선으로 대폭 개편하고, 외부 링크 파도타기를 막아 **'유틸리티 락인(Utility Lock-in)'**을 달성.
3. **Data**: 가짜 데이터(랜덤 해시)를 배제하고, 향후 `유튜브 합격 후기 AI 요약 파이프라인`에서 들어올 **정규화된 JSON 스키마를 수용할 수 있는 템플릿 구조** 마련.
4. **Calendar & Certs (글로벌 개인화)**: Home에서 선택한 직무 필터 상태(`localStorage`)를 캘린더와 조회 화면으로 연동시켜, 진입 시 노이즈(불필요한 타 직무 시험)를 걷어내고 내 직무 관련 일정만 우선 보여주는 쾌적한 UX 달성.
5. **유지 지침**: My-certs, Favorites 등 홈/디테일을 제외한 기존 로컬스토리지 및 URL 해시 기반 기능들은 절대 망가뜨리지 말 것.

---

## 🛠 Phase 1: 데이터 구조 확장 및 스키마 세팅

### 1-1. `data/career_path.json` 재구조화
- 기존 `category` 데이터는 건드리지 마십시오 (하위 호환성용).
- 아래 형태의 `job_tracks` (총 3대분류, 14소분류) 최상위 구조를 완전히 새롭게 추가하십시오. (MECE 기반)
```json
{
  "job_tracks": {
    "사기업": {
      "icon": "business",
      "sub": {
        "경영/기획": { "desc": "전사 전략·기획·사업관리", "certs": ["sqld", "adsp"], "common": ["toeic", "opic", "com-1"] },
        "인사/총무": { "desc": "채용·교육·노무·자산관리", "certs": ["hrm-expert", "sa-2"], "common": ["toeic", "k-history", "com-2"] },
        "재무/회계/세무": { "certs": ["aicpa", "at-manager", "tax-accounting", "tat-fat", "at-accounting", "erp-info"], "common": ["toeic", "com-2"] },
        "마케팅/광고/홍보": { "certs": ["adsp", "sqld", "sa-2"], "common": ["opic", "toeic"] },
        "영업/영업관리": { "certs": ["com-2"], "common": ["toeic", "toeic-speaking", "opic"] },
        "무역/수출입": { "certs": ["trade-eng-1", "itc", "bonded-goods"], "common": ["toeic", "toeic-speaking", "opic"] },
        "물류/유통/SCM": { "certs": ["lom-30", "distributor"], "common": ["toeic", "com-2"] },
        "IT/데이터": { "certs": ["adp", "bigdata", "sqld", "adsp"], "common": ["toeic"] }
      }
    },
    "공기업/공공기관": {
      "icon": "account_balance",
      "sub": {
        "사무직 (경영/기획)": { "certs": ["com-1", "mca"], "common": ["k-history", "toeic", "kbs-kr", "k-kanji-1"] },
        "사무직 (재무/회계)": { "certs": ["at-manager", "tax-accounting", "tat-fat"], "common": ["k-history", "toeic", "com-1", "kbs-kr"] },
        "전산/IT직": { "certs": ["bigdata", "sqld", "adsp", "com-1"], "common": ["k-history", "toeic", "kbs-kr"] }
      }
    },
    "금융권 (금융공기업 포함)": {
      "icon": "payments",
      "sub": {
        "은행 (일반직/영업)": { "certs": ["afpk", "cca", "fund-adv", "kofia-rep", "fx-specialist"], "common": ["toeic", "com-1", "opic"] },
        "증권/자산운용 (IB/PB)": { "certs": ["cfa-1", "cfp", "kofia-im", "kofia-fa"], "common": ["toeic", "toeic-speaking"] },
        "리스크/계리/부동산": { "certs": ["kofia-frm", "realtor"], "common": ["toeic", "com-2"] }
      }
    }
  }
}
```

### 1-2. `data/exam_info.json` AI 템플릿 스키마 추가
- 외부 링크 연동을 끊어버리고, 자체 체류를 위한 **유튜브 AI 요약 스키마**를 설계했습니다.
- 모든 자격증 항목에 아래 스키마를 참고하여 빈값 또는 예시값으로 `ai_analysis` 속성을 추가하십시오.
```json
{
  "id": "sqld",
  "ai_analysis": {
    "source_title": "▶️ 유튜브 합격 후기 상위 15개 영상 분석",
    "avg_study_weeks": "3.5주 (단기 1주)",
    "difficulty": "중상 (2과목 SQL 활용 병목)",
    "key_summary": "비전공자 기준 데이터베이스 개념 이해가 당락을 좌우함",
    "top_textbook": "민트색 기본서 (유튜버 80% 추천)",
    "top_videos": [
      {"title": "SQLD 노베이스 1주일 합격 공부법", "url": "#"}
    ]
  }
}
```

---

## 🛠 Phase 2: Home 페이지 완전 교체

### 2-1. `index.html` 재작성
- 기존 트랙 칩, 타임라인 UI 모두 제거.
- 플로팅 온보딩 오버레이 뷰(풀스크린) 구조 설계 (최초 접속 판별용).
- 메인 대시보드 구조: (선택된 직무에 맞춘 인사말) → (직무별 수준 분류된 자격증 번들 카드 세트) → (기존 접수 마감 임박) → (기존 관심 자격증).

### 2-2. `js/home.js` 재작성
- **로직 A (Onboarding)**: `localStorage.getItem('home_job_prefs')` 체크. 값이 없으면 1단계(대분류 3개 카드) → 2단계(소분류 리스트) UI 슬라이드 트랜지션 실행. 저장 후 대시보드 렌더링.
- **로직 B (Bundle Render)**: `career_path.json`의 `job_tracks`를 참조. 선택된 하위 직무의 `certs`, `common` 배열 ID를 순회하여 자격증 카드를 `심화/핵심/기초/공용` 등으로 그룹핑 렌더링. 기존 `study_time` 정규식 호환성 유지 必.

---

## 🛠 Phase 3: Detail 페이지 (모바일 + 리얼 데이터 락인 구조로 리팩토링)

### 3-1. `cert-detail.html` 리팩토링 (UI - Mobile First 원칙 엄수)
- **여백 및 레이아웃 축소 (Spacing)**: PC용 넓은 여백 제거. 최상단 컨테이너를 `max-w-4xl` 등에서 `max-w-lg mx-auto`로 줄이고, `px-8`, `space-y-12` 속성들을 `px-4`, `space-y-6` 수준으로 촘촘하게 변경하십시오.
- **방해 요소 완전 컷팅**: '다음 단계 자격증' 섹션은 완전히 삭제(HTML 태그 단위 제거). 
- **그리드 → 컬럼 스태킹 (Stacking)**: 기존 PC 기반 4열 그리드(`grid-cols-4`), 2/3 + 1/3 레이아웃 등을 파괴하고, 모바일 기본값인 `col-span-1` 또는 `flex-col`로 변경하십시오. 다단 레이아웃은 최소 `md:` 브레이크포인트 이상에서만 작동하게 하십시오.
- **아코디언 및 Full-width 활용 (Bleeding)**: 표(Table) 구조였던 시험 일정 및 과목 형식을 터치 친화적이며 화면 공간을 아끼는 **아코디언(Details-Summary)** 카드 컴포넌트로 개조하십시오. 
- **터치 영역 (Touch Target) 확장**: 모든 클릭 가능한 컴포넌트나 카드 패딩을 `py-3` 또는 `py-4` 이상으로 설정하여 모바일 터치(최소 44px) 사용성을 보장하십시오.

### 3-2. `js/detail.js` 리팩토링 (기능)
- **과제 A (N:M 양방향 역참조)**: `populateHero()` 함수 내에서, 현재 자격증 ID를 베이스로 `career_path.json`의 `job_tracks`를 순회 역검색. 매핑된 모든 직무명(예: `사기업 마케팅`, `공기업 전산`)을 최상단에 Badge/Chip 형태로 동적 바인딩.
- **과제 B (외부 링크 제거 및 AI 템플릿 주입)**: `populateCommunityReviews()` 로직 수정. 블로그/카페 외주 링크를 막고, `exam_info.json`의 `ai_analysis` 블록을 활용한 UI 템플릿(평균 준비기간, AI 핵심 요약, 유튜버 추천 교재 등)을 렌더링하도록 100% 변경.
- **과제 C (추천교재 수익화 강화)**: `populateBooks()`에 AI 데이터 기반 신뢰 카피(예: "유튜버 10명 중 8명이 추천한 교재")를 삽입하여 구매 전환율을 높일 것.

---

## 🛠 Phase 4: 글로벌 개인화 연동 (Calendar & Certs UX 개선)

### 4-1. `js/calendar.js` 데이터 필터링 연동
- 페이지 로드 시 `localStorage.getItem('home_job_prefs')` (Home 페이지 설정값)를 읽어옵니다.
- 선택된 직무가 있다면, `career_path.json`를 참조하여 해당 직무에 속한 달력 이벤트(Event)만 우선 필터링하여 렌더링하십시오.
- 무의미하게 찍히던 점(Dot)들이 사라지고 데이터 밀도가 획기적으로 낮아지므로, 모바일에서도 숨김 처리 없이 `[접수] SQLD` 처럼 텍스트가 온전히 표기될 수 있도록 FullCalendar의 CSS 및 렌더링 옵션(`dayMaxEvents` 해제 등)을 재조정하십시오.
- 캘린더 제어판 상단에 '내 직무/관심 일정만 보기' ↔ '전체 123개 일정 보기' 토글 컨트롤을 추가하십시오.

### 4-2. `js/certs.js` 카테고리 필터 기선택 처리
- 자격증 조회 페이지 진입 시, 아무것도 선택되지 않은 전체 나열이 아니라 `localStorage`의 저장된 유저 직무(Job) 기반으로 카테고리가 기본 필터링(활성화)된 상태로 노출되게 하십시오.

---

## 🚫 Critical Constraints (다음 에이전트 필수 엄수 사항)
1. **Never Touch Legacy States**: `favorites.js`, `my-certs.js`, `data.js` 상의 기능들(LocalStorage 기반 찜하기, 수료 여부 체크)은 이 UX 개편 작업에 의해 오동작하면 안 됩니다.
2. **No Fake Data**: 51~75% 등의 랜덤 해시/가짜 데이터 생성 스크립트는 논의 끝에 **금지**되었습니다. `exam_info.json`의 `ai_analysis` 객체에서만 데이터를 pull 하여 보여주십시오.
3. **Execution Only**: 이 문서에 적힌 아키텍처와 로직은 기획 단계에서 철저한 검증을 마쳤습니다. 다음 담당 AI 에이전트는 기획적 조언을 삼가고 즉시 코드 작성에 돌입하십시오.
