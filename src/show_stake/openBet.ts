import {
  awaiter,
  fireEvent,
  getWorkerParameter,
  log,
  repeatingOpenBet,
} from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import { getReactInstance } from '@kot-shrodingera-team/germes-utils/reactUtils';
import getBalance from '../stake_info/getBalance';
import getCurrentSum from '../stake_info/getCurrentSum';
import { setMaximumStake } from '../stake_info/getMaximumStake';
import getStakeCount from '../stake_info/getStakeCount';
import setStakeSum from '../worker_callbacks/setStakeSum';

const getProperty = (
  object: Record<string, unknown>,
  propertyPath: string
): unknown => {
  const properties = propertyPath.split('.');
  let result = object;
  while (result && properties.length) {
    result = result[properties.shift()] as Record<string, unknown>;
  }
  return result;
};

const openBet = async (): Promise<void> => {
  const marketData = JSON.parse(worker.BetId);
  // const [
  //   /* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention */
  //   market_name,
  //   stake_name,
  //   period,
  //   /* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention */
  //   marketId,
  //   outcomeId,
  // ] = worker.BetId.split('|');

  const data = {
    'eventId': Number(worker.EventId),
    'isLiveWidgetOutcome': undefined as unknown,
    'isOutrights': false,
    'marketId': Number(marketData.marketId),
    'outcomeId': Number(marketData.outcomeId),
    'serviceId': undefined as unknown,
    'type': 'BASKET_ADD_OUTCOME',
    '@@redux-saga/SAGA_ACTION': true,
  };

  const coupon = document.querySelector('#sright div.bbet');

  if (!coupon) {
    throw new JsFailError('Не найден купон');
  }

  const couponReactInstance = getReactInstance(coupon) as Record<
    string,
    unknown
  >;

  const dispatch = getProperty(
    couponReactInstance,
    'alternate.return.alternate.return.alternate.return.alternate.return.memoizedProps.value.store.dispatch'
  ) as (data: Record<string, unknown>) => unknown;
  if (!dispatch) {
    throw new JsFailError('Не найден диспетчер');
  }

  // Открытие ставки, проверка, что ставка попала в купон
  const openingAction = async () => {
    dispatch(data);
  };
  await repeatingOpenBet(openingAction, getStakeCount, 5, 1000, 50);

  if (!getWorkerParameter('fakeAuth')) {
    worker.StakeInfo.Balance = getBalance();
    setStakeSum(0);
    const maxIconElement = document.querySelector('.mx-bet-ico');
    if (!maxIconElement) {
      throw new JsFailError('Не найдена иконка максимально ставки');
    }
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
  }

  const eventNameSelector = '.bbet .event--name';
  const marketNameSelector = '.bbet .b_outcome_bname';
  const betNameSelector = '.bbet .outcmn';

  const eventNameElement = document.querySelector(eventNameSelector);
  if (!eventNameElement) {
    throw new JsFailError('Не найдено событие открытой ставки');
  }
  const marketNameElement = document.querySelector(marketNameSelector);
  if (!marketNameElement) {
    throw new JsFailError('Не найден маркет открытой ставки');
  }
  const betNameElement = document.querySelector(betNameSelector);
  if (!betNameElement) {
    throw new JsFailError('Не найдена роспись открытой ставки');
  }

  const eventName = eventNameElement.textContent.trim();
  const marketName = marketNameElement.textContent.trim();
  const betName = betNameElement.textContent.trim();
  log(`Открыта ставка\n${eventName}\n${marketName}\n${betName}`, 'steelblue');
};

export default openBet;
