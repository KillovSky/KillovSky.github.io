/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable max-len */

/*
 * Módulo principal do script que controla a exibição de tempo, data, troca de imagens de fundo,
 * interações com o botão de login, controle de áudio, redirecionamento e toggles de dark mode e easter egg.
 */

/**
 * Atualiza o tempo e a data exibidos na página a cada segundo.
 */
function updateTimeAndDate() {
    setInterval(() => {
        /* Formata e exibe o horário atual */
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement) currentTimeElement.textContent = timeString;

        /* Formata e exibe a data atual */
        const dateString = now.toLocaleDateString('pt-BR', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
        });
        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) currentDateElement.textContent = dateString;
    }, 1000);
}

/**
 * Controla a troca de imagens de fundo em um intervalo de tempo.
 */
function setupBackgroundChanger() {
    const images = [
        'https://picsum.photos/1920/1080',
        'https://killovsky.github.io/Nurse.jpg',
        'https://unsplash.it/1920/1080?random',
        'https://github.com/KillovSky/Iris/assets/55511420/14c9f979-e7a1-440e-80d7-21d5e65c5036',
    ];
    let currentImageIndex = 0;
    const background = document.querySelector('.background');

    /**
     * Altera a imagem de fundo para a próxima da lista.
     */
    window.changeBackground = () => {
        if (background) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            background.style.backgroundImage = `url('${images[currentImageIndex]}')`;
        }
    };

    setInterval(changeBackground, 60000);
    if (background) background.style.backgroundImage = `url('${images[0]}')`;
}

/**
 * Configura o comportamento do botão de login, incluindo movimento e interações.
 */
function setupLoginButton() {
    const loginButton = document.getElementById('loginButton');
    if (!loginButton) return;
    let clickCount = 0;
    const emojis = ['😠', '😖', '😭', '😤', '😡'];

    /* Define a posição inicial do botão */
    const initialPosition = {
        x: loginButton.offsetLeft + loginButton.offsetWidth / 2,
        y: loginButton.offsetTop + loginButton.offsetHeight / 2,
    };

    /* Define a área de fuga como 50% ao redor da posição inicial */
    const escapeArea = {
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.5,
    };

    /* Limites da área de fuga */
    const escapeBounds = {
        minX: initialPosition.x - escapeArea.width / 2,
        maxX: initialPosition.x + escapeArea.width / 2,
        minY: initialPosition.y - escapeArea.height / 2,
        maxY: initialPosition.y + escapeArea.height / 2,
    };

    /**
     * Move o botão de login com base na posição do mouse.
     * @param {MouseEvent} event - O evento de movimento do mouse.
     */
    const moveButton = (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const buttonRect = loginButton.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        const distanceX = mouseX - buttonCenterX;
        const distanceY = mouseY - buttonCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        /* Se o mouse estiver perto o suficiente, move o botão */
        if (distance < escapeArea.width / 2) {
            const angle = Math.atan2(distanceY, distanceX);
            const newX = mouseX + Math.cos(angle) * (escapeArea.width / 2) - buttonRect.width / 2;
            const newY = mouseY + Math.sin(angle) * (escapeArea.height / 2) - buttonRect.height / 2;

            /* Garante que o botão não saia da área de fuga */
            loginButton.style.left = `${Math.min(Math.max(newX, escapeBounds.minX), escapeBounds.maxX - buttonRect.width)}px`;
            loginButton.style.top = `${Math.min(Math.max(newY, escapeBounds.minY), escapeBounds.maxY - buttonRect.height)}px`;
        }
    };

    /**
     * Teleporta o botão para uma posição aleatória dentro da área de fuga.
     */
    const teleportButton = () => {
        const buttonRect = loginButton.getBoundingClientRect();
        const randomX = Math.floor(Math.random() * (escapeBounds.maxX - escapeBounds.minX - buttonRect.width)) + escapeBounds.minX;
        const randomY = Math.floor(Math.random() * (escapeBounds.maxY - escapeBounds.minY - buttonRect.height)) + escapeBounds.minY;
        loginButton.style.left = `${randomX}px`;
        loginButton.style.top = `${randomY}px`;
    };

    /**
     * Atualiza o conteúdo do pseudo-elemento ::after com um emoji aleatório.
     */
    const updateAfterContent = () => {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const style = document.createElement('style');
        style.innerHTML = `
            .login-button.zzz::after {
                content: "${randomEmoji}";
            }
        `;
        document.head.appendChild(style);
    };

    /**
     * Lida com o clique no botão de login, exibindo alertas e eventualmente removendo o botão.
     */
    const handleClick = () => {
        clickCount += 1;
        loginButton.style.position = 'absolute';
        updateAfterContent();
        teleportButton();
        if (clickCount < 3) {
            alert('Pare de me perturbar, eu sou só um botão inútil, fique longe de mim!');
        } else {
            alert('Cansei de você me pertubando! Vou procurar um lugar mais divertido e calmo, adeus!');
            loginButton.style.display = 'none';
            const message = document.createElement('div');
            message.innerText = 'Botão Login desistiu de viver nesse website e saiu em novas aventuras...';
            message.style.color = '#EE4B2B';
            message.style.marginTop = '20px';
            message.style.fontFamily = 'Press Start 2P, cursive';
            message.style.fontSize = '12px';
            message.style.textAlign = 'center';
            const loginContainer = document.querySelector('.login-container');
            if (loginContainer) loginContainer.appendChild(message);
            document.removeEventListener('mousemove', moveButton);
            loginButton.removeEventListener('click', handleClick);
        }
    };

    /* Verifica se o dispositivo é móvel e configura o botão de acordo */
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        loginButton.classList.add('zzz');
        updateAfterContent();
    } else {
        document.addEventListener('mousemove', moveButton);
        loginButton.addEventListener('click', handleClick);
    }
}

