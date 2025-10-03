import { writeLine, appendOutput, clearOutput, write } from './output.js';
import { createSHA256, copyText } from './utils.js';

let lastGeneratedToken = null;

let currentBrightness = 100;
let currentForeColor = null;
let currentBackColor = null;

// localStorage 키 상수들
const STORAGE_KEYS = {
    BRIGHTNESS: 'old-monitor-brightness',
    FORECOLOR: 'old-monitor-forecolor',
    BACKCOLOR: 'old-monitor-backcolor',
    COMMAND_HISTORY: 'old-monitor-command-history'
};

// 설정 로드 함수
function loadSettings() {
    try {
        // 밝기 로드
        const savedBrightness = localStorage.getItem(STORAGE_KEYS.BRIGHTNESS);

        if (savedBrightness !== null) {

            const brightness = parseInt(savedBrightness);

            if (!isNaN(brightness) && brightness >= 0 && brightness <= 200) {
                currentBrightness = brightness;
                document.body.style.filter = `brightness(${brightness}%)`;
            }

        }

        // 글씨 색상 로드
        const savedForeColor = localStorage.getItem(STORAGE_KEYS.FORECOLOR);

        if (savedForeColor && savedForeColor !== 'null') {
            currentForeColor = savedForeColor;
            document.body.style.color = savedForeColor;
        }

        // 배경색 로드
        const savedBackColor = localStorage.getItem(STORAGE_KEYS.BACKCOLOR);

        if (savedBackColor && savedBackColor !== 'null') {
            currentBackColor = savedBackColor;
            const backgroundContainer = document.getElementById('background-container');
            if (backgroundContainer) {
                backgroundContainer.style.backgroundColor = savedBackColor;
            }
        }
    } catch (error) {
        console.warn('설정 로드 중 오류:', error);
    }
}

// 설정 저장 함수
function saveSettings() {
    try {
        localStorage.setItem(STORAGE_KEYS.BRIGHTNESS, currentBrightness.toString());
        localStorage.setItem(STORAGE_KEYS.FORECOLOR, currentForeColor || 'null');
        localStorage.setItem(STORAGE_KEYS.BACKCOLOR, currentBackColor || 'null');
    } catch (error) {
        console.warn('설정 저장 중 오류:', error);
    }
}

export function handleCommand(commandFullText) {
    const cmd = commandFullText.split(" ")[0];
    const args = commandFullText.split(" ").slice(1);

    writeLine(`> ${commandFullText}`);

    switch (cmd) {
        case "echo":
            writeLine(args.join(" "));
            break;

        case "login":
            login(args);
            break;

        case "clear":
            clearOutput();
            break;

        case "copy-token":
            copyToken();
            break;

        case "bright":
            setBrightness(args);
            break;

        case "forecolor":
            setForeColor(args);
            break;

        case "backcolor":
            setBackColor(args);
            break;

        case "test-line":
            for (let i = 0; i < 50; i++) {
                writeLine("test");
            }
            break;

        default:
            writeLine(`알 수 없는 명령어: ${cmd}`);
            break;
    }
}

async function copyToken() {
    if (lastGeneratedToken) {
        try {
            await copyText(lastGeneratedToken);
            writeLine("토큰 복사됨.\n");
        } catch (err) {
            writeLine("토큰 복사 실패: " + err.message);
        }
    } else {
        writeLine("로그인 필요.");
    }
}

async function login(args) {

    if (args.indexOf("-id") === -1 || args.indexOf("-pw") === -1 || args.indexOf("-name") === -1) {
        appendOutput("사용법: login -id <아이디> -pw <비밀번호> -name <이름>\n");
        return;
    }

    // "-id": 아이디
    const id = args[args.indexOf("-id") + 1];
    const pw = args[args.indexOf("-pw") + 1];
    const name = args[args.indexOf("-name") + 1];

    const hashed_1 = await createSHA256(id, pw);
    const hashed_2 = await createSHA256(hashed_1, name);

    lastGeneratedToken = hashed_2;
    write(`\n토큰: `);
    writeLine(hashed_2 + '\n', { foreColor: 'black', bgColor: 'yellow' });
}

