import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Global from '../Global/globalinclude';
import { scale } from '../Theme/Scalling';
import { Root } from 'native-base';
import helper from '../Global/Helper/helper'
import { RootNavigators } from '../Global/Route/route';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native'
const Splash = ({ navigation }) => {
  // AsyncStorage.clear();
  global.chat_count = 0;
  const [isShow, setisShow] = useState(true);
  useEffect(() => {
    global.currency = '€'

    global.checkStatus = true
    AsyncStorage.getItem('token').then(value => {
      if (value !== null) {
        global.token = value
        console.log("token", global.token);
      } else {
        global.token = "";
      }
      

    });
    AsyncStorage.getItem('usertype').then(value => {
      global.usertype = value;
    });
    AsyncStorage.getItem('admin_approval').then(value => {
      global.admin_approval = value;
    });
    AsyncStorage.getItem('userid').then(value => {
      global.userid = value;
    });
    AsyncStorage.getItem('is_profile_complete').then(value => {
      global.is_profile_complete = value;

    });
    checkPermission()
    notificationredirect()
    // getCheckInData()
    setTimeout(() => {

      if (global.token === "") {
        global.DefaultRoute = "Login"
      } else {
        if (global.usertype === '1') {
          global.DefaultRoute = "ClientTabb"
        } else {
          if (global.is_profile_complete === '1') {
            global.DefaultRoute = "NannyTabb"
          } else {
            global.DefaultRoute = "CompleteProfile"
          }
        }
      }
      setisShow(false);
    }, 3000);
  }, []);

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {

        updateToken();
      } else {
      }
    } else {
      updateToken();
    }
  };
  const updateToken = async () => {
    await firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {

        global.notification_token = fcmToken;

      })
      .then(() => { });
  };

  const notificationredirect = () => {
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onRegister: function (token) {
      },
      onNotification: function (notification) {
        // global.order_id_Val = ""
        // dispatch({ type: "APPS.NOTIFICATIONORDERID" })
        if (notification.userInteraction) {
          // alert(notification.userInteraction)
          if (global.token !== "") {
            if (global.notification.data !== undefined)
              if (global.notification.data.notification_type === "nanny-checkout") {
                if (global.notification.data.is_hours_confirm_type === "1") {
                  if (global.notification.data.client_approval === "0") {

                    navigation.navigate('NotificationDetailClient', { id_booking: global.notification.data.id_booking, id_nanny: global.notification.data.id_nanny });
                  } else {
                    Global.showError('Hours Already Confirmed by you!')
                  }
                }
                //navigation.navigate('NotificationDetailClient', { id_booking: item.id, id_nanny: item.id_nanny })
                //   navigation.dispatch(
                //   CommonActions.reset({
                //     index: 0,
                //     routes: [{ name: "NotificationDetailClient"},{ id_booking: item.id, id_nanny: item.id_nanny } ],
                //   }));
              } else if (global.notification.data.notification_type === "new-job") {
                navigation.navigate('BookingList')
              }
              else if (global.notification.data.notification_type === "nanny-accepted") {
                navigation.navigate('Jobs')
              }
              else if (global.notification.data.notification_type === "please-fill-log") {
                navigation.navigate('LogDetailNanny', { bookId: global.notification.data.id_booking })
              }
              else if (global.notification.data.notification_type === "check-log") {
                navigation.navigate('LogClient')
              } else if (global.notification.data.type === "chat") {


                navigation.navigate("NotificationChatdetail", {
                  receiver_id: global.notification.data.id_receiver,
                  id_sender: global.notification.data.id_sender,
                  receiver_type: global.notification.data.receiver_type,
                  sender_type: global.notification.data.sender_type

                })


              }
              else {
                navigation.navigate("Dashboard")
              }
          } else {
            // navigation.navigate("Login")
          }
        }
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });
  }
  if (isShow) {
    return (
      <ImageBackground
        source={Global.GlobalAssets.splashBg}
        style={{
          height: Dimensions.get('screen').height + 40,
          width: '100%',
          alignItems: 'center',
        }}
        resizeMode={'cover'}>
        <Image
          source={Global.GlobalAssets.logo}
          style={styles.logo}
          resizeMode={'contain'}
        />
      </ImageBackground>
    );
  } else {
    return (
      <Root>
        {RootNavigators(global.DefaultRoute)}
        <Global.Loader ref={ref => (global.global_loader_reff = ref)} />
      </Root>
    );
  }
};
const styles = StyleSheet.create({
  logo: {
    height: scale(225),
    width: scale(225),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(-30),
  },
});
export default Splash;
