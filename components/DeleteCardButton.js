import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Card from './Card';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, firestore, firebase } from '../firebase';
import { useNavigation } from '@react-navigation/core'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DeleteCardButton = ({ card }) => {
  const navigation = useNavigation()


  const onDelete = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const profileRef = doc(firestore, "profiles", user.uid);
        const profileSnapshot = await getDoc(profileRef);
        const profileData = profileSnapshot.data();

        // Find the index of the card to delete in the loyaltyCards array
        const cardIndex = profileData.loyaltyCards.findIndex(
          (loyaltyCard) => loyaltyCard.cardId === card.cardId
        );

        if (cardIndex !== -1) {
          // Remove the card from the loyaltyCards array
          profileData.loyaltyCards.splice(cardIndex, 1);

          // Update the user's profile in Firestore
          await updateDoc(profileRef, {
            loyaltyCards: profileData.loyaltyCards,
          });

          // Navigate back to the previous screen
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleDeletePress = () => {

    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: onDelete, // Call the onDelete function passed as a prop
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity onPress={handleDeletePress} style={{ marginRight: 20 }}>
      <MaterialCommunityIcons name="delete-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default DeleteCardButton;
