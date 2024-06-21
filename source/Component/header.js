import React from 'react';

import {StyleSheet, TouchableOpacity, View, Text, Image, Platform} from 'react-native';

import {scale} from '../Theme/Scalling.js';
import Colors from '../Theme/Colors';
import Fonts from '../Theme/Fonts';
import Assets from '../Theme/Assets';

const Header = ({onPress}) => (
  <TouchableOpacity onPress={() => onPress()}>
    <View style={{marginTop: Platform.OS === "android" ? scale(10) : scale(40), marginLeft: scale(12)}}>
      <Image
        source={Assets.backarrowBlue}
        style={{
          height: scale(28),
          width: scale(28),
          resizeMode: 'contain',
        }}
      />
    </View>
  </TouchableOpacity>
);
const styles = StyleSheet.create({});
export default Header;
