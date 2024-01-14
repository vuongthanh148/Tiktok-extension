document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const videoUrl = document.getElementById('videoUrl');

    startButton.addEventListener('click', function () {
        // Logic when Start button is clicked
        chrome.storage.local.set({ 'start': 'on' });

    });

    endButton.addEventListener('click', function () {
        // Logic when End button is clicked
        chrome.storage.local.set({ 'start': 'off' });
    });

    videoUrl.addEventListener('change', () => {
        chrome.storage.local.set({ 'videoUrl': videoUrl.value });
    })
});
