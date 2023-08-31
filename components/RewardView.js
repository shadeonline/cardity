import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import { firestore, auth } from '../firebase';
import { useIsFocused } from '@react-navigation/native'
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';



const RewardView = ({ card }) => {
  const isFocused = useIsFocused();
  const [userProfile, setUserProfile] = useState(null);

  const [selectedReward, setSelectedReward] = useState(null);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchUserProfile();
    }
  }, [isFocused]);

  const fetchUserProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const profileRef = doc(firestore, "profiles", user.uid);
        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();

          // Filter rewards based on the cardId
          const filteredRewards = profileData.rewards.filter(
            reward => reward.cardId == card.cardId
          );
          setUserProfile({ ...profileData, rewards: filteredRewards });
        }
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };


  const handleClaimReward = (reward) => {
    
    const userUID = auth.currentUser?.uid;
    const rewardDetails = 'reward:'+JSON.stringify({ ...reward, userUID });
    setSelectedReward(rewardDetails);
    setIsQRModalVisible(true);
  };

  const hideQRModal = () => {
    setIsQRModalVisible(false);
    fetchUserProfile();
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.heading}>Claimable Rewards</Text>
      {userProfile?.rewards.map((reward, index) => (
        <TouchableOpacity
          key={index}
          style={styles.rewardContainer}
          onPress={() => handleClaimReward(reward)}
        >
          <View style={styles.rewardContent}>
            <Text style={styles.rewardTitle}>{reward.reward}</Text>
          </View>
        </TouchableOpacity>
      ))}



      {/* QR Code Modal */}
      <Modal
        visible={isQRModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={hideQRModal}
      >
        <View style={styles.qrModalContainer}>
          <Text style={styles.qrModalHeading}>QR Code for Reward</Text>
          {/* Generate QR code for selectedReward.rewardId here */}
          {/* <Text style={styles.qrModalHeading}>{selectedReward}</Text> */}
          <QRCode value={selectedReward} size={200} />
          <TouchableOpacity style={styles.qrModalCloseButton} onPress={hideQRModal}>
            <Text style={styles.qrModalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  qrModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  qrModalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  qrModalCloseButton: {
    marginTop: 20,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    padding: 10,
    width: 100,
    alignItems: 'center',
  },
  qrModalCloseButtonText: {
    fontWeight: 'bold',
  },
};

export default RewardView;
