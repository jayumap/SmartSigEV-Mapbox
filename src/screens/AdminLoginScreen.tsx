import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminLoginScreen = () => {
  const [signalName, setSignalName] = useState('');
  const [location, setLocation] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signalUniqueId, setSignalUniqueId] = useState('');
  const navigation = useNavigation();

  const handleAdminLogin = () => {
    // Handle admin login logic
    // You can send the signalName, location, username, and password to the server for authentication
    console.log("Signal Name:", signalName);
    console.log("Location:", location);
    console.log("Signal Unique ID:", signalUniqueId);
    // For now, just navigate to the authenticated screen
    navigation.navigate('AdminHome');
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
          <Text style={styles.title}>Traffic Signal Control Center Login</Text>

          {/* Signal Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Signal Name"
              value={signalName}
              onChangeText={setSignalName}
            />
          </View>

          {/* Location */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Signal Unique ID */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Signal Unique ID"
              value={signalUniqueId}
              onChangeText={setSignalUniqueId}
            />
          </View>

          {/* Login button */}
          <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
            <Text style={styles.buttonText}>Login</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
    fontFamily: 'Poppins-Medium',
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    fontFamily: 'Poppins-Light',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});

export default AdminLoginScreen;
