/**
 * main.js - 상경계 자격증 캘린더 메인 로직
 * 
 * FullCalendar 렌더링, 필터링, 검색 기능 담당
 */

// === 상수 ===
const EVENT_TYPES = {
  REG_START: { label: '접수시작', className: 'event-reg-start', prefix: '•' },
  REG_END:   { label: '접수마감', className: 'event-reg-end',   prefix: '•' },
  EXAM:      { label: '시험일',   className: 'event-exam',      prefix: '•' },
};

// 자격증 이름에서 상세페이지 ID 매핑 (exam_info의 id 기준)
const NAME_TO_INFO_ID = {
  // 캘린더 등록 17개
  'SQLD': 'sqld',
  '빅데이터분석기사': 'bigdata',
  '재경관리사': 'at-manager',
  '회계관리': 'at-accounting',
  'TAT/FAT': 'tat-fat',
  'ERP정보관리사': 'erp-info',
  '증권투자자권유자문인력': 'kofia-adv',
  '증권투자권유대행인': 'kofia-rep',
  '투자자산운용사': 'kofia-im',
  '금융투자분석사': 'kofia-fa',
  '재무위험관리사': 'kofia-frm',
  '물류관리사': 'lom-30',
  '유통관리사': 'distributor',
  '사회조사분석사2급': 'sa-2',
  'ADsP': 'adsp',
  '전산세무회계': 'tax-accounting',
  '경영지도사': 'mca',
  // 미등록 20개 (검색만 지원)
  '컴퓨터활용능력 2급': '컴활2급',
  '컴퓨터활용능력 1급': '컴활1급',
  '전산회계 1급': '전산회계1급',
  '데이터분석전문가(DAP)': 'dap',
  '데이터아키텍처전문가(ADP)': 'adp',
  '펀드투자권유자문인력': '펀드투자',
  '신용분석사': '신용분석사',
  '외환관리사': '외환관리사',
  '투자위험관리사': '투자위험관리사',
  'AFPK': 'afpk',
  'CFP': 'cfp',
  'CFA 1차': 'cfa1',
  'FRM': 'frm',
  'USCPA': 'uscpa',
  '무역영어 1급': '무역영어1급',
  '국제무역사': '국제무역사',
  '보세사': '보세사',
  'SCM(공급망관리) 자격': 'scm',
  '경영분석사': '경영분석사',
  'PMP': 'pmp',
};

// === 전역 상태 ===
let calendar = null;
let allExams = [];
let activeCategory = '전체';
let searchKeyword = '';
let cpData = null;
let examInfoData = null;

// === 뷰 분기 유틸 ===
/** 768px 이하를 모바일로 판별 */
function isMobile() {
  return window.innerWidth <= 768;
}

/** 화면 크기에 따라 적절한 FullCalendar 뷰 이름 반환 */
function getCalendarView() {
  return isMobile() ? 'listMonth' : 'dayGridMonth';
}

// === 초기화 ===
document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    [allExams, cpData, examInfoData] = await Promise.all([
      fetchJSON('./data/exams.json'),
      fetchJSON('./data/career_path.json'),
      fetchJSON('./data/exam_info.json'),
    ]);
    initCalendar();
    setupFilters();
    setupSearch();
    renderEvents();
    navigateToNearestEvent();
    setupCuration();
  } catch (err) {
    console.error('초기화 실패:', err);
    showError('데이터를 불러오는 데 실패했습니다.');
  }
}

/**
 * 오늘 날짜에 가장 가까운 이벤트가 있는 월로 캘린더 이동
 * - 미래 이벤트가 있으면 가장 가까운 미래 이벤트 월로
 * - 없으면 가장 최근 과거 이벤트 월로
 */
function navigateToNearestEvent() {
  if (!calendar || allExams.length === 0) return;

  const today = new Date();
  const allDates = allExams.flatMap(exam => [
    exam.registration_start,
    exam.registration_end,
    exam.exam_date,
    exam.result_date,
  ]).filter(Boolean).map(d => new Date(d)).sort((a, b) => a - b);

  if (allDates.length === 0) return;

  // 오늘 이후의 가장 가까운 날짜 찾기
  const futureDate = allDates.find(d => d >= today);
  // 없으면 가장 마지막(최근) 날짜 사용
  const targetDate = futureDate || allDates[allDates.length - 1];

  calendar.gotoDate(targetDate);
}

// === 데이터 로드 ===
async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  return res.json();
}

