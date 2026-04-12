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
      fetchJSON('../data/exam_info.json'),
      fetchJSON('../data/exams.json'),
      fetchJSON('../data/career_path.json'),
    ]);

    const info = infoList.find(item => item.id === id);
    if (!info) {
      showDetailError('해당 자격증 정보를 찾을 수 없습니다.');
      return;
    }

    const examName  = INFO_ID_TO_NAME[id] || info.name;
    const schedules = examList.filter(e => e.name === examName);

    populateHero(info, schedules);
    populateSchedule(schedules);
    populateExamFormat(info);
    populateBooks(info.recommended_books);
    populateNextSteps(info, cpData, id);
    populateCommunityReviews(info);
    setupFavoriteBtn(info.name);
    setupBackBtn();

    document.title = `${info.name} | 자취방`;
  } catch (err) {
    console.error('상세 페이지 로드 실패:', err);
    showDetailError('데이터를 불러오는 데 실패했습니다.');
  }
}

function populateHero(info, schedules) {
  const host = schedules.length > 0 ? (schedules[0].host || '-') : '-';
  const fee  = schedules.length > 0 && schedules[0].fee > 0
    ? schedules[0].fee.toLocaleString('ko-KR') + '원'
    : '참고사항 확인';

  const nameEl   = document.getElementById('certName');
  const nameKoEl = document.getElementById('certNameKo');
  const diffEl   = document.getElementById('certDifficulty');
  const studyEl  = document.getElementById('certStudyTime');
  const hostEl   = document.getElementById('certHost');
  const feeEl    = document.getElementById('certFee');
  const passEl   = document.getElementById('certPass');
  const typeEl   = document.getElementById('certExamType');
  const applyBtn = document.getElementById('certApplyBtn');

  if (nameEl)   nameEl.textContent   = info.name;
  if (nameKoEl) nameKoEl.textContent = info.name;

  if (diffEl) {
    const diffMap = { '상': 'ADVANCED', '중상': 'UPPER MID', '중': 'INTERMEDIATE', '하': 'BEGINNER', '최상': 'EXPERT' };
    diffEl.textContent = diffMap[info.difficulty] || info.difficulty || 'N/A';
  }
  if (studyEl && info.study_time) studyEl.textContent = info.study_time;

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
  const headEl  = document.getElementById('scheduleYear');
  const tbody   = document.getElementById('scheduleRows');

  if (headEl && schedules.length > 0 && schedules[0].exam_date) {
    headEl.textContent = schedules[0].exam_date.split('-')[0] + ' 시험 일정';
  }
  if (!tbody) return;

  if (!schedules.length) {
    tbody.innerHTML = `<div class="grid grid-cols-4 p-4 text-center text-on-surface-variant text-sm col-span-4">등록된 일정이 없습니다.</div>`;
    return;
  }

  tbody.innerHTML = schedules.map((s, i) => {
    const round    = String(i + 1).padStart(2, '0');
    const regRange = `${fmtShortDate(s.registration_start)} ~ ${fmtShortDate(s.registration_end)}`;
    const examDate  = fmtShortDate(s.exam_date);
    const resultDate = fmtShortDate(s.result_date);
    const stagePart  = (s.stage && s.stage !== '단일')
      ? ` <span class="text-[10px] text-on-surface-variant">(${s.stage})</span>` : '';

    return `<div class="grid grid-cols-4 p-4 items-center hover:bg-surface-container transition-colors gap-2">
      <div class="font-bold text-primary pl-2">${round}${stagePart}</div>
      <div class="text-sm text-on-surface">${regRange}</div>
      <div class="text-sm text-on-surface">${examDate}</div>
      <div class="text-sm text-on-surface">${resultDate}</div>
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

function populateBooks(books) {
  const container = document.getElementById('bookList');
  if (!container) return;

  if (!books || !books.length) {
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

function populateNextSteps(info, cpData, certId) {
  const container = document.getElementById('nextSteps');
  if (!container) return;

  if (!cpData) {
    container.innerHTML = '<div class="text-center p-8 text-on-surface-variant">커리어패스 정보를 불러올 수 없습니다.</div>';
    return;
  }

  const LEVEL_ORDER = ['입문', '핵심', '심화'];
  const current     = cpData.certs.find(c => c.id === certId);

  if (!current) {
    container.innerHTML = '<div class="text-center p-8 text-on-surface-variant">커리어패스 정보가 준비 중입니다.</div>';
    return;
  }

  if (current.level === '심화') {
    container.innerHTML = '<div class="text-center p-8 text-on-surface-variant text-sm">이 분야의 최상위 자격증입니다. 🎯</div>';
    return;
  }

  const curIdx  = LEVEL_ORDER.indexOf(current.level);
  const nextLvl = LEVEL_ORDER[curIdx + 1];

  // Same category, next level certs
  const nextCerts = cpData.certs.filter(c =>
    c.level === nextLvl &&
    c.category.some(cat => current.category.includes(cat)) &&
    c.id !== certId
  ).slice(0, 3);

  if (!nextCerts.length) {
    container.innerHTML = '<div class="text-center p-8 text-on-surface-variant text-sm">다음 단계 정보를 준비 중입니다.</div>';
    return;
  }

  container.innerHTML = nextCerts.map((cert, i) => {
    const href    = `cert-detail.html#${cert.id}`;
    const catLbl  = cert.category?.[0] || '';
    const isFirst = i === 0;
    const meta    = LEVEL_META[cert.level];
    const lvlColor = meta?.color || '#b8c3ff';
    const lvlLabel = meta?.label || cert.level;

    return `<div class="relative" onclick="location.href='${href}'" style="cursor:pointer;">
      <div class="absolute -left-[26px] top-1 w-4 h-4 rounded-full ${isFirst ? 'bg-primary ring-4 ring-black' : 'bg-surface-container-highest ring-4 ring-black'}"></div>
      <div class="bg-surface-container-low p-5 rounded-xl hover:bg-surface-container transition-colors">
        <p class="text-xs font-bold mb-1" style="color:${lvlColor}">${lvlLabel} · ${catLbl}</p>
        <h4 class="font-bold text-lg">${cert.name}</h4>
      </div>
    </div>`;
  }).join('');
}

