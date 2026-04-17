/**
 * detail.js — cert-detail.html page logic
 * Requires: data.js, ../js/favorites.js
 */

document.addEventListener('DOMContentLoaded', loadDetail);
window.addEventListener('hashchange', loadDetail);

async function loadDetail() {
  const id = window.location.hash.slice(1);
  if (!id) {
    showDetailError('잘못된 접근입니다. 홈으로 돌아가세요.');
    return;
  }
  window.scrollTo(0, 0);

  try {
    const [infoList, examList, cpData] = await Promise.all([
      fetchJSON('data/exam_info.json'),
      fetchJSON('data/exams.json'),
      fetchJSON('data/career_path.json'),
    ]);

    const info = infoList.find(item => item.id === id);
    if (!info) {
      showDetailError('해당 자격증 정보를 찾을 수 없습니다.');
      return;
    }

    const examName  = INFO_ID_TO_NAME[id] || info.name;
    const schedules = examList.filter(e => e.name === examName);

    // 순서: 의사결정 정보 → AI 분석 → 행정 아코디언 → 일정 → 형식 → 교재
    populateHero(info, cpData, id);
    populateCommunityReviews(info);
    populateAdminInfo(info, schedules);
    populateSchedule(schedules);
    populateExamFormat(info);
    populateBooks(info);
    setupFavoriteBtn(info.name);
    setupObtainedBtn(info.name);
    setupBackBtn();

    document.title = `${info.name} | 자취방`;
  } catch (err) {
    console.error('상세 페이지 로드 실패:', err);
    showDetailError('데이터를 불러오는 데 실패했습니다.');
  }
}

function populateHero(info, cpData, certId) {
  const nameEl   = document.getElementById('certName');
  const nameKoEl = document.getElementById('certNameKo');
  const diffEl   = document.getElementById('certDifficulty');
  const studyEl  = document.getElementById('certStudyTime');

  if (nameEl)   nameEl.textContent   = info.name;
  if (nameKoEl) nameKoEl.textContent = info.name;

  if (diffEl) {
    const cpCert = cpData?.certs?.find(c => c.id === certId);
    const level  = cpCert?.level;
    const meta   = LEVEL_META[level];
    diffEl.textContent = meta?.label || level || 'N/A';
    if (meta?.color) diffEl.style.backgroundColor = meta.color + '33';
    if (meta?.color) diffEl.style.color = meta.color;
  }
  if (studyEl && info.study_time) studyEl.textContent = info.study_time;
}

// 행정 정보 아코디언 채우기 (certHost, certFee, certPass, certExamType, certApplyBtn)
function populateAdminInfo(info, schedules) {
  const host = schedules.length > 0 ? (schedules[0].host || '-') : '-';
  const fee  = schedules.length > 0 && schedules[0].fee > 0
    ? schedules[0].fee.toLocaleString('ko-KR') + '원'
    : '참고사항 확인';

  const hostEl   = document.getElementById('certHost');
  const feeEl    = document.getElementById('certFee');
  const passEl   = document.getElementById('certPass');
  const typeEl   = document.getElementById('certExamType');
  const applyBtn = document.getElementById('certApplyBtn');

  if (hostEl) hostEl.textContent = host;
  if (feeEl)  feeEl.textContent  = fee;
  if (passEl) passEl.textContent = info.pass_condition || '-';
  if (typeEl && info.exam_format) typeEl.textContent = info.exam_format.type || '-';

  if (applyBtn && schedules.length > 0 && schedules[0].url) {
    applyBtn.href   = schedules[0].url;
    applyBtn.target = '_blank';
    applyBtn.rel    = 'noopener noreferrer';
  }
}

