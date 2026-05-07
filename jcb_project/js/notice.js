/**
 * notice.js — Site-wide announcement popup
 *
 * To show a new notice: edit data/notice.json
 *   - enabled: true/false  → toggle without deleting content
 *   - id: change this      → forces popup to re-appear for users who already dismissed it
 *   - title / body / cta   → popup text
 */

(async () => {
  try {
    const notice = await fetch('data/notice.json').then(r => r.json());
    if (!notice.enabled) return;

    const STORAGE_KEY = 'seen_notice_id';
    if (localStorage.getItem(STORAGE_KEY) === String(notice.id)) return;

    // ── Build overlay ────────────────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'noticeOverlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:200',
      'display:flex', 'align-items:flex-end', 'justify-content:center',
      'padding:0 1rem 7rem', 'background:rgba(0,0,0,0.55)',
      'backdrop-filter:blur(4px)', '-webkit-backdrop-filter:blur(4px)',
    ].join(';');

    overlay.innerHTML = `
      <div id="noticeCard" style="
        width:100%; max-width:28rem;
        background:#1f1f1f; border:1px solid #353535; border-radius:1.25rem;
        padding:1.5rem; box-shadow:0 24px 60px rgba(0,0,0,0.7);
        animation:noticeSlideUp .25s cubic-bezier(.22,1,.36,1) both;
      ">
        <p style="font-size:.7rem;font-weight:700;letter-spacing:.12em;color:#8e90a2;text-transform:uppercase;margin-bottom:.6rem;">공지</p>
        <h2 style="font-size:1rem;font-weight:800;color:#e2e2e2;margin-bottom:.6rem;line-height:1.4;">${notice.title}</h2>
        <p style="font-size:.8125rem;color:#c4c5d9;line-height:1.6;margin-bottom:1.25rem;">${notice.body}</p>
        <button id="noticeCtaBtn" style="
          width:100%; padding:.7rem 1rem;
          background:#2d5bff; color:#fff; border:none; border-radius:9999px;
          font-size:.8125rem; font-weight:700; cursor:pointer;
          transition:background .15s;
        ">${notice.cta}</button>
      </div>
    `;

    // ── Animation keyframe ───────────────────────────────────────────────────
    if (!document.getElementById('noticeStyle')) {
      const style = document.createElement('style');
      style.id = 'noticeStyle';
      style.textContent = `
        @keyframes noticeSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    // ── Dismiss logic ────────────────────────────────────────────────────────
    function dismiss() {
      localStorage.setItem(STORAGE_KEY, String(notice.id));
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity .2s';
      setTimeout(() => overlay.remove(), 200);
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) dismiss();
    });

    document.body.appendChild(overlay);
    document.getElementById('noticeCtaBtn').addEventListener('click', dismiss);

  } catch (_) {
    // Silently fail — notice is non-critical
  }
})();
