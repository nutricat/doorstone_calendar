/**
 * favorites.js — LocalStorage 즐겨찾기 헬퍼
 * index.html, detail.html 양쪽에서 공통으로 사용
 */

const FAV_KEY = 'cert_favorites';

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch { return []; }
}

function isFavorite(name) {
  return getFavorites().includes(name);
}

/**
 * 즐겨찾기 토글. 추가되면 true, 제거되면 false 반환.
 */
function toggleFavorite(name) {
  const favs = getFavorites();
  const idx  = favs.indexOf(name);
  if (idx === -1) favs.push(name);
  else            favs.splice(idx, 1);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return idx === -1;
}
