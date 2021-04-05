import doStakeGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/doStake';
import { log } from '@kot-shrodingera-team/germes-utils';
import getCoefficient from '../stake_info/getCoefficient';
import { clearDoStakeTime } from '../stake_info/doStakeTime';
// import { clearLastRefreshTime } from './checkCouponLoading';

// const preCheck = (): boolean => {
//   return true;
// };

const postCheck = (): boolean => {
  // clearLastRefreshTime();
  const errorList = document.querySelector('.bbet_dwn .bbet_nfb');
  if (errorList) {
    log('Удаляем список ошибок', 'orange');
    errorList.remove();
  }
  return true;
};

const doStake = doStakeGenerator({
  // preCheck,
  doStakeButtonSelector: 'button[name="bbet_pl"]',
  // errorClasses: [
  //   {
  //     className: '',
  //     message: '',
  //   },
  // ],
  disabledCheck: true,
  getCoefficient,
  postCheck,
  clearDoStakeTime,
  fakeDoStakeWorkerParameterName: 'fakeDoStake',
  // context: () => document,
});

export default doStake;
