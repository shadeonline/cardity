import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import Card from './Card.js';
import StampCard from './StampCard.js';
import { useIsFocused } from '@react-navigation/native';
import { firebaseFetchUpdatedProgress, firebaseFetchLoyaltyProgram  } from "../firebaseFunctions";

const ProgressView = ({ card }) => {
  const [loyaltyProgram, setLoyaltyProgram] = useState([]);
  const [maxRewardStamps, setMaxRewardStamps] = useState(null);
  const [updatedCard, setUpdatedCard] = useState(card);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      async function fetchData() {
        const progress = await firebaseFetchUpdatedProgress(card);
        const program = await firebaseFetchLoyaltyProgram(card);
        if (progress !== null) {
          setUpdatedCard((prevCard) => ({
            ...prevCard,
            progress,
          }));
        }
        if (program) {
          setLoyaltyProgram(program);
          const maxStamps = Math.max(
            ...Object.keys(program.rewards).map(Number)
          );
          setMaxRewardStamps(maxStamps);
        }
      }
      fetchData();
    }
  }, [isFocused]);

  return (
    <View style={styles.tabContainer}>
      <Card
        cardName={card.cardName}
        cardId={card.cardId}
        image={card.image}
        color={card.color}
        card={card}
      />
      <StampCard
        maxRewardStamps={maxRewardStamps}
        progress={updatedCard.progress}
        rewards={loyaltyProgram.rewards}
        task = {loyaltyProgram.task}
      />
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
