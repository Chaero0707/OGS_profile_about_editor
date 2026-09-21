// OGS 프로필 편집창이나 소개란(textarea)을 주기적으로 감시하여 툴바를 추가합니다.
function addHtmlToolbar() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        // 이미 툴바가 생성된 textarea는 중복 생성을 방지합니다.
        if (textarea.parentNode.querySelector('.ogs-html-toolbar')) return;

        // 툴바 컨테이너 생성
        const toolbar = document.createElement('div');
        toolbar.className = 'ogs-html-toolbar';
        toolbar.style.marginBottom = '8px';
        toolbar.style.display = 'flex';
        toolbar.style.flexWrap = 'wrap';
        toolbar.style.gap = '6px';
        toolbar.style.alignItems = 'center';

        // 1. 공통 버튼 생성 함수
        function createButton(text, tagOpen, tagClose, onClickHandler = null) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerText = text;
            btn.style.padding = '4px 8px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '12px';
            btn.style.border = '1px solid #ccc';
            btn.style.borderRadius = '4px';
            btn.style.backgroundColor = '#f9f9f9';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 별도 클릭 핸들러가 있으면 그것을 실행, 없으면 기본 태그 삽입
                if (onClickHandler) {
                    onClickHandler();
                } else {
                    insertTags(tagOpen, tagClose);
                }
            });

            return btn;
        }

        // 2. 텍스트에 태그를 입히는 핵심 로직
        function insertTags(open, close) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const selectedText = text.substring(start, end);

            textarea.value = text.substring(0, start) + open + selectedText + close + text.substring(end);
            
            textarea.focus();
            textarea.setSelectionRange(start + open.length, start + open.length + selectedText.length);
        }

        // --- 버튼 배치 시작 ---

        // 제목 크기 버튼들
        toolbar.appendChild(createButton('H1', '<h1>', '</h1>'));
        toolbar.appendChild(createButton('H2', '<h2>', '</h2>'));
        toolbar.appendChild(createButton('H3', '<h3>', '</h3>'));
        toolbar.appendChild(createButton('H5', '<h5>', '</h5>'));

        // 정밀 색상 선택기 (Color Picker) 추가
        const colorLabel = document.createElement('label');
        colorLabel.style.display = 'flex';
        colorLabel.style.alignItems = 'center';
        colorLabel.style.gap = '3px';
        colorLabel.style.fontSize = '12px';
        colorLabel.style.cursor = 'pointer';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#ff0000'; // 기본값 빨간색
        colorInput.style.width = '24px';
        colorInput.style.height = '24px';
        colorInput.style.padding = '0';
        colorInput.style.border = 'none';
        colorInput.style.cursor = 'pointer';

        colorLabel.appendChild(colorInput);
        colorLabel.appendChild(document.createTextNode('색상 적용'));
        
        // 색상 적용 클릭 시 동작
        colorLabel.addEventListener('click', (e) => {
            // input 자체를 클릭했을 때는 동작 방지 (컬러창만 뜨게)
            if (e.target === colorInput) return; 
            e.preventDefault();
            const chosenColor = colorInput.value;
            insertTags(`<span style="color: ${chosenColor};">`, '</span>');
        });
        
        // input 색상이 변경되었을 때도 글자 드래그 상태면 바로 적용 가능하도록 지원
        colorInput.addEventListener('change', () => {
            const chosenColor = colorInput.value;
            insertTags(`<span style="color: ${chosenColor};">`, '</span>');
        });

        toolbar.appendChild(colorLabel);

        // 기존 기능 버튼들
        toolbar.appendChild(createButton('이미지 🖼️', '<img src="이미지주소" alt="설명">', ''));
        
        // 링크 버튼 (동적 URL 팝업)
        toolbar.appendChild(createButton('링크 🔗', '', '', () => {
            const url = prompt("이동할 링크 주소(URL)를 입력하세요:", "https://");
            if (!url) return;
            insertTags(`<a href="${url}" target="_blank">`, '</a>');
        }));

        // textarea 바로 위에 툴바 삽입
        textarea.parentNode.insertBefore(toolbar, textarea);
    });
}

// OGS 사이트 특성 반영 (1초마다 감시)
setInterval(addHtmlToolbar, 1000);
