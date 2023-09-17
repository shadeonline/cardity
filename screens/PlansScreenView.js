import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { firebaseFetchLoyaltyPrograms, firebaseAddLoyaltyCardToProfile } from '../firebaseFunctions';

const themeColors = ['#ffc2c7', '#ffb1f2', '#dd9eff', '#c966ff'];

const PlansScreenView = () => {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const programs = await firebaseFetchLoyaltyPrograms();
      setLoyaltyPrograms(programs);
    };
    fetchData();
  }, []);


  const handleAddButtonClick = async (plan) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Call your custom function to add the loyalty card to the user's profile
        await firebaseAddLoyaltyCardToProfile(user.uid, plan);
        navigation.navigate('Loyalty Cards');
      } catch (error) {
        console.log("Error adding card to profile:", error);
      }
    }
  };

  return (
      <FlatList
        data={loyaltyPrograms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.loyaltyProgram, { backgroundColor: themeColors[index % themeColors.length] }]}>
            <Text style={styles.storeName}>{item.storeName}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.rewards}>Rewards:</Text>
            {Object.keys(item.rewards).map((stamps, index) => (
              <Text key={index} style={styles.rewardText}>{`${stamps} stamps: ${item.rewards[stamps]}`}</Text>
            ))}

            <TouchableOpacity onPress={() => handleAddButtonClick(item)} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loyaltyProgram: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  storeName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  rewards: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  rewardText: {
    fontSize: 14,
    marginLeft: 10,
    color: 'white',
  },
  addButton: {
    fontSize: 24,
    color: 'white',
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 25,
    textAlign: 'center',
    backgroundColor: '#2541b2',
    fontWeight: 'bold',
    position: 'absolute', 
    top: 0, 
    right: 10
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 3,
  },
});

export default PlansScreenView;
