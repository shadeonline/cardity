import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { imageMap } from '../imageMap';
import { Cell } from 'react-native-tableview-simple';

const Card = ({ cardName, cardId, redirect, card, image, color }) => {
  const navigation = useNavigation();
  // console.log(cardName, cardId, redirect, card, image, color);

  // Check if image is undefined and use color as background
  const imageSource = image ? imageMap[image] : null;
  const cardColor = image ? 'transparent' : color;

  // Check if redirect is blank or not. If redirect is not blank, then navigate to the desired view, else do nothing
  const handlePress = () => {
    if (redirect === 'Details') {
      navigation.navigate('Details', { card });
    }
  };

  // Conditionally render the image based on whether the image property is defined
  const imageContent = image ? (
    <Image source={imageSource} style={styles.image} resizeMode="cover" />
  ) : null;

  const cardContent = redirect ? (
    <Cell
      contentContainerStyle={styles.containerStyle}
      cellContentView={
        <TouchableOpacity onPress={handlePress} style={[styles.cardContainer, { backgroundColor: cardColor }]}>
          <View style={styles.cardContent}>
            {imageContent}
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
            {imageContent}
            <Text style={styles.cardNameText}>{cardName}</Text>
            <Text style={styles.cardIdText}>Card No.: {cardId}</Text>
          </View>
        </View>
      }
    />
  );

  return cardContent;
};


const styles = {
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: '100%',
    backgroundColor: 'transparent',
    highlightColor: '#ccc',
    padding: 20,
    marginVertical: 40,
  },
  image: {
    width: '100%', // Use '100%' to ensure the image takes the full width
    // aspectRatio: 16 / 9, // Set the aspect ratio to maintain the image's original aspect ratio (e.g., 16:9)
    height:'100%',
    padding: 0,
    margin: 0,
    position: 'absolute',
  },
  cardContainer: {
    borderRadius: 10,
    width: '100%',
    height: 260, // Set a fixed height here to match the container size
    overflow: 'hidden', // Hide any content that overflows the card
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNameText: {
    position: 'absolute',
    top: '20%',
    left: '5%',
    fontSize: 24,
    backgroundColor: 'white',
    padding: 5,
  },
  cardIdText: {
    position: 'absolute',
    top: '75%',
    left: '5%',
    fontSize: 15,
    backgroundColor: 'white',
    padding: 5,
  },
};


export default Card;
