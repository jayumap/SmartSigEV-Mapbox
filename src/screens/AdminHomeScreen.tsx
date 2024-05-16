import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Camera} from '@rnmapbox/maps';
import {Alert} from 'react-native';
import {useRoute} from '@react-navigation/native';
import { useTrafficControl } from './TrafficControlContext';
import CircleLayer from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';

Mapbox.setAccessToken(
  'pk.eyJ1IjoidG9tcGF3YXIiLCJhIjoiY2x1dXV1cW1yMGNydTJqcGowMHh3eGplZCJ9.mbpWLDDHex0ERfZ8e8ff4g',
);

Mapbox.setTelemetryEnabled(false);

const AdminHomeScreen = () => {
  const [trafficLights, setTrafficLights] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [selectedTrafficLight, setSelectedTrafficLight] = useState<any>(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(16.5);

  const handleTrafficLightClick = (trafficLight: any) => {
    setSelectedTrafficLight(trafficLight);
  };

  const { requestSent, setRequestSent, setRequestStatus } = useTrafficControl();

  const handleYesPress = () => {
    console.log('Request approved by admin');
    setRequestSent(true); // Update shared state
    setRequestStatus('approved'); // Update status to approved
  };

  useEffect(() => {
    if (requestSent) {
      Alert.alert(
        'Ambulance Request Alert',
        'Incoming Ambulance Notification. Show Ambulance Location?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              console.log('OK Pressed');
              Geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setUserLocation([longitude, latitude]);
                  const newMapCenter = [longitude, latitude];
                  setMapCenter(newMapCenter);
                  setMapZoom(14);
                },
                (error) => console.error(error.message),
              );
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [requestSent]);

  const renderTrafficLightCircles = () => {
    if (selectedTrafficLight) {
      const { lon, lat } = selectedTrafficLight;
      return (
        <CircleLayer
          id="selectedTrafficLightCircle"
          style={{
            circleRadius: 50, // Adjust radius as needed
            circleColor: 'rgba(255, 0, 0, 0.3)', // Lighter shade of red with opacity
          }}
          coordinates={[[lon, lat]]}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    // Fetch traffic light data
    fetch(
      'https://overpass-api.de/api/interpreter?data=%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%0A%28%0A%20%20node%5B%22highway%22%3D%22traffic_signals%22%5D%2818.499619459296625%2C73.9320605993271%2C18.503099079561686%2C73.93658816814424%29%3B%0A%20%20way%5B%22highway%22%3D%22traffic_signals%22%5D%2818.499619459296625%2C73.9320605993271%2C18.503099079561686%2C73.93658816814424%29%3B%0A%20%20relation%5B%22highway%22%3D%22traffic_signals%22%5D%2818.499619459296625%2C73.9320605993271%2C18.503099079561686%2C73.93658816814424%29%3B%0A%29%3B%0Aout%20body%3B%0A%0Aout%20skel%20qt%3B',
    )
      .then(response => response.json())
      .then(data => {
        // Extract traffic light coordinates from data
        const lights = data?.elements?.map(element => ({
          id: element.id,
          coordinates: [element.lon, element.lat],
        }));
        setTrafficLights(lights);

        // Log coordinates
        console.log(
          'Traffic light coordinates:',
          lights.map(light => light.coordinates),
        );

        // Fetch location data using the coordinates of the first traffic light
        if (lights.length > 0) {
          const firstLightCoordinates = lights[0].coordinates;
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${firstLightCoordinates[1]}&lon=${firstLightCoordinates[0]}`,
          )
            .then(response => response.json())
            .then(jsonData => {
              console.log('Location data:', jsonData);
              setLocationData(jsonData);
            })
            .catch(error =>
              console.error('Error fetching location data:', error),
            );
        }
      })
      .catch(error =>
        console.error('Error fetching traffic light data:', error),
      );
  }, []);

  return (
    <View style={styles.container}>
      {/* Display location name */}

      <View style={styles.topBarWrapper}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>
            {locationData ? locationData.display_name : 'Loading location...'}
          </Text>
        </View>
      </View>
      <Mapbox.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12">
          
        <Mapbox.Camera
          zoomLevel={16.5}
          centerCoordinate={
            trafficLights.length > 0 ? trafficLights[0].coordinates : [0, 0]
          }
        />
        {userLocation && (
          <Mapbox.UserLocation
            visible={true}
            animated={true}
            onUpdate={(location) => console.log('Location updated', location)}
          />
        )}
        {trafficLights.map((light, index) => (
          <Mapbox.PointAnnotation
            key={`${light.id}_${index}`}
            id={`${light.id}_${index}`}
            coordinate={light.coordinates}>
            <View>
              <FontAwesome5 name="traffic-light" size={30} color={'black'} />
            </View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>
    </View>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  trafficLightMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red', // You can customize the color
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
    paddingLeft: 5,
    paddingRight: 10,
    fontSize: 14,
    textAlign: 'left',
    left: 0,
    fontFamily: 'Poppins-Regular',
  },
});
