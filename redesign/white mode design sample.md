<!-- My Certs (Light) -->

<!DOCTYPE html>



<html class="light" lang="ko"><head>

<meta charset="utf-8"/>

<meta content="width=device-width, initial-scale=1.0" name="viewport"/>

<title>자취방 - 커뮤니티</title>

<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800\&amp;display=swap" rel="stylesheet"/>

<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1\&amp;display=swap" rel="stylesheet"/>

<style>

&#x20;       :root {

&#x20;           --background: #f8f9fa;

&#x20;           --surface: #ffffff;

&#x20;           --primary: #2d5bff;

&#x20;           --text-primary: #1a1a1a;

&#x20;           --text-secondary: #6b7280;

&#x20;           --border: #e5e7eb;

&#x20;           --card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

&#x20;       }



&#x20;       html.light {

&#x20;           background-color: var(--background);

&#x20;           color: var(--text-primary);

&#x20;       }



&#x20;       body {

&#x20;           font-family: 'Manrope', sans-serif;

&#x20;           background-color: var(--background);

&#x20;       }



&#x20;       .material-symbols-outlined {

&#x20;           font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;

&#x20;       }



&#x20;       .hide-scrollbar::-webkit-scrollbar {

&#x20;           display: none;

&#x20;       }

&#x20;       .hide-scrollbar {

&#x20;           -ms-overflow-style: none;

&#x20;           scrollbar-width: none;

&#x20;       }



&#x20;       .tab-active {

&#x20;           color: var(--primary);

&#x20;           border-bottom: 2px solid var(--primary);

&#x20;       }



&#x20;       .post-card {

&#x20;           background-color: var(--surface);

&#x20;           border: 1px solid var(--border);

&#x20;           border-radius: 12px;

&#x20;           box-shadow: var(--card-shadow);

&#x20;       }

&#x20;   </style>

</head>

<body class="max-w-md mx-auto min-h-screen flex flex-col shadow-xl">

<!-- Header -->

<header class="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">

<div class="flex items-center gap-2">

<h1 class="text-xl font-extrabold text-\[#2d5bff] tracking-tight">자취방</h1>

</div>

<div class="flex items-center gap-4">

<button class="p-1 text-\[#1a1a1a]">

<span class="material-symbols-outlined">search</span>

</button>

<button class="p-1 text-\[#1a1a1a] relative">

<span class="material-symbols-outlined">notifications</span>

<span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>

</button>

</div>

</header>

<!-- Navigation Tabs -->

<nav class="bg-white border-b border-gray-100 flex overflow-x-auto hide-scrollbar">

<button class="px-5 py-3 text-sm font-bold whitespace-nowrap tab-active">전체</button>

<button class="px-5 py-3 text-sm font-medium whitespace-nowrap text-\[#6b7280]">동네정보</button>

<button class="px-5 py-3 text-sm font-medium whitespace-nowrap text-\[#6b7280]">꿀팁공유</button>

<button class="px-5 py-3 text-sm font-medium whitespace-nowrap text-\[#6b7280]">나눔/장터</button>

<button class="px-5 py-3 text-sm font-medium whitespace-nowrap text-\[#6b7280]">고민상담</button>

</nav>

<!-- Content -->

<main class="flex-1 p-4 space-y-4 pb-20">

<!-- Filter/Sorting -->

<div class="flex items-center justify-between mb-2">

<div class="flex items-center gap-2">

<span class="text-xs font-semibold text-\[#6b7280] flex items-center gap-1">

<span class="material-symbols-outlined text-sm">location\_on</span>

&#x20;                   강남구 역삼동

&#x20;               </span>

</div>

<button class="text-xs font-medium text-\[#6b7280] flex items-center gap-1">

&#x20;               최신순 <span class="material-symbols-outlined text-sm">expand\_more</span>

</button>

</div>

<!-- Post 1: Image Post -->

<article class="post-card p-4 space-y-3">

<div class="flex items-center justify-between">

<div class="flex items-center gap-2">

<img alt="avatar" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU0IC82grneE6xD7B5YzV\_bXb3V2DQA0y36sqcPt3CQs0f\_krltMVraQKwmJAihKf\_94hAHD9CSlHFDVnmRH35hNzs9gTvrpcDLwF21Nf0eHbWjLiKqyI3PMYeBBUYIxD-IDYPCsWIL6focv112idWyloCUdKcGkhdjyRTs0oq0u940IwuzgshR7uTlLOaJO756Gn4RdVLnItc5mIrPGv0-FSkolJyIG-HffK4wuF2TRandWpG8ykh-ucCvL9tZZVLDMS8QC5-5MM"/>

<div>

<p class="text-sm font-bold text-\[#1a1a1a]">자취고수99</p>

<p class="text-\[10px] text-\[#6b7280]">3분 전 · 꿀팁공유</p>

</div>

</div>

<button class="text-\[#6b7280]">

<span class="material-symbols-outlined">more\_vert</span>

</button>

</div>

<div class="space-y-2">

<h3 class="text-base font-bold text-\[#1a1a1a] leading-tight">다이소에서 무조건 사야하는 자취 필수템 리스트</h3>

<p class="text-sm text-\[#4b5563] line-clamp-2">오늘 다이소 쇼핑 갔다가 발견한 개꿀템들 공유합니다. 특히 저 틈새 먼지제거 브러쉬는 진짜...</p>

</div>

<div class="relative rounded-lg overflow-hidden h-48 bg-gray-100">

<img alt="post content" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEwIN\_syhuXhY-AIpJwFN6VL0c7kGwxukARWl8zi2a7HyEXI77nCQ5vkVOpI09lHSESI4L-\_kwOQMurf2jl1NIlE5QpY8p27fK8cETlr2O8paqZg7FobYACl8VDHX2EiKsqBL4aj6U1Sp6TdTG\_evzqd9pcQM5d1V8u6hskHHZXaayo3guu\_M18eFBKl6wxxyO\_z-4jzSy7CSZsAE2ivbjcgvKNj-GJbhDLu7QqL\_R5QLZgFA0hK2z\_-pKdLMso8QtdEB8A5FQs2U"/>

</div>

<div class="flex items-center gap-4 pt-1">

<button class="flex items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined text-xl">favorite</span>

<span class="text-xs font-medium">24</span>

</button>

<button class="flex items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined text-xl">chat\_bubble</span>

