import React, { useState, useEffect } from 'react';
import {
  View,

  Image,
  ImageBackground,
  StyleSheet,

  StatusBar,
  ScrollView,

  Platform,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';

import { Card } from 'native-base';
import { Text } from 'react-native';
let bookingId = '';
const CompleteBooking = ({ navigation, route }) => {
  const [completeBooking, setCompleteBooking] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  useEffect(() => {
    if (route.params !== undefined && route.params !== null) {
      let data = route.params.bookingId;
      if (data !== '' && data !== undefined && data !== null) {
        bookingId = data;
      }
    }
    getBookingData();
    const unsubscribe = navigation.addListener('focus', () => {
      getBookingData();
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const getBookingData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/completed_job?id=' + bookingId)
      .then(res => {

        if (res.status) {
          if (res.data !== null) {
            setCompleteBooking(res.data);
            getClientReview(res?.data[0]?.id_client)
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
  const getClientReview = (client_id) => {
    let reviewObj =
      { client_id: client_id }
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/nanny/get_client_review', 'POST', reviewObj)
      .then(res => {
        if (res.status) {
          if (res.data) {

            setReviewData(res.data)
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
              <Global.GlobalText
                text="Completed Booking"
                style={{ color: '#fff' }}
              />
            </View>
            {completeBooking.map(item => {

              const ratingObject = {
                ratings: item.ratting,
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
                <View style={styles.detailView}>
                  <View style={styles.viewBase}>
                    <Global.GlobalText
                      text={item.client_name}
                      style={styles.pinkText}
                    />
                  </View>
                  <Global.GlobalText
                    text={'Date : ' + item.booking_date}
                    style={styles.message}
                  />
                  <Global.GlobalText
                    text={'Time : ' + item.booking_from_time + ' ' + item.booking_to_time}
                    style={styles.message}
                  />
                  {/* <Global.GlobalText
                    text={'Location : ' + item.full_address}
                    style={styles.message}
                  /> */}
                  <Global.GlobalText
                    text={'Address : ' + item.address}
                    style={styles.message}
                  />
                  <Global.GlobalText
                    text={'Area : ' + item.area}
                    style={styles.message}
                  />
                  <Global.GlobalText
                    text={'Mobile Number : ' + item.mobile_number}
                    style={styles.message}
                  />
                  <Global.GlobalText
                    text={'Child Detail :'}
                    style={styles.message}
                  />
                  {item.child !== null ? (
                    <>
                      {item.child.map((r) => {
                        return (
                          <Global.GlobalText
                            text={r.name + ' - ' + r.total_month}
                            style={styles.message}
                          />
                        )
                      })}
                    </>
                  ) : null}
                  {item.ratting !== 0 ? (

                    <View
                      style={{ flexDirection: 'row', marginVertical: scale(5) }}>
                      <Global.GlobalText
                        text={'Ratings by Client :'}
                        style={[styles.pinkText, { fontSize: scale(20) }]}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          marginLeft: scale(8),
                          marginVertical: scale(5),
                        }}>
                        {stars}
                      </View>
                    </View>
                  ) : null}
                  {item.review_by_you ? (
                    <>
                      <Global.GlobalText
                        text={'Review by Client : '}
                        style={[styles.pinkText, { fontSize: scale(20) }]}
                      />
                      <Global.GlobalText
                        text={item.review_by_you}
                        style={styles.message}
                      />
                    </>
                  ) : null}
                  <Global.GlobalText
                    text={'Total Time : ' + item.total_hours}
                    style={styles.pinkText}
                  />
                  <Global.GlobalText
                    text={'Total Amount : ' + global.currency + ' ' + item.total_cost}
                    style={styles.pinkText}
                  />
                </View>
              );
            })}
            {reviewData?.length > 0 && reviewData !== undefined && reviewData !== null ? (
              <View style={{ marginBottom: scale(10) }}>
                <Global.GlobalText
                  text={'Past Review : '}
                  style={[styles.pinkText, { fontSize: scale(20), paddingStart: scale(20) }]}
                />
                {reviewData?.map((reviewItem) => {

                  const ratingObject = {
                    ratings: reviewItem.ratting,
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
                    <View style={{ marginHorizontal: scale(10) }}>
                      {reviewItem.ratting !== 0 ? (

                        <View
                          style={{ flexDirection: 'row', }}>
                          <Global.GlobalText
                            text={'Rating :'}
                            style={[styles.pinkText, { fontSize: scale(20) }]}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              marginLeft: scale(8),
                              marginVertical: scale(5),
                            }}>
                            {stars}
                          </View>
                        </View>
                      ) : null}
                      {reviewItem.message ? (


                        <Text style={[styles.pinkText, { fontSize: scale(21), marginTop: -5 }]}>
                          Comment :&nbsp;
                          <Text style={[styles.pinkText, { fontSize: scale(21), color: Global.GlobalColor.darkBlue }]}>{reviewItem.message}</Text>
                        </Text>

                      ) : null}
                    </View>
                  )
                })}

              </View>) : null}
          </Card>
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
  message: {
    paddingVertical: scale(4),
    fontSize: scale(20),
    textTransform: 'none',
    paddingStart: scale(10),
    fontFamily: Global.GlobalFont.Regular,
  },
  pinkText: {
    paddingVertical: scale(1),
    fontSize: Platform.OS === 'ios' ? scale(22) : scale(22),
    textTransform: 'none',
    paddingStart: scale(10),
    fontFamily: Global.GlobalFont.Regular,
    color: Global.GlobalColor.themePink,
  },
  viewBase: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(5),
    marginRight: scale(5),
  },
  detailView: {
    paddingBottom: scale(10),
    marginTop: scale(10),
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
  },
  starStyle: {
    marginHorizontal: scale(2),
    height: scale(20),
    width: scale(20),
  },
});
export default CompleteBooking;
