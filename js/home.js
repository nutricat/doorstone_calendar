/* ============================================================
   home.js — 온보딩 + 직무 번들 대시보드
   localStorage key: 'home_job_prefs' → { major, sub }
   ============================================================ */

const ONBOARDING_KEY = 'home_job_prefs';

const MAJOR_ICONS = {
  '경영/사무': 'work',
  '회계/재무/세무': 'calculate',
  '금융': 'payments',
  '공기업/공공기관': 'account_balance'
};

let cpData = null;
let infoMap = {};
let allExams = [];

// ── 진입점 ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  [cpData, , allExams] = await Promise.all([
    fetchJSON('data/career_path.json'),
    fetchJSON('data/exam_info.json').then(arr => {
      arr.forEach(item => { infoMap[item.id] = item; });
    }),
    fetchJSON('data/exams.json')
  ]);

  const prefs = getSavedPrefs();
  if (prefs) {
    hideOverlay();
    renderDashboard(prefs);
  } else {
    showOverlay();
    renderMajorCards();
  }

  renderDeadlineList();
  renderFavBento();

  document.getElementById('reset-prefs-btn').addEventListener('click', () => {
    localStorage.removeItem(ONBOARDING_KEY);
    showOverlay();
    resetOnboarding();
  });
});

// ── localStorage 헬퍼 ─────────────────────────────────────
function getSavedPrefs() {
  try { return JSON.parse(localStorage.getItem(ONBOARDING_KEY)); }
  catch { return null; }
}

function savePrefs(major, sub) {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify({ major, sub }));
}

// ── 온보딩 오버레이 제어 ──────────────────────────────────
function showOverlay() {
  const el = document.getElementById('onboarding-overlay');
  el.style.display = 'flex';
  el.style.opacity = '1';
}

function hideOverlay() {
  const el = document.getElementById('onboarding-overlay');
  el.style.opacity = '0';
  setTimeout(() => { el.style.display = 'none'; }, 300);
}

function resetOnboarding() {
  const step1 = document.getElementById('ob-step-1');
  const step2 = document.getElementById('ob-step-2');
  step1.style.display = 'flex';
  step2.classList.remove('active');
  renderMajorCards();
}

// ── Step 1: 대분류 카드 ───────────────────────────────────
function renderMajorCards() {
  if (!cpData || !cpData.job_tracks) return;
  const container = document.getElementById('ob-major-cards');
  container.innerHTML = '';

  Object.entries(cpData.job_tracks).forEach(([major, track]) => {
    const subCount = Object.keys(track.sub).length;
    const card = document.createElement('button');
    card.className = 'w-full text-left px-5 py-4 rounded-2xl border border-[#353535] bg-[#1b1b1b] hover:bg-[#222] hover:border-[#b8c3ff]/40 transition-all flex items-center gap-4';
    card.innerHTML = `
      <span class="material-symbols-outlined text-3xl text-[#b8c3ff]">${MAJOR_ICONS[major] || 'work'}</span>
      <div class="flex-1">
        <p class="font-bold text-[#e2e2e2] text-base leading-tight">${major}</p>
        <p class="text-[#8e90a2] text-xs mt-0.5">세부 직무 ${subCount}개</p>
      </div>
      <span class="material-symbols-outlined text-[#434656]">chevron_right</span>
    `;
    card.addEventListener('click', () => goToStep2(major));
    container.appendChild(card);
  });

  // 둘러보기 옵션 — 직무 미결정자를 위한 탈출구
  const browseCard = document.createElement('button');
  browseCard.className = 'w-full text-left px-5 py-4 rounded-2xl border border-dashed border-[#434656] bg-transparent hover:bg-[#1b1b1b] hover:border-[#8e90a2] transition-all flex items-center gap-4';
  browseCard.innerHTML = `
    <span class="material-symbols-outlined text-3xl text-[#8e90a2]">explore</span>
    <div class="flex-1">
      <p class="font-bold text-[#8e90a2] text-base leading-tight">아직 못 정했어요</p>
      <p class="text-[#434656] text-xs mt-0.5">직무 무관 기본 스펙 모아보기</p>
    </div>
    <span class="material-symbols-outlined text-[#434656]">chevron_right</span>
  `;
  browseCard.addEventListener('click', () => {
    savePrefs('__browse__', '__browse__');
    hideOverlay();
    renderDashboard({ major: '__browse__', sub: '__browse__' });
  });
  container.appendChild(browseCard);
}

