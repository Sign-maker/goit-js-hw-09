import '../css/01-color-switcher.css';
const startBtn = document.querySelector('button[data-start]');
const stopBtn = document.querySelector('button[data-stop]');
const docBody = document.querySelector('body');

startBtn.addEventListener('click', startBtnClickHandler);
stopBtn.addEventListener('click', stopBtnClickHandler);

let intervalId = null;
stopBtn.setAttribute('disabled', '');

function startBtnClickHandler() {
  startBtn.setAttribute('disabled', '');
  stopBtn.removeAttribute('disabled');

  setRandomBodyColor();

  intervalId = setInterval(() => {
    setRandomBodyColor();
  }, 1000);
}

function stopBtnClickHandler() {
  clearInterval(intervalId);
  stopBtn.setAttribute('disabled', '');
  startBtn.removeAttribute('disabled');
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

function setRandomBodyColor() {
  docBody.style.backgroundColor = getRandomHexColor();
}
