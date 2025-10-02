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
    outputElement.scrollTop = outputElement.scrollHeight;
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
    outputElement.scrollTop = outputElement.scrollHeight;
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