// ── Step 1 → Step 2 전환 ──────────────────────────────────
function goToStep2(major) {
  const step1 = document.getElementById('ob-step-1');
  const step2 = document.getElementById('ob-step-2');

  document.getElementById('ob-step2-title').textContent = major;
  renderSubList(major);

  step1.style.display = 'none';
  step2.classList.add('active');

  document.getElementById('ob-back-btn').onclick = () => {
    step2.classList.remove('active');
    step1.style.display = 'flex';
  };
}

// ── Step 2: 소분류 리스트 ─────────────────────────────────
function renderSubList(major) {
  const track = cpData.job_tracks[major];
  const container = document.getElementById('ob-sub-list');
  container.innerHTML = '';

  Object.entries(track.sub).forEach(([sub, info]) => {
    const totalCerts = (info.certs || []).length + (info.common || []).length;
    const btn = document.createElement('button');
    btn.className = 'w-full text-left px-4 py-3 rounded-xl border border-[#353535] bg-[#1b1b1b] hover:bg-[#222] hover:border-[#b8c3ff]/40 transition-all flex items-center gap-3';
    btn.innerHTML = `
      <div class="flex-1">
        <p class="font-semibold text-[#e2e2e2] text-sm leading-tight">${sub}</p>
        ${info.desc ? `<p class="text-[#8e90a2] text-xs mt-0.5">${info.desc}</p>` : ''}
      </div>
      <span class="text-[#434656] text-xs">${totalCerts}개</span>
      <span class="material-symbols-outlined text-[#434656] text-base">chevron_right</span>
    `;
    btn.addEventListener('click', () => {
      savePrefs(major, sub);
      hideOverlay();
      renderDashboard({ major, sub });
    });
    container.appendChild(btn);
  });
}

