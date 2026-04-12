/**
 * calendar.js — calendar.html page logic
 * Requires: data.js, ../js/favorites.js, FullCalendar CDN
 */

let calendar = null;
let allExams = [];
let activeCategory = '전체';
let searchKeyword  = '';
let currentCalendarRange = { start: null, end: null };

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allExams = await fetchJSON('../data/exams.json');
    initCalendar();
    renderEvents();
    navigateToNearestEvent();
    setupFilters();
    setupSearch();
  } catch (err) {
    console.error('캘린더 초기화 실패:', err);
    const calEl = document.getElementById('calendar');
    if (calEl) calEl.innerHTML = '<div class="text-on-surface-variant text-center py-8">데이터를 불러오는 데 실패했습니다.</div>';
  }
});

function isMobile() {
  return window.innerWidth <= 768;
}

function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'ko',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next today',
    },
    buttonText: { today: '오늘' },
    fixedWeekCount: false,
    dayMaxEvents: isMobile() ? 3 : 5,
    height: 'auto',
    eventClick: handleEventClick,
    eventDidMount: (info) => {
      const type = info.event.extendedProps.eventType;
      if (type) info.el.classList.add(type);
    },
    eventContent: (arg) => {
      if (arg.event.extendedProps.displayAsDot) {
        const colorMap = {
          'event-reg-start': '#2ecc71',
          'event-reg-end':   '#e74c3c',
          'event-exam':      '#3b82f6',
        };
        const color = colorMap[arg.event.extendedProps.eventType] || '#b8c3ff';
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:2px 0;';
        const dot = document.createElement('span');
        dot.style.cssText = `display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};`;
        dot.title = arg.event.extendedProps.examName;
        wrap.appendChild(dot);
        return { domNodes: [wrap] };
      }
      return true;
    },
    datesSet: (dateInfo) => {
      currentCalendarRange = {
        start: dateInfo.view.currentStart,
        end:   dateInfo.view.currentEnd,
      };
      renderScheduleList();
    },
  });

  calendar.render();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (calendar) calendar.changeView('dayGridMonth');
      renderEvents();
    }, 300);
  });
}

function getFilteredExams() {
  return allExams.filter(exam => {
    let catMatch;
    if (activeCategory === '전체')        catMatch = true;
    else if (activeCategory === '내 자격증') catMatch = isFavorite(exam.name);
    else                                  catMatch = exam.category === activeCategory;

    const keyword     = searchKeyword.trim().toLowerCase();
    const searchMatch = !keyword || exam.name.toLowerCase().includes(keyword);
    return catMatch && searchMatch;
  });
}

function renderEvents() {
  if (!calendar) return;
  calendar.removeAllEvents();
  const events = getFilteredExams().flatMap(exam => createExamEvents(exam));
  calendar.addEventSource(events);
  renderScheduleList();
}

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
      extendedProps: { examId: exam.id, examName: exam.name, eventType: d.eventType, displayAsDot: true },
    }));
  }
  return [
    { title: `• ${exam.name}`, start: exam.registration_start, type: 'event-reg-start' },
    { title: `• ${exam.name}`, start: exam.registration_end,   type: 'event-reg-end'   },
    { title: `• ${exam.name}`, start: exam.exam_date,          type: 'event-exam'      },
  ].filter(ev => ev.start).map(ev => ({
    title: ev.title,
    start: ev.start,
    allDay: true,
    extendedProps: { examId: exam.id, examName: exam.name, eventType: ev.type },
  }));
}

function handleEventClick(info) {
  info.jsEvent.preventDefault();
  const examName = info.event.extendedProps.examName;
  const infoId   = NAME_TO_INFO_ID[examName];
  if (infoId) window.location.href = `cert-detail.html#${infoId}`;
}

function navigateToNearestEvent() {
  if (!calendar || !allExams.length) return;
  const today = new Date();
  const allDates = allExams
    .flatMap(e => [e.registration_start, e.registration_end, e.exam_date, e.result_date])
    .filter(Boolean)
    .map(d => new Date(d + 'T00:00:00'))
    .sort((a, b) => a - b);
  if (!allDates.length) return;
  const futureDate = allDates.find(d => d >= today);
  calendar.gotoDate(futureDate || allDates[allDates.length - 1]);
}

