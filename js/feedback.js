/**
 * feedback.js — feedback modal, shared across all redesign pages
 * Submits to Formspree
 */

const FORMSPREE_URL = 'https://formspree.io/f/xwvwdadn';

const CATEGORIES = [
  { label: '잘못된 정보', icon: 'error_outline' },
  { label: '기능 오류',   icon: 'bug_report'    },
  { label: '추가 요청',   icon: 'add_circle'    },
  { label: '디자인 의견', icon: 'palette'        },
  { label: '기타',        icon: 'more_horiz'    },
];

let selectedCategory = null;

function injectModal() {
  const modal = document.createElement('div');
  modal.id = 'feedbackModal';
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:300;align-items:flex-end;justify-content:center;padding:1rem;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);';

  modal.innerHTML = `
    <div id="feedbackSheet" style="background:#1f1f1f;border-radius:1.5rem;width:100%;max-width:28rem;padding:1.5rem;display:flex;flex-direction:column;gap:1.25rem;box-shadow:0 24px 64px rgba(0,0,0,0.7);">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span class="material-symbols-outlined" style="color:#b8c3ff;font-size:1.25rem;">feedback</span>
          <span style="font-weight:700;font-size:1rem;color:#e2e2e2;">피드백 보내기</span>
        </div>
        <button id="feedbackClose" title="닫기" style="color:#8e90a2;background:none;border:none;cursor:pointer;padding:0.25rem;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.15s;" onmouseover="this.style.background='#353535'" onmouseout="this.style.background='none'">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Category chips -->
      <div>
        <p style="color:#8e90a2;font-size:0.75rem;margin-bottom:0.625rem;font-weight:500;">유형 선택</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          ${CATEGORIES.map(c => `
            <button class="feedback-cat" data-cat="${c.label}"
              style="display:flex;align-items:center;gap:0.375rem;padding:0.375rem 0.875rem;border-radius:9999px;border:1px solid #434656;background:#2a2a2a;color:#c4c5d9;font-size:0.8125rem;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:inherit;">
              <span class="material-symbols-outlined" style="font-size:1rem;">${c.icon}</span>
              ${c.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Message -->
      <div>
        <p style="color:#8e90a2;font-size:0.75rem;margin-bottom:0.5rem;font-weight:500;">내용</p>
        <textarea id="feedbackMessage" placeholder="자세한 내용을 입력해주세요..." rows="4"
          style="width:100%;background:#131313;color:#e2e2e2;border:1px solid #434656;border-radius:0.75rem;padding:0.75rem 1rem;font-size:0.875rem;font-family:inherit;resize:none;box-sizing:border-box;outline:none;transition:border-color 0.15s;"
          onfocus="this.style.borderColor='#2d5bff'" onblur="this.style.borderColor='#434656'"></textarea>
      </div>

      <!-- Submit -->
      <button id="feedbackSubmit"
        style="width:100%;background:#2d5bff;color:#fff;font-weight:700;padding:0.75rem 1.5rem;border-radius:9999px;border:none;font-size:0.875rem;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;transition:opacity 0.15s,transform 0.15s;"
        onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'"
        onmousedown="this.style.transform='scale(0.97)'" onmouseup="this.style.transform='scale(1)'">
        <span class="material-symbols-outlined" style="font-size:1.125rem;">send</span>
        보내기
      </button>

      <!-- Status -->
      <div id="feedbackStatus" style="display:none;text-align:center;font-size:0.875rem;padding:0.625rem 1rem;border-radius:0.75rem;"></div>
    </div>
  `;

  document.body.appendChild(modal);
}

function openModal() {
  const modal = document.getElementById('feedbackModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  selectedCategory = null;
}

function closeModal() {
  const modal = document.getElementById('feedbackModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';

  // Reset
  selectedCategory = null;
  const msg = document.getElementById('feedbackMessage');
  if (msg) msg.value = '';
  resetCategoryStyles();

  const status = document.getElementById('feedbackStatus');
  if (status) { status.style.display = 'none'; status.textContent = ''; }

  const submit = document.getElementById('feedbackSubmit');
  if (submit) {
    submit.disabled = false;
    submit.style.display = 'flex';
    submit.innerHTML = '<span class="material-symbols-outlined" style="font-size:1.125rem;">send</span> 보내기';
  }
}

function resetCategoryStyles() {
  document.querySelectorAll('.feedback-cat').forEach(b => {
    b.style.background = '#2a2a2a';
    b.style.color = '#c4c5d9';
    b.style.borderColor = '#434656';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectModal();

  // Open
  const btn = document.getElementById('feedbackBtn');
  if (btn) btn.addEventListener('click', openModal);

  // Close — backdrop click or close button
  document.addEventListener('click', e => {
    if (e.target.id === 'feedbackModal') closeModal();
    if (e.target.closest('#feedbackClose')) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Category selection
  document.addEventListener('click', e => {
    const cat = e.target.closest('.feedback-cat');
    if (!cat) return;
    selectedCategory = cat.dataset.cat;
    resetCategoryStyles();
    cat.style.background = '#2d5bff';
    cat.style.color = '#ffffff';
    cat.style.borderColor = '#2d5bff';
  });

  // Submit
  document.addEventListener('click', async e => {
    const submit = e.target.closest('#feedbackSubmit');
    if (!submit || submit.disabled) return;

    const message = document.getElementById('feedbackMessage').value.trim();
    const status = document.getElementById('feedbackStatus');

    if (!selectedCategory) {
      showStatus('유형을 선택해주세요.', '#ffb4ab', 'rgba(255,180,171,0.08)');
      return;
    }
    if (!message) {
      showStatus('내용을 입력해주세요.', '#ffb4ab', 'rgba(255,180,171,0.08)');
      return;
    }

    submit.disabled = true;
    submit.innerHTML = '<span class="material-symbols-outlined" style="font-size:1.125rem;animation:spin 0.8s linear infinite;">progress_activity</span> 전송 중...';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          message,
          page: location.pathname + location.hash,
        }),
      });

      if (res.ok) {
        submit.style.display = 'none';
        showStatus('✓ 피드백이 전송되었습니다. 감사합니다!', '#b8c3ff', 'rgba(184,195,255,0.1)');
        setTimeout(closeModal, 2200);
      } else {
        throw new Error('server error');
      }
    } catch {
      submit.disabled = false;
      submit.innerHTML = '<span class="material-symbols-outlined" style="font-size:1.125rem;">send</span> 보내기';
      showStatus('전송에 실패했습니다. 다시 시도해주세요.', '#ffb4ab', 'rgba(255,180,171,0.08)');
    }
  });
});

function showStatus(text, color, bg) {
  const status = document.getElementById('feedbackStatus');
  if (!status) return;
  status.textContent = text;
  status.style.color = color;
  status.style.background = bg;
  status.style.display = 'block';
}
