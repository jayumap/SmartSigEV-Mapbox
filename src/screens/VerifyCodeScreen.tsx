import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const VerifyCodeScreen = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputs = useRef<TextInput[]>([]);
  const navigation = useNavigation();

  const handleVerify = () => {
    // Check if any OTP field is empty
    const isOtpEmpty = otp.some(value => value === '');
    if (isOtpEmpty) {
      // Display error message and make border red for empty fields
      alert('Invalid OTP. Please enter all digits.');
      return;
    }

    // Logic to handle verification
    navigation.navigate('Home');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!isNaN(Number(value))) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && index > 0 && !otp[index]) {
      otpInputs.current[index - 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust as needed
    >
      <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Verify OTP</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Enter the OTP sent to you on your number for authentication</Text>

          {/* OTP input */}
        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(input) => otpInputs.current[index] = input as TextInput}
              style={[
                styles.otpInput,
                value === '' && styles.invalidOtpInput // Apply red border for empty fields
              ]}
              placeholder=""
              keyboardType="numeric"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleOtpChange(index, text)}
              onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
              onFocus={() => otpInputs.current[index].clear()}
            />
          ))}
        </View>
          {/* Verify button */}
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'left',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: 'black',
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 20,
    fontFamily: 'Poppins-Light',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  otpInput: {
    flex: 1,
    height: 50,
    width: 30,
    fontSize: 16,
    paddingHorizontal: 10,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'Poppins-Light',
  },
  invalidOtpInput: {
    borderColor: 'red', // Red border for invalid input
  },
  verifyButton: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
    top: '30%'
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default VerifyCodeScreen;
