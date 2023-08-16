import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Cell } from 'react-native-tableview-simple';

const AddCard = () => {
  const navigation = useNavigation();
  // Check if redirect is blank ornot if redirect is not blank then redirect it to the desired view, else do nth
  const handlePress = () => {
    navigation.navigate('Plans');
  };

  return (
    <Cell
      contentContainerStyle={styles.containerStyle}
      cellContentView={
        <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Text style={styles.plusSign}>+</Text>
          </View>
        </TouchableOpacity>
      }
    />
  );
};

const styles = {

  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 290, 
    width: '100%',
    backgroundColor: 'transparent',
    highlightColor: '#ccc',
    paddingTop: 25,
    paddingBottom: 25,
  },
  cellContentView: {
    backgroundColor: 'transparent',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'purple',
    padding: 20,
    width: '100%',
    // Add any other styling properties you need
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Add any other styling properties you need
  },
  plusSign: {
    fontSize: 24,
    color: 'purple',
  },
  cardTitleContainer: {
    position: 'absolute',
    top: '8%',
    left: '8%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
  },
};

export default AddCard;
