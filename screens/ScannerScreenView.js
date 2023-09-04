import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { firestore } from '../firebase'
import { collection, doc, setDoc, addDoc, getDoc, query, where } from "firebase/firestore";
import { useNavigation } from '@react-navigation/core'
import * as Notifications from 'expo-notifications';

export default function ScannerScreenView() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const navigation = useNavigation()

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();

  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);

    if (data.startsWith('cardity:')) {
      const jsonData = data.substring(8);
      try {
        const cardDetails = JSON.parse(jsonData);
        const userProfileRef = doc(firestore, 'profiles', cardDetails.userUID);
        const userProfileDoc = await getDoc(userProfileRef);

        if (!userProfileDoc.exists()) {
          alert(`User profile not found for the scanned card.`);
          return;
        }

        const userProfile = userProfileDoc.data();
        const card = userProfile.loyaltyCards.find(card => card.cardId === cardDetails.cardId);

        if (!card) {
          alert(`Loyalty card not found in user's profile.`);
          return;
        }

        card.progress += 1;

        const loyaltyProgramReference = cardDetails.loyaltyProgram;
        const loyaltyProgramRef = doc(firestore, loyaltyProgramReference);
        const loyaltyProgramDoc = await getDoc(loyaltyProgramRef);
        const loyaltyProgramData = loyaltyProgramDoc.data();

        if (loyaltyProgramData.rewards[card.progress] !== undefined) {
          const qualifiedReward = {
            cardId: card.cardId,
            reward: loyaltyProgramData.rewards[card.progress],
            rewardId: Math.floor(100000000000 + Math.random() * 900000000000),
            loyaltyCard: card.loyaltyCard,
            loyaltyProgram: card.loyaltyProgram,
          };

          userProfile.rewards = [...userProfile.rewards, qualifiedReward];
        }

        await setDoc(userProfileRef, userProfile);
        alert(`You have collected a stamp!`);

        navigation.navigate('Loyalty Cards');
        // Check if the user has a pushToken
        if (userProfile.pushToken) {
          // Send a push notification
          const notificationContent = {
            title: 'Card Scanned',
            body: `You've collected a stamp on your loyalty card.`,
          };

          // Send the push notification
          await Notifications.scheduleNotificationAsync({
            content: notificationContent,
            to: userProfile.pushToken,
          });
        }
      }
      catch (error) {
        alert({ error });
      }
    }
    else if (data.startsWith('reward:')) {
      const jsonData = data.substring(7);
      try {
        const rewardDetails = JSON.parse(jsonData);
        const userProfileRef = doc(firestore, 'profiles', rewardDetails.userUID);
        const userProfileDoc = await getDoc(userProfileRef);

        if (!userProfileDoc.exists()) {
          alert(`User profile not found for the scanned reward.`);
          return;
        }
        const userProfile = userProfileDoc.data();
        const rewards = userProfile.rewards;
        // Find the index of the reward based on rewardId
        const rewardIndex = rewards.findIndex(
          reward => reward.rewardId === rewardDetails.rewardId
        );
        if (rewardIndex !== -1) {
          // Remove the reward from the array using splice
          rewards.splice(rewardIndex, 1);
          // Update the userProfile with the modified rewards array
          userProfile.rewards = rewards;
          await setDoc(userProfileRef, userProfile);
          alert(`Reward has been redeemed.`);
        }
        else {
          alert(`Error while processing reward QR code.`);
        }
        navigation.navigate('Loyalty Cards');

        // Check if the user has a pushToken
        if (userProfile.pushToken) {
          // Send a push notification
          const notificationContent = {
            title: 'Reward redeemed',
            body: `Congratulations on redeeming your reward!`,
          };

          // Send the push notification
          await Notifications.scheduleNotificationAsync({
            content: notificationContent,
            to: userProfile.pushToken,
          });
        }
      }
      catch (error) {
      alert(`Error while processing reward QR code: ${error}`);
    }
  }

    else {
    alert(`Invalid QR code`);
    console.log(data);
    return;
  }
};

return (
  <View style={styles.container}>
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFillObject}
    />
    {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
