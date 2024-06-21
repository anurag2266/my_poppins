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
  TextInput,
  Switch,
  BackHandler,
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import CountryCodePicker from '../../../../CodePicker';
import countries from '../../../../country.json';
import { scale } from '../../../Theme/Scalling';
import { Card } from 'native-base';
import Colors from '../../../Theme/Colors';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { CommonActions } from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';
import DocumentPicker from 'react-native-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';

import { APP_URL } from '../../../Global/config';
import { FAB } from 'react-native-elements';
import Fonts from '../../../Theme/Fonts';

const IMG_CONTAIN = 'contain';
const items = [1, 2];
let is_pdf_agreement = false;
const wishlists = [1, 2, 3];
let defaultCountry = countries[132];
let driving_license = '',
  non_disclosure_agreement = '',
  police_conduct = '',
  reference = '',
  is_document_name = '',
  remove_documents_ids = '',
  id_card = '';
let helpDescription = '',
  isEditable = false;
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
const QuestionAnswer = ({
  title,
  onPressYes,
  onPressNo,
  sourceOfYes,
  sourceOfNo,
  disabled,
  disabledSrcOfYes,
  disabledSrcOfNo,
}) => {
  return (
    <View style={styles.questionBase}>
      <Global.GlobalText text={title} style={{ fontSize: scale(18) }} />
      <View style={styles.buttonBase}>
        <TouchableOpacity
          disabled={disabled}
          onPress={() => onPressYes()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={disabled ? disabledSrcOfYes : sourceOfYes}
            style={{ height: scale(20), width: scale(20) }}
            resizeMode={'contain'}
          />
          <Global.GlobalText
            text={'YES'}
            style={{ fontSize: scale(18), marginLeft: scale(5) }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={disabled}
          onPress={() => onPressNo()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: scale(30),
          }}>
          <Image
            source={disabled ? disabledSrcOfNo : sourceOfNo}
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
const Profile = ({ navigation }) => {
  const [emailId, setEmail] = useState('');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate());
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [visibles, setVisibles] = useState(false);
  const [documentvisible, setDocumentVisible] = useState(false);
  const [supportvisible, setSupportVisible] = useState(false);
  const [imagepath, setImagePath] = useState(null);
  const [imageresponse, setImageResponse] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [workVisible, setWorkVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [paymentCenter, setPaymentCenter] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryImage, setSelectedCountryImage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [invoicesVisible, setInvoicesVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isshow, setisshow] = useState(false);
  const [uploaddrvinglicensefilename, setUploadDrivingLicenseFileName] =
    useState('');
  const [uploaddrivinglicenseresponse, setUploadDrivingLicenseResponse] =
    useState(null);
  const [uploaddrvingidfilename, setUploadDrivingIdFileName] = useState('');
  const [uploaddrivingidresponse, setUploadDrivingIdResponse] = useState(null);
  const [uploadnondisclosurefilename, setUploadNonDiscloureFileName] =
    useState('');
  const [uploadnondisclosureresponse, setUploadNonDiscloureResponse] =
    useState(null);
  const [uploaddrefencefilename, setUploadRefenceFileName] = useState('');
  const [agreementVisible, setAgreementVisible] = useState(false);
  const [uploaddrefenceresponse, setUploadRefenceresponse] = useState(null);
  const [uploadpoliceconductfilename, setUploadPoliceConductFileName] =
    useState('');
  const [uploadpoliceconductresponse, setUploadPoliceConductResponse] =
    useState(null);
  const [contarctDocument, setContarctDocument] = useState(null);
  const [nondisclosureagreement, setNonDisclosureAgreement] = useState(null);
  const [oldpassword, setOldPassword] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [supportAdmin, setSupportAdmin] = useState({});
  const [supportEmail, setSupportEmail] = useState({});
  const IMG_COVER = 'cover';
  const [helpVisible, setHelpVisible] = useState(false);
  const [experiance, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [course_certification, setCertificate] = useState('');
  const [date_of_certification, setDateOfCertification] = useState('');
  const [nationality, setNationality] = useState('');
  const [experiance_new_born_baby, setExOfNewBornBaby] = useState('');
  const [work_permit, setWorkPermit] = useState('');
  const [in_possession_of_car, setPossessionOfCar] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [birthdate, setBirthDate] = useState('');
  const [uploadagreementfilenames, setUploadAgreementFileNames] = useState('');
  const [uploadagreementresponses, setUploadAgreementResponses] =
    useState(null);
  const [area, setArea] = useState('All');
  const [locationUpdate, setLocationUpdate] = useState();
  const [invoiceData, setinvoiceData] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [apply, setApply] = useState(false);
  const [profileimage, setProfileImage] = useState('')
  const [isImageVisible, setIsImageVisible] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setTimeout(() => {
      notificationOnOffApi();
    }, 20);
  };
  // AsyncStorage.getItem('usertype').then(value => {
  //   global.usertype = value.toString();
  // });
  useEffect(() => {
    setUploadAgreementResponses(null);
    GetProfile();
    // getSelectedCountry();
    GetHelp();
    GetInvoice();
    getLocationUpdate();
    GetPayment();
    setPaymentCenter(global.isEditable);
    const unsubscribe = navigation.addListener('focus', () => {
      setUploadAgreementResponses(null);
      setPaymentCenter(global.isEditable);
      is_pdf_agreement = false;
      GetProfile();
      GetHelp();
      // getSelectedCountry();
      GetInvoice();
      getLocationUpdate();
      GetPayment();
    });
    const backAction = () => {
      // onLogout();
      navigation.goBack();
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


  const GetPayment = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/total_payment')
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
  const getLocationUpdate = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/location_update')
      .then(res => {
        //setCheckinData(res.data)
        // alert(res.data.length)

        setLocationUpdate(res.status);
        global.global_loader_reff.show_loader(0);
      })
      .finally(e => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const notificationOnOffApi = () => {
    let idObj = {
      status: isEnabled ? '0' : '1',
    };

    helper
      .UrlReqAuthPost('api/user/notification_enable', 'POST', idObj)
      .then(res => {
        global.global_loader_reff.show_loader(0);
      });
  };

  const onLogout = () => {
    AsyncStorage.clear();
    global.token = '';
    global.usertype = '';
    global.admin_approval = '';
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'Signin' }],
      }),
    );
    // navigation.navigate("Signin")
    // navigation.dispatch(
    //   CommonActions.navigate({
    //     name: 'Signin',
    //   }),
    // );
  };
  const uploadContract = async name => {
    remove_documents_ids = '';
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res !== null) {
        if (name === 'driving') {
          setUploadDrivingLicenseFileName(res.name);
          setUploadDrivingLicenseResponse(res);
        } else if (name === 'id') {
          setUploadDrivingIdFileName(res.name);
          setUploadDrivingIdResponse(res);
        } else if (name === 'refernce') {
          setUploadRefenceresponse(res);
          setUploadRefenceFileName(res.name);
        } else if (name === 'police') {
          setUploadPoliceConductResponse(res);
          setUploadPoliceConductFileName(res.name);
        } else if (name === 'non_disclosure_agreement') {
          setUploadNonDiscloureFileName(res.name);
          setUploadNonDiscloureResponse(res);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const DownloadAgreement = name => {
    let pdf_url = '',
      file_name = '',
      success_msg = '';
    if (name === 'contract') {
      pdf_url = contarctDocument;
      file_name = '/Contract_';
      success_msg = 'Contract Downloaded Successfully!';
    } else if (name === 'nondisclosure') {
      pdf_url = nondisclosureagreement;
      file_name = '/Non Disclosure Agreement_';
      success_msg = 'Non Disclosure Agreement Downloaded Successfully!';
    } else if (name === 'driving_license') {
      pdf_url = driving_license;
      file_name = '/driving_license_';
      success_msg = 'Driving license Downloaded Successfully!';
    } else if (name === 'id_card') {
      pdf_url = id_card;
      file_name = '/id_card_';
      success_msg = 'Id Card Downloaded Successfully!';
    } else if (name === 'reference') {
      pdf_url = reference;
      file_name = '/reference_';
      success_msg = 'Reference Downloaded Successfully!';
    } else if (name === 'police_conduct') {
      pdf_url = police_conduct;
      file_name = '/police_conduct_';
      success_msg = 'Police conduct Downloaded Successfully!';
    } else if (name === 'non_disclosure_agreement') {
      pdf_url = police_conduct;
      file_name = '/non_disclosure_agreement_';
      success_msg = 'Non Disclosure Agreement Downloaded Successfully!';
    }
    if (pdf_url !== '') {
      global.global_loader_reff.show_loader(1);
      var min = 1;
      var max = 100;
      var rand = min + Math.random() * (max - min);
      let ext = getExtention(pdf_url);
      if (Platform.OS === 'ios') {
        ext = ext;
      } else {
        ext = '.' + ext;
      }
      const { config, fs } = RNFetchBlob;
      let PictureDir = fs?.dirs?.PictureDir;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          //Related to the Android only
          useDownloadManager: true,
          notification: true,
          path: PictureDir + file_name + rand + ext,
          description: 'Pdf',
        },
      };
      config(options)
        .fetch('GET', pdf_url)
        .then(res => {
          global.global_loader_reff.show_loader(0);
          Global.showToast(success_msg);
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);
          Global.showError(err);
        });
    }
  };
  // const deleteContract = name => {
  //   if (name === 'driving') {
  //     remove_documents_ids = '1';
  //   } else if (name === 'id') {
  //     remove_documents_ids = '2';
  //   } else if (name === 'refernce') {
  //     remove_documents_ids = '3';
  //   } else if (name === 'police') {
  //     remove_documents_ids = '5';
  //   } else if (name === 'non_disclosure_agreement') {
  //     remove_documents_ids = '4';
  //   }
  //   EditProfile();
  // };

  const deleteContract = name => {
    if (name === 'driving') {
      setUploadDrivingLicenseResponse(null);
      remove_documents_ids = '1';
    } else if (name === 'id') {
      setUploadDrivingIdResponse(null);
      remove_documents_ids = '2';
    } else if (name === 'refernce') {
      setUploadRefenceresponse(null);
      remove_documents_ids = '3';
    } else if (name === 'police') {
      setUploadPoliceConductResponse(null);
      remove_documents_ids = '5';
    } else if (name === 'non_disclosure_agreement') {
      setUploadNonDiscloureResponse(null);
      remove_documents_ids = '4';
    }
    EditProfile();
  };
  const openFilter = visible => {
    setFilterVisible(visible);
  };
  const openAgreement = visible => {
    setAgreementVisible(visible);
  };
  const OpenGallery = () => {
    setFilterVisible(false);
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.error && response.assets.length > 0) {
        const selectedImagePath = response.assets[0].uri;
        setImageResponse(response.assets);
        setImagePath(selectedImagePath);
        // Update other necessary states or perform required actions with the image path
      }
    });
  };

  const OpenCamera = () => {
    setFilterVisible(false);
    launchCamera(options, response => {
      if (!response.didCancel && !response.error && response.assets.length > 0) {
        const selectedImagePath = response.assets[0].uri;
        setImageResponse(response.assets);
        setImagePath(selectedImagePath);
        // Update other necessary states or perform required actions with the image path
      }
    });
  };


  const OpenAgreementGallery = () => {
    is_pdf_agreement = false;
    setAgreementVisible(false);
    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        setUploadAgreementResponses(response.assets);
        setUploadAgreementFileNames(response.assets[0].fileName);
      }
    });
  };
  const OpenAgreementCamera = () => {
    is_pdf_agreement = false;
    setAgreementVisible(false);
    launchCamera(options, response => {
      console.log('response.assets', response);
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.errorCode) {
      } else {
        setUploadAgreementResponses(response.assets);
        setUploadAgreementFileNames(response.assets[0].fileName);
      }
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
        console.log("userData->", res);
        if (res.status) {
          setIsEnabled(res.data.notification_enable === 0 ? false : true);

          driving_license =
            res.data.driving_license !== null ? res.data.driving_license : '';
          id_card = res.data.id_card !== null ? res.data.id_card : '';
          non_disclosure_agreement =
            res.data.non_disclosure_agreement !== null
              ? res.data.non_disclosure_agreement
              : '';
          reference = res.data.reference !== null ? res.data.reference : '';
          police_conduct =
            res.data.police_conduct !== null ? res.data.police_conduct : '';
          setUploadDrivingIdFileName(res.data.id_card_name);
          setUploadDrivingLicenseFileName(res.data.driving_license_name);
          setUploadPoliceConductFileName(res.data.police_conduct_name);
          setUploadNonDiscloureFileName(res.data.non_disclosure_agreement_name);
          setUploadRefenceFileName(res.data.reference_name);
          setFirstname(res.data.first_name);
          setLastname(res.data.last_name);
          setExperience(res.data.experiance);
          setQualification(res.data.qualification);
          setArea(res.data.area === 'All' ? 'All Malta' : res.data.area);
          // alert(res.data.area)
          setProfileImage(res.data.profile_picture)
          setCertificate(
            res.data.cource_certification === 'Yes' ? 'YES' : 'NO',
          );
          setExOfNewBornBaby(
            res.data.experiance_new_born_baby === 'Yes' ? 'YES' : 'NO',
          );
          setNationality(res.data.nationality);
          setBirthDate(res.data.date_of_birth);
          setDateOfCertification(res.data.date_of_certification);
          setPossessionOfCar(
            res.data.in_possession_of_car === 'Yes' ? 'YES' : 'NO',
          );
          setWorkPermit(
            res.data.work_permit === 'Yes'
              ? 'YES'
              : res.data.work_permit === 'No'
                ? 'NO'
                : '',
          );
          setUploadAgreementFileNames(res.data.work_permit_document_name);
          //setAddress(res.data.address);
          setMobileNumber(res.data.mobile_number);
          setEmail(res.data.email);
          setContarctDocument(
            res.data.contract_document !== null
              ? res.data.contract_document
              : '',
          );
          setNonDisclosureAgreement(
            res.data.non_disclosure_agreement !== null
              ? res.data.non_disclosure_agreement
              : '',
          );
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

          console.log('Codeeeeee', selectedCountryCode);
          setArea(res.data.area);
          //setCity(res.data.city);
          //setCompany_name(res.data.company_name);
          setImagePath(res.data.profile_picture);
          // setPassportnumber(res.data.id_card_passport_number);
          setSupportAdmin(res.support.admin_email);
          setSupportEmail(res.support.support_email);
          global.global_loader_reff.show_loader(0);
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
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
  const GetInvoice = () => {
    global.global_loader_reff.show_loader(1);
    helper
      .UrlReqAuth('api/nanny/admin_invoice?id=')
      .then(res => {
        if (res.status) {
          setinvoiceData(res.data);
          global.global_loader_reff.show_loader(0);
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .finally(f => {
        global.global_loader_reff.show_loader(0);
      });
  };

  const checkPermissionForInvoice = async invoice_document => {
    if (Platform.OS === 'ios') {
      DownloadInvoice(invoice_document);
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
          DownloadInvoice(invoice_document);
        } else {
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const DownloadInvoice = invoice_document => {
    if (invoice_document !== '' && invoice_document !== null) {
      let pdf_URL = '';

      pdf_URL = invoice_document;

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
          path: PictureDir + '/Invoice_' + rand + ext,
          description: 'Pdf',
        },
      };
      global.global_loader_reff.show_loader(1);

      config(options)
        .fetch('GET', pdf_URL)
        .then(res => {
          Global.showToast('Invoice Downloaded Successfully!');
          global.global_loader_reff.show_loader(0);
        })
        .catch(err => {
          global.global_loader_reff.show_loader(0);
          Global.showError(err);
        });
    } else {
      Global.showError('Invoice not available');
    }
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
        country_code: selectedCountryCode,
        remove_documents_ids: remove_documents_ids,
        date_of_birth: birthdate,
        experiance: experiance,
        qualification: qualification,
        cource_certification: course_certification === 'YES' ? 'Yes' : 'No',
        experiance_new_born_baby:
          experiance_new_born_baby === 'YES' ? 'Yes' : 'No',
        date_of_certification: date_of_certification,
        nationality: nationality,
        work_permit:
          work_permit === 'YES' ? 'Yes' : work_permit === 'NO' ? 'No' : '',
        in_possession_of_car: in_possession_of_car === 'YES' ? 'Yes' : 'No',
        // address: address,
        // city: city,
        area: area,
        profile_picture: imagepath
        // company_name: company_name,
        // id_card_passport_number: id_card_passport_number,
      };
      console.log("edit object%%%%", editObj)
      const editstring = JSON.stringify(editObj);
      body.push({ name: 'data', data: editstring });
      // work permit
      if (uploadagreementresponses !== null) {
        let contractDetail = null;
        if (uploadagreementresponses !== null) {
          contractDetail = JSON.parse(JSON.stringify(uploadagreementresponses));
        }
        console.log('contractDetailcontractDetail', contractDetail);
        if (contractDetail !== null) {
          let path = '';
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
          let contractType = is_pdf_agreement
            ? contractDetail.type
            : contractDetail[0].type;
          var contractData = {
            name: 'work_permit_document',
            filename: contractName,
            type: contractType,
            data: RNFetchBlob.wrap(decodeURIComponent(contractPath)),
          };
          body.push(contractData);
        }
      }
      //Image Upload
      if (imageresponse !== null) {
        let imageDetail = null;
        if (imageresponse !== null) {
          imageDetail = JSON.parse(JSON.stringify(imageresponse));
        }
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
      }
      //Image Upload
      //Driving Upload
      if (uploaddrivinglicenseresponse !== null) {
        let drivingDetail = null;
        if (uploaddrivinglicenseresponse !== null) {
          drivingDetail = JSON.parse(
            JSON.stringify(uploaddrivinglicenseresponse),
          );
        }
        if (drivingDetail !== null) {
          var path = drivingDetail.uri;
          let imageName = '';
          if (
            drivingDetail.name === undefined ||
            drivingDetail.name == null ||
            drivingDetail.name === ''
          ) {
            var getFilename = path.split('/');
            imageName = getFilename[getFilename.length - 1];
            var extension = imageName.split('.')[1];
            imageName = new Date().getTime() + '.' + extension;
          } else {
            imageName = drivingDetail.name;
          }
          let imagePath =
            Platform.OS === 'ios' ? path.replace('file://', '') : path;
          let imageType = drivingDetail.type;
          var imageData = {
            name: 'driving_license',
            filename: imageName,
            type: imageType,
            data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
          };

          body.push(imageData);
        }
      }
      //Driving Upload
      //IdCard Upload
      if (uploaddrivingidresponse !== null) {
        let idDetail = null;
        if (uploaddrivingidresponse !== null) {
          idDetail = JSON.parse(JSON.stringify(uploaddrivingidresponse));
        }
        if (idDetail !== null) {
          var path = idDetail.uri;
          let imageName = '';
          if (
            idDetail.name === undefined ||
            idDetail.name == null ||
            idDetail.name === ''
          ) {
            var getFilename = path.split('/');
            imageName = getFilename[getFilename.length - 1];
            var extension = imageName.split('.')[1];
            imageName = new Date().getTime() + '.' + extension;
          } else {
            imageName = idDetail.name;
          }
          let imagePath =
            Platform.OS === 'ios' ? path.replace('file://', '') : path;
          let imageType = idDetail.type;
          var imageData = {
            name: 'id_card',
            filename: imageName,
            type: imageType,
            data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
          };
          body.push(imageData);
        }
      }
      //IdCard Upload
      //Reference Upload
      if (uploaddrefenceresponse !== null) {
        let referenceDetail = null;
        if (uploaddrefenceresponse !== null) {
          referenceDetail = JSON.parse(JSON.stringify(uploaddrefenceresponse));
        }
        if (referenceDetail !== null) {
          var path = referenceDetail.uri;
          let imageName = '';
          if (
            referenceDetail.name === undefined ||
            referenceDetail.name == null ||
            referenceDetail.name === ''
          ) {
            var getFilename = path.split('/');
            imageName = getFilename[getFilename.length - 1];
            var extension = imageName.split('.')[1];
            imageName = new Date().getTime() + '.' + extension;
          } else {
            imageName = referenceDetail.name;
          }
          let imagePath =
            Platform.OS === 'ios' ? path.replace('file://', '') : path;
          let imageType = referenceDetail.type;
          var imageData = {
            name: 'reference',
            filename: imageName,
            type: imageType,
            data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
          };
          body.push(imageData);
        }
      }
      //Reference Upload
      //Police conduct Upload
      if (uploadpoliceconductresponse !== null) {
        let policeConductDetail = null;
        if (uploadpoliceconductresponse !== null) {
          policeConductDetail = JSON.parse(
            JSON.stringify(uploadpoliceconductresponse),
          );
        }
        if (policeConductDetail !== null) {
          var path = policeConductDetail.uri;
          let imageName = '';
          if (
            policeConductDetail.name === undefined ||
            policeConductDetail.name == null ||
            policeConductDetail.name === ''
          ) {
            var getFilename = path.split('/');
            imageName = getFilename[getFilename.length - 1];
            var extension = imageName.split('.')[1];
            imageName = new Date().getTime() + '.' + extension;
          } else {
            imageName = policeConductDetail.name;
          }
          let imagePath =
            Platform.OS === 'ios' ? path.replace('file://', '') : path;
          let imageType = policeConductDetail.type;
          var imageData = {
            name: 'police_conduct',
            filename: imageName,
            type: imageType,
            data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
          };
          body.push(imageData);
        }
      }
      //Police conduct Upload
      //Police conduct Upload
      if (uploadnondisclosureresponse !== null) {
        let non_disclosure_agreementDetail = null;
        if (uploadnondisclosureresponse !== null) {
          non_disclosure_agreementDetail = JSON.parse(
            JSON.stringify(uploadnondisclosureresponse),
          );
        }
        if (non_disclosure_agreementDetail !== null) {
          var path = non_disclosure_agreementDetail.uri;
          let imageName = '';
          if (
            non_disclosure_agreementDetail.name === undefined ||
            non_disclosure_agreementDetail.name == null ||
            non_disclosure_agreementDetail.name === ''
          ) {
            var getFilename = path.split('/');
            imageName = getFilename[getFilename.length - 1];
            var extension = imageName.split('.')[1];
            imageName = new Date().getTime() + '.' + extension;
          } else {
            imageName = non_disclosure_agreementDetail.name;
          }
          let imagePath =
            Platform.OS === 'ios' ? path.replace('file://', '') : path;
          let imageType = non_disclosure_agreementDetail.type;
          var imageData = {
            name: 'non_disclosure_agreement',
            filename: imageName,
            type: imageType,
            data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
          };
          body.push(imageData);
        }
      }
      //Police conduct Upload
      console.log('dataaa', body);
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
          console.log('resposss', response);
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
  const uploadAgreement = async () => {
    is_pdf_agreement = true;
    if (Platform.OS === 'android') {
      setAgreementVisible(false);
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res !== null) {
        setUploadAgreementFileNames(res.name);
        setUploadAgreementResponses(res);
      }
    } catch (err) {
      console.log('err', err);
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
      resizeMode={IMG_COVER}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Global.GlobalColor.themePink}
        hidden={false}
      />
      <ScrollView
        style={{ marginBottom: scale(80) }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <View style={styles.baseView}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.baseHeader}>
                <Image
                  source={Global.GlobalAssets.drawerIcon}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
                <Global.GlobalText
                  text="MY PROFILE"
                  style={styles.headerText}
                />
              </View>
            </View>
            {/*=============================Personal information============================ */}
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
                {visibles || isshow ? (
                  <Image
                    source={Global.GlobalAssets.profileMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
            {
              visibles && (
                <View style={{
                  height: scale(100),
                  width: scale(100),
                  borderRadius: scale(50),
                  overflow: 'hidden',
                  alignSelf: 'center',
                  backgroundColor: 'transparent',
                  borderWidth: 2,
                  borderColor: Global.GlobalColor.themeBlue
                }}>
                  {
                    imagepath ? (
                      <Image
                        source={{ uri: imagepath }}
                        style={{
                          width: 150, // Adjust the width and height according to your design
                          height: 150, // This will create a circular frame
                          borderRadius: 75, // Half of the width/height to make it a circle
                          overflow: 'hidden',
                          alignSelf: 'center',
                          backgroundColor: 'transparent',
                          borderWidth: 2,
                          borderColor: 'blue',
                        }}
                      />
                    ) : (
                      <Image
                        source={Global.GlobalAssets.placeholderIcon}
                        style={{
                          width: "80%", // Adjust the width and height according to your design
                          height: "80%", // This will create a circular frame
                          resizeMode: "cover",
                          alignSelf: "center",
                        }}
                      />
                    )
                  }

                </View>
              )
            }

            {visibles && (
              <View>
                {firstname !== '' && (
                  <Global.GlobalTextBox
                    editable={false}
                    value={firstname}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    textInputStyle={{ color: Global.GlobalColor.darkBlue }}
                  />
                )}
                {lastname !== '' && (
                  <Global.GlobalTextBox
                    editable={false}
                    value={lastname}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    textInputStyle={{ color: Global.GlobalColor.darkBlue }}
                  />
                )}
                {emailId !== '' && (
                  <Global.GlobalTextBox
                    editable={false}
                    value={emailId}
                    textInputStyle={{ color: Global.GlobalColor.darkBlue }}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                )}
                {/* {mobile_number !== '' && (
                  <Global.GlobalTextBox
                    value={mobile_number}
                    textInputStyle={{ color: Global.GlobalColor.darkBlue }}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    keyboardType={'numeric'}
                    editable={false}
                  />
                )} */}

                <View style={{ marginVertical: 10, alignItems: 'flex-start' }}>
                  <View style={[styles.maintextinputView]}>
                    <TouchableOpacity
                      style={{
                        width: '38%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                        height: '96%',
                      }}
                      disabled={true}
                      onPress={() => {
                        setShowPicker(true);
                      }}>
                      <View activeOpacity={1} style={styles.countrymainView}>
                        {selectedCountryImage !== '' ? (
                          <Image
                            source={{ uri: selectedCountryImage }}
                            style={styles.flag}
                          />
                        ) : null}
                        <Text
                          style={[
                            styles.countryTextStyle,
                            { color: Colors.darkBlue },
                          ]}>
                          {' + ' + selectedCountryCode}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{ width: '69%', marginLeft: scale(-30) }}>
                      <Global.GlobalTextBox
                        value={mobile_number}
                        textInputStyle={{ color: Global.GlobalColor.darkBlue }}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        keyboardType={'numeric'}
                        viewStyle={{
                          borderWidth: 0,
                          marginTop: scale(5),
                          width: '100%',
                        }}
                        editable={false}
                      />
                    </View>
                  </View>
                </View>
                {area !== '' && (
                  <Global.GlobalTextBox
                    editable={false}
                    value={area === 'All' ? "All Malta" : area}
                    textInputStyle={{ color: Global.GlobalColor.darkBlue }}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                )}

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
                      backgroundColor: Global.GlobalColor.themeBlue,
                    }}
                  />
                </View>
              </View>
            )}
            {isshow ? (
              <View
                style={{
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
                {/* <Global.GlobalTextBox
                  placeholder="ENTER MOBILE NUMBER"
                  onChangeText={value => setMobileNumber(value)}
                  value={mobile_number}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  maxLength={15}
                  keyboardType={'numeric'}
                /> */}
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
                            source={{ uri: selectedCountryImage }}
                            style={styles.flag}
                          />
                        ) : null}
                        <Text style={styles.countryTextStyle}>
                          {' + ' + selectedCountryCode}
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
                <DropDownPicker
                  items={[
                    { id: 1, label: 'North', value: 'North' },
                    { id: 2, label: 'Central', value: 'Central' },
                    { id: 3, label: 'South', value: 'South' },
                    { id: 4, label: 'All Malta', value: 'All Malta' },
                  ]}
                  defaultValue={area === 'All' ? "All Malta" : area}
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

            {/*=============================Work and experience==================================== */}
            <TouchableOpacity
              onPress={() => {
                setWorkVisible(!workVisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !workVisible
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderStyle]}>
                {!workVisible && (
                  <Image
                    source={Global.GlobalAssets.work}
                    style={styles.menuImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                )}
                <Global.GlobalText
                  text={'Work and Experience'}
                  style={[styles.menuNm]}
                />
                {workVisible ? (
                  <Image
                    source={Global.GlobalAssets.work}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {workVisible ? (
              <>
                <Global.GlobalTextBox
                  placeholder="ENTER QUALIFICATION"
                  onChangeText={value => setQualification(value)}
                  value={qualification}
                  editable={isEditable}
                  textInputStyle={{
                    color: isEditable
                      ? Global.GlobalColor.themePink
                      : Global.GlobalColor.themeBlue,
                  }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Global.GlobalTextBox
                  placeholder="ENTER EXPERIENCE"
                  onChangeText={value => setExperience(value)}
                  value={experiance}
                  editable={isEditable}
                  textInputStyle={{
                    color: isEditable
                      ? Global.GlobalColor.themePink
                      : Global.GlobalColor.themeBlue,
                  }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <QuestionAnswer
                  title={'FIRST AID COURSE CERTIFICATION'}
                  onPressYes={() => setCertificate('YES')}
                  onPressNo={() => setCertificate('NO')}
                  disabled={!isEditable}
                  sourceOfYes={
                    course_certification === 'YES'
                      ? Global.GlobalAssets.radioActive
                      : Global.GlobalAssets.radio
                  }
                  disabledSrcOfYes={
                    course_certification === 'YES'
                      ? Global.GlobalAssets.radioActiveBlue
                      : Global.GlobalAssets.radio
                  }
                  sourceOfNo={
                    course_certification === 'NO'
                      ? Global.GlobalAssets.radioActive
                      : Global.GlobalAssets.radio
                  }
                  disabledSrcOfNo={
                    course_certification === 'NO'
                      ? Global.GlobalAssets.radioActiveBlue
                      : Global.GlobalAssets.radio
                  }
                />
                {course_certification === 'YES' && (
                  <TouchableOpacity
                    disabled={!isEditable}
                    style={[
                      styles.SectionStyle,
                      { justifyContent: 'space-between' },
                    ]}
                    onPress={showDatePicker}>
                    <DateTimePicker
                      isVisible={isDatePickerVisible}
                      onConfirm={handleDate}
                      disabled={isEditable}
                      onCancel={hideDatePicker}
                      maximumDate={tomorrow}
                    />
                    <TouchableOpacity
                      disabled={!isEditable}
                      onPress={showDatePicker}>
                      {date_of_certification ? (
                        <Global.GlobalText
                          style={{
                            color: isEditable
                              ? Global.GlobalColor.themePink
                              : Global.GlobalColor.themeBlue,
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
                  disabled={!isEditable}
                  title={'EXPERIENCE WITH NEW BORN BABY'}
                  onPressYes={() => setExOfNewBornBaby('YES')}
                  onPressNo={() => setExOfNewBornBaby('NO')}
                  sourceOfYes={
                    experiance_new_born_baby === 'YES'
                      ? Global.GlobalAssets.radioActive
                      : Global.GlobalAssets.radio
                  }
                  disabledSrcOfYes={
                    experiance_new_born_baby === 'YES'
                      ? Global.GlobalAssets.radioActiveBlue
                      : Global.GlobalAssets.radio
                  }
                  sourceOfNo={
                    experiance_new_born_baby === 'NO'
                      ? Global.GlobalAssets.radioActive
                      : Global.GlobalAssets.radio
                  }
                  disabledSrcOfNo={
                    experiance_new_born_baby === 'NO'
                      ? Global.GlobalAssets.radioActiveBlue
                      : Global.GlobalAssets.radio
                  }
                />
                <Global.GlobalTextBox
                  editable={isEditable}
                  placeholder="NATIONALITY"
                  textInputStyle={{
                    color: isEditable
                      ? Global.GlobalColor.themePink
                      : Global.GlobalColor.themeBlue,
                  }}
                  onChangeText={value => setNationality(value)}
                  value={nationality}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <TouchableOpacity
                  disabled={!isEditable}
                  style={[
                    styles.SectionStyle,
                    { justifyContent: 'space-between' },
                  ]}
                  onPress={showDateTimePicker}>
                  <DateTimePicker
                    isVisible={isDateTimePickerVisible}
                    onConfirm={handleDatePicked}
                    onCancel={hideDateTimePicker}
                    maximumDate={tomorrow}
                  />
                  <TouchableOpacity
                    disabled={!isEditable}
                    onPress={showDateTimePicker}>
                    {birthdate ? (
                      <Global.GlobalText
                        style={{
                          color: isEditable
                            ? Global.GlobalColor.themePink
                            : Global.GlobalColor.themeBlue,
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
                  disabled={!isEditable}
                  onPressYes={() => setWorkPermit('YES')}
                  onPressNo={() => setWorkPermit('NO')}
                  sourceOfYes={
                    work_permit === 'YES'
                      ? Global.GlobalAssets.radioActive
                      : Global.GlobalAssets.radio
                  }
                  disabledSrcOfYes={
                    work_permit === 'YES'
                      ? Global.GlobalAssets.radioActiveBlue
                      : Global.GlobalAssets.radio
                  }
                  sourceOfNo={
                    work_permit === 'NO'
                      ? Global.GlobalAssets.radioActive
                      : Global.GlobalAssets.radio
                  }
                  disabledSrcOfNo={
                    work_permit === 'NO'
                      ? Global.GlobalAssets.radioActiveBlue
                      : Global.GlobalAssets.radio
                  }
                />
                {work_permit === 'YES' && (
                  <TouchableOpacity
                    disabled={!isEditable}
                    style={[
                      styles.uploadBase,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                      },
                    ]}
                    onPress={() => openAgreement(true)}>
                    <View style={styles.contractView}>
                      {uploadagreementfilenames === '' ? (
                        <Global.GlobalText
                          text={'WORK PERMIT DOCUMENT'}
                          style={{
                            fontSize: scale(15),
                            color: Global.GlobalColor.lightPink,
                          }}
                        />
                      ) : (
                        <Global.GlobalText
                          text={uploadagreementfilenames}
                          style={{
                            fontSize: scale(13),
                            color: isEditable
                              ? Global.GlobalColor.themePink
                              : Global.GlobalColor.themeBlue,
                          }}
                        />
                      )}
                    </View>
                    <View style={styles.downloadView}>
                      <Image
                        style={styles.downloadImage}
                        resizeMode="contain"
                        source={Global.GlobalAssets.uploadIcon}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <QuestionAnswer
                  disabled={!isEditable}
                  title={'IN POSSESSION OF CAR'}
                  onPressYes={() => setPossessionOfCar('YES')}
                  onPressNo={() => setPossessionOfCar('NO')}
                  sourceOfYes={
                    in_possession_of_car === 'YES'
                      ? Global.GlobalAssets.radioActive
                      : Global.GlobalAssets.radio
                  }
                  disabledSrcOfYes={
                    in_possession_of_car === 'YES'
                      ? Global.GlobalAssets.radioActiveBlue
                      : Global.GlobalAssets.radio
                  }
                  sourceOfNo={
                    in_possession_of_car === 'NO'
                      ? Global.GlobalAssets.radioActive
                      : Global.GlobalAssets.radio
                  }
                  disabledSrcOfNo={
                    in_possession_of_car === 'NO'
                      ? Global.GlobalAssets.radioActiveBlue
                      : Global.GlobalAssets.radio
                  }
                />
                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: scale(5),
                  }}>
                  <Global.GlobalButton
                    text={isEditable ? 'SAVE' : 'EDIT'}
                    onPress={() => {
                      if (!isEditable) {
                        setIsEditable(true);
                      } else {
                        setIsEditable(false);
                        EditProfile();
                      }
                    }}
                    style={{
                      height: scale(40),
                      width: scale(100),
                      backgroundColor: isEditable
                        ? Global.GlobalColor.themePink
                        : Global.GlobalColor.themeBlue,
                      paddingHorizontal: scale(4),
                    }}
                  />
                </View>
              </>
            ) : null}
            {workVisible && (
              <TouchableOpacity
                onPress={() => {
                  setIsEditable(false);

                  setWorkVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            {/*=============================Payment==================================== */}
            <TouchableOpacity
              onPress={() => {
                setPaymentCenter(!paymentCenter);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !paymentCenter
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderStyle]}>
                {!paymentCenter && (
                  <Image
                    source={Global.GlobalAssets.paymenuMenu}
                    style={styles.menuImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                )}
                <Global.GlobalText text={'PAYMENT'} style={[styles.menuNm]} />
                {paymentCenter ? (
                  <Image
                    source={Global.GlobalAssets.paymenuMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {paymentCenter ? (
              <>
                <View style={styles.paymentView}>
                  <Global.GlobalText
                    style={[styles.paymentText, { paddingTop: scale(5) }]}
                    text={
                      'You have earned a total amount of ' +
                      global.currency +
                      parseFloat(paymentInfo.total_amount).toFixed(1) +
                      ' until this date.'
                    }
                  />
                  <Global.GlobalText
                    style={[styles.paymentText, { paddingVertical: scale(10) }]}
                    text={
                      'You have earned a total amount of ' +
                      global.currency +
                      parseFloat(paymentInfo.current_month_amount).toFixed(1) +
                      ' for this month.'
                    }
                  />
                  {/* <Global.GlobalText
                    style={styles.head}
                    text="You have a balance payment of €780 "
                  /> */}
                </View>
              </>
            ) : null}
            {paymentCenter && (
              <TouchableOpacity
                onPress={() => {
                  global.isEditable = false;
                  setPaymentCenter(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            {/*=============================Document==================================== */}
            <TouchableOpacity
              onPress={() => {
                setDocumentVisible(!documentvisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !documentvisible
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                  paddingVertical: scale(15),
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderMargin]}>
                {!documentvisible && (
                  <Image
                    source={Global.GlobalAssets.documentMenu}
                    style={styles.menuImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                )}
                <Global.GlobalText text={'DOCUMENT'} style={styles.menuNm} />
                {documentvisible ? (
                  <Image
                    source={Global.GlobalAssets.documentMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {documentvisible ? (
              <>
                <View style={styles.uploadDownloadButtonView}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text={
                        uploaddrvinglicensefilename === ''
                          ? 'DRIVING LICENSE'
                          : uploaddrvinglicensefilename
                      }
                      numberOfLines={2}
                      style={styles.uploadText}
                    />
                  </View>
                  <View style={styles.downloadView}>
                    {driving_license !== '' ? (
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          onPress={() => DownloadAgreement('driving_license')}>
                          <Image
                            style={styles.downloadImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.downloadWhite}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => uploadContract('driving')}>
                          <Image
                            style={styles.editImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.editIcon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteContract('driving')}>
                          <Image
                            style={styles.editImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.deleteIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => uploadContract('driving')}>
                        <Image
                          style={styles.downloadImage}
                          resizeMode="contain"
                          source={Global.GlobalAssets.uploadPink}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <TouchableOpacity style={styles.uploadDownloadButtonView}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text={
                        uploaddrvingidfilename === ''
                          ? 'ID CARD/ PASSPORT'
                          : uploaddrvingidfilename
                      }
                      numberOfLines={2}
                      style={styles.uploadText}
                    />
                  </View>
                  <View style={styles.downloadView}>
                    {id_card !== '' ? (
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          onPress={() => DownloadAgreement('id_card')}>
                          <Image
                            style={styles.downloadImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.downloadWhite}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => uploadContract('id')}>
                          <Image
                            style={styles.editImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.editIcon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteContract('id')}>
                          <Image
                            style={styles.editImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.deleteIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => uploadContract('id')}>
                        <Image
                          style={styles.downloadImage}
                          resizeMode="contain"
                          source={Global.GlobalAssets.uploadPink}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadDownloadButtonView}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text={
                        uploaddrefencefilename === ''
                          ? 'REFERENCE'
                          : uploaddrefencefilename
                      }
                      style={styles.uploadText}
                    />
                  </View>
                  <View style={styles.downloadView}>
                    {reference !== '' ? (
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          onPress={() => DownloadAgreement('reference')}>
                          <Image
                            style={styles.downloadImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.downloadWhite}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => uploadContract('refernce')}>
                          <Image
                            style={styles.editImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.editIcon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteContract('refernce')}>
                          <Image
                            style={styles.editImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.deleteIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => uploadContract('refernce')}>
                        <Image
                          style={styles.downloadImage}
                          resizeMode="contain"
                          source={Global.GlobalAssets.uploadPink}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadDownloadButtonView}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text={
                        uploadpoliceconductfilename === ''
                          ? 'POLICE CONDUCT'
                          : uploadpoliceconductfilename
                      }
                      numberOfLines={2}
                      style={styles.uploadText}
                    />
                  </View>
                  <View style={styles.downloadView}>
                    {police_conduct !== '' ? (
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          onPress={() => DownloadAgreement('police_conduct')}>
                          <Image
                            style={styles.downloadImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.downloadWhite}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => uploadContract('police')}>
                          <Image
                            style={styles.editImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.editIcon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteContract('police')}>
                          <Image
                            style={styles.editImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.deleteIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => uploadContract('police')}>
                        <Image
                          style={styles.downloadImage}
                          resizeMode="contain"
                          source={Global.GlobalAssets.uploadPink}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
                {non_disclosure_agreement !== '' ? (
                  <TouchableOpacity style={styles.uploadDownloadButtonView}>
                    <View style={styles.contractView}>
                      <Global.GlobalText
                        text={
                          uploadnondisclosurefilename === ''
                            ? 'NON DISCLOSURE AGREEMENT'
                            : uploadnondisclosurefilename
                        }
                        style={styles.uploadText}
                        numberOfLines={2}
                      />
                    </View>
                    <View style={styles.downloadView}>
                      {non_disclosure_agreement !== '' ? (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() =>
                              DownloadAgreement('non_disclosure_agreement')
                            }>
                            <Image
                              style={styles.downloadImage}
                              resizeMode="contain"
                              source={Global.GlobalAssets.downloadWhite}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              uploadContract('non_disclosure_agreement')
                            }>
                            <Image
                              style={styles.editImage}
                              resizeMode="contain"
                              source={Global.GlobalAssets.editIcon}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              deleteContract('non_disclosure_agreement')
                            }>
                            <Image
                              style={styles.editImage}
                              resizeMode="contain"
                              source={Global.GlobalAssets.deleteIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            uploadContract('non_disclosure_agreement')
                          }>
                          <Image
                            style={styles.downloadImage}
                            resizeMode="contain"
                            source={Global.GlobalAssets.uploadPink}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                ) : null}
                {/* remove by client */}
                {/* <TouchableOpacity
                  style={[
                    styles.uploadDownloadButtonView,
                    { marginBottom: scale(0) },
                  ]}
                  onPress={() => DownloadAgreement('contract')}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text="SIGNED CONTRACT"
                      style={styles.uploadText}
                    />
                  </View>
                  <TouchableOpacity style={styles.downloadView}>
                    <Image
                      style={styles.downloadImage}
                      resizeMode="contain"
                      source={Global.GlobalAssets.downloadWhite}
                    />
                  </TouchableOpacity>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={[
                    styles.uploadDownloadButtonView,
                    { marginBottom: scale(20) },
                  ]}
                  onPress={() => DownloadAgreement('nondisclosure')}>
                  <View style={styles.contractView}>
                    <Global.GlobalText
                      text={'NON DISCLOSURE AGREEMENT'}
                      style={styles.uploadText}
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
                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: scale(5),
                  }}>
                  <Global.GlobalButton
                    text={'save'}
                    onPress={() => {
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
              </>
            ) : null}
            {documentvisible && (
              <TouchableOpacity
                onPress={() => {
                  setDocumentVisible(false);
                }}
                style={styles.upArrowBtnStyle}>
                <Image
                  source={Global.GlobalAssets.upButton}
                  style={styles.globalImageStyle}
                  resizeMode={IMG_CONTAIN}
                />
              </TouchableOpacity>
            )}
            {/*=============================Account Setting============================ */}
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
                <View style={{ paddingHorizontal: scale(6) }}>
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
                  <View style={{ marginVertical: scale(5), alignSelf: 'center' }}>
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
            {/*=============================Invoices==================================== */}
            <TouchableOpacity
              onPress={() => {
                setInvoicesVisible(!invoicesVisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !invoicesVisible
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                  paddingVertical: scale(15),
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderMargin]}>
                {!invoicesVisible && (
                  <Image
                    source={Global.GlobalAssets.invoiceMenu}
                    style={styles.menuImageStyle}
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
              <View style={styles.invoiceViewStyle}>
                <View
                  style={[
                    styles.invoiceView,
                    {
                      borderRadius: scale(8),
                    },
                  ]}>
                  {invoiceData.map(item => {
                    return (
                      <View style={styles.row}>
                        <Global.GlobalText
                          text={
                            'INVOICE FOR ' +
                            moment(item.month, 'MM').format('MMMM')
                          }
                          style={[styles.message, styles.invoiceTitle]}
                        />
                        <TouchableOpacity
                          style={{ marginHorizontal: scale(10) }}
                          onPress={() => {
                            // navigation.navigate('Invoicedetails');
                            console.log(item);
                            checkPermissionForInvoice(item.document);
                          }}>
                          <Image
                            source={Global.GlobalAssets.download}
                            style={styles.eyeStyle}
                            resizeMode={IMG_CONTAIN}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <Global.GlobalButton
                  text="CREATE INVOICE"
                  style={{ paddingHorizontal: 0, alignSelf: 'center' }}
                  onPress={() => {
                    navigation.navigate('CreateInvoice');
                  }}
                />
              </View>
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
            {/*=============================Help==================================== */}
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
            {/* =========================Support============================= */}
            <TouchableOpacity
              onPress={() => {
                setSupportVisible(!supportvisible);
              }}
              style={[
                styles.cardContent,
                {
                  backgroundColor: !supportvisible
                    ? "#FBE6A5"
                    : Global.GlobalColor.themeLightBlue,
                  paddingVertical: scale(15),
                },
              ]}>
              <View style={[styles.baseHeader, styles.baseHeaderMargin]}>
                {!supportvisible && (
                  <Image
                    source={Global.GlobalAssets.supportMenu}
                    style={styles.menuImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                )}
                <Global.GlobalText text={'SUPPORT'} style={styles.menuNm} />
                {supportvisible ? (
                  <Image
                    source={Global.GlobalAssets.supportMenu}
                    style={styles.opacityImageStyle}
                    resizeMode={IMG_CONTAIN}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
            {supportvisible ? (
              <>
                <View style={styles.paymentView}>
                  <Global.GlobalText
                    style={styles.paymentText}
                    text={supportAdmin.email}
                  />
                  {supportAdmin.mobile_number1 ? (
                    <Global.GlobalText
                      style={styles.paymentText}
                      text={'Contact No.: ' + supportAdmin.mobile_number1}
                    />
                  ) : null}
                </View>
           
              </>
            ) : null}
            {supportvisible && (
              <TouchableOpacity
                onPress={() => {
                  setSupportVisible(false);
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
              style={[styles.cardContent, { backgroundColor: "#FBE6A5" }]}
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
      <Modal animationType="slide" transparent={true} visible={filterVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => openFilter(false)}
              style={styles.modalCloseBtn}>
              <Image
                source={Global.GlobalAssets.close}
                resizeMode={IMG_CONTAIN}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={agreementVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => openAgreement(false)}
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
              onPress={() => OpenAgreementGallery('uploadPdf')}
              style={styles.optionBase}>
              <Text style={styles.modalText}>Choose From Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => OpenAgreementCamera('uploadPdf')}
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
  // editView: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0,0,0,0.2)',
  // },
  notificationMenu: { marginVertical: scale(10), flexDirection: 'row' },
  containerStyle: {
    width: scale(280),
    alignSelf: 'center',
  },
  noPaddingVertical: { paddingVertical: 0 },
  baseView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: scale(50),
    marginBottom: scale(40),
  },
  textCompletd: { paddingVertical: scale(5), paddingStart: scale(10) },
  textinputStyle: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 0,
    backgroundColor: 'transparent',
    width: '95%',
    height: scale(40),
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
  invoiceViewStyle: { marginHorizontal: scale(25), marginVertical: scale(10) },
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
  maintextinputView: {
    height: scale(55),
    borderRadius: scale(5),
    borderWidth: 2,
    borderColor: Global.GlobalColor.borderColor,
    // width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    width: scale(265),
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
    // marginStart: scale(5),
  },
  countryTextStyle: {
    alignContent: 'center',
    color: Colors.themePink,

    fontSize: scale(15),
    fontFamily: Global.GlobalFont.Regular,
    textAlignVertical: 'center',
  },
  invoiceView: {
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
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: scale(10),
  },
  nonCheck: { marginHorizontal: scale(5) },
  editBtnStyle: { marginRight: scale(2), marginHorizontal: 0, paddingRight: 0 },
  placeholderStyle: {
    fontFamily: Global.GlobalFont.Regular,
    color: '#FFD2D6',
  },
  cardChildView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: scale(10),
  },
  alignCenter: { alignSelf: 'center' },
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
  wishlistImg: { height: scale(50), width: scale(50) },
  activeLabelStyle: {
    color: Global.GlobalColor.themePink,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(15),
  },
  eyeStyle: {
    height: scale(35),
    width: scale(25),
    marginLeft: scale(3.2),
  },
  invoiceDetailBtn: {
    height: scale(25),
    width: scale(30),
    backgroundColor: Global.GlobalColor.themeBlue,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: scale(2),
    marginRight: scale(10),
    alignItems: 'center',
  },
  itemStyle: {
    justifyContent: 'flex-start',
    height: scale(30),
  },
  invoiceTitle: {
    color: Global.GlobalColor.themePink,
    fontSize: scale(19),
    textTransform: 'uppercase',
  },
  invoices: {
    opacity: 0.2,
    marginTop: scale(-10),
    marginLeft: scale(-17),
  },
  starStyle: { marginHorizontal: scale(2) },
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
  head: {
    fontSize: scale(18),
    textTransform: 'none',
    color: Global.GlobalColor.themePink,
  },
  paymentText: {
    fontSize: scale(18),
    textTransform: 'none',
    paddingVertical: scale(2),
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
  checkMark: { marginHorizontal: scale(5), opacity: 0.2 },
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
  regularFont: { fontSize: scale(18) },
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
    transform: [{ rotate: '-20deg' }],
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
  uploadText: {
    color: Global.GlobalColor.themeBlue,
    fontSize: scale(12),
    fontFamily: Global.GlobalFont.Regular,
    flexWrap: 'nowrap',
    textTransform: 'none',
    paddingEnd: scale(10),
  },
  uploadDownloadButtonView: {
    borderRadius: scale(5),
    flexDirection: 'row',
    borderColor: Global.GlobalColor.borderColor,
    borderWidth: 2,
    height: scale(55),
    marginLeft: scale(12),
    marginTop: scale(5),
    marginRight: scale(12),
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  downloadImage: {
    width: scale(22),
    height: scale(22),
    marginRight: scale(2),
  },
  editImage: {
    width: scale(20),
    height: scale(20),
    marginHorizontal: scale(2),
  },
  downloadView: {
    width: '10%',
    alignItems: 'flex-end',
    paddingEnd: scale(5),
  },
  contractView: {
    width: '90%',
    paddingStart: scale(5),
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(55),
    width: scale(260),
    marginVertical: scale(10),
    borderColor: '#bcd8f6',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingLeft: scale(15),
    alignSelf: 'center',
  },
  textinput_imageView: {
    height: scale(20),
    width: scale(20),
    marginEnd: '5%',
  },
  questionBase: {
    backgroundColor: 'white',
    width: scale(260),
    height: scale(65),
    paddingVertical: scale(8),
    paddingLeft: scale(15),
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Global.GlobalColor.borderColor,
    borderRadius: 5,
    marginVertical: scale(8),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonBase: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: scale(5),
  },
  uploadBase: {
    backgroundColor: 'white',
    height: scale(55),
    width: scale(260),
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
});
export default Profile;
