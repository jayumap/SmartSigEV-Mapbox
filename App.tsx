// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome"> 
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={({ navigation }) => ({
      headerShown: false,
    })}/>
        <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
      headerShown: false,
    })}/> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
