const urlInput = document.getElementById('youtubeUrl');
const thumbnail = document.getElementById('thumbnail');
const commandDiv = document.getElementById('command');
const urlError = document.getElementById('urlError');
const modalOverlay = document.getElementById('formatModal');
const modal = modalOverlay.querySelector('.modal');
const copiedTooltip = document.getElementById('copiedTooltip');
const formatOptionsModal = document.getElementById('formatOptionsModal');
const formatList = document.getElementById('formatList');

function showCopiedTooltip() {
    copiedTooltip.classList.add('show');
    setTimeout(() => {
        copiedTooltip.classList.remove('show');
    }, 2000);
}

function selectFormat(mediaType, format) {
    generateCommand(mediaType, format);
    copyCommand();
    showCopiedTooltip();
}

function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : false;
}

function generateCommand(mediaType, format) {
    const url = urlInput.value;
    let command = '';

    if (!getYouTubeVideoId(url)) {
        urlError.style.display = 'block';
        commandDiv.style.display = 'none';
        return;
    }

    if (mediaType === 'audio') {
        command = `yt-dlp -f ba -o "%(title)s.%(ext)s" "${url}" --recode-video ${format} --postprocessor-args "-preset ultrafast"`;
    } else {
        command = `yt-dlp -f "ba+bv" -o "%(title)s.%(ext)s" "${url}" --recode-video ${format} --postprocessor-args "-preset ultrafast"`;
    }

    if (navigator.platform.toLowerCase().includes('win')) {
        command = `cmd /c "cd %userprofile%\\Desktop && ${command}"`;
    }

    commandDiv.textContent = command;
}

function copyCommand() {
    const command = commandDiv.textContent;
    navigator.clipboard.writeText(command).then(() => {
        showCopiedTooltip();
    }).catch(err => {
        console.error('Failed to copy command:', err);
    });
}

urlInput.addEventListener('input', function() {
    const videoId = getYouTubeVideoId(this.value);
    if (videoId) {
        thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        thumbnail.style.display = 'block';
        urlError.style.display = 'none';
    } else {
        thumbnail.style.display = 'none';
        urlError.style.display = 'block';
    }
});

urlInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const videoId = getYouTubeVideoId(this.value);
        if (videoId) {
            showModal();
        }
    }
});

function showModal() {
    modalOverlay.style.display = 'flex';
    document.body.classList.add('pause-animation');
    requestAnimationFrame(() => {
        modalOverlay.classList.add('show');
        modal.classList.add('show');
    });
}

function hideModal() {
    modalOverlay.classList.remove('show');
    modal.classList.remove('show');
    setTimeout(() => {
        modalOverlay.style.display = 'none';
        document.body.classList.remove('pause-animation');
    }, 300);
}

modalOverlay.addEventListener('click', function(event) {
    if (event.target === modalOverlay) {
        hideModal();
    }
});

function showFormatOptions(mediaType) {
    hideModal();
    formatList.innerHTML = '';
    
    const formats = mediaType === 'video' 
        ? [
            { format: 'mp4', icon: '📹', name: 'MP4' },
            { format: 'webm', icon: '🎥', name: 'WEBM' },
            { format: 'mkv', icon: '📁', name: 'MKV' },
            { format: 'mov', icon: '🎞', name: 'MOV' }
        ]
        : [
            { format: 'mp3', icon: '🎵', name: 'MP3' },
            { format: 'wav', icon: '🎶', name: 'WAV' },
            { format: 'ogg', icon: '🎧', name: 'OGG' },
            { format: 'webm', icon: '🎼', name: 'WEBM' }
        ];

    formats.forEach(item => {
        const option = document.createElement('div');
        option.className = 'format-option';
        option.innerHTML = `
            <div class="format-icon">${item.icon}</div>
            <div class="format-name">${item.name}</div>
        `;
        option.onclick = () => {
            selectFormat(mediaType, item.format);
            hideFormatOptions();
        };
        formatList.appendChild(option);
    });

    formatOptionsModal.style.display = 'flex';
    document.body.classList.add('pause-animation');
    requestAnimationFrame(() => {
        formatOptionsModal.classList.add('show');
        formatOptionsModal.querySelector('.modal').classList.add('show');
    });
}

function hideFormatOptions() {
    formatOptionsModal.classList.remove('show');
    formatOptionsModal.querySelector('.modal').classList.remove('show');
    setTimeout(() => {
        formatOptionsModal.style.display = 'none';
        document.body.classList.remove('pause-animation');
    }, 300);
}

formatOptionsModal.addEventListener('click', function(event) {
    if (event.target === formatOptionsModal) {
        hideFormatOptions();
    }
}); 