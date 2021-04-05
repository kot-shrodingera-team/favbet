import {
  log,
  getElement,
  checkBookerHost,
} from '@kot-shrodingera-team/germes-utils';
import {
  NewUrlError,
  JsFailError,
} from '@kot-shrodingera-team/germes-utils/errors';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import { updateBalance } from '../stake_info/getBalance';
import clearCoupon from './clearCoupon';

const preCheck = async (): Promise<void> => {
  if (!checkBookerHost()) {
    log('Открыта не страница конторы (или зеркала)', 'crimson');
    window.location.href = new URL(worker.BookmakerMainUrl).href;
    throw new NewUrlError('Открываем страницу БК');
  }

  if (!/\/live/.test(window.location.pathname)) {
    log('Открыт не Live', 'crimson');
    window.location.pathname = '/ru/live/';
    throw new NewUrlError('Переходим на Live');
  } else {
    log('Открыт Live', 'steelblue');
    const betslip = await getElement('#sright div.bbet', 15000);
    if (!betslip) {
      throw new JsFailError('Купон не появился');
    }
  }

  await authStateReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    throw new JsFailError('Нет авторизации');
  }
  log('Есть авторизация', 'steelblue');
  updateBalance();

  const continueButton = document.querySelector<HTMLElement>(
    'button[name^="bbet_pl_ok"]'
  );
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
};

export default preCheck;
