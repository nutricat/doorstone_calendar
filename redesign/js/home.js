/**
 * home.js — new_index.html page logic
 * Requires: data.js loaded first, ../js/favorites.js loaded first
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const allExams = await fetchJSON('../data/exams.json');
    renderFeaturedCard(allExams);
    renderBentoNearestExam(allExams);
    renderBentoFavCount();
    renderDeadlineList(allExams);
    setupNavLinks();
  } catch (err) {
    console.error('홈 페이지 초기화 실패:', err);
  }
});

function getUpcomingExamsSortedByExamDate(allExams) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allExams
    .filter(e => e.exam_date && new Date(e.exam_date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
}

function renderFeaturedCard(allExams) {
  const upcoming = getUpcomingExamsSortedByExamDate(allExams);
  if (!upcoming.length) return;

  const exam   = upcoming[0];
  const infoId = NAME_TO_INFO_ID[exam.name];

  const nameEl  = document.getElementById('featuredName');
  const subEl   = document.getElementById('featuredSub');
  const catEl   = document.getElementById('featuredCat');
  const btn     = document.getElementById('featuredLink');
  const ddayEl  = document.getElementById('featuredDDay');

  if (nameEl) nameEl.textContent = exam.name;
  if (subEl)  subEl.textContent  = `${fmtMonthDay(exam.exam_date)} 시험 예정`;
  if (catEl)  catEl.textContent  = exam.category || '추천 자격증';
  if (ddayEl) ddayEl.textContent = dDay(exam.exam_date) || '';
  if (btn && infoId) {
    btn.onclick = (e) => { e.stopPropagation(); window.location.href = `cert-detail.html#${infoId}`; };
  }
}

function renderBentoNearestExam(allExams) {
  const upcoming = getUpcomingExamsSortedByExamDate(allExams);
  if (!upcoming.length) return;

  const exam = upcoming[0];
  const nameEl = document.getElementById('nearestExamName');
  const ddEl   = document.getElementById('nearestExamDDay');
  const dateEl = document.getElementById('nearestExamDate');

  if (nameEl) nameEl.textContent = exam.name;
  if (ddEl)   ddEl.textContent   = dDay(exam.exam_date) || 'D-?';
  if (dateEl) dateEl.textContent = `${exam.exam_date} 시행`;
}

function renderBentoFavCount() {
  const favs     = getFavorites();
  const countEl  = document.getElementById('favCount');
  const subEl    = document.getElementById('favCountSub');

  if (countEl) countEl.textContent = `${favs.length}개`;
  if (subEl) {
    subEl.textContent = favs.length > 0
      ? `관심 자격증 ${favs.length}개 등록됨`
      : '아직 관심 자격증이 없습니다';
  }
}

function renderDeadlineList(allExams) {
  const container = document.getElementById('deadlineListItems');
  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = allExams
    .filter(e => e.registration_end && new Date(e.registration_end + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.registration_end) - new Date(b.registration_end))
    .slice(0, 3);

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
