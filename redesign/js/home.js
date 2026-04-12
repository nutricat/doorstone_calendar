/**
 * home.js — new_index.html page logic
 * Requires: data.js loaded first, ../js/favorites.js loaded first
 */

const TRACK_STORAGE_KEY = 'home_selected_track';
const TRACKS = ['데이터/IT', '회계/세무', '금융/투자', '무역/물류', '인사/컨설팅', '공용'];

let _allExams   = [];
let _careerCerts = [];  // career_path.json .certs
let _examInfoMap = {};  // id → exam_info record

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [allExams, careerPath, examInfoList] = await Promise.all([
      fetchJSON('../data/exams.json'),
      fetchJSON('../data/career_path.json'),
      fetchJSON('../data/exam_info.json'),
    ]);
    _allExams    = allExams;
    _careerCerts = careerPath.certs;
    _examInfoMap = Object.fromEntries(examInfoList.map(e => [e.id, e]));

    renderTrackChips();
    renderFeaturedCard();
    renderStudyTimeline();
    renderBentoFavCount();
    renderRoadmap();
    renderPassRate();
    renderDeadlineList();
    setupNavLinks();
  } catch (err) {
    console.error('홈 페이지 초기화 실패:', err);
  }
});

// ── Track selection ──────────────────────────────────────────────────────────

function getSelectedTrack() {
  return localStorage.getItem(TRACK_STORAGE_KEY) || TRACKS[0];
}

function setSelectedTrack(track) {
  localStorage.setItem(TRACK_STORAGE_KEY, track);
}

window.selectTrack = function (track) {
  setSelectedTrack(track);
  renderTrackChips();
  renderFeaturedCard();
  renderStudyTimeline();
  renderRoadmap();
  renderPassRate();
  renderDeadlineList();
};

// ── Track chips ──────────────────────────────────────────────────────────────

