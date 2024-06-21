import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,Platform,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TextInput, FlatList, Dimensions
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import { Card } from 'native-base';
import { TimePickerModal } from 'react-native-paper-dates';
import DateTimePicker from 'react-native-modal-datetime-picker';

let breakFastTime = '00:00',
  lunchTime = '00:00',
  snacksTime = '00:00',
  bookId = '';
const Logdetail = ({ navigation, route }) => {
  bookId = route.params.bookId
  useEffect(() => {
    getBookingData()
    getChildData()
    const unsubscribe = navigation.addListener('focus', () => {
      getBookingData();
      getChildData()
    });
    return () => unsubscribe()
  }, []);
  const [childData, setChildData] = useState([]);
  const [addressVisible, setAddressVisible] = useState(true);
  const [breakfastId, setBreakFastId] = useState('');
  const [lunchId, setLunchId] = useState('');
  const [snacksId, setSnacksId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [childId, setChildId] = useState('')
  const [childName, setChildName] = useState('')
  const [timeshow, setTimeShow] = useState(false);
  const [timetoshow, setToTimeShow] = useState(false);
  const [badtimeShow, setBadTimeShow] = useState(false)
  const [breakFastDetail, setBreakFastDetail] = useState('')
  const [lunchDetail, setLunchDetail] = useState('')
  const [snacksDetail, setSnacksDetail] = useState('')
  const [ateName, setAteName] = useState('')
  const [fromIndex, setFromIndex] = useState('')
  const [toIndex, setToIndex] = useState('')
  const [startIndex, setStartIndex] = useState('')
  const [moodId, setMoodId] = useState('')
  const [specialThings, setSpecialThings] = useState('')
  const [neededItems, setNeededItems] = useState('')
  const [noteforParents, setNoteForParents] = useState('')
  const [activities, setActivities] = useState('')
  const [isShowBreakfast, setIsShowBreakfast] = useState(false)
  const [isShowLunch, setIsShowLunch] = useState(false)
  const [isShowSnacks, setIsShowSnacks] = useState(false)
  const [badTime, setBadTime] = useState('00')
  const [napsData, setNapsData] = useState([
    { from_time: '00:00', to_time: '00:00' },
  ]);
  const [pottyData, setPottyData] = useState([
    { start_time: '00:00', detail: '' },
  ]);
  const [data, setData] = useState([
    {
      id: '1',
      name: 'Ate Well',
    },
    {
      id: '2',
      name: 'Ate less than usual',
    },
    {
      id: '3',
      name: "Wasn't hungry",
    },
  ]);
  const [cat, setCat] = useState([
    {
      catName: 'MEALS - FEEDING',
      visible: false,
    },
    {
      catName: 'NAPS',
      visible: false,
    },
    {
      catName: 'POTTY',
      visible: false,
    },
    {
      catName: 'MOODS',
      visible: false,
    },
    {
      catName: 'ACTIVITIES',
      visible: false,
    },
    {
      catName: 'SPECIAL THINGS HAPPENED',
      visible: false,
    },
    {
      catName: 'FOR PARENTS',
      visible: false,
    },

  ]);
  const [moodData, setMoodData] = useState([
    {
      id: '1',
      name: 'Quiet'
    },
    {
      id: '2',
      name: 'Sad'
    },
    {
      id: '3',
      name: 'Mischievous'
    },
    {
      id: '4',
      name: 'Happy'
    },
    {
      id: '5',
      name: 'Tired'
    },
    {
      id: '6',
      name: 'Enthusiastic'
    },
  ])
  const [catName, setCatName] = useState('');
  const [bookingData, setBookingData] = useState([])
  const onDismiss = React.useCallback(() => {
    setTimeShow(false);
    setToTimeShow(false);
  }, [setTimeShow, setToTimeShow]);
  const onConfirm = (date) => {
    setTimeShow(false);
    // if (ateName === 'badtime') {
    //   let time = moment(date).format('hh:mm A');
    //   setBadTime(time)
    // }
    if (catName === 'MEALS - FEEDING') {
      if (ateName === 'breakfast') {
        let time = moment(date).format('hh:mm A');
        breakFastTime = time
      }
      else if (ateName === 'lunch') {
        let time = moment(date).format('hh:mm A');
        lunchTime = time
      }
      else if (ateName === 'snacks') {
        let time = moment(date).format('hh:mm A');
        snacksTime = time
      } else {
      }
    }
    else if (catName === 'POTTY') {
      let startIndexPotty = startIndex;
      let value = pottyData[startIndexPotty].detail
      let time = moment(date).format('hh:mm A');
      handlePotty(startIndexPotty, time, value)
    }
    else if (catName === 'NAPS') {
      let indexFrom = fromIndex
      let from = moment(date).format('hh:mm A');
      let to = napsData[indexFrom].to_time;
      handleNaps(from, to, indexFrom)

    } else {

    }
  };
  const onToTimeConfirm = date => {

    let indexTo = toIndex
    let from = napsData[indexTo].from_time;
    let to = moment(date).format('hh:mm A');
    setToTimeShow(false);
    handleNaps(from, to, indexTo)
  };
  const clickFromTime = (index) => {
    setTimeout(() => {
      setFromIndex(index)
      setStartIndex(index)
      setTimeShow(true);
    }, 50);
  };
  const clickToTime = (index) => {
    setTimeout(() => {
      setToIndex(index)
      setToTimeShow(true);
    }, 50);
  };
  const onDismissBadTime = React.useCallback(() => {
    setBadTimeShow(false)
  }, [setBadTimeShow]);
  const onConfirmBadTime = date => {

    let time = moment(date).format('hh:mm A');
    setBadTime(time)
    setBadTimeShow(false);

  };
  const clickBadTime = () => {
    setTimeout(() => {

      setBadTimeShow(true);
    }, 50);
  }
  const handleNaps = (from, to, index) => {

    const naps_array = [...napsData];
    naps_array[index].from_time = from;
    naps_array[index].to_time = to;
    setNapsData(naps_array);

  };
  const handlePotty = (index, time, value,) => {

    const potty_array = [...pottyData];
    potty_array[index].start_time = time;
    potty_array[index].detail = value;
    setPottyData(potty_array);

  };
  const AddNapsItem = () => {
    // if (napsData.length === 6) {
    // } else {
    setNapsData([...napsData, { from_time: '00:00', to_time: '00:00' }]);
    // }
  };
  const AddPottyItem = () => {
    // if (pottyData.length === 6) {
    // } else {
    setPottyData([...pottyData, { start_time: '00:00', detail: '' }]);
    // }
  };
  const napsItems = (item, index) => {
    return (
      <View
        style={{
          padding: scale(15),
          backgroundColor:
            Global.GlobalColor.themeLightBlue,
        }}>
        <View
          style={[
            styles.TimeStyle,
            { marginVertical: scale(5) },
          ]}>
          <TouchableOpacity
            onPress={() => {
              clickFromTime(index)
            }}
            style={styles.row}>
            <Global.GlobalText
              style={styles.provideTimeText}
              text={item.from_time}
            />
            <Image
              source={Global.GlobalAssets.clockBlue}
              style={styles.textinput_imageView}
            />
          </TouchableOpacity>
          <View>
            <Global.GlobalText
              text={'To'}
              style={styles.to}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              clickToTime(index)
            }}
            style={styles.row}>
            <Global.GlobalText
              style={styles.provideTimeText}
              text={item.to_time}
            />
            <Image
              source={Global.GlobalAssets.clockBlue}
              style={styles.textinput_imageView}
            />
          </TouchableOpacity>
        </View>
        {index === 0 ? null : (
          <View style={{ position: 'absolute', right: scale(10), top: scale(5) }}>
            <TouchableOpacity onPress={() => {
              deleteNaps(index)
            }}
              style={{ backgroundColor: Global.GlobalColor.themeLightBlue, borderRadius: scale(15), padding: scale(2), borderWidth: 1, borderColor: Global.GlobalColor.borderColor }}
            >
              <Global.AntDesign name="close" size={scale(18)} color={Global.GlobalColor.themePink} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  const deleteNaps = index => {
    if (napsData.length === 1) {
      Global.showError('You can not remove the current section');
    } else {
      let data = [...napsData];
      data.splice(index, 1);
      setNapsData(data);

    }
  };
  const pottyItems = (item, index) => {
    return (
      <View
        style={{
          padding: scale(15),
          backgroundColor:
            Global.GlobalColor.themeLightBlue,
        }}>
        <View style={[styles.TimeStyle]}>
          <TouchableOpacity
            onPress={() => {

              clickFromTime(index)
            }}
            style={styles.row}>
            <Global.GlobalText
              style={styles.dateTimeText}
              text={item.start_time}
            />
            <Image
              source={Global.GlobalAssets.clockBlue}
              style={styles.textinput_imageView}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="#1"
            style={[styles.textInputStyles,{width:'50%'}]}
            placeholderTextColor={
              Global.GlobalColor.themeBlue
            }
            value={item.detail}
            onChangeText={(value) => {
              handlePotty(index, item.start_time, value,)
            }}
          />
        </View>
        {index === 0 ? null : (
          <View style={{ position: 'absolute', right: scale(10), top: scale(5) }}>
            <TouchableOpacity onPress={() => {
              deletePotty(index)
            }}
              style={{ backgroundColor: Global.GlobalColor.themeLightBlue, borderRadius: scale(15), padding: scale(2), borderWidth: 1, borderColor: Global.GlobalColor.borderColor }}
            >
              <Global.AntDesign name="close" size={scale(18)} color={Global.GlobalColor.themePink} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  const deletePotty = index => {
    if (pottyData.length === 1) {
      Global.showError('You can not remove the current section');
    } else {
      let data = [...pottyData];
      data.splice(index, 1);
      setPottyData(data);
    }
  };
  const getChildData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/remaining_children_log?id=' + bookId)
      .then(res => {
        console.log("DATAAAA",res)
        if (res.status) {
          if (res.data !== null) {

            if (res.data !== null) {
              if (res.data.length === 1) {
                setChildId(res.data[0].id)
                let childsData = res.data;
                const newArray = childsData.map((c) => {
                  return { label: c.name, value: c.name, id: c.id };
                });

                setChildData(newArray);
              } else {
                let childsData = res.data;
                const newArray = childsData.map((c) => {
                  return { label: c.name, value: c.name, id: c.id };
                });

                setChildData(newArray);
              }
            }
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
  const getBookingData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/checkin_list?id=' + bookId)
      .then(res => {

        if (res.status) {
          if (res.data !== null) {
            setBookingData(res.data);
            setBookingId(res.data[0].id)

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
  const moodItems = (item) => {
    return (
      <View
        style={{
          marginVertical: scale(5),
          marginHorizontal: scale(4),
          flex: 1,
          flexWrap: "wrap"
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setMoodId(item.item.id)
          }}
        >
          {item.item.id === moodId ? (
            <Image
              source={Global.GlobalAssets.radioActiveBlue}
              style={{
                height: scale(16),
                width: scale(16),
              }}
            />
          ) : (
            <Image
              source={Global.GlobalAssets.radio}
              style={{
                height: scale(16),
                width: scale(16),
              }}
            />
          )}
          <Global.GlobalText
            text={item.item.name}
            style={{
              fontSize: scale(14),
              textTransform: 'none',
              marginLeft: scale(5),
              flexWrap: "wrap"
            }} />
        </TouchableOpacity>
      </View>
    )
  }
  const onSendLog = () => {
    let mealsFeedingBreakfast = [];
    let mealsFeedingLunch = [];
    let mealsFeedingSnacks = [];
    mealsFeedingBreakfast.push(breakFastTime, breakFastDetail, breakfastId)
    mealsFeedingLunch.push(lunchTime, lunchDetail, lunchId)
    mealsFeedingSnacks.push(snacksTime, snacksDetail, snacksId)
    // if (mealsFeedingBreakfast === '["00:00", "", ""]' && mealsFeedingLunch === '["00:00", "", ""]' && mealsFeedingSnacks === '["00:00", "", ""]' &&
    //   moodId === '' && specialThings === '' && noteforParents === '' && neededItems === '' && napsData === '[{"from_time": "00:00", "to_time": "00:00"}]' && pottyData === '[{"detail": "", "start_time": "00:00"}]'
    // ) {

    if (mealsFeedingBreakfast[0] === '00:00' && mealsFeedingLunch[0] === '00:00' && mealsFeedingSnacks[0] === '00:00' && moodId === '' && specialThings === '' && noteforParents === '' && neededItems === '' && napsData[0].from_time === '00:00' && napsData[0].to_time === '00:00' && pottyData[0].start_time === '00:00' && activities === '') {
      Global.showError('Please At Least One Detail Fill!')
    } else if (ateName === 'breakfast') {
      if (breakFastTime === '00:00' || breakfastId === '' || breakFastDetail === '') {

        Global.showError('Please Fill All Breakfast Detail')
      } else {

        sendFinalLog()
      }
    }
    else if (ateName === 'lunch') {
      if (lunchTime === '00:00' || lunchId === '' || lunchTime === '') {

        Global.showError('Please Fill All Lunch Detail')
      } else {

        sendFinalLog()
      }
    } else if (ateName === 'snacks') {
      if (snacksTime === '00:00' || snacksId === '' || snacksDetail === '') {

        Global.showError('Please Fill All Dinner Detail')
      } else {

        sendFinalLog()
      }
    }
    else {
      sendFinalLog()
    }
  }
  const sendFinalLog = () => {
    let mealsFeedingBreakfast = [];
    let mealsFeedingLunch = [];
    let mealsFeedingSnacks = [];
    let napsFromTime = [];
    let napsToTime = [];
    let pottyDetail = [];
    let pottyTime = [];
    mealsFeedingBreakfast.push(breakFastTime, breakFastDetail, breakfastId)
    mealsFeedingLunch.push(lunchTime, lunchDetail, lunchId)
    mealsFeedingSnacks.push(snacksTime, snacksDetail, snacksId)

    napsData.forEach(element => {
      napsFromTime.push(element.from_time)
      napsToTime.push(element.to_time)
    });
    pottyData.forEach(element => {
      pottyDetail.push(element.detail)
      pottyTime.push(element.start_time)
    });
    let logObj = {
      id_booking: bookId,
      id_children: childId,
      log_details: {
        type: [1, 2, 3, 4, 5, 6, 7],
        meals_feeding:
        {
          breakfast: mealsFeedingBreakfast,
          lunch: mealsFeedingLunch,
          snacks: mealsFeedingSnacks
        },
        naps: {
          bad_time: badTime,
          from_time: napsFromTime,
          to_time: napsToTime
        },
        potty: {
          no: pottyDetail,
          time: pottyTime
        },
        moods: moodId,
        special_things_happened: specialThings,
        for_parents: {
          parents_note: noteforParents, needs_item: neededItems
        },
        activities: activities,
      }
    }

    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/nanny/add_log', 'POST', logObj)
      .then(res => {

        if (res.status) {
          Global.showToast(res.message)
          breakFastTime = '00:00';
          setBreakFastDetail('')
          setBreakFastId('')
          lunchTime = '00:00';
          setLunchDetail('')
          setLunchId('')
          snacksTime = '00:00';
          setSnacksDetail('')
          setSnacksId('')
          setActivities('')
          setNoteForParents('')
          setNeededItems('')
          setSpecialThings('')
          setMoodId('')
          setNapsData([
            { from_time: '00:00', to_time: '00:00' },
          ]);
          setPottyData([
            { start_time: '00:00', detail: '' },
          ]);
          navigation.goBack()
          global.global_loader_reff.show_loader(0);
        } else {

          Global.showError(res.message)
          global.global_loader_reff.show_loader(0);
        }
      })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });

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
        <Global.GlobalHeader onPress={() => navigation.goBack()} />
        <View style={[styles.baseView]}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="Logs" style={{ color: 'white' }} />
            </View>
            <View style={[styles.parentView]}>
              <View style={[styles.inputView]}>
                {bookingData.length > 0 ? (
                  <View style={{...Platform.select({ ios: { zIndex: 10 } })}}>
                    {bookingData.map((item) => {
                      return (
                        <View
                          style={{
                            paddingHorizontal: scale(15),
                            marginBottom: scale(20),
                           
                          }}>
                          <View style={{...Platform.select({ ios: { zIndex: 5 } })}} >
                            {childData.length > 0 ? (
                              <>
                                {childData.length === 1 ? (
                                  <View>
                                    <View style={styles.rowView} >
                                      <Text style={styles.label}>
                                        Name of the Child :
                                        <Text style={styles.label}>
                                          &nbsp;{childData[0].value}
                                        </Text>
                                      </Text>
                                    </View>
                                  </View>
                                ) : (
                                 
                                    <View style={[styles.rowView,
                                  
                                ]} >
                                      <Text style={styles.label}>
                                        Name of the Child :
                                      </Text>
                                  
                                      <DropDownPicker
                                        items={childData}
                                        value={childName}
                                        containerStyle={{
                                          width: scale(110),
                                          alignSelf: 'center',
                                        }}
                                        dropDownMaxHeight={100}
                                        itemStyle={{
                                          justifyContent: 'flex-start',
                                          height:scale(30)
                                        }}
                                        style={styles.dropStyle}
                                        labelStyle={{
                                          color: Global.GlobalColor.themePink,
                                          fontFamily: Global.GlobalFont.Regular,
                                          fontSize: scale(15),
                                        }}
                                        activeLabelStyle={{
                                          color: Global.GlobalColor.themePink,
                                          fontFamily: Global.GlobalFont.Regular,
                                          fontSize: scale(15),
                                        }}
                                        onChangeItem={item => {
                                          setChildId(item.id);
                                          setChildName(item.name)
                                        }}
                                        placeholder={'Select child'}
                                        placeholderStyle={{
                                          fontFamily: Global.GlobalFont.Regular,
                                          color: '#FFD2D6', fontSize: scale(18),
                                        }}
                                        arrowStyle={{ marginTop: scale(-5) }}
                                        arrowColor={Global.GlobalColor.themePink}
                                      />
                                     
                                    </View>
                                 
                                )}
                              </>
                            ) : null}
                          </View>
                          {item.booking_type === 1 ? (

                            <View style={{ marginTop: scale(5) }}>
                              <Text style={styles.label}>
                                To : <Text style={styles.value}>{item.from_time} - {item.to_time}&nbsp;&nbsp;&nbsp;</Text>
                              </Text>
                            </View>
                          ) : null}
                          {item.booking_type === 1 ? (

                            <View>
                              <Text style={styles.label}>
                                Date : <Text style={styles.value}>{item.booking_date}</Text>
                              </Text>
                            </View>
                          ) : (
                            <View>
                              <Text style={styles.label}>
                                Date : <Text style={styles.value}>{item.from_date} To {item.to_date}</Text>
                              </Text>
                            </View>
                          )}
                        </View>
                      )
                    })}
                  </View>
                ) : null}
                {cat.map((item, index) => {
                  return (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.lunchView,
                          index === 5
                            ? {
                              borderBottomLeftRadius: scale(5),
                              borderBottomRightRadius: scale(5),
                              marginBottom: 0,
                            }
                            : { borderRadius: 0 },
                        ]}
                        onPress={() => {
                          if (item.visible === false) {
                            setCatName(item.catName);
                            cat.forEach(e => {
                              if (e.catName === item.catName) {
                                e.visible = true;
                              }
                            });
                          } else {
                            setCatName('');
                            cat.forEach(e => {
                              if (e.catName === item.catName) {
                                e.visible = false;
                              }
                            });
                          }
                        }}>
                        <Text style={styles.catText}>{item.catName}</Text>
                        {catName == item.catName ? (
                          <Image
                            source={Global.GlobalAssets.up}
                            style={styles.upArrosImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <Image
                            source={Global.GlobalAssets.down}
                            style={styles.upArrosImage}
                            resizeMode="contain"
                          />
                        )}
                      </TouchableOpacity>
                      {catName === item.catName
                        ? (() => {
                          if (catName === 'MEALS - FEEDING') {
                            return (
                              <View style={styles.parentOfContent}>
                                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                  <TouchableOpacity onPress={() => {
                                    if (!isShowBreakfast) {
                                      setAteName('');

                                    } else {
                                      setAteName('breakfast');
                                      clickFromTime();
                                    }
                                  }} style={styles.baseOfTitle}>
                                    <Text style={styles.lunchTitle}>
                                      BREAKFAST
                                      {isShowBreakfast ? (
                                        <Text style={[styles.lunchTitle, { fontSize: scale(18) }]}>
                                          &nbsp;-&nbsp;{breakFastTime}
                                        </Text>
                                      ) : null}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      if (!isShowBreakfast) {
                                        setAteName('breakfast');
                                        setIsShowBreakfast(!isShowBreakfast);
                                      } else {
                                        setAteName('');
                                        setIsShowBreakfast(!isShowBreakfast);
                                        breakFastTime = '00:00';
                                        setBreakFastDetail('')
                                        setBreakFastId('')
                                      }
                                    }}
                                    style={{ alignItems: "center", marginTop: scale(5), padding: scale(5) }}>
                                    <Image source={!isShowBreakfast ? Global.GlobalAssets.down : Global.GlobalAssets.closeIcon} style={{ height: scale(15), width: scale(15), resizeMode: "contain" }} />
                                  </TouchableOpacity>
                                </View>
                                {isShowBreakfast ? (
                                  <View>
                                    <View style={{ flexDirection: "row" }}>
                                      <Global.GlobalText
                                        text="What they ate : "
                                        style={styles.titleText}
                                      />
                                      <TextInput
                                        placeholder="Enter Here"
                                        style={styles.inputStyle}
                                        onChangeText={(val) => {
                                          setBreakFastDetail(val)
                                        }}
                                        value={breakFastDetail}
                                        placeholderTextColor={
                                          '#00000080'
                                        }
                                      />
                                    </View>
                                    {data.map(item => {
                                      return (
                                        <TouchableOpacity
                                          style={styles.radioBtn}
                                          onPress={() => {
                                            setBreakFastId(item.id)
                                          }}>
                                          {item.id === breakfastId ? (
                                            <TouchableOpacity
                                              style={styles.radioActive}>
                                              <View
                                                style={
                                                  styles.radioActiveInnerView
                                                }
                                              />
                                            </TouchableOpacity>
                                          ) : (
                                            <Image
                                              source={Global.GlobalAssets.radio}
                                              style={styles.radioIMg}
                                            />
                                          )}
                                          <Global.GlobalText
                                            text={item.name}
                                            style={styles.radioText}
                                          />
                                        </TouchableOpacity>
                                      );
                                    })}
                                  </View>
                                ) : null}
                                <View style={styles.lines}></View>
                                <View>
                                  <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => {
                                      if (isShowLunch) {
                                        setAteName('lunch');
                                        clickFromTime();
                                      }
                                    }} style={styles.baseOfTitle}>
                                      <Text style={styles.lunchTitle}>
                                        LUNCH
                                        {isShowLunch ? (
                                          <Text style={[styles.lunchTitle, { fontSize: scale(18) }]}>
                                            &nbsp;-&nbsp; {lunchTime}
                                          </Text>
                                        ) : null}
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (!isShowLunch) {
                                          setAteName('lunch');
                                          setIsShowLunch(!isShowLunch)
                                        } else {
                                          setAteName('');
                                          setIsShowLunch(!isShowLunch)
                                          lunchTime = '00:00';
                                          setLunchDetail('')
                                          setLunchId('')
                                        }
                                      }}
                                      style={{ alignItems: "center", marginTop: scale(5), padding: scale(5) }}>
                                      <Image source={!isShowLunch ? Global.GlobalAssets.down : Global.GlobalAssets.closeIcon} style={{ height: scale(15), width: scale(15), resizeMode: "contain" }} />
                                    </TouchableOpacity>
                                  </View>
                                  {isShowLunch ? (
                                    <View>
                                      <View style={{ flexDirection: "row" }}>
                                        <Global.GlobalText
                                          text="What they ate : "
                                          style={styles.titleText}
                                        />
                                        <TextInput
                                          placeholder="Enter Here"
                                          style={styles.inputStyle}
                                          placeholderTextColor={
                                            '#00000080'
                                          }
                                          onChangeText={(val) => {
                                            setLunchDetail(val)
                                          }}
                                          value={lunchDetail}
                                        />
                                      </View>
                                      {
                                        data.map(item => {
                                          return (
                                            <TouchableOpacity
                                              style={styles.radioBtn}
                                              onPress={() => {
                                                setLunchId(item.id);
                                              }}>
                                              {item.id === lunchId ? (
                                                <TouchableOpacity
                                                  style={styles.radioActive}>
                                                  <View
                                                    style={
                                                      styles.radioActiveInnerView
                                                    }></View>
                                                </TouchableOpacity>
                                              ) : (
                                                <Image
                                                  source={Global.GlobalAssets.radio}
                                                  style={styles.radioIMg}
                                                />
                                              )}
                                              <Global.GlobalText
                                                text={item.name}
                                                style={styles.radioText}
                                              />
                                            </TouchableOpacity>
                                          );
                                        })
                                      }
                                    </View>
                                  ) : null}
                                </View>
                                <View style={styles.lines}></View>
                                <View>
                                  <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => {
                                      if (isShowSnacks) {
                                        setAteName('snacks');
                                        clickFromTime();
                                      }
                                    }} style={styles.baseOfTitle}>
                                      <Text style={styles.lunchTitle}>
                                        DINNER
                                        {isShowSnacks ? (
                                          <Text style={[styles.lunchTitle, { fontSize: scale(18) }]}>
                                            &nbsp;-&nbsp;{snacksTime}
                                          </Text>
                                        ) : null}
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (!isShowSnacks) {
                                          setAteName('snacks');
                                          setIsShowSnacks(!isShowSnacks)
                                        } else {
                                          setAteName('');
                                          setIsShowSnacks(!isShowSnacks)
                                          snacksTime = '00:00';
                                          setSnacksDetail('')
                                          setSnacksId('')
                                        }
                                      }}
                                      style={{ alignItems: "center", marginTop: scale(5), padding: scale(5) }}>
                                      <Image source={!isShowSnacks ? Global.GlobalAssets.down : Global.GlobalAssets.closeIcon} style={{ height: scale(15), width: scale(15), resizeMode: "contain" }} />
                                    </TouchableOpacity>
                                  </View>
                                  {isShowSnacks ? (
                                    <View>
                                      <View style={{ flexDirection: "row" }}>
                                        <Global.GlobalText
                                          text="What they ate : "
                                          style={styles.titleText}
                                        />
                                        <TextInput
                                          placeholder="Enter Here"
                                          style={styles.inputStyle}
                                          placeholderTextColor={
                                            '#00000080'
                                          }
                                          onChangeText={(val) => {
                                            setSnacksDetail(val)
                                          }}
                                          value={snacksDetail}
                                        />
                                      </View>
                                      {
                                        data.map(item => {
                                          return (
                                            <TouchableOpacity
                                              style={styles.radioBtn}
                                              onPress={() => {
                                                setSnacksId(item.id);
                                              }}>
                                              {item.id === snacksId ? (
                                                <TouchableOpacity
                                                  style={styles.radioActive}>
                                                  <View
                                                    style={
                                                      styles.radioActiveInnerView
                                                    }></View>
                                                </TouchableOpacity>
                                              ) : (
                                                <Image
                                                  source={Global.GlobalAssets.radio}
                                                  style={styles.radioIMg}
                                                />
                                              )}
                                              <Global.GlobalText
                                                text={item.name}
                                                style={styles.radioText}
                                              />
                                            </TouchableOpacity>
                                          );
                                        })
                                      }
                                    </View>
                                  ) : null}
                                </View>
                              </View>
                            );
                          } else if (item.catName === 'NAPS') {
                            return (
                              <View style={{ backgroundColor: Global.GlobalColor.themeLightBlue }}>
                                <View style={{ alignItems: "center", paddingHorizontal: scale(20), paddingVertical: scale(10), flexDirection: "row" }}>
                                  <Text style={styles.catText}>Bed Time : </Text>
                                  <TouchableOpacity

                                    onPress={() => {

                                      clickBadTime()
                                    }}
                                    style={[styles.row, { marginTop: 4 }]}>
                                    <Global.GlobalText
                                      style={styles.provideTimeText}
                                      text={badTime}
                                    />
                                    <Image
                                      source={Global.GlobalAssets.clockBlue}
                                      style={styles.textinput_imageView}
                                    />
                                  </TouchableOpacity>
                                </View>
                                {napsData.map((item, index) => {
                                  return napsItems(item, index);
                                })}
                                {/* {napsData.length !== 6 ? ( */}
                                <TouchableOpacity
                                  style={styles.addMoreBase}
                                  onPress={() => AddNapsItem()}>
                                  <View style={{ flexDirection: "row" }}>
                                    <Global.AntDesign name="plus" size={scale(22)} color={Global.GlobalColor.themePink} />
                                    <Global.GlobalText
                                      text="Add More"
                                      style={{
                                        fontSize: scale(18),
                                        textTransform: 'none',
                                        marginLeft: scale(3),
                                      }} />
                                  </View>
                                </TouchableOpacity>
                                {/* ) : null} */}
                              </View>
                            );
                          } else if (item.catName === 'POTTY') {
                            return (
                              <>
                                <View style={{ backgroundColor: Global.GlobalColor.themeLightBlue }}>
                                  {pottyData.map((item, index) => {
                                    return pottyItems(item, index);
                                  })}
                                  {/* {pottyData.length !== 6 ? ( */}
                                  <TouchableOpacity
                                    style={styles.addMoreBase}
                                    onPress={() => AddPottyItem()}>
                                    <View style={{ flexDirection: "row" }}>
                                      <Global.AntDesign name="plus" size={scale(22)} color={Global.GlobalColor.themePink} />
                                      <Global.GlobalText
                                        text="Add More"
                                        style={{
                                          fontSize: scale(18),
                                          textTransform: 'none',
                                          marginLeft: scale(3),
                                        }} />
                                    </View>
                                  </TouchableOpacity>
                                  {/* ) : null} */}
                                </View>
                              </>
                            );
                          } else if (item.catName === 'MOODS') {
                            return (
                              <FlatList
                                data={moodData}
                                renderItem={moodItems}
                                keyExtractor={(item) => item.id}
                                horizontal={false}
                                numColumns={3}
                                style={{
                                  backgroundColor:
                                    Global.GlobalColor.themeLightBlue,
                                  paddingHorizontal: scale(0),
                                }}
                              />
                            );
                          } else if (item.catName === 'ACTIVITIES') {
                            return (
                              <View style={{ backgroundColor: Global.GlobalColor.themeLightBlue }}>
                                <TextInput
                                  style={styles.textInputThings}
                                  onChangeText={text => setActivities(text)}
                                  value={activities}
                                  multiline={true}
                                  numberOfLines={5}
                                  placeholder={'ENTER TEXT HERE'}
                                  placeholderTextColor={Global.GlobalColor.lightBlue}
                                />
                              </View>
                            );
                          } else if (item.catName === 'SPECIAL THINGS HAPPENED') {
                            return (
                              <View style={{ backgroundColor: Global.GlobalColor.themeLightBlue, marginTop: scale(1) }}>
                                <TextInput
                                  style={styles.textInputThings}
                                  onChangeText={text => setSpecialThings(text)}
                                  value={specialThings}
                                  multiline={true}
                                  numberOfLines={5}
                                  placeholder={'ENTER TEXT HERE'}
                                  placeholderTextColor={Global.GlobalColor.lightBlue}
                                />
                              </View>
                            );
                          }
                          else if (item.catName === 'FOR PARENTS') {
                            return (
                              <View style={{ backgroundColor: Global.GlobalColor.themeLightBlue, marginTop: scale(1) }}>
                                <TextInput
                                  style={styles.textInputThings}
                                  onChangeText={text => setNoteForParents(text)}
                                  value={noteforParents}
                                  multiline={true}
                                  numberOfLines={5}
                                  placeholder={'ENTER NOTES FOR PARENTS HERE'}
                                  placeholderTextColor={Global.GlobalColor.lightBlue}
                                />
                                <TextInput
                                  style={styles.textInputThings}
                                  onChangeText={text => setNeededItems(text)}
                                  value={neededItems}
                                  multiline={true}
                                  numberOfLines={5}
                                  placeholder={'ENTER NEEDED ITEMS HERE'}
                                  placeholderTextColor={Global.GlobalColor.lightBlue}
                                />
                              </View>
                            );
                          }
                        })()
                        : null}
                    </>
                  );
                })}
              </View>
            </View>
            {/* {timeshow && (
              <TimePickerModal
                visible={timeshow}
                onDismiss={onDismiss}
                onConfirm={onConfirm}
                hours={12} // default: current hours
                minutes={14} // default: current minutes
                label="" // optional, default 'Select time'
                cancelLabel="Cancel" // optional, default: 'Cancel'
                confirmLabel="Ok" // optional, default: 'Ok'
                animationType="fade" // optional, default is 'none'
                locale={'en'}
              />
            )}*/}
            {timeshow && (
              <DateTimePicker
                isVisible={timeshow}
                onCancel={onDismiss}
                mode="time"
                onConfirm={onConfirm}
              />
            )}
            {badtimeShow && (
              <DateTimePicker
                isVisible={badtimeShow}
                onCancel={onDismissBadTime}
                mode="time"
                onConfirm={onConfirmBadTime}
              />
            )}
            {/* {badtimeShow && (
              <TimePickerModal
                visible={badtimeShow}
                onDismiss={onDismissBadTime}
                onConfirm={onConfirmBadTime}
                hours={12} // default: current hours
                minutes={14} // default: current minutes
                label="" // optional, default 'Select time'
                cancelLabel="Cancel" // optional, default: 'Cancel'
                confirmLabel="Ok" // optional, default: 'Ok'
                animationType="fade" // optional, default is 'none'
                locale={'en'}
              />
            )} */}
            {timetoshow && (
              <DateTimePicker
                isVisible={timetoshow}
                onCancel={onDismiss}
                mode="time"
                onConfirm={onToTimeConfirm}
              />
            )}
            {/* {timetoshow && (
              <TimePickerModal
                visible={timetoshow}
                onDismiss={onDismiss}
                onConfirm={onToTimeConfirm}
                hours={12} // default: current hours
                minutes={14} // default: current minutes
                label="" // optional, default 'Select time'
                cancelLabel="Cancel" // optional, default: 'Cancel'
                confirmLabel="Ok" // optional, default: 'Ok'
                animationType="fade" // optional, default is 'none'
                locale={'en'}
              />
            )} */}
          </Card>
        </View>
        <View style={{ marginTop: scale(15), alignSelf: "center" }}>
          <Global.GlobalButton
            text={'Send Log'}
            onPress={() => {
              onSendLog()
            }}
          />
        </View>
      </ScrollView>
    </ImageBackground >
  );
};
const styles = StyleSheet.create({
  slectmonthView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    padding: scale(10),
  },
  monthText: {
    paddingTop: scale(4),
    paddingBottom: scale(4),
    color: 'white',
    fontSize: scale(15),
    paddingStart: scale(10),
  },
  monthView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    height: scale(75),
  },
  dropStyle: {
    backgroundColor: 'white',
    height: scale(35),
    width: scale(110),
    marginVertical: scale(1),
    alignSelf: 'center',
    borderColor: '#bcd8f6',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
  },
  label: {
    color: Global.GlobalColor.themePink,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
  },
  parentOfContent: {
    backgroundColor: Global.GlobalColor.themeLightBlue,
    padding: scale(20),
    marginBottom: scale(-15),
  },
  to: {
    fontSize: scale(18),
    marginLeft: scale(-16),
    backgroundColor: Global.GlobalColor.themeBlue,
    color: 'white',
    padding: scale(5),
    borderRadius: scale(5),
  },
  provideTimeText: {
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(16),
  },
  textinput_imageView: {
    height: scale(18),
    width: scale(18),
    marginEnd: '2%',
    marginLeft: '5%',
    marginRight: scale(1),
  },
  row: { flexDirection: 'row', alignItems: "center" },
  radioActiveInnerView: {
    height: scale(14),
    width: scale(14),
    backgroundColor: Global.GlobalColor.themeBlue,
    borderRadius: scale(15),
    padding: scale(3),
  },
  inputView: {
    backgroundColor: 'white',
    paddingVertical: scale(4),
    borderRadius: scale(5),
  },
  parentView: {
    backgroundColor: Global.GlobalColor.lightPink,
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderBottomLeftRadius: scale(15),
    borderBottomRightRadius: scale(15)
  },
  value: {
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(16),
  },
  textInputStyles: {
    borderRadius: scale(5),
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(25),
    color: Global.GlobalColor.themeBlue,
    borderWidth: 2,
    borderColor: Global.GlobalColor.themeLightBlue,
    paddingHorizontal: scale(10),
    padding: 7,
    textAlign: 'center',
    width: scale(120),
    marginRight: scale(5)
  },
  TimeStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#bcd8f6',
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingLeft: scale(15),
    height: scale(65),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: scale(10),
  },
  radioActive: {
    height: scale(20),
    width: scale(20),
    borderRadius: scale(20),
    borderColor: Global.GlobalColor.themeBlue,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(5),
  },
  lines: {
    height: scale(2),
    backgroundColor: Global.GlobalColor.themePink,
    marginVertical: scale(10),
  },
  catText: {
    fontFamily: Global.GlobalFont.Regular,
    color: Global.GlobalColor.themeBlue,
    fontSize: scale(20),
  },
  lunchView: {
    backgroundColor: Global.GlobalColor.lightBlue,
    height: scale(45),
    alignContent: 'center',
    paddingTop: scale(8),
    paddingLeft: scale(20),
    marginTop: scale(3),
  },
  titleText: {
    color: Global.GlobalColor.themePink,
    fontSize: scale(18),
    marginTop: scale(10),
  },
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  wishlistImg: { height: scale(65), width: scale(65) },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  eye: {
    backgroundColor: Global.GlobalColor.themePink,
    height: scale(25),
    width: scale(25),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: scale(5),
    position: 'absolute',
    right: scale(15),
    top: scale(45),
  },
  dateTimeText: {
    color: Global.GlobalColor.darkBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(20),
  },
  upArrosImage: {
    position: 'absolute',
    right: 10,
    top: 18,
    height: scale(12),
    width: scale(12),
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
  rowView: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: scale(5),
    alignItems: "center"
  },
  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(2),
  },
  radioIMg: {
    height: scale(20),
    width: scale(20),
  },
  lunchTitle: {
    color: 'white',
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(20),
    textAlign: "center"
  },
  radioText: {
    textTransform: 'none',
    marginLeft: scale(10),
    fontFamily: Global.GlobalFont.Regular,
  },
  addMoreBase: {
    marginVertical: scale(5),
    height: scale(30),
    borderRadius: scale(10),
    alignSelf: 'flex-end',
    marginRight: scale(10)
  },
  inputStyle: {
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
    color: Global.GlobalColor.themeBlue,
    borderBottomWidth: 2,
    borderColor: Global.GlobalColor.themePink,
    paddingHorizontal: scale(5),
    padding: 0,
    textAlign: 'center',
    width: scale(80),
    marginVertical: scale(5)
  },
  baseOfTitle: {
    backgroundColor: Global.GlobalColor.themePink,
    paddingHorizontal: scale(4),
    paddingVertical: scale(3),
    width: scale(160)
  },
  textInputThings: {
    width: scale(230),
    margin: scale(10),
    height: scale(110),
    borderRadius: scale(5),
    backgroundColor: '#fff',
    borderStyle: 'solid',
    paddingHorizontal: scale(10),
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
    textAlignVertical: 'top',
    alignSelf: "center"
  },
});
export default Logdetail;