/**
 * Configura o botão de controle de áudio para mutar/desmutar elementos de mídia.
 */
function setupAudioControl() {
    const audioButton = document.getElementById('audioButton');
    if (!audioButton) return;
    let isAudioMuted = false;

    /**
     * Alterna o estado de mudo dos elementos de áudio e vídeo.
     */
    window.toggleAudio = () => {
        isAudioMuted = !isAudioMuted;
        audioButton.innerHTML = isAudioMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        Array.from(document.querySelectorAll('audio, video')).forEach((el) => {
            /* eslint-disable-next-line no-param-reassign */
            el.muted = isAudioMuted;
        });
    };
    audioButton.addEventListener('click', toggleAudio);
}

/**
 * Redireciona para uma URL após exibir uma animação de carregamento.
 * @param {string} url - A URL para redirecionar.
 * @param {HTMLElement} element - O elemento que contém a animação de carregamento.
 */
window.redirectTo = (url, element) => {
    const loading = element.querySelector('.loading');
    if (loading) loading.style.display = 'block';
    setTimeout(() => {
        window.location.href = url;
    }, 5000);
};

/**
 * Salva o estado de um toggle no localStorage.
 * @param {string} toggleId - O ID do toggle.
 * @param {boolean} state - O estado a ser salvo.
 */
function saveToggleState(toggleId, state) {
    localStorage.setItem(toggleId, state);
}

/**
 * Carrega o estado de um toggle do localStorage.
 * @param {string} toggleId - O ID do toggle.
 * @returns {boolean} - O estado carregado.
 */
function loadToggleState(toggleId) {
    return localStorage.getItem(toggleId) === 'true';
}

/**
 * Configura o toggle de dark mode.
 */
function setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    let isDarkMode = loadToggleState('isDarkMode');
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    darkModeToggle.addEventListener('change', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        saveToggleState('isDarkMode', isDarkMode);
    });
}

/**
 * Configura o toggle de easter egg para exibir ou ocultar o botão de login.
 */
function setupEasterEggToggle() {
    const easterEggToggle = document.getElementById('easterEggToggle');
    const loginButton = document.getElementById('loginButton');
    if (!easterEggToggle || !loginButton) return;
    let isEasterEgg = loadToggleState('isEasterEgg');
    if (isEasterEgg) {
        loginButton.style.display = 'block';
        easterEggToggle.checked = true;
    }
    easterEggToggle.addEventListener('change', () => {
        isEasterEgg = !isEasterEgg;
        loginButton.style.display = isEasterEgg ? 'block' : 'none';
        saveToggleState('isEasterEgg', isEasterEgg);
    });
}

/* Inicializa todas as funcionalidades */
updateTimeAndDate();
setupBackgroundChanger();
setupLoginButton();
setupDarkModeToggle();
setupEasterEggToggle();
setupAudioControl();
