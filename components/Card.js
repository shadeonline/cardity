import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image } from 'react-native';
import { Cell } from 'react-native-tableview-simple';

const Card = ({ name, cardNum, imgUri, action, card }) => {
  const navigation = useNavigation();
  const handlePress = () => {
    if (action === 'Details') {
      navigation.navigate('Details', { card });
    }
    else{
      navigation.navigate('Loyalty Cards');
    }
  };

  return (
    <Cell
      onPress={action ? handlePress : undefined}
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', height: 290, width: '100%', backgroundColor: 'transparent', highlightColor: '#ccc' }}
      cellContentView={
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={imgUri} style={[styles.image, { height: '80%', aspectRatio: 15 / 9 }]} />
          <View style={styles.cardTitleContainer}>
            <Text style={styles.titleText}>{name}</Text>
          </View>

          <Text style={styles.cardNumText}>Card No.: {cardNum}</Text>
        </View>
      }
    />
  );
};

const styles = {
  cellContentView: {
    backgroundColor: 'transparent'
  },
  image: {
    width: '100%',
    borderRadius: 5,
    alignSelf: 'center',
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
  cardNumText: {
    position: 'absolute',
    top: '55%',
    left: '8%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
};

export default Card;
