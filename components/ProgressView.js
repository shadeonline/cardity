import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import Card from './Card.js';
import StampCard from './StampCard.js';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, firestore, firebase } from '../firebase';
import { useFocusEffect } from '@react-navigation/native'

const ProgressView = ({card}) => {
  const [loyaltyProgram, setLoyaltyProgram] = useState([]);
  const [maxRewardStamps, setMaxRewardStamps] = useState(null);
  useFocusEffect(() => {
    const fetchLoyaltyProgram = async () => {
      const loyaltyProgramDocRef = doc(firestore, card.loyaltyProgram);
      try {
        const loyaltyProgramDocSnapshot = await getDoc(loyaltyProgramDocRef);
        if (loyaltyProgramDocSnapshot.exists()) {
          const loyaltyProgramData = loyaltyProgramDocSnapshot.data();
          setLoyaltyProgram(loyaltyProgramData);
          const maxStamps = Math.max(...Object.keys(loyaltyProgramData.rewards).map(Number));
          setMaxRewardStamps(maxStamps);
        } else {
          console.log("Loyalty program does not exist.");
        }
      } catch (error) {
        console.log("Error fetching loyalty program:", error);
      }
    };

    fetchLoyaltyProgram();
  });

  

    return (
        <View style={styles.tabContainer}>
            <Card cardName={card.cardName} cardId={card.cardId} image={card.image} card={card} />
            <StampCard maxRewardStamps={maxRewardStamps} progress={card.progress} rewards={loyaltyProgram.rewards} />
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
