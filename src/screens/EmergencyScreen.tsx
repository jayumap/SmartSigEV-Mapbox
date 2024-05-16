import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {
  Camera,
  UserLocation,
  PointAnnotation,
  LineLayer,
  ShapeSource,
} from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';
import NavigationScreen from './NavigationScreen';
import {useNavigation} from '@react-navigation/native';

Mapbox.setAccessToken(
  'pk.eyJ1IjoidG9tcGF3YXIiLCJhIjoiY2x1dXV1cW1yMGNydTJqcGowMHh3eGplZCJ9.mbpWLDDHex0ERfZ8e8ff4g',
);
Mapbox.setTelemetryEnabled(false);

const EmergencyScreen = () => {
  const [startAddress, setStartAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [userLocation, setUserLocation] = useState<any>(null);
  const [startLocation, setStartLocation] = useState<any>(null);
  const [destinationLocation, setDestinationLocation] = useState<any>(null);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [mapRef, setMapRef] = useState<Mapbox.MapView | null>(null);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [showStartNavigationButton, setShowStartNavigationButton] =
    useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const navigation = useNavigation();
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [showRouteInfo, setShowRouteInfo] = useState(false);

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
      {enableHighAccuracy: false, timeout: 30000},
    );
  }, []);

  const getDirections = async () => {
    try {
      if (!startLocation || !destinationLocation) {
        console.error('Please enter both starting and destination locations');
        return;
      }

      console.log('Start Location:', startLocation);
      console.log('Destination Location:', destinationLocation);

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startLocation.longitude},${startLocation.latitude};${destinationLocation.longitude},${destinationLocation.latitude}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoidG9tcGF3YXIiLCJhIjoiY2x1dXV1cW1yMGNydTJqcGowMHh3eGplZCJ9.mbpWLDDHex0ERfZ8e8ff4g`,
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Directions:', data);

      const routeCoordinates = data.routes[0].geometry.coordinates;
      const waypoints = data.waypoints.map(waypoint => waypoint.location);
      const allCoordinates = [...routeCoordinates, ...waypoints];

      // console.log('All coordinates from start to end:');
      // allCoordinates.forEach(coordinate => {
      //   console.log(`Latitude: ${coordinate[1]}, Longitude: ${coordinate[0]}`);
      // });

      setCoordinates(allCoordinates);
      // Handle the directions data here, e.g., display on the map or extract route information
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // const routeGeometry = data.routes[0].geometry;

        setRouteGeometry(data.routes[0].geometry);

        const {distance, duration} = route;
        setDistance(distance);
        setDuration(duration);
        setShowRouteInfo(true);

        // Adjust camera to fit the route bounds
        // mapRef.current.fitBounds(route.bounds, {
        //   edgePadding: {top: 100, right: 100, bottom: 100, left: 100},
        // });
      } else {
        setRouteGeometry(null);
        console.error('No routes found in the response');
        setDistance(null);
        setDuration(null);
      }
    } catch (error) {
      console.error('Error fetching directions:', error.message);
    }
  };

  const handleEndEditing = async (address: string, setLocation: Function) => {
    if (!address) {
      console.error('Please enter a location');
      return;
    }

    try {
      // Perform forward geocoding
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address,
        )}.json?proximity=ip&access_token=pk.eyJ1IjoidG9tcGF3YXIiLCJhIjoiY2x1dXV1cW1yMGNydTJqcGowMHh3eGplZCJ9.mbpWLDDHex0ERfZ8e8ff4g`,
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Geocoding response:', data);
      if (data.features && data.features.length > 0) {
        const center = data.features[0].center;
        if (Array.isArray(center) && center.length >= 2) {
          const [longitude, latitude] = center;
          setLocation({latitude, longitude});
          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);
        } else {
          console.error('Invalid center array format');
        }
      } else {
        console.error('No features found in the response');
      }
    } catch (error) {
      console.error('Error geocoding:', error.message);
    }
  };

  const handleMapReady = () => {
    if (mapRef && startLocation && destinationLocation) {
      const coordinates = [
        [startLocation.longitude, startLocation.latitude],
        [destinationLocation.longitude, destinationLocation.latitude],
      ];

      mapRef.fitBounds(coordinates, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      });
    }
  };

  useEffect(() => {
    // Update visibility of Start Navigation button based on routeGeometry
    setShowStartNavigationButton(routeGeometry !== null);
  }, [routeGeometry]);

  // Function to handle navigation start
  const startNavigation = () => {
    // Implement navigation start logic here
    console.log('Navigation started!');
    navigation.navigate('Navigation', {
      userLocation,
      startLocation,
      destinationLocation,
      routeGeometry,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainerWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Source"
            value={startAddress}
            onChangeText={text => setStartAddress(text)}
            onEndEditing={() =>
              handleEndEditing(startAddress, setStartLocation)
            } // Trigger geocoding when editing ends
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Destination"
            value={destinationAddress}
            onChangeText={text => setDestinationAddress(text)}
            onEndEditing={() =>
              handleEndEditing(destinationAddress, setDestinationLocation)
            } // Trigger geocoding when editing ends
          />
          <TouchableOpacity style={styles.button} onPress={getDirections}>
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <Mapbox.MapView
          ref={ref => setMapRef(ref)}
          style={styles.map}
          zoomEnabled={true}
          styleURL="mapbox://styles/mapbox/streets-v12"
          rotateEnabled={true}
          logoEnabled={false}
          onDidFinishLoadingMap={handleMapReady}>
          {/* {userLocation && (
            <PointAnnotation
              id="userLocation"
              coordinate={[userLocation.longitude, userLocation.latitude]}
              title="User Location"
              snippet="Current Location"
            />
          )} */}
          {startLocation && (
            <PointAnnotation
              id="startLocation"
              coordinate={[startLocation.longitude, startLocation.latitude]}
              title="Source Location"
              snippet="Start Location"
            />
          )}
          {destinationLocation && (
            <PointAnnotation
              id="destinationLocation"
              coordinate={[
                destinationLocation.longitude,
                destinationLocation.latitude,
              ]}
              title="Destination Location"
              snippet="Destination"
            />
          )}

          {routeGeometry && (
            <Mapbox.ShapeSource id="routeSource" shape={routeGeometry}>
              <Mapbox.LineLayer
                id="route"
                style={{
                  lineColor: '#0066FF',
                  lineWidth: 5,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </Mapbox.ShapeSource>
          )}

          <Camera
            zoomLevel={
              startLocation && destinationLocation ? 8 : userLocation ? 15 : 0
            }
            centerCoordinate={
              startLocation && destinationLocation
                ? [
                    (startLocation.longitude + destinationLocation.longitude) /
                      2,
                    (startLocation.latitude + destinationLocation.latitude) / 2,
                  ]
                : userLocation
                ? [userLocation.longitude, userLocation.latitude]
                : [0, 0]
            }
            pitch={0}
            animationMode="flyTo"
            animationDuration={3000}
          />
        </Mapbox.MapView>
      </View>
      {/* Route info container */}
      {showRouteInfo && (
        <View style={styles.routeInfo}>
          {distance !== null && duration !== null && (
            <Text style={styles.navigationInfoText}>
              Distance: {Math.round(distance / 1000)} km, Duration:{' '}
              {Math.round(duration / 60)} mins
            </Text>
          )}
        </View>
      )}
      <View style={styles.inputContainerWrapperStart}>
        {/* Start Navigation Button */}
        {showStartNavigationButton && (
          <TouchableOpacity
            style={styles.buttonStart}
            onPress={startNavigation}>
            <Text style={styles.buttonText}>Start Navigation</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Conditionally render the NavigationScreen component */}
      {showNavigation && (
        <NavigationScreen
          userLocation={userLocation}
          startLocation={startLocation}
          destinationLocation={destinationLocation}
          routeGeometry={routeGeometry}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  inputContainerWrapper: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    zIndex: 1,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  inputContainerWrapperStart: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    zIndex: 0,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    padding: 18,
  },
  input: {
    marginBottom: 10,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonStart: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 20,
    top: 750,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  routeInfo:{
    position: 'absolute',
    top: 220, // Adjust the top position as needed to position it above the button
    zIndex: 2, // Ensure it's above other components
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: 0.8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    margin: 15,
    borderColor: 'black',
    borderWidth: 0,
    left: 60,
    width: '60%',
  },
  navigationInfoText:{
    color: 'black',
    fontSize: 12.6,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  }
});

export default EmergencyScreen;
