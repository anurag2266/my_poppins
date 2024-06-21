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
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Global from '../../Global/globalinclude';
import CountryCodePicker from '../../../CodePicker';
import DocumentPicker from 'react-native-document-picker';
import { scale } from '../../Theme/Scalling';
import helper from '../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import countries from '../../../country.json';
import showError from '../../Component/showError';
let defaultCountry = countries[132];
let contract_document_for_admin = '',
  non_disclosure_agreement_for_admin = '',candidate_privacy = '', client_terms_and_conditions = "", clients_privacy_policy = '';
const CompleteProfile = props => {
  const navigation = props.navigation;
  const [terms, setTerms] = useState(0);
  const [privacy, setPrivacy] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryImage, setSelectedCountryImage] = useState('');
  const [emergencycontact, setEmergencyContact] = useState('');
  const [otherinfo, setOtherInfo] = useState('');
  const [experince, setExperince] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [uploadagreementfilename, setUploadAgreementFileName] = useState('');
  const [uploadagreementresponse, setUploadAgreementResponse] = useState(null);
  const [conractfilename, setConratctFileName] = useState('');
  const [conractfileresponse, setConratctResponse] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState('');
  useEffect(() => {
    getSelectedCountry();
    GetCompleteProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      getSelectedCountry();
      GetCompleteProfile();
    });
    return () => {
      unsubscribe();
    };
  }, []);

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
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };
  const GetCompleteProfile = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth(
        'api/nanny/get_completed_profile?device_type=' +
        Platform.OS +
        '&user_type=' +
        global.usertype,
      )
      .then(res => {
        console.log(res, "LLLLLLLLLL");
        if (res.status) {
          if (res.data !== null) {
            contract_document_for_admin = res.data.contract_document_for_admin;
            non_disclosure_agreement_for_admin =
              res.data.non_disclosure_agreement_for_admin;
            client_terms_and_conditions = res.data.client_terms_and_conditions;
            clients_privacy_policy = res.data.clients_privacy_policy;
            candidate_privacy = res.data.candidate_privacy;
            contractor_privacy = res.data.contractor_privacy;
          }

          global.global_loader_reff.show_loader(0);
        } else {
          if (res.data !== null) {
            contract_document_for_admin = res.data.contract_document_for_admin;
            non_disclosure_agreement_for_admin =
              res.data.non_disclosure_agreement_for_admin;
            client_terms_and_conditions = res.data.client_terms_and_conditions;
            clients_privacy_policy = res.data.clients_privacy_policy;
            candidate_privacy = res.data.candidate_privacy;
            contractor_privacy = res.data.contractor_privacy;
            

          }
          global.global_loader_reff.show_loader(0);

          //Global.showError(res.message);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const SaveProfile = () => {
    // else if (otherinfo === '') {
    //   Global.showError('Please Add Other Information!');
    // }
    if (emergencycontact.trim() === '') {
      Global.showError('Please Add Emergency Contact !');
    } else if (emergencycontact.trim().length < 8) {
      Global.showError('Emergency Contact Number must be 8 digit!');
    } else if (experince === '') {
      Global.showError('Please Add Your Experience');
    }
    // else if (conractfilename === '') {
    //   Global.showError('Please Upload Your Contract');
    // } 
    // else if (uploadagreementfilename === '') {
    //   Global.showError('Please Upload Your Agreement');
    // } 
    else if (!terms) {
      Global.showError('Please Accept Terms and Condition!')
    }
    else if (!privacy) {
      Global.showError('Please Accept Privacy Policy!')
    }
    else {
      let completeObj = {
        device_type: Platform.OS,
        emergency_contact: emergencycontact,
        other_information: otherinfo,
        experiance: experince,
        country_code:selectedCountryCode,
        contract: conractfileresponse,
        agreement: uploadagreementresponse,
      };

      navigation.navigate('Avability', { data: completeObj });

      // storeData('profile_obj', profile_arr);
      // AsyncStorage.getItem('profile_obj').then(value => {
      //   global.profileData = value;
      // });
    }
  };

  // };
  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  const checkPermissionForContract = async () => {
    if (Platform.OS === 'ios') {
      DownloadContract();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          DownloadContract();
        } else {
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const DownloadContract = () => {
    if (contract_document_for_admin !== '') {
      global.global_loader_reff.show_loader(1);
      let pdf_URL = '';

      pdf_URL = contract_document_for_admin;
      var min = 1;
      var max = 100;
      var rand = min + Math.random() * (max - min);
      let ext = getExtention(pdf_URL);
      if (Platform.OS === 'ios') {
        ext = ext;
      } else {
        ext = '.' + ext;
      }

      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          //Related to the Android only
          useDownloadManager: true,
          notification: true,
          path: PictureDir + '/Contract_' + rand + ext,
          description: 'Pdf',
        },
      };
      config(options)
        .fetch('GET', pdf_URL)
        .then(res => {
          global.global_loader_reff.show_loader(0);
          Global.showToast('Contract Downloaded Successfully!');
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);
          Global.showError(err);
        });
    }
  };
  const checkPermissionForAgreement = async () => {
    if (Platform.OS === 'ios') {
      DownloadAgreement();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          DownloadAgreement();
        } else {
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const DownloadAgreement = () => {
    if (non_disclosure_agreement_for_admin !== '') {
      global.global_loader_reff.show_loader(1);
      let pdf_URL = '';

      pdf_URL = non_disclosure_agreement_for_admin;
      var min = 1;
      var max = 100;
      var rand = min + Math.random() * (max - min);
      let ext = getExtention(pdf_URL);
      if (Platform.OS === 'ios') {
        ext = ext;
      } else {
        ext = '.' + ext;
      }

      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          //Related to the Android only
          useDownloadManager: true,
          notification: true,
          path: PictureDir + '/Non Disclosure Agreement_' + rand + ext,
          description: 'Pdf',
        },
      };
      config(options)
        .fetch('GET', pdf_URL)
        .then(res => {
          global.global_loader_reff.show_loader(0);
          Global.showToast('Non Disclosure Agreement Downloaded Successfully!');
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);
          Global.showError(err);
        });
    }
  };
  const uploadAgreement = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (res !== null) {

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
  const uploadContract = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (res !== null) {
        setConratctFileName(res.name);
        setConratctResponse(res);

      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView style={{}} showsVerticalScrollIndicator={false}>
          <View style={styles.baseView}>
            {/* <Global.GlobalHeader onPress={() => navigation.goBack()} /> */}
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Global.GlobalText text="PROFILE COMPLETION" />
              </View>
              <View style={{}}>
                

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
                  placeholder="EMERGENCY CONTACT"
                  onChangeText={value =>
                    setEmergencyContact(value.replace(/[^0-9]/g, ''))
                  }
                  value={emergencycontact}
                  textInputStyle={{ height: scale(50) }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  keyboardType={'numeric'}
                  maxLength={15}
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

                <Global.GlobalTextBox
                  placeholder="OTHER INFORMATION(IF NEEDED)"
                  onChangeText={value => setOtherInfo(value)}
                  value={otherinfo}
                  textInputStyle={{ height: scale(50) }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Global.GlobalTextBox
                  placeholder="PROVIDE EXPERINCE (TO BE DISPLAYED TO CLIENTS)"
                  textInputStyle={{ height: scale(80) }}
                  textAlignVertical="top"
                  onChangeText={value => setExperince(value)}
                  value={experince}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>



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
                <TouchableOpacity
                  style={{ borderBottomWidth: 1, borderColor: Global.GlobalColor.themeBlue, marginLeft: scale(7) }}
                  onPress={() => navigation.navigate('PdfView', { pdf_url: candidate_privacy })}>
                  <Global.GlobalText
                    text={'ACCEPT TERMS & CONDITION'}
                    style={[
                      styles.optionText,
                      { fontFamily: Global.GlobalFont.Bold, fontSize: scale(13) },
                    ]}
                  />
                </TouchableOpacity>

              </View>
              <View style={styles.checkboxBase}>
                <TouchableOpacity
                  onPress={() => {

                    setPrivacy(!privacy);
                  }}>
                  <Image
                    source={
                      privacy
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
                <TouchableOpacity
                  style={{ borderBottomWidth: 1, borderColor: Global.GlobalColor.themeBlue, marginLeft: scale(7) }}
                  onPress={() => navigation.navigate('PdfView', { pdf_url: contractor_privacy })}>
                  <Global.GlobalText
                    text={'ACCEPT PRIVACY POLICY'}
                    style={[
                      styles.optionText,
                      { fontFamily: Global.GlobalFont.Bold, fontSize: scale(13) },
                    ]}
                  />
                </TouchableOpacity>

              </View>
              {/* <View style={{ width: '100%' }}>
                <Global.GlobalText
                  text="DOWNLOAD CONTRACTS TEMPLATES"
                  style={styles.downloadText}
                />
                <TouchableOpacity
                  style={styles.contractButtonView}
                  onPress={() => checkPermissionForContract()}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text="CONTRACT"
                      style={styles.contractText}
                    />
                  </View>
                  <View style={styles.downloadView}>
                    <Image
                      style={styles.downloadImage}
                      resizeMode="contain"
                      source={Global.GlobalAssets.downloadWhite}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contractButtonView}
                  onPress={() => checkPermissionForAgreement()}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text="PRIVACY NOTICE"
                      style={styles.contractText}
                    />
                  </View>
                  <View style={styles.downloadView}>
                    <Image
                      style={styles.downloadImage}
                      resizeMode="contain"
                      source={Global.GlobalAssets.downloadWhite}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadDownloadButtonView}
                  onPress={() => uploadContract()}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text={
                        conractfilename === ''
                          ? 'UPLOAD CONTRACTS'
                          : conractfilename
                      }
                      style={styles.uploadText}
                    />
                  </View>
                  <View style={styles.downloadView}>
                    <Image
                      style={styles.downloadImage}
                      resizeMode="contain"
                      source={Global.GlobalAssets.uploadPink}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadDownloadButtonView}
                  onPress={() => uploadAgreement()}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text={
                        uploadagreementfilename === ''
                          ? 'UPLOAD NON DISCLOSURE AGREEMENT'
                          : uploadagreementfilename
                      }
                      style={styles.uploadText}
                    />
                  </View>
                  <View style={styles.downloadView}>
                    <Image
                      style={styles.downloadImage}
                      resizeMode="contain"
                      source={Global.GlobalAssets.uploadPink}
                    />
                  </View>
                </TouchableOpacity>
              </View> */}
              <View>
                <View
                  style={{
                    marginTop: scale(15),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Global.GlobalButton
                    text={'PROCEED'}
                    onPress={() => {
                      // if (isProfileComplete === 1) {
                      //   navigation.navigate('Avability');
                      // } else {
                      SaveProfile();
                      //  }
                    }}
                    style={{
                      width: scale(150),
                      height: scale(50),
                      paddingHorizontal: scale(5),
                    }}
                  />
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  checkboxBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginLeft: scale(15),
    marginTop: scale(10),
  },
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),

    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,

    width: scale(300),
    marginTop: scale(23),
  },
  contractView: {
    width: '90%',
    paddingStart: scale(10),
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
  downloadText: {
    color: Global.GlobalColor.themePink,
    fontSize: scale(17),
    paddingStart: scale(12),
    fontFamily: Global.GlobalFont.Regular,
    paddingTop: scale(10),
  },
  contractText: {
    color: 'white',
    fontSize: scale(18),
  },
  uploadText: {
    color: Global.GlobalColor.themeBlue,
    fontSize: scale(15),
    fontFamily: Global.GlobalFont.Regular,
    flexWrap: 'nowrap',
    textTransform: 'none',
  },
  baseView: {
    justifyContent: 'center',

    marginTop: scale(15),
    paddingBottom: scale(80),
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
  contractButtonView: {
    borderRadius: scale(5),
    flexDirection: 'row',
    height: scale(50),
    marginLeft: scale(12),
    marginTop: scale(5),
    marginRight: scale(12),
    backgroundColor: Global.GlobalColor.themeBlue,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  countrymainView: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginStart: scale(5),
  },
  flag: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    borderRadius: 0,
  },
  maintextinputView: {
    height: scale(55),
    borderRadius: scale(5),
    borderWidth: 2,
    borderColor: Global.GlobalColor.borderColor,
    // width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',alignSelf:'center',
    width: scale(280),
    backgroundColor: 'white',
  },
  uploadDownloadButtonView: {
    borderRadius: scale(5),
    flexDirection: 'row',
    borderColor: Global.GlobalColor.themeBlue,
    borderWidth: 1,
    height: scale(55),
    marginLeft: scale(12),
    marginTop: scale(10),
    marginRight: scale(12),
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  forgotText: {
    textDecorationLine: 'underline',
    fontSize: scale(15),
  },
});
export default CompleteProfile;
