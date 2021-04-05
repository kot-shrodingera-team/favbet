// import getMaximumStakeGenerator, {
//   maximumStakeReadyGenerator,
// } from '@kot-shrodingera-team/germes-generators/stake_info/getMaximumStake';
import { getWorkerParameter } from '@kot-shrodingera-team/germes-utils';
import getBalance from './getBalance';

let maximumStake: number;

export const setMaximumStake = (newMaximumStake: number): void => {
  maximumStake = newMaximumStake;
};

// export const maximumStakeReady = maximumStakeReadyGenerator({
//   maximumStakeElementSelector: '',
//   // maximumStakeRegex: /(\d+(?:\.\d+)?)/,
//   // replaceDataArray: [
//   //   {
//   //     searchValue: '',
//   //     replaceValue: '',
//   //   },
//   // ],
//   // removeRegex: /[\s,']/g,
// });

// const getMaximumStake = getMaximumStakeGenerator({
//   maximumStakeElementSelector: '',
//   // maximumStakeRegex: /(\d+(?:\.\d+)?)/,
//   // replaceDataArray: [
//   //   {
//   //     searchValue: '',
//   //     replaceValue: '',
//   //   },
//   // ],
//   // removeRegex: /[\s,']/g,
// });

const getMaximumStake = (): number => {
  if (getWorkerParameter('fakeMaximumStake')) {
    return Number(getWorkerParameter('fakeMaximumStake'));
  }
  if (maximumStake) {
    return maximumStake;
  }
  return getBalance();
};

export default getMaximumStake;