function populateCommunityReviews(info) {
  const container = document.getElementById('communityLinks');
  if (!container) return;

  const certName = encodeURIComponent(info.name);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${certName}+합격+후기`;
  const naverUrl   = `https://blog.naver.com/PostSearchMain.naver?type=POST&searchText=${certName}+합격`;

  container.innerHTML = `
    <a class="flex items-center gap-4 p-4 bg-surface-container-lowest hover:bg-surface-container transition-all rounded-xl group" href="${youtubeUrl}" target="_blank" rel="noopener noreferrer">
      <div class="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 flex-shrink-0">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_circle</span>
      </div>
      <div>
        <p class="font-bold text-sm">YouTube: ${info.name} 합격 후기</p>
        <p class="text-xs text-on-surface-variant">유튜브에서 검색하기</p>
      </div>
      <span class="material-symbols-outlined ml-auto text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
    </a>
    <a class="flex items-center gap-4 p-4 bg-surface-container-lowest hover:bg-surface-container transition-all rounded-xl group" href="${naverUrl}" target="_blank" rel="noopener noreferrer">
      <div class="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center text-green-500 flex-shrink-0">
        <span class="material-symbols-outlined">description</span>
      </div>
      <div>
        <p class="font-bold text-sm">Naver Blog: ${info.name} 합격 후기</p>
        <p class="text-xs text-on-surface-variant">블로그 합격 수기 검색하기</p>
      </div>
      <span class="material-symbols-outlined ml-auto text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
    </a>`;
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

function setupBackBtn() {
  const btn = document.getElementById('backBtn');
  if (btn) btn.onclick = () => history.length > 1 ? history.back() : (window.location.href = 'new_index.html');
}

function showDetailError(msg) {
  const main = document.querySelector('main');
  if (main) main.innerHTML = `<div class="flex flex-col items-center justify-center h-64 text-on-surface-variant gap-4 mt-16">
    <span class="material-symbols-outlined text-4xl">error</span>
    <p>${msg}</p>
    <a href="new_index.html" class="text-primary underline">홈으로 돌아가기</a>
  </div>`;
}
