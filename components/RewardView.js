import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
import { auth } from '../firebase';
import { useIsFocused } from '@react-navigation/native'
import QRCode from 'react-native-qrcode-svg';
import { firebaseFetchUserProfileReward } from "../firebaseFunctions";


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
    const profileData = await firebaseFetchUserProfileReward(card);
    setUserProfile(profileData);
  };

  const handleClaimReward = (reward) => {

    const userUID = auth.currentUser?.uid;
    const rewardDetails = 'reward:' + JSON.stringify({ ...reward, userUID });
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

      {userProfile?.rewards && userProfile?.rewards.length === 0 && (
        <Text style={styles.text}>Looking empty! Start claiming rewards by collecting stamps today!</Text>
      )}

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
          <View style={styles.box}>
            <Text style={styles.qrModalHeading}>QR Code for Reward</Text>
            {/* Generate QR code for selectedReward.rewardId here */}
            <QRCode value={selectedReward} backgroundColor="white" size={200} />
            <TouchableOpacity style={styles.qrModalCloseButton} onPress={hideQRModal}>
              <Text style={styles.qrModalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
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
  box: {
    // flex: 1,
    padding: '10%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dd9eff',
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
  text: {
    flex: 1,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default RewardView;
