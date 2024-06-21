import React from 'react';
import PropTypes from 'prop-types';

import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';

import {scale} from '../Theme/Scalling.js';
import Colors from '../Theme/Colors';
import Fonts from '../Theme/Fonts';
import Assets from '../Theme/Assets';

const StandardButton = props => (
  <TouchableOpacity
    onPress={() => props.onPress()}
    disabled={props.disabled}
    style={[
      styles.button,
      props.style,
      props.inactive && {backgroundColor: '#133e59'},
    ]}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <Text {...props} style={[styles.text, props.textStyle]}>
        {props.text}
      </Text>
    </View>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  button: {
    height: scale(62),

    marginVertical: scale(8),
    marginHorizontal: scale(5),
    padding: scale(5),
    paddingHorizontal: scale(0),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(50),

    backgroundColor: Colors.themePink,
    width: scale(200),
  },
  text: {
    color: 'white',
    fontFamily: Fonts.Regular,
    textAlign: 'center',
    fontSize: scale(20),
    textTransform: 'uppercase',
  },
});
export default StandardButton;
