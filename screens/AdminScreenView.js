
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core'
import { ScrollView, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { TableView } from 'react-native-tableview-simple';
import CreatePlanButton from '../components/CreatePlanButton.js';
import { auth, firestore } from '../firebase'
import { signOut } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, getDoc, query, where } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';
import { useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native'


// Render cards according to the cards argument received
const AdminScreenView = () => {
  const isFocused = useIsFocused()
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

  const fetchProfile = () => {
    const user = auth.currentUser;
    if (user) {
      const profileRef = doc(firestore, "profiles", user.uid);
      return getDoc(profileRef)
        .then((profileSnapshot) => {
          if (profileSnapshot.exists()) {
            setProfile(profileSnapshot.data());
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

      <View style={styles.container}>
        <CreatePlanButton text="Create Loyalty Plan"  onPress={() => {
            navigation.navigate('Create Plan');
          }} />
      </View>

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

export default AdminScreenView;



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