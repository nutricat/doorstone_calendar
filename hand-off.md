[[**반드시 이행할 것! 본 파일은 이전 작업 기록을 저장하기 위한 파일로, 작업을 수행한 이후, 기존 레거시 내용을 삭제 후, 수행한 작업을 간결하게 반드시 아래의 (())에 입력해야 함. 이는 사용자 지시가 없어도 항상 수행되어야 함.**]]

((
변경 사항 요약
data/career_path.json
job_tracks 4대분류로 재구성: 사기업 → 경영/사무 (6개) + 회계/재무/세무 (3개 신규 분리), 금융권(금융공기업 포함) → 금융, 공기업/공공기관 소분류 재편 (사무직 통합, 금융공기업 추가)
js/home.js
MAJOR_ICONS 4개로 업데이트 (calculate 추가)
DIRECTOR_COMMENTS 키 전면 교체 + 신규 3개 (세무/회계 사무소, 보험/계리, 금융공기업, __browse__)
renderMajorCards() 하단에 "아직 못 정했어요" 카드 추가 (점선 테두리, Step2 없이 바로 저장)
BROWSE_BUNDLE 상수 + renderBundleCards() / renderDashboard() — __browse__ 분기 처리
cert-detail.html
전체 레이아웃: max-w-5xl + PC 2컬럼 (md:grid-cols-[1fr_360px])
섹션 순서: 히어로 → AI분석 → 행정아코디언 → (우측) 일정·과목·교재
히어로에서 메타 그리드 제거 (주관기관/응시료/합격기준/시험방식), 설명텍스트 제거
행정아코디언 신규 (#adminAccordion): 주관기관·응시료·합격기준 + 과목구성·시험방식카드 포함, 접수버튼
일정섹션: 단일 <details> 아코디언으로 감싸고 내부 flat rows
js/detail.js
populateHero(): 직무배지열 제거, certDesc 제거, 행정 필드 제거
populateAdminInfo() 신규: 행정 필드 전담 (기존 hero에서 분리)
populateCommunityReviews(): 추천교재셀·합격영상목록 제거, 준비기간/난이도/핵심요약만 표시
populateSchedule(): 개별 <details> → flat rows 렌더링
렌더 순서: hero → AI분석 → 행정아코디언 → 일정 → 과목 → 교재
))