function populateSchedule(schedules) {
  const headEl = document.getElementById('scheduleYear');
  const container = document.getElementById('scheduleRows');

  if (headEl && schedules.length > 0 && schedules[0].exam_date) {
    headEl.textContent = schedules[0].exam_date.split('-')[0] + ' 시험 일정';
  }
  if (!container) return;

  if (!schedules.length) {
    container.innerHTML = '<div class="text-[#8e90a2] text-sm px-1 py-2">등록된 일정이 없습니다.</div>';
    return;
  }

  container.innerHTML = schedules.map((s, i) => {
    const round      = s.round != null ? `${s.round}회차` : `${i + 1}회차`;
    const stagePart  = (s.stage && s.stage !== '단일') ? ` · ${s.stage}` : '';
    const regRange   = `${fmtMonthDay(s.registration_start)} ~ ${fmtMonthDay(s.registration_end)}`;
    const examDate   = fmtMonthDay(s.exam_date);
    const resultDate = fmtMonthDay(s.result_date);
    const ddExam     = dDay(s.exam_date);

    return `<div class="px-4 py-3 border-b border-white/5 last:border-0">
      <div class="flex items-center justify-between mb-2">
        <span class="font-bold text-[#b8c3ff] text-sm">${round}${stagePart}</span>
        ${ddExam ? `<span class="text-[10px] font-bold text-[#ffb4ab]">${ddExam}</span>` : ''}
      </div>
      <div class="flex flex-col gap-1.5">
        <div class="flex justify-between items-center">
          <span class="text-[#8e90a2] text-xs">접수</span>
          <span class="text-xs text-[#e2e2e2]">${regRange}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-[#8e90a2] text-xs">시험</span>
          <span class="text-xs text-[#e2e2e2]">${examDate}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-[#8e90a2] text-xs">발표</span>
          <span class="text-xs text-[#e2e2e2]">${resultDate}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function populateExamFormat(info) {
  const subjectListEl = document.getElementById('subjectList');
  const examTypeCardEl = document.getElementById('examTypeCard');

  if (subjectListEl && info.subjects) {
    const subjects = info.subjects.split(',').map(s => s.trim()).filter(Boolean);
    subjectListEl.innerHTML = subjects.map(subj => `
      <li class="flex justify-between items-center p-3 rounded-lg bg-surface-container-highest/30">
        <span class="text-sm font-medium">${subj}</span>
      </li>`).join('');
  }

  if (examTypeCardEl && info.exam_format) {
    const f = info.exam_format;
    const isCBT  = f.type === 'CBT';
    const typeStr = isCBT ? '100% CBT 방식' : (f.type || '');
    const totalQ  = f.total_questions ? `${f.total_questions}문항 · ${f.question_types?.join(', ') || ''}` : '';
    const freq    = f.frequency || '';
    examTypeCardEl.innerHTML = `
      <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">quiz</span>
      <div>
        ${typeStr ? `<h4 class="text-xl font-bold leading-tight mb-2">${typeStr}</h4>` : ''}
        ${totalQ   ? `<p class="text-sm text-on-primary-container/80">${totalQ}</p>` : ''}
        ${freq     ? `<p class="text-sm text-on-primary-container/80 mt-1">${freq}</p>` : ''}
      </div>`;
  }
}

function populateBooks(info) {
  const container = document.getElementById('bookList');
  const titleEl   = document.getElementById('bookSectionTitle');
  if (!container) return;

  const books = info.recommended_books || [];

  // AI 데이터 기반 신뢰 카피
  if (titleEl && info.ai_analysis && info.ai_analysis.top_textbook) {
    titleEl.innerHTML = `추천 교재 <span class="text-[#8e90a2] text-xs font-normal ml-1">유튜버 10명 중 8명이 추천한 교재</span>`;
  }

  if (!books.length) {
    container.innerHTML = '<p class="text-on-surface-variant text-sm col-span-2">추천 교재 정보가 준비 중입니다.</p>';
    return;
  }

  container.innerHTML = books.map(book => {
    const hasLink  = book.link  && book.link.trim()  !== '';
    const hasImage = book.image && book.image.trim() !== '';
    const imgHtml  = hasImage
      ? `<img class="w-full h-full object-contain opacity-80 group-hover:scale-105 transition-transform duration-500" src="${book.image}" alt="${book.title} 표지" onerror="this.parentElement.style.background=document.documentElement.classList.contains('light')?'#f1f3f5':'#2a2a2a'">`
      : `<div class="w-full h-full flex items-center justify-center text-4xl">📖</div>`;

    return `<div class="bg-surface-container-low rounded-xl overflow-hidden group">
      <div class="w-full bg-surface-container-high overflow-hidden relative" style="height:160px;">
        ${imgHtml}
        <div class="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent pointer-events-none"></div>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <h4 class="font-bold text-base leading-snug">${book.title}</h4>
          <p class="text-xs text-on-surface-variant mt-1">${book.author || ''}${book.publisher ? ' · ' + book.publisher : ''}</p>
        </div>
        ${hasLink
          ? `<a href="${book.link}" target="_blank" rel="noopener noreferrer" class="w-full bg-surface-container-highest text-primary font-bold py-3 rounded-lg hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 text-sm">
              YES24에서 보기
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>`
          : `<div class="w-full bg-surface-container-highest text-on-surface-variant py-3 rounded-lg flex items-center justify-center text-sm">링크 준비 중</div>`
        }
      </div>
    </div>`;
  }).join('');
}

function populateCommunityReviews(info) {
  const container = document.getElementById('communityLinks');
  if (!container) return;

  const ai = info.ai_analysis;
  if (!ai) {
    container.innerHTML = '<p class="text-[#8e90a2] text-sm">AI 분석 데이터 준비 중입니다.</p>';
    return;
  }

  container.innerHTML = `
    <div class="bg-[#1b1b1b] rounded-xl p-4 space-y-3">
      <p class="text-[10px] font-bold tracking-widest text-[#8e90a2] uppercase">${ai.source_title || ''}</p>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-[#131313] rounded-xl px-3 py-3">
          <p class="text-[10px] text-[#8e90a2] mb-1">평균 준비기간</p>
          <p class="text-sm font-bold text-[#b8c3ff]">${ai.avg_study_weeks || '-'}</p>
        </div>
        <div class="bg-[#131313] rounded-xl px-3 py-3">
          <p class="text-[10px] text-[#8e90a2] mb-1">난이도</p>
          <p class="text-sm font-bold text-[#ffb59b]">${ai.difficulty || '-'}</p>
        </div>
      </div>

      <div class="bg-[#131313] rounded-xl px-3 py-3">
        <p class="text-[10px] text-[#8e90a2] mb-1">AI 핵심 요약</p>
        <p class="text-sm text-[#e2e2e2] keep-all leading-relaxed">${ai.key_summary || '-'}</p>
      </div>
    </div>`;
}

function setupFavoriteBtn(certName) {
  const btn = document.getElementById('favBtn');
  if (!btn) return;
  btn.dataset.name = certName;
  updateFavBtn(btn, isFavorite(certName));
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowFav = toggleFavorite(certName);
    updateFavBtn(btn, isNowFav);
  });
}

function updateFavBtn(btn, isActive) {
  const icon = btn.querySelector('.material-symbols-outlined');
  if (icon) {
    icon.style.fontVariationSettings = isActive ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
  }
  btn.style.color = isActive ? '#e74c3c' : '#8e90a2';
  btn.title       = isActive ? '즐겨찾기 해제' : '즐겨찾기 추가';
}

function setupObtainedBtn(certName) {
  const btn = document.getElementById('obtainedBtn');
  if (!btn) return;
  updateObtainedBtn(btn, isObtained(certName));
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isNow = toggleObtained(certName);
    updateObtainedBtn(btn, isNow);
  });
}

function updateObtainedBtn(btn, isActive) {
  const icon = btn.querySelector('.material-symbols-outlined');
  if (icon) icon.style.fontVariationSettings = isActive
    ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
    : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
  btn.style.color = isActive ? '#4ade80' : '#8e90a2';
  btn.title = isActive ? '취득 완료 해제' : '취득 완료 등록';
}

function setupBackBtn() {
  const btn = document.getElementById('backBtn');
  if (btn) btn.onclick = () => history.length > 1 ? history.back() : (window.location.href = 'index.html');
}

function showDetailError(msg) {
  const main = document.querySelector('main');
  if (main) main.innerHTML = `<div class="flex flex-col items-center justify-center h-64 text-on-surface-variant gap-4 mt-16">
    <span class="material-symbols-outlined text-4xl">error</span>
    <p>${msg}</p>
    <a href="index.html" class="text-primary underline">홈으로 돌아가기</a>
  </div>`;
}
