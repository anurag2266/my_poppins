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
  BackHandler,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
let jobId = '', id_booking = '', id_nanny = '';
const Jobdetails = ({ navigation, route }) => {
  jobId = route.params.job_id;
  const [jobDetail, setJobDetail] = useState([]);
  useEffect(() => {
    getJobDetail();
    const unsubscribe = navigation.addListener('focus', () => {
      getJobDetail();
    });
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove(), unsubscribe();
    };
  }, []);
  const getJobDetail = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_job?id=' + jobId)
      .then(res => {

        if (res.status) {
          if (res.data !== null) {
            setJobDetail(res.data);
            id_booking = res.data[0].id;
            id_nanny = res.data[0].id_nanny;
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
  const [star, setStar] = useState(5);
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
              <Global.GlobalText text="JOBS" />
            </View>
            {jobDetail.map((item) => {
              const ratingObject = {
                ratings: item.ratting,
                //ratings: '1'
              };
              let ratingObj = ratingObject;
              let stars = [];
              for (var s = 1; s <= 5; s++) {
                let path = Global.GlobalAssets.rate;
                if (s > ratingObj.ratings) {
                  path = Global.GlobalAssets.starunfill;
                }
                stars.push(
                  <Image
                    style={styles.starStyle}
                    source={path}
                    resizeMode={'contain'}
                  />,
                );
              }
              return (
                <View
                  style={{
                    padding: scale(15),
                  }}>


                  <View style={styles.innerView}>
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
                    {item.booking_type === '1' ? (

                      <Global.GlobalText
                        text={"Time : " + item.from_time + ' ' + item.to_time}
                        style={styles.message}
                      />
                    ) : null}
                    <View style={styles.userDetailBase}>
                      {item.profile_picture !== '' ? (
                        <Image
                          source={{ uri: item.profile_picture }}
                          style={styles.imgStyle}
                        />
                      ) : (
                        <Image
                          source={Global.GlobalAssets.userImg}
                          style={styles.imgStyle}
                        />
                      )}
                      <Global.GlobalText
                        text={item.nanny_name}
                        style={styles.fontStyle}
                      />
                    </View>
                    <View style={{ marginTop: scale(15) }} />
                    {item.total_hours ? (
                      <Global.GlobalText
                        text={"Total Time : " + item.total_hours}
                        style={styles.fontStyle}
                      />
                    ) : null}
                    {item?.days_schedule !== null ? (
                      <>
                        {item?.days_schedule.map((item) => {
                          return (
                            <Global.GlobalText
                              text={item.name + '' + ' - ' + item.from_time + ' To ' + item.to_time}
                              style={[styles.message, { color: Global.GlobalColor.themeBlue, fontSize: scale(16), lineHeight: scale(12) }]}
                            />
                          )
                        })}
                      </>
                    ) : null}
                    <Global.GlobalText
                      text={"Child : " + item.child}
                      style={[styles.fontStyle, { color: Global.GlobalColor.themePink, marginTop: scale(12) }]}
                    />
                    {item.grand_total !== null ? (
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Global.GlobalText
                          text={'Total Cost : ' + global.currency + ' ' + item.grand_total}
                          style={styles.fontStyle}
                        />
                      </View>
                    ) : null}
                    {item.booking_type === '1' ? (
                      <>
                        <View
                          style={styles.reviewView}>
                          <Text
                            style={{
                              fontFamily: Global.GlobalFont.Regular,
                              fontSize: scale(16),
                              color: Global.GlobalColor.themePink,
                            }}>
                            Rating By Nanny :{' '}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginLeft: scale(1),
                              marginVertical: scale(5),
                            }}>
                            {stars}
                          </View>
                        </View>
                        {item.review_by_you ? (
                          <View
                            style={styles.reviewView}>
                            <Text
                              style={{
                                fontFamily: Global.GlobalFont.Regular,
                                fontSize: scale(18),
                                color: Global.GlobalColor.themePink,
                              }}>
                              Review By Nanny:{' '}
                            </Text>
                            <View
                              style={{ flexDirection: 'row' }}>
                              <Global.GlobalText
                                text={item.review_by_you}
                                style={[styles.fontStyle, { width: scale(170) }]}
                              />
                            </View>
                          </View>
                        ) : null}
                      </>
                    ) : null}
                  </View>
                </View>
              )
            })}
          </Card>

          {jobDetail[0]?.job_check_in_data != null ? (
            <>

              {jobDetail[0].job_check_in_data.map((item) => {

                return (
                  <Card style={styles.card}>
                    <View
                      style={{
                        padding: scale(15),
                      }}>
                      <View style={styles.innerView}>
                        <Global.GlobalText
                          text={item.check_in_day}
                          style={[styles.message, { fontSize: scale(16) }]}
                        />
                        <Global.GlobalText
                          text={"Check In : " + item.checked_in_at}
                          style={[styles.message, { fontSize: scale(15), paddingVertical: 0, paddingBottom: scale(3) }]}
                        />
                        <Global.GlobalText
                          text={"Check Out : " + item.checked_out_at}
                          style={[styles.message, { fontSize: scale(15), paddingVertical: 0, paddingBottom: scale(3) }]}
                        />
                        {!item.is_checkout_completed ? (
                          <>
                            {!item.client_approval ? (
                              <View
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(0) }}>
                                <TouchableOpacity onPress={() => {
                                  navigation.navigate('NotificationDetailClient', { id_booking: id_booking, id_nanny: id_nanny })
                                }}>
                                  <Global.GlobalText
                                    text="Hours Confirmation  "
                                    style={[styles.clickHere, { textTransform: 'none', fontSize: scale(18) }]}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : null}
                          </>
                        ) : null}
                        {!item.is_checkout_completed ? (
                          <>
                            {!item.admin_approval && item.client_approval ? (
                              <View
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(10) }}>
                                <View
                                >
                                  <Global.GlobalText
                                    text="Hours Confirmation -- Pending "
                                    style={[styles.clickHere, { textTransform: 'none', fontSize: scale(19) }]}
                                  />
                                </View>
                              </View>
                            ) : null}
                          </>
                        ) : null}
                        {item.total_cost !== null ? (
                          <>
                            <Global.GlobalText
                              text={'Total Cost : ' + global.currency + item.total_cost}
                              style={[styles.message, { fontSize: scale(16), color: Global.GlobalColor.themeBlue, marginTop: scale(-4) }]}
                            />
                            <Global.GlobalText
                              text={'Total Hours : ' + item.total_hours}
                              style={[styles.message, { fontSize: scale(16), color: Global.GlobalColor.themeBlue, marginTop: scale(-8) }]}
                            />
                          </>
                        ) : null}
                      </View>
                    </View>
                  </Card>

                )
              })}
            </>
          ) : null}





        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(20),
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
  message: {
    paddingVertical: scale(5),
    fontSize: scale(18),
    textTransform: 'none',
    paddingStart: scale(10),
    color: Global.GlobalColor.themePink,
  },
  innerView: {
    backgroundColor: 'white',
    padding: scale(10),
    borderRadius: scale(10),
  },
  userDetailBase: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(5),
  },
  imgStyle: {
    height: scale(60),
    width: scale(60),
    resizeMode: 'cover',
    borderRadius: scale(50)
  },
  fontStyle: {
    fontSize: scale(16),
    textTransform: 'capitalize',
    marginLeft: scale(10),
  },
  reviewView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    marginTop: scale(0),
  },
  starStyle: {
    marginHorizontal: scale(2),
    height: scale(22),
    width: scale(22),
  }, clickHere: {
    fontSize: scale(16),
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    paddingBottom: scale(0),
    textDecorationLine: "underline",
    paddingHorizontal: scale(10)
  },
});
export default Jobdetails;
