import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import Card from './Card.js';
import StampCard from './StampCard.js';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, firestore, firebase } from '../firebase';
import { useIsFocused } from '@react-navigation/native'


const ProgressView = ({card}) => {
  const [loyaltyProgram, setLoyaltyProgram] = useState([]);
  const [maxRewardStamps, setMaxRewardStamps] = useState(null);


  const [updatedCard, setUpdatedCard] = useState(card);
  const isFocused = useIsFocused()

  const fetchUpdatedProgress = async () => {
      try {
          const user = auth.currentUser;
          if (user) {
              const profileRef = doc(firestore, "profiles", user.uid);
              const profileSnapshot = await getDoc(profileRef);
              const cardDetails = profileSnapshot.data().loyaltyCards.find(loyaltyCards => loyaltyCards.cardId === card.cardId);
              setUpdatedCard(prevCard => ({
                  ...prevCard,
                  progress: cardDetails.progress
              }));
          }
      } catch (error) {
          console.log("Error fetching updated progress:", error);
      }
  };

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

  useEffect(() => {
      if (isFocused) {
          fetchUpdatedProgress();
          fetchLoyaltyProgram();
      }
  }, [isFocused]);
  
    return (
        <View style={styles.tabContainer}>
            <Card cardName={card.cardName} cardId={card.cardId} image={card.image} color={card.color} card={card} />
            <StampCard maxRewardStamps={maxRewardStamps} progress={updatedCard.progress} rewards={loyaltyProgram.rewards} />
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
