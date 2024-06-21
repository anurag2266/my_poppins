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
  Keyboard, TextInput
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';

import { Card, Spinner, Container, Content } from 'native-base';
import AwesomeAlert from 'react-native-awesome-alerts';
let id_nanny = '', id_booking = '';

const Homescreennotifications = ({ navigation, route }) => {
  const [visible, setVisible] = React.useState(false)
  const [showalert, setShowAlert] = useState(false);
  const [nannyInfo, setNannyInfo] = useState({});
  const [status, setStatus] = useState('')
  const [hours, setHours] = useState('')
  const [minute, setMinute] = useState('00')
  id_booking = route.params.id_booking;
  id_nanny = route.params.id_nanny
  useEffect(() => {
    getNannyData()
    id_booking = route.params.id_booking;
    id_nanny = route.params.id_nanny
    const unsubscribe = navigation.addListener('focus', () => {
      getNannyData();

    });
    return () => unsubscribe()
  }, []);

  const showAlert = () => {
    setShowAlert(true);

  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const getNannyData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/hours_confirmation?id_booking=' + id_booking + '&id_nanny=' + id_nanny)
      .then(res => {
        console.log("resresres",res)
        if (res.status) {
          if (res.data !== null) {
            setNannyInfo(res.data);

            global.global_loader_reff.show_loader(0);
          } else {
            Global.showError(res.message)
          }
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const onPressConfirm = () => {

    if (nannyInfo.id === undefined) {
      hideAlert()
      Global.showError('Job Not Completed')
    } else {

      hideAlert()
      let confirmObj = { id: nannyInfo.id, id_booking: id_booking, is_hours_confirm: status, client_hour: hours, client_minute: minute }

      global.global_loader_reff.show_loader(1);
      helper.UrlReqAuthPost('api/client/hours_confirmed', 'POST', confirmObj).then((res) => {

        if (res.status) {
          global.global_loader_reff.show_loader(0);
          Global.showToast(res.message)
          hideAlert()
          navigation.goBack()
        } else {
          hideAlert()
          global.global_loader_reff.show_loader(0);
          Global.showError(res.message)
        }
      }).finally((e) => {
        hideAlert()
        global.global_loader_reff.show_loader(0);
      })
    }
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
          global.notification_count = 0
          navigation.goBack()
        }} />
        <View style={styles.baseView}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Global.GlobalText
                  text={"Hours Confirmation"}
                  style={[styles.white, { textTransform: 'none' }]}
                />
                <TouchableOpacity

                  onPress={() => {
                    navigation.goBack()
                  }}>
                  <Global.GlobalText
                    text="X"
                    style={[styles.white, { textTransform: 'none' }]}
                  /></TouchableOpacity>
              </View>
              {/* <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  navigation.navigate('Notifications');
                }}>
                <Image source={Global.GlobalAssets.cl} />
              </TouchableOpacity> */}
            </View>
            <View style={styles.parentView}>
              <View style={styles.notiView}>
                <View style={styles.nannyText}>
                  {nannyInfo.nanny_name ? (

                    <Global.GlobalText
                      text={"Nanny" + ' ' + nannyInfo.nanny_name + ' ' + "has mark the job as completed, the total number of hours for today is of :" + ' ' + nannyInfo.total_hours}
                      style={styles.regularText}
                    />
                  ) : (
                    <Global.GlobalText
                      text={"Nanny " + "has mark the job as completed, the total number of hours for today is of :" + ' ' + nannyInfo.total_hours}
                      style={styles.regularText}
                    />
                  )}

                  <Global.GlobalText
                    text="Please confirm : "
                    style={styles.confirmText}
                  />
                  <View style={styles.container}>
                    <TouchableOpacity style={styles.radioBtnView} onPress={() => {
                      setStatus('1');
                      setHours('')
                      setMinute('00')

                    }}>
                      {status === '1' ? (
                        <Image source={Global.GlobalAssets.radioActive} style={{ height: scale(18), width: scale(18), resizeMode: 'contain', marginRight: scale(10) }} />
                      ) : (

                        <View style={styles.radioBtn}></View>
                      )}
                      <Global.GlobalText text="Yes " style={styles.radioText} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.radioBtnView} onPress={() => setStatus('2')}>
                      {status === '2' ? (
                        <Image source={Global.GlobalAssets.radioActive} style={{ height: scale(18), width: scale(18), resizeMode: 'contain', marginRight: scale(10) }} />
                      ) : (

                        <View style={styles.radioBtn}></View>
                      )}
                      <Global.GlobalText text="No " style={styles.radioText} />
                    </TouchableOpacity>
                  </View>
                  {status === '2' ? (
                    <View>
                      <Global.GlobalText
                        text="If no please provide number of hours"
                        style={styles.regularText}
                      />

                      <View style={styles.clock} >
                        <Global.GlobalText text="Hours " style={styles.blueText} />
                        <TextInput
                          placeholder="00"
                          style={styles.inputStyle}
                          onChangeText={(val) => {
                            setHours(val.replace(/[^0-9]/g, ''))
                          }}
                          value={hours}
                          placeholderTextColor={
                            '#00000080'
                          }
                          keyboardType={'number-pad'}
                        />
                        {/* {/ <Global.GlobalText text={hours ? hours : '00'} style={styles.radioText} / > /} */}
                        <Global.GlobalText text="  Min. " style={styles.blueText} />
                        <TextInput
                          placeholder="00"
                          style={styles.inputStyle}
                          onChangeText={(val) => {
                            setMinute(val.replace(/[^0-9]/g, ''))
                          }}
                          keyboardType={'number-pad'}
                          value={minute}
                          placeholderTextColor={
                            '#00000080'
                          }

                        />
                        {/* {/ <Global.GlobalText text={minutes ? minutes : '00'} style={styles.radioText} / > /} */}
                      </View>
                    </View>
                  ) : null}

                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: scale(15), alignSelf: "center", flexDirection: 'row', justifyContent: "space-around" }}>
          <Global.GlobalButton
            text={'Confirm'}
            onPress={() => {
              if (status === '') {
                Global.showError('Please Select Yes or No!')
              } else if (status === '2') {
                if (hours === '') {
                  Global.showError('Please Enter Hours')
                } else if (minute === '') {
                  Global.showError('Please Enter Minute')
                } else {
                  showAlert()
                }
              }
              else {

                showAlert()
              }
            }}
          />
        </View>
      </ScrollView>

      <AwesomeAlert
        show={showalert}
        showProgress={false}
        title="Hours Confirmation"
        message="Are you sure, You want to mark this job as completed?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, Sure"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideAlert();
        }}
        onConfirmPressed={() => {
          onPressConfirm();
        }}
        messageStyle={{
          fontFamily: Global.GlobalFont.Regular,
          color: '#000',
          fontSize: scale(19),
        }}
        confirmButtonTextStyle={{ fontFamily: Global.GlobalFont.Regular }}
        contentStyle={{ fontFamily: Global.GlobalFont.Regular }}
        cancelButtonTextStyle={{ fontFamily: Global.GlobalFont.Regular }}
        titleStyle={{
          fontFamily: Global.GlobalFont.Bold,
          color: Global.GlobalColor.darkBlue,
        }}
      />
      {/* <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={12} // default: current hours
        // minutes={14} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'} // optional, default is automically detected by your system
      /> */}

    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(13),
    color: Global.GlobalColor.themePink,
    borderBottomWidth: 2,
    borderColor: Global.GlobalColor.themeBlue,

    padding: 0,
    textAlign: 'center',
    width: scale(30),
    height: scale(22)

  },
  regularText: {
    fontSize: scale(18),
    textTransform: 'none',
  },
  closeBtn: { position: 'absolute', right: 15, top: scale(18) },
  text: {
    textTransform: 'none',
    fontSize: scale(16),
  },
  container: { flexDirection: 'row', marginVertical: scale(10) },
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
    alignItems: "center"
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
    height: scale(18),
    width: scale(18),
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
