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

const IMG_CONTAIN = 'contain';
const Logs = ({ navigation }) => {
  const [logData, setLogData] = useState([])
  useEffect(() => {
    getLogData()
    // AsyncStorage.clear();
    // const backAction = () => {
    //   //   onLogout();
    //   return true;
    // };
    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );
    const unsubscribe = navigation.addListener('focus', () => {
      getLogData();
    });
    return () => unsubscribe()
  }, []);
  const getLogData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_logs?id=')
      .then(res => {

        if (res.status) {
          if (res.data !== null) {
            setLogData(res.data);
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
        <Global.GlobalHeader onPress={() => navigation.goBack()} />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="Logs" style={{ color: 'white' }} />
            </View>
            <View
              style={{
                backgroundColor: Global.GlobalColor.lightPink,
                paddingTop: scale(10),
                paddingHorizontal: scale(15),
                borderBottomLeftRadius: scale(15),
                borderBottomRightRadius: scale(15),

              }}>
              {logData.length > 0 ? (
                <>

                  {logData.map((item, index) => {
                    let t = (index += 1);
                    return (
                      <View
                        style={{
                          backgroundColor: 'white',
                          borderRadius: scale(10),
                          marginBottom: scale(15),
                          padding: scale(15),
                        }}>
                        <Global.GlobalText
                          text={item.booking_date}
                          style={styles.pinkText}
                        />
                        {item.total_hours ? (
                          <Global.GlobalText
                            text={"Total no. of hours : " + item.total_hours}
                            style={styles.message}
                          />
                        ) : (
                          <Global.GlobalText
                            text={"Total no. of hours : " + 'On Going Job'}
                            style={styles.message}
                          />
                        )}

                        <Global.GlobalText
                          text={"Nanny : " + item.nanny_name}
                          style={styles.message}
                        />
                        <Global.GlobalText
                          text={"Child : " + item.child}
                          style={styles.message}
                        />
                        <TouchableOpacity
                          style={styles.eye}
                          onPress={() => {
                            navigation.navigate('LogdetailClient', { id_log: item.id });
                            // alert('under development')
                          }}>
                          <Image
                            style={{
                              height: scale(15),
                              width: scale(15),
                            }}
                            source={Global.GlobalAssets.eyeIcon}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>

                    );
                  })}
                </>
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: scale(30) }}>
                  <Text style={styles.nodataText}>No Data</Text>
                </View>
              )}
            </View>
          </Card>
        </View>
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
    backgroundColor: Global.GlobalColor.themeBlue,
    height: scale(25),
    width: scale(25),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: scale(5),
    position: 'absolute',
    right: scale(15),
    top: scale(15),
  },
  clickHere: {
    borderBottomWidth: 1,
    borderBottomColor: Global.GlobalColor.themeBlue,
    fontSize: scale(16),
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    paddingBottom: scale(0),
  },
  halfFlex: {
    flex: 0.5,
  },
  delteBtnStyle: {
    marginEnd: scale(10),
  },
  cardChildView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: scale(10),
  },
  themeTextStyle: {
    color: Global.GlobalColor.themePink,
    fontSize: scale(20),
    paddingVertical: 0,
  },
  noPaddingVertical: { paddingVertical: 0 },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(20),
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
    fontSize: scale(18),
    textTransform: 'none'
  }, pinkText: {
    fontSize: scale(20),
    color: Global.GlobalColor.themePink,
    marginVertical: scale(5), textTransform: 'none'
  }, nodataText: {
    padding: scale(20), fontFamily: Global.GlobalFont.Regular, fontSize: scale(20),
    color: Global.GlobalColor.themeBlue
  },
});
export default Logs;
