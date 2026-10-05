 tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                emerald: {
                    850: '#0a362a',
                    900: '#07281f',
                    950: '#041c15',
                },
                gold: {
                    100: '#fffbeb',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#d4af37',
                    600: '#b89228',
                    700: '#91701b',
                }
            },
            fontFamily: {
                arabic: ['Amiri', 'serif'],
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            }
        }
    }
}

function updateClock() {
    const clock = document.getElementById('currentTime');
    if (!clock) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}
if (document.getElementById('currentTime')) setInterval(updateClock, 1000);
updateClock();

function updateHijri() {
    const hijriDate = document.getElementById('hijriDate');
    if (!hijriDate) return;

    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const todayG = date.toLocaleDateString('uz-UZ', options);
    hijriDate.textContent = `${todayG} | Hijriy 1448-yil`;
}
updateHijri();

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

let count = 0;
const zikrList = [
    "Astaghfirullah al-Azim",
    "SubhanAllah",
    "Alhamdulillah",
    "Allahu Akbar",
    "La ilaha illallah"
];
let zikrIndex = 0;

function countTasbih() {
    if (!document.getElementById('tasbihCount')) return;
    count++;
    document.getElementById('tasbihCount').textContent = count;

    if (count % 33 === 0) {
        zikrIndex = (zikrIndex + 1) % zikrList.length;
        document.getElementById('phraseDisplay').textContent = zikrList[zikrIndex];
    }
}

function resetTasbih() {
    if (!document.getElementById('tasbihCount')) return;
    count = 0;
    zikrIndex = 0;
    document.getElementById('tasbihCount').textContent = "0";
    document.getElementById('phraseDisplay').textContent = zikrList[0];
}

let isAudioPlaying = false;
const quranAudio = document.getElementById('quranAudio');

function toggleAudio() {
    const audioBtn = document.getElementById('audioBtn');
    if (!quranAudio || !audioBtn) return;
    if (!isAudioPlaying) {
        quranAudio.play().then(() => {
            isAudioPlaying = true;
            audioBtn.classList.add('text-gold-500', 'animate-pulse');
        }).catch(err => {
            console.log("Audio playback restricted:", err);
        });
    } else {
        quranAudio.pause();
        isAudioPlaying = false;
        audioBtn.classList.remove('text-gold-500', 'animate-pulse');
    }
}

function filterCards() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const input = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('#cardsGrid .program-card');

    cards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(input) || desc.includes(input)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

function navigateTo(title, desc, icon) {
    const routes = {
        "40 Ming Istig'for Kundaligi": '40_Ming_istigfor.html',
        "Allohning 99 Go'zal Ismi": 'Allohning_99_imi.html',
        '40 Kunlik Voqea Surasi': '40_Kunlik%20_voqea.html',
        'Allohga Oson': 'Allohga_Oson.html',
        'Tahajjud Daftarim': 'Tahajjud_Daftarim.html'
    };
    if (routes[title]) window.location.href = routes[title];
}
 function closeModal() {
    const modal = document.getElementById('pageModal');
    const modalBox = document.getElementById('modalBox');

    modalBox.classList.remove('scale-100');
    modalBox.classList.add('scale-95');
    modal.classList.remove('modal-show');
}

document.querySelectorAll('[data-counter]').forEach(counter => {
    const storageKey = `nurli-${counter.dataset.counter}`;
    const target = Number(counter.dataset.target || 0);
    const value = counter.querySelector('[data-counter-value]');
    const progress = counter.querySelector('[data-counter-progress]');
    let total = Number(localStorage.getItem(storageKey) || 0);

    const render = () => {
        if (value) value.textContent = total.toLocaleString('uz-UZ');
        if (progress && target) progress.style.width = `${Math.min(total / target * 100, 100)}%`;
    };

    counter.querySelectorAll('[data-increment]').forEach(button => {
        button.addEventListener('click', () => {
            total += Number(button.dataset.increment || 1);
            localStorage.setItem(storageKey, String(total));
            render();
        });
    });

    const reset = counter.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', () => {
        total = 0;
        localStorage.removeItem(storageKey);
        render();
    });
    render();
});

document.querySelectorAll('[data-journal-form]').forEach(form => {
    const storageKey = `nurli-journal-${form.dataset.journalForm}`;
    const list = document.querySelector(`[data-journal-list="${form.dataset.journalForm}"]`);
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const dateInput = form.querySelector('[name="date"]');
    if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);

    const render = () => {
        if (!list) return;
        list.replaceChildren();
        entries.slice().reverse().forEach(entry => {
            const item = document.createElement('article');
            item.className = 'journal-entry';
            const date = document.createElement('time');
            date.textContent = entry.date;
            const text = document.createElement('p');
            text.textContent = entry.text;
            item.append(date, text);
            list.append(item);
        });
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        const textInput = form.querySelector('[name="text"]');
        const text = textInput.value.trim();
        if (!text) return;
        entries.push({ date: dateInput.value, text });
        localStorage.setItem(storageKey, JSON.stringify(entries));
        textInput.value = '';
        render();
    });
    render();
});