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
  FlatList,
  BackHandler, DeviceEventEmitter, Alert
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { useDispatch, useStore } from 'react-redux';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
import { CommonActions, useIsFocused, dataChangelistener } from '@react-navigation/native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
navigator.geolocation = require("@react-native-community/geolocation");
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
let bookingId = '';
let notification_count = 0,
  unsubscribe = null;
const INFO = [
  {
    id: '1',
    image: Global.GlobalAssets.newBookingIcon,
    title: 'jobs',
    key: 'BookingList',
  },
  {
    id: '2',
    image: Global.GlobalAssets.myProfileIcon,
    title: 'my profile',
    key: 'Profile',
  },
  {
    id: '3',
    image: Global.GlobalAssets.paymentIcon,
    title: 'payments',
    key: 'payments',
  },
  {
    id: '4',
    image: Global.GlobalAssets.reviewIcon,
    title: 'reviews',
    key: 'Reviews',
  },
  {
    id: '5',
    image: Global.GlobalAssets.chatHomeIcon,
    title: 'chat',
    key: 'Chat',
  },
  // {
  //   id: '5',
  //   image: Global.GlobalAssets.logsIcon,
  //   title: 'logs',
  //   key: 'LogClient',
  // },
  {
    id: '6',
    image: Global.GlobalAssets.availablityIcon,
    title: 'availablity',
    key: 'Avability',
  },
];
const Dashboard = ({ navigation }) => {
  notification_count = global.notification_count
  const [notification_count_val, setNotificationCount] = useState(global.notification_count)
  const [status, setstatus] = useState(global.checkStatus)
  const dispatch = useDispatch();
  useEffect(() => {
    setstatus(global.checkStatus)
    notificationcountApi();
    // alert(global.checkStatus);
    unsubscribe = navigation.addListener('focus', () => {
      setstatus(global.checkStatus)
      notificationcountApi();
      //LocationDialog();
    });
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backButtonHandler,
    );
    return () => backHandler.remove()
  }, []);
  const notificationcountApi = () => {
    helper
      .UrlReqAuth('api/user/count_notification')
      .then(res => {
        if (res.status) {
          global.notification_count = res.count
          setNotificationCount(res.count)
          notification_count = global.notification_count
          global.chat_count = parseInt(res.data.unread_chat_message)
          dispatch({ type: "APPS.CHATINCREMENT" })
          dispatch({ type: "APPS.NOTIFICATIONINCREMENT" })
        }
        else {
          global.notification_count = 0
          notification_count = 0
          global.chat_count = 0;
          dispatch({ type: "APPS.CHATINCREMENT" })
          dispatch({ type: "APPS.NOTIFICATIONINCREMENT" })
        }
        setNotificationCount(notification_count)
      })
  }
  const backButtonHandler = () => {
    Alert.alert(
      '',
      'Are You Sure Exist App?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Ok', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false },
    );
    return true;
  };
  // const getCheckStatus = (bookid) => {
  //   let idObj = {
  //     id: bookid
  //   }
  //   global.global_loader_reff.show_loader(1);
  //   helper
  //     .UrlReqAuthPost('api/nanny/check_in_status', 'POST', idObj)
  //     .then(res => {
  //       global.checkStatus = res.status
  //       global.global_loader_reff.show_loader(0);
  //     })
  //     .finally(e => {
  //       global.global_loader_reff.show_loader(0);
  //     });
  // };
  const LocationDialog = () => {
    if (Platform.OS == "android") {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "Turn On Gps Location?",
        ok: "YES",
        cancel: "",
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
        preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
        providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
      })
        .then(function (success) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              let latitude = position.coords.latitude;
              let longitude = position.coords.longitude;
          
            },
            (error) => {
            
            },
            { timeout: 2000 }
          );
        })
        .catch((error) => { console.log(error), LocationDialog() });
      BackHandler.addEventListener("hardwareBackPress", () => {
        //(optional) you can use it if you need it
        //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
        LocationServicesDialogBox.forceCloseDialog();
      });
      DeviceEventEmitter.addListener(
        "locationProviderStatusChange",
        function (status) {
          // only trigger when "providerListener" is enabled
          //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
        }
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
     
        },
        (error) => console.log("", error),
        { timeout: 2000 }
      );
    }
  };
  const NannyInfo = item => {
    return (
      <Card style={styles.cardBase}>
        <TouchableOpacity
          onPress={() => {
            if (item.item.key !== '') {
              if (item.item.key === 'payments') {
                global.isEditable = true;
                navigation.navigate("Profile")
              } else {

                navigation.navigate(item.item.key);
              }
            }
          }}>
          <View style={{ alignContent: 'center', alignItems: 'center' }}>
            <Image
              style={{ height: scale(85), width: scale(75) }}
              source={item.item.image}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.titleBase}>
            <Text style={styles.fontStyle}>{item.item.title}</Text>
          </View>
        </TouchableOpacity>
      </Card>
    );
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
        <View style={{ marginTop: scale(30) }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginHorizontal: scale(15) }}
            onPress={() => {
              navigation.navigate('NotificationNanny');
            }}>
            <Image
              style={{ height: scale(40), width: scale(40) }}
              source={Global.GlobalAssets.notificationIcon}
              resizeMode={'contain'}
            />
            <View
              style={{
                position: 'absolute',
                top: -1,
                right: 0,
                height: scale(50),
              }}>
              <Badge
                textStyle={{ color: 'white' }}
                value={notification_count}
                badgeStyle={{ backgroundColor: Global.GlobalColor.themePink, width: scale(20), height: scale(20), borderRadius: scale(20) }}
                style={{ width: 25, height: 25 }}
              />
            </View>
          </TouchableOpacity>
          <FlatList
            data={INFO}
            renderItem={NannyInfo}
            keyExtractor={item => item.key}
            horizontal={false}
            numColumns={2}
          />
        </View>
        <View
          style={{
            marginTop: scale(15),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {status ? (
            <Global.GlobalButton
              text={'To Start the Job - Check in'}
              onPress={() => {
                navigation.navigate('Checkin');
              }}
              style={{ paddingHorizontal: 0, width: scale(220) }}
            />
          ) : (
            <Global.GlobalButton
              text={'On going Job - Check Out'}
              onPress={() => {
                navigation.navigate('CheckOut');
              }}
              style={{ paddingHorizontal: 0, width: scale(220) }}
            />
          )
          }
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={Global.GlobalAssets.logo}// Replace this with your logo image source
            style={styles.logoImage}
            resizeMode={'contain'}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '100%', width: '100%', alignItems: 'center' },
  fontStyle: {
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(20),
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#fff',
  },
  cardBase: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(10),
    backgroundColor: 'white',
    width: scale(145),
    marginTop: scale(20),
    alignItems: 'center',
    padding: scale(20),
    height: scale(150),
    elevation: 8,
    shadowColor: '#000',
    shadowRadius: 0,
    shadowOpacity: 1,
  },
  titleBase: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    backgroundColor: Global.GlobalColor.darkBlue,
    width: scale(145),
    alignSelf: 'center',
    paddingVertical: scale(10),
    marginTop: scale(5),
  },
  logoContainer: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: -1,
  },
  logoImage: {
    width: 300, // Adjust width as needed
    height: 300,
    opacity:0.5 // Adjust height as needed
    // Add other styles for your logo image here
  },
});
const mapStateToProps = (state) => ({
  notificationCount: {
    apps: state.apps.notificationCount,
  },
  chatCount: {
    apps: state.apps.chatCount,
  },
});
export default connect(mapStateToProps)(Dashboard);
