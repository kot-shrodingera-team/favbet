import {
  log,
  checkUrl,
  fireEvent,
  awaiter,
  getElement,
} from '@kot-shrodingera-team/germes-utils';
import clearCoupon from './clearCoupon';
import getBalance, { updateBalance } from '../stake_info/getBalance';
import setBetAcceptMode from './setBetAcceptMode';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import JsFailError from './errors/jsFailError';
import NewUrlError from './errors/newUrlError';
import openBet from './openBet';
import openEvent from './openEvent';
import preCheck from './preCheck';
import setStakeSum from '../worker_callbacks/setStakeSum';
import getCurrentSum from '../stake_info/getCurrentSum';
import { setMaximumStake } from '../stake_info/getMaximumStake';

let couponOpenning = false;

export const isCouponOpenning = (): boolean => couponOpenning;

const showStake = async (): Promise<void> => {
  localStorage.setItem('couponOpening', '1');
  couponOpenning = true;
  try {
    setMaximumStake(0);
    if (!checkUrl()) {
      log('Открыта не страница конторы (или зеркала)', 'crimson');
      window.location.href = new URL(worker.BookmakerMainUrl).href;
      throw new NewUrlError('Открывает страницу БК');
    }

    await authStateReady();
    worker.Islogin = checkAuth();
    worker.JSLogined();
    if (!worker.Islogin) {
      throw new JsFailError('Нет авторизации');
    }
    log('Есть авторизация', 'steelblue');

    const continueButton = document.querySelector(
      'button[name^="bbet_pl_ok"]'
    ) as HTMLElement;
    if (continueButton) {
      log('Сообщение об успешной ставке', 'steelblue');
      log('Нажимаем продолжить', 'orange');
      continueButton.click();
      const deleteAllButton = await getElement('.bbet_d_all');
      if (!deleteAllButton) {
        throw new JsFailError('Кнопка очистки купона не появилась');
      }
    }

    const couponCleared = await clearCoupon();
    if (!couponCleared) {
      throw new JsFailError('Не удалось очистить купон');
    }
    updateBalance();

    await preCheck();

    await openEvent();

    await openBet();

    worker.StakeInfo.Balance = getBalance();
    setStakeSum(0);
    const maxIconElement = document.querySelector('.mx-bet-ico');
    log('Проверяем максимальную ставку', 'orange');
    fireEvent(maxIconElement, 'click');
    const maximumStake = await awaiter(() => {
      const currentSum = getCurrentSum();
      return currentSum;
    });

    if (maximumStake) {
      log(`Максимальная ставка: ${maximumStake}`, 'steelblue');
      setMaximumStake(Number(maximumStake));
      setStakeSum(0);
    } else {
      throw new JsFailError('Максимум не загрузился');
    }

    log('Ставка успешно открыта', 'green');
    setBetAcceptMode();
    couponOpenning = false;
    localStorage.setItem('couponOpening', '0');
    worker.JSStop();
  } catch (error) {
    if (error instanceof JsFailError) {
      log(error.message, 'red');
      couponOpenning = false;
      localStorage.setItem('couponOpening', '0');
      worker.JSFail();
    }
    if (error instanceof NewUrlError) {
      log(error.message, 'orange');
    }
  }
};

export default showStake;
