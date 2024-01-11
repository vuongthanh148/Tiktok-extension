document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const videoUrl = document.getElementById('videoUrl');

    startButton.addEventListener('click', function () {
        // Logic when Start button is clicked
        localStorage.setItem('start', 'on');
        localStorage.setItem('videoUrl', videoUrl.value);
    });

    endButton.addEventListener('click', function () {
        // Logic when End button is clicked
        localStorage.setItem('start', 'off');
    });
});
