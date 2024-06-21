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
  Platform,
  TextInput,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import {scale} from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {Card} from 'native-base';
let id_job = '',
  bookId = '';
const ReviewPage = ({navigation, route}) => {
  const [comment, setComment] = useState('');
  const [defaultRating, setDefaultRating] = useState(0);
  const [completeBooking, setCompleteBooking] = useState([]);
  // To set the max number of Stars
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (route.params !== undefined && route.params !== null) {
      let data = route.params.job_id;
      // let data_id = route.params.id;

      if (data !== '' && data !== undefined && data !== null) {
        id_job = data;
      }
      // if (data_id !== '' && data_id !== undefined && data_id !== null) {

      //   bookId = data_id
      // }
    }
    getJobData();
    const unsubscribe = navigation.addListener('focus', () => {
      getJobData();
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const getJobData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_job?id=' + id_job)
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
  const submitReview = (id_booking, id_nanny) => {
    let reviewObj = {
      added_by: global.usertype,
      id_booking: id_booking,
      id_user: id_nanny,
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
            navigation.goBack();
            Global.showToast(res.message);
            global.global_loader_reff.show_loader(0);
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
        style={{marginBottom: scale(70)}}>
        <Global.GlobalHeader onPress={() => navigation.goBack()} />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="Review" style={{color: '#fff'}} />
            </View>
            {completeBooking.map(item => {
              return (
                <View style={styles.detailView}>
                  <Global.GlobalText
                    text={'Please provide the review for'}
                    style={styles.pinkText}
                  />

                  <Global.GlobalText
                    text={item.nanny_name}
                    style={styles.pinkText}
                  />

                  <Global.GlobalText
                    text={'Date : ' + item.booking_date}
                    style={styles.message}
                  />
                  <Global.GlobalText
                    text={'Time : ' + item.total_hours}
                    style={styles.message}
                  />
                  <Global.GlobalText
                    text={
                      'Total Cost : ' + global.currency + ' ' + item.total_cost
                    }
                    style={styles.message}
                  />
                  <Global.GlobalText
                    text={'Child Detail :'}
                    style={styles.message}
                  />

                  <Global.GlobalText text={item.child} style={styles.message} />

                  <View style={{flexDirection: 'row'}}>
                    <Global.GlobalText
                      text={'Provide Rating :'}
                      style={styles.pinkText}
                    />
                    <View style={styles.customRatingBarStyle}>
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
                        submitReview(item.id, item.id_nanny);
                      }}
                      style={{
                        backgroundColor: Global.GlobalColor.themePink,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>
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
});
export default ReviewPage;
