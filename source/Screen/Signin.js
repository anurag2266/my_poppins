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
  Dimensions,
  Platform,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Global from '../Global/globalinclude';
import { scale } from '../Theme/Scalling';
import helper from '../Global/Helper/helper';
import {
  NavigationContainer,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
let errText = '';
const Signin = props => {
  const navigation = props.navigation;
  useEffect(() => {
    //AsyncStorage.clear();
    setEmail('');
    setPassword('');
  }, []);
  const [emailId, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errModal, setErrModal] = useState(false);
  const checkPushToken = async () => {
    let token = await helper.getToken();
    
    global.notification_token = token

    SendNotification()
    
  };
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };
  const ValidationSignIn = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailId === '') {
      Global.showError('Please enter email address');
    } else if (reg.test(emailId) === false) {
      Global.showError('Please enter valid email address');
    } else if (password === '') {
      Global.showError('Please enter Your password');
    } else {
      DoSignIn();
    }
  };

  const DoSignIn = () => {
    global.global_loader_reff.show_loader(1);
    console.log("email", emailId, "password", password);
    helper
      .UrlReqGet(
        'api/user/signin?email=' +
        emailId.toLowerCase() +
        '&password=' +
        password,
      )
      .then(res => {
        console.log("HERE", res);
        if (res.status) {
          global.token = res.data.token;
          setEmail('');
          setPassword('');
          storeData('userid', res.data.id.toString())
          global.userid = res.data.id.toString()
          storeData('token', res.data.token);
          storeData('usertype', res.data.user_type.toString());
          storeData('admin_approval', res.data.admin_approval);
          storeData('is_profile_complete', res.data.is_profile_complete);
          AsyncStorage.getItem('usertype').then(value => {
            global.usertype = value;
          });
          AsyncStorage.getItem('admin_approval').then(value => {
            global.admin_approval = value;
          });
          AsyncStorage.getItem('is_profile_complete').then(value => {
            global.is_profile_complete = value;
          });
          Global.showToast(res.message);
          checkPushToken();
          global.global_loader_reff.show_loader(0);
       
          if (res.data.check_in_status === true) {
            global.checkStatus = true;
          } else {
            global.checkStatus = false
          }
          // if (
          //   res.data.admin_approval === '0' &&
          //   res.data.user_type.toString() === '2'
          // ) {
          //   navigation.navigate('CompleteProfile');
          // } else {
          if (res.data.user_type.toString() === '1') {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: 'ClientTab' }],
              }),
            );

          } else {
           if (res.data.is_profile_complete === '0') {
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: 'CompleteProfile' }],
                }),
              );
            } else {
              // getCheckInData()
              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 1,
              //     routes: [{ name: 'CompleteProfile' }],
              //   }),
              // );
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: 'NannyTab' }],
                })
              );

            }
          }
          // }
          global.global_loader_reff.show_loader(0);
        } 
        else {
          setPassword('');
          global.global_loader_reff.show_loader(0);
          if (
            res.message ===
            'Your profile is under review. You can login once admin approves your profile' 
          ) {
            errText = res.message;
            setErrModal(true);
          } else {
            Global.showError(res.message);
          }
        }
      })
      .catch(err => {
        console.log(err)
        global.global_loader_reff.show_loader(0);
        Global.showError(err);
      });
  };
  const SendNotification = () => {
    let deviceId = DeviceInfo.getDeviceId();
    let notificationObj = {
      token: global.notification_token,
      device_id: deviceId,
      device_type: Platform.OS
    };
    console.log("HERE",notificationObj)
    helper
      .UrlReqAuthPost('api/user/notification_token', 'POST', notificationObj)
      .then(res => {
      })
  }
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
        style={{ marginBottom: scale(40) }}>
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="Login" />
            </View>
            <View
              style={{
                height: scale(150),
              }}>
              <Global.GlobalTextBox
                placeholder="ENTER EMAIL ID"
                onChangeText={value => setEmail(value)}
                value={emailId}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <Global.GlobalTextBox
                placeholder="PASSWORD"
                secureTextEntry={true}
                onChangeText={value => setPassword(value)}
                value={password}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Global.GlobalText
                  text="FORGOT PASSWORD?"
                  style={styles.forgotText}
                />
              </TouchableOpacity>
            </View>
          </Card>
          <View style={{ marginTop: scale(15) }}>
            <Global.GlobalButton
              text={'Login'}
              onPress={() => ValidationSignIn()}
            />
            <Global.GlobalButton
              text={'Register'}
              style={{ backgroundColor: Global.GlobalColor.themeBlue }}
              onPress={() => navigation.navigate('Signup')}
            />
          </View>
        </View>
      </ScrollView>
      <Global.AlertModal
        modalVisible={errModal}
        subHeader={errText}
        okButton={'OK'}
        closeAction={() => {
          setErrModal(false);
        }}
        okAction={() => {
          setErrModal(false);
        }}
      />
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: {
    height: '109%',
    width: '100%',
    alignItems: 'center',
  },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    height: scale(245),
    width: scale(285),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(70),
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
  forgotText: {
    textDecorationLine: 'underline',
    fontSize: scale(15),
  },
});
export default Signin;
