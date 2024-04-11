import React, {useState} from 'react';
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

  const onMarkerPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
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
              <Text>City: Pune</Text>
              <Text>Country: India</Text>
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
    padding: 20,
    elevation: 5,
    width: Dimensions.get('window').width - 40,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    padding: 10,
  },
});
