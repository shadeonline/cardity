
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core'
import { ScrollView, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card.js';
import AddCard from '../components/AddCard.js';
import { auth, firestore } from '../firebase'
import { signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native'


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

  const fetchCardData = (cards) => {
    const fetchPromises = cards.map((card) => {
      const loyaltyCardRef = doc(firestore, card.loyaltyCard);
      return getDoc(loyaltyCardRef)
        .then((loyaltyCardSnapshot) => {
          if (loyaltyCardSnapshot.exists()) {
            const loyaltyCardData = loyaltyCardSnapshot.data();
            const { cardName, image, color } = loyaltyCardData;
            const updatedCard = {
              cardId: card.cardId,
              loyaltyCard: card.loyaltyCard,
              cardName,
              image,
              color,
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
    <ScrollView >
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