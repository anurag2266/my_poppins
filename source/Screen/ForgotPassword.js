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
  Keyboard,
} from 'react-native';
import Global from '../Global/globalinclude';
import { scale } from '../Theme/Scalling';
import helper from '../Global/Helper/helper';

import { Card } from 'native-base';
const ForgotPassword = props => {
  const navigation = props.navigation;

  React.useEffect(() => {
    setEmail('');
  }, []);
  const [emailId, setEmail] = useState('');

  const ValidEmail = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailId === '') {
      Global.showError('Please enter email address');
    } else if (reg.test(emailId) === false) {
      Global.showError('Please enter valid email address');
    } else {
      SendMail()
    }
  }
  const SendMail = () => {
    global.global_loader_reff.show_loader(1);
    let forgotObj = {
      email: emailId,
    };
    helper
      .UrlReq('api/user/forgot_password', 'POST', forgotObj)
      .then(res => {
        if (res.status) {
          Global.showToast(res.message);
          navigation.navigate('Relogin');
          global.global_loader_reff.show_loader(0);
        } else {
          global.global_loader_reff.show_loader(0);
          Global.showError(res.message);
        }
      })
      .catch(err => {
        global.global_loader_reff.show_loader(0);
        Global.showError(err);
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
        style={{ marginBottom: scale(0) }}
        showsVerticalScrollIndicator={false}>
        <Global.GlobalHeader onPress={() => navigation.goBack()} />
        <View style={styles.baseView}>

          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Global.GlobalText text="Forgot Password?" />
            </View>
            <View style={{ paddingStart: scale(12) }}>
              <TouchableOpacity>
                <Global.GlobalText
                  text="Please enter your registered Email-ID"
                  style={styles.forgotText}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: scale(10),
              }}>
              <Global.GlobalTextBox
                placeholder="EMAIL ID"
                rightIcon={Global.GlobalAssets.emailicon}
                onChangeText={value => setEmail(value)}
                value={emailId}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
          </Card>
          <View style={{ marginTop: scale(15), alignSelf: 'center' }}>
            <Global.GlobalButton
              text={'Send email'}
              onPress={() => ValidEmail()}
            />
          </View>
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
    height: scale(200),
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
  },
});
export default ForgotPassword;
