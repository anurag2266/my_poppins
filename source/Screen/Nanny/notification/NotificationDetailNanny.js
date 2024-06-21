import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,

} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';

const items = [1, 2, 3, 4, 5];
const Homescreennotifications = ({ navigation }) => {
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
        <Global.GlobalHeader onPress={() => navigation.goBack()} />
        <View style={styles.baseView}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Global.GlobalText
                  text="Nanny John has..."
                  style={[styles.white, { textTransform: 'none' }]}
                />
                <Global.GlobalText
                  text="X"
                  style={[styles.white, { textTransform: 'none' }]}
                />
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  navigation.navigate('Notifications');
                }}>
                <Image source={Global.GlobalAssets.closed} />
              </TouchableOpacity>
            </View>
            <View style={styles.parentView}>
              <View style={styles.notiView}>
                <View style={styles.nannyText}>
                  <Global.GlobalText
                    text="Nanny John has mark the job as completed, the total number of hours for today's 6 hours."
                    style={styles.regularText}
                  />

                  <Global.GlobalText
                    text="Please confirm : "
                    style={styles.confirmText}
                  />
                  <View style={styles.container}>
                    <TouchableOpacity style={styles.radioBtnView}>
                      <View style={styles.radioBtn}></View>
                      <Global.GlobalText text="Yes " style={styles.radioText} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.radioBtnView}>
                      <View style={styles.radioBtn}></View>
                      <Global.GlobalText text="No " style={styles.radioText} />
                    </TouchableOpacity>
                  </View>

                  <Global.GlobalText
                    text="If no please provide number of hours"
                    style={styles.regularText}
                  />

                  <View style={styles.clock}>
                    <Global.GlobalText text="Hours" style={styles.blueText} />
                    <Global.GlobalText text="  00 " style={styles.radioText} />
                    <Global.GlobalText text="  Min." style={styles.blueText} />
                    <Global.GlobalText text="  00 " style={styles.radioText} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  regularText: {
    fontSize: scale(16),
    textTransform: 'none',
  },
  closeBtn: { position: 'absolute', right: 15, top: scale(18) },
  text: {
    textTransform: 'none',
    fontSize: scale(16),
  },
  container: { flexDirection: 'row', marginBottom: scale(10) },
  radioText: {
    fontSize: scale(16),
    textTransform: 'none',
  },
  blueText: {
    fontSize: scale(16),
    textTransform: 'none',
    color: Global.GlobalColor.themeBlue,
  },
  radioBtnView: { flex: 6, flexDirection: 'row', alignItems: 'center' },
  confirmText: {
    fontSize: scale(16),
    color: Global.GlobalColor.themePink,
    marginTop: scale(10),
    textTransform: 'none',
  },
  clock: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Global.GlobalColor.themeBlue,
    borderRadius: scale(5),
    padding: scale(10),
    marginVertical: scale(10),
  },
  nannyText: {
    backgroundColor: 'white',
    padding: scale(20),
    width: '100%',
    borderRadius: scale(5),
  },
  white: { color: 'white' },
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  contentView: { flex: 8, paddingLeft: scale(15) },
  notiView: {
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    paddingTop: scale(15),
  },
  parentView: {
    backgroundColor: Global.GlobalColor.themeLightBlue,
    borderBottomStartRadius: scale(10),
    borderBottomEndRadius: scale(10),
    width: '100%',
    paddingBottom: scale(10),
  },
  radioText: {
    fontSize: scale(16),
    color: Global.GlobalColor.themePink,
    textTransform: 'none',
  },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  lineWhite: {
    backgroundColor: 'white',
    height: scale(3),
  },
  dateText: {
    textTransform: 'none',
    fontSize: scale(13),
    marginTop: scale(10),
    opacity: 0.5,
  },
  imagePlaceHolderView: {
    backgroundColor: Global.GlobalColor.themeBlue,
    opacity: 0.5,
    height: scale(50),
    width: scale(50),
    borderRadius: scale(50),
    opacity: 0.3,
  },
  radioBtn: {
    borderWidth: 2,
    height: scale(15),
    width: scale(15),
    borderRadius: scale(15),
    borderColor: Global.GlobalColor.themePink,
    marginRight: scale(10),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(40),
  },
  innerCard: {
    backgroundColor: 'white',
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  cardHeader: {
    height: scale(60),
    backgroundColor: Global.GlobalColor.darkBlue,
    padding: scale(10),
    borderTopStartRadius: scale(15),
    borderTopEndRadius: scale(15),
    paddingTop: scale(15),
  },
  message: {
    paddingVertical: scale(5),
    fontSize: scale(18),
    textTransform: 'none',
    paddingStart: scale(20),
  },
});
export default Homescreennotifications;
