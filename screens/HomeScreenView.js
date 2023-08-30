
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core'
import { ScrollView, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { TableView } from 'react-native-tableview-simple';
import Card from '../components/Card.js';
import AddCard from '../components/AddCard.js';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { auth, firestore } from '../firebase'
import { signOut } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, getDoc, query, where } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';


// Render cards according to the cards argument received
const HomeScreenView = () => {
  
  const route = useRoute();

  const [profile, setProfile] = useState(null);
  const [cards, setCards] = useState([]);
  const navigation = useNavigation()

  const updateCardProgress = (cardId, newProgress) => {
    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.cardId === cardId) {
          return { ...card, progress: newProgress };
        }
        return card;
      });
    });
  };


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out")
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  const fetchCardData = async (cards) => {
    const updatedCards = await Promise.all(
      cards.map(async (card) => {
        const loyaltyCardRef = doc(firestore, card.loyaltyCard);
        const loyaltyCardSnapshot = await getDoc(loyaltyCardRef);

        if (loyaltyCardSnapshot.exists()) {
          const loyaltyCardData = loyaltyCardSnapshot.data();

          // Extract the desired fields from loyaltyCardData
          const { cardName, image } = loyaltyCardData;

          // Return a new object with the desired structure
          const updatedCard = {
            cardId: card.cardId,
            loyaltyCard: card.loyaltyCard,
            cardName, // Extracted field
            image, // Extracted field
            loyaltyProgram: card.loyaltyProgram,
            progress: card.progress,
          };
          return updatedCard;
        } else {
          console.log(`Loyalty card with reference ${card.loyaltyCard} does not exist.`);
          return card;
        }
      })
    );
    setCards(updatedCards)
    return updatedCards;
  };


  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const profileRef = doc(firestore, "profiles", user.uid);
        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          setProfile(profileSnapshot.data());
          fetchCardData(profileSnapshot.data().loyaltyCards);

        } else {
          console.log("Profile does not exist");
        }
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };



  useEffect(() => {
    fetchProfile();
    if (route.params?.refresh) {
      fetchCardData();
    }
  }, [route.params]);

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Navigate to your camera screen when the icon is pressed
            navigation.navigate('Scanner'); // Replace with your actual camera screen
          }}
          style={{ marginRight: 20 }}
        >
          <AntDesign name="scan1" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <ScrollView>
      {/* Show all cards */}
      <TableView>
        {cards.map((card, i) => (
          <Card
            cardName={card.cardName}
            cardId={card.cardId}
            image={card.image}
            key={i}
            redirect={'Details'}
            card={card}
          />
        ))}
      </TableView>

      {/* Add Card */}
      <AddCard />

      {/* Sign Out */}
      <View style={styles.container}>
        <Text>Email: {auth.currentUser?.email}</Text>
        {profile && <Text>Name: {profile.name}</Text>}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
  },
  button: {
    backgroundColor: '#0782F9',
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