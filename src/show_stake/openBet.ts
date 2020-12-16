import { awaiter, log } from '@kot-shrodingera-team/germes-utils';
import { getReactInstance } from '@kot-shrodingera-team/germes-utils/reactUtils';
import getStakeCount from '../stake_info/getStakeCount';
import JsFailError from './errors/jsFailError';

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

  const maxTryCount = 5;
  for (let i = 1; i <= maxTryCount; i += 1) {
    dispatch(data);
    // eslint-disable-next-line no-await-in-loop
    const betAdded = await awaiter(() => getStakeCount() === 1, 1000, 50);

    if (!betAdded) {
      if (i === maxTryCount) {
        throw new JsFailError(
          'Ставка так и не попала в купон. Возможно исход уже не доступен'
        );
      }
      log(`Ставка не попала в купон (попытка ${i})`, 'steelblue');
    } else {
      log('Ставка попала в купон', 'steelblue');
      break;
    }
  }
};

export default openBet;
