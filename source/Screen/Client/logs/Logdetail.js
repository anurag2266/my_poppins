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
  TextInput, FlatList
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';


const ITMES = [1, 2, 3, 4];
const IMG_CONTAIN = 'contain';
let id_log = '';
const OptionComponent = ({ item }) => {
  return (
    <>
      {
        item == '1' ?
          <View style={styles.radioBtn} >
            <TouchableOpacity style={styles.radioActive}>
              <View style={styles.radioActiveInnerView}>
              </View>
            </TouchableOpacity>
            <Global.GlobalText text={'Ate Well'} style={styles.radioText} />
          </View> : null
      }
      {
        item == '2' ?
          <View style={styles.radioBtn} >
            <TouchableOpacity style={styles.radioActive}>
              <View style={styles.radioActiveInnerView}>
              </View>
            </TouchableOpacity>
            <Global.GlobalText text={'Ate less than usual'} style={styles.radioText} />
          </View> : null
      }
      {
        item == '3' ?
          <View style={styles.radioBtn} >
            <TouchableOpacity style={styles.radioActive}>
              <View style={styles.radioActiveInnerView}>
              </View>
            </TouchableOpacity>
            <Global.GlobalText text={"Wasn't hungry"} style={styles.radioText} />
          </View> : null
      }
    </>
  )
}
const Logdetail = ({ navigation, route }) => {
  id_log = route.params.id_log
  const [moodId, setMoodId] = useState('')
  const [specialThings, setSpecialThings] = useState('')
  const [neededItems, setNeededItems] = useState('')
  const [noteforParents, setNoteForParents] = useState('')
  const [activities, setActivities] = useState('')
  const [catName, setCatName] = useState('');
  const [logData, setLogData] = useState([])
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
  useEffect(() => {
    getLogData()
    const unsubscribe = navigation.addListener('focus', () => {
      getLogData();
    });
    return () => unsubscribe()
  }, []);
  const getLogData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_logs?id=' + id_log)
      .then(res => {
        console.log("api/client/get_logs?id=' + id_log",'api/client/get_logs?id=' + id_log)
        if (res.status) {
          if (res.data !== null) {
            setLogData(res.data);
            setMoodId(res.data[0].moods ? res.data[0].moods.moods : '')
            setActivities(res.data[0].activity_detail ? res.data[0].activity_detail.activities : 'No Data')
            setNoteForParents(res.data[0].for_parents ? res.data[0].for_parents.parents_note : 'No Data')
            setNeededItems(res.data[0].for_parents ? res.data[0].for_parents.needs_item : 'No Data')
            setSpecialThings(res.data[0].special_things_happened ? res.data[0].special_things_happened.description : 'No Data')
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
  const moodItems = (item) => {
    return (
      <View
        style={{
          marginVertical: scale(5),
          marginHorizontal: scale(4),
          flex: 1,
          flexWrap: "wrap"
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
        </View>
      </View>
    )
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
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="Logs" style={{ color: 'white' }} />
            </View>
            <View style={styles.parentView}>
              <View style={[styles.inputView]}>
                {logData.length > 0 ? (
                  <View>
                    {logData.map((item) => {
                      return (
                        <View
                          style={{
                            paddingHorizontal: scale(15),
                            marginBottom: scale(20),
                          }}>
                          <View style={styles.rowView} >
                            <Text style={styles.label}>
                              Name of the Child :
                              <Text style={styles.value}> {item.child}</Text>
                            </Text>
                          </View>
                          <View style={styles.rowView}>
                            <Text style={styles.label}>
                              To : <Text style={styles.value}>{item.log_time}</Text>
                            </Text>
                          </View>
                          <View style={styles.rowView}>
                            <Text style={styles.label}>
                              Date : <Text style={styles.value}>{item.booking_date}</Text>
                            </Text>
                          </View>
                        </View>
                      )
                    })}
                  </View>
                ) : null}
                {
                  cat.map((item, index) => {
                    return (
                      <>
                        <TouchableOpacity style={[styles.lunchView, index === 5 ? { borderBottomLeftRadius: scale(5), borderBottomRightRadius: scale(5), marginBottom: scale(0) } : { borderRadius: 0 }]} onPress={() => {
                          if (item.visible === false) {
                            setCatName(item.catName)
                            cat.forEach((e) => {
                              if (e.catName === item.catName) {
                                e.visible = true;
                              }
                            })
                          } else {
                            setCatName("")
                            cat.forEach((e) => {
                              if (e.catName === item.catName) {
                                e.visible = false;
                              }
                            })
                          }
                        }}>
                          <Text style={styles.catText}>{item.catName}</Text>
                          {
                            catName == item.catName ?
                              <Image source={Global.GlobalAssets.up} style={styles.upArrosImage} resizeMode="contain" />
                              :
                              <Image source={Global.GlobalAssets.down} style={styles.upArrosImage} resizeMode="contain" />
                          }
                        </TouchableOpacity>
                        {
                          catName === item.catName ?
                            (() => {
                              if (catName === 'MEALS - FEEDING') {
                                return (
                                  <>
                                    {logData[0].meals_feeding.map((item) => {
                                      return (
                                        <>

                                          <View style={styles.parentOfContent}>
                                            <Text style={[styles.lunchTitle, { color: Global.GlobalColor.lightBlackColor, marginBottom: scale(3) }]}>BREAKFAST : </Text>
                                            {item.breakfast.time !== '00:00' ? (
                                              <Text style={styles.lunchTitle}>Breakfast time - {item.breakfast.time}</Text>
                                            ) : null}
                                            {item.breakfast.what_they_at_title ? (
                                              <Text style={styles.lunchTitle}>What they ate - {item.breakfast.what_they_at_title}</Text>
                                            ) : null}
                                            <OptionComponent item={item.breakfast.what_they_at} />
                                          </View>
                                          <View style={styles.parentOfContent}>
                                            <Text style={[styles.lunchTitle, { color: Global.GlobalColor.lightBlackColor, marginBottom: scale(3) }]}>LUNCH : </Text>
                                            {item.lunch.time !== '00:00' ? (
                                              <Text style={styles.lunchTitle}>Breakfast time - {item.breakfast.time}</Text>
                                            ) : null}
                                            {item.lunch.what_they_at_title ? (
                                              <Text style={styles.lunchTitle}>What they ate - {item.lunch.what_they_at_title}</Text>
                                            ) : null}
                                            <OptionComponent item={item.lunch.what_they_at} />
                                          </View>
                                          <View style={styles.parentOfContent}>
                                            <Text style={[styles.lunchTitle, { color: Global.GlobalColor.lightBlackColor, marginBottom: scale(3) }]}>DINNER : </Text>
                                            {item.snacks.time !== '00:00' ? (
                                              <Text style={styles.lunchTitle}>Dinner time - {item.snacks.time}</Text>
                                            ) : null}
                                            {item.snacks.what_they_at_title ? (
                                              <Text style={styles.lunchTitle}>What they ate - {item.snacks.what_they_at_title}</Text>
                                            ) : null}
                                            {item.snacks.what_they_at ? (
                                              <OptionComponent item={item.snacks.what_they_at} />
                                            ) : null}
                                          </View>
                                        </>
                                      )
                                    })}
                                  </>
                                )
                              } else if (item.catName === "NAPS") {
                                return (
                                  <>
                                    {logData[0].naps !== null ? (
                                      <>
                                        <View style={{ alignItems: "center", paddingHorizontal: scale(20), paddingVertical: scale(10), flexDirection: "row", backgroundColor: Global.GlobalColor.themeLightBlue }}>
                                          <Text style={styles.catText}>Bed Time : </Text>
                                          <Text style={styles.catText}> {logData[0].naps[0].bad_time ? logData[0].naps[0].bad_time : 'no data'}</Text>
                                        </View>
                                        {logData[0].naps.map((nap) => {
                                          return (
                                            <>


                                              {nap.from_time && nap.to_time ? (
                                                <>
                                                  <View style={{ padding: scale(10), backgroundColor: Global.GlobalColor.themeLightBlue }}>
                                                    <View style={[styles.TimeStyle, { marginVertical: scale(1) }]}>
                                                      <View
                                                        style={styles.row}>
                                                        <Global.GlobalText
                                                          style={styles.dateTimeText}
                                                          text={nap.from_time ? nap.from_time : null}
                                                        />
                                                        <Image
                                                          source={Global.GlobalAssets.clockBlue}
                                                          style={styles.textinput_imageView}
                                                        />
                                                      </View>
                                                      <View>
                                                        <Global.GlobalText
                                                          text={'To'}
                                                          style={styles.to}
                                                        />
                                                      </View>
                                                      <View
                                                        style={styles.row}>
                                                        <Global.GlobalText
                                                          style={styles.dateTimeText}
                                                          text={nap.to_time ? nap.to_time : null}
                                                        />
                                                        <Image
                                                          source={Global.GlobalAssets.clockBlue}
                                                          style={styles.textinput_imageView}
                                                        />
                                                      </View>
                                                    </View>
                                                  </View>
                                                </>
                                              ) : null}
                                            </>
                                          )
                                        })}
                                      </>
                                    ) : (
                                      <View style={{ alignSelf: "center", paddingVertical: scale(10) }}>
                                        <Text style={styles.titleText}>No data</Text>
                                      </View>
                                    )}
                                  </>
                                )
                              } else if (item.catName === "POTTY") {
                                return (
                                  <>
                                    {logData[0].potty !== null ? (
                                      <>
                                        {logData[0].potty.map((pottyItem) => {
                                          return (
                                            <>
                                              {pottyItem.time || pottyItem.no ? (
                                                <View style={{ padding: scale(15), backgroundColor: Global.GlobalColor.themeLightBlue }}>
                                                  <View style={[styles.TimeStyle]}>
                                                    <View
                                                      style={styles.row}>
                                                      <Global.GlobalText
                                                        style={styles.dateTimeText}
                                                        text={pottyItem.time}
                                                      />
                                                      <Image
                                                        source={Global.GlobalAssets.clockBlue}
                                                        style={styles.textinput_imageView}
                                                      />
                                                    </View>
                                                    {pottyItem.no ? (
                                                      <TextInput
                                                        editable={false}
                                                        placeholder={pottyItem.no}
                                                        style={styles.textInputStyles}
                                                        placeholderTextColor={Global.GlobalColor.themeBlue}
                                                      />
                                                    ) : null}
                                                  </View>
                                                </View>
                                              ) : null}
                                            </>
                                          )
                                        })}
                                      </>
                                    ) : (
                                      <View style={{ alignSelf: "center", paddingVertical: scale(10) }}>
                                        <Text style={styles.titleText}>No data</Text>
                                      </View>
                                    )}
                                  </>
                                )
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
                                      editable={false}
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
                                      editable={false}
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
                                      editable={false}
                                    />
                                    <TextInput
                                      style={styles.textInputThings}
                                      onChangeText={text => setNeededItems(text)}
                                      value={neededItems}
                                      multiline={true}
                                      numberOfLines={5}
                                      placeholder={'ENTER NEEDED ITEMS HERE'}
                                      placeholderTextColor={Global.GlobalColor.lightBlue}
                                      editable={false}
                                    />
                                  </View>
                                );
                              }
                            })()
                            :
                            null
                        }
                      </>
                    )
                  })
                }
              </View>
            </View>
          </Card>
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
    paddingVertical: scale(1),
    paddingHorizontal: scale(2),
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
    fontSize: scale(18),
    color: Global.GlobalColor.themeBlue,
    borderWidth: 2,
    borderColor: Global.GlobalColor.themeLightBlue,
    paddingHorizontal: scale(10),
    padding: 5,
    textAlign: 'center',
    width: scale(50),
    marginRight: scale(5)
  },
  TimeStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#bcd8f6',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingLeft: scale(15),
    height: scale(35),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(-10),
  },
  radioActive: {
    height: scale(18),
    width: scale(18),
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
    marginTop: scale(10), fontFamily: Global.GlobalFont.Regular
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
    height: scale(18),
    width: scale(18),
  },
  lunchTitle: {
    color: Global.GlobalColor.themePink,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
  },
  radioText: {
    textTransform: 'none',
    marginLeft: scale(10),
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18)
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
    height: scale(100),
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
