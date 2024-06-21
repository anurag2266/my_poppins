import React, {useEffect, useState} from 'react';
import {View,StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { useNavigation ,useRoute} from '@react-navigation/native';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';

const ClientLocationOnMap = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const { coordinates } = route.params;

  return (
    <View style={{flex: 1}}>
      {coordinates && (
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            }}
            title="Client Location"
          />
        </MapView>
      )}
       <Global.GlobalButton
          text={'back'}
          onPress={()=> navigation.goBack()}
          style={styles.buttonContainer}
        />
    </View>
  );
};

const styles=  StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignItems: 'center',
    alignSelf: 'center',
    height: scale(40),
    width: scale(150),
    paddingHorizontal: scale(4),
  },
})
export default ClientLocationOnMap;
