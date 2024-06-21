import React, {useState, useEffect} from 'react';
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
  FlatList,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import {scale} from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {Card} from 'native-base';
// import Search from '../../Client/tabscreens/Search';
let actionId = '',
  childName = [];
const Search = ({navigation}) => {
  useEffect(() => {
    getBookingData();
    getCompleteBooking();
    const unsubscribe = navigation.addListener('focus', () => {
      getBookingData();
      getCompleteBooking();
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
  const [completeBooking, setCompleteBooking] = useState([]);
  const [newBooking, setNewBooking] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const [bookingType, setBookingType] = useState('1');
  const getBookingData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/new_booking_list')
      .then(res => {
        if (res.status) {
          if (res.data !== null) {
            setNewBooking(res.data);
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
  const getCompleteBooking = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/completed_job?id=')
      .then(res => {
        if (res.status) {
          if (res.data !== null) {
            setCompleteBooking(res.data);
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
  const updateStatus = id => {
    global.global_loader_reff.show_loader(1);
    let updateObj = {id_booking: id.toString(), status: actionId};
    helper
      .UrlReqAuthPost('api/nanny/booking_approval', 'POST', updateObj)
      .then(res => {
        if (res.status) {
          global.global_loader_reff.show_loader(0);
          Global.showToast(res.message);
          getBookingData();
        } else {
          global.global_loader_reff.show_loader(0);
          Global.showError(res.message);
        }
      });
    // {"id":"11","status":"1"}
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
        style={{marginBottom: scale(120)}}>
        <Global.GlobalHeader onPress={() => navigation.goBack()} />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="Bookings" style={{color: 'white'}} />
            </View>

            <TouchableOpacity
              style={styles.headerView}
              onPress={() => {
                setIsShow(!isShow);
                setBookingType('1');
              }}>
              <Global.GlobalText
                text="New Bookings"
                style={{paddingVertical: scale(5), paddingStart: scale(10)}}
              />
            </TouchableOpacity>
            {bookingType === '1' && isShow ? (
              <View>
                {newBooking.length > 0 && (
                  <View style={styles.innerCard}>
                    {newBooking.map((items, index) => {
                      const ratingObject = {
                        ratings: items.ratting,
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
                        <>
                          <View style={styles.detailView}>
                            <View style={styles.viewBase}>
                              <Global.GlobalText
                                text={items.booking_date}
                                style={styles.pinkText}
                              />
                              <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() =>
                                  navigation.navigate('NewBookings', {
                                    bookingId: items.id,
                                  })
                                }>
                                <Image
                                  source={Global.GlobalAssets.eyeIcon}
                                  style={styles.eyes}
                                />
                              </TouchableOpacity>
                            </View>
                            {/* {items.booking_type === 1 ? (

                              <Global.GlobalText
                                text={'Date - ' + items.date}
                                style={styles.message}
                              />
                            ) : ( */}
                            <Global.GlobalText
                              text={
                                'Date - ' +
                                moment(items.from_date).format('DD/MM/YYYY') +
                                ' TO ' +
                                moment(items.to_date).format('DD/MM/YYYY')

                              }
                              style={styles.message}
                            />
                            {/* )} */}
                            {items.booking_type === 1 ? (
                              <>
                                {items.is_monday_available ? (
                                  <Global.GlobalText
                                    text={
                                      'Monday Time - ' +
                                      items.monday_from_time +
                                      ' ' +
                                      items.monday_to_time
                                    }
                                    style={styles.message}
                                  />
                                ) : null}
                                {items.is_tuesday_available ? (
                                  <Global.GlobalText
                                    text={
                                      'Tuesday Time - ' +
                                      items.tuesday_from_time +
                                      ' ' +
                                      items.tuesday_to_time
                                    }
                                    style={styles.message}
                                  />
                                ) : null}
                                {items.is_wednesday_available ? (
                                  <Global.GlobalText
                                    text={
                                      'Wednesday Time - ' +
                                      items.wednesday_from_time +
                                      ' ' +
                                      items.wednesday_to_time
                                    }
                                    style={styles.message}
                                  />
                                ) : null}
                                {items.is_thursday_available ? (
                                  <Global.GlobalText
                                    text={
                                      'Thuresday Time - ' +
                                      items.thursday_from_time +
                                      ' ' +
                                      items.thursday_to_time
                                    }
                                    style={styles.message}
                                  />
                                ) : null}

                                {items.is_friday_available ? (
                                  <Global.GlobalText
                                    text={
                                      'Friday Time - ' +
                                      items.friday_from_time +
                                      ' ' +
                                      items.friday_to_time
                                    }
                                    style={styles.message}
                                  />
                                ) : null}
                                {items.is_saturday_available ? (
                                  <Global.GlobalText
                                    text={
                                      'Saturday Time - ' +
                                      items.saturday_from_time +
                                      ' ' +
                                      items.saturday_to_time
                                    }
                                    style={styles.message}
                                  />
                                ) : null}
                                {items.is_sunday_available ? (
                                  <Global.GlobalText
                                    text={
                                      'Sunday Time - ' +
                                      items.sunday_from_time +
                                      ' ' +
                                      items.sunday_to_time
                                    }
                                    style={styles.message}
                                  />
                                ) : null}
                              </>
                            ) : null}
                            <View style={{flexDirection: 'row'}}>
                              <Global.GlobalText
                                text={'Client - ' + items.client_name}
                                style={styles.message}
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
                            {items.booking_type === 1 ? (
                              <>
                                {items.nanny_approval === 0 ? (
                                  <View style={styles.btnBase}>
                                    <Global.GlobalButton
                                      text={'ACCEPT'}
                                      onPress={() => {
                                        actionId = '1';
                                        updateStatus(items.id);
                                      }}
                                      style={[
                                        styles.actionBtn,
                                        {
                                          backgroundColor:
                                            Global.GlobalColor.themeBlue,
                                        },
                                      ]}
                                    />
                                    <Global.GlobalButton
                                      text={'REJECT'}
                                      onPress={() => {
                                        actionId = '2';
                                        updateStatus(items.id);
                                      }}
                                      style={[
                                        styles.actionBtn,
                                        {
                                          backgroundColor:
                                            Global.GlobalColor.themePink,
                                        },
                                      ]}
                                    />
                                  </View>
                                ) : (
                                  <>
                                    {items.nanny_approval === 1 ? (
                                      <>
                                        {items.admin_approval === 1 ? (
                                          <Global.GlobalButton
                                            text={'Booking Approved'}
                                            disabled={true}
                                            style={{
                                              backgroundColor:
                                                Global.GlobalColor.themePink,
                                              height: scale(40),
                                              alignSelf: 'center',
                                              paddingHorizontal: 0,
                                              fontSize: scale(15),
                                            }}
                                          />
                                        ) : (
                                          <Global.GlobalButton
                                            text={'Accepted'}
                                            disabled={true}
                                            style={{
                                              backgroundColor:
                                                Global.GlobalColor.themeBlue,
                                              height: scale(40),
                                              alignSelf: 'center',
                                            }}
                                          />
                                        )}
                                      </>
                                    ) : (
                                      <Global.GlobalButton
                                        text={'Rejected'}
                                        disabled={true}
                                        style={{
                                          backgroundColor:
                                            Global.GlobalColor.themePink,
                                          height: scale(40),
                                          alignSelf: 'center',
                                        }}
                                      />
                                    )}
                                  </>
                                )}
                              </>
                            ) : null}
                          </View>
                        </>
                      );
                    })}
                  </View>
                )}
              </View>
            ) : null}
            <TouchableOpacity
              style={styles.headerView}
              onPress={() => {
                setIsShow(!isShow);
                setBookingType('2');
              }}>
              <Global.GlobalText
                text="Completed Bookings"
                style={{paddingVertical: scale(5), paddingStart: scale(10)}}
              />
            </TouchableOpacity>

            <View>
              {completeBooking.length > 0 && (
                <View style={styles.innerCard}>
                  {completeBooking.map(item => {
                    let nm = [];
                    item.child.forEach(element => {
                      nm.push(element.name);
                    });
                    childName = nm;
                    return (
                      <View style={styles.detailView}>
                        <View style={styles.viewBase}>
                          <Global.GlobalText
                            text={item.booking_date}
                            style={styles.pinkText}
                          />
                          <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() =>
                              navigation.navigate('CompleteBooking', {
                                bookingId: item.id,
                              })
                            }>
                            <Image
                              source={Global.GlobalAssets.eyeIcon}
                              style={styles.eyes}
                            />
                          </TouchableOpacity>
                        </View>
                        <Global.GlobalText
                          text={'Total Time - ' + item.total_hours}
                          style={styles.message}
                        />
                        <Global.GlobalText
                          text={'Client  - ' + item.client_name}
                          style={styles.message}
                        />
                        <Global.GlobalText
                          text={'Child - ' + childName.toString()}
                          style={styles.message}
                        />
                        <Global.GlobalText
                          text={
                            'Total Cost - ' +
                            global.currency +
                            ' ' +
                            item.total_cost
                          }
                          style={styles.message}
                        />
                        {!item.is_review ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: scale(6),
                              marginHorizontal: scale(10),
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate('Reviews', {
                                  id: item.id,
                                  id_booking: item.id_booking,
                                });
                              }}>
                              <Global.GlobalText
                                text="Give Review"
                                style={[
                                  styles.clickHere,
                                  {
                                    textTransform: 'none',
                                    fontSize: scale(19),
                                    textDecorationLine: 'underline',
                                  },
                                ]}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginVertical: scale(6),
                              marginHorizontal: scale(10),
                            }}>
                            <View>
                              <Global.GlobalText
                                text="Rated"
                                style={[
                                  styles.clickHere,
                                  {
                                    textTransform: 'none',
                                    fontSize: scale(19),
                                    color: '#4c4c4c',
                                    textDecorationLine: 'underline',
                                  },
                                ]}
                              />
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
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
  bgImg: {height: '119%', width: '100%', alignItems: 'center'},
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
  innerCard: {
    backgroundColor: Global.GlobalColor.themeLightBlue,
    marginLeft: scale(10),
    marginRight: scale(10),
    marginVertical: scale(10),
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
    paddingVertical: scale(1),
    fontSize: scale(18),
    textTransform: 'none',
    paddingStart: scale(10),
  },
  pinkText: {
    paddingVertical: scale(1),
    fontSize: scale(22),
    textTransform: 'none',
    paddingStart: scale(10),
    fontFamily: Global.GlobalFont.Regular,
    color: Global.GlobalColor.themePink,
  },
  btnBase: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    marginTop: scale(8),
  },
  viewBase: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
    marginRight: scale(5),
  },
  eyeIcon: {
    backgroundColor: Global.GlobalColor.themeBlue,
    alignItems: 'center',
    height: scale(25),
    width: scale(28),
    justifyContent: 'center',
    borderRadius: scale(5),
  },
  actionBtn: {height: scale(40), flex: 1, paddingHorizontal: scale(30)},
  headerView: {
    backgroundColor: Global.GlobalColor.lightBlue,
    paddingVertical: scale(5),
    borderRadius: scale(5),
    margin: scale(5),
  },
  detailView: {
    backgroundColor: 'white',
    paddingBottom: scale(10),
    marginTop: scale(10),
    borderRadius: scale(10),
  },
  eyes: {
    height: scale(30),
    width: scale(20),
    resizeMode: 'contain',
  },
  starStyle: {
    marginHorizontal: scale(1),
    height: scale(15),
    width: scale(15),
  },
  clickHere: {
    fontSize: scale(16),
    color: Global.GlobalColor.themePink,
    fontFamily: Global.GlobalFont.Regular,
    paddingBottom: scale(0),
  },
});
export default Search;
