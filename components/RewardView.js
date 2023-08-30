import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, firestore, firebase } from '../firebase';
import { useIsFocused } from '@react-navigation/native'

const RewardView = ({ card }) => {

  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      console.log("Reward");
    }
  }, [isFocused]);


  const rewards = [
    {
      id: 1,
      title: 'Reward 1',
      description: 'Description of reward 1',
    },
    {
      id: 2,
      title: 'Reward 2',
      description: 'Description of reward 2',
    },
    {
      id: 3,
      title: 'Reward 3',
      description: 'Description of reward 3',
    },
  ];

  const handleClaimReward = (reward) => {
    // Logic to handle the reward claim
    console.log('Claimed reward:', reward);
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.heading}>Claimable Rewards</Text>
      {rewards.map((reward) => (
        <TouchableOpacity
          key={reward.id}
          style={styles.rewardContainer}
          onPress={() => handleClaimReward(reward)}
        >
          <View style={styles.rewardContent}>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = {
  tabContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  rewardContainer: {
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    marginBottom: 10,
  },
  rewardContent: {
    padding: 10,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rewardDescription: {
    fontSize: 16,
    marginTop: 5,
  },
};

export default RewardView;
