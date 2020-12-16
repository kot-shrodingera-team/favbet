import authorizeGenerator from '@kot-shrodingera-team/germes-generators/initialization/authorize';
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
  // beforeSubmitDelay: 0,
  // captchaSelector: '',
  // loginedWait: {
  //   loginedSelector: '',
  //   balanceReady,
  //   updateBalance,
  // },
  // afterSuccesfulLogin,
});

export default authorize;