// === 캘린더 초기화 ===
function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: getCalendarView(),
    locale: 'ko',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next today',
    },
    buttonText: {
      today: '오늘',
    },
    fixedWeekCount: false,
    dayMaxEvents: 5,
    height: 'auto',
    // 이벤트 클릭 → 상세 페이지 이동
    eventClick: handleEventClick,
    // 이벤트 마운트 시 CSS 클래스 적용
    eventDidMount: (info) => {
      const type = info.event.extendedProps.eventType;
      if (type) {
        info.el.classList.add(type);
      }
    },
  });

  calendar.render();

  // 화면 회전 및 리사이즈 시 뷰 전환 (debounce 300ms)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (calendar) {
        calendar.changeView(getCalendarView());
      }
    }, 300);
  });
}

// === 이벤트 렌더링 ===
function renderEvents() {
  if (!calendar) return;

  // 기존 이벤트를 반복문이 아닌 일괄 API로 제거 (성능 핵심)
  calendar.removeAllEvents();

  const filtered = getFilteredExams();
  const allEventsArray = [];

  // 캘린더에 바로 넣지 않고, 이벤트 배열을 전부 먼저 모음
  filtered.forEach(exam => {
    allEventsArray.push(...createExamEvents(exam));
  });

  // 한 번의 호출로 모든 이벤트를 캘린더 소스에 통째로 렌더링
  calendar.addEventSource(allEventsArray);
}

/**
 * 필터(카테고리 + 검색어) 적용된 시험 목록 반환
 */
function getFilteredExams() {
  return allExams.filter(exam => {
    // 카테고리 필터
    const catMatch = activeCategory === '전체' || exam.category === activeCategory;
    // 검색어 필터
    const keyword = searchKeyword.trim().toLowerCase();
    const searchMatch = !keyword || exam.name.toLowerCase().includes(keyword);
    return catMatch && searchMatch;
  });
}

/**
 * 하나의 시험에서 4개 이벤트(접수시작/마감/시험/발표) 데이터 생성 후 배열로 반환
 */
function createExamEvents(exam) {
  const displayName = exam.name;

  const events = [
    {
      title: `${EVENT_TYPES.REG_START.prefix} ${displayName}`,
      start: exam.registration_start,
      className: EVENT_TYPES.REG_START.className,
      type: EVENT_TYPES.REG_START.className,
    },
    {
      title: `${EVENT_TYPES.REG_END.prefix} ${displayName}`,
      start: exam.registration_end,
      className: EVENT_TYPES.REG_END.className,
      type: EVENT_TYPES.REG_END.className,
    },
    {
      title: `${EVENT_TYPES.EXAM.prefix} ${displayName}`,
      start: exam.exam_date,
      className: EVENT_TYPES.EXAM.className,
      type: EVENT_TYPES.EXAM.className,
    },
  ];

  return events.map(ev => ({
    title: ev.title,
    start: ev.start,
    allDay: true,
    extendedProps: {
      examId: exam.id,
      examName: exam.name,
      eventType: ev.type,
    },
  }));
}

// === 이벤트 클릭 핸들러 ===
function handleEventClick(info) {
  info.jsEvent.preventDefault();
  const examName = info.event.extendedProps.examName;
  const infoId = NAME_TO_INFO_ID[examName];

  if (infoId) {
    window.location.href = `detail.html#${infoId}`;
  }
}

// === 필터 버튼 ===
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 활성 상태 토글
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.dataset.cat;
      renderEvents();
    });
  });
}

