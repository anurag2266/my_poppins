/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,Dimensions,
  StatusBar,
  ScrollView,Modal,
  SafeAreaView,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import MonthPicker from 'react-native-month-year-picker';
import Global from '../../Global/globalinclude';
import { scale } from '../../Theme/Scalling';
import helper from '../../Global/Helper/helper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import moment from 'moment';
import { TimePickerModal } from 'react-native-paper-dates';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Card } from 'native-base';
import GlobalText from '../../Component/globalText';
import Fonts from '../../Theme/Fonts';
const windowWidth = Dimensions.get('window').width;
let selectMonth = '',
  availability_id = '',
  editId = '',
  selectDate = '',
  isEdit = false,
  from_hours = 0;
let DATA = [
  { name: 'January', id: 1 },
  { name: 'February', id: 2 },
  { name: 'March', id: 3 },
  { name: 'April', id: 4 },
  { name: 'May', id: 5 },
  { name: 'June', id: 6 },
  { name: 'July', id: 7 },
  { name: 'August', id: 8 },
  { name: 'September', id: 9 },
  { name: 'October', id: 10 },
  { name: 'November', id: 11 },
  { name: 'December', id: 12 },
];

let previousScreenData = null;
let year_data = []
const Avability = ({ route, navigation }) => {
  const [issetmanage, setIsSetManage] = useState(false);
  const [selctedmonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [datedata, setDateData] = useState([]);
  const [repeatDialog,setRepeatDialog] = useState(false);
  const [is_repeat,setIsRepeat] = useState(false);
  const [ManageData, setManageData] = useState([]);
  const [timeshow, setTimeShow] = useState(false);
  const [yearshow, setYearShow] = useState(false);
  const [timetoshow, setToTimeShow] = useState(false);
  const [selectindex, setSelectIndex] = useState(0);
  const [selecttimename, setSelectTimeName] = useState('');
  const [showalert, setShowAlert] = useState(false);
  const [availableDate, setAvailableDate] = useState('');
  const [isrepeatMarkAsOff,setRepeatMarkAsOff] = useState(false)
  const [fromTime, setFromTime] = useState(0);
  const [toTime, setToTime] = useState(0);
  const [dayArray,setDayArray] = useState([{ name: 'Monday', id: 1 ,checked:false},
  { name: 'Tuesday', id: 2 ,checked:false},
  { name: 'Wednesday', id: 3, checked:false },
  { name: 'Thursday', id: 4,checked:false },
  { name: 'Friday', id: 5,checked:false },
  { name: 'Saturday', id: 6 ,checked:false},
  { name: 'Sunday', id: 7 ,checked:false},
  ])
  const [markAsOff, setMarkAsOff] = useState('');
  const [canProceed, setProceed] = useState(false);
  const [monthName, setMonthName] = useState(moment().format("MMMM"));
  const [yearName, setYearName] = useState(new Date().getFullYear());
  const [otherAvailability, setOtherAvailability] = useState([]);
  useEffect(() => {
    if (route.prams !== null && route.params && route.params !== undefined) {
      let data = route.params.data;
      if (data !== undefined && data !== null) {
        previousScreenData = data;
      }
   
    }

    let year = moment().format('YY')
    let year_start = parseInt(year)
    year_data = []
    for (let index = year_start; index < 101; index++) {
      year_data.push({label:'20' + index ,id: '20' + index})
    }
    //AsyncStorage.clear();
    clearData();
    setSelectedMonth(new Date().getMonth() + 1)
    var curr_month = new Date().getMonth() + 1;
    DateApiCall(curr_month);
    GetAvailability(curr_month);
    GetStatus();
    DATA = [
      { name: 'January', id: 1 },
      { name: 'February', id: 2 },
      { name: 'March', id: 3 },
      { name: 'April', id: 4 },
      { name: 'May', id: 5 },
      { name: 'June', id: 6 },
      { name: 'July', id: 7 },
      { name: 'August', id: 8 },
      { name: 'September', id: 9 },
      { name: 'October', id: 10 },
      { name: 'November', id: 11 },
      { name: 'December', id: 12 },
    ];
    const unsubscribe = navigation.addListener('focus', () => {
      clearData();
      var today = new Date();
      let year = moment().format('YY')
      let year_start = parseInt(year)
      year_data = []
      for (let index = year_start; index < 101; index++) {
        year_data.push({label:'20' + index ,id: '20' + index})
      }

      DateApiCall(curr_month);
      GetAvailability(curr_month);
      setSelectedMonth(new Date().getMonth() + 1)
      GetStatus();
    });
    return () => {
      unsubscribe();
    };
    //GetAvailability();
  }, []);
  const clearData = () => {
    setFromTime('');
    setToTime('');
    setMarkAsOff('');
    setAvailableDate('');
    clickSetManage();
    editId = '';
    selectDate = '';
  };
  const GetStatus = () => {
    helper.UrlReqAuth('api/nanny/is_profile_complete').then(res => {
     
      setProceed(res.status);
    });
  };

  const clickDoneRepeat = () =>{
    let filterData = dayArray.filter((item) => item.checked === true)
    if(fromTime === "" || fromTime === undefined || fromTime === null){
      Global.showError('Select From Time')
    }else if(toTime === "" || toTime === undefined || toTime === null){
      Global.showError('Select To Time')
    }else if(filterData.length === 0){
      Global.showError('Select Day')
    }else{
      const some_array = [...datedata];
      some_array.forEach(element => {
        filterData.forEach(chcildelement =>{
          let month = selctedmonth.toString(),
          mydate = "",finalDate = ""
        
          if(selctedmonth.toString().length === 1){
            month = "0" + selctedmonth
         
          }
          mydate = selectedYear + "-" + month + "-" + element.date + "T00:00:00"
          if(chcildelement.name === "All"){
            finalDate =  'All'
          }else{
            finalDate = moment(mydate).format('dddd')
          }
      
       
          
          if(finalDate === chcildelement.name){
           
            element.from_time = fromTime
            element.to_time = toTime
            if(isrepeatMarkAsOff){
              element.is_mark_visible = true
            }else{
              element.is_mark_visible = false
            }
          
        }
          
        })
    
      
     });

     setDateData([...some_array]);
    }
    
      // some_array.from_time = time;
  
   
    setRepeatDialog(false)
    setIsRepeat(false)
  }

  const clickSetManage = () => {
    if (issetmanage) {
      setIsSetManage(false);
    } else {
      setIsSetManage(true);
    }
  };


  const onCheckDayClick = (index) =>{
    let array = [...dayArray]
    array[index].checked = !array[index].checked
    setDayArray([...array])
 
  }
  const GetAvailability = selectMonth => {
   
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/get_availability?month=' + selectMonth + '&id=' + '&year=' + selectedYear)
      .then(res => {
        console.log("sdsdsdsdds",res)
        if (res.status) {
          setManageData(res.data);
          // Global.showToast(res.message);
        } else {
          //Global.showError(res.message);
          setManageData([]);
        }
      })
      .catch(err => { })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const GetSingleAvailability = idEdit => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth(
        'api/nanny/get_availability?month=' + selectMonth + '&id=' + idEdit,
      )
      .then(res => {
        if (res.status) {
          setFromTime(res.data[0].from_time);
          setToTime(res.data[0].to_time);
          setMarkAsOff(res.data[0].mark_as_off);
          let str = res.data[0].available_date.toString();
          let final_date = str.substr(0, str.indexOf(' '));
          setAvailableDate(final_date);
          let oldData = datedata;
          for (let index = 0; index < oldData.length; index++) {
            const element = oldData[index];
            if (element.date === final_date) {
              element.is_mark_visible = true;
              break;
            }
          }
          setDateData([...oldData]);
        } else {
          Global.showError(res.message);
          setManageData([]);
        }
      })
      .catch(err => { })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const SaveAvability = () => {
    var today = new Date();
    let date_array = [],
      from_time_array = [],
      to_time_array = [],
      mark_as_off_array = [];
    let data = datedata.filter(item => item.is_mark_visible === true);
    for (let i = 0; i < datedata.length; i++) {
      date_array.push(
        datedata[i].date + '-' + selctedmonth + '-' + selectedYear,
      );

  
      from_time_array.push(datedata[i].from_time);

      to_time_array.push(datedata[i].to_time);
      mark_as_off_array.push(
        datedata[i].is_mark_visible === true ? 'Yes' : 'No',
      );
    }
    
    let signupObj = {
      device_type: Platform.OS,
      month: selctedmonth,
      avalability: {
        available_date: date_array,
        from_time: from_time_array,
        to_time: to_time_array,
        mark_as_off: mark_as_off_array,
      },
    };

    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/nanny/add_availability', 'POST', signupObj)
      .then(res => {
        if (res.status) {
          Global.showToast(res.message);
          global.global_loader_reff.show_loader(0);
          GetAvailability(selectMonth);
          DateApiCall(selectMonth);

          GetStatus();
        } else {
          global.global_loader_reff.show_loader(0);
          Global.showError(res.message);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const DateApiCall = month => {
    global.global_loader_reff.show_loader(1);
    let date_array = [];

    helper
      .UrlReqAuth('api/nanny/get_date?month=' + month + '&year=' + selectedYear)
      .then(res => {
      console.log("sddssdsdsdds",res)
        if (res.status) {
          global.global_loader_reff.show_loader(0);
      
          if (res.data.length > 0) {
            for (let index = 0; index < res.data.length; index++) {
              date_array.push({
                is_mark_visible:
                  res.data[index].mark_as_off === null ? true : false,
                date: res.data[index].date,
                from_time: res.data[index].from_time,
                to_time: res.data[index].to_time,
              });

              // date_array.push({
              //   is_mark_visible: false,
              //   date: res.data[index].date,
              //   from_time: '00:00',
              //   to_time: '00:00',
              // });

              global.global_loader_reff.show_loader(0);
            }

            setDateData([...date_array]);
            global.global_loader_reff.show_loader(0);
          }
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const renderMonthItem = (item) => {

    return (
      <>
        {parseInt(item.id) >= parseInt(new Date().getMonth() + 1) && parseInt(selectedYear) === parseInt(new Date().getFullYear()) ? 
        (
          <TouchableOpacity
            style={{
            borderRadius: 1,
            }}
            onPress={() => {
              setSelectedMonth(item.id);
              DateApiCall(item.id);
              setMonthName(item.name);
              selectMonth = item.id;
              // GetOtherAvailability(item.id);
            }}>
            <Global.GlobalText
              text={item.name}
              style={[
                styles.monthText,
                {
                  color:
                    selctedmonth === item.id
                      ? Global.GlobalColor.lightBlue
                      : 'white',
                },
              ]}
            />
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                height: scale(1),
              }}></View>
          </TouchableOpacity>
        ):
        (
          <View>
            {parseInt(selectedYear) !== parseInt(new Date().getFullYear()) ? (
          <TouchableOpacity
          style={{
          borderRadius: 1,
          }}
          onPress={() => {
            setSelectedMonth(item.id);
            DateApiCall(item.id);
            setMonthName(item.name);
            selectMonth = item.id;
            // GetOtherAvailability(item.id);
          }}>
          <Global.GlobalText
            text={item.name}
            style={[
              styles.monthText,
              {
                color:
                  selctedmonth === item.id 
                    ? Global.GlobalColor.lightBlue
                    : 'white',
              },
            ]}
          />
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              height: scale(1),
            }}></View>
        </TouchableOpacity>
        ) : <></>}
          </View>
        )
       
          }
    
      </>
    );
  };

  const renderYearItem = (item) =>{
    return (
      <>
       
          <TouchableOpacity
            style={{
              borderRadius: 1,
            }}
            onPress={() => {
              setSelectedYear(item.id);
              setSelectedMonth('')
              setMonthName('')
              setYearName(item.label);
             
              // GetOtherAvailability(item.id);
            }}>
            <Global.GlobalText
              text={item.label}
              style={[
                styles.monthText,
                {
                  color:
                    selectedYear.toString() === item.id
                      ? Global.GlobalColor.lightBlue
                      : 'white',
                },
              ]}
            />
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                height: scale(1),
              }}></View>
          </TouchableOpacity>
       
      </>
    );
  }

  const renderItemSelectDate = (item) => {

    return (
      <>
      {parseInt(item.id) >= parseInt(new Date().getMonth() + 1) && parseInt(selectedYear) === parseInt(new Date().getFullYear()) ? 
    (
          <TouchableOpacity
            style={{
              flex: 1,
             
            }}
            onPress={() => {
              setSelectedMonth(item.id);
              selectMonth = item.id;
              GetAvailability(selectMonth);
              setMonthName(item.name);
              DateApiCall(item.id);
            }}>
            <Global.GlobalText
              text={item.name}
              style={[
                styles.monthText,
                {
                  color:
                    selectMonth === item.id
                      ? Global.GlobalColor.lightBlue
                      : 'white',
                },
              ]}
            />
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                height: scale(1),
              }}></View>
          </TouchableOpacity>
        )
      
              : 
              (
                <View>
                  {parseInt(selectedYear) !== parseInt(new Date().getFullYear()) ? (
                <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  setSelectedMonth(item.id);
                  selectMonth = item.id;
                  GetAvailability(selectMonth);
                  setMonthName(item.name);
                  DateApiCall(item.id);
                  // GetOtherAvailability(item.id);
                }}>
                <Global.GlobalText
                  text={item.name}
                  style={[
                    styles.monthText,
                    {
                      color:
                        selctedmonth === item.id 
                          ? Global.GlobalColor.lightBlue
                          : 'white',
                    },
                  ]}
                />
                <View
                  style={{
                    width: '90%',
                    backgroundColor: 'white',
                    height: scale(1),
                  }}></View>
              </TouchableOpacity>
              ) : <></>}
                </View>
              )
             
            }
      
      </>
    );
  };

  const renderItemSelectYear = ({ item }) => {
    return (
      <>
       
          <TouchableOpacity
            style={{
              flex: 1,
             
            }}
            onPress={() => {
              setSelectedYear(item.id);
              setSelectedMonth('')
              setMonthName('')
              setYearName(item.label);
             
            }}>
            <Global.GlobalText
              text={item.label}
              style={[
                styles.monthText,
                {
                  color:
                    selectedYear.toString() === item.id
                      ? Global.GlobalColor.lightBlue
                      : 'white',
                },
              ]}
            />
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                height: scale(1),
              }}></View>
          </TouchableOpacity>
       
      </>
    );
  };
  const showAlert = id => {
    setShowAlert(true);
    availability_id = id;
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const deleteManageData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth(
        'api/nanny/delete_avalability?id=' + availability_id,
        'DELETE',
      )
      .then(res => {
        if (res.status) {
          setShowAlert(false);
          Global.showToast(res.message);
          GetAvailability(selectMonth);
          global.global_loader_reff.show_loader(0);
        } else {
          setShowAlert(false);
          Global.showError(res.message);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        setShowAlert(false);
        Global.showError(err);
        global.global_loader_reff.show_loader(0);
      });
  };
  const onDismiss = React.useCallback(() => {
    setTimeShow(false);
    setYearShow(false)
    setToTimeShow(false);
  }, [setTimeShow, setToTimeShow]);
  const onConfirm = date => {
    let time = moment(date).format('HH:mm');
    global.provide_fromTime = time
    from_hours = date.hours;
   
    if(!is_repeat){
   
      setIsRepeat(false)
      const some_array = [...datedata];
      some_array[selectindex].from_time = time;
      setDateData(some_array);
  
    }
   
    setTimeShow(false);
    setFromTime(time);
    if(is_repeat){
      setRepeatDialog(true)
    }
  };
  const onToTimeConfirm = date => {

    let time = moment(date).format('HH:mm');
    global.provide_toTime = time;

    var beginningTime = moment(global.provide_fromTime, 'h:mma');
    var endTime = moment(global.provide_toTime, 'h:mma');
    if (beginningTime.isBefore(endTime) === false) {
      Global.showError('From time must be small than To time!');
      // setToTime(moment(date).format('hh:mm A'));
      setToTimeShow(false);
      if(is_repeat){
        setRepeatDialog(true)
      }
     
    } else {
      let time = moment(date).format('HH:mm');
       
      if(!is_repeat){
        setIsRepeat(false)
        const some_array = [...datedata];
        some_array[selectindex].to_time = time;
        setDateData(some_array);
      }
   
      setToTimeShow(false);
      setToTime(time);
      if(is_repeat){
        setRepeatDialog(true)
      }
    }
  };
  const onCheckClick = index => {
    const some_array = [...datedata];
    if (some_array[index].is_mark_visible) {
      some_array[index].is_mark_visible = false;
      setMarkAsOff('No');
    } else {
      some_array[index].is_mark_visible = true;
      setMarkAsOff('Yes');
    }
    setDateData(some_array);
  };
  const clickFromTime = index => {
    setSelectIndex(index);
    setTimeout(() => {
      setTimeShow(true);
    }, 50);

   
  };
  const clickToTime = index => {
    setSelectIndex(index);
    setTimeout(() => {
      setToTimeShow(true);
    }, 50);
   
  };
  const renderDateItem = ({ item, index }) => {
  
    return (
      <View
        style={{
          flexDirection: 'row',
          aligItems: 'center',
          justifyContent: 'center',
          marginLeft: scale(10),
          marginRight: scale(10),
        }}>
        <View
          style={{
            flex: 0.7,
            alignItems: 'center',
            justifyContent: 'center',
            padding: scale(5),
            backgroundColor: index % 2 == 0 ? '#d3e4f5' : '#adccef',
          }}>
          <Global.GlobalText
            text={item.date}
            style={[
              styles.childText,
              {
                color: Global.GlobalColor.darkBlue,
              },
            ]}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: scale(5),
            backgroundColor: index % 2 == 0 ? '#d6e8fb' : '#accef4',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: scale(5),
            }}>
            <View
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Global.GlobalText
                text="FROM"
                style={{
                  fontSize: scale(12),
                  color: Global.GlobalColor.darkBlue,
                }}
              />
            </View>
            <View
              style={{
                width: '70%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                // disabled={item.is_mark_visible}
                onPress={() => {
                  if (item.is_mark_visible) {
                    Global.showError('Please Select Mark As Off');
                  } else {
                    clickFromTime(index);
                  }
                }}
                style={{
                  backgroundColor: item.is_mark_visible
                    ? '#eee'
                    : Global.GlobalColor.lightBlue,
                  borderWidth: 1,
                  borderColor: Global.GlobalColor.themeBlue,
                  boderRadius: scale(2),
                  height: scale(20),
                  width: scale(50),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Global.GlobalText
                  text={item.from_time}
                  style={[styles.timeText]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: scale(5) }}>
            <View
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Global.GlobalText
                text="To"
                style={{
                  fontSize: scale(12),
                  color: Global.GlobalColor.darkBlue,
                }}
              />
            </View>
            <View
              style={{
                width: '70%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                // disabled={item.is_mark_visible}
                onPress={() => {
                  if (item.is_mark_visible) {
                    Global.showError('Please Select Mark As Off');
                  } else {
                    clickToTime(index);
                  }
                }}
                style={{
                  borderWidth: 1,
                  borderColor: Global.GlobalColor.themeBlue,
                  boderRadius: scale(5),
                  justifyContent: 'center',
                  height: scale(20),
                  width: scale(50),
                  alignItems: 'center',
                  backgroundColor: item.is_mark_visible
                    ? '#eee'
                    : Global.GlobalColor.lightBlue,
                }}>
                <Global.GlobalText
                  text={item.to_time}
                  style={styles.timeText}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: index % 2 == 0 ? '#d3e4f5' : '#adccef',
          }}>
          <CheckBox
            style={{
              flex: 1,
              borderColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            tintColor="red"
            onFillColor="red"
            checkBoxColor={Global.GlobalColor.themeBlue}
            checkedCheckBoxColor={Global.GlobalColor.darkBlue}
            onClick={() => {
              onCheckClick(index);
            }}
            isChecked={item.is_mark_visible}
          />
        </View>
      </View>
    );
  };
  const EditItem = (idEdit, date) => {
    clearData();
    editId = idEdit;
    selectDate = date;
    GetSingleAvailability(idEdit);
    if (selectMonth !== '') {
      isEdit = true;
      clickSetManage();
    }
  };
  const EditAvailability = () => {
    global.global_loader_reff.show_loader(1);
    let editobj = {
      id: editId,
      available_date: selectDate,
      from_time: fromTime,
      to_time: toTime,
      mark_as_off: markAsOff,
    };
    isEdit = false;

    helper
      .UrlReqAuthPost('api/nanny/edit_availability', 'POST', editobj)
      .then(res => {
        if (res.status) {
          // setProceed(true);
          Global.showToast(res.message);
          GetAvailability(selectMonth);
          clearData();
          global.global_loader_reff.show_loader(0);
        } else {
          Global.showError(res.message);
          clickSetManage();
          clearData();
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const renderManageItem = ({ item, index }) => {
    let display_index = index + 1;
    if (display_index < 10) {
      display_index = '0' + display_index;
    } else {
      display_index = display_index;
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          aligItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: scale(5),
            backgroundColor: index % 2 == 0 ? '#d3e4f5' : '#adccef',
          }}>
          <Global.GlobalText text={display_index} style={styles.childText} />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: scale(5),
            backgroundColor: index % 2 == 0 ? '#d3e4f5' : '#adccef',
          }}>
          <Global.GlobalText
            text={item.available_date}
            style={styles.childText}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: index % 2 == 0 ? '#d3e4f5' : '#adccef',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              EditItem(item.id, item.available_date);
            }}>
            <Image
              source={Global.GlobalAssets.editIcon}
              style={{
                height: scale(20),
                width: scale(20),
                marginLeft: scale(10),
              }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showAlert(item.id);
            }}>
            <Image
              source={Global.GlobalAssets.deleteIcon}
              style={{
                height: scale(20),
                width: scale(20),
                marginLeft: scale(10),
              }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
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
      <View>
        <View>
          <Global.GlobalHeader onPress={() => navigation.goBack()} />
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText
                text="AVAILABILITY"
                style={styles.avalabilityText}
              />
            </View>
            <View
              style={{
                borderRadius: scale(7),
                backgroundColor:
                  issetmanage === true
                    ? Global.GlobalColor.themeLightBlue
                    : Global.GlobalColor.themeLightBlue,
                marginTop: scale(20),
                marginLeft: scale(10),
                marginRight: scale(10),
              }}>
              <View style={{ marginBottom: scale(0) }}>
                <View style={{ flexDirection: 'row', height: scale(40) }}>
                  <TouchableOpacity
                    style={[
                      styles.setView,
                      {
                        borderTopStartRadius: scale(5),
                        borderTopEndRadius: scale(5),
                        backgroundColor:
                          issetmanage === true
                            ? Global.GlobalColor.themeLightBlue
                            : Global.GlobalColor.lightPink,
                      },
                    ]}
                    onPress={() => {
                      GetStatus(), clickSetManage();
                    }}>
                    <Global.GlobalText
                      text="SET AVALABILITY"
                      style={styles.setText}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.setView,
                      {
                        borderTopStartRadius: scale(5),
                        borderTopEndRadius: scale(5),
                        backgroundColor:
                          issetmanage === true
                            ? Global.GlobalColor.lightPink
                            : Global.GlobalColor.themeLightBlue,
                      },
                    ]}
                    onPress={() => {
                      GetStatus(),
                        clickSetManage(),
                        GetAvailability(selectMonth);
                    }}>
                    <Global.GlobalText text="MANAGE" style={styles.setText} />
                  </TouchableOpacity>
                </View>
                {issetmanage ? (
                  <View>
                  
                    <View style={{ padding: scale(10),flexDirection:'row',justifyContent:'space-between' }}>
                    <View style={styles.mainMonthView}>
                      <View style={styles.selectMonthMain}>
                      <TouchableOpacity style={styles.slectmonthView}>
                            <Global.GlobalText
                              text={
                                yearName === '' ? 'SELECT YEAR' : yearName
                              }
                              style={styles.selectMonthtext}
                            />
                            <AntDesign
                              name="down"
                              size={15}
                              color={Global.GlobalColor.themeBlue}
                              style={{ paddingStart: scale(5) }}
                            />
                          </TouchableOpacity>

                              </View>
                              <View style={styles.monthView}>
                          <ScrollView>
                            {year_data.map((item, index) => {

                              return (
                                <View style={{ width: "100%" }}>
                                  {renderYearItem(item)}
                                </View>

                              )
                            })
                            }
                          </ScrollView>
                          {/* <FlatList                            
                            data={[1,2,3,4,5,6,7,8,9,10,11,12]}
                            style={{ width: '100%',flex:1 }}
                            renderItem={renderMonthItem}                            
                            // key={item => item.id}
                            // keyExtractor={item => item.id}
                          /> */}
                        </View>
                              </View>
                      <View style={styles.mainMonthView}>
                        <View style={styles.selectMonthMain}>
                       

                          <TouchableOpacity style={styles.slectmonthView}>
                            <Global.GlobalText
                              text={
                                monthName === '' ? 'SELECT MONTH' : monthName
                              }
                              style={styles.selectMonthtext}
                            />
                            <AntDesign
                              name="down"
                              size={15}
                              color={Global.GlobalColor.themeBlue}
                              style={{ paddingStart: scale(5) }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.monthView}>
                          <ScrollView>
                            {DATA.map((item, index) => {

                              return (
                                <View style={{ width: "100%" }}>
                                  {renderMonthItem(item)}
                                </View>

                              )
                            })
                            }
                          </ScrollView>
                          {/* <FlatList                            
                            data={[1,2,3,4,5,6,7,8,9,10,11,12]}
                            style={{ width: '100%',flex:1 }}
                            renderItem={renderMonthItem}                            
                            // key={item => item.id}
                            // keyExtractor={item => item.id}
                          /> */}
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity style={{backgroundColor:Global.GlobalColor.themeBlue,paddingVertical:scale(10),marginBottom:scale(5),marginHorizontal:scale(10),alignItems:'center'}}
                    onPress={() => { 
                      setIsRepeat(true)
                     
                      setRepeatDialog(true)}}>
                      <Text style={{color:'white',fontFamily:Global.GlobalFont.Bold}}>Repeat</Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        backgroundColor: Global.GlobalColor.themeBlue,
                        marginLeft: scale(10),
                        marginRight: scale(10),
                        borderTopStartRadius: scale(5),
                        borderTopEndRadius: scale(5),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          aligItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            flex: 0.7,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Global.GlobalText
                            text="DATE"
                            style={styles.dateText}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Global.GlobalText
                            text="TIMING"
                            style={styles.dateText}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Global.GlobalText
                            text="MARK AS OFF"
                            style={styles.dateText}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={{ height: scale(150) }}>
                      {datedata.length > 0 ? (
                        <FlatList
                          data={datedata}
                          style={{ width: '100%', height: '45%' }}
                          renderItem={renderDateItem}
                          keyExtractor={item => item.id}
                          vertical
                        />
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={{ padding: scale(10) ,flexDirection:'row',justifyContent:'space-between' }}>

                         <View style={[styles.mainMonthView]}>

               
                        <View style={styles.selectMonthMain}>
                          <TouchableOpacity style={styles.slectmonthView}>
                            <Global.GlobalText
                              text={
                                yearName === '' ? 'SELECT YEAR' : yearName
                              }
                              style={styles.selectMonthtext}
                            />
                            <AntDesign
                              name="down"
                              size={15}
                              color={Global.GlobalColor.themeBlue}
                              style={{ paddingStart: scale(5) }}
                            />
                          </TouchableOpacity>
                      
                        </View>

                        


                        <View style={styles.monthView}>
                          <FlatList
                            data={year_data}
                            style={{ width: '100%' }}
                            renderItem={renderItemSelectYear}
                            keyExtractor={item => item.id}
                          />
                        </View>
                        {/* <View style={{height: scale(100)}}>
                    <ScrollView>
                      {DATA.map(item => {
                        return (
                          <View>
                            <Global.GlobalText
                              text={item.name}
                              style={styles.monthText}
                            />
                            <View
                              style={{
                                width: '90%',
                                backgroundColor: 'white',
                                height: scale(1),
                              }}></View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View> */}
                      </View>
                      <View style={[styles.mainMonthView]}>

               
                        <View style={styles.selectMonthMain}>
                          <TouchableOpacity style={styles.slectmonthView}>
                            <Global.GlobalText
                              text={
                                monthName === '' ? 'SELECT MONTH' : monthName
                              }
                              style={styles.selectMonthtext}
                            />
                            <AntDesign
                              name="down"
                              size={15}
                              color={Global.GlobalColor.themeBlue}
                              style={{ paddingStart: scale(5) }}
                            />
                          </TouchableOpacity>
                      
                        </View>

                        
                       

                        <View style={styles.monthView}>
                        <ScrollView>
                            {DATA.map((item, index) => {

                              return (
                                <View style={{ width: "100%" }}>
                                  {renderItemSelectDate(item)}
                                </View>

                              )
                            })
                            }
                          </ScrollView>
                        </View>
                        {/* <View style={{height: scale(100)}}>
                    <ScrollView>
                      {DATA.map(item => {
                        return (
                          <View>
                            <Global.GlobalText
                              text={item.name}
                              style={styles.monthText}
                            />
                            <View
                              style={{
                                width: '90%',
                                backgroundColor: 'white',
                                height: scale(1),
                              }}></View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View> */}
                      </View>
                    </View>
                    <View
                      style={{
                        backgroundColor: Global.GlobalColor.themeBlue,
                        borderTopStartRadius: scale(5),
                        borderTopEndRadius: scale(5),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          aligItems: 'flex-start',
                          // justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Global.GlobalText
                            text="S.No"
                            style={styles.dateText}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Global.GlobalText
                            text="DAYS MARKED AS OFF"
                            style={[styles.dateText, { fontSize: scale(10) }]}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Global.GlobalText
                            text="OPTIONS"
                            style={styles.dateText}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={{ height: scale(150) }}>
                      {ManageData.length > 0 ? (
                        <FlatList
                          data={ManageData}
                          style={{ width: '100%', height: '45%' }}
                          renderItem={renderManageItem}
                          keyExtractor={item => item.id}
                          vertical
                        />
                      ) : null}
                    </View>
                    {/* <View
                      style={{
                        marginTop: scale(8),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Global.GlobalButton
                        text={'EDIT'}
                        onPress={() => {
                          EditAvailability();
                        }}
                        style={{height: scale(60), width: scale(180)}}
                      />
                    </View> */}
                  </View>
                )}

                
                <View
                  style={{
                    marginTop: scale(8),
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                  <Global.GlobalButton
                    text={'SAVE'}
                    textStyle={{ fontSize: 15 }}
                    onPress={() => {
                      if (isEdit) {
                        EditAvailability();
                      } else {
                        SaveAvability();
                      }
                    }}
                    style={{
                      height: scale(40),
                      width: '48%',
                    }}
                  />
                  {canProceed && (
                    <>
                      {previousScreenData !== null ? (
                        <Global.GlobalButton
                          text={'Proceed'}
                          onPress={() => {
                            navigation.navigate('ProfileConfirmation', {
                              data: previousScreenData,
                            });
                          }}
                          textStyle={{ fontSize: 15 }}
                          style={{
                            height: scale(40),
                            width: '48%',
                          }}
                        />
                      ) : null}
                    </>
                  )}
                </View>
              </View>
            </View>
          </Card>
          {/* {timeshow && (
            <TimePickerModal
              visible={timeshow}
              onDismiss={onDismiss}
              onConfirm={onConfirm}
              label="" // optional, default 'Select time'
              cancelLabel="Cancel" // optional, default: 'Cancel'
              confirmLabel="Ok" // optional, default: 'Ok'
              animationType="fade" // optional, default is 'none'
              locale={'en'}
            />
          )} */}
          {timeshow && (
            <DateTimePicker
              isVisible={timeshow}
              onCancel={onDismiss}
              mode="time"
              is24Hour={true}
              onConfirm={onConfirm}
            />
          )}
            {yearshow && (
              <DateTimePicker
              isVisible={yearshow}
              minimumDate={new Date().getFullYear()}
            />
          )}
          {timetoshow && (
            <DateTimePicker
              isVisible={timetoshow}
              onCancel={onDismiss}
              mode="time"
              is24Hour={true}
              onConfirm={onToTimeConfirm}
            />
          )}
          {/* {timetoshow && (
            <TimePickerModal
              visible={timetoshow}
              onDismiss={onDismiss}
              onConfirm={onToTimeConfirm}
              label="" // optional, default 'Select time'
              cancelLabel="Cancel" // optional, default: 'Cancel'
              confirmLabel="Ok" // optional, default: 'Ok'
              animationType="fade" // optional, default is 'none'
              locale={'en'}
            />
          )} */}
        </View>
      </View>
        {repeatDialog && (
      <Modal
          animationType={'slide'}
          transparent={true}
          onRequestClose={() => {
            setIsRepeat(false)
           setRepeatDialog(false)
          }}
          hardwareAccelerated={true}
          visible={repeatDialog}>
          <View style={styles.parentView}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: scale(10),
            }}>
            <View
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Global.GlobalText
                text="FROM TIME :"
                style={{
                  fontSize: scale(15),
                  color: Global.GlobalColor.darkBlue,
                }}
              />
            </View>
              <View
              style={{
                width: '70%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                // disabled={item.is_mark_visible}
                onPress={() => {
                    setRepeatDialog(false)
                    clickFromTime();
                  
                }}
                style={{
                  backgroundColor: Global.GlobalColor.lightBlue,
                  borderWidth: 1,
                  borderColor: Global.GlobalColor.themeBlue,
                  boderRadius: scale(2),
                  height: scale(30),
                  width: scale(100),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Global.GlobalText
                 text={fromTime ? fromTime : 'Select Time'}
                 
                  style={[styles.timeText]}
                />
              </TouchableOpacity>
            </View>
                </View>

                <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: scale(10),
            }}>
            <View
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Global.GlobalText
                text="TO TIME :"
                style={{
                  fontSize: scale(15),
                  color: Global.GlobalColor.darkBlue,
                }}
              />
            </View>
              <View
              style={{
                width: '70%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                // disabled={item.is_mark_visible}
                onPress={() => {
                  
                    setRepeatDialog(false)
                    clickToTime();
                  
                }}
                style={{
                  backgroundColor: Global.GlobalColor.lightBlue,
                  borderWidth: 1,
                  borderColor: Global.GlobalColor.themeBlue,
                  boderRadius: scale(2),
                  height: scale(30),
                  width: scale(100),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Global.GlobalText
                  text={toTime ? toTime : 'Select Time'}
                  style={[styles.timeText]}
                />
              </TouchableOpacity>
            </View>
                </View>
               
              <View style={{marginTop:scale(10),alignSelf:'flex-start',marginLeft:scale(20)}}>
              <Global.GlobalText text={'Select Day'} style={{fontSize:scale(14),fontFamily:Fonts.Bold}}/>
                {dayArray.map((item,index) => { 
                  return(
                  <View style={{alignItems:'center',marginTop:scale(5),flexDirection:'row'}}>
                       <CheckBox
                        style={{
                       
                          borderColor: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        tintColor="red"
                        onFillColor="red"
                        checkBoxColor={Global.GlobalColor.themeBlue}
                        checkedCheckBoxColor={Global.GlobalColor.darkBlue}
                        onClick={() => {
                          onCheckDayClick(index);
                        }}
                        isChecked={item.checked}
                      />
                    <Global.GlobalText text={item.name} style={{fontSize:scale(14)}}/>
                    </View>
                  )
                }
                )}
              </View>
              <View style={{alignItems:'center',marginTop:scale(5),flexDirection:'row'}}>
                       <CheckBox
                        style={{
                       
                          borderColor: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        tintColor="red"
                        onFillColor="red"
                        checkBoxColor={Global.GlobalColor.themeBlue}
                        checkedCheckBoxColor={Global.GlobalColor.darkBlue}
                        onClick={() => {
                          setRepeatMarkAsOff(!isrepeatMarkAsOff)
                        }}
                        isChecked={isrepeatMarkAsOff}
                      />
                    <Global.GlobalText text={'Mark As Off'} style={{fontSize:scale(14)}}/>
                    </View>

                <Global.GlobalButton
                onPress={() => clickDoneRepeat()}
                 text="ok" style={{height:scale(35),width:'45%',marginTop:scale(25)}}/>
              <TouchableOpacity
               onPress={() => {
                setIsRepeat(false)
                setRepeatDialog(false)
              }}
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -2,
                    backgroundColor: Global.GlobalColor.themePink,
                    borderRadius: scale(18),
                    padding: scale(10),
                  }}>
               
                    <AntDesign name={'close'} size={20} color={'white'} />
                  </TouchableOpacity>
              
                </View>
                </View>
                </View>
                </Modal>
        )}
      <AwesomeAlert
        show={showalert}
        showProgress={false}
        title="Delete Confirmation"
        message="Are you sure want to Delete this Record?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideAlert();
        }}
        onConfirmPressed={() => {
          deleteManageData();
        }}
        messageStyle={{ fontFamily: Global.GlobalFont.Bold, color: '#000' }}
        confirmButtonTextStyle={{ fontFamily: Global.GlobalFont.Bold }}
        contentStyle={{ fontFamily: Global.GlobalFont.Bold }}
        cancelButtonTextStyle={{ fontFamily: Global.GlobalFont.Bold }}
        titleStyle={{
          fontFamily: Global.GlobalFont.Bold,
          color: Global.GlobalColor.darkBlue,
        }}
      />
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  selectMonthtext: {
    fontSize: scale(14),
  },
  parentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#000000b2',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalView: {
    width: windowWidth - 70,
    backgroundColor: 'white',
    borderRadius: scale(12),
    paddingTop: scale(20),
    paddingBottom: scale(15),
    paddingLeft: scale(10),
    paddingRight: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    height: scale(400),
  },
  timeText: {
    fontSize: scale(12),
  },
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
  selectMonthMain: {
    backgroundColor: 'white',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderBottomEndRadius: scale(8),
    borderBottomStartRadius: scale(8),
    borderColor: Global.GlobalColor.themeBlue,
    borderRadius: scale(8),
    width: scale(120),
  },
  mainMonthView: {
    alignSelf: 'flex-end',
    borderTopStartRadius: scale(8),
    borderTopEndRadius: scale(8),
    backgroundColor: Global.GlobalColor.themeBlue,
    borderBottomEndRadius: scale(8),
    borderBottomStartRadius: scale(8),
  },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.lightPink,
    width: scale(300),
    marginTop: scale(10),
  },
  monthView: {

    height: scale(75),
  },
  setView: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avalabilityText: {
    color: 'white',
  },
  setText: {
    fontSize: scale(17),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(20),
  },
  dateText: {
    fontSize: scale(12),
    color: 'white',
    padding: scale(10),
  },
  childText: {
    fontSize: scale(12),
    color: Global.GlobalColor.themeBlue,
    padding: scale(15),
  },
  cardHeader: {
    backgroundColor: Global.GlobalColor.themeBlue,
    padding: scale(10),
    borderTopStartRadius: scale(15),
    borderTopEndRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Avability;
// If You Are Avalilable in Rest of the day then Please select Your Time!
