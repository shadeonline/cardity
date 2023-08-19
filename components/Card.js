import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image } from 'react-native';
import { Cell } from 'react-native-tableview-simple';
import { imageMap } from '../imageMap';

const Card = ({ cardName, cardId, redirect, card, image }) => {
  const navigation = useNavigation();

  const imageSource = imageMap[image]
  // Check if redirect is blank ornot if redirect is not blank then redirect it to the desired view, else do nth
  const handlePress = () => {
    if (redirect === 'Details') {
      navigation.navigate('Details', { card });
    }
    else {
      navigation.navigate('Loyalty Cards');
    }

  };

  return (
    <Cell
      onPress={redirect ? handlePress : undefined}
      contentContainerStyle={styles.contentContainer}
      cellContentView={
        <View style={styles.cellContentView}>
          <Image source={imageSource} style={styles.image} />
          <Text style={styles.cardNameText}>{cardName}</Text>
          <Text style={styles.cardIdText}>Card No.: {cardId}</Text>
        </View>
      }
    />
  );
};

const styles = {
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 290,
    width: '100%',
    backgroundColor: 'transparent',
    highlightColor: '#ccc'
  },
  cellContentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    borderRadius: 5,
    alignSelf: 'center',
    height: '80%',
    aspectRatio: 15 / 9,
  },
  cardTitleContainer: {
    position: 'absolute',
    top: '8%',
    left: '8%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  titleText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardIdText: {
    position: 'absolute',
    top: '55%',
    left: '8%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  cardNameText: {
    position: 'absolute',
    top: '10%',
    left: '8%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  }
};

export default Card;
