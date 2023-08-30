
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core'
import { ScrollView, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { TableView } from 'react-native-tableview-simple';
import Card from '../components/Card.js';
import AddCard from '../components/AddCard.js';
import { auth, firestore } from '../firebase'
import { signOut } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, getDoc, query, where } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';
import { useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native'

// Render cards according to the cards argument received
const HomeScreenView = () => {
  const isFocused = useIsFocused()
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

  const fetchCardData = (cards) => {
    const fetchPromises = cards.map((card) => {
      const loyaltyCardRef = doc(firestore, card.loyaltyCard);
      return getDoc(loyaltyCardRef)
        .then((loyaltyCardSnapshot) => {
          if (loyaltyCardSnapshot.exists()) {
            const loyaltyCardData = loyaltyCardSnapshot.data();

            const { cardName, image } = loyaltyCardData;

            const updatedCard = {
              cardId: card.cardId,
              loyaltyCard: card.loyaltyCard,
              cardName,
              image,
              loyaltyProgram: card.loyaltyProgram,
              progress: card.progress,
            };
            return updatedCard;
          } else {
            console.log(`Loyalty card with reference ${card.loyaltyCard} does not exist.`);
            return card;
          }
        });
    });

    return Promise.all(fetchPromises)
      .then((updatedCards) => {
        setCards(updatedCards);
        return updatedCards;
      })
      .catch((error) => {
        console.log("Error fetching card data:", error);
      });
  };
  const fetchProfile = () => {
    const user = auth.currentUser;
    if (user) {
      const profileRef = doc(firestore, "profiles", user.uid);
      return getDoc(profileRef)
        .then((profileSnapshot) => {
          if (profileSnapshot.exists()) {
            setProfile(profileSnapshot.data());
            return fetchCardData(profileSnapshot.data().loyaltyCards);
          } else {
            console.log("Profile does not exist");
          }
        })
        .catch((error) => {
          console.log("Error fetching profile:", error);
        });
    }
  };




  useEffect(() => {
    if (isFocused) {
      fetchProfile();
    }
  }, [isFocused]);

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