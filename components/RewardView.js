import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { auth } from '../firebase';
import { useIsFocused } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
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
    console.log(rewardDetails);
    setSelectedReward(rewardDetails);
    setIsQRModalVisible(true);
  };

  const hideQRModal = () => {
    setIsQRModalVisible(false);
    fetchUserProfile();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Claimable Rewards</Text>

      {userProfile?.rewards && userProfile?.rewards.length === 0 && (
        <Text style={styles.emptyText}>Start claiming rewards by collecting stamps today!</Text>
      )}
      <ScrollView>
      {userProfile?.rewards.map((reward, index) => (
        <TouchableOpacity
          key={index}
          style={styles.rewardCard}
          onPress={() => handleClaimReward(reward)}
        >
          <View style={styles.rewardContent}>
          <Feather name="gift" size={24} color="black" style={styles.rewardIcon} />
            <Text style={styles.rewardTitle}>{reward.reward}</Text>
          </View>
        </TouchableOpacity>
      ))}
      </ScrollView>
      {/* QR Code Modal */}
      <Modal
        visible={isQRModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={hideQRModal}
      >
        <View style={styles.qrModalContainer}>
          <View style={styles.qrModalBox}>
            <Text style={styles.qrModalHeading}>QR Code for Reward</Text>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  rewardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  rewardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  qrModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  qrModalBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  qrModalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  qrModalCloseButton: {
    marginTop: 20,
    backgroundColor: '#dd9eff',
    borderRadius: 8,
    padding: 12,
    width: 120,
    alignItems: 'center',
  },
  qrModalCloseButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
};

export default RewardView;