function renderTrackChips() {
  const row = document.getElementById('trackChipRow');
  if (!row) return;
  const selected = getSelectedTrack();
  row.innerHTML = TRACKS.map(track => {
    const icon     = getCategoryIcon(track);
    const isActive = track === selected;
    return `<button
      onclick="selectTrack('${track}')"
      class="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-colors ${isActive ? 'bg-[#2d5bff] text-white' : 'bg-[#1b1b1b] text-[#c4c5d9] hover:bg-[#252525]'}"
    ><span class="material-symbols-outlined" style="font-size:14px;">${icon}</span>${track}</button>`;
  }).join('');
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getUpcomingExamsSortedByExamDate(exams) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return exams
    .filter(e => e.exam_date && new Date(e.exam_date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
}

/** Returns the exam name used in exams.json for a given career_path cert id */
function certNameFromId(id) {
  return INFO_ID_TO_NAME[id] || null;
}

/** Returns upcoming exam records for a career_path cert (by cert.id) */
function upcomingExamsForCert(certId) {
  const name = certNameFromId(certId);
  if (!name) return [];
  return getUpcomingExamsSortedByExamDate(_allExams.filter(e => e.name === name));
}

/** Converts difficulty label to star string */
function difficultyStars(diff) {
  if (diff === '하') return '★☆☆';
  if (diff === '중') return '★★☆';
  if (diff === '상') return '★★★';
  return '';
}

/** Extracts the first duration value (e.g. "5~7주") from a study_time string */
function shortStudyTime(studyTime) {
  if (!studyTime) return null;
  const match = studyTime.match(/(\d+[~\-]\d+[주월시간]|\d+[주월시간])/);
  return match ? match[1] : null;
}

/**
 * For a given track, find the best "featured" cert+exam.
 * Priority: 입문 first, then 핵심, then 심화.
 * Among same level, pick the soonest upcoming exam.
 */
function pickFeaturedForTrack(track) {
  for (const level of ['핵심']) {
    const certs = _careerCerts.filter(c => c.category.includes(track) && c.level === level);
    let bestCert = null;
    let bestExam = null;
    for (const cert of certs) {
      const upcoming = upcomingExamsForCert(cert.id);
      if (upcoming.length) {
        if (!bestExam || new Date(upcoming[0].exam_date) < new Date(bestExam.exam_date)) {
          bestCert = cert;
          bestExam = upcoming[0];
        }
      }
    }
    if (bestCert) return { cert: bestCert, exam: bestExam };
  }
  return null;
}

/**
 * Returns all exams whose cert belongs to the given track.
 */
function trackExams(track) {
  const trackCertNames = new Set(
    _careerCerts
      .filter(c => c.category.includes(track))
      .map(c => certNameFromId(c.id))
      .filter(Boolean)
  );
  return _allExams.filter(e => trackCertNames.has(e.name));
}

// ── Render functions ─────────────────────────────────────────────────────────

function renderFeaturedCard() {
  const track   = getSelectedTrack();
  const result  = pickFeaturedForTrack(track);

  const nameEl  = document.getElementById('featuredName');
  const subEl   = document.getElementById('featuredSub');
  const catEl   = document.getElementById('featuredCat');
  const btn     = document.getElementById('featuredLink');
  const ddayEl  = document.getElementById('featuredDDay');

  if (!result) {
    // Global fallback if no track-matching exam found
    const upcoming = getUpcomingExamsSortedByExamDate(_allExams);
    if (!upcoming.length) return;
    const exam   = upcoming[0];
    const infoId = NAME_TO_INFO_ID[exam.name];
    if (nameEl) nameEl.textContent = exam.name;
    if (subEl)  subEl.textContent  = `${fmtMonthDay(exam.exam_date)} 시험 예정`;
    if (catEl)  catEl.textContent  = exam.category || track;
    if (ddayEl) ddayEl.textContent = dDay(exam.exam_date) || '';
    if (btn && infoId) btn.onclick = (e) => { e.stopPropagation(); window.location.href = `cert-detail.html#${infoId}`; };
    return;
  }

  const { cert, exam } = result;
  const info            = _examInfoMap[cert.id];
  const examName        = certNameFromId(cert.id) || cert.name;

  if (nameEl) nameEl.textContent = examName;
  if (catEl)  catEl.textContent  = `${track} ${cert.level}`;
  if (ddayEl) ddayEl.textContent = dDay(exam.exam_date) || '';

  if (subEl) {
    const parts = [];
    const st = shortStudyTime(info?.study_time);
    if (st)              parts.push(`준비기간 ${st}`);
    if (info?.difficulty) parts.push(`난이도 ${difficultyStars(info.difficulty)}`);
    subEl.textContent = parts.length ? parts.join(' · ') : `${fmtMonthDay(exam.exam_date)} 시험 예정`;
  }

  if (btn) btn.onclick = (e) => { e.stopPropagation(); window.location.href = `cert-detail.html#${cert.id}`; };
}


function renderBentoFavCount() {
  const favs    = getFavorites();
  const countEl = document.getElementById('favCount');
  const subEl   = document.getElementById('favCountSub');

  if (countEl) countEl.textContent = `${favs.length}개`;
  if (subEl) {
    subEl.textContent = favs.length > 0
      ? `관심 자격증 ${favs.length}개 등록됨`
      : '아직 관심 자격증이 없습니다';
  }
}

// ── Study Timeline ───────────────────────────────────────────────────────────

/** Parses study_time string to max weeks (e.g. "5~7주" → 7, "2~4개월" → 16) */
function parseStudyWeeks(studyTime) {
  if (!studyTime) return null;
  const part = studyTime.split('/')[0];
  const nums = part.match(/\d+/g);
  if (!nums) return null;
  const max = Math.max(...nums.map(Number));
  if (part.includes('개월')) return max * 4;
  if (part.includes('시간')) return Math.ceil(max / 40);
  return max; // assume 주
}

function renderStudyTimeline() {
  const section   = document.getElementById('studyTimelineSection');
  const container = document.getElementById('studyTimelineContent');
  if (!section || !container) return;

  const track  = getSelectedTrack();
  const result = pickFeaturedForTrack(track);

  if (!result) { section.style.display = 'none'; return; }
  section.style.display = '';

  const { cert, exam } = result;
  const info     = _examInfoMap[cert.id];
  const weeks    = parseStudyWeeks(info?.study_time);

  if (!weeks) { section.style.display = 'none'; return; }

  const today        = new Date(); today.setHours(0, 0, 0, 0);
  const examDate     = new Date(exam.exam_date + 'T00:00:00');
  const daysLeft     = Math.round((examDate - today) / (1000 * 60 * 60 * 24));
  const daysNeeded   = weeks * 7;
  const slack        = daysLeft - daysNeeded;
  const slackWeeks   = Math.floor(Math.abs(slack) / 7);
  const stShort      = shortStudyTime(info.study_time) || `${weeks}주`;
  const examDateStr  = fmtMonthDay(exam.exam_date);
  const certName     = certNameFromId(cert.id) || cert.name;

  let msg, color, icon;
  if (slack >= 14) {
    msg   = `여유 있게 준비할 수 있어요 (여유 약 ${slackWeeks}주)`;
    color = '#b8c3ff'; icon = 'check_circle';
  } else if (slack >= 0) {
    msg   = '빠듯하지만 충분히 도전 가능해요';
    color = '#ffb59b'; icon = 'bolt';
  } else {
    msg   = '이번 회차는 빠듯해요 — 다음 회차를 노려보세요';
    color = '#ffb4ab'; icon = 'warning';
  }

  container.innerHTML = `
    <p class="text-[10px] text-[#8e90a2] mb-2">${certName} 기준</p>
    <div class="flex items-center gap-1.5 flex-wrap mb-3">
      <span class="px-2.5 py-1 bg-[#2d5bff]/20 text-[#b8c3ff] rounded-full text-xs font-bold">오늘</span>
      <span class="material-symbols-outlined text-[#434656]" style="font-size:14px;">arrow_forward</span>
      <span class="px-2.5 py-1 bg-white/5 text-[#c4c5d9] rounded-full text-xs">${stShort} 준비</span>
      <span class="material-symbols-outlined text-[#434656]" style="font-size:14px;">arrow_forward</span>
      <span class="px-2.5 py-1 bg-white/5 text-[#c4c5d9] rounded-full text-xs font-bold">${examDateStr} 시험</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="material-symbols-outlined flex-shrink-0" style="font-size:14px;color:${color};">${icon}</span>
      <p class="text-xs leading-snug" style="color:${color};">${msg}</p>
    </div>`;
}

// ── Track Roadmap ────────────────────────────────────────────────────────────

function renderRoadmap() {
  const container = document.getElementById('roadmapContent');
  const titleEl   = document.getElementById('roadmapTitle');
  if (!container) return;

  const track = getSelectedTrack();
  if (titleEl) titleEl.textContent = `${track} 로드맵`;

  // 공용 track uses subject-based grouping instead of level-based
  if (track === '공용') {
    const SUBGROUPS = ['데이터', '영어', '어문'];
    const SUBGROUP_META = {
      '데이터': { color: '#60a5fa', desc: '사무·데이터 기본기' },
      '영어':   { color: '#4ade80', desc: '글로벌 커뮤니케이션 역량' },
      '어문':   { color: '#c084fc', desc: '국어·한자 기초 소양' },
    };
    const grouped = Object.fromEntries(
      SUBGROUPS.map(sg => [sg, _careerCerts.filter(c => c.category.includes(track) && c.subgroup === sg)])
    );
    container.innerHTML = SUBGROUPS.map((sg, i) => {
      const certs = grouped[sg];
      if (!certs.length) return '';
      const { color, desc } = SUBGROUP_META[sg];
      const chips = certs.map(cert => {
        const name = certNameFromId(cert.id) || cert.name;
        return `<a href="cert-detail.html#${cert.id}" onclick="event.stopPropagation()"
          class="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-[#c4c5d9] hover:bg-[#2d5bff]/20 hover:text-[#b8c3ff] transition-colors whitespace-nowrap">${name}</a>`;
      }).join('');
      const hasNext = SUBGROUPS.slice(i + 1).some(s => grouped[s]?.length);
      const arrow = hasNext ? `<div class="my-1 pl-0.5"><div class="w-px h-4 bg-[#434656] ml-0.5"></div></div>` : '';
      return `<div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:${color}"></span>
          <span class="text-[11px] font-bold" style="color:${color}">${sg}</span>
        </div>
        <p class="text-[10px] text-[#434656] mb-2 pl-3.5">${desc}</p>
        <div class="flex flex-wrap gap-2">${chips}</div>
      </div>${arrow}`;
    }).join('');
    return;
  }

  const LEVELS = ['입문', '핵심', '심화'];

  const grouped = Object.fromEntries(
    LEVELS.map(lv => [lv, _careerCerts.filter(c => c.category.includes(track) && c.level === lv)])
  );

  container.innerHTML = LEVELS.map((lv, i) => {
    const certs = grouped[lv];
    if (!certs.length) return '';

    const { label, desc, color, badge } = LEVEL_META[lv];

    const chips = certs.map(cert => {
      const name = certNameFromId(cert.id) || cert.name;
      return `<a href="cert-detail.html#${cert.id}" onclick="event.stopPropagation()"
        class="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-[#c4c5d9] hover:bg-[#2d5bff]/20 hover:text-[#b8c3ff] transition-colors whitespace-nowrap">${name}</a>`;
    }).join('');

    const arrow = i < LEVELS.length - 1 && grouped[LEVELS[i + 1]]?.length
      ? `<div class="my-1 pl-0.5"><div class="w-px h-4 bg-[#434656] ml-0.5"></div></div>`
      : '';

    const badgeHtml = badge
      ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide" style="background:${color}22;color:${color}">⭐ ${badge}</span>`
      : '';

    return `<div>
      <div class="flex items-center gap-2 mb-1">
        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="background:${color}"></span>
        <span class="text-[11px] font-bold" style="color:${color}">${label}</span>
        ${badgeHtml}
      </div>
      <p class="text-[10px] text-[#434656] mb-2 pl-3.5">${desc}</p>
      <div class="flex flex-wrap gap-2">${chips}</div>
    </div>${arrow}`;
  }).join('');
}

// ── Pass Rate ────────────────────────────────────────────────────────────────

function renderPassRate() {
  const container = document.getElementById('passRateContent');
  const labelEl   = document.getElementById('passRateTrackLabel');
  if (!container) return;

  const track = getSelectedTrack();
  if (labelEl) labelEl.textContent = track;

  const items = _careerCerts
    .filter(c => c.category.includes(track))
    .map(cert => ({ cert, info: _examInfoMap[cert.id], name: certNameFromId(cert.id) || cert.name }))
    .filter(x => x.info?.pass_rate != null)
    .sort((a, b) => b.info.pass_rate - a.info.pass_rate)
    .slice(0, 6);

  if (!items.length) {
    container.innerHTML = '<p class="text-[#8e90a2] text-sm px-2 py-3">합격률 데이터가 없습니다.</p>';
    return;
  }

  const LEVEL_COLOR = Object.fromEntries(Object.entries(LEVEL_META).map(([k, v]) => [k, v.color]));

  container.innerHTML = items.map((x, i) => {
    const rate    = x.info.pass_rate;
    const isLast  = i === items.length - 1;
    const lColor  = LEVEL_COLOR[x.cert.level] || '#8e90a2';
    return `<div class="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer${isLast ? '' : ' mb-0.5'}"
      onclick="location.href='cert-detail.html#${x.cert.id}'">
      <div class="w-[4.5rem] flex-shrink-0">
        <p class="text-xs font-semibold text-[#e2e2e2] leading-snug" style="display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;">${x.name}</p>
        <span class="text-[9px] font-bold" style="color:${lColor}">${x.cert.level}</span>
      </div>
      <div class="flex-1 h-1.5 bg-[#252525] rounded-full overflow-hidden">
        <div class="h-full rounded-full bg-[#2d5bff]" style="width:${rate}%"></div>
      </div>
      <span class="text-xs font-bold text-[#b8c3ff] tabular-nums w-7 text-right">${rate}%</span>
    </div>`;
  }).join('');
}

function renderDeadlineList() {
  const container = document.getElementById('deadlineListItems');
  if (!container) return;

  const track = getSelectedTrack();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let upcoming = trackExams(track)
    .filter(e => { if (!e.registration_end) return false; const d = new Date(e.registration_end + 'T00:00:00'); const diff = Math.round((d - today) / 86400000); return diff >= 0 && diff <= 15; })
    .sort((a, b) => new Date(a.registration_end) - new Date(b.registration_end))
    .slice(0, 3);

  // Global fallback if no track deadlines
  const isGlobalFallback = upcoming.length === 0;
  if (isGlobalFallback) {
    upcoming = _allExams
      .filter(e => { if (!e.registration_end) return false; const d = new Date(e.registration_end + 'T00:00:00'); const diff = Math.round((d - today) / 86400000); return diff >= 0 && diff <= 15; })
      .sort((a, b) => new Date(a.registration_end) - new Date(b.registration_end))
      .slice(0, 3);
  }

  const labelEl = document.getElementById('deadlineTrackLabel');
  if (labelEl) {
    labelEl.textContent = isGlobalFallback ? '접수 마감일 기준' : `${track} 기준`;
  }

  if (!upcoming.length) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm px-2 py-4">마감 임박 일정이 없습니다.</p>';
    return;
  }

  container.innerHTML = upcoming.map((exam, i) => {
    const dd       = dDay(exam.registration_end);
    const isUrgent = dd === 'D-DAY' || (dd && parseInt(dd.replace('D-', '')) <= 7);
    const ddColor  = isUrgent ? '#ffb4ab' : '#8e90a2';
    const infoId   = NAME_TO_INFO_ID[exam.name];
    const href     = infoId ? `cert-detail.html#${infoId}` : '#';
    const icon     = getCategoryIcon(exam.category);
    const isLast   = i === upcoming.length - 1;

    return `<div class="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer ${isLast ? '' : 'mb-0.5'}" onclick="location.href='${href}'">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-[#8e90a2]" style="font-size:16px;">${icon}</span>
        </div>
        <div>
          <p class="text-sm font-semibold text-[#e2e2e2] leading-snug">${exam.name}</p>
          <p class="text-[10px] text-[#8e90a2] mt-0.5">접수 마감 ${fmtShortDate(exam.registration_end)}</p>
        </div>
      </div>
      <span style="color:${ddColor}" class="font-bold text-xs whitespace-nowrap ml-2 tabular-nums">${dd || ''}</span>
    </div>`;
  }).join('');
}

function setupNavLinks() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.addEventListener('click', (e) => {
    const item = e.target.closest('[data-page]');
    if (!item) return;
    const page = item.dataset.page;
    if (page) window.location.href = page;
  });
}