<span class="text-xs font-medium">12</span>

</button>

<button class="flex items-center gap-1 text-\[#6b7280] ml-auto">

<span class="material-symbols-outlined text-xl">bookmark</span>

</button>

</div>

</article>

<!-- Post 2: Text Post -->

<article class="post-card p-4 space-y-3">

<div class="flex items-center justify-between">

<div class="flex items-center gap-2">

<div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-\[#2d5bff] font-bold text-xs">익</div>

<div>

<p class="text-sm font-bold text-\[#1a1a1a]">익명</p>

<p class="text-\[10px] text-\[#6b7280]">15분 전 · 고민상담</p>

</div>

</div>

<button class="text-\[#6b7280]">

<span class="material-symbols-outlined">more\_vert</span>

</button>

</div>

<div class="space-y-2">

<h3 class="text-base font-bold text-\[#1a1a1a] leading-tight">옆집 소음 때문에 잠을 못자겠어요ㅠㅠ</h3>

<p class="text-sm text-\[#4b5563]">새벽마다 친구들 데려와서 술 마시고 떠드는데 이거 집주인한테 말해야 할까요? 아니면 직접 찾아가는게 나을까요?</p>

</div>

<div class="flex items-center gap-4 pt-1 border-t border-gray-50 mt-2">

<button class="flex items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined text-xl">favorite</span>

<span class="text-xs font-medium">8</span>

</button>

<button class="flex items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined text-xl">chat\_bubble</span>

<span class="text-xs font-medium">32</span>

</button>

<button class="flex items-center gap-1 text-\[#6b7280] ml-auto">

<span class="material-symbols-outlined text-xl">bookmark</span>

</button>

</div>

</article>

<!-- Post 3: Marketplace Post -->

<article class="post-card p-4 flex gap-4">

<div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">

<img alt="item" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4hwmz0FT0ua7TC\_nIjAOdk7EU6v0fqVQFSYyYLCOaqmzOgqNUDRC2I51PR8VOdSoVOHdhXuycqcPq9uY7qYw59NgUH46uPVF97unwIAUxh-5DwEMlcbe3-\_OrsoAidsoGHweRcbjjdjqIHk0R36p3-LUqprGNDtO4BJT\_vsyrhAF-ScHAgDgm6QOeRIc2ixb8Hqn62n3b4qPtsDa8QasqeThKaP69OeJ5PDL1nUsLUkqI5otDlvyV9ytw207c92EQ-FbH5nVYrKg"/>

</div>

<div class="flex-1 flex flex-col justify-between py-0.5">

<div>

<div class="flex items-center gap-1 mb-1">

<span class="px-1.5 py-0.5 rounded bg-orange-100 text-\[#ea580c] text-\[10px] font-bold uppercase">나눔</span>

<span class="text-\[10px] text-\[#6b7280]">나눔/장터</span>

</div>

<h3 class="text-sm font-bold text-\[#1a1a1a] line-clamp-1">아이패드 거치대 무료나눔합니다</h3>

<p class="text-xs text-\[#6b7280] mt-1">사용감 조금 있지만 튼튼해요</p>

</div>

<div class="flex items-center justify-between">

<span class="text-sm font-extrabold text-\[#2d5bff]">0원</span>

<span class="text-\[10px] text-\[#6b7280]">방금 전</span>

</div>

</div>

</article>

</main>

<!-- FAB -->

<button class="fixed bottom-24 right-6 w-14 h-14 bg-\[#2d5bff] text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform">

<span class="material-symbols-outlined text-3xl">edit</span>

</button>

<!-- Bottom Navigation -->

<footer class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">

<button class="flex flex-col items-center gap-1 text-\[#2d5bff]">

<span class="material-symbols-outlined font-variation-fill-1">home</span>

<span class="text-\[10px] font-bold">홈</span>

</button>

<button class="flex flex-col items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined">forum</span>

<span class="text-\[10px] font-medium">커뮤니티</span>

</button>

<button class="flex flex-col items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined">map</span>

<span class="text-\[10px] font-medium">동네정보</span>

</button>

<button class="flex flex-col items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined">person</span>

<span class="text-\[10px] font-medium">마이</span>

</button>

</footer>

<style>

&#x20;       .font-variation-fill-1 {

&#x20;           font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;

&#x20;       }

&#x20;   </style>

</body></html>



<!-- Cert Detail (Light) -->

<!DOCTYPE html>



<html class="light" lang="ko"><head>

<meta charset="utf-8"/>

<meta content="width=device-width, initial-scale=1.0" name="viewport"/>

<title>자취방 - 실물 인증 가이드</title>

<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700\&amp;display=swap" rel="stylesheet"/>

<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1\&amp;display=swap" rel="stylesheet"/>

<style>

&#x20;       :root {

&#x20;           --background: #f8f9fa;

&#x20;           --surface: #ffffff;

&#x20;           --primary: #2d5bff;

&#x20;           --text-main: #1a1a1a;

&#x20;           --text-secondary: #6b7280;

&#x20;           --border: #e5e7eb;

&#x20;       }



&#x20;       html.light {

&#x20;           background-color: var(--background);

&#x20;           color: var(--text-main);

&#x20;       }



&#x20;       body {

&#x20;           font-family: 'Manrope', sans-serif;

&#x20;           background-color: var(--background);

&#x20;           color: var(--text-main);

&#x20;       }



&#x20;       .surface-card {

&#x20;           background-color: var(--surface);

&#x20;           border: 1px solid var(--border);

&#x20;           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

&#x20;       }



&#x20;       .btn-primary {

&#x20;           background-color: var(--primary);

&#x20;           color: white;

&#x20;       }



&#x20;       .text-secondary {

&#x20;           color: var(--text-secondary);

&#x20;       }



&#x20;       .material-symbols-outlined {

&#x20;           font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;

&#x20;       }

&#x20;   </style>

</head>

<body class="antialiased">

<!-- Header -->

<header class="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">

<div class="flex items-center gap-2">

<button class="p-1 -ml-1 text-gray-900">

<span class="material-symbols-outlined text-2xl">arrow\_back</span>

</button>

<h1 class="text-lg font-bold tracking-tight">실물 인증 안내</h1>

</div>

<button class="text-gray-400">

<span class="material-symbols-outlined">help\_outline</span>

</button>

</header>

<main class="max-w-md mx-auto pb-24">

<!-- Hero Section -->

<section class="px-5 py-8">

<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-\[var(--primary)] text-xs font-semibold mb-4">

<span class="material-symbols-outlined text-sm">verified\_user</span>

&#x20;               신뢰도 100% 자취방

&#x20;           </div>

<h2 class="text-2xl font-extrabold leading-tight mb-3">

&#x20;               허위 매물 Zero!<br/>

<span class="text-\[var(--primary)]">실물 인증</span>을 시작합니다

&#x20;           </h2>

<p class="text-secondary text-sm leading-relaxed">

&#x20;               방의 실제 상태를 영상으로 촬영하여 인증하면,<br/>

&#x20;               신뢰도 마크를 획득하고 상단에 노출될 수 있습니다.

&#x20;           </p>

</section>

<!-- Guide Steps -->

<section class="px-5 space-y-4">

<div class="surface-card rounded-2xl p-5 flex gap-4">

<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-\[var(--primary)]">

<span class="material-symbols-outlined">videocam</span>

</div>

<div>

<h3 class="font-bold mb-1 text-\[15px]">1. 30초 실물 영상 촬영</h3>

<p class="text-secondary text-sm leading-snug">현관에서부터 방 전체가 보이도록<br/>천천히 회전하며 촬영해주세요.</p>

</div>

</div>

<div class="surface-card rounded-2xl p-5 flex gap-4">

<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">

<span class="material-symbols-outlined">location\_on</span>

</div>

<div>

<h3 class="font-bold mb-1 text-\[15px]">2. 위치 정보 확인</h3>

<p class="text-secondary text-sm leading-snug">영상 촬영 시점의 GPS 데이터를 통해<br/>매물의 정확한 위치를 검증합니다.</p>

</div>

</div>

<div class="surface-card rounded-2xl p-5 flex gap-4">

<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">

<span class="material-symbols-outlined">new\_releases</span>

</div>

<div>

<h3 class="font-bold mb-1 text-\[15px]">3. 검수 및 마크 부여</h3>

<p class="text-secondary text-sm leading-snug">AI와 운영팀이 24시간 내 검수 후<br/>실물 인증 배지를 달아드려요.</p>

</div>

</div>

</section>

<!-- Notification Card -->

<section class="px-5 mt-8">

<div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">

<h4 class="text-sm font-bold mb-3 flex items-center gap-2">

<span class="material-symbols-outlined text-\[var(--primary)] text-lg">info</span>

&#x20;                   꼭 확인해주세요!

&#x20;               </h4>

<ul class="space-y-2.5">

<li class="flex gap-2 text-xs text-secondary leading-normal">

<span class="mt-0.5">•</span>

<span>필터나 보정 앱을 통한 영상 촬영은 반려될 수 있습니다.</span>

</li>

<li class="flex gap-2 text-xs text-secondary leading-normal">

<span class="mt-0.5">•</span>

<span>개인정보(가족사진, 신분증 등)가 노출되지 않게 유의해주세요.</span>

</li>

<li class="flex gap-2 text-xs text-secondary leading-normal">

<span class="mt-0.5">•</span>

<span>인증된 매물은 수정 시 재인증이 필요할 수 있습니다.</span>

</li>

</ul>

</div>

</section>

</main>

<!-- Bottom Actions -->

<div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/90 backdrop-blur-md border-t border-gray-100">

<button class="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-200">

&#x20;           실물 촬영 시작하기

&#x20;           <span class="material-symbols-outlined text-xl">arrow\_forward</span>

</button>

</div>

</body></html>



<!-- Certs (Light) -->

<!DOCTYPE html>



<html class="light" lang="ko"><head>

<meta charset="utf-8"/>

<meta content="width=device-width, initial-scale=1.0" name="viewport"/>

<title>자취방 - 커뮤니티</title>

<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700\&amp;display=swap" rel="stylesheet"/>

<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1\&amp;display=swap" rel="stylesheet"/>

<style>

&#x20;       :root {

&#x20;           --primary: #2d5bff;

&#x20;           --background: #f8f9fa;

&#x20;           --surface: #ffffff;

&#x20;           --text-primary: #1a1a1a;

&#x20;           --text-secondary: #6b7280;

&#x20;           --border: #e5e7eb;

&#x20;       }



&#x20;       body {

&#x20;           font-family: 'Manrope', sans-serif;

&#x20;           background-color: var(--background);

&#x20;           color: var(--text-primary);

&#x20;           -webkit-tap-highlight-color: transparent;

&#x20;       }



&#x20;       .safe-top { padding-top: env(safe-area-inset-top); }

&#x20;       .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }



&#x20;       .custom-shadow {

&#x20;           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);

&#x20;       }



&#x20;       .active-tab {

&#x20;           color: var(--primary);

&#x20;           border-bottom: 2px solid var(--primary);

&#x20;       }



&#x20;       .post-card {

&#x20;           background-color: var(--surface);

&#x20;           border-bottom: 1px solid var(--border);

&#x20;       }



&#x20;       .category-chip {

&#x20;           background-color: #f3f4f6;

&#x20;           color: #4b5563;

&#x20;       }



&#x20;       .category-chip.active {

&#x20;           background-color: var(--primary);

&#x20;           color: white;

&#x20;       }

&#x20;   </style>

</head>

<body class="bg-\[#f8f9fa] text-\[#1a1a1a]">

<!-- Status Bar Spacer -->

<div class="safe-top bg-white"></div>

<!-- Header -->

<header class="sticky top-0 z-50 bg-white border-b border-gray-200">

<div class="px-4 h-14 flex items-center justify-between">

<h1 class="text-xl font-bold text-\[#1a1a1a]">커뮤니티</h1>

<div class="flex items-center gap-4">

<button class="p-1 text-\[#1a1a1a]">

<span class="material-symbols-outlined">search</span>

</button>

<button class="p-1 text-\[#1a1a1a]">

<span class="material-symbols-outlined">notifications</span>

</button>

</div>

</div>

<!-- Sub Navigation -->

<div class="flex px-4 border-b border-gray-100 overflow-x-auto no-scrollbar">

<button class="px-4 py-3 text-sm font-semibold active-tab whitespace-nowrap">전체</button>

<button class="px-4 py-3 text-sm font-semibold text-\[#6b7280] whitespace-nowrap">인기글</button>

<button class="px-4 py-3 text-sm font-semibold text-\[#6b7280] whitespace-nowrap">정보공유</button>

<button class="px-4 py-3 text-sm font-semibold text-\[#6b7280] whitespace-nowrap">질문/답변</button>

<button class="px-4 py-3 text-sm font-semibold text-\[#6b7280] whitespace-nowrap">나눔/장터</button>

</div>

</header>

<!-- Main Content -->

<main class="pb-24">

<!-- Category Filters -->

<div class="p-4 flex gap-2 overflow-x-auto no-scrollbar bg-white">

<button class="category-chip active px-4 py-1.5 rounded-full text-xs font-medium"># 전체</button>

<button class="category-chip px-4 py-1.5 rounded-full text-xs font-medium"># 자취꿀팁</button>

<button class="category-chip px-4 py-1.5 rounded-full text-xs font-medium"># 인테리어</button>

<button class="category-chip px-4 py-1.5 rounded-full text-xs font-medium"># 동네소식</button>

</div>

<!-- Post List -->

<div class="divide-y divide-gray-100">

<!-- Post 1 -->

<article class="post-card p-4">

<div class="flex items-start justify-between mb-2">

<div class="flex items-center gap-2">

<img alt="avatar" class="w-8 h-8 rounded-full bg-gray-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg7JMu0mIXaaRo21lIjKH8NRVC3108g8UXeH8VXPKRbFOqu19erLIX\_EiPKRaJwkxtxbHZw5TXlZ\_Y6911IIDqq8qXO99UtwLW0uealdtBz0gsWTclNdPusUuHXcTWG38V8-uCk0tu9bGchs3BydovWWpEOUWhPV3muCTj7wmir660b1fnJRnZro-bDfqBjgrB1WGmPxE-ho51T4JHehEyWogoSL-N6Mog3X5tjOR3Yh0WxZV3wp5IRXasCzDg3BevU6wa2Ntg1qU"/>

<div>

<p class="text-sm font-semibold text-\[#1a1a1a]">자취마스터</p>

<p class="text-\[10px] text-\[#6b7280]">5분 전 · 서울 마포구</p>

</div>

</div>

<button class="text-\[#6b7280]">

<span class="material-symbols-outlined text-xl">more\_vert</span>

</button>

</div>

<h2 class="text-base font-bold mb-2 line-clamp-2 text-\[#1a1a1a]">초보 자취생을 위한 다이소 꿀템 10가지 추천합니다!</h2>

<p class="text-sm text-\[#4b5563] mb-3 line-clamp-3">

&#x20;                   벌써 자취 3년차네요. 그동안 써본 다이소 제품들 중에서 정말 가성비 최고라고 느꼈던 것들만 모아봤습니다. 특히 3번...

&#x20;               </p>

<div class="flex items-center gap-4 text-\[#6b7280]">

<div class="flex items-center gap-1">

<span class="material-symbols-outlined text-lg">favorite</span>

<span class="text-xs">124</span>

</div>

<div class="flex items-center gap-1">

<span class="material-symbols-outlined text-lg">chat\_bubble</span>

<span class="text-xs">48</span>

</div>

<div class="flex items-center gap-1">

<span class="material-symbols-outlined text-lg">visibility</span>

<span class="text-xs">1.2k</span>

</div>

</div>

</article>

<!-- Post 2 (with Image) -->

<article class="post-card p-4">

<div class="flex items-start justify-between mb-2">

<div class="flex items-center gap-2">

<img alt="avatar" class="w-8 h-8 rounded-full bg-gray-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQgpfS1DYmxDELJ4vW6Jw5sq6KfAkLg8Zs\_tZAjvWRrJVzVK2mTVZZqEQqbQYDHs0dXpLSXtQZC3z9ecW1iiAXwAhJdFanhqMU6n\_XfbZ\_0JWT900kN3MezuO6Zok6f5AYZfXAIql8dlXo7HFR4iDHQRc06V0rr2CA5U1f6ZaM0nnZ\_zDK7P9pRsIMsVooVGBeJeaavCXFosxxmtl0UwT5P1KNDW2tuyrXt67c7MGreWkn9aBlcSEMK9INWJZ4LD\_GiS25pLXl2EE"/>

<div>

<p class="text-sm font-semibold text-\[#1a1a1a]">미니멀리스트</p>

<p class="text-\[10px] text-\[#6b7280]">20분 전 · 부산 해운대구</p>

</div>

</div>

</div>

<div class="flex gap-4">

<div class="flex-1">

<h2 class="text-base font-bold mb-2 line-clamp-2 text-\[#1a1a1a]">오늘의 자취방 저녁 메뉴! 간단한 토마토 파스타</h2>

<p class="text-sm text-\[#4b5563] mb-3 line-clamp-2">

&#x20;                           퇴근하고 너무 귀찮아서 그냥 시판 소스에 면만 삶아서 먹으려다...

&#x20;                       </p>

</div>

<div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">

<img alt="food" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAppV3ULCe3GAph1\_sELImo9-uypyxiptO9pZ4EjESX-SsZNnqhfDNij--dJbm\_fjxXG4Vh8prxmpbc3ni6G2\_TOk2QzNqnONuLzmWiFet00145eD-Jq4LA7RYmbUTIjSolMe4QIhacc8uOeDuZyDdN32iOAbod61uY3lKe-whYQAydj8NLwqBT14\_8rqiQ5fOHxa1xUkgnw\_lmF5JruOO8GMYNTfQyf6-kJUY-d1sVfibDRNIKlp3ViwDu0zbJZSAskLSxOkOLaQw"/>

</div>

</div>

<div class="flex items-center gap-4 text-\[#6b7280]">

<div class="flex items-center gap-1">

<span class="material-symbols-outlined text-lg">favorite</span>

<span class="text-xs">85</span>

</div>

<div class="flex items-center gap-1">

<span class="material-symbols-outlined text-lg">chat\_bubble</span>

<span class="text-xs">12</span>

</div>

</div>

</article>

<!-- Post 3 -->

<article class="post-card p-4">

<div class="flex items-start justify-between mb-2">

<div class="flex items-center gap-2">

<img alt="avatar" class="w-8 h-8 rounded-full bg-gray-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRZyIxf149K-kU-UcpKOvNQMQboVFFAYRr2Ubv\_js6BAwQTXYF-1RrbAT5aa8SKttceLezGxEt7eJn8aghK-5dj9D8IsX9806J06rptBhzs\_jPR74J7CJgOdxYuHpwaBl-MdUMF30JNA2zQoVzpzozyAXrpBSW1mnyLZQY62-aVWnzXMtlXILHBzeLIa6LZ9dwdj7L8PUZQb7uvMCuAMRGb5nCX2jx4Ac\_szKTU3f0XstVilgrhqjjz53xNB8M-yVTqWvTqxOT7no"/>

<div>

<p class="text-sm font-semibold text-\[#1a1a1a]">방구석인테리어</p>

<p class="text-\[10px] text-\[#6b7280]">1시간 전 · 경기도 수원시</p>

</div>

</div>

</div>

<h2 class="text-base font-bold mb-2 text-\[#1a1a1a]">6평 원룸 가구 배치 고민입니다 ㅠㅠ</h2>

<p class="text-sm text-\[#4b5563] mb-3">침대를 창가로 옮기는게 좋을까요? 아니면 문 옆이 나을까요?</p>

<div class="flex items-center gap-4 text-\[#6b7280]">

<div class="flex items-center gap-1 text-\[#2d5bff]">

<span class="material-symbols-outlined text-lg">favorite</span>

<span class="text-xs">24</span>

</div>

<div class="flex items-center gap-1">

<span class="material-symbols-outlined text-lg">chat\_bubble</span>

<span class="text-xs">31</span>

</div>

</div>

</article>

</div>

</main>

<!-- Floating Action Button -->

<button class="fixed bottom-20 right-4 w-14 h-14 bg-\[#2d5bff] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40">

<span class="material-symbols-outlined text-3xl">edit</span>

</button>

<!-- Bottom Navigation -->

<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">

<div class="flex justify-around items-center h-16">

<button class="flex flex-col items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined">home</span>

<span class="text-\[10px]">홈</span>

</button>

<button class="flex flex-col items-center gap-1 text-\[#2d5bff]">

<span class="material-symbols-outlined font-fill">forum</span>

<span class="text-\[10px]">커뮤니티</span>

</button>

<button class="flex flex-col items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined">map</span>

<span class="text-\[10px]">동네</span>

</button>

<button class="flex flex-col items-center gap-1 text-\[#6b7280]">

<span class="material-symbols-outlined">person</span>

<span class="text-\[10px]">마이</span>

</button>

</div>

</nav>

</body></html>



<!-- Calendar (Light) -->

<!DOCTYPE html>



<html class="light" lang="ko"><head>

<meta charset="utf-8"/>

<meta content="width=device-width, initial-scale=1.0" name="viewport"/>

<title>자취방 - 커뮤니티</title>

<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700\&amp;display=swap" rel="stylesheet"/>

<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1\&amp;display=swap" rel="stylesheet"/>

<script>

&#x20;       tailwind.config = {

&#x20;           darkMode: 'class',

&#x20;           theme: {

&#x20;               extend: {

&#x20;                   colors: {

&#x20;                       primary: '#2d5bff',

&#x20;                       background: '#f8f9fa',

&#x20;                       surface: '#ffffff',

&#x20;                       text: '#1a1a1a',

&#x20;                       secondary: '#6b7280',

&#x20;                       border: '#e5e7eb',

&#x20;                   },

&#x20;                   fontFamily: {

&#x20;                       sans: \['Manrope', 'sans-serif'],

&#x20;                   },

&#x20;                   borderRadius: {

&#x20;                       'custom': '8px',

&#x20;                   }

&#x20;               }

&#x20;           }

&#x20;       }

&#x20;   </script>

<style>

&#x20;       body {

&#x20;           font-family: 'Manrope', sans-serif;

&#x20;           background-color: #f8f9fa;

&#x20;           color: #1a1a1a;

&#x20;       }

&#x20;       .material-symbols-outlined {

&#x20;           font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;

&#x20;       }

&#x20;       .safe-area-bottom {

&#x20;           padding-bottom: env(safe-area-inset-bottom);

&#x20;       }

&#x20;       .custom-shadow {

&#x20;           box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

&#x20;       }

&#x20;   </style>

</head>

<body class="bg-background text-text antialiased">

<!-- Header -->

<header class="sticky top-0 z-50 bg-surface border-b border-border px-4 h-14 flex items-center justify-between">

<div class="flex items-center gap-2">

<span class="text-primary font-bold text-xl tracking-tight">JACHWIBANG</span>

</div>

<div class="flex items-center gap-4 text-text">

<button class="material-symbols-outlined">search</button>

<button class="material-symbols-outlined">notifications</button>

</div>

</header>

<main class="pb-20">

<!-- Hot Topics Horizontal Scroll -->

<section class="py-4 overflow-hidden">

<div class="px-4 mb-3 flex justify-between items-center">

<h2 class="font-bold text-lg">실시간 핫게시물</h2>

<button class="text-secondary text-sm flex items-center">전체보기 <span class="material-symbols-outlined text-sm">chevron\_right</span></button>

</div>

<div class="flex overflow-x-auto gap-3 px-4 no-scrollbar">

<div class="flex-shrink-0 w-64 bg-surface border border-border p-4 rounded-custom custom-shadow">

<span class="text-xs font-semibold text-primary mb-2 block">자취꿀팁</span>

<h3 class="font-bold mb-2 line-clamp-2">여름철 초파리 박멸하는 가장 확실한 방법 3가지</h3>

<div class="flex items-center gap-3 text-secondary text-xs">

<span class="flex items-center gap-1"><span class="material-symbols-outlined text-\[14px]">favorite</span> 128</span>

<span class="flex items-center gap-1"><span class="material-symbols-outlined text-\[14px]">chat\_bubble</span> 42</span>

</div>

</div>

<div class="flex-shrink-0 w-64 bg-surface border border-border p-4 rounded-custom custom-shadow">

<span class="text-xs font-semibold text-primary mb-2 block">요리/레시피</span>

<h3 class="font-bold mb-2 line-clamp-2">편의점 재료로 만드는 역대급 명란 파스타</h3>

<div class="flex items-center gap-3 text-secondary text-xs">

<span class="flex items-center gap-1"><span class="material-symbols-outlined text-\[14px]">favorite</span> 95</span>

<span class="flex items-center gap-1"><span class="material-symbols-outlined text-\[14px]">chat\_bubble</span> 18</span>

</div>

</div>

</div>

</section>

<!-- Category Tabs -->

<div class="flex overflow-x-auto gap-4 px-4 py-2 border-b border-border bg-surface no-scrollbar">

<button class="flex-shrink-0 text-primary font-bold border-b-2 border-primary pb-2 px-1">전체</button>

<button class="flex-shrink-0 text-secondary pb-2 px-1">자취꿀팁</button>

<button class="flex-shrink-0 text-secondary pb-2 px-1">인테리어</button>

<button class="flex-shrink-0 text-secondary pb-2 px-1">요리/레시피</button>

<button class="flex-shrink-0 text-secondary pb-2 px-1">동네생활</button>

</div>

<!-- Feed -->

<section class="divide-y divide-border">

<!-- Post item -->

<article class="p-4 bg-surface">

<div class="flex items-center gap-2 mb-3">

<div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">

<span class="material-symbols-outlined text-secondary text-xl">account\_circle</span>

</div>

<div>

<p class="text-sm font-semibold">자취생A</p>

<p class="text-xs text-secondary">30분 전 · 자취꿀팁</p>

</div>

</div>

<h3 class="font-bold mb-2 leading-snug">강남역 근처 분리수거 잘되는 원룸 추천 받아요</h3>

<p class="text-secondary text-sm line-clamp-2 mb-3">이번에 이사 가려고 하는데, 강남역 부근에 분리수거 시설 잘 되어 있는 오피스텔이나 원룸 아시는 분 계신가요? 관리 잘 되는 곳으로 가고 싶어요.</p>

<div class="flex items-center gap-4 text-secondary text-sm">

<button class="flex items-center gap-1"><span class="material-symbols-outlined text-\[18px]">favorite</span> 12</button>

<button class="flex items-center gap-1"><span class="material-symbols-outlined text-\[18px]">chat\_bubble</span> 5</button>

<button class="flex items-center gap-1"><span class="material-symbols-outlined text-\[18px]">bookmark</span></button>

</div>

</article>

<!-- Post item with Image -->

<article class="p-4 bg-surface">

<div class="flex items-center gap-2 mb-3">

<div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">

<span class="material-symbols-outlined text-secondary text-xl">account\_circle</span>

</div>

<div>

<p class="text-sm font-semibold">미니멀리스트</p>

<p class="text-xs text-secondary">1시간 전 · 인테리어</p>

</div>

</div>

<h3 class="font-bold mb-2 leading-snug">6평 원룸 넓어보이게 만드는 가구 배치법</h3>

<div class="aspect-video w-full rounded-custom overflow-hidden mb-3 bg-gray-100">

<img alt="Room interior" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcGuAslHuxxg-NjJhnKcE5szrE\_Owsbr\_glZ5kjvraRx8C05wU169y88K9jBXj4uZLR\_aG-zS1m9L7U33qu8SWZ-7AKqTNIsGmZHdXf\_xwpNygNMmTCsbveFran3La3TjF\_BVWrvs56rIawAbl-BPTu46q3kShX7AdEZHEhUJhmJF0jcLUueKgNNB2VewIQZv0iyR422OF5kAczojNGx4fGuGUFW1ecN60sdmSDgwA6mOpmdXpHcp\_X2R6919VTe8idqN2sbgy4LU"/>

</div>

<p class="text-secondary text-sm line-clamp-2 mb-3">침대 위치만 바꿔도 공간이 확 살아나네요. 저상형 침대 사용하시는 거 추천드립니다!</p>

<div class="flex items-center gap-4 text-secondary text-sm">

<button class="flex items-center gap-1 text-primary"><span class="material-symbols-outlined text-\[18px] fill-1">favorite</span> 45</button>

<button class="flex items-center gap-1"><span class="material-symbols-outlined text-\[18px]">chat\_bubble</span> 23</button>

<button class="flex items-center gap-1"><span class="material-symbols-outlined text-\[18px]">bookmark</span></button>

</div>

</article>

<!-- Post item -->

<article class="p-4 bg-surface">

<div class="flex items-center gap-2 mb-3">

<div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">

<span class="material-symbols-outlined text-secondary text-xl">account\_circle</span>

</div>

<div>

<p class="text-sm font-semibold">프로자취러</p>

<p class="text-xs text-secondary">2시간 전 · 요리/레시피</p>

</div>

</div>

<h3 class="font-bold mb-2 leading-snug">다이소 꿀템으로 냉장고 정리 끝냈습니다</h3>

<p class="text-secondary text-sm line-clamp-2 mb-3">2천원짜리 바구니 3개로 냉장고 공간이 두배가 됐어요. 사진이랑 후기 남겨봅니다.</p>

<div class="flex items-center gap-4 text-secondary text-sm">

<button class="flex items-center gap-1"><span class="material-symbols-outlined text-\[18px]">favorite</span> 89</button>

<button class="flex items-center gap-1"><span class="material-symbols-outlined text-\[18px]">chat\_bubble</span> 15</button>

<button class="flex items-center gap-1"><span class="material-symbols-outlined text-\[18px]">bookmark</span></button>

</div>

</article>

</section>

</main>

<!-- Floating Action Button -->

<button class="fixed right-6 bottom-24 w-14 h-14 bg-primary text-white rounded-full custom-shadow flex items-center justify-center z-40">

<span class="material-symbols-outlined text-3xl">edit</span>

</button>

<!-- Navigation Bar -->

<nav class="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-bottom z-50">

<div class="flex justify-around items-center h-16">

<button class="flex flex-col items-center gap-1 text-secondary">

<span class="material-symbols-outlined">home</span>

<span class="text-\[10px]">홈</span>

</button>

<button class="flex flex-col items-center gap-1 text-primary">

<span class="material-symbols-outlined">forum</span>

<span class="text-\[10px]">커뮤니티</span>

</button>

<button class="flex flex-col items-center gap-1 text-secondary">

<span class="material-symbols-outlined">storefront</span>

<span class="text-\[10px]">장터</span>

</button>

<button class="flex flex-col items-center gap-1 text-secondary">

<span class="material-symbols-outlined">person</span>

<span class="text-\[10px]">내정보</span>

</button>

</div>

</nav>

</body></html>



<!-- Home (Light) -->

<!DOCTYPE html>



<html class="light" lang="ko"><head>

<meta charset="utf-8"/>

<meta content="width=device-width, initial-scale=1.0" name="viewport"/>

<title>자취방 - 커뮤니티</title>

<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700\&amp;display=swap" rel="stylesheet"/>

<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1\&amp;display=swap" rel="stylesheet"/>

<script>

&#x20;       tailwind.config = {

&#x20;           darkMode: 'class',

&#x20;           theme: {

&#x20;               extend: {

&#x20;                   colors: {

&#x20;                       primary: {

&#x20;                           DEFAULT: '#2d5bff',

&#x20;                           dark: '#1e40af',

&#x20;                       },

&#x20;                       surface: '#ffffff',

&#x20;                       background: '#f8f9fa',

&#x20;                       text: {

&#x20;                           primary: '#1a1a1a',

&#x20;                           secondary: '#6b7280',

&#x20;                       },

&#x20;                       border: '#e5e7eb',

&#x20;                   },

&#x20;                   fontFamily: {

&#x20;                       sans: \['Manrope', 'sans-serif'],

&#x20;                   },

&#x20;                   borderRadius: {

&#x20;                       'custom': '8px',

&#x20;                   }

&#x20;               }

&#x20;           }

&#x20;       }

&#x20;   </script>

<style>

&#x20;       @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

&#x20;       

&#x20;       body {

&#x20;           font-family: 'Manrope', sans-serif;

&#x20;           background-color: #f8f9fa;

&#x20;           color: #1a1a1a;

&#x20;           -webkit-tap-highlight-color: transparent;

&#x20;       }



&#x20;       .material-symbols-outlined {

&#x20;           font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;

&#x20;       }



&#x20;       .active-tab {

&#x20;           color: #2d5bff;

&#x20;           border-bottom: 2px solid #2d5bff;

&#x20;       }



&#x20;       .hide-scrollbar::-webkit-scrollbar {

&#x20;           display: none;

&#x20;       }

&#x20;       

&#x20;       .card-shadow {

&#x20;           box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

&#x20;       }

&#x20;   </style>

</head>

<body class="bg-background text-text-primary min-h-screen pb-20">

<!-- Header -->

<header class="sticky top-0 z-50 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">

<div class="flex items-center gap-2">

<h1 class="text-xl font-bold text-primary">자취방</h1>

</div>

<div class="flex items-center gap-4">

<button class="p-1"><span class="material-symbols-outlined text-text-primary">search</span></button>

<button class="p-1 relative">

<span class="material-symbols-outlined text-text-primary">notifications</span>

<span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>

</button>

</div>

</header>

<!-- Top Navigation Tabs -->

<nav class="bg-surface border-b border-border sticky top-\[53px] z-40">

<div class="flex items-center px-4 overflow-x-auto hide-scrollbar">

<a class="px-4 py-3 text-sm font-semibold active-tab whitespace-nowrap" href="#">전체</a>

<a class="px-4 py-3 text-sm font-medium text-text-secondary whitespace-nowrap" href="#">베스트</a>

<a class="px-4 py-3 text-sm font-medium text-text-secondary whitespace-nowrap" href="#">자취꿀팁</a>

<a class="px-4 py-3 text-sm font-medium text-text-secondary whitespace-nowrap" href="#">인테리어</a>

<a class="px-4 py-3 text-sm font-medium text-text-secondary whitespace-nowrap" href="#">나눔/중고</a>

</div>

</nav>

<!-- Category Quick Filters -->

<section class="px-4 py-4 flex gap-2 overflow-x-auto hide-scrollbar">

<button class="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-medium border border-primary">전체</button>

<button class="px-4 py-1.5 rounded-full bg-surface text-text-secondary text-xs font-medium border border-border">질문</button>

<button class="px-4 py-1.5 rounded-full bg-surface text-text-secondary text-xs font-medium border border-border">후기</button>

<button class="px-4 py-1.5 rounded-full bg-surface text-text-secondary text-xs font-medium border border-border">정보</button>

<button class="px-4 py-1.5 rounded-full bg-surface text-text-secondary text-xs font-medium border border-border">일상</button>

</section>

<!-- Main Content: Feed -->

<main class="space-y-3 px-4">

<!-- Post 1: Question -->

<article class="bg-surface rounded-custom p-4 card-shadow">

<div class="flex items-center justify-between mb-3">

<div class="flex items-center gap-2">

<div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">

<img alt="avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe8Z-uqQ2hLlVvH-nsaHmUqF6mHFcoUu-w0oNfpsY2IpuLbRxN\_fEv309kIm519PYWXKIDzK3A0Mgg5QsqdWvqqAXXclCOQFLCvbheiWKQ\_s4-0hd6akmvcn\_R5z\_eAOsy0R6K2LkPU0xaCGbCPm-7eSIevbAAhAn7m2yvDTOSrtxsHHekEgINuWffk5pLd3j2h797fSP2A7w8U2Vnqc-7tSkDjcdE6\_mRIHU18ze8WVnZ98aiSL-\_4a2Jf7Ga6YtMz27TOP0Is4o"/>

</div>

<div>

<p class="text-xs font-bold text-text-primary">자취3년차</p>

<p class="text-\[10px] text-text-secondary">5분 전 · 서울 관악구</p>

</div>

</div>

<button class="text-text-secondary"><span class="material-symbols-outlined text-lg">more\_horiz</span></button>

</div>

<div class="mb-3">

<span class="inline-block px-2 py-0.5 rounded bg-blue-50 text-primary text-\[10px] font-bold mb-1">질문</span>

<h3 class="text-sm font-bold text-text-primary mb-1 leading-tight">여름철 초파리 박멸하는 법 있나요?</h3>

<p class="text-xs text-text-secondary line-clamp-2">음식물 쓰레기를 바로바로 버려도 어디선가 자꾸 생기네요 ㅠㅠ 다들 어떻게 관리하시나요? 트랩도 써봤는데 효과가...</p>

</div>

<div class="flex items-center gap-4 pt-3 border-t border-border">

<button class="flex items-center gap-1 text-text-secondary text-xs">

<span class="material-symbols-outlined text-sm">thumb\_up</span>

<span>12</span>

</button>

<button class="flex items-center gap-1 text-text-secondary text-xs">

<span class="material-symbols-outlined text-sm">chat\_bubble</span>

<span>8</span>

</button>

<button class="flex items-center gap-1 text-text-secondary text-xs ml-auto">

<span class="material-symbols-outlined text-sm">bookmark</span>

</button>

</div>

</article>

<!-- Post 2: Interior (with Image) -->

<article class="bg-surface rounded-custom p-4 card-shadow">

<div class="flex items-center justify-between mb-3">

<div class="flex items-center gap-2">

<div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">

<img alt="avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSsGmOLpMrNvaKvJx6iuNzHU7XxJd67cmkwgAoCjzmEecrTs6DLQlgLJpa3GAQOKX4223PH32mH6OYu5\_CJjlvxrG75OP\_cQzOonO7an1AYXn2ffDTHWGWfg7-dW1Wp0k\_c2JAY5rE6HLsB7jGV-J2iVuPWIka-S54Boj0XEW3UUNNtxty2BhujvUWsI3oIo3AGnSQh6sAKxyrOYy2tNtKJoCPM\_R\_lcxwdODe4lEALlH8HYVC\_b6WVw-hTwmt3-dbrDRbUGfCzBY"/>

</div>

<div>

<p class="text-xs font-bold text-text-primary">미니멀리스트</p>

<p class="text-\[10px] text-text-secondary">15분 전 · 경기 수원시</p>

</div>

</div>

<button class="text-text-secondary"><span class="material-symbols-outlined text-lg">more\_horiz</span></button>

</div>

<div class="mb-3">

<span class="inline-block px-2 py-0.5 rounded bg-green-50 text-green-600 text-\[10px] font-bold mb-1">인테리어</span>

<h3 class="text-sm font-bold text-text-primary mb-1 leading-tight">6평 원룸 가구 배치 공유합니다!</h3>

<p class="text-xs text-text-secondary mb-3">좁은 공간일수록 공간 분리가 중요하더라구요. 수납장으로 침실이랑 주방 분리해봤어요.</p>

<div class="rounded-lg overflow-hidden h-40 bg-gray-100">

<img alt="room" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeq2MGS70532fgJVDWOsZeUIK7VmgS7-lqIi12IGgOMRRLQdkQj3JYh8wJ7rfxAomekQXZKbBQQeRdYHr\_WmXTnmq1NZ7RV9LskQdEEtuFXlbB94ir34UK2QX7LdMyuM\_epG1IpQGyx1tStkKUwvJnC31YhwZ2SrHeA5YPx9RYHWEcMr5yVaiAnNzGT-vzLi74OLDdsbZF93sUGAW7PJEO0sI6t8TqFXDFbIq2CN3HrZ4gm\_JSeUu0aBCcQAJUFq5LoopEkrDRfvs"/>

</div>

</div>

<div class="flex items-center gap-4 pt-3 border-t border-border">

<button class="flex items-center gap-1 text-text-secondary text-xs">

<span class="material-symbols-outlined text-sm">thumb\_up</span>

<span>45</span>

</button>

<button class="flex items-center gap-1 text-text-secondary text-xs">

<span class="material-symbols-outlined text-sm">chat\_bubble</span>

<span>12</span>

</button>

<button class="flex items-center gap-1 text-text-secondary text-xs ml-auto">

<span class="material-symbols-outlined text-sm">bookmark</span>

</button>

</div>

</article>

<!-- Post 3: Tip -->

<article class="bg-surface rounded-custom p-4 card-shadow">

<div class="flex items-center justify-between mb-3">

<div class="flex items-center gap-2">

<div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">

<img alt="avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkb\_IY\_mNpwuXlO2x3xEjeDNs7nrc2pW3dzT1\_0cXB92DI2qWnw0hA-cJqr47guXdfzy0\_tYdooIYv1TRQRcjodLuYeiSC0J\_GFXdM0tvBBWsM5R-Q-MbUdPGaJQM-R3Qb28IN8i-sAK6Dm\_HOhr2sto4227HnTRTHg7pr0IH8KkgIVCVhdm0TqZmrkZvsXQhFzSpK-L5IyluLTbgi22wLYdZYA\_9cyEyJr1KxKVw00PABTaKrJu3cUtOhVsIXUpvvsgluF3wl7L0"/>

</div>

<div>

<p class="text-xs font-bold text-text-primary">정보왕</p>

<p class="text-\[10px] text-text-secondary">1시간 전 · 서울 마포구</p>

</div>

</div>

<button class="text-text-secondary"><span class="material-symbols-outlined text-lg">more\_horiz</span></button>

</div>

<div class="mb-3">

<span class="inline-block px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-\[10px] font-bold mb-1">자취꿀팁</span>

<h3 class="text-sm font-bold text-text-primary mb-1 leading-tight">다이소 자취 추천템 5가지 (찐후기)</h3>

<p class="text-xs text-text-secondary line-clamp-2">자취하면서 정말 유용하게 쓰고 있는 다이소 템들 정리해봤습니다. 특히 2번은 무조건 사세요!</p>

</div>

<div class="flex items-center gap-4 pt-3 border-t border-border">

<button class="flex items-center gap-1 text-text-secondary text-xs">

<span class="material-symbols-outlined text-sm">thumb\_up</span>

<span>89</span>

</button>

<button class="flex items-center gap-1 text-text-secondary text-xs">

<span class="material-symbols-outlined text-sm">chat\_bubble</span>

<span>24</span>

</button>

<button class="flex items-center gap-1 text-text-secondary text-xs ml-auto">

<span class="material-symbols-outlined text-sm">bookmark</span>

</button>

</div>

</article>

</main>

<!-- Floating Action Button -->

<button class="fixed right-4 bottom-20 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">

<span class="material-symbols-outlined text-3xl">edit</span>

</button>

<!-- Bottom Navigation -->

<footer class="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-6 py-3 flex items-center justify-between z-50">

<a class="flex flex-col items-center gap-1 text-primary" href="#">

<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home</span>

<span class="text-\[10px] font-medium">홈</span>

</a>

<a class="flex flex-col items-center gap-1 text-text-secondary" href="#">

<span class="material-symbols-outlined">forum</span>

<span class="text-\[10px] font-medium">커뮤니티</span>

</a>

<a class="flex flex-col items-center gap-1 text-text-secondary" href="#">

<span class="material-symbols-outlined">storefront</span>

<span class="text-\[10px] font-medium">나눔</span>

</a>

<a class="flex flex-col items-center gap-1 text-text-secondary" href="#">

<span class="material-symbols-outlined">person</span>

<span class="text-\[10px] font-medium">마이</span>

</a>

</footer>

</body></html>

