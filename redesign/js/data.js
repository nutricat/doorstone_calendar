/**
 * data.js — Shared data layer for redesign pages
 * Load this before page-specific JS files.
 */

const NAME_TO_INFO_ID = {
  // 데이터/IT
  'SQLD':                  'sqld',
  '빅데이터분석기사':       'bigdata',
  'ADsP':                  'adsp',
  'ADP':                   'adp',
  '사회조사분석사2급':      'sa-2',
  '컴퓨터활용능력 2급':    'com-2',
  '컴퓨터활용능력 1급':    'com-1',
  // 회계/세무
  '재경관리사':             'at-manager',
  '회계관리':               'at-accounting',
  'TAT/FAT':               'tat-fat',
  'ERP정보관리사':          'erp-info',
  '전산세무회계':           'tax-accounting',
  // 금융/투자
  '증권투자자권유자문인력': 'kofia-adv',
  '증권투자권유대행인':     'kofia-rep',
  '투자자산운용사':         'kofia-im',
  '금융투자분석사':         'kofia-fa',
  '재무위험관리사':         'kofia-frm',
  '펀드투자권유자문인력':   'fund-adv',
  '신용분석사':             'cca',
  'AFPK':                   'afpk',
  'CFP':                    'cfp',
  'CFA 1차':                'cfa-1',
  '공인중개사':             'realtor',
  '외환전문역 1,2종':       'fx-specialist',
  // 무역/물류
  '물류관리사':             'lom-30',
  '유통관리사':             'distributor',
  '무역영어':               'trade-eng-1',
  '국제무역사':             'itc',
  '보세사':                 'bonded-goods',
  // 인사/컨설팅
  '경영지도사':             'mca',
  'HRM전문가':              'hrm-expert',
  // 공용
  'TOEIC':                  'toeic',
  'OPIc':                   'opic',
  'TOEIC Speaking':         'toeic-speaking',
  '한국사능력검정시험':     'k-history',
  'KBS한국어능력시험':      'kbs-kr',
  '한자능력검정시험':       'k-kanji-1',
  '한자급수자격검정':       'k-kanji-2',
  '전산회계 1급':           '전산회계1급',
  'CPIM':                   'cpim',
};

const INFO_ID_TO_NAME = Object.fromEntries(
  Object.entries(NAME_TO_INFO_ID).map(([name, id]) => [id, name])
);

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  return res.json();
}

// "2026-05-03" → "5월 3일"
function fmtMonthDay(str) {
  if (!str) return '';
  const [, m, d] = str.split('-');
  return `${parseInt(m)}월 ${parseInt(d)}일`;
}

// "2026-05-03" → "5.03"
function fmtShortDate(str) {
  if (!str) return '-';
  const [, m, d] = str.split('-');
  return `${parseInt(m)}.${parseInt(d).toString().padStart(2, '0')}`;
}

// "2026-05-03" → "5/3 (일)"
function fmtFullDate(str) {
  if (!str) return '';
  const date = new Date(str + 'T00:00:00');
  const day = ['일','월','화','수','목','금','토'][date.getDay()];
  return `${date.getMonth() + 1}/${date.getDate()} (${day})`;
}

/**
 * Returns "D-DAY", "D-N" for future dates, or null for past dates.
 */
function dDay(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'D-DAY';
  if (diff > 0) return `D-${diff}`;
  return null;
}

function getCategoryIcon(category) {
  const icons = {
    '데이터/IT':   'terminal',
    '회계/세무':   'calculate',
    '금융/투자':   'trending_up',
    '무역/물류':   'local_shipping',
    '인사/컨설팅': 'groups',
    '공용':        'language',
  };
  return icons[category] || 'workspace_premium';
}
