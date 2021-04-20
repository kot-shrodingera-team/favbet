import getCurrentSumGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getCurrentSum';

export const sumInputSelector = '#inputC';

const getCurrentSum = getCurrentSumGenerator({
  sumInputSelector,
  // zeroValues: [],
  // replaceDataArray: [
  //   {
  //     searchValue: '',
  //     replaceValue: '',
  //   },
  // ],
  // removeRegex: /[\s,']/g,
  // currentSumRegex: /(\d+(?:\.\d+)?)/,
  // context: () => document,
});

export default getCurrentSum;
