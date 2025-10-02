import { writeLine, appendOutput, clearOutput, write } from './output.js';
import { createSHA256, copyText } from './utils.js';

let lastGeneratedToken = null;

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
        writeLine("로그인이 필요합니다.");
    }
}

async function login(args) {

    if (args.indexOf("-id") === -1 || args.indexOf("-pw") === -1 || args.indexOf("-name") === -1) {
        appendOutput("사용법: login -id [아이디] -pw [비밀번호] -name [이름]\n");
        return;
    }

    // "-id": 아이디
    const id = args[args.indexOf("-id") + 1];
    const pw = args[args.indexOf("-pw") + 1];
    const name = args[args.indexOf("-name") + 1];

    // crypto-js 라이브러리로 SHA-256 해시 생성
    const hashed_1 = await createSHA256(id, pw);
    const hashed_2 = await createSHA256(hashed_1, name);

    lastGeneratedToken = hashed_2;
    write(`\n토큰: `);
    writeLine(hashed_2+'\n', { foreColor: 'black', bgColor: 'yellow' });
}