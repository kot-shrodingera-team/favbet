import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';

const getStakeCount = getStakeCountGenerator({
  stakeSelector: '.bbet_name',
  fakeStakeCountWorkerParameterName: 'fakeStakeCount',
  // context: () => document,
});

export default getStakeCount;
