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
      onSearch(searchText);
    };

    const handleEmergency = () => {
      navigation.navigate('Emergency'); // Navigate to the EmergencyScreen
  };

  return (
    <View style={styles.bottomBar}>
    <View style={styles.searchContainer}>
    <Fontisto name="ambulance" size={20} color={'black'} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
        onSubmitEditing={handleSearch}
      />
    </View>
    <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
      <Text style={styles.emergencyButtonText}>Emergency</Text>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
    bottomBar: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
      },
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'grey',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
      },
      emergencyButton: {
        backgroundColor: 'red',
        width: '100%',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      emergencyButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
      },
});

export default BottomBar;
