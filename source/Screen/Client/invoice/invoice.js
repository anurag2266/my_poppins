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
    Keyboard, Platform
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
const IMG_CONTAIN = 'contain';
let GST_amount = 0, grand_total = 0;
const Invoice = ({ navigation }) => {
    const [invoicedata, setInvoiceData] = useState([]);
    useEffect(() => {

        GetInvoice()
        const unsubscribe = navigation.addListener('focus', () => {
            GetInvoice()
        });

        return () => {
            unsubscribe();
        };
    }, []);
    const GetInvoice = () => {
        global.global_loader_reff.show_loader(1);
        helper
            .UrlReqAuth('api/client/get_invoice?id=')
            .then(res => {
                console.log("DSDFDDF",res)
                if (res.status) {
                    if (res.data) {
                        const newFile = res.data.map(file => {
                            let total_cost = file.total_cost;
                            let sub_total = file.total_cost;//100
                            let gst = file.vat;//18%
                            let total = gst > 0 ? ((sub_total * gst) / 100) : 0;
                            GST_amount = Math.round(total)
                            // grand_total = GST_amount + total_cost
                            grand_total = file.grand_total;
                            return { ...file, total: grand_total };
                        });
                        setInvoiceData(newFile);
                        console.log("invoicedata",invoicedata)
                        global.global_loader_reff.show_loader(0);
                    } else {
                        global.global_loader_reff.show_loader(0);
                    }
                } else {
                    setInvoiceData(res.data);
                    global.global_loader_reff.show_loader(0);
                }
            })
            .catch(r => {
                global.global_loader_reff.show_loader(0);
            });
    };
    const onPressPay = (invoiceId, booking_type, amount) => {
        // alert(amount)
        let obj = { device_type: Platform.OS, id: invoiceId, booking_type: booking_type, amount: amount }
        console.log(obj);
        global.global_loader_reff.show_loader(1);
        helper
            .UrlReqAuthPost('api/payment_link_genrate', 'POST', obj)
            .then(res => {
                console.log(res);
                if (res.status) {
                    // Global.showToast(res.message)
                    global.global_loader_reff.show_loader(0);
                    // GetInvoice()
                    setTimeout(() => {
                        let paymentLink = res.payment_link;

                        navigation.navigate('PaymentScreen', {
                            paymentLink: paymentLink,
                            totalAmount: amount,
                            requestPayload: obj,
                        });
                    }, 200);
                } else {
                    Global.showError(res.message)
                    global.global_loader_reff.show_loader(0);
                }
            })
            .catch(r => {
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
                <View style={styles.baseView}>
                    <Card style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Global.GlobalText text="Invoice" style={{ color: 'white' }} />
                        </View>
                        {invoicedata !== null && invoicedata !== undefined ? (
                            <View style={styles.innerCard}>
                                <View style={styles.headerView}>
                                    <Global.GlobalText
                                        text="Pending Invoice"
                                        style={{ paddingVertical: scale(5), paddingStart: scale(10) }}
                                    />
                                </View>

                                <>
                                    {invoicedata.map((items, index) => {
                                        // let t = (index += 1);
                                        // let total_cost = items.total_cost;
                                        // let sub_total = items.total_cost;//100
                                        // let gst = items.vat;//18%
                                        // let total = gst > 0 ? ((sub_total * gst) / 100) : 0;
                                        // GST_amount = Math.round(total)
                                        // grand_total = GST_amount + total_cost

                                        // items.vat > 0 ? ((items.total_cost * items.vat) / 100)
                                        return (
                                            <>
                                                {!items.is_payment ? (
                                                    <View style={styles.detailView}>
                                                        <View style={styles.viewBase}>
                                                            <Global.GlobalText
                                                                text={items.invoice_number_format}
                                                                style={styles.pinkText}
                                                            />
                                                            <TouchableOpacity
                                                                style={styles.eyeIcon}
                                                                onPress={() =>
                                                                    console.log("Clicked Item ID:", items.id) ||
                                                                    navigation.navigate('Invoicedetail', {
                                                                        id_invoice: items.id, 
                                                                        series: items.id, // Assuming the series should also be the ID
                                                                        booking_type: items.booking_type,
                                                                        items:items
                                                                    })
                                                                }>
                                                                <Image
                                                                    source={Global.GlobalAssets.eyeIcon}
                                                                    style={styles.eyes}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <Global.GlobalText
                                                            text={'Date - ' + items.invoice_created_at}
                                                            style={styles.message}
                                                        />
                                                        <Global.GlobalText
                                                            text={'Total Time - ' + items.total_hours}
                                                            style={styles.message}
                                                        />
                                                        <Global.GlobalText
                                                            text={'Total Amount - ' + global.currency + ' ' + items.total}
                                                            style={styles.message}
                                                        />
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Global.GlobalText
                                                                text={'Nanny - ' + items.nanny_name}
                                                                style={styles.message}
                                                            />
                                                        </View>
                                                        <Global.GlobalButton
                                                            text={'Pay'}
                                                            onPress={() => onPressPay(items.id, items.booking_type, items.total)}
                                                            style={{
                                                                backgroundColor: Global.GlobalColor.themePink,
                                                                height: scale(55),
                                                                alignSelf: 'center',
                                                            }}
                                                        />
                                                    </View>
                                                ) : null}
                                            </>
                                        );
                                    })}
                                </>

                            </View>
                        ) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: scale(30) }}>
                            <Text style={styles.nodataText}>No Data</Text>
                        </View>}
                        {invoicedata !== null && invoicedata !== undefined ? (
                            <View style={styles.innerCard}>
                                <View style={styles.headerView}>
                                    <Global.GlobalText
                                        text="Completed Invoice"
                                        style={{ paddingVertical: scale(5), paddingStart: scale(10) }}
                                    />
                                </View>
                                {invoicedata.map((item, index) => {
                                    let t = (index += 1);
                                    // let total_cost = item.total_cost;
                                    // let sub_total = item.total_cost;//100
                                    // let gst = item.vat;//18%
                                    // let total = gst > 0 ? ((sub_total * gst) / 100) : 0;
                                    // GST_amount = Math.round(total)
                                    // grand_total = 0;
                                    // grand_total = GST_amount + total_cost
                                    return (
                                        <>
                                            {item.is_payment ? (
                                                <View style={styles.detailView}>
                                                    <View style={styles.viewBase}>
                                                        <Global.GlobalText
                                                            text={'Invoice' + ' ' + t}
                                                            style={styles.pinkText}
                                                        />
                                                        <TouchableOpacity
                                                            style={styles.eyeIcon}
                                                            onPress={() =>
                                                                navigation.navigate('Invoicedetail', {
                                                                    id_invoice: item.id, series: t,
                                                                    booking_type: item.booking_type
                                                                })
                                                            }>
                                                            <Image
                                                                source={Global.GlobalAssets.eyeIcon}
                                                                style={styles.eyes}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Global.GlobalText
                                                        text={'Date - ' + item.invoice_created_at}
                                                        style={styles.message}
                                                    />
                                                    <Global.GlobalText
                                                        text={'Total Time - ' + item.total_hours}
                                                        style={styles.message}
                                                    />
                                                    <Global.GlobalText
                                                        text={'Total Amount  - ' + global.currency + ' ' + item.total}
                                                        style={styles.message}
                                                    />
                                                    <Global.GlobalText
                                                        text={'Nanny - ' + item.nanny_name}
                                                        style={styles.message}
                                                    />
                                                </View>
                                            ) : null}
                                        </>
                                    );
                                })}
                            </View>
                        ) : null}
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
    },
    innerCard: {
        backgroundColor: Global.GlobalColor.themeLightBlue,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginVertical: scale(10),
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
    },
    pinkText: {
        paddingVertical: scale(1),
        fontSize: scale(22),
        textTransform: 'none',
        paddingStart: scale(10),
        fontFamily: Global.GlobalFont.Regular,
        color: Global.GlobalColor.themePink,
        textTransform: 'capitalize'
    },
    btnBase: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        marginTop: scale(8),
    },
    viewBase: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(10),
        marginRight: scale(5),
    },
    eyeIcon: {
        backgroundColor: Global.GlobalColor.themeBlue,
        alignItems: 'center',
        height: scale(25),
        width: scale(28),
        justifyContent: 'center',
        borderRadius: scale(5),
    },
    actionBtn: { height: scale(40), flex: 1, paddingHorizontal: scale(30) },
    headerView: {
        backgroundColor: Global.GlobalColor.lightBlue,
        paddingVertical: scale(5),
        borderRadius: scale(5),
    },
    detailView: {
        backgroundColor: 'white',
        paddingBottom: scale(10),
        marginTop: scale(10),
        borderRadius: scale(10),
    },
    eyes: {
        height: scale(30),
        width: scale(20),
        resizeMode: 'contain',
    },
    starStyle: {
        marginHorizontal: scale(1),
        height: scale(15),
        width: scale(15),
    }, clickHere: {
        borderBottomWidth: 1,
        borderBottomColor: Global.GlobalColor.themePink,
        fontSize: scale(16),
        color: Global.GlobalColor.themePink,
        fontFamily: Global.GlobalFont.Regular,
        paddingBottom: scale(0),
    }, nodataText: {
        padding: scale(20), fontFamily: Global.GlobalFont.Regular, fontSize: scale(20),
        color: Global.GlobalColor.themeBlue
    },
});
export default Invoice;
