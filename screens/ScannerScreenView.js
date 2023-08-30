import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { firestore } from '../firebase'
import { collection, doc, setDoc, addDoc, getDoc, query, where } from "firebase/firestore";
import { useNavigation } from '@react-navigation/core'

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

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // Check if the first letter of the scanned data is "cardity:"
    if (data.startsWith('cardity:')) {
      // Remove the "cardity:" prefix
      const jsonData = data.substring(8);
      try {
        // Convert the remaining string to JSON
        const cardDetails = JSON.parse(jsonData);
        // Search for user profile using the userUID as document ID
        if (cardDetails.userUID) {
          const userProfileRef = doc(firestore, 'profiles', cardDetails.userUID);
          const userProfileDoc = await getDoc(userProfileRef);
          if (userProfileDoc.exists()) {
            const userProfile = userProfileDoc.data();
            const card = userProfile.loyaltyCards.find(loyaltyCards => loyaltyCards.cardId === cardDetails.cardId);
            if (card) {
              // Update loyaltyCard progress
              userProfile.loyaltyCards.find(loyaltyCards => loyaltyCards.cardId === cardDetails.cardId).progress += 1;
              // Update the user's profile
              await setDoc(userProfileRef, userProfile);
              // Show success alert
              alert(`You have collected a stamp!`);
              // Redirect back to Loyalty Cards page with refresh flag
              navigation.navigate('Loyalty Cards', { refresh: true });
            } else {
              alert(`Loyalty card not found in user's profile.`);
            }

          } else {
            alert(`User profile not found for the scanned card.`);
          }
        } else {
          alert(`UserUID not found in scanned card details.`);
        }
      } catch (error) {
        alert(`Invalid JSON format in QR code data!`);
      }
    } else {
      alert(`Invalid QR code! Scanned data: ${data}`);
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
