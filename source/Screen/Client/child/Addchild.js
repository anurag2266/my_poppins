import React, {useState, useEffect} from 'react';
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
  Platform,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import {scale} from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {Card} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
const Addchild = ({navigation}) => {
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [childname, setChildName] = useState('');
  const [dob, setDateOfBirth] = useState('');
  const [allergies, setAllergies] = useState('');
  const [otherinfo, setOtherInfo] = useState('');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate());
  const handleDatePicked = date => {
    var d = date;
    let selected = moment(d).format('DD-MM-YYYY');
    setDateOfBirth(selected);
    hideDateTimePicker();
  };
  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };
  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };
  const clearData = () => {
    setChildName('');
    setDateOfBirth('');
    setAllergies('');
    setOtherInfo('');
  };
  const AddChildren = () => {
    global.global_loader_reff.show_loader(1);
    let childObj = {
      device_type: Platform.OS,
      name: childname,
      date_of_birth: dob,
      medical_or_allergies_issue: allergies,
      like_to_do_information: '',
      about_child: otherinfo,
    };
    helper
      .UrlReqAuthPost('api/client/add_children', 'POST', childObj)
      .then(res => {
        if (res.status) {
          Global.showToast(res.message);
          navigation.goBack();
          global.global_loader_reff.show_loader(0);
          clearData();
        } else {
          Global.showError(res.message);
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
        showsVerticalScrollIndicator={false}
        style={{marginBottom: scale(70)}}>
        <View style={styles.baseView}>
          <Global.GlobalHeader onPress={() => navigation.goBack()} />
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="ADD Child" style={{color: 'white'}} />
            </View>
            <View
              style={{
                padding: scale(15),
              }}>
              <View>
                <Global.GlobalTextBox
                  placeholder="NAME"
                  viewStyle={{marginBottom: 0}}
                  onChangeText={value => setChildName(value)}
                  value={childname}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
              <TouchableOpacity
                style={[styles.SectionStyle, {justifyContent: 'space-between'}]}
                onPress={showDateTimePicker}>
                <DateTimePicker
                  isVisible={isDateTimePickerVisible}
                  onConfirm={handleDatePicked}
                  onCancel={hideDateTimePicker}
                  // maximumDate={new Date()}
                  maximumDate={tomorrow}
                />
                <TouchableOpacity onPress={showDateTimePicker}>
                  {dob ? (
                    <Global.GlobalText
                      style={{
                        color: Global.GlobalColor.themePink,
                        fontFamily: Global.GlobalFont.Regular,
                        fontSize: scale(16),
                      }}
                      text={dob}
                    />
                  ) : (
                    <Global.GlobalText
                      style={{
                        color: Global.GlobalColor.lightPink,
                        fontFamily: Global.GlobalFont.Regular,
                        fontSize: scale(16),
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
              <View>
                <Global.GlobalTextBox
                  placeholder="MEDICAL ALLERGIES"
                  viewStyle={{marginBottom: 0}}
                  onChangeText={value => setAllergies(value)}
                  value={allergies}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
              <View>
                <Global.GlobalTextBox
                  placeholder="Anything We Should know about your child"
                  viewStyle={{marginBottom: 0}}
                  onChangeText={value => setOtherInfo(value)}
                  value={otherinfo}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
              <View style={{alignSelf: 'flex-end'}}>
                <Global.GlobalButton
                  text="SAVE"
                  onPress={() => {
                    AddChildren();
                  }}
                  style={{
                    height: scale(40),
                    width: scale(120),
                    paddingHorizontal: scale(4),
                  }}
                />
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  bgImg: {height: '109%', width: '100%', alignItems: 'center'},
  card: {
    marginLeft: scale(10),
    marginRight: scale(10),
    borderRadius: scale(15),
    backgroundColor: Global.GlobalColor.themeLightBlue,
    width: scale(285),
    marginTop: scale(40),
  },
  baseView: {
    justifyContent: 'center',

    marginTop: scale(10),
  },
  innerCard: {
    backgroundColor: 'white',
    marginLeft: scale(10),
    marginRight: scale(10),
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
    paddingVertical: scale(5),
    fontSize: scale(18),
    textTransform: 'none',
    paddingStart: scale(20),
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(55),
    width: scale(235),
    marginTop: scale(10),
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
});
export default Addchild;
