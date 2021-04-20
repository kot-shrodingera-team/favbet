import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import { awaiter, getElement, log } from '@kot-shrodingera-team/germes-utils';
// import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
// import openBet from '../show_stake/openBet';
import { getDoStakeTime } from '../stake_info/doStakeTime';

const bookmakerName = '';

const timeout = 50000;
const getRemainingTimeout = (maximum?: number) => {
  const result = timeout - (new Date().getTime() - getDoStakeTime().getTime());
  if (maximum !== undefined && timeout > maximum) {
    return maximum;
  }
  return result;
};

const error = (message?: string) => {
  if (message !== undefined) {
    log(message, 'crimson');
  }
  window.germesData.betProcessingStep = 'error';
};
// const errorInform = (message: string) => {
//   log(message, 'crimson');
//   worker.Helper.SendInformedMessage(
//     `В ${bookmakerName} произошла ошибка принятия ставки:\n${message}\n`
//   );
//   window.germesData.betProcessingStep = 'error';
// };
const success = (message?: string) => {
  if (message !== undefined) {
    log(message, 'steelblue');
  }
  window.germesData.betProcessingStep = 'success';
};
// const reopen = async (message?: string) => {
//   if (message !== undefined) {
//     log(message, 'crimson');
//   }
//   window.germesData.betProcessingStep = 'reopen';
//   log('Переоткрываем купон', 'orange');
//   try {
//     await openBet();
//     log('Ставка успешно переоткрыта', 'green');
//     window.germesData.betProcessingStep = 'reopened';
//   } catch (reopenError) {
//     if (reopenError instanceof JsFailError) {
//       log(reopenError.message, 'red');
//       window.germesData.betProcessingStep = 'error';
//     } else {
//       log(reopenError.message, 'red');
//       window.germesData.betProcessingStep = 'error';
//     }
//   }
// };

const loaderSelector = '.bbet:not(.prgss) .bbet_prgs_msg';
const errorSelector = '.bbet_nfb li[class^="err_"]';
const acceptChangesButtonSelector = '.bbet_acpt:not(.nd)';
const betPlacedSelector = '.fa-check-circle';

const asyncCheck = async () => {
  window.germesData.betProcessingStep = 'waitingForLoaderOrResult';

  await Promise.race([
    getElement(loaderSelector, getRemainingTimeout()),
    getElement(errorSelector, getRemainingTimeout()),
    getElement(acceptChangesButtonSelector, getRemainingTimeout()),
    getElement(betPlacedSelector, getRemainingTimeout()),
  ]);

  const loaderElement = document.querySelector(loaderSelector);

  if (loaderElement) {
    log('Появился индикатор', 'steelblue');
    window.germesData.betProcessingAdditionalInfo = 'индикатор';
    awaiter(
      () => {
        return document.querySelector(loaderSelector) === null;
      },
      getRemainingTimeout(),
      100
    ).then((loaderDissappeared) => {
      if (loaderDissappeared) {
        log('Исчез индикатор', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = null;
      }
    });

    window.germesData.betProcessingStep = 'waitingForResult';
    await Promise.race([
      getElement(errorSelector, getRemainingTimeout()),
      getElement(acceptChangesButtonSelector, getRemainingTimeout()),
      getElement(betPlacedSelector, getRemainingTimeout()),
    ]);
  }

  const errorElements = [...document.querySelectorAll(errorSelector)];
  const acceptChangesButton = document.querySelector(
    acceptChangesButtonSelector
  );
  const betPlacedElement = document.querySelector(betPlacedSelector);

  if (errorElements.length) {
    errorElements.forEach((errorElement) => {
      const errorText = errorElement.textContent.trim();
      log(errorText, 'tomato');
    });
    return error();
  }

  if (acceptChangesButton) {
    return error('Изменение котировок');
  }

  if (betPlacedElement) {
    return success('Ставка принята');
  }

  return error('Не дождались результата ставки');
};

const check = () => {
  const step = window.germesData.betProcessingStep;
  const additionalInfo = window.germesData.betProcessingAdditionalInfo
    ? ` (${window.germesData.betProcessingAdditionalInfo})`
    : '';
  switch (step) {
    case 'beforeStart':
      asyncCheck();
      return true;
    case 'error':
    case 'success':
    case 'reopened':
      log(`Обработка ставки завершена (${step})${additionalInfo}`, 'orange');
      return false;
    default:
      log(`Обработка ставки (${step})${additionalInfo}`, 'tan');
      return true;
  }
};

const checkCouponLoading = checkCouponLoadingGenerator({
  getDoStakeTime,
  bookmakerName,
  timeout,
  check,
});

export default checkCouponLoading;
