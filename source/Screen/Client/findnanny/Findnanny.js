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
} from 'react-native';
import Global from '../../../Global/globalinclude';
import {scale} from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {Card} from 'native-base';
const wishlists = [1, 2, 3];
const IMG_CONTAIN = 'contain';
let bookingDatas = null,
  selectedNannys = null,
  id_nanny = [],
  childsData = [],
  selectedChild = [],
  id_childs = [],
  regualrDatas = null;
const Findnanny = ({navigation, route}) => {
  const [childData, setChildData] = useState([]);
  useEffect(() => {
    if (route.prams !== null && route.params && route.params !== undefined) {
      let data = route.params.bookingData;
      let nannyinfo = route.params.selectedNanny;
      let regularInfo = route.params.regularObj;
      if (data !== undefined && data !== null) {
        bookingDatas = data;
      }
      if (regularInfo !== undefined && regularInfo !== null) {
        regualrDatas = regularInfo;
      }

      if (nannyinfo !== undefined && nannyinfo !== null) {
        selectedNannys = nannyinfo;

        let arr = [];
        selectedNannys.forEach(element => {
          arr.push(element.id);
          id_nanny = arr;
        });
      }
    }
    getChild();
    const unsubscribe = navigation.addListener('focus', () => {
      getChild();
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const getChild = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_children')
      .then(res => {
        if (res.status) {
          childsData = res.data;
          const newArray = childsData.map(file => {
            return {...file, isChecked: false};
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
      .map(({id}) => ({
        id,
      }));
    let final_array = [];
    for (let index = 0; index < data.length; index++) {
      final_array.push(data[index]);
      selectedChild = final_array;
    }
  };
  const sendRequest = () => {
    selectedChild.forEach(element => {
      id_childs.push(element.id);
    });
    if (childsData === null) {
      Global.showError('Please add Child!');
    } else if (id_childs.length < 0) {
      Global.showError('Please select Child!');
    } else {
      // let bookingObj = {
      //   device_type: Platform.OS,
      //   booking_type: bookingDatas.booking_type.toString(),
      //   id_nanny: id_nanny.toString(),
      //   id_children: id_childs.toString(),
      //   id_address: bookingDatas.id_address,
      //   provide_date: bookingDatas.provide_date,
      //   provide_from_time: bookingDatas.provide_from_time,
      //   provide_to_time: bookingDatas.provide_to_time,
      // };
      let bookingObj = {
        device_type: Platform.OS,
        booking_type: '1',
        id_nanny: id_nanny.toString(),
        id_children: id_childs.toString(),
        id_address: bookingDatas.id_address,
        provide_date: bookingDatas.provide_date,
        provide_from_time: bookingDatas.provide_from_time,
        provide_to_time: bookingDatas.provide_to_time,
        from_date: bookingDatas.from_date,
        to_date: bookingDatas.to_date,
        available_days: bookingDatas.available,
      };
      console.log('bookingObj', bookingObj);
      global.global_loader_reff.show_loader(1);
      helper
        .UrlReqAuthPost('api/client/add_booking', 'POST', bookingObj)
        .then(res => {
          if (res.status) {
            // Global.showToast(res.message);
            global.global_loader_reff.show_loader(0);
            navigation.navigate('BookingSuccess', {msg: res.message});

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
  };
  const sendRegularRequest = () => {
    selectedChild.forEach(element => {
      id_childs.push(element.id);
    });
    if (childsData === null) {
      Global.showError('Please add Child!');
    } else if (id_childs.length < 0) {
      Global.showError('Please select Child!');
    } else {
      let regObj = {
        device_type: Platform.OS,
        booking_type: regualrDatas.booking_type.toString(),
        id_nanny: '',
        id_children: id_childs.toString(),
        id_address: regualrDatas.id_address,
        provide_date: regualrDatas.provide_date,
        provide_from_time: regualrDatas.provide_from_time,
        provide_to_time: regualrDatas.provide_to_time,
        from_date: regualrDatas.from_date,
        to_date: regualrDatas.to_date,
        available_days: regualrDatas.available,
      };
      console.log('bookingObj', regObj);
      global.global_loader_reff.show_loader(1);
      helper
        .UrlReqAuthPost('api/client/add_booking', 'POST', regObj)
        .then(res => {
          if (res.status) {
            // Global.showToast(res.message);
            global.global_loader_reff.show_loader(0);
            navigation.navigate('RegularBookingSuccess', {msg: res.message});

            selectedChild = [];
            id_childs = [];
          } else {
            Global.showError(res.message);
            global.global_loader_reff.show_loader(0);
          }
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);
        });
    }
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
        <Global.GlobalHeader
          onPress={() => {
            if (bookingDatas?.booking_type === '1') {
              navigation.navigate('Nannylist');
            } else {
              navigation.goBack(null);
            }
          }}
        />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="FIND NANNY" style={{color: 'white'}} />
            </View>
            <View style={styles.parentViewStyle}>
              <View style={styles.childView}>
                {bookingDatas !== null && (
                  <Global.GlobalText
                    text={bookingDatas.address_name}
                    style={{
                      paddingHorizontal: scale(10),
                      paddingVertical: scale(10),
                    }}
                  />
                )}
                {regualrDatas?.booking_type == '2' ? null : (
                  <>
                    <View style={styles.nannyListView}>
                      <Text style={styles.heading}>SELECTED NANNIES</Text>
                    </View>
                    {selectedNannys !== null ? (
                      <View style={styles.nannyLists}>
                        {selectedNannys.map((item, index) => {
                          let i = (index += 1);
                          return (
                            <Text style={styles.normalText}>
                              {i}.
                              {item.first_name + ' ' }
                            </Text>
                          );
                        })}
                      </View>
                    ) : null}
                  </>
                )}
                <View style={styles.nannyListView}>
                  <Text style={styles.heading}>SELECT KIDS</Text>
                </View>
                <View style={{padding: scale(20)}}>
                  {childData.map((child, index) => {
                    return (
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
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
                            {color: Global.GlobalColor.themePink},
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
                    text="SEND REQUEST"
                    style={{
                      width: '95%',
                      backgroundColor: Global.GlobalColor.themeBlue,
                      marginTop: scale(35),
                    }}
                    onPress={() => {
                      if (regualrDatas?.booking_type == '2') {
                        sendRegularRequest();
                      } else {
                        sendRequest();
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: {height: '109%', width: '100%', alignItems: 'center'},
  wishlistImg: {height: scale(65), width: scale(65)},
  starStyle: {marginHorizontal: scale(2)},
  nannyListView: {
    height: scale(40),
    backgroundColor: Global.GlobalColor.themeBlue,
  },
  heading: {
    color: 'white',
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
    paddingTop: scale(8),
    paddingLeft: scale(15),
  },
  normalText: {
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(22),
    color: Global.GlobalColor.themeBlue,
    marginVertical: scale(5),
  },
  nannyLists: {
    backgroundColor: 'white',
    borderRadius: scale(5),
    paddingHorizontal: scale(15),
    marginVertical: scale(10),
    marginHorizontal: scale(10),
    paddingVertical: scale(10),
  },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  childView: {
    backgroundColor: Global.GlobalColor.themeLightBlue,
    borderRadius: scale(10),
    paddingVertical: scale(15),
    // paddingHorizontal: scale(5)
  },
  parentViewStyle: {
    backgroundColor: Global.GlobalColor.lightPink,
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderBottomRightRadius: scale(12),
    borderBottomLeftRadius: scale(12),
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
  noPaddingVertical: {paddingVertical: 0},
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
  },
});
export default Findnanny;
