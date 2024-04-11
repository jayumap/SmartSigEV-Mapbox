import React from 'react';
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
        <Mapbox.PointAnnotation id="marker" coordinate={[73.856255, 18.516726]}>
          <View style = {styles.markerContainer}>
            <Fontisto name='ambulance' size={20} color={'#ff0000'}/>
          </View>
        </Mapbox.PointAnnotation>
      </Mapbox.MapView>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
  }
});
