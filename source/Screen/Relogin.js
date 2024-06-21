/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import Global from '../Global/globalinclude';
import { scale } from '../Theme/Scalling';

import { Card } from 'native-base';
const Relogin = props => {
  const navigation = props.navigation;

  React.useEffect(() => {
    //AsyncStorage.clear();
  }, []);

  return (
    <ImageBackground
      source={Global.GlobalAssets.bgImg}
      style={styles.bgImg}
      resizeMode={'cover'}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Global.GlobalColor.themePink}
        hidden={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="Forgot Password" />
            </View>
            <View
              style={{ paddingStart: scale(15), paddingHorizontal: scale(10) }}>
              <Global.GlobalText
                text="Password Reset link has been sent succefully on your registered Email ID.Please Login again using your new password."
                style={styles.message}
              />
            </View>
          </Card>
          <View style={{ marginTop: scale(15) }}>
            <Global.GlobalButton
              text={'Login'}
              onPress={() => navigation.navigate('Signin')}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),

    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    height: scale(180),
    width: scale(285),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(170),
  },
  cardHeader: {
    height: scale(60),
    backgroundColor: Global.GlobalColor.lightBlue,
    padding: scale(10),
    borderTopStartRadius: scale(15),
    borderTopEndRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    paddingTop: scale(15),
    fontSize: scale(18),
    textTransform: 'none',
  },
});
export default Relogin;
