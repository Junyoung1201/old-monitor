import { cursorElement, cmdInputElement } from './elements.js';

let blinkInterval = null;

export function setCursorVisible(visible) {
    const cursor = document.getElementById('cursor');
    cursor.style.visibility = visible ? 'visible' : 'hidden';
    
    if(visible) {
        startCursorBlink();
        cursorElement.style.opacity = '1';
    } else {
        stopCursorBlink();
        cursorElement.style.opacity = '0';
    }
}

function startCursorBlink() {
    if (blinkInterval) return; 

    blinkInterval = setInterval(() => {
        if (cursorElement.style.visibility === 'visible') {
            cursorElement.style.visibility = 'hidden';
        } else {
            cursorElement.style.visibility = 'visible';
        }
    }, 500);
}

function stopCursorBlink() {
    clearInterval(blinkInterval);
    blinkInterval = null;

    if (cursorElement) {
        cursorElement.style.visibility = 'visible';
    }
}

if (cursorElement) {
    startCursorBlink();
}

// 입력칸에 따라 커서도 위치 이동
if (cmdInputElement) {
    cmdInputElement.addEventListener('change', (e) => {
        const cursorPosition = cmdInputElement.selectionStart;
        const textBeforeCursor = cmdInputElement.value.substring(0, cursorPosition);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const computedStyle = window.getComputedStyle(cmdInputElement);
        context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
        
        const textWidth = context.measureText(textBeforeCursor).width;
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
        
        if (cursorElement) {
            cursorElement.style.left = `${paddingLeft + textWidth}px`;
        }
    });
}

window.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === 'a') {
        setCursorVisible(false);
    } else {
        setCursorVisible(true);
    }
})

// 화면이 포커스되면 입력칸 포커스
window.addEventListener('focus', () => {
    if (cmdInputElement) {
        cmdInputElement.focus();
    }
});

// 화면 클릭하면 입력칸 포커스
window.addEventListener('click', () => {
    if (cmdInputElement) {
        cmdInputElement.focus();
    }
});

// 입력하고 있으면 커서 잠시 숨기기
if (cmdInputElement) {
    cmdInputElement.addEventListener('input', () => {
        stopCursorBlink();
        setTimeout(() => {
            startCursorBlink();
        }, 1000);
    });
}