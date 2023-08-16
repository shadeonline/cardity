
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core'
import { ScrollView, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { TableView } from 'react-native-tableview-simple';
import Card from '../components/Card.js';
import AddCard from '../components/AddCard.js';

import { auth, firestore } from '../firebase'
import { signOut } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, getDoc, query, where } from "firebase/firestore";


// Render cards according to the cards argument received
const HomeScreenView = ({ cards }) => {

  const [profile, setProfile] = useState(null);

  const navigation = useNavigation()


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out")
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }


  const getProfile = async (userId) => {
    try {
      const profileRef = doc(firestore, "profiles", userId);
      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        return profileSnapshot.data();
      } else {
        console.log("Profile does not exist");
        return null;
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
      throw error;
    }
  };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Get document from profiles collection
          const profileRef = doc(firestore, "profiles", user.uid);
          const profileSnapshot = await getDoc(profileRef);

          if (profileSnapshot.exists()) {
            setProfile(profileSnapshot.data());
          }
          else {
            console.log("Profile does not exist");
          }
        }
      }
      catch (error) {
        console.log("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);


  return (
    <ScrollView>
      <TableView>
        {cards.map((card, i) => (
          <Card
            name={card.name}
            cardId={card.cardId}
            imgUri={card.imgUri}
            key={i}
            redirect={'Details'}
            card={card}
          />
        ))}
      </TableView>

      {/* Add Card */}
      <AddCard/>

      {/* LOGOUT */}
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