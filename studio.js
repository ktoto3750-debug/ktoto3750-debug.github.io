/**
 * Скрипт для управления студией BeatLab
 * Функционал: WaveSurfer (волна), загрузка MP3, Drum Pads
 */

// 1. Инициализация WaveSurfer (основной плеер)
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#444',       // Цвет незаполненной волны
    progressColor: '#1db954', // Цвет прогресса (зеленый)
    cursorColor: '#fff',      // Цвет линии курсора
    barWidth: 2,              // Толщина столбиков
    barGap: 3,                // Расстояние между ними
    barRadius: 3,             // Скругление столбиков
    height: 120,              // Высота области
    normalize: true,          // Выравнивание громкости для красоты
});

// 2. Элементы управления треком
const playBtn = document.getElementById('btnPlay');
const stopBtn = document.getElementById('btnStop');
const volumeSlider = document.getElementById('volume');
const speedSlider = document.getElementById('speed');
const zoomSlider = document.getElementById('zoom');
const uploadInput = document.getElementById('uploadFile');
const projNameDisplay = document.querySelector('.proj-name');

// Старт / Пауза
playBtn.addEventListener('click', () => {
    wavesurfer.playPause();
});

// Стоп
stopBtn.addEventListener('click', () => {
    wavesurfer.stop();
    playBtn.innerHTML = '▶';
});

// Синхронизация текста кнопки Play/Pause
wavesurfer.on('play', () => {
    playBtn.innerHTML = '⏸';
});

wavesurfer.on('pause', () => {
    playBtn.innerHTML = '▶';
});

// Изменение громкости
volumeSlider.addEventListener('input', (e) => {
    wavesurfer.setVolume(e.target.value);
});

// Изменение скорости (Pitch)
speedSlider.addEventListener('input', (e) => {
    wavesurfer.setPlaybackRate(e.target.value);
});

// Зум волны
zoomSlider.addEventListener('input', (e) => {
    wavesurfer.zoom(Number(e.target.value));
});

// Загрузка своего MP3
uploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const objectUrl = URL.createObjectURL(file);
        wavesurfer.load(objectUrl);
        projNameDisplay.innerText = file.name; // Меняем заголовок проекта
    }
});

// 3. ЛОГИКА ДРАМ-МАШИНЫ (ИНСТРУМЕНТЫ)

// База звуков для пэдов
const drumSounds = {
    kick: 'https://actions.google.com/sounds/v1/percussion/bass_drum_low_thud.ogg',
    snare: 'https://actions.google.com/sounds/v1/percussion/snare_drum_snare_hit.ogg',
    hihat: 'https://actions.google.com/sounds/v1/percussion/hi_hat_open.ogg',
    clap: 'https://actions.google.com/sounds/v1/percussion/percussion_hit.ogg'
};

/**
 * Функция для проигрывания звука барабана
 * @param {string} type - тип звука (kick, snare и т.д.)
 */
function playDrum(type) {
    const audio = new Audio(drumSounds[type]);
    audio.currentTime = 0; // Сброс времени, чтобы можно было "спамить" звуком
    audio.play();
}

// Обработка кликов по пэдам (мышкой)
document.querySelectorAll('.pad').forEach(pad => {
    pad.addEventListener('mousedown', () => {
        const sound = pad.getAttribute('data-sound');
        playDrum(sound);
        pad.classList.add('playing'); // Добавляем класс для подсветки
    });
    
    // Убираем подсветку после клика
    const removeEffect = () => pad.classList.remove('playing');
    pad.addEventListener('mouseup', removeEffect);
    pad.addEventListener('mouseleave', removeEffect);
});

// Обработка клавиш клавиатуры (1, 2, 3, 4)
window.addEventListener('keydown', (e) => {
    const keyMap = {
        '1': 'kick',
        '2': 'snare',
        '3': 'hihat',
        '4': 'clap'
    };
    
    const soundType = keyMap[e.key];
    
    if (soundType) {
        playDrum(soundType);
        
        // Находим нужный пэд в HTML, чтобы подсветить его
        const activePad = document.querySelector(`[data-sound="${soundType}"]`);
        if (activePad) {
            activePad.classList.add('playing');
            // Убираем подсветку через 100мс
            setTimeout(() => activePad.classList.remove('playing'), 100);
        }
    }
});

/**
 * Переключение активного инструмента в сайдбаре
 */
window.showTool = function(toolName) {
    // Убираем класс active у всех пунктов
    document.querySelectorAll('.tool-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Добавляем класс нажатому пункту (через event)
    if (event) {
        event.currentTarget.classList.add('active');
    }

    console.log(`Загрузка инструмента: ${toolName}`);
    // Здесь в будущем можно добавить смену панелей (Синт / Драм / Эффекты)
};

// Выводим сообщение в консоль, что всё ок
console.log("BeatLab Studio Engine Loaded!");