// 화면 밝기 설정 함수
function setBrightness(args) {
    if (args.length === 0) {
        writeLine(`현재 밝기: ${currentBrightness}%`);
        writeLine("사용법: bright <0-200>");
        return;
    }

    const brightness = parseInt(args[0]);

    if (isNaN(brightness)) {
        writeLine("밝기는 숫자여야 함.");
        return;
    }

    if (brightness < 0 || brightness > 200) {
        writeLine("밝기 범위는 0-200이어야 함.");
        return;
    }

    currentBrightness = brightness;

    // 화면 밝기 조절
    const body = document.body;
    const filter = `brightness(${brightness}%)`;

    if (body.style.filter) {

        // 기존 필터가 있으면 brightness만 교체
        body.style.filter = body.style.filter.replace(/brightness\([^)]*\)/g, '') + ` ${filter}`;

    } else {
        body.style.filter = filter;
    }

    saveSettings(); // 설정 저장
    writeLine(`밝기가 ${brightness}%로 설정됨.`);
}

// 글씨 색상(텍스트 색상) 설정 함수
function setForeColor(args) {

    if (args.length === 0) {
        writeLine(`현재 글씨 색상: ${currentForeColor || 'default (green)'}`);
        writeLine("사용법: forecolor <색상명 또는 hex코드>");
        writeLine("예: forecolor red, forecolor #ff0000, forecolor reset");
        return;
    }

    const color = args[0].toLowerCase();

    if (color === 'reset') {
        currentForeColor = null;
        document.body.style.color = 'var(--c-green-text)';
        saveSettings();
        writeLine("글씨 색상 초기화.");
        return;
    }

    // 유효한 색상인지 검증
    if (isValidColor(color)) {

        currentForeColor = color;
        document.body.style.color = color;

        saveSettings();
        writeLine(`글씨 색상이 ${color}로 설정됨.`, { foreColor: color });

    } else {

        writeLine("올바르지 않은 색상.");
        writeLine("지원하는 색상: red, blue, green, yellow, white, cyan, magenta, hex코드");

    }
}

// 배경색 설정 함수
function setBackColor(args) {
    if (args.length === 0) {
        writeLine(`현재 배경색: ${currentBackColor || 'default (black)'}`);
        writeLine("사용법: backcolor <색상명 또는 hex코드>");
        writeLine("예: backcolor blue, backcolor #000080, backcolor reset");
        return;
    }

    const color = args[0].toLowerCase();

    if (color === 'reset') {

        currentBackColor = null;

        const backgroundContainer = document.getElementById('background-container');

        if (backgroundContainer) {
            backgroundContainer.style.backgroundColor = 'var(--c-black-bg)';
        }

        saveSettings();
        writeLine("배경색 초기화.");

        return;
    }

    // 유효한 색상인지 검증
    if (isValidColor(color)) {

        currentBackColor = color;

        const backgroundContainer = document.getElementById('background-container');

        if (backgroundContainer) {
            backgroundContainer.style.backgroundColor = color;
        }
        saveSettings();
        writeLine(`배경색이 ${color}로 설정됨.`, { bgColor: color, foreColor: getContrastColor(color) });

    } else {
        writeLine("올바르지 않은 색상.");
        writeLine("지원하는 색상: red, blue, green, yellow, white, cyan, magenta, hex코드");
    }
}

// 색상 유효성 검사 함수
function isValidColor(color) {

    const colors = [
        'red', 'blue', 'green', 'yellow', 'white', 'black',
        'cyan', 'magenta', 'orange', 'purple', 'pink', 'gray'
    ];

    if (colors.includes(color)) {
        return true;
    }

    // hex 색상 코드 검증
    if (/^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color)) {
        return true;
    }

    return false;
}

// 대비되는 색상 반환 (배경색에 맞는 텍스트 색상)
function getContrastColor(backgroundColor) {

    const darkColors = ['black', 'blue', 'navy', 'darkblue', 'darkgreen'];

    if (darkColors.includes(backgroundColor.toLowerCase())) {
        return 'white';
    }

    // hex 색상의 경우 밝기 계산
    if (backgroundColor.startsWith('#')) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? 'black' : 'white';
    }

    return 'black';
}

export { loadSettings };