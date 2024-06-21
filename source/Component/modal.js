import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {scale} from '../Theme/Scalling';
import Color from '../Theme/Colors';
import Fonts from '../Theme/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GlobalText from './globalText';
const windowWidth = Dimensions.get('window').width;

class AlertModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  render() {
    const {modalVisible} = this.props;
    const {header} = this.props;
    const {subHeader} = this.props;
    const {okButton} = this.props;
    const {cancelButton} = this.props;
    const {naturalButton} = this.props;

    if (modalVisible) {
      return (
        <Modal
          animationType={'slide'}
          transparent={true}
          onRequestClose={() => {
            this.props.closeAction();
          }}
          hardwareAccelerated={true}
          visible={modalVisible}>
          <View style={styles.parentView}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {header && <Text style={styles.headerText}>{header}</Text>}
                {subHeader && <Text style={styles.modalText}>{subHeader}</Text>}
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    marginTop: scale(20),
                    marginBottom: scale(15),
                  }}>
                  {okButton && (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.okAction();
                      }}
                      style={styles.buttonWhite}
                      background={TouchableNativeFeedback.SelectableBackground()}>
                      <Text style={[styles.blueLabel, {color: 'white'}]}>
                        {okButton}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {cancelButton && (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.cancelAction();
                      }}
                      style={styles.buttonBlue}
                      background={TouchableNativeFeedback.SelectableBackground()}>
                      <Text style={styles.whiteLabel}>{cancelButton}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {naturalButton && (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.naturalAction();
                    }}
                    style={[styles.buttonBlue, {marginTop: scale(15)}]}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <Text style={styles.whiteLabel}>{naturalButton}</Text>
                  </TouchableOpacity>
                )}

                <View
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -2,
                    backgroundColor: Color.themePink,
                    borderRadius: scale(18),
                    padding: scale(10),
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.closeAction();
                    }}>
                    <AntDesign name={'close'} size={20} color={'white'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  parentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#000000b2',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalView: {
    width: windowWidth - 70,
    backgroundColor: 'white',
    borderRadius: scale(12),
    paddingTop: scale(20),
    paddingBottom: scale(15),
    paddingLeft: scale(10),
    paddingRight: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    height: scale(160),
  },
  buttonWhite: {
    borderRadius: scale(12),
    borderColor: Color.themeBlue,
    borderWidth: 1,
    flex: 1,
    height: scale(35),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(100),
    backgroundColor: Color.themeBlue,
    width: 50,
  },
  buttonBlue: {
    borderRadius: scale(12),
    backgroundColor: Color.themeBlue,
    borderWidth: 1,
    flex: 1,
    height: scale(40),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(10),
    width: 50,
  },
  blueLabel: {
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    color: Color.GradientEnd,
    fontSize: scale(20),
    fontFamily: Fonts.Regular,
    includeFontPadding: false,
  },
  whiteLabel: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Color.ColorWhite,
    fontSize: scale(20),
    fontFamily: Fonts.Regular,
    includeFontPadding: false,
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    color: Color.themeBlue,
    flexDirection: 'row',
    fontSize: scale(22),
    textAlign: 'center',
    fontFamily: Fonts.Bold,
  },
  modalText: {
    fontSize: scale(18),
    fontFamily: Fonts.Regular,
    textAlign: 'center',
    marginLeft: scale(10),
    marginRight: scale(10),
    marginBottom: scale(10),
    marginTop: scale(20),
    textAlignVertical: 'center',
    color: Color.themePink,
  },
});

export default AlertModal;
