/**
 * my-certs.js — my-certs.html page logic
 * Only uses localStorage favorites — no backend required.
 * Backend-dependent features (study groups, progress %, note editing) are intentionally excluded.
 * Requires: data.js, ../js/favorites.js
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const allExams = await fetchJSON('data/exams.json');
    renderFavSummary();
    renderUpcomingCard(allExams);
    renderFavList(allExams);
  } catch (err) {
    console.error('내 자격증 페이지 초기화 실패:', err);
  }
});

function renderFavSummary() {
  const favs    = getFavorites();
  const countEl = document.getElementById('favTotalCount');
  const subEl   = document.getElementById('favTotalSub');

  if (countEl) countEl.textContent = `총 ${favs.length}건`;
  if (subEl) {
    subEl.innerHTML = favs.length > 0
      ? `관심 자격증이 <span class="text-primary">${favs.length}개</span> 있습니다`
      : '관심 자격증을 추가해보세요';
  }
}

function renderUpcomingCard(allExams) {
  const favs = getFavorites();
  if (!favs.length) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFavExams = allExams
    .filter(e => favs.includes(e.name) && e.exam_date && new Date(e.exam_date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));

  const nameEl = document.getElementById('upcomingExamName');
  const dateEl = document.getElementById('upcomingExamDate');
  const ddEl   = document.getElementById('upcomingExamDDay');

  if (upcomingFavExams.length) {
    const exam = upcomingFavExams[0];
    if (nameEl) nameEl.textContent = exam.name;
    if (dateEl) dateEl.textContent = `${exam.exam_date} 시행`;
    if (ddEl)   ddEl.textContent   = dDay(exam.exam_date) || 'D-?';
  } else {
    if (nameEl) nameEl.textContent = '예정된 시험 없음';
    if (dateEl) dateEl.textContent = '';
    if (ddEl)   ddEl.textContent   = '-';
  }
}

function renderFavList(allExams) {
  const container = document.getElementById('favCertsList');
  if (!container) return;

  const favs = getFavorites();
  if (!favs.length) {
    container.innerHTML = `<div class="col-span-3 bg-surface-container-low squircle p-10 text-center text-on-surface-variant space-y-4">
      <span class="material-symbols-outlined text-4xl block">bookmark_add</span>
      <p>관심 자격증이 없습니다.<br/>캘린더나 자격증 상세 페이지에서 추가해보세요.</p>
      <a href="calendar.html" class="inline-block mt-2 bg-primary-container text-white px-6 py-2 rounded-full text-sm font-bold">캘린더 보기</a>
    </div>`;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  container.innerHTML = favs.map(name => {
    const infoId = NAME_TO_INFO_ID[name];
    const href   = infoId ? `cert-detail.html#${infoId}` : '#';

    const upcoming = allExams
      .filter(e => e.name === name && e.exam_date && new Date(e.exam_date + 'T00:00:00') >= today)
      .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));

    const exam    = upcoming[0];
    const dd      = exam ? dDay(exam.exam_date) : null;
    const dateStr = exam?.exam_date;
    const cat     = exam?.category || '';

    return `<div class="bg-surface-container-low p-8 squircle flex flex-col justify-between h-60 border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer" onclick="location.href='${href}'">
      <div class="flex justify-between items-start">
        <div class="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center">
          <span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1;">favorite</span>
        </div>
        <button class="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-surface-container-highest" onclick="event.stopPropagation(); removeFav('${name.replace(/'/g, "\\'")}', this.closest('.squircle'))" title="관심 목록에서 제거">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
      <div>
        <h3 class="font-bold text-on-surface text-lg leading-tight">${name}</h3>
        ${cat      ? `<p class="text-on-surface-variant text-xs mt-1">${cat}</p>` : ''}
        ${dateStr  ? `<p class="text-on-surface-variant text-xs mt-0.5">다음 시험: ${fmtShortDate(dateStr)}</p>` : '<p class="text-on-surface-variant text-xs mt-0.5">시험 일정 없음</p>'}
      </div>
      <div class="flex items-center justify-between">
        ${dd ? `<span class="text-primary-container text-xs font-bold">${dd}</span>` : '<span class="text-on-surface-variant text-xs">예정 없음</span>'}
        <span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
      </div>
    </div>`;
  }).join('');
}

function removeFav(name, card) {
  toggleFavorite(name); // removes since already favorited
  if (card) {
    card.style.opacity    = '0';
    card.style.transform  = 'scale(0.95)';
    card.style.transition = 'opacity 0.2s, transform 0.2s';
    setTimeout(() => {
      card.remove();
      // Update summary count
      renderFavSummary();
    }, 200);
  }
}
