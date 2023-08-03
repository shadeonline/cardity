
import React from 'react';
import { useNavigation } from '@react-navigation/core'
import { ScrollView, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { TableView } from 'react-native-tableview-simple';
import Card from './Card.js';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'

// Render cards according to the cards argument received
const HomeScreenView = ({ cards }) => {

  const navigation = useNavigation()

  const handleSignOut = () => {

    signOut(auth)
      .then(() => {
        console.log("Signed out")
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

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
      <View style={styles.container}>
        <Text>Email: {auth.currentUser?.email}</Text>
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