// ── 직무별 디렉터 코멘트 ─────────────────────────────────
const DIRECTOR_COMMENTS = {
  // 경영/사무
  '경영/기획':        '전략·기획 직무는 데이터 해석 능력이 핵심입니다. SQLD·ADsP로 데이터 리터러시를 증명하고, 어학 공용 자격으로 글로벌 역량을 더하세요.',
  '인사/총무':        '노무·교육·채용을 아우르는 인사 직무는 HRM 전문가 자격으로 기본기를 다진 뒤, 어문·어학 공용 자격으로 스펙을 완성하는 전략이 효과적입니다.',
  '마케팅/광고':      '마케터에게 데이터 분석 역량은 필수입니다. ADsP·SQLD로 데이터 기반 의사결정 능력을 증명하면 채용 JD 우대사항을 빠르게 충족할 수 있습니다.',
  '영업/영업관리':    '영업직은 자격증보다 어학 점수의 영향력이 큽니다. TOEIC Speaking·OPIc로 커뮤니케이션 역량을 강조하고, 컴활 2급은 기본 스펙으로 선취득하세요.',
  '무역/수출입':      '수출입 직무의 핵심 트라이앵글은 무역영어 1급 → 국제무역사 → 보세사입니다. 실무에서 바로 쓰이는 자격이므로 취업 전 1~2개 취득이 강력히 권장됩니다.',
  '물류/유통/SCM':    '물류관리사는 공기업·대기업 물류팀 JD의 필수 우대 자격입니다. 유통관리사와 함께 취득하면 유통·물류 전 분야를 커버하는 포트폴리오가 완성됩니다.',
  // 회계/재무/세무
  '기업 재무/회계':   '회계 커리어는 회계관리(입문) → 재경관리사(핵심) → AICPA(심화) 순으로 단계적 취득이 정석입니다. ERP 정보관리사는 실무 취업 연계성이 높은 보조 스펙입니다.',
  '세무/회계 사무소': '세무사무소·회계법인 취업은 TAT·FAT 실무 자격이 직접적인 평가 기준입니다. 전산세무회계는 1~2급 단계별 취득이 가능해 단기간 스펙 쌓기에 유리합니다.',
  '보험/계리':        '보험·계리 직무는 AFPK로 재무설계 기반 지식을 증명하고, 금융리스크관리사(FRM)로 리스크 분석 역량을 추가하는 전략이 효과적입니다.',
  // 금융
  '은행/금융 일반직': '은행 입행 후 AFPK·신용분석사 등은 의무 취득 항목입니다. 입행 전 펀드투자권유자문인력·증권투자권유대행인을 미리 따두면 온보딩에서 확실히 유리합니다.',
  '증권/자산운용':    'CFA는 IB·PB 직무의 가장 강력한 스펙입니다. 준비 기간이 길므로 투자자산운용사·금융투자분석사를 먼저 취득하며 금융 지식 기반을 쌓는 전략이 효과적입니다.',
  '리스크/부동산 금융': '재무위험관리사는 리스크팀 필수 자격입니다. 공인중개사는 부동산 직군 전환 시 강력한 독립적 라이선스가 됩니다. 두 직무는 커리어 방향이 달라 목표를 먼저 확정하세요.',
  // 공기업/공공기관
  '사무직':           '공기업 사무직은 한국사 1급이 사실상 필수입니다. 컴활 1급·KBS한국어·한자급수자격도 NCS 서류 가점 항목이므로 조기 취득 전략을 권장합니다.',
  '전산/IT직':        '공기업 전산직은 빅데이터분석기사·SQLD가 직무 적합성 지표로 활용됩니다. 한국사 1급은 비IT 전형에서도 공통 요구 사항이므로 반드시 선취득하세요.',
  '금융공기업':       '금융공기업은 일반 은행과 달리 NCS 기반 필기가 핵심 관문입니다. AFPK·펀드투자권유자문인력으로 금융 직무 적합성을 증명하고, 한국사 1급은 반드시 선취득하세요.',
  // 둘러보기
  '__browse__':       '직무가 정해지지 않아도 먼저 취득해두면 어디서든 인정받는 자격증이 있습니다. TOEIC·컴활·한국사는 거의 모든 채용 공고의 기본 우대 사항입니다.'
};

// ── 대시보드 렌더 ─────────────────────────────────────────
function renderDashboard(prefs) {
  const { major, sub } = prefs;
  const isBrowse = major === '__browse__';

  const greetingTitle = document.getElementById('greeting-title');
  const greetingSub = document.getElementById('greeting-sub');
  if (greetingTitle) {
    greetingTitle.textContent = isBrowse ? '어디서든 통하는 기본 스펙' : `${sub} 직무 추천 자격증`;
    greetingSub.textContent   = isBrowse ? '직무 무관 범용 자격증' : `${major} · ${sub}`;
  }

  const bundleLabel = document.getElementById('bundle-job-label');
  if (bundleLabel) bundleLabel.textContent = isBrowse ? '기본 스펙' : sub;

  renderDirectorComment(isBrowse ? '__browse__' : sub);
  renderBundleCards(prefs);
}

// ── 디렉터 코멘트 렌더 ────────────────────────────────────
function renderDirectorComment(sub) {
  const comment = DIRECTOR_COMMENTS[sub];
  if (!comment) return;

  // 기존 코멘트 블럭이 있으면 제거 후 재삽입
  const existing = document.getElementById('director-comment');
  if (existing) existing.remove();

  const bundleSection = document.getElementById('bundle-section');
  if (!bundleSection) return;

  const block = document.createElement('section');
  block.id = 'director-comment';
  block.className = 'rounded-2xl overflow-hidden';
  block.style.background = 'linear-gradient(135deg, rgba(45,91,255,0.12) 0%, rgba(184,195,255,0.06) 100%)';
  block.style.border = '1px solid rgba(184,195,255,0.18)';
  block.innerHTML = `
    <div class="px-4 py-4 flex gap-3 items-start">
      <span class="material-symbols-outlined text-[#b8c3ff] text-xl shrink-0 mt-0.5" style="font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;">lightbulb</span>
      <div>
        <p class="text-[10px] font-bold tracking-widest text-[#b8c3ff] uppercase mb-1">에디터 코멘트</p>
        <p class="text-sm text-[#c4c5d9] leading-relaxed keep-all">${comment}</p>
      </div>
    </div>
  `;

  bundleSection.insertAdjacentElement('afterend', block);
}

