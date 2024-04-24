import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

interface PhoneNumberScreenProps {
  onSubmit: (phoneNumber: string) => void;
}

const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = ({onSubmit}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = () => {
    if (phoneNumber) {
    //   setLoading(true);
      onSubmit(phoneNumber);
      navigation.navigate('VerifyCode');
    //   setLoading(false);
    } else {
      alert('Please enter a phone number');
    }
  };

  const handleSkipSignIn = () => {
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust as needed
    >
      <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>
            Enter your Phone Number for Verification
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            This number will be used for all activities. You will be redirected
            for reCaptcha verification and shall receive an SMS with a code for
            verification. Your privacy matters. Don't use any back button during
            verification.
          </Text>

          {/* Phone number input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number with country code"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Next button */}
          <TouchableOpacity style={styles.button} onPress={handlePhoneSubmit}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>

          {/* Skip Sign In */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipSignIn}>
            <Text style={styles.skipText}>Skip Sign In</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: 'Poppins-Light',
  },
  skipButton: {
    marginTop: 20,
    top: '25%',
  },
  skipText: {
    color: 'gray',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    top: '25%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    alignItems: 'center',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default PhoneNumberScreen;
