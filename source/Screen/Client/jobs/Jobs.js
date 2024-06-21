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

  BackHandler, Modal, Dimensions,
} from 'react-native';
import BackgroundTimer from "react-native-background-timer";
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import moment from 'moment';
import { Card } from 'native-base';
import GetLocation from 'react-native-get-location';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import database from '@react-native-firebase/database';
import MapView, { Marker } from 'react-native-maps';
import GlobalText from '../../../Component/globalText';

const reference = database().ref('/tracking/123');
const referenceChild = database().ref('/tracking');
const { width, height } = Dimensions.get('window');
let current_date = '', current_time = '', isShowLocations = false, jobdata,
  myCounter = 0,
  timeout = null;
let intervalTime = null;
const Jobs = ({ navigation }) => {
  const [jobData, setJobData] = useState([]);
  const [map_dialog, setMapDialog] = useState(false);
  const [locationObj, setLocationObj] = useState(null);
  const [isShow, setIsShow] = useState(false);

  const [counter, setCounter] = useState(0);
  const [isLoad, setIsLoad] = useState(false)
  myCounter = counter;
  useEffect(() => {
    if (global.counter) {
      myCounter = global.counter
    } else {
      global.counter = 0;
    }
    current_date = moment(new Date()).format('DD-MM-YYYY');
    current_time = moment().format('hh:mm A');
    // forgroundService()
   
    // getJobData();
    const unsubscribe = navigation.addListener('focus', () => {
      getJobData();
      current_date = moment(new Date()).format('DD-MM-YYYY');
      current_time = moment().format('hh:mm A');
    });
    //add background location fetch 
  
    
    //not working forground service
    // ReactNativeForegroundService.add_task(
    //   () => {
    //     GetLocation.getCurrentPosition({
    //       enableHighAccuracy: true,
    //       timeout: 10000,
    //     })
    //       .then(location => {
    //         setLocationObj(location);
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
    //     onSuccess: () => console.log("Sucseee"),
    //     onLoop: true,
    //     taskId: 'taskid',
    //     onError: e => console.log('Error logging:', e),
    //   },
    // );
    // // // ReactNativeForegroundService.start({ title: 'taskid', id: 'taskid' });
    // ReactNativeForegroundService.start({
    //   id: 'taskid',
    //   title: "Foreground Service",
    //   message: "you are online!",
    // });
    forgroundService()
    const onChildAdd = reference.on('child_added', snapshot => {
      //setLocationObj(snapshot.val());
    });
    const onChildChanged = referenceChild.on('child_changed', snapshot => {
   
      setLocationObj(snapshot.val());
      // locationObj = snapshot.val()
    });
    // Stop listening for updates when no longer required
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove(), unsubscribe(),
        clearInterval(timeout),
        BackgroundTimer.stop()
        reference.off('child_added', onChildAdd),
        referenceChild.off('child_changed', onChildChanged);
    };
  }, []);

  const forgroundService = () =>{
    BackgroundTimer.start()
    BackgroundTimer.runBackgroundTimer(() => { 
        GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 10000,
            })
              .then(location => {
            
                setLocationObj(location);
               
                reference.update(location).then(() => {
                }
                );
              })
              .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
              });
    
          }, 
      90000);
  }
  const getJobData = () => {
    setIsLoad(false)
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_job?id=')
      .then(res => {
   
        if (res.status) {
          if (res.data !== null) {
            setDataWithInterval(res.data);
            global.global_loader_reff.show_loader(0);
          }
        } else {
          global.global_loader_reff.show_loader(0);
          setIsLoad(true)
        }
      }).catch((c) => {
      })
      .finally(e => {
        console.log(e);
        global.global_loader_reff.show_loader(0);
      });
  };
  const setDataWithInterval = (data) => {
    if (intervalTime != null) {
      clearInterval(intervalTime);
    }
    intervalTime = setInterval(() => {
      getTimingFromJob(data)
    }, 2000);
  }
  const getTimingFromJob = (data) => {
    setIsLoad(true)
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
            // alert("here")
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
        } else {
        }
        final_job_data.push(jobdata)
      }
    }
    setJobData([...final_job_data]);
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
        style={{ marginBottom: scale(70) }}>
        <Global.GlobalHeader onPress={() => {
          if (intervalTime != null) {
            clearInterval(intervalTime);
          }
          navigation.goBack();
        }
        } />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="JOBS" style={{ color: 'white' }} />
            </View>
            {isLoad ? (
              <>
                {jobData.length > 0 ? (
                  <View style={styles.baseStyle}>
                    {jobData.map((item, index) => {
                      let t = (index += 1);
                    
                      return (
                        <View style={styles.detailView}>
                          {item.booking_type === '1' ? (
                            <Global.GlobalText
                              text={'Date : ' + item.booking_date}
                              style={[styles.fontStyle, { color: Global.GlobalColor.themePink, fontSize: scale(17) }]}
                            />
                          ) : (
                            <>
                              <Global.GlobalText
                                text={'From date : ' + item.booking_date.split('-')[0]}
                                style={[styles.fontStyle, { color: Global.GlobalColor.themePink, fontSize: scale(17) }]}
                              />
                              <Global.GlobalText
                                text={'To date : ' + item.booking_date.split('-')[1]}
                                style={[styles.fontStyle, { color: Global.GlobalColor.themePink, fontSize: scale(17) }]}
                              />
                            </>
                          )}
                          <Global.GlobalText
                            text={'Nanny : ' + item.nanny_name}
                            style={styles.fontStyle}
                          />
                          <Global.GlobalText
                            text={'Child : ' + item.child}
                            style={styles.fontStyle}
                          />
                          {/* {t === 1 ? (
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Global.GlobalText
                text="View Nanny's Location : "
                style={styles.fontStyle}
              />
              <TouchableOpacity onPress={() => {
                setMapDialog(true)
              }}>
                <Text style={styles.clickHere}>Click Here</Text>
              </TouchableOpacity>
            </View>
          ) : ( */}
                          {/* {current_date === } */}
                          {/* <Text>{moment.utc(item.from_time, "HH:mm A").format('LT')}</Text>
          <Text>{current_time}</Text> */}
                          {/* {item.booking_type === 1 ? ( */}
                          <View>
                            <>
                              {item.is_view_location === 1 ?
                                <View
                                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Global.GlobalText
                                    text="View Nanny's Location : "
                                    style={styles.fontStyle}
                                  />
                                  <TouchableOpacity onPress={() => {
                             

                                  setTimeout(() => {
                                    setMapDialog(true)
                                  }, 200);
                                                    
                                  }}>
                                    <Text style={styles.clickHere}>Click Here</Text>
                                  </TouchableOpacity>
                                </View>
                                : null}
                            </>
                            {item.grand_total !== null  ? (
                              <>
                                <View
                                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Global.GlobalText
                                    text={'Total Cost : ' + global.currency + ' ' + item.grand_total}
                                    style={styles.fontStyle}
                                  />
                                </View>
                                {item.is_review === 0 ? (
                                  <View
                                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(10) }}>
                                    <TouchableOpacity onPress={() => {
                                      if (intervalTime != null) {
                                        clearInterval(intervalTime);
                                      }
                                      navigation.navigate('ReviewClient', { job_id: item.id })
                                    }}>
                                      <Global.GlobalText
                                        text="Give Review "
                                        style={[styles.clickHere, { textDecorationLine: 'underline', textTransform: 'none', fontSize: scale(19), color: Global.GlobalColor.themePink, borderBottomColor: Global.GlobalColor.themePink }]}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <View
                                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(10) }}>
                                    <View >
                                      <Global.GlobalText
                                        text="Rated"
                                        style={[styles.clickHere, { textTransform: 'none', fontSize: scale(19), color: '#4c4c4c', textDecorationLine: 'underline' }]}
                                      />
                                    </View>
                                  </View>
                                )}
                              </>
                            ) : null}
                            {item.is_checkout_completed === true ? (
                              <>
                                {item.client_approval === 0 ? (
                                  <View
                                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(10) }}>
                                    <TouchableOpacity onPress={() => {
                                      if (intervalTime != null) {
                                        clearInterval(intervalTime);
                                      }
                                      navigation.navigate('NotificationDetailClient', { id_booking: item.id, id_nanny: item.id_nanny })
                                    }}>
                                      <Global.GlobalText
                                        text="Hours Confirmation  "
                                        style={[styles.clickHere, { textTransform: 'none', fontSize: scale(19) }]}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                ) : null}
                              </>
                            ) : null}
                            {item.is_checkout_completed === true ? (
                              <>
                                {item.admin_approval === 0 && item.client_approval === 1 ? (
                                  <View
                                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(10) }}>
                                    <View>
                                      <Global.GlobalText
                                        text="Hours Confirmation -- Pending "
                                        style={[styles.clickHere, { textTransform: 'none', fontSize: scale(19) }]}
                                      />
                                    </View>
                                  </View>
                                ) : null}
                              </>
                            ) : null}
                          </View>
                          {/* ) : null} */}
                          {/* )} */}
                          <TouchableOpacity
                            style={styles.eye}
                            onPress={() => {
                              if (intervalTime != null) {
                                clearInterval(intervalTime);
                              }
                              navigation.navigate('Jobdetail', { job_id: item.id });
                            }}>
                            <Image
                              source={Global.GlobalAssets.themeEye}
                              resizeMode={'contain'}
                              style={{ height: scale(22), width: scale(22) }}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: scale(30) }}>
                    <Text style={styles.nodataText}>No Data</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: scale(30) }}>
                <Text style={styles.nodataText}>Loading...</Text>
              </View>
            )}
          </Card>
        </View>
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
                    height: scale(50),
                    justifyContent: "flex-end",
                    alignSelf: "flex-end",
                    backgroundColor: "#ffffff00",
                    borderRadius: scale(30),
                  }}
                  underlayColor="#ffffff00"
                  onPress={() => setMapDialog(false)}
                >
                  <Global.AntDesign name="close" size={scale(25)} color="white" />
                </TouchableOpacity>
                {locationObj !== null ? (
                  <>
                   
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
                          title={'marker.title'}
                          description={'marker.description'}
                        />
                      </MapView>
                   
                  </>
                ):
                (
                <View style={{justifyContent:'center',flex:1,alignItems:'center'}}>
                <GlobalText text="Fetching Location..." style={{textTransform:'none'}}/>
                </View>
              )}
              </View>
            </Modal>
          </View>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  wishlistImg: { height: scale(65), width: scale(65) },
  starStyle: { marginHorizontal: scale(2) },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  eye: {
    backgroundColor: Global.GlobalColor.themePink,
    height: scale(25),
    width: scale(28),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: scale(5),
    position: 'absolute',
    right: scale(15),
    top: scale(45),
    resizeMode: 'contain',
  },
  clickHere: {
    fontSize: scale(16),
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    paddingBottom: scale(0),
    textDecorationLine: "underline"
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(30),
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
  baseStyle: {
    backgroundColor: Global.GlobalColor.lightPink,
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderBottomLeftRadius: scale(15),
    borderBottomRightRadius: scale(15),
  },
  detailView: {
    backgroundColor: 'white',
    borderRadius: scale(10),
    padding: scale(15),
    marginVertical: scale(10),
  },
  fontStyle: {
    fontSize: scale(18),
    textTransform: 'none',
  }, mapmodalView: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    padding: scale(5),
  }, nodataText: {
    padding: scale(20), fontFamily: Global.GlobalFont.Regular, fontSize: scale(20),
    color: Global.GlobalColor.themeBlue
  },
});
export default Jobs;
