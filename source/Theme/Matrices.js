import {scale} from './Scalling';

// Examples of metrics you can define:
export const tiny = scale(7);
export const small = tiny * 2;
export const normal = tiny * 3;
export const medium = normal * 2;

export default {
  bottomMargin: {
    marginBottom: normal,
  },
  bottomPadding: {
    paddingBottom: normal,
  },
  bottomTinyPadding: {
    paddingBottom: tiny,
  },
  mediumBottomMargin: {
    marginBottom: medium,
  },
  smallBottomMargin: {
    marginBottom: small,
  },
  tinyBottomMargin: {
    marginBottom: tiny,
  },
  tinyVerticalMargin: {
    marginVertical: tiny,
  },
  smallVerticalMargin: {
    marginVertical: small,
  },
  verticalMargin: {
    marginVertical: normal,
  },
  mediumVerticalMargin: {
    marginVertical: medium,
  },

  tinyHorizontalMargin: {
    marginHorizontal: tiny,
  },
  smallHorizontalMargin: {
    marginHorizontal: small,
  },
  horizontalMargin: {
    marginHorizontal: normal,
  },
  mediumHorizontalMargin: {
    marginHorizontal: medium,
  },
  tinyHorizontalPadding: {
    paddingHorizontal: tiny,
  },
  smallHorizontalPadding: {
    paddingHorizontal: small,
  },
  horizontalPadding: {
    paddingHorizontal: normal,
  },
  mediumHorizontalPadding: {
    paddingHorizontal: medium,
  },
  tinyVerticalPadding: {
    paddingVertical: tiny,
  },
  smallVerticalPadding: {
    paddingVertical: small,
  },
  verticalPadding: {
    paddingVertical: normal,
  },
  mediumVerticalPadding: {
    paddingVertical: medium,
  },
};
