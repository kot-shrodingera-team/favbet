import { log } from '@kot-shrodingera-team/germes-utils';

const checkStakeStatus = (): boolean => {
  const succesfullBetElement = document.querySelector('.fa-check-circle');
  const errorElements = document.querySelectorAll(
    '.bbet_nfb li[class^="err_"]'
  );
  const acceptButton = document.querySelector('.bbet_acpt:not(.nd)');

  if (succesfullBetElement) {
    log('Ставка принята', 'green');
    return true;
  }
  if (errorElements.length) {
    errorElements.forEach((errorElement) => {
      const errorText = errorElement.textContent.trim();
      log(errorText, 'tomato');
    });
    log('Ставка не принята', 'red');
    return false;
  }
  if (acceptButton) {
    log('Ставка не принята', 'red');
    return false;
  }
  log('Неизвестный результат ставки. Считаем ставку непринятой', 'red');
  return false;
};

export default checkStakeStatus;
