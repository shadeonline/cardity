import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/core'
import * as Notifications from 'expo-notifications';
import {firebaseCollectStamp, firebaseCollectReward} from '../firebaseFunctions'


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
        firebaseCollectStamp(cardDetails)
        navigation.goBack();
        // Check if the user has a pushToken
        // if (userProfile.pushToken) {
        //   // Send a push notification
        //   const notificationContent = {
        //     title: 'Card Scanned',
        //     body: `You've collected a stamp on your loyalty card.`,
        //   };

        //   // Send the push notification
        //   await Notifications.scheduleNotificationAsync({
        //     content: notificationContent,
        //     to: userProfile.pushToken,
        //   });
        // }
      }
      catch (error) {
        alert({ error });
      }
    }
    else if (data.startsWith('reward:')) {
      const jsonData = data.substring(7);
      try {
        const rewardDetails = JSON.parse(jsonData);
        firebaseCollectReward(rewardDetails)
        navigation.goBack();

        // // Check if the user has a pushToken
        // if (userProfile.pushToken) {
        //   // Send a push notification
        //   const notificationContent = {
        //     title: 'Reward redeemed',
        //     body: `Congratulations on redeeming your reward!`,
        //   };

        //   // Send the push notification
        //   await Notifications.scheduleNotificationAsync({
        //     content: notificationContent,
        //     to: userProfile.pushToken,
        //   });
        // }
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
