import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Global from '../../../Global/globalinclude';
import { scale } from '../../../Theme/Scalling';
import { MAP_KEY } from '../../../Global/config';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, } from '@react-navigation/native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const clientLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleSave = async () => {
    navigation.navigate("ClientProfile", 
    {
      address:address, 
      city:city,
      displayCityInput: true 
    })  
  };

  const saveLocation = async (latitude, longitude) => {
    try {
      await AsyncStorage.setItem(
        'userLocation',
        JSON.stringify({ latitude, longitude }),
      );
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

        if (Platform.OS === 'android') {
          permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        }

        const result = await check(permission);

        if (result === RESULTS.GRANTED) {
          Geocoder.init('AIzaSyDfEIAHWXHv6HEXxmqlmapS76g89cStBkQ'); // Replace with your Google API key
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({ latitude, longitude });
              geocodePosition({ latitude, longitude });
              saveLocation(latitude, longitude);
              setLoading(false);

            },
            error => {
              console.log(error);
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 }
          );
        } else {
          const requestResult = await request(permission);
          if (requestResult === RESULTS.GRANTED) {
            // Permission granted, proceed to fetch location
            // Similarly to Android, perform Geolocation here
          } else {
            console.log('Location permission denied');
            setLoading(false);
          }
        }
      } catch (err) {
        console.warn(err);
        setLoading(false);
      }
    };


    const geocodePosition = async ({ latitude, longitude }) => {
      try {
        const response = await Geocoder.from({ latitude, longitude });
        const Locaddress = response.results[0].formatted_address;
        setAddress(Locaddress);
        const city = extractCityFromResponse(response);
         setCity(city);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
    const extractCityFromResponse = (response) => {
      let city = null;
      if (response && response.results.length > 0) {
        const addressComponents = response.results[0].address_components;
        for (let i = 0; i < addressComponents.length; i++) {
          const component = addressComponents[i];
          if (component.types.includes('locality')) {
            city = component.long_name;
            break;
          }
        }
      }
      return city;
    };
    requestLocationPermission();
  }, []);

  console.log("log", address)
  return (
    <View style={styles.container}>
      { loading ?(
        <ActivityIndicator size="large" color={Global.GlobalColor.themePink} style={styles.loader}/>
      ):(
        <>
        {currentLocation && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              coordinate={currentLocation}
              title="Current Location"
              description="This is your current location."
            />
          </MapView>
        )}
        <Global.GlobalButton
          text={'save'}
          onPress={handleSave}
          style={styles.buttonContainer}
        />
        </>
      )}
     
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignItems: 'center',
    alignSelf: 'center',
    height: scale(40),
    width: scale(150),
    paddingHorizontal: scale(4),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default clientLocation;

