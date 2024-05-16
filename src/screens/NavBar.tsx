// BottomBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NavBar = ({ onProfilePress }) => {
  return (
    <View style={styles.container}>
      {/* Profile button */}
      <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
        <Icon name="person-circle" size={30} color="black" />
        <Text style={styles.profileText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: 5,
    fontFamily: 'Poppins-Regular',
  },
});

export default NavBar;
