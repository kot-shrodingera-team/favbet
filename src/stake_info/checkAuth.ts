import checkAuthGenerator, {
  authStateReadyGenerator,
} from '@kot-shrodingera-team/germes-generators/stake_info/checkAuth';

export const noAuthElementSelector = '#noauth';
export const authElementSelector = '#gauth';

export const authStateReady = authStateReadyGenerator({
  noAuthElementSelector,
  authElementSelector,
  // maxDelayAfterNoAuthElementAppeared: 0,
  fakeAuthWorkerParameterName: 'fakeAuth',
  // context: () => document,
});

const checkAuth = checkAuthGenerator({
  authElementSelector,
  fakeAuthWorkerParameterName: 'fakeAuth',
  // context: () => document,
});

export default checkAuth;
