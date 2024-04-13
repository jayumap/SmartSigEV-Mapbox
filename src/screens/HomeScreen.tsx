import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import {Camera} from '@rnmapbox/maps';
import {PointAnnotation} from '@rnmapbox/maps';
import Logger from '@rnmapbox/maps';
import Mapbox from '@rnmapbox/maps';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Geolocation from '@react-native-community/geolocation';

// Logger.setLogCallback(log => {
//   const {message} = log;
//   if(
//     message.match('Request failed due to a permanent error: Cancelled') ||
//     message.match('Request failed due to a permanent error: Socket Closed')
//   ){
//     return true;
//   }
//   return false;
// })

// mapbox public token
Mapbox.setAccessToken(
  'pk.eyJ1IjoidG9tcGF3YXIiLCJhIjoiY2x1dXV1cW1yMGNydTJqcGowMHh3eGplZCJ9.mbpWLDDHex0ERfZ8e8ff4g',
);

// Mapbox.setConnected(true); //not a function
Mapbox.setTelemetryEnabled(false);
// Mapbox.setWellKnownTileServer('Mapbox'); //deprecated

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [LocationData, setLocationData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<any>(null);

  // reverse geocode api
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.latitude}&lon=${userLocation.longitude}`;

  const onMarkerPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  //   reverse geocode endpoint
  useEffect(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(jsonData => {
        console.log(
          'User Location Coordinates:',
          userLocation.latitude,
          userLocation.longitude,
        );
        console.log('Reverse Geocoding Response:', jsonData);
        setLocationData(jsonData);
      })
      .catch(error =>
        console.error('Error while fetching the reverse data', error),
      );
  }, []);

  
  //user's current location
  useEffect(() => {
    // Fetch user's location
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation({latitude, longitude});
      },
      error => {
        console.error('Error fetching location: ', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBarWrapper}>
        <View style={styles.topBar}>
          {/* Left menu icon */}
          <TouchableOpacity onPress={() => {}}>
            <Fontisto name="more-v-a" size={15} color={'#000000'} />
          </TouchableOpacity>
          {/* Modal data */}
          <Text style={styles.topBarText}>
            {/* Display the modal data here */}
            {LocationData
              ? `${LocationData?.display_name}`
              : 'Loading location...'}
          </Text>
          {/* Notification Icon */}
          <TouchableOpacity onPress={() => {}}>
            <Fontisto name="bell" size={15} color={'#000000'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map  */}
      <Mapbox.MapView
        style={styles.map}
        zoomEnabled={true}
        styleURL="mapbox://styles/mapbox/streets-v12"
        rotateEnabled={true}>
        <Camera
          zoomLevel={15}
          centerCoordinate={[userLocation.longitude, userLocation.latitude]}
          pitch={0}
          animationMode="flyTo"
          animationDuration={3000}
        />
        <Mapbox.PointAnnotation
          id="marker"
          coordinate={[userLocation.longitude, userLocation.latitude]}
          onSelected={onMarkerPress}>
          <View style={styles.markerContainer}>
            <Fontisto name="ambulance" size={20} color={'black'} />
          </View>
        </Mapbox.PointAnnotation>
      </Mapbox.MapView>
      <Modal visible={modalVisible} animationType="none" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>
              Road: {LocationData?.address?.road}
            </Text>
            <Text style={styles.modalText}>
              Suburb: {LocationData?.address?.suburb}
            </Text>
            <Text style={styles.modalText}>
              City: {LocationData?.address?.city}
            </Text>
            <Text style={styles.modalText}>
              State District: {LocationData?.address?.state_district}
            </Text>
            <Text style={styles.modalText}>
              State: {LocationData?.address?.state}
            </Text>
            <Text style={styles.modalText}>
              Country: {LocationData?.address?.country}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBarWrapper: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 8,
  },
  topBarText: {
    color: 'black',
    maxWidth: '92%',
    paddingLeft: 0,
    paddingRight: 10,
    fontSize: 14,
    textAlign: 'left',
    left: 0,
    fontFamily: 'Poppins-Regular',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-BoldItalic',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 100,
    padding: 20,
    elevation: 5,
    width: Dimensions.get('window').width - 40,
  },
  modalText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    alignItems: 'center',
    fontFamily: 'Poppins-Regular',
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: 'black',
    borderRadius: 5,
    top: 185,
    bottom: 15,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    padding: 10,
    fontFamily: 'Poppins-Regular',
  },
});