// 둘러보기용 범용 자격증 (직무 무관 기본 스펙)
const BROWSE_BUNDLE = {
  certs:  ['sqld', 'adsp', 'toeic-speaking', 'opic'],
  common: ['toeic', 'com-1', 'com-2', 'k-history', 'kbs-kr']
};

// ── 번들 카드 렌더 ────────────────────────────────────────
function renderBundleCards(prefs) {
  if (!cpData || !cpData.job_tracks) return;
  const container = document.getElementById('bundle-content');
  if (!container) return;

  let certIds, commonIds;

  if (prefs.major === '__browse__') {
    certIds   = BROWSE_BUNDLE.certs;
    commonIds = BROWSE_BUNDLE.common;
  } else {
    const track = cpData.job_tracks[prefs.major];
    if (!track) { container.innerHTML = '<p class="text-[#8e90a2] text-sm px-1">데이터를 찾을 수 없습니다.</p>'; return; }

    const subInfo = track.sub[prefs.sub];
    if (!subInfo) { container.innerHTML = '<p class="text-[#8e90a2] text-sm px-1">직무 정보를 찾을 수 없습니다.</p>'; return; }

    certIds   = subInfo.certs || [];
    commonIds = subInfo.common || [];
  }

  const certIndex = {};
  (cpData.certs || []).forEach(c => { certIndex[c.id] = c; });

  const groupMeta = {
    '심화': { label: '심화', color: '#ffb59b', bg: 'rgba(194,65,0,0.15)', border: 'rgba(194,65,0,0.35)', icon: 'military_tech' },
    '핵심': { label: '핵심', color: '#b8c3ff', bg: 'rgba(45,91,255,0.12)', border: 'rgba(45,91,255,0.3)', icon: 'star' },
    '입문': { label: '기초', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)', icon: 'school' },
    '공용': { label: '공용', color: '#c4c5d9', bg: 'rgba(196,197,217,0.08)', border: 'rgba(196,197,217,0.2)', icon: 'public' }
  };

  const groups = { '심화': [], '핵심': [], '입문': [], '공용': [] };

  certIds.forEach(id => {
    const certMeta = certIndex[id];
    const info = infoMap[id];
    if (!certMeta && !info) return;
    const level = certMeta ? certMeta.level : '핵심';
    const name = certMeta ? certMeta.name : (info ? info.name : id);
    if (!groups[level]) groups[level] = [];
    groups[level].push({ id, name, level, info: info || null });
  });

  commonIds.forEach(id => {
    const certMeta = certIndex[id];
    const info = infoMap[id];
    if (!certMeta && !info) return;
    const name = certMeta ? certMeta.name : (info ? info.name : id);
    groups['공용'].push({ id, name, level: '공용', info: info || null });
  });

  container.innerHTML = '';

  ['심화', '핵심', '입문', '공용'].forEach(level => {
    const items = groups[level];
    if (!items || items.length === 0) return;
    const meta = groupMeta[level];

    const section = document.createElement('div');
    const header = document.createElement('div');
    header.className = 'flex items-center gap-2 mb-2';
    header.innerHTML = `
      <span class="material-symbols-outlined text-sm" style="color:${meta.color}">${meta.icon}</span>
      <span class="text-xs font-bold tracking-wide" style="color:${meta.color}">${meta.label}</span>
      <span class="text-[#434656] text-[10px]">${items.length}개</span>
    `;
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'flex flex-col gap-2';

    items.forEach(({ id, name, info }) => {
      const studyTime = info && info.study_time ? extractShortStudyTime(info.study_time) : null;
      const passRate = info && typeof info.pass_rate === 'number' ? info.pass_rate : null;
      const nextExamStr = getNextExamForCert(name);

      const card = document.createElement('a');
      card.href = `cert-detail.html#${id}`;
      card.className = 'flex items-center justify-between px-4 py-3 rounded-xl border hover:opacity-80 transition-opacity';
      card.style.background = meta.bg;
      card.style.borderColor = meta.border;
      card.innerHTML = `
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#e2e2e2] text-sm leading-tight truncate">${name}</p>
          <div class="flex items-center gap-2 mt-0.5 flex-wrap">
            ${studyTime ? `<span class="text-[10px] text-[#8e90a2]">${studyTime}</span>` : ''}
            ${passRate !== null ? `<span class="text-[10px] text-[#8e90a2]">합격률 ${passRate}%</span>` : ''}
            ${nextExamStr ? `<span class="text-[10px]" style="color:${meta.color}">${nextExamStr}</span>` : ''}
          </div>
        </div>
        <span class="material-symbols-outlined text-[#434656] text-base ml-2 shrink-0">chevron_right</span>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });

  if (container.children.length === 0) {
    container.innerHTML = '<p class="text-[#8e90a2] text-sm px-1">추천 자격증이 없습니다.</p>';
  }
}

// ── 준비기간 단축 표시 ────────────────────────────────────
function extractShortStudyTime(studyTime) {
  if (!studyTime) return null;
  const m = studyTime.match(/(\d+[~\-]\d+(?:주|개월)|\d+(?:주|개월)\s*이상)/);
  if (m) return m[1];
  const first = studyTime.split('/')[0].replace(/노베이스\s*기준\s*/, '').trim();
  return first.split(' ')[0] || null;
}

// ── 다음 시험일 D-day ─────────────────────────────────────
function getNextExamForCert(certName) {
  if (!allExams || !allExams.length) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let nearest = null;
  allExams.forEach(exam => {
    if (exam.name !== certName) return;
    [exam.exam_date, exam.result_date].filter(Boolean).forEach(d => {
      const dt = new Date(d);
      if (dt >= today && (!nearest || dt < nearest)) nearest = dt;
    });
  });
  if (!nearest) return null;
  return dDay(nearest.toISOString().slice(0, 10));
}

// ── 접수 마감 임박 리스트 ─────────────────────────────────
function renderDeadlineList() {
  const container = document.getElementById('deadlineListItems');
  if (!container || !allExams.length) return;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = allExams
    .filter(e => e.reg_end_date && new Date(e.reg_end_date) >= today)
    .sort((a, b) => new Date(a.reg_end_date) - new Date(b.reg_end_date))
    .slice(0, 6);

  if (!upcoming.length) {
    container.innerHTML = '<div class="text-[#8e90a2] text-sm px-2 py-3">임박한 접수 일정이 없습니다.</div>';
    return;
  }

  container.innerHTML = '';
  upcoming.forEach(exam => {
    const dd = dDay(exam.reg_end_date);
    const dateStr = fmtMonthDay(exam.reg_end_date);
    const certId = NAME_TO_INFO_ID[exam.name] || '';
    const row = document.createElement('a');
    row.href = `cert-detail.html#${certId}`;
    row.className = 'flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-[#222] transition-colors';
    row.innerHTML = `
      <div class="flex items-center gap-2 min-w-0">
        <span class="material-symbols-outlined text-[#ffb4ab] text-base shrink-0">schedule</span>
        <span class="text-sm text-[#e2e2e2] truncate">${exam.name}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0 ml-2">
        <span class="text-[#8e90a2] text-xs">${dateStr} 마감</span>
        ${dd ? `<span class="text-xs font-bold text-[#ffb4ab] min-w-[3rem] text-right">${dd}</span>` : ''}
      </div>
    `;
    container.appendChild(row);
  });
}

// ── 관심 자격증 카운트 ────────────────────────────────────
function renderFavBento() {
  const countEl = document.getElementById('favTotalCount');
  if (!countEl) return;
  try {
    const favs = typeof getFavorites === 'function' ? getFavorites() : [];
    countEl.textContent = favs.length;
  } catch { countEl.textContent = '0'; }
}
