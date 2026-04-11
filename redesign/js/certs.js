/**
 * certs.js — certs.html browse/search page logic
 * Requires: data.js, ../js/favorites.js
 */

let allCerts  = [];   // from career_path.json
let allExams  = [];   // from exams.json
let infoMap   = {};   // cert id → exam_info entry
let activeCategory = '전체';
let searchKeyword  = '';

const LEVEL_STYLE = {
  '입문': { bg: 'bg-blue-500/15',   text: 'text-blue-400'   },
  '핵심': { bg: 'bg-green-500/15',  text: 'text-green-400'  },
  '심화': { bg: 'bg-orange-500/15', text: 'text-orange-400' },
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [cpData, examList, infoList] = await Promise.all([
      fetchJSON('../data/career_path.json'),
      fetchJSON('../data/exams.json'),
      fetchJSON('../data/exam_info.json'),
    ]);
    allCerts = cpData.certs;
    allExams = examList;
    infoList.forEach(info => { infoMap[info.id] = info; });

    setupSearch();
    setupFilters();
    renderCerts();
  } catch (err) {
    console.error('자격증 목록 초기화 실패:', err);
    const grid = document.getElementById('certGrid');
    if (grid) grid.innerHTML = '<div class="col-span-2 text-center text-on-surface-variant py-8">데이터를 불러오는 데 실패했습니다.</div>';
  }
});

function getFilteredCerts() {
  return allCerts.filter(cert => {
    let catMatch;
    if (activeCategory === '전체')          catMatch = true;
    else if (activeCategory === '내 자격증') catMatch = isFavorite(cert.name);
    else                                     catMatch = cert.category.includes(activeCategory);

    const keyword     = searchKeyword.trim().toLowerCase();
    const searchMatch = !keyword || cert.name.toLowerCase().includes(keyword);
    return catMatch && searchMatch;
  });
}

function getNextExamDate(certName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allExams
    .filter(e => e.name === certName && e.exam_date && new Date(e.exam_date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))[0]?.exam_date || null;
}

function renderCerts() {
  const grid     = document.getElementById('certGrid');
  const countEl  = document.getElementById('certCount');
  if (!grid) return;

  const filtered = getFilteredCerts();
  if (countEl) countEl.textContent = `${filtered.length}개`;

  if (!filtered.length) {
    grid.innerHTML = '<div class="col-span-2 text-center text-on-surface-variant py-16">검색 결과가 없습니다.</div>';
    return;
  }

  grid.innerHTML = filtered.map(cert => {
    const info      = infoMap[cert.id];
    const desc      = info?.description || '';
    const nextDate  = getNextExamDate(cert.name);
    const dd        = nextDate ? dDay(nextDate) : null;
    const isFav     = isFavorite(cert.name);
    const lvl       = LEVEL_STYLE[cert.level] || { bg: 'bg-surface-container-highest', text: 'text-on-surface-variant' };
    const nameSafe  = cert.name.replace(/'/g, "\\'");

    const ddColor = dd === 'D-DAY'
      ? 'text-error font-bold'
      : (dd && parseInt(dd.replace('D-', '')) <= 14) ? 'text-tertiary font-bold'
      : 'text-on-surface-variant';

    return `<div class="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4 cursor-pointer hover:bg-surface-container transition-colors active:scale-[0.98] duration-150" onclick="location.href='cert-detail.html#${cert.id}'">
      <div class="flex justify-between items-start">
        <div class="flex flex-wrap gap-1.5">
          <span class="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold">${cert.category[0]}</span>
          <span class="px-2.5 py-0.5 ${lvl.bg} ${lvl.text} text-[10px] rounded-full font-bold">${cert.level}</span>
        </div>
        <button class="p-1 -mt-1 -mr-1 rounded-full hover:bg-surface-container-highest transition-colors" style="color:${isFav ? 'rgb(231,76,60)' : '#8e90a2'}" onclick="event.stopPropagation(); toggleFavCard('${nameSafe}', this)" title="${isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' ${isFav ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 24;">favorite</span>
        </button>
      </div>
      <div class="flex-1">
        <h3 class="font-bold text-base text-on-surface leading-snug">${cert.name}</h3>
        ${desc ? `<p class="text-on-surface-variant text-xs mt-1.5 leading-relaxed line-clamp-2">${desc}</p>` : ''}
      </div>
      <div class="flex items-center justify-between pt-3 border-t border-white/5">
        <span class="text-on-surface-variant text-xs">${nextDate ? `다음 시험: ${fmtShortDate(nextDate)}` : '일정 없음'}</span>
        <span class="text-xs ${ddColor}">${dd || ''}</span>
      </div>
    </div>`;
  }).join('');
}

function toggleFavCard(name, btn) {
  const isNowFav = toggleFavorite(name);
  const icon     = btn.querySelector('.material-symbols-outlined');
  if (icon) icon.style.fontVariationSettings = `'FILL' ${isNowFav ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 24`;
  btn.style.color = isNowFav ? 'rgb(231,76,60)' : '#8e90a2';
  btn.title       = isNowFav ? '즐겨찾기 해제' : '즐겨찾기 추가';
  if (activeCategory === '내 자격증') renderCerts();
}

function setupFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;

  const cats = ['전체', '내 자격증', '데이터/IT', '회계/세무', '금융/투자', '무역/물류', '인사/컨설팅', '공용'];
  container.innerHTML = cats.map(cat => {
    const active = cat === activeCategory;
    return `<button class="filter-chip flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${active ? 'bg-primary-container text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}" data-cat="${cat}">${cat}</button>`;
  }).join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    container.querySelectorAll('.filter-chip').forEach(b => {
      b.classList.remove('bg-primary-container', 'text-white');
      b.classList.add('bg-surface-container-high', 'text-on-surface-variant', 'hover:bg-surface-container-highest');
    });
    btn.classList.remove('bg-surface-container-high', 'text-on-surface-variant', 'hover:bg-surface-container-highest');
    btn.classList.add('bg-primary-container', 'text-white');
    activeCategory = btn.dataset.cat;
    renderCerts();
  });
}

function setupSearch() {
  const input = document.getElementById('certSearch');
  if (!input) return;
  let debounce = null;
  input.addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchKeyword = e.target.value;
      renderCerts();
    }, 200);
  });
}
