# [자취방 프로젝트] Hand-off 문서

> 작성일: 2026-04-16  
> 이전 작업: UX 개편 및 전략 수정 (`implementation_plan.md` 전체 이행)  
> 다음 담당자: 이 문서를 읽은 에이전트 또는 개발자

---

## 1. 프로젝트 개요

**자취방**은 한국 취준생을 위한 자격증 정보 추적 웹앱입니다.

- **스택**: 순수 HTML / Tailwind CSS (CDN) / Vanilla JS — 빌드 시스템 없음
- **데이터**: 정적 JSON 파일 (`data/` 폴더), 백엔드 없음
- **상태 관리**: `localStorage` 전용
- **라우팅**: URL 해시 기반 (`cert-detail.html#{id}`)

---

## 2. 파일 구조

```
jcb_project/
├── index.html              ← 홈 (온보딩 + 직무 번들 대시보드)
├── cert-detail.html        ← 자격증 상세 (모바일 퍼스트 개편 완료)
├── calendar.html           ← 시험 일정 캘린더
├── certs.html              ← 자격증 전체 조회
├── my-certs.html           ← 관심/취득 자격증 (건드리지 말 것)
├── data/
│   ├── career_path.json    ← ★ certs[] + job_tracks{} 구조 (이번에 추가)
│   ├── exam_info.json      ← ★ ai_analysis 블럭 전체 추가 완료 (39개)
│   ├── exams.json          ← 시험 일정 원본 (변경 없음)
│   └── notice.json         ← 공지 (변경 없음)
├── js/
│   ├── home.js             ← ★ 전면 재작성 (온보딩 + 번들 렌더)
│   ├── detail.js           ← ★ 직무 배지, AI 분석 카드, 아코디언 일정
│   ├── calendar.js         ← ★ 직무 필터 + 토글 버튼 추가
│   ├── certs.js            ← ★ 직무 기반 카테고리 기선택 추가
│   ├── data.js             ← 공용 유틸 (변경 없음, 건드리지 말 것)
│   ├── favorites.js        ← localStorage 관리 (변경 없음, 건드리지 말 것)
│   ├── my-certs.js         ← (변경 없음, 건드리지 말 것)
│   ├── theme.js            ← (변경 없음)
│   ├── feedback.js         ← (변경 없음)
│   └── notice.js           ← (변경 없음)
├── implementation_plan.md  ← 기획서 원본 (참고용)
└── hand-off.md             ← 이 문서
```

---

## 3. 이번 작업에서 변경된 사항

### 3-1. `data/career_path.json`

기존 `certs[]` 배열은 **그대로 유지**하고, 최상위에 `job_tracks` 객체를 추가했습니다.

```json
{
  "certs": [ ... ],       // 기존 — 건드리지 말 것
  "job_tracks": {         // 신규 추가
    "사기업": {
      "icon": "business",
      "sub": {
        "IT/데이터": {
          "desc": "데이터·개발·IT 직무",
          "certs": ["adp", "bigdata", "sqld", "adsp"],
          "common": ["toeic"]
        },
        ...
      }
    },
    "공기업/공공기관": { ... },
    "금융권 (금융공기업 포함)": { ... }
  }
}
```

- 대분류 3개, 소분류 14개
- `certs[]`: 해당 직무 핵심 자격증 ID 목록
- `common[]`: 어학·공용 자격증 ID 목록

### 3-2. `data/exam_info.json`

기존 항목 39개 전부에 `ai_analysis` 블럭을 추가했습니다.

```json
{
  "id": "sqld",
  ...
  "ai_analysis": {
    "source_title": "▶️ 유튜브 합격 후기 상위 15개 영상 분석",
    "avg_study_weeks": "5.5주 (SQL 경험자 2~3주)",
    "difficulty": "중상 (2과목 SQL 활용 병목)",
    "key_summary": "...",
    "top_textbook": "유선배 SQLD 과외노트 (유튜버 80% 추천)",
    "top_videos": [
      { "title": "SQLD 노베이스 1주일 합격 공부법", "url": "#" }
    ]
  }
}
```

현재 `top_videos[].url`은 모두 `"#"` (플레이스홀더). 실제 유튜브 URL로 교체하면 바로 기능합니다.

### 3-3. `index.html` + `js/home.js`

**홈 화면 전면 교체:**

| 제거된 항목 | 추가된 항목 |
|---|---|
| 트랙 칩 행 | 온보딩 오버레이 (대분류 → 소분류 선택) |
| Featured 카드 | 직무 번들 카드 섹션 |
| 스터디 타임라인 | 에디터 코멘트 블럭 |
| 합격률 비교 섹션 | 인사말 섹션 |

**온보딩 동작:**
```
최초 접속
 → localStorage 'home_job_prefs' 없음
 → 오버레이 표시 (헤더/바텀 nav는 z-50로 항상 위에 표시)
 → Step1: 대분류 3개 카드 선택
 → Step2: 소분류 리스트 선택 (슬라이드 없이 즉시 전환)
 → 저장 후 대시보드 렌더링

재접속
 → 저장된 prefs 있음 → 오버레이 없이 바로 대시보드
```

**localStorage 키:** `'home_job_prefs'` → `{ major: "사기업", sub: "IT/데이터" }`

**에디터 코멘트:** `DIRECTOR_COMMENTS` 맵 (home.js 상단)에 14개 소분류별 전략 코멘트 저장. 직무 선택 후 번들 섹션 아래에 렌더링됨.

### 3-4. `cert-detail.html` + `js/detail.js`

**모바일 퍼스트 레이아웃 변경:**

