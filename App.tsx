// App.tsx
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import PhoneNumberScreen from './src/screens/PhoneNumberScreen';
import VerifyCodeScreen from './src/screens/VerifyCodeScreen';
import AuthenticatedScreen from './src/screens/AuthenticatedScreen';
import NavigationScreen from './src/screens/NavigationScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminHomeScreen from './src/screens/AdminHomeScreen';
// import NavBar from './src/screens/Navbar';
import auth from '@react-native-firebase/auth';
import { TrafficControlProvider } from './src/screens/TrafficControlContext';

const Stack = createStackNavigator();

const App = () => {
  const [confirm, setConfirm] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(true);


  const handleToggleProfile = () => {
    setIsAdmin(!isAdmin);
  };

  const hideBottomBarOnScreens = [
    'Welcome',
    'PhoneNumber',
    'AdminLogin',
    'VerifyCode',
  ];

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });

    return unsubscribe;
  }, []);

  async function signIn(phoneNumber) {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      alert(error);
    }
  }

  async function confirmVerificationCode(code) {
    try {
      await confirm.confirm(code);
      setConfirm(null);
    } catch (error) {
      alert('Invalid code');
    }
  }

  return (
    <TrafficControlProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={({navigation}) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({navigation}) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={({navigation}) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen name="PhoneNumber" options={{headerShown: false}}>
          {props => <PhoneNumberScreen {...props} onSubmit={signIn} />}
        </Stack.Screen>
        <Stack.Screen
          name="VerifyCode"
          component={VerifyCodeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Authenticated"
          component={AuthenticatedScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Navigation" options={{headerShown: false}}>
          {props => (
            <NavigationScreen
              userLocation={null}
              startLocation={null}
              destinationLocation={null}
              routeGeometry={undefined}
              {...props}
            />
          )}
        </Stack.Screen>

        {/* Add AdminLoginScreen to the stack navigator */}
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ headerShown: false }}
        />

        {/* Add AdminHomeScreen to the stack navigator */}
        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
      {/* {showBottomBar && !hideBottomBarOnScreens.includes('Welcome') && (
        <NavBar onProfilePress={handleToggleProfile} />
      )} */}
    </NavigationContainer>
    </TrafficControlProvider>
  );
};

export default App;
