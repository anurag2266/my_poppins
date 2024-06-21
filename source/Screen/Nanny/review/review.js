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
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  Platform,
  TextInput,
  FlatList,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import {scale} from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {Card} from 'native-base';

let id_booking = '',
  bookId = '',
  is_loading = false;
const ReviewPage = ({navigation, route}) => {
  const [comment, setComment] = useState('');
  const [defaultRating, setDefaultRating] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [completeBooking, setCompleteBooking] = useState([]);
  const [reviews , setReviews]= useState([])

  const [reviewData, setReviewData] = useState([
    {
      id: 0,
      name: 'Alex Joe',
      rating: 5,
      message: 'Reliable, kind, and a true support for busy parents',
    },
    {
      id: 0,
      name: 'Paul',
      rating: 4,
      message: 'Outstanding! Patient, experienced, and a mentor to our kids.',
    },
    {
      id: 0,
      name: 'Maria',
      rating: 3,
      message: 'Professional, engaging, and a blessing for our family!',
    },
    {
      id: 0,
      name: 'Alena',
      rating: 4,
      message: 'Amazing nanny! Punctual, caring, and highly recommended!',
    },
  ]);

  // To set the max number of Stars

  useEffect(() => {

    if (route.params !== undefined && route.params !== null) {
      let data = route.params.id_booking;
      let data_id = route.params.id;
      if (data !== '' && data !== undefined && data !== null) {
        id_booking = data;
      }
      if (data_id !== '' && data_id !== undefined && data_id !== null) {
        bookId = data_id;
      }
    }
    getBookingData();
    getReview()
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params !== undefined && route.params !== null) {
        let data = route.params.id_booking;
        let data_id = route.params.id;
        if (data !== '' && data !== undefined && data !== null) {
          id_booking = data;
        }
        if (data_id !== '' && data_id !== undefined && data_id !== null) {
          bookId = data_id;
        }
      }
      getBookingData();
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const getBookingData = () => {
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

  const getReview = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/reviews_list')
      .then(res => {
        setReviews(res.reviews);
        console.log("reviews data", res.reviews);
      })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });
  };
  
  const submitReview = (id_booking, id_client) => {
    let reviewObj = {
      added_by: global.usertype,
      id_booking: id_booking,
      id_user: id_client,
      message: comment,
      ratting: defaultRating.toString(),
    };

    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/review/add', 'POST', reviewObj)
      .then(res => {
        if (res.status) {
          if (res.data !== null) {
            setDefaultRating(0);
            setComment('');
            Global.showToast(res.message);
            global.global_loader_reff.show_loader(0);
            navigation.goBack();
          }
        } else {
          Global.showError(res.message);
          global.global_loader_reff.show_loader(0);
        }
      })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const renderItem = ({item}) => {
    return (
      <View style={styles.mainContainer}>
          <Global.GlobalText numberOfLines={2}  style={{width:210,fontSize: scale(14)}} text={item.message} />
          {/* <Text  style={{width:210}}>{item.message}</Text> */}
          <Global.GlobalText
            text={'Rating: ' + item.ratting}
            style={{fontSize: scale(12)}}
          />
       
      </View>
    );
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: scale(0)}}>
          <Global.GlobalHeader onPress={() => navigation.goBack()} />
          <View style={styles.baseView}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Global.GlobalText text="Review" style={{color: '#fff'}} />
              </View>

              {completeBooking.length < 0 ? (
                completeBooking.map(item => {
                  return (
                    <View style={styles.detailView}>
                      <Global.GlobalText
                        text={'Please provide the review for'}
                        style={styles.pinkText}
                      />

                      <Global.GlobalText
                        text={item.client_name}
                        style={styles.pinkText}
                      />

                      <Global.GlobalText
                        text={'Date : ' + item.booking_date}
                        style={styles.message}
                      />
                      <Global.GlobalText
                        text={
                          'Time : ' +
                          item.booking_from_time +
                          ' ' +
                          item.booking_to_time
                        }
                        style={styles.message}
                      />
                      <Global.GlobalText
                        text={'Location : ' + item.address}
                        style={styles.message}
                      />
                      <Global.GlobalText
                        text={'Child Detail :'}
                        style={styles.message}
                      />
                      {item.child.map(r => {
                        return (
                          <Global.GlobalText
                            text={r.name + ' ' + '(' + r.total_month + ')'}
                            style={styles.message}
                          />
                        );
                      })}
                      <View style={{flexDirection: 'row'}}>
                        <Global.GlobalText
                          text={'Provide Rating :'}
                          style={styles.pinkText}
                        />
                        <View
                          style={[styles.customRatingBarStyle, {marginTop: 0}]}>
                          {maxRating.map((item, index, key) => {
                            return (
                              <TouchableOpacity
                                activeOpacity={0.7}
                                key={item}
                                onPress={() => {
                                  setDefaultRating(item);
                                }}>
                                <Image
                                  style={styles.starImageStyle}
                                  source={
                                    item <= defaultRating
                                      ? Global.GlobalAssets.rate
                                      : Global.GlobalAssets.starunfill
                                  }
                                  resizeMode={'contain'}
                                />
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>

                      <Global.GlobalText
                        text={'Provide Review :'}
                        style={styles.pinkText}
                      />
                      <View style={{alignSelf: 'center'}}>
                        <TextInput
                          style={styles.textInput}
                          onChangeText={text => setComment(text)}
                          value={comment}
                          multiline={true}
                          numberOfLines={5}
                          placeholder={'Please Provide Your Review'}
                          placeholderTextColor={Global.GlobalColor.lightBlue}
                        />
                      </View>
                      <View style={{marginTop: scale(15), alignSelf: 'center'}}>
                        <Global.GlobalButton
                          text={'Submit'}
                          onPress={() => {
                            submitReview(item.id_booking, item.id_client);
                          }}
                          style={{
                            backgroundColor: Global.GlobalColor.themePink,
                          }}
                        />
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={{alignItems: 'center'}}>
                  <Global.GlobalText
                    text={'Review Not Available'}
                    style={{paddingVertical: scale(20), fontSize: scale(16)}}
                  />
                </View>
              )}
            </Card>
          </View>

          <View style={styles.baseView}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Global.GlobalText
                  text="Reviews By Client"
                  style={{color: '#fff'}}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <FlatList renderItem={renderItem} data={reviews} />
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  textAreaContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
  },
  bgImg: {height: '109%', width: '100%', alignItems: 'center'},
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
    paddingVertical: scale(1),
    fontSize: scale(22),
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
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: scale(5),
  },
  starImageStyle: {
    width: scale(24),
    height: scale(24),
    resizeMode: 'cover',
    marginHorizontal: scale(1),
  },
  textInput: {
    width: scale(240),
    marginTop: scale(10),
    height: scale(130),
    borderRadius: scale(5),
    backgroundColor: '#fff',
    borderStyle: 'solid',

    paddingHorizontal: scale(10),
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(20),
    textAlignVertical: 'top',
  },
  mainContainer: {
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    backgroundColor: 'white',
    borderColor: Global.GlobalColor.themeBlue,
    padding: 12,
    flexDirection:"row",
    justifyContent:"space-between"
  },
});
export default ReviewPage;
