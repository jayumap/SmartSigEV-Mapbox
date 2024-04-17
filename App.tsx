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
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

const App = () => {
  const [confirm, setConfirm] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
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
        <Stack.Screen
          name="PhoneNumber"
          options={{ headerShown: false }}
        >
          {(props) => <PhoneNumberScreen {...props} onSubmit={signIn} />}
        </Stack.Screen>
        <Stack.Screen
          name="VerifyCode"
          component={VerifyCodeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Authenticated"
          component={AuthenticatedScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
