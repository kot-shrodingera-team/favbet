// import getMinimumStakeGenerator, {
//   minimumStakeReadyGenerator,
// } from '@kot-shrodingera-team/germes-generators/stake_info/getMinimumStake';

import { getWorkerParameter } from '@kot-shrodingera-team/germes-utils';

// export const minimumStakeReady = minimumStakeReadyGenerator({
//   minimumStakeElementSelector: '',
//   // minimumStakeRegex: /(\d+(?:\.\d+)?)/,
//   // replaceDataArray: [
//   //   {
//   //     searchValue: '',
//   //     replaceValue: '',
//   //   },
//   // ],
//   // removeRegex: /[\s,']/g,
// });

// const getMinimumStake = getMinimumStakeGenerator({
//   minimumStakeElementSelector: '',
//   // minimumStakeRegex: /(\d+(?:\.\d+)?)/,
//   // replaceDataArray: [
//   //   {
//   //     searchValue: '',
//   //     replaceValue: '',
//   //   },
//   // ],
//   // removeRegex: /[\s,']/g,
// });

const getMinimumStake = (): number => {
  if (getWorkerParameter('fakeMinimumStake')) {
    return Number(getWorkerParameter('fakeMinimumStake'));
  }
  switch (worker.Currency) {
    case 'RUR':
      return 10;
    case 'EUR':
      return 0.01;
    default:
      return 0;
  }
};

export default getMinimumStake;