function renderScheduleList() {
  const container = document.getElementById('scheduleList');
  if (!container) return;

  const today    = new Date();
  today.setHours(0, 0, 0, 0);

  const rangeStart = currentCalendarRange.start ? new Date(currentCalendarRange.start) : today;
  const rangeEnd   = currentCalendarRange.end   ? new Date(currentCalendarRange.end)   : new Date(today.getTime() + 31 * 86400000);

  const events = [];
  getFilteredExams().forEach(exam => {
    const addIfInRange = (dateStr, type, label) => {
      if (!dateStr) return;
      const d = new Date(dateStr + 'T00:00:00');
      if (d >= rangeStart && d < rangeEnd) {
        events.push({ exam, date: d, dateStr, type, label });
      }
    };
    addIfInRange(exam.registration_start, 'open',     '접수 시작');
    addIfInRange(exam.registration_end,   'deadline', '접수 마감');
    addIfInRange(exam.exam_date,          'exam',     '시험일');
  });

  events.sort((a, b) => a.date - b.date);

  // Update section title with current month
  const titleEl = document.getElementById('scheduleListTitle');
  if (titleEl && currentCalendarRange.start) {
    const d = new Date(currentCalendarRange.start);
    titleEl.textContent = `${d.getFullYear()}년 ${d.getMonth() + 1}월 일정`;
  }

  if (!events.length) {
    container.innerHTML = '<p class="text-[#8e90a2] text-sm px-2 py-4">이 기간에 일정이 없습니다.</p>';
    return;
  }

  const DOT_COLOR = { open: '#2ecc71', deadline: '#e74c3c', exam: '#3b82f6' };
  const LABEL_TEXT = { open: '접수 시작', deadline: '접수 마감', exam: '시험일' };

  const rows = events.slice(0, 20);
  container.innerHTML = rows.map(({ exam, dateStr, type }, i) => {
    const dd       = dDay(dateStr);
    const infoId   = NAME_TO_INFO_ID[exam.name];
    const href     = infoId ? `cert-detail.html#${infoId}` : '#';
    const isUrgent = dd === 'D-DAY' || (dd && parseInt(dd.replace('D-', '')) <= 7);
    const ddColor  = isUrgent ? '#ffb4ab' : '#8e90a2';
    const isLast   = i === rows.length - 1;
    const dot      = DOT_COLOR[type] || '#b8c3ff';
    const lbl      = LABEL_TEXT[type] || '';

    return `<div class="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer${isLast ? '' : ' mb-0.5'}" onclick="location.href='${href}'">
      <div class="flex items-center gap-3 min-w-0">
        <span class="w-2 h-2 rounded-full flex-shrink-0" style="background:${dot}"></span>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-[#e2e2e2] leading-snug truncate">${exam.name}</p>
          <p class="text-[10px] text-[#8e90a2] mt-0.5">${lbl} · ${fmtFullDate(dateStr)}</p>
        </div>
      </div>
      <span class="font-bold text-xs whitespace-nowrap ml-3 tabular-nums flex-shrink-0" style="color:${ddColor}">${dd || '완료'}</span>
    </div>`;
  }).join('');
}

function setupFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;

  const categories = ['전체', '내 자격증', '데이터/IT', '회계/세무', '금융/투자', '무역/물류', '인사/컨설팅', '공용'];

  container.innerHTML = categories.map(cat => {
    const isActive = cat === activeCategory;
    return `<button class="filter-chip flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-primary-container text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}" data-cat="${cat}">${cat}</button>`;
  }).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    container.querySelectorAll('.filter-chip').forEach(b => {
      b.className = b.className
        .replace('bg-primary-container text-white', '')
        .replace('bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest', '')
        .trim() + ' bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest';
    });
    btn.className = btn.className
      .replace('bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest', '')
      .trim() + ' bg-primary-container text-white';
    activeCategory = btn.dataset.cat;
    renderEvents();
  });
}

function setupSearch() {
  const input    = document.getElementById('calendarSearch');
  const dropdown = document.getElementById('calendarSearchDropdown');
  if (!input) return;

  const uniqueExams = Object.keys(NAME_TO_INFO_ID);
  let debounceTimer = null;

  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchKeyword = e.target.value;
      renderEvents();
    }, 300);

    if (!dropdown) return;
    const val = e.target.value.trim().toLowerCase();
    dropdown.innerHTML = '';
    if (!val) { dropdown.classList.add('hidden'); return; }
    const matches = uniqueExams.filter(n => n.toLowerCase().includes(val));
    if (matches.length) {
      dropdown.classList.remove('hidden');
      matches.slice(0, 8).forEach(match => {
        const li = document.createElement('li');
        li.textContent = match;
        li.className = 'px-4 py-2.5 cursor-pointer hover:bg-surface-container-highest text-on-surface text-sm';
        li.addEventListener('mousedown', (ev) => {
          ev.preventDefault();
          const id = NAME_TO_INFO_ID[match];
          if (id) window.location.href = `cert-detail.html#${id}`;
        });
        dropdown.appendChild(li);
      });
    } else {
      dropdown.classList.add('hidden');
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { if (dropdown) dropdown.classList.add('hidden'); }, 200);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val   = input.value.trim().toLowerCase();
      const match = uniqueExams.find(n => n.toLowerCase().includes(val));
      if (match) {
        const id = NAME_TO_INFO_ID[match];
        if (id) window.location.href = `cert-detail.html#${id}`;
      }
    }
  });
}
