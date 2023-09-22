import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal } from 'react-native';

const StampTaskModal = ({ selectedStamp, progress, onCloseModal, rewards, task }) => {
  const rewardText = rewards ? rewards[selectedStamp] : undefined;
  const completed = progress >= selectedStamp;

  return (
    <Modal visible={selectedStamp !== null} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {rewards === undefined ? (
            <Text style={styles.modalText}>Loading rewards...</Text>
          ) : (
            <>
              <Text style={styles.modalText}>
                {completed
                  ? 'Completed!'
                  : task}
              </Text>
              {rewardText && (
                <Text style={styles.modalText}>Reward: {rewardText}</Text>
              )}
            </>
          )}
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