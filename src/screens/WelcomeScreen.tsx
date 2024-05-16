// WelcomeScreen.tsx
import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    console.log('Logging as Ambulance Driver');
    navigation.navigate('PhoneNumber'); // Navigate to HomeScreen
  };

  const handleAdminLogin = () => {
    console.log('Logging as Traffic Signal');
    navigation.navigate('AdminLogin'); // Navigate to AdminLoginScreen
  };

  return (
    <View style={styles.container}>
      {/* Banner Image */}
      <Image
        source={require('../../assets/images/banner_image.jpg')}
        style={styles.banner}
        resizeMode="cover"
      />

      {/* Logo at top left */}
      <Image
        source={require('../../assets/images/logo.jpg')}
        style={styles.logo}
      />

      {/* Tagline */}
      <Text style={styles.tagline}>Feel Safe {'\n'}with Res-Q-Signal !</Text>

      {/* Continue with phone number button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>
          Ambulance Drivers Login
        </Text>
      </TouchableOpacity>

      {/* Admin login button */}
      <TouchableOpacity style={styles.adminButton} onPress={handleAdminLogin}>
        <Text style={styles.adminButtonText}>Traffic Signal Login</Text>
      </TouchableOpacity>

      {/* Terms and conditions text */}
      <Text style={styles.termsText}>
        By continuing, you agree to our Terms and Conditions
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    height: '56%',
    aspectRatio: 2,
  },
  logo: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: '50%',
    height: '14%',
  },
  tagline: {
    position: 'absolute',
    top: '68%',
    textAlign: 'left',
    left: 10,
    fontSize: 25,
    fontFamily: 'Poppins-Medium',
    color: 'black',
    paddingHorizontal: 20,
  },
  continueButton: {
    position: 'absolute',
    bottom: 128,
    width: '92%',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  adminButton: {
    position: 'absolute',
    bottom: 65,
    width: '92%',
    backgroundColor: 'transparent', // Change color as needed
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  adminButtonText: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  termsText: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Poppins-Light',
  },
});

export default WelcomeScreen;
