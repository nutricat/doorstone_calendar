/**
 * favorites.js — LocalStorage 즐겨찾기 + 취득 완료 헬퍼
 */

const FAV_KEY      = 'cert_favorites';
const OBTAINED_KEY = 'cert_obtained';

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch { return []; }
}

function isFavorite(name) {
  return getFavorites().includes(name);
}

function toggleFavorite(name) {
  const favs = getFavorites();
  const idx  = favs.indexOf(name);
  if (idx === -1) favs.push(name);
  else            favs.splice(idx, 1);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return idx === -1;
}

// ── 취득 완료 ────────────────────────────────────────────────────────────────

function getObtained() {
  try { return JSON.parse(localStorage.getItem(OBTAINED_KEY)) || []; }
  catch { return []; }
}

function isObtained(name) {
  return getObtained().includes(name);
}

/** 취득 완료 토글. 추가되면 true, 제거되면 false 반환. */
function toggleObtained(name) {
  const list = getObtained();
  const idx  = list.indexOf(name);
  if (idx === -1) list.push(name);
  else            list.splice(idx, 1);
  localStorage.setItem(OBTAINED_KEY, JSON.stringify(list));
  return idx === -1;
}
