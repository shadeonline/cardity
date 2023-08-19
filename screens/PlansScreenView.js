import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, firestore, firebase } from '../firebase';
import { useNavigation } from '@react-navigation/native';


const PlansScreenView = () => {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
  const navigation = useNavigation()

  useEffect(() => {
    // Function to fetch data from Firestore
    const fetchLoyaltyPrograms = async () => {
      try {
        const loyaltyProgramsCollectionRef = collection(firestore, 'loyaltyPrograms');
        const loyaltyProgramsSnapshot = await getDocs(loyaltyProgramsCollectionRef);

        const loyaltyProgramsData = [];

        for (const docSnapshot of loyaltyProgramsSnapshot.docs) {
          const data = docSnapshot.data();
          const docPath = docSnapshot.ref
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
        renderItem={({ item }) => (
          <View style={styles.loyaltyProgram}>
            <Text style={styles.storeName}>{item.storeName}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.rewards}>Rewards:</Text>
            {Object.keys(item.rewards).map((stamps, index) => (
              <Text key={index} style={styles.rewardText}>{`${stamps} stamps: ${item.rewards[stamps]}`}</Text>
            ))}

            <TouchableOpacity onPress={() => handleAddButtonClick(item)}>
              <Text style={styles.addButton}>+</Text>
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
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loyaltyProgram: {
    marginBottom: 20,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  rewards: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardText: {
    fontSize: 14,
    marginLeft: 10,
  },
  addButton: {
    fontSize: 24,
    color: 'blue',
    marginTop: 10,
    width: 40,    // Set width and height to make the button circular
    height: 40,
    borderRadius: 25, // Set borderRadius to half of the width/height to make it circular
    textAlign: 'center',
    lineHeight: 40,
    backgroundColor: 'lightblue', // Add a background color
  },
});

export default PlansScreenView;
