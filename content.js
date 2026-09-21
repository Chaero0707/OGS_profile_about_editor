// OGS 소개란 입력창(textarea)을 감시하고 툴바를 추가하는 스크립트
function createToolbar(textarea) {
  if (textarea.parentNode.querySelector('.ogs-html-toolbar')) return;

  const toolbar = document.createElement('div');
  toolbar.className = 'ogs-html-toolbar';

  const buttons = [
    { text: '큰 제목 (H1)', tagOpen: '<h1>', tagClose: '</h1>' },
    { text: '중간 제목 (H2)', tagOpen: '<h2>', tagClose: '</h2>' },
    { text: '빨간 글씨', tagOpen: '<span style="color: red;">', tagClose: '</span>' },
    { text: '파란 글씨', tagOpen: '<span style="color: blue;">', tagClose: '</span>' },
    { text: '이미지 삽입', tagOpen: '<img src="', tagClose: '" alt="이미지 설명" style="max-width:100%;">' },
    { text: '진하게', tagOpen: '<strong>', tagClose: '</strong>' },
    { text: '밑줄', tagOpen: '<u>', tagClose: '</u>' }
  ];

  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = btn.text;
    button.className = 'ogs-toolbar-btn';
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);
      
      const replacement = btn.tagOpen + selectedText + btn.tagClose;
      textarea.value = text.substring(0, start) + replacement + text.substring(end);
      
      // 포커스 유지 및 커서 위치 조정
      textarea.focus();
      textarea.selectionStart = start + btn.tagOpen.length;
      textarea.selectionEnd = start + btn.tagOpen.length + selectedText.length;
      
      // 입력 이벤트 발생시켜 OGS 시스템이 변경 사항을 감지하도록 함
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    toolbar.appendChild(button);
  });

  textarea.parentNode.insertBefore(toolbar, textarea);
}

// OGS는 SPA(단일 페이지 애플리케이션)이므로 요소가 동적으로 변합니다. 이를 감시합니다.
const observer = new MutationObserver((mutations) => {
  // OGS 설정 또는 프로필 편집 페이지의 textarea를 타겟팅 (일반적으로 유저 소개란 영역)
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    // 플레이어 소개란이나 글 작성창 등 태그가 필요한 곳에 적용
    if (textarea.placeholder && (textarea.placeholder.includes('소개') || textarea.placeholder.includes('profile') || textarea.placeholder.includes('About'))) {
      createToolbar(textarea);
    } else {
      // 마땅한 placeholder가 없는 경우 모든 textarea 위에 툴바를 띄우고 싶다면 조건 완화 가능
      createToolbar(textarea);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
