
// =====================
// 打字機效果
// =====================
(function initTypewriter() {
    const words    = ['全端工程師', '遊戲開發者', '創意設計師'];
    const el       = document.getElementById('typewriter-text');
    if (!el) return;

    const TYPING_SPEED   = 120;   // ms / 字
    const DELETING_SPEED = 60;    // ms / 字
    const PAUSE_AFTER    = 1800;  // 打完後停頓
    const PAUSE_BEFORE   = 300;   // 刪完後停頓

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            // 打字中
            charIndex++;
            el.textContent = currentWord.slice(0, charIndex);

            if (charIndex === currentWord.length) {
                // 打完 → 停頓後開始刪除
                isDeleting = true;
                setTimeout(tick, PAUSE_AFTER);
                return;
            }
            setTimeout(tick, TYPING_SPEED);
        } else {
            // 刪除中
            charIndex--;
            el.textContent = currentWord.slice(0, charIndex);

            if (charIndex === 0) {
                // 刪完 → 換下一個詞
                isDeleting = false;
                wordIndex  = (wordIndex + 1) % words.length;
                setTimeout(tick, PAUSE_BEFORE);
                return;
            }
            setTimeout(tick, DELETING_SPEED);
        }
    }

    // 頁面載入後 800ms 開始（等 fade-up 動畫結束）
    setTimeout(tick, 800);
})();
