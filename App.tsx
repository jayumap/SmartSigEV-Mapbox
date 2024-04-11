import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera} from '@rnmapbox/maps';
import { PointAnnotation } from '@rnmapbox/maps';
import Mapbox from '@rnmapbox/maps';

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
          // centerCoordinate={[18.5204, 73.8567]}
          pitch={0}
          animationMode="flyTo"
          animationDuration={3000}
        />
        <Mapbox.PointAnnotation
          id='marker'
          coordinate={[18.5204, 73.8567]}
        >
          <View/>
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
});
