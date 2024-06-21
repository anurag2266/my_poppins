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
  Platform,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import { Card } from 'native-base';
import moment from 'moment';
import Geocoder from 'react-native-geocoding';
let bookingId = '',
  actionId = '';

const NewBooking = ({ navigation, route }) => {

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
  const [newBooking, setNewBooking] = useState([]);
  const [bookingType, setBookingType] = useState('');
  const [reviewData, setReviewData] = useState([]);
  const [nanny_approval, setNanny_approval] = useState('');
  const [admin_approval, setAdmin_approval] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const getBookingData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/new_booking_list?id=' + bookingId)
      .then(res => {
        if (res.status) {
          console.log("booking data-->", res);
          if (res.data !== null) {
            setNewBooking(res.data);
            getClientReview(res?.data[0]?.id_user);
            setBookingType(res?.data[0]?.booking_type);
            setNanny_approval(res?.data[0]?.nanny_approval);
            setAdmin_approval(res?.data[0]?.admin_approval);
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
  const getClientReview = client_id => {
    let reviewObj = { client_id: client_id };
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/nanny/get_client_review', 'POST', reviewObj)
      .then(res => {
        if (res.status) {
          if (res.data) {
            setReviewData(res.data);
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
  const updateStatus = () => {
    global.global_loader_reff.show_loader(1);
    let updateObj = { id_booking: bookingId.toString(), status: actionId };
    helper
      .UrlReqAuthPost('api/nanny/booking_approval', 'POST', updateObj)
      .then(res => {
        if (res.status) {
          Global.showToast(res.message);
          getBookingData();
          global.global_loader_reff.show_loader(0);
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
        style={{ marginBottom: scale(70) }}>
        <Global.GlobalHeader onPress={() => navigation.goBack()} />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="New Booking" style={{ color: '#fff' }} />
            </View>
            {newBooking.map((item, i) => {
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
              // const getCoordinatesFromAddress = (address) => {
              //   Geolocation.geocode(address)
              //     .then((response) => {
              //       if (response && response.length > 0) {
              //         const { latitude, longitude } = response[0];
              //         const coordinates = { latitude, longitude };
              //         navigateToMap(coordinates); // Pass coordinates to the function to navigate
              //       }
              //     })
              //     .catch((error) => {
              //       console.error('Error fetching coordinates:', error);
              //     });
              // };
              const getCoordinatesFromAddress = (address) => {
                Geocoder.init('AIzaSyDfEIAHWXHv6HEXxmqlmapS76g89cStBkQ'); // Replace with your Google Maps API key
            
                Geocoder.from(address)
                  .then((response) => {
                    const { lat, lng } = response.results[0].geometry.location;
                    const coordinates = { latitude: lat, longitude: lng };
                    navigateToMap(coordinates); // Pass coordinates to the function to navigate
                  })
                  .catch((error) => {
                    console.error('Error fetching coordinates:', error);
                  });
              };
          
              const navigateToMap = (coordinates) => {
                navigation.navigate('ClientLocationOnMap', { coordinates }); // Navigate to ClientLocationOnMap screen with coordinates as params
              };
              return (
                <View style={styles.detailView}>
                  <View style={styles.viewBase}>
                    <Global.GlobalText
                      text={item.client_name}
                      style={[styles.pinkText, { textTransform: 'uppercase' }]}
                    />
                  </View>
                  {item.booking_type === 1 ? (
                    <Global.GlobalText
                      text={'Date - ' + moment(item.from_date).format('DD/MM/YYYY') + ' TO ' + moment(item.to_date).format('DD/MM/YYYY')}
                      style={styles.message}
                    />
                  ) : (
                    <Global.GlobalText
                      text={'Date - ' + moment(item.from_date).format('DD/MM/YYYY') + ' TO ' + moment(item.to_date).format('DD/MM/YYYY')}
                      style={styles.message}
                    />
                  )}
                  {/* {item.booking_type === 1 ? (

                    <Global.GlobalText
                      text={'Time - ' + item.time}
                      style={styles.message}
                    />
                  ) : null} */}
                  {/* {item.booking_type === 2 ? ( */}
                  <>
                    {item.is_monday_available ? (
                      <Global.GlobalText
                        text={
                          'Monday Time - ' +
                          item.monday_from_time +
                          ' ' +
                          item.monday_to_time
                        }
                        style={styles.message}
                      />
                    ) : null}
                    {item.is_tuesday_available ? (
                      <Global.GlobalText
                        text={
                          'Tuesday Time - ' +
                          item.tuesday_from_time +
                          ' ' +
                          item.tuesday_to_time
                        }
                        style={styles.message}
                      />
                    ) : null}
                    {item.is_wednesday_available ? (
                      <Global.GlobalText
                        text={
                          'Wednesday Time - ' +
                          item.wednesday_from_time +
                          ' ' +
                          item.wednesday_to_time
                        }
                        style={styles.message}
                      />
                    ) : null}
                    {item.is_thursday_available ? (
                      <Global.GlobalText
                        text={
                          'Thuresday Time - ' +
                          item.thursday_from_time +
                          ' ' +
                          item.thursday_to_time
                        }
                        style={styles.message}
                      />
                    ) : null}

                    {item.is_friday_available ? (
                      <Global.GlobalText
                        text={
                          'Friday Time - ' +
                          item.friday_from_time +
                          ' ' +
                          item.friday_to_time
                        }
                        style={styles.message}
                      />
                    ) : null}
                    {item.is_saturday_available ? (
                      <Global.GlobalText
                        text={
                          'Saturday Time - ' +
                          item.saturday_from_time +
                          ' ' +
                          item.saturday_to_time
                        }
                        style={styles.message}
                      />
                    ) : null}
                    {item.is_sunday_available ? (
                      <Global.GlobalText
                        text={
                          'Sunday Time - ' +
                          item.sunday_from_time +
                          ' ' +
                          item.sunday_to_time
                        }
                        style={styles.message}
                      />
                    ) : null}
                  </>
                  {/* ) : null} */}
                  {/* <Global.GlobalText
                    text={'Location : ' + item.full_address}
                    style={styles.message}
                  /> */}
                  <Global.GlobalText
                    text={'Address : ' + item.address}
                    style={styles.message}
                  />

                  <Global.GlobalText
                    text={'Mobile Number : ' + item.mobile_number}
                    style={styles.message}
                  />
                  <Global.GlobalButton
                    text={'See On Map'}
                    style={{ height: 40, width: "50%" }}
                    onPress={() => {
                      const fullAddress = newBooking[0]?.address || ''; // Replace with your address field
                      if (fullAddress) {
                        getCoordinatesFromAddress(fullAddress); // Fetch coordinates when the button is pressed
                      } else {
                       Global.showToast("Address Doesn't Exist On Map")
                      }
                    }}
                  />
                  <Global.GlobalText
                    text={'Child Detail :'}
                    style={styles.pinkText}
                  />
                  {item.children_detail !== null ? (
                    <>
                      {item.children_details.map(child => {
                        return (
                          <View style={{ borderWidth: 1, margin: 5, borderRadius: 10, borderColor: Global.GlobalColor.themeBlue, backgroundColor: "#fff" }}>
                            <View style={{ marginTop: 0 }}>
                              <Global.GlobalText
                                text={`Child Name : ${child.name}`}
                                style={styles.message}
                              />
                              <Global.GlobalText
                                text={`Age : ${child.date_of_birth}`}
                                style={styles.message}
                              />
                              <Global.GlobalText
                                text={`About Child : ${child.about_child}`}
                                style={styles.message}
                              />
                              <Global.GlobalText
                                text={`Medical/Allergies: ${child.medical_or_allergies_issue}`}
                                style={styles.message}
                              />
                            </View>
                          </View>
                        );
                      })}
                    </>
                  ) : null}
                  <View style={{ flexDirection: 'row' }}>
                    <Global.GlobalText
                      text={'Ratings :'}
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
                </View>
              );
            })}
            {reviewData?.length > 0 &&
              reviewData !== undefined &&
              reviewData !== null ? (
              <View style={{ marginBottom: scale(10) }}>
                <Global.GlobalText
                  text={'Past Review : '}
                  style={[
                    styles.pinkText,
                    { fontSize: scale(20), paddingStart: scale(20) },
                  ]}
                />
                {reviewData?.map(reviewItem => {
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
                          style={{
                            flexDirection: 'row',
                            marginBottom: scale(1),
                          }}>
                          <Global.GlobalText
                            text={'Rating :'}
                            style={[styles.pinkText, { fontSize: scale(20) }]}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              marginLeft: scale(8),
                            }}>
                            {stars}
                          </View>
                        </View>
                      ) : null}
                      {reviewItem.message ? (
                        <Text
                          style={[
                            styles.pinkText,
                            { fontSize: scale(21), marginTop: -5 },
                          ]}>
                          Comment :&nbsp;
                          <Text
                            style={[
                              styles.pinkText,
                              {
                                fontSize: scale(21),
                                color: Global.GlobalColor.darkBlue,
                              },
                            ]}>
                            {reviewItem.message}
                          </Text>
                        </Text>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            ) : null}
          </Card>
          {nanny_approval === 0 ? (
            <View style={{ marginTop: scale(15) }}>
              <Global.GlobalButton
                text={'ACCEPT'}
                onPress={() => {
                  actionId = '1';
                  updateStatus();
                }}
                style={{
                  backgroundColor: Global.GlobalColor.themeBlue,
                }}
              />

              <Global.GlobalButton
                text={'REJECT'}
                onPress={() => {
                  actionId = '2';
                  updateStatus();
                }}
                style={{
                  backgroundColor: Global.GlobalColor.themePink,
                }}
              />
            </View>
          ) : (
            <>
              {nanny_approval === 1 ? (
                <>
                  {admin_approval === 1 ? (
                    <Global.GlobalButton
                      text={'Booking Approved'}
                      disabled={true}
                      style={{
                        backgroundColor: Global.GlobalColor.themePink,
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
                        backgroundColor: Global.GlobalColor.themeBlue,
                        height: scale(40),
                        alignSelf: 'center',
                      }}
                    />
                  )}
                </>
              ) : (
                // <Global.GlobalButton
                //   text={'ACCEPTED'}
                //   disabled={true}
                //   style={{
                //     backgroundColor: Global.GlobalColor.themeBlue,
                //   }}
                // />
                <View>
                  {bookingType === 2 ? null : (
                    <Global.GlobalButton
                      text={'REJECTED'}
                      disabled={true}
                      style={{
                        backgroundColor: Global.GlobalColor.themePink,
                      }}
                    />
                  )}
                </View>
              )}
            </>
          )}
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
    backgroundColor: Global.GlobalColor.darkBlue,
    padding: scale(10),
    borderTopStartRadius: scale(15),
    borderTopEndRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    paddingVertical: scale(4),
    fontSize: scale(18),
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
    height: scale(25),
    width: scale(25),
  },
});
export default NewBooking;
