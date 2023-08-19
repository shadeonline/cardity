import React from 'react';
import { Text, View, Image } from 'react-native';
import Card from './Card.js';
import StampCard from './StampCard.js';

const ProgressView = ({card}) => {

    return (
        <View style={styles.tabContainer}>
            <Card cardName={card.cardName} cardId={card.cardId} image={card.image} card={card} />
            <StampCard rows={5} stampsPerRow={6} progress={card.progress} />
        </View>
    );
};

const styles = {
    tabContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    heading: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
    },
  };

export default ProgressView;
