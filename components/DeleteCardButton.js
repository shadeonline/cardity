import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { firebaseDeleteCard } from "../firebaseFunctions";

const DeleteCardButton = ({ card }) => {
  const navigation = useNavigation()
  const handleDeletePress = async () => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?',
      [{
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          const deletionSuccess = await firebaseDeleteCard(card);
          if (deletionSuccess) {
            // Deletion was successful, navigate back
            navigation.goBack();
          } else {
            // Handle deletion failure here, if needed
            console.log("Deletion failed");
          }
        },
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
