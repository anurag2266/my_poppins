import React, {useState, useEffect} from 'react';
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
  Image,
  Modal,
  Dimensions,
  TextInput,
  Switch,
  BackHandler,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Global from '../../../Global/globalinclude';
import HTMLView from 'react-native-htmlview';
import CountryCodePicker from '../../../../CodePicker';
import {scale} from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import {Card} from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {CommonActions} from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {API_KEY, APP_URL} from '../../../Global/config';
import countries from '../../../../country.json';
import Colors from '../../../Theme/Colors';
import CheckBox from 'react-native-check-box';
import Fonts from '../../../Theme/Fonts';
import { useVAT } from '../../../Context/vatContext';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import  FYI  from 'react-native-vector-icons/FontAwesome5';
const IMG_CONTAIN = 'contain';
const items = [1, 2];
let defaultCountry = countries[132];
let bookingData = null,
  helpDescription = '',
  childId = '',
  addressId = '',
  wishlistId = '',
  nannyName = '';
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

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routes = navigation.getState()?.routes;

  const prevRoute = routes[routes.length - 2];


  const { params } = route;
  const prevAddress = params ? params.address : null;
  const receivedCity = params ? params.city : null;
   const { displayCityInput } = route.params || {};

  useEffect(() => {
    setBillingVisible(global.isEditable);
    setChildrenVisible(global.isEditableChild);
    GetProfile();
    GetChild();
    GetAddress();
    GetWishlist();
    GetHelp();
    GetInvoice();
    GetPayment();
    const unsubscribe = navigation.addListener('focus', () => {
      setBillingVisible(global.isEditable);

      setChildrenVisible(global.isEditableChild);

      GetProfile();
      GetChild();
      GetAddress();
      GetWishlist();
      GetHelp();
      GetInvoice();
      GetPayment();
    });
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    AsyncStorage.getItem('userLocation').then(value => {
      console.log(value);
    });
    if (prevAddress) { 
      setUpdatedAddress(prevAddress);
    }
    if (receivedCity) {
      setMapCity(receivedCity);
    }
    return () => {
      backHandler.remove(), unsubscribe();
    };
  }, [prevAddress]);
  const [city, setCity] = useState('');
  const [emailId, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [mapcity, setMapCity] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [area, setArea] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [company_name, setCompany_name] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [visibles, setVisibles] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryImage, setSelectedCountryImage] = useState('');
  const [childrenVisible, setChildrenVisible] = useState(false);
  const [billingVisible, setBillingVisible] = useState(false);
  const [imagepath, setImagePath] = useState('');
  const [imageresponse, setImageResponse] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [paymentCenter, setPaymentCenter] = useState(false);
  const [invoicesVisible, setInvoicesVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isshow, setisshow] = useState(false);
  const [id_card_passport_number, setPassportnumber] = useState('');
  const [childData, setChildData] = useState([]);
  const IMG_COVER = 'cover';
  const [wishlistVisible, setWishlistVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [isPrimary, setPrimary] = useState(0);
  const [showalert, setShowAlert] = useState(false);
  const [showdeleteAlert, setShowDeleteAlert] = useState(false);
  const [showWishlistAlert, setShowWishlistAlert] = useState(false);
  const [addressData, setAddressData] = useState([]);
  const [invoicedata, setInvoiceData] = useState([]);

  const [wishlistData, setWishlistData] = useState([]);
  const [oldpassword, setOldPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({});
  const [updatedaddress, setUpdatedAddress] = useState('');
  
  
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setTimeout(() => {
      notificationOnOffApi();
    }, 20);
  };

  AsyncStorage.getItem('usertype').then(value => {
    global.usertype = value;
  });

  const onLogout = () => {
    AsyncStorage.clear();
    global.token = '';
    global.usertype = '';
    global.admin_approval = '';
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Signin'}],
      }),
    );
    // navigation.dispatch(
    //   CommonActions.navigate({
    //     name: 'Signin',
    //   }),
    // );
  };
  const GetPayment = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/total_payment')
      .then(res => {
        console.log('PAY', JSON.stringify(res));

        if (res.status) {
          setPaymentInfo(res.data);
          global.global_loader_reff.show_loader(0);
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const notificationOnOffApi = () => {
    let idObj = {
      status: isEnabled ? '0' : '1',
    };
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/user/notification_enable', 'POST', idObj)
      .then(res => {
        global.global_loader_reff.show_loader(0);
      });
  };

  const GetHelp = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqGet('api/cms_page')
      .then(res => {
        if (res.status) {
          helpDescription = res.data.help.description;
          global.global_loader_reff.show_loader(0);
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .finally(f => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const GetChild = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_children')
      .then(res => {
        if (res.status) {
          setChildData(res.data);
          global.global_loader_reff.show_loader(0);
        } else {
          setChildData([]);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(r => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const GetWishlist = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/wishlist/get')
      .then(res => {
        if (res.status) {
          setWishlistData(res.data);
          global.global_loader_reff.show_loader(0);
        } else {
          setWishlistData([]);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(r => {
        global.global_loader_reff.show_loader(0);
      });
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
          setAddressData(res.data);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(r => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const GetInvoice = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/client/get_invoice?id=')
      .then(res => {
        if (res.status) {
          const newFile = res.data.map(file => {
            let total_cost = file.total_cost;
            let sub_total = file.total_cost; //100
            let gst = file.vat; //18%
            let total = gst > 0 ? (sub_total * gst) / 100 : 0;
            let GST_amount = Math.round(total);
            // grand_total = GST_amount + total_cost
            let grand_total = file.grand_total;
            return {...file, total: grand_total};
          });
          setInvoiceData(newFile);
          console.log(newFile);
          global.global_loader_reff.show_loader(0);
        } else {
          setInvoiceData(res.data);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(r => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const GetProfile = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth(
        'api/user/get_profile?device_type=' +
          Platform.OS +
          '&user_type=' +
          global.usertype,
      )
      .then(res => {
        if (res.status) {
          setIsEnabled(res.data.notification_enable === 0 ? false : true);
          setFirstname(res.data.first_name);
          setLastname(res.data.last_name);
          setAddress(res.data.address);
          setMobileNumber(res.data.mobile_number);
          setEmail(res.data.email);
          setArea(res.data.area);
          setCity(res.data.city);
          setCompany_name(res.data.company_name);
          setImagePath(res.data.profile_picture);
          setPassportnumber(res.data.id_card_passport_number);

          let countryCode =
            res.data.country_code !== null &&
            res.data.country_code !== undefined
              ? res.data.country_code
              : countries[132].callingCode;
          let flag = countries[132].flag;
          let filterData = countries.filter(
            data => data.callingCode.toString() == countryCode,
          );

          if (filterData.length > 0) {
            flag = filterData[0].flag;
            setSelectedCountryImage(flag);
          }
          AsyncStorage.setItem('country_code', countryCode);
          AsyncStorage.setItem('flag_name', flag);
          setSelectedCountryCode(countryCode);
          if (res.data.company_name === '') {
            setIsShow(false);
          } else {
            setIsShow(true);
          }
          global.global_loader_reff.show_loader(0);
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const showAlert = id => {
    setShowAlert(true);
    childId = id;
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  const showDelAlert = id => {
    setShowDeleteAlert(true);
    addressId = id;
  };
  const hideDelAlert = () => {
    setShowDeleteAlert(false);
  };
  const showWishlist = (id, nm) => {
    setShowWishlistAlert(true);
    wishlistId = id;
    nannyName = nm;
  };
  const hideWishlist = () => {
    setShowWishlistAlert(false);
  };
  const deleteChild = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/client/delete_children?id=' + childId, 'DELETE')
      .then(res => {
        if (res.status) {
          setChildData([]);
          GetChild();
          setShowAlert(false);
          Global.showToast(res.message);
          global.global_loader_reff.show_loader(0);
        } else {
          setShowAlert(false);
          Global.showError(res.message);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        setShowAlert(false);

        global.global_loader_reff.show_loader(0);
      });
  };
  const deleteAddress = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/client/delete_address?id=' + addressId, 'DELETE')
      .then(res => {
        if (res.status) {
          setShowDeleteAlert(false);
          Global.showToast(res.message);
          GetAddress();
          global.global_loader_reff.show_loader(0);
        } else {
          setShowDeleteAlert(false);
          Global.showError(res.message);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        setShowDeleteAlert(false);

        global.global_loader_reff.show_loader(0);
      });
  };
  const removeWishlist = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/wishlist/remove?id_wishlist=' + wishlistId, 'DELETE')
      .then(res => {
        if (res.status) {
          Global.showToast(res.message);
          navigation.navigate('Removewishlist', {nannyName: nannyName});
          GetWishlist();
          setShowWishlistAlert(false);
          global.global_loader_reff.show_loader(0);
        } else {
          setShowWishlistAlert(false);
          Global.showError(res.message);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        setShowWishlistAlert(false);

        global.global_loader_reff.show_loader(0);
      });
  };
  const openFilter = visible => {
    setFilterVisible(visible);
  };
  const OpenGallery = () => {
    setFilterVisible(false);
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        setImageResponse(response.assets);
        setImagePath(response.assets[0].uri);
      }
    });
  };
  const OpenCamera = () => {
    setFilterVisible(false);
    launchCamera(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        setImageResponse(response.assets);
        setImagePath(response.assets[0].uri);
      }
    });
  };

  const EditProfile = () => {
    if (mobile_number.length < 8) {
      Global.showError('Please enter valid mobile number');
    } else {
      global.global_loader_reff.show_loader(1);
      let edit_api_url = APP_URL + 'api/user/edit_profile';
      const body = [];
      let editObj = {
        user_type: global.usertype,
        device_type: Platform.OS,
        first_name: firstname,
        last_name: lastname,
        email: emailId,
        mobile_number: mobile_number,
        address: updatedaddress,
        country_code: selectedCountryCode,
        city: mapcity,
        area: area,
        company_name: company_name,
        id_card_passport_number: id_card_passport_number,
      };
      const editstring = JSON.stringify(editObj);
      let imageDetail = null;
      if (imageresponse !== null) {
        imageDetail = JSON.parse(JSON.stringify(imageresponse));
      }
      body.push({name: 'data', data: editstring});
      if (imageDetail !== null) {
        var path = imageDetail[0].uri;
        let imageName = '';
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
        let imagePath =
          Platform.OS === 'ios' ? path.replace('file://', '') : path;
        let imageType = imageDetail[0].type;
        var imageData = {
          name: 'profile_picture',
          filename: imageName,
          type: imageType,
          data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
        };
        body.push(imageData);
      }
      RNFetchBlob.fetch(
        'POST',
        edit_api_url,
        {
          apikey: API_KEY,
          'x-authorization': global.token,
        },
        body,
      )
        .then(res => {
          let bodyData = JSON.parse(res.data);
          let response = bodyData;
          if (response.status) {
            GetProfile();
            Global.showToast(response.message);
            global.global_loader_reff.show_loader(0);
          } else {
            Global.showError(response.message);
            global.global_loader_reff.show_loader(0);
          }
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);
        });
    }
  };
  const onChangePassword = () => {
    if (newpassword !== confirmpassword) {
      Global.showError('Next Password and Repeat Password not match');
    } else {
      let pswObj = {
        old_password: oldpassword,
        new_password: newpassword,
      };
      global.global_loader_reff.show_loader(1);
      helper
        .UrlReqAuthPost('api/user/change_password', 'POST', pswObj)
        .then(res => {
          if (res.status) {
            Global.showToast(res.message);
            setOldPassword('');
            setConfirmPassword('');
            setNewPassword('');
            global.global_loader_reff.show_loader(0);
          } else {
            Global.showError(res.message);
            global.global_loader_reff.show_loader(0);
          }
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);
        });
    }
  };
  const onPressPayOld = invoiceId => {
    let obj = {device_type: Platform.OS, id: invoiceId};

    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuthPost('api/payment', 'POST', obj)
      .then(res => {
        if (res.status) {
          Global.showToast(res.message);
          global.global_loader_reff.show_loader(0);
          GetInvoice();
        } else {
          Global.showToast(res.message);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(r => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const onPressPay = (invoiceId, booking_type, amount) => {
    // alert(amount)
    let obj = {
      device_type: Platform.OS,
      id: invoiceId,
      booking_type: booking_type,
      amount: amount,
    };
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
          Global.showError(res.message);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(r => {
        global.global_loader_reff.show_loader(0);
      });
  };
  return (
    <ImageBackground
      source={Global.GlobalAssets.bgImg}
      style={styles.bgImg}
      resizeMode={IMG_COVER}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Global.GlobalColor.themePink}
        hidden={false}
      />
      <ScrollView
        style={{marginBottom: scale(120)}}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <Global.GlobalHeader
          onPress={() => {
            if (global.isEditable) {
              navigation.navigate('NewBooking');
            } else if (global.isEditableChild) {
              navigation.navigate('Findnanny');
            } else if(prevRoute && prevRoute.name==="Chat"){
              navigation.navigate('Chat');
            }
            else if(prevRoute && prevRoute.name==="NewBooking"){
              navigation.navigate('NewBooking');
            }
            else {
              navigation.navigate('ClientTabb');
            }
          }}
        />
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.baseHeader}>
                <TouchableOpacity>
                  <Image
                    source={Global.GlobalAssets.drawerIcon}
                    style={styles.globalImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                </TouchableOpacity>
                <Global.GlobalText
                  text="MY PROFILE"
                  style={styles.headerText}
                />
              </View>
            </View>
            <View
              style={[
                styles.cardContent,
                {
                  backgroundColor:
                    !visibles && !isshow
                      ? "#FBE6A5"
                      : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setVisibles(!visibles);
                  setisshow(false);
                }}
                style={[
                  styles.baseHeader,
                  {
                    marginLeft: scale(5),
                    paddingVertical: scale(10),
                  },
                ]}>
                {!visibles && !isshow && (
                  <Image
                  source={Global.GlobalAssets.profileMenu}
                  style={styles.menuImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
                )}
                <Global.GlobalText
                  text={'PERSONAL INFORMATION'}
                  style={{...styles.menuNm,}}
                />
                {visibles || isshow ? (
                  <Image
                    source={Global.GlobalAssets.profileMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
            {visibles && (
              <View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    paddingHorizontal: scale(10),
                    paddingVertical: scale(10),
                    margin: scale(15),
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Global.GlobalText
                      text={'Name : '}
                      style={{fontSize: scale(18), textTransform: 'none'}}
                    />
                    <Global.GlobalText
                      text={firstname + ' ' + lastname}
                      style={{fontSize: scale(18), textTransform: 'none'}}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Global.GlobalText
                      text={'Email : '}
                      style={{fontSize: scale(18), textTransform: 'none'}}
                    />
                    <Global.GlobalText
                      text={emailId}
                      style={{fontSize: scale(18), textTransform: 'none'}}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Global.GlobalText
                      text={'Mobile Number : '}
                      style={{fontSize: scale(18), textTransform: 'none'}}
                    />
                    <Global.GlobalText
                      text={'+' + selectedCountryCode + ' ' + mobile_number}
                      style={{fontSize: scale(18), textTransform: 'none'}}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    {company_name !== '' && (
                      <Global.GlobalText
                        text={'Company name : '}
                        style={{fontSize: scale(18), textTransform: 'none'}}
                      />
                    )}
                    {company_name !== '' && (
                      <Global.GlobalText
                        text={company_name}
                        style={{fontSize: scale(18), textTransform: 'none'}}
                      />
                    )}
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Global.GlobalText
                      text={'Area : '}
                      style={{fontSize: scale(18), textTransform: 'none'}}
                    />
                    <Global.GlobalText
                      text={area}
                      style={{fontSize: scale(18), textTransform: 'none'}}
                    />
                  </View>
                </View>
                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: scale(5),
                  }}>
                  <Global.GlobalButton
                    text={'edit'}
                    onPress={() => {
                      setVisibles(false);
                      setisshow(true);
                    }}
                    style={{
                      height: scale(40),
                      width: scale(100),
                      paddingHorizontal: scale(4),
                    }}
                  />
                </View>
              </View>
            )}
            {isshow ? (
              <View
                style={{
                  alignSelf: 'center',

                  zIndex: 5,
                }}>
                <TouchableOpacity
                  style={styles.userImg}
                  onPress={() => openFilter()}>
                  {imagepath ? (
                    <ImageBackground
                      source={{
                        uri: imagepath,
                      }}
                      style={{
                        height: scale(80),
                        width: scale(80),
                      }}
                      resizeMode={'cover'}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(0,0,0,0.2)',
                        }}>
                        <Image
                          source={Global.GlobalAssets.cameraIcon}
                          resizeMode={'contain'}
                          style={styles.cameraIcon}
                        />
                      </View>
                    </ImageBackground>
                  ) : (
                    <ImageBackground
                      source={Global.GlobalAssets.placeholderIcon}
                      style={{
                        height: scale(80),
                        width: scale(80),
                      }}
                      resizeMode={'cover'}>
                      <View
                        style={{
                          flex: 1,
                          // backgroundColor: 'rgba(0,0,0,0.2)',
                        }}>
                        <Image
                          source={Global.GlobalAssets.cameraIcon}
                          resizeMode={'contain'}
                          style={styles.cameraIcon}
                        />
                      </View>
                    </ImageBackground>
                  )}
                </TouchableOpacity>
                <View style={styles.checkboxBase}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(!isShow);
                      if (!isShow) {
                        setCompany_name('');
                      }
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
                    style={[styles.checkboxText]}
                  />
                </View>
                {isShow && (
                  <Global.GlobalTextBox
                    placeholder="ENTER COMPANY NAME"
                    onChangeText={value => setCompany_name(value)}
                    value={company_name}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                )}
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
                <Global.GlobalTextBox
                  placeholder="ENTER EMAIL ID"
                  onChangeText={value => setEmail(value)}
                  value={emailId}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />

                <View style={{marginVertical: 10, alignItems: 'flex-start'}}>
                  <View style={styles.maintextinputView}>
                    <TouchableOpacity
                      style={{
                        width: '38%',
                        alignItems: 'center',
                        justifyContent: 'center',

                        height: '96%',
                      }}
                      onPress={() => {
                        setShowPicker(true);
                      }}>
                      <View activeOpacity={1} style={styles.countrymainView}>
                        {selectedCountryImage !== '' ? (
                          <Image
                            source={{uri: selectedCountryImage}}
                            style={styles.flag}
                          />
                        ) : null}
                        <Text style={styles.countryTextStyle}>
                          {' + ' + selectedCountryCode}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{width: '69%', marginLeft: scale(-30)}}>
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
                        setSelectedCountry(item);
                        setShowPicker(!showPicker);
                      } else {
                        global.county_code_val = '';
                        global.country_name = '';
                        global.flag_name_val = '';
                        setSelectedCountryCode('');
                        AsyncStorage.setItem('country_code', '');
                        AsyncStorage.setItem('flag_name', '');
                        setSelectedCountryImage('');
                        setSelectedCountry(item);
                        setShowPicker(!showPicker);
                      }
                    }}
                    close={() => {
                      setShowPicker(!showPicker);
                    }}
                  />
                ) : null}
                {/* <Global.GlobalTextBox
                  placeholder="ENTER MOBILE NUMBER"
                  onChangeText={value => setMobileNumber(value)}
                  value={mobile_number}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  maxLength={15}
                  keyboardType={'numeric'}
                /> */}
                <Global.GlobalTextBox
                  placeholder="ENTER ADDRESS"
                  onChangeText={(value) => setUpdatedAddress(value)}
                  value={address}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Global.GlobalTextBox
                  placeholder="ENTER CITY"
                  onChangeText={value => setMapCity(value)}
                  value={city}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ClientLocation');
                  }}
                  style={styles.location}>
                  <Image
                    source={Global.GlobalAssets.crossIcon}
                    style={{
                      height: scale(18),
                      width: scale(18),
                      marginVertical: 5,
                      marginLeft: 5,
                    }}
                    resizeMode={'contain'}
                  />
                  <Global.GlobalText
                    text="Use Current location"
                    style={{fontSize: 15, margin: 5, color: '#FF818D'}}
                  />
                </TouchableOpacity>

                <Global.GlobalTextBox
                  placeholder="ENTER PASSPORT/ID CARD NO."
                  onChangeText={value => setPassportnumber(value)}
                  value={id_card_passport_number}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  keyboardType={'numeric'}
                />
                <DropDownPicker
                  items={[
                    {id: 1, label: 'North', value: 'North'},
                    {id: 2, label: 'Central', value: 'Central'},
                    {id: 3, label: 'South', value: 'South'},
                  ]}
                  defaultValue={area}
                  dropDownMaxHeight={100}
                  containerStyle={{
                    width: scale(250),
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
                  nestedScrollEnabled={true}
                  placeholder={'PREFER AREA'}
                  placeholderStyle={{
                    fontFamily: Global.GlobalFont.Regular,
                    color: '#FFD2D6',
                  }}
                  arrowColor={Global.GlobalColor.themePink}
                />
                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: scale(5),
                  }}>
                  <Global.GlobalButton
                    text={'save'}
                    onPress={() => {
                      setVisibles(true);
                      setisshow(false);
                      EditProfile();
                    }}
                    style={{
                      height: scale(40),
                      width: scale(100),
                      paddingHorizontal: scale(4),
                    }}
                  />
                </View>
              </View>
            ) : null}
            {isshow && (
              <TouchableOpacity
                onPress={() => {
                  setVisibles(false);
                  setisshow(false);
                }}
                style={{
                  alignSelf: 'flex-end',
                  marginRight: scale(20),
                  zIndex: 1,
                  marginBottom: scale(-5),
                }}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setChildrenVisible(!childrenVisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !childrenVisible
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderStyle]}>
                {!childrenVisible && (
                  <FYI
                  name={'child'}
                  size={30}
                  color={Global.GlobalColor.themePink}
                />
                )}
                <Global.GlobalText
                  text={'CHILDREN DETAIL'}
                  style={{...styles.menuNm,}}
                />
                {childrenVisible ? (
                  <Image
                    source={Global.GlobalAssets.childMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {childrenVisible ? (
              <>
                {childData !== null && (
                  <View>
                    {childData.map((item, index) => {
                      let i = (index += 1);
                      return (
                        <View style={styles.cardView}>
                          <View style={styles.cardChildView}>
                            <Global.GlobalText
                              text={`Child` + ' ' + i}
                              style={[styles.message, styles.themeTextStyle]}
                            />
                            <TouchableOpacity
                              style={styles.editChildBtn}
                              onPress={() => {
                                navigation.navigate('Editchild', {
                                  childId: item.id,
                                });
                              }}>
                              <Image
                                source={Global.GlobalAssets.editWithBackground}
                                resizeMode={IMG_CONTAIN}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => showAlert(item.id)}>
                              <Image
                                source={
                                  Global.GlobalAssets.deleteWithBackrground
                                }
                                style={{
                                  marginEnd: scale(10),
                                }}
                                resizeMode={IMG_CONTAIN}
                              />
                            </TouchableOpacity>
                          </View>
                          <Global.GlobalText
                            text={'Name - ' + item.name}
                            style={[styles.message, styles.noPaddingVertical]}
                          />
                          <Global.GlobalText
                            text={'DOB - ' + item.date_of_birth}
                            style={[styles.message, styles.noPaddingVertical]}
                          />
                          <Global.GlobalText
                            text={item.medical_or_allergies_issue}
                            style={[styles.message, styles.headingText]}
                          />
                          {item.about_child !== '' && (
                            <Global.GlobalText
                              text={item.about_child}
                              style={[styles.message, styles.noPaddingVertical]}
                            />
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
                <View style={styles.alignCenter}>
                  <Global.GlobalButton
                    text="ADD CHILD"
                    onPress={() => {
                      navigation.navigate('Addchild');
                    }}
                  />
                </View>
              </>
            ) : null}
            {childrenVisible && (
              <TouchableOpacity
                onPress={() => {
                  setChildrenVisible(false);
                  global.isEditableChild = false;
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setBillingVisible(!billingVisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !billingVisible
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderStyle]}>
                {!billingVisible && (
                  <Image
                    source={Global.GlobalAssets.addressMenu}
                    style={styles.menuImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                )}
                <Global.GlobalText
                  text={'BILLING ADDRESS'}
                  style={styles.menuNm}
                />
                {billingVisible ? (
                  <Image
                    source={Global.GlobalAssets.addressMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {billingVisible ? (
              <>
                {addressData !== null && (
                  <View>
                    {addressData.map((item, index) => {
                      let i = (index += 1);
                      return (
                        <View style={styles.cardView}>
                          <View style={styles.cardChildView}>
                            <View>
                              {item.is_primary_address === 1 ? (
                                <Global.GlobalText
                                  text={`Address` + ' ' + i + ' ' + '(Primary)'}
                                  style={[styles.message, styles.addressHead]}
                                />
                              ) : (
                                <Global.GlobalText
                                  text={`Address` + ' ' + i + ' '}
                                  style={[styles.message, styles.addressHead]}
                                />
                              )}
                            </View>
                            <View style={{flexDirection: 'row'}}>
                              <TouchableOpacity
                                style={styles.editBtnStyle}
                                onPress={() => {
                                  navigation.navigate('EditAddress', {
                                    addressId: item.id,
                                  });
                                }}>
                                <Image
                                  source={
                                    Global.GlobalAssets.editWithBackground
                                  }
                                  resizeMode={IMG_CONTAIN}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => showDelAlert(item.id)}>
                                <Image
                                  source={
                                    Global.GlobalAssets.deleteWithBackrground
                                  }
                                  style={{
                                    marginEnd: scale(10),
                                  }}
                                  resizeMode={IMG_CONTAIN}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Global.GlobalText
                            text={item.address}
                            style={[styles.message, styles.noPaddingVertical]}
                          />
                          <Global.GlobalText
                            text={item.city}
                            style={[styles.message, styles.noPaddingVertical]}
                          />
                          <Global.GlobalText
                            text={item.area}
                            style={[styles.message, styles.noPaddingVertical]}
                          />
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Global.GlobalText
                              text={`PRIMARY`}
                              style={[styles.message, styles.themeTextStyle]}
                            />
                            {item.is_primary_address === 0 ? (
                              <Image
                                source={Global.GlobalAssets.checkActive}
                                style={styles.checkMark}
                              />
                            ) : (
                              <Image
                                source={Global.GlobalAssets.checkActive}
                                style={styles.nonCheck}
                              />
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
                <View style={styles.alignCenter}>
                  <Global.GlobalButton
                    text="ADD ADDRESS"
                    textStyle={styles.regularFont}
                    onPress={() => {
                      navigation.navigate('AddAddress');
                    }}
                  />
                </View>
              </>
            ) : null}
            {billingVisible && (
              <TouchableOpacity
                onPress={() => {
                  global.isEditable = false;
                  setBillingVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setWishlistVisible(!wishlistVisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !wishlistVisible
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderStyle]}>
                {!wishlistVisible && (
                  <Image
                    source={Global.GlobalAssets.wishlistMenu}
                    style={styles.menuImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                )}
                <Global.GlobalText text={'MY WISHLIST'} style={styles.menuNm} />
                {wishlistVisible ? (
                  <Image
                    source={Global.GlobalAssets.wishlistMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {wishlistVisible ? (
              <>
                {wishlistData !== null && (
                  <View>
                    {wishlistData.map((item, index) => {
                      let i = (index += 1);
                      const ratingObject = {
                        ratings: item.ratting,
                      };
                      let ratingObj = ratingObject;
                      let stars = [];
                      for (var s = 1; s <= 5; s++) {
                        let path = Global.GlobalAssets.rate;
                        if (s > ratingObj.ratings) {
                          path = Global.GlobalAssets.starunfill;
                        }
                        stars.push(
                          <Image
                            style={styles.starStyle}
                            source={path}
                            resizeMode={'contain'}
                          />,
                        );
                      }
                      return (
                        <View style={styles.cardView}>
                          <View style={styles.cardChildView}>
                            <Global.GlobalText
                              text={
                                item.first_name + ' ' + item.last_name + ' ' + i
                              }
                              style={[styles.message, styles.themeTextStyle]}
                            />
                            <TouchableOpacity
                              style={{}}
                              onPress={() => {
                                showWishlist(
                                  item.id,
                                  item.first_name + ' ' + item.last_name,
                                );
                              }}>
                              <Image
                                source={
                                  Global.GlobalAssets.deleteWithBackrground
                                }
                                style={styles.delteBtnStyle}
                                resizeMode={IMG_CONTAIN}
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: scale(10),
                            }}>
                            <View style={styles.halfFlex}></View>
                            <View
                              style={{
                                flex: 2,
                              }}>
                              {item.profile_picture !== '' ? (
                                <Image
                                  source={{uri: item.profile_picture}}
                                  style={styles.wishlistImg}
                                  borderRadius={50}
                                />
                              ) : (
                                <Image
                                  source={Global.GlobalAssets.userImg}
                                  style={styles.wishlistImg}
                                />
                              )}
                            </View>
                            <View style={styles.halfFlex}></View>
                            <View
                              style={{
                                flex: 8,
                              }}>
                              <Global.GlobalText
                                text={'Experience - ' + item.experiance}
                                style={[
                                  styles.message,
                                  styles.noPaddingVertical,
                                ]}
                              />
                              <Global.GlobalText
                                text={'Location - ' + item.area}
                                style={[
                                  styles.message,
                                  styles.noPaddingVertical,
                                ]}
                              />

                              <View
                                style={{
                                  flexDirection: 'row',
                                  paddingTop: scale(5),
                                  marginLeft: scale(10),
                                  marginVertical: scale(2),
                                }}>
                                {stars}
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </>
            ) : null}
            {wishlistVisible && (
              <TouchableOpacity
                onPress={() => {
                  setWishlistVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setAccountVisible(!accountVisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !accountVisible
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderStyle]}>
                {!accountVisible && (
                  <Image
                    source={Global.GlobalAssets.settingMenu}
                    style={styles.menuImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                )}
                <Global.GlobalText
                  text={'ACCOUNT SETTING'}
                  style={styles.menuNm}
                />
                {accountVisible ? (
                  <Image
                    source={Global.GlobalAssets.settingMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {accountVisible ? (
              <>
                <View style={{paddingHorizontal: scale(15)}}>
                  <View style={[styles.accView]}>
                    <Text style={styles.changePass}>CHANGE PASSWORD</Text>
                  </View>
                  <Global.GlobalTextBox
                    placeholder="OLD PASSWORD"
                    secureTextEntry={true}
                    onChangeText={value => setOldPassword(value)}
                    value={oldpassword}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    viewStyle={styles.textinputStyle}
                    textInputStyle={{
                      paddingLeft: scale(5),
                      paddingBottom: scale(15),
                    }}
                    placeholderTextColor={Global.GlobalColor.lightBlue}
                  />
                  <Global.GlobalTextBox
                    placeholder="NEXT PASSWORD"
                    secureTextEntry={true}
                    onChangeText={value => setNewPassword(value)}
                    value={newpassword}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    viewStyle={styles.textinputStyle}
                    textInputStyle={{
                      paddingLeft: scale(5),
                      paddingBottom: scale(15),
                    }}
                    placeholderTextColor={Global.GlobalColor.lightBlue}
                  />
                  <Global.GlobalTextBox
                    placeholder="REPEAT PASSWORD"
                    secureTextEntry={true}
                    onChangeText={value => setConfirmPassword(value)}
                    value={confirmpassword}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    viewStyle={styles.textinputStyle}
                    textInputStyle={{
                      paddingLeft: scale(5),
                      paddingBottom: scale(15),
                    }}
                    placeholderTextColor={Global.GlobalColor.lightBlue}
                  />
                  <View style={styles.notificationMenu}>
                    <Global.GlobalText
                      text="NOTIFICATIONS"
                      style={styles.menuNm}
                    />
                    <Switch
                      trackColor={{
                        false: Global.GlobalColor.lightBlue,
                        true: Global.GlobalColor.lightBlue,
                      }}
                      thumbColor={
                        isEnabled ? Global.GlobalColor.darkBlue : '#f4f3f4'
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </View>
                  <View style={{marginVertical: scale(5), alignSelf: 'center'}}>
                    <Global.GlobalButton
                      text="SAVE"
                      onPress={() => {
                        onChangePassword();
                      }}
                    />
                  </View>
                </View>
              </>
            ) : null}
            {accountVisible && (
              <TouchableOpacity
                onPress={() => {
                  setAccountVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setInvoicesVisible(!invoicesVisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !invoicesVisible
                    ?"#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                  paddingVertical: scale(15),
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderMargin]}>
                {!invoicesVisible && (
                  <Image
                  source={Global.GlobalAssets.invoiceMenu}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
                )}
                <Global.GlobalText text={'INVOICES'} style={styles.menuNm} />
                {invoicesVisible ? (
                  <Image
                    source={Global.GlobalAssets.invoiceMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {invoicesVisible ? (
              <>
                <View style={{marginTop: scale(-10)}}></View>
                <View style={styles.invoiceViewStyle}>
                  {invoicedata !== null && invoicedata !== undefined ? (
                    <>
                      {invoicedata.map((item, index) => {
                        let t = (index += 1);
                        return (
                          <View style={{}}>
                            {index < 3 ? (
                              <View>
                                {/* {!item.is_payment ? ( */}
                                <View
                                  style={[
                                    styles.invoiceView,
                                    t === 2
                                      ? {borderRadius: scale(0)}
                                      : {
                                          borderRadius: scale(8),
                                        },
                                  ]}>
                                  <View style={styles.row}>
                                    <Global.GlobalText
                                      text={'INVOICE ' + t}
                                      style={[
                                        styles.message,
                                        styles.invoiceTitle,
                                      ]}
                                    />
                                    <TouchableOpacity
                                      style={styles.invoiceDetailBtn}
                                      onPress={() => {
                                        navigation.navigate('Invoicedetail', {
                                          id_invoice: item.id,
                                          series: t,
                                        });
                                      }}>
                                      <Image
                                        source={Global.GlobalAssets.eyeIcon}
                                        style={styles.eyeStyle}
                                        resizeMode={IMG_CONTAIN}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <Global.GlobalText
                                    text={'Date - ' + item.invoice_created_at}
                                    style={[styles.message, {marginBottom: -8}]}
                                  />
                                  <Global.GlobalText
                                    text={'Total hours - ' + item.total_hours}
                                    style={[styles.message, {marginBottom: -8}]}
                                  />
                                  <Global.GlobalText
                                    text={
                                      'Total Amount - ' +
                                      global.currency +
                                      ' ' +
                                      item.total
                                    }
                                    style={[styles.message, {marginBottom: -8}]}
                                  />
                                  <Global.GlobalText
                                    text={'Nanny - ' + item.nanny_name}
                                    style={[styles.message]}
                                  />
                                  {!item.is_payment ? (
                                    <Global.GlobalButton
                                      text="PAY NOW"
                                      style={styles.paymentBtn}
                                      onPress={() => {
                                        onPressPay(
                                          item.id,
                                          item.booking_type,
                                          item.total,
                                        );
                                      }}
                                    />
                                  ) : null}
                                </View>
                                {/* ) : null} */}
                              </View>
                            ) : null}
                          </View>
                        );
                      })}
                      {/* <>
                        <View style={[styles.innerCard]}>
                          <View style={styles.completedInvoice}>
                            <Global.GlobalText
                              text={

                                'Complete Invoices'
                              }
                              style={styles.textCompletd}
                            />
                          </View>
                        </View>
                        {invoicedata.map((item, index) => {

                          let t = (index += 1);
                          return (
                            <>
                              {item.is_payment ? (
                                <View
                                  style={[
                                    styles.invoiceView,
                                    t === 2
                                      ? { borderRadius: scale(0) }
                                      : {
                                        borderRadius: scale(8),
                                      },
                                  ]}>

                                  <View style={styles.row}>
                                    <Global.GlobalText
                                      text={'INVOICE ' + t}
                                      style={[styles.message, styles.invoiceTitle]}
                                    />
                                    <TouchableOpacity
                                      style={styles.invoiceDetailBtn}
                                      onPress={() => {
                                        navigation.navigate('Invoicedetail', { id_invoice: item.id, series: t });
                                      }}>
                                      <Image
                                        source={Global.GlobalAssets.eyeIcon}
                                        style={styles.eyeStyle}
                                        resizeMode={IMG_CONTAIN}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <Global.GlobalText
                                    text={"Date - " + item.invoice_created_at}
                                    style={[styles.message, { marginBottom: -8 }]}
                                  />
                                  <Global.GlobalText
                                    text={"Total hours - " + item.total_hours}
                                    style={[styles.message, { marginBottom: -8 }]}
                                  />
                                  <Global.GlobalText
                                    text={"Total Amount - " + item.total_cost}
                                    style={[styles.message, { marginBottom: -8 }]}
                                  />
                                  <Global.GlobalText
                                    text={"Nanny - " + item.nanny_name}
                                    style={[styles.message]}
                                  />

                                </View>
                              ) : null}


                            </>
                          );
                        })}
                      </> */}
                    </>
                  ) : null}
                </View>
                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: scale(5),
                  }}>
                  <Global.GlobalButton
                    text={'Show More'}
                    onPress={() => {
                      navigation.navigate('Invoice');
                    }}
                    style={{
                      height: scale(40),
                      width: scale(130),
                      paddingHorizontal: scale(0),
                    }}
                  />
                </View>
              </>
            ) : null}
            {invoicesVisible && (
              <TouchableOpacity
                onPress={() => {
                  setInvoicesVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            {/* remove by client help section */}
            {/* <TouchableOpacity
              onPress={() => {
                setHelpVisible(!helpVisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !helpVisible
                    ? Global.GlobalColor.lightPink
                    : Global.GlobalColor.themeLightBlue,
                  paddingVertical: scale(15),
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderMargin]}>
                {!helpVisible && (
                  <Image
                    source={Global.GlobalAssets.helpMenu}
                    style={styles.menuImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                )}
                <Global.GlobalText text={'HELP'} style={styles.menuNm} />
                {helpVisible ? (
                  <Image
                    source={Global.GlobalAssets.helpMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity> */}
            {helpVisible ? (
              <>
                <View
                  style={{
                    paddingHorizontal: scale(10),
                  }}>
                  <HTMLView
                    value={helpDescription}
                    textComponentProps={{
                      style: {
                        color: Global.GlobalColor.themeBlue,
                        fontFamily: Global.GlobalFont.Regular,
                        fontSize: scale(17),
                      },
                    }}
                  />
                </View>
              </>
            ) : null}
            {helpVisible && (
              <TouchableOpacity
                onPress={() => {
                  setHelpVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            {/* <View
              style={[
                styles.cardContent,
                {
                  backgroundColor:
                    !vatVisible && !isshow
                      ? "#FBE6A5"
                      : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setVatVisible(!vatVisible);
                  setisshow(false);
                }}>
                <View style={[styles.baseHeader, styles.baseHeaderStyle]}>
                  <Image
                    source={Global.GlobalAssets.Vat}
                    style={styles.globalImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                  <Global.GlobalText text={'ADD VAT'} style={styles.menuNm} />
                </View>
              </TouchableOpacity>
            </View> */}
            {/* {vatVisible && (
              <View style={{marginLeft: 40}}>
                { addVAT? (
              <Global.GlobalText
              text="VAT Added"
              style={{fontSize:scale(14), textTransform:"none", color:Global.GlobalColor.themeBlue, marginLeft:40}}
              />
                ) : (
                  <Global.GlobalText
                  text="NO VAT ADDED"
                  style={{fontSize:scale(14), textTransform:"none", color:Global.GlobalColor.themeBlue, marginLeft:40}}
                  />
                )}
              </View>
            )}
            {vatVisible && (
              <TouchableOpacity
                onPress={() => {
                  setVatVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )} */}
            {helpVisible && (
              <TouchableOpacity
                onPress={() => {
                  setHelpVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.cardContent,{backgroundColor:"#FBE6A5"}]}
              onPress={() => {
                onLogout();
              }}>
              <View style={[styles.baseHeader, styles.baseHeaderStyle]}>
                <Image
                  source={Global.GlobalAssets.logoutIcon}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
                <Global.GlobalText text={'LOGOUT'} style={styles.menuNm} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
      {/* MODAL  */}
      <Modal animationType="slide" transparent={true} visible={filterVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => openFilter(false)}
              style={styles.modalCloseBtn}>
              <Image
                source={Global.GlobalAssets.close}
                resizeMode={IMG_CONTAIN}
                style={{height: scale(15), width: scale(20)}}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.modalText,
                {color: Global.GlobalColor.themePink, marginTop: scale(-30)},
              ]}>
              Upload Image
            </Text>
            <TouchableOpacity
              onPress={() => OpenGallery()}
              style={styles.optionBase}>
              <Text style={styles.modalText}>Choose From Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => OpenCamera()}
              style={styles.optionBase}>
              <Text style={styles.modalText}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Delete Alert */}
      <AwesomeAlert
        show={showalert}
        showProgress={false}
        title="Delete Confirmation"
        message="Are you sure want to Delete this Child?"
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
          deleteChild();
        }}
        messageStyle={{
          fontFamily: Global.GlobalFont.Bold,
          color: '#000',
          fontSize: scale(19),
        }}
        confirmButtonTextStyle={{fontFamily: Global.GlobalFont.Bold}}
        contentStyle={{fontFamily: Global.GlobalFont.Bold}}
        cancelButtonTextStyle={{fontFamily: Global.GlobalFont.Bold}}
        titleStyle={{
          fontFamily: Global.GlobalFont.Bold,
          color: Global.GlobalColor.darkBlue,
        }}
      />
      <AwesomeAlert
        show={showdeleteAlert}
        showProgress={false}
        title="Delete Confirmation"
        message="Are you sure want to Delete this Address?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideDelAlert();
        }}
        onConfirmPressed={() => {
          deleteAddress();
        }}
        messageStyle={{
          fontFamily: Global.GlobalFont.Bold,
          color: '#000',
          fontSize: scale(19),
        }}
        confirmButtonTextStyle={{fontFamily: Global.GlobalFont.Bold}}
        contentStyle={{fontFamily: Global.GlobalFont.Bold}}
        cancelButtonTextStyle={{fontFamily: Global.GlobalFont.Bold}}
        titleStyle={{
          fontFamily: Global.GlobalFont.Bold,
          color: Global.GlobalColor.darkBlue,
        }}
      />
      <AwesomeAlert
        show={showWishlistAlert}
        showProgress={false}
        title="Remove Confirmation"
        message="Are you sure want to Remove this Nanny from Wishlist?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideWishlist();
        }}
        onConfirmPressed={() => {
          removeWishlist();
        }}
        messageStyle={{
          fontFamily: Global.GlobalFont.Bold,
          color: '#000',
          fontSize: scale(19),
        }}
        confirmButtonTextStyle={{fontFamily: Global.GlobalFont.Bold}}
        contentStyle={{fontFamily: Global.GlobalFont.Bold}}
        cancelButtonTextStyle={{fontFamily: Global.GlobalFont.Bold}}
        titleStyle={{
          fontFamily: Global.GlobalFont.Bold,
          color: Global.GlobalColor.darkBlue,
        }}
      />
     
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: {height: '119%', width: '100%', alignItems: 'center'},
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
  },
  // editView: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0,0,0,0.2)',
  // },
  notificationMenu: {marginVertical: scale(10), flexDirection: 'row'},
  containerStyle: {
    width: scale(280),
    alignSelf: 'center',
  },
  noPaddingVertical: {paddingVertical: 0},
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(30),
  },
  textCompletd: {paddingVertical: scale(5), paddingStart: scale(10)},
  textInputStyle: {
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(17),
    borderBottomWidth: 2,
    borderBottomColor: Global.GlobalColor.borderColor,
    paddingLeft: scale(7),
    paddingBottom: 2,
    marginVertical: scale(2),
    height: scale(50),
    color: Global.GlobalColor.themePink,
  },
  changePass: {
    color: 'white',
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(20),
    paddingHorizontal: scale(15),
    paddingVertical: scale(7),
  },
  delteBtnStyle: {
    marginEnd: scale(10),
    borderRadius: scale(2),
  },
  itemStyleOfDropDown: {
    justifyContent: 'flex-start',
    height: scale(35),
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
  saveBtnView: {
    alignSelf: 'flex-end',
    marginRight: scale(5),
  },
  headerText: {
    fontSize: scale(22),
    color: 'white',
    paddingHorizontal: scale(15),
  },
  accView: {
    backgroundColor: Global.GlobalColor.themeBlue,
    height: scale(40),
    marginHorizontal: scale(5),
    marginTop: scale(-10),
  },
  editBtn: {
    height: scale(40),
    width: scale(100),
    paddingHorizontal: scale(4),
  },
  cardView: {
    backgroundColor: 'white',
    marginHorizontal: scale(25),
    borderRadius: scale(8),
    marginBottom: scale(15),
    paddingBottom: scale(10),
  },
  unCheck: {
    height: scale(22),
    width: scale(22),
    resizeMode: IMG_CONTAIN,
  },
  headingText: {
    color: Global.GlobalColor.themePink,
    fontSize: scale(22),
    paddingVertical: 0,
  },
  menuImageStyle: {
    height: scale(24),
    width: scale(24),
  },
  invoiceViewStyle: {marginHorizontal: scale(25), marginVertical: scale(10)},
  addressHead: {
    color: Global.GlobalColor.themePink,
    fontSize: scale(20),
    paddingVertical: 0,
  },
  paymentView: {
    marginTop: scale(-12),
    backgroundColor: 'white',
    marginHorizontal: scale(20),
    paddingHorizontal: scale(18),
    borderRadius: scale(5),
    paddingVertical: scale(15),
    marginBottom: scale(20),
  },
  invoiceView: {
    backgroundColor: 'white',
    marginTop: scale(10),
    borderRadius: scale(8),
  },
  cardContent: {
    backgroundColor: Global.GlobalColor.pink,
    padding: scale(10),
    marginBottom: scale(3),
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  editBtnStyle: {marginRight: scale(2), marginHorizontal: 0, paddingRight: 0},
  placeholderStyle: {
    fontFamily: Global.GlobalFont.Regular,
    color: '#FFD2D6',
  },
  cardChildView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: scale(10),
  },
  alignCenter: {alignSelf: 'center'},
  baseHeader: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginLeft: scale(10),
  },
  completedInvoice: {
    backgroundColor: Global.GlobalColor.lightBlue,
    paddingVertical: scale(5),
  },
  menuNm: {
    fontSize: scale(20),
    paddingHorizontal: scale(15),
  },
  wishlistImg: {height: scale(45), width: scale(45)},
  activeLabelStyle: {
    color: Global.GlobalColor.themePink,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(15),
  },
  eyeStyle: {
    height: scale(30),
    width: scale(20),
    marginLeft: scale(3.2),
  },
  editChildBtn: {marginRight: scale(-81), marginHorizontal: 0, paddingRight: 0},
  invoiceDetailBtn: {
    height: 30,
    width: 30,
    backgroundColor: Global.GlobalColor.themeBlue,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: scale(2),
    marginRight: scale(10),
    marginTop: scale(10),
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
    width: scale(250),
    alignSelf: 'center',
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
  },
  countryTextStyle: {
    alignContent: 'center',
    color: Colors.themePink,
    fontSize: scale(15),
    fontFamily: Global.GlobalFont.Regular,
    textAlignVertical: 'center',
  },
  itemStyle: {
    justifyContent: 'flex-start',
    height: scale(30),
  },
  invoiceTitle: {
    color: Global.GlobalColor.themePink,
    fontSize: scale(22),
  },
  invoices: {
    opacity: 0.2,
    marginTop: scale(-10),
    marginLeft: scale(-17),
  },
  starStyle: {marginHorizontal: scale(2), height: scale(20), width: scale(20)},

  dropStyle: {
    backgroundColor: 'white',
    height: scale(50),
    width: scale(250),
    marginVertical: scale(8),
    alignSelf: 'center',
    borderColor: '#bcd8f6',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
  },
  head: {
    fontSize: scale(17),
    textTransform: 'none',
    color: Global.GlobalColor.themePink,
    marginVertical: scale(5),
  },
  paymentText: {
    fontSize: scale(17),
    textTransform: 'none',
    marginVertical: scale(5),
  },
  baseHeaderStyle: {
    marginLeft: scale(5),
    paddingVertical: scale(10),
  },
  dropdownLabelStyle: {
    color: Global.GlobalColor.themePink,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
  },
  checkMark: {
    opacity: 0.2,
    height: scale(20),
    width: scale(20),
  },
  nonCheck: {height: scale(20), width: scale(20)},
  halfFlex: {
    flex: 0.5,
  },
  themeTextStyle: {
    color: Global.GlobalColor.themePink,
    fontSize: scale(20),
    paddingVertical: 0,
  },
  checkboxBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginLeft: scale(15),
  },

  checkboxText: {
    paddingLeft: scale(10),
    width: scale(230),
    paddingTop: scale(5),
    color: Global.GlobalColor.themeBlue,
    fontSize: scale(15),
  },
  paymentBtn: {
    width: '100%',
    borderRadius: 0,
    height: 45,
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
    marginTop: scale(-2),
    marginLeft: 0,
  },
  regularFont: {fontSize: scale(18)},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    opacity: 1,
    backgroundColor: '#00000080',
  },
  imageFilterStyle: {
    height: scale(80),
    width: scale(80),
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: scale(50),
  },

  upArrowBtnStyle: {
    alignSelf: 'flex-end',
    marginRight: scale(20),
    zIndex: 1,
    marginBottom: scale(-5),
  },
  baseHeaderMargin: {
    marginLeft: scale(0),
    paddingVertical: scale(5),
  },
  button: {
    borderRadius: scale(20),
    padding: scale(10),
    elevation: 2,
  },
  globalImageStyle: {
    height: scale(24),
    width: scale(24),
  },
  opacityImageStyle: {
    height: scale(38),
    width: scale(38),
    opacity: 0.2,
    transform: [{rotate: '-20deg'}],
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
  message: {
    paddingVertical: scale(5),
    fontSize: scale(18),
    textTransform: 'none',
    paddingHorizontal: scale(12),
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
  userImg: {
    margin: scale(10),
    alignSelf: 'center',
  },
  cameraIcon: {
    height: scale(15),
    width: scale(15),
    alignSelf: 'center',
    paddingVertical: scale(100),
    paddingBottom: scale(8),
  },
  textinputStyle: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 0,
    backgroundColor: 'transparent',
    width: '95%',
    height: scale(40),
  },
  location: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
    flexShrink: 1,
    borderStyle: 'solid',
    flexWrap: 'wrap',
    marginBottom: scale(5),
    width: '93%',
    borderRadius: 5,
    margin: scale(10),
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#bcd8f6',
  },
});
export default Profile;
