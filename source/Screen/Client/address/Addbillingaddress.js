import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView, KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
  Platform,
} from 'react-native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import helper from '../../../Global/Helper/helper';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { Card } from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker';
import { AddressContext } from '../../../Context/addressContext';


const Addbillingaddress = ({ navigation }) => {
  const { fulladdress } = useContext(AddressContext);
  const [area, setArea] = useState('');
  const [check, setCheck] = useState(1);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

useEffect(()=> {
  GetProfile()
})

  const GetProfile = () => {
    helper
      .UrlReqAuth(
        'api/user/get_profile?device_type=' +
        Platform.OS +
        '&user_type=' +
        global.usertype,
      )
      .then(res => {
        if (res.status) {
          setAddress(address => (address ? address : res.data.address));
          setCity(city => (city ? city : res.data.city));
          setArea(area => (area ? area : res.data.area));
        } else {
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };

  const AddAddress = () => {

    global.global_loader_reff.show_loader(1);


    let addressObj = {
      device_type: Platform.OS,
      address: address,
      city: city,
      area: area,
      is_primary_address: check ? '1' : '0',
    };

    helper
      .UrlReqAuthPost('api/client/add_address', 'POST', addressObj)
      .then(res => {

        if (res.status) {
          Global.showToast(res.message);
          navigation.goBack();
          global.global_loader_reff.show_loader(0);
          clearData();
        } else {
          clearData();
          Global.showError(res.message);
          global.global_loader_reff.show_loader(0);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
      });
  };
  const clearData = () => {
    setAddress('');
    setCity('');
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{}}>
          <View style={[styles.baseView, { ...Platform.select({ ios: { zIndex: 1 } }) }]}>
            <Global.GlobalHeader onPress={() => navigation.goBack()} />
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Global.GlobalText
                  text="ADD BILLING ADDRESS"
                  style={{ color: 'white' }}
                />
              </View>
              <View
                style={{
                  padding: scale(15),
                }}>
                <View>
                  <Global.GlobalTextBox
                    placeholder="ADDRESS"
                    viewStyle={{ marginBottom: 0 }}
                    onChangeText={value => setAddress(value)}
                    value={address}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <Text>
                    {fulladdress}
                  </Text>
                </View>
                <View>
                  <Global.GlobalTextBox
                    placeholder="CITY"
                    viewStyle={{ marginBottom: 0 }}
                    onChangeText={value => setCity(value)}
                    value={city}
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                <View style={{ marginTop: 4, }}>
                  <View
                    style={{ ...Platform.select({ ios: { zIndex: 10 } }) }}>
                    <DropDownPicker
                      items={[
                        { id: 1, label: 'North', value: 'North' },
                        { id: 2, label: 'Central', value: 'Central' },
                        { id: 3, label: 'South', value: 'South' },

                      ]}
                      defaultValue={area}

                      containerStyle={{
                        width: scale(235),
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
                      placeholder={'SELECT AREA'}
                      placeholderStyle={{
                        fontFamily: Global.GlobalFont.Regular,
                        color: '#FFD2D6',
                      }}
                      arrowColor={Global.GlobalColor.themePink}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: scale(15),
                      marginVertical: scale(10),
                    }}
                    onPress={() => {
                      setCheck(!check);
                    }}>
                    <Text style={styles.setText}>SET AS PRIMARY</Text>
                    {check ? (
                      <Image
                        style={styles.checkImg}
                        source={Global.GlobalAssets.checkActive}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <View style={styles.unCheck}></View>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{ alignSelf: 'flex-end', marginTop: scale(15) }}>
                  <Global.GlobalButton
                    onPress={() => {
                      AddAddress();
                    }}
                    text="SAVE"
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
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  setText: {
    marginRight: scale(15),
    color: Global.GlobalColor.themeBlue,
    fontFamily: Global.GlobalFont.Regular,
    fontSize: scale(18),
  },
  bgImg: { height: '109%', width: '100%', alignItems: 'center' },
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
  unCheck: {
    height: scale(22),
    width: scale(22),
    backgroundColor: Global.GlobalColor.themePink,
    borderRadius: scale(5),
  },
  innerCard: {
    backgroundColor: 'white',
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  checkImg: { height: scale(22), width: scale(22) },
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
  dropStyle: {
    backgroundColor: 'white',
    height: scale(50),
    width: scale(235),
    marginVertical: scale(8),
    alignSelf: 'center',

    borderColor: '#bcd8f6',
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
  },
});
export default Addbillingaddress;
