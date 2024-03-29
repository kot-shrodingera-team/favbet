// import {
//   balanceReadyGenerator,
//   getBalanceGenerator,
// } from '@kot-shrodingera-team/germes-generators/stake_info/getBalance';

import {
  getElement,
  getWorkerParameter,
  log,
} from '@kot-shrodingera-team/germes-utils';

let balance = 0;

const getBalance = (): number => {
  if (getWorkerParameter('fakeBalance') || getWorkerParameter('fakeAuth')) {
    const fakeBalance = getWorkerParameter('fakeBalance');
    if (typeof fakeBalance === 'number') {
      return fakeBalance;
    }
    return 100000;
  }
  return balance;
};

export const setBalance = (newBalance: number): void => {
  balance = newBalance;
};

export const balanceReady = async (): Promise<boolean> => {
  return true;
};

export const updateBalance = async (): Promise<void> => {
  if (getWorkerParameter('fakeBalance') || getWorkerParameter('fakeAuth')) {
    worker.JSBalanceChange(getBalance());
    return;
  }
  const accountIcon = (await getElement('.message--icon')) as HTMLElement;
  if (!accountIcon) {
    log('Не найдена иконка аккаунта', 'crimson');
    return;
  }
  accountIcon.click();
  const balanceElement = await getElement('.current_amount');
  if (!balanceElement) {
    log('Не найден баланс');
    return;
  }
  const balanceText = balanceElement.textContent.trim();
  const balanceRegex = /(\d+(?:\.\d+)?)/;
  const balanceMatch = balanceText.match(balanceRegex);
  if (!balanceMatch) {
    log(`Непонятный формат баланса: "${balanceText}"`, 'crimson');
    return;
  }
  balance = Number(balanceMatch[1]);
  worker.JSBalanceChange(balance);
  log(`Баланс обновлён (${balance})`);
  const closeIcon = document.querySelector('.icon_close') as HTMLElement;
  if (!closeIcon) {
    log('Не найдена кнопка закрытия всплывающего окна');
    return;
  }
  closeIcon.click();
};

// export const balanceReady = balanceReadyGenerator({
//   balanceSelector: '.user--balance',
//   // balanceRegex: /(\d+(?:\.\d+)?)/,
//   // replaceDataArray: [
//   //   {
//   //     searchValue: '',
//   //     replaceValue: '',
//   //   },
//   // ],
//   // removeRegex: /[\s,']/g,
// });

// const getBalance = getBalanceGenerator({
//   balanceSelector: '.user--balance',
//   // balanceRegex: /(\d+(?:\.\d+)?)/,
//   // replaceDataArray: [
//   //   {
//   //     searchValue: '',
//   //     replaceValue: '',
//   //   },
//   // ],
//   // removeRegex: /[\s,']/g,
// });

// export const updateBalance = (): void => {
//   worker.JSBalanceChange(getBalance());
// };

export default getBalance;
