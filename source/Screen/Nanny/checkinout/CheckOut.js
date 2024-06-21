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
    StatusBar,
    ScrollView,
    SafeAreaView,
    Keyboard,
    BackHandler,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
import { CommonActions } from '@react-navigation/native';
let child = [],
    bookingId = '',
    childId = [],
    childName = [], current_date = '', dates = [], mainElement, elementParent, element, timeName = [], newArrays = [];
const CheckOut = props => {
    const navigation = props.navigation;
    const [checkindata, setCheckinData] = useState([]);
    const [betweenDate, setBetweenDate] = useState([]);

    useEffect(() => {
        getCheckInData()
        current_date = moment(new Date()).format('YYYY-MM-DD');
        const unsubscribe = navigation.addListener('focus', () => {
            getCheckInData();
        });
        return () => unsubscribe()
    }, []);

    const getCheckInData = () => {
        global.global_loader_reff.show_loader(1);
        helper
            .UrlReqAuth('api/nanny/checkin_list?id=')
            .then(res => {
                console.log(res);
                global.global_loader_reff.show_loader(0);
                //setCheckinData(res.data)
                if (res.status) {
                    if (res.data !== null) {
                        for (let index = 0; index < res.data.length; index++) {
                            mainElement = res.data[index];
                            if (mainElement.booking_type == 1) {
                                let occassionalData = res.data.filter(item => item.booking_type === 1);
                                newArrays = occassionalData.map(file => {
                                    return { ...file, dayFilterArr: null };
                                });
                                setCheckinData(newArrays)

                            } else {
                                // for regular booking 2
                                let regularData = res.data.filter(item => item.booking_type === 2);
                                let checkData = regularData;
                                for (let index = 0; index < checkData.length; index++) {
                                    elementParent = checkData[index];
                                    //step 1 :  get all dates between two date
                                    let startDate = moment(elementParent.from_date, 'DD MM YYYY').format('YYYY/MM/DD')
                                    let endDate = moment(elementParent.to_date, 'DD MM YYYY').format('YYYY/MM/DD')
                                    enumerateDaysBetweenDates(startDate, endDate)

                                    for (let index = 0; index < dates.length; index++) {

                                        element = dates[index];
                                        //step 2 : compare current date and checkin date 
                                        if (current_date === element) {
                                            //step 3 : check day name and current day name

                                            // dayFilterArr = elementParent.days_schedule.filter((item) =>
                                            //   item.name === moment(new Date()).format('dddd')
                                            // )
                                            let dayFilterArr = []
                                            let arrs = []
                                            elementParent.days_schedule.forEach(element => {
                                                if (element.name === moment(new Date()).format('dddd')) {
                                                    dayFilterArr.push(element)
                                                    arrs = checkData.map((file) => {
                                                        return { ...file, dayFilterArr: dayFilterArr }
                                                    })

                                                }

                                            });

                                            // console.log("HERE", arrs.concat(newArrays));
                                            setTimeout(() => {
                                                setCheckinData(arrs.concat(newArrays))

                                            }, 50);
                                        }
                                    }
                                }
                            }
                        }

                        global.global_loader_reff.show_loader(0);
                    }
                } else {
                    setCheckinData(res.data)
                    global.global_loader_reff.show_loader(0);
                }
            })
            .finally(e => {
                global.global_loader_reff.show_loader(0);
            });
    };
    const enumerateDaysBetweenDates = (startDate, endDate) => {
        startDate = moment(startDate);
        endDate = moment(endDate);
        var now = startDate;
        while (now.isBefore(endDate) || now.isSame(endDate)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
        }
        function removeDuplicates(arr, equals) {
            var originalArr = dates.slice(0);
            var i, len, val;
            dates.length = 0;
            for (i = 0, len = originalArr.length; i < len; ++i) {
                val = originalArr[i];
                if (!arr.some(function (item) { return equals(item, val); })) {
                    arr.push(val);
                }
            }
        }
        function thingsEqual(thing1, thing2) {
            return thing1 === thing2
        }
        var things = dates;
        removeDuplicates(things, thingsEqual);
        setBetweenDate(things)

    };
    const onCheckOut = (id, child) => {
        let arr = [];
        child.forEach(element => {
            arr.push(element.id)
        });
        childId = arr;
        global.global_loader_reff.show_loader(1);
        let checkoutObj = { id: id, id_children: childId.toString(), status: '2' }

        helper.UrlReqAuthPost('api/nanny/check_in_out', 'POST', checkoutObj).then((res) => {

            if (res.status) {
                global.global_loader_reff.show_loader(0);
                Global.showToast(res.message)
                global.checkStatus = true

                navigation.goBack()
            } else {
                global.global_loader_reff.show_loader(0);
                Global.showError(res.message)
            }
            global.global_loader_reff.show_loader(0);
        }).finally((e) => {
            global.global_loader_reff.show_loader(0);
        })
    }
    const onCheckOutRegular = (id, child) => {
        let arr = [];
        child.forEach(element => {
            arr.push(element.id)
        });
        childId = arr;
        global.global_loader_reff.show_loader(1);
        let checkoutObj = { id: id, id_children: childId.toString(), status: '2' }

        helper.UrlReqAuthPost('api/nanny/regular_booking_check_in_out', 'POST', checkoutObj).then((res) => {

            if (res.status) {
                global.global_loader_reff.show_loader(0);
                Global.showToast(res.message)
                global.checkStatus = true

                navigation.goBack()
            } else {
                global.global_loader_reff.show_loader(0);
                Global.showError(res.message)
            }
            global.global_loader_reff.show_loader(0);
        }).finally((e) => {
            global.global_loader_reff.show_loader(0);
        })
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
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: scale(50) }}>
                <Global.GlobalHeader onPress={() => navigation.goBack()} />
                <View style={styles.baseView}>
                    <Card style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Global.GlobalText text="Check Out" style={{ color: 'white' }} />
                        </View>
                        {checkindata !== null && checkindata !== undefined && checkindata.length > 0 ? (
                            <>
                                {checkindata.map((item, i) => {

                                    let nm = [];
                                    let time = [];
                                    item.child.forEach(element => {
                                        nm.push(element.name)
                                    });
                                    childName = nm
                                    if (item.dayFilterArr !== null) {

                                        for (let index = 0; index < item.dayFilterArr.length; index++) {
                                            const element = item.dayFilterArr[index];
                                            time.push(element.from_time + ' ' + element.to_time)
                                        }
                                        timeName = time;
                                    }
                                    return (
                                        <>
                                            {item.is_job_checkin && !item.is_job_completed ? (
                                                <View style={styles.detailView}>
                                                    <View style={styles.viewBase}>
                                                        <Global.GlobalText
                                                            text={item.client_name}
                                                            style={styles.pinkText}
                                                        />
                                                    </View>
                                                    {item.booking_type === 1 ? (
                                                        <Global.GlobalText
                                                            text={'Date : ' + item.booking_date}
                                                            style={styles.message}
                                                        />
                                                    ) : (
                                                        <Global.GlobalText
                                                            text={'Date : ' + item.from_date + ' To ' + item.to_date}
                                                            style={styles.message}
                                                        />
                                                    )}
                                                    {item.booking_type === 1 ? (
                                                        <Global.GlobalText
                                                            text={'Time : ' + item.from_time + ' ' + 'to' + ' ' + item.to_time}
                                                            style={styles.message}
                                                        />
                                                    ) : (
                                                        <>
                                                            {item.dayFilterArr !== null && item.dayFilterArr !== undefined ? (

                                                                <Global.GlobalText
                                                                    text={'Time : ' + timeName.toString()}
                                                                    style={styles.message}
                                                                />

                                                            ) : null}
                                                        </>
                                                    )}
                                                    <Global.GlobalText
                                                        text={'Location : ' + item.address}
                                                        style={styles.message}
                                                    />
                                                    <Global.GlobalText
                                                        text={'Child : ' + childName.toString()}
                                                        style={styles.message}
                                                    />
                                                    {item.is_job_checkin ? (
                                                        <>
                                                            {item.is_job_completed ? (
                                                                <View style={{ marginTop: scale(15), alignSelf: "center", flexDirection: 'row', justifyContent: "space-around" }}>
                                                                    <Global.GlobalButton
                                                                        text={'Job Completed'}
                                                                        disabled={true}
                                                                        style={{}}
                                                                    />
                                                                </View>
                                                            ) : (
                                                                <View style={{ marginTop: scale(15), alignSelf: "center", }}>
                                                                    {!item.child_log_phil ? (

                                                                        <Global.GlobalButton
                                                                            text={'Send Log'}
                                                                            onPress={() => {
                                                                                navigation.navigate('LogDetailNanny', { bookId: item.id })
                                                                            }}
                                                                            style={{}}
                                                                        />
                                                                    ) : null}
                                                                    <Global.GlobalButton
                                                                        text={'Check Out'}
                                                                        onPress={() => {
                                                                            if (item.booking_type === 1) {

                                                                                onCheckOut(item.id, item.child)
                                                                            } else {
                                                                                onCheckOutRegular(item.id, item.child)
                                                                            }
                                                                        }}
                                                                        style={{}}
                                                                    />
                                                                </View>
                                                            )}
                                                        </>
                                                    ) : null}
                                                </View>
                                            ) : null}
                                        </>
                                    );
                                })}
                            </>
                        ) : <View style={{ alignItems: 'center', paddingVertical: scale(60) }}>
                            <Text style={styles.message}>No Job Found</Text>
                        </View>}
                    </Card>
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
        marginBottom: scale(20),
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
        fontFamily: Global.GlobalFont.Regular,
    },
    pinkText: {
        paddingVertical: scale(1),
        fontSize: scale(24),
        textTransform: 'none',
        paddingStart: scale(10),
        fontFamily: Global.GlobalFont.Regular,
        color: Global.GlobalColor.themePink
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
});
export default CheckOut;
