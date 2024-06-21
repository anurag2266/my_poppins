import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';

let nannyName = '';
const Removewishlist = ({ navigation, route }) => {
  nannyName = route.params.nannyName;

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: scale(70) }}>
        <View style={styles.baseView}>
          <View style={{ marginHorizontal: scale(30) }}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Global.GlobalText
                  text="REGULAR NANNIES"
                  style={{ color: 'white' }}
                />
              </View>
              <View
                style={{
                  padding: scale(15),
                  paddingVertical: scale(40),
                }}>
                <Global.GlobalText
                  text={
                    'Nanny' +
                    ' ' +
                    nannyName +
                    ' ' +
                    'has been removed from your wishlist.'
                  }
                  style={{
                    fontSize: scale(18),
                    textTransform: 'capitalize',
                  }}
                />
              </View>
            </View>
            <View style={{ alignSelf: 'center', opacity: 0.9 }}>
              <Global.GlobalButton
                text="OK"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  card: {
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    marginTop: scale(120),
    marginBottom: scale(15),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(40),
  },
  innerCard: {
    backgroundColor: 'white',
    marginHorizontal: scale(10),
  },
  cardHeader: {
    height: scale(60),
    backgroundColor: Global.GlobalColor.darkBlue,
    padding: scale(10),
    borderTopStartRadius: scale(15),
    borderTopEndRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    paddingVertical: scale(5),
    fontSize: scale(18),
    textTransform: 'none',
    paddingStart: scale(20),
  },
});
export default Removewishlist;
