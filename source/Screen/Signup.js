/* eslint-disable no-dupe-keys */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Image,
  Modal,
  Dimensions,
  Button,
  TextInput,
} from 'react-native';
import { Card, Spinner } from 'native-base';
import { useVAT } from '../Context/vatContext';
import RNFetchBlob from 'rn-fetch-blob';
import CountryCodePicker from '../../CodePicker';
import countries from '../../country.json';
import Global from '../Global/globalinclude';
import { scale } from '../Theme/Scalling';
import moment from 'moment';
import {
  NavigationContainer,
  CommonActions,
  StackActions,
  useRoute
} from '@react-navigation/native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import helper from '../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { API_KEY } from '../Global/config';
import DocumentPicker from 'react-native-document-picker';
import { APP_URL } from '../Global/config';
import { Alert } from 'react-native';
let client_terms_and_conditions = '', nanny_privacy_policy = '', clients_privacy_policy = ''
let errText = '';
const options = {
  maxWidth: 720,
  maxHeight: 1024,
  allowsEditing: false,
  mediaType: 'photo',
  includeBase64: false,
  saveToPhotos: false,
  selectionLimit: 1,
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true,
  },
};
let USER_TYPE = [
  {
    type: '1',
    name: 'CLIENT',
  },
  {
    type: '2',
    name: 'NANNY',
  },
];
let is_pdf_agreement = false, is_pdf_cv = false;
const QuestionAnswer = ({
  title,
  onPressYes,
  onPressNo,
  sourceOfYes,
  sourceOfNo,
}) => {
  return (
    <View style={styles.questionBase}>
      <Global.GlobalText text={title} style={{ fontSize: scale(18) }} />
      <View style={styles.buttonBase}>
        <TouchableOpacity
          onPress={() => onPressYes()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={sourceOfYes}
            style={{ height: scale(20), width: scale(20) }}
            resizeMode={'contain'}
          />
          <Global.GlobalText
            text={'YES'}
            style={{ fontSize: scale(18), marginLeft: scale(5) }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPressNo()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: scale(30),
          }}>
          <Image
            source={sourceOfNo}
            style={{ height: scale(20), width: scale(20) }}
            resizeMode={'contain'}
          />
          <Global.GlobalText
            text={'NO'}
            style={{ fontSize: scale(18), marginLeft: scale(5) }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
let defaultCountry = countries[132];
const SignUp = props => {
  const route = useRoute()
  const { params } = route;
  const prevAddress = params ? params.address : null;
  const receivedCity = params ? params.city : null;
  const { addVAT, setAddVAT } = useVAT();
  const [updatedaddress, setUpdatedAddress] = useState('');
  const [mapcity, setMapCity] = useState('');
  const navigation = props.navigation;
  const [vatValue, setVatValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryImage, setSelectedCountryImage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [emailId, setEmail] = useState('');
  const [agreementVisible, setAgreementVisible] = useState(false)
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [area, setArea] = useState('');
  const [company_name, setCompany_name] = useState('');
  const [usertype, setUserType] = useState('1');
  const [terms, setTerms] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [imagepath, setImagePath] = React.useState('');
  const [imageresponse, setImageResponse] = React.useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [is_loading, setIsLoading] = useState(false)
  const [birthdate, setBirthDate] = useState('');
  const [experiance, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [date_of_certification, setDateOfCertification] = useState('');
  const [nationality, setNationality] = useState('');
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [course_certification, setCertificate] = useState('');
  const [experiance_new_born_baby, setExOfNewBornBaby] = useState('');
  const [work_permit, setWorkPermit] = useState('');
  const [in_possession_of_car, setPossessionOfCar] = useState('');
  const [uploadagreementfilename, setUploadAgreementFileName] = useState('');
  const [uploadagreementresponse, setUploadAgreementResponse] = useState(null);
  const [id_card_passport_number, setPassportnumber] = useState('');
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate())
  const [errModal, setErrModal] = useState(false);
  useEffect(() => {
    is_pdf_agreement = false;
    is_pdf_cv = false;
    setAddress();
    setBirthDate();
    setUploadAgreementFileName('');
    setCity('');
    setDateOfCertification('');
    setExperience();
    setPassword('');
    setConfirmpassword('');
    setQualification('');
    setNationality('');
    setPassportnumber('');
    setExOfNewBornBaby('');
    setWorkPermit('');
    setCertificate('');
    getTermsData()
    setPossessionOfCar('');
    for (let index = 0; index < countries.length; index++) {
      // console.log(countries[index])
      if (countries[index].callingCode === '356') {
        console.log(index);
      }
    }
    getSelectedCountry();
    const unsubscribe = navigation.addListener('focus', () => {
      // is_pdf_agreement =  false;
      // is_pdf_cv = false
      getSelectedCountry();
    });
    if (prevAddress) {
      setUpdatedAddress(prevAddress);
      AsyncStorage.setItem("address", updatedaddress)
    }
    if (receivedCity) {
      setMapCity(receivedCity);
      AsyncStorage.setItem("city", mapcity)
    }
    return () => {
      unsubscribe();
    };
  }, [prevAddress]);
  const getSelectedCountry = () => {
    AsyncStorage.getItem('country_code').then(value => {
      if (value !== null) {
        global.county_code_val = value.toString();
        setSelectedCountryCode(value.toString());
      } else {
        global.county_code_val = countries[132].callingCode;
        setSelectedCountryCode(countries[132].callingCode);
      }
    });
    AsyncStorage.getItem('flag_name').then(value => {
      if (value !== null) {
        global.flag_name_val = value.toString();
        setSelectedCountryImage(value.toString());
      } else {
        global.flag_name_val = countries[132].flag;
        setSelectedCountryImage(countries[132].flag);
      }
    });
  };

  const getTermsData = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqGet('api/cms_page')
      .then(res => {
        console.log(res)
        if (res.status) {
          nanny_privacy_policy = res.data.nanny_privacy_policy
          clients_privacy_policy = res.data.clients_privacy_policy
          client_terms_and_conditions = res.data.client_terms_and_conditions

          global.global_loader_reff.show_loader(0);
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .finally(f => {
        global.global_loader_reff.show_loader(0);
      });
  };

  const handleDatePicked = date => {
    var d = date;
    let selected = moment(d).format('YYYY-MM-DD');
    setBirthDate(selected);
    hideDateTimePicker();
  };
  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };
  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };
  const handleDate = date => {
    var d = date;
    let selected = moment(d).format('YYYY-MM-DD');
    setDateOfCertification(selected);
    hideDatePicker();
  };
  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };
  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };
  const uploadAgreement = async () => {
    if (Platform.OS === "android") {
      setAgreementVisible(!agreementVisible)
      setFilterVisible(false);
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res !== null) {
        is_pdf_agreement = true
        if (Platform.OS === "ios") {
          setAgreementVisible(!agreementVisible)
          setFilterVisible(false);
        }
        setUploadAgreementFileName(res.name);
        setUploadAgreementResponse(res);

      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const UploadCvPdf = async () => {
    if (Platform.OS === "android") {
      setAgreementVisible(false)
      setFilterVisible(false);
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res !== null) {
        is_pdf_cv = true;
        if (Platform.OS === "ios") {
          setAgreementVisible(false)
          setFilterVisible(false);
        }

        setImagePath(res.name);
        setImageResponse(res);
        console.log(res)

      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  const openFilter = visible => {
    // alert('openFilter');
    setFilterVisible(visible);
  };
  const openUploadAgreement = visible => {
    setAgreementVisible(visible)
  }
  const OpenGallery = (name) => {
    if (name === "agreement") {
      is_pdf_agreement = false;
    } else {
      is_pdf_cv = false;
    }
    setFilterVisible(false);
    setAgreementVisible(false);
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        if (name === "agreement") {
          setUploadAgreementFileName(response.assets[0].uri)
          setUploadAgreementResponse(response.assets)
        } else {
          setImageResponse(response.assets);
          setImagePath(response.assets[0].uri);
        }
      }
    });
  };
  const OpenCamera = (name) => {
    if (name === "agreement") {
      is_pdf_agreement = false;
    } else {
      is_pdf_cv = false;
    }


    setAgreementVisible(false)
    setFilterVisible(false);
    setTimeout(() => {
      launchCamera(
        {
          mediaType: 'photo',
          includeBase64: false,
        },
        response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else if (response.errorCode) {
          }
          else {
            if (name === "agreement") {
              setUploadAgreementFileName(response.assets[0].uri)
              setUploadAgreementResponse(response.assets)
            } else {
              setImageResponse(response.assets);
              setImagePath(response.assets[0].uri);
            }

          }
        },
      );
    }, 200);
  };
  const ValidationSignup = () => {

    // navigation.navigate("CompleteProfile")
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (firstname === '') {
      Global.showError('Please enter first name');
    } else if (lastname === '') {
      Global.showError('Please enter last name');
    } else if (emailId === '') {
      Global.showError('Please enter email address');
    } else if (reg.test(emailId) === false) {
      Global.showError('Please enter valid email address');
    }
    else if (mobile_number === '') {
      Global.showError('Please enter Mobile number');
    }
    else if (mobile_number.length < 8) {
      Global.showError('Please enter valid mobile number');
    }
    else if (area === '') {
      Global.showError('Please enter area');
    } else if (password === '') {
      Global.showError('Please enter password');
    } else if (confirmpassword === '') {
      Global.showError('Please enter confirm password');
    } else if (password !== confirmpassword) {
      Global.showError('Password and Confirm password not match');
    }
    else if (terms === 0) {
      if (usertype === '1') {
        Global.showError('Please Accept Terms & Condition And Privacy Policy');
      } else {
        Global.showError('Please Accept Privacy Policy');
      }

    }
    else {
      UserExists()
      //DoSignUp();
    }
  };

  const UserExists = () => {
    global.global_loader_reff.show_loader(1);
    let checkobj = {
      email: emailId,
      mobile_number: mobile_number,
      country_code: selectedCountryCode
    }
    console.log(checkobj, "ressxxxxxxxxxxxxxxxxxxx object");
    helper.UrlReq('api/user/user_exist', 'POST', checkobj).then((res) => {
      console.log(res, "response");
      global.global_loader_reff.show_loader(0);
      if (res.status) {
        DoSignUp()
        global.global_loader_reff.show_loader(0);
      } else {
        console.log("message:-->", res.message)
        global.global_loader_reff.show_loader(0);
        Global.showError(res.message)
      }
    }).catch((c) => {
      console.log("C", c)

      global.global_loader_reff.show_loader(0);
    }).finally((f) => {
      global.global_loader_reff.show_loader(0);
    })
  }
  const DoSignUp = () => {

    console.log("uploadagreementresponse", uploadagreementresponse)
    console.log("uploadagreementresponse", imageresponse)


    let signupObj = {
      user_type: usertype,
      device_type: Platform.OS,
      first_name: firstname,
      last_name: lastname,
      email: emailId,
      password: password,
      mobile_number: mobile_number,
      address: updatedaddress,
      city: mapcity,
      area: area,
      country_code: selectedCountryCode,
      company_name: company_name,
      terms_condition: terms ? '1' : '0',
      is_behalf_of_company: isShow ? '1' : '',
      date_of_birth: birthdate,
      experiance: experiance,
      qualification: qualification,
      cource_certification: course_certification === 'YES' ? 'Yes' : 'No',
      experiance_new_born_baby:
        experiance_new_born_baby === 'YES' ? 'Yes' : 'No',
      date_of_certification: date_of_certification,
      nationality: nationality,
      work_permit: work_permit === 'YES' ? 'Yes' : 'No',
      in_possession_of_car: in_possession_of_car === 'YES' ? 'Yes' : 'No',
      id_card_passport_number: id_card_passport_number,
    };
    let checkUser = {
      mobile_number: mobile_number,
    };
    console.log("signupObj", signupObj);
    nowSignup(signupObj)
    // helper.UrlReq('api/send_otp', 'POST', checkUser).then((res) => {
    //   console.log(res, "ress");
    //   global.global_loader_reff.show_loader(0);
    //   if (res.status) {
    //     Global.showToast(res.message)
    //     navigation.navigate('RequestOtpCode', { data: signupObj, imageresponse: imageresponse, uploadagreementresponse: uploadagreementresponse, mobile_number: mobile_number ,is_pdf_cv:is_pdf_cv,is_pdf_agreement:is_pdf_agreement});
    //     global.global_loader_reff.show_loader(0);
    //   } else {

    //     global.global_loader_reff.show_loader(0);
    //     Global.showError(res.message)
    //   }
    // })
  }


  const nowSignup = (signupObj) => {
    setIsLoading(1)
    //  global.global_loader_reff.show_loader(1);
    // setTimerFinish(true);
    // setTimerValue(0);
    let signup_api_url = APP_URL + 'api/user/signup';
    const body = [];

    let requestPayload = signupObj;
    const signupstring = JSON.stringify(requestPayload);
    body.push({ name: 'data', data: signupstring });
    let imageDetail = null;

    if (imageresponse !== null) {
      imageDetail = JSON.parse(JSON.stringify(imageresponse));
    }
    if (imageDetail !== null) {
      let path = ''
      if (is_pdf_cv) {
        path = imageDetail.uri;
      } else {
        path = imageDetail[0].uri;
      }

      let imageName = '';
      if (is_pdf_cv) {
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
      } else {
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
      let imageType = is_pdf_cv ? imageDetail.type : imageDetail[0].type;
      var imageData = {
        name: 'document',
        filename: imageName,
        type: imageType,
        data: RNFetchBlob.wrap(imagePath),
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
        if (is_pdf_agreement) {
          path = contractDetail.uri;
        } else {
          path = contractDetail[0].uri;
        }

        let contractName = '';
        if (is_pdf_agreement) {
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
        } else {
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
        let contractType = is_pdf_agreement ? contractDetail.type : contractDetail[0].type;
        var contractData = {
          name: 'work_permit_document',
          filename: contractName,
          type: contractType,
          data: RNFetchBlob.wrap(contractPath),
        };
        body.push(contractData);
      }
    }
    console.log("SIGNUPP", body)
    RNFetchBlob.
      config({ timeout: 40000 }).
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
          // Global.showError(response.message);
          errText = response.message;
          setErrModal(true);
          // setTimeout(() => {
          setIsLoading(0)
          // }, 20000);


        } else {
          Global.showError(response.message);
          setIsLoading(0)
        }
      })
      .catch(err => {

        setIsLoading(0)
      }).finally((f) => {
        console.log("errrrr", f)
        setIsLoading(0)
        // global.global_loader_reff.show_loader(0);
      })

    // }
  }
  const modalMessage = () => {
    if (usertype === "1") {
      return "You’re ready with the registration, you can now access your account"
    } else {
      return "Thanks for your application we will get back to you shortly by email"
    }
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, marginBottom: scale(60) }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.baseView}>
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Global.GlobalText text="ARE YOU REGISTERING AS" />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: scale(20),
                }}>
                {USER_TYPE.map(item => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.optionsView,
                        {
                          backgroundColor:
                            item.type === usertype
                              ? Global.GlobalColor.themeBlue
                              : 'white',
                        },
                      ]}
                      onPress={() => {
                        is_pdf_agreement = false;
                        is_pdf_cv = false;
                        setUserType(item.type);
                        setAddress();
                        setBirthDate();
                        setUploadAgreementFileName('');
                        setImagePath('');
                        setPassportnumber('');
                        setCity('');
                        setDateOfCertification('');
                        setEmail('');
                        setFirstname('');
                        setLastname('');
                        setExOfNewBornBaby('');
                        setWorkPermit('');
                        setCertificate('');
                        setPossessionOfCar('');
                        setPassword("")
                        setConfirmpassword("")
                        setQualification("")
                        setExperience("")
                        setNationality("")
                        setBirthDate("")
                      }}>
                      <Global.GlobalText
                        text={item.name}
                        style={[
                          styles.optionText,
                          {
                            color:
                              item.type === usertype
                                ? 'white'
                                : Global.GlobalColor.themeBlue,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              {usertype === '1' && (
                <View style={styles.checkboxBase}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(!isShow);
                    }}>
                    <Image
                      source={
                        isShow
                          ? Global.GlobalAssets.check
                          : Global.GlobalAssets.unCheck
                      }
                      style={{
                        height: scale(22),
                        width: scale(22),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <Global.GlobalText
                    text={'Are you requesting a nanny on behalf of a company?'}
                    numberOfLines={2}
                    style={[
                      styles.optionText,
                      {
                        paddingLeft: scale(10),
                        width: scale(230),
                        paddingTop: scale(10),
                      },
                    ]}
                  />
                </View>
              )}
            </Card>
            {/* <View
              style={{
                position: 'absolute',
                right: -1,
                top: Dimensions.get('screen').width - 20,
                zIndex: 1
              }}>
              <Image
                source={Global.GlobalAssets.scrollBg}
                style={{
                  height: scale(200),
                  width: scale(12),
                  resizeMode: 'contain',
                }}
              />
          </View> */}
            <View style={{ width: scale(300), alignItems: 'center' }}>
              <Global.GlobalTextBox
                placeholder="ENTER FIRST NAME"
                onChangeText={value => setFirstname(value)}
                value={firstname}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <Global.GlobalTextBox
                placeholder="ENTER LAST NAME"
                onChangeText={value => setLastname(value)}
                value={lastname}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {isShow && (
                <Global.GlobalTextBox
                  placeholder="COMPANY NAME"
                  onChangeText={value => setCompany_name(value)}
                  value={company_name}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              )}
              <Global.GlobalTextBox
                placeholder="ENTER EMAIL ID"
                onChangeText={value => setEmail(value)}
                value={emailId}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {showPicker ? (
                <CountryCodePicker
                  action={item => {
                    if (item != null) {
                      let countryName = item.name;
                      let callingCode = item.callingCode;
                      global.county_code_val = item.callingCode;
                      global.flag_name_val = item.flag;
                      global.country_name = countryName;
                      AsyncStorage.setItem('country_code', item.callingCode);
                      AsyncStorage.setItem('flag_name', item.flag);
                      setSelectedCountryCode(item.callingCode);
                      setSelectedCountryImage(item.flag);
                      setSelectedCountry(item)
                      setShowPicker(!showPicker);
                    } else {
                      global.county_code_val = '';
                      global.country_name = '';
                      global.flag_name_val = '';
                      setSelectedCountryCode('');
                      AsyncStorage.setItem('country_code', '');
                      AsyncStorage.setItem('flag_name', '');
                      setSelectedCountryImage('');
                      setSelectedCountry(item)
                      setShowPicker(!showPicker);
                    }
                  }}
                  close={() => {
                    setShowPicker(!showPicker);
                  }}
                />
              ) : null}
              <View style={{ marginVertical: 10, alignItems: 'flex-start' }}>
                <View style={styles.maintextinputView}>
                  <TouchableOpacity
                    style={{
                      width: '37%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 5,
                      height: '96%',
                    }}
                    onPress={() => {
                      setShowPicker(true);
                    }}>
                    <View activeOpacity={1} style={styles.countrymainView}>
                      {selectedCountryImage !== '' ? (
                        <Image
                          source={{ uri: selectedCountry.flag }}
                          style={styles.flag}
                        />
                      ) : null}
                      <Text style={styles.countryTextStyle}>
                        {' + ' + selectedCountry.callingCode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ width: '69%', marginLeft: scale(-30) }}>
                    <Global.GlobalTextBox
                      placeholder="ENTER MOBILE NUMBER"
                      onChangeText={value => setMobileNumber(value)}
                      value={mobile_number}
                      onSubmitEditing={() => Keyboard.dismiss()}
                      maxLength={15}
                      // maxLength={10}
                      keyboardType={'numeric'}
                      viewStyle={{
                        borderWidth: 0,
                        marginTop: scale(5),
                        width: '100%',
                      }}
                    />
                  </View>
                </View>
              </View>
              {usertype === '1' && (
                <>
                  <Global.GlobalTextBox
                    placeholder="ENTER ADDRESS"
                    onChangeText={value => setUpdatedAddress(value)}
                    value={updatedaddress}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <Global.GlobalTextBox
                    placeholder="ENTER CITY"
                    onChangeText={value => setMapCity(value)}
                    value={mapcity}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('SignupLocation');
                    }}
                    style={styles.location}>
                    <Image
                      source={Global.GlobalAssets.crossIcon}
                      style={{
                        height: scale(17),
                        width: scale(17),
                        marginVertical: 5,
                        marginLeft: 5,
                      }}
                      resizeMode={'contain'}
                    />
                    <Global.GlobalText
                      text="Use Current location"
                      style={{ fontSize: 15, margin: 5, color: '#FF818D' }}
                    />
                  </TouchableOpacity>
                </>
              )}
              <View style={{
                ...(Platform.OS !== 'android' && {
                  zIndex: 10,
                }),
              }}
              >
                <DropDownPicker
                  items={usertype === '1' ? ([
                    { id: 1, label: 'North', value: 'North' },
                    { id: 2, label: 'Central', value: 'Central' },
                    { id: 3, label: 'South', value: 'South' },

                  ]) : (
                    [
                      { id: 1, label: 'North', value: 'North' },
                      { id: 2, label: 'Central', value: 'Central' },
                      { id: 3, label: 'South', value: 'South' },
                      { id: 4, label: 'All Malta', value: 'All' }
                    ]
                  )}
                  value={area}
                  containerStyle={{
                    width: scale(280),
                    alignSelf: 'center',
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                    height: scale(35),
                  }}
                  style={styles.dropStyle}
                  labelStyle={{
                    color: Global.GlobalColor.themePink,
                    fontFamily: Global.GlobalFont.Regular,
                    fontSize: scale(18),
                  }}
                  activeLabelStyle={{
                    color: Global.GlobalColor.themePink,
                    fontFamily: Global.GlobalFont.Regular,
                    fontSize: scale(15),
                  }}
                  onChangeItem={item => {
                    setArea(item.value);
                  }}
                  placeholder={'PREFER AREA'}
                  placeholderStyle={{
                    fontFamily: Global.GlobalFont.Regular,
                    color: '#FFD2D6',
                  }}
                  arrowColor={Global.GlobalColor.themePink}
                />
              </View>
              <Global.GlobalTextBox
                placeholder="ENTER PASSWORD"
                onChangeText={value => setPassword(value)}
                value={password}
                onSubmitEditing={() => Keyboard.dismiss()}
                secureTextEntry={true}
              />
              <Global.GlobalTextBox
                placeholder="ENTER CONFIRM PASSWORD"
                onChangeText={value => setConfirmpassword(value)}
                value={confirmpassword}
                onSubmitEditing={() => Keyboard.dismiss()}
                secureTextEntry={true}
              />
              {usertype === '2' && (
                <>
                  <Global.GlobalTextBox
                    placeholder="ENTER QUALIFICATION"
                    onChangeText={value => setQualification(value)}
                    value={qualification}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <Global.GlobalTextBox
                    placeholder="ENTER EXPERIENCE"
                    onChangeText={value => setExperience(value)}
                    value={experiance}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <QuestionAnswer
                    title={'FIRST AID COURSE CERTIFICATION'}
                    onPressYes={() => setCertificate('YES')}
                    onPressNo={() => setCertificate('NO')}
                    sourceOfYes={
                      course_certification === 'YES'
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                    sourceOfNo={
                      course_certification === 'NO'
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                  />
                  {course_certification === 'YES' && (
                    <TouchableOpacity
                      style={[
                        styles.SectionStyle,
                        { justifyContent: 'space-between' },
                      ]}
                      onPress={showDatePicker}>
                      <DateTimePicker
                        isVisible={isDatePickerVisible}
                        onConfirm={handleDate}
                        onCancel={hideDatePicker}
                        maximumDate={tomorrow}
                      />
                      <TouchableOpacity onPress={showDatePicker}>
                        {date_of_certification ? (
                          <Global.GlobalText
                            style={{
                              color: Global.GlobalColor.themePink,
                              fontFamily: Global.GlobalFont.Regular,
                              fontSize: scale(18),
                            }}
                            text={date_of_certification}
                          />
                        ) : (
                          <Global.GlobalText
                            style={{
                              color: Global.GlobalColor.lightPink,
                              fontFamily: Global.GlobalFont.Regular,
                              fontSize: scale(18),
                            }}
                            text={'DATE OF CERTIFICATION'}
                          />
                        )}
                      </TouchableOpacity>
                      <Image
                        source={Global.GlobalAssets.calendar}
                        style={styles.textinput_imageView}
                      />
                    </TouchableOpacity>
                  )}
                  <QuestionAnswer
                    title={'EXPERIENCE WITH NEW BORN BABY'}
                    onPressYes={() => setExOfNewBornBaby('YES')}
                    onPressNo={() => setExOfNewBornBaby('NO')}
                    sourceOfYes={
                      experiance_new_born_baby === 'YES'
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                    sourceOfNo={
                      experiance_new_born_baby === 'NO'
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                  />
                  <Global.GlobalTextBox
                    placeholder="NATIONALITY"
                    onChangeText={value => setNationality(value)}
                    value={nationality}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <TouchableOpacity
                    style={[
                      styles.SectionStyle,
                      { justifyContent: 'space-between' },
                    ]}
                    onPress={showDateTimePicker}>
                    <DateTimePicker
                      isVisible={isDateTimePickerVisible}
                      onConfirm={handleDatePicked}
                      onCancel={hideDateTimePicker}
                      maximumDate={new Date()}
                    />
                    <TouchableOpacity onPress={showDateTimePicker}>
                      {birthdate ? (
                        <Global.GlobalText
                          style={{
                            color: Global.GlobalColor.themePink,
                            fontFamily: Global.GlobalFont.Regular,
                            fontSize: scale(18),
                          }}
                          text={birthdate}
                        />
                      ) : (
                        <Global.GlobalText
                          style={{
                            color: Global.GlobalColor.lightPink,
                            fontFamily: Global.GlobalFont.Regular,
                            fontSize: scale(18),
                          }}
                          text={'DATE OF BIRTH'}
                        />
                      )}
                    </TouchableOpacity>
                    <Image
                      source={Global.GlobalAssets.calendar}
                      style={styles.textinput_imageView}
                    />
                  </TouchableOpacity>
                  <QuestionAnswer
                    title={'WORK PERMIT'}
                    onPressYes={() => setWorkPermit('YES')}
                    onPressNo={() => setWorkPermit('NO')}
                    sourceOfYes={
                      work_permit === 'YES'
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                    sourceOfNo={
                      work_permit === 'NO'
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                  />
                  {usertype === '2' && work_permit === 'YES' && (

                    <View>
                      <TouchableOpacity
                        style={[
                          styles.uploadBase,
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                          },
                        ]}
                        onPress={() => openUploadAgreement(true)}>
                        <View style={styles.contractView}>
                          {uploadagreementfilename === '' ? (
                            <Global.GlobalText
                              text={'WORK PERMIT DOCUMENT'}
                              style={{
                                fontSize: scale(15),
                                color: Global.GlobalColor.lightPink,
                              }}
                            />
                          ) : (
                            is_pdf_agreement ? (
                              <Global.GlobalText
                                text={uploadagreementfilename}
                                style={{
                                  fontSize: scale(15),
                                  color: Global.GlobalColor.themePink,
                                }}
                              />
                            )
                              :
                              (
                                <Global.GlobalText
                                  text={'WORK PERMIT DOCUMENT'}
                                  style={{
                                    fontSize: scale(15),
                                    color: Global.GlobalColor.lightPink,
                                  }}
                                />
                              )

                          )




                          }
                        </View>


                        <View style={styles.downloadView}>
                          <Image
                            style={styles.downloadImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.uploadIcon}
                          />
                        </View>
                      </TouchableOpacity>


                      {uploadagreementfilename !== "" && !is_pdf_agreement && (
                        <View style={{
                          height: scale(120),
                          width: scale(280),
                        }}>
                          {!is_pdf_agreement && (
                            <Image
                              source={{ uri: uploadagreementfilename }}
                              style={{
                                height: scale(120),
                                width: scale(280),
                                alignSelf: 'center',
                              }}
                            />
                          )
                          }
                        </View>
                      )}
                    </View>
                  )}
                  <QuestionAnswer
                    title={'IN POSSESSION OF CAR'}
                    onPressYes={() => setPossessionOfCar('YES')}
                    onPressNo={() => setPossessionOfCar('NO')}
                    sourceOfYes={
                      in_possession_of_car === 'YES'
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                    sourceOfNo={
                      in_possession_of_car === 'NO'
                        ? Global.GlobalAssets.radioActive
                        : Global.GlobalAssets.radio
                    }
                  />
                </>
              )}
              {usertype === '1' ? (
                <Global.GlobalTextBox
                  placeholder="PASSPORT/ID CARD NUMBER "
                  onChangeText={value => setPassportnumber(value)}
                  value={id_card_passport_number}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              ) : (
                <TouchableOpacity
                  style={styles.uploadBase}
                  onPress={() => openFilter()}>
                  {imagepath !== "" && !is_pdf_cv ?
                    (
                      <Global.GlobalText
                        text={'UPLOAD CV'}
                        style={{
                          fontSize: scale(18),
                          color: Global.GlobalColor.lightPink,
                        }}
                      />
                    ) : (
                      is_pdf_cv ? (
                        <Global.GlobalText
                          text={imagepath}
                          style={{
                            fontSize: scale(15),
                            color: Global.GlobalColor.themePink,
                          }}
                        />
                      )
                        :
                        (
                          <Global.GlobalText
                            text={'UPLOAD CV'}
                            style={{
                              fontSize: scale(15),
                              color: Global.GlobalColor.lightPink,
                            }}
                          />
                        )

                    )}
                </TouchableOpacity>
              )}
              {usertype === '1' && (
                <>
                  <View
                    style={{ ...styles.checkboxBase, marginVertical: scale(10) }}>
                    <TouchableOpacity
                      onPress={() => {
                        setAddVAT(!addVAT);
                      }}>
                      <Image
                        source={
                          addVAT
                            ? Global.GlobalAssets.check
                            : Global.GlobalAssets.unCheck
                        }
                        style={{
                          height: scale(22),
                          width: scale(22),
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                    <Global.GlobalText
                      text={'ADD VAT'}
                      numberOfLines={2}
                      style={[
                        styles.optionText,
                        {
                          fontFamily: Global.GlobalFont.Bold,
                          fontSize: scale(12),
                          marginHorizontal: scale(10),
                        },
                      ]}
                    />
                  </View>
                  <View>
                    {addVAT && (
                      <View style={{ width: scale(300), alignItems: 'center' }}>
                        <Global.GlobalTextBox
                          placeholder="ENTER VAT NUMBER"
                          onChangeText={value => setVatValue(value)}
                          value={vatValue}
                          style={{ height: 40 }}
                          onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>
                    )}
                  </View>
                </>
              )}
              {imagepath !== '' && !is_pdf_cv && (
                <View>
                  {!is_pdf_cv ? (
                    <Image
                      source={{ uri: imagepath }}
                      style={{
                        height: scale(120),
                        width: scale(280),
                        alignSelf: 'center',
                      }}
                    />
                  ) :
                    null
                  }
                </View>
              )}
              <View style={styles.checkboxBase}>
                <TouchableOpacity
                  onPress={() => {
                    setTerms(!terms);
                  }}>
                  <Image
                    source={
                      terms
                        ? Global.GlobalAssets.check
                        : Global.GlobalAssets.unCheck
                    }
                    style={{
                      height: scale(20),
                      width: scale(20),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                {usertype === '1' ?
                  <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: Global.GlobalColor.themeBlue, marginLeft: scale(3), width: '100%' }}>

                    <TouchableOpacity onPress={() => navigation.navigate('PdfView', { pdf_url: client_terms_and_conditions })}>
                      <Global.GlobalText
                        text={'ACCEPT TERMS & CONDITION'}
                        style={[
                          styles.optionText,
                          { fontFamily: Global.GlobalFont.Bold, fontSize: scale(12) },
                        ]}
                      />
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => navigation.navigate('PdfView', { pdf_url: clients_privacy_policy })}>
                      <Global.GlobalText
                        text={' AND PRIVACY POLICY'}
                        style={[
                          styles.optionText,
                          { fontFamily: Global.GlobalFont.Bold, fontSize: scale(12) },
                        ]}
                      />
                    </TouchableOpacity>

                  </View>
                  :
                  <TouchableOpacity
                    style={{ borderBottomWidth: 1, borderColor: Global.GlobalColor.themeBlue, marginLeft: scale(7) }}
                    onPress={() => navigation.navigate('PdfView', { pdf_url: nanny_privacy_policy })}>
                    <Global.GlobalText
                      text={'ACCEPT PRIVACY POLICY'}
                      style={[
                        styles.optionText,
                        { fontFamily: Global.GlobalFont.Bold, fontSize: scale(13) },
                      ]}
                    />
                  </TouchableOpacity>


                }

              </View>
              <View style={{ marginTop: scale(15) }}>
                <Global.GlobalButton
                  text={'Register'}
                  onPress={() => ValidationSignup()}
                />
                <Global.GlobalButton
                  text={'Login'}
                  style={{ backgroundColor: Global.GlobalColor.themeBlue }}
                  onPress={() => {
                    navigation.navigate('Signin');
                    setUserType('');
                    setAddress();
                    setBirthDate();
                    setUploadAgreementFileName('');
                    setImagePath('');
                    setCertificate('');
                    setCity('');
                    setDateOfCertification('');
                    setEmail('');
                    setFirstname('');
                    setLastname('');
                    setExperience();
                    setPassportnumber('');
                  }}
                />
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={filterVisible}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    onPress={() => openFilter(false)}
                    style={styles.modalCloseBtn}>
                    <Image
                      source={Global.GlobalAssets.close}
                      resizeMode={'contain'}
                      style={{ height: scale(15), width: scale(20) }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        color: Global.GlobalColor.themePink,
                        marginTop: scale(-30),
                      },
                    ]}>
                    Upload Document
                  </Text>
                  <TouchableOpacity
                    onPress={() => OpenGallery("")}
                    style={styles.optionBase}>
                    <Text style={styles.modalText}>Choose From Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => OpenCamera("")}
                    style={styles.optionBase}>
                    <Text style={styles.modalText}>Open Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => UploadCvPdf()}
                    style={styles.optionBase}>
                    <Text style={styles.modalText}>Upload Document</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>


            <Modal
              animationType="slide"
              transparent={true}
              visible={agreementVisible}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    onPress={() => openUploadAgreement(false)}
                    style={styles.modalCloseBtn}>
                    <Image
                      source={Global.GlobalAssets.close}
                      resizeMode={'contain'}
                      style={{ height: scale(15), width: scale(20) }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        color: Global.GlobalColor.themePink,
                        marginTop: scale(-30),
                      },
                    ]}>
                    Upload Work Permit Document
                  </Text>
                  <TouchableOpacity
                    onPress={() => OpenGallery("agreement")}
                    style={styles.optionBase}>
                    <Text style={styles.modalText}>Choose From Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => OpenCamera("agreement")}
                    style={styles.optionBase}>
                    <Text style={styles.modalText}>Open Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => uploadAgreement()}
                    style={styles.optionBase}>
                    <Text style={styles.modalText}>Upload Document</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>


          </View>
          {/* <Global.AlertModal
            modalVisible={errModal}
            subHeader={errText}
            okButton={'OK'}
            closeAction={() => {
              setErrModal(false);
              navigation.navigate('Signin');
            }}
            okAction={() => {
              setErrModal(false);
              navigation.navigate('Signin');
            }}
          /> */}

          <Global.AlertModal
            modalVisible={errModal}
            subHeader={modalMessage()}
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
      </KeyboardAvoidingView>

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
              backgroundColor: '#728DBD',
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
  bgImg: {
    height: '109%',
    width: '100%',
    alignItems: 'center',
    marginTop: scale(-5),
  },
  maintextinputView: {
    height: scale(55),
    borderRadius: scale(5),
    borderWidth: 2,
    borderColor: Global.GlobalColor.borderColor,
    // width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    width: scale(280),
    backgroundColor: 'white',
  },
  flag: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    borderRadius: 0,
  },
  countrymainView: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginStart: scale(5),
  },
  countryTextStyle: {
    alignContent: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: scale(10),
    textAlignVertical: 'center',
  },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    height: scale(200),
    width: scale(285),
  },
  questionBase: {
    backgroundColor: 'white',
    width: scale(280),
    height: scale(70),
    paddingVertical: scale(8),
    paddingLeft: scale(15),
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Global.GlobalColor.borderColor,
    borderRadius: 5,
    marginVertical: scale(8),

  },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(50),
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
  optionText: {
    color: Global.GlobalColor.themeBlue,
    fontSize: scale(15),
  },
  optionsView: {
    backgroundColor: 'white',
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
    paddingVertical: scale(12),
    borderWidth: 1,
    borderColor: Global.GlobalColor.themeBlue,
  },
  itemStyle: {
    justifyContent: 'flex-start',
    height: scale(30),
  },
  dropStyle: {
    backgroundColor: 'white',
    height: scale(50),
    width: scale(280),
    marginVertical: scale(8),
    alignSelf: 'center',
    borderColor: '#bcd8f6',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
  },
  checkboxBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginLeft: scale(10),
    marginTop: scale(10),
  },
  uploadBase: {
    backgroundColor: 'white',
    height: scale(55),
    width: scale(280),
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#bcd8f6',
    borderRadius: scale(5),
    borderStyle: 'solid',
    marginVertical: scale(10),
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: scale(18),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    opacity: 1,
    backgroundColor: '#00000080',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: scale(50),
  },
  button: {
    borderRadius: scale(20),
    padding: scale(10),
    elevation: 2,
  },
  modalText: {
    marginTop: 0,
    padding: scale(10),
    textAlign: 'center',
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(22),
    fontStyle: 'normal',
    color: Global.GlobalColor.themeBlue,
    paddingHorizontal: scale(3),
  },
  optionBase: {
    marginTop: scale(10),
    elevation: 8,
    shadowColor: Global.GlobalColor.themeBlue,
    shadowRadius: 10,
    shadowOpacity: 1,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  modalCloseBtn: {
    backgroundColor: Global.GlobalColor.themePink,
    paddingHorizontal: scale(10),
    paddingVertical: scale(13),
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'white',
    position: 'absolute',
    zIndex: 1,
    right: scale(0),
    top: scale(-15),
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(55),
    width: scale(280),
    marginVertical: scale(10),
    borderColor: '#bcd8f6',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingLeft: scale(15),
  },
  textinput_imageView: {
    height: scale(20),
    width: scale(20),
    marginEnd: '5%',
  },
  buttonBase: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: scale(5),
  },
  downloadImage: {
    width: scale(20),
    height: scale(20),
  },
  downloadView: {
    width: '10%',
    alignItems: 'flex-end',
    paddingEnd: scale(5),
  },
  contractView: {
    width: '90%',
    paddingStart: scale(0),
  },
  location: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
    flexShrink: 1,
    borderStyle: 'solid',
    marginBottom: scale(5),
    width: '93%',
    borderRadius: 15,
    margin: scale(10),
    backgroundColor: 'white',
    borderColor: '#bcd8f6',
    alignSelf: "flex-start",
    width: "50%"
  },
});
export default SignUp;
