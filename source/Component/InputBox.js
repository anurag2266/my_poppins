import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {scale} from '../Theme/Scalling.js';
import GlobalFont from '../Theme/Fonts';
import GlobalColor from '../Theme/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TextInputBox = props => {
  const [passwordsecure, setPasswordSecure] = useState(true);
  const inputElementRef = useRef(null);
  useEffect(() => {
    inputElementRef.current.setNativeProps({
      style: {fontFamily: GlobalFont.Regular},
    });
  });
  const clickPassword = () => {
    if (passwordsecure) {
      setPasswordSecure(false);
    } else {
      setPasswordSecure(true);
    }
  };
  return (
    <View>
      {props.label && (
        <View style={styles.labelView}>
          <Text style={styles.labelStyle}>{props.label}</Text>
          {props.value === '' && <Text style={styles.valueStyle}>*</Text>}
        </View>
      )}
      <View style={[styles.textView, props.viewStyle]}>
        <TextInput
          {...props}
          ref={inputElementRef}
          autoCorrect={true}
          style={[styles.textInputStyle, props.textInputStyle]}
          autoCapitalize={'none'}
          editable={props.editable}
          labelFontSize={scale(14)}
          defaultValue={props.defaultValue}
          secureTextEntry={props.secureTextEntry ? passwordsecure : false}
          fontSize={props.fontsize ? props.fontsize : scale(17)}
          value={props.value}
          onSubmitEditing={() => props.onSubmitEditing()}
          activeLineWidth={1}
          returnKeyType={props.returnKeyType ? props.returnKeyType : 'default'}
          keyboardType={props.keyboardType ? props.keyboardType : 'default'}
          inputStyle={{fontFamily: GlobalFont.Regular}}
          tintColor="#3664554"
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor={
            props.placeholderTextColor ? props.placeholderTextColor : '#FFD2D6'
          }
          autoFocus={props.autoFocus}
          textAlignVertical="center"
          underlineColorAndroid="transparent"
          importantForAutofill={'noExcludeDescendants'}
          autoCompleteType={'off'}
          maxLength={props.maxLength}
        />
        {props.secureTextEntry ? (
          <TouchableOpacity
            onPress={() => clickPassword()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              width: scale(50),
              height: scale(35),
            }}>
            {passwordsecure ? (
              <Icon
                style={styles.icon}
                name="visibility-off"
                size={scale(18)}
                color={GlobalColor.themeBlue}
              />
            ) : (
              <Icon
                style={styles.icon}
                name="visibility"
                size={scale(18)}
                color={GlobalColor.themeBlue}
              />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {props.rightIcon && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: scale(10),
            top: scale(13),
          }}>
          <Image
            style={{height: scale(18), width: scale(20)}}
            source={props.rightIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  textView: {
    flexDirection: 'row',
    borderColor: GlobalColor.borderColor,
    borderWidth: 2,

    flexShrink: 1,
    borderStyle: 'solid',
    flexWrap: 'wrap',

    marginBottom: scale(5),
    width: '93%',
    borderRadius: 5,
    margin: scale(10),
    backgroundColor: 'white',
  },
  textInputStyle: {
    height: scale(50),
    paddingVertical: scale(6),
    paddingLeft: scale(18),
    paddingRight: scale(40),
    flex: 1,
    fontWeight: 'normal',
    fontFamily: GlobalFont.Regular,
    color: GlobalColor.themePink,
    fontSize: scale(24),
  },
  labelView: {
    flexDirection: 'row',
    paddingHorizontal: scale(8),
    paddingBottom: scale(3),
  },
  labelStyle: {
    fontFamily: GlobalFont.Medium,
    fontSize: scale(14),
    fontStyle: 'normal',
    color: 'black',
  },
  valueStyle: {
    fontFamily: GlobalFont.Medium,
    fontSize: scale(15),
    fontStyle: 'normal',
    color: 'red',
  },
});
export default TextInputBox;
