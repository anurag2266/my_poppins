import {showMessage} from 'react-native-flash-message';
import Fonts from '../Theme/Fonts';
import {scale} from '../Theme/Scalling';
/**
 * Display the toast with message that you have passed
 * @param {String} message Message to display into the toast
 */
const showToast = (message = '') => {
  showMessage({
    message: message,
    type: 'success',
    floating: true,
    autoHide: true,
    icon: {icon: 'success', position: 'left'},
    textStyle: {
      fontWeight: 'bold',
      fontFamily: Fonts.Regular,
      fontSize: scale(17),
    },
    backgroundColor: 'black',
    titleStyle: {fontFamily: Fonts.Regular, fontSize: scale(17)},
  });
};

export default showToast;
