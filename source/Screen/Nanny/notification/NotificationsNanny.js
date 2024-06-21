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
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
let notificationId = '';
const Notifications = ({ navigation, route }) => {
  const [notificationdata, setNotificationData] = useState([])

  useEffect(() => {
    getNotification()
    const unsubscribe = navigation.addListener('focus', () => {
      getNotification()
    });
    return () => unsubscribe()
  }, []);
  const getNotification = () => {
    global.global_loader_reff.show_loader(1);
    setNotificationData([])
    helper
      .UrlReqAuth('api/user/get_notifications')
      .then(res => {

        if (res.status) {
          global.global_loader_reff.show_loader(0);
          if (res.data.length > 0 || res.data !== null) {
            global.global_loader_reff.show_loader(0);
            setNotificationData(res.data)
            notificationId = ""
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              if (notificationId === "") {
                notificationId = res.data[0].notification_id
              } else {
                notificationId = notificationId + "," + element.notification_id

              }
            }
            setTimeout(() => {

              unReadCount()
            }, 50);
          }
        } else {
          global.global_loader_reff.show_loader(0);
        }
        global.global_loader_reff.show_loader(0);
    
      }).finally((f) => {
        global.global_loader_reff.show_loader(0);
      })
  }
  const unReadCount = () => {

    let notiObj = {
      notification_ids: notificationId
    }

    helper
      .UrlReqAuthPost('api/user/notification_read', 'POST', notiObj)
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
        style={{ marginBottom: scale(70) }}>
        <Global.GlobalHeader onPress={() => {
          global.notification_count = 0
          navigation.goBack()
        }} />
        <View style={styles.baseView}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="NOTIFICATIONS" style={styles.white} />
            </View>
            <View style={styles.parentView}>

              {notificationdata.length > 0 ?
                <View>
                  {notificationdata.map(item => {
                    return (
                      <>
                        <TouchableOpacity
                          style={styles.notiView}
                          onPress={() => {
                            if (item.notification_type === 'please-fill-log') {
                             
                              if (item.is_log_fill === 0) {

                                navigation.navigate('LogDetailNanny', { bookId: item.id_booking })
                              } else {
                                Global.showError("Log Already Sent!")
                              }
                            } else {

                              navigation.navigate('BookingList');
                            }

                          }}>
                          <View
                            style={{
                              flex: 2,
                            }}>
                            {/* <View style={styles.imagePlaceHolderView}></View> */}
                            <Image source={Global.GlobalAssets.logo} style={{ height: scale(50), width: scale(50), borderRadius: scale(50) }} />
                          </View>
                          <View style={styles.contentView}>
                            <Global.GlobalText
                              text={item.description}
                              style={styles.text}
                            />
                            <Global.GlobalText
                              text={item.created_date}
                              style={styles.dateText}
                            />
                          </View>
                        </TouchableOpacity>
                        <View style={styles.lineWhite}></View>
                      </>
                    );
                  })}
                </View> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: scale(30) }}>
                  <Text style={styles.nodataText}>No Data</Text>
                </View>}
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  nodataText: {
    padding: scale(20), fontFamily: Global.GlobalFont.Bold
  },
  text: {
    textTransform: 'none',
    fontSize: scale(16),
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
    width: '100%',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    paddingVertical: scale(5),
    fontSize: scale(18),
    textTransform: 'none',
    paddingStart: scale(20),
  },
});
export default Notifications;
