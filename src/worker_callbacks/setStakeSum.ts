import setStakeSumGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/setStakeSum';

// const preInputCheck = (sum: number): boolean => {
//   return true;
// };

const setStakeSum = setStakeSumGenerator({
  sumInputSelector: '#inputC',
  alreadySetCheck: {
    falseOnSumChange: false,
  },
  inputType: 'fireEvent',
  fireEventName: 'blur',
  // preInputCheck,
});

export default setStakeSum;
