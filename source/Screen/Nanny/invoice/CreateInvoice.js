import React, { useState, useEffect } from 'react';
import {
    View,
    Text,

    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,

} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';

import moment from 'moment';
import { Card } from 'native-base';
import AwesomeAlert from 'react-native-awesome-alerts';
let current_month = '', current_month_next = '', currMonthName = '', prevMonthName = '', invoiceIds = [], clientName = [], current_year = '', regularIds = [];
const CreateInvoice = ({ navigation }) => {
    const [InvoiceData, setInvoiceData] = useState([])
    const [total_value, setTotalValue] = useState(0)
    const [total_value_of_next_month, setTotalValueOfNextMonth] = useState(0)
    const [isShow, setIsShow] = useState(true)
    // const [monthId, setMonthId] = useState(1)
    const [showalert, setShowAlert] = useState(false);
    const [isSend, setIsSend] = useState(false)
    const [loadData, setLoadData] = useState(false)
    useEffect(() => {
        current_month = new Date().getMonth();
        current_month_next = new Date().getMonth() + 1;
        current_year = new Date().getFullYear()
       
        // current_month = ("0" + (new Date().getMonth())).slice(-2)
        // current_month_next = ("0" + (new Date().getMonth() + 1)).slice(-2);
        getInvoice()
        currMonthName = moment().format('MMMM');
        
        prevMonthName = moment().subtract(1, "month").format('MMMM');
        const unsubscribe = navigation.addListener('focus', () => {
            getInvoice()
        });
        return () => {
            unsubscribe();
        };
    }, []);
    const showAlert = () => {
        setShowAlert(true);
    };
    const hideAlert = () => {
        setShowAlert(false);
    };
    const getInvoice = () => {
        global.global_loader_reff.show_loader(1);

        helper.UrlReqAuth("api/nanny/get_invoice?id=&month=" + current_month + ',' + current_month_next).then((res) => {
            console.log("urlll","api/nanny/get_invoice?id=&month=" + current_month + ',' + current_month_next)
            console.log(res)
            if (res.status) {
                global.global_loader_reff.show_loader(0);
                 if (res.data !== null) {
                    global.global_loader_reff.show_loader(0);
                    setInvoiceData(res.data)
                  
                    setLoadData(true)
                    let datadata = res.data.filter(item => 1 + moment(item.checked_in_at, 'YYYY/MMMM/DD').month() === current_month);
                    if (datadata.length > 0) {
                        let cost_val = 0,
                            total_val = 0;
                        for (var i = 0; i < datadata.length; i++) {
                            cost_val = parseFloat(datadata[i].total_cost);
                            if (total_val === 0) {
                                total_val = cost_val;
                            } else {
                                total_val = total_val + cost_val;
                            }

                            setTotalValue(total_val);
                        }
                    } else {
                    }
                    let sendedData = res.data.filter(item => item.is_invoice_send === true);
                    for (var i = 0; i < sendedData.length; i++) {
                        let Send_val = sendedData[i].is_invoice_send;
                        setIsSend(Send_val);
                        setLoadData(true)

                    }
                    let datadatas = res.data.filter(item => 1 + moment(item.checked_in_at, 'YYYY/MMMM/DD').month() !== current_month);
                    if (datadatas.length > 0) {
                        let cost_val = 0,
                            total_val = 0;
                        for (var i = 0; i < datadatas.length; i++) {
                            cost_val = parseFloat(datadatas[i].total_cost);
                            if (total_val === 0) {
                                total_val = cost_val;
                            } else {
                                total_val = total_val + cost_val;
                            }
                            setTotalValueOfNextMonth(total_val);
                        }
                    } else { }
                } else {
                    global.global_loader_reff.show_loader(0);
                    setInvoiceData(res.data)
                }
            }
        }).finally((f) => {
            global.global_loader_reff.show_loader(0);
        })
    }
    const sendInvoice = () => {
        hideAlert()
        let datadata = InvoiceData.filter(item => item.booking_type === '1');
        let regularData = InvoiceData.filter(items => items.booking_type === '2')
        datadata.forEach(element => {
            if (1 + moment(element.checked_in_at, 'YYYY/MMMM/DD').month() === current_month) {
                invoiceIds.push(element.id);
                clientName.push(element.client_name)
            }
        });
        regularData.forEach(element => {
            if (1 + moment(element.checked_in_at, 'YYYY/MMMM/DD').month() === current_month) {
                regularIds.push(element.id);
            }
        });
        let invoiceObj = {
            ids: invoiceIds.toString(),
            regular_booking_ids: regularIds?.toString(),
            client_name: clientName?.toString(),
            month: current_month?.toString().length > 1 ? current_month : '0' + current_month,
            year: current_year?.toString(),
            total_amount: total_value?.toString()
        }
        global.global_loader_reff.show_loader(1);
        helper.UrlReqAuthPost('api/nanny/send_invoice', "POST", invoiceObj).then((res) => {
            if (res.status) {
                global.global_loader_reff.show_loader(0);
                Global.showToast(res.message)
                getInvoice()
            } else {
                global.global_loader_reff.show_loader(0);
                Global.showError(res.message)
            }
            hideAlert()
        }).finally((f) => {
            global.global_loader_reff.show_loader(0);
            hideAlert()
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
            <ScrollView style={{ marginBottom: scale(70) }} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                <Global.GlobalHeader onPress={() => navigation.goBack()} />


                {loadData ? (
                    <>
                        {!isSend ? (
                            <Card style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Global.GlobalText
                                        text={"INVOICE FOR " + prevMonthName}
                                        style={styles.avalabilityText}
                                    />
                                </View>
                                <View style={styles.invoiceView}>
                                    <View>
                                        {InvoiceData !== null ? (
                                            <>
                                                {InvoiceData.map((item, index) => {
                                                    return (
                                                        <ScrollView showsVerticalScrollIndicator={false}>
                                                            <View style={styles.innerCard}>
                                                                <>
                                                                    {1 + moment(item.checked_in_at, 'YYYY/MMMM/DD').month() === current_month ? (
                                                                        <View style={styles.detailView}>
                                                                            <View style={styles.viewBase}>
                                                                                <Global.GlobalText
                                                                                    text={item.checked_in_at}
                                                                                    style={styles.pinkText}
                                                                                />
                                                                            </View>
                                                                            <Global.GlobalText
                                                                                text={'Client - ' + item.client_name}
                                                                                style={styles.message}
                                                                            />
                                                                            <Global.GlobalText
                                                                                text={'Job Type - ' + item.job_type}
                                                                                style={styles.message}
                                                                            />
                                                                            <Global.GlobalText
                                                                                text={'Time - ' + item.total_hours}
                                                                                style={styles.message}
                                                                            />
                                                                            <Global.GlobalText
                                                                                text={'No of Children - ' + item.total_child}
                                                                                style={styles.message}
                                                                            />
                                                                            <Global.GlobalText
                                                                                text={'Rate Per Hour  - ' + global.currency + ' ' + item.rate_per_hour}
                                                                                style={styles.message}
                                                                            />
                                                                            <Global.GlobalText
                                                                                text={'Amount - ' + global.currency + ' ' + item.total_cost}
                                                                                style={styles.message}
                                                                            />
                                                                        </View>
                                                                    ) : null}
                                                                </>
                                                            </View>
                                                        </ScrollView>
                                                    )
                                                })}
                                                <View style={{ backgroundColor: "white", marginHorizontal: scale(10), borderRadius: scale(10), marginVertical: scale(20) }}>
                                                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: scale(20) }}>
                                                        <View>
                                                            <Global.GlobalText
                                                                text="Total Amount"
                                                                style={styles.dateText}
                                                            />
                                                        </View>
                                                        <View>
                                                            <Global.GlobalText
                                                                text={global.currency + ' ' + total_value}
                                                                style={[styles.dateText]}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            </>
                                        ) : null}
                                    </View>
                                    {total_value !== 0 ? (

                                        <View
                                            style={styles.btnBase}>
                                            <Global.GlobalButton
                                                text={'SEND INVOICE'}
                                                textStyle={{ fontSize: scale(19) }}
                                                onPress={() => {
                                                    showAlert()
                                                }}
                                                style={{
                                                    height: scale(55),
                                                }}
                                            />
                                        </View>
                                    ) : null}
                                </View>
                            </Card>
                        ) : null}
                    </>
                ) :
                    <Card style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Global.GlobalText
                                text={"INVOICE"}
                                style={styles.avalabilityText}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: scale(30) }}>
                            <Text style={styles.pinkText}>Invoice Not Available</Text>
                        </View>
                    </Card>
                }
                {loadData ? (
                    <Card style={styles.card}>
                        <TouchableOpacity style={styles.cardHeader} onPress={() => {
                            setIsShow(!isShow)
                        }}>
                            <Global.GlobalText
                                text={"INVOICE FOR " + currMonthName}
                                style={styles.avalabilityText}
                            />
                        </TouchableOpacity>
                        {isShow ? (
                            <View style={styles.invoiceView}>
                                <View>
                                    {InvoiceData.length > 0 ? (
                                        <>
                                            {InvoiceData.map((item, index) => {

                                                return (
                                                    <ScrollView showsVerticalScrollIndicator={false}>
                                                        <View style={styles.innerCard}>
                                                            <>
                                                                {1 + moment(item.checked_in_at, 'YYYY/MMMM/DD').month() !== current_month ? (
                                                                    <View style={styles.detailView}>
                                                                        <View style={styles.viewBase}>
                                                                            <Global.GlobalText
                                                                                text={item.checked_in_at}
                                                                                style={styles.pinkText}
                                                                            />
                                                                        </View>
                                                                        <Global.GlobalText
                                                                            text={'Client - ' + item.client_name}
                                                                            style={styles.message}
                                                                        />
                                                                        <Global.GlobalText
                                                                            text={'Job Type - ' + item.job_type}
                                                                            style={styles.message}
                                                                        />
                                                                        <Global.GlobalText
                                                                            text={'Time - ' + item.total_hours}
                                                                            style={styles.message}
                                                                        />
                                                                        <Global.GlobalText
                                                                            text={'No of Children - ' + item.total_child}
                                                                            style={styles.message}
                                                                        />
                                                                        <Global.GlobalText
                                                                            text={'Rate Per Hour  - ' + global.currency + ' ' + item.rate_per_hour}
                                                                            style={styles.message}
                                                                        />
                                                                        <Global.GlobalText
                                                                            text={'Amount - ' + global.currency + ' ' + item.total_cost}
                                                                            style={styles.message}
                                                                        />
                                                                    </View>
                                                                ) : null}
                                                            </>
                                                        </View>
                                                    </ScrollView>
                                                )
                                            })}
                                            <View style={styles.invoiceStyle}>
                                                <View style={styles.innerInvoiceView}>
                                                    <View>
                                                        <Global.GlobalText
                                                            text="Total Amount"
                                                            style={styles.dateText}
                                                        />
                                                    </View>
                                                    <View>
                                                        <Global.GlobalText
                                                            text={global.currency + ' ' + total_value_of_next_month}
                                                            style={[styles.dateText]}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </>
                                    ) : null}
                                </View>
                            </View>
                        ) : null}
                    </Card>
                ) : null}
                <AwesomeAlert
                    show={showalert}
                    showProgress={false}
                    title="Send Invoice"
                    message="Are you sure want to send this Invoice?"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="No, cancel"
                    confirmText="Yes, Sure"
                    confirmButtonColor="#DD6B55"
                    onCancelPressed={() => {
                        hideAlert();
                    }}
                    onConfirmPressed={() => {
                        sendInvoice();
                    }}
                    messageStyle={{
                        fontFamily: Global.GlobalFont.Regular,
                        color: '#000',
                        fontSize: scale(19),
                    }}
                    confirmButtonTextStyle={{ fontFamily: Global.GlobalFont.Regular }}
                    contentStyle={{ fontFamily: Global.GlobalFont.Regular }}
                    cancelButtonTextStyle={{ fontFamily: Global.GlobalFont.Regular }}
                    titleStyle={{
                        fontFamily: Global.GlobalFont.Bold,
                        color: Global.GlobalColor.darkBlue,
                    }}
                />
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
        width: scale(300),
        marginTop: scale(40),
    },
    avalabilityText: {
        color: 'white',
    },
    dateText: {
        fontSize: scale(18),
        color: Global.GlobalColor.themePink,
        paddingVertical: scale(15)
    },
    cardHeader: {
        backgroundColor: Global.GlobalColor.themeBlue,
        padding: scale(10),
        borderTopStartRadius: scale(15),
        borderTopEndRadius: scale(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomStartRadius: scale(8),
        borderBottomEndRadius: scale(8),
    },
    invoiceView: {
        borderRadius: scale(7),
        backgroundColor:
            Global.GlobalColor.themeLightBlue,
        marginTop: scale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
    },
    btnBase: {
        marginVertical: scale(18),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    innerCard: {
        backgroundColor: Global.GlobalColor.themeLightBlue,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginVertical: scale(1),
    },
    message: {
        paddingVertical: scale(1),
        fontSize: scale(18),
        textTransform: 'none',
        paddingStart: scale(10),
    },
    pinkText: {
        paddingVertical: scale(1),
        fontSize: scale(22),
        textTransform: 'none',
        paddingStart: scale(10),
        fontFamily: Global.GlobalFont.Regular,
        color: Global.GlobalColor.themePink,
    },
    viewBase: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(10),
        marginRight: scale(5),
    },
    detailView: {
        backgroundColor: 'white',
        paddingBottom: scale(10),
        marginTop: scale(10),
        borderRadius: scale(10),
    },
    invoiceStyle: { backgroundColor: "white", marginHorizontal: scale(10), borderRadius: scale(10), marginVertical: scale(8) },
    innerInvoiceView: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: scale(20) }

});
export default CreateInvoice;
