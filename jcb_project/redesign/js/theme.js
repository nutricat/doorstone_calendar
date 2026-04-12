/**
 * theme.js — Light / Dark theme management
 *
 * Load order: inject CSS → apply stored theme (prevents FOUC) → on DOMContentLoaded: picker + toggle btn
 *
 * localStorage key: 'theme'  values: 'light' | 'dark'
 * First visit (no value stored): show picker modal
 */

// ── 1. Inject light-theme override CSS ──────────────────────────────────────
(function () {
  if (document.getElementById('lightThemeCSS')) return;
  const s = document.createElement('style');
  s.id = 'lightThemeCSS';
  s.textContent = `
/* ═══════════════ LIGHT THEME ═══════════════
   Design tokens:
   --background : #f8f9fa   page bg
   --surface    : #ffffff   card bg
   --primary    : #2d5bff   brand blue (unchanged)
   --text-main  : #1a1a1a   bold / heading text
   --text-body  : #4b5563   body paragraph text
   --text-sub   : #6b7280   secondary / metadata
   --text-muted : #9ca3af   muted / disabled
   --border     : #e5e7eb   card & input borders
   --border-alt : #f3f4f6   light dividers
   --info-bg    : #f3f4f6   info / chip backgrounds
   --card-shadow: 0 1px 3px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.04)
══════════════════════════════════════════════ */

html.light { color-scheme: light; }

/* Page & body */
html.light body { background-color: #f8f9fa !important; color: #1a1a1a !important; }

/* Top header — white with hairline border */
html.light header.fixed {
  background-color: rgba(255,255,255,0.98) !important;
  border-bottom: 1px solid #f3f4f6 !important;
}

/* Bottom nav pill — white pill with soft shadow */
html.light nav.fixed > div {
  background-color: rgba(255,255,255,0.96) !important;
  box-shadow: 0 2px 20px rgba(0,0,0,0.10) !important;
}
html.light nav.fixed a,
html.light nav.fixed div { color: #6b7280 !important; }

/* ── Backgrounds ── */
html.light .bg-\\[\\#000000\\]      { background-color: #f8f9fa !important; }
html.light .bg-\\[\\#131313\\]      { background-color: #f8f9fa !important; }
html.light .bg-\\[\\#14141e\\]      { background-color: #f8f9fa !important; }
html.light .bg-\\[\\#1b1b1b\\]      { background-color: #ffffff !important; box-shadow: 0 1px 3px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.04) !important; }
html.light .bg-\\[\\#1f1f1f\\]      { background-color: #ffffff !important; }
html.light .bg-\\[\\#252525\\]      { background-color: #f3f4f6 !important; }
html.light .bg-\\[\\#2a2a2a\\]      { background-color: #f3f4f6 !important; }
html.light .bg-\\[\\#353535\\]      { background-color: #e5e7eb !important; }
html.light .bg-\\[\\#393939\\]      { background-color: #d1d5db !important; }
html.light .bg-\\[\\#353535\\]\\/70 { background-color: rgba(255,255,255,0.96) !important; }
html.light .bg-\\[\\#131313\\]\\/80 { background-color: rgba(255,255,255,0.98) !important; }
html.light .bg-\\[\\#2d5bff\\]\\/20 { background-color: rgba(45,91,255,0.08) !important; }
html.light .bg-\\[\\#2d5bff\\]\\/15 { background-color: rgba(45,91,255,0.06) !important; }
html.light .bg-\\[\\#2d5bff\\]      { background-color: #2d5bff !important; }
html.light .bg-\\[\\#434656\\]      { background-color: #e5e7eb !important; }

/* Hover overrides */
html.light .hover\\:bg-\\[\\#222\\]:hover         { background-color: #f3f4f6 !important; }
html.light .hover\\:bg-\\[\\#252525\\]:hover      { background-color: #ebebeb !important; }
html.light .hover\\:bg-white\\/10:hover          { background-color: rgba(0,0,0,0.04) !important; }
html.light .hover\\:bg-white\\/5:hover           { background-color: rgba(0,0,0,0.03) !important; }
html.light .hover\\:bg-\\[\\#2d5bff\\]\\/20:hover { background-color: rgba(45,91,255,0.08) !important; }

/* ── Text colors ── */
html.light .text-\\[\\#e2e2e2\\] { color: #1a1a1a !important; }
html.light .text-\\[\\#c4c5d9\\] { color: #4b5563 !important; }
html.light .text-\\[\\#8e90a2\\] { color: #6b7280 !important; }
html.light .text-\\[\\#434656\\] { color: #9ca3af !important; }
html.light .text-\\[\\#b8c3ff\\] { color: #2d5bff !important; }
html.light .text-white          { color: #1a1a1a !important; }

/* Primary brand text keeps blue */
html.light h1.text-\\[\\#b8c3ff\\] { color: #2d5bff !important; }

/* ── Borders ── */
html.light .border-white\\/5  { border-color: #e5e7eb !important; }
html.light .border-white\\/10 { border-color: #e5e7eb !important; }

/* ── Featured card gradient ── */
html.light section.cursor-pointer { background-color: #ffffff !important; box-shadow: 0 1px 3px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.04) !important; }
html.light .from-\\[\\#2d5bff\\]\\/20 { --tw-gradient-from: rgba(45,91,255,0.06) var(--tw-gradient-from-position) !important; }
html.light .via-\\[\\#14141e\\]       { --tw-gradient-stops: var(--tw-gradient-from), rgba(255,255,255,0.85) var(--tw-gradient-via-position), var(--tw-gradient-to) !important; }
html.light .to-\\[\\#131313\\]        { --tw-gradient-to: #ffffff var(--tw-gradient-to-position) !important; }
/* ── Book/detail gradient overlays ── */
html.light .from-surface-container-low { --tw-gradient-from: #ffffff var(--tw-gradient-from-position) !important; }

/* ── Track chips / active nav item ── */
html.light .bg-\\[\\#2d5bff\\].text-white { background-color: #2d5bff !important; color: #fff !important; }

/* ── Transparent-tint backgrounds ── */
html.light .bg-white\\/5 { background-color: rgba(0,0,0,0.03) !important; }

/* ── Semantic Tailwind tokens ── */
html.light .bg-surface-container-lowest  { background-color: #f9fafb !important; }
html.light .bg-surface-container-low     { background-color: #ffffff !important; box-shadow: 0 1px 3px rgba(0,0,0,0.07),0 1px 2px rgba(0,0,0,0.04) !important; }
html.light .bg-surface-container         { background-color: #f9fafb !important; }
html.light .bg-surface-container-high    { background-color: #f3f4f6 !important; }
html.light .bg-surface-container-highest { background-color: #e5e7eb !important; }
html.light .text-on-surface              { color: #1a1a1a !important; }
html.light .text-on-surface-variant      { color: #6b7280 !important; }
html.light .text-outline                 { color: #9ca3af !important; }
html.light .text-primary                 { color: #2d5bff !important; }
html.light .border-outline-variant\\/5  { border-color: #f3f4f6 !important; }
html.light .border-outline-variant\\/10 { border-color: #e5e7eb !important; }
html.light .border-outline-variant\\/30 { border-color: #e5e7eb !important; }
html.light .hover\\:bg-surface-container:hover         { background-color: #f3f4f6 !important; }
html.light .hover\\:bg-surface-container-highest:hover { background-color: #e5e7eb !important; }
html.light .focus\\:ring-primary-container:focus        { --tw-ring-color: rgba(45,91,255,0.30) !important; }

/* ── FullCalendar ── */
html.light .fc {
  --fc-border-color: #e5e7eb !important;
  --fc-today-bg-color: rgba(45,91,255,0.07) !important;
  --fc-page-bg-color: #ffffff !important;
  --fc-neutral-bg-color: #f9fafb !important;
  --fc-list-event-hover-bg-color: #f3f4f6 !important;
}
html.light .fc .fc-toolbar-title           { color: #2d5bff !important; }
html.light .fc .fc-col-header-cell-cushion { color: #6b7280 !important; }
html.light .fc .fc-daygrid-day-number      { color: #1a1a1a !important; }
html.light .fc .fc-day-today .fc-daygrid-day-number { color: #2d5bff !important; font-weight:700; }
html.light .fc .fc-daygrid-day.fc-day-other .fc-daygrid-day-number { color: #9ca3af !important; }
html.light .fc .fc-scrollgrid td,
html.light .fc .fc-scrollgrid th          { border-color: #e5e7eb !important; }
html.light .fc .fc-popover                { background: #ffffff !important; border-color: #e5e7eb !important; box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; }
html.light .fc .fc-popover-title          { background: #f3f4f6 !important; color: #1a1a1a !important; }
html.light .fc .fc-popover-close          { color: #6b7280 !important; }
html.light .fc .fc-more-link              { color: #2d5bff !important; }
html.light .fc .fc-today-button           { background: #f3f4f6 !important; color: #2d5bff !important; }
html.light .fc .fc-scrollgrid             { border-bottom: none !important; }
html.light .fc-event.event-reg-start { background: #22c55e !important; color: #ffffff !important; border-left-color: #16a34a !important; }
html.light .fc-event.event-reg-end   { background: #ef4444 !important; color: #ffffff !important; border-left-color: #dc2626 !important; }
html.light .fc-event.event-exam      { background: #3b82f6 !important; color: #ffffff !important; border-left-color: #2563eb !important; }

/* ── Search input ── */
html.light input[type="text"] {
  background-color: #ffffff !important;
  color: #1a1a1a !important;
  border-color: #e5e7eb !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
}
html.light input[type="text"]::placeholder { color: #9ca3af !important; }
html.light #calendarSearchDropdown,
html.light #certSearchDropdown {
  background-color: #ffffff !important;
  border-color: #e5e7eb !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}
html.light #calendarSearchDropdown li:hover,
html.light #certSearchDropdown li:hover { background-color: #f3f4f6 !important; }

/* ── Theme toggle btn ── */
html.light #themeToggleBtn { color: #6b7280 !important; }
html.light #themeToggleBtn:hover { background-color: rgba(0,0,0,0.05) !important; }

/* ── Dividers & rings ── */
html.light .divide-white\\/5 > * + * { border-color: #f3f4f6 !important; }
html.light .ring-black { --tw-ring-color: #f8f9fa !important; }

/* ── Opacity-variant backgrounds ── */
html.light .bg-surface-container-highest\\/30 { background-color: rgba(0,0,0,0.03) !important; }

/* ── My-Certs card border ── */
html.light .squircle.border-2             { border-color: #e5e7eb !important; }
html.light .hover\\:border-primary\\/20:hover { border-color: rgba(45,91,255,0.20) !important; }

/* ── Error / status token ── */
html.light .text-error { color: #dc2626 !important; }

/* ── Detail page: primary-container softened ── */
html.light #examTypeCard   { background-color: #eff6ff !important; color: #1d4ed8 !important; box-shadow: none !important; border: 1px solid #bfdbfe !important; }
html.light #certDifficulty { background-color: #eff6ff !important; color: #1d4ed8 !important; }
html.light .text-on-primary-container\\/80 { color: rgba(29,78,216,0.8) !important; }

/* ── Transition for smooth switch ── */
html.light *, html.dark * {
  transition: background-color .2s ease, color .15s ease, border-color .2s ease;
}
  `;
  document.head.appendChild(s);
})();

