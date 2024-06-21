import {Dimensions, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (shortDimension / guidelineBaseWidth) * size;
const verticalScale = size => (longDimension / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const widthPercentageToDP = widthPercent => {
  // Convert string input to decimal number
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};
const heightPercentageToDP = heightPercent => {
  // Convert string input to decimal number
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
};

const listenOrientationChange = that => {
  Dimensions.addEventListener('change', newDimensions => {
    let screenWidth = newDimensions.window.width;
    let screenHeight = newDimensions.window.height;
    // that.setState({
    //   orientation: screenWidth < screenHeight ? 'portrait' : 'landscape',
    // });
  });
};

const removeOrientationListener = () => {
  Dimensions.removeEventListener('change', () => {});
};

export {
  widthPercentageToDP,
  heightPercentageToDP,
  listenOrientationChange,
  removeOrientationListener,
  scale,
  verticalScale,
  moderateScale,
  width,
};
