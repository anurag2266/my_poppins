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
  FlatList, Alert, BackHandler, DeviceEventEmitter, Dimensions, Modal
} from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import { connect } from "react-redux";
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
navigator.geolocation = require("@react-native-community/geolocation");
import GetLocation from 'react-native-get-location';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import database from '@react-native-firebase/database';
import MapView, { Marker } from 'react-native-maps';
import BackgroundTimer from 'react-native-background-timer';
const reference = database().ref('/tracking/123');
const referenceChild = database().ref('/tracking');
const { width, height } = Dimensions.get('window');
let notification_count = 0, unsubscribe = null, timeout = null, jobdata, current_date = '', current_time = '';

import { useDispatch, useStore } from 'react-redux';
import Colors from '../../../Theme/Colors';
const INFO = [
  {
    id: '1',
    image: Global.GlobalAssets.newBookingIcon,
    title: 'New booking',
    key: 'NewBooking',
  },
  {
    id: '2',
    image: Global.GlobalAssets.myProfileIcon,
    title: 'my profile',
    key: 'Profile',
  },
  {
    id: '3',
    image: Global.GlobalAssets.jobsIcon,
    title: 'Bookings',
    key: 'Jobs',
  },
  {
    id: '4',
    image: Global.GlobalAssets.logsIcon,
    title: 'logs',
    key: 'LogClient',
  },
  {
    id: '5',
    image: Global.GlobalAssets.chatHomeIcon,
    title: 'chat',
    key: 'Chat',
  },
  {
    id: '6',
    image: Global.GlobalAssets.invoiceIcon,
    title: 'invoice',
    key: 'Invoice',
  },
];
const Dashboard = ({ navigation }) => {
  notification_count = global.notification_count
  const [notification_count_val, setNotificationCount] = useState(global.notification_count)
  const [jobData, setJobData] = useState([]);
  const [map_dialog, setMapDialog] = useState(false);
  const [locationObj, setLocationObj] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [isShowLocation, setIsLocationOn] = useState(false)
  const [counter, setCounter] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    notificationcountApi()
    LocationDialog()
    current_date = moment(new Date()).format('DD-MM-YYYY');
    current_time = moment().format('hh:mm A');
  
    getJobData();

    unsubscribe = navigation.addListener("focus", () => {
      notificationcountApi()
      getJobData();
      current_date = moment(new Date()).format('DD-MM-YYYY');
      current_time = moment().format('hh:mm A');
      // alert(notification_count)
    })
    forgroundService()
    // ReactNativeForegroundService.add_task(
    //   () => {
    //     GetLocation.getCurrentPosition({
    //       enableHighAccuracy: true,
    //       timeout: 10000,
    //     })
    //       .then(location => {
    //         // console.log(location, "=========loca");
    //         setLocationObj(location);
    //         // locationObj = location
    //         // console.log(locationObj, "obj");
    //         reference.update(location).then(() => {
    //         }
    //         );
    //       })
    //       .catch(error => {
    //         const { code, message } = error;
    //         console.warn(code, message);
    //       });
    //   },
    //   {
    //     id: 'taskid',
    //     delay: 10000,
    //     onLoop: true,
    //     taskId: 'taskid',
    //     onError: e => console.log('Error logging:', e),
    //   },
    // );
    // // ReactNativeForegroundService.start({ title: 'taskid', id: 'taskid' });
    // ReactNativeForegroundService.start({
    //   id: 'taskid',
    //   title: "Foreground Service",
    //   message: "you are online!",
    // });
    const onChildAdd = reference.on('child_added', snapshot => {
      //setLocationObj(snapshot.val());
    });
    const onChildChanged = referenceChild.on('child_changed', snapshot => {
      setLocationObj(snapshot.val());
      // locationObj = snapshot.val()
    });
    // Stop listening for updates when no longer required

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backButtonHandler,
    );
    return () => {
      backHandler.remove(), unsubscribe(),
        clearInterval(timeout),
        reference.off('child_added', onChildAdd),
        referenceChild.off('child_changed', onChildChanged);
    };
    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backButtonHandler,
    // );
    // return () => backHandler.remove()
  }, []);
  const getJobData = () => {
    global.global_loader_reff.show_loader(0);
    helper
      .UrlReqAuth('api/client/get_job?id=')
      .then(res => {
        if (res.status) {
        
          if (res.data !== null) {
            getTimingFromJob(res.data)
            setInterval(() => {
              getTimingFromJob(res.data)
            }, 2000);
            global.global_loader_reff.show_loader(0);
          }
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const getTimingFromJob = (data) => {
    // console.log(data, "==here");
    let final_job_data = []
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      jobdata = { ...data[index], is_view_location: 0 }
      if (item.is_checkout_completed) {
        jobdata.is_view_location = 0
        final_job_data.push(jobdata)
      } else {
        if (moment(item.booking_date, 'dddd, DD MMM YYYY').format('DD-MM-YYYY') == current_date.toString()) {
          var beginningTime = moment(current_time, 'h:mma');
          var endTime = moment(item.to_time, 'h:mma');
          if (beginningTime.isBefore(endTime)) {
            let time1 = moment(item.from_time, "hh:mm");
            let time2 = moment("00:15", "hh:mm");
            let subtract = time1.subtract(time2);
            jobdata.is_view_location = 1
            let final_from_time = moment(subtract).utc().format('hh:mm A')
            var beginningTime_from = moment(current_time, 'h:mma');
            var endTime_from = moment(final_from_time, 'h:mma');
            if (beginningTime_from >= endTime_from) {
              jobdata.is_view_location = 1
            } else {
              jobdata.is_view_location = 0
            }
          } else {
            jobdata.is_view_location = 0
          }
          //   if ('04:59 PM' === current_time) {
          //     isShowLocations = true
          //     setIsLocationOn(true)
          //     var startTime = moment(item.from_time, 'hh:mm A');
          //     var endTime = moment(item.to_time, 'hh:mm A');
          //     let totalSeconds = parseInt(endTime.diff(startTime, 'seconds'));
          //     // parseInt(endTime.diff(startTime, 'seconds'));
          //     timeout = setInterval(() => {
          //       setCounter(global.counter = global.counter + 1);
          //       // global.counter = myCounter
          //       if (global.counter === totalSeconds) {
          //         clearInterval(timeout)
          //         isShowLocations = false
          //         setIsLocationOn(false)
          //       }
          //     }, 1000);
          //   }
        } else {
        }
        final_job_data.push(jobdata)
      }
    }
    // console.log(final_job_data, "==here data")
    setJobData([...final_job_data]);
   
  }
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
  const NannyInfo = item => {
    return (
      <Card style={styles.cardBase}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (item.item.key !== '') {
              navigation.navigate(item.item.key);
            }
          }}>
          <View style={{ alignContent: 'center', alignItems: 'center', }}>
            <Image
              style={{ height: scale(85), width: scale(75),aspectRatio: 3 / 4, }}
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

  const forgroundService = () =>{
    BackgroundTimer.start()
    BackgroundTimer.runBackgroundTimer(() => { 
        GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 10000,
            })
              .then(location => {
              
                global.location = location
                setLocationObj(location);
                setIsShow(true)
                reference.update(location).then(() => {
                  }
                );
              })
              .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
              });
    
          }, 
      10000);
  }
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
              navigation.navigate('NotificationClient');
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
        {jobData.map((item) => {
        
          return (
            <>

              {
                item.is_view_location === 1 ?
                  <View style={styles.btn}>

                    <Global.GlobalButton
                      text={"view nanny's location"}
                      onPress={() => {
                          setMapDialog(true)
                      }
                    }
                      style={{ paddingHorizontal: 0 }}
                    />
                  </View>
                  : null}
            </>
          )
        })}
          <View style={styles.logoContainer}>
          <Image
            source={Global.GlobalAssets.logo}// Replace this with your logo image source
            style={styles.logoImage}
            resizeMode={'contain'}
          />
        </View>
      </ScrollView>
      {map_dialog ? (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              
              setMapDialog(false);
            }}
            hardwareAccelerated={true}
            visible={map_dialog}
          >
            <View style={styles.mapmodalView}>
              <TouchableOpacity
                style={{
                  width: scale(30),
                  height: scale(22),
                  marginVertical:25,
                  justifyContent: "flex-end",
                  marginRight:10,
                  alignSelf: "flex-end",
                  backgroundColor: "black",
                  borderRadius: scale(15),
                }}
                underlayColor="#ffffff00"
                onPress={() => {setMapDialog(false),console.log("pressed")}}
              >
                <Global.AntDesign name="close" size={scale(20)} color="white" style={{alignSelf:"center",}} />
              </TouchableOpacity>
              {locationObj !== null ? (
                <>
                  {isShow ? (
                    <MapView
                      style={{
                        width,
                        height,
                      }}
                      initialRegion={{
                        latitude: locationObj.latitude,
                        longitude: locationObj.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}>
                      <Marker
                        key={0}
                        coordinate={{
                          latitude: locationObj.latitude,
                          longitude: locationObj.longitude,
                        }}
                        title={'Nanny Location'}
                       
                      />
                    </MapView>
                  ) : null}
                </>
              ):
              (
              <View style={{justifyContent:'center',flex:1,alignItems:'center'}}>
              <Global.GlobalText text="Fetching Location..." style={{textTransform:'none',color:Colors.themeBlue}}/>
              </View>
              )
              }
            </View>
          </Modal>
        </View>
      ) : null}
    </ImageBackground >
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
    borderWidth: 0,
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
  btn: {
    marginTop: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  }, mapmodalView: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    padding: scale(5),
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