| 변경 전 | 변경 후 |
|---|---|
| `max-w-4xl`, `px-6`, `space-y-12` | `max-w-lg`, `px-4`, `space-y-6` |
| `grid-cols-4` 메타 그리드 | `grid-cols-1 md:grid-cols-2` |
| 시험 일정 테이블 | `<details>/<summary>` 아코디언 |
| "다음 단계 자격증" 섹션 | **완전 삭제** |

**`detail.js` 기능 변경:**

1. **직무 배지 (N:M 역참조)**: `job_tracks` 전체 순회 → 현재 자격증 ID가 포함된 모든 직무명을 뱃지 칩으로 hero 상단에 표시
2. **AI 분석 카드**: `populateCommunityReviews()` → YouTube/Naver 링크 제거, `ai_analysis` 블럭 렌더링으로 완전 교체
3. **신뢰 카피**: `populateBooks()` 섹션 타이틀에 "유튜버 10명 중 8명이 추천한 교재" 문구 삽입

### 3-5. `js/calendar.js`

- 진입 시 `home_job_prefs` 읽어 해당 직무의 자격증 이름 Set 파생
- `jobFilterActive = true` 기본값 (직무 선택된 경우)
- `getFilteredExams()` 내 직무 필터 레이어 추가
- 캘린더 위에 토글 버튼 삽입 (`setupJobToggle()`)
  - "내 직무 일정만 보기" ↔ "전체 N개 일정 보기"
  - 직무 필터 시 `dayMaxEvents: false` (모든 이벤트 텍스트 표시)

### 3-6. `js/certs.js`

- 진입 시 `home_job_prefs` 읽어 직무 certs의 가장 빈번한 카테고리 파생
- `activeCategory`에 기선택 값 주입 후 `setupFilters()` 호출
- 공용 카테고리는 파생 시 제외 (노이즈 방지)

---

## 4. 절대 건드리지 말아야 할 사항

| 대상 | 이유 |
|---|---|
| `favorites.js` | `cert_favorites`, `cert_obtained` localStorage 키 관리. 전 페이지에서 의존 |
| `my-certs.js` | DOM ID `#favTotalCount`, `#favCertsList`, `#obtainedCertsList`에 직접 접근 |
| `data.js` | `NAME_TO_INFO_ID`, `INFO_ID_TO_NAME`, `fetchJSON`, `dDay`, `fmtMonthDay` 등 전역 유틸 |
| `career_path.json`의 `certs[]` | 기존 카테고리/레벨 기반 로직 전체가 이 배열에 의존 |
| `cert-detail.html`의 hash 라우팅 | `cert-detail.html#{id}` 방식. `detail.js` `loadDetail()` 함수가 `window.location.hash` 파싱 |

---

## 5. 남은 작업 / 알려진 이슈

### 즉시 처리 권장

| 항목 | 위치 | 설명 |
|---|---|---|
| `top_videos[].url` 실제 링크 교체 | `data/exam_info.json` 전체 | 현재 모두 `"#"`. 실제 유튜브 URL 삽입 필요 |
| 일부 자격증 `pass_rate` 누락 | `exam_info.json` 일부 항목 | `pass_rate` 필드 없는 항목은 합격률 표시 생략됨 |
| `kofia-adv` 이름 불일치 | `data.js` `NAME_TO_INFO_ID` | `증권투자권유자문인력` 이름이 exams.json과 다를 수 있음. 확인 필요 |

### 향후 개선 과제

| 항목 | 설명 |
|---|---|
| 유튜브 AI 요약 파이프라인 | `ai_analysis` 스키마는 이미 설계됨. 실제 영상 분석 결과 주입만 하면 됨 |
| `home_job_prefs` 복수 직무 선택 | 현재 단일 직무만 지원. 멀티 선택 구조로 확장 가능 |
| `detail.js` — 직무 배지 클릭 | 현재 배지는 정보 표시만. 클릭 시 해당 직무 번들 페이지로 이동 기능 추가 가능 |
| 에디터 코멘트 CMS화 | 현재 `DIRECTOR_COMMENTS`는 JS 하드코딩. 별도 JSON으로 외부화하면 비개발자도 편집 가능 |

---

## 6. 주요 데이터 흐름 요약

```
localStorage['home_job_prefs'] = { major, sub }
        │
        ├─ home.js       → job_tracks[major].sub[sub] → 번들 카드 렌더
        ├─ calendar.js   → 직무 cert 이름 Set 파생 → 캘린더 필터
        └─ certs.js      → 직무 cert 카테고리 파생 → 필터 기선택

career_path.json
  ├─ certs[]             → 레벨/카테고리 기반 (기존 로직 전체 의존)
  └─ job_tracks{}        → 온보딩/번들/역참조 (신규)

exam_info.json[]
  ├─ 기존 필드           → detail.js, certs.js, home.js
  └─ ai_analysis{}       → detail.js populateCommunityReviews() 전용
```

---

## 7. 검증 체크리스트

- [ ] `index.html` localStorage 초기화 후 진입 → 온보딩 오버레이 표시, 헤더/바텀 nav 표시 유지
- [ ] 직무 선택 완료 → 번들 카드 + 에디터 코멘트 블럭 정상 렌더링
- [ ] 재접속 → 오버레이 없이 바로 대시보드
- [ ] `cert-detail.html#sqld` → hero 상단 직무 배지 표시, AI 분석 카드 표시, 외부 링크 없음
- [ ] 시험 일정 아코디언 → 클릭 시 접수/시험/결과일 펼침
- [ ] `calendar.html` → 직무 토글 버튼 표시, 필터 ON/OFF 전환
- [ ] `certs.html` → 직무에 맞는 카테고리 기선택 상태로 진입
- [ ] `my-certs.html` → 기존 즐겨찾기/취득 기능 정상 동작 (회귀 확인)
