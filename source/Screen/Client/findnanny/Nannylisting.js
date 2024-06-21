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
  Platform,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
import CheckBox from 'react-native-check-box';
import AntDesign from 'react-native-vector-icons/AntDesign';
import showToast from '../../../Component/showToast';
const wishlists = [1, 2, 3];
const IMG_CONTAIN = 'contain';

let bookingData = null,
  // selectedNannys = [],
  nannysData = [],
  childsData = [],
  selectedChild = [],
  id_childs = [],
  bookingDatas = null;
const Nannylisting = ({ navigation, route }) => {
  const [nannyData, setNannyData] = useState(null);
  const [selectedNannys, setSelectedNanny] = useState([]);
  const [childData, setChildData] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const [reviews, setReviews] = useState([]);
  const reviewsData = [
    {
      id: 0,
      data: "Her nurturing care and proactive approach truly make her an invaluable asset to our family"
    },
    {
      id: 0,
      data: "She is kind, trustworthy and great with children, invaluable asset to our family"
    },
  ]

  useEffect(() => {
    if (route.prams !== null && route.params && route.params !== undefined) {
      let data = route.params.bookingObj;
      if (data !== undefined && data !== null) {
        bookingData = data;
        console.log("api booking data", bookingData);
      }
    }
    findNanny();
    getChild();
    const unsubscribe = navigation.addListener('focus', () => {
      // selectedNannys = [];
      setSelectedNanny([]);
      findNanny();
      getChild();
      if (route.prams !== null && route.params && route.params !== undefined) {
        let data = route.params.bookingObj;
        console.log('bookingData', bookingData);
        if (data !== undefined && data !== null) {
          bookingData = data;
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const findNanny = () => {
    global.global_loader_reff.show_loader(1);
    let bookingObj = {
      id_address: bookingData.id_address,
      available_days: [
        {
          date: bookingData?.from_date,
          days: bookingData?.available.days[0],
          from_time: moment(
            bookingData?.available.from_time[0],
            'hh:mm A',
          ).format('HH:mm:ss'),
          to_time: moment(
            bookingData?.available.to_time[0], // If to_time[0] is undefined, use from_time[0]
            'hh:mm A',
          ).format('HH:mm:ss'),
        },
        {
          date: bookingData?.to_date, // If to_date is undefined, use from_date
          days: bookingData?.available.days[1] || bookingData?.available.days[0], // If days[1] is undefined, use days[0]
          from_time: moment(
            bookingData?.available.from_time[0], // If from_time[1] is undefined, use from_time[0]
            'hh:mm A',
          ).format('HH:mm:ss'),
          to_time: moment(
            bookingData?.available.to_time[1] || bookingData?.available.to_time[0], // If to_time[1] is undefined, use to_time[0]
            'hh:mm A',
          ).format('HH:mm:ss'),
        },
      ],
    };
    console.log('bookingObj-->', bookingObj);
    helper
      .UrlReqAuthPost('api/client/find_nanny_occasional', 'POST', bookingObj)
      .then(res => {
        console.log("response------>", res);
        if (res.status) {
          if (res.data !== null) {
            nannysData = res.data;
            const newFile = nannysData.map(file => {
              return { ...file, isChecked: false };
            });
            setNannyData(newFile);
            console.log(newFile);
            global.global_loader_reff.show_loader(0);
          }

          global.global_loader_reff.show_loader(0);
        } else {
          setNannyData(res.data);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };

  // const findNanny = () => {
  //   global.global_loader_reff.show_loader(1);

  //   helper
  //     .UrlReqAuth(
  //       'api/client/find_nanny?provide_date=' +
  //       bookingData?.provide_date +
  //       '&provide_from_time=' +se
  //       bookingData?.provide_from_time +
  //       '&provide_to_time=' +
  //       bookingData?.provide_to_time +
  //       '&id_address=' +
  //       bookingData?.id_address,
  //     )
  //     .then(res => {
  //       console.log('api/client/find_nanny?provide_date=' +
  //       bookingData?.provide_date +
  //       '&provide_from_time=' +
  //       bookingData?.provide_from_time +
  //       '&provide_to_time=' +
  //       bookingData?.provide_to_time +
  //       '&id_address=' +
  //       bookingData?.id_address)
  //       if (res.status) {
  //         if (res.data !== null) {
  //           nannysData = res.data;

  //           const newFile = nannysData.map(file => {
  //             return { ...file, isChecked: false };
  //           });
  //           setNannyData(newFile);
  //           console.log(newFile);
  //           global.global_loader_reff.show_loader(0);
  //         }

  //         global.global_loader_reff.show_loader(0);
  //       } else {
  //         setNannyData(res.data);
  //         global.global_loader_reff.show_loader(0);
  //       }
  //     })
  //     .catch(err => {
  //       global.global_loader_reff.show_loader(0);
  //     });
  // };
  const addToWishlist = id => {
    let idObj = { id_nanny: id };
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/wishlist/add', 'POST', idObj)
      .then(res => {
        if (res.status) {
          global.global_loader_reff.show_loader(0);
          Global.showToast(res.message);
          findNanny();
        } else {
          global.global_loader_reff.show_loader(0);
          Global.showError(res.message);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const nannyDetail = item => {
    let i = (item.item.index += 1);
    const ratingObject = {
      ratings: item.item.ratting,
    };
    let ratingObj = ratingObject;
    let stars = [];
    for (var s = 1; s <= 5; s++) {
      let path = Global.GlobalAssets.rate;
      if (s > ratingObj.ratings) {
        path = Global.GlobalAssets.starunfill;
      }
      stars.push(
        <Image style={styles.starStyle} source={path} resizeMode={'contain'} />,
      );
    }
    return (
      <View style={styles.cardView}>
        <View style={styles.cardChildView}>
          <Global.GlobalText
            text={item.item.first_name + ' ' + item.item.last_name}
            style={[styles.message, styles.themeTextStyle]}
          />
          {/* <TouchableOpacity
            style={{}}
            onPress={() => addToWishlist(item.item.id)}>
            {item.item.is_wishlist === true ? (
              <AntDesign
                name="heart"
                size={scale(18)}
                color={Global.GlobalColor.themePink}
                style={styles.delteBtnStyle}
              />
            ) : (
              <Image
                source={Global.GlobalAssets.heart}
                style={styles.delteBtnStyle}
                resizeMode={IMG_CONTAIN}
              />
            )}
          </TouchableOpacity> */}
        </View>
        <View style={{ flexDirection: 'row', marginTop: scale(10) }}>
          <View style={styles.halfFlex}></View>
          <View
            style={{
              flex: 2,
            }}>
            {item.item.profile_picture !== '' ? (
              <Image
                source={{ uri: item.item.profile_picture }}
                style={styles.wishlistImg}
                borderRadius={50}
              />
            ) : (
              <Image
                source={Global.GlobalAssets.userImg}
                style={styles.wishlistImg}
              />
            )}
          </View>
          {/* <View style={styles.halfFlex}></View> */}
          <View
            style={{
              flex: 8,
            }}>
            {item.item.age ? (
              <Global.GlobalText
                text={'Age - ' + item.item.age}
                style={[styles.message, styles.noPaddingVertical]}
              />
            ) : null}
            {item.item.experiance ? (
              <Global.GlobalText
                text={'Experience - ' + item.item.experiance}
                style={[styles.message, styles.noPaddingVertical]}
              />
            ) : null}
            {item.item.qualification ? (
              <Global.GlobalText
                text={'Qualification - ' + item.item.qualification}
                style={[styles.message, styles.noPaddingVertical]}
              />
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                marginLeft: scale(16),
                marginVertical: scale(5),
              }}>
              {stars}
            </View>
          </View>
        </View>
        {item.item.is_booked === false ? (
          <>
            <TouchableOpacity
              style={{
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
                marginRight: scale(10),
                marginTop: scale(-20),
              }}
              onPress={() => {
                selectedNanny(item.index);
              }}>
              <Image
                source={
                  item.item.isChecked
                    ? Global.GlobalAssets.checked
                    : Global.GlobalAssets.unCheck
                }
                style={{
                  height: scale(20),
                  width: scale(20),
                }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            {/* reviews */}
            <View style={{ marginTop: 10}}>
              {item.item.reviews !== null &&
                item.item.reviews.map((review, index) => (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      borderWidth: 0.5,
                      borderColor: Global.GlobalColor.themeBlue,
                      marginHorizontal: 10,
                      borderRadius: 13,
                      marginTop: 10
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        width:180,
                        marginLeft: 20,
                        color: Global.GlobalColor.themePink,
                        textTransform: "none",
                        fontFamily: Global.GlobalFont.Regular
                      }}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >{review.message}
                    </Text>
                  </View>
                ))}
            </View>

            {/* reviews end */}
          </>
        ) : (
          <View style={{ alignSelf: 'flex-end', paddingHorizontal: scale(10) }}>
            <Text
              style={{
                color: Global.GlobalColor.darkBlue,
                fontSize: scale(18),
                fontFamily: Global.GlobalFont.Bold,
              }}>
              Request Sent
            </Text>
          </View>
        )}
      </View>
    );
  };
  const selectedNanny = index => {
    const newArray = nannyData;
    newArray[index].isChecked = !newArray[index].isChecked;
    setNannyData([...newArray]);
    setSelectedNanny([]);
    filterData();
  };
  const filterData = () => {
    let data = nannyData
      .filter(item => item.isChecked === true)
      .map(({ id, first_name, last_name }) => ({
        id,
        first_name,
        last_name,
      }));
    let final_array = [];
    for (let index = 0; index < data.length; index++) {
      final_array.push(data[index]);
    }
    setSelectedNanny(final_array);
  };
  const onPressProceed = () => {
    if (selectedNannys.length === 0) {
      Global.showError("You Can't Proceed Without select Nanny!");
    } else {
      navigation.navigate('Findnanny', {
        bookingData: bookingData,
        selectedNanny: selectedNannys,
      });
    }
  };
  // add for admin request
  const getChild = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_children')
      .then(res => {
        if (res.status) {
          childsData = res.data;
          const newArray = childsData.map(file => {
            return { ...file, isChecked: false };
          });
          setChildData(newArray);

          global.global_loader_reff.show_loader(0);
        } else {
          childsData = res.data;
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(r => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const onSelectedChild = (child, index) => {
    const newArray = childData;
    newArray[index].isChecked = !newArray[index].isChecked;
    setChildData([...newArray]);
    selectedChild = [];
    timeCounter();
  };
  const timeCounter = () => {
    let data = childData
      .filter(item => item.isChecked === true)
      .map(({ id }) => ({
        id,
      }));
    let final_array = [];
    for (let index = 0; index < data.length; index++) {
      final_array.push(data[index]);
      selectedChild = final_array;
    }
  };
  const sendRequestAdmin = () => {
    selectedChild.forEach(element => {
      id_childs.push(element.id);
    });
    if (childsData === null) {
      Global.showError('Please add Child!');
    } else if (id_childs.length < 0) {
      Global.showError('Please select Child!');
    } else {
      let bookingObj = {
        device_type: Platform.OS,
        booking_type: '1',
        id_nanny: null,
        id_children: id_childs.toString(),
        id_address: bookingData.id_address,
        provide_date: '',
        provide_from_time: '',
        provide_to_time: '',
        from_date: bookingData.from_date,
        to_date: bookingData.to_date,
        available_days: bookingData.available,
      };
      console.log('params-->', bookingObj);
      global.global_loader_reff.show_loader(1);
      helper
        .UrlReqAuthPost('api/client/add_booking', 'POST', bookingObj)
        .then(res => {
          console.log('params-->', bookingObj);
          console.log("booking data---->", res);
          if (res.status) {
            Global.showToast(res.message);
            global.global_loader_reff.show_loader(0);
            navigation.navigate('BookingSuccess', { msg: res.message });
            selectedChild = [];
            id_childs = [];
            global.booking_type = '';
            global.provide_date = '';
            global.provide_end_date = '';
            global.provide_from_time = '';
            global.provide_to_time = '';
            global.address_name = '';
            global.id_address = '';
          } else {
            Global.showError(res.message);
            global.global_loader_reff.show_loader(0);
          }
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);
        });
    }
    //   let bookingObj = {
    //     device_type: Platform.OS,
    //     booking_type: bookingData.booking_type.toString(),

    //     id_children: id_childs.toString(),
    //     id_address: bookingData.id_address,
    //     provide_date: bookingData.provide_date,
    //     provide_from_time: bookingData.provide_from_time,
    //     provide_to_time: bookingData.provide_to_time,
    //   };

    //   global.global_loader_reff.show_loader(1);
    //   helper
    //     .UrlReqAuthPost('api/client/admin_request', 'POST', bookingObj)
    //     .then(res => {
    //       console.log('bokking', 'api/client/admin_request');
    //       console.log('bokking', bookingObj);

    //       if (res.status) {
    //         // Global.showToast(res.message);
    //         navigation.navigate('BookingSuccess', {msg: res.message});
    //         global.global_loader_reff.show_loader(0);
    //         selectedChild = [];
    //         id_childs = [];
    //         global.booking_type = '';
    //         global.provide_date = '';
    //         global.provide_end_date = '';
    //         global.provide_from_time = '';
    //         global.provide_to_time = '';
    //         global.address_name = '';
    //         global.id_address = '';
    //       } else {
    //         Global.showError(res.message);
    //         global.global_loader_reff.show_loader(0);
    //       }
    //     })
    //     .catch(err => {
    //       global.global_loader_reff.show_loader(0);
    //     });
    // }
  };

  const onHandleRequestAdmin = () => {
    sendRequestAdmin();
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
        <Global.GlobalHeader
          onPress={() => navigation.navigate('NewBooking')}
        />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="FIND NANNY" style={{ color: 'white' }} />
            </View>
            <View style={styles.contentView}>
              <View style={styles.nannyList}>
                <Global.GlobalText
                  text={bookingData?.address_name}
                  style={{
                    paddingHorizontal: scale(10),
                    paddingVertical: scale(10),
                  }}
                />
                {nannyData !== null ? (
                  <>
                    <FlatList
                      data={nannyData}
                      renderItem={nannyDetail}
                      keyExtractor={item => item.id}
                      vertical
                    />
                  </>
                ) : (
                  <View style={{}}>
                    <View style={{ alignItems: 'center' }}>
                      <Image
                        source={Global.GlobalAssets.userImg}
                        style={styles.wishlistImg}
                      />
                      <View>
                        <Text style={styles.message}>Nanny Not Available</Text>
                      </View>
                    </View>
                    <View style={styles.nannyListView}>
                      <Text style={styles.heading}>SELECT KIDS</Text>
                    </View>

                    <View style={{ padding: scale(20) }}>
                      {childData.map((child, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => onSelectedChild(child, index)}>
                              {child.isChecked ? (
                                <Image
                                  source={Global.GlobalAssets.checkActive}
                                  resizeMode={'contain'}
                                  style={{
                                    marginHorizontal: scale(10),
                                    paddingStart: scale(15),
                                    height: scale(20),
                                    width: scale(20),
                                  }}
                                />
                              ) : (
                                <Image
                                  source={Global.GlobalAssets.unCheckPink}
                                  resizeMode={'contain'}
                                  style={{
                                    marginHorizontal: scale(10),
                                    paddingStart: scale(15),
                                    height: scale(20),
                                    width: scale(20),
                                  }}
                                />
                              )}
                            </TouchableOpacity>
                            <Text
                              style={[
                                styles.normalText,
                                { color: Global.GlobalColor.themePink },
                              ]}>
                              {child.name}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        alignSelf: 'center',
                        width: '92%',
                      }}>
                      <Global.GlobalButton
                        text="ADD CHILD"
                        style={{
                          width: '95%',
                        }}
                        onPress={() => {
                          navigation.navigate('Addchild');
                        }}
                      />
                      <Global.GlobalButton
                        text="EDIT EXISTING CHILD"
                        style={{
                          width: '95%',
                        }}
                        onPress={() => {
                          global.isEditable = false;
                          global.isEditableChild = true;
                          navigation.navigate('Profile');
                        }}
                      />

                      <Global.GlobalButton
                        text="REQUEST ADMIN"
                        style={{
                          width: '95%',
                          backgroundColor: Global.GlobalColor.themeBlue,
                        }}
                        onPress={onHandleRequestAdmin}
                      />
                    </View>
                  </View>
                )}
                {nannyData !== null ? (
                  <View
                    style={{
                      alignSelf: 'center',
                      width: '100%',
                    }}>
                    <Global.GlobalButton
                      text="PROCEED"
                      style={{
                        backgroundColor: Global.GlobalColor.themeBlue,
                        width: '95%',
                      }}
                      onPress={() => {
                        onPressProceed();
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  wishlistImg: { height: scale(50), width: scale(50), borderRadius: scale(50) },
  starStyle: {
    marginHorizontal: scale(2),
    height: scale(18),
    width: scale(18),
  },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  contentView: {
    backgroundColor: Global.GlobalColor.lightPink,
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderBottomLeftRadius: scale(12),
    borderBottomRightRadius: scale(12),
  },
  halfFlex: {
    flex: 0.5,
  },
  delteBtnStyle: {
    marginEnd: scale(10),
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
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
  noPaddingVertical: { paddingVertical: scale(2) },
  cardView: {
    backgroundColor: 'white',
    marginHorizontal: scale(10),
    borderRadius: scale(8),
    marginBottom: scale(15),
    paddingBottom: scale(10),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(20),
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
    fontSize: scale(16),
    textTransform: 'none',
    paddingStart: scale(20),
    fontFamily: Global.GlobalFont.Regular,
    color: Global.GlobalColor.themePink,
  },
  nannyList: {
    backgroundColor: Global.GlobalColor.themeLightBlue,
    borderRadius: scale(10),
    paddingVertical: scale(10),
    paddingHorizontal: scale(5),
  },
  heading: {
    color: 'white',
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
    paddingTop: scale(8),
    marginLeft: scale(15),
  },
  normalText: {
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(22),
    color: Global.GlobalColor.themeBlue,
    marginVertical: scale(5),
  },
  nannyListView: {
    height: scale(40),
    backgroundColor: Global.GlobalColor.themeBlue,
    marginTop: scale(10),
  },
});
export default Nannylisting;
