import { showMessage } from 'react-native-flash-message';
import Fonts from '../Theme/Fonts';
import Colors from '../Theme/Colors';
import { scale } from '../Theme/Scalling';
/**
 * Display an error on toast
 * @param {String} message Error to display
 */
const showError = (message = '') => {
  showMessage({
    message: message,
    type: 'danger',
    floating: true,
    autoHide: true,
    textStyle: {
      fontWeight: 'bold',
      fontFamily: Fonts.Regular,
    },
    icon: { icon: 'danger', position: 'left' },
    titleStyle: {
      fontFamily: Fonts.Regular,
      backgroundColor: Colors.toastColor,
      fontSize: scale(17),
      color: 'white',
    },
    backgroundColor: Colors.toastColor,
  });
};

export default showError;