// ── 2. Apply stored theme immediately (FOUC prevention) ──────────────────────
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else if (saved === 'dark') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
  // No saved value → keep HTML default ('dark'), show picker on load
})();

// ── 3. DOM-ready: picker + toggle button ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Show first-time picker if no preference saved
  if (!localStorage.getItem('theme')) {
    showThemePicker();
  }

  // Wire up toggle button (if present in header)
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    syncToggleIcon(btn);
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
      syncToggleIcon(btn);
    });
  }
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function applyTheme(theme) {
  localStorage.setItem('theme', theme);
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.backgroundColor = '#f8f9fa';
    document.documentElement.style.color = '#1a1a1a';
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '';
    document.documentElement.style.color = '';
  }
}

function syncToggleIcon(btn) {
  const icon = btn.querySelector('.material-symbols-outlined');
  const isDark = document.documentElement.classList.contains('dark');
  if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  btn.title = isDark ? '라이트 모드로 변경' : '다크 모드로 변경';
}

function showThemePicker() {
  // Inject animation if needed
  if (!document.getElementById('themePickerStyle')) {
    const s = document.createElement('style');
    s.id = 'themePickerStyle';
    s.textContent = `
      @keyframes tpFadeIn  { from { opacity:0 } to { opacity:1 } }
      @keyframes tpSlideUp { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
      .tp-overlay { animation: tpFadeIn .25s ease both; }
      .tp-card    { animation: tpSlideUp .3s cubic-bezier(.22,1,.36,1) both; }
      .tp-option  { cursor:pointer; border:2px solid transparent; border-radius:1rem; padding:1.5rem 1rem;
                    display:flex; flex-direction:column; align-items:center; gap:.75rem;
                    transition:border-color .15s, transform .15s; flex:1; }
      .tp-option:hover { transform:translateY(-2px); }
      .tp-option.selected { border-color:#2d5bff; }
    `;
    document.head.appendChild(s);
  }

  const overlay = document.createElement('div');
  overlay.className = 'tp-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:300',
    'display:flex', 'align-items:flex-end', 'justify-content:center',
    'padding:0 1rem 5rem',
    'background:rgba(0,0,0,0.65)',
    'backdrop-filter:blur(6px)', '-webkit-backdrop-filter:blur(6px)',
  ].join(';');

  overlay.innerHTML = `
    <div class="tp-card" style="
      width:100%; max-width:26rem;
      background:#1a1a1a; border:1px solid #353535; border-radius:1.5rem;
      padding:1.75rem 1.25rem 1.25rem;
      box-shadow:0 32px 80px rgba(0,0,0,0.8);
    ">
      <p style="text-align:center;font-size:.7rem;font-weight:700;letter-spacing:.12em;color:#8e90a2;text-transform:uppercase;margin-bottom:.5rem;">테마 선택</p>
      <h2 style="text-align:center;font-size:1rem;font-weight:800;color:#e2e2e2;margin-bottom:.25rem;">어떤 화면이 편하세요?</h2>
      <p style="text-align:center;font-size:.75rem;color:#8e90a2;margin-bottom:1.25rem;">나중에 언제든 바꿀 수 있어요</p>

      <div style="display:flex;gap:.75rem;margin-bottom:1rem;">

        <!-- Light option -->
        <div class="tp-option" id="tp-light" style="background:#f5f6f7;">
          <span style="font-size:2rem;">☀️</span>
          <div style="text-align:center;">
            <p style="font-size:.875rem;font-weight:700;color:#212529;">라이트</p>
            <p style="font-size:.7rem;color:#6c757d;margin-top:.2rem;">밝고 깔끔한 화면</p>
          </div>
        </div>

        <!-- Dark option -->
        <div class="tp-option" id="tp-dark" style="background:#1f1f1f; border-color:#434656;">
          <span style="font-size:2rem;">🌙</span>
          <div style="text-align:center;">
            <p style="font-size:.875rem;font-weight:700;color:#e2e2e2;">다크</p>
            <p style="font-size:.7rem;color:#8e90a2;margin-top:.2rem;">눈이 편한 어두운 화면</p>
          </div>
        </div>
      </div>

      <button id="tp-confirm" style="
        width:100%; padding:.75rem;
        background:#2d5bff; color:#fff; border:none; border-radius:9999px;
        font-size:.8125rem; font-weight:700; cursor:pointer; opacity:.5;
        transition:opacity .15s;
      " disabled>선택해주세요</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const lightOpt   = overlay.querySelector('#tp-light');
  const darkOpt    = overlay.querySelector('#tp-dark');
  const confirmBtn = overlay.querySelector('#tp-confirm');
  let   chosen     = null;

  function selectOption(theme) {
    chosen = theme;
    lightOpt.style.borderColor = theme === 'light' ? '#2d5bff' : 'transparent';
    darkOpt.style.borderColor  = theme === 'dark'  ? '#2d5bff' : '#434656';
    confirmBtn.disabled  = false;
    confirmBtn.style.opacity = '1';
    confirmBtn.textContent = theme === 'light' ? '☀️ 라이트로 시작할게요' : '🌙 다크로 시작할게요';
  }

  lightOpt.addEventListener('click', () => selectOption('light'));
  darkOpt.addEventListener('click',  () => selectOption('dark'));

  confirmBtn.addEventListener('click', () => {
    if (!chosen) return;
    applyTheme(chosen);
    // Sync toggle button if it exists
    const btn = document.getElementById('themeToggleBtn');
    if (btn) syncToggleIcon(btn);
    // Dismiss
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity .2s';
    setTimeout(() => overlay.remove(), 200);
  });
}
