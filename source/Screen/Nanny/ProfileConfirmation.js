/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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
  SafeAreaView,
  Keyboard,
  BackHandler,
  Platform,
} from 'react-native';
import Global from '../../Global/globalinclude';
import { scale } from '../../Theme/Scalling';
import helper from '../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';

import { Card } from 'native-base';
import { CommonActions } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import { APP_URL } from '../../Global/config';

let previousScreenData = null;
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};
const ProfileConfirmation = ({ route, navigation }) => {
  useEffect(() => {
    //AsyncStorage.clear();

    if (route.prams !== null && route.params && route.params !== undefined) {
      let data = route.params.data;

      if (data !== undefined && data !== null) {
        previousScreenData = data;
      }
    }

    const backAction = () => {
      onPressOk();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const onPressOk = () => {
     const body = [];

    /**
     * contract: conractfileresponse,
      agreement: uploadagreementresponse,
     */

    let completeObj = {
      device_type: Platform.OS,
      emergency_contact: previousScreenData.emergency_contact,
      other_information: previousScreenData.other_information,
      experiance: previousScreenData.experiance,
      country_code:previousScreenData.country_code
    };
    const profilestring = JSON.stringify(completeObj);

    body.push({ name: 'data', data: profilestring });

    let contractDetail = previousScreenData.contract;
    if (
      contractDetail &&
      contractDetail !== undefined &&
      contractDetail !== null
    ) {
      var path = contractDetail.uri;
      let contractName = '';
      if (
        contractDetail.name === undefined ||
        contractDetail.name == null ||
        contractDetail.name === ''
      ) {
        var getFilename = path.split('/');
        contractName = getFilename[getFilename.length - 1];
        var extension = contractName.split('.')[1];
        contractName = new Date().getTime() + '.' + extension;
      } else {
        contractName = contractDetail.name;
      }
      let contractPath =
        Platform.OS === 'ios' ? path.replace('file://', '') : path;
      let contractType = contractDetail.type;
      var contractData = {
        name: 'contract_document',
        filename: contractName,
        type: contractType,
        data: RNFetchBlob.wrap(decodeURIComponent(contractPath)),
      };
      body.push(contractData);
    }

    let agreement = previousScreenData.agreement;

    if (agreement && agreement !== undefined && agreement !== null) {
      var agreepath = agreement.uri;
      let agreementName = '';
      if (
        agreement.name === undefined ||
        agreement.name === null ||
        agreement.name === ''
      ) {
        var getFilenames = agreepath.split('/');
        agreementName = getFilenames[getFilenames.length - 1];
        var extension = agreementName.split('.')[1];
        agreementName = new Date().getTime() + '.' + extension;
      } else {
        agreementName = agreement.name;
      }
      let agreementPath =
        Platform.OS === 'ios' ? agreepath.replace('file://', '') : agreepath;
      let agreementType = agreement.type;
      var agreementData = {
        name: 'non_disclosure_agreement',
        filename: agreementName,
        type: agreementType,
        data: RNFetchBlob.wrap(decodeURIComponent(agreementPath)),
      };
      body.push(agreementData);
    }
    global.global_loader_reff.show_loader(1);
    let complete_profile_url =
      APP_URL + 'api/nanny/complete_profile';

    RNFetchBlob.fetch(
      'POST',
      complete_profile_url,
      {
        apikey: 'uk6f4987b25ec004773f331e2e3jkso85',
        'x-authorization': global.token,
      },
      body,
    )
      .then(res => {
        let bodyData = JSON.parse(res.data);

        let response = bodyData;
         if (response.status) {
          Global.showToast(response.message);
          global.global_loader_reff.show_loader(0);
          storeData('is_profile_complete', '1');
          global.is_profile_complete = '1';
          // AsyncStorage.clear();
          // global.token = '';
          // global.usertype = '';
          // global.admin_approval = '';
          // navigation.dispatch(
          //   CommonActions.navigate({
          //     name: 'Signin',
          //   }),
          // );
       
          navigation.navigate('NannyTab');
        } else {
          global.global_loader_reff.show_loader(0);
          Global.showError(response.message);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
        Global.showError(err);
      });
  };
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
              <Global.GlobalText text="Confirmation" />
            </View>
            <View
              style={{
                paddingHorizontal: scale(10),
                paddingVertical: scale(25),
                alignItems: 'center',
              }}>
              <Global.GlobalText
                text="Your Profile has been completed."
                style={styles.message}
              />
            </View>
          </Card>
          <View style={{ marginTop: scale(15) }}>
            <Global.GlobalButton
              text={'OK'}
              onPress={() => {
                onPressOk();
              }}
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
    marginTop: scale(80),
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
export default ProfileConfirmation;
