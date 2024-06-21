/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  LogBox,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Root } from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigators } from './source/Global/Route/route';
import Splash from './source/Screen/Splash';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import FlashMessage from "react-native-flash-message";
import Global from "./source/Global/globalinclude";
import createStore from './source/Reducer';
import { connect } from "react-redux";
import { useDispatch, useStore } from 'react-redux';
import { Provider } from 'react-redux';
import helper from "./source/Global/Helper/helper";
LogBox.ignoreAllLogs();
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { VATProvider } from './source/Context/vatContext';
import {check, request,PERMISSIONS, RESULTS} from 'react-native-permissions';
import { AddressProvider } from './source/Context/addressContext';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#728DBD',
    accent: '#FF818D',
  },
};
const App = ({ }) => {
  const dispatch = useDispatch();
  const store = createStore()
  const _checkFirebasePermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      _requestPermission();
    }
  };
  const _requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) { }
  };

  const requestLocationPermission = async () => {
    try {
      let permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }
      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        Geocoder.init('AIzaSyDfEIAHWXHv6HEXxmqlmapS76g89cStBkQ'); // Replace with your Google API key
        Geolocation.getCurrentPosition(
          position => {
            console.log("Current Position:", position)
          },
          error => {
            console.log(error);
          },
          { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 }
        );
      } else {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          // Permission granted, proceed to fetch location
          // Similarly to Android, perform Geolocation here
        } else {
          console.log('Location permission denied')
        }
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    StatusBar.setHidden(true);
    if (Platform.OS === 'ios') {
      _checkFirebasePermission();
      PushNotificationIOS.addEventListener(
        'notification',
        onRemoteNotification(),
        requestLocationPermission()
      );
    } else if (Platform.OS === 'android') {
      // this._getPhoneNumberPermission();
    }
    messaging().onMessage(async (remoteMessage) => {
      console.log("remoteMessage",remoteMessage)
     
     });
     const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        // console.log('onMessageReceived', notification);
        global.notification = remoteMessage;
        _handleNotification(remoteMessage, '2');
      }
    });

    // firebase messaging
    const onMessage = messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onBackgroundMessageHandler);
    messaging().onNotificationOpenedApp((notification) => {
      if (notification) {
        console.log('onNotificationOpenedApp', notification);
        global.notification = notification;
        _handleNotification(notification, '1');
      }
    });
    messaging()
      .getInitialNotification()
      .then((notification) => {
        if (notification) {
          console.log('app to open from quit state:', notification);
          global.notification = notification;
        }
      });
      return unsubscribe;
  }, []);
  const onRemoteNotification = (notification) => {
  
    console.log('notification1', notification);
  };
  const onMessageReceived = (notification) => {
    console.log('notification2', notification);
    if (notification) {
      // console.log('onMessageReceived', notification);
      global.notification = notification;
      _handleNotification(notification, '2');
    }
  };
  const onBackgroundMessageHandler = async (notification) => {
    if (notification) {
      console.log('notification', notification);
      global.notification = notification;
      _handleNotification(notification, '3');
    }
  };
  const onRegister = (token) => {
    console.log('token', token.token);
  };
  const onNotif = (notif) => {
    console.log('onNotif', notif);
    if (Platform.OS === 'ios') {
      if (notif) {
        this.notif.cancelAll();
        _handleNotification(notif, '4');
      }
    }
  };
  const _handleNotification = (notification, type) => {
    let data = notification.data;
    notificationCountApi()
    // dispatch({ type: "APPS.NOTIFICATIONINCREMENT" })
    _showPushNotification(notification);
  };
  const notificationCountApi = () => {
    helper
      .UrlReqAuth('api/user/count_notification')
      .then(res => {
        if (res.status) {
          global.notification_count = parseInt(res.count)
          dispatch({ type: "APPS.NOTIFICATIONINCREMENT" })
          global.chat_count = parseInt(res.data.unread_chat_message)
          dispatch({ type: "APPS.CHATINCREMENT" })
        } else {
          global.notification_count = 0
          global.chat_count = 0
          dispatch({ type: "APPS.NOTIFICATIONINCREMENT" })
          dispatch({ type: "APPS.CHATINCREMENT" })
        }
      })
  }
  const _showPushNotification = (notification) => {
    showPushNotification(notification);
  };
  const showPushNotification = (notification) => {
    const title = notification.data.title;
    const body = notification.data.body;
    const icon = notification.data.imagelink;
    console.log('title', title);
    console.log('title', body);
    if (Platform.OS === 'android') {
      PushNotification.channelExists('MyPoppins', (exist) => {
        if (!exist) {
          PushNotification.createChannel(
            {
              channelId: 'MyPoppins', // (required)
              channelName: 'MyPoppins', // (required)
              channelDescription: 'MyPoppins',
              soundName: 'default',
            },
            (created) => {
              if (created) {
                _presentNotification(notification);
              }
            },
          );
        } else {
          _presentNotification(notification);
        }
      });
      //actions: JSON.stringify(['View']),
    } else if (Platform.OS === 'ios') {
      let details = {
        alertBody: body,
        alertTitle: title,
        alertAction: 'view',
        userInfo: notification.data,
      };
      // PushNotificationIOS.
      PushNotificationIOS.addNotificationRequest(details);
      // PushNotificationIOS.addNotificationRequest(details);
      // PushNotificationIOS.scheduleLocalNotification(details);
    }
    return Promise.resolve();
  };
  const _presentNotification = (notification) => {
    console.log("notification :::: ",notification)
    const title = notification.data.title;
    const body = notification.data.body;
    const icon = notification.data.imagelink;
    let largeIcon = icon === '' ? null : icon;
    var notificationObj = {
      title: title,
      message: body,
      bigText: body,
      bigPictureUrl: icon,
      vibrate: true,
      vibration: 300,
      onlyAlertOnce: true,
      allowWhileIdle: true,
      invokeApp: true,
      importance: 'max',
      priority: 'max',
      ignoreInForeground: false,
      foreground: true,
      channelId: 'MyPoppins',
    };
    if (icon !== '') {
      notificationObj.largeIconUrl = icon;
    } else {
      notificationObj.largeIcon = 'ic_launcher';
    }
    console.log('notificationObj', notificationObj);
    PushNotification.presentLocalNotification(notificationObj);
  };
  global.DefaultRoute = "Splash"
  return (
    <PaperProvider theme={theme}>
      <StatusBar backgroundColor="black" barStyle="dark-content" />
      <Provider store={store}>
        <AddressProvider>
        <VATProvider>
        <NavigationContainer>
          {RootNavigators("Splash")}
          <FlashMessage position="top" animated={true} />
          <Global.Loader ref={ref => (global.global_loader_reff = ref)} />
          {/* <Root>
          {RootNavigators()}
          <FlashMessage
            position="top"
            animated={true}
            animationDuration={500}
            duration={2000}
          />
        </Root> */}
        </NavigationContainer>
        </VATProvider>
        </AddressProvider>
      </Provider>
    </PaperProvider>
  );
}
const mapStateToProps = (state) => ({
  notificationCount: {
    apps: state.apps.notificationCount,
  },
  chatCount: {
    apps: state.apps.chatCount,
  }
});
const mapDispatchToProps = (dispatch) => {
  dispatch({ type: "APPS.NOTIFICATIONINCREMENT" });
  dispatch({ type: "APPS.CHATINCREMENT" });
};
export default connect(mapStateToProps, mapDispatchToProps)(App);