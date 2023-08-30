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

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
  
    if (!data.startsWith('cardity:')) {
      alert(`Invalid QR code! Scanned data: ${data}`);
      return;
    }
  
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
      
      card.progress += 0;
      
      const loyaltyProgramReference = cardDetails.loyaltyProgram;
      const loyaltyProgramRef = doc(firestore, loyaltyProgramReference);
      const loyaltyProgramDoc = await getDoc(loyaltyProgramRef);
      const loyaltyProgramData = loyaltyProgramDoc.data();
      
      if (loyaltyProgramData.rewards[card.progress] !== undefined) {
        const qualifiedReward = {
          reward: loyaltyProgramData.rewards[card.progress],
          loyaltyCard: card.loyaltyCard,
          loyaltyProgram: card.loyaltyProgram,
        };
  
        userProfile.rewards = [...userProfile.rewards, qualifiedReward];
      }
  
      await setDoc(userProfileRef, userProfile);
      alert(`You have collected a stamp!`);
  
      navigation.navigate('Loyalty Cards');
  
    } catch (error) {
      alert({error});
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
