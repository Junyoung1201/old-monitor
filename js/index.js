import { handleCommand } from './command.js';
import { setCursorVisible } from './cursor.js';
import { cmdInputElement, cmdInputHitboxElement } from './elements.js';

function setInputEnabled(enabled) {
    const container = document.getElementById('commandInputContainer');

    cmdInputElement.contentEditable = enabled;
    container.style.display = enabled ? 'flex' : 'none';
    setCursorVisible(enabled);
}

cmdInputElement.addEventListener('focusout', () => {
    setCursorVisible(true);
})

cmdInputElement.addEventListener('keydown', function(e) {

    if(e.key === "Process" || e.key === "Alt") {
        e.stopPropagation();
        e.preventDefault();
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
    }

    if (e.key === 'Enter') {
        e.preventDefault();

        const command = cmdInputElement.textContent.trim();

        if (command) {
            handleCommand(command);
            cmdInputElement.textContent = '';
        }
    }

});

cmdInputHitboxElement.addEventListener('click', function() {
    cmdInputElement.focus();
});