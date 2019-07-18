const speedDash = document.querySelector('.speedDash');
const scoreDash = document.querySelector('.scoreDash');
const lifeDash = document.querySelector('.lifeDash');
const container = document.getElementById('.container');
const btnStart = document.querySelector('.startButton');

btnStart.addEventListener('click', startGame);
document.addEventListener('keydown', pressKeyOn);