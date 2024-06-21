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
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import { Card } from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { API_KEY, APP_URL } from '../../../Global/config';
import RNFetchBlob from 'rn-fetch-blob';
const options = {
  title: global.select_avatar,
  noData: true,
  maxWidth: 720,
  maxHeight: 1024,
  allowsEditing: false,
  mediaType: 'photo',
  includeBase64: false,
  saveToPhotos: false,
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true,
  },
};
var menuId = '';

const Profile = ({ navigation }) => {
  const [menuid, setMenuId] = useState('');
  const [emailId, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [area, setArea] = useState('');
  const [company_name, setCompany_name] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [isshow, setisshow] = useState(false);
  const [visibles, setVisibles] = useState(false);
  const [imagepath, setImagePath] = React.useState('');
  const [imageresponse, setImageResponse] = React.useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [id_card_passport_number, setPassportnumber] = useState('');
  const [PROFILE_ARRAY, setProfileArr] = useState([
    // {
    //   id: 1,
    //   name: 'PERSONAL INFORMATION',
    //   icon: Global.GlobalAssets.profileMenu,
    //   visible: false,
    // },
    {
      id: 2,
      name: 'CHILDREN DETAIL',
      icon: Global.GlobalAssets.childMenu,
      visible: false,
    },
    {
      id: 3,
      name: 'BILLING ADDRESS',
      icon: Global.GlobalAssets.addressMenu,
      visible: false,
    },
    {
      id: 4,
      name: 'MY WISHLIST',
      icon: Global.GlobalAssets.wishlistMenu,
      visible: false,
    },
    {
      id: 5,
      name: 'ACCOUNT SETTING',
      icon: Global.GlobalAssets.settingMenu,
      visible: false,
    },
    {
      id: 6,
      name: 'PAYMENT CENTER',
      icon: Global.GlobalAssets.paymenuMenu,
      visible: false,
    },
    {
      id: 7,
      name: 'INVOICES',
      icon: Global.GlobalAssets.invoiceMenu,
      visible: false,
    },
    {
      id: 8,
      name: 'HELP',
      icon: Global.GlobalAssets.helpMenu,
      visible: false,
    },
  ]);

  AsyncStorage.getItem('usertype').then(value => {
    global.usertype = value.toString();
  });
  useEffect(() => {
    GetProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      GetProfile();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const openFilter = visible => {
    // alert('openFilter');
    setFilterVisible(visible);
  };
  const OpenGallery = () => {
    setFilterVisible(false);
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        setImageResponse(response);
        setImagePath(response.uri);
      }
    });
  };
  const OpenCamera = () => {
    setFilterVisible(false);
    launchCamera(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        setImageResponse(response);
        setImagePath(response.uri);
      }
    });
  };
  const onBtnClick = (index, item) => {

    // const arry = PROFILE_ARRAY;
    // arry[index].visible = true;
    // setProfileArr(arry);
    setVisibles(!visibles);
    setMenuId(item.id);
    menuId = item.name;
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
  const EditProfile = () => {
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
      address: address,
      city: city,
      area: area,
      company_name: company_name,
      id_card_passport_number: id_card_passport_number,
    };
    const editstring = JSON.stringify(editObj);
    let imageDetail = null;
    if (imageresponse !== null) {
      imageDetail = JSON.parse(JSON.stringify(imageresponse));
    }
    body.push({ name: 'data', data: editstring });
    if (imageDetail !== null) {
      var path = imageDetail.uri;
      let imageName = '';
      if (
        imageDetail.fileName === undefined ||
        imageDetail.fileName == null ||
        imageDetail.fileName === ''
      ) {
        var getFilename = path.split('/');
        imageName = getFilename[getFilename.length - 1];
        var extension = imageName.split('.')[1];
        imageName = new Date().getTime() + '.' + extension;
      } else {
        imageName = imageDetail.fileName;
      }
      let imagePath =
        Platform.OS === 'ios' ? path.replace('file://', '') : path;
      let imageType = imageDetail.type;
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
        apikey: 'uk6f4987b25ec004773f331e2e3jkso85',
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
      <ScrollView
        style={{ marginBottom: scale(120) }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity style={styles.baseHeader}>
                <Image
                  source={Global.GlobalAssets.drawerIcon}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                  resizeMode={'contain'}
                />
                <Global.GlobalText
                  text="MY PROFILE"
                  style={{
                    fontSize: scale(22),
                    color: 'white',
                    paddingHorizontal: scale(15),
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.cardContent,
                {
                  backgroundColor:
                    !visibles && !isshow
                      ? Global.GlobalColor.lightPink
                      : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  // onBtnClick();
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
                    style={{
                      height: scale(24),
                      width: scale(24),
                    }}
                    resizeMode={'contain'}
                  />
                )}

                <Global.GlobalText
                  text={'PERSONAL INFORMATION'}
                  style={styles.menuNm}
                />
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
                  <View style={{ flexDirection: 'row' }}>
                    <Global.GlobalText
                      text={'Name : '}
                      style={{ fontSize: scale(18), textTransform: 'none' }}
                    />
                    <Global.GlobalText
                      text={firstname + ' ' + lastname}
                      style={{ fontSize: scale(18), textTransform: 'none' }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Global.GlobalText
                      text={'Email : '}
                      style={{ fontSize: scale(18), textTransform: 'none' }}
                    />
                    <Global.GlobalText
                      text={emailId}
                      style={{ fontSize: scale(18), textTransform: 'none' }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Global.GlobalText
                      text={'Mobile Number : '}
                      style={{ fontSize: scale(18), textTransform: 'none' }}
                    />
                    <Global.GlobalText
                      text={mobile_number}
                      style={{ fontSize: scale(18), textTransform: 'none' }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    {company_name !== '' && (
                      <Global.GlobalText
                        text={'Company name : '}
                        style={{ fontSize: scale(18), textTransform: 'none' }}
                      />
                    )}
                    {company_name !== '' && (
                      <Global.GlobalText
                        text={company_name}
                        style={{ fontSize: scale(18), textTransform: 'none' }}
                      />
                    )}
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Global.GlobalText
                      text={'Area : '}
                      style={{ fontSize: scale(18), textTransform: 'none' }}
                    />
                    <Global.GlobalText
                      text={area}
                      style={{ fontSize: scale(18), textTransform: 'none' }}
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
              <View style={{ alignSelf: 'center' }}>
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
                <Global.GlobalTextBox
                  placeholder="ENTER MOBILE NUMBER"
                  onChangeText={value => setMobileNumber(value)}
                  value={mobile_number}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  maxLength={10}
                  keyboardType={'numeric'}
                />
                <Global.GlobalTextBox
                  placeholder="ENTER ADDRESS"
                  onChangeText={value => setAddress(value)}
                  value={address}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Global.GlobalTextBox
                  placeholder="ENTER CITY"
                  onChangeText={value => setCity(value)}
                  value={city}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Global.GlobalTextBox
                  placeholder="ENTER PASSPORT/ID CARD NO."
                  onChangeText={value => setPassportnumber(value)}
                  value={id_card_passport_number}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  keyboardType={'numeric'}
                />
                <DropDownPicker
                  items={[
                    { id: 1, label: 'North', value: 'North' },
                    { id: 2, label: 'Central', value: 'Central' },
                    { id: 2, label: 'South', value: 'South' },
                  ]}
                  defaultValue={area}
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

            {PROFILE_ARRAY.map((item, index) => {
              return (
                <>
                  <View
                    style={[
                      styles.cardContent,
                      {
                        backgroundColor:
                          item.id === menuId && visibles
                            ? Global.GlobalColor.themeLightBlue
                            : Global.GlobalColor.pink,
                      },
                    ]}>
                    <View
                      // onPress={() => {
                      //   onBtnClick(index, item);
                      // }}
                      style={[
                        styles.baseHeader,
                        {
                          marginLeft: scale(5),
                          paddingVertical: scale(10),
                        },
                      ]}>
                      <Image
                        source={item.icon}
                        style={{
                          height: scale(24),
                          width: scale(24),
                        }}
                        resizeMode={'contain'}
                      />

                      <Global.GlobalText
                        text={item.name}
                        style={styles.menuNm}
                      />
                    </View>
                  </View>

                  {/* {menuid === 2 && (
                    <View style={{alignItems: 'center', padding: 20}}>
                      <Global.GlobalText
                        style={[styles.checkboxText, {color: 'black'}]}
                        text={'Under Development'}
                      />
                    </View>
                  )} */}

                  {/* {visible && menuId == '3' && (
                    <View style={{alignItems: 'center', padding: 20}}>
                      <Global.GlobalText
                        style={[styles.checkboxText, {color: 'black'}]}
                        text={'Under Development'}
                      />
                    </View>
                  )} */}
                </>
              );
            })}
            <TouchableOpacity
              style={[styles.cardContent]}
              onPress={() => {
                AsyncStorage.clear();
                global.token = '';
                global.usertype = '';
                navigation.navigate('Signin');
              }}>
              <View
                style={[
                  styles.baseHeader,
                  {
                    marginLeft: scale(5),
                    paddingVertical: scale(10),
                  },
                ]}>
                <Image
                  source={Global.GlobalAssets.logoutIcon}
                  style={{
                    height: scale(24),
                    width: scale(24),
                  }}
                  resizeMode={'contain'}
                />

                <Global.GlobalText text={'LOGOUT'} style={styles.menuNm} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={filterVisible}>
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
                { color: Global.GlobalColor.themePink, marginTop: scale(-30) },
              ]}>
              Upload Image
            </Text>
            <TouchableOpacity
              onPress={() => OpenGallery()}
              style={styles.optionBase}>
              <Text style={styles.modalText}>Choose From Gallary</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => OpenCamera()}
              style={styles.optionBase}>
              <Text style={styles.modalText}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: { height: '119%', width: '100%', alignItems: 'center' },
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
    marginTop: scale(50),
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
  cardContent: {
    backgroundColor: Global.GlobalColor.pink,
    padding: scale(10),
    marginBottom: scale(3),
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),
  },
  baseHeader: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginLeft: scale(10),
  },
  menuNm: {
    fontSize: scale(20),
    paddingHorizontal: scale(15),
  },
  itemStyle: {
    justifyContent: 'flex-start',
    height: scale(30),
  },
  dropStyle: {
    backgroundColor: 'white',
    height: scale(50),
    width: scale(260),
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
    marginLeft: scale(15),
  },
  checkboxText: {
    paddingLeft: scale(10),
    width: scale(230),
    paddingTop: scale(5),
    color: Global.GlobalColor.themeBlue,
    fontSize: scale(15),
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
});
export default Profile;
