import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { imageMap } from '../imageMap';
import { Cell } from 'react-native-tableview-simple';

const Card = ({ cardName, cardId, redirect, card, image, color }) => {
  const navigation = useNavigation();

  // Check if image is undefined and use color as background
  const imageSource = image ? imageMap[image] : null;
  const cardColor = image ? 'transparent' : color;

  // Check if redirect is blank or not. If redirect is not blank, then navigate to the desired view, else do nothing
  const handlePress = () => {
    if (redirect === 'Details') {
      navigation.navigate('Details', { card });
    }
  };


  const cardContent = redirect ? (
    <Cell
      contentContainerStyle={styles.containerStyle}
      cellContentView={
        <TouchableOpacity onPress={handlePress} style={[styles.cardContainer, { backgroundColor: cardColor }]}>

          <View style={styles.cardContent}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
            <Text style={styles.cardNameText}>{cardName}</Text>
            <Text style={styles.cardIdText}>Card No.: {cardId}</Text>
          </View>
        </TouchableOpacity>
      }
    />
  ) : (
    <Cell
      contentContainerStyle={styles.containerStyle}
      cellContentView={
        <View onPress={handlePress} style={[styles.cardContainer, { backgroundColor: cardColor }]}>
          <View style={styles.cardContent}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
            <Text style={styles.cardNameText}>{cardName}</Text>
            <Text style={styles.cardIdText}>Card No.: {cardId}</Text>
          </View>
        </View>
      }
    />
  );


  return (
    cardContent
  );;
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
  image: {
    flex: 1,
    width: 390,
    height:240,
    padding: 0,
    margin: 0,
    position: 'absolute',
    borderRadius: 10,
    // aspectRatio: 15 / 9,
    // Remove height to allow it to adjust based on aspect ratio
  },
  cardContainer: {
    borderRadius: 10,
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
  cardNameText: {
    position: 'absolute',
    top: '8%',
    left: '8%',
    fontSize: 24,
    backgroundColor: 'white',
    padding: 5,
  },
  cardIdText: {
    position: 'absolute',
    top: '55%',
    left: '8%',
    fontSize: 15,
    backgroundColor: 'white',
    padding: 5,
  },
};

export default Card;
