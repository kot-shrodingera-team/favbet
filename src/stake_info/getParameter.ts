import { getWorkerParameter, log } from '@kot-shrodingera-team/germes-utils';

const getParameter = (): number => {
  if (getWorkerParameter('fakeParameter')) {
    const parameter = Number(JSON.parse(worker.ForkObj).param);
    if (Number.isNaN(parameter)) {
      return -6666;
    }
    return parameter;
  }

  const outcomeElement = document.querySelector('.outcmn');
  const marketElement = document.querySelector('.b_ev_name');
  if (!outcomeElement) {
    log('Не найдена роспись ставки', 'crimson');
    return -9999;
  }
  if (!marketElement) {
    log('Не найден маркет ставки', 'crimson');
    return -9999;
  }

  const outcome = outcomeElement.textContent.trim();
  const market = marketElement.textContent.trim();
  const parameterRegex = /\(([+-]?\d+(?:\.\d+)?)\)/;
  const parameterMatch = outcome.match(parameterRegex);
  if (parameterMatch) {
    return Number(parameterMatch[1]);
  }
  // Draw No Bet = H(0)
  if (market === 'Результат без ничьи') {
    return 0;
  }
  return -6666;
};

export default getParameter;
