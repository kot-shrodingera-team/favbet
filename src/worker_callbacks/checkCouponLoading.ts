import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import { log } from '@kot-shrodingera-team/germes-utils';
import { getDoStakeTime } from '../stake_info/doStakeTime';

let lastRefreshTime: Date = null;

export const clearLastRefreshTime = (): void => {
  lastRefreshTime = null;
};

const check = () => {
  const referenceTime = lastRefreshTime || getDoStakeTime();
  const now = new Date();
  const timePassedSinceLastRefreshTime =
    now.getTime() - referenceTime.getTime();
  const secondsPassedSinceLastRefreshTime = Math.floor(
    timePassedSinceLastRefreshTime / 1000
  );

  const progressElement = document.querySelector(
    '.bbet:not(.prgss) .bbet_prgs_msg'
  );
  const refreshElement = document.querySelector(
    '.bbet:not(.prgss) .refreshb'
  ) as HTMLElement;
  const succesfullBetElement = document.querySelector('.fa-check-circle');
  const errorElements = document.querySelectorAll(
    '.bbet_nfb li[class^="err_"]'
  );
  const acceptButton = document.querySelector('.bbet_acpt:not(.nd)');

  if (progressElement) {
    if (refreshElement && secondsPassedSinceLastRefreshTime >= 3) {
      log('Обработка ставки (индикатор). Обновляем', 'tan');
      // refreshElement.click();
      lastRefreshTime = new Date();
    } else {
      log('Обработка ставки (индикатор)', 'tan');
    }
    return true;
  }
  if (succesfullBetElement) {
    log('Обработка ставки завершена (успешная ставка)', 'orange');
    return false;
  }
  if (errorElements.length) {
    log('Обработка ставки завершена (ошибка ставки)', 'orange');
    return false;
  }
  if (acceptButton) {
    log('Обработка ставки завершена (изменение котировок)', 'orange');
    return false;
  }
  log('Обработка ставки (нет индикатора)', 'tan');
  return true;
};

const checkCouponLoading = checkCouponLoadingGenerator({
  getDoStakeTime,
  bookmakerName: 'Favbet',
  timeout: 50000,
  check,
});

export default checkCouponLoading;
