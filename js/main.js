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
let viewMode = 'list'; // 'list' | 'calendar' (모바일 전용)
let currentCalendarRange = { start: null, end: null };

// === 뷰 분기 유틸 ===
/** 768px 이하를 모바일로 판별 */
function isMobile() {
  return window.innerWidth <= 768;
}

/** 항상 그리드 뷰 사용 (리스트는 커스텀 아코디언으로 대체) */
function getCalendarView() {
  return 'dayGridMonth';
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
    setupViewToggle();
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
    // 이벤트 마운트 시 CSS 클래스 적용 (PC 이벤트에 필요)
    eventDidMount: (info) => {
      const type = info.event.extendedProps.eventType;
      if (type) info.el.classList.add(type);
    },
    // 모바일 dot 렌더링
    eventContent: (arg) => {
      if (arg.event.extendedProps.displayAsDot) {
        const colorClass = {
          'event-reg-start': 'fc-dot-event--green',
          'event-reg-end':   'fc-dot-event--red',
          'event-exam':      'fc-dot-event--blue',
        }[arg.event.extendedProps.eventType] || '';
        const dot = document.createElement('span');
        dot.className = `fc-dot-event ${colorClass}`;
        dot.setAttribute('title', arg.event.extendedProps.examName);
        return { domNodes: [dot] };
      }
      return true; // PC: 기본 텍스트 렌더링
    },
    // 월 이동 시 하단 리스트 갱신
    datesSet: (dateInfo) => {
      currentCalendarRange = {
        start: dateInfo.view.currentStart,
        end:   dateInfo.view.currentEnd,
      };
      renderMonthList();
    },
  });

  calendar.render();

  // 화면 회전 및 리사이즈 시 뷰 전환 (debounce 300ms)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (calendar) calendar.changeView(getCalendarView());
      renderEvents(); // 모바일↔PC 전환 시 이벤트 포맷 재렌더
      applyViewMode();
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

  // 아코디언 동기 업데이트 (모바일 리스트 모드일 때)
  if (isMobile() && viewMode === 'list') renderAccordion();
  renderMonthList(); // 필터 변경 시 하단 리스트 동기화
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
 * 시험 이벤트 생성
 * - 모바일: 접수마감일에 dot 하나만 (캘린더 단순화)
 * - PC: 기존 3개 이벤트(접수시작/마감/시험일) 그대로
 */
