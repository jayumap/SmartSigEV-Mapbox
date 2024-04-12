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

Mapbox.setAccessToken(
  'pk.eyJ1IjoidG9tcGF3YXIiLCJhIjoiY2x1dXV1cW1yMGNydTJqcGowMHh3eGplZCJ9.mbpWLDDHex0ERfZ8e8ff4g',
);

// Mapbox.setConnected(true); //not a function
Mapbox.setTelemetryEnabled(false);
// Mapbox.setWellKnownTileServer('Mapbox'); //deprecated

const App = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [LocationData, setLocationData] = useState<any>(null);

  // reverse geocode api
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${18.516726}&lon=${73.856255}`;

  const onMarkerPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(jsonData => {
        setLocationData(jsonData);
      })
      .catch(error =>
        console.error('Error while fetching the reverse data', error),
      );
  }, []);
  
  

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        zoomEnabled={true}
        styleURL="mapbox://styles/mapbox/streets-v12"
        rotateEnabled={true}>
        <Camera
          zoomLevel={5}
          centerCoordinate={[73.856255, 18.516726]}
          pitch={0}
          animationMode="flyTo"
          animationDuration={3000}
        />
        <Mapbox.PointAnnotation
          id="marker"
          coordinate={[73.856255, 18.516726]}
          onSelected={onMarkerPress}>
          <View style={styles.markerContainer}>
            <Fontisto name="ambulance" size={20} color={'#ff0000'} />
          </View>
        </Mapbox.PointAnnotation>
      </Mapbox.MapView>
      <Modal visible={modalVisible} animationType="none" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Road: {LocationData?.address?.road}</Text>
            <Text style={styles.modalText}>Suburb: {LocationData?.address?.suburb}</Text>
            <Text style={styles.modalText}>City: {LocationData?.address?.city}</Text>
            <Text style={styles.modalText}>State District: {LocationData?.address?.state_district}</Text>
            <Text style={styles.modalText}>State: {LocationData?.address?.state}</Text>
            <Text style={styles.modalText}>Country: {LocationData?.address?.country}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 5,
    top: 160,
    bottom: 14,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    padding: 10,
  },
});
