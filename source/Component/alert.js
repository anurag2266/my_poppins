import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
export default class animated_notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      notification: '',
      opacity: new Animated.Value(0),
      offset: new Animated.Value(0),
      paddingVertical: 0,
      bg_color: 'green',
      text_color: '#ffffff',
    };
    this.show_toast = this.show_toast.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }
  show_toast(Text, status) {
    if (this.state.paddingVertical == 0) {
      this.handlePress(Text, status);
    }
  }
  handlePress(Text, status) {
    if (!Text) {
      Text = global.server_error;
    } else if (Text == '') {
      Text = global.server_error;
    }
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
    let bg_c = '#eb5959';
    let text_c = '#ffffff';
    if (status == 1) {
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#DFF0D8"
      />;
      bg_c = '#DFF0D8';
      text_c = '#3c763d';
    } else {
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#eb5959"
      />;
    }
    this.setState(
      {
        bg_color: bg_c,
        text_color: text_c,
        value: Text,
        paddingVertical: 12,
        notification: this.state.value,
      },
      () => {
        this._notification
          .getNode()
          .measure((x, y, width, height, pageX, pageY) => {
            this.state.offset.setValue(height * -1);

            Animated.sequence([
              Animated.parallel([
                Animated.timing(this.state.opacity, {
                  toValue: 1,
                  duration: 300,
                  // useNativeDriver: true
                }),
                Animated.timing(this.state.offset, {
                  toValue: 0,
                  duration: 300,
                  // useNativeDriver: true

                }),
              ]),

              Animated.delay(3000),

              Animated.parallel([
                Animated.timing(this.state.opacity, {
                  toValue: 0,
                  duration: 300,
                  // useNativeDriver: true

                }),
                Animated.timing(this.state.offset, {
                  toValue: height * -1,
                  duration: 300,
                  // useNativeDriver: true

                }),
              ]),
            ]).start();

            this.timerHandle = setTimeout(() => {
              // ***
              this.setState({ paddingVertical: 0 }); // ***
              clearTimeout(this.timerHandle);
              <StatusBar
                barStyle="light-content"
                hidden={false}
                backgroundColor="transparent"
              />;
            }, 4000);
          });
      },
    );
  }

  render() {
    const notificationStyle = {
      opacity: this.state.opacity,
      transform: [
        {
          translateY: this.state.offset,
        },
      ],
    };

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.notification,
            notificationStyle,
            {
              backgroundColor: this.state.bg_color,
              marginTop: Platform.OS == 'android' ? 0 : getStatusBarHeight(),
            },
          ]}
          ref={notification => (this._notification = notification)}>
          {Platform.OS == 'android' ? (
            <Text
              style={{
                paddingHorizontal: 0,
                fontFamily: 'Rubik-Medium',
                paddingVertical: this.state.paddingVertical,
                color: this.state.text_color,
                textAlign: 'center',
                fontSize: 17,
              }}>
              {this.state.value}
            </Text>
          ) : null}
          {Platform.OS != 'android' ? (
            <View
              style={{
                height: getStatusBarHeight(),
                backgroundColor: this.state.bg_color,
                position: 'absolute',
                top: -getStatusBarHeight(),
                left: 0,
                right: 0,
              }}></View>
          ) : null}
          {Platform.OS != 'android' ? (
            <Text
              style={{
                paddingHorizontal: 0,
                fontFamily: 'Rubik-Medium',
                paddingVertical: this.state.paddingVertical,
                color: this.state.text_color,
                textAlign: 'center',
                fontSize: 17,
              }}>
              {this.state.value}
            </Text>
          ) : null}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  notification: {
    position: 'absolute',
    paddingHorizontal: 0,
    paddingVertical: 0,
    left: 0,
    top: 0,
    right: 0,
  },
});
