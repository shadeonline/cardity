import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, firestore, firebase } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const themeColors = ['#ffc2c7', '#ffb1f2', '#dd9eff', '#c966ff'];

const PlansScreenView = () => {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Function to fetch data from Firestore
    const fetchLoyaltyPrograms = async () => {
      try {
        const loyaltyProgramsCollectionRef = collection(firestore, 'loyaltyPrograms');
        const loyaltyProgramsSnapshot = await getDocs(loyaltyProgramsCollectionRef);

        const loyaltyProgramsData = [];

        for (const docSnapshot of loyaltyProgramsSnapshot.docs) {
          const data = docSnapshot.data();
          const docPath = docSnapshot.ref;
          data.docPath = docPath;
          loyaltyProgramsData.push(data);
        }
        setLoyaltyPrograms(loyaltyProgramsData);
      } catch (error) {
        console.log("Error fetching loyalty programs:", error);
      }
    };

    fetchLoyaltyPrograms();
  }, []);

  const handleAddButtonClick = async (item) => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Fetch the user's profile document
        const profileRef = doc(firestore, "profiles", user.uid);
        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
          const existingCard = profileData.loyaltyCards.find(card =>
            card.loyaltyCard === item.loyaltyCard.path &&
            card.loyaltyProgram === item.docPath.path
          );

          if (existingCard) {
            console.log("Card already exists in user's profile.");
            alert("This card is already in your profile.");
            // Handle the scenario where the card already exists in the user's profile
          } else {
            // Card doesn't exist, add it to the user's profile
            const card = {
              loyaltyCard: item.loyaltyCard.path,
              loyaltyProgram: item.docPath.path,
              cardId: Math.floor(100000000000 + Math.random() * 900000000000),
              progress: 0
            };

            // Update the user's profile with the new card information
            await updateDoc(profileRef, {
              loyaltyCards: arrayUnion(card)
            });

            console.log("Card added to profile successfully");
            navigation.navigate('Loyalty Cards');
          }
        }
      } catch (error) {
        console.log("Error adding card to profile:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
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
    marginBottom: 20,
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
