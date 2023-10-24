import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import '../css/02-timer.css';

const refs = {
  inputDate: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  daysOutput: document.querySelector('span[data-days]'),
  hoursOutput: document.querySelector('span[data-hours]'),
  minutesOutput: document.querySelector('span[data-minutes]'),
  secondsOutput: document.querySelector('span[data-seconds]'),
};

const ACTIVE = true;
let selectedDate = Date.now();

const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: onFlatpickrClose,
};

const notifyOptions = {
  width: '300px',
  position: 'right-top',
  timeout: 3000,
  clickToClose: true,
};

class ReverseTimer {
  static TICK = 1000;
  intervalId = null;
  dateTo = null;
  isActive = false;

  constructor(render, notifyStart, notifyStop) {
    this.render = render;
    this.notifyStart = notifyStart;
    this.notifyStop = notifyStop;
  }

  start() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.notifyStart();
    this.intervalId = setInterval(() => {
      const difference = this.dateTo - Date.now();
      if (difference <= 0) {
        this.stop();
        return;
      }
      this.render(difference);
    }, ReverseTimer.TICK);
  }

  stop() {
    if (!this.isActive) {
      return;
    }
    clearInterval(this.intervalId);
    this.isActive = false;
    this.notifyStop();
  }
}

const revTimer = new ReverseTimer(
  renderFields,
  () => Notify.success('Timer activated'),
  () => Notify.success('Timer stoped')
);

setBtnState(refs.startBtn, !ACTIVE);
refs.startBtn.addEventListener('click', onStartClick);

flatpickr(refs.inputDate, flatpickrOptions);
Notify.init(notifyOptions);

function onFlatpickrClose(selectedDates) {
  restDate = selectedDates[0] - Date.now();
  if (restDate <= 0) {
    Notify.failure('Please choose a date in the future');
    return;
  }
  selectedDate = selectedDates[0];
  renderFields(restDate);
  setBtnState(refs.startBtn, ACTIVE);
}

function onStartClick() {
  if (selectedDate - Date.now() <= 0) {
    renderFields(0);
    setBtnState(refs.startBtn, !ACTIVE);
    Notify.failure('Sorry, time is over!');
    return;
  }
  revTimer.dateTo = selectedDate;
  revTimer.start();
  setBtnState(refs.startBtn, !ACTIVE);
}

function setBtnState(btnRef, state) {
  if (state) {
    btnRef.removeAttribute('disabled');
  } else btnRef.setAttribute('disabled', '');
}

function renderFields(date) {
  const { days, hours, minutes, seconds } = convertMs(date);
  const { daysOutput, hoursOutput, minutesOutput, secondsOutput } = refs;
  daysOutput.textContent = addLeadingZero(days);
  hoursOutput.textContent = addLeadingZero(hours);
  minutesOutput.textContent = addLeadingZero(minutes);
  secondsOutput.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
