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
  BackHandler,
  Platform,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
import { TimePickerModal } from 'react-native-paper-dates';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CheckBox from 'react-native-check-box'
import helpers from '../../../Global/Helper/helper';
// let options = [
//   {
//     id: 1,
//     title: 'occassional babysitting',
//   },
//   {
//     id: 2,
//     title: 'regular nannies',
//   },
// ];
let totalhours = 0,
  current_time = '',
  from_hours = 0,
  totalRegularHours = 0, totalhourPlus = 0;
const NewBooking = ({ navigation, route }) => {
  current_time = moment(new Date()).format('hh:mm A');
  useEffect(() => {

    current_time = moment(new Date()).format('hh:mm A');
    global.provide_from_time = current_time;
    global.provide_to_time = current_time;
    GetAddress();
    const unsubscribe = navigation.addListener('focus', () => {
      // current_time = moment(new Date()).format('hh:mm A');
      GetAddress();
    });
    const backAction = () => {
      navigation.navigate('Dashboard');
      global.booking_type = '';
      global.provide_date = '';
      global.provide_end_date = '';
      global.provide_from_time = '';
      global.provide_to_time = '';
      global.address_name = '';
      global.id_address = '';
      global.from_date = '';
      global.to_date = '';
      global.regular_data = null;
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
  const [regularData, setRegularData] = useState(global.regular_data ? global.regular_data : [{
    id: 1,
    day: 'monday',
    is_selected: false,
    from_time: '00:00',
    to_time: '00:00',
    label: 'Monday'
  }, {
    id: 2,
    day: 'tuesday',
    is_selected: false,
    from_time: '00:00',
    to_time: '00:00',
    label: "Tuesday"
  }, {
    id: 3,
    day: 'wednesday',
    is_selected: false,
    from_time: '00:00',
    to_time: '00:00',
    label: "Wednesday"
  }, {
    id: 4,
    day: 'thursday',
    is_selected: false,
    from_time: '00:00',
    to_time: '00:00',
    label: "Thursday"
  }, {
    id: 5,
    day: 'friday',
    is_selected: false,
    from_time: '00:00',
    to_time: '00:00',
    label: "Friday"
  }, {
    id: 6,
    day: 'saturday',
    is_selected: false,
    from_time: '00:00',
    to_time: '00:00',
    label: "Saturday"
  }, {
    id: 7,
    day: 'sunday',
    is_selected: false,
    from_time: '00:00',
    to_time: '00:00',
    label: "Sunday"
  }])
  const [optionId, setOptionId] = useState(
    global.booking_type ? global.booking_type : '',
  );
  const [provideDate, setProvideDate] = useState(
    global.provide_date ? global.provide_date : '',
  );
  const [provideEndDate, setProvideEndDate] = useState(
    global.provide_end_date ?  global.provide_end_date : '',
  );
  const [timeshow, setTimeShow] = useState(false);
  const [timetoshow, setToTimeShow] = useState(false);
  const [selectedFromTime,setSelectedFromTime] = useState(new Date())
  const [selectedToTime,setSelectedToTime] = useState(new Date())
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [isDateTimePickerVisibleTo, setIsDateTimePickerVisibleTo] = useState(false);
  const [isDateTimePickerVisibleProvide, setIsDateTimePickerVisibleProvide] = useState(false);
  const [isDateTimeEndPickerVisibleProvide, setIsDateTimeEndPickerVisibleProvide] = useState(false);
  const [selectindex, setSelectIndex] = useState(0);
  const [fromTime, setFromTime] = useState(
    global.provide_from_time ? global.provide_from_time : current_time,
  );

  const [toTime, setToTime] = useState(
    global.provide_to_time ? global.provide_to_time : current_time,
  );
  const [addressVisible, setAddressVisible] = useState(false);
  const [address, setAddress] = useState(
    global.address_name ? global.address_name : '',
  );
  const [addressData, setAddressData] = useState([]);
  const [addressId, setAddressId] = useState(
    global.id_address ? global.id_address : '',
  );
  const [from_date, setFrom_date] = useState(global.from_date ? global.from_date : '')
  const [to_date, setTo_date] = useState(global.to_date ? global.to_date : '')
  const handleDatePickedProvide = date => {
    var d = date;
    let selected = moment(d).format('DD-MM-YYYY');
    setProvideDate(selected);
    global.provide_date = selected;
    hideDateTimePickerProvide();
  };
  const handleDatePickedToProvide = date => {
    var d = date;
    let selected = moment(d).format('DD-MM-YYYY');
    setProvideEndDate(selected);
    global.provide_end_date = selected;
    hideDateTimeEndPickerProvide();
  };
  const showDateTimeEndPickerProvide = () => {
    setIsDateTimeEndPickerVisibleProvide(true);
  };
  const hideDateTimeEndPickerProvide = () => {
    setIsDateTimeEndPickerVisibleProvide(false);
  };

  const showDateTimePickerProvide = () => {
    setIsDateTimePickerVisibleProvide(true);
  };
  const hideDateTimePickerProvide = () => {
    setIsDateTimePickerVisibleProvide(false);
  };
  const handleDatePicked = date => {
    var d = date;
    let selected = moment(d).format('DD-MM-YYYY');
    setFrom_date(selected)
    global.from_date = selected
    hideDateTimePicker();
  };
  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate())
  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };
  const handleDatePickedTo = date => {
    var d = date;
    let selected = moment(d).format('DD-MM-YYYY');
    setTo_date(selected)
    global.to_date = selected
    hideDateTimePickerTo();
  };
  const showDateTimePickerTo = () => {
    setIsDateTimePickerVisibleTo(true);
  };
  const hideDateTimePickerTo = () => {
    setIsDateTimePickerVisibleTo(false);
  };
  const onDismiss = React.useCallback(() => {
    setTimeShow(false);
    setToTimeShow(false);
  }, [setTimeShow, setToTimeShow]);
  const onConfirm = date => {
    let time = moment(date).format('hh:mm A');
    from_hours = date.hours;
    setTimeShow(false);
    setFromTime(time);
    setSelectedFromTime(date);
    global.provide_from_time = time;
    var startTime = moment(global.provide_from_time, 'hh:mm A');
    var endTime = moment(global.provide_to_time, 'hh:mm A');
    totalhours = endTime.diff(startTime, 'hours');
    if (optionId === 2) {
      global.providefromTime = time
      const some_array = [...regularData];
      some_array[selectindex].from_time = time;
      setRegularData(some_array);
      global.regular_data = some_array
    }
  };
  const onToTimeConfirm = date => {
    let time = moment(date).format('hh:mm A');
    setToTimeShow(false);
    setToTime(time);
    setSelectedToTime(date)
    global.provide_to_time = time;
    var startTime = moment(global.provide_from_time, 'hh:mm A');
    var endTime = moment(global.provide_to_time, 'hh:mm A');
    totalhours = endTime.diff(startTime, 'hours');
    if (optionId === 2) {
      global.providetoTime = time;
      var beginningTime = moment(global.providefromTime, 'h:mma');
      var endTime = moment(global.providetoTime, 'h:mma');
      if (beginningTime.isBefore(endTime) === false && provideDate === provideEndDate) {
        Global.showError('From time must be small than To time!');
        // setToTime(moment(date).format('hh:mm A'));
        setToTimeShow(false);
      } else {
        const some_array = [...regularData];
        some_array[selectindex].to_time = time;
        setRegularData(some_array);
        global.regular_data = some_array
      }
    }
  };
  const clickFromTime = (index) => {
    setSelectIndex(index);
    setTimeout(() => {
      setTimeShow(true);
    }, 50);
  };
  const clickToTime = (index) => {
    setSelectIndex(index);
    setTimeout(() => {
      setToTimeShow(true);
    }, 50);
  };
  const GetAddress = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_address')
      .then(res => {
        if (res.status) {
          setAddressData(res.data);
          global.global_loader_reff.show_loader(0);
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(r => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const onPressProceed = () => {
    var beginningTime = moment(global.provide_from_time, 'h:mma');
    var endTime = moment(global.provide_to_time, 'h:mma');
    let cureenttime = moment().format('hh:mm A')
    var cureenttime_convert = moment(cureenttime, 'h:mma');
    var dayDiff = 0
    if(provideDate !== '' && provideEndDate !== ''){
      var startDate = moment(provideDate, 'DD-MM-YYYY');
      var endDate = moment(provideEndDate, 'DD-MM-YYYY');
     
      dayDiff = endDate.diff(startDate, 'days');
      console.log('Days:' + dayDiff);
    }
   
    if (optionId === '') {
      Global.showError('Please select occassional or regular booking!');
    } else if (provideDate === '') {
      Global.showError('Please select Date!');
    }else if(provideEndDate === ''){
      Global.showError('Please select End Date!')
    }else if(provideDate !== provideEndDate && dayDiff > 1){
      Global.showError('Please select one day!');
    }
    
    else if (fromTime === '') {
      Global.showError('Please select From time!');
    } else if (toTime === '') {
      Global.showError('Please select To time!');
    }
    //  else if (!cureenttime_convert.isBefore(beginningTime)) {
    //   Global.showError('From time must be small than Current time!');
    // }
    else if (
      beginningTime.isBefore(endTime) === false && provideDate === provideEndDate
    ) {
      Global.showError('From time must be small than To time!');
    }
    else if (totalhours < 2 &&  provideDate === provideEndDate) {
      Global.showError('Select Minimum 2 hours!');
    } 
    else if (addressData === null) {
      Global.showError('Please Add Address');
    } else if (addressId === '') {
      Global.showError('Please select Address!');
    } else {
      let day_array = [], from_time_array = [],to_time_array = []
      if(provideDate === provideEndDate){
        var startDate = moment(provideDate, 'DD-MM-YYYY');
        var day = moment(startDate).format('dddd');   
        console.log("daydayday",day)
        day_array = [day.toLowerCase()]
        from_time_array = [provide_from_time]
        to_time_array = [provide_to_time]
      }else{
        var startDate = moment(provideDate, 'DD-MM-YYYY');
        var endDate = moment(provideEndDate, 'DD-MM-YYYY');
        var day1 = moment(startDate).format('dddd')
        var day2 = moment(endDate).format('dddd')
        day_array = [day1.toLowerCase(),day2.toLowerCase()]
        from_time_array = [provide_from_time,'12:00 AM']
        to_time_array = ['11:59 AM', provide_to_time]
      }
      
      let bookingObj =
      {
        device_type: Platform.OS, booking_type: '2',
        from_date: provideDate, 
        to_date: provideEndDate,
        provide_date: provideDate,
        provide_from_time: fromTime,
        provide_to_time: toTime,
        id_address: addressId,
        available: {
          days: day_array,
          from_time: from_time_array,
          to_time: to_time_array,
          mark_as_off: ['Yes','Yes'],
        },
      }
     
   

      // optionId

      // let bookingObj = {
      //   booking_type: '1',
      //   address_name: address,
      //   id_address: addressId,
      //   // provide_date: provideDate,
      //   provide_from_time: fromTime,
      //   provide_to_time: toTime,from_date: provideDate, to_date: provideEndDate
      // };
      // console.log(bookingObj);
      navigation.navigate('Nannylist', {
        bookingObj: bookingObj,
      });
    }
  };
  // {"device_type":"android","booking_type":"1","id_nanny":"14,15","id_children":"5","id_address":"4","provide_date":"29-06-2021","provide_from_time":"01:00","provide_to_time":"06:00"}
  // {"device_type":"android","booking_type":"2","id_nanny":"","id_children":"","id_address":"10","from_date":"16-08-2021","to_date":"20-08-2021",
  // "is_monday_available":"0",
  // "monday_from_time":"10:00",
  // "monday_to_time":"11:00",
  // "is_tuesday_available":"0",
  // "tuesday_from_time":"12:00",
  // "tuesday_to_time":"01:00",
  // "is_wednesday_available":"0",
  // "wednesday_from_time":"",
  // "wednesday_to_time":"",
  // "is_thursday_available":"1",
  // "thursday_from_time":"12:30 PM",
  // "thursday_to_time":"04:00 PM",
  // "is_friday_available":"1",
  // "friday_from_time":"12:30 PM",
  // "friday_to_time":"04:00 PM",
  // "is_saturday_available":"0","saturday_from_time":"10:00","saturday_to_time":"12:00","is_sunday_available":"0","sunday_from_time":"","sunday_to_time":""}
  // ==================================Availability==============================================
  const onCheckClick = index => {
    const some_array = [...regularData];
    if (some_array[index].is_selected) {
      some_array[index].is_selected = false;
      some_array[index].from_time = '00:00';
      some_array[index].to_time = '00:00';
      totalhourPlus = 0
    } else {
      some_array[index].is_selected = true;
    }
    setRegularData(some_array);
  };
  const RegularDataItem = (item, index) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: scale(5),
          }}>
          <Global.GlobalText text={item.label} style={[styles.day, { opacity: item.is_selected ? 1 : 0.7 }
          ]} />
          <View style={styles.checkedBtn}>
            {/* <Image
              source={Global.GlobalAssets.checked}
              style={styles.checked}
            /> */}
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
              isChecked={item.is_selected}
            />
          </View>
        </View>
        <View style={[styles.TimeStyle, styles.time, {
          borderColor: item.is_selected
            ? Global.GlobalColor.themeBlue
            : Global.GlobalColor.lightBlue,
          opacity: 0.9
        },]}>
          <TouchableOpacity
            onPress={() => {
              if (!item.is_selected) {
                Global.showError('Please Select Day!');
              } else {
                clickFromTime(index);
              }
            }}
            style={styles.row}>
            {item.from_time ? (
              <Global.GlobalText
                style={[styles.timeDisplayText, {
                  color: item.is_selected
                    ? Global.GlobalColor.themeBlue
                    : Global.GlobalColor.lightBlue,
                }]}
                text={item.from_time}
              />
            ) : null}
            <Image
              source={Global.GlobalAssets.clockBlue}
              style={styles.textinput_imageView}
            />
          </TouchableOpacity>
          <View>
            <Global.GlobalText text={'To'} style={[styles.to, {
              opacity: item.is_selected
                ? 1
                : 0.8
            }]} />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!item.is_selected) {
                Global.showError('Please Select Checkbox!');
              } else {
                clickToTime(index);
              }
            }}
            style={styles.row}>
            {item.to_time ? (
              <Global.GlobalText
                style={[styles.timeDisplayText, {
                  color: item.is_selected
                    ? Global.GlobalColor.themeBlue
                    : Global.GlobalColor.lightBlue,
                }]}
                text={item.to_time}
              />
            ) : null}
            <Image
              source={Global.GlobalAssets.clockBlue}
              style={styles.textinput_imageView}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  // const onRequestRegularNanny = () => {
  //   totalRegularHours = 0;
  //   let sum = [];
  //   let data = regularData.filter(item => item.is_selected === true);
  //   for (let i = 0; i < data.length; i++) {
  //     totalhourPlus = 0;
  //     totalRegularHours = 0;
  //     var startTime = moment(data[i].from_time, 'hh:mm A');
  //     var endTime = moment(data[i].to_time, 'hh:mm A');
  //     if (endTime.diff !== undefined) {
  //       totalRegularHours = parseInt(endTime.diff(startTime, 'hours'));
  //       sum.push(totalRegularHours)

  //     }
  //   }
  //   totalhourPlus = sum.reduce(add, 0); // with initial value to avoid when the array is empty
  //   function add(accumulator, a) {
  //     return accumulator + a;
  //   }

  //   if (from_date === '') {
  //     Global.showError("Please Select From Date")
  //   } else if (to_date === '') {
  //     Global.showError('Please Select To Date')
  //   } else if (global.from_date > global.to_date) {
  //     Global.showError('From Date must be small than To date')
  //   }

  //   else if ((Math.abs(
  //     moment(global.from_date, 'DD-MM-YYYY')
  //       .startOf('day')
  //       .diff(moment(global.to_date, 'DD-MM-YYYY').startOf('day'), 'days')
  //   ) + 1) < 15) {
  //     Global.showError('Please Enter Minimum 2 weeks!')
  //   } else if (totalhourPlus < 2) {
  //     Global.showError('Please Enter Minimum 2 Hours!')
  //   }
  //   else if (addressId === '') {
  //     Global.showError('Please Select Address')
  //   }
  //   else {
  //     let day_array = [],
  //       from_time_array = [],
  //       to_time_array = [],
  //       is_available_array = [];
  //     let data = regularData.filter(item => item.is_selected === true);
  //     for (let i = 0; i < data.length; i++) {
  //       day_array.push(
  //         data[i].day
  //       );
  //       from_time_array.push(data[i].from_time);
  //       to_time_array.push(data[i].to_time);
  //       is_available_array.push(
  //         data[i].is_selected === true ? 'Yes' : 'No',
  //       );
  //     }
  //     let regularObj =
  //     {
  //       device_type: Platform.OS, booking_type: optionId.toString(), from_date: from_date, to_date: to_date,
  //       id_address: addressId,
  //       available: {
  //         days: day_array,
  //         from_time: from_time_array,
  //         to_time: to_time_array,
  //         mark_as_off: is_available_array,
  //       },
  //     }

  //     navigation.navigate('Findnanny', {
  //       regularObj: regularObj,
  //     });
  //   }
  //   // navigation.navigate("RegularBookingSuccess")
  // }
  const onRequestRegularNanny = () => {
    // var startDate = moment(global.from_date, "DD-MM-YYYY");
    // var endDate = moment(global.to_date, "DD-MM-YYYY");

    // var result = 'Diff: ' + endDate.diff(startDate, 'days');
    // alert(result)
    totalRegularHours = 0;
    let sum = [];
    let data = regularData.filter(item => item.is_selected === true);
    for (let i = 0; i < data.length; i++) {
      totalhourPlus = 0;
      totalRegularHours = 0;
      var startTime = moment(data[i].from_time, 'hh:mm A');
      var endTime = moment(data[i].to_time, 'hh:mm A');
      if (endTime.diff !== undefined) {
        totalRegularHours = parseInt(endTime.diff(startTime, 'hours'));
        sum.push(totalRegularHours)

      }
    }
    totalhourPlus = sum.reduce(add, 0); // with initial value to avoid when the array is empty
    function add(accumulator, a) {
      return accumulator + a;
    }


    let varDate = moment(from_date, "DD-MM-YYYY").format();
    let curDate = moment(to_date, "DD-MM-YYYY").format();

    if (from_date === '') {
      Global.showError("Please Select From Date")
    } else if (to_date === '') {
      Global.showError('Please Select To Date')
    }
    else if (varDate > curDate) {
      Global.showError('From Date must be small than To date')
    }

    else if ((Math.abs(
      moment(global.from_date, 'DD-MM-YYYY')
        .startOf('day')
        .diff(moment(global.to_date, 'DD-MM-YYYY').startOf('day'), 'days')
    ) + 1) < 15) {
      Global.showError('Please Enter Minimum 2 weeks!')
    } else if (totalhourPlus < 2) {
      Global.showError('Please Enter Minimum 2 Hours!')
    }
    else if (addressId === '') {
      Global.showError('Please Select Address')
    }
    else {
      let day_array = [],
        from_time_array = [],
        to_time_array = [],
        is_available_array = [];
      let data = regularData.filter(item => item.is_selected === true);
      for (let i = 0; i < data.length; i++) {
        day_array.push(
          data[i].day
        );
        from_time_array.push(data[i].from_time);
        to_time_array.push(data[i].to_time);
        is_available_array.push(
          data[i].is_selected === true ? 'Yes' : 'No',
        );
      }
      // optionId.toString()
      let regularObj =
      {
        device_type: Platform.OS, booking_type: '2', from_date: from_date, to_date: to_date,
        id_address: addressId,
        available: {
          days: day_array,
          from_time: from_time_array,
          to_time: to_time_array,
          mark_as_off: is_available_array,
        },
      }

      navigation.navigate('Findnanny', {
        regularObj: regularObj,
      });
    }
    // navigation.navigate("RegularBookingSuccess")
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
        style={{ marginBottom: scale(100) }}>
        <Global.GlobalHeader
          onPress={() => {
            navigation.goBack();
            global.booking_type = '';
            global.provide_date = '';
            global.provide_end_date = '';
            global.provide_from_time = '';
            global.provide_to_time = '';
            global.address_name = '';
            global.id_address = '';
            global.from_date = '';
            global.to_date = '';
            global.regular_data = null
            setRegularData([{
              id: 1,
              day: 'monday',
              is_selected: false,
              from_time: '00:00',
              to_time: '00:00',
              label: 'Monday'
            }, {
              id: 2,
              day: 'tuesday',
              is_selected: false,
              from_time: '00:00',
              to_time: '00:00',
              label: "Tuesday"
            }, {
              id: 3,
              day: 'wednesday',
              is_selected: false,
              from_time: '00:00',
              to_time: '00:00',
              label: "Wednesday"
            }, {
              id: 4,
              day: 'thursday',
              is_selected: false,
              from_time: '00:00',
              to_time: '00:00',
              label: "Thursday"
            }, {
              id: 5,
              day: 'friday',
              is_selected: false,
              from_time: '00:00',
              to_time: '00:00',
              label: "Friday"
            }, {
              id: 6,
              day: 'saturday',
              is_selected: false,
              from_time: '00:00',
              to_time: '00:00',
              label: "Saturday"
            }, {
              id: 7,
              day: 'sunday',
              is_selected: false,
              from_time: '00:00',
              to_time: '00:00',
              label: "Sunday"
            }])
          }}
        />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="New Bookings" style={{ color: 'white' }} />
            </View>
            <View style={styles.headerText}>
              <TouchableOpacity onPress={() => {
                setOptionId('')
                global.booking_type = '';
                global.provide_date = '';
                global.provide_end_date = '';
                global.provide_from_time = '';
                global.provide_to_time = '';
                global.address_name = '';
                global.id_address = '';
                global.from_date = '';
                global.to_date = '';
                global.regular_data = null
                setFrom_date('')
                setTo_date('')
              }}>
                <Global.GlobalText
                  text={'PLEASE CHOOSE'}
                  style={{
                    fontSize: scale(20),
                    paddingStart: scale(20),
                    color: Global.GlobalColor.themePink,
                    paddingHorizontal: scale(20),
                  }}
                />
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setOptionId(1);
                    global.booking_type = 1;
                  }}
                  style={
                    optionId === 1 ? styles.selectedColor : styles.optionBase
                  }>
                  <Image
                    source={
                      optionId === 1
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                    style={[styles.radioBtn, { marginLeft: scale(20) }]}
                  />
                  <Global.GlobalText
                    text={'OCCASSIONAL BABYSITTING'}
                    style={styles.headingTextRadio}
                  />
                </TouchableOpacity>
              </View>
              {optionId === 1 ? (
                <View style={[styles.parentView]}>
                  <Global.GlobalText
                    text={'PROVIDE DATE'}
                    style={styles.inputHeading}
                  />
                  <TouchableOpacity
                    style={[
                      styles.SectionStyle,
                      { justifyContent: 'space-between' },
                    ]}
                    onPress={showDateTimePickerProvide}>
                    <TouchableOpacity onPress={showDateTimePickerProvide}>
                      {provideDate ? (
                        <Global.GlobalText
                          style={styles.provideTimeText}
                          text={provideDate}
                        />
                      ) : (
                        <Global.GlobalText
                          style={styles.dateTimeText}
                          text={'00/00/00'}
                        />
                      )}
                    </TouchableOpacity>
                    <Image
                      source={Global.GlobalAssets.calendarBlue}
                      style={styles.textinput_imageView}
                    />
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={isDateTimePickerVisibleProvide}
                    onConfirm={handleDatePickedProvide}
                    onCancel={hideDateTimePickerProvide}
                    minimumDate={tomorrow}
                  />

              <Global.GlobalText
                    text={'PROVIDE END DATE'}
                    style={styles.inputHeading}
                  />
                  <TouchableOpacity
                    style={[
                      styles.SectionStyle,
                      { justifyContent: 'space-between' },
                    ]}
                    onPress={showDateTimeEndPickerProvide}>
                    <TouchableOpacity onPress={showDateTimeEndPickerProvide}>
                      {provideEndDate ? (
                        <Global.GlobalText
                          style={styles.provideTimeText}
                          text={provideEndDate}
                        />
                      ) : (
                        <Global.GlobalText
                          style={styles.dateTimeText}
                          text={'00/00/00'}
                        />
                      )}
                    </TouchableOpacity>
                    <Image
                      source={Global.GlobalAssets.calendarBlue}
                      style={styles.textinput_imageView}
                    />
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={isDateTimeEndPickerVisibleProvide}
                    onConfirm={handleDatePickedToProvide}
                    onCancel={hideDateTimeEndPickerProvide}
                    minimumDate={tomorrow}
                  />
                  <Global.GlobalText
                    text={'PROVIDE TIME'}
                    style={styles.inputHeading}
                  />
                  <View
                    style={[styles.TimeStyle, { marginHorizontal: scale(17) }]}>
                    <TouchableOpacity
                      onPress={() => clickFromTime(0)}
                      style={styles.row}>
                      {fromTime ? (
                        <Global.GlobalText
                          style={styles.provideTimeText}
                          text={fromTime}
                        />
                      ) : (
                        <Global.GlobalText
                          style={styles.dateTimeText}
                          text={'00:00'}
                        />
                      )}
                      <Image
                        source={Global.GlobalAssets.clockBlue}
                        style={styles.textinput_imageView}
                      />
                    </TouchableOpacity>
                    <View>
                      <Global.GlobalText text={'To'} style={styles.to} />
                    </View>
                    <TouchableOpacity onPress={() => clickToTime(0)} style={styles.row}>
                      {toTime ? (
                        <Global.GlobalText
                          style={styles.provideTimeText}
                          text={toTime}
                        />
                      ) : (
                        <Global.GlobalText
                          style={styles.dateTimeText}
                          text={'00:00'}
                        />
                      )}
                      <Image
                        source={Global.GlobalAssets.clockBlue}
                        style={styles.textinput_imageView}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.addressHeader}
                    onPress={() => {
                      setAddressVisible(!addressVisible);
                    }}>
                    <Text style={styles.addressHeaderText}>
                      {address === '' ? 'CHOOSE ADDRESS' : address}
                    </Text>
                    {addressVisible ? (
                      <AntDesign
                        name="up"
                        size={scale(18)}
                        color={Global.GlobalColor.themeBlue}
                        style={{
                          paddingStart: scale(5),
                          position: 'absolute',
                          right: 10,
                          top: scale(12),
                        }}
                      />
                    ) : (
                      <AntDesign
                        name="down"
                        size={scale(18)}
                        color={Global.GlobalColor.themeBlue}
                        style={{
                          paddingStart: scale(5),
                          position: 'absolute',
                          right: 10,
                          top: scale(12),
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  {addressVisible ? (
                    <ScrollView
                      style={styles.addressView}
                      nestedScrollEnabled={true}>
                      {addressData.map((adr, i) => {
                        return (
                          <>
                            <TouchableOpacity
                              style={{
                                height: scale(44),
                                borderBottomColor: 'white',
                                borderBottomWidth: 1,
                              }}
                              onPress={() => {
                                setAddress(adr.address);
                                global.address_name = adr.address;
                                setAddressId(adr.id);
                                global.id_address = adr.id;
                                setAddressVisible(false);
                              }}>
                              <Global.GlobalText
                                text={adr.address}
                                style={styles.addressText}
                              />
                            </TouchableOpacity>
                          </>
                        );
                      })}
                    </ScrollView>
                  ) : null}
                  <View
                    style={{
                      alignSelf: 'center',
                      width: '100%',
                      paddingHorizontal: scale(20),
                      marginTop: scale(15),
                    }}>
                    <Global.GlobalButton
                      onPress={() => {
                        navigation.navigate('AddAddress');
                      }}
                      text="ADD ADDRESS"
                      style={{
                        width: '100%',
                      }}
                    />
                    <Global.GlobalButton
                      text="EDIT EXISTING ADDRESS"
                      style={{
                        width: '100%',
                      }}
                      onPress={() => {
                        navigation.navigate('ClientProfile');
                        global.isEditableChild = false;
                        global.isEditable = true;
                      }}
                    />
                    <Global.GlobalButton
                      onPress={() => {
                        onPressProceed();
                      }}
                      text="PROCEED"
                      style={{
                        width: '100%',
                        backgroundColor: Global.GlobalColor.themeBlue,
                      }}
                    />
                  </View>
                </View>
              ) : null}
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setOptionId(2);
                    global.booking_type = 2;
                  }}
                  style={
                    optionId === 2 ? styles.selectedColor : styles.optionBase
                  }>
                  <Image
                    source={
                      optionId === 2
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                    style={[styles.radioBtn, { marginLeft: scale(20) }]}
                  />
                  <Global.GlobalText
                    text={'REGULAR NANNIES'}
                    style={styles.headingTextRadio}
                  />
                </TouchableOpacity>
                {optionId === 2 ? (
                  <View style={styles.parentView}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: scale(5),
                      }}>
                      <Global.GlobalText
                        text={'SELECT DURATION'}
                        style={[styles.day, { color: Global.GlobalColor.themePink }]}
                      />
                    </View>
                    <View style={[styles.TimeStyle, styles.time, { borderColor: Global.GlobalColor.themePink }]}>
                      <TouchableOpacity
                        onPress={showDateTimePicker}
                        style={styles.row}>
                        <DateTimePicker
                          isVisible={isDateTimePickerVisible}
                          onConfirm={handleDatePicked}
                          onCancel={hideDateTimePicker}
                          // date={new Date()}
                          minimumDate={tomorrow}
                        />
                        <Global.GlobalText
                          style={[styles.timeDisplayText, { fontSize: scale(17), color: Global.GlobalColor.themePink }]}
                          text={from_date ? from_date : '______'}
                        />
                        <Image
                          source={Global.GlobalAssets.calendar}
                          style={[styles.textinput_imageView]}
                        />
                      </TouchableOpacity>
                      <View>
                        <Global.GlobalText
                          text={'To'}
                          style={[
                            styles.to,
                            { backgroundColor: Global.GlobalColor.themePink },
                          ]}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={showDateTimePickerTo}
                        style={styles.row}>
                        <DateTimePicker
                          isVisible={isDateTimePickerVisibleTo}
                          onConfirm={handleDatePickedTo}
                          onCancel={hideDateTimePickerTo}
                          minimumDate={tomorrow}
                        />
                        <Global.GlobalText
                          style={[styles.timeDisplayText, { fontSize: scale(17), color: Global.GlobalColor.themePink }]}
                          text={to_date ? to_date : '______'}
                        />
                        <Image
                          source={Global.GlobalAssets.calendar}
                          style={[styles.textinput_imageView]}
                        />
                      </TouchableOpacity>
                    </View>
                    {regularData !== null ? (
                      <>
                        {regularData.map((item, index) => {
                          return RegularDataItem(item, index)
                        })}
                      </>
                    ) : null}
                    <Global.GlobalText
                      text={'SELECT ADDRESS'}
                      style={[styles.day, { color: Global.GlobalColor.themePink, marginTop: scale(25) }]}
                    />
                    <TouchableOpacity
                      style={styles.addressHeader}
                      onPress={() => {
                        setAddressVisible(!addressVisible);
                      }}>
                      <Text style={styles.addressHeaderText}>
                        {address === '' ? 'CHOOSE ADDRESS' : address}
                      </Text>
                      {addressVisible ? (
                        <AntDesign
                          name="up"
                          size={scale(18)}
                          color={Global.GlobalColor.themeBlue}
                          style={{
                            paddingStart: scale(5),
                            position: 'absolute',
                            right: 10,
                            top: scale(12),
                          }}
                        />
                      ) : (
                        <AntDesign
                          name="down"
                          size={scale(18)}
                          color={Global.GlobalColor.themeBlue}
                          style={{
                            paddingStart: scale(5),
                            position: 'absolute',
                            right: 10,
                            top: scale(12),
                          }}
                        />
                      )}
                    </TouchableOpacity>
                    {addressVisible ? (
                      <ScrollView
                        style={styles.addressView}
                        nestedScrollEnabled={true}>
                        {addressData.map((adr, i) => {
                          return (
                            <>
                              <TouchableOpacity
                                style={{
                                  height: scale(44),
                                  borderBottomColor: 'white',
                                  borderBottomWidth: 1,
                                }}
                                onPress={() => {
                                  setAddress(adr.address);
                                  global.address_name = adr.address;
                                  setAddressId(adr.id);
                                  global.id_address = adr.id;
                                  setAddressVisible(false);
                                }}>
                                <Global.GlobalText
                                  text={adr.address}
                                  style={styles.addressText}
                                />
                              </TouchableOpacity>
                            </>
                          );
                        })}
                      </ScrollView>
                    ) : null}
                    <View
                      style={{
                        alignSelf: 'center',
                        width: '100%',
                        paddingHorizontal: scale(20),
                        marginTop: scale(15),
                      }}>
                      <Global.GlobalButton
                        onPress={() => {
                          navigation.navigate('AddAddress');
                        }}
                        text="ADD ADDRESS"
                        style={{
                          width: '100%',
                        }}
                      />
                      <Global.GlobalButton
                        text="EDIT EXISTING ADDRESS"
                        style={{
                          width: '100%',
                        }}
                        onPress={() => {
                          // let bookingObj = {
                          //   booking_type: optionId,
                          //   address_name: address,
                          //   id_address: addressId,
                          //   provide_date: provideDate,
                          //   provide_from_time: fromTime,
                          //   provide_to_time: toTime,
                          // };

                          navigation.navigate('ClientProfile'
                          );
                          global.isEditableChild = false;
                          global.isEditable = true;
                        }}
                      />
                      <Global.GlobalButton
                        onPress={() => {
                          onRequestRegularNanny();
                        }}
                        text="PROCEED"
                        style={{
                          width: '100%',
                          backgroundColor: Global.GlobalColor.themeBlue,
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </View>
            {timeshow && (
              <DateTimePicker
                isVisible={timeshow}
                onCancel={onDismiss}
                date={selectedFromTime}
                mode="time"
                onConfirm={onConfirm}
              />
            )}
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
            {timetoshow && (
              <DateTimePicker
                isVisible={timetoshow}
                onCancel={onDismiss}
                date={selectedToTime}
                mode="time"
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
          </Card>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '115%', width: '100%', alignItems: 'center' },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  day: {
    fontSize: scale(20),
    paddingStart: scale(17),
  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(25),
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
  parentView: {
    backgroundColor: Global.GlobalColor.themeLightBlue,
    paddingVertical: scale(15),
    marginTop: 0,
  },
  to: {
    fontSize: scale(18),
    marginLeft: scale(-16),
    backgroundColor: Global.GlobalColor.themeBlue,
    color: 'white',
    padding: scale(5),
    borderRadius: scale(5),
    opacity: 0.8
  },
  headerText: {
    backgroundColor: Global.GlobalColor.lightPink,
    // paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    borderBottomLeftRadius: scale(15),
    borderBottomRightRadius: scale(15),
  },
  timeDisplayText: {
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(19),
  },
  selectedColor: {
    marginTop: scale(15),
    flexDirection: 'row',
    backgroundColor: Global.GlobalColor.lightBlue,
    height: scale(54),
    alignItems: 'center',
    paddingStart: scale(0),
  },
  optionBase: {
    marginTop: scale(15),
    flexDirection: 'row',
    paddingStart: scale(0),
  },
  radioBtn: {
    height: scale(22),
    width: scale(22),
    resizeMode: 'contain',
  },
  toTimeDisplayText: {
    color: Global.GlobalColor.lightBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(20),
  },
  checkedBtn: { position: 'absolute', right: 20 },
  time: { marginHorizontal: scale(17), marginTop: scale(3) },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    height: scale(65),
    width: scale(250),
    marginVertical: scale(10),
    borderColor: Global.GlobalColor.borderColor,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingLeft: scale(15),
  },
  headingTextRadio: {
    fontSize: scale(20),
    textTransform: 'uppercase',
    paddingStart: scale(10),
  },
  textinput_imageView: {
    height: scale(18),
    width: scale(18),
    marginEnd: '5%',
    marginLeft: '5%',
    opacity: 0.7
  },
  provideTimeText: {
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
  },
  checked: {
    height: scale(19),
    width: scale(19),
  },
  row: { flexDirection: 'row', alignItems: "center" },
  inputHeading: {
    fontSize: scale(20),
    paddingStart: scale(17),
  },
  TimeStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: Global.GlobalColor.borderColor,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingLeft: scale(15),
    height: scale(65),
    width: scale(250),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeText: {
    color: Global.GlobalColor.lightBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(20),
  },
  addressText: {
    color: 'white',
    fontSize: scale(18),
    marginTop: scale(9),
    marginLeft: scale(20),
    textTransform: 'none',
  },
  addressView: {
    marginHorizontal: scale(17),
    backgroundColor: Global.GlobalColor.themeBlue,
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    opacity: 0.7,
    // height: scale(15),
  },
  addressHeader: {
    marginHorizontal: scale(17),
    height: scale(44),
    borderWidth: 2,
    borderColor: Global.GlobalColor.themeBlue,
    borderRadius: scale(5),
    backgroundColor: 'transparent',
    marginTop: scale(10),
  },
  addressHeaderText: {
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
    color: Global.GlobalColor.themeBlue,
    paddingTop: scale(8),
    paddingLeft: scale(10),
  },
});
export default NewBooking;
