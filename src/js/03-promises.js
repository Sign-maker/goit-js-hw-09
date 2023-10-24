import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import '../css/03-promises.css';

const notifyOptions = {
  width: '280px',
  position: 'right-top',
  timeout: 5000,
  useIcon: false,
};
Notify.init(notifyOptions);

const formRef = document.querySelector('.form');
formRef.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const { delay, step, amount } = formRef.elements;
  for (let i = 1; i <= Number(amount.value); i += 1) {
    const currentDelay = Number(delay.value) + Number(step.value) * (i - 1);
    createPromise(i, currentDelay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
