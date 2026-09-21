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

        // 굵게 버튼 추가
        toolbar.appendChild(createButton('굵게 🚀', '<b>', '</b>'));

        // 제목 크기 버튼들
        toolbar.appendChild(createButton('H1', '<h1>', '</h1>'));
        toolbar.appendChild(createButton('H2', '<h2>', '</h2>'));
        toolbar.appendChild(createButton('H3', '<h3>', '</h3>'));
        toolbar.appendChild(createButton('H5', '<h5>', '</h5>'));

        // 정렬 버튼들
        toolbar.appendChild(createButton('◀ 좌측', '<div style="text-align: left;">', '</div>'));
        toolbar.appendChild(createButton('■ 중앙', '<div style="text-align: center;">', '</div>'));
        toolbar.appendChild(createButton('▶ 우측', '<div style="text-align: right;">', '</div>'));

        // [신규] 글자 색상 선택기
        const textColorLabel = document.createElement('label');
        textColorLabel.style.display = 'flex';
        textColorLabel.style.alignItems = 'center';
        textColorLabel.style.gap = '3px';
        textColorLabel.style.fontSize = '12px';
        textColorLabel.style.cursor = 'pointer';

        const textColorInput = document.createElement('input');
        textColorInput.type = 'color';
        textColorInput.value = '#ff0000'; // 기본값 빨강
        textColorInput.style.width = '20px';
        textColorInput.style.height = '20px';
        textColorInput.style.padding = '0';
        textColorInput.style.border = 'none';
        textColorInput.style.cursor = 'pointer';

        textColorLabel.appendChild(textColorInput);
        textColorLabel.appendChild(document.createTextNode('글자색'));
        
        textColorLabel.addEventListener('click', (e) => {
            if (e.target === textColorInput) return; 
            e.preventDefault();
            insertTags(`<span style="color: ${textColorInput.value};">`, '</span>');
        });
        textColorInput.addEventListener('change', () => {
            insertTags(`<span style="color: ${textColorInput.value};">`, '</span>');
        });
        toolbar.appendChild(textColorLabel);

        // [신규] 배경 색상 선택기
        const bgColorLabel = document.createElement('label');
        bgColorLabel.style.display = 'flex';
        bgColorLabel.style.alignItems = 'center';
        bgColorLabel.style.gap = '3px';
        bgColorLabel.style.fontSize = '12px';
        bgColorLabel.style.cursor = 'pointer';
        bgColorLabel.style.marginLeft = '5px';

        const bgColorInput = document.createElement('input');
        bgColorInput.type = 'color';
        bgColorInput.value = '#ffff00'; // 기본값 노랑(형광펜)
        bgColorInput.style.width = '20px';
        bgColorInput.style.height = '20px';
        bgColorInput.style.padding = '0';
        bgColorInput.style.border = 'none';
        bgColorInput.style.cursor = 'pointer';

        bgColorLabel.appendChild(bgColorInput);
        bgColorLabel.appendChild(document.createTextNode('배경색'));
        
        bgColorLabel.addEventListener('click', (e) => {
            if (e.target === bgColorInput) return; 
            e.preventDefault();
            insertTags(`<span style="background-color: ${bgColorInput.value};">`, '</span>');
        });
        bgColorInput.addEventListener('change', () => {
            insertTags(`<span style="background-color: ${bgColorInput.value};">`, '</span>');
        });
        toolbar.appendChild(bgColorLabel);

        // 구분선 살짝 띄우기
        const spacer = document.createElement('span');
        spacer.style.marginLeft = '5px';
        toolbar.appendChild(spacer);

        // 기존 기능 버튼들
        toolbar.appendChild(createButton('이미지 🖼️', '<img src="이미지주소" alt="설명">', ''));
        
        // 링크 버튼
        toolbar.appendChild(createButton('링크 🔗', '', '', () => {
            const url = prompt("이동할 링크 주소(URL)를 입력하세요:", "https://");
            if (!url) return;
            insertTags(`<a href="${url}" target="_blank">`, '</a>');
        }));

        // textarea 바로 위에 툴바 삽입
        textarea.parentNode.insertBefore(toolbar, textarea);
    });
}

// OGS 사이트 감시
setInterval(addHtmlToolbar, 1000);
