import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

import { scale } from '../Theme/Scalling.js';
import Colors from '../Theme/Colors';
import Fonts from '../Theme/Fonts';
import Assets from '../Theme/Assets';

const GlobalText = props => (
  <View>
    <Text {...props} style={[styles.headerText, props.style]} numberOfLines={props.numberOfLines}>
      {props.text}
    </Text>
  </View>
);
const styles = StyleSheet.create({
  headerText: {
    color: Colors.themeBlue,
    fontSize: scale(24),
    fontFamily: Fonts.Regular,
    textTransform: 'uppercase',
  },
});
export default GlobalText;
