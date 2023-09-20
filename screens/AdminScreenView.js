import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { ScrollView, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import CreatePlanButton from '../components/CreatePlanButton.js';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { AntDesign } from '@expo/vector-icons';
import { useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { firebaseFetchProfile, firebaseFetchLoyaltyProgramsByUser } from '../firebaseFunctions';

const AdminScreenView = () => {
  const isFocused = useIsFocused();
  const [profile, setProfile] = useState(null);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out");
        navigation.replace("Login");
      })
      .catch(error => alert(error.message));
  };

  const fetchProfile = async () => {
    const profileData = await firebaseFetchProfile();
    setProfile(profileData);
  };

  const fetchLoyaltyPrograms = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      const programs = await firebaseFetchLoyaltyProgramsByUser(uid);
      setLoyaltyPrograms(programs);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchProfile();
      fetchLoyaltyPrograms();
    }
  }, [isFocused]);

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Scanner');
          }}
          style={{ marginRight: 20 }}
        >
          <AntDesign name="scan1" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Welcome, {profile?.name || 'Admin'}</Text>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
      </View>

      <CreatePlanButton text="Create Loyalty Plan" onPress={() => {
        navigation.navigate('Create Plan');
      }} />

      <Text style={styles.sectionTitle}>Loyalty Plans Created:</Text>

      {loyaltyPrograms.length > 0 ? (
        loyaltyPrograms.map((program, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              const { loyaltyCard, description, rewards, storeName, id } = program;

              // Remove non-serializable objects or replace them with serializable data
              const sanitizedLoyaltyCard = {
                cardName: loyaltyCard.cardName,
                color: loyaltyCard.color,
                id: loyaltyCard.id
              };

              // Create sanitized programData
              const programData = {
                loyaltyCard: sanitizedLoyaltyCard,
                description,
                rewards,
                storeName,
                id,
              };

              navigation.navigate('Edit Plan', { programData });
            }}
          >
            <Text style={styles.programName}>{program.loyaltyCard.cardName}</Text>
            <Text style={styles.programDescription}>{program.description}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noPrograms}>No loyalty programs created yet.</Text>
      )}

      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.signOutButton}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: '#666',
  },
  noPrograms: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  signOutButton: {
    backgroundColor: '#ff3333',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminScreenView;
