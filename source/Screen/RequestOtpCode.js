/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Keyboard, Text
} from 'react-native';
import Global from '../Global/globalinclude';
import { scale } from '../Theme/Scalling';
import helper from '../Global/Helper/helper';
import OtpInputs from 'react-native-otp-inputs';
import CountDown from 'react-native-countdown-component';
import { Card, Spinner } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import { API_KEY, APP_URL } from '../Global/config';
import {
    NavigationContainer,
    CommonActions,
    StackActions,
} from '@react-navigation/native';
let requestPayload = null;
let currentAuthCode = '';
let authCode = '';
let errText = '';
let imageresponse = null;
let uploadagreementresponse = null;
const RequestOtpCode = ({ route, navigation }) => {
    const [currentView, setCurrentView] = useState(2);
    const [timerFinish, setTimerFinish] = useState(false);
    const [timerValue, setTimerValue] = useState(60);
    const [is_loading,setIsLoading] = useState(false)

    const [errModal, setErrModal] = useState(false);
    useEffect(() => {
        if (route.params !== undefined && route.params !== null) {
            requestPayload = route.params.data;
            imageresponse = route.params.imageresponse
            uploadagreementresponse = route.params.uploadagreementresponse

            setCurrentView(1);
        }
        return () => { };
    }, [route.params]);

    const sendAuthenticationCode = () => {
        authCode = '';
        if (requestPayload === undefined || requestPayload === undefined) {
            return;
        }
        global.global_loader_reff.show_loader(1);
        let checkUser = {
            mobile_number: requestPayload.mobile_number,
        };
        console.log(checkUser);
        helper.UrlReq('api/send_otp', 'POST', checkUser).then((res) => {
            console.log(res, "ress resend");
            global.global_loader_reff.show_loader(0);
            if (res.status) {
                // currentAuthCode = res.otp;
                Global.showToast(res.message)
                setTimerValue(60)

                global.global_loader_reff.show_loader(0);
            } else {
                global.global_loader_reff.show_loader(0);
                Global.showError(res.message)
            }
        })

    };

    const verifyAuthenticationCode = () => {
       
        UserExists()


    };
    const UserExists = () => {

        global.global_loader_reff.show_loader(1);
        let checkobj = {
            email: requestPayload.email,
            mobile_number: requestPayload.mobile_number,
        }
        console.log(checkobj);
        helper.UrlReq('api/user/user_exist', 'POST', checkobj).then((res) => {
            console.log(res, "ressxxxxxxxxxxxxxxxxxxx");
          
            if (res.status) {
                // global.global_loader_reff.show_loader(0);
                doneCheck()
            } else {
               
                global.global_loader_reff.show_loader(0);
                Global.showError(res.message)
            }
           
        }).catch((c) => {
            console.log("c",c)
            global.global_loader_reff.show_loader(0);
        }).finally((f) => {
            console.log("finally",f)
            global.global_loader_reff.show_loader(0);
        })
    }
    const doneCheck = () => {
        global.global_loader_reff.show_loader(1);
        let verifyObj = {
            mobile_number: requestPayload.mobile_number,
            otp: authCode.toString()
        }
        console.log(verifyObj, "=========REQUEST OBJECT verify_otp api");
        helper.UrlReq('api/send_otp/verify_otp', 'POST', verifyObj).then((res) => {
            console.log(res, "======RESPONSE");
            if (res.status) {
                global.global_loader_reff.show_loader(0);
                nowSignup()
            } else {
                global.global_loader_reff.show_loader(0);
                Global.showError(res.message)
            
                // global.global_loader_reff.show_loader(0);
            }
        }).catch((c) => {
            console.log("errrrr",c.message)
            global.global_loader_reff.show_loader(0);
        }).finally((f) => {
            global.global_loader_reff.show_loader(0);
        })

    }
    const nowSignup = () => {
        setIsLoading(1)
        //  global.global_loader_reff.show_loader(1);
        // setTimerFinish(true);
        // setTimerValue(0);
        let signup_api_url = APP_URL + 'api/user/signup';
        const body = [];
        let is_pdf_agreement = false ,is_pdf_cv = false;
         if (route.params !== undefined && route.params !== null) {
            requestPayload = route.params.data;
            imageresponse = route.params.imageresponse
            uploadagreementresponse = route.params.uploadagreementresponse
             is_pdf_agreement = route.params.is_pdf_agreement;
             is_pdf_cv = route.params.is_pdf_cv;
        }
   
        console.log('authCode.toString()', authCode.toString());
        console.log('authCode.toString()', currentAuthCode);
        // if (authCode.toString().length < 4) {
        //     Global.showError('Auth code is not valid');
        // } else if (parseInt(authCode, 10) !== parseInt(currentAuthCode, 10)) {
        //     Global.showError('Auth code is not matched');
        // } else {
   
        const signupstring = JSON.stringify(requestPayload);
        body.push({ name: 'data', data: signupstring });
        let imageDetail = null;
     
     
         if (imageresponse !== null) {
            imageDetail = JSON.parse(JSON.stringify(imageresponse));
        }
       
        if (imageDetail !== null) {
            let path = ''
            if(is_pdf_cv){
                 path = imageDetail.uri;
            }else{
                 path = imageDetail[0].uri;
            }
       
            let imageName = '';
            if(is_pdf_cv){
                if (
                    imageDetail.name === undefined ||
                    imageDetail.name == null ||
                    imageDetail.name === ''
                ) {
                    var getFilename = path.split('/');
                    imageName = getFilename[getFilename.length - 1];
                    var extension = imageName.split('.')[1];
                    imageName = new Date().getTime() + '.' + extension;
                } else {
                    imageName = imageDetail.name;
                }
            }else{
                if (
                    imageDetail[0].fileName === undefined ||
                    imageDetail[0].fileName == null ||
                    imageDetail[0].fileName === ''
                ) {
                    var getFilename = path.split('/');
                    imageName = getFilename[getFilename.length - 1];
                    var extension = imageName.split('.')[1];
                    imageName = new Date().getTime() + '.' + extension;
                } else {
                    imageName = imageDetail[0].fileName;
                }
            }
            let imagePath =
                Platform.OS === 'ios' ? path.replace('file://', '') : path;
            let imageType = is_pdf_cv  ? imageDetail.type : imageDetail[0].type;
            var imageData = {
                name: 'document',
                filename: imageName,
                type: imageType,
                data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
            };
            body.push(imageData);
        }
        if (uploadagreementresponse !== null) {
            let contractDetail = null;
            if (uploadagreementresponse !== null) {
                contractDetail = JSON.parse(JSON.stringify(uploadagreementresponse));
            }
            if (contractDetail !== null) {
                let path = ''
                if(is_pdf_agreement){
                    path = contractDetail.uri;
               }else{
                    path = contractDetail[0].uri;
               }
                
                let contractName = '';
                if(is_pdf_agreement){
                    if (
                        contractDetail.name === undefined ||
                        contractDetail.name == null ||
                        contractDetail.name === ''
                    ) {
                        var getFilename = path.split('/');
                        contractName = getFilename[getFilename.length - 1];
                        var extension = contractName.split('.')[1];
                        contractName = new Date().getTime() + '.' + extension;
                    } else {
                        contractName = contractDetail.name;
                    }
                }else{
                    if (
                        contractDetail[0].fileName === undefined ||
                        contractDetail[0].fileName == null ||
                        contractDetail[0].fileName === ''
                    ) {
                        var getFilename = path.split('/');
                        contractName = getFilename[getFilename.length - 1];
                        var extension = contractName.split('.')[1];
                        contractName = new Date().getTime() + '.' + extension;
                    } else {
                        contractName = contractDetail[0].fileName;
                    }
                }
                let contractPath =
                    Platform.OS === 'ios' ? path.replace('file://', '') : path;
                let contractType = is_pdf_agreement ?  contractDetail.type : contractDetail[0].type;
                var contractData = {
                    name: 'work_permit_document',
                    filename: contractName,
                    type: contractType,
                    data: RNFetchBlob.wrap(decodeURIComponent(contractPath)),
                };
                body.push(contractData);
            }
        }
       
        console.log("SIGNUPP", body)
        RNFetchBlob.
        config({timeout:40000}).
        fetch(
            'POST',
            signup_api_url,
            {
                apikey: API_KEY,
            },
            body,
        )
            .then(res => {
                let bodyData = JSON.parse(res.data);
                let response = bodyData;
                console.log(response, "SIGNUPP");
                if (response.status) {
                  
                    errText = response.message;
                    setErrModal(true);
                    setTimeout(() => {
                        setIsLoading(0)
                    }, 20000);
                    
                   
                } else {
                    Global.showError(response.message);
                    setIsLoading(0)
                }
            })
            .catch(err => {
            
                setIsLoading(0)
            }).finally((f) => {
                console.log("errrrr",f)
                setIsLoading(0)
                // global.global_loader_reff.show_loader(0);
            })

        // }
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
                style={{ marginBottom: scale(0) }}
                showsVerticalScrollIndicator={false}>
                <Global.GlobalHeader onPress={() => navigation.goBack()} />
                <View style={styles.baseView}>

                    <Card style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Global.GlobalText text="Verification" />
                        </View>
                        <View style={{ padding: scale(12) }}>
                            <TouchableOpacity>
                                <Global.GlobalText
                                    text={"Please enter authentication code send to your registered mobile no"}
                                    style={styles.forgotText}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginTop: scale(10),
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    alignSelf: 'center',
                                }}>
                                <OtpInputs
                                    autofillFromClipboard={false}
                                    autofillListenerIntervalMS={500}

                                    handleChange={code => {
                                        authCode = code;
                                    }}
                                    numberOfInputs={4}
                                    clearTextOnFocus={true}
                                    style={{
                                        flexDirection: 'row',
                                        paddingHorizontal: scale(6),
                                        paddingVertical: scale(6),
                                        marginHorizontal: scale(3),
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        alignSelf: 'center',
                                    }}
                                    inputContainerStyles={{
                                        marginHorizontal: scale(3),
                                        height: scale(38),
                                        width: scale(38),
                                        borderRadius: scale(6),
                                        borderColor: Global.GlobalColor.themeBlue,
                                        borderWidth: 1,
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                    }}
                                    inputStyles={{
                                        fontFamily: Global.GlobalFont.Bold,
                                        color: Global.GlobalColor.themePink,
                                        textAlign: 'center',
                                        fontSize: scale(16),
                                        textAlignVertical: 'center',
                                        justifyContent: 'center',
                                    }}
                                />
                            </View>
                            {/* {timerFinish ? ( */}
                            <View
                                style={[
                                    {
                                        marginVertical: scale(15),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                    },
                                ]}>
                                <Text
                                    style={{

                                        fontFamily: Global.GlobalFont.Regular,
                                        color: Global.GlobalColor.darkBlue,
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        fontSize: scale(16),
                                        marginRight: scale(5),
                                    }}>
                                    Not get code yet?
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        sendAuthenticationCode();
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: Global.GlobalFont.Regular,
                                            color: Global.GlobalColor.themePink,
                                            alignItems: 'center',
                                            alignContent: 'center',
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            fontSize: scale(16), textDecorationLine: 'underline',
                                        }}>
                                        Resend
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {/* ) : ( */}
                            <View>
                                {timerValue > 0 ? (
                                    <View
                                        style={[
                                            {
                                                marginVertical: scale(15),
                                                alignItems: 'center',
                                                alignContent: 'center',
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                                marginTop: scale(-8), flexDirection: "row"
                                            },
                                        ]}>
                                        <Text
                                            style={{
                                                fontFamily: Global.GlobalFont.Regular,
                                                color: Global.GlobalColor.themePink,
                                                alignItems: 'center',
                                                alignContent: 'center',
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                                fontSize: scale(13),
                                            }}>
                                            Remaining Time
                                        </Text>
                                        <CountDown
                                            size={16}
                                            until={timerValue}
                                            onFinish={() => {
                                                setTimerFinish(true);
                                                setTimerValue(0);
                                            }}
                                            digitStyle={{
                                                textAlign: 'center',
                                                alignSelf: 'center',
                                                color: Global.GlobalColor.themeBlue,
                                            }}
                                            digitTxtStyle={{
                                                fontSize: scale(13),
                                                textAlign: 'center',
                                                alignSelf: 'center',
                                                color: Global.GlobalColor.themeBlue,
                                            }}
                                            separatorStyle={{
                                                color: Global.GlobalColor.themeBlue,
                                            }}
                                            style={{
                                                height: scale(20),
                                                alignItems: 'center',
                                                alignContent: 'center',
                                                alignSelf: 'center',
                                                justifyContent: 'center',
                                            }}
                                            timeToShow={['M', 'S']}
                                            timeLabels={{ m: null, s: null }}
                                            showSeparator={true}
                                        />
                                    </View>
                                ) : null}
                            </View>
                            {/* )} */}
                        </View>
                    </Card>
                    <View style={{ marginTop: scale(15), alignSelf: 'center' }}>
                        <Global.GlobalButton
                            text={'Submit'}
                            onPress={() => verifyAuthenticationCode()}
                        />
                    </View>
                </View>
                <Global.AlertModal
                    modalVisible={errModal}
                    subHeader={errText}
                    okButton={'OK'}
                    closeAction={() => {
                        setErrModal(false);
                        // navigation.navigate('Signin');
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: 'Signin' }],
                            }),
                        );
                    }}
                    okAction={() => {
                        setErrModal(false);
                        // navigation.navigate('Signin');
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [{ name: 'Signin' }],
                            }),
                        );
                    }}
                />
            </ScrollView>
            {is_loading ?
            <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* BEGIN METHOD FOR DISPLAY LOADER VIEW */}

        <Card
          style={{
            backgroundColor:'#728DBD',
            padding: scale(10),
            height: scale(70),
            justifyContent: 'center',
            width: scale(70),
            borderRadius: scale(10),
          }}>
          {/* <ActivityIndicator size="large" color={'white'} /> */}
          <Spinner color={"white"} />
        </Card>

        {/* END METHOD FOR DISPLAY LOADER VIEW */}
      </View> : null}
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
        height: scale(290),
        width: scale(285),

    },
    baseView: {
        alignContent: 'center',
        marginTop: scale(20),
    },
    cardHeader: {
        height: scale(60),
        backgroundColor: Global.GlobalColor.lightBlue,
        padding: scale(10),
        borderTopStartRadius: scale(15),
        borderTopEndRadius: scale(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotText: {
        paddingTop: scale(15),
        fontSize: scale(17),
        textAlign: 'center'
    },
});
export default RequestOtpCode;
