const form = document.getElementById("audioForm");
const audioUrlInput = document.getElementById("audioUrl");
const statusText = document.getElementById("statusText");
const playerCard = document.getElementById("playerCard");
const audio = document.getElementById("quranAudio");
const playBtn = document.getElementById("playBtn");
const backwardBtn = document.getElementById("backwardBtn");
const forwardBtn = document.getElementById("forwardBtn");
const volumeRange = document.getElementById("volumeRange");
const speedSelect = document.getElementById("speedSelect");

function setStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.classList.toggle("is-error", isError);
}

function updatePlayButton() {
    playBtn.textContent = audio.paused ? "تشغيل" : "إيقاف";
}

function seekBy(seconds) {
    if (!Number.isFinite(audio.duration)) {
        return;
    }

    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const url = audioUrlInput.value.trim();

    if (!url) {
        setStatus("اكتب رابط الصوت أولا.", true);
        return;
    }

    audio.src = url;
    audio.load();
    playerCard.hidden = false;
    setStatus("تم تحميل الرابط. يمكنك التشغيل الآن.");

    audio.play().catch(() => {
        setStatus("تم تجهيز الصوت. اضغط زر التشغيل إذا لم يبدأ تلقائيا.");
    });
});

playBtn.addEventListener("click", () => {
    if (!audio.src) {
        setStatus("اكتب رابط الصوت ثم اضغط تحميل.", true);
        return;
    }

    if (audio.paused) {
        audio.play().catch(() => {
            setStatus("تعذر تشغيل الرابط. تأكد أن الرابط مباشر ويدعم التشغيل من المتصفح.", true);
        });
    } else {
        audio.pause();
    }
});

backwardBtn.addEventListener("click", () => seekBy(-10));
forwardBtn.addEventListener("click", () => seekBy(10));

volumeRange.addEventListener("input", () => {
    audio.volume = Number(volumeRange.value);
});

speedSelect.addEventListener("change", () => {
    audio.playbackRate = Number(speedSelect.value);
});

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);
audio.addEventListener("ended", updatePlayButton);
audio.addEventListener("error", () => {
    setStatus("تعذر تحميل الصوت. جرب رابط ملف صوت مباشر أو تحقق من إعدادات CORS في API.", true);
    updatePlayButton();
});
