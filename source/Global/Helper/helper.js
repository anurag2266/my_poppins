import { API_KEY, APP_URL } from '../config';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
let APP_NAME = "MyPoppins"
const helpers = {
  ToastShow: function (name, style) {
    if (style === 'success') {
      global.toast_reff.show_toast(name, '1');
    } else {
      global.toast_reff.show_toast(name, '0');
    }
  },
  chatDateConvert: function (date) {
    let chat_date = moment(date).format('DD-MM-YYYY, h:mm a');
    return chat_date;
  },
  getToken: async function () {
    let fcmToken = await messaging().getToken();

    if (fcmToken) {
      AsyncStorage.setItem('Token', fcmToken);
      // user has a device token
    } else {
      // user doesn't have a device token yet
    }
    return fcmToken ? fcmToken : '';
  },
  // presentNotification: function (from, notification) {

  //   const title = notification.data.title;
  //   const body = notification.data.body;
  //   const icon = notification.data.imagelink;

  //   if (Platform.OS === 'android') {
  //     var notificationObj = {
  //       title: title,
  //       message: body,
  //       bigText: body,
  //       bigPictureUrl: icon,
  //       vibrate: true,
  //       vibration: 100,
  //       onlyAlertOnce: true,
  //       allowWhileIdle: true,
  //       invokeApp: true,
  //       importance: 'max',
  //       priority: 'max',
  //       ignoreInForeground: false,
  //       foreground: true,
  //       channelId: "MyPoppins",
  //       smallIcon: 'ic_launcher',
  //     };
  //     if (icon !== '') {
  //       notificationObj.largeIconUrl = icon;
  //     } else {
  //       notificationObj.largeIcon = 'ic_launcher';
  //     }
  //     PushNotification.channelExists("MyPoppins", (status) => {
  //
  //       if (status) {
  //         PushNotification.presentLocalNotification(notificationObj);
  //       } else {
  //       }
  //     });
  //   } else if (Platform.OS === 'ios') {
  //     let details = {
  //       alertBody: body,
  //       alertTitle: title,
  //       alertAction: 'view',
  //       userInfo: notification.data,
  //     };

  //     if (global.nextAppState === 'active' && !global.isNotificationTap) {
  //       PushNotificationIOS.addNotificationRequest(details);
  //     }
  //   }
  //   return Promise.resolve();
  // },
  UrlReqAuth: async function (url, method, bodydata, image) {

    console.log(`Requesting URL: ${APP_URL + url}`);
    console.log('Request Method:', method);
    console.log('Request Body:', bodydata);
    let responce = [];
    let headers = {
      apikey: API_KEY,
      'x-authorization': global.token,
    };
    const loginString = JSON.stringify(bodydata);

    var formdata = new FormData();
    formdata.append('data', loginString);
    try {
      const response = await fetch(APP_URL + url, {
        method: method,
        headers: headers,
      });
      let responseJson = await response.json();

      responce.push(responseJson);
      return responce[0];
    } catch (err) {
      responce.push(err);
      return responce[0];
    }
  },
  UrlReqAuthPost: async function (url, method, bodydata, image) {

    console.log(`Requesting URL: ${APP_URL + url}`);
    console.log('Request Method:', method);
    console.log('Request Body:', bodydata);
    let responce = [];
    let headers = {
      apikey: API_KEY,
      'x-authorization': global.token,
    };

    const loginString = JSON.stringify(bodydata);
    var formdata = new FormData();
    formdata.append('data', loginString);
    try {
      const response = await fetch(APP_URL + url, {
        method: method,
        body: formdata,
        headers: headers,
      });
      let responseJson = await response.json();

      responce.push(responseJson);
      return responce[0];
    } catch (err) {
      responce.push(err);
      return responce[0];
    }
  },
  UrlReq: async function (url, method, bodydata, image) {

    console.log(`Requesting URL: ${APP_URL + url}`);
    console.log('Request Method:', method);
    console.log('Request Body:', bodydata);
    let responce = [];
    let headers = new Headers();
    headers.set('apikey', API_KEY);

    const loginString = JSON.stringify(bodydata);
    var formdata = new FormData();
    formdata.append('data', loginString);
    try {
      const response = await fetch(APP_URL + url, {
        method: method,
        body: formdata,
        headers: headers,
      });
      let responseJson = await response.json();

      responce.push(responseJson);
      return responce[0];
    } catch (err) {
      console.log("err", err)
      responce.push(err);
      return responce[0];
    }
  },
  // requestUserPermission: async function () {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {

  //     // messaging()
  //     //   .getToken()
  //     //   .then((fcmToken) => {

  //     //     if (fcmToken) {
  //     //       AsyncStorage.setItem('Token', fcmToken);
  //     //       // user has a device token
  //     //     } else {
  //     //       // user doesn't have a device token yet
  //     //     }
  //     //   });
  //   }

  //   return enabled;
  // },
  UrlReqGet: async function (url, method, bodydata, image) {

    console.log(`Requesting URL: ${APP_URL + url}`);
    console.log('Request Method:', method);
    console.log('Request Body:', bodydata);
    let responce = [];
    let headers = {
      apikey: 'uk6f4987b25ec004773f331e2e3jkso85',
    };
    const loginString = JSON.stringify(bodydata);
    var formdata = new FormData();
    formdata.append('data', loginString);

    try {
      const response = await fetch(APP_URL + url, {
        method: method,
        headers: headers,
      });
      let responseJson = await response.json();
      responce.push(responseJson);
      return responce[0];
    } catch (err) {
      responce.push(err);
      return responce[0];
    }
  },
};
export default helpers;


// console.log(`Requesting URL: ${APP_URL + url}`);
// console.log('Request Method:', method);
// console.log('Request Body:', bodydata);