// === 검색 ===
function setupSearch() {
  const uniqueExams = Object.keys(NAME_TO_INFO_ID);

  /**
   * 검색 인풋 하나에 드롭다운 + 캘린더 필터링 로직을 바인딩.
   * PC 헤더 검색창과 모바일 배너 검색창 두 곳에 재사용.
   *
   * @param {HTMLInputElement} input
   * @param {HTMLUListElement} dropdown
   * @param {boolean} syncCalendar - true면 캘린더 이벤트 필터도 동기화
   */
  function bindSearchInput(input, dropdown, syncCalendar) {
    if (!input) return;

    let currentFocusIndex = -1;
    let debounceTimer = null;

    function closeDropdown() {
      if (dropdown) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
      }
      currentFocusIndex = -1;
    }

    function updateFocus(items) {
      items.forEach(el => el.classList.remove('active'));
      if (currentFocusIndex > -1 && currentFocusIndex < items.length) {
        items[currentFocusIndex].classList.add('active');
      }
    }

    input.addEventListener('input', (e) => {
      // 캘린더 필터 동기화 (헤더 검색창만)
      if (syncCalendar) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchKeyword = e.target.value;
          renderEvents();
        }, 300);
      }

      if (!dropdown) return;
      const val = e.target.value.trim().toLowerCase();
      dropdown.innerHTML = '';
      currentFocusIndex = -1;

      if (!val) { closeDropdown(); return; }

      const matches = uniqueExams.filter(name => name.toLowerCase().includes(val));

      if (matches.length > 0) {
        dropdown.classList.remove('hidden');
        matches.forEach((match) => {
          const li = document.createElement('li');
          li.textContent = match;
          li.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            window.location.href = `detail.html#${NAME_TO_INFO_ID[match]}`;
          });
          dropdown.appendChild(li);
        });
      } else {
        closeDropdown();
      }
    });

    input.addEventListener('keydown', (e) => {
      const isDropdownHidden = !dropdown || dropdown.classList.contains('hidden');

      if (isDropdownHidden) {
        if (e.key === 'Enter') {
          const val = input.value.trim().toLowerCase();
          const match = uniqueExams.find(n => n.toLowerCase() === val || n.toLowerCase().includes(val));
          if (match) window.location.href = `detail.html#${NAME_TO_INFO_ID[match]}`;
        }
        return;
      }

      const items = dropdown.querySelectorAll('li');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocusIndex = (currentFocusIndex + 1) % items.length;
        updateFocus(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocusIndex = (currentFocusIndex - 1 + items.length) % items.length;
        updateFocus(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocusIndex > -1) {
          items[currentFocusIndex].dispatchEvent(new MouseEvent('mousedown'));
        } else {
          // 하이라이트가 없어도 첫 번째 항목으로 바로 이동
          items[0].dispatchEvent(new MouseEvent('mousedown'));
        }
      }
    });

    // 검색창 바깥을 누를 때 닫기
    input.addEventListener('blur', () => {
      closeDropdown();
    });
  }

  // PC 헤더 검색창 (캘린더 필터 동기화 O)
  bindSearchInput(
    document.getElementById('searchInput'),
    document.getElementById('searchDropdown'),
    true
  );

  // 모바일 배너 검색창 (캘린더 필터 동기화 X - 세부 페이지 이동 전용)
  bindSearchInput(
    document.getElementById('mobileSearchInput'),
    document.getElementById('mobileSearchDropdown'),
    false
  );
}

// === 직무별 큐레이션 ===
function setupCuration() {
  const section  = document.getElementById('curationSection');
  const toggle   = document.getElementById('curationToggle');
  const grid     = document.getElementById('curationGrid');
  const tabs     = document.getElementById('curationTabs');
  if (!section || !toggle || !grid || !tabs || !cpData || !examInfoData) return;

  const LEVEL_ORDER = ['입문', '핵심', '심화'];
  const LEVEL_CLS   = { '입문': 'entry', '핵심': 'core', '심화': 'adv' };
  const INFO_MAP    = {};
  examInfoData.forEach(e => { INFO_MAP[e.id] = e; });

  let activeCat = '데이터/IT';
  let rendered  = false;

  // 토글
  toggle.addEventListener('click', () => {
    const isOpen = section.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    if (isOpen && !rendered) {
      renderGrid(activeCat);
      rendered = true;
    }
  });

  function renderGrid(cat) {
    const certs = cpData.certs.filter(c => c.category.includes(cat));
    const cols = LEVEL_ORDER.map(level => {
      const items = certs.filter(c => c.level === level);
      const cards = items.map(c => {
        const info = INFO_MAP[c.id];
        const hasDetail = !!info;
        const tag = hasDetail ? 'a' : 'div';
        const href = hasDetail ? ` href="detail.html#${c.id}"` : '';
        const desc = info && info.description
          ? `<div class="curation-card-desc">${info.description}</div>`
          : '';
        return `<${tag}${href} class="curation-card${hasDetail ? '' : ' curation-card--no-link'}">
          <div class="curation-card-name">${c.name}</div>
          ${desc}
        </${tag}>`;
      }).join('');

      return `<div class="curation-col">
        <div class="curation-col-header curation-col-header--${LEVEL_CLS[level]}">${level}</div>
        ${cards || '<div style="font-size:12px;color:var(--clr-text-sub);">해당 없음</div>'}
      </div>`;
    }).join('');

    grid.innerHTML = cols;
  }

  tabs.addEventListener('click', e => {
    const tab = e.target.closest('.curation-tab');
    if (!tab) return;
    tabs.querySelectorAll('.curation-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCat = tab.dataset.cat;
    renderGrid(activeCat);
  });
}

// === 에러 표시 ===
function showError(message) {
  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    calendarEl.innerHTML = `
      <div class="no-results">
        <div class="icon">⚠️</div>
        <p>${message}</p>
      </div>
    `;
  }
}
