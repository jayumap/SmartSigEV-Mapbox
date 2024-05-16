import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import {
  ShapeSource,
  LineLayer,
  SymbolLayer,
  Camera,
  UserLocation,
  CircleLayer,
  PointAnnotation,
} from '@rnmapbox/maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useTrafficControl} from './TrafficControlContext';

interface NavigationScreenProps {
  route: {
    params: {
      userLocation: {latitude: number; longitude: number} | null;
      startLocation: {latitude: number; longitude: number} | null;
      destinationLocation: {latitude: number; longitude: number} | null;
      routeGeometry: any;
    };
  };
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({route}) => {
  const {userLocation, startLocation, destinationLocation, routeGeometry} =
    route.params;
  const [trafficSignals, setTrafficSignals] = useState<any[]>([]);
  const [mapRef, setMapRef] = useState<Mapbox.MapView | null>(null);
  const [selectedTrafficLight, setSelectedTrafficLight] = useState<any>(null);
  const {setRequestSent, setRequestStatus} = useTrafficControl();
  const [status, setStatus] = useState<string>('requested');
  const { requestStatus } = useTrafficControl();

  const handleYesPress = () => {
    console.log('Send request to traffic control center');
    setRequestSent(true); // Update shared state
    setRequestStatus('approved');
  };

  useEffect(() => {
    // Fetch traffic signals data from the API
    fetch(
      'https://overpass-api.de/api/interpreter?data=%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%0A%28%0A%20%20node%5B%22highway%22%3D%22traffic_signals%22%5D%2818.484900296539532%2C73.87704849243165%2C18.512737671289347%2C73.91326904296876%29%3B%0A%20%20way%5B%22highway%22%3D%22traffic_signals%22%5D%2818.484900296539532%2C73.87704849243165%2C18.512737671289347%2C73.91326904296876%29%3B%0A%20%20relation%5B%22highway%22%3D%22traffic_signals%22%5D%2818.484900296539532%2C73.87704849243165%2C18.512737671289347%2C73.91326904296876%29%3B%0A%29%3B%0Aout%20body%3B%0A%0Aout%20skel%20qt%3B',
    )
      .then(response => response.json())
      .then(data => {
        setTrafficSignals(
          data.elements.filter(
            (element: any) =>
              element.tags && element.tags.highway === 'traffic_signals',
          ),
        );
      })
      .catch(error => console.error('Error fetching traffic signals:', error));
  }, []);

  //simulated code and data for testing
  const [simulatedUserLocation, setSimulatedUserLocation] = useState({
    latitude: 18.4897426, // Example latitude
    longitude: 74.0142846, // Example longitude
  });

  // Function to update simulated user location (simulate movement towards traffic signals)
  // Function to update simulated user location (simulate movement towards traffic signals)
  const updateSimulatedUserLocation = () => {
    // Find the nearest traffic signal
    let nearestSignal: any = null;
    let minDistance = Infinity;
    trafficSignals.forEach(signal => {
      const distance = calculateDistance(
        simulatedUserLocation.latitude,
        simulatedUserLocation.longitude,
        signal.lat,
        signal.lon,
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestSignal = signal;
      }
    });

    if (nearestSignal) {
      // Calculate direction towards the nearest traffic signal
      const dx = nearestSignal.lon - simulatedUserLocation.longitude;
      const dy = nearestSignal.lat - simulatedUserLocation.latitude;
      const direction = Math.atan2(dy, dx);

      // Update simulated user location towards the traffic signal
      const speed = 0.000001; // Adjust speed as needed
      const distanceToMove = speed * Math.sqrt(dx * dx + dy * dy);
      const newLatitude =
        simulatedUserLocation.latitude + distanceToMove * Math.sin(direction);
      const newLongitude =
        simulatedUserLocation.longitude + distanceToMove * Math.cos(direction);
      setSimulatedUserLocation({
        latitude: newLatitude,
        longitude: newLongitude,
      });
    }
  };

  // Call updateSimulatedUserLocation periodically to simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      updateSimulatedUserLocation();
    }, 50000); // Update every 5 seconds (adjust as needed)
    return () => clearInterval(interval);
  }, []);

  const simulatedTrafficSignals = [
    {lat: 18.490719160668007, lon: 74.01333111687367}, // Example traffic signal 1
    {lat: 18.490575960505936, lon: 74.01364779573859}, // Example traffic signal 2
    {lat: 18.490234194405588, lon: 74.01326940772384}, // Example traffic signal 3
  ];

  useEffect(() => {
    if (mapRef && startLocation && destinationLocation) {
      const coordinates = [
        [startLocation.longitude, startLocation.latitude],
        [destinationLocation.longitude, destinationLocation.latitude],
      ];

      const bbox = calculateBoundingBox(coordinates);

      // mapRef.fitBounds(coordinates, {
      //     edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      // });
    }
  }, [mapRef, startLocation, destinationLocation]);

  useEffect(() => {
    // Check distance to traffic signals
    if (simulatedUserLocation) {
      // simulated traffic signals needs to be changed
      simulatedTrafficSignals.forEach(signal => {
        const distance = calculateDistance(
          simulatedUserLocation.latitude,
          simulatedUserLocation.longitude,
          signal.lat,
          signal.lon,
        );
        // console.log(`User Location: ${userLocation.latitude} , ${userLocation.longitude}`);
        // console.log(`Nearest Traffic Control Signal Coordinates: ${signal.lat} , ${signal.lon}`)

        // geofence distance implementation
        if (distance < 1000) {
          // Adjust the threshold as needed (1km in meters)
          // Show confirmation box
          showAlert();
        }
      });
    }
  }, [simulatedUserLocation, trafficSignals]);

  const showAlert = () => {
    Alert.alert(
      'Approaching Traffic Signal',
      'Send request to traffic control center of approaching signal?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: handleYesPress, // Call handleYesPress when Yes is pressed
          style: 'default',
        },
      ],
      {cancelable: false},
    );
  };

  //Haversine Formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  };

  const calculateBoundingBox = (coordinates: number[][]) => {
    const lats = coordinates.map(coord => coord[1]);
    const lons = coordinates.map(coord => coord[0]);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    return `${minLat},${minLon},${maxLat},${maxLon}`;
  };

  const handleTrafficLightClick = (trafficLight: any) => {
    setSelectedTrafficLight(trafficLight);
  };

  const renderTrafficLightCircles = () => {
    if (selectedTrafficLight) {
      const {lon, lat} = selectedTrafficLight;
      return (
        <CircleLayer
          id="selectedTrafficLightCircle"
          style={{
            circleRadius: 50, // Adjust radius as needed
            circleColor: 'rgba(255, 0, 0, 0.3)', // Lighter shade of red with opacity
          }}
          center={[lon, lat]}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        ref={ref => setMapRef(ref)}
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        rotateEnabled={true}
        logoEnabled={false}
        onPress={() => setSelectedTrafficLight(null)}>
        {startLocation && (
          <Mapbox.PointAnnotation
            id="startLocationMarker"
            coordinate={[startLocation.longitude, startLocation.latitude]}>
            <View style={styles.markerContainer}>
              <View style={styles.markerStart} />
            </View>
            <Mapbox.Callout title="Start Location" />
          </Mapbox.PointAnnotation>
        )}
        {destinationLocation && (
          <Mapbox.PointAnnotation
            id="destinationLocationMarker"
            coordinate={[
              destinationLocation.longitude,
              destinationLocation.latitude,
            ]}>
            <View style={styles.markerContainer}>
              <View style={styles.markerEnd} />
            </View>
            <Mapbox.Callout title="Destination Location" />
          </Mapbox.PointAnnotation>
        )}

        {routeGeometry && (
          <ShapeSource id="routeSource" shape={routeGeometry}>
            <LineLayer
              id="route"
              style={{
                lineColor: '#0066FF',
                lineWidth: 5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </ShapeSource>
        )}

<View style={styles.statusContainer}>
        <Text>Status: {status}</Text>
      </View>

        {/* simulated traffic signal points needs to change */}
        {simulatedTrafficSignals.map((signal: any, index: number) => (
          <React.Fragment key={index}>
            {/* Main red circle */}
            <Mapbox.PointAnnotation
              id={`signal-${index}`}
              coordinate={[signal.lon, signal.lat]}
              onSelected={() => handleTrafficLightClick(signal)}>
              <View style={styles.signalContainer}>
                <View>
                  <FontAwesome5
                    name="traffic-light"
                    size={30}
                    color={'black'}
                  />
                </View>
              </View>
            </Mapbox.PointAnnotation>
          </React.Fragment>
        ))}

        {renderTrafficLightCircles()}

        <UserLocation visible={true} animated={true} />

        <Camera
          zoomLevel={
            startLocation && destinationLocation ? 8 : userLocation ? 15 : 0
          }
          centerCoordinate={
            startLocation && destinationLocation
              ? [
                  (startLocation.longitude + destinationLocation.longitude) / 2,
                  (startLocation.latitude + destinationLocation.latitude) / 2,
                ]
              : [0, 0]
          }
          pitch={15}
          animationMode="flyTo"
          animationDuration={3000}
        />
      </Mapbox.MapView>
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
  signalContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    // borderRadius: 50,
    // backgroundColor: 'rgba(255, 0, 0, 0.5)',
    alignItems: 'center',
  },
  signal: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  alertContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  alertText: {
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  yesButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  yesButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  noButton: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 10,
  },
  noButtonText: {
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerStart: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
  },
  markerEnd: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
  },
  statusContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    zIndex: 999, // Ensure the status is above other elements
  },
});

export default NavigationScreen;
