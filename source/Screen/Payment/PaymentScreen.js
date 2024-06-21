import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Modal,
  Text,
  BackHandler,
  Alert,
} from 'react-native';

import WebView from 'react-native-webview';
import GlobalInclude from '../../Global/globalinclude';
import {scale} from '../../Theme/Scalling';
import Global from '../../Global/globalinclude';
import { APP_URL } from '../../Global/config';
let showSuccess = false;
let showFail = false;
let orderId = '';
let requestPayload = '';
const PaymentScreen = ({route, navigation}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    showSuccess = false;
    showFail = false;
    orderId = '';

    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'Are you sure you want to go back? your transaction will be cnacelled.',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    if (route && route.params && route.params !== undefined) {
      requestPayload = route.params.requestPayload;
    } else {
      navigation.goBack();
    }
    return () => {
      backHandler.remove();
    };
  }, [route, navigation]);

  const handleWebViewNavigationStateChange = newNavState => {
    const {url} = newNavState;
    console.log(url);
    if (!url) {
      return;
    }

    let final_url = url.split('?');
    console.log(final_url[0]);
    if (
      final_url[0].includes(APP_URL + 'home/success')
    ) {
      // navigation.goBack();
      //  navigation.navigate("PaymentSuccess", { msg: "Your Transaction has been Completed Successfully" })
      let splited = [];
      let pArray = [];
      splited = url?.split('/');

      splited.forEach(element => {
        if (element !== '') {
          pArray.push(element);
        }
      });

      let lastPath = splited[6];
      orderId = pArray[5]?.split('?')[0];

      if (!showSuccess) {
        showSuccess = true;
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
        }
        navigation.navigate('PaymentSuccess', {
          msg: 'Your Transaction has been Completed Successfully!',
        });
      }
    } else if (
      final_url[0].includes(APP_URL + 'home/fail')
    ) {
      if (!showFail) {
        showFail = true;
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
        }
        navigation.navigate('PaymentSuccess', {
          msg: 'Your Payment Transaction is Failed!',
        });
      }
    }
  };

  return (
    <View style={{height: '100%', width: '100%'}}>
      {/* <Global.GlobalHeader
                name={'Complete payment'}
                onPressBack={() => navigation.goBack()}
                hideCart={true}
            /> */}
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{
          uri: decodeURIComponent(route.params.paymentLink),
        }}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onMessage={message => {
          //console.log('====================================');
          console.log('message', message);
          //console.log('====================================');
        }}
        // onError={error => {
        //   //console.log('onErrr', error);
        // }}
        // onHttpError={error => {
        //   //console.log('onHttpError', error);
        // }}
      />

      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType={'fade'}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: GlobalInclude.GlobalColor.lightGrayColor,
              height: scale(320),
              width: '90%',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
              alignSelf: 'center',
              borderRadius: scale(8),
            }}>
            <Text
              style={{
                fontSize: scale(18),
                textAlign: 'center',
                color: GlobalInclude.GlobalColor.themeYellow,
                fontFamily: GlobalInclude.GlobalFont.Bold,
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: scale(10),
                marginBottom: scale(5),
              }}>{`Your transaction is ${
              paymentStatus ? 'Successful' : 'Failed'
            }`}</Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text style={styles.cashdearttext}>Your payment transaction</Text>
              <Text
                text={'has been completed successfully!'}
                style={styles.cashaccounttext}
              />
            </View>
            <View style={{alignSelf: 'center', marginTop: scale(6)}}>
              <Text
                style={styles.paytext}>{`Your payment transaction worth' +    
                                    parseFloat(route.params.totalAmount)  ${
                                      paymentStatus
                                        ? 'is successful'
                                        : 'is failed.\n\n please contact admin'
                                    }`}</Text>
              <View
                style={{
                  alignSelf: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginTop: scale(5),
                  marginBottom: scale(8),
                }}>
                <Text style={styles.paytext}>
                  Please note your transaction Id
                </Text>
                <Text style={styles.transactionId}>{transactionId}</Text>
                <Text style={styles.paytext}>Save it for future use!</Text>
              </View>
            </View>

            <GlobalInclude.GlobalButton
              text={'Okay'}
              onPress={() => {
                setShowPaymentModal(false);
                // if (paymentStatus) {
                //     if (route?.params?.isFrom == "wallet") {
                //         setTimeout(() => {
                //             navigation.navigate('MyWallet');
                //         }, 500);
                //     } else {

                //         completeOrder();
                //     }
                // } else {
                // navigation.goBack();
                Global.showToast('Success payment');
                // }
              }}
              textStyle={styles.cancelbuttontextstyle}
              style={styles.cancelbuttonstyle}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cancelbuttontextstyle: {
    color: GlobalInclude.GlobalColor.themeWhite,
    fontSize: scale(18),
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  leftview: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  cashdearttext: {
    fontSize: scale(15),
    textAlign: 'center',
    color: GlobalInclude.GlobalColor.themeYellow,
    fontFamily: GlobalInclude.GlobalFont.Regular,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cashaccounttext: {
    fontSize: scale(14),
    textAlign: 'center',
    marginLeft: scale(5),
    color: GlobalInclude.GlobalColor.themeYellow,
    fontFamily: GlobalInclude.GlobalFont.Bold,
  },

  paytext: {
    fontSize: scale(14),
    textAlign: 'center',
    color: GlobalInclude.GlobalColor.black,
    fontFamily: GlobalInclude.GlobalFont.Regular,
  },
  transactionId: {
    fontSize: scale(16),
    textAlign: 'center',
    color: GlobalInclude.GlobalColor.themeYellow,
    fontFamily: GlobalInclude.GlobalFont.SemiBold,
  },
  cancelbuttonstyle: {
    backgroundColor: GlobalInclude.GlobalColor.themeYellow,
    borderRadius: scale(25),
    height: scale(45),
    width: scale(160),
    alignSelf: 'center',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentScreen;
