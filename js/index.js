import { handleCommand, loadSettings } from './command.js';
import { setCursorVisible } from './cursor.js';
import { cmdInputElement, cmdInputHitboxElement } from './elements.js';

// 명령어 히스토리 관리
let commandHistory = [];
let historyIndex = -1;
const MAX_HISTORY_SIZE = 100;
const STORAGE_KEY_HISTORY = 'old-monitor-command-history';

// 히스토리 로드
function loadCommandHistory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_HISTORY);

        if (saved) {
            commandHistory = JSON.parse(saved);
        }

    } catch (err) {
        console.warn('명령어 히스토리 로드 중 오류:', err);
        commandHistory = [];
    }
}

// 히스토리 저장
function saveCommandHistory() {
    try {

        // 최대 개수 제한
        if (commandHistory.length > MAX_HISTORY_SIZE) {
            commandHistory = commandHistory.slice(-MAX_HISTORY_SIZE);
        }

        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(commandHistory));

    } catch (err) {
        console.warn('명령어 히스토리 저장 중 오류:',(err));
    }
}

// 명령어를 히스토리에 추가
function addToHistory(command) {

    if (!command.trim()) {
        return;
    }

    // 중복 제거 (마지막 명령어와 같으면 추가하지 않음)
    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== command) {
        commandHistory.push(command);
        saveCommandHistory();
    }

    // 히스토리 인덱스 초기화
    historyIndex = -1;
}

// 히스토리 내비게이션
function navigateHistory(direction) {
    if (commandHistory.length === 0) return;

    if (direction === 'up') {
        if (historyIndex === -1) {
            historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
            historyIndex--;
        }
    } 
    
    else if (direction === 'down') {

        if (historyIndex === -1) {
            // 이미 최신 상태임
            return;
        } 
        
        else if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
        } 
        
        else {
            historyIndex = -1;
            cmdInputElement.textContent = '';
            return;
        }

    }

    if (historyIndex >= 0 && historyIndex < commandHistory.length) {
        cmdInputElement.textContent = commandHistory[historyIndex];

        // 커서를 끝으로 이동
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(cmdInputElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function setInputEnabled(enabled) {
    const container = document.getElementById('commandInputContainer');

    cmdInputElement.contentEditable = enabled;
    container.style.display = enabled ? 'flex' : 'none';
    setCursorVisible(enabled);
}

cmdInputElement.addEventListener('focusout', () => {
    setCursorVisible(true);
})

cmdInputElement.addEventListener('keydown', function (e) {

    if (e.key === "Process" || e.key === "Alt") {
        e.stopPropagation();
        e.preventDefault();
        return;
    }

    // 화살표 위키
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory('up');
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory('down');
        return;
    }

    if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.repeat && e.key !== "Control" && e.key !== "Enter") {
        const audio = new Audio('audio/type.mp3');
        const minPlaybackRate = 0.7;
        const maxPlaybackRate = 1.3;
        audio.playbackRate = Math.random() * (maxPlaybackRate - minPlaybackRate) + minPlaybackRate;

        // 좀 앞에서 재생 시작
        audio.currentTime = 0.03;

        audio.play().catch(error => {
            console.error("오디오 재생에 실패했습니다:", error);
        });

        // 화면 깜빡임 효과
        document.body.classList.add('screen-flicker');

        setTimeout(() => {
            document.body.classList.remove('screen-flicker');
        }, 100);

        // RGB 글리치 효과 (30% 확률로 발생)
        if (Math.random() < 0.3) {
            document.body.classList.add('chromatic-glitch');
            setTimeout(() => {
                document.body.classList.remove('chromatic-glitch');
            }, 100);
        }
    }

    if (e.key === 'Enter') {
        e.preventDefault();

        const command = cmdInputElement.textContent.trim();

        if (command) {
            addToHistory(command);
            handleCommand(command);
            cmdInputElement.textContent = '';
        }
    }

});

cmdInputHitboxElement.addEventListener('click', function () {
    cmdInputElement.focus();
});

document.addEventListener('DOMContentLoaded', function () {
    loadCommandHistory();
    loadSettings();
});