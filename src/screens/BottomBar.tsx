import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import HomeScreen from './HomeScreen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';

interface BottomBarProps {
    onSearch: (text: string) => void;
    onEmergency: () => void;
  }

  const BottomBar: React.FC<BottomBarProps> = ({ onSearch }) => {
    const [searchText, setSearchText] = useState<string>('');
    const navigation = useNavigation();
  
    const handleSearch = () => {
      console.log('Searching for:',searchText)
      onSearch(searchText);
    };

    const handleEmergency = () => {
      navigation.navigate('Emergency'); // Navigate to the EmergencyScreen
  };

  return (
    <View style={styles.bottomBarWrapper}>
    <View style={styles.bottomBar}>
    <View style={styles.searchContainer}>
    <Fontisto name="search" size={20} color={'black'} />
      <TextInput
        style={styles.searchInput}
        placeholder=" Search..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
        onSubmitEditing={handleSearch}
      />
    </View>
    <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
      <Text style={styles.emergencyButtonText}>Emergency !!</Text>
    </TouchableOpacity>
  </View>
  </View>
  );
};

const styles = StyleSheet.create({
  bottomBarWrapper:{
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    zIndex: 1,
    elevation: 4, // Add elevation to make it look like floating
    backgroundColor: 'white',
    borderRadius: 10,
  },
    bottomBar: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginTop: 20,
        paddingHorizontal: 10,
        borderRadius: 20,
        zIndex: 1,
      },
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: 'black',
        fontFamily: 'Poppins-Regular',
      },
      emergencyButton: {
        backgroundColor: 'black',
        width: '100%',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      emergencyButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
      },
});

export default BottomBar;
