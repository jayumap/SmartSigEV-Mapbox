// WelcomeScreen.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const navigation = useNavigation();
  
    const handleContinue = () => {
      navigation.navigate('Home'); // Navigate to HomeScreen
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
      <Text style={styles.tagline}>Feel Safe {'\n'}with Smart Sig-EV</Text>

      {/* Continue with phone number button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue with Phone Number</Text>
      </TouchableOpacity>

      {/* Terms and conditions text */}
      <Text style={styles.termsText}>By continuing, you agree to our Terms and Conditions</Text>
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
    top: 0,
    left: 0,
    width: '100%',
    height: '75%',
    resizeMode: 'contain',
    aspectRatio: 2,
  },
  logo: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 50,
    height: 50,
  },
  tagline: {
    position: 'absolute',
    top: '78%',
    textAlign: 'left',
    left: 10,
    fontSize: 25,
    fontFamily: 'Poppins-Medium',
    color: 'black',
    paddingHorizontal: 20,
  },
  continueButton: {
    position: 'absolute',
    bottom: 50,
    width: '92%',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular'
  },
  termsText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Poppins-Light'
  }
});

export default WelcomeScreen;