// 스크롤을 가장 아래로 이동시키는 공통 함수
function scrollToBottom() {

    const mainContainer = document.getElementById('mainContainer');

    if (mainContainer) {

        // DOM 업데이트 후 스크롤 조정
        requestAnimationFrame(() => {
            mainContainer.scrollTop = mainContainer.scrollHeight;
        });

    }
    
}

export function writeLine(text, options = {}) {
    const outputElement = document.getElementById("output");
    const { bgColor, foreColor } = options;
    
    let styledText = text;

    if (bgColor || foreColor) {
        const styles = [];
        if (bgColor) styles.push(`background-color: ${bgColor}`);
        if (foreColor) styles.push(`color: ${foreColor}`);
        styledText = `<span style="${styles.join('; ')}">${text}</span>`;
    }
    
    outputElement.innerHTML += styledText + '<br/>';
    scrollToBottom();
}

export function write(text, options = {}) {
    const outputElement = document.getElementById("output");
    const { bgColor, foreColor } = options;
    
    let styledText = text;

    if (bgColor || foreColor) {
        const styles = [];
        if (bgColor) styles.push(`background-color: ${bgColor}`);
        if (foreColor) styles.push(`color: ${foreColor}`);
        styledText = `<span style="${styles.join('; ')}">${text}</span>`;
    }
    
    outputElement.innerHTML += styledText;
    scrollToBottom();
}

export function appendOutput(text, options = {}) {
    writeLine(text, options);
}

// 출력 초기화 함수
export function clearOutput() {
    const outputElement = document.getElementById('output');
    if (outputElement) {
        outputElement.innerHTML = '';
    }
}