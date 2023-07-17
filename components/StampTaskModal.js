import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal } from 'react-native';

const StampTaskModal = ({ selectedStamp, progress, onCloseModal, stampsPerRow }) => {

  // Logic to decide what text to display on the modal for each stamp
  const renderModalContent = () => {
    if (((selectedStamp + 1) % stampsPerRow === 0 && progress < selectedStamp)) {
      return (
        <Text style={styles.modalText}>Reward: 1 free drink</Text>
      );
    }

    if (progress <= selectedStamp) {
      return (
        <Text style={styles.modalText}>
          Visit the restaurant and eat a meal to fill up this stamp!
        </Text>
      );
    }
    if (((selectedStamp + 1) % stampsPerRow === 0 && progress > selectedStamp)) {
      return (
        <>
          <Text style={styles.modalText}>Completed!</Text>
          <Text style={styles.modalText}>Please claim your reward in the rewards tab.</Text>
        </>
      );
    }
    if (progress > selectedStamp) {
      return (
        <Text style={styles.modalText}>Completed!</Text>
      );
    }
  }


  return (
    <Modal visible={selectedStamp !== null} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderModalContent()}
          <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StampTaskModal