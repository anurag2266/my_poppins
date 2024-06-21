import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  ProgressBarAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {View, Card, Spinner, Container, Content} from 'native-base';
import Colors from '../Theme/Colors';
import {scale} from '../Theme/Scalling';
export default class animated_loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: 0,
    };
    this.show_loader = this.show_loader.bind(this);
  }
  componentDidMount() {
    // ADD ORIENTATION LISTENER
  }
  componentWillUnmount() {
    // REMOVE ORIENTATION LISTENER
  }
  show_loader(is_loader) {
    this.setState({is_loading: is_loader});
  }

  render() {
    if (this.state.is_loading == 0) {
      return <View></View>;
    }
    return (
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* BEGIN METHOD FOR DISPLAY LOADER VIEW */}

        <Card
          style={{
            backgroundColor:Colors.themeBlue,
            padding: scale(10),
            height: scale(70),
            justifyContent: 'center',
            width: scale(70),
            borderRadius: scale(10),
          }}>
          {/* <ActivityIndicator size="large" color={'white'} /> */}
          <Spinner color={"white"} />
        </Card>

        {/* END METHOD FOR DISPLAY LOADER VIEW */}
      </View>
    );
  }
}
