
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core'
import { ScrollView, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card.js';
import AddCard from '../components/AddCard.js';
import { auth } from '../firebase'
import { signOut } from 'firebase/auth';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import * as Notifications from 'expo-notifications';
import { firebaseRequestAndStorePushToken, firebaseFetchProfile, firebaseFetchCardData } from "../firebaseFunctions.js";


// Render cards according to the cards argument received
const HomeScreenView = () => {
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const [profile, setProfile] = useState(null);
  const [cards, setCards] = useState([]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out")
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  useEffect(() => {
    if (isFocused) {
      firebaseFetchProfile().then((profileData) => {
        if (profileData && !profileData.pushToken) {
          firebaseRequestAndStorePushToken(auth.currentUser.uid);
        }
        if (profileData) {
          firebaseFetchCardData(profileData.loyaltyCards).then((updatedCards) => {
            setCards(updatedCards);
          });
        }
        setProfile(profileData)
      });
    }


  }, [isFocused]);

  // useFocusEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity
  //         onPress={() => {
  //           // Navigate to your camera screen when the icon is pressed
  //           navigation.navigate('Scanner'); // Replace with your actual camera screen
  //         }}
  //         style={{ marginRight: 20 }}
  //       >
  //         <AntDesign name="scan1" size={24} color="black" />
  //       </TouchableOpacity>
  //     ),
  //   });
  // });

  return (
    <ScrollView style={styles.background}>
      {/* Show all cards */}
      <View style={styles.cards}>
        {cards.map((card, i) => (
          <Card
            cardName={card.cardName}
            cardId={card.cardId}
            image={card.image}
            color={card.color}
            key={i}
            redirect={'Details'}
            card={card}
          />
        ))}
        {/* Add Card */}
        <AddCard />
      </View>
      {/* Sign Out */}
      <View style={styles.container}>
        <Text style={styles.boxText}>Email: {auth.currentUser?.email}</Text>
        {profile && <Text style={styles.boxText}>Name: {profile.name}</Text>}
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreenView;



const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
  },
  cards: {
    paddingVertical: 20
  },
  container: {
    backgroundColor: '#dd9eff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
  },
  boxText: {
    color: 'white',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2541b2',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})