import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
// import { authElementSelector } from '../stake_info/checkAuth';
// import { updateBalance, balanceReady } from '../stake_info/getBalance';
// import afterSuccesfulLogin from './afterSuccesfulLogin';

// const setLoginType = async (): Promise<boolean> => {
//   return true;
// };

const authorize = authorizeGenerator({
  openForm: {
    selector: '#noauth .loginpagecl',
    openedSelector: '.auth-modal',
    // loopCount: 10,
    // triesInterval: 1000,
    // afterOpenDelay: 1000,
  },
  // setLoginType,
  loginInputSelector: '#username',
  passwordInputSelector: '#password',
  submitButtonSelector: 'button[type="submit"]',
  inputType: 'react',
  // fireEventNames: ['input'],
  // beforeSubmitDelay: 0,
  // captchaSelector: '',
  // loginedWait: {
  //   loginedSelector: authElementSelector,
  //   balanceReady,
  //   updateBalance,
  //   afterSuccesfulLogin,
  // },
  // context: () => document,
});

export default authorize;