function createExamEvents(exam) {
  if (isMobile()) {
    const dots = [];
    if (exam.registration_start) dots.push({ start: exam.registration_start, eventType: 'event-reg-start' });
    if (exam.registration_end)   dots.push({ start: exam.registration_end,   eventType: 'event-reg-end'   });
    if (exam.exam_date)          dots.push({ start: exam.exam_date,          eventType: 'event-exam'      });
    return dots.map(d => ({
      title: exam.name,
      start: d.start,
      allDay: true,
      className: `${d.eventType} event-dot`,
      extendedProps: { examId: exam.id, examName: exam.name, eventType: d.eventType, displayAsDot: true },
    }));
  }

  // PC: 기존 3개 이벤트
  const displayName = exam.name;
  const events = [
    { title: `${EVENT_TYPES.REG_START.prefix} ${displayName}`, start: exam.registration_start, type: EVENT_TYPES.REG_START.className },
    { title: `${EVENT_TYPES.REG_END.prefix} ${displayName}`,   start: exam.registration_end,   type: EVENT_TYPES.REG_END.className   },
    { title: `${EVENT_TYPES.EXAM.prefix} ${displayName}`,      start: exam.exam_date,          type: EVENT_TYPES.EXAM.className      },
  ];
  return events.map(ev => ({
    title: ev.title,
    start: ev.start,
    allDay: true,
    extendedProps: { examId: exam.id, examName: exam.name, eventType: ev.type },
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

// === 뷰 토글 (모바일) ===
function setupViewToggle() {
  const btn = document.getElementById('viewToggleBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    viewMode = viewMode === 'list' ? 'calendar' : 'list';
    applyViewMode();
  });

  // 전체 자격증 목록 섹션 헤더 토글
  document.getElementById('accSectionHd')?.addEventListener('click', () => {
    document.getElementById('accSection')?.classList.toggle('open');
  });

  applyViewMode();
}

function applyViewMode() {
  const calWrap    = document.querySelector('.calendar-wrapper');
  const accSection = document.getElementById('accSection');
  const btn        = document.getElementById('viewToggleBtn');

  if (!isMobile()) {
    // PC: 항상 캘린더, 자격증 섹션 숨김, 토글 숨김
    viewMode = 'list'; // 모바일 재진입 시 리스트 기본값으로 초기화
    if (calWrap)    calWrap.style.display    = '';
    if (accSection) accSection.style.display = 'none';
    if (btn)        btn.style.display        = 'none';
    return;
  }

  if (btn) btn.style.display = 'flex';

  if (viewMode === 'list') {
    if (calWrap) calWrap.style.display = 'none';
    if (accSection) {
      accSection.style.display = 'block';
      renderAccordion();
    }
    updateToggleBtn('list');
    renderMonthList();
  } else {
    if (calWrap)    calWrap.style.display    = '';
    if (accSection) accSection.style.display = 'none';
    if (calendar) calendar.changeView('dayGridMonth');
    updateToggleBtn('calendar');
    renderMonthList();
  }
}

function updateToggleBtn(mode) {
  const icon  = document.getElementById('viewToggleIcon');
  const label = document.getElementById('viewToggleLbl');
  if (mode === 'list') {
    if (icon)  icon.textContent  = '📅';
    if (label) label.textContent = '캘린더';
  } else {
    if (icon)  icon.textContent  = '📋';
    if (label) label.textContent = '리스트';
  }
}

// === 아코디언 렌더링 ===
function renderAccordion() {
  const el = document.getElementById('accordionList');
  if (!el) return;

  const filtered = getFilteredExams();

  // 이름별 그룹화 (순서 유지)
  const groups = new Map();
  filtered.forEach(exam => {
    if (!groups.has(exam.name)) groups.set(exam.name, []);
    groups.get(exam.name).push(exam);
  });

  if (groups.size === 0) {
    el.innerHTML = '<div class="no-results"><div class="icon">🔍</div><p>해당하는 자격증이 없습니다.</p></div>';
    return;
  }

  const CAT_COLORS = {
    '회계/세무':   { bg: '#f3e8ff', color: '#6b21a8' },
    '금융/투자':   { bg: '#e0f2fe', color: '#0369a1' },
    '무역/물류':   { bg: '#fff7ed', color: '#c2410c' },
    '경영/컨설팅': { bg: '#fce7f3', color: '#9d174d' },
    '데이터':      { bg: '#d1fae5', color: '#065f46' },
  };

  const html = [...groups.entries()].map(([name, exams]) => {
    const infoId = NAME_TO_INFO_ID[name];
    const cat    = exams[0]?.category || '';
    const clr    = CAT_COLORS[cat] || { bg: '#f1f5f9', color: '#475569' };

    // 회차 묶기: 필기+실기 있는 경우 2개씩 1회차
    const isMulti = exams.some(e => e.stage !== '단일');
    const rounds  = [];
    if (isMulti) {
      for (let i = 0; i < exams.length; i += 2) rounds.push(exams.slice(i, i + 2));
    } else {
      exams.forEach(e => rounds.push([e]));
    }

    const roundsHtml = rounds.map((group, ri) => {
      const rows = group.map(e => {
        const stageTag = e.stage !== '단일'
          ? `<span class="acc-stage-tag ${e.stage === '필기' ? 'acc-stage--written' : 'acc-stage--practical'}">${e.stage}</span>`
          : '';
        return `<div class="acc-row">
          ${stageTag}
          <div class="acc-dates">
            <span class="acc-event"><span class="acc-dot acc-dot--reg"></span>접수 ${accFmtDate(e.registration_start)} ~ ${accFmtDate(e.registration_end)}</span>
            <span class="acc-event"><span class="acc-dot acc-dot--exam"></span>시험 ${accFmtDate(e.exam_date)}</span>
          </div>
        </div>`;
      }).join('');
      return `<div class="acc-round">
        <span class="acc-round-no">${ri + 1}회차</span>
        ${rows}
      </div>`;
    }).join('');

    const detailLink = infoId
      ? `<a href="detail.html#${infoId}" class="acc-detail-link">상세 정보 보기 →</a>`
      : '';

    return `<div class="accordion-item">
      <button class="accordion-hd" type="button">
        <div class="acc-hd-left">
          <span class="acc-name">${name}</span>
          <span class="acc-cat-badge" style="background:${clr.bg};color:${clr.color};">${cat}</span>
        </div>
        <div class="acc-hd-right">
          <span class="acc-rounds-count">${rounds.length}회차</span>
          <svg class="acc-chevron" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </div>
      </button>
      <div class="accordion-bd">
        ${roundsHtml}
        ${detailLink}
      </div>
    </div>`;
  }).join('');

  el.innerHTML = html;

  // 클릭 핸들러 (아코디언 토글)
  el.querySelectorAll('.accordion-hd').forEach(hd => {
    hd.addEventListener('click', () => {
      const item   = hd.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      el.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

function accFmtDate(str) {
  if (!str) return '-';
  const [, m, d] = str.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

// "2026-05-03" → "5월 3일"
function fmtMonthDay(str) {
  if (!str) return '';
  const [, m, d] = str.split('-');
  return `${parseInt(m)}월 ${parseInt(d)}일`;
}

// "2026-05-03" → "5/3 (일)"
function fmtFullDate(str) {
  if (!str) return '';
  const date = new Date(str);
  const day = ['일','월','화','수','목','금','토'][date.getDay()];
  return `${date.getMonth() + 1}/${date.getDate()} (${day})`;
}

// === 이번 달 접수 마감 리스트 (모바일 캘린더 모드 전용) ===
function renderMonthList() {
  const el = document.getElementById('monthList');
  if (!el) return;

  // 모바일에서만 표시
  if (!isMobile()) {
    el.style.display = 'none';
    return;
  }
  if (!allExams.length || !currentCalendarRange.start) {
    el.style.display = 'none';
    return;
  }
  el.style.display = '';

  const { start, end } = currentCalendarRange;
  const filtered = getFilteredExams();

  const monthExams = filtered
    .filter(e => e.registration_end &&
      new Date(e.registration_end) >= start &&
      new Date(e.registration_end) < end)
    .sort((a, b) => new Date(a.registration_end) - new Date(b.registration_end));

  if (monthExams.length === 0) {
    renderMonthListEmpty(el, filtered, end);
  } else {
    renderMonthListItems(el, monthExams);
  }
}

function renderMonthListItems(el, exams) {
  const rows = exams.map(exam => {
    const infoId = NAME_TO_INFO_ID[exam.name];
    const nameHtml = infoId
      ? `<a href="detail.html#${infoId}" class="month-list-link">${exam.name}</a>`
      : `<span class="month-list-link">${exam.name}</span>`;
    return `<li class="month-list-item">
      <span class="month-list-dot"></span>
      <span class="month-list-date">${fmtFullDate(exam.registration_end)}</span>
      ${nameHtml}
      <span class="month-list-cat">${exam.category}</span>
    </li>`;
  }).join('');

  el.innerHTML = `
    <div class="month-list-header">
      <span class="month-list-title">이번 달 접수 마감</span>
      <span class="month-list-count">${exams.length}개</span>
    </div>
    <ul class="month-list-ul">${rows}</ul>`;
}

function renderMonthListEmpty(el, allFiltered, afterDate) {
  const upcoming = allFiltered
    .filter(e => e.registration_end && new Date(e.registration_end) >= afterDate)
    .sort((a, b) => new Date(a.registration_end) - new Date(b.registration_end));

  let nextHtml = '';
  if (upcoming.length > 0) {
    const next = upcoming[0];
    const infoId = NAME_TO_INFO_ID[next.name];
    const href = infoId ? `detail.html#${infoId}` : '#';
    nextHtml = `<a href="${href}" class="month-list-next-link">다음 마감: ${fmtMonthDay(next.registration_end)} ${next.name} →</a>`;
  }

  el.innerHTML = `
    <div class="month-list-empty">
      <span class="month-list-empty-msg">이 달 마감 일정이 없습니다.</span>
      ${nextHtml}
    </div>`;
}

// === 직무별 큐레이션 ===
function setupCuration() {
  const section  = document.getElementById('curationSection');
  const toggle   = document.getElementById('curationToggle');
  const grid     = document.getElementById('curationGrid');
  const tabs     = document.getElementById('curationTabs');
  if (!section || !toggle || !grid || !tabs) return;

  const LEVEL_ORDER = ['입문', '핵심', '심화'];
  const LEVEL_CLS   = { '입문': 'entry', '핵심': 'core', '심화': 'adv' };
  const INFO_MAP    = {};
  if (examInfoData) examInfoData.forEach(e => { INFO_MAP[e.id] = e; });

  let activeCat = '데이터/IT';
  let rendered  = false;

  // 토글 (데이터 로딩 여부와 무관하게 먼저 등록)
  toggle.addEventListener('click', () => {
    const isOpen = section.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    if (isOpen && !rendered && cpData && examInfoData) {
      renderGrid(activeCat);
      rendered = true;
    }
  });

  if (!cpData || !examInfoData) return;

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
